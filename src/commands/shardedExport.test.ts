import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { ApiClient } from "../lib/apiClient.js";
import type { QueryParams } from "../lib/auth.js";
import { BaseAdapter, type PageRequest } from "../adapters/base.js";
import { FilterShardError } from "../lib/filterSharding.js";
import { exportSharded, formatShardedSummary } from "./shardedExport.js";

const stubClient = {} as ApiClient;

class FakeTopicsAdapter extends BaseAdapter {
  readonly name = "topics" as const;
  readonly label = "Topics";
  readonly family = "community" as const;
  readonly identity = "id" as const;
  readonly calls: QueryParams[] = [];
  failType?: string;
  capType?: string;

  async list(filters: QueryParams, _page: PageRequest) {
    this.calls.push(filters);
    const type = String(filters["contentTypes[]"] ?? filters.contentTypes ?? "question");
    if (this.failType !== undefined && type === this.failType) {
      throw new Error("boom");
    }
    const id = type === "idea" ? 2 : 1;
    const listed = this.toListPage([{ id, type, title: type }], 1, 100);
    if (this.capType !== undefined && type === this.capType) {
      listed.hitCap = true;
    }
    listed.exhausted = true;
    return listed;
  }

  async get() {
    return {};
  }

  exportFields() {
    return [
      { name: "id", kind: "number" as const },
      { name: "type", kind: "string" as const },
      { name: "title", kind: "string" as const },
    ];
  }

  operations() {
    return [];
  }

  fromCsvRow() {
    throw new Error("not used");
  }

  describeFilters() {
    return [];
  }
}

describe("exportSharded", () => {
  it("merges content-type shards into one CSV and continues after a failed shard", async () => {
    const dir = await mkdtemp(join(tmpdir(), "gs-shard-"));
    const outPath = join(dir, "topics.csv");
    const adapter = new FakeTopicsAdapter(stubClient);
    adapter.failType = "conversation";
    adapter.capType = "idea";
    try {
      const result = await exportSharded({
        adapter,
        client: stubClient,
        strategy: "contentType",
        outPath,
        separateFiles: false,
      });
      expect(result.failed).toBe(1);
      expect(result.hitCap).toBe(true);
      expect(result.totalRows).toBe(4);
      expect(adapter.calls).toHaveLength(5);
      const csv = await readFile(outPath, "utf8");
      expect(csv).toContain("id,type,title");
      expect(csv).toContain("question");
      expect(csv).toContain("idea");
      expect(csv).not.toContain("conversation");
      expect(formatShardedSummary(result)).toMatch(/HIT_CAP/);
      expect(formatShardedSummary(result)).toMatch(/FAILED boom/);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("writes separate files per category shard", async () => {
    const dir = await mkdtemp(join(tmpdir(), "gs-shard-"));
    const outPath = join(dir, "topics.csv");
    const adapter = new FakeTopicsAdapter(stubClient);
    try {
      const result = await exportSharded({
        adapter,
        client: stubClient,
        strategy: "category",
        outPath,
        separateFiles: true,
        listCategories: async () => [
          { id: 6, name: "Getting started" },
          { id: 9, name: "Announcements" },
        ],
      });
      expect(result.failed).toBe(0);
      expect(result.separateFiles).toBe(true);
      const first = await readFile(join(dir, "topics.cat-6.csv"), "utf8");
      expect(first).toContain("title");
      await readFile(join(dir, "topics.cat-9.csv"), "utf8");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("rejects contentType sharding on a typed resource", async () => {
    const adapter = new FakeTopicsAdapter(stubClient);
    (adapter as { name: string }).name = "questions";
    await expect(
      exportSharded({
        adapter,
        client: stubClient,
        strategy: "contentType",
        outPath: "out.csv",
        separateFiles: false,
      }),
    ).rejects.toThrow(FilterShardError);
  });
});
