/**
 * Bulk job runner: stream a CSV, resolve identity, plan or execute one named
 * operation per row, and write a results CSV.
 *
 * Native bulk role/badge ops group users who share the same id set (chunks of
 * 100). Failed add/award batches fall back to one user per request. Deletes
 * (including bulk remove/revoke) are never auto-retried.
 */
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import type { ApiClient } from "./apiClient.js";
import { ApiError, RateLimitError } from "./api/errors.js";
import {
  AdapterError,
  hasNativeBulkPlans,
  type ApiCallPlan,
  type IResourceAdapter,
  type NativeBulkBatch,
  type NativeBulkMember,
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
  isDeleteLike,
  suggestedConcurrency,
  toResultsFields,
} from "./retry.js";
import type { ProfileName } from "./types.js";
import { logJobExecution } from "./audit.js";

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
  cwd?: string;
  auditLogPath?: string;
  onAuditError?: (error: unknown) => void;
  /**
   * When the operation is a native bulk role/badge op, group users who share
   * the same id set (chunks of 100). Set false to send one API call per CSV row.
   * Default: true.
   */
  groupNativeBulk?: boolean;
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
  rateLimitCount: number;
  concurrency: number;
}

interface JobCounts {
  success: number;
  failed: number;
  skipped: number;
  planned: number;
  sawRateLimit: boolean;
  rateLimitCount: number;
}

interface JobRunContext {
  spec: ResourceOperation;
  options: BulkJobOptions;
  identity: UserIdentityResolver;
  dryRun: boolean;
  now: () => Date;
  signal: AbortSignal;
  secrets: string[];
  failFast: boolean;
  failFastController: AbortController;
  limit: ReturnType<typeof createConcurrencyLimiter>;
  results: Array<Record<string, unknown>>;
  counts: JobCounts;
  onProcessed: () => void;
}

interface NativeJobMember extends NativeBulkMember {
  index: number;
  mapped: MappedCsvRow;
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
  ];
  if (summary.sawRateLimit) {
    const current = summary.concurrency;
    const suggested = suggestedConcurrency(current);
    const n = summary.rateLimitCount;
    lines.push(
      `Rate limit (429) encountered (${n} request${n === 1 ? "" : "s"}). Consider reducing --concurrency (current: ${current}) to ${suggested}. Retry failed rows manually.`,
    );
  }
  if (summary.failed > 0 && isDeleteLike("POST", "", summary.operation)) {
    lines.push("Failed deletes/erases are never auto-retried. Filter the results CSV for status=failed and DELETE_FAILED, then re-run those rows manually. See README.");
  }
  lines.push(`Results: ${summary.resultsPath}`);
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
    const counts = { success: 0, failed: 0, skipped: 0, planned: 0, sawRateLimit: false, rateLimitCount: 0 };

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

    const groupNativeBulk = options.groupNativeBulk !== false;
    let processed = 0;
    const ctx: JobRunContext = {
      spec,
      options,
      identity,
      dryRun,
      now,
      signal,
      secrets: secretsOf(options.client),
      failFast,
      failFastController,
      limit,
      results,
      counts,
      onProcessed: () => {
        processed += 1;
        emitProgress(processed);
      },
    };

    if (spec.nativeBulk === true && groupNativeBulk && hasNativeBulkPlans(options.adapter)) {
      await this.processNativeBulk(rows, ctx);
    } else {
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
              secrets: ctx.secrets,
            });
            this.settleRow(index, record, ctx);
          }),
        ),
      );
    }

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

    const summary: BulkJobSummary = {
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
      rateLimitCount: counts.rateLimitCount,
      concurrency,
    };
    await logJobExecution(
      {
        timestamp: now().toISOString(),
        profile: options.profile,
        operation: options.operation,
        resource: options.adapter.name,
        inputFile: options.csvPath,
        resultsFile: resultsPath,
        totalRows: summary.total,
        successCount: summary.success,
        failedCount: summary.failed,
        skippedCount: summary.skipped,
        plannedCount: summary.planned,
        duration: summary.durationMs,
        dryRun,
        sawRateLimit: summary.sawRateLimit,
        rateLimitCount: summary.rateLimitCount,
      },
      {
        ...(options.cwd !== undefined ? { cwd: options.cwd } : {}),
        ...(options.auditLogPath !== undefined ? { logPath: options.auditLogPath } : {}),
        ...(options.onAuditError !== undefined ? { onError: options.onAuditError } : {}),
      },
    );
    return summary;
  }

  private settleRow(
    index: number,
    record: Record<string, unknown>,
    ctx: JobRunContext,
  ): void {
    if (record.status === "failed") {
      ctx.counts.failed += 1;
      if (record.http_status === 429) {
        ctx.counts.sawRateLimit = true;
        ctx.counts.rateLimitCount += 1;
      }
      if (ctx.failFast && !ctx.failFastController.signal.aborted) {
        ctx.failFastController.abort();
      }
    } else if (record.status === "planned") {
      ctx.counts.planned += 1;
    } else if (record.status === "skipped") {
      ctx.counts.skipped += 1;
    } else {
      ctx.counts.success += 1;
    }
    ctx.results[index] = record;
    ctx.onProcessed();
  }

  private rowBase(
    row: MappedCsvRow,
    options: BulkJobOptions,
    timestamp: string,
  ): Record<string, unknown> {
    return {
      ...row.raw,
      status: "failed",
      http_status: "",
      error: "",
      resolved_id: "",
      operation: options.operation,
      profile: options.profile,
      timestamp,
    };
  }

  private skippedRecord(base: Record<string, unknown>): Record<string, unknown> {
    return {
      ...base,
      status: "skipped",
      error: "not run (fail-fast)",
    };
  }

  private recordFromError(
    base: Record<string, unknown>,
    error: unknown,
    secrets: string[],
  ): Record<string, unknown> {
    if (isAbortError(error)) {
      return this.skippedRecord(base);
    }
    if (error instanceof IdentityError) {
      const fields = identityResultsFields(error);
      return {
        ...base,
        status: fields.status,
        http_status: fields.http_status,
        error: redactSecrets(fields.error, secrets),
        resolved_id: fields.resolved_id || base.resolved_id,
      };
    }
    const fields = toResultsFields(error);
    return {
      ...base,
      status: fields.status,
      http_status: fields.http_status,
      error: redactSecrets(
        error instanceof ApiError ||
          error instanceof AdapterError ||
          error instanceof RateLimitError ||
          error instanceof Error
          ? fields.error
          : String(error),
        secrets,
      ),
    };
  }

  private async processNativeBulk(rows: MappedCsvRow[], ctx: JobRunContext): Promise<void> {
    const adapter = ctx.options.adapter;
    if (!hasNativeBulkPlans(adapter)) {
      return;
    }
    const ready: NativeJobMember[] = [];
    const timestamp = ctx.now().toISOString();

    for (const [index, mapped] of rows.entries()) {
      const base = this.rowBase(mapped, ctx.options, timestamp);
      if (ctx.signal.aborted) {
        this.settleRow(index, this.skippedRecord(base), ctx);
        continue;
      }
      try {
        const resolvedId = await ctx.identity.resolveUserId(mapped.values);
        base.resolved_id = String(resolvedId);
        const member: NativeJobMember = {
          row: mapped.values,
          resolvedId,
          index,
          mapped,
        };
        adapter.nativeBulkPlans([member], ctx.options.operation);
        ready.push(member);
      } catch (error) {
        this.settleRow(index, this.recordFromError(base, error, ctx.secrets), ctx);
      }
    }

    if (ready.length === 0) {
      return;
    }

    const batches = adapter.nativeBulkPlans(ready, ctx.options.operation);
    const fallbackQueue: NativeBulkBatch<NativeJobMember>[] = [];

    await Promise.all(
      batches.map((batch) =>
        ctx.limit(async () => {
          await this.handleNativeBatch(batch, ctx, fallbackQueue);
        }),
      ),
    );

    if (fallbackQueue.length === 0) {
      return;
    }

    await Promise.all(
      fallbackQueue.map((batch) =>
        ctx.limit(async () => {
          await this.handleNativeBatch(batch, ctx, undefined);
        }),
      ),
    );
  }

  private async handleNativeBatch(
    batch: NativeBulkBatch<NativeJobMember>,
    ctx: JobRunContext,
    fallbackQueue: NativeBulkBatch<NativeJobMember>[] | undefined,
  ): Promise<void> {
    const first = batch.members[0];
    if (!first) {
      return;
    }
    ctx.options.onPlan?.(batch.plan, first.mapped.line);

    const stampMembers = (build: (member: NativeJobMember) => Record<string, unknown>): void => {
      for (const member of batch.members) {
        this.settleRow(member.index, build(member), ctx);
      }
    };

    if (ctx.dryRun) {
      stampMembers((member) => {
        const base = this.rowBase(member.mapped, ctx.options, ctx.now().toISOString());
        return {
          ...base,
          status: "planned",
          resolved_id: String(member.resolvedId),
        };
      });
      return;
    }

    if (ctx.signal.aborted) {
      stampMembers((member) => {
        const base = this.rowBase(member.mapped, ctx.options, ctx.now().toISOString());
        base.resolved_id = String(member.resolvedId);
        return this.skippedRecord(base);
      });
      return;
    }

    try {
      const extras = {
        signal: ctx.signal,
        operation: batch.plan.operation,
        retryable: batch.plan.retryable,
      };
      const response = await ctx.options.adapter.executePlan(batch.plan, extras);
      stampMembers((member) => {
        const base = this.rowBase(member.mapped, ctx.options, ctx.now().toISOString());
        return {
          ...base,
          status: "success",
          http_status: response.status,
          resolved_id: String(member.resolvedId),
        };
      });
    } catch (error) {
      if (isAbortError(error)) {
        stampMembers((member) => {
          const base = this.rowBase(member.mapped, ctx.options, ctx.now().toISOString());
          base.resolved_id = String(member.resolvedId);
          return this.skippedRecord(base);
        });
        return;
      }
      const uniqueUsers = new Set(batch.members.map((member) => member.resolvedId)).size;
      if (
        fallbackQueue !== undefined &&
        uniqueUsers > 1 &&
        batch.plan.retryable === true &&
        (batch.plan.operation === "bulkAddRoles" || batch.plan.operation === "bulkAwardBadges") &&
        hasNativeBulkPlans(ctx.options.adapter)
      ) {
        fallbackQueue.push(
          ...ctx.options.adapter.nativeBulkPlans(batch.members, ctx.options.operation, 1),
        );
        return;
      }
      stampMembers((member) => {
        const base = this.rowBase(member.mapped, ctx.options, ctx.now().toISOString());
        base.resolved_id = String(member.resolvedId);
        return this.recordFromError(base, error, ctx.secrets);
      });
    }
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
      return this.recordFromError(base, error, input.secrets);
    }
  }
}
