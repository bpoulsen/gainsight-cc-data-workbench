/**
 * Split a topic export that would hit the 10,000-result GET /v2/topics cap
 * into smaller queries (category, created month, or content type).
 */
import type { QueryParams } from "./auth.js";

export const SHARD_BY_VALUES = ["category", "date", "contentType"] as const;
export type ShardBy = (typeof SHARD_BY_VALUES)[number];

export const CONTENT_TYPE_VALUES = [
  "question",
  "idea",
  "conversation",
  "article",
  "productUpdate",
] as const;
export type ContentTypeValue = (typeof CONTENT_TYPE_VALUES)[number];

export const TOPIC_SHARD_RESOURCES = [
  "topics",
  "questions",
  "ideas",
  "conversations",
  "articles",
  "productUpdates",
] as const;

export const SHARD_CAP_HINT =
  "A shard still hit the 10,000-topic cap. Narrow further (category × date) or split that shard manually. See docs/FILTER_SHARDING.md.";

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

export class FilterShardError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FilterShardError";
  }
}

export interface CategoryRef {
  id: string | number;
  name?: unknown;
}

export interface TopicShard {
  id: string;
  label: string;
  filters: QueryParams;
}

export function isTopicShardResource(name: string): boolean {
  return (TOPIC_SHARD_RESOURCES as readonly string[]).includes(name);
}

export function parseShardBy(raw: string): ShardBy {
  const value = raw.trim();
  if ((SHARD_BY_VALUES as readonly string[]).includes(value)) {
    return value as ShardBy;
  }
  throw new FilterShardError(
    `--shard-by must be category, date, or contentType (got "${raw}")`,
  );
}

export function availableShardStrategies(resource: string): ShardBy[] {
  if (!isTopicShardResource(resource)) {
    return [];
  }
  if (resource === "topics") {
    return ["contentType", "category", "date"];
  }
  return ["category", "date"];
}

export function parseIsoDate(value: string, field: string): Date {
  const match = ISO_DATE.exec(value.trim());
  if (!match) {
    throw new FilterShardError(`${field} must be YYYY-MM-DD (got "${value}")`);
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new FilterShardError(`${field} is not a valid calendar date (got "${value}")`);
  }
  return date;
}

export function formatIsoDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function defaultDateWindow(now: Date = new Date()): { from: string; to: string } {
  const to = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const from = new Date(Date.UTC(to.getUTCFullYear(), to.getUTCMonth() - 11, 1));
  return { from: formatIsoDate(from), to: formatIsoDate(to) };
}

export function mergeShardFilters(base: QueryParams, overlay: QueryParams): QueryParams {
  return { ...base, ...overlay };
}

export function sanitizeShardId(value: string): string {
  const trimmed = value.trim().replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  return trimmed.length > 0 ? trimmed : "shard";
}

export function shardFilePath(outPath: string, shardId: string): string {
  const safe = sanitizeShardId(shardId);
  const lastSlash = Math.max(outPath.lastIndexOf("/"), outPath.lastIndexOf("\\"));
  const dir = lastSlash >= 0 ? outPath.slice(0, lastSlash + 1) : "";
  const file = lastSlash >= 0 ? outPath.slice(lastSlash + 1) : outPath;
  const dot = file.lastIndexOf(".");
  if (dot <= 0) {
    return `${dir}${file}.${safe}.csv`;
  }
  return `${dir}${file.slice(0, dot)}.${safe}${file.slice(dot)}`;
}

export function contentTypeFilterShards(base: QueryParams): TopicShard[] {
  return CONTENT_TYPE_VALUES.map((type) => ({
    id: type,
    label: type,
    filters: mergeShardFilters(base, { "contentTypes[]": [type] }),
  }));
}

export function categoryFilterShards(base: QueryParams, categories: readonly CategoryRef[]): TopicShard[] {
  const requested = requestedCategoryIds(base);
  const source =
    requested.length > 0
      ? categories.filter((item) => requested.includes(String(item.id)))
      : categories;
  const shards: TopicShard[] = [];
  const seen = new Set<string>();
  for (const item of source) {
    if (item.id === undefined || item.id === "") {
      continue;
    }
    const id = String(item.id);
    if (seen.has(id)) {
      continue;
    }
    seen.add(id);
    const name = typeof item.name === "string" && item.name.length > 0 ? item.name : id;
    shards.push({
      id: `cat-${id}`,
      label: name,
      filters: mergeShardFilters(base, { "categoryIds[]": [id] }),
    });
  }
  if (shards.length === 0) {
    throw new FilterShardError("No categories available to shard on");
  }
  return shards;
}

export function dateFilterShards(base: QueryParams, fromRaw: string, toRaw: string): TopicShard[] {
  const from = parseIsoDate(fromRaw, "created-from");
  const to = parseIsoDate(toRaw, "created-to");
  if (from.getTime() > to.getTime()) {
    throw new FilterShardError("created-from must be on or before created-to");
  }
  const shards: TopicShard[] = [];
  let cursor = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), 1));
  const endMonth = new Date(Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), 1));
  while (cursor.getTime() <= endMonth.getTime()) {
    const monthStart = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth(), 1));
    const monthEnd = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 0));
    const windowFrom = formatIsoDate(new Date(Math.max(from.getTime(), monthStart.getTime())));
    const windowTo = formatIsoDate(new Date(Math.min(to.getTime(), monthEnd.getTime())));
    const id = `${cursor.getUTCFullYear()}-${String(cursor.getUTCMonth() + 1).padStart(2, "0")}`;
    shards.push({
      id,
      label: `${windowFrom} … ${windowTo}`,
      filters: mergeShardFilters(base, {
        "createdAt[from]": windowFrom,
        "createdAt[to]": windowTo,
      }),
    });
    cursor = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 1));
  }
  return shards;
}

function requestedCategoryIds(base: QueryParams): string[] {
  const raw = base["categoryIds[]"] ?? base.categoryIds;
  if (raw === undefined || raw === "") {
    return [];
  }
  if (Array.isArray(raw)) {
    return raw.map((item) => String(item).trim()).filter((item) => item.length > 0);
  }
  return String(raw)
    .split(/[|,]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}
