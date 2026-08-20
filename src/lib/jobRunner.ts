/**
 * Bulk job runner: stream a CSV, resolve identity, plan or execute one named
 * operation per row, and write a results CSV.
 *
 * Deletes/erase/permanent delete are never auto-retried (RetryPolicy + plan.retryable).
 */
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import type { ApiClient } from "./apiClient.js";
import { ApiError, RateLimitError } from "./api/errors.js";
import {
  AdapterError,
  type ApiCallPlan,
  type IResourceAdapter,
  type ResourceOperation,
} from "../adapters/base.js";
import { redactSecrets } from "./auth.js";
import {
  CsvReader,
  CsvWriter,
  RESULTS_CSV_COLUMNS,
  type MappedCsvRow,
} from "./csv.js";
import {
  IdentityError,
  UserIdentityResolver,
  identityResultsFields,
} from "./identityResolver.js";
import {
  createConcurrencyLimiter,
  DEFAULT_CONCURRENCY,
  toResultsFields,
} from "./retry.js";
import type { ProfileName } from "./types.js";

export type JobRowStatus = "success" | "failed" | "skipped" | "planned";

export interface BulkJobOptions {
  csvPath: string;
  resultsPath?: string;
  operation: string;
  adapter: IResourceAdapter;
  client: ApiClient;
  profile: ProfileName;
  dryRun?: boolean;
  failFast?: boolean;
  concurrency?: number;
  utf8Bom?: boolean;
  now?: () => Date;
  onProgress?: (progress: BulkProgress) => void;
  onPlan?: (plan: ApiCallPlan, line: number) => void;
  onUnknownColumn?: (header: string) => void;
  signal?: AbortSignal;
  identity?: UserIdentityResolver;
}

export interface BulkProgress {
  processed: number;
  total: number;
  success: number;
  failed: number;
  skipped: number;
  planned: number;
}

export interface BulkJobSummary {
  total: number;
  success: number;
  failed: number;
  skipped: number;
  planned: number;
  durationMs: number;
  resultsPath: string;
  operation: string;
  resource: string;
  profile: ProfileName;
  dryRun: boolean;
  sawRateLimit: boolean;
}

export class JobRunnerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JobRunnerError";
  }
}

export function defaultResultsPath(csvPath: string): string {
  return csvPath.replace(/\.csv$/i, "") + ".results.csv";
}

export function formatJobSummary(summary: BulkJobSummary): string {
  const outcome = summary.dryRun
    ? `${summary.planned} planned`
    : `${summary.success} success, ${summary.failed} failed, ${summary.skipped} skipped`;
  const lines = [
    `Bulk ${summary.resource}/${summary.operation} (${summary.profile}): ${summary.total} rows, ${outcome}, ${summary.durationMs}ms`,
    `Results: ${summary.resultsPath}`,
  ];
  if (summary.sawRateLimit) {
    lines.push("HTTP 429 encountered. Retry failed rows manually and consider --concurrency 1.");
  }
  return lines.join("\n");
}

function needsIdentity(adapter: IResourceAdapter, spec: ResourceOperation): boolean {
  if (adapter.identity === "id-or-email") {
    return spec.kind !== "create" || spec.name === "createReply";
  }
  return spec.kind !== "create" || spec.name === "createReply";
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

function secretsOf(client: ApiClient): string[] {
  return [client.auth.config.clientId, client.auth.config.clientSecret].filter(Boolean);
}

export class BulkJobRunner {
  async run(options: BulkJobOptions): Promise<BulkJobSummary> {
    const started = Date.now();
    const dryRun = options.dryRun === true;
    const failFast = options.failFast === true;
    const concurrency = options.concurrency ?? DEFAULT_CONCURRENCY;
    const now = options.now ?? (() => new Date());
    const resultsPath = options.resultsPath ?? defaultResultsPath(options.csvPath);
    const spec = options.adapter.operations().find((item) => item.name === options.operation);
    if (!spec) {
      const available = options.adapter
        .operations()
        .map((item) => item.name)
        .join(", ");
      throw new AdapterError(
        `Unknown operation "${options.operation}" for ${options.adapter.name}. Expected one of: ${available || "(none)"}`,
      );
    }

    const unknown = new Set<string>();
    const knownFields = [
      "id",
      "userid",
      "email",
      "replyId",
      ...spec.requiredColumns,
      ...(spec.optionalColumns ?? []),
    ];
    const rows: MappedCsvRow[] = [];
    const reader = CsvReader.fromFile(options.csvPath, {
      mapping: {
        knownFields,
        onUnknown: (header) => {
          unknown.add(header);
          options.onUnknownColumn?.(header);
        },
      },
    });
    for await (const row of reader) {
      rows.push(row);
    }

    const identity = options.identity ?? new UserIdentityResolver(options.client);
    if (options.adapter.identity === "id-or-email" && needsIdentity(options.adapter, spec)) {
      await identity.prefetch(rows.map((row) => row.values));
    }

    const failFastController = new AbortController();
    const signal = options.signal
      ? AbortSignal.any([options.signal, failFastController.signal])
      : failFastController.signal;
    const limit = createConcurrencyLimiter(concurrency);
    const results: Array<Record<string, unknown>> = new Array(rows.length);
    const counts = { success: 0, failed: 0, skipped: 0, planned: 0, sawRateLimit: false };

    const emitProgress = (processed: number): void => {
      options.onProgress?.({
        processed,
        total: rows.length,
        success: counts.success,
        failed: counts.failed,
        skipped: counts.skipped,
        planned: counts.planned,
      });
    };

    let processed = 0;
    await Promise.all(
      rows.map((row, index) =>
        limit(async () => {
          const record = await this.processRow({
            row,
            spec,
            options,
            identity,
            dryRun,
            now,
            signal,
            secrets: secretsOf(options.client),
          });
          if (record.status === "failed") {
            counts.failed += 1;
            if (record.http_status === 429) {
              counts.sawRateLimit = true;
            }
            if (failFast && !failFastController.signal.aborted) {
              failFastController.abort();
            }
          } else if (record.status === "planned") {
            counts.planned += 1;
          } else if (record.status === "skipped") {
            counts.skipped += 1;
          } else {
            counts.success += 1;
          }
          results[index] = record;
          processed += 1;
          emitProgress(processed);
        }),
      ),
    );

    mkdirSync(dirname(resultsPath), { recursive: true });
    const columns = [...reader.headers, ...RESULTS_CSV_COLUMNS];
    const writer = CsvWriter.fromFile(resultsPath, {
      columns,
      ...(options.utf8Bom === true ? { utf8Bom: true } : {}),
    });
    try {
      for (const record of results) {
        if (record) {
          await writer.writeRow(record);
        }
      }
    } finally {
      await writer.end();
    }

    return {
      total: rows.length,
      success: counts.success,
      failed: counts.failed,
      skipped: counts.skipped,
      planned: counts.planned,
      durationMs: Date.now() - started,
      resultsPath,
      operation: options.operation,
      resource: options.adapter.name,
      profile: options.profile,
      dryRun,
      sawRateLimit: counts.sawRateLimit,
    };
  }

  private async processRow(input: {
    row: MappedCsvRow;
    spec: ResourceOperation;
    options: BulkJobOptions;
    identity: UserIdentityResolver;
    dryRun: boolean;
    now: () => Date;
    signal: AbortSignal;
    secrets: string[];
  }): Promise<Record<string, unknown>> {
    const timestamp = input.now().toISOString();
    const base: Record<string, unknown> = {
      ...input.row.raw,
      status: "failed",
      http_status: "",
      error: "",
      resolved_id: "",
      operation: input.options.operation,
      profile: input.options.profile,
      timestamp,
    };

    if (input.signal.aborted) {
      return {
        ...base,
        status: "skipped",
        error: "not run (fail-fast)",
      };
    }

    try {
      const context: { resolvedId?: number } = {};
      if (needsIdentity(input.options.adapter, input.spec)) {
        if (input.options.adapter.identity === "id-or-email") {
          const resolvedId = await input.identity.resolveUserId(input.row.values);
          context.resolvedId = resolvedId;
          base.resolved_id = String(resolvedId);
        }
      }

      const plan = input.options.adapter.fromCsvRow(
        input.row.values,
        input.options.operation,
        context.resolvedId !== undefined ? context : undefined,
      );
      if (plan.resolvedId !== undefined) {
        base.resolved_id = String(plan.resolvedId);
      }
      input.options.onPlan?.(plan, input.row.line);

      if (input.dryRun) {
        return { ...base, status: "planned" };
      }

      const extras = { signal: input.signal, operation: plan.operation, retryable: plan.retryable };
      const response = await input.options.adapter.executePlan(plan, extras);
      return {
        ...base,
        status: "success",
        http_status: response.status,
      };
    } catch (error) {
      if (isAbortError(error)) {
        return {
          ...base,
          status: "skipped",
          error: "not run (fail-fast)",
        };
      }
      if (error instanceof RateLimitError) {
        const fields = toResultsFields(error);
        return {
          ...base,
          status: fields.status,
          http_status: fields.http_status,
          error: redactSecrets(fields.error, input.secrets),
        };
      }
      if (error instanceof IdentityError) {
        const fields = identityResultsFields(error);
        return {
          ...base,
          status: fields.status,
          http_status: fields.http_status,
          error: redactSecrets(fields.error, input.secrets),
          resolved_id: fields.resolved_id || base.resolved_id,
        };
      }
      const fields = toResultsFields(error);
      return {
        ...base,
        status: fields.status,
        http_status: fields.http_status,
        error: redactSecrets(
          error instanceof ApiError || error instanceof AdapterError || error instanceof Error
            ? fields.error
            : String(error),
          input.secrets,
        ),
      };
    }
  }
}
