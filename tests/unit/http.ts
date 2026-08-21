import { getAuthenticatedClient } from "../../src/lib/auth.js";
import { createApiClient, type ApiClientOptions } from "../../src/lib/apiClient.js";
import { RetryPolicy } from "../../src/lib/retry.js";
import type { GainsightConfig } from "../../src/lib/types.js";

export const TEST_CONFIG: GainsightConfig = {
  profile: "sandbox",
  baseUrl: "https://example.invalid",
  clientId: "test-client-id-value",
  clientSecret: "test-client-secret-value",
  envFile: ".env.sandbox",
};

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/** In-memory fetch mock. Unit tests do not use nock/msw. */
export function mockClient(
  handler: (url: URL, init?: RequestInit) => Response | Promise<Response> = () => jsonResponse({}),
  options: ApiClientOptions = {},
) {
  const auth = getAuthenticatedClient(TEST_CONFIG, {
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
