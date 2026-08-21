# Gainsight CC Workbench — Product Requirements Document

**Status:** Draft  
**Date:** 2026-08-20  
**Audience:** Internal community ops / admins migrating from Salesforce Community Cloud + Salesforce Workbench  
**Primary interface (v1):** Terminal CLI with wizard menus. No web GUI.

---

## 1. Problem

The community is moving from Salesforce to Gainsight Customer Communities (CC, formerly inSided). On Salesforce, operators use **Salesforce Workbench** to:

- Explore objects with queries
- Export records to CSV
- Bulk create / update / delete records from CSV

Gainsight CC exposes a rich REST API (OAuth2 client credentials) but **does not provide an equivalent workbench**. The API is action-oriented rather than Salesforce-like:

- There is no SOQL / generic query language
- There is no generic PATCH/upsert across objects
- Mutations are per-action endpoints (`editTitle`, `editTags`, `toggleTrashed`, `move`, …)
- Native bulk endpoints exist **only** for user roles and badges
- Topic listing is hard-capped at the **first 10,000** matches (HTTP 422 beyond that)
- User erase **anonymizes** that user’s content

Operators still need to inspect live community data and perform bulk maintenance. This product polyfills Workbench against the Gainsight CC API.

---

## 2. Goals

1. Let operators **explore** Gainsight CC data from the terminal using the same filters the API supports.
2. **Export** any explored result set to CSV.
3. Perform **bulk create, update, and delete** by looping a CSV and calling the matching API per row.
4. Use **native bulk** user role/badge APIs when the job is roles or badges.
5. Make production writes **auditable and recoverable from failure**, without pretending the API has Salesforce-style transactions.

### Non-goals (v1)

- Web-based GUI
- Salesforce data migration / ETL (this tool operates on Gainsight after/during ops, not as the migration pipeline)
- Webhook subscription management as a first-class ops workflow (API exists; defer unless needed)
- Federated Search indexing (paid add-on; out of default v1 path)
- Real-time two-way sync with Salesforce
- CSV template generator (nice-to-have, not required for v1)

---

## 3. Users and environment

| Role | Needs |
| --- | --- |
| Community admin / moderator | Explore users and content, export lists, bulk-tag, move, trash, close, assign statuses |
| Ops / data steward | Bulk user field/role/badge updates, user erase, audit logs of writes |
| Engineer | Repeatable CLI, named profiles, gitignored secrets |

**Communities:** named profiles `prod` and `sandbox`.  
**API host:** the same base URL for both (Gainsight CC OAuth + REST). Credentials differ per profile.  
**Secrets:** OAuth `client_id` / `client_secret` in a gitignored `.env` (or `.env.prod` / `.env.sandbox`). Never commit tokens.

Reference host used in existing Postman collection: `https://api2-eu-west-1.insided.com`  
Auth: `POST /oauth2/token` with `grant_type=client_credentials` and **`scope=read write`** (a scopeless token 401s on `/v2`). Tokens last ~7200s; the CLI must refresh transparently.

---

## 4. Decisions (from scoping)

| Topic | Decision |
| --- | --- |
| v1 object coverage | **All** API object families: users, questions, ideas, conversations, articles, product updates, events, taxonomy (categories, tags, moderator tags, product areas), gamification |
| Operations | Explore, CSV export, bulk update, bulk create, bulk delete, native user bulk role/badge |
| Record identity | Gainsight **numeric IDs**; users may also be identified by **email** (resolve to `userid` before mutate) |
| Safety | Dry-run **optional** (flag). Typed confirmation **required** for delete / trash / permanent delete / user erase. Prod writes allowed. Every write job writes an **audit/results CSV**. **Never auto-retry deletes** |
| Runtime | No preference stated → **Node.js + TypeScript** (OpenAPI JSON already in-repo; typed client + wizard libraries) |
| UI | Terminal wizard only |
| Profiles | Named `prod` / `sandbox`; same endpoint; credentials in gitignored env files |

---

## 5. Runtime and architecture

### 5.1 Stack

- **Node.js 20+** and **TypeScript**
- HTTP client generated or wrapped from `docs/api/*.json` (community, user, events, gamification, search)
- Interactive wizard: `@clack/prompts` (or equivalent)
- CSV: streaming parser/writer (do not load unbounded files into memory)
- Config: dotenv + named profile
- Tests: Vitest (unit for CSV mapping, identity resolution, dry-run planner; contract tests against recorded fixtures)

The CLI ships as `npx` / `pnpm` script, e.g. `pnpm gs` or `gainsight-cc-data-workbench`.

### 5.2 Layering

```
Wizard (menus)  →  Commands (explore | export | bulk)
                         ↓
              Resource adapters (users, questions, ideas, …)
                         ↓
              Identity resolver  |  CSV I/O  |  Job runner (concurrency, backoff)
                         ↓
              Gainsight API client (OAuth, pagination, errors)
```

Each **resource adapter** implements a common contract:

- `list(filters, page)` → normalized records
- `get(id)` → single record
- `exportFields` → CSV columns
- `operations` → create / update-actions / delete-actions the wizard can offer
- `fromCsvRow(row, operation)` → API call plan
- `describeFilters()` → wizard prompts derived from OpenAPI query params

This is required because Gainsight has **no generic CRUD**. Update of “title” vs “tags” vs “closed” are different endpoints. The wizard asks **resource → operation → filters or CSV**, not “object + SOQL”.

### 5.3 Profiles

Example `.env.sandbox` / `.env.prod` (gitignored):

```
GAINSIGHT_BASE_URL=https://api2-eu-west-1.insided.com
GAINSIGHT_CLIENT_ID=...
GAINSIGHT_CLIENT_SECRET=...
```

CLI:

```
gs --profile sandbox
gs --profile prod
```

Default profile: `sandbox` if both exist, else the only configured profile. `--profile prod` on a write operation prints a visible banner.

---

## 6. Functional requirements

### 6.1 Authentication

- **FR-AUTH-1.** Obtain and cache OAuth access tokens per profile. Refresh before expiry.
- **FR-AUTH-2.** Fail fast with a clear message if `scope` is missing or token 401s.
- **FR-AUTH-3.** Never print client secret or access token to stdout/logs. Redact in audit files.

### 6.2 Explore (query)

- **FR-EX-1.** Wizard: select profile → resource → apply filters (skip = unfiltered list) → page through results in a terminal table.
- **FR-EX-2.** Filters must match API capabilities per resource (see §8). Do not invent SOQL.
- **FR-EX-3.** Auto-paginate until exhausted, user abort, or API cap.
- **FR-EX-4.** When topic/unified-content listing would exceed **10,000** matches, stop, warn, and suggest narrowing filters (category, content type, date, tags). Optionally support **filter sharding** (e.g. by category or date window) to export beyond 10k in multiple files.
- **FR-EX-5.** Single-record lookup by Gainsight ID; for users also by email (`GET /user/{field}/{value}`).
- **FR-EX-6.** Nested content: list replies for a parent topic; list attendees for an event.

### 6.3 Export to CSV

- **FR-CSV-1.** Any successful explore/list can be written to CSV.
- **FR-CSV-2.** Flatten nested JSON into stable columns (arrays as `|`-joined or JSON strings; document the convention).
- **FR-CSV-3.** Streaming write; support large user/content exports.
- **FR-CSV-4.** Include Gainsight IDs always. For users include `email` when present.
- **FR-CSV-5.** UTF-8 with BOM optional flag for Excel.

### 6.4 Bulk jobs from CSV

- **FR-BULK-1.** Wizard: resource → operation → input CSV path → optional dry-run → execute → write results CSV.
- **FR-BULK-2.** Identity columns:
  - Content/taxonomy/events/gamification: Gainsight numeric `id` (and `replyId` where needed).
  - Users: `id` **or** `email` (email resolved once per distinct address and cached for the job).
- **FR-BULK-3.** If both `id` and `email` are present and resolve to different users, **fail that row** (do not guess).
- **FR-BULK-4.** Column names map 1:1 to API body/path fields for the chosen operation. Unknown columns: warn and ignore.
- **FR-BULK-5.** Row-level isolation: one row failure does not abort the job unless `--fail-fast`.
- **FR-BULK-6.** Configurable concurrency (default conservative, e.g. 3) and retry **only** for 429 / 5xx on **non-delete** operations. Deletes/erase/permanent delete: **no retries**.
- **FR-BULK-7.** Dry-run (`--dry-run`): resolve identity, validate required columns, print planned HTTP method+path+body per row; **no writes**.
- **FR-BULK-8.** Live run writes `{input}.results.csv` (or `--results`) with original columns plus `status`, `http_status`, `error`, `resolved_id`, `operation`, `profile`, `timestamp`.
- **FR-BULK-9.** Native bulk: if operation is add/remove **roles** or **award/revoke badges** for many users, batch through `POST|DELETE /user/bulk/role` and `/user/bulk/badge` instead of per-user loops, respecting API payload shape (`userIds` + `roleIds` / `badgeIds`). Fall back to per-row if batch size must be chunked.
- **FR-BULK-10.** Create operations: CSV columns supply create payload (e.g. user register, `questions/ask`, `ideas/submit`, `conversations/start`, article/product-update create). Parent IDs for replies required.
- **FR-BULK-11.** Update operations are **named actions**, not a generic field dump. The wizard (or `--operation`) selects one action; CSV supplies IDs + fields that action needs. Examples: `editTitle`, `editContent`, `editTags`, `addTags`, `removeTags`, `move`, `assignIdeaStatus`, `toggleClosed`, `changeAuthor`.
- **FR-BULK-12.** Delete operations distinguish:
  - **Trash** (`toggleTrashed`) — default destructive path for content
  - **Permanent delete** — separate operation, extra confirmation
  - **User erase** — extra confirmation; warn that content is anonymized

### 6.5 Safety and confirmation

- **FR-SAFE-1.** `--dry-run` optional on all writes.
- **FR-SAFE-2.** Trash, permanent delete, and user erase require typing the resource name or `DELETE` (wizard) before sending any request.
- **FR-SAFE-3.** Prod profile banner on every write job (row count, operation, profile).
- **FR-SAFE-4.** Do not auto-retry delete/erase/permanent-delete rows (including after 429). Surface them as failed in the results CSV for a **manual** follow-up job.
- **FR-SAFE-5.** Default rate limiting / concurrency is conservative; document how to slow down if CC returns 429.

### 6.6 Logging

- **FR-LOG-1.** Local job log (timestamp, profile, operation, input file, result file, counts).
- **FR-LOG-2.** No PII beyond what the operator already put in the CSV, except resolved numeric IDs.

---

## 7. CSV contracts

### 7.1 Conventions

- UTF-8, comma-delimited, header row required.
- Boolean fields: `true` / `false`.
- Multi-value fields (tags, roles, product areas): pipe-separated (`tag-a|tag-b`) unless the operation expects a JSON array column.
- Empty cell = omit field (do not send empty string unless the API treats empty as clear).

### 7.2 Identity

| Resource | Required identity | Alternate |
| --- | --- | --- |
| User | `id` | `email` |
| Topic (question, idea, conversation, article, product update) | `id` | — |
| Reply | `id` or `replyId` (+ parent `id` if the endpoint needs both) | — |
| Category / tag / product area / idea status / event / badge | `id` | — |

### 7.3 Results CSV

Every bulk job appends:

| Column | Meaning |
| --- | --- |
| `status` | `success` \| `failed` \| `skipped` \| `planned` (dry-run) |
| `http_status` | Numeric or empty |
| `error` | API message or client validation |
| `resolved_id` | Numeric Gainsight id used |
| `operation` | Action name |
| `profile` | `prod` \| `sandbox` |
| `timestamp` | ISO-8601 |

---

## 8. Resource coverage (v1)

Explore + export for every resource that has a list/get API. Bulk create/update/delete where the API provides a write.

### 8.1 Users (`docs/api/user-api.json`)

| Capability | API |
| --- | --- |
| List / filter | `GET /user` (page, roles, badges, userid, join date, last activity) |
| Get | `GET /user/{id}` |
| Find | `GET /user/{field}/{value}` (email, username, oauth2_sso_id, …) |
| Create | `POST /user/register` |
| Update user field | `POST /user/{id}/{field}/{value}` |
| Profile fields | `POST /user/{id}/profile_field/{field}/{value}`, `DELETE …/profile_field/{field}` |
| Roles | add/revoke single; **native bulk** add/remove |
| Badges | award/revoke single; **native bulk** award/revoke |
| Delete | `DELETE /user/{id}/erase` (anonymizes content) |

**Out of default bulk path:** `remotelogout` (available as an explicit operation, not bundled with erase).

### 8.2 Unified content / taxonomy (`docs/api/community-api.json`)

Content types share a repeated action pattern. v1 must cover **questions, ideas, conversations, articles, product updates** including replies where endpoints exist.

**Read:** list, get by id, list replies, trashed lists, drafts (articles / product updates), idea statuses, categories, tags, moderator tags, product areas, category tree.

**Create:** ask question, submit idea, start conversation, create article (draft), create product update, create reply on each type, create tag / product area / idea status.

**Update (per-row actions):** title, content, public tags add/remove/replace, moderator tags add/remove/replace, move, close, sticky, spam, moderation label, assign/unassign moderator, author change (where API exists), idea status / product areas, convert-type, publish (articles / product updates).

**Delete:** toggle trash (parent and reply); permanent delete where API exists. Default operator path is **trash**, not permanent delete.

**Explore extra:** `GET /v2/topics` unified list with filters (`q`, category, content type, tags, dates, sort). Honor the 10,000-result cap.

### 8.3 Events (`docs/api/events-api.json`)

Explore/export events and attendees. Bulk create/update/trash/publish/reschedule and related field edits. Signup/cancel signup only if explicitly selected (side-effecting for members).

### 8.4 Gamification (`docs/api/gamification-api.json` + user badges)

Explore leaderboards and points. Bulk **assign points**. Badge CRUD stays on User API. Leaderboard is read/export only.

### 8.5 Search (`docs/api/search-api.json`)

Explore-only: `GET /search` as an alternate find-content path. Export hits to CSV. Federated index write/delete is **out of v1** unless later scoped.

---

## 9. Wizard UX (v1)

Non-interactive flags must exist for every wizard path so jobs can be scripted later (`--resource users --op export --out users.csv`).

Default flow:

1. Pick profile (`sandbox` / `prod`)
2. Pick resource
3. Pick mode: Explore / Export / Bulk create / Bulk update / Bulk delete
4. If explore/export: collect filters → preview count/page → optional save CSV
5. If bulk: pick operation (e.g. `editTags`) → CSV path → validate headers → optional dry-run → (confirm if destructive) → run → print summary + results path

Terminal output: progress (n/total), live fail count, final summary.

---

## 10. Non-functional requirements

| ID | Requirement |
| --- | --- |
| NFR-1 | Type-safe API layer from shipped OpenAPI JSON; do not hand-roll every path string in call sites |
| NFR-2 | Streaming CSV for files of at least 100k rows |
| NFR-3 | Handle 429 with Retry-After / exponential backoff (except delete/erase) |
| NFR-4 | Secrets only in gitignored env files; `.env*.example` committed with empty keys |
| NFR-5 | README: auth, profiles, 10k cap, trash vs erase, CSV identity rules, dry-run |
| NFR-6 | Unit tests for identity resolution, CSV mapping, delete no-retry, bulk role chunking |
| NFR-7 | Conservative default concurrency; no unbounded parallel storms against CC |

---

## 11. Success criteria

v1 is done when an operator can, from the terminal, against sandbox then prod:

1. Authenticate with named profiles stored in gitignored env files.
2. Explore and export **each** v1 resource family to CSV.
3. Bulk-update users by **id or email**, including profile fields and **native bulk** roles/badges.
4. Bulk-create and bulk-update content (at least: tags, title, move, close/trash) from CSV for questions, ideas, conversations, articles, and product updates.
5. Bulk-trash content and bulk-erase users with confirmation, results CSV, and **no automatic delete retries**.
6. Dry-run a write job and see planned calls without side effects.
7. Produce an audit/results CSV for every write job that ran (including partial failure).

---

## 12. Implementation phases

All objects are in v1 **scope**, but delivery is incremental so the tool is usable before every action exists.

| Phase | Deliverable |
| --- | --- |
| P0 | Repo, TS CLI skeleton, OAuth, profiles, error handling |
| P1 | Generic list/get/export + wizard filters for users + topics (questions/ideas/conversations/articles/product updates) + categories |
| P2 | Identity resolver (id, email), CSV runner, dry-run, results CSV, concurrency/429 |
| P3 | User writes: register, field/profile updates, erase (confirmed), native bulk roles/badges |
| P4 | Content writes: tag/title/content/move/close/trash for all five content types + replies |
| P5 | Remaining content actions (moderation, convert, polls, publish, author, idea status, product areas) |
| P6 | Events + attendees explore/export and core writes |
| P7 | Taxonomy writes (tags, moderator tags, product areas, idea statuses), gamification points, search explore |

P1–P4 are the Workbench polyfill. P5–P7 complete “all objects.”

---

## 13. API constraints the product must not hide

1. **No generic CRUD.** The wizard must name the action.
2. **10,000 topic cap** on unified list; exports of “everything” need filter sharding.
3. **User erase anonymizes content** — copy must say so at confirmation.
4. **Articles are created as drafts** and published separately.
5. **Bulk native APIs** are roles/badges only; other bulks are client-side loops.
6. **Scope `read write`** is required for `/v2`.

---

## 14. Documentation in this repo (inputs)

- `docs/api/openapi.yaml` — auth overview
- `docs/api/community-api.json`
- `docs/api/user-api.json`
- `docs/api/events-api.json`
- `docs/api/gamification-api.json`
- `docs/api/search-api.json`
- `docs/api/Gainsight CC API.postman_collection.json`
- `docs/resources/webhooks.md` (not v1)

---

## 15. Open items (do not block v1)

- Confirmed production vs sandbox **client ids** and whether they truly share one base URL (assumed yes).
- Typical community sizes (users, topics) for export-time estimates.
- Whether profile-field IDs should be cached from a local `ProfileFields.csv` (Postman collection mentions this).
- Exact 429 / rate-limit policy from Gainsight (implement backoff regardless).
- Whether operators need **update many fields in one CSV row** (would fan out to multiple API calls per row). v1 default is **one operation per job**; multi-action rows can be a follow-up.
