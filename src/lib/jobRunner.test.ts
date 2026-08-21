import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getAuthenticatedClient } from "./auth.js";
import { createApiClient, type ApiClientOptions } from "./apiClient.js";
import { RetryPolicy } from "./retry.js";
import type { GainsightConfig } from "./types.js";
import { UsersAdapter } from "../adapters/users.js";
import { ContentAdapter } from "../adapters/content.js";
import { BulkJobRunner, defaultResultsPath, formatJobSummary } from "./jobRunner.js";
import { CsvReader } from "./csv.js";

const config: GainsightConfig = {
  profile: "sandbox",
  baseUrl: "https://example.invalid",
  clientId: "test-client-id-value",
  clientSecret: "test-client-secret-value",
  envFile: ".env.sandbox",
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function mockClient(
  handler: (url: URL, init?: RequestInit) => Response | Promise<Response>,
  options: ApiClientOptions = {},
) {
  const auth = getAuthenticatedClient(config, {
    fetchImpl: async (input, init) => {
      const url = new URL(String(input));
      if (url.pathname.endsWith("/oauth2/token")) {
        return jsonResponse({
          access_token: "live-token-value-xxxxxxxxxx",
          expires_in: 7200,
          token_type: "Bearer",
          scope: "read write",
        });
      }
      return handler(url, init);
    },
  });
  const { retry, ...rest } = options;
  return createApiClient(auth, {
    retry:
      retry ??
      new RetryPolicy({
        sleep: async () => {},
        random: () => 0.5,
        log: () => {},
      }),
    ...rest,
  });
}

async function withTemp(run: (dir: string) => Promise<void>): Promise<void> {
  const dir = await mkdtemp(join(tmpdir(), "gs-job-"));
  try {
    await run(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

async function readResults(path: string) {
  const rows = [];
  for await (const row of CsvReader.fromFile(path)) {
    rows.push(row.raw);
  }
  return rows;
}

describe("defaultResultsPath", () => {
  it("replaces a .csv suffix with .results.csv", () => {
    expect(defaultResultsPath("tags.csv")).toBe("tags.results.csv");
    expect(defaultResultsPath("exports/users.CSV")).toBe("exports/users.results.csv");
  });
});

describe("BulkJobRunner", () => {
  it("dry-run plans rows without calling write endpoints", async () => {
    await withTemp(async (dir) => {
      const csvPath = join(dir, "users.csv");
      await writeFile(csvPath, "id,field,value\n7,username,ops\n8,username,mod\n");
      const writes: string[] = [];
      const client = mockClient((url, init) => {
        writes.push(`${init?.method ?? "GET"} ${url.pathname}`);
        return jsonResponse({ ok: true });
      });
      const plans: string[] = [];
      const summary = await new BulkJobRunner().run({
        csvPath,
        operation: "updateField",
        adapter: new UsersAdapter(client),
        client,
        profile: "sandbox",
        cwd: dir,
        dryRun: true,
        now: () => new Date("2026-08-20T18:00:00.000Z"),
        onPlan: (plan) => plans.push(`${plan.method} ${plan.path}`),
      });
      expect(summary.planned).toBe(2);
      expect(summary.success).toBe(0);
      expect(summary.dryRun).toBe(true);
      expect(plans).toEqual(["PUT /user/7/username/ops", "PUT /user/8/username/mod"]);
      expect(writes.every((item) => item.startsWith("GET") || item.startsWith("POST /oauth2"))).toBe(
        true,
      );
      const rows = await readResults(summary.resultsPath);
      expect(rows[0]).toMatchObject({
        id: "7",
        status: "planned",
        resolved_id: "7",
        operation: "updateField",
        profile: "sandbox",
        timestamp: "2026-08-20T18:00:00.000Z",
      });
    });
  });

  it("executes live rows and isolates failures", async () => {
    await withTemp(async (dir) => {
      const csvPath = join(dir, "users.csv");
      await writeFile(csvPath, "id,field,value\n7,username,ops\n8,username,mod\n");
      const client = mockClient((url) => {
        if (url.pathname === "/user/8/username/mod") {
          return jsonResponse({ message: "nope" }, 422);
        }
        return jsonResponse({ ok: true }, 200);
      });
      const summary = await new BulkJobRunner().run({
        csvPath,
        operation: "updateField",
        adapter: new UsersAdapter(client),
        client,
        profile: "sandbox",
        cwd: dir,
        concurrency: 1,
      });
      expect(summary.success).toBe(1);
      expect(summary.failed).toBe(1);
      const rows = await readResults(summary.resultsPath);
      expect(rows.map((row) => row.status)).toEqual(["success", "failed"]);
      expect(rows[1]?.http_status).toBe("422");
    });
  });

  it("stops launching rows on fail-fast", async () => {
    await withTemp(async (dir) => {
      const csvPath = join(dir, "users.csv");
      await writeFile(csvPath, "id,field,value\n7,username,ops\n8,username,mod\n9,username,cs\n");
      const paths: string[] = [];
      const client = mockClient((url) => {
        paths.push(url.pathname);
        if (url.pathname.includes("/user/7/")) {
          return jsonResponse({ message: "nope" }, 422);
        }
        return jsonResponse({ ok: true }, 200);
      });
      const summary = await new BulkJobRunner().run({
        csvPath,
        operation: "updateField",
        adapter: new UsersAdapter(client),
        client,
        profile: "sandbox",
        cwd: dir,
        failFast: true,
        concurrency: 1,
      });
      expect(summary.failed).toBe(1);
      expect(summary.skipped).toBe(2);
      expect(paths.filter((path) => path.startsWith("/user/"))).toEqual(["/user/7/username/ops"]);
      const rows = await readResults(summary.resultsPath);
      expect(rows.map((row) => row.status)).toEqual(["failed", "skipped", "skipped"]);
    });
  });

  it("resolves user email identity before a write", async () => {
    await withTemp(async (dir) => {
      const csvPath = join(dir, "users.csv");
      await writeFile(csvPath, "email,field,value\nops@example.com,username,ops\n");
      const client = mockClient((url) => {
        if (url.pathname.includes("/user/email/")) {
          return jsonResponse({ result: { userid: 7 } });
        }
        if (url.pathname.includes("/user/7/username/ops")) {
          return jsonResponse({ ok: true }, 200);
        }
        return jsonResponse({ message: "not found" }, 404);
      });
      const summary = await new BulkJobRunner().run({
        csvPath,
        operation: "updateField",
        adapter: new UsersAdapter(client),
        client,
        profile: "sandbox",
        cwd: dir,
      });
      expect(summary.success).toBe(1);
      const rows = await readResults(summary.resultsPath);
      expect(rows[0]?.resolved_id).toBe("7");
    });
  });

  it("does not retry erase and warns about manual follow-up", async () => {
    await withTemp(async (dir) => {
      const csvPath = join(dir, "erase.csv");
      await writeFile(csvPath, "id\n7\n");
      let attempts = 0;
      const client = mockClient((url) => {
        if (url.pathname === "/user/7/erase") {
          attempts += 1;
          return jsonResponse({ message: "busy" }, 500);
        }
        return jsonResponse({ ok: true });
      });
      const summary = await new BulkJobRunner().run({
        csvPath,
        operation: "erase",
        adapter: new UsersAdapter(client),
        client,
        profile: "sandbox",
        cwd: dir,
      });
      expect(attempts).toBe(1);
      expect(summary.failed).toBe(1);
      const rows = await readResults(summary.resultsPath);
      expect(rows[0]?.error).toMatch(/DELETE_FAILED: 500/);
      expect(rows[0]?.error).toMatch(/never auto-retried/i);
      expect(formatJobSummary(summary)).toMatch(/re-run those rows manually/);
    });
  });

  it("warns and ignores unknown CSV columns", async () => {
    await withTemp(async (dir) => {
      const csvPath = join(dir, "q.csv");
      await writeFile(
        csvPath,
        "title,content,categoryId,authorId,extra\nHello,World,6,7,nope\n",
      );
      const unknown: string[] = [];
      const client = mockClient(() => jsonResponse({ id: "101" }, 201));
      const summary = await new BulkJobRunner().run({
        csvPath,
        operation: "ask",
        adapter: new ContentAdapter(client, "questions"),
        client,
        profile: "sandbox",
        cwd: dir,
        onUnknownColumn: (header) => unknown.push(header),
      });
      expect(unknown).toEqual(["extra"]);
      expect(summary.success).toBe(1);
    });
  });

  it("appends a PII-free audit line after the job", async () => {
    await withTemp(async (dir) => {
      const csvPath = join(dir, "users.csv");
      await writeFile(csvPath, "email,field,value\nops@example.com,username,ops\n");
      const client = mockClient((url) => {
        if (url.pathname.includes("/user/email/")) {
          return jsonResponse({ result: { userid: 7 } });
        }
        return jsonResponse({ ok: true }, 200);
      });
      const summary = await new BulkJobRunner().run({
        csvPath,
        operation: "updateField",
        adapter: new UsersAdapter(client),
        client,
        profile: "sandbox",
        cwd: dir,
      });
      const audit = await readFile(join(dir, "logs/jobs.jsonl"), "utf8");
      const entry = JSON.parse(audit.trim()) as Record<string, unknown>;
      expect(entry).toMatchObject({
        profile: "sandbox",
        operation: "updateField",
        resource: "users",
        inputFile: csvPath,
        resultsFile: summary.resultsPath,
        totalRows: 1,
        successCount: 1,
        failedCount: 0,
        dryRun: false,
      });
      expect(audit).not.toContain("ops@example.com");
    });
  });

  it("counts 429s and suggests lower concurrency", async () => {
    await withTemp(async (dir) => {
      const csvPath = join(dir, "users.csv");
      await writeFile(csvPath, "id,field,value\n7,username,ops\n");
      const client = mockClient((url) => {
        if (url.pathname.includes("/user/7/")) {
          return jsonResponse({ message: "slow down" }, 429);
        }
        return jsonResponse({ ok: true }, 200);
      });
      const summary = await new BulkJobRunner().run({
        csvPath,
        operation: "updateField",
        adapter: new UsersAdapter(client),
        client,
        profile: "sandbox",
        cwd: dir,
        concurrency: 4,
      });
      expect(summary.sawRateLimit).toBe(true);
      expect(summary.rateLimitCount).toBe(1);
      expect(summary.concurrency).toBe(4);
      expect(formatJobSummary(summary)).toMatch(/current: 4/);
      expect(formatJobSummary(summary)).toMatch(/to 2/);
    });
  });

  it("formats a summary that mentions 429 follow-up", () => {
    const text = formatJobSummary({
      total: 2,
      success: 1,
      failed: 1,
      skipped: 0,
      planned: 0,
      durationMs: 12,
      resultsPath: "users.results.csv",
      operation: "updateField",
      resource: "users",
      profile: "sandbox",
      dryRun: false,
      sawRateLimit: true,
      rateLimitCount: 1,
      concurrency: 3,
    });
    expect(text).toMatch(/1 success, 1 failed/);
    expect(text).toMatch(/current: 3/);
    expect(text).toMatch(/to 1/);
  });

  it("groups native bulk role rows into one request and stamps every CSV row", async () => {
    await withTemp(async (dir) => {
      const csvPath = join(dir, "roles.csv");
      await writeFile(
        csvPath,
        "id,roleIds\n1,7|13\n2,13|7\n3,9\n",
      );
      const bodies: unknown[] = [];
      const client = mockClient((url, init) => {
        if (url.pathname === "/user/bulk/role" && init?.body) {
          bodies.push(JSON.parse(String(init.body)));
        }
        return jsonResponse({ ok: true }, 200);
      });
      const plans: string[] = [];
      const summary = await new BulkJobRunner().run({
        csvPath,
        operation: "bulkAddRoles",
        adapter: new UsersAdapter(client),
        client,
        profile: "sandbox",
        cwd: dir,
        concurrency: 1,
        now: () => new Date("2026-08-20T18:00:00.000Z"),
        onPlan: (plan) => plans.push(JSON.stringify(plan.body)),
      });
      expect(summary.success).toBe(3);
      expect(bodies).toEqual([
        { data: { userIds: [1, 2], roleIds: [7, 13] } },
        { data: { userIds: [3], roleIds: [9] } },
      ]);
      expect(plans).toHaveLength(2);
      const rows = await readResults(summary.resultsPath);
      expect(rows.map((row) => row.status)).toEqual(["success", "success", "success"]);
      expect(rows[0]).toMatchObject({
        id: "1",
        http_status: "200",
        resolved_id: "1",
        operation: "bulkAddRoles",
      });
    });
  });

  it("falls back to one user per request when a native bulk add fails", async () => {
    await withTemp(async (dir) => {
      const csvPath = join(dir, "roles.csv");
      await writeFile(csvPath, "id,roleIds\n1,7\n2,7\n3,7\n");
      const userIdSets: number[][] = [];
      const client = mockClient((url, init) => {
        if (url.pathname !== "/user/bulk/role") {
          return jsonResponse({ ok: true });
        }
        const body = JSON.parse(String(init?.body)) as { data: { userIds: number[] } };
        userIdSets.push(body.data.userIds);
        if (body.data.userIds.length > 1) {
          return jsonResponse({ message: "batch too large" }, 422);
        }
        return jsonResponse({ ok: true }, 200);
      });
      const summary = await new BulkJobRunner().run({
        csvPath,
        operation: "bulkAddRoles",
        adapter: new UsersAdapter(client),
        client,
        profile: "sandbox",
        cwd: dir,
        concurrency: 1,
      });
      expect(userIdSets[0]).toEqual([1, 2, 3]);
      expect(userIdSets.slice(1)).toEqual([[1], [2], [3]]);
      expect(summary.success).toBe(3);
      expect(summary.failed).toBe(0);
    });
  });

  it("does not fall back when a native bulk revoke fails", async () => {
    await withTemp(async (dir) => {
      const csvPath = join(dir, "badges.csv");
      await writeFile(csvPath, "id,badgeIds\n1,11\n2,11\n");
      let calls = 0;
      const client = mockClient((url) => {
        if (url.pathname === "/user/bulk/badge") {
          calls += 1;
          return jsonResponse({ message: "busy" }, 500);
        }
        return jsonResponse({ ok: true });
      });
      const summary = await new BulkJobRunner().run({
        csvPath,
        operation: "bulkRevokeBadges",
        adapter: new UsersAdapter(client),
        client,
        profile: "sandbox",
        cwd: dir,
        concurrency: 1,
      });
      expect(calls).toBe(1);
      expect(summary.failed).toBe(2);
      const rows = await readResults(summary.resultsPath);
      expect(rows.every((row) => String(row.error).startsWith("DELETE_FAILED:"))).toBe(true);
    });
  });

  it("sends one native bulk call per CSV row when grouping is disabled", async () => {
    await withTemp(async (dir) => {
      const csvPath = join(dir, "roles.csv");
      await writeFile(csvPath, "id,roleIds\n1,7\n2,7\n");
      const userIdSets: number[][] = [];
      const client = mockClient((url, init) => {
        if (url.pathname === "/user/bulk/role") {
          const body = JSON.parse(String(init?.body)) as { data: { userIds: number[] } };
          userIdSets.push(body.data.userIds);
          return jsonResponse({ ok: true }, 200);
        }
        return jsonResponse({ ok: true });
      });
      const summary = await new BulkJobRunner().run({
        csvPath,
        operation: "bulkAddRoles",
        adapter: new UsersAdapter(client),
        client,
        profile: "sandbox",
        cwd: dir,
        groupNativeBulk: false,
        concurrency: 1,
      });
      expect(summary.success).toBe(2);
      expect(userIdSets).toEqual([[1], [2]]);
    });
  });

  it("plans grouped native bulk without calling write endpoints", async () => {
    await withTemp(async (dir) => {
      const csvPath = join(dir, "roles.csv");
      await writeFile(csvPath, "id,roleIds\n1,7\n2,7\n");
      const writes: string[] = [];
      const client = mockClient((url, init) => {
        writes.push(`${init?.method ?? "GET"} ${url.pathname}`);
        return jsonResponse({ ok: true });
      });
      const plans: Array<{ path: string; userIds: number[] }> = [];
      const summary = await new BulkJobRunner().run({
        csvPath,
        operation: "bulkAddRoles",
        adapter: new UsersAdapter(client),
        client,
        profile: "sandbox",
        cwd: dir,
        dryRun: true,
        onPlan: (plan) => {
          const body = plan.body as { data: { userIds: number[] } };
          plans.push({ path: plan.path, userIds: body.data.userIds });
        },
      });
      expect(summary.planned).toBe(2);
      expect(plans).toEqual([{ path: "/user/bulk/role", userIds: [1, 2] }]);
      expect(writes.every((item) => item.startsWith("GET") || item.startsWith("POST /oauth2"))).toBe(
        true,
      );
    });
  });

  it("caps concurrent row execution", async () => {
    await withTemp(async (dir) => {
      const csvPath = join(dir, "users.csv");
      await writeFile(
        csvPath,
        "id,field,value\n7,username,a\n8,username,b\n9,username,c\n10,username,d\n",
      );
      let inflight = 0;
      let maxInflight = 0;
      const client = mockClient(async (url) => {
        if (!url.pathname.includes("/username/")) {
          return jsonResponse({ ok: true });
        }
        inflight += 1;
        maxInflight = Math.max(maxInflight, inflight);
        await new Promise((resolve) => {
          setTimeout(resolve, 40);
        });
        inflight -= 1;
        return jsonResponse({ ok: true }, 200);
      });
      const summary = await new BulkJobRunner().run({
        csvPath,
        operation: "updateField",
        adapter: new UsersAdapter(client),
        client,
        profile: "sandbox",
        cwd: dir,
        concurrency: 2,
      });
      expect(summary.success).toBe(4);
      expect(maxInflight).toBeLessThanOrEqual(2);
    });
  });
});
