import pLimit, { type LimitFunction } from "p-limit";
import { ApiError, RateLimitError, ServerError } from "./api/errors.js";

export const DEFAULT_CONCURRENCY = 3;
export const MAX_CONCURRENCY = 20;
export const DEFAULT_MAX_ATTEMPTS = 3;
export const DEFAULT_BASE_DELAY_MS = 1000;
export const DEFAULT_MAX_DELAY_MS = 60_000;
export const DEFAULT_JITTER_RATIO = 0.2;

const RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504]);

const DELETE_OPERATIONS = new Set([
  "erase",
  "toggletrashed",
  "delete",
  "permanentlydelete",
  "bulkremoveroles",
  "bulkrevokebadges",
]);

export interface RetryPolicyOptions {
  maxAttempts?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  jitterRatio?: number;
  sleep?: (ms: number, signal?: AbortSignal) => Promise<void>;
  random?: () => number;
  log?: (message: string) => void;
}

export interface RetryRequestContext {
  method: string;
  path: string;
  operation?: string;
  retryable?: boolean;
  signal?: AbortSignal;
}

export interface ResultsErrorFields {
  status: "failed";
  http_status: number | "";
  error: string;
  attempts: number;
}

function abortError(signal?: AbortSignal): Error {
  if (signal?.reason instanceof Error) {
    return signal.reason;
  }
  const error = new Error("The operation was aborted");
  error.name = "AbortError";
  return error;
}

export async function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  if (ms <= 0) {
    if (signal?.aborted) {
      throw abortError(signal);
    }
    return;
  }
  await new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortError(signal));
      return;
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = (): void => {
      clearTimeout(timer);
      reject(abortError(signal));
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

export function parseConcurrency(raw: string | undefined): number {
  if (raw === undefined) {
    return DEFAULT_CONCURRENCY;
  }
  if (!/^\d+$/.test(raw)) {
    throw new Error(`--concurrency must be an integer from 1 to ${MAX_CONCURRENCY} (got "${raw}")`);
  }
  const value = Number(raw);
  if (value < 1 || value > MAX_CONCURRENCY) {
    throw new Error(`--concurrency must be an integer from 1 to ${MAX_CONCURRENCY} (got ${value})`);
  }
  return value;
}

export function isDeleteLike(method: string, path: string, operation?: string): boolean {
  if (method.toUpperCase() === "DELETE") {
    return true;
  }
  const op = (operation ?? "").toLowerCase().replace(/[^a-z]/g, "");
  if (op && (DELETE_OPERATIONS.has(op) || op.startsWith("permanentlydelete"))) {
    return true;
  }
  const normalized = (path.split("?")[0] ?? path).replace(/\/+$/, "");
  return /(?:^|\/)(erase|toggleTrashed|delete)$/i.test(normalized);
}

export function suggestedConcurrency(current: number): number {
  return Math.max(1, Math.floor(current / 2));
}

export function isRetryableStatus(status: number): boolean {
  return RETRYABLE_STATUSES.has(status);
}

export function isRetryableError(error: unknown): boolean {
  if (error instanceof RateLimitError) {
    return true;
  }
  return error instanceof ServerError && isRetryableStatus(error.status);
}

export function backoffDelayMs(
  retryIndex: number,
  options: {
    baseDelayMs: number;
    maxDelayMs: number;
    jitterRatio: number;
    random: () => number;
  },
): number {
  const exponential = Math.min(options.baseDelayMs * 2 ** retryIndex, options.maxDelayMs);
  const jitter = 1 + (options.random() * 2 - 1) * options.jitterRatio;
  return Math.min(options.maxDelayMs, Math.max(0, Math.round(exponential * jitter)));
}

export function toResultsFields(error: unknown): ResultsErrorFields {
  const attempts = error instanceof ApiError ? error.attempts : 1;
  if (error instanceof RateLimitError) {
    const deletePrefix = isDeleteLike(error.method, error.path)
      ? `DELETE_FAILED: ${error.status} `
      : "";
    return {
      status: "failed",
      http_status: 429,
      error: `${deletePrefix}HTTP 429 after ${attempts} attempt(s). Do not assume the write succeeded; retry this row manually. ${error.message}`,
      attempts,
    };
  }
  if (error instanceof ApiError) {
    const deleteLike = isDeleteLike(error.method, error.path);
    const followUp = deleteLike
      ? `${error.message} Deletes are never auto-retried; retry this row manually.`
      : error.message;
    return {
      status: "failed",
      http_status: error.status,
      error: deleteLike ? `DELETE_FAILED: ${error.status} ${followUp}` : followUp,
      attempts,
    };
  }
  return {
    status: "failed",
    http_status: "",
    error: error instanceof Error ? error.message : String(error),
    attempts,
  };
}

export class RetryPolicy {
  readonly maxAttempts: number;
  readonly baseDelayMs: number;
  readonly maxDelayMs: number;
  readonly jitterRatio: number;
  private readonly sleepImpl: (ms: number, signal?: AbortSignal) => Promise<void>;
  private readonly random: () => number;
  private readonly log: (message: string) => void;

  constructor(options: RetryPolicyOptions = {}) {
    this.maxAttempts = options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
    this.baseDelayMs = options.baseDelayMs ?? DEFAULT_BASE_DELAY_MS;
    this.maxDelayMs = options.maxDelayMs ?? DEFAULT_MAX_DELAY_MS;
    this.jitterRatio = options.jitterRatio ?? DEFAULT_JITTER_RATIO;
    this.sleepImpl = options.sleep ?? sleep;
    this.random = options.random ?? Math.random;
    this.log = options.log ?? ((message) => console.error(message));
  }

  delayMs(error: unknown, retryIndex: number): number {
    if (error instanceof RateLimitError && error.retryAfterMs !== undefined) {
      return Math.min(error.retryAfterMs, this.maxDelayMs);
    }
    return backoffDelayMs(retryIndex, {
      baseDelayMs: this.baseDelayMs,
      maxDelayMs: this.maxDelayMs,
      jitterRatio: this.jitterRatio,
      random: this.random,
    });
  }

  canRetry(context: RetryRequestContext, error: unknown, attempt: number): boolean {
    if (attempt >= this.maxAttempts) {
      return false;
    }
    if (context.retryable === false || isDeleteLike(context.method, context.path, context.operation)) {
      return false;
    }
    return isRetryableError(error);
  }

  async execute<T>(run: () => Promise<T>, context: RetryRequestContext): Promise<T> {
    let attempt = 0;
    while (true) {
      attempt += 1;
      try {
        return await run();
      } catch (error) {
        if (error instanceof ApiError) {
          error.attempts = attempt;
        }
        if (!this.canRetry(context, error, attempt)) {
          throw error;
        }
        const delay = this.delayMs(error, attempt - 1);
        const status = error instanceof ApiError ? String(error.status) : "error";
        this.log(
          `Retry ${context.method} ${context.path} after HTTP ${status}; attempt ${attempt}/${this.maxAttempts}; waiting ${delay}ms`,
        );
        await this.sleepImpl(delay, context.signal);
      }
    }
  }
}

export function createConcurrencyLimiter(concurrency: number = DEFAULT_CONCURRENCY): LimitFunction {
  return pLimit(concurrency);
}
