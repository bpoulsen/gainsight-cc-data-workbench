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

import { registerAdapter } from "./registry.js";
import { UsersAdapter } from "./users.js";

registerAdapter("users", (client) => new UsersAdapter(client));
