import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { loadProfile, profileFileExists } from "../../src/lib/config/profile.js";
import { getAuthenticatedClient } from "../../src/lib/auth.js";
import { createApiClient } from "../../src/lib/apiClient.js";
import { UsersAdapter } from "../../src/adapters/users.js";
import { CsvWriter } from "../../src/lib/csv.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const enabled = process.env.RUN_INTEGRATION === "1";
const hasSandbox = profileFileExists("sandbox", ROOT);

describe.skipIf(!enabled)("sandbox integration (read-only)", () => {
  it("has sandbox credentials when RUN_INTEGRATION=1", () => {
    expect(hasSandbox).toBe(true);
  });

  it("acquires a token without printing it", async () => {
    const config = loadProfile("sandbox", ROOT);
    expect(config.clientId.length).toBeGreaterThan(0);
    expect(config.clientSecret.length).toBeGreaterThan(0);
    const auth = getAuthenticatedClient(config);
    const token = await auth.tokenManager.getAccessToken();
    expect(token.length).toBeGreaterThan(10);
    expect(token).not.toContain(" ");
  });

  it("lists a page of users and can write an export CSV", async () => {
    const config = loadProfile("sandbox", ROOT);
    const client = createApiClient(getAuthenticatedClient(config), { concurrency: 1 });
    const adapter = new UsersAdapter(client);
    const page = await adapter.list({}, { page: 1, pageSize: 5 });
    expect(Array.isArray(page.records)).toBe(true);
    expect(page.pageSize).toBe(5);

    const dir = await mkdtemp(join(tmpdir(), "gs-int-"));
    const outPath = join(dir, "users.csv");
    try {
      const writer = CsvWriter.fromFile(outPath, { columns: adapter.exportColumnNames() });
      for (const record of page.records) {
        await writer.writeRow(adapter.flattenRecord(record));
      }
      await writer.end();
      const body = await readFile(outPath, "utf8");
      expect(body.split("\n")[0]).toContain("id");
      expect(body.split("\n")[0]).toContain("email");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
