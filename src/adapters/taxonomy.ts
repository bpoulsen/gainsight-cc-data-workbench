/**
 * Taxonomy adapters: categories, public tags, moderator tags, product areas,
 * and idea statuses.
 *
 * Paths follow the Community OpenAPI (family client prefixes /v2). There is no
 * generic PATCH. Categories are explore/export only — the API has list, get,
 * and getTree, but no create/update/delete. Moderator tags have list + delete
 * only (no create endpoint in the spec).
 */
import { DEFAULT_PAGE_SIZE } from "../lib/api/pagination.js";
import type { QueryParams } from "../lib/auth.js";
import type { RequestExtras } from "../lib/apiClient.js";
import { COMMUNITY_MAX_PAGE_SIZE, pipeList } from "./content.js";
import {
  AdapterError,
  BaseAdapter,
  type ApiCallPlan,
  type ExportField,
  type FilterPrompt,
  type FromCsvRowContext,
  type ListPage,
  type PageRequest,
  type ResourceName,
  type ResourceOperation,
} from "./base.js";

export const TAXONOMY_RESOURCES = [
  "categories",
  "tags",
  "moderatorTags",
  "productAreas",
  "ideaStatuses",
] as const;

export type TaxonomyResourceName = (typeof TAXONOMY_RESOURCES)[number];

const GET_SCAN_MAX_PAGES = 100;
const DEFAULT_TREE_MODULES = ["community"] as const;
const TREE_FILTER_KEYS = new Set([
  "tree",
  "module",
  "module[]",
  "topLevelSectionIds",
  "topLevelSectionIds[]",
]);

type TaxonomyKind = {
  resource: TaxonomyResourceName;
  label: string;
  listPath: string;
  getPath?: string;
};

const KINDS: Record<TaxonomyResourceName, TaxonomyKind> = {
  categories: { resource: "categories", label: "Categories", listPath: "/categories", getPath: "/categories/{id}" },
  tags: { resource: "tags", label: "Tags", listPath: "/tags" },
  moderatorTags: { resource: "moderatorTags", label: "Moderator tags", listPath: "/moderatorTags" },
  productAreas: { resource: "productAreas", label: "Product areas", listPath: "/productAreas" },
  ideaStatuses: { resource: "ideaStatuses", label: "Idea statuses", listPath: "/ideas/ideaStatuses" },
};

export function isTaxonomyResourceName(value: string): value is TaxonomyResourceName {
  return (TAXONOMY_RESOURCES as readonly string[]).includes(value);
}

function extrasOf(signal?: AbortSignal): RequestExtras {
  const extras: RequestExtras = {};
  if (signal !== undefined) {
    extras.signal = signal;
  }
  return extras;
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
  throw new AdapterError(`${field} must be true or false`);
}

function optionalBoolean(value: unknown, field: string): boolean | undefined {
  if (value === undefined || value === "") {
    return undefined;
  }
  return asBoolean(value, field);
}

function optionalString(value: unknown): string | undefined {
  if (value === undefined || value === "") {
    return undefined;
  }
  return String(value);
}

function isTreeRequest(filters: QueryParams): boolean {
  const raw = filters.tree;
  if (raw === undefined || raw === "") {
    return false;
  }
  if (typeof raw === "boolean") {
    return raw;
  }
  return String(raw).toLowerCase() === "true";
}

function omitKeys(filters: QueryParams, keys: Set<string>): QueryParams {
  const query: QueryParams = {};
  for (const [key, value] of Object.entries(filters)) {
    if (!keys.has(key) && value !== undefined && value !== "") {
      query[key] = value;
    }
  }
  return query;
}

function childNodes(value: unknown): unknown[] {
  if (value === undefined || value === null || value === "") {
    return [];
  }
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (record.id !== undefined) {
      return [record];
    }
    return Object.values(record);
  }
  return [];
}

/** Flatten GET /category/getTree into CSV rows with parent_id. */
export function flattenCategoryTree(data: unknown): Record<string, unknown>[] {
  if (!data || typeof data !== "object") {
    return [];
  }
  const root = data as Record<string, unknown>;
  const grouped =
    root.result && typeof root.result === "object" && !Array.isArray(root.result)
      ? (root.result as Record<string, unknown>)
      : root;
  const rows: Record<string, unknown>[] = [];

  const walk = (nodes: unknown, module: string, inheritedParent: unknown): void => {
    for (const node of childNodes(nodes)) {
      if (!node || typeof node !== "object" || Array.isArray(node)) {
        continue;
      }
      const item = node as Record<string, unknown>;
      const parent =
        item.parentId === undefined || item.parentId === null ? inheritedParent : item.parentId;
      rows.push({
        id: item.id,
        name: item.title ?? item.name,
        title: item.title ?? item.name,
        description: item.description ?? "",
        parent_id: parent === undefined ? "" : parent,
        type: item.type ?? module,
        module,
        isSection: item.isSection,
        displayOrder: item.displayOrder ?? item.order,
        order: item.displayOrder ?? item.order,
        heroImage: item.heroImage ?? "",
        thumbnailImage: item.thumbnailImage ?? "",
      });
      walk(item.children, module, item.id);
    }
  };

  for (const [module, nodes] of Object.entries(grouped)) {
    walk(nodes, module, "");
  }
  return rows;
}

export function normalizeTaxonomyRecord(data: unknown): Record<string, unknown> {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new AdapterError("Expected a taxonomy object from the API");
  }
  const raw = data as Record<string, unknown>;
  const inner =
    raw.result && typeof raw.result === "object" && !Array.isArray(raw.result)
      ? (raw.result as Record<string, unknown>)
      : raw;
  return {
    ...inner,
    id: inner.id,
    name: inner.name ?? inner.title,
    parent_id: inner.parent_id ?? inner.parentId ?? "",
  };
}

export class TaxonomyAdapter extends BaseAdapter {
  readonly name: ResourceName;
  readonly label: string;
  readonly family = "community" as const;
  readonly identity = "id" as const;
  private readonly kind: TaxonomyKind;

  constructor(client: ConstructorParameters<typeof BaseAdapter>[0], resource: TaxonomyResourceName) {
    super(client);
    this.kind = KINDS[resource];
    this.name = resource;
    this.label = this.kind.label;
  }

  async list(filters: QueryParams, page: PageRequest): Promise<ListPage> {
    if (this.name === "categories" && isTreeRequest(filters)) {
      return this.listCategoryTree(filters, page);
    }
    const pageSize = Math.min(page.pageSize ?? DEFAULT_PAGE_SIZE, COMMUNITY_MAX_PAGE_SIZE);
    const query: QueryParams = {
      ...omitKeys(filters, TREE_FILTER_KEYS),
      page: page.page,
      pageSize,
    };
    const response = await this.familyClient().get(this.kind.listPath, query, extrasOf(page.signal));
    const records = this.itemsFrom(response.data).map((item) => normalizeTaxonomyRecord(item));
    return this.toListPage(records, page.page, pageSize);
  }

  async get(id: string | number, signal?: AbortSignal) {
    if (this.kind.getPath) {
      const path = this.kind.getPath.replace("{id}", encodeURIComponent(String(id)));
      const response = await this.familyClient().get(path, undefined, extrasOf(signal));
      return normalizeTaxonomyRecord(this.unwrapRecord(response.data));
    }
    return this.scanForId(id, signal);
  }

  exportFields(): ExportField[] {
    if (this.name === "categories") {
      return [
        { name: "id", kind: "string" },
        { name: "name", kind: "string" },
        { name: "description", kind: "string" },
        { name: "parent_id", kind: "string" },
        { name: "order", kind: "number" },
        { name: "displayOrder", kind: "number" },
        { name: "type", kind: "string" },
        { name: "isSection", kind: "boolean" },
        { name: "module", kind: "string" },
      ];
    }
    if (this.name === "ideaStatuses") {
      return [
        { name: "id", kind: "string" },
        { name: "name", kind: "string" },
        { name: "backgroundColor", kind: "string" },
        { name: "textColor", kind: "string" },
        { name: "default", kind: "boolean" },
        { name: "visible", kind: "boolean" },
        { name: "type", kind: "string" },
        { name: "displayOrder", kind: "number" },
      ];
    }
    if (this.name === "productAreas") {
      return [
        { name: "id", kind: "string" },
        { name: "name", kind: "string" },
        { name: "parent_id", kind: "string" },
      ];
    }
    return [
      { name: "id", kind: "string" },
      { name: "name", kind: "string" },
    ];
  }

  operations(): ResourceOperation[] {
    if (this.name === "categories") {
      return [];
    }
    if (this.name === "tags") {
      return [
        {
          name: "create",
          kind: "create",
          label: "Create public tag",
          requiredColumns: ["name", "authorId"],
        },
        {
          name: "rename",
          kind: "update",
          label: "Rename public tag",
          requiredColumns: ["id", "name", "moderatorId"],
        },
        {
          name: "delete",
          kind: "delete",
          label: "Delete public tag",
          description: "Removes the tag from associated content",
          confirmation: "typed",
          requiredColumns: ["id", "moderatorId"],
        },
        {
          name: "merge",
          kind: "update",
          label: "Merge public tags",
          requiredColumns: ["name", "ids", "moderatorId"],
        },
      ];
    }
    if (this.name === "moderatorTags") {
      return [
        {
          name: "delete",
          kind: "delete",
          label: "Delete moderator tags",
          description: "The Community API has no create-moderator-tag endpoint; tags are created when applied to content",
          confirmation: "typed",
          requiredColumns: ["id", "moderatorId"],
          optionalColumns: ["ids"],
        },
      ];
    }
    if (this.name === "productAreas") {
      return [
        {
          name: "create",
          kind: "create",
          label: "Create product area",
          requiredColumns: ["name", "authorId"],
          optionalColumns: ["parentId"],
        },
        {
          name: "rename",
          kind: "update",
          label: "Rename product area",
          requiredColumns: ["id", "name", "moderatorId"],
        },
        {
          name: "delete",
          kind: "delete",
          label: "Delete product area",
          description: "Affects ideas and product updates using this area",
          confirmation: "typed",
          requiredColumns: ["id", "moderatorId"],
        },
      ];
    }
    return [
      {
        name: "create",
        kind: "create",
        label: "Create idea status",
        requiredColumns: ["name", "authorId"],
        optionalColumns: ["backgroundColor", "textColor", "default", "visible", "type"],
      },
      {
        name: "edit",
        kind: "update",
        label: "Edit idea status",
        requiredColumns: ["id", "name", "moderatorId"],
        optionalColumns: ["backgroundColor", "textColor", "default", "visible", "type"],
      },
      {
        name: "changeType",
        kind: "update",
        label: "Change idea status type",
        requiredColumns: ["id", "type", "moderatorId"],
      },
      {
        name: "reorder",
        kind: "update",
        label: "Reorder idea statuses",
        requiredColumns: ["order", "moderatorId"],
      },
      {
        name: "delete",
        kind: "delete",
        label: "Delete idea status",
        description: "Permanently deletes the status; it cannot be restored",
        confirmation: "typed",
        requiredColumns: ["id", "moderatorId"],
      },
    ];
  }

  fromCsvRow(
    row: Record<string, unknown>,
    operation: string,
    context?: FromCsvRowContext,
  ): ApiCallPlan {
    const spec = this.requireOperation(operation);
    this.requireFields(row, spec.requiredColumns, operation);

    if (this.name === "tags") {
      return this.tagPlan(row, operation, context);
    }
    if (this.name === "moderatorTags") {
      return this.moderatorTagPlan(row, operation);
    }
    if (this.name === "productAreas") {
      return this.productAreaPlan(row, operation, context);
    }
    return this.ideaStatusPlan(row, operation, context);
  }

  describeFilters(): FilterPrompt[] {
    if (this.name === "categories") {
      return [
        {
          name: "authorId",
          label: "Author ID",
          type: "string",
          description: "Required to see non-public categories, and for tree export",
        },
        {
          name: "excludeGroups",
          label: "Exclude groups",
          type: "boolean",
          description: "When true, omit public/private/hidden groups",
        },
        {
          name: "tree",
          label: "Export category tree",
          type: "boolean",
          description: "true = GET /category/getTree flattened with parent_id",
        },
        {
          name: "module[]",
          label: "Tree modules",
          type: "string[]",
          description: "community, knowledge-base, groups (tree export only)",
        },
      ];
    }
    if (this.name === "ideaStatuses") {
      return [];
    }
    return [
      {
        name: "q",
        label: "Search name",
        type: "string",
      },
    ];
  }

  private async listCategoryTree(filters: QueryParams, page: PageRequest): Promise<ListPage> {
    const authorId = optionalString(filters.authorId);
    if (!authorId) {
      throw new AdapterError("Category tree export requires authorId");
    }
    const modules = pipeList(filters["module[]"] ?? filters.module);
    const query: QueryParams = {
      authorId,
      "module[]": modules.length > 0 ? modules : [...DEFAULT_TREE_MODULES],
    };
    const sections = pipeList(filters["topLevelSectionIds[]"] ?? filters.topLevelSectionIds);
    if (sections.length > 0) {
      query["topLevelSectionIds[]"] = sections.map((item) => Number(item));
    }
    const response = await this.familyClient().get("/category/getTree", query, extrasOf(page.signal));
    const records = flattenCategoryTree(response.data);
    const pageSize = records.length === 0 ? (page.pageSize ?? DEFAULT_PAGE_SIZE) : records.length;
    return {
      records,
      page: 1,
      pageSize,
      exhausted: true,
    };
  }

  private async scanForId(id: string | number, signal?: AbortSignal) {
    const target = String(id);
    for (let page = 1; page <= GET_SCAN_MAX_PAGES; page += 1) {
      const listed = await this.list({}, { page, pageSize: COMMUNITY_MAX_PAGE_SIZE, ...(signal ? { signal } : {}) });
      const found = listed.records.find(
        (row) => String(row.id) === target || String(row.name ?? "") === target,
      );
      if (found) {
        return found;
      }
      if (listed.exhausted) {
        break;
      }
    }
    throw new AdapterError(`${this.label} ${target} not found`);
  }

  private actorQuery(
    row: Record<string, unknown>,
    key: "authorId" | "moderatorId",
  ): QueryParams {
    const value = row[key];
    if (value === undefined || value === "") {
      throw new AdapterError(`Operation requires ${key}`);
    }
    return { [key]: String(value) };
  }

  private ideaStatusBody(row: Record<string, unknown>, nameRequired: boolean): Record<string, unknown> {
    const body: Record<string, unknown> = {};
    const name = optionalString(row.name);
    if (nameRequired) {
      if (!name) {
        throw new AdapterError("Operation requires name");
      }
      body.name = name;
    } else if (name !== undefined) {
      body.name = name;
    }
    const backgroundColor = optionalString(row.backgroundColor);
    if (backgroundColor !== undefined) {
      body.backgroundColor = backgroundColor;
    }
    const textColor = optionalString(row.textColor);
    if (textColor !== undefined) {
      body.textColor = textColor;
    }
    const isDefault = optionalBoolean(row.default, "default");
    if (isDefault !== undefined) {
      body.default = isDefault;
    }
    const visible = optionalBoolean(row.visible, "visible");
    if (visible !== undefined) {
      body.visible = visible;
    }
    const type = optionalString(row.type);
    if (type !== undefined) {
      body.type = type;
    }
    return body;
  }

  private tagPlan(
    row: Record<string, unknown>,
    operation: string,
    context?: FromCsvRowContext,
  ): ApiCallPlan {
    if (operation === "create") {
      return this.callPlan({
        method: "POST",
        path: "/tags/create",
        operation,
        query: this.actorQuery(row, "authorId"),
        body: { name: String(row.name) },
      });
    }
    if (operation === "rename") {
      const id = this.identityValue(row, context);
      return this.callPlan({
        method: "POST",
        path: "/tags/rename",
        operation,
        query: this.actorQuery(row, "moderatorId"),
        body: { id: String(id), name: String(row.name) },
        resolvedId: id,
      });
    }
    if (operation === "delete") {
      const id = this.identityValue(row, context);
      return this.callPlan({
        method: "POST",
        path: "/tags/delete",
        operation,
        query: this.actorQuery(row, "moderatorId"),
        body: { id: String(id) },
        resolvedId: id,
      });
    }
    if (operation === "merge") {
      return this.callPlan({
        method: "POST",
        path: "/tags/merge",
        operation,
        query: this.actorQuery(row, "moderatorId"),
        body: { name: String(row.name), ids: pipeList(row.ids) },
      });
    }
    throw new AdapterError(`Unsupported tags operation "${operation}"`);
  }

  private moderatorTagPlan(row: Record<string, unknown>, operation: string): ApiCallPlan {
    if (operation === "delete") {
      const ids = pipeList(row.ids ?? row.id);
      const firstId = ids[0];
      if (firstId === undefined) {
        throw new AdapterError("Operation delete requires id or ids");
      }
      return this.callPlan({
        method: "DELETE",
        path: "/moderatorTags/delete",
        operation,
        query: this.actorQuery(row, "moderatorId"),
        body: { moderatorTagIds: ids },
        resolvedId: firstId,
      });
    }
    throw new AdapterError(`Unsupported moderatorTags operation "${operation}"`);
  }

  private productAreaPlan(
    row: Record<string, unknown>,
    operation: string,
    context?: FromCsvRowContext,
  ): ApiCallPlan {
    if (operation === "create") {
      const body: Record<string, unknown> = { name: String(row.name) };
      const parentId = optionalString(row.parentId);
      if (parentId !== undefined) {
        body.parentId = parentId;
      }
      return this.callPlan({
        method: "POST",
        path: "/productAreas/create",
        operation,
        query: this.actorQuery(row, "authorId"),
        body,
      });
    }
    if (operation === "rename") {
      const id = this.identityValue(row, context);
      return this.callPlan({
        method: "POST",
        path: "/productAreas/rename",
        operation,
        query: this.actorQuery(row, "moderatorId"),
        body: { id: String(id), name: String(row.name) },
        resolvedId: id,
      });
    }
    if (operation === "delete") {
      const id = this.identityValue(row, context);
      return this.callPlan({
        method: "POST",
        path: "/productAreas/delete",
        operation,
        query: this.actorQuery(row, "moderatorId"),
        body: { id: String(id) },
        resolvedId: id,
      });
    }
    throw new AdapterError(`Unsupported productAreas operation "${operation}"`);
  }

  private ideaStatusPlan(
    row: Record<string, unknown>,
    operation: string,
    context?: FromCsvRowContext,
  ): ApiCallPlan {
    if (operation === "create") {
      return this.callPlan({
        method: "POST",
        path: "/ideas/createIdeaStatus",
        operation,
        query: this.actorQuery(row, "authorId"),
        body: this.ideaStatusBody(row, true),
      });
    }
    if (operation === "edit") {
      const id = this.identityValue(row, context);
      return this.callPlan({
        method: "POST",
        path: `/ideas/${encodeURIComponent(String(id))}/editIdeaStatus`,
        operation,
        query: this.actorQuery(row, "moderatorId"),
        body: this.ideaStatusBody(row, true),
        resolvedId: id,
      });
    }
    if (operation === "changeType") {
      const id = this.identityValue(row, context);
      return this.callPlan({
        method: "POST",
        path: `/ideas/ideaStatuses/${encodeURIComponent(String(id))}/changeType`,
        operation,
        query: this.actorQuery(row, "moderatorId"),
        body: { type: String(row.type) },
        resolvedId: id,
      });
    }
    if (operation === "reorder") {
      return this.callPlan({
        method: "POST",
        path: "/ideas/reorderIdeaStatuses",
        operation,
        query: this.actorQuery(row, "moderatorId"),
        body: { order: pipeList(row.order) },
      });
    }
    if (operation === "delete") {
      const id = this.identityValue(row, context);
      return this.callPlan({
        method: "DELETE",
        path: `/ideas/${encodeURIComponent(String(id))}/deleteIdeaStatus`,
        operation,
        query: this.actorQuery(row, "moderatorId"),
        resolvedId: id,
      });
    }
    throw new AdapterError(`Unsupported ideaStatuses operation "${operation}"`);
  }
}
