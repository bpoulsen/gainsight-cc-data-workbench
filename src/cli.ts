import { parseArgs } from "node:util";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  formatProdWriteBanner,
  loadResolvedProfile,
} from "./lib/config/profile.js";
import { getAuthenticatedClient, redactSecrets } from "./lib/auth.js";
import { createApiClient, isDebugEnabled } from "./lib/apiClient.js";
import { parseConcurrency } from "./lib/retry.js";
import { isWriteOperation, type CliFlags, type GainsightConfig } from "./lib/types.js";
import { getAdapter } from "./adapters/index.js";
import { parseShardBy } from "./lib/filterSharding.js";
import { exportResource, TOPIC_CAP_HINT } from "./commands/export.js";
import { exportSharded, formatShardedSummary } from "./commands/shardedExport.js";
import { formatJobSummary, runBulkJob } from "./commands/bulk.js";
import { runWizard, shouldLaunchWizard, WizardCancelled } from "./commands/wizard.js";
import { countCsvRows } from "./lib/csv.js";
import {
  confirmDestructiveOperation,
  operationRequiresTypedConfirmation,
} from "./lib/safety.js";
import {
  EXIT_ERROR,
  EXIT_SUCCESS,
  exitCodeForJob,
  exitCodeForShards,
  formatOperatorMessage,
  formatVerboseDetails,
  runWithInterrupt,
} from "./lib/errors.js";

const HELP = `Gainsight CC Workbench — terminal explorer and CSV bulk tool

Usage:
  pnpm gs [options]
  pnpm gainsight-workbench [options]

With no --resource / --op / --csv / --out, launches the interactive wizard.

Options:
  -p, --profile <sandbox|prod>  Named community profile (default: sandbox if both exist)
      --resource <name>         Resource family (users, questions, ideas, ...)
      --op <operation>          Named action (export, editTags, erase, ...)
      --csv <path>              Input CSV for bulk jobs
      --out <path>              Export CSV path
      --results <path>          Bulk results CSV path (default: {input}.results.csv)
      --dry-run                 Plan writes without calling the API
      --fail-fast               Stop a bulk job on the first row failure
      --concurrency <n>         Max parallel API requests (default 3, max 20)
      --utf8-bom                Prefix export CSV with a UTF-8 BOM (Excel)
      --skip-confirmation       Skip typed confirmation (DANGEROUS — automated scripts only)
      --shard-by <strategy>     Split a topic export: category | date | contentType
      --created-from <date>     Date shard start (YYYY-MM-DD); required with --shard-by date
      --created-to <date>       Date shard end (YYYY-MM-DD); required with --shard-by date
      --shard-separate          Write one CSV per shard instead of merging
      --auth-check              Acquire an OAuth token and report expiry (token is not printed)
      --verbose                 Print stack traces and redacted request/response bodies
  -h, --help                    Show this help
  -v, --version                 Show version

Copy .env.sandbox.example to .env.sandbox and fill in OAuth client credentials.
Trash / erase / permanent delete require typing the resource name or DELETE unless you pass --skip-confirmation.
Exit codes: 0 success, 1 error (or aborted), 2 partial success (some bulk rows failed).
`;

/** Parse argv into CLI flags. Does not load profiles or call the API. */
export function parseCliFlags(argv: string[]): CliFlags {
  const { values } = parseArgs({
    args: argv,
    options: {
      profile: { type: "string", short: "p" },
      resource: { type: "string" },
      op: { type: "string" },
      csv: { type: "string" },
      out: { type: "string" },
      results: { type: "string" },
      "dry-run": { type: "boolean", default: false },
      "fail-fast": { type: "boolean", default: false },
      concurrency: { type: "string" },
      "utf8-bom": { type: "boolean", default: false },
      "skip-confirmation": { type: "boolean", default: false },
      "shard-by": { type: "string" },
      "created-from": { type: "string" },
      "created-to": { type: "string" },
      "shard-separate": { type: "boolean", default: false },
      "auth-check": { type: "boolean", default: false },
      verbose: { type: "boolean", default: false },
      help: { type: "boolean", short: "h", default: false },
      version: { type: "boolean", short: "v", default: false },
    },
    allowPositionals: true,
    strict: true,
  });

  return {
    ...(values.profile !== undefined ? { profile: values.profile } : {}),
    ...(values.resource !== undefined ? { resource: values.resource } : {}),
    ...(values.op !== undefined ? { op: values.op } : {}),
    ...(values.csv !== undefined ? { csv: values.csv } : {}),
    ...(values.out !== undefined ? { out: values.out } : {}),
    ...(values.results !== undefined ? { results: values.results } : {}),
    dryRun: values["dry-run"] === true,
    failFast: values["fail-fast"] === true,
    authCheck: values["auth-check"] === true,
    help: values.help === true,
    version: values.version === true,
    concurrency: parseConcurrency(values.concurrency),
    utf8Bom: values["utf8-bom"] === true,
    skipConfirmation: values["skip-confirmation"] === true,
    verbose: values.verbose === true,
    shardSeparate: values["shard-separate"] === true,
    ...(values["shard-by"] !== undefined ? { shardBy: values["shard-by"] } : {}),
    ...(values["created-from"] !== undefined ? { createdFrom: values["created-from"] } : {}),
    ...(values["created-to"] !== undefined ? { createdTo: values["created-to"] } : {}),
  };
}

function packageVersion(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  const pkgPath = join(here, "..", "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as { version: string };
  return pkg.version;
}

/**
 * CLI entry: parse flags, load the profile, authenticate, then wizard / export / bulk.
 * Returns a process exit code (0 success, 1 error/abort, 2 partial success).
 */
export async function main(
  argv: string[] = process.argv.slice(2),
  cwd: string = process.cwd(),
  io: { log: (msg: string) => void; error: (msg: string) => void } = {
    log: console.log,
    error: console.error,
  },
): Promise<number> {
  let flags: CliFlags | undefined;
  let config: GainsightConfig | undefined;
  try {
    flags = parseCliFlags(argv);
    const parsed = flags;

    if (parsed.help) {
      io.log(HELP.trimEnd());
      return EXIT_SUCCESS;
    }

    if (parsed.version) {
      io.log(packageVersion());
      return EXIT_SUCCESS;
    }

    if (shouldLaunchWizard(parsed)) {
      return runWizard({ flags: parsed, cwd, io });
    }

    config = loadResolvedProfile(parsed.profile, cwd);
    const resolved = config;
    io.log(`Profile: ${resolved.profile}`);
    io.log(`API host: ${resolved.baseUrl}`);

    const verbose = parsed.verbose;
    const auth = getAuthenticatedClient(resolved);
    const api = createApiClient(auth, {
      concurrency: parsed.concurrency,
      isDebugEnabled: () => verbose || isDebugEnabled(),
    });
    await api.auth.tokenManager.getAccessToken();
    const cached = api.auth.tokenManager.getCachedToken();
    const secondsLeft = cached
      ? Math.max(0, Math.round((cached.expiresAt - Date.now()) / 1000))
      : 0;
    io.log(`Authenticated. Token expires in ~${secondsLeft}s.`);

    if (parsed.authCheck) {
      return EXIT_SUCCESS;
    }

    if (parsed.op === "export") {
      if (!parsed.resource) {
        io.error("--resource is required for export");
        return EXIT_ERROR;
      }
      if (!parsed.out) {
        io.error("--out is required for export");
        return EXIT_ERROR;
      }
      const adapter = getAdapter(parsed.resource, api);
      if (parsed.shardBy !== undefined) {
        io.log(`Exporting ${adapter.label} (sharded by ${parsed.shardBy}) → ${parsed.out}`);
        const shardOpts: Parameters<typeof exportSharded>[0] = {
          adapter,
          client: api,
          strategy: parseShardBy(parsed.shardBy),
          outPath: parsed.out,
          separateFiles: parsed.shardSeparate,
          onShard: (index, total, shard, outcome) => {
            const status =
              outcome.error !== undefined ? `FAILED ${outcome.error}` : `${outcome.rowCount} rows`;
            io.log(`  shard ${index}/${total} ${shard.id}: ${status}`);
          },
        };
        if (parsed.utf8Bom === true) {
          shardOpts.utf8Bom = true;
        }
        if (parsed.createdFrom !== undefined) {
          shardOpts.createdFrom = parsed.createdFrom;
        }
        if (parsed.createdTo !== undefined) {
          shardOpts.createdTo = parsed.createdTo;
        }
        const sharded = await runWithInterrupt((signal) => {
          shardOpts.signal = signal;
          return exportSharded(shardOpts);
        });
        io.log(formatShardedSummary(sharded));
        return exitCodeForShards(sharded.failed, sharded.shards.length);
      }
      const outPath = parsed.out;
      const utf8Bom = parsed.utf8Bom;
      io.log(`Exporting ${adapter.label} → ${outPath}`);
      const result = await runWithInterrupt((signal) =>
        exportResource(adapter, {
          outPath,
          signal,
          ...(utf8Bom === true ? { utf8Bom: true } : {}),
          onProgress: (rowCount, page) => {
            io.log(`  ${rowCount} rows (page ${page})`);
          },
        }),
      );
      io.log(`Wrote ${result.rowCount} rows (${result.pageCount} pages) to ${result.outPath}`);
      if (result.hitCap) {
        io.error(TOPIC_CAP_HINT);
        io.error("Re-run with --shard-by=category|date|contentType (contentType is topics only).");
      }
      return EXIT_SUCCESS;
    }

    if (parsed.op === "explore") {
      io.error("Explore is interactive. Run `pnpm gs` without --op to open the wizard, or use --op export.");
      return EXIT_ERROR;
    }

    if (parsed.op) {
      if (!parsed.resource) {
        io.error("--resource is required for bulk jobs");
        return EXIT_ERROR;
      }
      if (!parsed.csv) {
        io.error("--csv is required for bulk jobs");
        return EXIT_ERROR;
      }
      const adapter = getAdapter(parsed.resource, api);
      const spec = adapter.operations().find((item) => item.name === parsed.op);
      const csvPath = parsed.csv;
      const operation = parsed.op;
      const dryRun = parsed.dryRun;
      const rowCount = await countCsvRows(csvPath);
      const unknown = new Set<string>();
      const secrets = [resolved.clientId, resolved.clientSecret];

      if (resolved.profile === "prod" && isWriteOperation(operation)) {
        io.log(
          formatProdWriteBanner({
            resource: adapter.name,
            operation,
            rowCount,
            timestamp: new Date().toISOString(),
          }),
        );
      }

      if (operationRequiresTypedConfirmation(spec) && !dryRun) {
        const confirmed = await confirmDestructiveOperation({
          operation,
          resource: adapter.name,
          rowCount,
          skipConfirmation: parsed.skipConfirmation,
          log: io.log,
        });
        if (!confirmed) {
          io.error("Operation cancelled by operator");
          return EXIT_ERROR;
        }
      }

      io.log(
        `${dryRun ? "Dry-run" : "Running"} ${adapter.name}/${operation} from ${csvPath}`,
      );
      const summary = await runWithInterrupt((signal) =>
        runBulkJob({
          csvPath,
          operation,
          adapter,
          client: api,
          profile: resolved.profile,
          dryRun,
          failFast: parsed.failFast,
          concurrency: parsed.concurrency,
          cwd,
          signal,
          ...(parsed.results !== undefined ? { resultsPath: parsed.results } : {}),
          ...(parsed.utf8Bom === true ? { utf8Bom: true } : {}),
          onProgress: (progress) => {
            io.log(
              `  ${progress.processed}/${progress.total} (ok ${progress.success}, fail ${progress.failed}, skip ${progress.skipped}, planned ${progress.planned})`,
            );
          },
          onPlan: (plan, line) => {
            if (!dryRun) {
              return;
            }
            const body = plan.body !== undefined ? ` ${JSON.stringify(plan.body)}` : "";
            io.log(`  line ${line} ${redactSecrets(`${plan.method} ${plan.path}${body}`, secrets)}`);
          },
          onUnknownColumn: (header) => unknown.add(header),
        }),
      );
      if (unknown.size > 0) {
        io.log(`Ignoring unknown CSV columns: ${[...unknown].join(", ")}`);
      }
      io.log(formatJobSummary(summary));
      if (summary.failed > 0) {
        io.error(`Finished with ${summary.failed} failed row(s). See ${summary.resultsPath}`);
      }
      return exitCodeForJob(summary);
    }

    io.error("Specify --resource and --op, or run without those flags to open the wizard.");
    return EXIT_ERROR;
  } catch (error) {
    if (error instanceof WizardCancelled) {
      return EXIT_SUCCESS;
    }
    const profile = config?.profile ?? flags?.profile ?? "sandbox";
    io.error(formatOperatorMessage(error, { profile }));
    if (flags?.verbose === true) {
      const secrets = config !== undefined ? [config.clientId, config.clientSecret] : [];
      const details = formatVerboseDetails(error, secrets);
      if (details !== undefined) {
        io.error(details);
      }
    }
    return EXIT_ERROR;
  }
}
