/**
 * Pure helpers for the interactive wizard. No stdin, no network.
 */
import type { FilterPrompt, IdentityMode, OperationKind, ResourceOperation } from "../adapters/base.js";
import type { QueryPrimitive, QueryParams } from "../lib/auth.js";
import type { CliFlags } from "../lib/types.js";

const IDENTITY_COLUMNS = new Set(["id", "userid", "email"]);
const PREFERRED_PREVIEW_COLUMNS = [
  "id",
  "type",
  "title",
  "email",
  "username",
  "author",
  "status",
  "created",
] as const;

export const EXPLORE_PAGE_SIZE = 25;
export const PREVIEW_MAX_COLUMNS = 8;
export const PREVIEW_CELL_WIDTH = 32;

export class WizardError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WizardError";
  }
}

export class WizardCancelled extends Error {
  constructor(message = "Operation cancelled") {
    super(message);
    this.name = "WizardCancelled";
  }
}

export type WizardMode = "explore" | "export" | "bulk";

/** Launch the wizard when no resource/op/csv/out flags (or auth-check/help/version) are set. */
export function shouldLaunchWizard(flags: CliFlags): boolean {
  if (flags.help || flags.version || flags.authCheck) {
    return false;
  }
  return (
    flags.resource === undefined &&
    flags.op === undefined &&
    flags.csv === undefined &&
    flags.out === undefined
  );
}

export function defaultExportPath(resource: string, now: Date = new Date()): string {
  const stamp = now.toISOString().slice(0, 19).replace(/[:T]/g, "-");
  return `exports/${resource}-export-${stamp}.csv`;
}

export function isTypedConfirmation(value: string, resource: string): boolean {
  const trimmed = value.trim();
  return trimmed === "DELETE" || trimmed === resource;
}

export function operationNeedsIdentity(kind: OperationKind, name: string): boolean {
  return kind !== "create" || name === "createReply";
}

export function missingRequiredColumns(
  headers: string[],
  spec: Pick<ResourceOperation, "requiredColumns" | "kind" | "name">,
  identity: IdentityMode,
): string[] {
  const headerSet = new Set(headers.map((header) => header.trim()));
  const missing: string[] = [];
  for (const column of spec.requiredColumns) {
    if (IDENTITY_COLUMNS.has(column)) {
      continue;
    }
    if (!headerSet.has(column)) {
      missing.push(column);
    }
  }
  if (operationNeedsIdentity(spec.kind, spec.name)) {
    const hasId = headerSet.has("id") || headerSet.has("userid");
    const hasEmail = headerSet.has("email");
    if (identity === "id-or-email") {
      if (!hasId && !hasEmail) {
        missing.push("id or email");
      }
    } else if (!hasId) {
      missing.push("id");
    }
  }
  return missing;
}

export function parseFilterInput(
  raw: string,
  prompt: Pick<FilterPrompt, "name" | "type">,
): QueryPrimitive | QueryPrimitive[] | undefined {
  const trimmed = raw.trim();
  if (trimmed.length === 0) {
    return undefined;
  }

  const asList = prompt.type === "string[]" || prompt.name.endsWith("[]");
  if (asList) {
    const parts = splitList(trimmed);
    if (parts.length === 0) {
      return undefined;
    }
    if (prompt.type === "number") {
      return parts.map((part) => parseNumber(part, prompt.name));
    }
    if (prompt.type === "boolean") {
      return parts.map((part) => parseBoolean(part, prompt.name));
    }
    return parts;
  }

  if (prompt.type === "boolean") {
    return parseBoolean(trimmed, prompt.name);
  }
  if (prompt.type === "number") {
    return parseNumber(trimmed, prompt.name);
  }
  return trimmed;
}

export function applyParsedFilter(
  filters: QueryParams,
  name: string,
  value: QueryPrimitive | QueryPrimitive[] | undefined,
): void {
  if (value === undefined) {
    return;
  }
  filters[name] = value;
}

export function previewColumns(exportColumns: string[], max = PREVIEW_MAX_COLUMNS): string[] {
  const available = new Set(exportColumns);
  const chosen: string[] = [];
  for (const name of PREFERRED_PREVIEW_COLUMNS) {
    if (available.has(name) && chosen.length < max) {
      chosen.push(name);
    }
  }
  for (const name of exportColumns) {
    if (chosen.length >= max) {
      break;
    }
    if (!chosen.includes(name)) {
      chosen.push(name);
    }
  }
  return chosen;
}

export function formatPreviewTable(
  rows: Record<string, string>[],
  columns: string[],
  maxCell = PREVIEW_CELL_WIDTH,
): string {
  if (columns.length === 0) {
    return "(no columns)";
  }
  const cells = rows.map((row) => columns.map((column) => truncateCell(row[column] ?? "", maxCell)));
  const widths = columns.map((column, index) =>
    Math.max(column.length, ...cells.map((row) => row[index]?.length ?? 0)),
  );
  const header = columns.map((column, index) => column.padEnd(widths[index] ?? column.length)).join("  ");
  const separator = widths.map((width) => "-".repeat(width)).join("  ");
  const body = cells.map((row) =>
    row.map((value, index) => value.padEnd(widths[index] ?? value.length)).join("  "),
  );
  return [header, separator, ...body].join("\n");
}

function splitList(raw: string): string[] {
  const delimiter = raw.includes("|") ? "|" : ",";
  return raw
    .split(delimiter)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

function parseBoolean(raw: string, field: string): boolean {
  const lower = raw.toLowerCase();
  if (lower === "true") {
    return true;
  }
  if (lower === "false") {
    return false;
  }
  throw new WizardError(`Filter "${field}" must be true or false`);
}

function parseNumber(raw: string, field: string): number {
  if (!/^-?\d+(\.\d+)?$/.test(raw)) {
    throw new WizardError(`Filter "${field}" must be a number (got "${raw}")`);
  }
  return Number(raw);
}

function truncateCell(value: string, max: number): string {
  const flat = value.replace(/\s+/g, " ").trim();
  if (flat.length <= max) {
    return flat;
  }
  return `${flat.slice(0, Math.max(0, max - 1))}…`;
}
