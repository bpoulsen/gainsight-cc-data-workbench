# Operations reference

Paths below are **family-relative**. The client prefixes community and events with `/v2`; users, gamification, and search are unprefixed.

Every bulk job is **one named `--op`**. Required columns are in addition to identity (`id` / `email` for users and gamification; `id` otherwise) except where noted. See [CSV identity](CSV_IDENTITY.md).

Aliases: `user` → users, `question` → questions, `event` → events, `leaderboard` / `points` → gamification, `product-updates` → productUpdates, `moderator-tags` → moderatorTags, `product-areas` → productAreas, `idea-statuses` → ideaStatuses.

## Users (`--resource users`)

Explore/export: `GET /user` with role, badge, userid, join-date, and last-activity filters.

| `--op` | Required CSV columns | Notes |
| ------ | -------------------- | ----- |
| `register` | `email`, `username`, `password` | Optional `user_role`, `profile_field`. No identity column. |
| `updateField` | `field`, `value` | `field` must be a User API field (`email`, `username`, `avatar`, SSO ids, …). |
| `updateProfileField` | `field`, `value` | |
| `deleteProfileField` | `field` | |
| `addRole` / `removeRole` | `role` | Optional `roleName` / `user_role`. |
| `awardBadge` / `revokeBadge` | `badgeId` | |
| `erase` | identity only | Typed confirm. **Anonymizes** that user’s content. Never auto-retried. |
| `bulkAddRoles` / `bulkRemoveRoles` | `roleIds` | Native `POST\|DELETE /user/bulk/role`. Pipe-separated ids; chunked at 100. |
| `bulkAwardBadges` / `bulkRevokeBadges` | `badgeIds` | Native `/user/bulk/badge`. Same chunking. |

## Content (`topics`, `questions`, `ideas`, `conversations`, `articles`, `productUpdates`)

List/export always uses `GET /v2/topics` (10,000-result cap). `--resource questions` (etc.) adds `contentTypes[]` automatically. **`topics` is explore/export only.**

Creates (no existing `id`):

| Resource | `--op` | Required | Notes |
| -------- | ------ | -------- | ----- |
| questions | `ask` | `title`, `content`, `categoryId`, `authorId` | |
| ideas | `submit` | `title`, `content`, `authorId` | Category optional |
| conversations | `start` | `title`, `content`, `categoryId`, `authorId` | |
| articles | `createArticle` | `title`, `content`, `categoryId`, `authorId` | Created as **draft** |
| productUpdates | `createProductUpdate` | `title`, `content`, `authorId` | Created as **draft** |

Shared writes (topic `id` plus columns below). Not every op exists on every type (spam, idea status, product areas, publish, convert):

| `--op` | Required | Notes |
| ------ | -------- | ----- |
| `createReply` | `content`, `authorId` | |
| `editTitle` | `title`, `moderatorId` | |
| `editContent` | `content`, `authorId` | |
| `editTags` / `addTags` / `removeTags` | `tags`, `authorId` | Pipe-separated names |
| `editModeratorTags` | `moderatorTags`, `moderatorId` | |
| `addModeratorTags` / `removeModeratorTags` | `tags`, `moderatorId` | |
| `move` | `categoryId`, `moderatorId` | |
| `toggleClosed` | `closed`, `moderatorId` | `true` / `false` |
| `toggleSticky` | `sticky`, `moderatorId` | |
| `toggleTrashed` | `trashed`, `moderatorId` | Typed confirm; never auto-retried |
| `permanentDelete` | `moderatorId` | Typed confirm; never auto-retried |
| `toggleSpam` | `spam`, `moderatorId` | Optional `banUser` |
| `assignIdeaStatus` | `ideaStatusId`, `moderatorId` | Ideas only |
| `assignProductAreas` | `productAreas`, `moderatorId` | Ideas / product updates |
| `changeAuthor` | `authorId`, `moderatorId` | Articles / product updates |
| `publish` | `moderatorId` | Articles / product updates |
| `convertType` | `targetType`, `moderatorId` | Allowed targets depend on current type |

## Taxonomy

**Categories** — explore/export only (`GET /v2/categories`, or `tree=true` + `authorId` for `GET /v2/category/getTree`, flattened with `parent_id`). No create/update/delete in the API.

| Resource | `--op` | Required | Notes |
| -------- | ------ | -------- | ----- |
| tags | `create` | `name`, `authorId` | `POST /tags/create` |
| tags | `rename` | `id`, `name`, `moderatorId` | |
| tags | `delete` | `id`, `moderatorId` | Typed confirm |
| tags | `merge` | `name`, `ids`, `moderatorId` | `ids` pipe-separated |
| moderatorTags | `delete` | `id`, `moderatorId` | Typed confirm. **No create endpoint.** Pipe-separated ids allowed. |
| productAreas | `create` | `name`, `authorId` | Optional `parentId` |
| productAreas | `rename` | `id`, `name`, `moderatorId` | |
| productAreas | `delete` | `id`, `moderatorId` | Typed confirm |
| ideaStatuses | `create` | `name`, `authorId` | Optional colors, `type`, `visible`, `default` |
| ideaStatuses | `edit` | `id`, `name`, `moderatorId` | |
| ideaStatuses | `changeType` | `id`, `type`, `moderatorId` | |
| ideaStatuses | `reorder` | `order`, `moderatorId` | Pipe-separated status ids |
| ideaStatuses | `delete` | `id`, `moderatorId` | Typed confirm |

## Events (`--resource events`)

Explore: `GET /v2/events` (`class`, `moderatorId`, `type[]`, `in`, `order`). Set `attendeesOf` to list attendees (`userId`, `signedUpAt` — no email). There is **no** event category and **no** permanent-delete endpoint.

CSV `startDate` / `endDate` map to write bodies `startsAt` / `endsAt`.

| `--op` | Required | Notes |
| ------ | -------- | ----- |
| `create` | `title`, `content`, `startsAt`, `endsAt`, `timezone`, `moderatorId` | Publishes immediately |
| `createDraft` | `title`, `content`, `moderatorId` | Dates optional |
| `publish` | `moderatorId` | |
| `editTitle` / `editContent` / `editLocation` / `editImage` | field + `moderatorId` | |
| `editUrl` | `url`, `moderatorId` | Optional `urlLabel` |
| `editExternalRegistrationUrl` | both URL fields + `moderatorId` | |
| `changeType` | `eventTypeName`, `moderatorId` | `type` alias |
| `changeVisibility` | `moderatorId` | Omit `userGroupId` for public |
| `changeSignUpConfirmationMessage` | `message`, `moderatorId` | |
| `changeFeaturedTopics` | `featuredTopics`, `moderatorId` | JSON array |
| `reschedule` | `startsAt`, `endsAt`, `timezone`, `moderatorId` | |
| `toggleTrashed` | `trashed`, `moderatorId` | Typed confirm |
| `signup` / `cancelSignUp` | `authorId` | Side-effecting for the member. `userId` alias. `POST` (not DELETE). |

## Gamification (`--resource gamification`)

Explore: all-time `GET /leaderboard`, or `period=weekly` → `/leaderboard/weekly`. Set `userId[]` to use `GET /points` (optional `earnedAt[from]` / `[to]`; that list is **not** paginated).

Leaderboard rows have `userId`, `points`, `name`, `leaderboardPosition`, `avatar`, and `rank` (**rank is an icon URL**, not a number). No email or badges on this API.

| `--op` | Required | Notes |
| ------ | -------- | ----- |
| `assignPoints` | `points` | `POST /points/assign` `{ user, points }`. Identity is `id` or `email`. **No reason field.** |

Badge award/revoke is on **users**, not gamification.

## Search (`--resource search`)

Explore/export only. Content search: `GET /search` (**`q` required**). Tag search: `searchTags=true` → `GET /search/tags`. Federated `/external-content/*` writes are out of v1. There is no get-by-id.

The wizard hides Bulk when a resource has no write operations (search, topics, categories).
