import { describe, expect, it } from "vitest";
import { getAuthenticatedClient } from "../lib/auth.js";
import { createApiClient, type ApiClientOptions } from "../lib/apiClient.js";
import { RetryPolicy } from "../lib/retry.js";
import type { GainsightConfig } from "../lib/types.js";
import { AdapterError, getAdapter } from "./index.js";
import { TaxonomyAdapter, flattenCategoryTree } from "./taxonomy.js";
import categoryList from "../lib/fixtures/category-list.json" with { type: "json" };
import categoryTree from "../lib/fixtures/category-tree.json" with { type: "json" };
import tagList from "../lib/fixtures/tag-list.json" with { type: "json" };

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

describe("flattenCategoryTree", () => {
  it("flattens nested sections with parent_id", () => {
    const rows = flattenCategoryTree(categoryTree);
    expect(rows).toEqual([
      {
        id: 1,
        name: "General Discussion",
        title: "General Discussion",
        description: "Top-level section",
        parent_id: "",
        type: "community",
        module: "community",
        isSection: true,
        displayOrder: 0,
        order: 0,
        heroImage: "",
        thumbnailImage: "",
      },
      {
        id: 6,
        name: "Getting started",
        title: "Getting started",
        description: "Onboarding",
        parent_id: 1,
        type: "community",
        module: "community",
        isSection: false,
        displayOrder: 0,
        order: 0,
        heroImage: "",
        thumbnailImage: "",
      },
    ]);
  });
});

describe("TaxonomyAdapter fromCsvRow", () => {
  const tags = new TaxonomyAdapter(mockClient(() => jsonResponse({})), "tags");
  const moderatorTags = new TaxonomyAdapter(mockClient(() => jsonResponse({})), "moderatorTags");
  const productAreas = new TaxonomyAdapter(mockClient(() => jsonResponse({})), "productAreas");
  const ideaStatuses = new TaxonomyAdapter(mockClient(() => jsonResponse({})), "ideaStatuses");
  const categories = new TaxonomyAdapter(mockClient(() => jsonResponse({})), "categories");

  it("plans tag create, rename, delete, and merge against named endpoints", () => {
    expect(tags.fromCsvRow({ name: "export", authorId: 7 }, "create")).toMatchObject({
      method: "POST",
      path: "/tags/create",
      query: { authorId: "7" },
      body: { name: "export" },
      retryable: true,
    });
    expect(tags.fromCsvRow({ id: 11, name: "csv", moderatorId: 8 }, "rename")).toMatchObject({
      method: "POST",
      path: "/tags/rename",
      body: { id: "11", name: "csv" },
      resolvedId: 11,
    });
    const del = tags.fromCsvRow({ id: 11, moderatorId: 8 }, "delete");
    expect(del).toMatchObject({
      method: "POST",
      path: "/tags/delete",
      body: { id: "11" },
      retryable: false,
    });
    expect(tags.fromCsvRow({ name: "merged", ids: "11|12", moderatorId: 8 }, "merge")).toMatchObject({
      method: "POST",
      path: "/tags/merge",
      body: { name: "merged", ids: ["11", "12"] },
    });
  });

  it("deletes moderator tags by id list with typed confirmation", () => {
    expect(moderatorTags.operations().find((item) => item.name === "delete")?.confirmation).toBe(
      "typed",
    );
    expect(moderatorTags.fromCsvRow({ id: "3|4", moderatorId: 8 }, "delete")).toMatchObject({
      method: "DELETE",
      path: "/moderatorTags/delete",
      query: { moderatorId: "8" },
      body: { moderatorTagIds: ["3", "4"] },
      retryable: false,
    });
  });

  it("plans product area create, rename, and delete", () => {
    expect(
      productAreas.fromCsvRow({ name: "Billing", parentId: "1", authorId: 7 }, "create"),
    ).toMatchObject({
      method: "POST",
      path: "/productAreas/create",
      body: { name: "Billing", parentId: "1" },
    });
    expect(productAreas.fromCsvRow({ id: 9, name: "Invoices", moderatorId: 8 }, "rename")).toMatchObject({
      path: "/productAreas/rename",
      body: { id: "9", name: "Invoices" },
    });
    expect(productAreas.fromCsvRow({ id: 9, moderatorId: 8 }, "delete")).toMatchObject({
      method: "POST",
      path: "/productAreas/delete",
      retryable: false,
    });
  });

  it("plans idea status create, edit, changeType, reorder, and delete", () => {
    expect(
      ideaStatuses.fromCsvRow(
        { name: "Shipped", authorId: 7, backgroundColor: "#00aa00", type: "delivered" },
        "create",
      ),
    ).toMatchObject({
      method: "POST",
      path: "/ideas/createIdeaStatus",
      body: { name: "Shipped", backgroundColor: "#00aa00", type: "delivered" },
    });
    expect(
      ideaStatuses.fromCsvRow({ id: 2, name: "Done", moderatorId: 8, visible: false }, "edit"),
    ).toMatchObject({
      method: "POST",
      path: "/ideas/2/editIdeaStatus",
      body: { name: "Done", visible: false },
    });
    expect(ideaStatuses.fromCsvRow({ id: 2, type: "closed", moderatorId: 8 }, "changeType")).toMatchObject({
      path: "/ideas/ideaStatuses/2/changeType",
      body: { type: "closed" },
    });
    expect(ideaStatuses.fromCsvRow({ order: "2|1|3", moderatorId: 8 }, "reorder")).toMatchObject({
      path: "/ideas/reorderIdeaStatuses",
      body: { order: ["2", "1", "3"] },
    });
    expect(ideaStatuses.fromCsvRow({ id: 2, moderatorId: 8 }, "delete")).toMatchObject({
      method: "DELETE",
      path: "/ideas/2/deleteIdeaStatus",
      retryable: false,
    });
  });

  it("treats categories as explore/export only", () => {
    expect(categories.operations()).toEqual([]);
    expect(() => categories.fromCsvRow({ name: "Nope" }, "create")).toThrow(/Unknown operation/);
  });
});

describe("TaxonomyAdapter list/get", () => {
  it("lists paginated categories and gets one by id", async () => {
    const client = mockClient((url) => {
      if (url.pathname === "/v2/categories/6") {
        return jsonResponse({ id: "6", name: "Getting started", order: 0 });
      }
      if (url.pathname === "/v2/categories") {
        expect(url.searchParams.get("page")).toBe("1");
        return jsonResponse(categoryList);
      }
      return jsonResponse({ message: "nope" }, 404);
    });
    const adapter = new TaxonomyAdapter(client, "categories");
    const listed = await adapter.list({}, { page: 1, pageSize: 25 });
    expect(listed.records.map((row) => row.name)).toEqual(["Getting started", "Announcements"]);
    expect(listed.exhausted).toBe(true);
    const one = await adapter.get("6");
    expect(one).toMatchObject({ id: "6", name: "Getting started" });
  });

  it("flattens the category tree when tree=true", async () => {
    const client = mockClient((url) => {
      expect(url.pathname).toBe("/v2/category/getTree");
      expect(url.searchParams.get("authorId")).toBe("7");
      expect(url.searchParams.getAll("module[]")).toEqual(["community"]);
      return jsonResponse(categoryTree);
    });
    const adapter = new TaxonomyAdapter(client, "categories");
    const listed = await adapter.list({ tree: true, authorId: "7" }, { page: 1 });
    expect(listed.exhausted).toBe(true);
    expect(listed.records.map((row) => row.parent_id)).toEqual(["", 1]);
    expect(listed.records[1]).toMatchObject({ id: 6, name: "Getting started", parent_id: 1 });
  });

  it("requires authorId for tree export", async () => {
    const adapter = new TaxonomyAdapter(mockClient(() => jsonResponse({})), "categories");
    await expect(adapter.list({ tree: true }, { page: 1 })).rejects.toThrow(/authorId/);
  });

  it("lists tags and finds one by scanning", async () => {
    const client = mockClient((url) => {
      expect(url.pathname).toBe("/v2/tags");
      return jsonResponse(tagList);
    });
    const adapter = new TaxonomyAdapter(client, "tags");
    const listed = await adapter.list({ q: "csv" }, { page: 1, pageSize: 100 });
    expect(listed.records).toHaveLength(2);
    const found = await adapter.get("12");
    expect(found).toMatchObject({ id: "12", name: "csv" });
  });

  it("registers taxonomy resources on the adapter map", () => {
    const client = mockClient(() => jsonResponse({}));
    expect(getAdapter("tags", client)).toBeInstanceOf(TaxonomyAdapter);
    expect(getAdapter("product-areas", client).name).toBe("productAreas");
    expect(getAdapter("ideaStatuses", client).operations().some((item) => item.name === "delete")).toBe(
      true,
    );
  });
});
