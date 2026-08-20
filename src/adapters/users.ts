import { DEFAULT_PAGE_SIZE } from "../lib/api/pagination.js";
import type { QueryParams } from "../lib/auth.js";
import type { RequestExtras } from "../lib/apiClient.js";
import { flattenValue } from "../lib/csv.js";
import {
  AdapterError,
  BaseAdapter,
  type ApiCallPlan,
  type ExportField,
  type FilterPrompt,
  type FromCsvRowContext,
  type PageRequest,
  type ResourceOperation,
} from "./base.js";

export const USER_BULK_CHUNK_SIZE = 100;

export const USER_FIND_FIELDS = [
  "email",
  "userid",
  "username",
  "oauth2_sso_id",
  "oracle_sso_id",
  "token_sso_id",
  "openidconnect_sso_id",
  "facebook_sso_id",
  "janrain_sso_id",
  "saml_sso_id",
  "linkedin_sso_id",
] as const;

export const USER_UPDATE_FIELDS = [
  "email",
  "username",
  "avatar",
  "oauth2_sso_id",
  "oracle_sso_id",
  "token_sso_id",
  "openidconnect_sso_id",
  "facebook_sso_id",
  "janrain_sso_id",
  "saml_sso_id",
  "linkedin_sso_id",
] as const;

const NATIVE_BULK_OPS = new Set([
  "bulkAddRoles",
  "bulkRemoveRoles",
  "bulkAwardBadges",
  "bulkRevokeBadges",
]);

export function chunkItems<T>(items: T[], size: number = USER_BULK_CHUNK_SIZE): T[][] {
  if (size < 1) {
    throw new AdapterError("Bulk chunk size must be >= 1");
  }
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

export function asStringList(value: unknown): string[] {
  if (value === undefined || value === null || value === "") {
    return [];
  }
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter((item) => item.length > 0);
  }
  return String(value)
    .split("|")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

export function asIdList(value: unknown, field: string): number[] {
  return asStringList(value).map((item) => {
    if (!/^\d+$/.test(item)) {
      throw new AdapterError(`${field} must be numeric (got "${item}")`);
    }
    return Number(item);
  });
}

export function normalizeUser(data: unknown): Record<string, unknown> {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new AdapterError("Expected a user object from the API");
  }
  const raw = data as Record<string, unknown>;
  const inner =
    raw.result && typeof raw.result === "object" && !Array.isArray(raw.result)
      ? (raw.result as Record<string, unknown>)
      : raw.user && typeof raw.user === "object" && !Array.isArray(raw.user)
        ? (raw.user as Record<string, unknown>)
        : raw;
  const userid = inner.userid ?? inner.id;
  return {
    ...inner,
    id: userid,
    userid,
    email: inner.email,
    username: inner.username,
    roles: extractRoles(inner),
    badges: extractBadges(inner),
    profileFields: extractProfileFields(inner),
    joindate: inner.joindate,
    lastactivity: inner.lastactivity,
  };
}

function extractRoles(user: Record<string, unknown>): string[] {
  if (Array.isArray(user.roles) && user.roles.every((item) => typeof item === "string")) {
    return user.roles as string[];
  }
  const names: string[] = [];
  if (Array.isArray(user.roles)) {
    for (const role of user.roles) {
      if (role && typeof role === "object") {
        const record = role as Record<string, unknown>;
        const nested = record._related && typeof record._related === "object"
          ? (record._related as Record<string, unknown>).items
          : undefined;
        const nestedName =
          nested && typeof nested === "object"
            ? (nested as Record<string, unknown>).name
            : undefined;
        const name = record.itemname ?? record.name ?? nestedName;
        if (typeof name === "string" && name.length > 0) {
          names.push(name);
        }
      }
    }
  }
  const related = relatedOf(user);
  if (Array.isArray(related?.roles)) {
    for (const role of related.roles) {
      if (role && typeof role === "object") {
        const record = role as Record<string, unknown>;
        const nested = record._related && typeof record._related === "object"
          ? (record._related as Record<string, unknown>).items
          : undefined;
        const nestedName =
          nested && typeof nested === "object"
            ? (nested as Record<string, unknown>).name
            : undefined;
        const name = record.itemname ?? nestedName;
        if (typeof name === "string" && name.length > 0 && !names.includes(name)) {
          names.push(name);
        }
      }
    }
  }
  return names;
}

function extractBadges(user: Record<string, unknown>): string[] {
  if (Array.isArray(user.badges) && user.badges.every((item) => typeof item === "string" || typeof item === "number")) {
    return user.badges.map((item) => String(item));
  }
  const related = relatedOf(user);
  if (!Array.isArray(related?.badges)) {
    return [];
  }
  return related.badges.flatMap((badge) => {
    if (!badge || typeof badge !== "object") {
      return [];
    }
    const record = badge as Record<string, unknown>;
    const name = record.name ?? record.id;
    return name === undefined ? [] : [String(name)];
  });
}

function extractProfileFields(user: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  if (Array.isArray(user.profileFields)) {
    for (const field of user.profileFields) {
      if (field && typeof field === "object") {
        const record = field as Record<string, unknown>;
        const name = record.name;
        const value = record.NormalizedValue ?? record.value;
        if (typeof name === "string" && value !== undefined) {
          out[name] = String(value);
        }
      }
    }
  }
  const related = relatedOf(user);
  if (Array.isArray(related?.userprofilefields)) {
    for (const field of related.userprofilefields) {
      if (field && typeof field === "object") {
        const record = field as Record<string, unknown>;
        const name = record.profilefield_name;
        const value = record.value;
        if (typeof name === "string" && value !== undefined) {
          out[name] = String(value);
        }
      }
    }
  }
  return out;
}

function relatedOf(user: Record<string, unknown>): Record<string, unknown> | undefined {
  return user._related && typeof user._related === "object"
    ? (user._related as Record<string, unknown>)
    : undefined;
}

function firstString(row: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
    if (typeof value === "number") {
      return String(value);
    }
    if (Array.isArray(value) && value.length > 0) {
      return String(value[0]);
    }
  }
  return undefined;
}

export class UsersAdapter extends BaseAdapter {
  readonly name = "users" as const;
  readonly label = "Users";
  readonly family = "users" as const;
  readonly identity = "id-or-email" as const;

  async list(filters: QueryParams, page: PageRequest) {
    const pageSize = page.pageSize ?? DEFAULT_PAGE_SIZE;
    const query: QueryParams = {
      ...filters,
      _returnIterable: true,
      page: page.page,
      pageSize,
    };
    const extras: RequestExtras = {};
    if (page.signal !== undefined) {
      extras.signal = page.signal;
    }
    const response = await this.familyClient().get("/user", query, extras);
    const records = this.itemsFrom(response.data).map((item) => normalizeUser(item));
    return this.toListPage(records, page.page, pageSize);
  }

  async get(id: string | number, signal?: AbortSignal) {
    const extras: RequestExtras = {};
    if (signal !== undefined) {
      extras.signal = signal;
    }
    const response = await this.familyClient().get(`/user/${encodeURIComponent(String(id))}`, undefined, extras);
    return normalizeUser(this.unwrapRecord(response.data));
  }

  async find(field: string, value: string, signal?: AbortSignal) {
    if (!(USER_FIND_FIELDS as readonly string[]).includes(field)) {
      throw new AdapterError(
        `Cannot find users by "${field}". Expected one of: ${USER_FIND_FIELDS.join(", ")}`,
      );
    }
    const extras: RequestExtras = {};
    if (signal !== undefined) {
      extras.signal = signal;
    }
    const response = await this.familyClient().get(
      `/user/${encodeURIComponent(field)}/${encodeURIComponent(value)}`,
      undefined,
      extras,
    );
    return normalizeUser(this.unwrapRecord(response.data));
  }

  exportFields(): ExportField[] {
    return [
      { name: "id", kind: "number" },
      { name: "email", kind: "string" },
      { name: "username", kind: "string" },
      { name: "roles", kind: "string[]" },
      { name: "badges", kind: "string[]" },
      { name: "joindate", kind: "string" },
      { name: "lastactivity", kind: "string" },
      { name: "rank", kind: "string" },
      { name: "profileFields", kind: "json", flatten: (value) => flattenValue(value) },
    ];
  }

  operations(): ResourceOperation[] {
    return [
      {
        name: "register",
        kind: "create",
        label: "Register user",
        requiredColumns: ["email", "username", "password"],
        optionalColumns: ["user_role", "profile_field"],
      },
      {
        name: "updateField",
        kind: "update",
        label: "Update user field",
        requiredColumns: ["field", "value"],
      },
      {
        name: "updateProfileField",
        kind: "update",
        label: "Update profile field",
        requiredColumns: ["field", "value"],
      },
      {
        name: "deleteProfileField",
        kind: "update",
        label: "Delete profile field",
        requiredColumns: ["field"],
      },
      {
        name: "addRole",
        kind: "update",
        label: "Add role",
        requiredColumns: ["role"],
        optionalColumns: ["roleName", "user_role"],
      },
      {
        name: "removeRole",
        kind: "update",
        label: "Remove role",
        requiredColumns: ["role"],
        optionalColumns: ["roleName"],
      },
      {
        name: "awardBadge",
        kind: "update",
        label: "Award badge",
        requiredColumns: ["badgeId"],
      },
      {
        name: "revokeBadge",
        kind: "update",
        label: "Revoke badge",
        requiredColumns: ["badgeId"],
      },
      {
        name: "erase",
        kind: "delete",
        label: "Erase user",
        description: "Anonymizes content created by the user",
        confirmation: "typed",
        requiredColumns: [],
      },
      {
        name: "bulkAddRoles",
        kind: "update",
        label: "Bulk add roles",
        nativeBulk: true,
        requiredColumns: ["roleIds"],
        optionalColumns: ["roles"],
      },
      {
        name: "bulkRemoveRoles",
        kind: "update",
        label: "Bulk remove roles",
        nativeBulk: true,
        requiredColumns: ["roleIds"],
        optionalColumns: ["roles"],
      },
      {
        name: "bulkAwardBadges",
        kind: "update",
        label: "Bulk award badges",
        nativeBulk: true,
        requiredColumns: ["badgeIds"],
        optionalColumns: ["badges"],
      },
      {
        name: "bulkRevokeBadges",
        kind: "delete",
        label: "Bulk revoke badges",
        nativeBulk: true,
        requiredColumns: ["badgeIds"],
        optionalColumns: ["badges"],
      },
    ];
  }

  fromCsvRow(
    row: Record<string, unknown>,
    operation: string,
    context?: FromCsvRowContext,
  ): ApiCallPlan {
    const spec = this.requireOperation(operation);
    if (operation === "register") {
      this.requireFields(row, spec.requiredColumns, operation);
      return this.callPlan({
        method: "POST",
        path: "/user/register",
        operation,
        body: this.registerBody(row),
      });
    }

    const id = this.identityValue(row, context);
    if (operation === "erase") {
      return this.callPlan({
        method: "DELETE",
        path: `/user/${encodeURIComponent(String(id))}/erase`,
        operation,
        resolvedId: id,
      });
    }
    if (operation === "updateField") {
      this.requireFields(row, spec.requiredColumns, operation);
      const field = String(row.field);
      if (!(USER_UPDATE_FIELDS as readonly string[]).includes(field)) {
        throw new AdapterError(
          `Cannot update user field "${field}". Expected one of: ${USER_UPDATE_FIELDS.join(", ")}`,
        );
      }
      return this.callPlan({
        method: "PUT",
        path: this.interpolatePath("/user/{id}/{field}/{value}", row, context),
        operation,
        resolvedId: id,
      });
    }
    if (operation === "updateProfileField") {
      this.requireFields(row, spec.requiredColumns, operation);
      return this.callPlan({
        method: "PUT",
        path: this.interpolatePath("/user/{id}/profile_field/{field}/{value}", row, context),
        operation,
        resolvedId: id,
      });
    }
    if (operation === "deleteProfileField") {
      this.requireFields(row, spec.requiredColumns, operation);
      return this.callPlan({
        method: "DELETE",
        path: this.interpolatePath("/user/{id}/profile_field/{field}", row, context),
        operation,
        resolvedId: id,
      });
    }
    if (operation === "addRole") {
      const role = firstString(row, ["role", "roleName", "user_role"]);
      if (!role) {
        throw new AdapterError("Operation addRole requires columns: role");
      }
      return this.callPlan({
        method: "POST",
        path: `/user/${encodeURIComponent(String(id))}/role`,
        operation,
        body: { data: { user_role: asStringList(row.role ?? row.roleName ?? row.user_role) } },
        resolvedId: id,
      });
    }
    if (operation === "removeRole") {
      const role = firstString(row, ["role", "roleName"]);
      if (!role) {
        throw new AdapterError("Operation removeRole requires columns: role");
      }
      return this.callPlan({
        method: "DELETE",
        path: `/user/${encodeURIComponent(String(id))}/role/${encodeURIComponent(role)}`,
        operation,
        resolvedId: id,
      });
    }
    if (operation === "awardBadge" || operation === "revokeBadge") {
      const badgeId = firstString(row, ["badgeId", "badge"]);
      if (!badgeId) {
        throw new AdapterError(`Operation ${operation} requires columns: badgeId`);
      }
      return this.callPlan({
        method: operation === "awardBadge" ? "PUT" : "DELETE",
        path: `/user/${encodeURIComponent(String(id))}/badge/${encodeURIComponent(badgeId)}`,
        operation,
        resolvedId: id,
      });
    }
    if (NATIVE_BULK_OPS.has(operation)) {
      const [plan] = this.nativeBulkPlans([{ row, resolvedId: Number(id) }], operation);
      if (!plan) {
        throw new AdapterError(`Could not build bulk plan for ${operation}`);
      }
      return plan;
    }
    throw new AdapterError(`Unsupported user operation "${operation}"`);
  }

  nativeBulkPlans(
    rows: Array<{ row: Record<string, unknown>; resolvedId: number }>,
    operation: string,
    chunkSize: number = USER_BULK_CHUNK_SIZE,
  ): ApiCallPlan[] {
    this.requireOperation(operation);
    if (!NATIVE_BULK_OPS.has(operation)) {
      throw new AdapterError(`${operation} is not a native bulk user operation`);
    }
    const isRole = operation === "bulkAddRoles" || operation === "bulkRemoveRoles";
    const method = operation === "bulkRemoveRoles" || operation === "bulkRevokeBadges" ? "DELETE" : "POST";
    const path = isRole ? "/user/bulk/role" : "/user/bulk/badge";
    const groups = new Map<string, { itemIds: number[]; userIds: number[] }>();

    for (const { row, resolvedId } of rows) {
      const itemIds = (
        isRole
          ? asIdList(row.roleIds ?? row.roles ?? row.role, "roleIds")
          : asIdList(row.badgeIds ?? row.badges ?? row.badgeId, "badgeIds")
      ).slice().sort((a, b) => a - b);
      if (itemIds.length === 0) {
        throw new AdapterError(
          `Operation ${operation} requires ${isRole ? "roleIds" : "badgeIds"}`,
        );
      }
      const key = itemIds.join(",");
      const group = groups.get(key) ?? { itemIds, userIds: [] };
      if (!group.userIds.includes(resolvedId)) {
        group.userIds.push(resolvedId);
      }
      groups.set(key, group);
    }

    const plans: ApiCallPlan[] = [];
    for (const group of groups.values()) {
      for (const userIds of chunkItems(group.userIds, chunkSize)) {
        const data = isRole
          ? { userIds, roleIds: group.itemIds }
          : { userIds, badgeIds: group.itemIds };
        plans.push(
          this.callPlan({
            method,
            path,
            operation,
            body: { data },
          }),
        );
      }
    }
    return plans;
  }

  describeFilters(): FilterPrompt[] {
    return [
      {
        name: "filter[roles.rolename][]",
        label: "Roles",
        type: "string[]",
        description: "Filter by role names",
      },
      {
        name: "filter[badges.badgeid][]",
        label: "Badge IDs",
        type: "number",
        description: "Filter by badge IDs",
      },
      {
        name: "filter[userid][]",
        label: "User IDs",
        type: "number",
      },
      {
        name: "filter[joindate][from]",
        label: "Joined from",
        type: "date",
      },
      {
        name: "filter[joindate][to]",
        label: "Joined to",
        type: "date",
      },
      {
        name: "filter[lastactivity][from]",
        label: "Last activity from",
        type: "date",
      },
      {
        name: "filter[lastactivity][to]",
        label: "Last activity to",
        type: "date",
      },
    ];
  }

  private registerBody(row: Record<string, unknown>): Record<string, unknown> {
    const body: Record<string, unknown> = {
      email: row.email,
      username: row.username,
      password: row.password,
    };
    const roles = asStringList(row.user_role ?? row.roles);
    if (roles.length > 0) {
      body.user_role = roles;
    }
    if (row.profile_field !== undefined && row.profile_field !== "") {
      if (typeof row.profile_field === "string") {
        try {
          body.profile_field = JSON.parse(row.profile_field) as unknown;
        } catch {
          throw new AdapterError("profile_field must be valid JSON");
        }
      } else {
        body.profile_field = row.profile_field;
      }
    }
    return body;
  }
}
