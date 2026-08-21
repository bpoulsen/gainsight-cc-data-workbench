import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  availableProfiles,
  formatProdWriteBanner,
  loadProfile,
  loadResolvedProfile,
  ProfileError,
  resolveProfile,
} from "./profile.js";

function tempWorkspace(): string {
  return mkdtempSync(join(tmpdir(), "gs-wb-"));
}

function writeEnv(
  dir: string,
  profile: "sandbox" | "prod",
  values: Partial<{
    GAINSIGHT_BASE_URL: string;
    GAINSIGHT_CLIENT_ID: string;
    GAINSIGHT_CLIENT_SECRET: string;
  }>,
): void {
  const lines = [
    `GAINSIGHT_BASE_URL=${values.GAINSIGHT_BASE_URL ?? "https://api2-eu-west-1.insided.com"}`,
    `GAINSIGHT_CLIENT_ID=${values.GAINSIGHT_CLIENT_ID ?? "client-id"}`,
    `GAINSIGHT_CLIENT_SECRET=${values.GAINSIGHT_CLIENT_SECRET ?? "client-secret"}`,
  ];
  writeFileSync(join(dir, `.env.${profile}`), `${lines.join("\n")}\n`);
}

describe("resolveProfile", () => {
  it("defaults to sandbox when both profiles exist", () => {
    const dir = tempWorkspace();
    writeEnv(dir, "sandbox", {});
    writeEnv(dir, "prod", {});
    expect(resolveProfile(undefined, dir)).toBe("sandbox");
  });

  it("uses the only configured profile", () => {
    const sandboxOnly = tempWorkspace();
    writeEnv(sandboxOnly, "sandbox", {});
    expect(resolveProfile(undefined, sandboxOnly)).toBe("sandbox");

    const prodOnly = tempWorkspace();
    writeEnv(prodOnly, "prod", {});
    expect(resolveProfile(undefined, prodOnly)).toBe("prod");
  });

  it("honors an explicit profile", () => {
    const dir = tempWorkspace();
    writeEnv(dir, "sandbox", {});
    writeEnv(dir, "prod", {});
    expect(resolveProfile("prod", dir)).toBe("prod");
  });

  it("rejects an unknown profile name", () => {
    expect(() => resolveProfile("stage", tempWorkspace())).toThrow(ProfileError);
  });

  it("fails when no env files exist", () => {
    expect(() => resolveProfile(undefined, tempWorkspace())).toThrow(
      /No profile configured/,
    );
  });
});

describe("loadProfile", () => {
  it("loads required vars from the env file", () => {
    const dir = tempWorkspace();
    writeEnv(dir, "sandbox", {
      GAINSIGHT_BASE_URL: "https://api2-eu-west-1.insided.com/",
      GAINSIGHT_CLIENT_ID: "id-1",
      GAINSIGHT_CLIENT_SECRET: "secret-1",
    });
    const config = loadProfile("sandbox", dir);
    expect(config.profile).toBe("sandbox");
    expect(config.baseUrl).toBe("https://api2-eu-west-1.insided.com");
    expect(config.clientId).toBe("id-1");
    expect(config.clientSecret).toBe("secret-1");
  });

  it("errors when required vars are missing", () => {
    const dir = tempWorkspace();
    mkdirSync(dir, { recursive: true });
    writeFileSync(
      join(dir, ".env.sandbox"),
      "GAINSIGHT_BASE_URL=https://example.invalid\nGAINSIGHT_CLIENT_ID=\nGAINSIGHT_CLIENT_SECRET=\n",
    );
    expect(() => loadProfile("sandbox", dir)).toThrow(/GAINSIGHT_CLIENT_ID/);
  });

  it("errors when the env file is missing", () => {
    expect(() => loadProfile("prod", tempWorkspace())).toThrow(/Profile prod not configured/);
  });

  it("does not include credential values in missing-file errors", () => {
    try {
      loadProfile("sandbox", tempWorkspace());
      throw new Error("expected ProfileError");
    } catch (error) {
      expect(error).toBeInstanceOf(ProfileError);
      expect(String(error)).toMatch(/GAINSIGHT_CLIENT_SECRET/);
      expect(String(error)).not.toMatch(/secret-1|client-secret-value/i);
    }
  });
});

describe("availableProfiles", () => {
  it("lists only profiles that have env files", () => {
    const dir = tempWorkspace();
    writeEnv(dir, "prod", {});
    expect(availableProfiles(dir)).toEqual(["prod"]);
  });
});

describe("loadResolvedProfile", () => {
  it("loads sandbox by default when both exist", () => {
    const dir = tempWorkspace();
    writeEnv(dir, "sandbox", { GAINSIGHT_CLIENT_ID: "sandbox-id" });
    writeEnv(dir, "prod", { GAINSIGHT_CLIENT_ID: "prod-id" });
    expect(loadResolvedProfile(undefined, dir).clientId).toBe("sandbox-id");
  });
});

describe("formatProdWriteBanner", () => {
  it("warns that writes hit production", () => {
    expect(formatProdWriteBanner()).toMatch(/PRODUCTION PROFILE/);
    expect(formatProdWriteBanner()).toMatch(/live community/);
  });

  it("includes operation, row count, and timestamp when provided", () => {
    const banner = formatProdWriteBanner({
      resource: "users",
      operation: "erase",
      rowCount: 12,
      timestamp: "2026-08-20T18:00:00.000Z",
    });
    expect(banner).toMatch(/users\/erase/);
    expect(banner).toMatch(/Rows: 12/);
    expect(banner).toMatch(/2026-08-20T18:00:00.000Z/);
  });
});
