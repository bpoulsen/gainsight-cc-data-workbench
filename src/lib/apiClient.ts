import {
  AuthError,
  redactSecrets,
  type ApiRequestOptions,
  type ApiResponse,
  type AuthenticatedClient,
  type QueryParams,
} from "./auth.js";
import { mapHttpError } from "./api/errors.js";
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_START_PAGE,
  extractPageItems,
  isShortOrEmptyPage,
} from "./api/pagination.js";
import type { GainsightConfig } from "./types.js";

export {
  ApiError,
  AuthError,
  NotFoundError,
  RateLimitError,
  ServerError,
  ValidationError,
} from "./api/errors.js";
export { extractPageItems, DEFAULT_PAGE_SIZE } from "./api/pagination.js";
export type { community, events, gamification, search, user } from "../generated/index.js";

export type ApiFamily = "users" | "community" | "events" | "gamification" | "search";

const FAMILY_PREFIX: Record<ApiFamily, string> = {
  users: "",
  community: "/v2",
  events: "/v2",
  gamification: "",
  search: "",
};

export interface ApiClientOptions {
  isDebugEnabled?: () => boolean;
  debug?: (message: string) => void;
}

export interface RequestExtras {
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

export interface PaginateOptions {
  path: string;
  query?: QueryParams;
  pageSize?: number;
  startPage?: number;
  signal?: AbortSignal;
  extractItems?: (data: unknown) => unknown[];
}

export interface ApiClient {
  auth: AuthenticatedClient;
  request<T = unknown>(options: ApiRequestOptions): Promise<ApiResponse<T>>;
  get<T = unknown>(path: string, query?: QueryParams, extras?: RequestExtras): Promise<ApiResponse<T>>;
  post<T = unknown>(
    path: string,
    body?: unknown,
    query?: QueryParams,
    extras?: RequestExtras,
  ): Promise<ApiResponse<T>>;
  patch<T = unknown>(
    path: string,
    body?: unknown,
    query?: QueryParams,
    extras?: RequestExtras,
  ): Promise<ApiResponse<T>>;
  delete<T = unknown>(
    path: string,
    query?: QueryParams,
    extras?: RequestExtras,
  ): Promise<ApiResponse<T>>;
  paginate<T = unknown>(options: PaginateOptions): AsyncGenerator<T, void, undefined>;
}

export interface FamilyApi extends ApiClient {
  readonly family: ApiFamily;
  readonly prefix: string;
}

export function isDebugEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  const gsDebug = env.GS_DEBUG ?? "";
  if (gsDebug === "1" || gsDebug.toLowerCase() === "true") {
    return true;
  }
  const debug = env.DEBUG ?? "";
  return debug.split(/[,:\s]+/).includes("gainsight");
}

export function joinApiPath(prefix: string, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (!prefix) {
    return normalized;
  }
  if (normalized === prefix || normalized.startsWith(`${prefix}/`)) {
    return normalized;
  }
  return `${prefix}${normalized}`;
}

function secretsFor(config: GainsightConfig, extra: string[] = []): string[] {
  const cached = extra.filter(Boolean);
  return [config.clientId, config.clientSecret, ...cached];
}

function redactHeaders(
  headers: Record<string, string>,
  secrets: readonly string[],
): Record<string, string> {
  const redacted: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === "authorization") {
      redacted[key] = "[REDACTED]";
      continue;
    }
    redacted[key] = redactSecrets(value, secrets);
  }
  return redacted;
}

function summarizeBody(data: unknown, secrets: readonly string[]): string {
  if (data === undefined) {
    return "";
  }
  const raw = typeof data === "string" ? data : JSON.stringify(data);
  return redactSecrets(raw.slice(0, 500), secrets);
}

export function createApiClient(
  auth: AuthenticatedClient,
  options: ApiClientOptions = {},
): ApiClient {
  const debugEnabled = options.isDebugEnabled ?? isDebugEnabled;
  const debug = options.debug ?? ((message: string) => console.error(message));

  async function request<T = unknown>(req: ApiRequestOptions): Promise<ApiResponse<T>> {
    const token = auth.tokenManager.getCachedToken()?.accessToken ?? "";
    const secrets = secretsFor(auth.config, [token]);
    if (debugEnabled()) {
      debug(
        redactSecrets(
          `API ${req.method} ${req.path} headers=${JSON.stringify(redactHeaders(req.headers ?? {}, secrets))}`,
          secrets,
        ),
      );
    }

    const response = await auth.request<T>(req);
    if (debugEnabled()) {
      debug(
        redactSecrets(
          `API ${req.method} ${req.path} -> HTTP ${response.status} ${summarizeBody(response.data, secrets)}`,
          secrets,
        ),
      );
    }

    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    throw mapHttpError(response.status, req.method, req.path, response.data, response.headers);
  }

  function call<T>(
    method: string,
    path: string,
    body?: unknown,
    query?: QueryParams,
    extras: RequestExtras = {},
  ): Promise<ApiResponse<T>> {
    const req: ApiRequestOptions = { method, path };
    if (query !== undefined) {
      req.query = query;
    }
    if (body !== undefined) {
      req.body = body;
    }
    if (extras.headers !== undefined) {
      req.headers = extras.headers;
    }
    if (extras.signal !== undefined) {
      req.signal = extras.signal;
    }
    return request<T>(req);
  }

  async function* paginate<T = unknown>(
    pageOptions: PaginateOptions,
  ): AsyncGenerator<T, void, undefined> {
    const pageSize = pageOptions.pageSize ?? DEFAULT_PAGE_SIZE;
    let page = pageOptions.startPage ?? DEFAULT_START_PAGE;
    const extract = pageOptions.extractItems ?? extractPageItems;

    while (true) {
      if (pageOptions.signal?.aborted) {
        throw pageOptions.signal.reason instanceof Error
          ? pageOptions.signal.reason
          : new Error("Pagination aborted");
      }

      const query: QueryParams = {
        ...(pageOptions.query ?? {}),
        page,
        pageSize,
      };
      const extras: RequestExtras = {};
      if (pageOptions.signal !== undefined) {
        extras.signal = pageOptions.signal;
      }
      const response = await call<unknown>("GET", pageOptions.path, undefined, query, extras);
      const items = extract(response.data) as T[];
      if (items.length === 0) {
        return;
      }
      for (const item of items) {
        yield item;
      }
      if (isShortOrEmptyPage(items.length, pageSize)) {
        return;
      }
      page += 1;
    }
  }

  return {
    auth,
    request,
    get: (path, query, extras) => call("GET", path, undefined, query, extras),
    post: (path, body, query, extras) => call("POST", path, body, query, extras),
    patch: (path, body, query, extras) => call("PATCH", path, body, query, extras),
    delete: (path, query, extras) => call("DELETE", path, undefined, query, extras),
    paginate,
  };
}

function createFamilyApi(client: ApiClient, family: ApiFamily): FamilyApi {
  const prefix = FAMILY_PREFIX[family];

  const prefixed = (path: string): string => joinApiPath(prefix, path);

  return {
    family,
    prefix,
    auth: client.auth,
    request: (options) => client.request({ ...options, path: prefixed(options.path) }),
    get: (path, query, extras) => client.get(prefixed(path), query, extras),
    post: (path, body, query, extras) => client.post(prefixed(path), body, query, extras),
    patch: (path, body, query, extras) => client.patch(prefixed(path), body, query, extras),
    delete: (path, query, extras) => client.delete(prefixed(path), query, extras),
    paginate: (options) =>
      client.paginate({
        ...options,
        path: prefixed(options.path),
      }),
  };
}

export function usersApi(client: ApiClient): FamilyApi {
  const api = createFamilyApi(client, "users");
  return {
    ...api,
    paginate: (options) => {
      const query: QueryParams = { _returnIterable: true, ...(options.query ?? {}) };
      return api.paginate({ ...options, query });
    },
  };
}

export function communityApi(client: ApiClient): FamilyApi {
  return createFamilyApi(client, "community");
}

export function eventsApi(client: ApiClient): FamilyApi {
  return createFamilyApi(client, "events");
}

export function gamificationApi(client: ApiClient): FamilyApi {
  return createFamilyApi(client, "gamification");
}

export function searchApi(client: ApiClient): FamilyApi {
  return createFamilyApi(client, "search");
}
