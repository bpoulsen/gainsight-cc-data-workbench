import type { ApiClient } from "../lib/apiClient.js";
import {
  AdapterError,
  RESOURCE_NAMES,
  resolveResourceName,
  type IResourceAdapter,
  type ResourceName,
} from "./base.js";

export type AdapterFactory = (client: ApiClient) => IResourceAdapter;

const registry = new Map<ResourceName, AdapterFactory>();

export function registerAdapter(name: ResourceName, factory: AdapterFactory): void {
  registry.set(name, factory);
}

export function registeredAdapters(): ResourceName[] {
  return [...registry.keys()];
}

export function getAdapter(resource: string, client: ApiClient): IResourceAdapter {
  const name = resolveResourceName(resource);
  const factory = registry.get(name);
  if (!factory) {
    const implemented = registeredAdapters();
    const available = implemented.length > 0 ? implemented.join(", ") : "none yet";
    throw new AdapterError(
      `Resource "${name}" is not implemented yet. Implemented: ${available}. Planned: ${RESOURCE_NAMES.join(", ")}`,
    );
  }
  return factory(client);
}
