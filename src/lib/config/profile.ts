import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "dotenv";
import {
  isProfileName,
  type GainsightConfig,
  type ProfileName,
} from "../types.js";

const REQUIRED_VARS = [
  "GAINSIGHT_BASE_URL",
  "GAINSIGHT_CLIENT_ID",
  "GAINSIGHT_CLIENT_SECRET",
] as const;

export class ProfileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProfileError";
  }
}

export function envFileName(profile: ProfileName): string {
  return `.env.${profile}`;
}

export function envFilePath(profile: ProfileName, cwd: string): string {
  return resolve(cwd, envFileName(profile));
}

export function profileFileExists(profile: ProfileName, cwd: string): boolean {
  return existsSync(envFilePath(profile, cwd));
}

export function resolveProfile(
  explicit: string | undefined,
  cwd: string,
): ProfileName {
  if (explicit !== undefined) {
    if (!isProfileName(explicit)) {
      throw new ProfileError(
        `Unknown profile "${explicit}". Use "sandbox" or "prod".`,
      );
    }
    return explicit;
  }

  const sandbox = profileFileExists("sandbox", cwd);
  const prod = profileFileExists("prod", cwd);

  if (sandbox && prod) {
    return "sandbox";
  }
  if (sandbox) {
    return "sandbox";
  }
  if (prod) {
    return "prod";
  }

  throw new ProfileError(
    "No profile configured. Copy .env.sandbox.example to .env.sandbox (and optionally .env.prod.example to .env.prod).",
  );
}

export function loadProfile(
  profile: ProfileName,
  cwd: string,
): GainsightConfig {
  const envFile = envFilePath(profile, cwd);
  if (!existsSync(envFile)) {
    throw new ProfileError(
      `Missing ${envFileName(profile)}. Copy ${envFileName(profile)}.example and fill in credentials.`,
    );
  }

  const parsed = parse(readFileSync(envFile));
  const missing = REQUIRED_VARS.filter((key) => !parsed[key]?.trim());
  if (missing.length > 0) {
    throw new ProfileError(
      `${envFileName(profile)} is missing required values: ${missing.join(", ")}.`,
    );
  }

  return {
    profile,
    baseUrl: parsed.GAINSIGHT_BASE_URL!.trim().replace(/\/+$/, ""),
    clientId: parsed.GAINSIGHT_CLIENT_ID!.trim(),
    clientSecret: parsed.GAINSIGHT_CLIENT_SECRET!.trim(),
    envFile,
  };
}

export function loadResolvedProfile(
  explicit: string | undefined,
  cwd: string,
): GainsightConfig {
  const profile = resolveProfile(explicit, cwd);
  return loadProfile(profile, cwd);
}

export function formatProdWriteBanner(): string {
  return [
    "========================================",
    "  PRODUCTION PROFILE",
    "  Writes will hit the live community.",
    "========================================",
  ].join("\n");
}
