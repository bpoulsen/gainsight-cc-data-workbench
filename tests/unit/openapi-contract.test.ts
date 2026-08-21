import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { getAdapter, RESOURCE_NAMES, type ResourceName } from "../../src/adapters/index.js";
import type { ResourceOperation } from "../../src/adapters/base.js";
import { mockClient } from "./http.js";
import examples from "../fixtures/openapi-examples.json" with { type: "json" };
import { UsersAdapter } from "../../src/adapters/users.js";
import { GamificationAdapter } from "../../src/adapters/gamification.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const HTTP_METHODS = new Set(["get", "put", "post", "delete", "patch"]);

const SPEC_FILE: Record<string, string> = {
  users: "user-api.json",
  community: "community-api.json",
  events: "events-api.json",
  gamification: "gamification-api.json",
  search: "search-api.json",
};

const CONVERT_TARGET: Partial<Record<ResourceName, string>> = {
  questions: "idea",
  ideas: "question",
  conversations: "idea",
  articles: "conversation",
};

/** OpenAPI has no topic-level move for these types (replies only). */
const KNOWN_MISSING_PATHS = new Set(["ideas/move", "productUpdates/move"]);

const DUMMY: Record<string, unknown> = {
  id: 7,
  userid: 7,
  email: "ops@example.com",
  username: "ops",
  password: "secret12",
  field: "username",
  value: "ops",
  role: "roles.registered",
  roleName: "roles.registered",
  roleIds: "7|13",
  badgeId: 11,
  badgeIds: "7|13",
  title: "Title",
  content: "Content",
  categoryId: 6,
  authorId: 7,
  moderatorId: 8,
  tags: "a",
  moderatorTags: "urgent",
  closed: true,
  sticky: false,
  trashed: true,
  spam: false,
  targetType: "idea",
  ideaStatusId: 1,
  productAreas: "1",
  name: "export",
  ids: "11|12",
  type: "webinar",
  startsAt: "2026-09-01T15:00:00+00:00",
  endsAt: "2026-09-01T16:00:00+00:00",
  timezone: "UTC",
  location: "Zoom",
  url: "https://example.invalid/event",
  image: "https://example.invalid/img.png",
  message: "Thanks for signing up",
  eventTypeName: "webinar",
  externalRegistrationUrl: "https://example.invalid/reg",
  externalRegistrationUrlLabel: "Register",
  featuredTopics: '[{"publicId":1,"privateId":2,"contentType":"article"}]',
  points: 5,
  order: "1|2|3",
};

interface SpecIndex {
  templates: Array<{ path: string; methods: Set<string> }>;
}

const specCache = new Map<string, SpecIndex>();

function loadSpec(file: string): SpecIndex {
  const cached = specCache.get(file);
  if (cached) {
    return cached;
  }
  const raw = JSON.parse(readFileSync(join(ROOT, "docs/api", file), "utf8")) as {
    paths?: Record<string, Record<string, unknown>>;
  };
  const templates: SpecIndex["templates"] = [];
  for (const [path, item] of Object.entries(raw.paths ?? {})) {
    const methods = new Set(
      Object.keys(item).filter((key) => HTTP_METHODS.has(key) && item[key] && typeof item[key] === "object"),
    );
    templates.push({ path, methods });
  }
  const index = { templates };
  specCache.set(file, index);
  return index;
}

function pathMatches(actual: string, template: string): boolean {
  const regex = new RegExp(
    `^${template.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\\\{[^}]+\\\}/g, "[^/]+")}$`,
  );
  return regex.test(actual);
}

function staticScore(template: string): number {
  return template.split("/").filter((part) => part.length > 0 && !part.startsWith("{")).length;
}

function findBestTemplate(
  actual: string,
  templates: SpecIndex["templates"],
): SpecIndex["templates"][number] | undefined {
  const matches = templates.filter((item) => pathMatches(actual, item.path));
  if (matches.length === 0) {
    return undefined;
  }
  return matches.sort((a, b) => {
    const score = staticScore(b.path) - staticScore(a.path);
    if (score !== 0) {
      return score;
    }
    return b.path.length - a.path.length;
  })[0];
}

function dummyRow(resource: ResourceName, spec: ResourceOperation): Record<string, unknown> {
  const row = { ...DUMMY };
  if (spec.name === "updateProfileField" || spec.name === "deleteProfileField") {
    row.field = "Department";
    row.value = "Ops";
  }
  const target = CONVERT_TARGET[resource];
  if (spec.name === "convertType" && target !== undefined) {
    row.targetType = target;
  }
  return row;
}

describe("OpenAPI contract", () => {
  it("exposes every family spec used by adapters", () => {
    for (const file of Object.values(SPEC_FILE)) {
      expect(loadSpec(file).templates.length).toBeGreaterThan(0);
    }
  });

  it("plans every adapter write against a real OpenAPI path and method", () => {
    const client = mockClient();
    const failures: string[] = [];

    for (const resource of RESOURCE_NAMES) {
      const adapter = getAdapter(resource, client);
      const specFile = SPEC_FILE[adapter.family];
      if (!specFile) {
        failures.push(`${resource}: unknown API family ${adapter.family}`);
        continue;
      }
      const spec = loadSpec(specFile);
      for (const operation of adapter.operations()) {
        const key = `${resource}/${operation.name}`;
        if (KNOWN_MISSING_PATHS.has(key)) {
          continue;
        }
        try {
          const plan = adapter.fromCsvRow(dummyRow(resource, operation), operation.name, {
            resolvedId: 7,
          });
          const match = findBestTemplate(plan.path, spec.templates);
          if (!match) {
            failures.push(`${key}: no OpenAPI path for ${plan.method} ${plan.path}`);
            continue;
          }
          if (!match.methods.has(plan.method.toLowerCase())) {
            failures.push(
              `${key}: ${plan.method} ${plan.path} is not in OpenAPI methods [${[...match.methods].join(", ")}] for ${match.path}`,
            );
          }
        } catch (error) {
          failures.push(`${key}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    }

    expect(failures).toEqual([]);
  });

  it("builds native bulk and register payloads that match OpenAPI examples", () => {
    const adapter = new UsersAdapter(mockClient());
    const register = adapter.fromCsvRow(
      {
        email: examples.userRegisterRequest.email,
        username: examples.userRegisterRequest.username,
        password: "secret12",
        user_role: "roles.registered",
      },
      "register",
    );
    expect(register.body).toMatchObject({
      email: "user@example.com",
      username: "user",
      user_role: ["roles.registered"],
    });

    const bulk = adapter.fromCsvRow({ roleIds: "7|13" }, "bulkAddRoles", { resolvedId: 2 });
    expect(bulk.body).toEqual({
      data: { userIds: [2], roleIds: [7, 13] },
    });
    expect(examples.bulkUserAddRole.data.roleIds).toEqual([7, 13]);

    const points = new GamificationAdapter(mockClient()).fromCsvRow(
      { id: examples.assignPoints.user, points: examples.assignPoints.points },
      "assignPoints",
    );
    expect(points.body).toEqual({ user: 5, points: 100 });
  });
});
