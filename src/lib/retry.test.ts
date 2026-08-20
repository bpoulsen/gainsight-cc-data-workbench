import { describe, expect, it } from "vitest";
import { parseRetryAfter, RateLimitError, ServerError } from "./api/errors.js";
import {
  backoffDelayMs,
  DEFAULT_CONCURRENCY,
  isDeleteLike,
  parseConcurrency,
  RetryPolicy,
  toResultsFields,
} from "./retry.js";

describe("parseConcurrency", () => {
  it("defaults to 3", () => {
    expect(parseConcurrency(undefined)).toBe(DEFAULT_CONCURRENCY);
  });

  it("accepts 1 through 20", () => {
    expect(parseConcurrency("1")).toBe(1);
    expect(parseConcurrency("20")).toBe(20);
  });

  it("rejects invalid values", () => {
    expect(() => parseConcurrency("0")).toThrow(/1 to 20/);
    expect(() => parseConcurrency("21")).toThrow(/1 to 20/);
    expect(() => parseConcurrency("fast")).toThrow(/integer/);
  });
});

describe("isDeleteLike", () => {
  it("treats HTTP DELETE, trash, erase, and permanent delete as delete-like", () => {
    expect(isDeleteLike("DELETE", "/v2/articles/1")).toBe(true);
    expect(isDeleteLike("POST", "/v2/articles/1/toggleTrashed")).toBe(true);
    expect(isDeleteLike("POST", "/user/7/erase")).toBe(true);
    expect(isDeleteLike("POST", "/v2/tags/delete")).toBe(true);
    expect(isDeleteLike("POST", "/v2/articles/1/editTitle", "permanentlyDeleteArticle")).toBe(true);
    expect(isDeleteLike("POST", "/v2/articles/1", "toggleTrashed")).toBe(true);
  });

  it("does not treat reads or named edits as delete-like", () => {
    expect(isDeleteLike("GET", "/v2/topics")).toBe(false);
    expect(isDeleteLike("POST", "/v2/articles/1/editTitle")).toBe(false);
    expect(isDeleteLike("PATCH", "/user/7")).toBe(false);
  });
});

describe("backoffDelayMs", () => {
  it("doubles from 1s and applies ±20% jitter", () => {
    const base = {
      baseDelayMs: 1000,
      maxDelayMs: 60_000,
      jitterRatio: 0.2,
    };
    expect(backoffDelayMs(0, { ...base, random: () => 0.5 })).toBe(1000);
    expect(backoffDelayMs(1, { ...base, random: () => 0.5 })).toBe(2000);
    expect(backoffDelayMs(2, { ...base, random: () => 0.5 })).toBe(4000);
    expect(backoffDelayMs(0, { ...base, random: () => 0 })).toBe(800);
    expect(backoffDelayMs(0, { ...base, random: () => 1 })).toBe(1200);
  });

  it("caps at maxDelayMs", () => {
    expect(
      backoffDelayMs(10, {
        baseDelayMs: 1000,
        maxDelayMs: 60_000,
        jitterRatio: 0.2,
        random: () => 0.5,
      }),
    ).toBe(60_000);
  });
});

describe("RetryPolicy", () => {
  it("prefers Retry-After over exponential backoff", () => {
    const policy = new RetryPolicy({ random: () => 0.5, log: () => {} });
    const error = new RateLimitError("slow", "GET", "/v2/topics", {}, 5000);
    expect(policy.delayMs(error, 0)).toBe(5000);
  });

  it("caps Retry-After at 60s", () => {
    const policy = new RetryPolicy({ random: () => 0.5, log: () => {} });
    const error = new RateLimitError("slow", "GET", "/v2/topics", {}, 120_000);
    expect(policy.delayMs(error, 0)).toBe(60_000);
  });

  it("does not retry 501 or delete-like requests", () => {
    const policy = new RetryPolicy();
    const server = new ServerError("nope", 501, "GET", "/user", {});
    expect(policy.canRetry({ method: "GET", path: "/user" }, server, 1)).toBe(false);
    const limited = new RateLimitError("slow", "POST", "/user/7/erase", {});
    expect(policy.canRetry({ method: "POST", path: "/user/7/erase" }, limited, 1)).toBe(false);
  });
});

describe("parseRetryAfter", () => {
  it("parses delta-seconds and HTTP dates", () => {
    expect(parseRetryAfter("2")).toBe(2000);
    const now = Date.parse("Wed, 21 Oct 2015 07:28:00 GMT");
    expect(parseRetryAfter("Wed, 21 Oct 2015 07:28:02 GMT", now)).toBe(2000);
    expect(parseRetryAfter("not-a-date")).toBeUndefined();
  });
});

describe("toResultsFields", () => {
  it("marks exhausted 429s as manual follow-up rows", () => {
    const error = new RateLimitError("slow down", "GET", "/v2/topics", {});
    error.attempts = 3;
    const fields = toResultsFields(error);
    expect(fields.status).toBe("failed");
    expect(fields.http_status).toBe(429);
    expect(fields.attempts).toBe(3);
    expect(fields.error).toMatch(/retry this row manually/i);
  });
});
