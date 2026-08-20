import { describe, expect, it } from "vitest";
import {
  confirmDestructiveOperation,
  formatTypedConfirmationPrompt,
  isTypedConfirmation,
  operationRequiresTypedConfirmation,
  TYPED_CONFIRM_DELETE,
} from "./safety.js";

describe("isTypedConfirmation", () => {
  it("accepts the resource name or DELETE, case-sensitive, trimmed", () => {
    expect(isTypedConfirmation("users", "users")).toBe(true);
    expect(isTypedConfirmation("  users  ", "users")).toBe(true);
    expect(isTypedConfirmation(TYPED_CONFIRM_DELETE, "users")).toBe(true);
    expect(isTypedConfirmation("delete", "users")).toBe(false);
    expect(isTypedConfirmation("Users", "users")).toBe(false);
    expect(isTypedConfirmation("questions", "users")).toBe(false);
  });
});

describe("operationRequiresTypedConfirmation", () => {
  it("is true only for confirmation: typed", () => {
    expect(operationRequiresTypedConfirmation({ confirmation: "typed" })).toBe(true);
    expect(operationRequiresTypedConfirmation({ confirmation: "none" })).toBe(false);
    expect(operationRequiresTypedConfirmation({})).toBe(false);
    expect(operationRequiresTypedConfirmation(undefined)).toBe(false);
  });
});

describe("confirmDestructiveOperation", () => {
  it("skips prompting on dry-run", async () => {
    let asked = 0;
    const ok = await confirmDestructiveOperation({
      operation: "erase",
      resource: "users",
      rowCount: 3,
      dryRun: true,
      prompt: async () => {
        asked += 1;
        return "nope";
      },
    });
    expect(ok).toBe(true);
    expect(asked).toBe(0);
  });

  it("skips prompting when --skip-confirmation is set and logs a warning", async () => {
    const logs: string[] = [];
    let asked = 0;
    const ok = await confirmDestructiveOperation({
      operation: "erase",
      resource: "users",
      rowCount: 3,
      skipConfirmation: true,
      log: (message) => logs.push(message),
      prompt: async () => {
        asked += 1;
        return "nope";
      },
    });
    expect(ok).toBe(true);
    expect(asked).toBe(0);
    expect(logs.join("\n")).toMatch(/DANGEROUS/);
  });

  it("accepts a matching typed answer and rejects a mismatch", async () => {
    const prompt = formatTypedConfirmationPrompt("erase", "users", 4);
    expect(prompt).toContain('Type "users" or "DELETE"');
    expect(prompt).toContain("4 users records");

    await expect(
      confirmDestructiveOperation({
        operation: "erase",
        resource: "users",
        rowCount: 4,
        prompt: async () => "users",
      }),
    ).resolves.toBe(true);

    await expect(
      confirmDestructiveOperation({
        operation: "erase",
        resource: "users",
        rowCount: 4,
        prompt: async () => "nope",
      }),
    ).resolves.toBe(false);
  });
});
