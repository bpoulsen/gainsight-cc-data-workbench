import { describe, expect, it } from "vitest";
import { getAuthenticatedClient } from "../lib/auth.js";
import { createApiClient, type ApiClientOptions } from "../lib/apiClient.js";
import { RetryPolicy } from "../lib/retry.js";
import type { GainsightConfig } from "../lib/types.js";
import { AdapterError, getAdapter, registerAdapter } from "./index.js";
import {
  ContentAdapter,
  TOPIC_LIST_CAP,
  isTopicCapError,
  normalizeTopic,
} from "./content.js";
import { ValidationError } from "../lib/api/errors.js";
import topicList from "../lib/fixtures/topic-list.json" with { type: "json" };
import questionFixture from "../lib/fixtures/question.json" with { type: "json" };
import questionReplies from "../lib/fixtures/question-replies.json" with { type: "json" };
import validationError from "../lib/fixtures/validation-error.json" with { type: "json" };

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

describe("normalizeTopic", () => {
  it("flattens author, category, and tag arrays", () => {
    const record = normalizeTopic(questionFixture);
    expect(record).toMatchObject({
      id: "101",
      type: "question",
      author: "ops",
      authorId: "7",
      category: "Getting started",
      tags: ["export", "csv"],
      moderatorTags: ["urgent"],
      created: "2024-01-15T12:00:00+00:00",
    });
  });
});

describe("isTopicCapError", () => {
  it("detects the 10k topic cap message", () => {
    const error = new ValidationError(
      "Unprocessable Entity: Only the first 10,000 topics matching the filter can be queried",
      "GET",
      "/v2/topics",
      validationError,
      validationError.errors,
    );
    expect(isTopicCapError(error)).toBe(true);
    expect(isTopicCapError(new Error("nope"))).toBe(false);
  });
});

describe("ContentAdapter fromCsvRow", () => {
  const questions = new ContentAdapter(mockClient(() => jsonResponse({})), "questions");
  const ideas = new ContentAdapter(mockClient(() => jsonResponse({})), "ideas");
  const articles = new ContentAdapter(mockClient(() => jsonResponse({})), "articles");
  const productUpdates = new ContentAdapter(mockClient(() => jsonResponse({})), "productUpdates");
  const conversations = new ContentAdapter(mockClient(() => jsonResponse({})), "conversations");
  const topics = new ContentAdapter(mockClient(() => jsonResponse({})), "topics");

  it("plans create, reply, edits, tags, move, toggles, and delete for questions", () => {
    expect(
      questions.fromCsvRow(
        {
          title: "How do I export?",
          content: "Need help",
          categoryId: 6,
          authorId: 7,
          tags: "csv|export",
        },
        "ask",
      ),
    ).toMatchObject({
      method: "POST",
      path: "/questions/ask",
      query: { authorId: "7" },
      body: {
        title: "How do I export?",
        content: "Need help",
        categoryId: 6,
        tags: ["csv", "export"],
      },
      retryable: true,
    });

    expect(questions.fromCsvRow({ content: "Thanks", authorId: 7 }, "createReply", { resolvedId: 101 })).toMatchObject({
      method: "POST",
      path: "/questions/101/reply",
      body: { content: "Thanks" },
    });

    expect(
      questions.fromCsvRow({ title: "New title", moderatorId: 8 }, "editTitle", { resolvedId: 101 }),
    ).toMatchObject({
      method: "POST",
      path: "/questions/101/editTitle",
      query: { moderatorId: "8" },
      body: { title: "New title" },
    });

    expect(
      questions.fromCsvRow({ content: "Updated", authorId: 7 }, "editContent", { resolvedId: 101 }),
    ).toMatchObject({
      path: "/questions/101/editContent",
      query: { authorId: "7" },
    });

    expect(questions.fromCsvRow({ tags: "a|b", authorId: 7 }, "editTags", { resolvedId: 101 })).toMatchObject({
      path: "/questions/101/editTags",
      body: { tags: ["a", "b"] },
    });
    expect(questions.fromCsvRow({ tags: "a", authorId: 7 }, "addTags", { resolvedId: 101 })).toMatchObject({
      path: "/questions/101/tags/add",
    });
    expect(questions.fromCsvRow({ tags: "a", authorId: 7 }, "removeTags", { resolvedId: 101 })).toMatchObject({
      path: "/questions/101/tags/remove",
    });
    expect(
      questions.fromCsvRow({ moderatorTags: "urgent", moderatorId: 8 }, "editModeratorTags", { resolvedId: 101 }),
    ).toMatchObject({
      path: "/questions/101/editModeratorTags",
      body: { moderatorTags: ["urgent"] },
    });
    expect(questions.fromCsvRow({ tags: "urgent", moderatorId: 8 }, "addModeratorTags", { resolvedId: 101 })).toMatchObject({
      path: "/questions/101/moderator-tags/add",
      body: { tags: ["urgent"] },
    });
    expect(questions.fromCsvRow({ categoryId: 9, moderatorId: 8 }, "move", { resolvedId: 101 })).toMatchObject({
      path: "/questions/101/move",
      body: { categoryId: 9 },
    });
    expect(questions.fromCsvRow({ closed: true, moderatorId: 8 }, "toggleClosed", { resolvedId: 101 })).toMatchObject({
      path: "/questions/101/toggleClosed",
      body: { closed: true },
    });
    expect(questions.fromCsvRow({ sticky: true, moderatorId: 8 }, "toggleSticky", { resolvedId: 101 })).toMatchObject({
      path: "/questions/101/toggleStickyState",
      body: { sticky: true },
    });

    const trash = questions.fromCsvRow({ trashed: true, moderatorId: 8 }, "toggleTrashed", { resolvedId: 101 });
    expect(trash.path).toBe("/questions/101/toggleTrashed");
    expect(trash.retryable).toBe(false);
    expect(questions.operations().find((item) => item.name === "toggleTrashed")?.confirmation).toBe("typed");

    const erase = questions.fromCsvRow({ moderatorId: 8 }, "permanentDelete", { resolvedId: 101 });
    expect(erase).toMatchObject({
      method: "DELETE",
      path: "/questions/101",
      query: { moderatorId: "8" },
      retryable: false,
    });

    expect(questions.fromCsvRow({ spam: true, moderatorId: 8 }, "toggleSpam", { resolvedId: 101 })).toMatchObject({
      path: "/questions/101/markAsSpam",
      body: { banUser: false },
    });
    expect(questions.fromCsvRow({ spam: false, moderatorId: 8 }, "toggleSpam", { resolvedId: 101 })).toMatchObject({
      path: "/questions/101/markAsNotSpam",
    });
    expect(
      questions.fromCsvRow({ targetType: "idea", moderatorId: 8 }, "convertType", { resolvedId: 101 }),
    ).toMatchObject({
      path: "/questions/101/convertToIdea",
    });
  });

  it("uses type-specific create paths and idea/article extras", () => {
    expect(
      ideas.fromCsvRow(
        { title: "Ship CSV export", content: "Please", authorId: 7, productAreaIds: "1|2" },
        "create",
      ),
    ).toMatchObject({
      path: "/ideas/submit",
      body: { title: "Ship CSV export", content: "Please", productAreaIds: "1,2" },
    });
    expect(
      conversations.fromCsvRow(
        { title: "Hello", content: "World", categoryId: 3, authorId: 7 },
        "start",
      ),
    ).toMatchObject({ path: "/conversations/start" });
    expect(
      articles.fromCsvRow(
        { title: "Guide", content: "Draft", categoryId: 4, authorId: 7, moderatorId: 8 },
        "createArticle",
      ),
    ).toMatchObject({
      path: "/articles/create",
      query: { authorId: "7", moderatorId: "8" },
    });
    expect(articles.operations().find((item) => item.name === "createArticle")?.description).toMatch(/draft/i);

    expect(ideas.fromCsvRow({ ideaStatusId: 12, moderatorId: 8 }, "assignIdeaStatus", { resolvedId: 44 })).toMatchObject({
      path: "/ideas/44/assignIdeaStatus",
      body: { ideaStatusId: "12" },
    });
    expect(
      ideas.fromCsvRow({ productAreas: "1|2", moderatorId: 8 }, "assignProductAreas", { resolvedId: 44 }),
    ).toMatchObject({
      path: "/ideas/44/editProductAreas",
      body: { productAreas: ["1", "2"] },
    });
    expect(articles.fromCsvRow({ authorId: 9, moderatorId: 8 }, "changeAuthor", { resolvedId: 55 })).toMatchObject({
      path: "/articles/55/changeAuthor",
      body: { authorId: "9" },
    });
    expect(articles.fromCsvRow({ moderatorId: 8 }, "publish", { resolvedId: 55 })).toMatchObject({
      path: "/articles/55/publish",
    });
    expect(productUpdates.fromCsvRow({ moderatorId: 8 }, "publish", { resolvedId: 66 })).toMatchObject({
      path: "/productUpdates/66/publish",
    });
  });

  it("rejects writes on unified topics and missing actors", () => {
    expect(() => topics.fromCsvRow({ id: 1 }, "editTitle")).toThrow(/explore\/export only/);
    expect(topics.operations()).toEqual([]);
    expect(() => questions.fromCsvRow({ title: "x" }, "editTitle", { resolvedId: 1 })).toThrow(/moderatorId/);
    expect(() => articles.fromCsvRow({ spam: true, moderatorId: 8 }, "toggleSpam", { resolvedId: 1 })).toThrow(
      /Unknown operation/,
    );
  });
});

describe("ContentAdapter list/get/replies", () => {
  it("lists via /v2/topics, gets by type path, and lists replies", async () => {
    registerAdapter("questions", (client) => new ContentAdapter(client, "questions"));
    const calls: string[] = [];
    const adapter = getAdapter(
      "questions",
      mockClient((url) => {
        calls.push(`${url.pathname}${url.search}`);
        if (url.pathname === "/v2/topics") {
          return jsonResponse(topicList);
        }
        if (url.pathname === "/v2/questions/101") {
          return jsonResponse(questionFixture);
        }
        if (url.pathname === "/v2/questions/101/replies") {
          return jsonResponse(questionReplies);
        }
        return jsonResponse({ message: "not found" }, 404);
      }),
    ) as ContentAdapter;

    const page = await adapter.list({ q: "export" }, { page: 1, pageSize: 25 });
    expect(page.records[0]).toMatchObject({ id: "101", type: "question", title: "How do I export users?" });
    expect(calls[0]).toContain("/v2/topics");
    expect(calls[0]).toContain("contentTypes%5B%5D=question");
    expect(calls[0]).toContain("q=export");

    await expect(adapter.get(101)).resolves.toMatchObject({ id: "101", author: "ops" });
    const replies = await adapter.listReplies(101, { page: 1, pageSize: 25 });
    expect(replies.records[0]).toMatchObject({ id: "501", content: "Try Workbench export." });
    expect(adapter.exportColumnNames()).toContain("moderatorTags");
    expect(adapter.describeFilters().map((item) => item.name)).toContain("createdAt[from]");
  });

  it("marks hitCap on the 10k validation error", async () => {
    const adapter = new ContentAdapter(
      mockClient(() => jsonResponse(validationError, 422)),
      "topics",
    );
    const page = await adapter.list({}, { page: 101, pageSize: 100 });
    expect(page.hitCap).toBe(true);
    expect(page.exhausted).toBe(true);
    expect(page.records).toEqual([]);
  });

  it("marks hitCap when a page reaches the 10,000 offset", async () => {
    const adapter = new ContentAdapter(
      mockClient(() =>
        jsonResponse({
          result: Array.from({ length: 100 }, (_, index) => ({ id: String(index), contentType: "question" })),
        }),
      ),
      "topics",
    );
    const page = await adapter.list({}, { page: TOPIC_LIST_CAP / 100, pageSize: 100 });
    expect(page.records).toHaveLength(100);
    expect(page.hitCap).toBe(true);
    expect(page.exhausted).toBe(true);
  });

  it("refuses get on unified topics", async () => {
    const adapter = new ContentAdapter(mockClient(() => jsonResponse({})), "topics");
    await expect(adapter.get(1)).rejects.toThrow(/no get-by-id/);
  });
});
