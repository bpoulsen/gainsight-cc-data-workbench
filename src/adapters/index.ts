export {
  AdapterError,
  BaseAdapter,
  RESOURCE_NAMES,
  isResourceName,
  resolveResourceName,
} from "./base.js";
export type {
  ApiCallPlan,
  ExportField,
  FilterPrompt,
  FromCsvRowContext,
  HttpMethod,
  IResourceAdapter,
  IdentityMode,
  ListPage,
  NormalizedRecord,
  OperationKind,
  PageRequest,
  ResourceName,
  ResourceOperation,
} from "./base.js";
export { getAdapter, registerAdapter, registeredAdapters } from "./registry.js";
export type { AdapterFactory } from "./registry.js";
export { UsersAdapter, USER_BULK_CHUNK_SIZE, USER_FIND_FIELDS, USER_UPDATE_FIELDS } from "./users.js";
export {
  ContentAdapter,
  COMMUNITY_MAX_PAGE_SIZE,
  CONTENT_RESOURCES,
  TOPIC_CAP_HINT,
  TOPIC_LIST_CAP,
  isTopicCapError,
} from "./content.js";
export {
  TaxonomyAdapter,
  TAXONOMY_RESOURCES,
  flattenCategoryTree,
  isTaxonomyResourceName,
  normalizeTaxonomyRecord,
} from "./taxonomy.js";
export { EventsAdapter, normalizeAttendee, normalizeEvent } from "./events.js";
export { GamificationAdapter, normalizeLeaderboardUser, normalizeUserPoints } from "./gamification.js";
export { SearchAdapter, SEARCH_MAX_PAGE_SIZE, normalizeSearchHit, normalizeTagHit } from "./search.js";

import { registerAdapter } from "./registry.js";
import { ContentAdapter, CONTENT_RESOURCES } from "./content.js";
import { EventsAdapter } from "./events.js";
import { GamificationAdapter } from "./gamification.js";
import { SearchAdapter } from "./search.js";
import { TaxonomyAdapter, TAXONOMY_RESOURCES } from "./taxonomy.js";
import { UsersAdapter } from "./users.js";

registerAdapter("users", (client) => new UsersAdapter(client));
for (const resource of CONTENT_RESOURCES) {
  registerAdapter(resource, (client) => new ContentAdapter(client, resource));
}
for (const resource of TAXONOMY_RESOURCES) {
  registerAdapter(resource, (client) => new TaxonomyAdapter(client, resource));
}
registerAdapter("events", (client) => new EventsAdapter(client));
registerAdapter("gamification", (client) => new GamificationAdapter(client));
registerAdapter("search", (client) => new SearchAdapter(client));
