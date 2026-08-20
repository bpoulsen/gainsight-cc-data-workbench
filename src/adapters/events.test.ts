import { describe, expect, it } from "vitest";
import { getAuthenticatedClient } from "../lib/auth.js";
import { createApiClient, type ApiClientOptions } from "../lib/apiClient.js";
import { RetryPolicy } from "../lib/retry.js";
import type { GainsightConfig } from "../lib/types.js";
import { AdapterError, getAdapter } from "./index.js";
import { EventsAdapter, normalizeAttendee, normalizeEvent } from "./events.js";
import eventList from "../lib/fixtures/event-list.json" with { type: "json" };
import eventFixture from "../lib/fixtures/event.json" with { type: "json" };
import attendeeList from "../lib/fixtures/attendee-list.json" with { type: "json" };

const config: GainsightConfig = {
  profile: "sandbox",
  baseUrl: "https://example.invalid",
  clientId: "test-client-id-value",
  clientSecret: "test-client-secret-value",
  envFile: ".env.sandbox",
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function mockClient(
  handler: (url: URL, init?: RequestInit) => Response | Promise<Response>,
  options: ApiClientOptions = {},
) {
  const auth = getAuthenticatedClient(config, {
    fetchImpl: async (input, init) => {
      const url = new URL(String(input));
      if (url.pathname.endsWith("/oauth2/token")) {
        return jsonResponse({
          access_token: "live-token-value-xxxxxxxxxx",
          expires_in: 7200,
          token_type: "Bearer",
          scope: "read write",
        });
      }
      return handler(url, init);
    },
  });
  const { retry, ...rest } = options;
  return createApiClient(auth, {
    retry:
      retry ??
      new RetryPolicy({
        sleep: async () => {},
        random: () => 0.5,
        log: () => {},
      }),
    ...rest,
  });
}

describe("normalizeEvent", () => {
  it("aliases startDate/endDate to startsAt/endsAt for CSV reuse", () => {
    expect(normalizeEvent(eventFixture)).toMatchObject({
      id: "21",
      title: "Ops office hours",
      startDate: "2026-09-01T15:00:00+00:00",
      endDate: "2026-09-01T16:00:00+00:00",
      startsAt: "2026-09-01T15:00:00+00:00",
      endsAt: "2026-09-01T16:00:00+00:00",
      timezone: "UTC",
    });
  });
});

describe("normalizeAttendee", () => {
  it("uses userId as the row identity", () => {
    expect(normalizeAttendee({ userId: "7", eventId: "21", signedUpAt: "2026-08-15T09:00:00+00:00" })).toEqual({
      id: "7",
      eventId: "21",
      userId: "7",
      signedUpAt: "2026-08-15T09:00:00+00:00",
    });
  });
});

describe("EventsAdapter fromCsvRow", () => {
  const adapter = new EventsAdapter(mockClient(() => jsonResponse({})));

  it("plans create and createDraft against named endpoints", () => {
    expect(
      adapter.fromCsvRow(
        {
          title: "Office hours",
          content: "Drop-in",
          startDate: "2026-09-01T15:00:00+00:00",
          endDate: "2026-09-01T16:00:00+00:00",
          timezone: "UTC",
          location: "Zoom",
          moderatorId: 8,
        },
        "create",
      ),
    ).toMatchObject({
      method: "POST",
      path: "/events/create",
      query: { moderatorId: "8" },
      body: {
        title: "Office hours",
        content: "Drop-in",
        startsAt: "2026-09-01T15:00:00+00:00",
        endsAt: "2026-09-01T16:00:00+00:00",
        timezone: "UTC",
        location: "Zoom",
      },
      retryable: true,
    });
    expect(
      adapter.fromCsvRow({ title: "Draft meetup", content: "TBD", moderatorId: 8 }, "createDraft"),
    ).toMatchObject({
      method: "POST",
      path: "/events/draft",
      query: { moderatorId: "8" },
      body: { title: "Draft meetup", content: "TBD" },
    });
  });

  it("plans publish, field edits, reschedule, and visibility", () => {
    expect(adapter.fromCsvRow({ id: 21, moderatorId: 8 }, "publish")).toMatchObject({
      method: "POST",
      path: "/events/21/publish",
      query: { moderatorId: "8" },
      resolvedId: 21,
    });
    expect(adapter.fromCsvRow({ id: 21, title: "Renamed", moderatorId: 8 }, "editTitle")).toMatchObject({
      path: "/events/21/editTitle",
      body: { title: "Renamed" },
    });
    expect(
      adapter.fromCsvRow(
        {
          eventId: 21,
          startDate: "2026-09-02T15:00:00+00:00",
          endDate: "2026-09-02T16:00:00+00:00",
          timezone: "UTC",
          moderatorId: 8,
        },
        "reschedule",
      ),
    ).toMatchObject({
      path: "/events/21/reschedule",
      body: {
        startsAt: "2026-09-02T15:00:00+00:00",
        endsAt: "2026-09-02T16:00:00+00:00",
        timezone: "UTC",
      },
    });
    expect(adapter.fromCsvRow({ id: 21, type: "webinar", moderatorId: 8 }, "changeType")).toMatchObject({
      path: "/events/21/changeType",
      body: { eventTypeName: "webinar" },
    });
    expect(adapter.fromCsvRow({ id: 21, moderatorId: 8 }, "changeVisibility")).toMatchObject({
      path: "/events/21/changeVisibility",
      body: {},
    });
    expect(
      adapter.fromCsvRow(
        {
          id: 21,
          featuredTopics: '[{"publicId":1,"privateId":2,"contentType":"article"}]',
          moderatorId: 8,
        },
        "changeFeaturedTopics",
      ),
    ).toMatchObject({
      path: "/events/21/changeFeaturedTopics",
      body: { featuredTopics: [{ publicId: 1, privateId: 2, contentType: "article" }] },
    });
  });

  it("treats toggleTrashed as typed and non-retryable", () => {
    expect(adapter.operations().find((item) => item.name === "toggleTrashed")?.confirmation).toBe(
      "typed",
    );
    expect(adapter.fromCsvRow({ id: 21, trashed: true, moderatorId: 8 }, "toggleTrashed")).toMatchObject({
      method: "POST",
      path: "/events/21/toggleTrashed",
      body: { trashed: true },
      retryable: false,
    });
    expect(adapter.operations().some((item) => item.name === "permanentDelete")).toBe(false);
    expect(() => adapter.fromCsvRow({ id: 21, moderatorId: 8 }, "permanentDelete")).toThrow(
      AdapterError,
    );
  });

  it("plans side-effecting signup and cancelSignUp with authorId", () => {
    expect(adapter.operations().find((item) => item.name === "signup")?.description).toMatch(
      /Side-effecting/,
    );
    expect(adapter.fromCsvRow({ id: 21, userId: 7 }, "signup")).toMatchObject({
      method: "POST",
      path: "/events/21/signup",
      query: { authorId: "7" },
      retryable: true,
    });
    expect(adapter.fromCsvRow({ id: 21, authorId: 7 }, "cancelSignUp")).toMatchObject({
      method: "POST",
      path: "/events/21/cancelSignUp",
      query: { authorId: "7" },
    });
  });
});

describe("EventsAdapter list/get", () => {
  it("lists events with class and type filters, then gets one by id", async () => {
    const client = mockClient((url) => {
      if (url.pathname === "/v2/events/21") {
        return jsonResponse(eventFixture);
      }
      if (url.pathname === "/v2/events") {
        expect(url.searchParams.get("class")).toBe("upcoming");
        expect(url.searchParams.get("filters[in]")).toBe("21,22");
        expect(url.searchParams.getAll("filters[type][]")).toEqual(["webinar"]);
        expect(url.searchParams.get("pageSize")).toBe("100");
        return jsonResponse(eventList);
      }
      return jsonResponse({ message: "nope" }, 404);
    });
    const adapter = new EventsAdapter(client);
    const listed = await adapter.list(
      { class: "upcoming", in: "21,22", "type[]": "webinar" },
      { page: 1, pageSize: 200 },
    );
    expect(listed.records.map((row) => row.id)).toEqual(["21", "22"]);
    expect(listed.records[0]).toMatchObject({ startDate: "2026-09-01T15:00:00+00:00", startsAt: "2026-09-01T15:00:00+00:00" });
    expect(listed.exhausted).toBe(true);
    const one = await adapter.get("21");
    expect(one).toMatchObject({ id: "21", title: "Ops office hours" });
  });

  it("lists attendees when attendeesOf is set", async () => {
    const client = mockClient((url) => {
      expect(url.pathname).toBe("/v2/events/21/attendees");
      expect(url.searchParams.get("page")).toBe("1");
      return jsonResponse(attendeeList);
    });
    const adapter = new EventsAdapter(client);
    const listed = await adapter.list({ attendeesOf: "21" }, { page: 1 });
    expect(listed.records).toEqual([
      { id: "7", eventId: "21", userId: "7", signedUpAt: "2026-08-15T09:00:00+00:00" },
      { id: "9", eventId: "21", userId: "9", signedUpAt: "2026-08-16T10:30:00+00:00" },
    ]);
  });

  it("registers events on the adapter map", () => {
    const client = mockClient(() => jsonResponse({}));
    expect(getAdapter("events", client)).toBeInstanceOf(EventsAdapter);
    expect(getAdapter("event", client).name).toBe("events");
    expect(getAdapter("events", client).family).toBe("events");
  });
});
