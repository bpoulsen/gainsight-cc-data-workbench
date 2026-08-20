import { parseArgs } from "node:util";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  formatProdWriteBanner,
  loadResolvedProfile,
  ProfileError,
} from "./lib/config/profile.js";
import { AuthError, getAuthenticatedClient } from "./lib/auth.js";
import { createApiClient } from "./lib/apiClient.js";
import { parseConcurrency } from "./lib/retry.js";
import { isWriteOperation, type CliFlags } from "./lib/types.js";

const HELP = `Gainsight CC Workbench — terminal explorer and CSV bulk tool

Usage:
  pnpm gs [options]
  pnpm gainsight-workbench [options]

Options:
  -p, --profile <sandbox|prod>  Named community profile (default: sandbox if both exist)
      --resource <name>         Resource family (users, questions, ideas, ...)
      --op <operation>          Named action (explore, export, editTags, ...)
      --csv <path>              Input CSV for bulk jobs
      --out <path>              Export CSV path
      --results <path>          Bulk results CSV path (default: {input}.results.csv)
      --dry-run                 Plan writes without calling the API
      --fail-fast               Stop a bulk job on the first row failure
      --concurrency <n>         Max parallel API requests (default 3, max 20)
      --auth-check              Acquire an OAuth token and report expiry (token is not printed)
  -h, --help                    Show this help
  -v, --version                 Show version

Copy .env.sandbox.example to .env.sandbox and fill in OAuth client credentials.
`;

export function parseCliFlags(argv: string[]): CliFlags {
  const { values } = parseArgs({
    args: argv,
    options: {
      profile: { type: "string", short: "p" },
      resource: { type: "string" },
      op: { type: "string" },
      csv: { type: "string" },
      out: { type: "string" },
      results: { type: "string" },
      "dry-run": { type: "boolean", default: false },
      "fail-fast": { type: "boolean", default: false },
      concurrency: { type: "string" },
      "auth-check": { type: "boolean", default: false },
      help: { type: "boolean", short: "h", default: false },
      version: { type: "boolean", short: "v", default: false },
    },
    allowPositionals: true,
    strict: true,
  });

  return {
    ...(values.profile !== undefined ? { profile: values.profile } : {}),
    ...(values.resource !== undefined ? { resource: values.resource } : {}),
    ...(values.op !== undefined ? { op: values.op } : {}),
    ...(values.csv !== undefined ? { csv: values.csv } : {}),
    ...(values.out !== undefined ? { out: values.out } : {}),
    ...(values.results !== undefined ? { results: values.results } : {}),
    dryRun: values["dry-run"] === true,
    failFast: values["fail-fast"] === true,
    authCheck: values["auth-check"] === true,
    help: values.help === true,
    version: values.version === true,
    concurrency: parseConcurrency(values.concurrency),
  };
}

function packageVersion(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  const pkgPath = join(here, "..", "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as { version: string };
  return pkg.version;
}

export async function main(
  argv: string[] = process.argv.slice(2),
  cwd: string = process.cwd(),
  io: { log: (msg: string) => void; error: (msg: string) => void } = {
    log: console.log,
    error: console.error,
  },
): Promise<number> {
  try {
    const flags = parseCliFlags(argv);

    if (flags.help) {
      io.log(HELP.trimEnd());
      return 0;
    }

    if (flags.version) {
      io.log(packageVersion());
      return 0;
    }

    const config = loadResolvedProfile(flags.profile, cwd);
    io.log(`Profile: ${config.profile}`);
    io.log(`API host: ${config.baseUrl}`);

    if (config.profile === "prod" && isWriteOperation(flags.op)) {
      io.log(formatProdWriteBanner());
    }

    const auth = getAuthenticatedClient(config);
    const api = createApiClient(auth, { concurrency: flags.concurrency });
    await api.auth.tokenManager.getAccessToken();
    const cached = api.auth.tokenManager.getCachedToken();
    const secondsLeft = cached
      ? Math.max(0, Math.round((cached.expiresAt - Date.now()) / 1000))
      : 0;
    io.log(`Authenticated. Token expires in ~${secondsLeft}s.`);

    if (!flags.authCheck) {
      io.log("Explore/export/bulk commands land in later tasks.");
    }
    return 0;
  } catch (error) {
    const message =
      error instanceof ProfileError ||
      error instanceof AuthError ||
      error instanceof Error
        ? error.message
        : String(error);
    io.error(message);
    return 1;
  }
}
