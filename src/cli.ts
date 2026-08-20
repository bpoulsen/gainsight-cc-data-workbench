import { parseArgs } from "node:util";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  formatProdWriteBanner,
  loadResolvedProfile,
  ProfileError,
} from "./lib/config/profile.js";
import { AuthError, getAuthenticatedClient } from "./lib/auth.js";
import { createApiClient } from "./lib/apiClient.js";
import { parseConcurrency } from "./lib/retry.js";
import { isWriteOperation, type CliFlags } from "./lib/types.js";
import { getAdapter } from "./adapters/index.js";
import { AdapterError } from "./adapters/base.js";
import { FilterShardError, parseShardBy } from "./lib/filterSharding.js";
import { exportResource, TOPIC_CAP_HINT } from "./commands/export.js";
import { exportSharded, formatShardedSummary } from "./commands/shardedExport.js";
import { formatJobSummary, runBulkJob } from "./commands/bulk.js";
import { runWizard, shouldLaunchWizard, WizardCancelled } from "./commands/wizard.js";
import { redactSecrets } from "./lib/auth.js";
import { countCsvRows } from "./lib/csv.js";
import {
  confirmDestructiveOperation,
  operationRequiresTypedConfirmation,
} from "./lib/safety.js";

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
  -h, --help                    Show this help
  -v, --version                 Show version

Copy .env.sandbox.example to .env.sandbox and fill in OAuth client credentials.
Trash / erase / permanent delete require typing the resource name or DELETE unless you pass --skip-confirmation.
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
 * Returns a process exit code (0 success, 1 failure).
 */
export async function main(
  argv: string[] = process.argv.slice(2),
  cwd: string = process.cwd(),
  io: { log: (msg: string) => void; error: (msg: string) => void } = {
    log: console.log,
    error: console.error,
  },
): Promise<number> {
  try {
    const flags = parseCliFlags(argv);

    if (flags.help) {
      io.log(HELP.trimEnd());
      return 0;
    }

    if (flags.version) {
      io.log(packageVersion());
      return 0;
    }

    if (shouldLaunchWizard(flags)) {
      return runWizard({ flags, cwd, io });
    }

    const config = loadResolvedProfile(flags.profile, cwd);
    io.log(`Profile: ${config.profile}`);
    io.log(`API host: ${config.baseUrl}`);

    const auth = getAuthenticatedClient(config);
    const api = createApiClient(auth, { concurrency: flags.concurrency });
    await api.auth.tokenManager.getAccessToken();
    const cached = api.auth.tokenManager.getCachedToken();
    const secondsLeft = cached
      ? Math.max(0, Math.round((cached.expiresAt - Date.now()) / 1000))
      : 0;
    io.log(`Authenticated. Token expires in ~${secondsLeft}s.`);

    if (flags.authCheck) {
      return 0;
    }

    if (flags.op === "export") {
      if (!flags.resource) {
        io.error("--resource is required for export");
        return 1;
      }
      if (!flags.out) {
        io.error("--out is required for export");
        return 1;
      }
      const adapter = getAdapter(flags.resource, api);
      if (flags.shardBy !== undefined) {
        io.log(`Exporting ${adapter.label} (sharded by ${flags.shardBy}) → ${flags.out}`);
        const shardOpts: Parameters<typeof exportSharded>[0] = {
          adapter,
          client: api,
          strategy: parseShardBy(flags.shardBy),
          outPath: flags.out,
          separateFiles: flags.shardSeparate,
          onShard: (index, total, shard, outcome) => {
            const status =
              outcome.error !== undefined ? `FAILED ${outcome.error}` : `${outcome.rowCount} rows`;
            io.log(`  shard ${index}/${total} ${shard.id}: ${status}`);
          },
        };
        if (flags.utf8Bom === true) {
          shardOpts.utf8Bom = true;
        }
        if (flags.createdFrom !== undefined) {
          shardOpts.createdFrom = flags.createdFrom;
        }
        if (flags.createdTo !== undefined) {
          shardOpts.createdTo = flags.createdTo;
        }
        const sharded = await exportSharded(shardOpts);
        io.log(formatShardedSummary(sharded));
        return sharded.failed > 0 ? 1 : 0;
      }
      io.log(`Exporting ${adapter.label} → ${flags.out}`);
      const result = await exportResource(adapter, {
        outPath: flags.out,
        ...(flags.utf8Bom === true ? { utf8Bom: true } : {}),
        onProgress: (rowCount, page) => {
          io.log(`  ${rowCount} rows (page ${page})`);
        },
      });
      io.log(`Wrote ${result.rowCount} rows (${result.pageCount} pages) to ${result.outPath}`);
      if (result.hitCap) {
        io.error(TOPIC_CAP_HINT);
        io.error("Re-run with --shard-by=category|date|contentType (contentType is topics only).");
      }
      return 0;
    }

    if (flags.op === "explore") {
      io.error("Explore is interactive. Run `pnpm gs` without --op to open the wizard, or use --op export.");
      return 1;
    }

    if (flags.op) {
      if (!flags.resource) {
        io.error("--resource is required for bulk jobs");
        return 1;
      }
      if (!flags.csv) {
        io.error("--csv is required for bulk jobs");
        return 1;
      }
      const adapter = getAdapter(flags.resource, api);
      const spec = adapter.operations().find((item) => item.name === flags.op);
      const rowCount = await countCsvRows(flags.csv);
      const unknown = new Set<string>();
      const secrets = [config.clientId, config.clientSecret];

      if (config.profile === "prod" && isWriteOperation(flags.op)) {
        io.log(
          formatProdWriteBanner({
            resource: adapter.name,
            operation: flags.op,
            rowCount,
            timestamp: new Date().toISOString(),
          }),
        );
      }

      if (operationRequiresTypedConfirmation(spec) && !flags.dryRun) {
        const confirmed = await confirmDestructiveOperation({
          operation: flags.op,
          resource: adapter.name,
          rowCount,
          skipConfirmation: flags.skipConfirmation,
          log: io.log,
        });
        if (!confirmed) {
          io.error("Operation cancelled by operator");
          return 1;
        }
      }

      io.log(
        `${flags.dryRun ? "Dry-run" : "Running"} ${adapter.name}/${flags.op} from ${flags.csv}`,
      );
      const summary = await runBulkJob({
        csvPath: flags.csv,
        operation: flags.op,
        adapter,
        client: api,
        profile: config.profile,
        dryRun: flags.dryRun,
        failFast: flags.failFast,
        concurrency: flags.concurrency,
        cwd,
        ...(flags.results !== undefined ? { resultsPath: flags.results } : {}),
        ...(flags.utf8Bom === true ? { utf8Bom: true } : {}),
        onProgress: (progress) => {
          io.log(
            `  ${progress.processed}/${progress.total} (ok ${progress.success}, fail ${progress.failed}, skip ${progress.skipped}, planned ${progress.planned})`,
          );
        },
        onPlan: (plan, line) => {
          if (!flags.dryRun) {
            return;
          }
          const body = plan.body !== undefined ? ` ${JSON.stringify(plan.body)}` : "";
          io.log(`  line ${line} ${redactSecrets(`${plan.method} ${plan.path}${body}`, secrets)}`);
        },
        onUnknownColumn: (header) => unknown.add(header),
      });
      if (unknown.size > 0) {
        io.log(`Ignoring unknown CSV columns: ${[...unknown].join(", ")}`);
      }
      io.log(formatJobSummary(summary));
      return summary.failed > 0 ? 1 : 0;
    }

    io.error("Specify --resource and --op, or run without those flags to open the wizard.");
    return 1;
  } catch (error) {
    if (error instanceof WizardCancelled) {
      return 0;
    }
    const message =
      error instanceof ProfileError ||
      error instanceof AuthError ||
      error instanceof AdapterError ||
      error instanceof FilterShardError ||
      error instanceof Error
        ? error.message
        : String(error);
    io.error(message);
    return 1;
  }
}
