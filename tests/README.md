# Tests

Unit tests live next to the code they cover (`src/**/*.test.ts`). This folder holds **fixtures**, **OpenAPI contract tests**, and **sandbox integration tests**.

HTTP is mocked with an in-memory `fetch` (see `tests/unit/http.ts` and the helpers in `src/**/*.test.ts`). There is no nock/msw dependency.

## Layout

```
src/**/*.test.ts              Unit tests (identity, CSV, job runner, retry, adapters, wizard)
src/lib/fixtures/             Redacted API response recordings used by adapter unit tests
tests/fixtures/               OpenAPI example extracts (also redacted)
tests/unit/                   Contract tests: OpenAPI path/method coverage, fixture parsing
tests/integration/            Live sandbox tests (skipped unless opted in)
```

## Commands

```bash
pnpm test                 # unit + contract (default CI)
pnpm test:unit            # same as pnpm test
pnpm test:watch
pnpm test:coverage        # v8 coverage; core logic target is >80%
pnpm test:integration     # live sandbox; requires credentials
```

`pnpm test` never talks to Gainsight. It does not load `.env.sandbox` / `.env.prod`.

## Coverage

`pnpm test:coverage` measures auth, CSV, identity, retry, job runner, and adapters (generated OpenAPI types are excluded). The threshold is 80% statements / lines / functions.

## Integration (sandbox)

Read-only checks: acquire a token, list a page of users, write a small export CSV.

```bash
# .env.sandbox must exist with real OAuth client credentials (never commit it)
RUN_INTEGRATION=1 pnpm test:integration
```

Write scenarios (register user, edit tags, trash/untrash, erase, bulk job + results CSV) are **not run in CI**. They mutate the community. Do them manually against sandbox:

1. `pnpm gs --profile sandbox --auth-check`
2. Export users: `pnpm gs --profile sandbox --resource users --op export --out /tmp/users.csv`
3. Dry-run a bulk edit, then a live job; confirm `{input}.results.csv`
4. Create a sandbox question, `editTags`, `toggleTrashed` true, then false
5. Register a disposable user, `updateField`, then `erase` (typed confirm)

Set `RUN_INTEGRATION_WRITE=1` only if you add live write assertions later. Default CI must stay read-only.

## Fixtures

Recorded JSON in `src/lib/fixtures/` is synthetic/redacted (example.com emails, placeholder tokens). When adding a fixture from a live response:

- Replace emails/usernames that are not already public test data
- Replace `access_token` / client secrets with `[redacted-…]`
- Keep field shapes so adapters can still parse them
