# Filter sharding (topic 10,000 cap)

Unified topic list is `GET /v2/topics`. Gainsight returns at most the **first 10,000** matches. Asking for a page past that cap is HTTP **422**. The CLI stops, sets `hitCap` on the export, and prints:

> Topic list is capped at the first 10,000 matches. Narrow filters (category, content type, date, tags) or shard the export.

Community list `pageSize` is capped at **100**, so 100 pages × 100 rows = the cap.

This cap applies to `--resource topics` **and** to `questions` / `ideas` / `conversations` / `articles` / `productUpdates`. Those resources still list through `/v2/topics`; they only add `contentTypes[]` for you.

It does **not** apply to users, events, taxonomy, gamification, or search. Search (`GET /search`) is a relevance query, not a full dump — do not use it as a 10k workaround unless you only need hits for a term.

## Prefer the wizard, or `--shard-by`

Scripted `--op export` without `--shard-by` still sends **empty filters** (unfiltered pagination until exhausted or capped).

To shard automatically:

```bash
pnpm gs --profile sandbox --resource topics --op export --out topics.csv --shard-by contentType
pnpm gs --profile sandbox --resource questions --op export --out questions.csv --shard-by category
pnpm gs --profile sandbox --resource topics --op export --out topics.csv --shard-by date \
  --created-from 2025-01-01 --created-to 2026-08-20
pnpm gs --profile sandbox --resource topics --op export --out topics.csv --shard-by category --shard-separate
```

`--shard-by contentType` is only valid for unified **topics** (typed resources already filter `contentTypes[]`). Date sharding requires `--created-from` and `--created-to` (`YYYY-MM-DD`). Default layout is one merged CSV; `--shard-separate` writes `topics.question.csv`, `topics.cat-6.csv`, etc.

The wizard offers auto-shard after a 10k cap (explore or export) on topic resources. You pick strategy, date window (if needed), and merge vs separate files.

A shard that still hits 10,000 is reported as `HIT_CAP` and the job continues with the other shards. Split that shard further (category × month). Failed shards are listed in the summary; other shards still run.

## How to shard a large topic export

Split the community so each query stays under 10,000 rows. Typical shards:

1. **Content type** — export `questions`, then `ideas`, then `articles`, rather than unified `topics`.
2. **Category** — pipe-separated `categoryIds[]` (one category or a small set per file).
3. **Created date** — `createdAt[from]` / `createdAt[to]` in windows (month or quarter).
4. **Last activity** — `lastActivityAt[from]` / `lastActivityAt[to]` if recency is the cut.
5. **Tags** — public `tags` or `moderatorTags` when the set is naturally small.

After each shard, check the row count. If a shard still hits 10,000, split it further (narrower dates, or category × type).

### Example plan

A community with ~40k questions across 8 categories:

1. `--resource questions` (already excludes other types).
2. For each category id, export with that `categoryIds[]`.
3. If one category still caps, add quarterly `createdAt` windows.

Name files so you can concatenate later (`questions-cat-6-2025-q1.csv`, …). Do not assume concatenating shards is a complete census if any file hit the cap.

## Detecting a cap

- Wizard: warning text, then an offer to auto-shard.
- Scripted export: still writes the file and exits 0; the 10k hint is printed to stderr when `hitCap` is set. Re-run with `--shard-by`.
- HTTP 422 body mentioning 10,000 / 10000.

Re-run with narrower filters. Do not raise `--concurrency` to “get more rows” — the cap is a result window, not a rate limit.

## Related limits

| API | Limit |
| --- | ----- |
| `GET /v2/topics` | First 10,000 matches (422 beyond) |
| Community `/v2` lists | `pageSize` max 100 |
| Search | `pageSize` 1–200; not a full catalog |
| User native bulk roles/badges | Chunks of 100 ids |
| Events | No 10k topic cap; no category filter |

Taxonomy category **tree** export (`tree=true` + `authorId`) is a different endpoint and is not the topic cap.
