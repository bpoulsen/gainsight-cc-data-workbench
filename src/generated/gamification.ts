/** Generated from docs/api/gamification-api.json. Do not edit by hand. */
export interface paths {
    "/leaderboard": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * All time leaderboard
         * @description Fetches a paginated list of users sorted by ascending order of all time points earned
         */
        get: operations["allTimeLeaderboard"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/leaderboard/weekly": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * This week's leaderboard.
         * @description Fetches a paginated list of users sorted by ascending order of points earned this week. 'This week' is a fixed 7 day time period (Monday-Sunday), rather than a rolling 7 day period. This is reset based on the value of timezone chosen when the point system is configured in the control environment.
         */
        get: operations["weeklyLeaderboard"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/leaderboard/user/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * User's position on the leaderboard.
         * @description Returns leaderboard user with their position on all time or weekly leaderboards.
         */
        get: operations["userPosition"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/points/assign": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Assign points
         * @description Assign points to a single user by UserId
         */
        post: operations["assignPoints"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/points": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get assigned points
         * @description Get points assigned to users in a timeframe
         */
        get: operations["getPointsPerUserBetweenDates"];
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
        /**
         * @example {
         *       "userId": 5,
         *       "points": 100
         *     }
         */
        UserPoints: {
            /** @description User ID */
            readonly userId?: number;
            /** @description Points earned */
            readonly points?: number;
        };
        /**
         * @example {
         *       "id": 5,
         *       "points": 100,
         *       "name": "AwesomeUser",
         *       "leaderboardPosition": 1,
         *       "avatar": "http://example.com/avatar123.jpg",
         *       "rank": "http://superhero.rank/icon.png"
         *     }
         */
        LeaderboardUserResponse: {
            /** @description User ID */
            readonly userId?: number;
            /** @description Points earned */
            readonly points?: number;
            /**
             * @description Username
             * @example john-doe
             */
            readonly name?: string;
            /** @description Users position on the leaderboard */
            readonly leaderboardPosition?: number;
            /**
             * @description Avatar of the user
             * @example http://example.com/avatar123.jpg
             */
            readonly avatar?: string;
            /**
             * @description Rank icon url
             * @example http://example.com/rank-icon.jpg
             */
            readonly rank?: string;
        };
        UserUnranked: {
            /** @example User with given id does not have a rank on the leaderboard */
            readonly message?: string;
        };
        Exception: {
            /**
             * @description Generic error message
             * @example Internal Server Error
             */
            readonly message?: string;
        };
    };
    responses: {
        /** @description List of users on the leaderboard */
        LeaderboardUserList: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["LeaderboardUserResponse"][];
            };
        };
        /** @description Unexpected error */
        Error: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["Exception"];
            };
        };
    };
    parameters: {
        /**
         * @description Ids of users to retrive points for.
         * @example 10
         */
        UserIds: number[];
        /**
         * @description Starting value for a timeframe. Uses beginning of unix time as default.
         * @example 2020-05-29 13:33:10
         */
        FromDate: string;
        /**
         * @description Ending value for a timeframe. Uses current time as a default.
         * @example 2020-05-29 13:33:10
         */
        TillDate: string;
        /**
         * @description Used to rank using this week leaderboard. Allowed values: weekly, all_time. All time is the default.
         * @example weekly
         */
        Period: string;
        /**
         * @description List of user roles to exclude.
         * @example roles.banned&excluded[]=roles.moderator
         */
        ExcludeRoles: string[];
        /** @description Selects the page to retrieve on paginated responses. Used in combination with the `pageSize` parameter to paginate over results */
        PageNumber: number;
        /** @description Limits the number of items returned in a single paginated response. Used in combination with the `page` parameter to paginate over results */
        PageSize: number;
    };
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    allTimeLeaderboard: {
        parameters: {
            query?: {
                /**
                 * @description List of user roles to exclude.
                 * @example roles.banned&excluded[]=roles.moderator
                 */
                "excluded[]"?: components["parameters"]["ExcludeRoles"];
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
            200: components["responses"]["LeaderboardUserList"];
            500: components["responses"]["Error"];
        };
    };
    weeklyLeaderboard: {
        parameters: {
            query?: {
                /**
                 * @description List of user roles to exclude.
                 * @example roles.banned&excluded[]=roles.moderator
                 */
                "excluded[]"?: components["parameters"]["ExcludeRoles"];
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
            200: components["responses"]["LeaderboardUserList"];
            500: components["responses"]["Error"];
        };
    };
    userPosition: {
        parameters: {
            query?: {
                /**
                 * @description List of user roles to exclude.
                 * @example roles.banned&excluded[]=roles.moderator
                 */
                "excluded[]"?: components["parameters"]["ExcludeRoles"];
                /**
                 * @description Used to rank using this week leaderboard. Allowed values: weekly, all_time. All time is the default.
                 * @example weekly
                 */
                period?: components["parameters"]["Period"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["schemas"]["LeaderboardUserResponse"];
            404: components["schemas"]["UserUnranked"];
            500: components["responses"]["Error"];
        };
    };
    assignPoints: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Json with user and points */
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @description UserId
                     * @example 1
                     */
                    user?: number;
                    /**
                     * @description Amount of points to assign
                     * @example 20
                     */
                    points?: number;
                };
            };
        };
        responses: {
            /** @description Points has been assigned */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            500: components["responses"]["Error"];
        };
    };
    getPointsPerUserBetweenDates: {
        parameters: {
            query: {
                /**
                 * @description Ids of users to retrive points for.
                 * @example 10
                 */
                "userId[]": components["parameters"]["UserIds"];
                /**
                 * @description Starting value for a timeframe. Uses beginning of unix time as default.
                 * @example 2020-05-29 13:33:10
                 */
                "earnedAt[from]"?: components["parameters"]["FromDate"];
                /**
                 * @description Ending value for a timeframe. Uses current time as a default.
                 * @example 2020-05-29 13:33:10
                 */
                "earnedAt[to]"?: components["parameters"]["TillDate"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of users with total points assigned */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserPoints"][];
                };
            };
            /** @description Request is invalid */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            500: components["responses"]["Error"];
        };
    };
}
