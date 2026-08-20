# Gainsight CC Workbench

Terminal workbench for [Gainsight Customer Communities](https://www.gainsight.com/customer-communities/) (formerly inSided). It polyfills the Salesforce Workbench loop operators used on Salesforce communities: **explore data, export CSV, and bulk CRUD from CSV** against the Gainsight CC API.

There is no web GUI in v1. Run `pnpm gs` for the interactive wizard, or pass flags for scripted jobs.

Requirements live in [`docs/prd/prd.md`](docs/prd/prd.md). OpenAPI specs are in [`docs/api/`](docs/api/).

**Further reading**

- [CSV identity](docs/CSV_IDENTITY.md) — `id` vs `email`, conflicts, results CSV
- [Operations](docs/OPERATIONS.md) — per-resource actions and required columns
- [Filter sharding](docs/FILTER_SHARDING.md) — exporting more than 10,000 topics

## Why this exists

Gainsight CC has a REST API but no Workbench-style tool. The API is also not Salesforce-like:

- No SOQL / generic query language
- No generic PATCH across objects — writes are **named actions** (`editTitle`, `editTags`, `toggleTrashed`, `move`, …)
- Native bulk endpoints exist **only** for user roles and badges; every other bulk job is a CSV row loop
- Unified topic listing is capped at the **first 10,000** matches
- User erase **anonymizes** that user’s content

This CLI wraps those APIs: filter → preview → CSV → bulk apply, with a results CSV and an audit line for every write job.

This is **not** the Salesforce → Gainsight migration ETL. It operates on Gainsight CC after (or alongside) that work.

## Installation

Requires **Node.js 20+** and [pnpm](https://pnpm.io/).

```bash
pnpm install
cp .env.sandbox.example .env.sandbox   # fill in OAuth client credentials
# optional:
cp .env.prod.example .env.prod

pnpm gs --help
pnpm gs --auth-check --profile sandbox
```

`pnpm gs` and `pnpm gainsight-workbench` both run the CLI via `tsx`. After `pnpm build`, the `gs` bin points at `dist/index.js`.

## What v1 covers

| Mode                          | What it does                                                         |
| ----------------------------- | -------------------------------------------------------------------- |
| Explore                       | Interactive filters per resource, paged results in the terminal      |
| Export                        | Same query, written to CSV (wizard collects filters)                 |
| Bulk create / update / delete | Loop a CSV; **one named operation per job**                          |
| Native user bulk              | Roles and badges go through `/user/bulk/role` and `/user/bulk/badge` |

**Resources:** users, topics, questions, ideas, conversations, articles, product updates, events, taxonomy (categories, tags, moderator tags, product areas, idea statuses), gamification, search.

Search, unified **topics**, and **categories** are explore/export only. Federated search index write/delete and webhook management are out of v1.

## Usage

```bash
# Interactive wizard (default profile is sandbox when both env files exist)
pnpm gs
pnpm gs --profile sandbox
pnpm gs --profile prod

# Scripted export (unfiltered list — use the wizard to apply filters)
pnpm gs --profile sandbox --resource users --op export --out users.csv

# Scripted bulk (dry-run first)
pnpm gs --profile prod --resource questions --op editTags --csv tags.csv --dry-run
pnpm gs --profile sandbox --resource users --op erase --csv erase.csv
pnpm gs --profile sandbox --resource users --op bulkAddRoles --csv roles.csv
```

`--op explore` is wizard-only. Scripted jobs use `--op export` or a named write from [operations](docs/OPERATIONS.md).

## Authentication and profiles

Auth is OAuth2 **client credentials**. Tokens last ~2 hours; the CLI caches them in memory and refreshes 60s before expiry. A token **without** `scope=read write` will 401 on `/v2`.

```bash
pnpm gs --auth-check --profile sandbox
pnpm gs --auth-check --profile prod
```

`--auth-check` reports token lifetime only. It never prints the access token or client secret.

Named profiles **prod** and **sandbox** share the same API host; only credentials differ. If both `.env.sandbox` and `.env.prod` exist and you omit `--profile`, the CLI uses **sandbox**.

```bash
# .env.sandbox / .env.prod (gitignored — never commit secrets)
GAINSIGHT_BASE_URL=https://api2-eu-west-1.insided.com
GAINSIGHT_CLIENT_ID=
GAINSIGHT_CLIENT_SECRET=
```

Create client credentials in Gainsight CC admin. `--profile prod` on a write job prints a visible banner (resource, operation, row count, timestamp) before running.

Do not log or print client secrets or access tokens.

## CLI flags

| Flag | Meaning |
| ---- | ------- |
| `-p`, `--profile sandbox\|prod` | Named community profile |
| `--resource <name>` | Resource family (`users`, `questions`, `event`, …) |
| `--op <operation>` | `export` or a named write (`editTags`, `erase`, …) |
| `--csv <path>` | Input CSV for bulk jobs |
| `--out <path>` | Export CSV path |
| `--results <path>` | Bulk results CSV (default `{input}.results.csv`) |
| `--dry-run` | Plan writes; no mutations |
| `--fail-fast` | Stop the job on the first failed row |
| `--concurrency <n>` | Parallel API requests (default **3**, max **20**) |
| `--utf8-bom` | Prefix export/results CSV with a UTF-8 BOM (Excel) |
| `--skip-confirmation` | Skip typed confirmation (**dangerous** — scripts only) |
| `--auth-check` | Acquire a token and report expiry (token is not printed) |
| `-h`, `--help` / `-v`, `--version` | Help / version |

Passing any of `--resource`, `--op`, `--csv`, or `--out` skips the wizard.

## CSV identity and conventions

| Resource | Identify rows by |
| -------- | ---------------- |
| Users, gamification (`assignPoints`) | `id` **or** `email` (email is resolved to userid before mutate) |
| Topics, replies, events, taxonomy | Gainsight numeric `id` (`replyId` or `eventId` when that is the row identity) |

If a user row has both `id` and `email` and they resolve to different people, that row **fails** — the tool will not guess. Details: [CSV identity](docs/CSV_IDENTITY.md).

- UTF-8, header row required
- Booleans: `true` / `false`
- Multi-value fields (tags, roles, product areas): pipe-separated (`tag-a|tag-b`)
- Nested objects (and arrays of objects) on export: JSON.stringify
- Exports always include `id`; user and gamification exports also include `email`
- Empty cell = omit the field
- Unknown columns: warn and ignore
- **One named operation per job** (e.g. all rows are `editTags`)
- `--utf8-bom` prefixes files with a UTF-8 BOM for Excel

Every write job writes a results CSV (`{input}.results.csv` unless you pass `--results`) with `status`, `http_status`, `error`, `resolved_id`, `operation`, `profile`, and `timestamp`.

## Safety

| Rule | Behavior |
| ---- | -------- |
| Dry-run | Optional (`--dry-run`). Resolves IDs, validates columns, prints planned calls. No writes. |
| Trash / permanent delete / user erase | Typed confirmation required before any live request. Type the resource name (`users`, `questions`, …) or `DELETE`. |
| `--skip-confirmation` | Bypasses typed confirmation. **DANGEROUS** — use only in automated scripts. |
| Content delete default | **Trash** (`toggleTrashed`), not permanent delete |
| User erase | Confirmed separately; it **anonymizes** content created by that user |
| Prod banner | `--profile prod` write jobs print profile, operation, row count, and timestamp before running |
| Audit log | Each bulk job appends one JSON line to `logs/jobs.jsonl` (job metadata only; no emails, names, or tokens) |
| Retries | 429 / 5xx retried up to **3 attempts** on non-delete ops. Backoff starts at 1s, doubles, caps at 60s, ±20% jitter. `Retry-After` is honored (also capped at 60s). **Deletes / trash / erase are never auto-retried** |
| Concurrency | Default **3** parallel API requests (`--concurrency 1-20`). If you still see 429s, the summary suggests halving concurrency. |

### Dry-run

```bash
pnpm gs --profile sandbox --resource users --op erase --csv erase.csv --dry-run
```

Dry-run resolves identities and writes a results CSV with `status=planned`. It does not call write endpoints and does not prompt for typed confirmation.

### Typed confirmation

Live `erase`, `toggleTrashed`, and `permanentDelete` jobs prompt:

`This will erase 12 users records. Type "users" or "DELETE" to confirm:`

Matching is case-sensitive. A mismatch exits with `Operation cancelled by operator`. Pass `--skip-confirmation` only for unattended scripts.

### Audit log

`logs/jobs.jsonl` is created on first bulk job. Each line is:

`{timestamp, profile, operation, resource, inputFile, resultsFile, totalRows, successCount, failedCount, skippedCount, plannedCount, duration, dryRun, sawRateLimit, rateLimitCount}`

Only numeric `resolved_id` values appear in the results CSV. The audit file does not record emails or names.

### Manual delete follow-up

Deletes are never auto-retried (a 429/5xx might have already applied). Failed rows use `status=failed` and an `error` that starts with `DELETE_FAILED:`.

1. Open `{input}.results.csv`.
2. Keep rows where `status` is `failed` and `error` contains `DELETE_FAILED`.
3. Copy the original identity columns (`id` / `email`) into a new CSV.
4. Re-run that CSV as a **new** job after checking the community so you do not double-delete. Contact Gainsight support if the API state is unclear.

## API constraints

1. **No generic CRUD.** Pick the action (`editTitle` vs `editTags` vs `toggleClosed`).
2. **10,000-topic cap** on unified list (`GET /v2/topics`). Broader exports need narrower filters or [sharding](docs/FILTER_SHARDING.md).
3. **Articles and product updates** are created as drafts and published in a separate `publish` step.
4. **Events** have no category filter and no permanent-delete endpoint. Trash/restore is `toggleTrashed`. Attendee export is `userId` + `signedUpAt` (no email). `signup` / `cancelSignUp` are side-effecting for members.
5. **Gamification** explore is leaderboards or assigned points. Bulk assign is `POST /points/assign` `{ user, points }` (no reason field). Badge award/revoke stays on **users**.
6. **Search** is explore/export only (`GET /search`, optional tag search). Federated index write/delete is out of v1.
7. **Bulk native APIs** are roles/badges only (chunked at 100 ids).
8. **`scope=read write`** is required for `/v2`.
9. Community list endpoints cap **pageSize at 100**. Search allows up to **200**.

Official API docs: [https://api2-eu-west-1.insided.com/docs/community/](https://api2-eu-west-1.insided.com/docs/community/)

## Troubleshooting

| Symptom | What to try |
| ------- | ----------- |
| HTTP 401 / missing scope | Confirm `.env.{profile}` credentials and that the token request includes `scope=read write`. Run `pnpm gs --auth-check`. |
| HTTP 429 | Drop `--concurrency` (3 → 2 → 1). Failed delete rows are **not** auto-retried; follow the results CSV. |
| Topic export stops at 10,000 / HTTP 422 | Narrow filters or shard by category/date. See [filter sharding](docs/FILTER_SHARDING.md). |
| HTTP 422 on writes | Check required CSV columns in [operations](docs/OPERATIONS.md). Empty cells are omitted. |
| `Operation cancelled by operator` | Typed confirm is case-sensitive (`users` or `DELETE`, not `Users`). |
| Explore from flags | `--op explore` is interactive. Run `pnpm gs` or use `--op export`. |
| Bulk not offered in the wizard | That resource is explore/export only (search, topics, categories). |

Debug API calls with `GS_DEBUG=1` or `DEBUG=gainsight` (tokens and client secrets are redacted).

## Repository layout

```
src/index.ts                 CLI entry
src/cli.ts                   Flag parsing and dispatch
src/lib/config/              Named sandbox/prod profiles
src/lib/apiClient.ts         Typed HTTP client, pagination, family APIs
src/lib/retry.ts             429/5xx backoff, delete-no-retry, concurrency limiter
src/lib/safety.ts            Typed confirmation for trash/erase/permanent delete
src/lib/audit.ts             Append-only logs/jobs.jsonl
src/lib/csv.ts               Streaming CSV reader/writer, column mapping, flatten
src/lib/identityResolver.ts  User id/email resolution with per-job cache
src/generated/               OpenAPI types (pnpm generate:api)
src/adapters/                Resource adapters
src/commands/                export, bulk, and interactive wizard
src/wizard/                  Wizard helpers and @clack/prompts UI
docs/prd/prd.md              Product requirements
docs/api/                    OpenAPI specs + Postman collection
docs/CSV_IDENTITY.md         Identity resolution
docs/OPERATIONS.md           Per-resource operations
docs/FILTER_SHARDING.md      Topic 10k cap workarounds
```

## Development

```bash
pnpm install
pnpm gs --help
pnpm test
pnpm typecheck
pnpm generate:api   # regenerate src/generated from docs/api/*.json
```

Copy `.env.sandbox.example` to `.env.sandbox` and fill in OAuth client credentials from Gainsight CC admin. Optionally copy `.env.prod.example` to `.env.prod`.

Stack: TypeScript (NodeNext, strict), `@clack/prompts`, dotenv, Vitest.
