import { AuthError } from "../auth.js";

export { AuthError };

export class ApiError extends Error {
  readonly status: number;
  readonly method: string;
  readonly path: string;
  readonly data: unknown;
  attempts: number;

  constructor(message: string, status: number, method: string, path: string, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.method = method;
    this.path = path;
    this.data = data;
    this.attempts = 1;
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string, method: string, path: string, data: unknown) {
    super(message, 404, method, path, data);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends ApiError {
  readonly errors: string[];

  constructor(
    message: string,
    method: string,
    path: string,
    data: unknown,
    errors: string[] = [],
  ) {
    super(message, 422, method, path, data);
    this.name = "ValidationError";
    this.errors = errors;
  }
}

export class RateLimitError extends ApiError {
  readonly retryAfterMs?: number;

  constructor(
    message: string,
    method: string,
    path: string,
    data: unknown,
    retryAfterMs?: number,
  ) {
    super(message, 429, method, path, data);
    this.name = "RateLimitError";
    if (retryAfterMs !== undefined) {
      this.retryAfterMs = retryAfterMs;
    }
  }
}

export class ServerError extends ApiError {
  constructor(message: string, status: number, method: string, path: string, data: unknown) {
    super(message, status, method, path, data);
    this.name = "ServerError";
  }
}

export function parseRetryAfter(header: string | null, now: number = Date.now()): number | undefined {
  if (!header) {
    return undefined;
  }
  const trimmed = header.trim();
  if (/^\d+(\.\d+)?$/.test(trimmed)) {
    return Math.max(0, Number(trimmed) * 1000);
  }
  const date = Date.parse(trimmed);
  if (Number.isNaN(date)) {
    return undefined;
  }
  return Math.max(0, date - now);
}

export function messageFromBody(data: unknown, fallback: string): string {
  if (typeof data === "string" && data.trim()) {
    return data.slice(0, 300);
  }
  if (!data || typeof data !== "object") {
    return fallback;
  }
  const body = data as Record<string, unknown>;
  const errors = Array.isArray(body.errors)
    ? body.errors.filter((item): item is string => typeof item === "string")
    : [];
  if (typeof body.message === "string" && body.message.trim()) {
    return errors.length > 0 ? `${body.message}: ${errors.join("; ")}` : body.message;
  }
  if (typeof body.error === "string" && body.error.trim()) {
    return body.error;
  }
  if (typeof body.detail === "string" && body.detail.trim()) {
    return body.detail;
  }
  if (errors.length > 0) {
    return errors.join("; ");
  }
  return fallback;
}

export function validationErrorsFromBody(data: unknown): string[] {
  if (!data || typeof data !== "object" || !("errors" in data)) {
    return [];
  }
  const errors = (data as { errors?: unknown }).errors;
  if (!Array.isArray(errors)) {
    return [];
  }
  return errors.filter((item): item is string => typeof item === "string");
}

export function mapHttpError(
  status: number,
  method: string,
  path: string,
  data: unknown,
  headers: Headers,
): ApiError | AuthError {
  const fallback = `API request failed (HTTP ${status}) ${method} ${path}`;
  const message = messageFromBody(data, fallback);

  if (status === 401) {
    return new AuthError(message);
  }
  if (status === 404) {
    return new NotFoundError(message, method, path, data);
  }
  if (status === 422) {
    return new ValidationError(message, method, path, data, validationErrorsFromBody(data));
  }
  if (status === 429) {
    const retryAfterMs = parseRetryAfter(headers.get("retry-after"));
    return new RateLimitError(message, method, path, data, retryAfterMs);
  }
  if (status >= 500) {
    return new ServerError(message, status, method, path, data);
  }
  return new ApiError(message, status, method, path, data);
}
