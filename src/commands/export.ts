import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { DEFAULT_PAGE_SIZE } from "../lib/api/pagination.js";
import type { QueryParams } from "../lib/auth.js";
import { CsvWriter } from "../lib/csv.js";
import type { IResourceAdapter } from "../adapters/base.js";
import { TOPIC_CAP_HINT } from "../adapters/content.js";

/** Page size for export pagination. User list has no documented max; 100 keeps request count down. */
export const EXPORT_PAGE_SIZE = 100;

export interface ExportOptions {
  filters?: QueryParams;
  outPath: string;
  pageSize?: number;
  utf8Bom?: boolean;
  onProgress?: (rowCount: number, page: number) => void;
  signal?: AbortSignal;
}

export interface ExportResult {
  rowCount: number;
  pageCount: number;
  outPath: string;
  columns: string[];
  hitCap: boolean;
}

/**
 * Stream `adapter.list()` pages into a CSV.
 * `filters` defaults to `{}` (unfiltered). The wizard supplies filters; scripted
 * `--op export` currently does not.
 */
export async function exportResource(
  adapter: IResourceAdapter,
  options: ExportOptions,
): Promise<ExportResult> {
  const columns = adapter.exportColumnNames();
  const pageSize = options.pageSize ?? EXPORT_PAGE_SIZE;
  mkdirSync(dirname(options.outPath), { recursive: true });
  const writer = CsvWriter.fromFile(options.outPath, {
    columns,
    ...(options.utf8Bom === true ? { utf8Bom: true } : {}),
  });

  let page = 1;
  let hitCap = false;
  try {
    while (true) {
      const request: { page: number; pageSize: number; signal?: AbortSignal } = {
        page,
        pageSize,
      };
      if (options.signal !== undefined) {
        request.signal = options.signal;
      }
      const result = await adapter.list(options.filters ?? {}, request);
      for (const record of result.records) {
        await writer.writeRow(adapter.flattenRecord(record));
      }
      options.onProgress?.(writer.rowCount, page);
      if (result.hitCap === true) {
        hitCap = true;
        break;
      }
      if (result.exhausted) {
        break;
      }
      page += 1;
    }
  } finally {
    await writer.end();
  }

  return {
    rowCount: writer.rowCount,
    pageCount: page,
    outPath: options.outPath,
    columns,
    hitCap,
  };
}

export { TOPIC_CAP_HINT };

export { DEFAULT_PAGE_SIZE };
