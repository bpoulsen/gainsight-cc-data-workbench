import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { normalizeUser } from "../../src/adapters/users.js";
import { normalizeTopic } from "../../src/adapters/content.js";
import { normalizeLeaderboardUser } from "../../src/adapters/gamification.js";
import { normalizeSearchHit } from "../../src/adapters/search.js";
import userFixture from "../../src/lib/fixtures/user.json" with { type: "json" };
import questionFixture from "../../src/lib/fixtures/question.json" with { type: "json" };
import leaderboard from "../../src/lib/fixtures/leaderboard.json" with { type: "json" };
import searchResults from "../../src/lib/fixtures/search-results.json" with { type: "json" };
import examples from "../fixtures/openapi-examples.json" with { type: "json" };

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const FIXTURE_DIRS = [
  join(ROOT, "src/lib/fixtures"),
  join(ROOT, "tests/fixtures"),
];

describe("redacted API fixtures", () => {
  it("do not contain live secrets or access tokens", () => {
    const suspicious: string[] = [];
    for (const dir of FIXTURE_DIRS) {
      for (const name of readdirSync(dir)) {
        if (!name.endsWith(".json")) {
          continue;
        }
        const text = readFileSync(join(dir, name), "utf8");
        if (/client_secret|GAINSIGHT_CLIENT_SECRET/i.test(text)) {
          suspicious.push(`${name}: client secret`);
        }
        if (/"access_token"\s*:\s*"(?!\[redacted)[^"]{20,}"/.test(text)) {
          suspicious.push(`${name}: unredacted access_token`);
        }
      }
    }
    expect(suspicious).toEqual([]);
  });

  it("parses recorded payloads the same way live adapters do", () => {
    expect(normalizeUser(userFixture)).toMatchObject({
      id: 7,
      email: "ops@example.com",
      username: "ops",
    });
    expect(normalizeTopic(questionFixture)).toMatchObject({
      id: "101",
      type: "question",
      title: "How do I export users?",
    });
    const first = leaderboard[0];
    expect(first).toBeDefined();
    expect(normalizeLeaderboardUser(first)).toMatchObject(examples.leaderboardUser);
    const hit = searchResults.community[0];
    expect(hit).toBeDefined();
    expect(normalizeSearchHit(hit)).toMatchObject({
      id: 101,
      contentType: "question",
      title: "How do I export CSV?",
    });
    expect(hit).toMatchObject({
      url: expect.any(String),
      firstPost: expect.any(String),
      hasAnswer: true,
      publicId: expect.any(Number),
      authorId: expect.any(Number),
      authorName: expect.any(String),
      createdAt: expect.any(Number),
    });
  });
});
