# CSV identity

Bulk jobs identify each row, then call one named API action. This page is the identity contract. Column lists per action live in [OPERATIONS.md](OPERATIONS.md).

## Who uses `id` or `email`

These resources set `identity: id-or-email`. The job runner resolves every row **before** the write:

- **users** — all operations except `register` (register creates a new user)
- **gamification** — `assignPoints`

Accepted columns:

| Column | Meaning |
| ------ | ------- |
| `id` | Gainsight numeric userid (positive integer) |
| `userid` | Alias for `id` |
| `email` | Looked up via `GET /user/email/{email}` |

Resolution rules:

1. `id` / `userid` only → used as-is (must be a positive integer).
2. `email` only → resolved to userid. Distinct emails are prefetched once per job and cached in memory (case-insensitive).
3. Both `id` and `email` → email is still resolved. If it maps to a **different** userid, the row fails with a conflict error. The tool will not guess.
4. Neither → the row fails (`User row requires id or email`).
5. Unknown email → HTTP 404 / `User not found: {email}. Verify email address.`

The results CSV `resolved_id` column is the numeric userid used for the call. Audit logs never store emails or names.

Gamification `assignPoints` sends that userid as JSON `{ user, points }` to `POST /points/assign`. CSV `user` / `userId` are accepted as id aliases on the adapter, but email resolution still looks at `id` / `userid` / `email` only — prefer those headers.

## Who uses numeric `id` only

Everyone else (`identity: id`):

| Resource | Row identity |
| -------- | ------------ |
| questions, ideas, conversations, articles, product updates | Topic `id`. Replies may use `replyId`. |
| events | Event `id` (CSV `eventId` is accepted as an alias) |
| tags, moderatorTags, productAreas, ideaStatuses | Taxonomy `id` (some deletes accept a pipe-separated id list) |
| search / topics / categories | Explore/export only — no bulk identity |

Create operations that do not target an existing record (`register`, content `ask`/`submit`/`start`, event `create`) do not require an identity column.

## CSV conventions (all resources)

- UTF-8 with a header row. `--utf8-bom` adds a BOM for Excel.
- Empty cell → field omitted from the API body.
- Booleans: `true` / `false` (case-insensitive when coerced).
- Multi-value fields: pipe-separated (`tag-a|tag-b`). Commas are also accepted in some list filters.
- Nested objects on export: `JSON.stringify`.
- Unknown headers: warned and ignored; they do not fail the job.
- **One named `--op` per file.** Do not mix `editTitle` and `toggleTrashed` in the same job.

## Results CSV

Default path: `{input}.results.csv` (override with `--results`).

| Column | Meaning |
| ------ | ------- |
| `status` | `success`, `failed`, `skipped`, or `planned` (dry-run) |
| `http_status` | HTTP status or empty |
| `error` | Message; delete-like failures are prefixed `DELETE_FAILED:` |
| `resolved_id` | Numeric id used for the call (userid after email lookup) |
| `operation` | Named action |
| `profile` | `sandbox` or `prod` |
| `timestamp` | ISO time |

Dry-run writes `status=planned` and does not call write endpoints.

## Examples

User erase by email:

```csv
email
ops@example.com
mod@example.com
```

```bash
pnpm gs --profile sandbox --resource users --op erase --csv erase.csv --dry-run
```

Content tag replace by topic id:

```csv
id,tags,authorId
101,csv|export,7
```

```bash
pnpm gs --profile sandbox --resource questions --op editTags --csv tags.csv --dry-run
```

Assign points by email:

```csv
email,points
ops@example.com,20
```

```bash
pnpm gs --profile sandbox --resource gamification --op assignPoints --csv points.csv --dry-run
```
