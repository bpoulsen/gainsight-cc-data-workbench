import { describe, expect, it } from "vitest";
import { parseCliFlags } from "./cli.js";
import { isWriteOperation } from "./lib/types.js";

describe("parseCliFlags", () => {
  it("parses help and profile flags", () => {
    const flags = parseCliFlags(["--help", "--profile", "prod"]);
    expect(flags.help).toBe(true);
    expect(flags.profile).toBe("prod");
    expect(flags.dryRun).toBe(false);
  });

  it("parses bulk flags without executing them", () => {
    const flags = parseCliFlags([
      "--resource",
      "users",
      "--op",
      "editTags",
      "--csv",
      "tags.csv",
      "--dry-run",
      "--fail-fast",
    ]);
    expect(flags.resource).toBe("users");
    expect(flags.op).toBe("editTags");
    expect(flags.csv).toBe("tags.csv");
    expect(flags.dryRun).toBe(true);
    expect(flags.failFast).toBe(true);
  });

  it("parses --auth-check", () => {
    expect(parseCliFlags(["--auth-check"]).authCheck).toBe(true);
  });

  it("defaults concurrency to 3 and accepts overrides", () => {
    expect(parseCliFlags([]).concurrency).toBe(3);
    expect(parseCliFlags(["--concurrency", "1"]).concurrency).toBe(1);
  });

  it("rejects invalid --concurrency", () => {
    expect(() => parseCliFlags(["--concurrency", "0"])).toThrow(/1 to 20/);
  });

  it("parses --utf8-bom", () => {
    expect(parseCliFlags([]).utf8Bom).toBe(false);
    expect(parseCliFlags(["--utf8-bom"]).utf8Bom).toBe(true);
  });

  it("parses --skip-confirmation", () => {
    expect(parseCliFlags([]).skipConfirmation).toBe(false);
    expect(parseCliFlags(["--skip-confirmation"]).skipConfirmation).toBe(true);
  });

  it("parses --verbose", () => {
    expect(parseCliFlags([]).verbose).toBe(false);
    expect(parseCliFlags(["--verbose"]).verbose).toBe(true);
  });

  it("parses topic shard flags", () => {
    const flags = parseCliFlags([
      "--shard-by",
      "date",
      "--created-from",
      "2026-01-01",
      "--created-to",
      "2026-03-31",
      "--shard-separate",
    ]);
    expect(flags.shardBy).toBe("date");
    expect(flags.createdFrom).toBe("2026-01-01");
    expect(flags.createdTo).toBe("2026-03-31");
    expect(flags.shardSeparate).toBe(true);
  });
});

describe("isWriteOperation", () => {
  it("treats explore/export as reads", () => {
    expect(isWriteOperation("explore")).toBe(false);
    expect(isWriteOperation("export")).toBe(false);
    expect(isWriteOperation(undefined)).toBe(false);
  });

  it("treats named mutations as writes", () => {
    expect(isWriteOperation("editTags")).toBe(true);
    expect(isWriteOperation("toggleTrashed")).toBe(true);
  });
});
