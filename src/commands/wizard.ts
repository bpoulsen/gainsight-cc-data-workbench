/**
 * Interactive workbench wizard: profile → resource → explore / export / bulk.
 *
 * Flagged invocations (--resource, --op, --csv, --out) skip this and go through
 * src/cli.ts dispatch instead.
 */
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { getAdapter, registeredAdapters } from "../adapters/index.js";
import type { IResourceAdapter, ResourceName } from "../adapters/base.js";
import { TOPIC_CAP_HINT } from "../adapters/content.js";
import { formatJobSummary, runBulkJob } from "./bulk.js";
import { exportResource } from "./export.js";
import { getAuthenticatedClient, redactSecrets } from "../lib/auth.js";
import type { QueryParams } from "../lib/auth.js";
import { createApiClient, type ApiClient } from "../lib/apiClient.js";
import {
  availableProfiles,
  formatProdWriteBanner,
  loadProfile,
  resolveProfile,
} from "../lib/config/profile.js";
import { countCsvRows, peekCsvHeaders } from "../lib/csv.js";
import {
  confirmDestructiveOperation,
  isTypedConfirmation,
  operationRequiresTypedConfirmation,
} from "../lib/safety.js";
import type { CliFlags, GainsightConfig, ProfileName } from "../lib/types.js";
import {
  applyParsedFilter,
  defaultExportPath,
  EXPLORE_PAGE_SIZE,
  formatPreviewTable,
  missingRequiredColumns,
  parseFilterInput,
  previewColumns,
  shouldLaunchWizard,
  WizardCancelled,
  WizardError,
  type WizardMode,
} from "../wizard/helpers.js";
import { createClackUi, type WizardUi } from "../wizard/ui.js";

export interface WizardIo {
  log: (msg: string) => void;
  error: (msg: string) => void;
}

export interface AuthenticatedSession {
  client: ApiClient;
  secondsLeft: number;
}

export interface RunWizardOptions {
  flags: CliFlags;
  cwd: string;
  io: WizardIo;
  ui?: WizardUi;
  authenticate?: (config: GainsightConfig, concurrency: number) => Promise<AuthenticatedSession>;
  getAdapter?: (resource: string, client: ApiClient) => IResourceAdapter;
  listResources?: () => ResourceName[];
  exportResource?: typeof exportResource;
  runBulkJob?: typeof runBulkJob;
}

export async function runWizard(options: RunWizardOptions): Promise<number> {
  const ui = options.ui ?? createClackUi();
  try {
    return await runWizardInner(options, ui);
  } catch (error) {
    if (error instanceof WizardCancelled) {
      return 0;
    }
    throw error;
  }
}

async function runWizardInner(options: RunWizardOptions, ui: WizardUi): Promise<number> {
  ui.intro("Gainsight CC Workbench");

  const profile = await selectProfile(options, ui);
  const config = loadProfile(profile, options.cwd);
  ui.info(`Profile: ${config.profile}`);
  ui.info(`API host: ${config.baseUrl}`);

  const authenticate = options.authenticate ?? defaultAuthenticate;
  const session = await authenticate(config, options.flags.concurrency);
  ui.success(`Authenticated. Token expires in ~${session.secondsLeft}s.`);

  const listResources = options.listResources ?? registeredAdapters;
  const resolveAdapter = options.getAdapter ?? getAdapter;
  const names = listResources();
  if (names.length === 0) {
    throw new WizardError("No resource adapters are registered.");
  }

  const resourceName = await ui.select<ResourceName>({
    message: "Which resource?",
    options: names.map((name) => {
      const adapter = resolveAdapter(name, session.client);
      const option: { value: ResourceName; label: string; hint?: string } = {
        value: name,
        label: adapter.label,
      };
      if (name !== adapter.label.toLowerCase()) {
        option.hint = name;
      }
      return option;
    }),
  });
  const adapter = resolveAdapter(resourceName, session.client);

  const mode = await ui.select<WizardMode>({
    message: "What do you want to do?",
    options: [
      { value: "explore", label: "Explore", hint: "preview data in the terminal" },
      { value: "export", label: "Export", hint: "save matching rows to CSV" },
      { value: "bulk", label: "Bulk", hint: "create / update / delete from CSV" },
    ],
  });

  if (mode === "explore") {
    return exploreMode(options, ui, adapter);
  }
  if (mode === "export") {
    return exportMode(options, ui, adapter);
  }
  return bulkMode(options, ui, adapter, config, session.client);
}

async function selectProfile(options: RunWizardOptions, ui: WizardUi): Promise<ProfileName> {
  if (options.flags.profile !== undefined) {
    return resolveProfile(options.flags.profile, options.cwd);
  }
  const profiles = availableProfiles(options.cwd);
  if (profiles.length === 0) {
    throw new WizardError(
      "No profile configured. Copy .env.sandbox.example to .env.sandbox (and optionally .env.prod.example to .env.prod).",
    );
  }
  if (profiles.length === 1) {
    const only = profiles[0];
    if (only === undefined) {
      throw new WizardError("No profile configured.");
    }
    ui.info(`Using profile ${only}`);
    return only;
  }
  return ui.select<ProfileName>({
    message: "Which community profile?",
    options: profiles.map((name) => ({
      value: name,
      label: name,
      hint: name === "prod" ? "live community" : "safe default",
    })),
    initialValue: "sandbox",
  });
}

async function collectFilters(adapter: IResourceAdapter, ui: WizardUi): Promise<QueryParams> {
  const filters: QueryParams = {};
  for (const prompt of adapter.describeFilters()) {
    const suffix = prompt.description ? ` — ${prompt.description}` : "";
    const message = `${prompt.label}${suffix}`;
    let raw = "";
    if (prompt.choices && prompt.choices.length > 0) {
      const options: Array<{ value: string; label: string }> = prompt.required
        ? []
        : [{ value: "", label: "Skip (unfiltered)" }];
      for (const choice of prompt.choices) {
        options.push({ value: choice.value, label: choice.label });
      }
      raw = await ui.select({ message, options });
    } else {
      const textOpts: Parameters<WizardUi["text"]>[0] = { message };
      if (!prompt.required) {
        textOpts.placeholder = "Leave empty to skip";
      }
      raw = await ui.text(textOpts);
    }
    applyParsedFilter(filters, prompt.name, parseFilterInput(raw, prompt));
  }
  return filters;
}

async function exploreMode(
  options: RunWizardOptions,
  ui: WizardUi,
  adapter: IResourceAdapter,
): Promise<number> {
  const filters = await collectFilters(adapter, ui);
  const columns = previewColumns(adapter.exportColumnNames());
  let page = 1;
  let previewed = 0;
  let hitCap = false;

  while (true) {
    const spin = ui.spinner();
    spin.start(`Fetching ${adapter.label} (page ${page})…`);
    let result;
    try {
      result = await withInterrupt((signal) =>
        adapter.list(filters, { page, pageSize: EXPLORE_PAGE_SIZE, signal }),
      );
    } finally {
      spin.stop();
    }

    if (result.hitCap === true) {
      hitCap = true;
    }
    previewed += result.records.length;

    if (result.records.length === 0) {
      ui.warn(page === 1 ? "No records match these filters." : "No more records.");
    } else {
      const rows = result.records.map((record) => adapter.flattenRecord(record));
      ui.note(formatPreviewTable(rows, columns), `${adapter.label} · page ${page}`);
      ui.info(`${result.records.length} row(s) this page · ${previewed} previewed so far`);
    }

    if (hitCap) {
      ui.warn(TOPIC_CAP_HINT);
      break;
    }
    if (result.exhausted || result.records.length === 0) {
      break;
    }

    const next = await ui.confirm({
      message: "Show next page?",
      initialValue: true,
    });
    if (!next) {
      break;
    }
    page += 1;
  }

  const save = await ui.confirm({
    message: "Export all matching rows to CSV? (full query, not just previewed pages)",
    initialValue: false,
  });
  if (save) {
    const code = await runExport(options, ui, adapter, filters);
    if (code !== 0) {
      return code;
    }
  }

  ui.outro(`Previewed ${previewed} ${adapter.label} row(s).`);
  return 0;
}

async function exportMode(
  options: RunWizardOptions,
  ui: WizardUi,
  adapter: IResourceAdapter,
): Promise<number> {
  const filters = await collectFilters(adapter, ui);
  const code = await runExport(options, ui, adapter, filters);
  if (code !== 0) {
    return code;
  }
  ui.outro("Export complete.");
  return 0;
}

async function runExport(
  options: RunWizardOptions,
  ui: WizardUi,
  adapter: IResourceAdapter,
  filters: QueryParams,
): Promise<number> {
  const suggested = defaultExportPath(adapter.name);
  const rawPath = await ui.text({
    message: "Output CSV path",
    placeholder: suggested,
    defaultValue: suggested,
    initialValue: suggested,
  });
  const trimmed = rawPath.trim();
  const outPath = resolve(options.cwd, trimmed.length > 0 ? trimmed : suggested);
  const exporter = options.exportResource ?? exportResource;
  const spin = ui.spinner();
  spin.start(`Exporting ${adapter.label}…`);
  try {
    const result = await withInterrupt((signal) => {
      const exportOpts: Parameters<typeof exportResource>[1] = {
        outPath,
        filters,
        signal,
        onProgress: (rowCount, pageNum) => {
          spin.message(`Exporting ${adapter.label}… ${rowCount} rows (page ${pageNum})`);
        },
      };
      if (options.flags.utf8Bom === true) {
        exportOpts.utf8Bom = true;
      }
      return exporter(adapter, exportOpts);
    });
    spin.stop(`Wrote ${result.rowCount} rows to ${result.outPath}`);
    ui.success(`Exported ${result.rowCount} rows (${result.pageCount} pages) to ${result.outPath}`);
    if (result.hitCap) {
      ui.warn(TOPIC_CAP_HINT);
    }
    return 0;
  } catch (error) {
    spin.stop("Export failed");
    throw error;
  }
}

async function bulkMode(
  options: RunWizardOptions,
  ui: WizardUi,
  adapter: IResourceAdapter,
  config: GainsightConfig,
  client: ApiClient,
): Promise<number> {
  const operations = adapter.operations();
  if (operations.length === 0) {
    throw new WizardError(
      `${adapter.label} has no bulk operations (explore/export only).`,
    );
  }

  const operationName = await ui.select<string>({
    message: "Which operation?",
    options: operations.map((operation) => {
      const option: { value: string; label: string; hint?: string } = {
        value: operation.name,
        label: operation.label,
      };
      const hintParts = [operation.name];
      if (operation.confirmation === "typed") {
        hintParts.push("requires typed confirm");
      }
      if (operation.nativeBulk === true) {
        hintParts.push("native bulk");
      }
      option.hint = hintParts.join(" · ");
      return option;
    }),
  });
  const spec = operations.find((operation) => operation.name === operationName);
  if (!spec) {
    throw new WizardError(`Unknown operation "${operationName}"`);
  }

  const rawCsv = await ui.text({
    message: "Input CSV path",
    placeholder: "users.csv",
  });
  const csvPath = resolve(options.cwd, rawCsv.trim());
  if (!existsSync(csvPath)) {
    throw new WizardError(`CSV not found: ${csvPath}`);
  }

  const headers = await peekCsvHeaders(csvPath);
  const missing = missingRequiredColumns(headers, spec, adapter.identity);
  if (missing.length > 0) {
    throw new WizardError(
      `CSV is missing required columns for ${adapter.name}/${spec.name}: ${missing.join(", ")}`,
    );
  }

  const dryRun = await ui.confirm({
    message: "Dry-run? (plan writes, no API mutations)",
    initialValue: true,
  });

  const rowCount = await countCsvRows(csvPath);
  if (config.profile === "prod") {
    ui.error(
      formatProdWriteBanner({
        resource: adapter.name,
        operation: spec.name,
        rowCount,
        timestamp: new Date().toISOString(),
      }),
    );
    ui.warn(
      `${config.profile} · ${adapter.name}/${spec.name} · ${rowCount} row(s)${dryRun ? " · dry-run" : ""}`,
    );
  }

  if (operationRequiresTypedConfirmation(spec) && !dryRun) {
    const confirmed = await confirmDestructiveOperation({
      operation: spec.name,
      resource: adapter.name,
      rowCount,
      skipConfirmation: options.flags.skipConfirmation,
      log: ui.warn,
      prompt: async (question) =>
        ui.text({
          message: question.trim(),
          validate: (value) =>
            isTypedConfirmation(value, adapter.name)
              ? undefined
              : `Type "${adapter.name}" or DELETE`,
        }),
    });
    if (!confirmed) {
      throw new WizardError("Operation cancelled by operator");
    }
  }

  const runner = options.runBulkJob ?? runBulkJob;
  const unknown = new Set<string>();
  const secrets = [config.clientId, config.clientSecret];
  const spin = ui.spinner();
  spin.start(
    `${dryRun ? "Planning" : "Running"} ${adapter.name}/${spec.name} (${rowCount} rows)…`,
  );

  try {
    const summary = await withInterrupt((signal) => {
      const job: Parameters<typeof runBulkJob>[0] = {
        csvPath,
        operation: spec.name,
        adapter,
        client,
        profile: config.profile,
        dryRun,
        failFast: options.flags.failFast,
        concurrency: options.flags.concurrency,
        cwd: options.cwd,
        signal,
        onProgress: (progress) => {
          spin.message(
            `${progress.processed}/${progress.total} (ok ${progress.success}, fail ${progress.failed}, skip ${progress.skipped}, planned ${progress.planned})`,
          );
        },
        onUnknownColumn: (header) => unknown.add(header),
      };
      if (options.flags.results !== undefined) {
        job.resultsPath = options.flags.results;
      }
      if (options.flags.utf8Bom === true) {
        job.utf8Bom = true;
      }
      if (dryRun) {
        job.onPlan = (plan, line) => {
          const body = plan.body !== undefined ? ` ${JSON.stringify(plan.body)}` : "";
          ui.info(`  line ${line} ${redactSecrets(`${plan.method} ${plan.path}${body}`, secrets)}`);
        };
      }
      return runner(job);
    });
    spin.stop("Bulk job finished");
    if (unknown.size > 0) {
      ui.warn(`Ignoring unknown CSV columns: ${[...unknown].join(", ")}`);
    }
    ui.info(formatJobSummary(summary));
    ui.outro(
      summary.failed > 0
        ? `Finished with ${summary.failed} failed row(s). See ${summary.resultsPath}`
        : `Results: ${summary.resultsPath}`,
    );
    return summary.failed > 0 ? 1 : 0;
  } catch (error) {
    spin.stop("Bulk job failed");
    throw error;
  }
}

async function defaultAuthenticate(
  config: GainsightConfig,
  concurrency: number,
): Promise<AuthenticatedSession> {
  const auth = getAuthenticatedClient(config);
  const api = createApiClient(auth, { concurrency });
  await api.auth.tokenManager.getAccessToken();
  const cached = api.auth.tokenManager.getCachedToken();
  const secondsLeft = cached
    ? Math.max(0, Math.round((cached.expiresAt - Date.now()) / 1000))
    : 0;
  return { client: api, secondsLeft };
}

async function withInterrupt<T>(fn: (signal: AbortSignal) => Promise<T>): Promise<T> {
  const controller = new AbortController();
  const onInterrupt = (): void => {
    controller.abort();
  };
  process.on("SIGINT", onInterrupt);
  try {
    return await fn(controller.signal);
  } finally {
    process.off("SIGINT", onInterrupt);
  }
}

export { shouldLaunchWizard, WizardCancelled, WizardError };
