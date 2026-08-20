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
