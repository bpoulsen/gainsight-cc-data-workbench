import { describe, expect, it } from "vitest";
import { getAuthenticatedClient } from "../lib/auth.js";
import { createApiClient, type ApiClientOptions } from "../lib/apiClient.js";
import { RetryPolicy } from "../lib/retry.js";
import type { GainsightConfig } from "../lib/types.js";
import { AdapterError, getAdapter, registerAdapter } from "./index.js";
import {
  UsersAdapter,
  chunkItems,
  normalizeUser,
} from "./users.js";
import userFixture from "../lib/fixtures/user.json" with { type: "json" };
import userList from "../lib/fixtures/user-list-iterable.json" with { type: "json" };
import findByUser from "../lib/fixtures/find-by-user.json" with { type: "json" };

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

describe("normalizeUser", () => {
  it("maps userid to id and flattens roles, badges, and profile fields", () => {
    const record = normalizeUser(userFixture);
    expect(record.id).toBe(7);
    expect(record.email).toBe("ops@example.com");
    expect(record.roles).toEqual(["roles.registered"]);
    expect(record.badges).toEqual(["helper"]);
    expect(record.profileFields).toEqual({ Department: "Ops" });
  });
});

describe("UsersAdapter fromCsvRow", () => {
  const adapter = new UsersAdapter(mockClient(() => jsonResponse({})));

  it("plans register, field updates, roles, badges, and erase", () => {
    expect(
      adapter.fromCsvRow(
        { email: "ops@example.com", username: "ops", password: "secret12", user_role: "roles.registered" },
        "register",
      ),
    ).toMatchObject({
      method: "POST",
      path: "/user/register",
      body: {
        email: "ops@example.com",
        username: "ops",
        password: "secret12",
        user_role: ["roles.registered"],
      },
      retryable: true,
    });

    expect(
      adapter.fromCsvRow({ field: "username", value: "ops" }, "updateField", { resolvedId: 7 }),
    ).toEqual({
      method: "PUT",
      path: "/user/7/username/ops",
      operation: "updateField",
      retryable: true,
      resolvedId: 7,
    });

    expect(
      adapter.fromCsvRow({ field: "Department", value: "Ops" }, "updateProfileField", {
        resolvedId: 7,
      }),
    ).toMatchObject({
      method: "PUT",
      path: "/user/7/profile_field/Department/Ops",
    });

    expect(adapter.fromCsvRow({ field: "Department" }, "deleteProfileField", { resolvedId: 7 })).toMatchObject({
      method: "DELETE",
      path: "/user/7/profile_field/Department",
    });

    expect(adapter.fromCsvRow({ role: "roles.moderator" }, "addRole", { resolvedId: 7 })).toMatchObject({
      method: "POST",
      path: "/user/7/role",
      body: { data: { user_role: ["roles.moderator"] } },
    });

    expect(adapter.fromCsvRow({ roleName: "roles.moderator" }, "removeRole", { resolvedId: 7 })).toMatchObject({
      method: "DELETE",
      path: "/user/7/role/roles.moderator",
      retryable: false,
    });

    expect(adapter.fromCsvRow({ badgeId: 11 }, "awardBadge", { resolvedId: 7 })).toMatchObject({
      method: "PUT",
      path: "/user/7/badge/11",
    });

    expect(adapter.fromCsvRow({ badgeId: 11 }, "revokeBadge", { resolvedId: 7 })).toMatchObject({
      method: "DELETE",
      path: "/user/7/badge/11",
    });

    const erase = adapter.fromCsvRow({ id: 7 }, "erase");
    expect(erase.method).toBe("DELETE");
    expect(erase.path).toBe("/user/7/erase");
    expect(erase.retryable).toBe(false);
    expect(adapter.operations().find((item) => item.name === "erase")?.confirmation).toBe("typed");
  });

  it("rejects unknown update fields", () => {
    expect(() =>
      adapter.fromCsvRow({ field: "password", value: "x" }, "updateField", { resolvedId: 7 }),
    ).toThrow(AdapterError);
  });
});

describe("UsersAdapter native bulk", () => {
  const adapter = new UsersAdapter(mockClient(() => jsonResponse({})));

  it("groups matching role sets and chunks userIds", () => {
    const plans = adapter.nativeBulkPlans(
      [
        { row: { roleIds: "7|13" }, resolvedId: 1 },
        { row: { roleIds: "13|7" }, resolvedId: 2 },
        { row: { roleIds: "7|13" }, resolvedId: 3 },
        { row: { roleIds: "9" }, resolvedId: 4 },
      ],
      "bulkAddRoles",
      2,
    );
    expect(plans).toHaveLength(3);
    expect(plans[0]).toMatchObject({
      method: "POST",
      path: "/user/bulk/role",
      body: { data: { userIds: [1, 2], roleIds: [7, 13] } },
      retryable: true,
    });
    expect(plans[1]?.body).toEqual({ data: { userIds: [3], roleIds: [7, 13] } });
    expect(plans[2]).toMatchObject({
      body: { data: { userIds: [4], roleIds: [9] } },
    });
  });

  it("builds bulk revoke badge deletes that are not retryable", () => {
    const plans = adapter.nativeBulkPlans(
      [{ row: { badgeIds: 11 }, resolvedId: 8 }],
      "bulkRevokeBadges",
    );
    expect(plans[0]).toMatchObject({
      method: "DELETE",
      path: "/user/bulk/badge",
      body: { data: { userIds: [8], badgeIds: [11] } },
      retryable: false,
    });
  });

  it("chunks arrays to the configured size", () => {
    expect(chunkItems([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });
});

describe("UsersAdapter list/get/find", () => {
  it("lists iterable users and looks up by id or email", async () => {
    registerAdapter("users", (client) => new UsersAdapter(client));
    const calls: string[] = [];
    const adapter = getAdapter(
      "users",
      mockClient((url) => {
        calls.push(url.pathname + url.search);
        if (url.pathname === "/user") {
          return jsonResponse(userList);
        }
        if (url.pathname === "/user/7") {
          return jsonResponse(userFixture);
        }
        if (url.pathname.startsWith("/user/email/")) {
          return jsonResponse(findByUser);
        }
        return jsonResponse({ message: "not found" }, 404);
      }),
    ) as UsersAdapter;

    const page = await adapter.list(
      { "filter[roles.rolename][]": ["roles.registered"] },
      { page: 1, pageSize: 25 },
    );
    expect(page.records[0]).toMatchObject({ id: 7, email: "ops@example.com" });
    expect(calls[0]).toContain("_returnIterable=true");
    expect(calls[0]).toContain("filter%5Broles.rolename%5D%5B%5D=roles.registered");

    await expect(adapter.get(7)).resolves.toMatchObject({ id: 7, username: "ops" });
    await expect(adapter.find("email", "ops@example.com")).resolves.toMatchObject({ id: 7 });
    expect(adapter.exportColumnNames()).toEqual([
      "id",
      "email",
      "username",
      "roles",
      "badges",
      "joindate",
      "lastactivity",
      "rank",
      "profileFields",
    ]);
    expect(adapter.describeFilters().map((item) => item.name)).toContain("filter[joindate][from]");
  });
});
