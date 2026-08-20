import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import openapiTS, { astToString } from "openapi-typescript";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const specsDir = join(root, "docs", "api");
const outDir = join(root, "src", "generated");

const SPECS: Array<{ file: string; out: string }> = [
  { file: "community-api.json", out: "community.ts" },
  { file: "user-api.json", out: "user.ts" },
  { file: "events-api.json", out: "events.ts" },
  { file: "gamification-api.json", out: "gamification.ts" },
  { file: "search-api.json", out: "search.ts" },
];

const KEEP_EMPTY_ARRAY_KEYS = new Set([
  "required",
  "enum",
  "examples",
  "example",
  "tags",
  "security",
  "consumes",
  "produces",
  "parameters",
  "servers",
]);

function sanitize(node: unknown, key?: string): unknown {
  if (Array.isArray(node)) {
    if (node.length === 0 && key && !KEEP_EMPTY_ARRAY_KEYS.has(key)) {
      return { type: "object", additionalProperties: true };
    }
    return node.map((item) => sanitize(item));
  }
  if (node && typeof node === "object") {
    const out: Record<string, unknown> = {};
    for (const [childKey, value] of Object.entries(node as Record<string, unknown>)) {
      out[childKey] = sanitize(value, childKey);
    }
    return out;
  }
  return node;
}

const HTTP_METHODS = new Set([
  "get",
  "put",
  "post",
  "delete",
  "options",
  "head",
  "patch",
  "trace",
]);

function asSchemaObject(item: unknown): unknown {
  if (item === null) {
    return { type: "null" };
  }
  if (typeof item === "string" || typeof item === "number" || typeof item === "boolean") {
    return { type: typeof item, enum: [item] };
  }
  if (Array.isArray(item)) {
    return { type: "object", additionalProperties: true };
  }
  return item;
}

function fixInvalidSchemas(node: unknown, key?: string): unknown {
  if (Array.isArray(node)) {
    const items =
      key === "oneOf" || key === "anyOf" || key === "allOf"
        ? node.map((item) => asSchemaObject(item))
        : node;
    return items.map((item) => fixInvalidSchemas(item));
  }
  if (node && typeof node === "object") {
    const out: Record<string, unknown> = {};
    for (const [childKey, value] of Object.entries(node as Record<string, unknown>)) {
      out[childKey] = fixInvalidSchemas(value, childKey);
    }
    const looksLikeObjectSchema =
      out.type === "object" || "properties" in out || "additionalProperties" in out;
    if (
      looksLikeObjectSchema &&
      Array.isArray(out.enum) &&
      out.enum.every((entry) => entry === null || typeof entry !== "object")
    ) {
      delete out.enum;
    }
    return out;
  }
  return node;
}

function uniquifyOperationIds(schema: unknown): void {
  if (!schema || typeof schema !== "object") {
    return;
  }
  const paths = (schema as { paths?: unknown }).paths;
  if (!paths || typeof paths !== "object") {
    return;
  }
  const used = new Set<string>();
  for (const [path, pathItem] of Object.entries(paths as Record<string, unknown>)) {
    if (!pathItem || typeof pathItem !== "object") {
      continue;
    }
    for (const [method, operation] of Object.entries(pathItem as Record<string, unknown>)) {
      if (!HTTP_METHODS.has(method) || !operation || typeof operation !== "object") {
        continue;
      }
      const op = operation as { operationId?: string };
      if (typeof op.operationId !== "string" || op.operationId.length === 0) {
        continue;
      }
      let id = op.operationId;
      if (used.has(id)) {
        const slug = path.replace(/[^A-Za-z0-9]+/g, "_").replace(/^_|_$/g, "");
        id = `${slug}_${method}_${op.operationId}`;
        op.operationId = id;
      }
      used.add(id);
    }
  }
}

mkdirSync(outDir, { recursive: true });

for (const spec of SPECS) {
  const srcPath = join(specsDir, spec.file);
  const raw = JSON.parse(readFileSync(srcPath, "utf8")) as unknown;
  const schema = fixInvalidSchemas(sanitize(raw));
  uniquifyOperationIds(schema);
  const ast = await openapiTS(schema as Parameters<typeof openapiTS>[0]);
  const dest = join(outDir, spec.out);
  writeFileSync(
    dest,
    `/** Generated from docs/api/${spec.file}. Do not edit by hand. */\n${astToString(ast)}`,
  );
  console.log(`Wrote ${spec.out}`);
}

writeFileSync(
  join(outDir, "index.ts"),
  [
    "/** Generated namespace re-exports. Specs share `paths`/`components` names, so they are aliased. */",
    'export type * as community from "./community.js";',
    'export type * as user from "./user.js";',
    'export type * as events from "./events.js";',
    'export type * as gamification from "./gamification.js";',
    'export type * as search from "./search.js";',
    "",
  ].join("\n"),
);
console.log("Wrote index.ts");
