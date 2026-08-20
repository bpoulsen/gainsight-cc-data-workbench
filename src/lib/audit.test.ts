import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { logJobExecution, type JobAuditEntry } from "./audit.js";

function sample(overrides: Partial<JobAuditEntry> = {}): JobAuditEntry {
  return {
    timestamp: "2026-08-20T18:00:00.000Z",
    profile: "sandbox",
    operation: "updateField",
    resource: "users",
    inputFile: "users.csv",
    resultsFile: "users.results.csv",
    totalRows: 2,
    successCount: 1,
    failedCount: 1,
    skippedCount: 0,
    plannedCount: 0,
    duration: 12,
    dryRun: false,
    sawRateLimit: false,
    rateLimitCount: 0,
    ...overrides,
  };
}

describe("logJobExecution", () => {
  it("creates logs/jobs.jsonl and appends one JSON object per line", async () => {
    const dir = await mkdtemp(join(tmpdir(), "gs-audit-"));
    const first = sample();
    const second = sample({ operation: "erase", successCount: 2, failedCount: 0, totalRows: 2 });
    expect(await logJobExecution(first, { cwd: dir })).toBe(true);
    expect(await logJobExecution(second, { cwd: dir })).toBe(true);
    const body = await readFile(join(dir, "logs/jobs.jsonl"), "utf8");
    const lines = body.trim().split("\n");
    expect(lines).toHaveLength(2);
    expect(JSON.parse(lines[0] ?? "{}")).toMatchObject({
      profile: "sandbox",
      operation: "updateField",
      resource: "users",
      totalRows: 2,
      duration: 12,
    });
    expect(JSON.parse(lines[1] ?? "{}")).toMatchObject({ operation: "erase" });
    expect(body).not.toMatch(/@/);
  });

  it("does not throw when the log cannot be written", async () => {
    const dir = await mkdtemp(join(tmpdir(), "gs-audit-fail-"));
    const blocker = join(dir, "not-a-directory");
    await writeFile(blocker, "nope");
    const errors: unknown[] = [];
    const ok = await logJobExecution(sample(), {
      logPath: join(blocker, "jobs.jsonl"),
      onError: (error) => errors.push(error),
    });
    expect(ok).toBe(false);
    expect(errors.length).toBeGreaterThan(0);
  });
});
