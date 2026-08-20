/** Generated from docs/api/search-api.json. Do not edit by hand. */
export interface paths {
    "/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Search for content in the community
         * @description Endpoint to search for a term in the content. The search algorithm is the same as the one in the user facing frontend. Additional filters can be passed to this endpoint in order to narrow down the search results.
         */
        get: operations["search"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/search/tags": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Search for tags in the community
         * @description Endpoint to search for tags by name. Returns a list of matching tags with their IDs and usage counts.
         */
        get: operations["searchTags"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/external-content/index": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Index content for federated search
         * @description Endpoint to add or update content that will be available for search. Any data passed to this endpoint will be either added (if the url doesn't already exist), updated (if the url is already present). A maximum of 1000 records per batch is allowed, with a total maximum of 25000 records by default (configurable per community). Maximum size of the payload per request is 5M. The source value will be set to 'federated' when not specified.
         */
        post: operations["index"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/external-content/clear": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Delete federated search content for specified source
         * @description Endpoint to delete federated search content for specified source. The 'source' parameter is required and indicates which external system's content to remove. Valid values include: 'federated', 'zendesk', 'intercom', 'freshdesk', or a custom source identifier provided when the content was originally added.
         */
        post: operations["clear"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/external-content/delete": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Delete specific urls from federated search
         * @description Endpoint to delete specific items from federated search. Accepts a list of urls that identify content to remove.
         */
        post: operations["delete"];
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
        /** SearchResult */
        SearchResult: {
            /** Content type of the topic */
            contentType: string;
            /** Relative url, combine with the domain of community to */
            url: string;
            /** Title of the topic */
            title: string;
            /** Content of the topic */
            content: string;
            /** The initial topic */
            firstPost: string;
            /** Category id or null if no category assigned */
            categoryId: number | null;
            /** Category name or null if no category assigned */
            categoryName: string | null;
            /**
             * Section name (categories.lvl0) or null if not assigned
             * @default null
             */
            sectionName: string | null;
            /**
             * Parent category path (categories.lvl1) or null if not assigned
             * @default null
             */
            parentCategoryName: string | null;
            /** List of topic tags */
            tags: string[];
            /** Does a question have an answer */
            hasAnswer: boolean;
            /** Public Id of the topic */
            publicId: number;
            /** Private Id of the topic */
            id: number;
            /** Author Id */
            authorId: number;
            /** Author username */
            authorName: string;
            /** Date the content was created */
            createdAt: number;
        };
        /** SearchResults */
        SearchResults: {
            /** Community */
            community: components["schemas"]["SearchResult"][];
        };
        /**
         * TagResult
         * @description Single tag result.
         *
         *     Example: {"id": 123, "name": "feature-request", "count": 42}
         */
        TagResult: {
            /** Tag ID */
            id: number;
            /** Tag name */
            name: string;
            /** Number of topics with this tag */
            count: number;
        };
        /**
         * TagSearchResults
         * @description Response model for tag search.
         *
         *     Example: {"tags": [{"id": 123, "name": "feature", "count": 10}]}
         */
        TagSearchResults: {
            /** Tags */
            tags: components["schemas"]["TagResult"][];
        };
    };
    responses: {
        /** @description Success response is empty */
        Success: {
            headers: {
                [name: string]: unknown;
            };
            content?: never;
        };
        /** @description Validation error */
        InvalidPayload: {
            headers: {
                [name: string]: unknown;
            };
            content?: never;
        };
        /** @description Payload is too big, try sending less data in a batch */
        PayloadTooLarge: {
            headers: {
                [name: string]: unknown;
            };
            content?: never;
        };
    };
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    search: {
        parameters: {
            query: {
                /** @description Search query */
                q: string;
                /** @description Category ids to search in */
                categoryIds?: number[] | null;
                /** @description Sections (categories.lvl0) to search in */
                sections?: string[] | null;
                /** @description Parent categories (categories.lvl1) to search in */
                parentCategories?: string[] | null;
                /** @description Content types to search in */
                contentTypes?: string[] | null;
                /** @description Search in topic with specific tags */
                tags?: string[] | null;
                /** @description Search in topic with specific moderator tags */
                moderatorTags?: string[] | null;
                /** @description Set to true to only return questions with answers */
                hasAnswer?: boolean | null;
                /** @description Used for pagination. An integer greated than 0. */
                page?: number;
                /** @description Number of results to return per page (1-200, defaults to 50). */
                pageSize?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SearchResults"];
                };
            };
            400: components["responses"]["InvalidPayload"];
        };
    };
    searchTags: {
        parameters: {
            query?: {
                /** @description Search query for tag name */
                q?: string;
                /** @description Page number for pagination */
                page?: number;
                /** @description Number of results to return per page (1-200, defaults to 50). */
                pageSize?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TagSearchResults"];
                };
            };
            400: components["responses"]["InvalidPayload"];
        };
    };
    index: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Json with batch of records to index */
        requestBody: {
            content: {
                "application/json": {
                    /** Batch */
                    batch: {
                        /** Title */
                        title: string;
                        /** Content */
                        content: string;
                        /** Url */
                        url: string;
                        /** Source */
                        source?: string;
                        /** Tags */
                        tags?: string[];
                    }[];
                };
            };
        };
        responses: {
            201: components["responses"]["Success"];
            400: components["responses"]["InvalidPayload"];
            413: components["responses"]["PayloadTooLarge"];
        };
    };
    clear: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Json with the source type to delete */
        requestBody: {
            content: {
                "application/json": {
                    /** Source */
                    source: string;
                };
            };
        };
        responses: {
            200: components["responses"]["Success"];
        };
    };
    delete: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Json with list of urls to delete */
        requestBody: {
            content: {
                "application/json": {
                    /** Urls */
                    urls: string[];
                };
            };
        };
        responses: {
            201: components["responses"]["Success"];
            400: components["responses"]["InvalidPayload"];
        };
    };
}
