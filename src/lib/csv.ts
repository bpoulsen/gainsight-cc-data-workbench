import { createReadStream, createWriteStream } from "node:fs";
import { Readable, type Writable } from "node:stream";
import { finished } from "node:stream/promises";
import { parse } from "csv-parse";
import { stringify } from "csv-stringify";

export const PROGRESS_INTERVAL = 100;
export const UTF8_BOM = "\uFEFF";

export const RESULTS_CSV_COLUMNS = [
  "status",
  "http_status",
  "error",
  "resolved_id",
  "operation",
  "profile",
  "timestamp",
] as const;

export type FieldKind = "string" | "boolean" | "number" | "string[]" | "json";

export class CsvError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "CsvError";
  }
}

export interface ColumnMapping {
  aliases?: Record<string, string>;
  kinds?: Record<string, FieldKind>;
  knownFields?: string[];
  onUnknown?: (header: string) => void;
}

export interface MappedCsvRow {
  line: number;
  raw: Record<string, string>;
  values: Record<string, unknown>;
}

export interface CsvReaderOptions {
  mapping?: ColumnMapping;
  onProgress?: (rowCount: number) => void;
  progressEvery?: number;
}

export interface CsvWriterOptions {
  columns: string[];
  utf8Bom?: boolean;
  onProgress?: (rowCount: number) => void;
  progressEvery?: number;
}

/** Coerce a CSV cell: empty → undefined, booleans, numbers, pipe-separated lists, or JSON. */
export function coerceCell(value: string, kind: FieldKind, field: string): unknown {
  if (value === "") {
    return undefined;
  }
  switch (kind) {
    case "string":
      return value;
    case "boolean": {
      const normalized = value.toLowerCase();
      if (normalized === "true") {
        return true;
      }
      if (normalized === "false") {
        return false;
      }
      throw new CsvError(`Column "${field}" must be true or false (got "${value}")`);
    }
    case "number": {
      const number = Number(value);
      if (!Number.isFinite(number)) {
        throw new CsvError(`Column "${field}" must be a number (got "${value}")`);
      }
      return number;
    }
    case "string[]":
      return value
        .split("|")
        .map((part) => part.trim())
        .filter((part) => part.length > 0);
    case "json":
      try {
        return JSON.parse(value) as unknown;
      } catch (error) {
        throw new CsvError(`Column "${field}" must be valid JSON`, { cause: error });
      }
  }
}

export function mapCsvRow(
  raw: Record<string, string>,
  mapping: ColumnMapping = {},
): Record<string, unknown> {
  const aliases = mapping.aliases ?? {};
  const kinds = mapping.kinds ?? {};
  const known = mapping.knownFields ? new Set(mapping.knownFields) : undefined;
  const values: Record<string, unknown> = {};

  for (const [header, cell] of Object.entries(raw)) {
    const field = aliases[header] ?? header;
    if (known && !known.has(field)) {
      mapping.onUnknown?.(header);
      continue;
    }
    const kind = kinds[field] ?? "string";
    const coerced = coerceCell(cell, kind, field);
    if (coerced !== undefined) {
      values[field] = coerced;
    }
  }
  return values;
}

export function flattenValue(value: unknown): string {
  if (value === undefined || value === null) {
    return "";
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  if (typeof value === "number" || typeof value === "bigint") {
    return String(value);
  }
  if (typeof value === "string") {
    return value;
  }
  if (Array.isArray(value)) {
    if (value.every((item) => item === null || ["string", "number", "boolean", "bigint"].includes(typeof item))) {
      return value.map((item) => (item === null ? "" : String(item))).join("|");
    }
    return JSON.stringify(value);
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}

export function flattenRecord(
  record: Record<string, unknown>,
  columns: readonly string[],
): Record<string, string> {
  const flat: Record<string, string> = {};
  for (const column of columns) {
    flat[column] = flattenValue(record[column]);
  }
  return flat;
}

export function ensureExportColumns(
  columns: readonly string[],
  options: { includeEmail?: boolean } = {},
): string[] {
  const out = [...columns];
  if (!out.includes("id")) {
    out.unshift("id");
  }
  if (options.includeEmail && !out.includes("email")) {
    const idIndex = out.indexOf("id");
    out.splice((idIndex ?? 0) + 1, 0, "email");
  }
  return out;
}

function wrapParseError(error: unknown): CsvError {
  if (error instanceof CsvError) {
    return error;
  }
  const message = error instanceof Error ? error.message : String(error);
  return new CsvError(message, { cause: error });
}

function reportProgress(
  rowCount: number,
  every: number,
  onProgress?: (rowCount: number) => void,
  force = false,
): void {
  if (!onProgress) {
    return;
  }
  if (force || rowCount % every === 0) {
    onProgress(rowCount);
  }
}

async function writeChunk(writable: Writable, chunk: unknown): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const onError = (error: Error): void => {
      reject(error);
    };
    writable.once("error", onError);
    if (writable.write(chunk as string)) {
      writable.off("error", onError);
      resolve();
    } else {
      writable.once("drain", () => {
        writable.off("error", onError);
        resolve();
      });
    }
  });
}

export class CsvReader {
  headers: string[] = [];
  rowCount = 0;

  constructor(
    private readonly source: NodeJS.ReadableStream,
    private readonly options: CsvReaderOptions = {},
  ) {}

  static fromFile(path: string, options: CsvReaderOptions = {}): CsvReader {
    return new CsvReader(createReadStream(path), options);
  }

  static fromString(csv: string, options: CsvReaderOptions = {}): CsvReader {
    return new CsvReader(Readable.from([csv]), options);
  }

  async *[Symbol.asyncIterator](): AsyncGenerator<MappedCsvRow, void, undefined> {
    const every = this.options.progressEvery ?? PROGRESS_INTERVAL;
    const captured: string[] = [];
    const parser = parse({
      bom: true,
      columns: (header) => {
        const names = header.map((name) => String(name ?? "").trim());
        if (names.length === 0 || names.every((name) => name.length === 0)) {
          throw new CsvError("CSV header row is required");
        }
        const seen = new Set<string>();
        for (const name of names) {
          if (name.length === 0) {
            throw new CsvError("CSV header contains an empty column name");
          }
          if (seen.has(name)) {
            throw new CsvError(`Duplicate CSV header "${name}"`);
          }
          seen.add(name);
        }
        captured.push(...names);
        return names;
      },
      skip_empty_lines: true,
      trim: true,
      relax_quotes: false,
    });

    this.source.pipe(parser);

    try {
      for await (const record of parser as AsyncIterable<Record<string, string | undefined>>) {
        if (this.headers.length === 0) {
          this.headers = captured.length > 0 ? [...captured] : Object.keys(record);
        }
        this.rowCount += 1;
        const raw: Record<string, string> = {};
        for (const [key, value] of Object.entries(record)) {
          raw[key] = value ?? "";
        }
        const mapping = this.options.mapping ?? {};
        const values = mapCsvRow(raw, mapping);
        reportProgress(this.rowCount, every, this.options.onProgress);
        yield {
          line: this.rowCount + 1,
          raw,
          values,
        };
      }
    } catch (error) {
      throw wrapParseError(error);
    }

    this.headers = captured.length > 0 ? [...captured] : this.headers;
    if (this.headers.length === 0) {
      throw new CsvError("CSV header row is required");
    }
    if (this.rowCount > 0 && this.rowCount % every !== 0) {
      reportProgress(this.rowCount, every, this.options.onProgress, true);
    }
  }
}

export class CsvWriter {
  readonly columns: string[];
  rowCount = 0;
  private readonly stringifier: ReturnType<typeof stringify>;
  private readonly destination: Writable;
  private readonly onProgress?: (rowCount: number) => void;
  private readonly progressEvery: number;

  constructor(destination: Writable, options: CsvWriterOptions) {
    this.destination = destination;
    this.columns = [...options.columns];
    this.progressEvery = options.progressEvery ?? PROGRESS_INTERVAL;
    if (options.onProgress) {
      this.onProgress = options.onProgress;
    }
    this.stringifier = stringify({
      header: true,
      columns: this.columns,
      bom: options.utf8Bom === true,
      quoted_match: /,|\n|\r|"/,
      escape_formulas: true,
      cast: {
        boolean: (value) => (value ? "true" : "false"),
        object: (value) => flattenValue(value),
      },
    });
    this.stringifier.pipe(this.destination);
  }

  static fromFile(path: string, options: CsvWriterOptions): CsvWriter {
    return new CsvWriter(createWriteStream(path), options);
  }

  async writeRow(record: Record<string, unknown>): Promise<void> {
    await writeChunk(this.stringifier, flattenRecord(record, this.columns));
    this.rowCount += 1;
    reportProgress(this.rowCount, this.progressEvery, this.onProgress);
  }

  async writeRows(
    rows: AsyncIterable<Record<string, unknown>> | Iterable<Record<string, unknown>>,
  ): Promise<number> {
    for await (const row of rows) {
      await this.writeRow(row);
    }
    return this.rowCount;
  }

  async end(): Promise<void> {
    this.stringifier.end();
    await finished(this.destination);
    if (this.rowCount > 0 && this.rowCount % this.progressEvery !== 0) {
      reportProgress(this.rowCount, this.progressEvery, this.onProgress, true);
    }
  }
}

/** Read CSV headers without buffering the rest of the file. */
export async function peekCsvHeaders(path: string): Promise<string[]> {
  const reader = CsvReader.fromFile(path);
  for await (const _row of reader) {
    return reader.headers;
  }
  return reader.headers;
}

export async function countCsvRows(path: string): Promise<number> {
  let count = 0;
  for await (const _row of CsvReader.fromFile(path)) {
    count += 1;
  }
  return count;
}
