/**
 * Unified content adapter for topics plus the five typed families:
 * questions, ideas, conversations, articles, product updates.
 *
 * List/export always goes through GET /topics (10,000-result cap).
 * Writes use the named-action endpoints on /{segment}/… (family client prefixes /v2).
 */
import { invalidField, looksLikeTopicCap, missingRequiredColumn, TOPIC_CAP_MESSAGE } from "../lib/errors.js";
import { DEFAULT_PAGE_SIZE } from "../lib/api/pagination.js";
import type { QueryParams } from "../lib/auth.js";
import type { RequestExtras } from "../lib/apiClient.js";
import {
  AdapterError,
  BaseAdapter,
  type ApiCallPlan,
  type ExportField,
  type FilterPrompt,
  type FromCsvRowContext,
  type HttpMethod,
  type ListPage,
  type PageRequest,
  type ResourceName,
  type ResourceOperation,
} from "./base.js";

export const TOPIC_LIST_CAP = 10_000;
export const COMMUNITY_MAX_PAGE_SIZE = 100;
export const TOPIC_CAP_HINT = TOPIC_CAP_MESSAGE;

export const CONTENT_RESOURCES = [
  "topics",
  "questions",
  "ideas",
  "conversations",
  "articles",
  "productUpdates",
] as const;

export type ContentResourceName = (typeof CONTENT_RESOURCES)[number];

export type ContentTypeKey = "question" | "idea" | "conversation" | "article" | "productUpdate";

interface ContentKind {
  resource: ContentResourceName;
  label: string;
  /** Path segment under /v2, e.g. questions. Empty for unified topics. */
  segment: string;
  contentType?: ContentTypeKey;
  createOperation?: string;
  createPath?: string;
  createRequiresCategory: boolean;
  hasPublish: boolean;
  hasIdeaStatus: boolean;
  hasProductAreas: boolean;
  hasChangeAuthor: boolean;
  hasParentSpam: boolean;
  conversions: Record<string, string>;
}

const KINDS: Record<ContentResourceName, ContentKind> = {
  topics: {
    resource: "topics",
    label: "Topics",
    segment: "",
    createRequiresCategory: false,
    hasPublish: false,
    hasIdeaStatus: false,
    hasProductAreas: false,
    hasChangeAuthor: false,
    hasParentSpam: false,
    conversions: {},
  },
  questions: {
    resource: "questions",
    label: "Questions",
    segment: "questions",
    contentType: "question",
    createOperation: "ask",
    createPath: "/questions/ask",
    createRequiresCategory: true,
    hasPublish: false,
    hasIdeaStatus: false,
    hasProductAreas: false,
    hasChangeAuthor: false,
    hasParentSpam: true,
    conversions: {
      conversation: "/questions/{id}/convert",
      idea: "/questions/{id}/convertToIdea",
    },
  },
  ideas: {
    resource: "ideas",
    label: "Ideas",
    segment: "ideas",
    contentType: "idea",
    createOperation: "submit",
    createPath: "/ideas/submit",
    createRequiresCategory: false,
    hasPublish: false,
    hasIdeaStatus: true,
    hasProductAreas: true,
    hasChangeAuthor: false,
    hasParentSpam: true,
    conversions: {
      question: "/ideas/{id}/convertToQuestion",
      conversation: "/ideas/{id}/convertToConversation",
    },
  },
  conversations: {
    resource: "conversations",
    label: "Conversations",
    segment: "conversations",
    contentType: "conversation",
    createOperation: "start",
    createPath: "/conversations/start",
    createRequiresCategory: true,
    hasPublish: false,
    hasIdeaStatus: false,
    hasProductAreas: false,
    hasChangeAuthor: false,
    hasParentSpam: true,
    conversions: {
      question: "/conversations/{id}/convert",
      article: "/conversations/{id}/convertToArticle",
      idea: "/conversations/{id}/convertToIdea",
    },
  },
  articles: {
    resource: "articles",
    label: "Articles",
    segment: "articles",
    contentType: "article",
    createOperation: "createArticle",
    createPath: "/articles/create",
    createRequiresCategory: true,
    hasPublish: true,
    hasIdeaStatus: false,
    hasProductAreas: false,
    hasChangeAuthor: true,
    hasParentSpam: false,
    conversions: {
      productUpdate: "/articles/{id}/convertToProductUpdate",
      conversation: "/articles/{id}/convertToConversation",
    },
  },
  productUpdates: {
    resource: "productUpdates",
    label: "Product updates",
    segment: "productUpdates",
    contentType: "productUpdate",
    createOperation: "createProductUpdate",
    createPath: "/productUpdates/create",
    createRequiresCategory: false,
    hasPublish: true,
    hasIdeaStatus: false,
    hasProductAreas: true,
    hasChangeAuthor: true,
    hasParentSpam: false,
    conversions: {},
  },
};

const CONVERT_OP_TO_TARGET: Record<string, string> = {
  convertToConversation: "conversation",
  convertToIdea: "idea",
  convertToArticle: "article",
  convertToProductUpdate: "productUpdate",
  convertToQuestion: "question",
};

/** True when a 422 from GET /topics is the 10,000-result cap (not a generic validation error). */
export function isTopicCapError(error: unknown): boolean {
  return looksLikeTopicCap(error);
}

export function isContentResourceName(value: string): value is ContentResourceName {
  return (CONTENT_RESOURCES as readonly string[]).includes(value);
}

export function pipeList(value: unknown): string[] {
  if (value === undefined || value === null || value === "") {
    return [];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item) => namesFrom(item));
  }
  return String(value)
    .split(/[|,]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function namesFrom(value: unknown): string[] {
  if (value === undefined || value === null || value === "") {
    return [];
  }
  if (typeof value === "string" || typeof value === "number") {
    return [String(value)];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item) => namesFrom(item));
  }
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    const name = record.name ?? record.id ?? record.tag;
    return name === undefined ? [] : [String(name)];
  }
  return [];
}

function asBoolean(value: unknown, field: string): boolean {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") {
      return true;
    }
    if (normalized === "false") {
      return false;
    }
  }
  throw new AdapterError(invalidField(field, "boolean", value));
}

function optionalBoolean(value: unknown, field: string): boolean | undefined {
  if (value === undefined || value === "") {
    return undefined;
  }
  return asBoolean(value, field);
}

function authorLabel(author: unknown): string {
  if (!author || typeof author !== "object") {
    return typeof author === "string" ? author : "";
  }
  const record = author as Record<string, unknown>;
  if (typeof record.username === "string" && record.username.length > 0) {
    return record.username;
  }
  if (record.id !== undefined) {
    return String(record.id);
  }
  return "";
}

function authorIdOf(author: unknown): string | undefined {
  if (!author || typeof author !== "object") {
    return undefined;
  }
  const id = (author as Record<string, unknown>).id;
  return id === undefined ? undefined : String(id);
}

export function normalizeTopic(data: unknown): Record<string, unknown> {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new AdapterError("Expected a topic object from the API");
  }
  const raw = data as Record<string, unknown>;
  const inner =
    raw.result && typeof raw.result === "object" && !Array.isArray(raw.result)
      ? (raw.result as Record<string, unknown>)
      : raw;
  const contentType = inner.contentType ?? inner.type;
  return {
    ...inner,
    id: inner.id,
    type: contentType,
    contentType,
    title: inner.title,
    content: inner.content,
    author: authorLabel(inner.author) || inner.author,
    authorId: authorIdOf(inner.author) ?? inner.authorId,
    category: inner.categoryName ?? inner.categoryId,
    categoryId: inner.categoryId,
    tags: namesFrom(inner.tags),
    moderatorTags: namesFrom(inner.moderatorTags),
    productAreas: namesFrom(inner.productAreas),
    status: inner.status,
    created: inner.createdAt ?? inner.created,
    updated: inner.lastActivityAt ?? inner.updated,
    closed: inner.closed,
    trashed: inner.trashed,
    sticky: inner.sticky,
    spam: inner.spam,
  };
}

function extrasOf(signal?: AbortSignal): RequestExtras {
  const extras: RequestExtras = {};
  if (signal !== undefined) {
    extras.signal = signal;
  }
  return extras;
}

export class ContentAdapter extends BaseAdapter {
  readonly name: ResourceName;
  readonly label: string;
  readonly family = "community" as const;
  readonly identity = "id" as const;
  private readonly kind: ContentKind;

  constructor(client: ConstructorParameters<typeof BaseAdapter>[0], resource: ContentResourceName) {
    super(client);
    this.kind = KINDS[resource];
    this.name = resource;
    this.label = this.kind.label;
  }

  async list(filters: QueryParams, page: PageRequest): Promise<ListPage> {
    const pageSize = Math.min(page.pageSize ?? DEFAULT_PAGE_SIZE, COMMUNITY_MAX_PAGE_SIZE);
    const query: QueryParams = {
      ...filters,
      page: page.page,
      pageSize,
    };
    if (this.kind.contentType && query["contentTypes[]"] === undefined && query.contentTypes === undefined) {
      query["contentTypes[]"] = [this.kind.contentType];
    }
    try {
      const response = await this.familyClient().get("/topics", query, extrasOf(page.signal));
      const records = this.itemsFrom(response.data).map((item) => normalizeTopic(item));
      const result = this.toListPage(records, page.page, pageSize);
      const fetchedThrough = (page.page - 1) * pageSize + result.records.length;
      if (fetchedThrough >= TOPIC_LIST_CAP) {
        return { ...result, exhausted: true, hitCap: true };
      }
      return result;
    } catch (error) {
      if (isTopicCapError(error)) {
        return {
          records: [],
          page: page.page,
          pageSize,
          exhausted: true,
          hitCap: true,
        };
      }
      throw error;
    }
  }

  async get(id: string | number, signal?: AbortSignal) {
    if (!this.kind.segment) {
      throw new AdapterError(
        "Unified topics have no get-by-id endpoint. Use questions, ideas, conversations, articles, or productUpdates.",
      );
    }
    const response = await this.familyClient().get(
      `/${this.kind.segment}/${encodeURIComponent(String(id))}`,
      undefined,
      extrasOf(signal),
    );
    return normalizeTopic(this.unwrapRecord(response.data));
  }

  async listReplies(id: string | number, page: PageRequest) {
    if (!this.kind.segment) {
      throw new AdapterError("Unified topics cannot list replies; use a typed content resource");
    }
    const pageSize = Math.min(page.pageSize ?? DEFAULT_PAGE_SIZE, COMMUNITY_MAX_PAGE_SIZE);
    const query: QueryParams = { page: page.page, pageSize };
    const response = await this.familyClient().get(
      `/${this.kind.segment}/${encodeURIComponent(String(id))}/replies`,
      query,
      extrasOf(page.signal),
    );
    const records = this.itemsFrom(response.data).map((item) => normalizeTopic(item));
    return this.toListPage(records, page.page, pageSize);
  }

  exportFields(): ExportField[] {
    return [
      { name: "id", kind: "string" },
      { name: "type", kind: "string" },
      { name: "title", kind: "string" },
      { name: "content", kind: "string" },
      { name: "author", kind: "string" },
      { name: "category", kind: "string" },
      { name: "tags", kind: "string[]" },
      { name: "moderatorTags", kind: "string[]" },
      { name: "productAreas", kind: "string[]" },
      { name: "status", kind: "string" },
      { name: "created", kind: "string" },
      { name: "updated", kind: "string" },
      { name: "closed", kind: "boolean" },
      { name: "trashed", kind: "boolean" },
      { name: "sticky", kind: "boolean" },
      { name: "spam", kind: "boolean" },
    ];
  }

  operations(): ResourceOperation[] {
    if (!this.kind.segment) {
      return [];
    }
    const createOp: ResourceOperation = {
      name: this.kind.createOperation ?? "create",
      kind: "create",
      label: `Create ${this.label.toLowerCase()}`,
      requiredColumns: this.kind.createRequiresCategory
        ? ["title", "content", "categoryId", "authorId"]
        : ["title", "content", "authorId"],
      optionalColumns: [
        "tags",
        "moderatorTags",
        "sticky",
        "closed",
        "moderatorId",
        "productAreaIds",
        "featuredImage",
        "publicLabel",
      ],
    };
    if (this.kind.hasPublish) {
      createOp.description = "Created as a draft until publish";
    }
    const ops: ResourceOperation[] = [
      createOp,
      {
        name: "createReply",
        kind: "create",
        label: "Create reply",
        requiredColumns: ["content", "authorId"],
      },
      {
        name: "editTitle",
        kind: "update",
        label: "Edit title",
        requiredColumns: ["title", "moderatorId"],
      },
      {
        name: "editContent",
        kind: "update",
        label: "Edit content",
        requiredColumns: ["content", "authorId"],
      },
      {
        name: "editTags",
        kind: "update",
        label: "Replace public tags",
        requiredColumns: ["tags", "authorId"],
      },
      {
        name: "addTags",
        kind: "update",
        label: "Add public tags",
        requiredColumns: ["tags", "authorId"],
      },
      {
        name: "removeTags",
        kind: "update",
        label: "Remove public tags",
        requiredColumns: ["tags", "authorId"],
      },
      {
        name: "editModeratorTags",
        kind: "update",
        label: "Replace moderator tags",
        requiredColumns: ["moderatorTags", "moderatorId"],
      },
      {
        name: "addModeratorTags",
        kind: "update",
        label: "Add moderator tags",
        requiredColumns: ["tags", "moderatorId"],
        optionalColumns: ["moderatorTags"],
      },
      {
        name: "removeModeratorTags",
        kind: "update",
        label: "Remove moderator tags",
        requiredColumns: ["tags", "moderatorId"],
        optionalColumns: ["moderatorTags"],
      },
      {
        name: "move",
        kind: "update",
        label: "Move to category",
        requiredColumns: ["categoryId", "moderatorId"],
      },
      {
        name: "toggleClosed",
        kind: "update",
        label: "Open or close",
        requiredColumns: ["closed", "moderatorId"],
      },
      {
        name: "toggleSticky",
        kind: "update",
        label: "Toggle sticky",
        requiredColumns: ["sticky", "moderatorId"],
      },
      {
        name: "toggleTrashed",
        kind: "delete",
        label: "Trash or restore",
        confirmation: "typed",
        requiredColumns: ["trashed", "moderatorId"],
      },
      {
        name: "permanentDelete",
        kind: "delete",
        label: "Permanently delete",
        description: "Only works on already-trashed content",
        confirmation: "typed",
        requiredColumns: ["moderatorId"],
      },
    ];
    if (this.kind.hasParentSpam) {
      ops.push({
        name: "toggleSpam",
        kind: "update",
        label: "Mark spam / not spam",
        description: "markAsSpam defaults banUser to false unless the CSV sets banUser=true",
        requiredColumns: ["spam", "moderatorId"],
        optionalColumns: ["banUser"],
      });
    }
    if (this.kind.hasIdeaStatus) {
      ops.push({
        name: "assignIdeaStatus",
        kind: "update",
        label: "Assign idea status",
        requiredColumns: ["ideaStatusId", "moderatorId"],
        optionalColumns: ["statusId"],
      });
    }
    if (this.kind.hasProductAreas) {
      ops.push({
        name: "assignProductAreas",
        kind: "update",
        label: "Replace product areas",
        requiredColumns: ["productAreas", "moderatorId"],
        optionalColumns: ["productAreaIds"],
      });
    }
    if (this.kind.hasChangeAuthor) {
      ops.push({
        name: "changeAuthor",
        kind: "update",
        label: "Change author",
        requiredColumns: ["authorId", "moderatorId"],
      });
    }
    if (this.kind.hasPublish) {
      ops.push({
        name: "publish",
        kind: "update",
        label: "Publish draft",
        requiredColumns: ["moderatorId"],
      });
    }
    if (Object.keys(this.kind.conversions).length > 0) {
      ops.push({
        name: "convertType",
        kind: "update",
        label: "Convert content type",
        requiredColumns: ["targetType", "moderatorId"],
      });
    }
    return ops;
  }

  fromCsvRow(
    row: Record<string, unknown>,
    operation: string,
    context?: FromCsvRowContext,
  ): ApiCallPlan {
    if (!this.kind.segment) {
      throw new AdapterError(
        "Unified topics are explore/export only. Choose questions, ideas, conversations, articles, or productUpdates for writes.",
      );
    }
    const resolved = this.resolveWriteOperation(operation);
    const spec = this.requireOperation(
      CONVERT_OP_TO_TARGET[resolved] ? "convertType" : resolved,
    );
    if (resolved === this.kind.createOperation) {
      this.requireFields(row, spec.requiredColumns, resolved);
      return this.callPlan({
        method: "POST",
        path: this.kind.createPath ?? `/${this.kind.segment}`,
        operation: resolved,
        query: this.actorQuery(row, ["authorId"], ["moderatorId"]),
        body: this.createBody(row),
      });
    }
    if (resolved === "createReply") {
      this.requireFields(row, spec.requiredColumns, resolved);
      const parentId = this.identityValue(row, context);
      return this.callPlan({
        method: "POST",
        path: `/${this.kind.segment}/${encodeURIComponent(String(parentId))}/reply`,
        operation: resolved,
        query: this.actorQuery(row, ["authorId"]),
        body: { content: row.content },
        resolvedId: parentId,
      });
    }

    const id = this.identityValue(row, context);
    const encoded = encodeURIComponent(String(id));
    const base = `/${this.kind.segment}/${encoded}`;

    if (resolved === "editTitle") {
      this.requireFields(row, spec.requiredColumns, resolved);
      return this.moderatorPost(`${base}/editTitle`, resolved, row, id, { title: String(row.title) });
    }
    if (resolved === "editContent") {
      this.requireFields(row, spec.requiredColumns, resolved);
      return this.callPlan({
        method: "POST",
        path: `${base}/editContent`,
        operation: resolved,
        query: this.actorQuery(row, ["authorId"]),
        body: { content: String(row.content) },
        resolvedId: id,
      });
    }
    if (resolved === "editTags" || resolved === "addTags" || resolved === "removeTags") {
      this.requireFields(row, spec.requiredColumns, resolved);
      const tags = pipeList(row.tags);
      const path =
        resolved === "editTags"
          ? `${base}/editTags`
          : resolved === "addTags"
            ? `${base}/tags/add`
            : `${base}/tags/remove`;
      return this.callPlan({
        method: "POST",
        path,
        operation: resolved,
        query: this.actorQuery(row, ["authorId"]),
        body: { tags },
        resolvedId: id,
      });
    }
    if (resolved === "editModeratorTags") {
      this.requireFields(row, spec.requiredColumns, resolved);
      return this.moderatorPost(`${base}/editModeratorTags`, resolved, row, id, {
        moderatorTags: pipeList(row.moderatorTags ?? row.tags),
      });
    }
    if (resolved === "addModeratorTags" || resolved === "removeModeratorTags") {
      const tags = pipeList(row.tags ?? row.moderatorTags);
      if (tags.length === 0) {
        throw new AdapterError(missingRequiredColumn("tags", resolved));
      }
      const path =
        resolved === "addModeratorTags"
          ? `${base}/moderator-tags/add`
          : `${base}/moderator-tags/remove`;
      return this.moderatorPost(path, resolved, row, id, { tags });
    }
    if (resolved === "move") {
      this.requireFields(row, spec.requiredColumns, resolved);
      return this.moderatorPost(`${base}/move`, resolved, row, id, {
        categoryId: Number(row.categoryId),
      });
    }
    if (resolved === "toggleClosed") {
      this.requireFields(row, spec.requiredColumns, resolved);
      return this.moderatorPost(`${base}/toggleClosed`, resolved, row, id, {
        closed: asBoolean(row.closed, "closed"),
      });
    }
    if (resolved === "toggleSticky") {
      this.requireFields(row, spec.requiredColumns, resolved);
      return this.moderatorPost(`${base}/toggleStickyState`, resolved, row, id, {
        sticky: asBoolean(row.sticky, "sticky"),
      });
    }
    if (resolved === "toggleTrashed") {
      this.requireFields(row, spec.requiredColumns, resolved);
      return this.moderatorPost(`${base}/toggleTrashed`, resolved, row, id, {
        trashed: asBoolean(row.trashed, "trashed"),
      });
    }
    if (resolved === "toggleSpam") {
      if (!this.kind.hasParentSpam) {
        throw new AdapterError(`${this.label} does not support parent-level spam actions`);
      }
      this.requireFields(row, spec.requiredColumns, resolved);
      const spam = asBoolean(row.spam, "spam");
      const path = spam ? `${base}/markAsSpam` : `${base}/markAsNotSpam`;
      const plan: {
        method: HttpMethod;
        path: string;
        operation: string;
        query: QueryParams;
        body?: unknown;
        resolvedId: string | number;
      } = {
        method: "POST",
        path,
        operation: resolved,
        query: this.actorQuery(row, ["moderatorId"]),
        resolvedId: id,
      };
      if (spam) {
        plan.body = { banUser: optionalBoolean(row.banUser, "banUser") ?? false };
      }
      return this.callPlan(plan);
    }
    if (resolved === "permanentDelete") {
      this.requireFields(row, spec.requiredColumns, resolved);
      return this.callPlan({
        method: "DELETE",
        path: base,
        operation: resolved,
        query: this.actorQuery(row, ["moderatorId"]),
        resolvedId: id,
      });
    }
    if (resolved === "assignIdeaStatus") {
      this.requireFields(row, ["moderatorId"], resolved);
      const ideaStatusId = row.ideaStatusId ?? row.statusId;
      if (ideaStatusId === undefined || ideaStatusId === "") {
        throw new AdapterError(missingRequiredColumn("ideaStatusId", "assignIdeaStatus"));
      }
      return this.moderatorPost(`${base}/assignIdeaStatus`, resolved, row, id, {
        ideaStatusId: String(ideaStatusId),
      });
    }
    if (resolved === "assignProductAreas") {
      this.requireFields(row, ["moderatorId"], resolved);
      const productAreas = pipeList(row.productAreas ?? row.productAreaIds);
      if (productAreas.length === 0) {
        throw new AdapterError(missingRequiredColumn("productAreas", "assignProductAreas"));
      }
      return this.moderatorPost(`${base}/editProductAreas`, resolved, row, id, { productAreas });
    }
    if (resolved === "changeAuthor") {
      this.requireFields(row, spec.requiredColumns, resolved);
      return this.moderatorPost(`${base}/changeAuthor`, resolved, row, id, {
        authorId: String(row.authorId),
      });
    }
    if (resolved === "publish") {
      this.requireFields(row, spec.requiredColumns, resolved);
      return this.callPlan({
        method: "POST",
        path: `${base}/publish`,
        operation: resolved,
        query: this.actorQuery(row, ["moderatorId"]),
        resolvedId: id,
      });
    }
    if (resolved === "convertType" || CONVERT_OP_TO_TARGET[resolved]) {
      const target = resolved === "convertType" ? String(row.targetType ?? "") : CONVERT_OP_TO_TARGET[resolved];
      if (!target) {
        throw new AdapterError(missingRequiredColumn("targetType", "convertType"));
      }
      const template = this.kind.conversions[target];
      if (!template) {
        const available = Object.keys(this.kind.conversions).join(", ") || "(none)";
        throw new AdapterError(
          `Cannot convert ${this.label} to "${target}". Expected one of: ${available}`,
        );
      }
      return this.callPlan({
        method: "POST",
        path: template.replace("{id}", encoded),
        operation: resolved,
        query: this.actorQuery(row, ["moderatorId"]),
        resolvedId: id,
      });
    }
    throw new AdapterError(`Unsupported ${this.name} operation "${operation}"`);
  }

  describeFilters(): FilterPrompt[] {
    const filters: FilterPrompt[] = [
      { name: "q", label: "Search title/content", type: "string" },
      { name: "categoryIds[]", label: "Category IDs", type: "string[]", description: "Pipe-separated category ids" },
      { name: "tags", label: "Public tags", type: "string", description: "Comma-separated public tags" },
      { name: "moderatorTags", label: "Moderator tags", type: "string" },
      { name: "createdAt[from]", label: "Created from", type: "date" },
      { name: "createdAt[to]", label: "Created to", type: "date" },
      { name: "lastActivityAt[from]", label: "Last activity from", type: "date" },
      { name: "lastActivityAt[to]", label: "Last activity to", type: "date" },
      {
        name: "sort",
        label: "Sort",
        type: "string",
        choices: [
          { value: "lastActivityAt", label: "Last activity" },
          { value: "createdAt", label: "Created" },
          { value: "likes", label: "Likes" },
          { value: "voteCount", label: "Votes" },
          { value: "replyCount", label: "Replies" },
        ],
      },
    ];
    if (!this.kind.contentType) {
      filters.splice(2, 0, {
        name: "contentTypes[]",
        label: "Content types",
        type: "string[]",
        description: "question, idea, conversation, article, productUpdate",
      });
    }
    return filters;
  }

  private resolveWriteOperation(operation: string): string {
    if (operation === "create" && this.kind.createOperation) {
      return this.kind.createOperation;
    }
    return operation;
  }

  private actorQuery(
    row: Record<string, unknown>,
    required: Array<"authorId" | "moderatorId">,
    optional: Array<"authorId" | "moderatorId"> = [],
  ): QueryParams {
    const query: QueryParams = {};
    for (const key of required) {
      const value = row[key];
      if (value === undefined || value === "") {
        throw new AdapterError(`Operation requires ${key}`);
      }
      query[key] = String(value);
    }
    for (const key of optional) {
      const value = row[key];
      if (value !== undefined && value !== "") {
        query[key] = String(value);
      }
    }
    return query;
  }

  private moderatorPost(
    path: string,
    operation: string,
    row: Record<string, unknown>,
    id: string | number,
    body: unknown,
  ): ApiCallPlan {
    return this.callPlan({
      method: "POST",
      path,
      operation,
      query: this.actorQuery(row, ["moderatorId"]),
      body,
      resolvedId: id,
    });
  }

  private createBody(row: Record<string, unknown>): Record<string, unknown> {
    const body: Record<string, unknown> = {
      title: row.title,
      content: row.content,
    };
    if (row.categoryId !== undefined && row.categoryId !== "") {
      body.categoryId = Number(row.categoryId);
    }
    const tags = pipeList(row.tags);
    if (tags.length > 0) {
      body.tags = tags;
    }
    const moderatorTags = pipeList(row.moderatorTags);
    if (moderatorTags.length > 0) {
      body.moderatorTags = moderatorTags;
    }
    const sticky = optionalBoolean(row.sticky, "sticky");
    if (sticky !== undefined) {
      body.sticky = sticky;
    }
    const closed = optionalBoolean(row.closed, "closed");
    if (closed !== undefined) {
      body.closed = closed;
    }
    if (this.kind.hasProductAreas) {
      const areas = pipeList(row.productAreaIds ?? row.productAreas);
      if (areas.length > 0) {
        body.productAreaIds = areas.join(",");
      }
    }
    if (row.featuredImage) {
      body.featuredImage = row.featuredImage;
    }
    if (row.publicLabel) {
      body.publicLabel = row.publicLabel;
    }
    return body;
  }
}
