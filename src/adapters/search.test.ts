import { describe, expect, it } from "vitest";
import { getAuthenticatedClient } from "../lib/auth.js";
import { createApiClient, type ApiClientOptions } from "../lib/apiClient.js";
import { RetryPolicy } from "../lib/retry.js";
import type { GainsightConfig } from "../lib/types.js";
import { AdapterError, getAdapter } from "./index.js";
import { SEARCH_MAX_PAGE_SIZE, SearchAdapter, normalizeSearchHit } from "./search.js";
import searchResults from "../lib/fixtures/search-results.json" with { type: "json" };
import tagSearch from "../lib/fixtures/tag-search.json" with { type: "json" };

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

describe("normalizeSearchHit", () => {
  it("aliases contentType as type", () => {
    const hit = searchResults.community[0];
    expect(normalizeSearchHit(hit)).toMatchObject({
      id: 101,
      publicId: 501,
      contentType: "question",
      type: "question",
      title: "How do I export CSV?",
      tags: ["csv", "export"],
      hasAnswer: true,
    });
  });
});

describe("SearchAdapter", () => {
  it("is explore/export only", () => {
    const adapter = new SearchAdapter(mockClient(() => jsonResponse({})));
    expect(adapter.operations()).toEqual([]);
    expect(() => adapter.fromCsvRow({ q: "csv" }, "index")).toThrow(/Unknown operation/);
    expect(() => adapter.fromCsvRow({ q: "csv" }, "delete")).toThrow(/Unknown operation/);
  });

  it("requires q for content search", async () => {
    const adapter = new SearchAdapter(mockClient(() => jsonResponse({})));
    await expect(adapter.list({}, { page: 1 })).rejects.toThrow(/requires q/);
  });

  it("searches community content with filters", async () => {
    const client = mockClient((url) => {
      expect(url.pathname).toBe("/search");
      expect(url.searchParams.get("q")).toBe("csv");
      expect(url.searchParams.getAll("contentTypes")).toEqual(["question", "article"]);
      expect(url.searchParams.getAll("categoryIds")).toEqual(["6"]);
      expect(url.searchParams.get("hasAnswer")).toBe("true");
      expect(url.searchParams.get("pageSize")).toBe(String(SEARCH_MAX_PAGE_SIZE));
      return jsonResponse(searchResults);
    });
    const adapter = new SearchAdapter(client);
    const listed = await adapter.list(
      { q: "csv", contentTypes: "question|article", categoryIds: "6", hasAnswer: true },
      { page: 1, pageSize: 500 },
    );
    expect(listed.records.map((row) => row.id)).toEqual([101, 202]);
    expect(listed.records[0]).toMatchObject({ type: "question", categoryName: "Getting started" });
    await expect(adapter.get(101)).rejects.toThrow(/explore\/export only/);
  });

  it("searches tags when searchTags is set", async () => {
    const client = mockClient((url) => {
      expect(url.pathname).toBe("/search/tags");
      expect(url.searchParams.get("q")).toBe("csv");
      return jsonResponse(tagSearch);
    });
    const adapter = new SearchAdapter(client);
    const listed = await adapter.list({ searchTags: true, q: "csv" }, { page: 1 });
    expect(listed.records).toEqual([
      { id: 11, name: "export", count: 4 },
      { id: 12, name: "csv", count: 9 },
    ]);
  });

  it("registers search on the adapter map", () => {
    const client = mockClient(() => jsonResponse({}));
    expect(getAdapter("search", client)).toBeInstanceOf(SearchAdapter);
    expect(getAdapter("search", client).family).toBe("search");
  });
});
