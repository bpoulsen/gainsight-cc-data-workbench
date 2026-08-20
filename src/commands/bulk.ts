import type { ApiClient } from "../lib/apiClient.js";
import type { IResourceAdapter } from "../adapters/base.js";
import type { ProfileName } from "../lib/types.js";
import {
  BulkJobRunner,
  defaultResultsPath,
  formatJobSummary,
  type BulkJobSummary,
  type BulkProgress,
} from "../lib/jobRunner.js";
import type { ApiCallPlan } from "../adapters/base.js";

export interface BulkCommandOptions {
  csvPath: string;
  resultsPath?: string;
  operation: string;
  adapter: IResourceAdapter;
  client: ApiClient;
  profile: ProfileName;
  dryRun: boolean;
  failFast: boolean;
  concurrency: number;
  utf8Bom?: boolean;
  onProgress?: (progress: BulkProgress) => void;
  onPlan?: (plan: ApiCallPlan, line: number) => void;
  onUnknownColumn?: (header: string) => void;
  signal?: AbortSignal;
  cwd?: string;
  auditLogPath?: string;
  groupNativeBulk?: boolean;
}

/** Run one named bulk operation over a CSV (dry-run or live) and write a results file. */
export async function runBulkJob(options: BulkCommandOptions): Promise<BulkJobSummary> {
  const runner = new BulkJobRunner();
  const job: Parameters<BulkJobRunner["run"]>[0] = {
    csvPath: options.csvPath,
    operation: options.operation,
    adapter: options.adapter,
    client: options.client,
    profile: options.profile,
    dryRun: options.dryRun,
    failFast: options.failFast,
    concurrency: options.concurrency,
  };
  if (options.resultsPath !== undefined) {
    job.resultsPath = options.resultsPath;
  }
  if (options.utf8Bom === true) {
    job.utf8Bom = true;
  }
  if (options.onProgress) {
    job.onProgress = options.onProgress;
  }
  if (options.onPlan) {
    job.onPlan = options.onPlan;
  }
  if (options.onUnknownColumn) {
    job.onUnknownColumn = options.onUnknownColumn;
  }
  if (options.signal) {
    job.signal = options.signal;
  }
  if (options.cwd !== undefined) {
    job.cwd = options.cwd;
  }
  if (options.auditLogPath !== undefined) {
    job.auditLogPath = options.auditLogPath;
  }
  if (options.groupNativeBulk === false) {
    job.groupNativeBulk = false;
  }
  return runner.run(job);
}

export { BulkJobRunner, defaultResultsPath, formatJobSummary };
export type { BulkJobSummary, BulkProgress };
