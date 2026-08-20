/**
 * Resource adapters hide Gainsight’s named-action APIs behind one contract.
 *
 * The wizard and CLI choose a resource, then either:
 *   - explore/export: describeFilters() → list()/get() → exportFields()
 *   - bulk: operations() → fromCsvRow() → HTTP plan (method, path, body)
 *
 * There is no generic PATCH. Each operation is a distinct endpoint
 * (`editTitle` vs `editTags` vs `toggleTrashed`). Paths returned by
 * fromCsvRow() are family-relative (users/search/gamification under `/`,
 * community/events under `/v2` via the family client).
 *
 * Concrete adapters land in later tasks (users, questions, events, …).
 */
import {
  communityApi,
  eventsApi,
  gamificationApi,
  searchApi,
  usersApi,
  type ApiClient,
  type ApiFamily,
  type FamilyApi,
  type RequestExtras,
} from "../lib/apiClient.js";
import type { ApiRequestOptions, ApiResponse, QueryParams } from "../lib/auth.js";
import { DEFAULT_PAGE_SIZE, extractPageItems } from "../lib/api/pagination.js";
import {
  ensureExportColumns,
  flattenValue,
  type ColumnMapping,
  type FieldKind,
} from "../lib/csv.js";
import { isDeleteLike } from "../lib/retry.js";

export const RESOURCE_NAMES = [
  "users",
  "topics",
  "questions",
  "ideas",
  "conversations",
  "articles",
  "productUpdates",
  "events",
  "categories",
  "tags",
  "moderatorTags",
  "productAreas",
  "ideaStatuses",
  "gamification",
  "search",
] as const;

export type ResourceName = (typeof RESOURCE_NAMES)[number];

const RESOURCE_ALIASES: Record<string, ResourceName> = {
  user: "users",
  topic: "topics",
  question: "questions",
  idea: "ideas",
  conversation: "conversations",
  article: "articles",
  "product-updates": "productUpdates",
  productupdates: "productUpdates",
  event: "events",
  category: "categories",
  tag: "tags",
  "moderator-tags": "moderatorTags",
  moderatortags: "moderatorTags",
  "product-areas": "productAreas",
  productareas: "productAreas",
  "idea-statuses": "ideaStatuses",
  ideastatuses: "ideaStatuses",
  leaderboard: "gamification",
  points: "gamification",
};

export type OperationKind = "create" | "update" | "delete" | "read";
export type ConfirmationKind = "none" | "typed";
export type IdentityMode = "id" | "id-or-email";

export class AdapterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AdapterError";
  }
}

export type NormalizedRecord = Record<string, unknown>;

export interface PageRequest {
  page: number;
  pageSize?: number;
  signal?: AbortSignal;
}

export interface ListPage {
  records: NormalizedRecord[];
  page: number;
  pageSize: number;
  exhausted: boolean;
  hitCap?: boolean;
}

export interface ExportField {
  name: string;
  kind: FieldKind;
  flatten?: (value: unknown) => string;
}

export interface ResourceOperation {
  name: string;
  kind: OperationKind;
  label: string;
  description?: string;
  confirmation?: ConfirmationKind;
  nativeBulk?: boolean;
  requiredColumns: string[];
  optionalColumns?: string[];
}

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiCallPlan {
  method: HttpMethod;
  path: string;
  operation: string;
  retryable: boolean;
  query?: QueryParams;
  body?: unknown;
  resolvedId?: string | number;
}

export interface FromCsvRowContext {
  resolvedId?: number;
}

export interface FilterPrompt {
  name: string;
  label: string;
  type: FieldKind | "date";
  required?: boolean;
  description?: string;
  choices?: Array<{ value: string; label: string }>;
}

/**
 * Unified explore / export / bulk surface for one Gainsight object family.
 */
export interface IResourceAdapter {
  readonly name: ResourceName;
  readonly label: string;
  readonly family: ApiFamily;
  readonly identity: IdentityMode;
  list(filters: QueryParams, page: PageRequest): Promise<ListPage>;
  get(id: string | number, signal?: AbortSignal): Promise<NormalizedRecord>;
  exportFields(): ExportField[];
  exportColumnNames(): string[];
  flattenRecord(record: NormalizedRecord): Record<string, string>;
  operations(): ResourceOperation[];
  fromCsvRow(
    row: Record<string, unknown>,
    operation: string,
    context?: FromCsvRowContext,
  ): ApiCallPlan;
  executePlan(plan: ApiCallPlan, extras?: RequestExtras): Promise<ApiResponse>;
  describeFilters(): FilterPrompt[];
}

export function isResourceName(value: string): value is ResourceName {
  return (RESOURCE_NAMES as readonly string[]).includes(value);
}

export function resolveResourceName(raw: string): ResourceName {
  const trimmed = raw.trim();
  if (trimmed.length === 0) {
    throw new AdapterError("Resource name is required");
  }
  if (isResourceName(trimmed)) {
    return trimmed;
  }
  const aliased = RESOURCE_ALIASES[trimmed] ?? RESOURCE_ALIASES[trimmed.toLowerCase()];
  if (aliased) {
    return aliased;
  }
  throw new AdapterError(
    `Unknown resource "${raw}". Expected one of: ${RESOURCE_NAMES.join(", ")}`,
  );
}

export abstract class BaseAdapter implements IResourceAdapter {
  abstract readonly name: ResourceName;
  abstract readonly label: string;
  abstract readonly family: ApiFamily;
  abstract readonly identity: IdentityMode;

  constructor(protected readonly client: ApiClient) {}

  abstract list(filters: QueryParams, page: PageRequest): Promise<ListPage>;
  abstract get(id: string | number, signal?: AbortSignal): Promise<NormalizedRecord>;
  abstract exportFields(): ExportField[];
  abstract operations(): ResourceOperation[];
  abstract fromCsvRow(
    row: Record<string, unknown>,
    operation: string,
    context?: FromCsvRowContext,
  ): ApiCallPlan;
  abstract describeFilters(): FilterPrompt[];

  async executePlan(plan: ApiCallPlan, extras: RequestExtras = {}): Promise<ApiResponse> {
    const req: ApiRequestOptions = {
      method: plan.method,
      path: plan.path,
      operation: plan.operation,
      retryable: plan.retryable,
    };
    if (plan.query !== undefined) {
      req.query = plan.query;
    }
    if (plan.body !== undefined) {
      req.body = plan.body;
    }
    if (extras.headers !== undefined) {
      req.headers = extras.headers;
    }
    if (extras.signal !== undefined) {
      req.signal = extras.signal;
    }
    if (extras.operation !== undefined) {
      req.operation = extras.operation;
    }
    if (extras.retryable !== undefined) {
      req.retryable = extras.retryable;
    }
    return this.familyClient().request(req);
  }

  familyClient(): FamilyApi {
    switch (this.family) {
      case "users":
        return usersApi(this.client);
      case "community":
        return communityApi(this.client);
      case "events":
        return eventsApi(this.client);
      case "gamification":
        return gamificationApi(this.client);
      case "search":
        return searchApi(this.client);
    }
  }

  exportColumnNames(): string[] {
    return ensureExportColumns(
      this.exportFields().map((field) => field.name),
      { includeEmail: this.identity === "id-or-email" },
    );
  }

  columnMapping(): ColumnMapping {
    const kinds: Record<string, FieldKind> = {};
    for (const field of this.exportFields()) {
      kinds[field.name] = field.kind;
    }
    const knownFields = Object.keys(kinds);
    return { kinds, knownFields };
  }

  flattenRecord(record: NormalizedRecord): Record<string, string> {
    const columns = this.exportColumnNames();
    const flat: Record<string, string> = {};
    const fields = new Map(this.exportFields().map((field) => [field.name, field]));
    for (const column of columns) {
      const field = fields.get(column);
      const value = record[column];
      flat[column] = field?.flatten ? field.flatten(value) : flattenValue(value);
    }
    return flat;
  }

  protected toListPage(
    records: unknown[],
    page: number,
    pageSize: number = DEFAULT_PAGE_SIZE,
  ): ListPage {
    const normalized = records.map((item) => this.unwrapRecord(item));
    return {
      records: normalized,
      page,
      pageSize,
      exhausted: normalized.length === 0 || normalized.length < pageSize,
    };
  }

  protected unwrapRecord(data: unknown): NormalizedRecord {
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new AdapterError("Expected an object record from the API");
    }
    const record = data as Record<string, unknown>;
    if (record.result && typeof record.result === "object" && !Array.isArray(record.result)) {
      return record.result as NormalizedRecord;
    }
    return record;
  }

  protected itemsFrom(data: unknown): unknown[] {
    return extractPageItems(data);
  }

  protected requireOperation(name: string): ResourceOperation {
    const operation = this.operations().find((item) => item.name === name);
    if (!operation) {
      const available = this.operations()
        .map((item) => item.name)
        .join(", ");
      throw new AdapterError(
        `Unknown operation "${name}" for ${this.name}. Expected one of: ${available || "(none)"}`,
      );
    }
    return operation;
  }

  protected identityValue(
    row: Record<string, unknown>,
    context?: FromCsvRowContext,
  ): string | number {
    if (context?.resolvedId !== undefined) {
      return context.resolvedId;
    }
    const id = row.id ?? row.userid ?? row.replyId;
    if (id === undefined || id === "") {
      throw new AdapterError(`${this.label} row is missing id`);
    }
    return id as string | number;
  }

  protected requireFields(
    row: Record<string, unknown>,
    fields: readonly string[],
    operation: string,
  ): void {
    const missing = fields.filter((field) => {
      if (field === "id" || field === "userid") {
        return false;
      }
      const value = row[field];
      return value === undefined || value === "";
    });
    if (missing.length > 0) {
      throw new AdapterError(
        `Operation ${operation} requires columns: ${missing.join(", ")}`,
      );
    }
  }

  protected pickFields(
    row: Record<string, unknown>,
    fields: readonly string[],
  ): Record<string, unknown> {
    const body: Record<string, unknown> = {};
    for (const field of fields) {
      const value = row[field];
      if (value !== undefined && value !== "") {
        body[field] = value;
      }
    }
    return body;
  }

  protected interpolatePath(
    template: string,
    row: Record<string, unknown>,
    context?: FromCsvRowContext,
  ): string {
    return template.replace(/\{(\w+)\}/g, (_match, key: string) => {
      if (key === "id") {
        return encodeURIComponent(String(this.identityValue(row, context)));
      }
      const value = row[key];
      if (value === undefined || value === "") {
        throw new AdapterError(`Missing path parameter "${key}"`);
      }
      return encodeURIComponent(String(value));
    });
  }

  protected callPlan(input: {
    method: HttpMethod;
    path: string;
    operation: string;
    query?: QueryParams;
    body?: unknown;
    resolvedId?: string | number;
  }): ApiCallPlan {
    const plan: ApiCallPlan = {
      method: input.method,
      path: input.path,
      operation: input.operation,
      retryable: !isDeleteLike(input.method, input.path, input.operation),
    };
    if (input.query !== undefined) {
      plan.query = input.query;
    }
    if (input.body !== undefined) {
      plan.body = input.body;
    }
    if (input.resolvedId !== undefined) {
      plan.resolvedId = input.resolvedId;
    }
    return plan;
  }
}
