# Gainsight CC Workbench

Terminal workbench for [Gainsight Customer Communities](https://www.gainsight.com/customer-communities/) (formerly inSided). It polyfills the Salesforce Workbench workflows operators used for Salesforce communities: **explore data, export CSV, and bulk CRUD from CSV** against the Gainsight CC API.

There is no web GUI in v1. Everything runs from the terminal via a wizard (and later, equivalent non-interactive flags).

**Status:** Specced, not implemented yet. Requirements live in [`docs/prd/prd.md`](docs/prd/prd.md). API specs are in [`docs/api/`](docs/api/).

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

Exact command names will land with the TypeScript CLI (Node 20+). Until then, use the Postman collection in `docs/api/` to call the API directly.

## Authentication and profiles

Auth is OAuth2 **client credentials**. Tokens last ~2 hours; the CLI will refresh them. A token **without** `scope=read write` will 401 on `/v2`.

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
- Empty cell = omit the field
- Unknown columns: warn and ignore
- **One named operation per job** (e.g. all rows are `editTags`). Multi-action rows are a later follow-up.

Every write job writes a results CSV (`{input}.results.csv` unless you pass `--results`) with `status`, `http_status`, `error`, `resolved_id`, `operation`, `profile`, and `timestamp`.

## Safety

| Rule                                  | Behavior                                                                                                                                  |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Dry-run                               | Optional (`--dry-run`). Resolves IDs, validates columns, prints planned calls. No writes.                                                 |
| Trash / permanent delete / user erase | Typed confirmation required before any request                                                                                            |
| Content delete default                | **Trash** (`toggleTrashed`), not permanent delete                                                                                         |
| User erase                            | Confirmed separately; it **anonymizes** content created by that user                                                                      |
| Retries                               | 429 / 5xx retried on non-delete ops only. **Deletes are never auto-retried** — failed rows stay in the results CSV for a manual follow-up |
| Concurrency                           | Conservative default (planned: 3). Do not hammer the API                                                                                  |

## API constraints operators will hit

1. **No generic CRUD.** Pick the action (`editTitle` vs `editTags` vs `toggleClosed`).
2. **10,000-topic cap** on unified list (`GET /v2/topics`). Broader exports need narrower filters or sharding by category/date.
3. **Articles are created as drafts** and published in a separate step.
4. **Bulk native APIs** are roles/badges only.
5. **`scope=read write`** is required for `/v2`.

Official API docs: [https://api2-eu-west-1.insided.com/docs/community/](https://api2-eu-west-1.insided.com/docs/community/)

## Repository layout

```
docs/prd/prd.md              Product requirements
docs/api/                    OpenAPI specs + Postman collection
docs/api/openapi.yaml        Auth overview
docs/resources/webhooks.md   Webhook events (not v1)
```

## Development

Not scaffolded yet. Planned stack from the PRD:

- Node.js 20+ and TypeScript
- Client generated or wrapped from `docs/api/*.json`
- Interactive wizard (`@clack/prompts` or equivalent)
- Streaming CSV I/O
- Vitest for identity resolution, CSV mapping, dry-run, and delete no-retry

Delivery is phased (P0–P7 in the PRD). P1–P4 are the Workbench polyfill; P5–P7 finish remaining actions (moderation, events, taxonomy writes, gamification).
