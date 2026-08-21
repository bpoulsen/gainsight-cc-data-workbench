/**
 * Events adapter: explore/export events and attendees, plus named write actions.
 *
 * Family client prefixes /v2. Events have no category and no permanent-delete
 * endpoint — trash is POST /events/{id}/toggleTrashed. Signup/cancelSignUp are
 * side-effecting for members (POST with authorId).
 */
import { DEFAULT_PAGE_SIZE } from "../lib/api/pagination.js";
import type { QueryParams } from "../lib/auth.js";
import type { RequestExtras } from "../lib/apiClient.js";
import { COMMUNITY_MAX_PAGE_SIZE, pipeList } from "./content.js";
import { invalidField } from "../lib/errors.js";
import {
  AdapterError,
  BaseAdapter,
  type ApiCallPlan,
  type ExportField,
  type FilterPrompt,
  type FromCsvRowContext,
  type ListPage,
  type PageRequest,
  type ResourceOperation,
} from "./base.js";

const ATTENDEES_FILTER = "attendeesOf";

function extrasOf(signal?: AbortSignal): RequestExtras {
  const extras: RequestExtras = {};
  if (signal !== undefined) {
    extras.signal = signal;
  }
  return extras;
}

function asBoolean(value: unknown, field: string): boolean {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") {
      return true;
    }
    if (normalized === "false") {
      return false;
    }
  }
  throw new AdapterError(invalidField(field, "boolean", value));
}

function optionalString(row: Record<string, unknown>, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = row[key];
    if (value !== undefined && value !== "") {
      return String(value);
    }
  }
  return undefined;
}

function requireString(row: Record<string, unknown>, field: string, aliases: string[] = []): string {
  const value = optionalString(row, field, ...aliases);
  if (value === undefined) {
    throw new AdapterError(`Operation requires ${field}`);
  }
  return value;
}

function parseJson(value: unknown, field: string): unknown {
  if (value === undefined || value === "") {
    return undefined;
  }
  if (typeof value === "object") {
    return value;
  }
  try {
    return JSON.parse(String(value)) as unknown;
  } catch {
    throw new AdapterError(invalidField(field, "json", value));
  }
}

function applyAliases(row: Record<string, unknown>, operation: string): Record<string, unknown> {
  const next = { ...row };
  if (next.startsAt === undefined && next.startDate !== undefined) {
    next.startsAt = next.startDate;
  }
  if (next.endsAt === undefined && next.endDate !== undefined) {
    next.endsAt = next.endDate;
  }
  if (
    (operation === "signup" || operation === "cancelSignUp") &&
    next.authorId === undefined &&
    next.userId !== undefined
  ) {
    next.authorId = next.userId;
  }
  if (operation === "changeType" && next.eventTypeName === undefined && next.type !== undefined) {
    next.eventTypeName = next.type;
  }
  return next;
}

export function normalizeEvent(data: unknown): Record<string, unknown> {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new AdapterError("Expected an event object from the API");
  }
  const raw = data as Record<string, unknown>;
  const inner =
    raw.result && typeof raw.result === "object" && !Array.isArray(raw.result)
      ? (raw.result as Record<string, unknown>)
      : raw;
  const startDate = inner.startDate ?? inner.startsAt;
  const endDate = inner.endDate ?? inner.endsAt;
  return {
    ...inner,
    id: inner.id,
    title: inner.title,
    content: inner.content,
    location: inner.location,
    startDate,
    endDate,
    startsAt: startDate,
    endsAt: endDate,
    timezone: inner.timezone,
    type: inner.type,
    trashed: inner.trashed,
    url: inner.url,
    image: inner.image,
    createdAt: inner.createdAt,
    createdBy: inner.createdBy,
    userGroupId: inner.userGroupId,
    eventId: inner.id,
  };
}

export function normalizeAttendee(data: unknown): Record<string, unknown> {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new AdapterError("Expected an attendee object from the API");
  }
  const raw = data as Record<string, unknown>;
  const userId = raw.userId ?? raw.id;
  return {
    id: userId,
    eventId: raw.eventId,
    userId,
    signedUpAt: raw.signedUpAt ?? raw.signupDate,
  };
}

export class EventsAdapter extends BaseAdapter {
  readonly name = "events" as const;
  readonly label = "Events";
  readonly family = "events" as const;
  readonly identity = "id" as const;

  async list(filters: QueryParams, page: PageRequest): Promise<ListPage> {
    const attendeesOf = optionalString(filters as Record<string, unknown>, ATTENDEES_FILTER);
    if (attendeesOf !== undefined) {
      return this.listAttendees(attendeesOf, page);
    }
    const pageSize = Math.min(page.pageSize ?? DEFAULT_PAGE_SIZE, COMMUNITY_MAX_PAGE_SIZE);
    const query: QueryParams = { page: page.page, pageSize };
    const classFilter = optionalString(filters as Record<string, unknown>, "class", "filter");
    if (classFilter !== undefined) {
      query.class = classFilter;
    }
    const moderatorId = optionalString(filters as Record<string, unknown>, "moderatorId");
    if (moderatorId !== undefined) {
      query.moderatorId = moderatorId;
    }
    const order = optionalString(filters as Record<string, unknown>, "order");
    if (order !== undefined) {
      query.order = order;
    }
    const ids = optionalString(filters as Record<string, unknown>, "in", "filters[in]");
    if (ids !== undefined) {
      query["filters[in]"] = ids;
    }
    const types = pipeList(filters["type[]"] ?? filters["filters[type][]"] ?? filters.type);
    if (types.length > 0) {
      query["filters[type][]"] = types;
    }
    const response = await this.familyClient().get("/events", query, extrasOf(page.signal));
    const records = this.itemsFrom(response.data).map((item) => normalizeEvent(item));
    return this.toListPage(records, page.page, pageSize);
  }

  async get(id: string | number, signal?: AbortSignal) {
    const response = await this.familyClient().get(
      `/events/${encodeURIComponent(String(id))}`,
      undefined,
      extrasOf(signal),
    );
    return normalizeEvent(this.unwrapRecord(response.data));
  }

  async listAttendees(eventId: string | number, page: PageRequest): Promise<ListPage> {
    const pageSize = Math.min(page.pageSize ?? DEFAULT_PAGE_SIZE, COMMUNITY_MAX_PAGE_SIZE);
    const query: QueryParams = { page: page.page, pageSize };
    const response = await this.familyClient().get(
      `/events/${encodeURIComponent(String(eventId))}/attendees`,
      query,
      extrasOf(page.signal),
    );
    const records = this.itemsFrom(response.data).map((item) => normalizeAttendee(item));
    return this.toListPage(records, page.page, pageSize);
  }

  exportFields(): ExportField[] {
    return [
      { name: "id", kind: "string" },
      { name: "title", kind: "string" },
      { name: "content", kind: "string" },
      { name: "location", kind: "string" },
      { name: "startDate", kind: "string" },
      { name: "endDate", kind: "string" },
      { name: "timezone", kind: "string" },
      { name: "type", kind: "string" },
      { name: "trashed", kind: "boolean" },
      { name: "url", kind: "string" },
      { name: "image", kind: "string" },
      { name: "createdAt", kind: "string" },
      { name: "createdBy", kind: "string" },
      { name: "userGroupId", kind: "string" },
      { name: "externalRegistrationUrl", kind: "string" },
      { name: "eventId", kind: "string" },
      { name: "userId", kind: "string" },
      { name: "signedUpAt", kind: "string" },
    ];
  }

  operations(): ResourceOperation[] {
    return [
      {
        name: "create",
        kind: "create",
        label: "Create and publish event",
        requiredColumns: ["title", "content", "startsAt", "endsAt", "timezone", "moderatorId"],
        optionalColumns: [
          "startDate",
          "endDate",
          "type",
          "location",
          "url",
          "image",
          "externalRegistrationUrl",
          "externalRegistrationUrlLabel",
          "confirmationMessage",
          "userGroupId",
          "featuredTopics",
        ],
      },
      {
        name: "createDraft",
        kind: "create",
        label: "Create event as draft",
        requiredColumns: ["title", "content", "moderatorId"],
        optionalColumns: ["startsAt", "endsAt", "startDate", "endDate", "timezone", "type", "location", "url", "image"],
      },
      {
        name: "publish",
        kind: "update",
        label: "Publish draft event",
        requiredColumns: ["moderatorId"],
      },
      {
        name: "editTitle",
        kind: "update",
        label: "Edit title",
        requiredColumns: ["title", "moderatorId"],
      },
      {
        name: "editContent",
        kind: "update",
        label: "Edit content",
        requiredColumns: ["content", "moderatorId"],
      },
      {
        name: "editLocation",
        kind: "update",
        label: "Edit location",
        requiredColumns: ["location", "moderatorId"],
      },
      {
        name: "editUrl",
        kind: "update",
        label: "Edit event URL",
        requiredColumns: ["url", "moderatorId"],
        optionalColumns: ["urlLabel"],
      },
      {
        name: "editExternalRegistrationUrl",
        kind: "update",
        label: "Edit external registration URL",
        requiredColumns: ["externalRegistrationUrl", "externalRegistrationUrlLabel", "moderatorId"],
      },
      {
        name: "editImage",
        kind: "update",
        label: "Edit featured image",
        requiredColumns: ["image", "moderatorId"],
      },
      {
        name: "changeType",
        kind: "update",
        label: "Change event type",
        requiredColumns: ["eventTypeName", "moderatorId"],
        optionalColumns: ["type"],
      },
      {
        name: "changeVisibility",
        kind: "update",
        label: "Change visibility",
        description: "Omit userGroupId to make the event publicly visible",
        requiredColumns: ["moderatorId"],
        optionalColumns: ["userGroupId"],
      },
      {
        name: "changeSignUpConfirmationMessage",
        kind: "update",
        label: "Change signup confirmation message",
        requiredColumns: ["message", "moderatorId"],
      },
      {
        name: "changeFeaturedTopics",
        kind: "update",
        label: "Change featured topics",
        requiredColumns: ["featuredTopics", "moderatorId"],
      },
      {
        name: "reschedule",
        kind: "update",
        label: "Reschedule event",
        requiredColumns: ["startsAt", "endsAt", "timezone", "moderatorId"],
        optionalColumns: ["startDate", "endDate"],
      },
      {
        name: "toggleTrashed",
        kind: "delete",
        label: "Trash or restore event",
        confirmation: "typed",
        requiredColumns: ["trashed", "moderatorId"],
      },
      {
        name: "signup",
        kind: "update",
        label: "Sign a member up",
        description: "Side-effecting: signs the authorId/userId member up for the event",
        requiredColumns: ["authorId"],
        optionalColumns: ["userId"],
      },
      {
        name: "cancelSignUp",
        kind: "update",
        label: "Cancel a member signup",
        description: "Side-effecting: cancels RSVP for authorId/userId",
        requiredColumns: ["authorId"],
        optionalColumns: ["userId"],
      },
    ];
  }

  fromCsvRow(
    row: Record<string, unknown>,
    operation: string,
    context?: FromCsvRowContext,
  ): ApiCallPlan {
    const spec = this.requireOperation(operation);
    const aliased = applyAliases(row, operation);
    this.requireFields(aliased, spec.requiredColumns, operation);

    if (operation === "create" || operation === "createDraft") {
      return this.createPlan(aliased, operation);
    }

    const id = this.identityValue(aliased, context);
    const encoded = encodeURIComponent(String(id));

    if (operation === "publish") {
      return this.callPlan({
        method: "POST",
        path: `/events/${encoded}/publish`,
        operation,
        query: this.moderatorQuery(aliased),
        resolvedId: id,
      });
    }
    if (operation === "editTitle") {
      return this.moderatorPost(encoded, operation, id, aliased, { title: String(aliased.title) });
    }
    if (operation === "editContent") {
      return this.moderatorPost(encoded, operation, id, aliased, { content: String(aliased.content) });
    }
    if (operation === "editLocation") {
      return this.moderatorPost(encoded, operation, id, aliased, { location: String(aliased.location) });
    }
    if (operation === "editImage") {
      return this.moderatorPost(encoded, operation, id, aliased, { image: String(aliased.image) });
    }
    if (operation === "editUrl") {
      const body: Record<string, unknown> = { url: String(aliased.url) };
      const urlLabel = optionalString(aliased, "urlLabel");
      if (urlLabel !== undefined) {
        body.urlLabel = urlLabel;
      }
      return this.moderatorPost(encoded, operation, id, aliased, body);
    }
    if (operation === "editExternalRegistrationUrl") {
      return this.moderatorPost(encoded, operation, id, aliased, {
        externalRegistrationUrl: String(aliased.externalRegistrationUrl),
        externalRegistrationUrlLabel: String(aliased.externalRegistrationUrlLabel),
      });
    }
    if (operation === "changeType") {
      return this.moderatorPost(encoded, operation, id, aliased, {
        eventTypeName: requireString(aliased, "eventTypeName", ["type"]),
      });
    }
    if (operation === "changeVisibility") {
      const userGroupId = optionalString(aliased, "userGroupId");
      const body: Record<string, unknown> = {};
      if (userGroupId !== undefined) {
        body.userGroupId = userGroupId;
      }
      return this.moderatorPost(encoded, operation, id, aliased, body);
    }
    if (operation === "changeSignUpConfirmationMessage") {
      return this.moderatorPost(encoded, operation, id, aliased, { message: String(aliased.message) });
    }
    if (operation === "changeFeaturedTopics") {
      const featuredTopics = parseJson(aliased.featuredTopics, "featuredTopics");
      if (!Array.isArray(featuredTopics)) {
        throw new AdapterError("featuredTopics must be a JSON array");
      }
      return this.moderatorPost(encoded, operation, id, aliased, { featuredTopics });
    }
    if (operation === "reschedule") {
      return this.moderatorPost(encoded, operation, id, aliased, {
        startsAt: requireString(aliased, "startsAt", ["startDate"]),
        endsAt: requireString(aliased, "endsAt", ["endDate"]),
        timezone: String(aliased.timezone),
      });
    }
    if (operation === "toggleTrashed") {
      return this.moderatorPost(encoded, operation, id, aliased, {
        trashed: asBoolean(aliased.trashed, "trashed"),
      });
    }
    if (operation === "signup") {
      return this.callPlan({
        method: "POST",
        path: `/events/${encoded}/signup`,
        operation,
        query: { authorId: requireString(aliased, "authorId", ["userId"]) },
        resolvedId: id,
      });
    }
    if (operation === "cancelSignUp") {
      return this.callPlan({
        method: "POST",
        path: `/events/${encoded}/cancelSignUp`,
        operation,
        query: { authorId: requireString(aliased, "authorId", ["userId"]) },
        resolvedId: id,
      });
    }
    throw new AdapterError(`Unsupported events operation "${operation}"`);
  }

  protected identityValue(
    row: Record<string, unknown>,
    context?: FromCsvRowContext,
  ): string | number {
    if (context?.resolvedId !== undefined) {
      return context.resolvedId;
    }
    const id = row.id ?? row.eventId;
    if (id === undefined || id === "") {
      throw new AdapterError(`${this.label} row is missing id`);
    }
    return id as string | number;
  }

  describeFilters(): FilterPrompt[] {
    return [
      {
        name: "class",
        label: "Classification",
        type: "string",
        description: "all requires moderatorId",
        choices: [
          { value: "upcoming", label: "Upcoming" },
          { value: "past", label: "Past" },
          { value: "published", label: "Published" },
          { value: "public", label: "Public" },
          { value: "all", label: "All (moderator)" },
        ],
      },
      {
        name: "moderatorId",
        label: "Moderator ID",
        type: "string",
        description: "Needed for class=all and draft visibility",
      },
      {
        name: "type[]",
        label: "Event types",
        type: "string[]",
        description: "Pipe-separated event type names",
      },
      {
        name: "in",
        label: "Event IDs",
        type: "string",
        description: "Comma-separated event ids",
      },
      {
        name: "order",
        label: "Sort order",
        type: "string",
      },
      {
        name: ATTENDEES_FILTER,
        label: "Attendees of event ID",
        type: "string",
        description: "If set, list attendees for that event instead of events",
      },
    ];
  }

  private createPlan(row: Record<string, unknown>, operation: string): ApiCallPlan {
    const draft = operation === "createDraft";
    const body: Record<string, unknown> = {
      title: String(row.title),
      content: String(row.content),
    };
    const startsAt = optionalString(row, "startsAt", "startDate");
    const endsAt = optionalString(row, "endsAt", "endDate");
    const timezone = optionalString(row, "timezone");
    if (!draft) {
      if (!startsAt || !endsAt || !timezone) {
        throw new AdapterError("create requires startsAt, endsAt, and timezone");
      }
    }
    if (startsAt !== undefined) {
      body.startsAt = startsAt;
    }
    if (endsAt !== undefined) {
      body.endsAt = endsAt;
    }
    if (timezone !== undefined) {
      body.timezone = timezone;
    }
    for (const field of [
      "type",
      "location",
      "url",
      "image",
      "externalRegistrationUrl",
      "externalRegistrationUrlLabel",
      "confirmationMessage",
      "userGroupId",
    ] as const) {
      const value = optionalString(row, field);
      if (value !== undefined) {
        body[field] = value;
      }
    }
    const featuredTopics = parseJson(row.featuredTopics, "featuredTopics");
    if (featuredTopics !== undefined) {
      body.featuredTopics = featuredTopics;
    }
    return this.callPlan({
      method: "POST",
      path: draft ? "/events/draft" : "/events/create",
      operation,
      query: this.moderatorQuery(row),
      body,
    });
  }

  private moderatorQuery(row: Record<string, unknown>): QueryParams {
    return { moderatorId: requireString(row, "moderatorId") };
  }

  private moderatorPost(
    encodedId: string,
    operation: string,
    id: string | number,
    row: Record<string, unknown>,
    body: unknown,
  ): ApiCallPlan {
    return this.callPlan({
      method: "POST",
      path: `/events/${encodedId}/${operation}`,
      operation,
      query: this.moderatorQuery(row),
      body,
      resolvedId: id,
    });
  }
}
