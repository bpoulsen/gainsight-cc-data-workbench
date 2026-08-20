/** Generated from docs/api/events-api.json. Do not edit by hand. */
export interface paths {
    "/events/create": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create an event
         * @description Moderators can create an event with a title, description, event timezone, event start time/date, and event end time/date. Events do not have a category.
         *
         *     Events can be created and published immediately, or can be created as draft and published later. Draft events are not publicly visible.
         *
         *     Optionally, moderators can provide a location for an event, as well as a URL for end users to find more information or formally register for an event. Moderators can optionally set a display label for a  URL, to provide more context for the end user about the link.
         *
         *     In addition, moderators can specify an event type for the event (a label highlighting the type of event, e.g. Webinar, Conference, Meetup).
         *
         *     Moderators can also add a custom confirmation message that is shown to end users after they press attend; for example, to highlight any actions that the end user needs to take external to the community.
         *
         *     Events can also optionally have a featured image with a valid url. The allowed image extensions for featured image are png, jpeg, jpg, gif.
         */
        post: operations["createEvent"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/events/draft": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create an event as draft
         * @description Moderators can create an event with a title, description, event timezone, event start time/date, and event end time/date. Events do not have a category.
         *
         *     Events can be created and published immediately, or can be created as draft and published later. Draft events are not publicly visible.
         *
         *     Optionally, moderators can provide a location for an event, as well as a URL for end users to find more information or formally register for an event. Moderators can optionally set a display label for a  URL, to provide more context for the end user about the link.
         *
         *     In addition, moderators can specify an event type for the event (a label highlighting the type of event, e.g. Webinar, Conference, Meetup).
         *
         *     Moderators can also add a custom confirmation message that is shown to end users after they press attend; for example, to highlight any actions that the end user needs to take external to the community.
         *
         *     Events can also optionally have a featured image with a valid url. The allowed image extensions for featured image are png, jpeg, jpg, gif.
         */
        post: operations["createEventAsDraft"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/events/{id}/publish": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Publish an event */
        post: operations["publishEvent"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/events/{id}/toggleTrashed": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Trash an event */
        post: operations["toggleEventTrashed"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/events/{id}/reschedule": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Reschedule an event */
        post: operations["rescheduleEvent"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/events/{id}/signup": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Sign up to an event */
        post: operations["signupEvent"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/events/{id}/cancelSignUp": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Cancel sign up to an event */
        post: operations["cancelSignUpEvent"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/events/{id}/editTitle": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Edit an event title */
        post: operations["editEventTitle"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/events/{id}/editUrl": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Edit an event url */
        post: operations["editEventUrl"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/events/{id}/editExternalRegistrationUrl": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Edit an event external registration url */
        post: operations["editExternalRegistrationUrl"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/events/{id}/editContent": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Edit an event content */
        post: operations["editEventContent"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/events/{id}/editLocation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Edit an event location */
        post: operations["editEventLocation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/events/{id}/editImage": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Edit an event image */
        post: operations["editEventImage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/events/{id}/changeSignUpConfirmationMessage": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Change the confirmation message that gets displayed after a user signs up for the event */
        post: operations["changeSignUpConfirmationMessage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/events/{id}/changeFeaturedTopics": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Update the featured topics lists */
        post: operations["changeFeaturedTopics"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/events/{id}/changeType": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Change the eventType for a event. */
        post: operations["editEventType"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/event-types/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Change the Name for a event Type */
        post: operations["editEventTypeName"];
        /** Delete and EventType */
        delete: operations["deleteEventType"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/event-types": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List event types
         * @description Fetches a paginated list of event types
         */
        get: operations["getEventTypesList"];
        /** Create an EventType */
        put: operations["createEventType"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/events/{id}/changeVisibility": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Changes visibility for an event, when provided with a user group id, it is only visible in the user group, else it is publicly visible. */
        post: operations["changeEventVisibility"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/events/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Find Event by ID
         * @description By default returns a visible event.
         */
        get: operations["getEvent"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List events
         * @description Fetches a paginated list of events sorted by startdate in ascending order
         */
        get: operations["getEventList"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/events/{id}/attendees": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Find event attendees by event ID
         * @description Fetches a paginated list of attendees for event sorted by signed up date in descending order
         */
        get: operations["getAttendeeList"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        Author: {
            /**
             * @description Author ID
             * @example 7
             */
            id?: string;
            /**
             * @description Username of the author
             * @example awesome_user
             */
            username?: string;
            /**
             * @description Avatar of the author
             * @example http://example.com/avatar123.jpg
             */
            avatar?: string;
        };
        /**
         * @example {
         *       "message": "Unprocessable entity",
         *       "description": "Invalid or missing topic id"
         *     }
         */
        BadRequestException: components["schemas"]["Exception"] & {
            /** @description Explanation about the error */
            description?: string;
        };
        /**
         * @example {
         *       "from": "2018-06-20",
         *       "to": "2018-12-20"
         *     }
         */
        DateRange: {
            /**
             * Format: date
             * @description from date e.g. 2018-06-20 (yyyy-mm-dd)
             */
            from?: string;
            /**
             * Format: date
             * @description to date e.g. 2018-06-20 (yyyy-mm-dd)
             */
            to?: string;
        };
        Exception: {
            /**
             * @description Generic error message
             * @example Internal Server Error
             */
            readonly message?: string;
        };
        Links: {
            /** @description The API urls of the requested object */
            self?: unknown;
        };
        Attendee: {
            /** @example 1 */
            readonly userId?: string;
            /** @example 2 */
            readonly eventId?: string;
            /**
             * Format: date-time
             * @example 2017-04-10T15:29:06+00:00
             */
            readonly signedUpAt?: string;
        };
        AttendeeList: {
            result?: components["schemas"]["Attendee"][];
        };
        ChangeEventVisibilityRequest: {
            /** @example 45 */
            userGroupId?: string;
        };
        ChangeSignUpConfirmationMessageRequest: {
            /** @example My updated sign-up-confirmation-message */
            message: string;
        };
        CreateDraftRequest: {
            /** @example A very interesting event */
            title: string;
            /** @example Meetup */
            type?: string;
            /** @example This webinar will teach you all you need to know about everything */
            content: string;
            /**
             * Format: date-time
             * @description ISO format date-time representing the start date and time of the event
             * @example 2017-04-01T15:29:06+02:00
             */
            startsAt?: string;
            /**
             * Format: date-time
             * @description ISO format date-time representing the end date and time of the event
             * @example 2017-04-01T20:29:06+02:00
             */
            endsAt?: string;
            /**
             * @description A valid timezone name from the IANA database. For reference: [list of IANA timezone names](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
             * @example Europe/Amsterdam
             */
            timezone?: string;
            /** @example New York */
            location?: string;
            /**
             * Format: uri
             * @example https://example.com
             */
            url?: string;
            /**
             * Format: uri
             * @example https://example.com/some-optional-image.png
             */
            image?: string;
            /**
             * Format: uri
             * @description Note that event with configured external RSVP can not be configured back with community RSVP
             * @example https://some.valid.url
             */
            externalRegistrationUrl?: string;
            /** @example My Registration Page */
            externalRegistrationUrlLabel?: string;
            /**
             * @example [
             *       {
             *         "publicId": "382",
             *         "privateId": "22",
             *         "contentType": "productUpdate"
             *       },
             *       {
             *         "publicId": "10",
             *         "privateId": "212",
             *         "contentType": "event"
             *       }
             *     ]
             */
            featuredTopics?: {
                privateId?: number;
                publicId?: number;
                contentType?: string;
            }[];
            /** @example My Confirmation Message */
            confirmationMessage?: string;
            /** @example 21 */
            userGroupId?: string;
        };
        CreateEventRequest: {
            /** @example A very interesting event */
            title: string;
            /** @example Meetup */
            type?: string;
            /** @example This webinar will teach you all you need to know about everything */
            content: string;
            /**
             * Format: date-time
             * @description ISO format date-time representing the start date and time of the event
             * @example 2017-04-01T15:29:06+02:00
             */
            startsAt: string;
            /**
             * Format: date-time
             * @description ISO format date-time representing the end date and time of the event
             * @example 2017-04-01T20:29:06+02:00
             */
            endsAt: string;
            /**
             * @description A valid timezone name from the IANA database. For reference: [list of IANA timezone names](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
             * @example Europe/Amsterdam
             */
            timezone: string;
            /** @example New York */
            location?: string;
            /**
             * Format: uri
             * @example https://example.com
             */
            url?: string;
            /**
             * Format: uri
             * @example https://example.com/some-optional-image.png
             */
            image?: string;
            /**
             * Format: uri
             * @description Note that event with configured external RSVP can not be configured back with community RSVP
             * @example https://some.valid.url
             */
            externalRegistrationUrl?: string;
            /** @example My Registration Page */
            externalRegistrationUrlLabel?: string;
            /**
             * @example [
             *       {
             *         "publicId": "382",
             *         "privateId": "22",
             *         "contentType": "productUpdate"
             *       },
             *       {
             *         "publicId": "10",
             *         "privateId": "212",
             *         "contentType": "event"
             *       }
             *     ]
             */
            featuredTopics?: {
                privateId?: number;
                publicId?: number;
                contentType?: string;
            }[];
            /** @example My Confirmation Message */
            confirmationMessage?: string;
            /** @example 21 */
            userGroupId?: string;
        };
        CreateEventTypeRequest: {
            /** @example MeetUp */
            typeName: string;
        };
        EditEventContentRequest: {
            /** @example My updated content */
            content: string;
        };
        EditEventExternalRegistrationUrlRequest: {
            /** @example https://some.valid.url */
            externalRegistrationUrl: string;
            /** @example My Registration Page */
            externalRegistrationUrlLabel: string;
        };
        EditEventImageRequest: {
            /** @example http://example.com/image.jpg */
            image: string;
        };
        EditEventLocationRequest: {
            /** @example My updated location */
            location: string;
        };
        EditEventTitleRequest: {
            /** @example My updated title */
            title: string;
        };
        EditEventTypeNameRequest: {
            /** @example In-person */
            typeName: string;
        };
        EditEventTypeRequest: {
            /** @example Updated new Type */
            eventTypeName: string;
        };
        EditEventUrlRequest: {
            /** @example https://some.valid.url */
            url: string;
            /** @example Some label */
            urlLabel?: string;
        };
        EditFeaturedTopicsRequest: {
            /**
             * @example [
             *       {
             *         "privateId": 21,
             *         "publicId": 382,
             *         "contentType": "productUpdate"
             *       },
             *       {
             *         "privateId": 29,
             *         "publicId": 386,
             *         "contentType": "article"
             *       }
             *     ]
             */
            featuredTopics: {
                privateId?: number;
                publicId?: number;
                contentType?: string;
            }[];
        };
        Event: {
            /** @example 1 */
            readonly id?: string;
            /** @example My first meetup */
            readonly title?: string;
            /** @example Some information about my meetup */
            readonly content?: string;
            /**
             * Format: date-time
             * @example 2017-04-01T15:29:06+00:00
             */
            readonly startDate?: string;
            /**
             * Format: date-time
             * @example 2017-04-01T20:29:06+00:00
             */
            readonly endDate?: string;
            /** @example Amsterdam */
            readonly location?: string;
            /** @example https://fake.meetup.com */
            readonly url?: string;
            /** @example https://fake.meetup.com */
            readonly externalRegistrationUrl?: string;
            /** @example Button name */
            readonly externalRegistrationUrlLabel?: string;
            /** @example https://fake.meetup.com/image.png */
            readonly image?: string;
            /**
             * Format: date-time
             * @example 2017-04-10T15:29:06+00:00
             */
            readonly createdAt?: string;
            /** @example 1 */
            readonly createdBy?: string;
            /** @example false */
            readonly trashed?: boolean;
            /** @example 1 */
            readonly userGroupId?: string;
            /** @example Europe/Amsterdam */
            readonly timezone?: string;
        };
        EventList: {
            result?: components["schemas"]["Event"][];
            _metadata?: {
                /** @description Total number of results matching the query criteria */
                totalCount?: number;
                /** @description Currently always `0` */
                limit?: number;
                /** @description Currently always `0` */
                offset?: number;
            };
        };
        EventType: {
            /** @example 1 */
            readonly id?: string;
            /** @example Private */
            readonly name?: string;
            /** @example 1 */
            readonly count?: number;
        };
        EventTypeList: {
            result?: components["schemas"]["Event"][];
        };
        RescheduleEventRequest: {
            /**
             * Format: date-time
             * @description ISO format date-time representing the start date and time of the event
             * @example 2017-04-01T15:29:06+02:00
             */
            startsAt: string;
            /**
             * Format: date-time
             * @description ISO format date-time representing the end date and time of the event
             * @example 2017-04-01T20:29:06+02:00
             */
            endsAt: string;
            /**
             * @description A valid timezone name from the IANA database. For reference: [list of IANA timezone names](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
             * @example Europe/Amsterdam
             */
            timezone: string;
        };
        ToggleEventTrashRequest: {
            /** @example true */
            trashed: boolean;
        };
        /**
         * @example {
         *       "message": "Bad Request",
         *       "description": "Invalid JSON"
         *     }
         */
        InvalidJsonException: components["schemas"]["Exception"] & {
            /** @description Additional info about the error */
            readonly description?: string;
        };
        /**
         * @example {
         *       "message": "Unprocessable Entity",
         *       "errors": [
         *         "Title is required"
         *       ]
         *     }
         */
        ValidationException: components["schemas"]["Exception"] & {
            /**
             * @example [
             *       "Title is required"
             *     ]
             */
            readonly errors?: string[];
        };
    };
    responses: {
        /** @description Successful response */
        AttendeeList: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["AttendeeList"];
            };
        };
        /** @description Successful response */
        Event: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": {
                    result?: components["schemas"]["Event"];
                };
            };
        };
        /** @description Successful response */
        EventList: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["EventList"];
            };
        };
        /** @description Successful response */
        EventTypesList: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["EventTypeList"];
            };
        };
        /** @description Malformed input */
        MalformedInput: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["InvalidJsonException"];
            };
        };
        /** @description Item not found */
        NotFound: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                /**
                 * @example {
                 *       "message": "Not Found",
                 *       "description": "Item does not exist"
                 *     }
                 */
                "application/json": components["schemas"]["BadRequestException"];
            };
        };
        /** @description Unexpected error */
        ServerError: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["Exception"];
            };
        };
        /** @description Validation error */
        ValidationError: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ValidationException"];
            };
        };
    };
    parameters: {
        /** @description Sets the order of the event list. */
        EventListOrder: "startdate.asc" | "startdate.desc";
        /** @description Selects the page to retrieve on paginated responses. Used in combination with the `pageSize` parameter to paginate over results */
        PageNumber: number;
        /** @description Limits the number of items returned in a single paginated response. Used in combination with the `page` parameter to paginate over results */
        PageSize: number;
        /** @description ID of the event to interact with */
        PathEventId: string;
    };
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    createEvent: {
        parameters: {
            query: {
                /** @description ID of the moderator creating the event */
                moderatorId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateEventRequest"];
            };
        };
        responses: {
            /** @description Event created */
            201: {
                headers: {
                    /** @description Event URL */
                    Location?: string;
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["MalformedInput"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    createEventAsDraft: {
        parameters: {
            query: {
                /** @description ID of the moderator creating the event */
                moderatorId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateDraftRequest"];
            };
        };
        responses: {
            /** @description Event created */
            201: {
                headers: {
                    /** @description Event URL */
                    Location?: string;
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["MalformedInput"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    publishEvent: {
        parameters: {
            query: {
                /** @description ID of the moderator publishing the event */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the event to interact with */
                id: components["parameters"]["PathEventId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Event published. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["MalformedInput"];
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    toggleEventTrashed: {
        parameters: {
            query: {
                /** @description ID of the moderator trashing the event */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the event to interact with */
                id: components["parameters"]["PathEventId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ToggleEventTrashRequest"];
            };
        };
        responses: {
            /** @description Event trashed state updated */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["MalformedInput"];
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    rescheduleEvent: {
        parameters: {
            query: {
                /** @description ID of the moderator rescheduling the event */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the event to interact with */
                id: components["parameters"]["PathEventId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RescheduleEventRequest"];
            };
        };
        responses: {
            /** @description Event rescheduled */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    signupEvent: {
        parameters: {
            query: {
                /** @description ID of the author signing up to the event */
                authorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the event to interact with */
                id: components["parameters"]["PathEventId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Signed up to event */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    cancelSignUpEvent: {
        parameters: {
            query: {
                /** @description ID of the author cancelling sign up to the event */
                authorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the event to interact with */
                id: components["parameters"]["PathEventId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Sign up to event cancelled */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    editEventTitle: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the event title */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the event to interact with */
                id: components["parameters"]["PathEventId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditEventTitleRequest"];
            };
        };
        responses: {
            /** @description Event title updated */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    editEventUrl: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the event url */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the event to interact with */
                id: components["parameters"]["PathEventId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditEventUrlRequest"];
            };
        };
        responses: {
            /** @description Event url updated */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    editExternalRegistrationUrl: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the event url */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the event to interact with */
                id: components["parameters"]["PathEventId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditEventExternalRegistrationUrlRequest"];
            };
        };
        responses: {
            /** @description Event external registration url updated */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    editEventContent: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the event content */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the event to interact with */
                id: components["parameters"]["PathEventId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditEventContentRequest"];
            };
        };
        responses: {
            /** @description Event content updated */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    editEventLocation: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the event location */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the event to interact with */
                id: components["parameters"]["PathEventId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditEventLocationRequest"];
            };
        };
        responses: {
            /** @description Event location updated */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    editEventImage: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the event image */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the event to interact with */
                id: components["parameters"]["PathEventId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditEventImageRequest"];
            };
        };
        responses: {
            /** @description Event image updated */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    changeSignUpConfirmationMessage: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the event image */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the event to interact with */
                id: components["parameters"]["PathEventId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ChangeSignUpConfirmationMessageRequest"];
            };
        };
        responses: {
            /** @description Event image updated */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    changeFeaturedTopics: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the event image */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the event to interact with */
                id: components["parameters"]["PathEventId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditFeaturedTopicsRequest"];
            };
        };
        responses: {
            /** @description Event Featured Topics Update updated */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    editEventType: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the event type */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the event to interact with */
                id: components["parameters"]["PathEventId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditEventTypeRequest"];
            };
        };
        responses: {
            /** @description Event Type updated */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    editEventTypeName: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the event image */
                moderatorId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditEventTypeNameRequest"];
            };
        };
        responses: {
            /** @description EventType name updated */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    deleteEventType: {
        parameters: {
            query: {
                /** @description ID of the moderator creating the event */
                moderatorId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description EventType deleted */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    getEventTypesList: {
        parameters: {
            query?: {
                /** @description Selects the page to retrieve on paginated responses. Used in combination with the `pageSize` parameter to paginate over results */
                page?: components["parameters"]["PageNumber"];
                /** @description Limits the number of items returned in a single paginated response. Used in combination with the `page` parameter to paginate over results */
                pageSize?: components["parameters"]["PageSize"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["EventTypesList"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    createEventType: {
        parameters: {
            query: {
                /** @description ID of the moderator creating the event */
                moderatorId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateEventTypeRequest"];
            };
        };
        responses: {
            /** @description EventType created */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["MalformedInput"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    changeEventVisibility: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the event title */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the event to interact with */
                id: components["parameters"]["PathEventId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ChangeEventVisibilityRequest"];
            };
        };
        responses: {
            /** @description Event visibility changed */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    getEvent: {
        parameters: {
            query?: {
                /** @description ID of the moderator viewing the event, needed for viewing draft events. */
                moderatorId?: string;
            };
            header?: never;
            path: {
                /** @description ID of the event to interact with */
                id: components["parameters"]["PathEventId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["Event"];
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    getEventList: {
        parameters: {
            query?: {
                /** @description ID of the moderator requesting the list of events. Takes precedence over `X-USER_ID` header. */
                moderatorId?: string;
                /**
                 * @description Retrieve a certain classification of events. One of 'past', 'published', 'upcoming', 'all', 'public'. `all` requires `moderatorId` to be provided.
                 * @example upcoming
                 */
                class?: "public" | "published" | "upcoming" | "past" | "all";
                /**
                 * @deprecated
                 * @description Deprecated. Use `class` instead. If both are provided, `class` takes precendence.
                 * @example past
                 */
                filter?: "public" | "published" | "upcoming" | "past" | "all";
                /** @description Filter the list of events */
                filters?: {
                    /** @description Filter events based on event types */
                    "type[]"?: string[];
                    /**
                     * @description Filter events based on a given comma separated list of event id's
                     * @example 15,22,36
                     */
                    in?: string;
                };
                /** @description Selects the page to retrieve on paginated responses. Used in combination with the `pageSize` parameter to paginate over results */
                page?: components["parameters"]["PageNumber"];
                /** @description Limits the number of items returned in a single paginated response. Used in combination with the `page` parameter to paginate over results */
                pageSize?: components["parameters"]["PageSize"];
                /** @description Sets the order of the event list. */
                order?: components["parameters"]["EventListOrder"];
            };
            header?: {
                /** @description Non moderator id of the user fetching the data. If `moderatorId` query parameter is provided, it takes precedence. If provided, public and user's group events are returned. */
                "X-USER-ID"?: number;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["EventList"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    getAttendeeList: {
        parameters: {
            query?: {
                /** @description Selects the page to retrieve on paginated responses. Used in combination with the `pageSize` parameter to paginate over results */
                page?: components["parameters"]["PageNumber"];
                /** @description Limits the number of items returned in a single paginated response. Used in combination with the `page` parameter to paginate over results */
                pageSize?: components["parameters"]["PageSize"];
            };
            header?: {
                /** @description Prioritized attendee to be on the first page. */
                "X-Prioritized-Attendee"?: number;
            };
            path: {
                /** @description ID of the event to interact with */
                id: components["parameters"]["PathEventId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["AttendeeList"];
            404: components["responses"]["NotFound"];
            500: components["responses"]["ServerError"];
        };
    };
}
