import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import type { ApiClient } from "../lib/apiClient.js";
import type { QueryParams } from "../lib/auth.js";
import { TOPIC_CAP_HINT } from "../adapters/content.js";
import {
  BaseAdapter,
  type FromCsvRowContext,
  type PageRequest,
  type ResourceName,
  type ResourceOperation,
} from "../adapters/base.js";
import { parseCliFlags } from "../cli.js";
import { runWizard } from "../commands/wizard.js";
import type { BulkJobSummary } from "../commands/bulk.js";
import type { ExportResult } from "../commands/export.js";
import { WizardCancelled, WizardError } from "./helpers.js";
import type {
  WizardConfirmOptions,
  WizardSelectOptions,
  WizardTextOptions,
  WizardUi,
} from "./ui.js";

const stubClient = {} as ApiClient;

function tempWorkspace(): string {
  return mkdtempSync(join(tmpdir(), "gs-wizard-"));
}

function writeEnv(dir: string, profile: "sandbox" | "prod"): void {
  writeFileSync(
    join(dir, `.env.${profile}`),
    [
      "GAINSIGHT_BASE_URL=https://api2-eu-west-1.insided.com",
      "GAINSIGHT_CLIENT_ID=client-id",
      "GAINSIGHT_CLIENT_SECRET=client-secret",
      "",
    ].join("\n"),
  );
}

class FakeUsersAdapter extends BaseAdapter {
  readonly name = "users" as const;
  readonly label = "Users";
  readonly family = "users" as const;
  readonly identity = "id-or-email" as const;
  hitCap = false;
  listCalls: Array<{ filters: QueryParams; page: PageRequest }> = [];

  private readonly records = [
    { id: 7, email: "ops@example.com", username: "ops" },
    { id: 8, email: "mod@example.com", username: "mod" },
  ];

  async list(filters: QueryParams, page: PageRequest) {
    this.listCalls.push({ filters, page });
    const pageSize = page.pageSize ?? 25;
    const start = (page.page - 1) * pageSize;
    const slice = this.records.slice(start, start + pageSize);
    const listed = this.toListPage(slice, page.page, pageSize);
    if (this.hitCap) {
      listed.hitCap = true;
    }
    return listed;
  }

  async get(id: string | number) {
    return this.records.find((row) => String(row.id) === String(id)) ?? {};
  }

  exportFields() {
    return [
      { name: "id", kind: "number" as const },
      { name: "email", kind: "string" as const },
      { name: "username", kind: "string" as const },
    ];
  }

  operations(): ResourceOperation[] {
    return [
      {
        name: "updateField",
        kind: "update",
        label: "Update field",
        requiredColumns: ["field", "value"],
      },
      {
        name: "erase",
        kind: "delete",
        label: "Erase user",
        confirmation: "typed",
        requiredColumns: [],
      },
    ];
  }

  fromCsvRow(row: Record<string, unknown>, operation: string, context?: FromCsvRowContext) {
    const id = this.identityValue(row, context);
    return this.callPlan({
      method: operation === "erase" ? "DELETE" : "PUT",
      path: `/user/${id}`,
      operation,
      resolvedId: Number(id),
    });
  }

  describeFilters() {
    return [{ name: "q", label: "Search", type: "string" as const }];
  }
}

class TopicsOnlyAdapter extends FakeUsersAdapter {
  override readonly name = "topics" as const;
  override readonly label = "Topics";
  override operations(): ResourceOperation[] {
    return [];
  }
}

function createScriptedUi(script: {
  selects?: unknown[];
  texts?: string[];
  confirms?: boolean[];
}): { ui: WizardUi; notes: string[]; info: string[]; warn: string[]; errors: string[]; outros: string[] } {
  const selects = [...(script.selects ?? [])];
  const texts = [...(script.texts ?? [])];
  const confirms = [...(script.confirms ?? [])];
  const notes: string[] = [];
  const info: string[] = [];
  const warn: string[] = [];
  const errors: string[] = [];
  const outros: string[] = [];

  const ui: WizardUi = {
    intro: () => undefined,
    outro: (message) => {
      if (message !== undefined) {
        outros.push(message);
      }
    },
    cancel: () => undefined,
    async select<T extends string>(opts: WizardSelectOptions<T>): Promise<T> {
      const next = selects.shift();
      if (next === undefined) {
        throw new Error(`Unexpected select: ${opts.message}`);
      }
      return next as T;
    },
    async text(opts: WizardTextOptions): Promise<string> {
      const next = texts.shift();
      if (next === undefined) {
        throw new Error(`Unexpected text: ${opts.message}`);
      }
      return next;
    },
    async confirm(opts: WizardConfirmOptions): Promise<boolean> {
      const next = confirms.shift();
      if (next === undefined) {
        throw new Error(`Unexpected confirm: ${opts.message}`);
      }
      return next;
    },
    spinner: () => ({
      start: () => undefined,
      stop: () => undefined,
      message: () => undefined,
    }),
    note: (message, title) => {
      notes.push([title, message].filter((part) => part !== undefined).join("\n"));
    },
    info: (message) => info.push(message),
    success: (message) => info.push(message),
    warn: (message) => warn.push(message),
    error: (message) => errors.push(message),
  };

  return { ui, notes, info, warn, errors, outros };
}

function baseOptions(
  dir: string,
  adapter: FakeUsersAdapter,
  ui: WizardUi,
  extras: {
    listResources?: () => ResourceName[];
    exportResource?: () => Promise<ExportResult>;
    runBulkJob?: () => Promise<BulkJobSummary>;
  } = {},
) {
  writeEnv(dir, "sandbox");
  writeEnv(dir, "prod");
  return {
    flags: parseCliFlags(["--profile", "sandbox"]),
    cwd: dir,
    io: { log: () => undefined, error: () => undefined },
    ui,
    authenticate: async () => ({ client: stubClient, secondsLeft: 7200 }),
    getAdapter: () => adapter,
    listResources: extras.listResources ?? ((): ResourceName[] => ["users"]),
    ...(extras.exportResource ? { exportResource: extras.exportResource } : {}),
    ...(extras.runBulkJob ? { runBulkJob: extras.runBulkJob } : {}),
  };
}

describe("runWizard", () => {
  it("returns 0 when the user cancels a prompt", async () => {
    const dir = tempWorkspace();
    writeEnv(dir, "sandbox");
    const { ui } = createScriptedUi({});
    ui.select = async () => {
      throw new WizardCancelled();
    };
    const code = await runWizard({
      flags: parseCliFlags([]),
      cwd: dir,
      io: { log: () => undefined, error: () => undefined },
      ui,
      authenticate: async () => ({ client: stubClient, secondsLeft: 1 }),
    });
    expect(code).toBe(0);
  });

  it("previews a page, warns on the 10k cap, and skips CSV save", async () => {
    const dir = tempWorkspace();
    const adapter = new FakeUsersAdapter(stubClient);
    adapter.hitCap = true;
    const scripted = createScriptedUi({
      selects: ["users", "explore"],
      texts: ["ops"],
      confirms: [false],
    });
    const code = await runWizard(baseOptions(dir, adapter, scripted.ui));
    expect(code).toBe(0);
    expect(adapter.listCalls[0]?.filters).toEqual({ q: "ops" });
    expect(scripted.notes[0]).toMatch(/ops@example.com/);
    expect(scripted.warn.some((line) => line.includes(TOPIC_CAP_HINT))).toBe(true);
    expect(scripted.outros[0]).toMatch(/Previewed 2/);
  });

  it("exports after collecting filters", async () => {
    const dir = tempWorkspace();
    const adapter = new FakeUsersAdapter(stubClient);
    const outPath = join(dir, "users.csv");
    const exportResource = vi.fn(async (_adapter, options: { outPath: string; filters?: QueryParams }) => {
      expect(options.filters).toEqual({ q: "mod" });
      const result: ExportResult = {
        rowCount: 2,
        pageCount: 1,
        outPath: options.outPath,
        columns: ["id", "email", "username"],
        hitCap: false,
      };
      return result;
    });
    const scripted = createScriptedUi({
      selects: ["users", "export"],
      texts: ["mod", outPath],
    });
    const code = await runWizard(
      baseOptions(dir, adapter, scripted.ui, { exportResource }),
    );
    expect(code).toBe(0);
    expect(exportResource).toHaveBeenCalledOnce();
    expect(scripted.info.some((line) => line.includes("Exported 2 rows"))).toBe(true);
  });

  it("validates bulk CSV headers and runs a dry-run without typed confirm", async () => {
    const dir = tempWorkspace();
    const csvPath = join(dir, "users.csv");
    writeFileSync(csvPath, "id,field,value\n7,username,ops\n");
    const adapter = new FakeUsersAdapter(stubClient);
    const runBulkJob = vi.fn(async () => {
      const summary: BulkJobSummary = {
        total: 1,
        success: 0,
        failed: 0,
        skipped: 0,
        planned: 1,
        durationMs: 4,
        resultsPath: join(dir, "users.results.csv"),
        operation: "updateField",
        resource: "users",
        profile: "sandbox",
        dryRun: true,
        sawRateLimit: false,
        rateLimitCount: 0,
        concurrency: 3,
      };
      return summary;
    });
    const scripted = createScriptedUi({
      selects: ["users", "bulk", "updateField"],
      texts: [csvPath],
      confirms: [true],
    });
    const code = await runWizard(baseOptions(dir, adapter, scripted.ui, { runBulkJob }));
    expect(code).toBe(0);
    expect(runBulkJob).toHaveBeenCalledOnce();
    expect(runBulkJob.mock.calls[0]?.[0]).toMatchObject({
      operation: "updateField",
      dryRun: true,
      csvPath,
    });
  });

  it("requires typed confirmation for live erase and shows the prod banner", async () => {
    const dir = tempWorkspace();
    writeEnv(dir, "sandbox");
    writeEnv(dir, "prod");
    const csvPath = join(dir, "erase.csv");
    writeFileSync(csvPath, "email\nops@example.com\n");
    const adapter = new FakeUsersAdapter(stubClient);
    const runBulkJob = vi.fn(async () => {
      const summary: BulkJobSummary = {
        total: 1,
        success: 1,
        failed: 0,
        skipped: 0,
        planned: 0,
        durationMs: 8,
        resultsPath: join(dir, "erase.results.csv"),
        operation: "erase",
        resource: "users",
        profile: "prod",
        dryRun: false,
        sawRateLimit: false,
        rateLimitCount: 0,
        concurrency: 3,
      };
      return summary;
    });
    const scripted = createScriptedUi({
      selects: ["users", "bulk", "erase"],
      texts: [csvPath, "DELETE"],
      confirms: [false],
    });
    const code = await runWizard({
      ...baseOptions(dir, adapter, scripted.ui, { runBulkJob }),
      flags: parseCliFlags(["--profile", "prod"]),
    });
    expect(code).toBe(0);
    expect(scripted.errors.some((line) => line.includes("PRODUCTION PROFILE"))).toBe(true);
    expect(runBulkJob.mock.calls[0]?.[0]).toMatchObject({ dryRun: false, operation: "erase" });
  });

  it("skips typed confirmation when --skip-confirmation is set", async () => {
    const dir = tempWorkspace();
    const csvPath = join(dir, "erase.csv");
    writeFileSync(csvPath, "id\n7\n");
    const adapter = new FakeUsersAdapter(stubClient);
    const runBulkJob = vi.fn(async () => {
      const summary: BulkJobSummary = {
        total: 1,
        success: 1,
        failed: 0,
        skipped: 0,
        planned: 0,
        durationMs: 3,
        resultsPath: join(dir, "erase.results.csv"),
        operation: "erase",
        resource: "users",
        profile: "sandbox",
        dryRun: false,
        sawRateLimit: false,
        rateLimitCount: 0,
        concurrency: 3,
      };
      return summary;
    });
    const scripted = createScriptedUi({
      selects: ["users", "bulk", "erase"],
      texts: [csvPath],
      confirms: [false],
    });
    const code = await runWizard({
      ...baseOptions(dir, adapter, scripted.ui, { runBulkJob }),
      flags: parseCliFlags(["--profile", "sandbox", "--skip-confirmation"]),
    });
    expect(code).toBe(0);
    expect(scripted.warn.some((line) => line.includes("--skip-confirmation"))).toBe(true);
    expect(runBulkJob).toHaveBeenCalledOnce();
  });

  it("rejects a CSV missing required columns before running the job", async () => {
    const dir = tempWorkspace();
    const csvPath = join(dir, "bad.csv");
    writeFileSync(csvPath, "username\nops\n");
    const adapter = new FakeUsersAdapter(stubClient);
    const runBulkJob = vi.fn();
    const scripted = createScriptedUi({
      selects: ["users", "bulk", "updateField"],
      texts: [csvPath],
    });
    await expect(
      runWizard(baseOptions(dir, adapter, scripted.ui, { runBulkJob })),
    ).rejects.toThrow(/missing required columns/);
    expect(runBulkJob).not.toHaveBeenCalled();
  });

  it("errors when the resource has no bulk operations", async () => {
    const dir = tempWorkspace();
    const adapter = new TopicsOnlyAdapter(stubClient);
    const scripted = createScriptedUi({
      selects: ["topics", "bulk"],
    });
    await expect(
      runWizard(
        baseOptions(dir, adapter, scripted.ui, { listResources: () => ["topics"] }),
      ),
    ).rejects.toThrow(/no bulk operations/);
  });
});
