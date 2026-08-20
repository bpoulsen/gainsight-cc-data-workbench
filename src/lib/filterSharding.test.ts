import { describe, expect, it } from "vitest";
import {
  availableShardStrategies,
  categoryFilterShards,
  contentTypeFilterShards,
  dateFilterShards,
  defaultDateWindow,
  FilterShardError,
  formatIsoDate,
  parseIsoDate,
  parseShardBy,
  shardFilePath,
} from "./filterSharding.js";

describe("parseShardBy", () => {
  it("accepts the three strategies", () => {
    expect(parseShardBy("category")).toBe("category");
    expect(parseShardBy("date")).toBe("date");
    expect(parseShardBy("contentType")).toBe("contentType");
  });

  it("rejects unknown values", () => {
    expect(() => parseShardBy("tag")).toThrow(FilterShardError);
  });
});

describe("availableShardStrategies", () => {
  it("offers contentType only for unified topics", () => {
    expect(availableShardStrategies("topics")).toEqual(["contentType", "category", "date"]);
    expect(availableShardStrategies("questions")).toEqual(["category", "date"]);
    expect(availableShardStrategies("users")).toEqual([]);
  });
});

describe("dateFilterShards", () => {
  it("splits a range into inclusive calendar months", () => {
    const shards = dateFilterShards({}, "2026-01-15", "2026-03-02");
    expect(shards.map((item) => item.id)).toEqual(["2026-01", "2026-02", "2026-03"]);
    expect(shards[0]?.filters).toMatchObject({
      "createdAt[from]": "2026-01-15",
      "createdAt[to]": "2026-01-31",
    });
    expect(shards[1]?.filters).toMatchObject({
      "createdAt[from]": "2026-02-01",
      "createdAt[to]": "2026-02-28",
    });
    expect(shards[2]?.filters).toMatchObject({
      "createdAt[from]": "2026-03-01",
      "createdAt[to]": "2026-03-02",
    });
  });

  it("rejects inverted ranges and bad dates", () => {
    expect(() => dateFilterShards({}, "2026-03-01", "2026-01-01")).toThrow(/on or before/);
    expect(() => parseIsoDate("2026-13-01", "created-from")).toThrow(/valid calendar date/);
  });
});

describe("categoryFilterShards", () => {
  it("one shard per category id", () => {
    const shards = categoryFilterShards({ q: "csv" }, [
      { id: 6, name: "Getting started" },
      { id: "6", name: "dup" },
      { id: 9, name: "Announcements" },
    ]);
    expect(shards).toHaveLength(2);
    expect(shards[0]).toMatchObject({
      id: "cat-6",
      label: "Getting started",
      filters: { q: "csv", "categoryIds[]": ["6"] },
    });
  });

  it("honors an existing categoryIds[] filter", () => {
    const shards = categoryFilterShards({ "categoryIds[]": ["9"] }, [
      { id: 6, name: "Getting started" },
      { id: 9, name: "Announcements" },
    ]);
    expect(shards.map((item) => item.id)).toEqual(["cat-9"]);
  });
});

describe("contentTypeFilterShards", () => {
  it("covers the five topic types", () => {
    expect(contentTypeFilterShards({}).map((item) => item.id)).toEqual([
      "question",
      "idea",
      "conversation",
      "article",
      "productUpdate",
    ]);
  });
});

describe("shardFilePath", () => {
  it("inserts the shard id before the extension", () => {
    expect(shardFilePath("exports/topics.csv", "cat-6")).toBe("exports/topics.cat-6.csv");
    expect(shardFilePath("out", "question")).toBe("out.question.csv");
  });
});

describe("defaultDateWindow", () => {
  it("starts at the first of the month 11 months back", () => {
    const window = defaultDateWindow(new Date("2026-08-20T12:00:00Z"));
    expect(window.from).toBe("2025-09-01");
    expect(window.to).toBe(formatIsoDate(new Date(Date.UTC(2026, 7, 20))));
  });
});
