import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { ApiClient } from "../lib/apiClient.js";
import type { QueryParams } from "../lib/auth.js";
import { BaseAdapter, type PageRequest } from "../adapters/base.js";
import { exportResource } from "./export.js";

const stubClient = {} as ApiClient;

class FakeUsersAdapter extends BaseAdapter {
  readonly name = "users" as const;
  readonly label = "Users";
  readonly family = "users" as const;
  readonly identity = "id-or-email" as const;

  private readonly records = [
    { id: 7, email: "ops@example.com", username: "ops", roles: ["roles.registered"] },
    { id: 8, email: "mod@example.com", username: "mod", roles: ["roles.moderator"] },
    { id: 9, email: "cs@example.com", username: "cs", roles: ["roles.registered"] },
  ];

  async list(filters: QueryParams, page: PageRequest) {
    const pageSize = page.pageSize ?? 2;
    const start = (page.page - 1) * pageSize;
    return this.toListPage(this.records.slice(start, start + pageSize), page.page, pageSize);
  }

  async get(id: string | number) {
    return this.records.find((row) => String(row.id) === String(id)) ?? {};
  }

  exportFields() {
    return [
      { name: "id", kind: "number" as const },
      { name: "email", kind: "string" as const },
      { name: "username", kind: "string" as const },
      { name: "roles", kind: "string[]" as const },
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

describe("exportResource", () => {
  it("pages through list() and writes a flattened CSV", async () => {
    const dir = await mkdtemp(join(tmpdir(), "gs-export-"));
    const outPath = join(dir, "users.csv");
    const pages: number[] = [];
    try {
      const result = await exportResource(new FakeUsersAdapter(stubClient), {
        outPath,
        pageSize: 2,
        onProgress: (_count, page) => pages.push(page),
      });
      expect(result.rowCount).toBe(3);
      expect(result.pageCount).toBe(2);
      expect(result.hitCap).toBe(false);
      expect(result.columns).toEqual(["id", "email", "username", "roles"]);
      expect(pages).toEqual([1, 2]);
      const csv = await readFile(outPath, "utf8");
      expect(csv).toContain("id,email,username,roles");
      expect(csv).toContain("7,ops@example.com,ops,roles.registered");
      expect(csv).toContain("9,cs@example.com,cs,roles.registered");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
