import { describe, expect, it } from "vitest";
import type { ApiClient } from "../lib/apiClient.js";
import type { QueryParams } from "../lib/auth.js";
import {
  AdapterError,
  BaseAdapter,
  getAdapter,
  registerAdapter,
  registeredAdapters,
  resolveResourceName,
  type FromCsvRowContext,
  type PageRequest,
  type ResourceOperation,
} from "./index.js";

const stubClient = {} as ApiClient;

class FakeUsersAdapter extends BaseAdapter {
  readonly name = "users" as const;
  readonly label = "Users";
  readonly family = "users" as const;
  readonly identity = "id-or-email" as const;

  private readonly records = [
    { id: 7, email: "ops@example.com", username: "ops" },
    { id: 8, email: "mod@example.com", username: "mod" },
  ];

  async list(filters: QueryParams, page: PageRequest) {
    const q = typeof filters.q === "string" ? filters.q : undefined;
    const matched = this.records.filter((row) => (q ? row.username.includes(q) : true));
    const pageSize = page.pageSize ?? 25;
    const start = (page.page - 1) * pageSize;
    return this.toListPage(matched.slice(start, start + pageSize), page.page, pageSize);
  }

  async get(id: string | number) {
    const record = this.records.find((row) => String(row.id) === String(id));
    if (!record) {
      throw new AdapterError(`User ${String(id)} not found`);
    }
    return record;
  }

  exportFields() {
    return [
      { name: "id", kind: "number" as const },
      { name: "email", kind: "string" as const },
      { name: "username", kind: "string" as const },
      { name: "roles", kind: "string[]" as const },
    ];
  }

  operations(): ResourceOperation[] {
    return [
      {
        name: "updateField",
        kind: "update",
        label: "Update field",
        requiredColumns: ["id", "field", "value"],
      },
      {
        name: "erase",
        kind: "delete",
        label: "Erase user",
        confirmation: "typed",
        requiredColumns: ["id"],
      },
    ];
  }

  fromCsvRow(row: Record<string, unknown>, operation: string, context?: FromCsvRowContext) {
    const spec = this.requireOperation(operation);
    const id = this.identityValue(row, context);
    this.requireFields(row, spec.requiredColumns, operation);
    if (operation === "erase") {
      return this.callPlan({
        method: "DELETE",
        path: this.interpolatePath("/user/{id}/erase", row, context),
        operation,
        resolvedId: id,
      });
    }
    return this.callPlan({
      method: "POST",
      path: this.interpolatePath("/user/{id}/{field}/{value}", row, context),
      operation,
      resolvedId: id,
    });
  }

  describeFilters() {
    return [
      { name: "q", label: "Username contains", type: "string" as const },
      {
        name: "filter[roles.rolename][]",
        label: "Roles",
        type: "string[]" as const,
        description: "Filter by role names",
      },
    ];
  }
}

describe("resolveResourceName", () => {
  it("accepts canonical names and aliases", () => {
    expect(resolveResourceName("users")).toBe("users");
    expect(resolveResourceName("product-updates")).toBe("productUpdates");
    expect(resolveResourceName("moderatorTags")).toBe("moderatorTags");
  });

  it("rejects unknown resources", () => {
    expect(() => resolveResourceName("salesforce")).toThrow(AdapterError);
  });
});

describe("adapter registry", () => {
  it("constructs a registered adapter and rejects unimplemented names", () => {
    registerAdapter("users", () => new FakeUsersAdapter(stubClient));
    const adapter = getAdapter("user", stubClient);
    expect(adapter.name).toBe("users");
    expect(registeredAdapters()).toContain("users");
    expect(() => getAdapter("events", stubClient)).toThrow(/not implemented yet/);
  });
});

describe("IResourceAdapter / BaseAdapter", () => {
  const adapter = new FakeUsersAdapter(stubClient);

  it("lists a page of normalized records", async () => {
    const page = await adapter.list({}, { page: 1, pageSize: 1 });
    expect(page.records).toEqual([{ id: 7, email: "ops@example.com", username: "ops" }]);
    expect(page.exhausted).toBe(false);
    const rest = await adapter.list({}, { page: 2, pageSize: 1 });
    expect(rest.records[0]?.id).toBe(8);
    const done = await adapter.list({}, { page: 3, pageSize: 1 });
    expect(done.records).toEqual([]);
    expect(done.exhausted).toBe(true);
  });

  it("gets a single record and export columns include id+email", async () => {
    await expect(adapter.get(7)).resolves.toMatchObject({ email: "ops@example.com" });
    expect(adapter.exportColumnNames()).toEqual(["id", "email", "username", "roles"]);
    expect(adapter.columnMapping().kinds).toMatchObject({ roles: "string[]" });
  });

  it("describes wizard filters from query params", () => {
    const filters = adapter.describeFilters();
    expect(filters.map((item) => item.name)).toContain("q");
  });

  it("maps CSV rows to API call plans", () => {
    const update = adapter.fromCsvRow(
      { field: "username", value: "ops" },
      "updateField",
      { resolvedId: 7 },
    );
    expect(update).toEqual({
      method: "POST",
      path: "/user/7/username/ops",
      operation: "updateField",
      retryable: true,
      resolvedId: 7,
    });

    const erase = adapter.fromCsvRow({ id: 7 }, "erase");
    expect(erase.method).toBe("DELETE");
    expect(erase.path).toBe("/user/7/erase");
    expect(erase.retryable).toBe(false);
    expect(erase.operation).toBe("erase");
  });

  it("rejects unknown operations and missing columns", () => {
    expect(() => adapter.fromCsvRow({}, "editTags")).toThrow(/Unknown operation/);
    expect(() => adapter.fromCsvRow({ id: 7 }, "updateField")).toThrow(/requires columns/);
  });
});
