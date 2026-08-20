# Gainsight CC Workbench

Terminal workbench for [Gainsight Customer Communities](https://www.gainsight.com/customer-communities/) (formerly inSided). It polyfills the Salesforce Workbench workflows operators used for Salesforce communities: **explore data, export CSV, and bulk CRUD from CSV** against the Gainsight CC API.

There is no web GUI in v1. Everything runs from the terminal via a wizard (and later, equivalent non-interactive flags).

**Status:** CLI skeleton in progress. Requirements live in [`docs/prd/prd.md`](docs/prd/prd.md). API specs are in [`docs/api/`](docs/api/).

## Why this exists

Gainsight CC has a REST API but no Workbench-style tool. The API is also not Salesforce-like:

- No SOQL / generic query language
- No generic PATCH across objects — writes are **named actions** (`editTitle`, `editTags`, `toggleTrashed`, `move`, …)
- Native bulk endpoints exist **only** for user roles and badges; every other bulk job is a CSV row loop
- Unified topic listing is capped at the **first 10,000** matches
- User erase **anonymizes** that user’s content

This CLI wraps those APIs with the same operator loop: filter → preview → CSV → bulk apply, with an audit file for every write.

## What v1 covers

| Mode                          | What it does                                                         |
| ----------------------------- | -------------------------------------------------------------------- |
| Explore                       | Interactive filters per resource, paged results in the terminal      |
| Export                        | Same query, written to CSV                                           |
| Bulk create / update / delete | Loop a CSV; one named operation per job                              |
| Native user bulk              | Roles and badges go through `/user/bulk/role` and `/user/bulk/badge` |

**Resources:** users, questions, ideas, conversations, articles, product updates, events, taxonomy (categories, tags, moderator tags, product areas), gamification. Search is explore/export only. Federated search writes and webhook management are out of v1.

This is **not** the Salesforce → Gainsight migration ETL. It operates on Gainsight CC after (or alongside) that work.

## Planned usage

```bash
# Interactive wizard (default profile is sandbox when both exist)
pnpm gs --profile sandbox
pnpm gs --profile prod

# Scripted (every wizard path will have flags)
pnpm gs --profile sandbox --resource users --op export --out users.csv
pnpm gs --profile prod --resource questions --op editTags --csv tags.csv --dry-run
```

Use the Postman collection in `docs/api/` if you need to call the API before a given command is implemented.

## Authentication and profiles

Auth is OAuth2 **client credentials**. Tokens last ~2 hours; the CLI caches them in memory and refreshes 60s before expiry. A token **without** `scope=read write` will 401 on `/v2`.

```bash
pnpm gs --auth-check --profile sandbox
pnpm gs --auth-check --profile prod
```

`--auth-check` reports token lifetime only. It never prints the access token or client secret.

Named profiles **prod** and **sandbox** share the same API host; only credentials differ.

```bash
# .env.sandbox / .env.prod (gitignored — never commit secrets)
GAINSIGHT_BASE_URL=https://api2-eu-west-1.insided.com
GAINSIGHT_CLIENT_ID=
GAINSIGHT_CLIENT_SECRET=
```

Create client credentials in Gainsight CC admin. `--profile prod` on a write job will print a visible banner.

Do not log or print client secrets or access tokens.

## CSV identity and conventions

| Resource                                  | Identify rows by                                                |
| ----------------------------------------- | --------------------------------------------------------------- |
| Users                                     | `id` **or** `email` (email is resolved to userid before mutate) |
| Topics, replies, events, taxonomy, badges | Gainsight numeric `id` (`replyId` when the endpoint needs it)   |

If a user row has both `id` and `email` and they resolve to different people, that row **fails** — the tool will not guess.

- UTF-8, header row required
- Booleans: `true` / `false`
- Multi-value fields (tags, roles, product areas): pipe-separated (`tag-a|tag-b`)
- Nested objects (and arrays of objects) on export: JSON.stringify
- Exports always include `id`; user exports also include `email`
- Empty cell = omit the field
- Unknown columns: warn and ignore
- **One named operation per job** (e.g. all rows are `editTags`). Multi-action rows are a later follow-up.
- `--utf8-bom` prefixes export files with a UTF-8 BOM for Excel

Every write job writes a results CSV (`{input}.results.csv` unless you pass `--results`) with `status`, `http_status`, `error`, `resolved_id`, `operation`, `profile`, and `timestamp`.

## Safety

| Rule                                  | Behavior                                                                                                                                  |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Dry-run                               | Optional (`--dry-run`). Resolves IDs, validates columns, prints planned calls. No writes.                                                 |
| Trash / permanent delete / user erase | Typed confirmation required before any request                                                                                            |
| Content delete default                | **Trash** (`toggleTrashed`), not permanent delete                                                                                         |
| User erase                            | Confirmed separately; it **anonymizes** content created by that user                                                                      |
| Retries                               | 429 / 5xx retried up to **3 attempts** on non-delete ops. Backoff starts at 1s, doubles, caps at 60s, ±20% jitter. `Retry-After` is honored (also capped at 60s). **Deletes / trash / erase are never auto-retried** — failed rows stay in the results CSV for a manual follow-up |
| Concurrency                           | Default **3** parallel API requests (`--concurrency 1-20`). If you still see 429s, lower concurrency rather than raising it |

## API constraints operators will hit

1. **No generic CRUD.** Pick the action (`editTitle` vs `editTags` vs `toggleClosed`).
2. **10,000-topic cap** on unified list (`GET /v2/topics`). Broader exports need narrower filters or sharding by category/date.
3. **Articles are created as drafts** and published in a separate step.
4. **Bulk native APIs** are roles/badges only.
5. **`scope=read write`** is required for `/v2`.

Official API docs: [https://api2-eu-west-1.insided.com/docs/community/](https://api2-eu-west-1.insided.com/docs/community/)

## Repository layout

```
src/index.ts                 CLI entry
src/cli.ts                   Flag parsing and dispatch
src/lib/config/              Named sandbox/prod profiles
src/lib/apiClient.ts         Typed HTTP client, pagination, family APIs
src/lib/retry.ts             429/5xx backoff, delete-no-retry, concurrency limiter
src/lib/csv.ts               Streaming CSV reader/writer, column mapping, flatten
src/lib/identityResolver.ts  User id/email resolution with per-job cache
src/generated/               OpenAPI types (pnpm generate:api)
src/adapters/                Resource adapter contract + registry (users implemented)
src/commands/                export (users); explore/bulk later
src/wizard/                  Interactive menus (later tasks)
docs/prd/prd.md              Product requirements
docs/api/                    OpenAPI specs + Postman collection
```

## Development

Requires Node.js 20+ and pnpm.

```bash
pnpm install
pnpm gs --help
pnpm test
pnpm generate:api   # regenerate src/generated from docs/api/*.json
```

Copy `.env.sandbox.example` to `.env.sandbox` and fill in OAuth client credentials from Gainsight CC admin. Optionally copy `.env.prod.example` to `.env.prod`.

Stack: TypeScript (NodeNext, strict), `@clack/prompts`, dotenv, Vitest. CSV runner and wizard land in later tasks.

Debug API calls with `GS_DEBUG=1` or `DEBUG=gainsight` (tokens and client secrets are redacted).
