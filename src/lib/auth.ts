import type { GainsightConfig } from "./types.js";

export const REQUIRED_OAUTH_SCOPE = "read write";
export const TOKEN_REFRESH_SKEW_MS = 60_000;
export const DEFAULT_EXPIRES_IN_SEC = 7200;

export type FetchLike = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

export interface CachedToken {
  accessToken: string;
  expiresAt: number;
  tokenType: string;
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

/** 401, missing scope, or invalid OAuth credentials. */
export class AuthenticationError extends AuthError {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

export function redactSecrets(text: string, secrets: readonly string[]): string {
  let redacted = text;
  for (const secret of secrets) {
    const value = secret.trim();
    if (value.length < 4) {
      continue;
    }
    redacted = redacted.split(value).join("[REDACTED]");
  }
  return redacted;
}

function secretsFrom(config: GainsightConfig, extra: string[] = []): string[] {
  return [config.clientId, config.clientSecret, ...extra];
}

function fail(config: GainsightConfig, message: string, extra: string[] = []): never {
  throw new AuthenticationError(redactSecrets(message, secretsFrom(config, extra)));
}

interface TokenEndpointJson {
  access_token?: unknown;
  expires_in?: unknown;
  token_type?: unknown;
  scope?: unknown;
  error?: unknown;
  error_description?: unknown;
}

function hasReadWriteScope(scope: string | undefined): boolean {
  if (!scope) {
    return true;
  }
  const parts = scope.split(/[\s,]+/).filter(Boolean);
  return parts.includes("read") && parts.includes("write");
}

export class TokenManager {
  private cache: CachedToken | null = null;
  private inflight: Promise<string> | null = null;

  constructor(
    private readonly config: GainsightConfig,
    private readonly fetchImpl: FetchLike = fetch,
    private readonly now: () => number = Date.now,
  ) {}

  getCachedToken(): CachedToken | null {
    return this.cache;
  }

  invalidate(): void {
    this.cache = null;
  }

  async getAccessToken(): Promise<string> {
    if (this.isFresh()) {
      return this.cache!.accessToken;
    }
    if (!this.inflight) {
      this.inflight = this.refresh().finally(() => {
        this.inflight = null;
      });
    }
    return this.inflight;
  }

  private isFresh(): boolean {
    return (
      this.cache !== null &&
      this.now() + TOKEN_REFRESH_SKEW_MS < this.cache.expiresAt
    );
  }

  async refresh(): Promise<string> {
    const tokenUrl = `${this.config.baseUrl}/oauth2/token`;
    const body = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      scope: REQUIRED_OAUTH_SCOPE,
    });

    if (!body.get("scope")) {
      fail(this.config, "OAuth token request is missing required scope 'read write'.");
    }

    let response: Response;
    try {
      response = await this.fetchImpl(tokenUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      fail(this.config, `OAuth token request failed: ${message}`);
    }

    const raw = await response.text();
    let json: TokenEndpointJson = {};
    try {
      json = raw ? (JSON.parse(raw) as TokenEndpointJson) : {};
    } catch {
      fail(this.config, `OAuth token endpoint returned non-JSON (HTTP ${response.status}).`);
    }

    const accessToken =
      typeof json.access_token === "string" ? json.access_token : "";
    const extra = accessToken ? [accessToken] : [];

    if (!response.ok || !accessToken) {
      const description =
        typeof json.error_description === "string"
          ? json.error_description
          : typeof json.error === "string"
            ? json.error
            : raw.slice(0, 200);
      fail(
        this.config,
        `OAuth token request failed (HTTP ${response.status}). ${description} Check client credentials and that scope=read write is allowed.`,
        extra,
      );
    }

    const scope = typeof json.scope === "string" ? json.scope : undefined;
    if (!hasReadWriteScope(scope)) {
      fail(
        this.config,
        `OAuth token is missing required 'read write' scope (got "${scope ?? ""}"). A scopeless token will 401 on /v2.`,
        extra,
      );
    }

    const expiresIn =
      typeof json.expires_in === "number" && Number.isFinite(json.expires_in)
        ? json.expires_in
        : DEFAULT_EXPIRES_IN_SEC;
    const tokenType =
      typeof json.token_type === "string" && json.token_type.length > 0
        ? json.token_type
        : "Bearer";

    this.cache = {
      accessToken,
      tokenType,
      expiresAt: this.now() + expiresIn * 1000,
    };
    return accessToken;
  }
}

export type QueryPrimitive = string | number | boolean;
export type QueryParams = Record<string, QueryPrimitive | QueryPrimitive[] | undefined>;

export interface ApiRequestOptions {
  method: string;
  path: string;
  query?: QueryParams;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  operation?: string;
  retryable?: boolean;
}

export interface ApiResponse<T = unknown> {
  status: number;
  data: T;
  headers: Headers;
}

export interface AuthenticatedClient {
  config: GainsightConfig;
  tokenManager: TokenManager;
  request<T = unknown>(options: ApiRequestOptions): Promise<ApiResponse<T>>;
}

export function buildUrl(
  baseUrl: string,
  path: string,
  query?: QueryParams,
): string {
  const url = new URL(path.startsWith("http") ? path : `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined) {
        continue;
      }
      if (Array.isArray(value)) {
        for (const item of value) {
          url.searchParams.append(key, String(item));
        }
      } else {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

export function getAuthenticatedClient(
  config: GainsightConfig,
  deps: { fetchImpl?: FetchLike; now?: () => number } = {},
): AuthenticatedClient {
  const fetchImpl = deps.fetchImpl ?? fetch;
  const tokenManager = new TokenManager(config, fetchImpl, deps.now ?? Date.now);

  async function request<T = unknown>(
    options: ApiRequestOptions,
    allowRetry = true,
  ): Promise<ApiResponse<T>> {
    const token = await tokenManager.getAccessToken();
    const cached = tokenManager.getCachedToken();
    const headers: Record<string, string> = {
      Authorization: `${cached?.tokenType ?? "Bearer"} ${token}`,
      Accept: "application/json",
      ...options.headers,
    };

    const init: RequestInit = { method: options.method, headers };
    if (options.signal) {
      init.signal = options.signal;
    }
    if (options.body !== undefined) {
      headers["Content-Type"] = headers["Content-Type"] ?? "application/json";
      init.body = typeof options.body === "string" ? options.body : JSON.stringify(options.body);
    }

    let response: Response;
    try {
      response = await fetchImpl(buildUrl(config.baseUrl, options.path, options.query), init);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw error;
      }
      const message = error instanceof Error ? error.message : String(error);
      throw new AuthError(
        redactSecrets(`API request failed: ${message}`, secretsFrom(config, [token])),
      );
    }

    if (response.status === 401 && allowRetry) {
      tokenManager.invalidate();
      return request<T>(options, false);
    }

    const raw = await response.text();
    let data: T = undefined as T;
    if (raw) {
      try {
        data = JSON.parse(raw) as T;
      } catch {
        data = raw as T;
      }
    }

    if (response.status === 401) {
      throw new AuthenticationError(
        redactSecrets(
          `API request unauthorized (HTTP 401) after re-authentication. ${raw.slice(0, 200)}`,
          secretsFrom(config, [token]),
        ),
      );
    }

    return { status: response.status, data, headers: response.headers };
  }

  return { config, tokenManager, request };
}
