/**
 * Operator-facing error presentation: friendly messages, exit codes, Ctrl+C.
 * HTTP error classes live in `api/errors.ts`; this module formats them for the CLI.
 */
import { AuthError, AuthenticationError, redactSecrets } from "./auth.js";
import {
  ApiError,
  NotFoundError,
  RateLimitError,
  ValidationError,
} from "./api/errors.js";
import { ProfileError } from "./config/profile.js";

export {
  ApiError,
  NotFoundError,
  RateLimitError,
  ServerError,
  ValidationError,
} from "./api/errors.js";
export { AuthError, AuthenticationError } from "./auth.js";
export { ProfileError } from "./config/profile.js";

export const EXIT_SUCCESS = 0;
export const EXIT_ERROR = 1;
/** Job finished; at least one row succeeded or was planned, and at least one failed. */
export const EXIT_PARTIAL = 2;

export const TOPIC_CAP_MESSAGE =
  "Topic listing capped at 10,000 results. Narrow filters (category, date, tags) or use filter sharding. See docs/FILTER_SHARDING.md.";

export class JobAbortedError extends Error {
  readonly resultsPath?: string;

  constructor(message: string, resultsPath?: string) {
    super(message);
    this.name = "JobAbortedError";
    if (resultsPath !== undefined) {
      this.resultsPath = resultsPath;
    }
  }
}

export interface OperatorErrorContext {
  profile?: string;
  concurrency?: number;
}

export function authenticationFailed(profile = "sandbox"): string {
  return `Authentication failed. Check GAINSIGHT_CLIENT_ID and GAINSIGHT_CLIENT_SECRET in .env.${profile}. Ensure scope includes "read write".`;
}

export function rateLimitExceeded(retryAfterMs?: number): string {
  if (retryAfterMs !== undefined && Number.isFinite(retryAfterMs) && retryAfterMs >= 0) {
    const seconds = Math.max(1, Math.ceil(retryAfterMs / 1000));
    return `Rate limit exceeded. Retry after ${seconds}s. Consider reducing --concurrency.`;
  }
  return "Rate limit exceeded. Consider reducing --concurrency.";
}

export function userNotFound(email: string): string {
  return `User not found: ${email}. Verify email address.`;
}

export function profileNotConfigured(profile: string): string {
  return `Profile ${profile} not configured. Create .env.${profile} with GAINSIGHT_BASE_URL, GAINSIGHT_CLIENT_ID, GAINSIGHT_CLIENT_SECRET.`;
}

export function missingRequiredColumn(column: string, operation: string): string {
  return `Missing required column: ${column} for operation ${operation}`;
}

export function invalidField(field: string, expected: string, value: unknown): string {
  return `Invalid ${field}: expected ${expected}, got ${String(value)}`;
}

export function jobAborted(resultsPath?: string): string {
  if (resultsPath !== undefined && resultsPath.length > 0) {
    return `Job aborted. Partial results saved to ${resultsPath}.`;
  }
  return "Job aborted.";
}

export function isAbortError(error: unknown): boolean {
  if (error instanceof JobAbortedError) {
    return true;
  }
  return error instanceof Error && error.name === "AbortError";
}

export function looksLikeTopicCap(error: unknown): boolean {
  if (!(error instanceof ValidationError)) {
    return false;
  }
  const text = `${error.message} ${error.errors.join(" ")}`.toLowerCase();
  return text.includes("10,000") || text.includes("10000");
}

function isIdentityNotFound(
  error: unknown,
): error is Error & { code: "not_found"; email?: string } {
  if (!(error instanceof Error) || error.name !== "IdentityError") {
    return false;
  }
  return (error as { code?: unknown }).code === "not_found";
}

function emailFromNotFoundPath(path: string): string | undefined {
  const match = /\/user\/email\/([^/?#]+)/i.exec(path);
  if (!match?.[1]) {
    return undefined;
  }
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

/** Operator-facing message for stderr. Does not include stack traces or request bodies. */
export function formatOperatorMessage(error: unknown, context: OperatorErrorContext = {}): string {
  const profile = context.profile ?? "sandbox";

  if (error instanceof JobAbortedError) {
    return error.resultsPath !== undefined ? jobAborted(error.resultsPath) : error.message;
  }
  if (isAbortError(error)) {
    return jobAborted();
  }
  if (error instanceof AuthenticationError || error instanceof AuthError) {
    return authenticationFailed(profile);
  }
  if (error instanceof RateLimitError) {
    return rateLimitExceeded(error.retryAfterMs);
  }
  if (looksLikeTopicCap(error)) {
    return TOPIC_CAP_MESSAGE;
  }
  if (isIdentityNotFound(error)) {
    return error.email ? userNotFound(error.email) : error.message;
  }
  if (error instanceof NotFoundError) {
    const email = emailFromNotFoundPath(error.path);
    if (email) {
      return userNotFound(email);
    }
  }
  if (error instanceof ProfileError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

/** Extra lines for `--verbose`: stack plus redacted HTTP details. Never prints secrets. */
export function formatVerboseDetails(error: unknown, secrets: readonly string[] = []): string | undefined {
  const lines: string[] = [];
  if (error instanceof ApiError) {
    lines.push(`${error.method} ${error.path} → HTTP ${error.status}`);
    if (error.data !== undefined) {
      const raw = typeof error.data === "string" ? error.data : JSON.stringify(error.data);
      lines.push(redactSecrets(raw.slice(0, 2000), secrets));
    }
  }
  if (error instanceof Error && error.stack) {
    lines.push(redactSecrets(error.stack, secrets));
  }
  return lines.length > 0 ? lines.join("\n") : undefined;
}

export function exitCodeForError(error: unknown): number {
  if (error instanceof JobAbortedError || isAbortError(error)) {
    return EXIT_ERROR;
  }
  return EXIT_ERROR;
}

export function exitCodeForJob(summary: {
  success: number;
  failed: number;
  planned?: number;
}): number {
  if (summary.failed === 0) {
    return EXIT_SUCCESS;
  }
  if (summary.success > 0 || (summary.planned ?? 0) > 0) {
    return EXIT_PARTIAL;
  }
  return EXIT_ERROR;
}

export function exitCodeForShards(failed: number, total: number): number {
  if (failed <= 0) {
    return EXIT_SUCCESS;
  }
  if (failed < total) {
    return EXIT_PARTIAL;
  }
  return EXIT_ERROR;
}

/** Abort the wrapped work on SIGINT / SIGTERM. Does not call process.exit. */
export async function runWithInterrupt<T>(fn: (signal: AbortSignal) => Promise<T>): Promise<T> {
  const controller = new AbortController();
  const onInterrupt = (): void => {
    controller.abort();
  };
  process.on("SIGINT", onInterrupt);
  process.on("SIGTERM", onInterrupt);
  try {
    return await fn(controller.signal);
  } finally {
    process.off("SIGINT", onInterrupt);
    process.off("SIGTERM", onInterrupt);
  }
}
