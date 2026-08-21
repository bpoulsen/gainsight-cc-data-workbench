/**
 * Run a topic export as multiple filtered queries so each stays under the 10k cap.
 */
import { mkdirSync, unlinkSync } from "node:fs";
import { dirname } from "node:path";
import type { ApiClient } from "../lib/apiClient.js";
import type { QueryParams } from "../lib/auth.js";
import { COMMUNITY_MAX_PAGE_SIZE } from "../adapters/content.js";
import type { IResourceAdapter } from "../adapters/base.js";
import { getAdapter } from "../adapters/index.js";
import { CsvReader, CsvWriter, peekCsvHeaders } from "../lib/csv.js";
import {
  availableShardStrategies,
  categoryFilterShards,
  contentTypeFilterShards,
  dateFilterShards,
  FilterShardError,
  isTopicShardResource,
  SHARD_CAP_HINT,
  shardFilePath,
  type CategoryRef,
  type ShardBy,
  type TopicShard,
} from "../lib/filterSharding.js";
import { exportResource, type ExportResult } from "./export.js";
import { JobAbortedError } from "../lib/errors.js";

export interface ShardExportOutcome {
  id: string;
  label: string;
  rowCount: number;
  hitCap: boolean;
  outPath: string;
  error?: string;
}

export interface ShardedExportResult {
  strategy: ShardBy;
  shards: ShardExportOutcome[];
  totalRows: number;
  hitCap: boolean;
  failed: number;
  outPath: string;
  separateFiles: boolean;
}

export interface ShardedExportOptions {
  adapter: IResourceAdapter;
  client: ApiClient;
  strategy: ShardBy;
  baseFilters?: QueryParams;
  outPath: string;
  separateFiles: boolean;
  createdFrom?: string;
  createdTo?: string;
  utf8Bom?: boolean;
  signal?: AbortSignal;
  exportResource?: typeof exportResource;
  listCategories?: (signal?: AbortSignal) => Promise<CategoryRef[]>;
  onShard?: (index: number, total: number, shard: TopicShard, outcome: ShardExportOutcome) => void;
}

export async function exportSharded(options: ShardedExportOptions): Promise<ShardedExportResult> {
  if (!isTopicShardResource(options.adapter.name)) {
    throw new FilterShardError(
      `Filter sharding only applies to topic resources (got "${options.adapter.name}")`,
    );
  }
  const allowed = availableShardStrategies(options.adapter.name);
  if (!allowed.includes(options.strategy)) {
    throw new FilterShardError(
      `"${options.strategy}" sharding is not available for ${options.adapter.name}. Use ${allowed.join(" or ")}.`,
    );
  }

  const baseFilters = options.baseFilters ?? {};
  const shards = await buildShards(options, baseFilters);
  mkdirSync(dirname(options.outPath) || ".", { recursive: true });

  const exporter = options.exportResource ?? exportResource;
  const outcomes: ShardExportOutcome[] = [];
  const successfulPaths: string[] = [];

  for (const [index, shard] of shards.entries()) {
    const shardPath = options.separateFiles
      ? shardFilePath(options.outPath, shard.id)
      : shardFilePath(options.outPath, `tmp-${shard.id}`);
    const outcome: ShardExportOutcome = {
      id: shard.id,
      label: shard.label,
      rowCount: 0,
      hitCap: false,
      outPath: options.separateFiles ? shardPath : options.outPath,
    };
    try {
      const exportOpts: Parameters<typeof exportResource>[1] = {
        outPath: shardPath,
        filters: shard.filters,
        onProgress: () => undefined,
      };
      if (options.utf8Bom === true) {
        exportOpts.utf8Bom = true;
      }
      if (options.signal !== undefined) {
        exportOpts.signal = options.signal;
      }
      const result: ExportResult = await exporter(options.adapter, exportOpts);
      outcome.rowCount = result.rowCount;
      outcome.hitCap = result.hitCap;
      if (options.separateFiles) {
        outcome.outPath = result.outPath;
      }
      successfulPaths.push(shardPath);
    } catch (error) {
      if (error instanceof JobAbortedError || options.signal?.aborted === true) {
        throw error;
      }
      outcome.error = error instanceof Error ? error.message : String(error);
    }
    outcomes.push(outcome);
    options.onShard?.(index + 1, shards.length, shard, outcome);
  }

  if (!options.separateFiles) {
    if (successfulPaths.length > 0) {
      await mergeCsvFiles(successfulPaths, options.outPath, options.utf8Bom === true);
    }
    for (const path of successfulPaths) {
      try {
        unlinkSync(path);
      } catch {
        // temp shard file already gone
      }
    }
  }

  return {
    strategy: options.strategy,
    shards: outcomes,
    totalRows: outcomes.reduce((sum, item) => sum + item.rowCount, 0),
    hitCap: outcomes.some((item) => item.hitCap),
    failed: outcomes.filter((item) => item.error !== undefined).length,
    outPath: options.outPath,
    separateFiles: options.separateFiles,
  };
}

export function formatShardedSummary(result: ShardedExportResult): string {
  const lines = [
    `Sharded export (${result.strategy}): ${result.shards.length} shard(s), ${result.totalRows} rows, ${result.failed} failed`,
  ];
  for (const shard of result.shards) {
    if (shard.error !== undefined) {
      lines.push(`  ${shard.id}: FAILED ${shard.error}`);
      continue;
    }
    const cap = shard.hitCap ? " HIT_CAP" : "";
    const path = result.separateFiles ? ` → ${shard.outPath}` : "";
    lines.push(`  ${shard.id}: ${shard.rowCount} rows${cap}${path}`);
  }
  if (result.hitCap) {
    lines.push(SHARD_CAP_HINT);
  }
  if (!result.separateFiles) {
    lines.push(`Merged: ${result.outPath}`);
  }
  return lines.join("\n");
}

export { SHARD_CAP_HINT };

async function buildShards(
  options: ShardedExportOptions,
  baseFilters: QueryParams,
): Promise<TopicShard[]> {
  if (options.strategy === "contentType") {
    return contentTypeFilterShards(baseFilters);
  }
  if (options.strategy === "date") {
    const from = options.createdFrom ?? stringParam(baseFilters["createdAt[from]"]);
    const to = options.createdTo ?? stringParam(baseFilters["createdAt[to]"]);
    if (from === undefined || to === undefined) {
      throw new FilterShardError("Date sharding requires created-from and created-to (YYYY-MM-DD)");
    }
    return dateFilterShards(baseFilters, from, to);
  }
  const list =
    options.listCategories ??
    ((signal?: AbortSignal) => listCategoryRefs(options.client, signal));
  const extras: { signal?: AbortSignal } = {};
  if (options.signal !== undefined) {
    extras.signal = options.signal;
  }
  return categoryFilterShards(baseFilters, await list(extras.signal));
}

export async function listCategoryRefs(
  client: ApiClient,
  signal?: AbortSignal,
  resolveAdapter: typeof getAdapter = getAdapter,
): Promise<CategoryRef[]> {
  const adapter = resolveAdapter("categories", client);
  const records: CategoryRef[] = [];
  let page = 1;
  while (true) {
    const request: { page: number; pageSize: number; signal?: AbortSignal } = {
      page,
      pageSize: COMMUNITY_MAX_PAGE_SIZE,
    };
    if (signal !== undefined) {
      request.signal = signal;
    }
    const listed = await adapter.list({}, request);
    for (const record of listed.records) {
      if (record.id !== undefined && record.id !== "") {
        records.push({ id: record.id as string | number, name: record.name ?? record.title });
      }
    }
    if (listed.exhausted || listed.records.length === 0) {
      break;
    }
    page += 1;
    if (page > 500) {
      break;
    }
  }
  return records;
}

function stringParam(value: unknown): string | undefined {
  if (value === undefined || value === "") {
    return undefined;
  }
  return String(value);
}

async function mergeCsvFiles(paths: string[], outPath: string, utf8Bom: boolean): Promise<void> {
  const first = paths[0];
  if (first === undefined) {
    return;
  }
  const columns = await peekCsvHeaders(first);
  mkdirSync(dirname(outPath) || ".", { recursive: true });
  const writerOpts: { columns: string[]; utf8Bom?: boolean } = { columns };
  if (utf8Bom) {
    writerOpts.utf8Bom = true;
  }
  const writer = CsvWriter.fromFile(outPath, writerOpts);
  try {
    for (const path of paths) {
      for await (const row of CsvReader.fromFile(path)) {
        await writer.writeRow(row.raw);
      }
    }
  } finally {
    await writer.end();
  }
}
