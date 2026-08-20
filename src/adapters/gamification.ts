/**
 * Gamification adapter: leaderboards and assigned points (explore/export),
 * plus bulk assignPoints.
 *
 * Family client is unprefixed. Points are POST /points/assign with body
 * { user, points } — there is no /user/{id}/points and no reason field.
 * Badge award/revoke stays on the users adapter.
 */
import { DEFAULT_PAGE_SIZE } from "../lib/api/pagination.js";
import type { QueryParams } from "../lib/auth.js";
import type { RequestExtras } from "../lib/apiClient.js";
import { pipeList } from "./content.js";
import { asIdList } from "./users.js";
import {
  AdapterError,
  BaseAdapter,
  type ApiCallPlan,
  type ExportField,
  type FilterPrompt,
  type FromCsvRowContext,
  type ListPage,
  type PageRequest,
  type ResourceOperation,
} from "./base.js";

function extrasOf(signal?: AbortSignal): RequestExtras {
  const extras: RequestExtras = {};
  if (signal !== undefined) {
    extras.signal = signal;
  }
  return extras;
}

function optionalString(row: Record<string, unknown>, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = row[key];
    if (value !== undefined && value !== "") {
      return String(value);
    }
  }
  return undefined;
}

function asInteger(value: unknown, field: string): number {
  if (typeof value === "number" && Number.isInteger(value)) {
    return value;
  }
  if (typeof value === "string" && /^-?\d+$/.test(value.trim())) {
    return Number(value.trim());
  }
  throw new AdapterError(`${field} must be an integer`);
}

export function normalizeLeaderboardUser(data: unknown): Record<string, unknown> {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new AdapterError("Expected a leaderboard user from the API");
  }
  const raw = data as Record<string, unknown>;
  const userId = raw.userId ?? raw.id;
  return {
    ...raw,
    id: userId,
    userId,
    points: raw.points,
    name: raw.name,
    leaderboardPosition: raw.leaderboardPosition,
    avatar: raw.avatar,
    rank: raw.rank,
  };
}

export function normalizeUserPoints(data: unknown): Record<string, unknown> {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new AdapterError("Expected a user-points object from the API");
  }
  const raw = data as Record<string, unknown>;
  const userId = raw.userId ?? raw.id;
  return {
    id: userId,
    userId,
    points: raw.points,
  };
}

export class GamificationAdapter extends BaseAdapter {
  readonly name = "gamification" as const;
  readonly label = "Gamification";
  readonly family = "gamification" as const;
  readonly identity = "id-or-email" as const;

  async list(filters: QueryParams, page: PageRequest): Promise<ListPage> {
    const userIds = pipeList(filters["userId[]"] ?? filters.userId);
    if (userIds.length > 0) {
      return this.listAssignedPoints(filters, page, userIds);
    }
    const pageSize = page.pageSize ?? DEFAULT_PAGE_SIZE;
    const query: QueryParams = { page: page.page, pageSize };
    const excluded = pipeList(filters["excluded[]"] ?? filters.excluded);
    if (excluded.length > 0) {
      query["excluded[]"] = excluded;
    }
    const period = optionalString(filters as Record<string, unknown>, "period");
    const path = period === "weekly" ? "/leaderboard/weekly" : "/leaderboard";
    const response = await this.familyClient().get(path, query, extrasOf(page.signal));
    const records = this.itemsFrom(response.data).map((item) => normalizeLeaderboardUser(item));
    return this.toListPage(records, page.page, pageSize);
  }

  async get(id: string | number, signal?: AbortSignal) {
    const response = await this.familyClient().get(
      `/leaderboard/user/${encodeURIComponent(String(id))}`,
      undefined,
      extrasOf(signal),
    );
    return normalizeLeaderboardUser(this.unwrapRecord(response.data));
  }

  exportFields(): ExportField[] {
    return [
      { name: "id", kind: "number" },
      { name: "userId", kind: "number" },
      { name: "name", kind: "string" },
      { name: "points", kind: "number" },
      { name: "leaderboardPosition", kind: "number" },
      { name: "avatar", kind: "string" },
      { name: "rank", kind: "string" },
    ];
  }

  operations(): ResourceOperation[] {
    return [
      {
        name: "assignPoints",
        kind: "update",
        label: "Assign points",
        description: "POST /points/assign with { user, points }. Badge award/revoke is on users.",
        requiredColumns: ["points"],
        optionalColumns: ["user", "userId", "userid"],
      },
    ];
  }

  fromCsvRow(
    row: Record<string, unknown>,
    operation: string,
    context?: FromCsvRowContext,
  ): ApiCallPlan {
    const spec = this.requireOperation(operation);
    this.requireFields(row, spec.requiredColumns, operation);
    if (operation !== "assignPoints") {
      throw new AdapterError(`Unsupported gamification operation "${operation}"`);
    }
    const id = this.identityValue(row, context);
    return this.callPlan({
      method: "POST",
      path: "/points/assign",
      operation,
      body: {
        user: asInteger(id, "user"),
        points: asInteger(row.points, "points"),
      },
      resolvedId: id,
    });
  }

  describeFilters(): FilterPrompt[] {
    return [
      {
        name: "period",
        label: "Leaderboard period",
        type: "string",
        choices: [
          { value: "all_time", label: "All time" },
          { value: "weekly", label: "This week (Mon–Sun)" },
        ],
      },
      {
        name: "excluded[]",
        label: "Exclude roles",
        type: "string[]",
        description: "Pipe-separated role names (e.g. roles.banned|roles.moderator)",
      },
      {
        name: "userId[]",
        label: "User IDs (assigned points)",
        type: "string[]",
        description: "If set, GET /points for these users instead of the leaderboard",
      },
      {
        name: "earnedAt[from]",
        label: "Points from",
        type: "date",
        description: "Only used with userId[]",
      },
      {
        name: "earnedAt[to]",
        label: "Points until",
        type: "date",
        description: "Only used with userId[]",
      },
    ];
  }

  protected identityValue(
    row: Record<string, unknown>,
    context?: FromCsvRowContext,
  ): string | number {
    if (context?.resolvedId !== undefined) {
      return context.resolvedId;
    }
    const id = row.id ?? row.userid ?? row.userId ?? row.user;
    if (id === undefined || id === "") {
      throw new AdapterError(`${this.label} row is missing id`);
    }
    return id as string | number;
  }

  private async listAssignedPoints(
    filters: QueryParams,
    page: PageRequest,
    userIds: string[],
  ): Promise<ListPage> {
    const pageSize = page.pageSize ?? DEFAULT_PAGE_SIZE;
    if (page.page > 1) {
      return this.toListPage([], page.page, pageSize);
    }
    const query: QueryParams = { "userId[]": asIdList(userIds, "userId[]") };
    const from = optionalString(filters as Record<string, unknown>, "earnedAt[from]");
    if (from !== undefined) {
      query["earnedAt[from]"] = from;
    }
    const to = optionalString(filters as Record<string, unknown>, "earnedAt[to]");
    if (to !== undefined) {
      query["earnedAt[to]"] = to;
    }
    const response = await this.familyClient().get("/points", query, extrasOf(page.signal));
    const records = this.itemsFrom(response.data).map((item) => normalizeUserPoints(item));
    return {
      records,
      page: page.page,
      pageSize,
      exhausted: true,
    };
  }
}
