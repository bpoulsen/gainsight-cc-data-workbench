import { describe, expect, it } from "vitest";
import { AuthError, getAuthenticatedClient } from "./auth.js";
import {
  ApiError,
  communityApi,
  createApiClient,
  eventsApi,
  extractPageItems,
  gamificationApi,
  isDebugEnabled,
  joinApiPath,
  NotFoundError,
  RateLimitError,
  searchApi,
  ServerError,
  usersApi,
  ValidationError,
  type ApiClientOptions,
} from "./apiClient.js";
import { RetryPolicy } from "./retry.js";
import type { GainsightConfig } from "./types.js";
import topicList from "./fixtures/topic-list.json" with { type: "json" };
import userList from "./fixtures/user-list-iterable.json" with { type: "json" };
import validationError from "./fixtures/validation-error.json" with { type: "json" };

const config: GainsightConfig = {
  profile: "sandbox",
  baseUrl: "https://example.invalid",
  clientId: "test-client-id-value",
  clientSecret: "test-client-secret-value",
  envFile: ".env.sandbox",
};

function jsonResponse(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

function tokenThen(handler: (url: URL, init?: RequestInit) => Response | Promise<Response>) {
  return getAuthenticatedClient(config, {
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
}

function withFastRetry(options: ApiClientOptions = {}): ApiClientOptions {
  const { retry, ...rest } = options;
  return {
    retry:
      retry ??
      new RetryPolicy({
        sleep: async () => {},
        random: () => 0.5,
        log: () => {},
      }),
    ...rest,
  };
}

async function collected<T>(iter: AsyncIterable<T>): Promise<T[]> {
  const items: T[] = [];
  for await (const item of iter) {
    items.push(item);
  }
  return items;
}

describe("extractPageItems", () => {
  it("reads community result arrays", () => {
    expect(extractPageItems(topicList)).toEqual(topicList.result);
  });

  it("reads iterable user lists", () => {
    expect(extractPageItems(userList)).toEqual(userList.users);
  });

  it("reads UserResponse bags keyed by id", () => {
    const bag = {
      "7": { userid: 7, email: "ops@example.com" },
      statistics: { count: 1 },
    };
    expect(extractPageItems(bag)).toEqual([{ userid: 7, email: "ops@example.com" }]);
  });
});

describe("joinApiPath / family prefixes", () => {
  it("prefixes community and events with /v2", () => {
    expect(joinApiPath("/v2", "/topics")).toBe("/v2/topics");
    expect(joinApiPath("/v2", "/v2/topics")).toBe("/v2/topics");
    expect(joinApiPath("", "/user")).toBe("/user");
  });
});

describe("isDebugEnabled", () => {
  it("accepts GS_DEBUG and DEBUG=gainsight", () => {
    expect(isDebugEnabled({ GS_DEBUG: "1" })).toBe(true);
    expect(isDebugEnabled({ DEBUG: "gainsight" })).toBe(true);
    expect(isDebugEnabled({ DEBUG: "http,gainsight" })).toBe(true);
    expect(isDebugEnabled({})).toBe(false);
  });
});

describe("createApiClient errors", () => {
  it("maps 404, 422, 429, and 5xx to typed errors", async () => {
    const cases = [
      { status: 404, body: { message: "not found" }, type: NotFoundError },
      { status: 422, body: validationError, type: ValidationError },
      { status: 429, body: { message: "slow down" }, type: RateLimitError },
      { status: 503, body: { message: "unavailable" }, type: ServerError },
      { status: 400, body: { message: "bad request" }, type: ApiError },
    ] as const;

    for (const testCase of cases) {
      const client = createApiClient(
        tokenThen(() =>
          jsonResponse(testCase.body, testCase.status, {
            "Retry-After": "2",
          }),
        ),
        withFastRetry(),
      );
      await expect(client.get("/v2/topics")).rejects.toSatisfy((error: unknown) => {
        expect(error).toBeInstanceOf(testCase.type);
        expect(String(error)).not.toContain("live-token-value-xxxxxxxxxx");
        expect(String(error)).not.toContain("test-client-secret-value");
        if (error instanceof RateLimitError) {
          expect(error.retryAfterMs).toBe(2000);
        }
        if (error instanceof ValidationError) {
          expect(error.errors[0]).toMatch(/10,000/);
        }
        return true;
      });
    }
  });

  it("lets AuthError from a second 401 propagate", async () => {
    const client = createApiClient(
      tokenThen(() => jsonResponse({ message: "unauthorized" }, 401)),
      withFastRetry(),
    );
    await expect(client.get("/user")).rejects.toBeInstanceOf(AuthError);
  });
});

describe("HTTP wrappers", () => {
  it("sends GET, POST, PATCH, and DELETE", async () => {
    const methods: string[] = [];
    const client = createApiClient(
      tokenThen((url, init) => {
        methods.push(init?.method ?? "GET");
        if (init?.method === "POST") {
          expect(JSON.parse(String(init.body))).toEqual({ title: "hi" });
        }
        expect(url.pathname).toMatch(/\/user|\/v2\/topics/);
        return jsonResponse({ ok: true }, init?.method === "POST" ? 201 : 200);
      }),
      withFastRetry(),
    );

    await client.get("/user");
    await client.post("/v2/topics", { title: "hi" });
    await client.patch("/user", { username: "ops" });
    await client.delete("/user");
    expect(methods).toEqual(["GET", "POST", "PATCH", "DELETE"]);
  });

  it("prefixes family clients and redacts debug logs", async () => {
    const logs: string[] = [];
    const urls: string[] = [];
    const client = createApiClient(
      tokenThen((url) => {
        urls.push(url.pathname);
        return jsonResponse(topicList);
      }),
      withFastRetry({
        isDebugEnabled: () => true,
        debug: (message) => logs.push(message),
      }),
    );

    const topics = await communityApi(client).get("/topics");
    await eventsApi(client).get("/events");
    await usersApi(client).get("/user");
    await gamificationApi(client).get("/leaderboard");
    await searchApi(client).get("/search", { q: "export" });

    expect(urls).toEqual([
      "/v2/topics",
      "/v2/events",
      "/user",
      "/leaderboard",
      "/search",
    ]);
    expect(topics.data).toEqual(topicList);
    expect(logs.some((line) => line.includes("Authorization") && line.includes("[REDACTED]"))).toBe(
      false,
    );
    expect(logs.join("\n")).not.toContain("live-token-value-xxxxxxxxxx");
    expect(logs.join("\n")).toMatch(/API GET \/v2\/topics -> HTTP 200/);
  });
});

describe("paginate", () => {
  it("follows page until a short page", async () => {
    const pages: string[] = [];
    const client = createApiClient(
      tokenThen((url) => {
        pages.push(url.searchParams.get("page") ?? "");
        const page = Number(url.searchParams.get("page"));
        const items = page === 1 ? [{ id: "1" }, { id: "2" }] : [{ id: "3" }];
        return jsonResponse({ result: items });
      }),
      withFastRetry(),
    );

    const items = await collected(
      communityApi(client).paginate<{ id: string }>({ path: "/topics", pageSize: 2 }),
    );
    expect(items.map((item) => item.id)).toEqual(["1", "2", "3"]);
    expect(pages).toEqual(["1", "2"]);
  });

  it("stops on an empty page", async () => {
    const client = createApiClient(
      tokenThen(() => jsonResponse({ result: [] })),
      withFastRetry(),
    );
    await expect(collected(client.paginate({ path: "/v2/topics" }))).resolves.toEqual([]);
  });

  it("surfaces the 10k topic cap as ValidationError", async () => {
    const client = createApiClient(
      tokenThen(() => jsonResponse(validationError, 422)),
      withFastRetry(),
    );
    await expect(
      collected(communityApi(client).paginate({ path: "/topics" })),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it("stops when the caller aborts", async () => {
    const controller = new AbortController();
    let calls = 0;
    const client = createApiClient(
      tokenThen(() => {
        calls += 1;
        if (calls === 1) {
          controller.abort();
        }
        return jsonResponse({ result: [{ id: String(calls) }, { id: `${calls}b` }] });
      }),
      withFastRetry(),
    );

    await expect(
      collected(
        client.paginate({ path: "/v2/topics", pageSize: 2, signal: controller.signal }),
      ),
    ).rejects.toThrow(/aborted/i);
    expect(calls).toBe(1);
  });

  it("requests iterable user pages by default", async () => {
    let iterable: string | null = null;
    const client = createApiClient(
      tokenThen((url) => {
        iterable = url.searchParams.get("_returnIterable");
        return jsonResponse(userList);
      }),
      withFastRetry(),
    );
    const users = await collected(usersApi(client).paginate({ path: "/user" }));
    expect(iterable).toBe("true");
    expect(users).toEqual(userList.users);
  });
});

describe("retry and concurrency", () => {
  it("retries GET 429 using Retry-After then succeeds", async () => {
    const sleeps: number[] = [];
    const logs: string[] = [];
    let calls = 0;
    const client = createApiClient(
      tokenThen(() => {
        calls += 1;
        if (calls < 3) {
          return jsonResponse({ message: "slow down" }, 429, { "Retry-After": "2" });
        }
        return jsonResponse({ ok: true });
      }),
      withFastRetry({
        retry: new RetryPolicy({
          sleep: async (ms) => {
            sleeps.push(ms);
          },
          random: () => 0.5,
          log: (message) => logs.push(message),
        }),
      }),
    );

    await expect(client.get("/v2/topics")).resolves.toMatchObject({ status: 200 });
    expect(calls).toBe(3);
    expect(sleeps).toEqual([2000, 2000]);
    expect(logs[0]).toMatch(/Retry GET \/v2\/topics after HTTP 429/);
  });

  it("uses exponential backoff for 503 without Retry-After", async () => {
    const sleeps: number[] = [];
    let calls = 0;
    const client = createApiClient(
      tokenThen(() => {
        calls += 1;
        if (calls < 3) {
          return jsonResponse({ message: "unavailable" }, 503);
        }
        return jsonResponse({ ok: true });
      }),
      withFastRetry({
        retry: new RetryPolicy({
          sleep: async (ms) => {
            sleeps.push(ms);
          },
          random: () => 0.5,
          log: () => {},
        }),
      }),
    );

    await client.get("/user");
    expect(calls).toBe(3);
    expect(sleeps).toEqual([1000, 2000]);
  });

  it("does not retry delete-like operations", async () => {
    const cases = [
      { method: "DELETE" as const, path: "/v2/articles/1" },
      { method: "POST" as const, path: "/v2/articles/1/toggleTrashed" },
      { method: "POST" as const, path: "/user/7/erase" },
    ];

    for (const testCase of cases) {
      let calls = 0;
      const client = createApiClient(
        tokenThen(() => {
          calls += 1;
          return jsonResponse({ message: "slow down" }, 429, { "Retry-After": "2" });
        }),
        withFastRetry(),
      );
      await expect(
        client.request({ method: testCase.method, path: testCase.path }),
      ).rejects.toSatisfy((error: unknown) => {
        expect(error).toBeInstanceOf(RateLimitError);
        expect((error as RateLimitError).attempts).toBe(1);
        return true;
      });
      expect(calls).toBe(1);
    }
  });

  it("does not retry when operation is toggleTrashed", async () => {
    let calls = 0;
    const client = createApiClient(
      tokenThen(() => {
        calls += 1;
        return jsonResponse({ message: "slow down" }, 429);
      }),
      withFastRetry(),
    );
    await expect(
      client.post("/v2/articles/1", undefined, undefined, { operation: "toggleTrashed" }),
    ).rejects.toBeInstanceOf(RateLimitError);
    expect(calls).toBe(1);
  });

  it("records exhausted 429s for the results CSV", async () => {
    const client = createApiClient(
      tokenThen(() => jsonResponse({ message: "slow down" }, 429, { "Retry-After": "1" })),
      withFastRetry(),
    );
    const error = await client.get("/v2/topics").then(
      () => {
        throw new Error("expected failure");
      },
      (caught: unknown) => caught,
    );
    expect(error).toBeInstanceOf(RateLimitError);
    expect((error as RateLimitError).attempts).toBe(3);
  });

  it("caps concurrent API calls", async () => {
    let inflight = 0;
    let maxInflight = 0;
    const client = createApiClient(
      tokenThen(async () => {
        inflight += 1;
        maxInflight = Math.max(maxInflight, inflight);
        await new Promise((resolve) => {
          setTimeout(resolve, 40);
        });
        inflight -= 1;
        return jsonResponse({ ok: true });
      }),
      withFastRetry({ concurrency: 2 }),
    );

    await Promise.all([
      client.get("/user"),
      client.get("/user"),
      client.get("/user"),
      client.get("/user"),
      client.get("/user"),
    ]);
    expect(maxInflight).toBe(2);
  });
});
