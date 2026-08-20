export const PROFILE_NAMES = ["sandbox", "prod"] as const;

export type ProfileName = (typeof PROFILE_NAMES)[number];

export interface GainsightConfig {
  profile: ProfileName;
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  envFile: string;
}

export type CommandMode =
  | "explore"
  | "export"
  | "bulk-create"
  | "bulk-update"
  | "bulk-delete";

export interface CliFlags {
  profile?: string;
  resource?: string;
  op?: string;
  csv?: string;
  out?: string;
  results?: string;
  dryRun: boolean;
  failFast: boolean;
  authCheck: boolean;
  help: boolean;
  version: boolean;
  concurrency: number;
  utf8Bom: boolean;
}

export function isProfileName(value: string): value is ProfileName {
  return (PROFILE_NAMES as readonly string[]).includes(value);
}

export function isWriteOperation(op: string | undefined): boolean {
  if (!op) {
    return false;
  }
  const readOps = new Set(["explore", "export", "list", "get", "search"]);
  return !readOps.has(op);
}
