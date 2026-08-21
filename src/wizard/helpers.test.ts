import { describe, expect, it } from "vitest";
import { parseCliFlags } from "../cli.js";
import {
  applyParsedFilter,
  csvHasNativeBulkIdColumn,
  defaultExportPath,
  formatPreviewTable,
  isTypedConfirmation,
  missingRequiredColumns,
  nativeBulkOperationFor,
  parseFilterInput,
  previewColumns,
  shouldLaunchWizard,
  WizardError,
} from "./helpers.js";

describe("shouldLaunchWizard", () => {
  it("launches when only a profile is set", () => {
    expect(shouldLaunchWizard(parseCliFlags([]))).toBe(true);
    expect(shouldLaunchWizard(parseCliFlags(["--profile", "sandbox"]))).toBe(true);
  });

  it("skips when resource, op, csv, or out is set", () => {
    expect(shouldLaunchWizard(parseCliFlags(["--resource", "users"]))).toBe(false);
    expect(shouldLaunchWizard(parseCliFlags(["--op", "export"]))).toBe(false);
    expect(shouldLaunchWizard(parseCliFlags(["--csv", "in.csv"]))).toBe(false);
    expect(shouldLaunchWizard(parseCliFlags(["--out", "out.csv"]))).toBe(false);
  });

  it("skips help, version, and auth-check", () => {
    expect(shouldLaunchWizard(parseCliFlags(["--help"]))).toBe(false);
    expect(shouldLaunchWizard(parseCliFlags(["--version"]))).toBe(false);
    expect(shouldLaunchWizard(parseCliFlags(["--auth-check"]))).toBe(false);
    expect(shouldLaunchWizard(parseCliFlags(["--verbose"]))).toBe(true);
  });
});

describe("parseFilterInput", () => {
  it("skips blank input", () => {
    expect(parseFilterInput("  ", { name: "q", type: "string" })).toBeUndefined();
    expect(parseFilterInput(undefined, { name: "q", type: "string" })).toBeUndefined();
    expect(parseFilterInput(null, { name: "roles", type: "string[]" })).toBeUndefined();
  });

  it("parses strings, booleans, and numbers", () => {
    expect(parseFilterInput("hello", { name: "q", type: "string" })).toBe("hello");
    expect(parseFilterInput("true", { name: "closed", type: "boolean" })).toBe(true);
    expect(parseFilterInput("12", { name: "id", type: "number" })).toBe(12);
    expect(parseFilterInput("2024-01-02", { name: "createdAt[from]", type: "date" })).toBe(
      "2024-01-02",
    );
  });

  it("splits pipe or comma lists, including []-named number filters", () => {
    expect(parseFilterInput("a|b", { name: "tags", type: "string[]" })).toEqual(["a", "b"]);
    expect(parseFilterInput("1,2", { name: "categoryIds[]", type: "string[]" })).toEqual([
      "1",
      "2",
    ]);
    expect(
      parseFilterInput("3|4", { name: "filter[badges.badgeid][]", type: "number" }),
    ).toEqual([3, 4]);
  });

  it("rejects invalid booleans and numbers", () => {
    expect(() => parseFilterInput("yes", { name: "closed", type: "boolean" })).toThrow(
      WizardError,
    );
    expect(() => parseFilterInput("x", { name: "id", type: "number" })).toThrow(/must be a number/);
  });
});

describe("applyParsedFilter", () => {
  it("omits undefined values", () => {
    const filters = {};
    applyParsedFilter(filters, "q", undefined);
    applyParsedFilter(filters, "q", "hello");
    expect(filters).toEqual({ q: "hello" });
  });
});

describe("isTypedConfirmation", () => {
  it("accepts the resource name or DELETE, case-sensitive", () => {
    expect(isTypedConfirmation("users", "users")).toBe(true);
    expect(isTypedConfirmation("DELETE", "users")).toBe(true);
    expect(isTypedConfirmation("delete", "users")).toBe(false);
    expect(isTypedConfirmation("Users", "users")).toBe(false);
  });
});

describe("missingRequiredColumns", () => {
  it("requires field columns and id-or-email identity for user updates", () => {
    expect(
      missingRequiredColumns(
        ["email", "field", "value"],
        { requiredColumns: ["field", "value"], kind: "update", name: "updateField" },
        "id-or-email",
      ),
    ).toEqual([]);
    expect(
      missingRequiredColumns(
        ["username"],
        { requiredColumns: ["field", "value"], kind: "update", name: "updateField" },
        "id-or-email",
      ),
    ).toEqual(["field", "value", "id or email"]);
  });

  it("does not require identity for create (except createReply)", () => {
    expect(
      missingRequiredColumns(
        ["email", "username", "password"],
        { requiredColumns: ["email", "username", "password"], kind: "create", name: "register" },
        "id-or-email",
      ),
    ).toEqual([]);
    expect(
      missingRequiredColumns(
        ["content"],
        { requiredColumns: ["content"], kind: "create", name: "createReply" },
        "id",
      ),
    ).toEqual(["id"]);
  });
});

describe("native bulk wizard helpers", () => {
  it("maps per-row role/badge ops to native bulk counterparts", () => {
    expect(nativeBulkOperationFor("addRole")).toBe("bulkAddRoles");
    expect(nativeBulkOperationFor("revokeBadge")).toBe("bulkRevokeBadges");
    expect(nativeBulkOperationFor("updateField")).toBeUndefined();
  });

  it("detects numeric id columns used by native bulk endpoints", () => {
    expect(csvHasNativeBulkIdColumn(["id", "roleIds"], "bulkAddRoles")).toBe(true);
    expect(csvHasNativeBulkIdColumn(["id", "role"], "bulkAddRoles")).toBe(false);
    expect(csvHasNativeBulkIdColumn(["email", "badgeIds"], "bulkAwardBadges")).toBe(true);
    expect(csvHasNativeBulkIdColumn(["email", "badgeId"], "bulkAwardBadges")).toBe(false);
  });
});

describe("preview table", () => {
  it("prefers identity/title columns and truncates cells", () => {
    expect(previewColumns(["roles", "title", "id", "email", "extra"])).toEqual([
      "id",
      "title",
      "email",
      "roles",
      "extra",
    ]);
    const table = formatPreviewTable(
      [{ id: "1", title: "a".repeat(40) }],
      ["id", "title"],
      8,
    );
    expect(table).toContain("id");
    expect(table).toContain("1");
    expect(table).toMatch(/a{7}…/);
  });
});

describe("defaultExportPath", () => {
  it("uses the resource name and a filesystem-safe timestamp", () => {
    expect(defaultExportPath("users", new Date("2026-08-20T18:30:00.000Z"))).toBe(
      "exports/users-export-2026-08-20-18-30-00.csv",
    );
  });
});
