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
