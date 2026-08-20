/**
 * Append-only job audit log. Records job metadata only — never emails, names,
 * tokens, or client secrets.
 */
import { appendFile } from "node:fs/promises";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import type { ProfileName } from "./types.js";

export const DEFAULT_AUDIT_RELATIVE_PATH = "logs/jobs.jsonl";

export interface JobAuditEntry {
  timestamp: string;
  profile: ProfileName;
  operation: string;
  resource: string;
  inputFile: string;
  resultsFile: string;
  totalRows: number;
  successCount: number;
  failedCount: number;
  skippedCount: number;
  plannedCount: number;
  duration: number;
  dryRun: boolean;
  sawRateLimit: boolean;
  rateLimitCount: number;
}

export interface LogJobOptions {
  cwd?: string;
  logPath?: string;
  onError?: (error: unknown) => void;
}

export function auditLogPath(cwd: string = process.cwd(), relative = DEFAULT_AUDIT_RELATIVE_PATH): string {
  return join(cwd, relative);
}

function serializeAuditEntry(entry: JobAuditEntry): string {
  return JSON.stringify({
    timestamp: entry.timestamp,
    profile: entry.profile,
    operation: entry.operation,
    resource: entry.resource,
    inputFile: entry.inputFile,
    resultsFile: entry.resultsFile,
    totalRows: entry.totalRows,
    successCount: entry.successCount,
    failedCount: entry.failedCount,
    skippedCount: entry.skippedCount,
    plannedCount: entry.plannedCount,
    duration: entry.duration,
    dryRun: entry.dryRun,
    sawRateLimit: entry.sawRateLimit,
    rateLimitCount: entry.rateLimitCount,
  });
}

/** Append one job record. Failures are reported but never thrown. */
export async function logJobExecution(
  entry: JobAuditEntry,
  options: LogJobOptions = {},
): Promise<boolean> {
  const path = options.logPath ?? auditLogPath(options.cwd);
  try {
    mkdirSync(dirname(path), { recursive: true });
    await appendFile(path, `${serializeAuditEntry(entry)}\n`, "utf8");
    return true;
  } catch (error) {
    const report =
      options.onError ??
      ((err: unknown) => {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`Failed to write audit log: ${message}`);
      });
    report(error);
    return false;
  }
}
