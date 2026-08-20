/** Generated from docs/api/user-api.json. Do not edit by hand. */
export interface paths {
    "/user": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetches all users
         * @description Fetches all users
         */
        get: operations["fetchUsers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/user/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetch a single user
         * @description Fetch a single user by UserId
         */
        get: operations["fetchSingleUser"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/gamification/badges": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Fetch list of badges */
        get: operations["list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/gamification/badge/{badgeId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Delete a badge
         * @description Permanently delete a badge identified by ID from community and revoke it from all users
         */
        delete: operations["deleteBadge"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/user/register": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Register a new user
         * @description Returns a Json User. The profile_field option in the request body provides a way to add profile fields to the registration. The key refers to an existing profile field id. Note that profile fields can be set as mandatory registration fields.
         */
        post: operations["register"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/user/{id}/erase": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Deletes an existing user
         * @description Deletes an existing user and anonymizes content created by the user
         */
        delete: operations["erase"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/user/{id}/role": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Add a role to a user
         * @description Adds a role to an existing user
         */
        post: operations["addRole"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/user/bulk/role": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Bulk add roles to users
         * @description Bulk add roles to users
         */
        post: operations["bulkUserAddRole"];
        /**
         * Bulk remove roles from users
         * @description Bulk remove roles from users
         */
        delete: operations["bulkUserRemoveRole"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/user/bulk/badge": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Bulk Award Badges to users
         * @description Bulk Award badges to users
         */
        post: operations["bulkUserAwardBadge"];
        /**
         * Bulk revoke badges from users
         * @description Bulk revoke badges from users
         */
        delete: operations["bulkUserRevokeBadge"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/user/{userId}/role/{roleName}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Revoke a custom role from a user
         * @description Revokes a custom role from an existing user
         */
        delete: operations["revokeRole"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/user/{userId}/badge/{badgeId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Award a badge to an user
         * @description Award a badge identified by ID to the user identified by the user ID
         */
        put: operations["awardBadge"];
        post?: never;
        /**
         * Revoke badge from user
         * @description Revoke badge from user
         */
        delete: operations["revoke_badge"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/user/{field}/{value}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Find User by field / value
         * @description Returns a Json User
         */
        get: operations["findBy"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/user/{id}/{field}/{value}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Update a field in user's profile
         * @description Returns a Json User
         */
        put: operations["UpdateBy"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/user/{id}/profile_field/{field}/{value}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Update a custom field in user's profile
         * @description Returns a Json User
         */
        put: operations["UpdateProfileField"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/user/{id}/profile_field/{field}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Delete a custom field in user's profile
         * @description Returns a Json User
         */
        delete: operations["DeleteProfileField"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/remotelogout/{field}/{value}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Find User by field / value and flag it for logout
         * @description Generates a Remote logout for a User
         */
        delete: operations["remoteLogout"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        Exception: {
            /**
             * @description Generic error message
             * @example Internal Server Error
             */
            readonly message?: string;
        };
        UserRegisteredResponse: {
            /** Format: int32 */
            userid?: number;
            /** @example user@insided.com */
            readonly email?: string;
            /** @example user */
            readonly username?: string;
            readonly rank?: string;
            readonly joindate?: number;
            /**
             * @example {
             *       "facebook": "333ABBDDD",
             *       "oauth2": "4545ag63274"
             *     }
             */
            sso?: {
                [key: string]: string[];
            };
        };
        UserRegisterRequest: {
            /** @example user@insided.com */
            email: string;
            /**
             * @description Username must be unique. It must be between 3 to 30 characters long. It can only contain alphanumeric characters, spaces and the following special characters: . ' - _
             * @example user
             */
            username: string;
            /**
             * @description Password must be at least 6 characters long, it can not contain white space, and it shouldn't consist of one repeated character
             * @example asdTW$sdjksd
             */
            password: string;
            /**
             * @description If specified, must contain exactly one main role, and may contain custom roles.
             * @default [
             *       "roles.registered"
             *     ]
             * @example [
             *       "roles.registered",
             *       "Option A",
             *       "Option B",
             *       "Other"
             *     ]
             */
            user_role: string[];
            /**
             * @example {
             *       "12": "Smith",
             *       "34": "John"
             *     }
             */
            profile_field?: {
                [key: string]: string[];
            };
            /**
             * @example {
             *       "facebook": "333ABBDDD",
             *       "oauth2": "4545ag63274"
             *     }
             */
            sso?: {
                [key: string]: string[];
            };
        };
        FindByUserResponse: {
            /** Format: int32 */
            userid?: number;
            /** @example user@insided.com */
            readonly email?: string;
            /** @example user */
            readonly username?: string;
            readonly rank?: string;
            /**
             * Format: date-time
             * @example 2019-07-16T14:59:00+02:00
             */
            readonly joindate?: string;
            /**
             * @example {
             *       "NormalizedValue": "A string value",
             *       "name": "A field name"
             *     }
             */
            readonly profileFields?: components["schemas"]["ProfileFields"][];
            readonly roles?: components["schemas"]["AuthItems"][];
            /**
             * @example {
             *       "post_count": 0,
             *       "likes": 0,
             *       "likes_given": 0,
             *       "topic_count": 0,
             *       "topic_answered_count": 0
             *     }
             */
            user_statistics?: {
                [key: string]: string[];
            };
            /**
             * @example {
             *       "facebook": "333ABBDDD",
             *       "oauth2": "4545ag63274"
             *     }
             */
            sso?: {
                [key: string]: string[];
            };
        };
        ProfileFields: {
            NormalizedValue?: string;
            name?: string;
        };
        UserResponse: {
            statistics?: {
                /** @example 22 */
                count?: number;
            } & {
                [key: string]: Record<string, never>;
            };
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            _returnIterable: "0";
        } & {
            [key: string]: components["schemas"]["User"];
        };
        IterableUserResponse: {
            users?: components["schemas"]["User"][];
            statistics?: {
                /** @example 22 */
                count?: number;
            } & {
                [key: string]: Record<string, never>;
            };
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            _returnIterable: "1";
        };
        User: {
            /** Format: int32 */
            userid?: number;
            /**
             * Format: int32
             * @description Not in use
             */
            usergroupid?: number;
            /**
             * Format: int32
             * @description Not in use
             */
            membergroupids?: number;
            /**
             * Format: int32
             * @description Not in use
             */
            displaygroupid?: number;
            /** @example user */
            readonly username?: string;
            /** @example user@insided.com */
            readonly email?: string;
            /** @description The number of visible replies created by the user */
            readonly posts?: number;
            /** @description The number of deleted replies created by the user */
            readonly deleted_posts?: number;
            /** @description Bitmask containing values for two personal settings */
            readonly options?: number;
            /** @description Boolean flag for email notifications */
            readonly autosubscribe?: number;
            /** @description Custom options bitmask */
            readonly customoptions?: number;
            /** @description The number of visible topics created by the user */
            readonly topics?: number;
            /** @description The number of replies marked as the best answer */
            readonly solved?: number;
            /** @example 198.199.125.238 */
            readonly ipaddress?: string;
            /** @description Custom user title */
            readonly usertitle?: string;
            /** @description Boolean flag for custom title */
            readonly customtitle?: number;
            /** @description List of session IDs flagged for logout */
            session_ids_flagged_for_logout?: string[];
            /** @description Timestamp for external logout */
            external_logout_at?: string | null;
            /** @description The number of unread private messages */
            readonly pmunread?: number;
            /** @description The total number of topic subscriptions */
            readonly subscriptions?: number;
            /** @description The total number of private messages received */
            readonly pmtotal?: number;
            /** @description The number of users followed by this user */
            readonly following?: number;
            /** @description The number of users following this user */
            readonly followers?: number;
            readonly avatar?: string;
            /** @description User's signature displayed under posts */
            readonly signature?: string;
            /** @description User's reputation score */
            readonly reputation?: number;
            /** @description Timestamp of the user's last session */
            readonly lastvisit?: number;
            /** @description Timestamp of the user's last activity */
            readonly lastactivity?: number;
            /** @description SSO customer UID */
            readonly insided_sso_customeruid?: string;
            /** @description The number of reviews created by the user */
            readonly reviewcount?: number;
            /** @description The number of ratings given by the user */
            readonly ratingcount?: number;
            /** @description ID of the last reply created by the user */
            readonly lastpostid?: number;
            /** @description Timestamp of the user's last reply */
            readonly lastpost?: number;
            /** @description Timestamp of the user's registration */
            readonly joindate?: number;
            /** @description Total likes received by the user */
            readonly likes?: number;
            /** @description Total likes given by the user */
            readonly likes_given?: number;
            /** @description The number of blog posts created by the user */
            readonly blogposts?: number;
            /** @description The number of researches conducted by the user */
            readonly researches?: number;
            readonly rank_id?: number;
            /** @description The name of the rank achieved by the user */
            readonly rank_name?: string;
            /** @description The displayed name of the user's rank */
            readonly rank_display_name?: string;
            /** @description Image representing the rank */
            rank_avatar_icon?: string | null;
            /** @description Thumbnail image for the rank */
            rank_avatar_icon_thumb?: string | null;
            /** @description Boolean flag indicating if the user is a moderator */
            readonly is_moderator?: number;
            /** @description Base URL for CDN */
            readonly cdn?: string;
            /** @description Indicates if replying or creating a topic subscribes the user to notifications */
            readonly autoAddToFavorites?: boolean;
            /** @description Cache dependency key for CRUD operations */
            readonly crudListCacheDependencyKey?: string;
            /** @description User ID */
            id?: string | null;
            _related?: {
                userprofilefields?: {
                    id?: number;
                    userid?: number;
                    profilefieldid?: number;
                    value?: string;
                    profilefield_name?: string;
                    _related?: Record<string, never>[];
                }[];
                badges?: Record<string, never>[];
                badgesCount?: number;
                roles?: {
                    auth_item_id?: number;
                    itemname?: string;
                    userid?: number;
                    bizrule?: string | null;
                    data?: string | null;
                    _related?: {
                        items?: {
                            id?: number;
                            name?: string;
                            type?: number;
                            description?: string | null;
                            bizrule?: string | null;
                            data?: string | null;
                            visible?: number;
                            main?: number;
                            order?: number;
                            exclude_for_spam_check?: number;
                            _related?: Record<string, never>[];
                        };
                    };
                }[];
            };
        };
        BadgesListResponse: {
            /** @example 1 */
            readonly totalItems?: number;
            readonly results?: components["schemas"]["Badge"][];
        };
        Badge: {
            /** @example 1 */
            readonly id?: number;
            /** @example Ready to mingle */
            readonly title?: string;
            /** @example Thanks for being so active around here! :) We hope that you keep inSpiring others with your replies! */
            readonly description?: string;
            /** @example false */
            readonly enableBadgeRules?: boolean;
            /** @example https://uploads-eu-west-1.insided.com/inspired-en/attachment/a1993b51-8a7b-4e89-921a-bef62a5be588.svg */
            readonly image?: string;
            /** @example https://uploads-eu-west-1.insided.com/inspired-en/attachment/a1993b51-8a7b-4e89-921a-bef62a5be588_thumb.svg */
            readonly thumbImage?: string;
        };
        PageInfo: {
            /** @example user */
            readonly username?: string;
            /** @example 4 */
            readonly topic_id?: number;
            /** @example Question1 */
            readonly topic_title?: string;
            /** @example 112 */
            readonly category_id?: number;
            /** @example Welcome */
            readonly category_title?: string;
            /** @example 116 */
            readonly forum_id?: number;
            /** @example News */
            readonly forum_title?: string;
            /** @example vraag */
            readonly prefix_id?: string;
            /** @example 0 */
            readonly content_id?: number;
            /** @example 2006 */
            readonly starter_user_id?: number;
            /** @example modUser01 */
            readonly starter_user_username?: number;
            /** @example  */
            readonly starter_usergroup_title?: string;
            /** @example visible */
            readonly status?: string;
            /** @example 1 */
            readonly visible?: number;
            /** @example 1 */
            readonly open?: string;
            /** @example question */
            readonly content_type?: string;
        };
        ViewUser: {
            /** @example user */
            readonly username?: string;
            /** Format: int32 */
            userid?: number;
            readonly pmtotal?: number;
            readonly pmunread?: number;
            readonly likes?: number;
            readonly subscriptions?: number;
            readonly following?: number;
            readonly followers?: number;
            readonly topics?: number;
            readonly solved?: number;
            readonly likes_given?: number;
            /**
             * @example [
             *       "Truly fantastic"
             *     ]
             */
            readonly badges?: string[];
            /**
             * @example [
             *       "roles.superuser"
             *     ]
             */
            readonly roles?: string[];
            /**
             * @example [
             *       "11"
             *     ]
             */
            readonly roleIds?: number[];
            /** @example 2 */
            readonly favorites?: string;
            readonly rank?: string;
        };
        AuthItems: {
            /**
             * @example {
             *       "name": "roles.moderator",
             *       "main": true
             *     }
             */
            readonly auth_item?: Record<string, never>;
        };
        AuthItem: {
            /** @example roles.moderator */
            readonly name?: string;
            /** @example true */
            readonly main?: boolean;
        };
        Version: {
            /** @example 1501507459 */
            readonly version?: string;
        };
    };
    responses: {
        /** @description Successful response */
        UserRegistered: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": {
                    user?: components["schemas"]["UserRegisteredResponse"];
                };
            };
        };
        /** @description Successful response */
        FindByUser: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": {
                    result?: components["schemas"]["FindByUserResponse"];
                };
            };
        };
        /** @description Not Found */
        NotFound: {
            headers: {
                [name: string]: unknown;
            };
            content?: never;
        };
        /** @description Validation error */
        ValidationError: {
            headers: {
                [name: string]: unknown;
            };
            content?: never;
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
        /** @description Success response */
        Version: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["Version"];
            };
        };
    };
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    fetchUsers: {
        parameters: {
            query?: {
                /** @description page number of a paginated list starts from 1 */
                page?: number;
                /** @description the amount of results displayed in a paginated list, defaults to 25 */
                pageSize?: number;
                /** @description whether to return users as iterable or not. Defaults to false for backwards compatibility */
                _returnIterable?: boolean;
                /**
                 * @description Filter by role names. Use multiple values for filtering by multiple roles.
                 * @example [
                 *       "roles.registered",
                 *       "roles.admin"
                 *     ]
                 */
                "filter[roles.rolename][]"?: string[];
                /**
                 * @description Filter by badge IDs. Use multiple values for filtering by multiple badges.
                 * @example [
                 *       1,
                 *       2,
                 *       3
                 *     ]
                 */
                "filter[badges.badgeid][]"?: number[];
                /**
                 * @description Filter by user IDs. Use multiple values for filtering by multiple users.
                 * @example [
                 *       123,
                 *       456,
                 *       789
                 *     ]
                 */
                "filter[userid][]"?: number[];
                /** @description Filter users who joined on or after this date (yyyy-mm-dd format). */
                "filter[joindate][from]"?: string;
                /** @description Filter users who joined on or before this date (yyyy-mm-dd format). */
                "filter[joindate][to]"?: string;
                /** @description Filter users whose last activity was on or after this date (yyyy-mm-dd format). */
                "filter[lastactivity][from]"?: string;
                /** @description Filter users whose last activity was on or before this date (yyyy-mm-dd format). */
                "filter[lastactivity][to]"?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Returns users */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserResponse"] | components["schemas"]["IterableUserResponse"];
                };
            };
            404: components["responses"]["NotFound"];
            500: components["responses"]["Error"];
        };
    };
    fetchSingleUser: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The id of the user to be retrieved */
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description User data */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["User"];
                };
            };
            404: components["responses"]["NotFound"];
            500: components["responses"]["Error"];
        };
    };
    list: {
        parameters: {
            query?: {
                /** @description page number of a paginated list starts from 1 */
                page?: number;
                /** @description the amount of results displayed in a paginated list, defaults to 10 */
                pageSize?: number;
                /** @description filters the list: e.g. &filters[manualOnly]=1 */
                filters?: Record<string, never>;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Returns badges */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BadgesListResponse"];
                };
            };
            500: components["responses"]["Error"];
        };
    };
    deleteBadge: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The ID of the badge to be deleted */
                badgeId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The badge has been deleted */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            404: components["responses"]["NotFound"];
            500: components["responses"]["Error"];
        };
    };
    register: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description User Object */
        requestBody: {
            content: {
                "application/json": {
                    data?: components["schemas"]["UserRegisterRequest"];
                };
            };
        };
        responses: {
            200: components["responses"]["UserRegistered"];
            400: components["responses"]["ValidationError"];
            404: components["responses"]["NotFound"];
            500: components["responses"]["Error"];
        };
    };
    erase: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The user id to delete. */
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description User erased */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            404: components["responses"]["NotFound"];
            500: components["responses"]["Error"];
        };
    };
    addRole: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description UserId to which role should be added */
                id: string;
            };
            cookie?: never;
        };
        /** @description Roles to be added to the user */
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @example {
                     *       "user_role": [
                     *         "roles.registered"
                     *       ]
                     *     }
                     */
                    data?: unknown;
                };
            };
        };
        responses: {
            /** @description Role has been added to the user. Text containing ‘Done' */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            404: components["responses"]["NotFound"];
            500: components["responses"]["Error"];
        };
    };
    bulkUserAddRole: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Custom Roles to be added to the user */
        requestBody: {
            content: {
                "application/json": {
                    data?: {
                        /**
                         * @example [
                         *       2,
                         *       3
                         *     ]
                         */
                        userIds?: number[];
                        /**
                         * @example [
                         *       7,
                         *       13
                         *     ]
                         */
                        roleIds?: number[];
                    };
                };
            };
        };
        responses: {
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            404: components["responses"]["NotFound"];
            500: components["responses"]["Error"];
        };
    };
    bulkUserRemoveRole: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Custom Roles to be removed from the user */
        requestBody: {
            content: {
                "application/json": {
                    data?: {
                        /**
                         * @example [
                         *       3,
                         *       4
                         *     ]
                         */
                        userIds?: number[];
                        /**
                         * @example [
                         *       2,
                         *       3
                         *     ]
                         */
                        roleIds?: number[];
                    };
                };
            };
        };
        responses: {
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            404: components["responses"]["NotFound"];
            500: components["responses"]["Error"];
        };
    };
    bulkUserAwardBadge: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Badges to be added to the user */
        requestBody: {
            content: {
                "application/json": {
                    data?: {
                        /**
                         * @example [
                         *       8,
                         *       19
                         *     ]
                         */
                        userIds?: number[];
                        /**
                         * @example [
                         *       11,
                         *       12
                         *     ]
                         */
                        badgeIds?: number[];
                    };
                };
            };
        };
        responses: {
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            404: components["responses"]["NotFound"];
            500: components["responses"]["Error"];
        };
    };
    bulkUserRevokeBadge: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Revoke Badge from the user */
        requestBody: {
            content: {
                "application/json": {
                    data?: {
                        /**
                         * @example [
                         *       1,
                         *       6
                         *     ]
                         */
                        userIds?: number[];
                        /**
                         * @example [
                         *       3,
                         *       5
                         *     ]
                         */
                        badgeIds?: number[];
                    };
                };
            };
        };
        responses: {
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            404: components["responses"]["NotFound"];
            500: components["responses"]["Error"];
        };
    };
    revokeRole: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description UserId from which the role will be revoked */
                userId: string;
                /** @description Name of the role to be revoked */
                roleName: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success response with no content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["Error"];
        };
    };
    awardBadge: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The ID of the user to award the badge to */
                userId: number;
                /** @description The ID of the badge to be awarded */
                badgeId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The badge has been awarded */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description The badge was already awarded to this user */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            404: components["responses"]["NotFound"];
            500: components["responses"]["Error"];
        };
    };
    revoke_badge: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The id of the user to revoke badge from. */
                userId: number;
                /** @description The id of the badge to be revoked. */
                badgeId: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Badge has been revoked */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description User with given id doesn't have badge with given id */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description User not found or Badge not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    findBy: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The field to look for */
                field: "email" | "userid" | "oracle_sso_id" | "token_sso_id" | "openidconnect_sso_id" | "facebook_sso_id" | "janrain_sso_id" | "saml_sso_id" | "linkedin_sso_id" | "username" | "oauth2_sso_id";
                /** @description The value to look for */
                value: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["FindByUser"];
            404: components["responses"]["NotFound"];
            500: components["responses"]["Error"];
        };
    };
    UpdateBy: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The id of the user */
                id: number;
                /** @description The name of the field to be updated */
                field: "email" | "oracle_sso_id" | "token_sso_id" | "openidconnect_sso_id" | "facebook_sso_id" | "janrain_sso_id" | "saml_sso_id" | "linkedin_sso_id" | "username" | "oauth2_sso_id" | "avatar";
                /** @description The new value (url encoded) */
                value: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["FindByUser"];
            404: components["responses"]["NotFound"];
            500: components["responses"]["Error"];
        };
    };
    UpdateProfileField: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The id of the user */
                id: number;
                /** @description The name of the field to be updated */
                field: string;
                /** @description The new value (url encoded) */
                value: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["FindByUser"];
            404: components["responses"]["NotFound"];
            500: components["responses"]["Error"];
        };
    };
    DeleteProfileField: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The id of the user */
                id: number;
                /** @description The name of the field that will be deleted */
                field: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["FindByUser"];
            404: components["responses"]["NotFound"];
            500: components["responses"]["Error"];
        };
    };
    remoteLogout: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The field to look for */
                field: "email" | "userid" | "oracle_sso_id" | "token_sso_id" | "openidconnect_sso_id" | "facebook_sso_id" | "janrain_sso_id" | "saml_sso_id" | "linkedin_sso_id" | "username" | "oauth2_sso_id";
                /** @description The value to look for */
                value: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["FindByUser"];
            404: components["responses"]["NotFound"];
            500: components["responses"]["Error"];
        };
    };
}
