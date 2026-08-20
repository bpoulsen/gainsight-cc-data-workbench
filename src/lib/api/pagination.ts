export const DEFAULT_PAGE_SIZE = 25;
export const DEFAULT_START_PAGE = 1;

const PAGE_ARRAY_KEYS = [
  "result",
  "users",
  "community",
  "tags",
  "data",
  "items",
  "events",
] as const;

const PAGE_META_KEYS = new Set([
  "statistics",
  "meta",
  "page",
  "pageSize",
  "total",
  "count",
]);

export function extractPageItems(data: unknown): unknown[] {
  if (Array.isArray(data)) {
    return data;
  }
  if (!data || typeof data !== "object") {
    return [];
  }
  const record = data as Record<string, unknown>;
  for (const key of PAGE_ARRAY_KEYS) {
    const value = record[key];
    if (Array.isArray(value)) {
      return value;
    }
  }

  const keyedObjects = Object.entries(record)
    .filter(([key, value]) => !PAGE_META_KEYS.has(key) && isRecord(value))
    .map(([, value]) => value);
  return keyedObjects;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function isShortOrEmptyPage(itemCount: number, pageSize: number): boolean {
  return itemCount === 0 || itemCount < pageSize;
}
