import { describe, expect, expectTypeOf, it } from "vitest";
import type { paths as CommunityPaths } from "../generated/community.js";
import type { paths as EventsPaths } from "../generated/events.js";
import type { paths as GamificationPaths } from "../generated/gamification.js";
import type { paths as SearchPaths } from "../generated/search.js";
import type { paths as UserPaths } from "../generated/user.js";
import type * as generated from "../generated/index.js";

describe("generated OpenAPI types", () => {
  it("exposes family path operations", () => {
    expectTypeOf<UserPaths["/user"]>().toHaveProperty("get");
    expectTypeOf<UserPaths["/user/{id}/erase"]>().toHaveProperty("post");
    expectTypeOf<CommunityPaths["/topics"]>().toHaveProperty("get");
    expectTypeOf<EventsPaths["/events/create"]>().toHaveProperty("post");
    expectTypeOf<GamificationPaths["/leaderboard"]>().toHaveProperty("get");
    expectTypeOf<SearchPaths["/search"]>().toHaveProperty("get");
  });

  it("namespaces specs so path names do not collide", () => {
    expectTypeOf<generated.user.paths["/user"]>().toHaveProperty("get");
    expectTypeOf<generated.community.paths["/topics"]>().toHaveProperty("get");
    expectTypeOf<generated.events.paths>().toBeObject();
    expectTypeOf<generated.gamification.paths>().toBeObject();
    expectTypeOf<generated.search.paths["/search"]>().toHaveProperty("get");
  });
});
