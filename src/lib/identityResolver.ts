import { userNotFound } from "./errors.js";
import { NotFoundError, usersApi, type ApiClient } from "./apiClient.js";

export type IdentityErrorCode = "missing" | "invalid_id" | "not_found" | "conflict";

export interface UserIdentityRow {
  id?: unknown;
  userid?: unknown;
  email?: unknown;
}

export interface IdentityStats {
  cacheHits: number;
  apiCalls: number;
  failures: number;
  resolved: number;
}

export interface IdentityResultsFields {
  status: "failed";
  http_status: number | "";
  error: string;
  resolved_id: string;
}

export class IdentityError extends Error {
  readonly code: IdentityErrorCode;
  readonly httpStatus?: number;
  readonly email?: string;
  readonly providedId?: number;
  readonly resolvedId?: number;

  constructor(
    message: string,
    options: {
      code: IdentityErrorCode;
      cause?: unknown;
      httpStatus?: number;
      email?: string;
      providedId?: number;
      resolvedId?: number;
    },
  ) {
    super(message, options.cause !== undefined ? { cause: options.cause } : undefined);
    this.name = "IdentityError";
    this.code = options.code;
    if (options.httpStatus !== undefined) {
      this.httpStatus = options.httpStatus;
    }
    if (options.email !== undefined) {
      this.email = options.email;
    }
    if (options.providedId !== undefined) {
      this.providedId = options.providedId;
    }
    if (options.resolvedId !== undefined) {
      this.resolvedId = options.resolvedId;
    }
  }
}

export function parseUserId(value: unknown): number | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value === "number") {
    if (!Number.isInteger(value) || value <= 0) {
      throw new IdentityError(`User id must be a positive integer (got ${String(value)})`, {
        code: "invalid_id",
      });
    }
    return value;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return undefined;
    }
    if (!/^\d+$/.test(trimmed)) {
      throw new IdentityError(`User id must be a positive integer (got "${value}")`, {
        code: "invalid_id",
      });
    }
    const parsed = Number(trimmed);
    if (parsed <= 0) {
      throw new IdentityError(`User id must be a positive integer (got "${value}")`, {
        code: "invalid_id",
      });
    }
    return parsed;
  }
  throw new IdentityError(`User id must be a positive integer (got ${typeof value})`, {
    code: "invalid_id",
  });
}

export function parseEmail(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value !== "string") {
    throw new IdentityError("User email must be a string", { code: "missing" });
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return undefined;
  }
  if (!trimmed.includes("@") || trimmed.startsWith("@") || trimmed.endsWith("@")) {
    throw new IdentityError(`Invalid email "${trimmed}"`, { code: "missing", email: trimmed });
  }
  return trimmed;
}

export function extractUserId(data: unknown): number | undefined {
  if (!data || typeof data !== "object") {
    return undefined;
  }
  const record = data as Record<string, unknown>;
  const nested =
    record.result && typeof record.result === "object"
      ? (record.result as Record<string, unknown>)
      : undefined;
  for (const candidate of [record.userid, record.id, nested?.userid, nested?.id]) {
    if (typeof candidate === "number" && Number.isInteger(candidate) && candidate > 0) {
      return candidate;
    }
    if (typeof candidate === "string" && /^\d+$/.test(candidate.trim())) {
      const parsed = Number(candidate.trim());
      if (parsed > 0) {
        return parsed;
      }
    }
  }
  return undefined;
}

export function identityResultsFields(error: IdentityError): IdentityResultsFields {
  return {
    status: "failed",
    http_status: error.httpStatus ?? "",
    error: error.message,
    resolved_id: error.providedId !== undefined ? String(error.providedId) : "",
  };
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function notFound(email: string, cause?: unknown): IdentityError {
  return new IdentityError(userNotFound(email), {
    code: "not_found",
    httpStatus: 404,
    email,
    cause,
  });
}

/**
 * Resolves Gainsight userids from CSV `id` / `userid` / `email`.
 * Email lookups hit `GET /user/email/{email}` and are cached per job.
 * If both id and email are present and they disagree, the row fails.
 */
export class UserIdentityResolver {
  private readonly api: ReturnType<typeof usersApi>;
  private readonly cache = new Map<string, number>();
  private readonly missing = new Set<string>();
  private readonly inflight = new Map<string, Promise<number>>();
  readonly stats: IdentityStats = {
    cacheHits: 0,
    apiCalls: 0,
    failures: 0,
    resolved: 0,
  };

  constructor(client: ApiClient) {
    this.api = usersApi(client);
  }

  /** Return the numeric userid for one row. Throws {@link IdentityError} on missing/conflict/404. */
  async resolveUserId(row: UserIdentityRow): Promise<number> {
    try {
      const id = await this.resolve(row);
      this.stats.resolved += 1;
      return id;
    } catch (error) {
      this.stats.failures += 1;
      throw error;
    }
  }

  /** Look up distinct emails in parallel so the job does not wait per row. */
  async prefetch(rows: Iterable<UserIdentityRow>): Promise<void> {
    const emails = new Set<string>();
    for (const row of rows) {
      const email = parseEmail(row.email);
      if (email) {
        emails.add(email);
      }
    }
    await Promise.all(
      [...emails].map(async (email) => {
        try {
          await this.lookupEmail(email);
        } catch (error) {
          if (error instanceof IdentityError && error.code === "not_found") {
            return;
          }
          throw error;
        }
      }),
    );
  }

  private async resolve(row: UserIdentityRow): Promise<number> {
    const providedId = parseUserId(row.id ?? row.userid);
    const email = parseEmail(row.email);

    if (providedId === undefined && email === undefined) {
      throw new IdentityError("User row requires id or email", { code: "missing" });
    }

    if (email === undefined) {
      return providedId as number;
    }

    const resolvedId = await this.lookupEmail(email);
    if (providedId !== undefined && providedId !== resolvedId) {
      throw new IdentityError(
        `id ${providedId} and email ${email} resolve to different users (email is userid ${resolvedId}). The tool will not guess.`,
        {
          code: "conflict",
          email,
          providedId,
          resolvedId,
        },
      );
    }
    return providedId ?? resolvedId;
  }

  private async lookupEmail(email: string): Promise<number> {
    const key = normalizeEmail(email);
    const cached = this.cache.get(key);
    if (cached !== undefined) {
      this.stats.cacheHits += 1;
      return cached;
    }
    if (this.missing.has(key)) {
      this.stats.cacheHits += 1;
      throw notFound(email);
    }
    const pending = this.inflight.get(key);
    if (pending) {
      this.stats.cacheHits += 1;
      return pending;
    }

    const request = this.fetchByEmail(email)
      .then((id) => {
        this.cache.set(key, id);
        return id;
      })
      .catch((error: unknown) => {
        if (error instanceof IdentityError && error.code === "not_found") {
          this.missing.add(key);
        }
        throw error;
      })
      .finally(() => {
        this.inflight.delete(key);
      });
    this.inflight.set(key, request);
    return request;
  }

  private async fetchByEmail(email: string): Promise<number> {
    this.stats.apiCalls += 1;
    try {
      const response = await this.api.get(`/user/email/${encodeURIComponent(email)}`);
      const id = extractUserId(response.data);
      if (id === undefined) {
        throw notFound(email);
      }
      return id;
    } catch (error) {
      if (error instanceof NotFoundError || (error instanceof IdentityError && error.code === "not_found")) {
        throw notFound(email, error instanceof NotFoundError ? error : undefined);
      }
      throw error;
    }
  }
}
