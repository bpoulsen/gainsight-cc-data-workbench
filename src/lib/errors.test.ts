import { describe, expect, it } from "vitest";
import { AuthError, AuthenticationError } from "./auth.js";
import {
  ApiError,
  NotFoundError,
  RateLimitError,
  ValidationError,
} from "./api/errors.js";
import { IdentityError } from "./identityResolver.js";
import { ProfileError } from "./config/profile.js";
import {
  EXIT_ERROR,
  EXIT_PARTIAL,
  EXIT_SUCCESS,
  JobAbortedError,
  TOPIC_CAP_MESSAGE,
  authenticationFailed,
  exitCodeForError,
  exitCodeForJob,
  exitCodeForShards,
  formatOperatorMessage,
  formatVerboseDetails,
  invalidField,
  jobAborted,
  missingRequiredColumn,
  profileNotConfigured,
  rateLimitExceeded,
  userNotFound,
} from "./errors.js";

describe("operator error messages", () => {
  it("formats 401 as an actionable auth check", () => {
    expect(formatOperatorMessage(new AuthenticationError("HTTP 401"), { profile: "prod" })).toBe(
      authenticationFailed("prod"),
    );
    expect(formatOperatorMessage(new AuthError("scopeless"), { profile: "sandbox" })).toMatch(
      /GAINSIGHT_CLIENT_ID/,
    );
    expect(formatOperatorMessage(new AuthError("x"), { profile: "sandbox" })).toMatch(
      /scope includes "read write"/,
    );
  });

  it("formats 429 with retry-after seconds", () => {
    const error = new RateLimitError("slow down", "GET", "/v2/topics", {}, 2500);
    expect(formatOperatorMessage(error)).toBe(
      "Rate limit exceeded. Retry after 3s. Consider reducing --concurrency.",
    );
    expect(rateLimitExceeded()).toBe("Rate limit exceeded. Consider reducing --concurrency.");
  });

  it("formats the topic 10k cap", () => {
    const error = new ValidationError(
      "Result set exceeds 10,000",
      "GET",
      "/v2/topics",
      {},
      ["limit 10000"],
    );
    expect(formatOperatorMessage(error)).toBe(TOPIC_CAP_MESSAGE);
    expect(TOPIC_CAP_MESSAGE).toMatch(/docs\/FILTER_SHARDING\.md/);
  });

  it("formats user 404 by email", () => {
    expect(formatOperatorMessage(new IdentityError("nope", { code: "not_found", email: "ops@example.com" }))).toBe(
      userNotFound("ops@example.com"),
    );
    expect(
      formatOperatorMessage(
        new NotFoundError("missing", "GET", "/user/email/ops%40example.com", {}),
      ),
    ).toBe(userNotFound("ops@example.com"));
  });

  it("passes through profile and validation messages", () => {
    expect(formatOperatorMessage(new ProfileError(profileNotConfigured("prod")))).toBe(
      profileNotConfigured("prod"),
    );
    expect(missingRequiredColumn("field", "updateField")).toBe(
      "Missing required column: field for operation updateField",
    );
    expect(invalidField("closed", "boolean", "yes")).toBe("Invalid closed: expected boolean, got yes");
  });

  it("formats Ctrl+C abort", () => {
    expect(jobAborted("out/results.csv")).toBe(
      "Job aborted. Partial results saved to out/results.csv.",
    );
    expect(formatOperatorMessage(new JobAbortedError(jobAborted("a.csv"), "a.csv"))).toBe(
      "Job aborted. Partial results saved to a.csv.",
    );
    const abort = new Error("The operation was aborted");
    abort.name = "AbortError";
    expect(formatOperatorMessage(abort)).toBe("Job aborted.");
  });
});

describe("exit codes", () => {
  it("uses 0 for success, 1 for hard errors, 2 for mixed bulk results", () => {
    expect(exitCodeForJob({ success: 3, failed: 0 })).toBe(EXIT_SUCCESS);
    expect(exitCodeForJob({ success: 2, failed: 1 })).toBe(EXIT_PARTIAL);
    expect(exitCodeForJob({ success: 0, failed: 4, planned: 1 })).toBe(EXIT_PARTIAL);
    expect(exitCodeForJob({ success: 0, failed: 4 })).toBe(EXIT_ERROR);
    expect(exitCodeForShards(0, 3)).toBe(EXIT_SUCCESS);
    expect(exitCodeForShards(1, 3)).toBe(EXIT_PARTIAL);
    expect(exitCodeForShards(3, 3)).toBe(EXIT_ERROR);
    expect(exitCodeForError(new JobAbortedError(jobAborted()))).toBe(EXIT_ERROR);
  });
});

describe("verbose details", () => {
  it("redacts secrets from stacks and response bodies", () => {
    const error = new ApiError("nope", 500, "POST", "/user/7", {
      token: "super-secret-token-value",
    });
    error.stack = "Error: nope\n    at super-secret-token-value";
    const details = formatVerboseDetails(error, ["super-secret-token-value"]);
    expect(details).toBeDefined();
    expect(details).toContain("POST /user/7 → HTTP 500");
    expect(details).not.toContain("super-secret-token-value");
    expect(details).toContain("[REDACTED]");
  });
});
