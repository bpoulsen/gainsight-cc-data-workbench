/**
 * Search adapter: community content search and tag search (explore/export only).
 *
 * Family client is unprefixed. GET /search requires q. Federated index
 * write/delete (/external-content/*) is out of v1.
 */
import { DEFAULT_PAGE_SIZE } from "../lib/api/pagination.js";
import type { QueryParams } from "../lib/auth.js";
import type { RequestExtras } from "../lib/apiClient.js";
import { pipeList } from "./content.js";
import { invalidField } from "../lib/errors.js";
import { asIdList } from "./users.js";
import {
  AdapterError,
  BaseAdapter,
  type ApiCallPlan,
  type ExportField,
  type FilterPrompt,
  type ListPage,
  type PageRequest,
  type ResourceOperation,
} from "./base.js";

/** OpenAPI: pageSize is 1–200 (default 50). */
export const SEARCH_MAX_PAGE_SIZE = 200;

function extrasOf(signal?: AbortSignal): RequestExtras {
  const extras: RequestExtras = {};
  if (signal !== undefined) {
    extras.signal = signal;
  }
  return extras;
}

function optionalString(filters: QueryParams, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = filters[key];
    if (value !== undefined && value !== "") {
      return String(value);
    }
  }
  return undefined;
}

function isTruthyFlag(value: unknown): boolean {
  if (value === true || value === 1) {
    return true;
  }
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "true" || normalized === "1" || normalized === "yes";
  }
  return false;
}

function optionalBoolean(value: unknown): boolean | undefined {
  if (value === undefined || value === "") {
    return undefined;
  }
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true" || normalized === "1" || normalized === "yes") {
      return true;
    }
    if (normalized === "false" || normalized === "0" || normalized === "no") {
      return false;
    }
  }
  throw new AdapterError(invalidField("hasAnswer", "boolean", value));
}

export function normalizeSearchHit(data: unknown): Record<string, unknown> {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new AdapterError("Expected a search hit from the API");
  }
  const raw = data as Record<string, unknown>;
  const contentType = raw.contentType ?? raw.type;
  return {
    ...raw,
    id: raw.id,
    publicId: raw.publicId,
    contentType,
    type: contentType,
    title: raw.title,
    content: raw.content,
    firstPost: raw.firstPost,
    url: raw.url,
    categoryId: raw.categoryId,
    categoryName: raw.categoryName,
    sectionName: raw.sectionName,
    parentCategoryName: raw.parentCategoryName,
    tags: Array.isArray(raw.tags) ? raw.tags.map((tag) => String(tag)) : raw.tags,
    hasAnswer: raw.hasAnswer,
    authorId: raw.authorId,
    authorName: raw.authorName,
    createdAt: raw.createdAt,
  };
}

export function normalizeTagHit(data: unknown): Record<string, unknown> {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new AdapterError("Expected a tag search hit from the API");
  }
  const raw = data as Record<string, unknown>;
  return {
    id: raw.id,
    name: raw.name,
    count: raw.count,
  };
}

export class SearchAdapter extends BaseAdapter {
  readonly name = "search" as const;
  readonly label = "Search";
  readonly family = "search" as const;
  readonly identity = "id" as const;

  async list(filters: QueryParams, page: PageRequest): Promise<ListPage> {
    const pageSize = Math.min(Math.max(page.pageSize ?? DEFAULT_PAGE_SIZE, 1), SEARCH_MAX_PAGE_SIZE);
    if (isTruthyFlag(filters.searchTags)) {
      return this.listTags(filters, page.page, pageSize, page.signal);
    }
    const q = optionalString(filters, "q");
    if (q === undefined) {
      throw new AdapterError("Search requires q (or set searchTags=true to search tags)");
    }
    const query: QueryParams = { q, page: page.page, pageSize };
    const contentTypes = pipeList(filters.contentTypes);
    if (contentTypes.length > 0) {
      query.contentTypes = contentTypes;
    }
    const categoryIds = pipeList(filters.categoryIds);
    if (categoryIds.length > 0) {
      query.categoryIds = asIdList(categoryIds, "categoryIds");
    }
    const sections = pipeList(filters.sections);
    if (sections.length > 0) {
      query.sections = sections;
    }
    const parentCategories = pipeList(filters.parentCategories);
    if (parentCategories.length > 0) {
      query.parentCategories = parentCategories;
    }
    const tags = pipeList(filters.tags);
    if (tags.length > 0) {
      query.tags = tags;
    }
    const moderatorTags = pipeList(filters.moderatorTags);
    if (moderatorTags.length > 0) {
      query.moderatorTags = moderatorTags;
    }
    const hasAnswer = optionalBoolean(filters.hasAnswer);
    if (hasAnswer !== undefined) {
      query.hasAnswer = hasAnswer;
    }
    const response = await this.familyClient().get("/search", query, extrasOf(page.signal));
    const records = this.itemsFrom(response.data).map((item) => normalizeSearchHit(item));
    return this.toListPage(records, page.page, pageSize);
  }

  async get(_id: string | number, _signal?: AbortSignal): Promise<Record<string, unknown>> {
    throw new AdapterError("Search is explore/export only — there is no get-by-id endpoint");
  }

  exportFields(): ExportField[] {
    return [
      { name: "id", kind: "number" },
      { name: "publicId", kind: "number" },
      { name: "contentType", kind: "string" },
      { name: "type", kind: "string" },
      { name: "title", kind: "string" },
      { name: "content", kind: "string" },
      { name: "url", kind: "string" },
      { name: "categoryId", kind: "number" },
      { name: "categoryName", kind: "string" },
      { name: "tags", kind: "string[]" },
      { name: "hasAnswer", kind: "boolean" },
      { name: "authorId", kind: "number" },
      { name: "authorName", kind: "string" },
      { name: "createdAt", kind: "number" },
      { name: "name", kind: "string" },
      { name: "count", kind: "number" },
    ];
  }

  operations(): ResourceOperation[] {
    return [];
  }

  fromCsvRow(_row: Record<string, unknown>, operation: string): ApiCallPlan {
    this.requireOperation(operation);
    throw new AdapterError(`Unsupported search operation "${operation}"`);
  }

  describeFilters(): FilterPrompt[] {
    return [
      {
        name: "q",
        label: "Query",
        type: "string",
        description: "Required for content search",
      },
      {
        name: "contentTypes",
        label: "Content types",
        type: "string[]",
        description: "Pipe-separated (question|idea|article|…)",
      },
      {
        name: "categoryIds",
        label: "Category IDs",
        type: "string[]",
      },
      {
        name: "tags",
        label: "Tags",
        type: "string[]",
      },
      {
        name: "moderatorTags",
        label: "Moderator tags",
        type: "string[]",
      },
      {
        name: "hasAnswer",
        label: "Has answer",
        type: "boolean",
      },
      {
        name: "searchTags",
        label: "Search tags instead of content",
        type: "boolean",
        description: "GET /search/tags — q is optional",
      },
    ];
  }

  private async listTags(
    filters: QueryParams,
    page: number,
    pageSize: number,
    signal?: AbortSignal,
  ): Promise<ListPage> {
    const query: QueryParams = { page, pageSize };
    const q = optionalString(filters, "q");
    if (q !== undefined) {
      query.q = q;
    }
    const response = await this.familyClient().get("/search/tags", query, extrasOf(signal));
    const records = this.itemsFrom(response.data).map((item) => normalizeTagHit(item));
    return this.toListPage(records, page, pageSize);
  }
}
