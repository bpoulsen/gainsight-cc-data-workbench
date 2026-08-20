import { describe, expect, it } from "vitest";
import {
  AuthError,
  getAuthenticatedClient,
  redactSecrets,
  REQUIRED_OAUTH_SCOPE,
  TOKEN_REFRESH_SKEW_MS,
  TokenManager,
} from "./auth.js";
import type { GainsightConfig } from "./types.js";
import fixture from "./fixtures/oauth-token.json" with { type: "json" };

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

describe("redactSecrets", () => {
  it("strips client secret and access tokens", () => {
    const text = "secret=test-client-secret-value token=aaaa-bbbb-cccc-dddd";
    expect(
      redactSecrets(text, ["test-client-secret-value", "aaaa-bbbb-cccc-dddd"]),
    ).toBe("secret=[REDACTED] token=[REDACTED]");
  });
});

describe("TokenManager", () => {
  it("requests a client-credentials token with read write scope", async () => {
    let calls = 0;
    const manager = new TokenManager(config, async (_url, init) => {
      calls += 1;
      const body = String(init?.body);
      expect(body).toContain("grant_type=client_credentials");
      expect(body).toContain("scope=read+write");
      expect(body).toContain("client_id=test-client-id-value");
      expect(init?.headers).toMatchObject({
        "Content-Type": "application/x-www-form-urlencoded",
      });
      return jsonResponse(fixture);
    });

    const token = await manager.getAccessToken();
    expect(token).toBe(fixture.access_token);
    expect(calls).toBe(1);
    expect(manager.getCachedToken()?.expiresAt).toBeGreaterThan(Date.now());
  });

  it("reuses a cached token before the refresh skew", async () => {
    let now = 1_000_000;
    let calls = 0;
    const manager = new TokenManager(
      config,
      async () => {
        calls += 1;
        return jsonResponse({ ...fixture, access_token: "cached-token-value-xxxx" });
      },
      () => now,
    );

    await manager.getAccessToken();
    now += 1000;
    await manager.getAccessToken();
    expect(calls).toBe(1);
  });

  it("refreshes when now + 60s is past expiry", async () => {
    let now = 0;
    let calls = 0;
    const manager = new TokenManager(
      config,
      async () => {
        calls += 1;
        return jsonResponse({
          access_token: `token-call-${calls}-xxxxxxxxxx`,
          expires_in: 70,
          token_type: "Bearer",
          scope: REQUIRED_OAUTH_SCOPE,
        });
      },
      () => now,
    );

    const first = await manager.getAccessToken();
    now += 70_000 - TOKEN_REFRESH_SKEW_MS + 1;
    const second = await manager.getAccessToken();
    expect(calls).toBe(2);
    expect(second).not.toBe(first);
  });

  it("redacts secrets when the token endpoint fails", async () => {
    const manager = new TokenManager(config, async () =>
      jsonResponse(
        {
          error: "invalid_client",
          error_description: `bad secret test-client-secret-value`,
        },
        401,
      ),
    );

    await expect(manager.getAccessToken()).rejects.toSatisfy((error: unknown) => {
      expect(error).toBeInstanceOf(AuthError);
      const message = String(error);
      expect(message).not.toContain("test-client-secret-value");
      expect(message).toContain("[REDACTED]");
      expect(message).toMatch(/401/);
      return true;
    });
  });

  it("fails if the issued token omits read write scope", async () => {
    const manager = new TokenManager(config, async () =>
      jsonResponse({
        access_token: "scopeless-token-value-xxxx",
        expires_in: 7200,
        scope: "read",
      }),
    );
    await expect(manager.getAccessToken()).rejects.toThrow(/read write/);
  });
});

describe("getAuthenticatedClient", () => {
  it("retries once after 401 by refreshing the token", async () => {
    const calls: Array<{ url: string; auth?: string }> = [];
    let tokens = 0;
    const client = getAuthenticatedClient(config, {
      fetchImpl: async (input, init) => {
        const url = String(input);
        if (url.endsWith("/oauth2/token")) {
          tokens += 1;
          return jsonResponse({
            access_token: `live-token-${tokens}-xxxxxxxxxx`,
            expires_in: 7200,
            token_type: "Bearer",
            scope: "read write",
          });
        }
        const auth = new Headers(init?.headers).get("Authorization") ?? undefined;
        calls.push({ url, auth });
        if (calls.length === 1) {
          return jsonResponse({ message: "unauthorized" }, 401);
        }
        return jsonResponse({ ok: true });
      },
    });

    const result = await client.request<{ ok: boolean }>({
      method: "GET",
      path: "/user",
    });
    expect(result.status).toBe(200);
    expect(result.data).toEqual({ ok: true });
    expect(tokens).toBe(2);
    expect(calls).toHaveLength(2);
    expect(calls[0]?.auth).not.toBe(calls[1]?.auth);
  });

  it("does not retry deletes-style 401 loops more than once", async () => {
    const client = getAuthenticatedClient(config, {
      fetchImpl: async (input) => {
        const url = String(input);
        if (url.endsWith("/oauth2/token")) {
          return jsonResponse({
            access_token: "always-unauthorized-token-xx",
            expires_in: 7200,
            scope: "read write",
          });
        }
        return jsonResponse({ message: "still unauthorized" }, 401);
      },
    });

    await expect(
      client.request({ method: "GET", path: "/v2/topics" }),
    ).rejects.toSatisfy((error: unknown) => {
      expect(error).toBeInstanceOf(AuthError);
      expect(String(error)).not.toContain("always-unauthorized-token-xx");
      expect(String(error)).toMatch(/401/);
      return true;
    });
  });
});
