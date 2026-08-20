import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Writable } from "node:stream";
import { describe, expect, it } from "vitest";
import {
  CsvError,
  CsvReader,
  CsvWriter,
  coerceCell,
  ensureExportColumns,
  flattenRecord,
  flattenValue,
  mapCsvRow,
  UTF8_BOM,
} from "./csv.js";

async function collected(reader: CsvReader) {
  const rows = [];
  for await (const row of reader) {
    rows.push(row);
  }
  return rows;
}

describe("coerceCell / mapCsvRow", () => {
  it("omits empty cells and coerces booleans, pipes, and json", () => {
    expect(coerceCell("", "string", "title")).toBeUndefined();
    expect(coerceCell("true", "boolean", "closed")).toBe(true);
    expect(coerceCell("FALSE", "boolean", "closed")).toBe(false);
    expect(coerceCell("tag-a|tag-b", "string[]", "tags")).toEqual(["tag-a", "tag-b"]);
    expect(coerceCell('{"ok":true}', "json", "payload")).toEqual({ ok: true });
    expect(coerceCell("12", "number", "id")).toBe(12);
  });

  it("rejects invalid booleans", () => {
    expect(() => coerceCell("yes", "boolean", "closed")).toThrow(/true or false/);
  });

  it("maps aliases, omits empties, and warns on unknown columns", () => {
    const unknown: string[] = [];
    const values = mapCsvRow(
      { "User ID": "7", "Email Address": "ops@example.com", title: "", extra: "nope" },
      {
        aliases: { "User ID": "id", "Email Address": "email" },
        kinds: { id: "number" },
        knownFields: ["id", "email", "title"],
        onUnknown: (header) => unknown.push(header),
      },
    );
    expect(values).toEqual({ id: 7, email: "ops@example.com" });
    expect(unknown).toEqual(["extra"]);
  });
});

describe("flattenValue", () => {
  it("pipe-joins scalar arrays and JSON-stringifies nested values", () => {
    expect(flattenValue(["tag-a", "tag-b"])).toBe("tag-a|tag-b");
    expect(flattenValue(true)).toBe("true");
    expect(flattenValue({ id: 1 })).toBe('{"id":1}');
    expect(flattenValue([{ id: 1 }])).toBe('[{"id":1}]');
    expect(flattenValue(undefined)).toBe("");
  });

  it("fills export columns including missing keys", () => {
    expect(flattenRecord({ id: 7, tags: ["a", "b"] }, ["id", "email", "tags"])).toEqual({
      id: "7",
      email: "",
      tags: "a|b",
    });
  });
});

describe("ensureExportColumns", () => {
  it("always includes id and email for users", () => {
    expect(ensureExportColumns(["username"], { includeEmail: true })).toEqual([
      "id",
      "email",
      "username",
    ]);
    expect(ensureExportColumns(["id", "title"])).toEqual(["id", "title"]);
  });
});

describe("CsvReader", () => {
  it("streams header rows into mapped objects", async () => {
    const csv = `${UTF8_BOM}id,email,tags,closed,title\n7,ops@example.com,tag-a|tag-b,true,\n`;
    const reader = CsvReader.fromString(csv, {
      mapping: {
        kinds: { tags: "string[]", closed: "boolean" },
      },
    });
    const rows = await collected(reader);
    expect(reader.headers).toEqual(["id", "email", "tags", "closed", "title"]);
    expect(rows).toHaveLength(1);
    expect(rows[0]?.values).toEqual({
      id: "7",
      email: "ops@example.com",
      tags: ["tag-a", "tag-b"],
      closed: true,
    });
    expect(rows[0]?.raw.title).toBe("");
  });

  it("requires a header row", async () => {
    const reader = CsvReader.fromString("");
    await expect(collected(reader)).rejects.toBeInstanceOf(CsvError);
  });

  it("emits progress every 100 rows", async () => {
    const progress: number[] = [];
    const lines = ["id", ...Array.from({ length: 250 }, (_, i) => String(i + 1))];
    const reader = CsvReader.fromString(lines.join("\n"), {
      onProgress: (count) => progress.push(count),
    });
    await collected(reader);
    expect(progress).toEqual([100, 200, 250]);
  });
});

describe("CsvWriter", () => {
  it("writes UTF-8 with an optional BOM and flattened values", async () => {
    const chunks: Buffer[] = [];
    const dest = new WritableBuffer(chunks);
    const writer = new CsvWriter(dest, {
      columns: ["id", "email", "tags"],
      utf8Bom: true,
    });
    await writer.writeRow({ id: 7, email: "ops@example.com", tags: ["tag-a", "tag-b"] });
    await writer.end();
    const output = Buffer.concat(chunks).toString("utf8");
    expect(output.startsWith(UTF8_BOM)).toBe(true);
    expect(output).toContain("id,email,tags");
    expect(output).toContain("7,ops@example.com,tag-a|tag-b");
  });

  it("round-trips through a file without buffering the whole dataset", async () => {
    const dir = await mkdtemp(join(tmpdir(), "gs-csv-"));
    const path = join(dir, "users.csv");
    try {
      const writer = CsvWriter.fromFile(path, {
        columns: ensureExportColumns(["username"], { includeEmail: true }),
      });
      await writer.writeRow({ id: 1, email: "a@example.com", username: "a" });
      await writer.writeRow({ id: 2, email: "b@example.com", username: "b" });
      await writer.end();

      const body = await readFile(path, "utf8");
      expect(body.startsWith(UTF8_BOM)).toBe(false);
      expect(body.split("\n")[0]).toBe("id,email,username");

      const reader = CsvReader.fromFile(path);
      const rows = await collected(reader);
      expect(rows.map((row) => row.values)).toEqual([
        { id: "1", email: "a@example.com", username: "a" },
        { id: "2", email: "b@example.com", username: "b" },
      ]);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});

describe("streaming 100k rows", () => {
  it("stays under 100MB heap while counting rows", async () => {
    const dir = await mkdtemp(join(tmpdir(), "gs-csv-mem-"));
    const path = join(dir, "large.csv");
    try {
      const writer = CsvWriter.fromFile(path, { columns: ["id", "email"] });
      for (let i = 1; i <= 100_000; i += 1) {
        await writer.writeRow({ id: i, email: `u${i}@example.com` });
      }
      await writer.end();

      const before = process.memoryUsage().heapUsed;
      const reader = CsvReader.fromFile(path);
      let count = 0;
      for await (const row of reader) {
        count += 1;
        if (row.values.id === undefined) {
          throw new Error("missing id");
        }
      }
      const used = process.memoryUsage().heapUsed;
      expect(count).toBe(100_000);
      expect(used).toBeLessThan(100 * 1024 * 1024);
      expect(used - before).toBeLessThan(100 * 1024 * 1024);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  }, 30_000);
});

class WritableBuffer extends Writable {
  constructor(private readonly chunks: Buffer[]) {
    super();
  }

  override _write(
    chunk: Buffer,
    _encoding: BufferEncoding,
    callback: (error?: Error | null) => void,
  ): void {
    this.chunks.push(Buffer.from(chunk));
    callback();
  }
}
