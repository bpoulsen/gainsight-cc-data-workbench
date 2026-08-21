import { describe, expect, it } from "vitest";
import { getAuthenticatedClient } from "./auth.js";
import { createApiClient, type ApiClientOptions } from "./apiClient.js";
import { RetryPolicy } from "./retry.js";
import type { GainsightConfig } from "./types.js";
import {
  extractUserId,
  IdentityError,
  identityResultsFields,
  parseUserId,
  UserIdentityResolver,
} from "./identityResolver.js";
import findByUser from "./fixtures/find-by-user.json" with { type: "json" };

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

function tokenThen(handler: (url: URL) => Response | Promise<Response>) {
  return getAuthenticatedClient(config, {
    fetchImpl: async (input) => {
      const url = new URL(String(input));
      if (url.pathname.endsWith("/oauth2/token")) {
        return jsonResponse({
          access_token: "live-token-value-xxxxxxxxxx",
          expires_in: 7200,
          token_type: "Bearer",
          scope: "read write",
        });
      }
      return handler(url);
    },
  });
}

function client(
  handler: (url: URL) => Response | Promise<Response>,
  options: ApiClientOptions = {},
) {
  const { retry, ...rest } = options;
  return createApiClient(tokenThen(handler), {
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

describe("parseUserId / extractUserId", () => {
  it("accepts numeric ids and FindBy wrappers", () => {
    expect(parseUserId(7)).toBe(7);
    expect(parseUserId("12")).toBe(12);
    expect(parseUserId("")).toBeUndefined();
    expect(extractUserId(findByUser)).toBe(7);
    expect(extractUserId({ userid: 9 })).toBe(9);
  });

  it("rejects non-positive ids", () => {
    expect(() => parseUserId(0)).toThrow(IdentityError);
    expect(() => parseUserId("abc")).toThrow(/positive integer/);
  });
});

describe("UserIdentityResolver", () => {
  it("returns a numeric id without calling the API", async () => {
    let calls = 0;
    const resolver = new UserIdentityResolver(
      client(() => {
        calls += 1;
        return jsonResponse(findByUser);
      }),
    );
    await expect(resolver.resolveUserId({ id: 7 })).resolves.toBe(7);
    await expect(resolver.resolveUserId({ userid: "8" })).resolves.toBe(8);
    expect(calls).toBe(0);
    expect(resolver.stats).toMatchObject({ resolved: 2, apiCalls: 0, cacheHits: 0, failures: 0 });
  });

  it("resolves email via GET /user/email/{email} and caches the result", async () => {
    const emails: string[] = [];
    const resolver = new UserIdentityResolver(
      client((url) => {
        expect(url.pathname.startsWith("/user/email/")).toBe(true);
        emails.push(decodeURIComponent(url.pathname.slice("/user/email/".length)));
        return jsonResponse(findByUser);
      }),
    );

    await expect(resolver.resolveUserId({ email: "Ops@example.com" })).resolves.toBe(7);
    await expect(resolver.resolveUserId({ email: "ops@example.com" })).resolves.toBe(7);
    expect(emails).toEqual(["Ops@example.com"]);
    expect(resolver.stats.apiCalls).toBe(1);
    expect(resolver.stats.cacheHits).toBe(1);
    expect(resolver.stats.resolved).toBe(2);
  });

  it("accepts matching id+email and fails when they disagree", async () => {
    const resolver = new UserIdentityResolver(client(() => jsonResponse(findByUser)));
    await expect(resolver.resolveUserId({ id: 7, email: "ops@example.com" })).resolves.toBe(7);
    await expect(resolver.resolveUserId({ id: 9, email: "ops@example.com" })).rejects.toSatisfy(
      (error: unknown) => {
        expect(error).toBeInstanceOf(IdentityError);
        expect((error as IdentityError).code).toBe("conflict");
        expect(String(error)).toMatch(/will not guess/);
        return true;
      },
    );
  });

  it("maps 404 to user not found for the results CSV", async () => {
    const resolver = new UserIdentityResolver(
      client(() => jsonResponse({ message: "not found" }, 404)),
    );
    const error = await resolver.resolveUserId({ email: "missing@example.com" }).then(
      () => {
        throw new Error("expected failure");
      },
      (caught: unknown) => caught,
    );
    expect(error).toBeInstanceOf(IdentityError);
    expect((error as IdentityError).code).toBe("not_found");
    expect(identityResultsFields(error as IdentityError)).toEqual({
      status: "failed",
      http_status: 404,
      error: "User not found: missing@example.com. Verify email address.",
      resolved_id: "",
    });
    expect(resolver.stats.failures).toBe(1);

    await expect(resolver.resolveUserId({ email: "missing@example.com" })).rejects.toBeInstanceOf(
      IdentityError,
    );
    expect(resolver.stats.apiCalls).toBe(1);
    expect(resolver.stats.cacheHits).toBe(1);
  });

  it("requires id or email", async () => {
    const resolver = new UserIdentityResolver(client(() => jsonResponse(findByUser)));
    await expect(resolver.resolveUserId({})).rejects.toSatisfy((error: unknown) => {
      expect(error).toBeInstanceOf(IdentityError);
      expect((error as IdentityError).code).toBe("missing");
      return true;
    });
  });

  it("prefetches distinct emails for bulk user jobs", async () => {
    const emails: string[] = [];
    const resolver = new UserIdentityResolver(
      client((url) => {
        emails.push(decodeURIComponent(url.pathname.slice("/user/email/".length)));
        const email = emails[emails.length - 1] ?? "";
        const userid = email.startsWith("a@") ? 1 : 2;
        return jsonResponse({ result: { userid, email } });
      }),
    );

    await resolver.prefetch([
      { email: "a@example.com" },
      { email: "b@example.com" },
      { email: "a@example.com" },
      { id: 99 },
    ]);
    expect(emails.sort()).toEqual(["a@example.com", "b@example.com"]);

    await expect(resolver.resolveUserId({ email: "a@example.com" })).resolves.toBe(1);
    await expect(resolver.resolveUserId({ email: "b@example.com" })).resolves.toBe(2);
    expect(resolver.stats.apiCalls).toBe(2);
    expect(resolver.stats.cacheHits).toBe(2);
  });

  it("dedupes concurrent lookups for the same email", async () => {
    let inflight = 0;
    let maxInflight = 0;
    let calls = 0;
    const resolver = new UserIdentityResolver(
      client(async () => {
        calls += 1;
        inflight += 1;
        maxInflight = Math.max(maxInflight, inflight);
        await new Promise((resolve) => {
          setTimeout(resolve, 30);
        });
        inflight -= 1;
        return jsonResponse(findByUser);
      }),
    );

    const ids = await Promise.all([
      resolver.resolveUserId({ email: "ops@example.com" }),
      resolver.resolveUserId({ email: "OPS@example.com" }),
      resolver.resolveUserId({ email: "ops@example.com" }),
    ]);
    expect(ids).toEqual([7, 7, 7]);
    expect(calls).toBe(1);
    expect(maxInflight).toBe(1);
  });
});
