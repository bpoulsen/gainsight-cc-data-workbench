import { describe, expect, it } from "vitest";
import { getAuthenticatedClient } from "../lib/auth.js";
import { createApiClient, type ApiClientOptions } from "../lib/apiClient.js";
import { RetryPolicy } from "../lib/retry.js";
import type { GainsightConfig } from "../lib/types.js";
import { AdapterError, getAdapter } from "./index.js";
import { GamificationAdapter, normalizeLeaderboardUser } from "./gamification.js";
import leaderboard from "../lib/fixtures/leaderboard.json" with { type: "json" };
import userPoints from "../lib/fixtures/user-points.json" with { type: "json" };

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

describe("normalizeLeaderboardUser", () => {
  it("uses userId as the export id", () => {
    expect(normalizeLeaderboardUser(leaderboard[0])).toMatchObject({
      id: 7,
      userId: 7,
      points: 1200,
      name: "ops",
      leaderboardPosition: 1,
    });
  });
});

describe("GamificationAdapter fromCsvRow", () => {
  const adapter = new GamificationAdapter(mockClient(() => jsonResponse({})));

  it("plans assignPoints against POST /points/assign", () => {
    expect(adapter.fromCsvRow({ id: 7, points: 20 }, "assignPoints")).toMatchObject({
      method: "POST",
      path: "/points/assign",
      body: { user: 7, points: 20 },
      resolvedId: 7,
      retryable: true,
    });
    expect(
      adapter.fromCsvRow({ user: "8", points: "15" }, "assignPoints", { resolvedId: 8 }),
    ).toMatchObject({
      body: { user: 8, points: 15 },
      resolvedId: 8,
    });
    expect(adapter.operations().some((item) => item.name === "assignPoints")).toBe(true);
  });

  it("rejects unknown operations", () => {
    expect(() => adapter.fromCsvRow({ id: 7, points: 1 }, "awardBadge")).toThrow(AdapterError);
  });
});

describe("GamificationAdapter list/get", () => {
  it("lists the all-time leaderboard and gets a user position", async () => {
    const client = mockClient((url) => {
      if (url.pathname === "/leaderboard/user/7") {
        return jsonResponse(leaderboard[0]);
      }
      if (url.pathname === "/leaderboard") {
        expect(url.searchParams.get("page")).toBe("1");
        expect(url.searchParams.getAll("excluded[]")).toEqual(["roles.banned"]);
        return jsonResponse(leaderboard);
      }
      return jsonResponse({ message: "nope" }, 404);
    });
    const adapter = new GamificationAdapter(client);
    const listed = await adapter.list({ "excluded[]": "roles.banned" }, { page: 1 });
    expect(listed.records.map((row) => row.userId)).toEqual([7, 8]);
    expect(listed.records[0]).toMatchObject({ id: 7, leaderboardPosition: 1 });
    const one = await adapter.get("7");
    expect(one).toMatchObject({ id: 7, name: "ops", points: 1200 });
  });

  it("lists the weekly leaderboard when period=weekly", async () => {
    const client = mockClient((url) => {
      expect(url.pathname).toBe("/leaderboard/weekly");
      return jsonResponse(leaderboard);
    });
    const adapter = new GamificationAdapter(client);
    const listed = await adapter.list({ period: "weekly" }, { page: 1, pageSize: 25 });
    expect(listed.records).toHaveLength(2);
  });

  it("lists assigned points when userId[] is set (single unpaged response)", async () => {
    const client = mockClient((url) => {
      expect(url.pathname).toBe("/points");
      expect(url.searchParams.getAll("userId[]")).toEqual(["7", "8"]);
      expect(url.searchParams.get("earnedAt[from]")).toBe("2026-01-01");
      return jsonResponse(userPoints);
    });
    const adapter = new GamificationAdapter(client);
    const listed = await adapter.list(
      { "userId[]": "7|8", "earnedAt[from]": "2026-01-01" },
      { page: 1, pageSize: 1 },
    );
    expect(listed.exhausted).toBe(true);
    expect(listed.records).toEqual([
      { id: 7, userId: 7, points: 50 },
      { id: 8, userId: 8, points: 10 },
    ]);
    const rest = await adapter.list({ "userId[]": "7|8" }, { page: 2, pageSize: 1 });
    expect(rest.records).toEqual([]);
    expect(rest.exhausted).toBe(true);
  });

  it("registers gamification aliases on the adapter map", () => {
    const client = mockClient(() => jsonResponse({}));
    expect(getAdapter("gamification", client)).toBeInstanceOf(GamificationAdapter);
    expect(getAdapter("leaderboard", client).name).toBe("gamification");
    expect(getAdapter("points", client).identity).toBe("id-or-email");
  });
});
