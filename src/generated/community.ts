/** Generated from docs/api/community-api.json. Do not edit by hand. */
export interface paths {
    "/topics": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List unified content (topics)
         * @description List and filter all unified content (topics). Optionally apply some filtering/sorting to find topics matching specific criteria. It's possible to list unified content from all categories, or filtered on specific categories. Only the first 10,000 topics matching the filter can be queried, requests for further topics will return a 422 error. *IMPORTANT NOTES* : 1) using parameters like categoryId and categoryIds simultaneously leads to their merging 2) using categoryId(s) and productAreaIds simultaneously gives OR effect
         */
        get: operations["getTopicList"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/categories/{id}/topics": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List unified content (topics) for a category
         * @description List and filter unified content (topics) for a specific category. Optionally apply some filtering/sorting to find topics matching specific criteria inside this category
         */
        get: operations["getTopicListForCategory"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/topics/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Search by term across unified content
         * @description Perform a full text search on unified topics by passing a search term in the `q` parameter. The search will be performed against topic `title` and `content` fields. It's possible to specify additional optional filters to further limit the results. By default this endpoint will only return visible topics
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
    "/articles/create": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create an article
         * @description A moderator can create an article in a category, providing the title and content. <br/><br/> An article is always created as a draft (which later can be published) and open (authors can reply to it). Moderators can optionally add public labels to provide more context about the type of article. It can also optionally have a featured image with a valid url. The allowed image extensions for featured image are `png`, `jpeg`, `jpg`, `gif`.<br/>Moderators can optionally create an article with a poll. A poll consists of a title and options. Existing authors can vote on the poll attached to an article. Authors can like (& unlike!) an article and individual replies to the article. <br /><br />Moderators can optionally create an article as closed, which means that only moderators can reply to it. Moderators can also optionally create an article sticky, which highlights the article at the top of the category on the community.
         */
        post: operations["createArticle"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/{id}/publish": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Publish an article
         * @description A valid `moderatorId` value is required to publish an article.
         */
        post: operations["publishArticle"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/{id}/reply": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Reply to an article */
        post: operations["replyArticle"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/{id}/like": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Like an article */
        post: operations["likeArticle"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/{id}/unlike": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Unlike an article */
        post: operations["unlikeArticle"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/{id}/editContent": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Edit the opening post content of an article
         * @description Any moderator can change the content of an article.
         */
        post: operations["editArticleContent"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/{id}/editTitle": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Edit the title of an article */
        post: operations["editArticleTitle"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/replies/{id}/like": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Like a reply */
        post: operations["likeArticleReply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/replies/{id}/unlike": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Unlike a reply */
        post: operations["unlikeArticleReply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/{id}/editModeratorTags": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Tag an article with moderator tags
         * @description A moderator can edit moderator tags for an article. Note that this will overwrite existing moderator tags.
         */
        post: operations["editArticleModeratorTags"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/{id}/editTags": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Tag an article with tags
         * @description A moderator can edit tags for an article. Note that this will overwrite existing tags.
         */
        post: operations["editArticleTags"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/{id}/tags/add": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Add public tags to an article
         * @description Adds one or more public tags without replacing existing tags.
         */
        post: operations["addArticleTags"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/{id}/tags/remove": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Remove public tags from an article
         * @description Removes one or more public tags without affecting other tags on the article.
         */
        post: operations["removeArticleTags"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/{id}/moderator-tags/add": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Add moderator tags to an article
         * @description Adds one or more moderator tags without replacing existing tags.
         */
        post: operations["addArticleModeratorTags"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/{id}/moderator-tags/remove": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Remove moderator tags from an article
         * @description Removes one or more moderator tags without affecting other tags on the article.
         */
        post: operations["removeArticleModeratorTags"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/{id}/editFeaturedImage": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Edit the featured image of an article
         * @description A moderator can edit a featured image for an article. Note that this will overwrite existing featured image. <br/>The allowed image extensions for featured image are `png`, `jpeg`, `jpg`, `gif`.
         */
        post: operations["editArticleFeaturedImage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/{id}/editFeaturedImageAltText": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Edit the featured image alt text of an article
         * @description A moderator can edit the featured image alt text for an article. Note that this will overwrite existing featured image alt text.
         */
        post: operations["editArticleFeaturedImageAltText"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/{id}/editPublicLabel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Edit the public label of an article
         * @description A moderator can edit the public label for an article. Note that this will overwrite existing public label.
         */
        post: operations["editArticlePublicLabel"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/{id}/toggleStickyState": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Toggle the sticky state of an article */
        post: operations["toggleArticleStickyState"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/{id}/toggleClosed": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Open/Close an article
         * @description A moderator can open or close an article for replies.
         */
        post: operations["toggleArticleClosed"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/{id}/toggleTrashed": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Trash or restore an article
         * @description A moderator can trash an article.
         */
        post: operations["toggleArticleTrashed"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Find article by ID
         * @description To fetch a trashed article a valid `moderatorId` value is required.
         */
        get: operations["getArticle"];
        put?: never;
        post?: never;
        /**
         * Permanently delete a trashed article
         * @description A moderator can permanently deleted a trashed article. Warning: once permanently deleted, an article cannot be restored.
         */
        delete: operations["permanentlyDeleteArticle"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/replies/{id}/toggleTrashed": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Trash/restore a reply */
        post: operations["toggleArticleReplyTrashed"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/replies/{id}/toggleHighlight": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Mark replies as highlighted or remove the highlight */
        post: operations["toggleArticleReplyHighlight"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/replies/{id}/promote": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Promote an existing reply to a new conversation
         * @description A moderator can promote a reply to a new conversation. The title and category for the conversation are required in the request body.
         */
        post: operations["promoteArticleReply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/{id}/move": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Move an article to a different category
         * @description A moderator can move an article to a different category. The moderator must have access to the both the category in which the article currently is as well as the category to which the article is to be moved.
         */
        post: operations["moveArticle"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/replies/{id}/editContent": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Edit a reply
         * @description An author can change the content of the reply for a limited time. Default edit time span is 60 minutes. Moderators can always change the content of the reply by any other author.
         */
        post: operations["editArticleReply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/{id}/addPoll": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Add a poll to an article
         * @description A moderator can add a poll to an article that does not already contain one. Only allowed for draft articles.
         */
        post: operations["addArticlePoll"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/{id}/editPollTitle": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Edit the poll title
         * @description A moderator can edit the title of a poll. If a poll option has votes, then it cannot be edited.
         */
        post: operations["editArticlePollTitle"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/{id}/editPollOptions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Edit the poll options
         * @description A moderator can edit the options of a poll. If a poll option has votes, then it cannot be edited.
         */
        post: operations["editArticlePollOptions"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/{id}/poll": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Show poll results */
        get: operations["getArticlePollResult"];
        put?: never;
        post?: never;
        /**
         * Delete poll attached to an article
         * @description Be cautious when deleting a poll. Once deleted it cannot be restored.
         */
        delete: operations["articleDeletePoll"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/{id}/votePoll": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Add a vote to a poll attached to the given article */
        post: operations["addArticlePollVote"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/replies/{id}/move": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Move an existing reply to an existing topic
         * @description A reply can be moved to an existing article, question or conversation. The topic id and topic type are required in the request body.
         */
        post: operations["moveArticleReply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/{id}/convertToProductUpdate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Convert an article to a product update
         * @description A moderator can convert an article to a product update. If the article has replies, they are converted to product update replies.
         */
        post: operations["convertToProductUpdate"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/{id}/convertToConversation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Convert an article to a conversation
         * @description A moderator can convert an article to a conversation. If the article has replies, they are converted to conversation replies.
         */
        post: operations["convertArticleToConversation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/{id}/changeAuthor": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Change the author of an article
         * @description A moderator can change the author of an article.
         */
        post: operations["changeArticleAuthor"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/replies/{replyId}/approve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Approve a reply */
        post: operations["approveArticleReply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/replies/{replyId}/report": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Report an article reply */
        post: operations["reportArticleReply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/replies/{replyId}/resolve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Resolve reported article reply */
        post: operations["resolveReportedArticleReply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/setModerationLabel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Set moderation label to article
         * @description A moderator can set the moderation label to article.
         */
        post: operations["setArticleModerationLabel"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/unsetModerationLabel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Unset moderation label from article
         * @description A moderator can unset the moderation label from article.
         */
        post: operations["unsetArticleModerationLabel"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/assignModerator": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Assign a moderator to article or articles
         * @description A moderator can assign another moderator to an article or articles.
         */
        post: operations["assignModerator"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/unassignModerator": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Unassign a article or articles
         * @description A moderator can unassign a article or articles.
         */
        post: operations["unassignModerator"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List articles
         * @description Fetches a paginated list of articles sorted by last activity in descending order. Last activity is the time the article was last replied.
         */
        get: operations["getArticleList"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/categories/{id}/articles": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List articles for a category
         * @description Fetches a paginated list of articles in a category. The category must be a public category. The result is sorted by last activity in descending order. Last activity is the time the article was last replied.
         */
        get: operations["getArticleListForCategory"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/{id}/replies": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List replies for an article
         * @description Lists paginated set of replies for an article. By default returns visible replies. A valid `moderatorId` value is required to fetch trashed replies.
         */
        get: operations["getRepliesForArticle"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/{id}/replies/{replyId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetch a reply for an article
         * @description By default returns a visible reply. A valid `moderatorId` value is required to fetch a trashed reply.
         */
        get: operations["getReplyForArticle"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/trashed": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List of trashed articles
         * @description Fetches a paginated list of trashed articles. The result is sorted by last activity in descending order. Last activity is the time the article was last replied.
         */
        get: operations["getTrashedArticleList"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/drafts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List draft articles
         * @description Fetches a paginated list of draft articles. The result is sorted by created date in descending order.
         */
        get: operations["getDraftArticleList"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/replies/{id}/markAsSpam": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Mark article reply as spam
         * @description This action automatically bans the author of the content by default. Ensure the content clearly violates spam policies before proceeding.
         */
        post: operations["markArticleReplyAsSpam"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/articles/replies/{id}/markAsNotSpam": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Mark article reply as not spam
         * @description Allows moderators to correct false spam statuses.
         */
        post: operations["markArticleReplyAsNotSpam"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/categories": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List categories
         * @description Fetches a paginated list of categories. It returns only public categories if the authorId is not specified. The result doesn't project a tree view and the result is sorted by display order of the category in ascending order (Display order starts from 0)
         */
        get: operations["getCategoryList"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/categories/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Find a category by ID
         * @description Finds a category by ID
         */
        get: operations["getCategory"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/categories/getVisibleTopicsCount": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get visible topics count per category
         * @description Returns the count of visible (non-spam, non-trashed, non-pending, non-draft) topics per category. This includes questions, conversations, ideas, articles, and product updates. Note: This endpoint does not return counts for sections.
         */
        get: operations["getVisibleTopicsCount"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/{id}/markAsSpam": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Mark conversation as spam
         * @description This action automatically bans the author of the content by default. Ensure the content clearly violates spam policies before proceeding.
         */
        post: operations["markConversationsAsSpam"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/{id}/markAsNotSpam": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Mark conversation as not spam
         * @description Allows moderators to correct false spam statuses.
         */
        post: operations["markConversationAsNotSpam"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/replies/{id}/markAsSpam": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Mark conversation reply as spam
         * @description This action automatically bans the author of the content by default. Ensure the content clearly violates spam policies before proceeding.
         */
        post: operations["markConversationReplyAsSpam"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/replies/{id}/markAsNotSpam": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Mark conversation reply as not spam
         * @description Allows moderators to correct false spam statuses.
         */
        post: operations["markConversationReplyAsNotSpam"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/start": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Start a conversation
         * @description Authors can start a conversation in a category, providing the title and content of the conversation.<br /><br />A conversation started by an author is always open, meaning the original author and other authors can reply to it. Authors can also like (& unlike!) a conversation and individual replies within the conversation. Authors can also optionally add public tags when starting a conversation. Authors can optionally start a conversation with a poll. A poll consists of a title and options. Existing authors can vote on the poll attached to conversations.<br /><br />Moderators can optionally start a conversation as closed, which means that only moderators can reply to it. Moderators can also optionally start a conversation as sticky, which highlights the conversation at the top of the category on the community.
         */
        post: operations["startConversation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/{id}/like": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Like a conversation */
        post: operations["likeConversation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/{id}/unlike": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Unlike a conversation */
        post: operations["unlikeConversation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/{id}/editContent": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Edit the opening post content of a conversation
         * @description An author can change the content of a conversation for a limited time after starting the conversation. The default edit time span is 60 minutes. <br/>Moderators can always change the content of a conversation that was started by any other author.
         */
        post: operations["editConversationContent"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/{id}/editTags": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Tag a conversation with public tags
         * @description An author can edit tags for their conversations. Note that this will overwrite existing tags.
         */
        post: operations["editConversationTags"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/{id}/tags/add": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Add public tags to a conversation
         * @description Adds one or more public tags without replacing existing tags.
         */
        post: operations["addConversationTags"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/{id}/tags/remove": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Remove public tags from a conversation
         * @description Removes one or more public tags without affecting other tags on the conversation.
         */
        post: operations["removeConversationTags"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/{id}/moderator-tags/add": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Add moderator tags to a conversation
         * @description Adds one or more moderator tags without replacing existing tags.
         */
        post: operations["addConversationModeratorTags"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/{id}/moderator-tags/remove": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Remove moderator tags from a conversation
         * @description Removes one or more moderator tags without affecting other tags on the conversation.
         */
        post: operations["removeConversationModeratorTags"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/{id}/reply": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Reply to a conversation */
        post: operations["replyConversation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/{id}/votePoll": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Add a vote to a poll contained in a given conversation */
        post: operations["addPollVote"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/{id}/toggleTrashed": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Trash or restore a conversation */
        post: operations["toggleConversationTrashed"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/{id}/toggleClosed": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Open/Close a conversation
         * @description A moderator can open or close a conversation for replies.
         */
        post: operations["toggleConversationClosed"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/{id}/move": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Move a conversation to a different category
         * @description A moderator can move a conversation to a different category. The moderator must have access to the both the category in which the conversation currently is as well as the category to which the conversation is to be moved.
         */
        post: operations["moveConversation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/{id}/convert": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Convert a conversation to a question
         * @description A moderator can convert a conversation to a question. If the conversation has replies, they are converted to question replies.
         */
        post: operations["convertConversation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/{id}/convertToArticle": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Convert a conversation to an article
         * @description A moderator can convert a conversation to an article. If the conversation has replies, they are converted to article replies.
         */
        post: operations["convertConversationToArticle"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/{id}/convertToIdea": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Convert a conversation to an idea
         * @description A moderator can convert a conversation to an idea. If the conversation has replies, they are converted to idea replies.
         */
        post: operations["convertConversationToIdea"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/{id}/copy": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Copy a conversation to a category */
        post: operations["copyConversation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/{id}/editTitle": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Edit the title of a conversation */
        post: operations["editConversationTitle"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/{id}/editModeratorTags": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Tag a conversation with moderator tags
         * @description A moderator can edit moderator tags for a conversation. Note that this will overwrite existing moderator tags.
         */
        post: operations["editConversationModeratorTags"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/{id}/toggleStickyState": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Toggle the sticky state of a conversation */
        post: operations["toggleConversationStickyState"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Find conversation by ID
         * @description By default returns a visible conversation. To fetch a trashed conversation a valid `moderatorId` value is required.
         */
        get: operations["getConversation"];
        put?: never;
        post?: never;
        /**
         * Permanently delete a trashed conversation
         * @description A moderator can permanently deleted a trashed conversation. Warning: once permanently deleted, a conversation cannot be restored.
         */
        delete: operations["permanentlyDeleteConversation"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/replies/{id}/toggleTrashed": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Trash/restore a reply */
        post: operations["toggleConversationReplyTrashed"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/replies/{id}/toggleHighlight": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Mark replies as highlighted or remove the highlight */
        post: operations["toggleConversationReplyHighlight"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/replies/{id}/promote": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Promote an existing reply to a new conversation
         * @description A moderator can promote a reply to a new conversation. The title and category for the conversation are required in the request body.
         */
        post: operations["promoteReply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/replies/{id}/move": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Move reply to another topic
         * @description A reply can be moved to an existing article, question or conversation. The topic id and topic type are required in the request body.
         */
        post: operations["moveConversationReply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/replies/{id}/like": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Like a reply */
        post: operations["likeReply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/replies/{id}/unlike": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Unlike a reply */
        post: operations["unlikeReply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/replies/{id}/editContent": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Edit a reply
         * @description An author can change the content of the reply for a limited time. Default edit time span is 60 minutes.<br/>Moderators can always change the content of the reply by any other author.
         */
        post: operations["editConversationReply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/{id}/editPollTitle": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Edit the poll title
         * @description A moderator can edit the title of a poll. If a poll option has votes, then it cannot be edited.
         */
        post: operations["editConversationPollTitle"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/{id}/editPollOptions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Edit the poll options
         * @description A moderator can edit the options of a poll. If a poll option has votes, then it cannot be edited.
         */
        post: operations["editConversationPollOptions"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/{id}/poll": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Show poll results */
        get: operations["getPollResult"];
        put?: never;
        post?: never;
        /**
         * Delete poll
         * @description Be cautious when deleting a poll. Once deleted it cannot be restored.
         */
        delete: operations["deleteConversationPoll"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/{id}/moveToTopic": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Convert a conversation to a reply
         * @description Move a conversation with no visible replies to an existing topic. It can be converted to a reply of an article, question or another conversation. This action will permanently delete any trashed replies the conversation may have.
         */
        post: operations["moveConversationToTopic"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/replies/{id}/pin": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Pin a reply */
        post: operations["pinConversationReply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/replies/{id}/unpin": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Unpin a reply */
        post: operations["unpinConversationReply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/{id}/approve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Approve a conversation */
        post: operations["approveConversation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/replies/{replyId}/approve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Approve a reply */
        post: operations["approveConversationReply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/{id}/report": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Report a conversation */
        post: operations["reportConversation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/replies/{replyId}/report": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Report a conversation reply */
        post: operations["reportConversationReply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/{id}/resolve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Resolve reported conversation */
        post: operations["resolveReportedConversation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/replies/{replyId}/resolve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Resolve reported conversation reply */
        post: operations["resolveReportedConversationReply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/setModerationLabel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Set moderation label to conversation
         * @description A moderator can set the moderation label to conversation.
         */
        post: operations["setConversationModerationLabel"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/unsetModerationLabel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Unset moderation label from conversation
         * @description A moderator can unset the moderation label from conversation.
         */
        post: operations["unsetConversationModerationLabel"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/assignModerator": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Assign a moderator to conversation or conversations
         * @description A moderator can assign another moderator to an conversation or conversations.
         */
        post: operations["conversations_assignModerator_post_assignModerator"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/unassignModerator": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Unassign a conversation or conversations
         * @description A moderator can unassign a conversation or conversations.
         */
        post: operations["conversations_unassignModerator_post_unassignModerator"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List conversations
         * @description Fetches a paginated list of conversations sorted by last activity date in descending order. Last activity is the time the conversation was last replied.
         */
        get: operations["getConversationList"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/categories/{id}/conversations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List conversations for a category
         * @description Fetches a paginated list of conversations in a category. The category must be a public category. The result is sorted by last activity date in descending order. Last activity is the time the conversation was last replied.
         */
        get: operations["getConversationListForCategory"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/trashed": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List trashed conversations
         * @description Fetches a paginated list of trashed conversations. The result is sorted by last activity in descending order. Last activity is the time the conversation was last replied.
         */
        get: operations["getTrashedConversationList"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/{id}/markAsSpam": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Mark idea as spam
         * @description This action automatically bans the author of the content by default. Ensure the content clearly violates spam policies before proceeding.
         */
        post: operations["markIdeaAsSpam"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/{id}/markAsNotSpam": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Mark idea as not spam
         * @description Allows moderators to correct false spam statuses.
         */
        post: operations["markIdeaAsNotSpam"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/replies/{id}/markAsSpam": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Mark idea reply as spam
         * @description This action automatically bans the author of the content by default. Ensure the content clearly violates spam policies before proceeding.
         */
        post: operations["markIdeaReplyAsSpam"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/replies/{id}/markAsNotSpam": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Mark idea reply as not spam
         * @description Allows moderators to correct false spam statuses.
         */
        post: operations["markIdeaReplyAsNotSpam"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/submit": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Submit an idea
         * @description Authors can submit an idea, providing the title and content of the idea.<br /><br />A  submitted idea by an author is always open, meaning the original author and other authors can reply to it. The author's vote is added automatically and they also can unvote their ideas. Authors can also optionally add public tags and product areas when submitting an idea.<br /><br />Moderators can optionally submit an idea as closed, which means that only moderators can reply to it.
         */
        post: operations["submitIdea"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/{id}/vote": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Vote an idea */
        post: operations["voteIdea"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/{id}/unvote": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Unvote an idea */
        post: operations["unvoteIdea"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/{id}/editContent": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Edit the opening post content of an idea
         * @description An author can change the content of an idea for a limited time after submiting the idea. The default edit time span is 60 minutes. <br/>Moderators can always change the content of an idea that was submitted by any other author.
         */
        post: operations["editIdeaContent"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/{id}/editTags": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Tag an idea with public tags
         * @description An author can edit tags for their ideas. Note that this will overwrite existing tags.
         */
        post: operations["editIdeaTags"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/{id}/tags/add": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Add public tags to an idea
         * @description Adds one or more public tags without replacing existing tags.
         */
        post: operations["addIdeaTags"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/{id}/tags/remove": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Remove public tags from an idea
         * @description Removes one or more public tags without affecting other tags on the idea.
         */
        post: operations["removeIdeaTags"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/{id}/moderator-tags/add": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Add moderator tags to an idea
         * @description Adds one or more moderator tags without replacing existing tags.
         */
        post: operations["addIdeaModeratorTags"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/{id}/moderator-tags/remove": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Remove moderator tags from an idea
         * @description Removes one or more moderator tags without affecting other tags on the idea.
         */
        post: operations["removeIdeaModeratorTags"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/{id}/reply": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Reply to an idea */
        post: operations["replyIdea"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/{id}/toggleTrashed": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Trash or restore an idea */
        post: operations["toggleIdeaTrashed"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/{id}/toggleClosed": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Open/Close an idea
         * @description A moderator can open or close an idea for replies.
         */
        post: operations["toggleIdeaClosed"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/{id}/editTitle": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Edit the title of an idea */
        post: operations["editIdeaTitle"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/{id}/editModeratorTags": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Tag an idea with moderator tags
         * @description A moderator can edit moderator tags for an idea. Note that this will overwrite existing moderator tags.
         */
        post: operations["editIdeaModeratorTags"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/{id}/toggleStickyState": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Toggle the sticky state of an idea */
        post: operations["toggleIdeaStickyState"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Find idea by ID
         * @description By default returns a visible idea. To fetch a trashed idea a valid `moderatorId` value is required.
         */
        get: operations["getIdea"];
        put?: never;
        post?: never;
        /**
         * Permanently delete a trashed idea
         * @description A moderator can permanently deleted a trashed idea. Warning: once permanently deleted, an idea cannot be restored.
         */
        delete: operations["permanentlyDeleteIdea"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/replies/{id}/toggleTrashed": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Trash/restore a reply */
        post: operations["toggleIdeaReplyTrashed"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/replies/{id}/toggleHighlight": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Mark replies as highlighted or remove the highlight */
        post: operations["toggleIdeaReplyHighlight"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/replies/{id}/promote": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Promote an existing reply to a new conversation
         * @description A moderator can promote a reply to a new conversation. The title and category for the conversation are required in the request body.
         */
        post: operations["promoteIdeaReply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/replies/{id}/move": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Move reply to another topic
         * @description A reply can be moved to an existing idea. The topic id and topic type are required in the request body.
         */
        post: operations["moveIdeaReply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/replies/{id}/like": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** like a reply */
        post: operations["likeIdeaReply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/replies/{id}/unlike": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Unlike a reply */
        post: operations["unlikeIdeaReply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/replies/{id}/editContent": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Edit a reply
         * @description An author can change the content of the reply for a limited time. Default edit time span is 60 minutes.<br/>Moderators can always change the content of the reply by any other author.
         */
        post: operations["editIdeaReply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/{id}/mergeVotes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Merge votes into another idea
         * @description A moderator can merge the votes from one idea into another idea.
         */
        post: operations["mergeIdeaVotes"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/setModerationLabel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Set moderation label to idea
         * @description A moderator can set the moderation label to idea.
         */
        post: operations["setIdeaModerationLabel"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/unsetModerationLabel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Unset moderation label from idea
         * @description A moderator can unset the moderation label from idea.
         */
        post: operations["unsetIdeaModerationLabel"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/assignModerator": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Assign a moderator to an idea or ideas
         * @description A moderator can assign another moderator to an idea or ideas.
         */
        post: operations["ideas_assignModerator_post_assignModerator"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/unassignModerator": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Unassign an idea or ideas
         * @description A moderator can unassign an idea or ideas.
         */
        post: operations["ideas_unassignModerator_post_unassignModerator"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/createIdeaStatus": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create IdeaStatus */
        post: operations["createIdeaStatus"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/{id}/editIdeaStatus": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Edit IdeaStatus */
        post: operations["editIdeaStatus"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/{id}/deleteIdeaStatus": {
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
         * Permanently delete an idea status
         * @description A moderator can permanently deleted an idea status. Warning: once permanently deleted, an idea status cannot be restored.
         */
        delete: operations["deleteIdeaStatus"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/reorderIdeaStatuses": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Reorder idea statuses
         * @description A moderator can reorder Idea statuses.
         */
        post: operations["reorderIdeaStatuses"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/replies/{id}/pin": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Pin a reply */
        post: operations["pinIdeaReply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/replies/{id}/unpin": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Unpin a reply */
        post: operations["unpinIdeaReply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/{id}/assignIdeaStatus": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Assign an idea status to an idea
         * @description A moderator can assign an idea status to an idea. Warning: This replaces the previously assigned status.
         */
        post: operations["assign_idea_status"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/{id}/editProductAreas": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Attach an idea with product areas
         * @description A moderator can edit product areas for an idea. Note that this will overwrite existing product areas.
         */
        post: operations["editIdeaProductAreas"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/ideaStatuses/{id}/changeType": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Change an Idea Status type
         * @description Optionally set a type for an ideation status. Setting a type will help give meaning to statuses in the analytics dashboards..
         */
        post: operations["changeIdeaStatusType"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/{id}/convertToQuestion": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Convert an Idea to a Question
         * @description A moderator can convert an idea to a question. Note that if an idea has any replies they will be converted as well.
         */
        post: operations["convertIdeaToQuestion"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/{id}/convertToConversation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Convert an Idea to a Conversation
         * @description A moderator can convert an idea to a conversation. Note that if an idea has any replies they will be converted as well.
         */
        post: operations["convertIdeaToConversation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/{id}/approve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Approve an idea */
        post: operations["approveIdea"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/replies/{replyId}/approve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Approve a reply */
        post: operations["approveIdeaReply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/{id}/report": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Report an idea */
        post: operations["reportIdea"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/replies/{replyId}/report": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Report an idea reply */
        post: operations["reportIdeaReply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/{id}/resolve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Resolve reported idea */
        post: operations["resolveReportedIdea"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/replies/{replyId}/resolve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Resolve reported idea reply */
        post: operations["resolveReportedIdeaReply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List ideas
         * @description Fetches a paginated list of ideas sorted by last activity date in descending order. Last activity is the time the idea was last replied.
         */
        get: operations["getIdeaList"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/trashed": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List trashed ideas
         * @description Fetches a paginated list of trashed ideas. The result is sorted by last activity in descending order. Last activity is the time the idea was last replied.
         */
        get: operations["getTrashedIdeaList"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/ideaStatuses": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Idea Statuses
         * @description Fetches a paginated list of idea statuses sorted by creation date in descending order
         */
        get: operations["getIdeaStatusList"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/{id}/replies": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List replies for an idea
         * @description Lists paginated set of replies for an idea. By default returns visible replies. A valid `moderatorId` value is required to fetch trashed replies.
         */
        get: operations["getRepliesForIdea"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ideas/{id}/replies/{replyId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetch a single reply for an idea
         * @description By default returns a visible reply. A valid `moderatorId` value is required to fetch a trashed reply.
         */
        get: operations["getReplyForIdea"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/moderatorTags/delete": {
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
         * Delete moderator tags
         * @description Delete moderator tags by ID. More than one ID can be passed in the request body
         */
        delete: operations["deleteModeratorTags"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/moderatorTags": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List moderator tags
         * @description Fetches a paginated list of moderator tags sorted by ID in ascending order
         */
        get: operations["getModeratorTagList"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productAreas/create": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create ProductArea */
        post: operations["createProductArea"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productAreas/rename": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Rename ProductArea */
        post: operations["renameProductArea"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productAreas/delete": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Delete ProductArea */
        post: operations["deleteProductArea"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productAreas/assign": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Assign ProductAreas to Ideas */
        post: operations["assignProductAreas"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productAreas": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List productAreas */
        get: operations["getProductAreaList"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/replies/{id}/markAsSpam": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Mark productUpdate reply as spam
         * @description This action automatically bans the author of the content by default. Ensure the content clearly violates spam policies before proceeding.
         */
        post: operations["markProductUpdateReplyAsSpam"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/replies/{id}/markAsNotSpam": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Mark productUpdate reply as not spam
         * @description Allows moderators to correct false spam statuses.
         */
        post: operations["markProductUpdateReplyAsNotSpam"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/create": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create a productUpdate
         * @description A moderator can create a productUpdate, providing the title and content. <br/><br/> An productUpdate is always created as a draft (which later can be published) and open (authors can reply to it). Moderators can optionally add public labels to provide more context about the type of productUpdate. It can also optionally have a featured image with a valid url. The allowed image extensions for featured image are `png`, `jpeg`, `jpg`, `gif`.<br/>Moderators can optionally create a productUpdate with a poll. A poll consists of a title and options. Existing authors can vote on the poll attached to a productUpdate. Authors can like (& unlike!) a productUpdate and individual replies to the productUpdate. <br /><br />Moderators can optionally create a productUpdate as closed, which means that only moderators can reply to it.
         */
        post: operations["createProductUpdate"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/{id}/publish": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Publish a productUpdate
         * @description A valid `moderatorId` value is required to publish a productUpdate.
         */
        post: operations["publishProductUpdate"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/{id}/reply": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Reply to a productUpdate */
        post: operations["replyProductUpdate"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/{id}/like": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Like a productUpdate */
        post: operations["likeProductUpdate"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/{id}/unlike": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Unlike a productUpdate */
        post: operations["unlikeProductUpdate"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/{id}/editContent": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Edit the opening post content of a productUpdate
         * @description Any moderator can change the content of a productUpdate.
         */
        post: operations["editProductUpdateContent"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/{id}/editTitle": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Edit the title of a productUpdate */
        post: operations["editProductUpdateTitle"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/replies/{id}/like": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Like a reply */
        post: operations["likeProductUpdateReply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/replies/{id}/unlike": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Unlike a reply */
        post: operations["unlikeProductUpdateReply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/{id}/editModeratorTags": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Tag a productUpdate with moderator tags
         * @description A moderator can edit moderator tags for a productUpdate. Note that this will overwrite existing moderator tags.
         */
        post: operations["editProductUpdateModeratorTags"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/{id}/editTags": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Tag a productUpdate with tags
         * @description A moderator can edit tags for a productUpdate. Note that this will overwrite existing tags.
         */
        post: operations["editProductUpdateTags"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/{id}/tags/add": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Add public tags to a product update
         * @description Adds one or more public tags without replacing existing tags.
         */
        post: operations["addProductUpdateTags"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/{id}/tags/remove": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Remove public tags from a product update
         * @description Removes one or more public tags without affecting other tags on the product update.
         */
        post: operations["removeProductUpdateTags"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/{id}/moderator-tags/add": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Add moderator tags to a product update
         * @description Adds one or more moderator tags without replacing existing tags.
         */
        post: operations["addProductUpdateModeratorTags"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/{id}/moderator-tags/remove": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Remove moderator tags from a product update
         * @description Removes one or more moderator tags without affecting other tags on the product update.
         */
        post: operations["removeProductUpdateModeratorTags"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/{id}/editProductAreas": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Attach a productUpdate with product areas
         * @description A moderator can edit product areas for a productUpdate. Note that this will overwrite existing product areas.
         */
        post: operations["editProductUpdateProductAreas"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/{id}/editFeaturedImage": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Edit the featured image of a productUpdate
         * @description A moderator can edit a featured image for a productUpdate. Note that this will overwrite existing featured image. <br/>The allowed image extensions for featured image are `png`, `jpeg`, `jpg`, `gif`.
         */
        post: operations["editProductUpdateFeaturedImage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/{id}/editFeaturedImageAltText": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Edit the featured image alt text of a productUpdate
         * @description A moderator can edit the featured image alt text for a productUpdate. Note that this will overwrite existing featured image alt text.
         */
        post: operations["editProductUpdateFeaturedImageAltText"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/{id}/editPublicLabel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Edit the public label of a productUpdate
         * @description A moderator can edit the public label for a productUpdate. Note that this will overwrite existing public label.
         */
        post: operations["editProductUpdatePublicLabel"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/{id}/toggleStickyState": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Toggle the sticky state of a productUpdate */
        post: operations["toggleProductUpdateStickyState"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/{id}/toggleClosed": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Open/Close a productUpdate
         * @description A moderator can open or close a productUpdate for replies.
         */
        post: operations["toggleProductUpdateClosed"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/{id}/toggleTrashed": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Trash or restore a productUpdate
         * @description A moderator can trash a productUpdate.
         */
        post: operations["toggleProductUpdateTrashed"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Find productUpdate by ID
         * @description To fetch a trashed productUpdate a valid `moderatorId` value is required.
         */
        get: operations["getProductUpdate"];
        put?: never;
        post?: never;
        /**
         * Permanently delete a trashed productUpdate
         * @description A moderator can permanently deleted a trashed productUpdate. Warning: once permanently deleted, a productUpdate cannot be restored.
         */
        delete: operations["permanentlyDeleteProductUpdate"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/replies/{id}/toggleTrashed": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Trash/restore a reply */
        post: operations["toggleProductUpdateReplyTrashed"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/replies/{id}/toggleHighlight": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Mark replies as highlighted or remove the highlight */
        post: operations["toggleProductUpdateReplyHighlight"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/replies/{id}/promote": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Promote an existing reply to a new conversation
         * @description A moderator can promote a reply to a new conversation. The title and category for the conversation are required in the request body.
         */
        post: operations["promoteProductUpdateReply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/replies/{id}/editContent": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Edit a reply
         * @description An author can change the content of the reply for a limited time. Default edit time span is 60 minutes. Moderators can always change the content of the reply by any other author.
         */
        post: operations["editProductUpdateReply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/{id}/addPoll": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Add a poll to a product update
         * @description A moderator can add a poll to a product update that does not already contain one. Only allowed for draft product updates.
         */
        post: operations["addProductUpdatePoll"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/{id}/editPollTitle": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Edit the poll title
         * @description A moderator can edit the title of a poll. If a poll option has votes, then it cannot be edited.
         */
        post: operations["editProductUpdatePollTitle"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/{id}/editPollOptions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Edit the poll options
         * @description A moderator can edit the options of a poll. If a poll option has votes, then it cannot be edited.
         */
        post: operations["editProductUpdatePollOptions"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/{id}/poll": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Show poll results */
        get: operations["getProductUpdatePollResult"];
        put?: never;
        post?: never;
        /**
         * Delete poll attached to a productUpdate
         * @description Be cautious when deleting a poll. Once deleted it cannot be restored.
         */
        delete: operations["productUpdateDeletePoll"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/{id}/votePoll": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Add a vote to a poll attached to the given productUpdate */
        post: operations["addProductUpdatePollVote"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/replies/{id}/move": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Move an existing reply to an existing topic
         * @description A reply can be moved to an existing productUpdate.
         */
        post: operations["moveProductUpdateReply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/{id}/changeAuthor": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Change the author of a product update
         * @description A moderator can change the author of a product update.
         */
        post: operations["changeProductUpdateAuthor"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/replies/{replyId}/approve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Approve a reply */
        post: operations["approveProductUpdateReply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/replies/{replyId}/report": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Report a product update reply */
        post: operations["reportProductUpdateReply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/replies/{replyId}/resolve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Resolve reported product update reply */
        post: operations["resolveReportedProductUpdateReply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/setModerationLabel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Set moderation label to product update
         * @description A moderator can set the moderation label to product update.
         */
        post: operations["setProductUpdateModerationLabel"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/unsetModerationLabel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Unset moderation label from product update
         * @description A moderator can unset the moderation label from product update.
         */
        post: operations["unsetProductUpdateModerationLabel"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/assignModerator": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Assign a moderator to productUpdate or productUpdates
         * @description A moderator can assign another moderator to an productUpdate or productUpdates.
         */
        post: operations["productUpdates_assignModerator_post_assignModerator"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/unassignModerator": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Unassign a productUpdate or productUpdates
         * @description A moderator can unassign a productUpdate or productUpdates.
         */
        post: operations["productUpdates_unassignModerator_post_unassignModerator"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List productUpdates
         * @description Fetches a paginated list of productUpdates sorted by last activity in descending order. Last activity is the time the productUpdate was last replied.
         */
        get: operations["getProductUpdateList"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/{id}/replies": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List replies for an productUpdate
         * @description Lists paginated set of replies for an productUpdate. By default returns visible replies. A valid `moderatorId` value is required to fetch trashed replies.
         */
        get: operations["getRepliesForProductUpdate"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/{id}/replies/{replyId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetch a reply for an productUpdate
         * @description By default returns a visible reply. A valid `moderatorId` value is required to fetch a trashed reply.
         */
        get: operations["getReplyForProductUpdate"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/trashed": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List of trashed productUpdates
         * @description Fetches a paginated list of trashed productUpdates. The result is sorted by last activity in descending order. Last activity is the time the productUpdate was last replied.
         */
        get: operations["getTrashedProductUpdateList"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/productUpdates/drafts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List draft productUpdates
         * @description Fetches a paginated list of draft productUpdates. The result is sorted by created date in descending order.
         */
        get: operations["getDraftProductUpdateList"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/{id}/markAsSpam": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Mark question as spam
         * @description This action automatically bans the author of the content by default. Ensure the content clearly violates spam policies before proceeding.
         */
        post: operations["markQuestionAsSpam"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/{id}/markAsNotSpam": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Mark question as not spam
         * @description Allows moderators to correct false spam statuses.
         */
        post: operations["markQuestionAsNotSpam"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/replies/{id}/markAsSpam": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Mark question reply as spam
         * @description This action automatically bans the author of the content by default. Ensure the content clearly violates spam policies before proceeding.
         */
        post: operations["markQuestionReplyAsSpam"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/replies/{id}/markAsNotSpam": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Mark question reply as not spam
         * @description Allows moderators to correct false spam statuses.
         */
        post: operations["markQuestionReplyAsNotSpam"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/ask": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Ask a question
         * @description An author can ask a question in a category, providing the title and content. <br/><br/> A question asked by an author is always open, meaning the original author and other authors can reply to it. Authors can also like (& unlike!) a question and individual replies to the question. Authors can also optionally add public tags when asking a question. Authors can optionally ask a question with a poll. A poll consists of a title and options. Existing authors can vote on the poll attached to the question.<br /><br />Moderators can optionally ask a question as closed, which means that only moderators can reply to it. Moderators can also optionally ask a question as sticky, which highlights the question at the top of the category on the community.
         */
        post: operations["askQuestion"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/{id}/editTags": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Tag a question with public tags
         * @description An author can edit tags for their questions. Note that this will overwrite existing tags.
         */
        post: operations["editQuestionTags"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/{id}/tags/add": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Add public tags to a question
         * @description Adds one or more public tags without replacing existing tags.
         */
        post: operations["addQuestionTags"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/{id}/tags/remove": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Remove public tags from a question
         * @description Removes one or more public tags without affecting other tags on the question.
         */
        post: operations["removeQuestionTags"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/{id}/moderator-tags/add": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Add moderator tags to a question
         * @description Adds one or more moderator tags without replacing existing tags.
         */
        post: operations["addQuestionModeratorTags"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/{id}/moderator-tags/remove": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Remove moderator tags from a question
         * @description Removes one or more moderator tags without affecting other tags on the question.
         */
        post: operations["removeQuestionModeratorTags"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/{id}/reply": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Reply to a question */
        post: operations["replyQuestion"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/{id}/votePoll": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Add a vote to a poll contained in a given question */
        post: operations["addQuestionPollVote"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/{id}/like": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Like a question */
        post: operations["likeQuestion"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/{id}/unlike": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Unlike a question */
        post: operations["unlikeQuestion"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/replies/{replyId}/answer": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Mark a reply to a question as the answer
         * @description The author who originally asked the question or any moderator can mark a reply that resolves the question as answer. <br/> A question can only have one answer. Note, as the question receives more replies the answer can be updated by the author (or any moderator) who considers another reply to be a more suitable answer.
         */
        post: operations["answerQuestion"];
        /**
         * Remove an answer from a question
         * @description The author who originally asked the question or any moderator can remove an answer from a question.
         */
        delete: operations["removeQuestionAnswer"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/replies/{replyId}/toggleHighlight": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Mark replies as highlighted or remove the highlight */
        post: operations["toggleQuestionReplyHighlight"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/replies/{replyId}/promote": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Promote an existing reply to a new conversation
         * @description A moderator can promote a reply to a new conversation. The title and category for the conversation are required in the request body.
         */
        post: operations["promoteQuestionReply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/{id}/toggleTrashed": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Trash or restore a question */
        post: operations["toggleQuestionTrashedAction"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/{id}/toggleClosed": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Open/Close a question
         * @description A moderator can open or close a question for replies.
         */
        post: operations["toggleQuestionClosed"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/{id}/convert": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Convert a question to a conversation
         * @description A moderator can convert a question to a conversation. If the question has replies, they are converted to conversation replies.
         */
        post: operations["convertQuestion"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/{id}/convertToIdea": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Convert a question to an idea
         * @description A moderator can convert a question to an idea. If the question has replies, they are converted to idea replies.
         */
        post: operations["convertQuestionToIdea"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/{id}/move": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Move a question to a different category
         * @description A moderator can move a question to a different category. The moderator must have access to the both the category in which the question currently is as well as the category to which the question is to be moved.
         */
        post: operations["moveQuestion"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/{id}/editTitle": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Edit the title of a question */
        post: operations["editQuestionTitle"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/{id}/editModeratorTags": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Tag a question with moderator tags
         * @description A moderator can edit moderator tags for a question. Note that this will overwrite existing moderator tags.
         */
        post: operations["editQuestionModeratorTags"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/{id}/editContent": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Edit the opening post content of a question
         * @description An author can change the content of a question for a limited time after asking the question. The default edit time span is 60 minutes. <br/>Moderators can always change the content of a question that was started by any other author.
         */
        post: operations["editQuestionContent"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/{id}/toggleStickyState": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Toggle the sticky state of a question */
        post: operations["toggleQuestionStickyState"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/replies/{replyId}/move": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Move an existing reply to an existing topic
         * @description A reply can be moved to an existing article, question or conversation. The topic id and topic type are required in the request body.
         */
        post: operations["moveQuestionReply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/replies/{replyId}/toggleTrashed": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Trash/restore a reply */
        post: operations["toggleQuestionReplyTrashed"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Find question by ID
         * @description By default returns a visible question. To fetch a trashed question a valid `moderatorId` value is required.
         */
        get: operations["getQuestion"];
        put?: never;
        post?: never;
        /**
         * Permanently delete a trashed question
         * @description A moderator can permanently deleted a trashed question. Warning: once permanently deleted, a question cannot be restored.
         */
        delete: operations["permanentlyDeleteQuestion"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/replies/{replyId}/editContent": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Edit a reply
         * @description An author can change the content of the reply for a limited time. Default edit time span is 60 minutes. Moderators can always change the content of the reply by any other author.
         */
        post: operations["editQuestionReply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/replies/{replyId}/like": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Like a reply */
        post: operations["likeQuestionReply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/replies/{replyId}/unlike": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Unlike a reply */
        post: operations["unlikeQuestionReply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/{id}/editPollTitle": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Edit the poll title
         * @description A moderator can edit the title of a poll. If a poll option has votes, then it cannot be edited.
         */
        post: operations["editQuestionPollTitle"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/{id}/editPollOptions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Edit the poll options
         * @description A moderator can edit the options of a poll. If a poll option has votes, then it cannot be edited.
         */
        post: operations["editQuestionPollOptions"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/{id}/poll": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Show poll results */
        get: operations["getQuestionPollResult"];
        put?: never;
        post?: never;
        /**
         * Delete poll attached to a question
         * @description Be cautious when deleting a poll. Once deleted it cannot be restored.
         */
        delete: operations["deleteQuestionPoll"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/{id}/moveToTopic": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Convert a question to a reply
         * @description Move a question with no visible replies to an existing topic. It can be converted to a reply of an article, conversation or another question. This action will permanently delete any trashed replies the question may have.
         */
        post: operations["moveQuestionToTopic"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/{id}/approve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Approve a question */
        post: operations["approveQuestion"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/replies/{replyId}/approve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Approve a reply */
        post: operations["approveQuestionReply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/{id}/report": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Report a question */
        post: operations["reportQuestion"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/replies/{replyId}/report": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Report a question reply */
        post: operations["reportQuestionReply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/{id}/resolve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Resolve reported question */
        post: operations["resolveReportedQuestion"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/replies/{replyId}/resolve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Resolve reported question reply */
        post: operations["resolveReportedQuestionReply"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/setModerationLabel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Set moderation label to question
         * @description A moderator can set the moderation label to question.
         */
        post: operations["setQuestionModerationLabel"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/unsetModerationLabel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Unset moderation label from question
         * @description A moderator can unset the moderation label from question.
         */
        post: operations["unsetQuestionModerationLabel"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/assignModerator": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Assign a moderator to question or questions
         * @description A moderator can assign another moderator to an question or questions.
         */
        post: operations["questions_assignModerator_post_assignModerator"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/unassignModerator": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Unassign a question or questions
         * @description A moderator can unassign a question or questions.
         */
        post: operations["questions_unassignModerator_post_unassignModerator"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/{id}/replies": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List replies for a question
         * @description Lists paginated set of replies for a question. By default returns visible replies. A valid `moderatorId` value is required to fetch trashed replies.
         */
        get: operations["getRepliesForQuestion"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/{id}/replies/{replyId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetch a single reply for a question
         * @description By default returns a visible reply. A valid `moderatorId` value is required to fetch a trashed reply.
         */
        get: operations["getQuestionReply"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List questions
         * @description Fetches a paginated list of questions sorted by last activity in descending order. Last activity is the time the question was last replied.
         */
        get: operations["getQuestionList"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/categories/{id}/questions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List questions for a category
         * @description Fetches a paginated list of questions in a category. The category must be a public category. The result is sorted by last activity in descending order. Last activity is the time the question was last replied.
         */
        get: operations["getQuestionListForCategory"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/questions/trashed": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List trashed questions
         * @description Fetches a paginated list of trashed questions. The result is sorted by last activity in descending order. Last activity is the time the question was last replied.
         */
        get: operations["getTrashedQuestionList"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/{id}/replies": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List replies for a conversation
         * @description Lists paginated set of replies for a conversation. By default returns visible replies. A valid `moderatorId` value is required to fetch trashed replies.
         */
        get: operations["getRepliesForConversation"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/conversations/{id}/replies/{replyId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetch a single reply for a conversation
         * @description By default returns a visible reply. A valid `moderatorId` value is required to fetch a trashed reply.
         */
        get: operations["getReplyForConversation"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tags/create": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create public tag */
        post: operations["createPublicTag"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tags/rename": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Rename public tag */
        post: operations["renamePublicTag"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tags/delete": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Delete public tag */
        post: operations["deletePublicTag"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tags/merge": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Merge public tags */
        post: operations["mergePublicTags"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tags": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List public tags */
        get: operations["getPublicTagsList"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/webhooks/{eventName}/subscriptions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Subscribe URL to webhook event */
        post: operations["subscribeWebhook"];
        /** Unsubscribe url from webhook event */
        delete: operations["unsubscribeUrlFromWebhook"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/webhooks/{eventName}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Unsubscribe All urls from webhook event */
        delete: operations["unsubscribeAllUrlsFromWebhook"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/webhooks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List of Events Webhook subscriptions for a given event. */
        get: operations["listEventWebhookSubscriptions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/category/getTree": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get categories tree
         * @description Returns a hierarchical tree structure of categories filtered by module(s). The response is organized by category module, with each category containing its nested children recursively. Categories are sorted by displayOrder. If topLevelSectionIds is provided, only the specified top-level sections are returned (this filter is only available when querying a single category module).
         */
        get: operations["getCategoryTree"];
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
        Poll: {
            /** @example Which option sounds better? */
            title: string;
            /**
             * @example [
             *       "Option A",
             *       "Option B",
             *       "Other"
             *     ]
             */
            options: string[];
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
        Exception: {
            /**
             * @description Generic error message
             * @example Internal Server Error
             */
            readonly message?: string;
        };
        Tag: string;
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
        Links: {
            /** @description The API urls of the requested object */
            self?: unknown;
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
        AddArticlePollRequest: {
            /** @example What is your favourite feature? */
            title: string;
            /**
             * @example [
             *       "Option A",
             *       "Option B"
             *     ]
             */
            options: string[];
        };
        /**
         * @example {
         *       "id": "1",
         *       "publicId": "5",
         *       "title": "Let's create an article",
         *       "featuredImage": "https://example.com/some-optional-image.png",
         *       "featuredImageAltText": "Alt text for the featured image",
         *       "publicLabel": "new",
         *       "content": "This is the content of a new article",
         *       "author": {
         *         "id": 7,
         *         "username": "AwesomeUser",
         *         "customTitle": "Employee",
         *         "signature": "Always here to help you...",
         *         "avatar": "http://example.com/avatar123.jpg",
         *         "reputation": {
         *           "rank": "Super Hero",
         *           "rankIcon": "http://superhero.rank/icon.png",
         *           "rankIconThumb": "http://superhero.rank/icon_thumb.png",
         *           "likesReceived": 68,
         *           "repliesMade": 324,
         *           "badgesReceived": [
         *             "http://frequent-poster.badge/icon.png",
         *             "http://active-community-member.badge/icon.png"
         *           ]
         *         }
         *       },
         *       "categoryId": "6",
         *       "createdAt": "2017-04-10T15:29:06+00:00",
         *       "replyCount": 21,
         *       "spamReplyCount": 21,
         *       "pendingReplyCount": 20,
         *       "trashedReplyCount": 19,
         *       "totalReplyCount": 18,
         *       "tags": [
         *         "announcement",
         *         "important article"
         *       ],
         *       "moderatorTags": {
         *         "type": "object",
         *         "additionalProperties": true
         *       },
         *       "sticky": false,
         *       "closed": true,
         *       "trashed": false,
         *       "containsPoll": false,
         *       "lastEdit": {
         *         "id": "1",
         *         "editor": {
         *           "id": 7,
         *           "username": "AwesomeUser",
         *           "avatar": ""
         *         },
         *         "editedAt": "2017-04-11T15:29:06+00:00"
         *       },
         *       "scheduledBy": {
         *         "id": 7,
         *         "username": "AwesomeUser"
         *       },
         *       "status": "published",
         *       "publishedAt": "2017-05-10T15:29:06+00:00",
         *       "isPreviewPublic": true,
         *       "seoCommunityUrl": "/category-name-6/let-s-create-an-article-5",
         *       "_links": {
         *         "self": {
         *           "href": "/articles/1"
         *         }
         *       }
         *     }
         */
        Article: {
            readonly id?: string;
            readonly publicId?: string;
            readonly title?: string;
            readonly featuredImage?: string;
            readonly featuredImageAltText?: string;
            readonly publicLabel?: string;
            readonly body?: string;
            author?: components["schemas"]["ConversationAuthor"];
            readonly categoryId?: string;
            /** Format: date-time */
            readonly createdAt?: string;
            /** Format: date-time */
            readonly publishedAt?: string;
            /** Format: date-time */
            readonly lastActivityAt?: string;
            /** Format: date-time */
            readonly lastModifiedAt?: string;
            /** Format: int32 */
            readonly replyCount?: number;
            /** Format: int32 */
            readonly spamReplyCount?: number;
            /** Format: int32 */
            readonly pendingReplyCount?: number;
            /** Format: int32 */
            readonly totalReplyCount?: number;
            /** Format: int32 */
            readonly trashedReplyCount?: number;
            /** Format: int32 */
            readonly inclusiveReplyCount?: number;
            /** Format: int32 */
            readonly inclusiveVisibleReplyCount?: number;
            readonly tags?: string[];
            readonly moderatorTags?: string[];
            readonly likedBy?: string[];
            readonly sticky?: boolean;
            readonly closed?: boolean;
            readonly trashed?: boolean;
            readonly containsPoll?: boolean;
            lastEdit?: components["schemas"]["ArticleEdit"];
            readonly status?: string;
            scheduledBy?: components["schemas"]["Editor"];
            /** Format: date-time */
            readonly scheduledAt?: string;
            readonly poll?: string[];
            /** @example true */
            readonly isPreviewPublic?: boolean;
            readonly seoCommunityUrl?: string;
            _links?: components["schemas"]["Links"];
        };
        ArticleEdit: {
            readonly id?: string;
            readonly editor?: string[];
            readonly editedAt?: boolean;
        };
        ArticleList: {
            result?: components["schemas"]["Article"][];
        };
        ArticlePollVoteRequest: {
            /** @example Option B */
            selectedOption: string;
        };
        ArticleReply: {
            /** @example 2 */
            readonly id?: string;
            /** @example 5 */
            readonly publicReplyId?: string;
            /** @example I completely agree with the topic starter */
            readonly content?: string;
            author?: components["schemas"]["ConversationAuthor"];
            /**
             * Format: date-time
             * @example 2017-04-10T15:29:06+00:00
             */
            readonly repliedAt?: string;
            /** Format: int32 */
            readonly inclusiveReplyCount?: number;
            /** Format: int32 */
            readonly inclusiveVisibleReplyCount?: number;
            /** @example false */
            readonly trashed?: boolean;
            readonly spam?: boolean;
            readonly reported?: boolean;
            readonly reportedContent?: unknown;
            /** @example false */
            readonly pendingApproval?: boolean;
            /** @example false */
            readonly highlighted?: boolean;
            readonly likedBy?: string[];
            /**
             * @description Direct URL to this reply
             * @example https://community.example.com/category-1/topic-title-123?postid=5#post5
             */
            readonly permalink?: string;
        };
        ArticleReplyList: {
            result?: components["schemas"]["ArticleReply"][];
        };
        AssignArticleModeratorRequest: {
            articleIds: string[];
            /** @example 6 */
            assignedTo: string;
        };
        ChangeArticleAuthorRequest: {
            /** @example 7 */
            authorId: string;
        };
        CreateArticleRequest: {
            /** @example This is an interesting article */
            title: string;
            /**
             * @description Supported types: 'png', 'jpeg', 'jpg', 'gif'
             * @example https://example.com/some-optional-image.png
             */
            featuredImage?: string;
            /**
             * @description Alternative text description for the featured image
             * @example Alt text for the featured image
             */
            featuredImageAltText?: string;
            /** @example New */
            publicLabel?: string;
            /** @example This will explain all you need to know about everything */
            content: string;
            /**
             * Format: int32
             * @example 31
             */
            categoryId: number;
            poll?: components["schemas"]["Poll"];
            /**
             * @example [
             *       "question",
             *       "urgent"
             *     ]
             */
            tags?: components["schemas"]["Tag"][];
            /**
             * @description Setting this property requires a moderator
             * @example false
             */
            sticky?: boolean;
            /**
             * @description Setting this property requires a moderator
             * @example false
             */
            closed?: boolean;
            /**
             * @description Setting this property requires a moderator
             * @example [
             *       "highlighted"
             *     ]
             */
            moderatorTags?: components["schemas"]["Tag"][];
        };
        EditArticleContentRequest: {
            /** @example My updated content */
            content: string;
        };
        EditArticleFeaturedImageAltTextRequest: {
            /**
             * @description Alternative text description for the featured image
             * @example Alt text for the featured image
             */
            featuredImageAltText: string;
        };
        EditArticleFeaturedImageRequest: {
            /** @example http://example.com/featuredImage.jpg */
            featuredImage: string;
        };
        EditArticleModeratorTagsRequest: {
            /**
             * @example [
             *       "important",
             *       "announcement"
             *     ]
             */
            moderatorTags: components["schemas"]["Tag"][];
        };
        EditArticlePollOptionsRequest: {
            /**
             * @example [
             *       "option A",
             *       "option B"
             *     ]
             */
            options: components["schemas"]["EditArticlePollOptionsRequest"][];
        };
        EditArticlePollTitleRequest: {
            /** @example My updated poll title */
            title: string;
        };
        EditArticlePublicLabelRequest: {
            /** @example News */
            publicLabel: string;
        };
        EditArticleReplyContentRequest: {
            /** @example My updated content */
            content: string;
        };
        EditArticleTagsRequest: {
            /**
             * @example [
             *       "important",
             *       "announcement"
             *     ]
             */
            tags: components["schemas"]["Tag"][];
        };
        EditArticleTitleRequest: {
            /** @example My updated title */
            title: string;
        };
        Editor: {
            readonly id?: string;
            readonly username?: string;
            readonly avatar?: string;
        };
        ArticleMoveReplyRequest: {
            /** @example 6 */
            topicId: string;
            /** @example question */
            topicType: string;
        };
        PromoteArticleReplyToConversationRequest: {
            /**
             * Format: int32
             * @example 31
             */
            categoryId: number;
            /** @example I have a question */
            title?: string;
        };
        ReplyArticleRequest: {
            /** @example Can anyone help me? */
            content: string;
            /**
             * @description Setting this to true will create a highlighted reply. This will require moderator access
             * @example false
             */
            highlight?: boolean;
        };
        SetArticleModerationLabelRequest: {
            articleIds: string[];
            /** @example 6 */
            moderationLabelId: string;
        };
        ToggleArticleClosedRequest: {
            /** @example false */
            closed: boolean;
        };
        ToggleArticleReplyHighlightRequest: {
            /** @example false */
            highlighted: boolean;
        };
        ToggleArticleReplyTrashedRequest: {
            /** @example false */
            trashed: boolean;
        };
        ToggleArticleStickyStateRequest: {
            /** @example false */
            sticky: boolean;
        };
        ToggleArticleTrashedRequest: {
            /** @example false */
            trashed: boolean;
        };
        UnassignArticleModeratorRequest: {
            articleIds: string[];
        };
        UnsetArticleModerationLabelRequest: {
            articleIds: string[];
        };
        AbstractReportRequest: {
            reason: string;
        };
        AddModeratorTagsRequest: {
            /**
             * @example [
             *       "important",
             *       "announcement"
             *     ]
             */
            tags: components["schemas"]["Tag"][];
        };
        AddPublicTagsRequest: {
            /**
             * @example [
             *       "important",
             *       "announcement"
             *     ]
             */
            tags: components["schemas"]["Tag"][];
        };
        AssignBugStatusRequest: {
            /**
             * Format: int32
             * @description The ID of the bug status to assign
             * @example 3
             */
            bugStatusId: number;
        };
        MoveRequest: {
            /**
             * Format: int32
             * @example 31
             */
            categoryId: number;
        };
        RemoveCategoryRequest: {
            [key: string]: unknown;
        };
        RemoveModeratorTagsRequest: {
            /**
             * @example [
             *       "important",
             *       "announcement"
             *     ]
             */
            tags: components["schemas"]["Tag"][];
        };
        RemovePublicTagsRequest: {
            /**
             * @example [
             *       "important",
             *       "announcement"
             *     ]
             */
            tags: components["schemas"]["Tag"][];
        };
        ContentStatusDto: {
            readonly id?: number;
            readonly name?: string;
            readonly backgroundColor?: string;
            readonly textColor?: string;
        };
        AssignConversationModeratorRequest: {
            conversationIds: string[];
            /** @example 6 */
            assignedTo: string;
        };
        /**
         * @example {
         *       "id": "1",
         *       "name": "An example category",
         *       "order": 0
         *     }
         */
        Category: {
            readonly id?: string;
            readonly name?: string;
            readonly order?: number;
        };
        CategoryList: {
            result?: components["schemas"]["Category"][];
        };
        /**
         * @example {
         *       "id": "1",
         *       "publicId": "5",
         *       "title": "Let's start a conversation",
         *       "content": "This is the opening post of a new conversation",
         *       "author": {
         *         "id": 7,
         *         "username": "AwesomeUser",
         *         "customTitle": "Employee",
         *         "signature": "Always here to help you...",
         *         "avatar": "http://example.com/avatar123.jpg",
         *         "reputation": {
         *           "rank": "Super Hero",
         *           "rankIcon": "http://superhero.rank/icon.png",
         *           "rankIconThumb": "http://superhero.rank/icon_thumb.png",
         *           "likesReceived": 68,
         *           "repliesMade": 324,
         *           "badgesReceived": [
         *             "http://frequent-poster.badge/icon.png",
         *             "http://active-community-member.badge/icon.png"
         *           ]
         *         }
         *       },
         *       "categoryId": "6",
         *       "startedAt": "2017-04-10T15:29:06+00:00",
         *       "lastActivityAt": "2017-04-10T18:29:06+00:00",
         *       "replyCount": 21,
         *       "spamReplyCount": 21,
         *       "pendingReplyCount": 20,
         *       "trashedReplyCount": 19,
         *       "totalReplyCount": 18,
         *       "tags": [
         *         "announcement",
         *         "first topic"
         *       ],
         *       "moderatorTags": {
         *         "type": "object",
         *         "additionalProperties": true
         *       },
         *       "sticky": false,
         *       "closed": true,
         *       "trashed": false,
         *       "pendingApproval": false,
         *       "containsPoll": false,
         *       "pinnedReplyId": "1",
         *       "seoCommunityUrl": "/category-name-6/let-s-start-a-conversation-5"
         *     }
         */
        Conversation: {
            readonly id?: string;
            readonly publicId?: string;
            readonly title?: string;
            readonly content?: string;
            author?: components["schemas"]["ConversationAuthor"];
            readonly categoryId?: string;
            /** Format: date-time */
            readonly startedAt?: string;
            /** Format: date-time */
            readonly lastActivityAt?: string;
            /** Format: int32 */
            readonly replyCount?: number;
            /** Format: int32 */
            readonly spamReplyCount?: number;
            /** Format: int32 */
            readonly pendingReplyCount?: number;
            /** Format: int32 */
            readonly totalReplyCount?: number;
            /** Format: int32 */
            readonly trashedReplyCount?: number;
            /** Format: int32 */
            readonly inclusiveReplyCount?: number;
            /** Format: int32 */
            readonly inclusiveVisibleReplyCount?: number;
            readonly tags?: string[];
            readonly moderatorTags?: string[];
            readonly likedBy?: string[];
            readonly sticky?: boolean;
            readonly closed?: boolean;
            readonly trashed?: boolean;
            readonly spam?: boolean;
            readonly reported?: boolean;
            readonly reportedContent?: unknown;
            readonly containsPoll?: boolean;
            readonly pinnedReplyId?: string;
            readonly seoCommunityUrl?: string;
        };
        ConversationAuthor: {
            /**
             * @description Author ID
             * @example 7
             */
            id?: string;
            /**
             * @description Username of the author
             * @example john-doe
             */
            username?: string;
            /**
             * @description Custom title of the author
             * @example awesome_user
             */
            customTitle?: string;
            /**
             * @description Custom title of the author
             * @example awesome_user
             */
            signature?: string;
            /**
             * @description Avatar of the author
             * @example http://example.com/avatar123.jpg
             */
            avatar?: string;
            reputation?: components["schemas"]["Reputation"];
        };
        ConversationList: {
            result?: components["schemas"]["Conversation"][];
        };
        CopyConversationRequest: {
            categoryIds: string[];
        };
        /**
         * @description List of conversation IDs for the newly created copies
         * @example [
         *       "6",
         *       "10",
         *       "23"
         *     ]
         */
        CopyConversationResult: string[];
        EditConversationContentRequest: {
            /** @example My updated content */
            content: string;
        };
        EditConversationModeratorTagsRequest: {
            /**
             * @example [
             *       "important",
             *       "announcement"
             *     ]
             */
            moderatorTags: components["schemas"]["Tag"][];
        };
        EditConversationPollOptionsRequest: {
            /**
             * @example [
             *       "option A",
             *       "option B"
             *     ]
             */
            options: components["schemas"]["EditConversationPollOptionsRequest"][];
        };
        EditConversationPollTitleRequest: {
            /** @example My updated poll title */
            title: string;
        };
        EditConversationTagsRequest: {
            /**
             * @example [
             *       "improvement",
             *       "suggestion"
             *     ]
             */
            tags: components["schemas"]["Tag"][];
        };
        EditConversationTitleRequest: {
            /** @example My updated title */
            title: string;
        };
        EditReplyContentRequest: {
            /** @example My updated content */
            content: string;
        };
        MoveConversationToTopicRequest: {
            /** @example 6 */
            topicId: string;
            /** @example question */
            topicType: string;
        };
        MoveReplyRequest: {
            /** @example 6 */
            topicId: string;
            /** @example conversation */
            topicType: string;
        };
        /**
         * @example {
         *       "title": "My Poll",
         *       "votes": {
         *         "Option A": 0,
         *         "Option B": 2,
         *         "Option C": 0
         *       }
         *     }
         */
        PollResult: {
            title?: string;
            votes?: string;
        };
        PollVoteRequest: {
            /** @example Option B */
            selectedOption: string;
        };
        PromoteReplyToConversationRequest: {
            /**
             * Format: int32
             * @example 31
             */
            categoryId: number;
            /** @example I have a question */
            title?: string;
        };
        Reply: {
            /** @example 2 */
            readonly id?: string;
            /** @example 5 */
            readonly publicReplyId?: string;
            /** @example I completely agree with the topic starter */
            readonly content?: string;
            author?: components["schemas"]["ConversationAuthor"];
            /**
             * Format: date-time
             * @example 2017-04-10T15:29:06+00:00
             */
            readonly repliedAt?: string;
            /** Format: int32 */
            readonly inclusiveReplyCount?: number;
            /** Format: int32 */
            readonly inclusiveVisibleReplyCount?: number;
            /** @example false */
            readonly trashed?: boolean;
            readonly spam?: boolean;
            readonly reported?: boolean;
            readonly reportedContent?: unknown;
            /** @example false */
            readonly pendingApproval?: boolean;
            /** @example false */
            readonly highlighted?: boolean;
            readonly likedBy?: string[];
            /**
             * @description Direct URL to this reply
             * @example https://community.example.com/category-1/topic-title-123?postid=5#post5
             */
            readonly permalink?: string;
        };
        ReplyConversationRequest: {
            /** @example Can anyone help me? */
            content: string;
            /**
             * @description Setting this to true will create a highlighted reply. This will require moderator access
             * @example false
             */
            highlight?: boolean;
        };
        ReplyList: {
            result?: components["schemas"]["Reply"][];
        };
        Reputation: {
            /**
             * @description Rank of the author
             * @example senior_replier
             */
            rank?: string;
            /**
             * @description Rank icon
             * @example http://example.com/rank-icon.jpg
             */
            rankIcon?: string;
            /**
             * @description Rank icon thumbnail
             * @example http://example.com/rank-icon-thumbnail.jpg
             */
            rankIconThumbnail?: string;
            /** @description Number of likes the author received */
            likesReceived?: number;
            /** @description Total number of replies the author made in the community */
            repliesMade?: number;
        };
        SetConversationModerationLabelRequest: {
            conversationIds: string[];
            /** @example 6 */
            moderationLabelId: string;
        };
        StartConversationRequest: {
            /** @example Welcome to the community */
            title: string;
            /** @example Is this your first visit to our community-driven Help Center? Well then welcome to our small world of awesomeness! */
            content: string;
            /**
             * Format: int32
             * @example 31
             */
            categoryId: number;
            poll?: components["schemas"]["Poll"];
            /**
             * @example [
             *       "new",
             *       "welcome"
             *     ]
             */
            tags?: components["schemas"]["Tag"][];
            /**
             * @description Setting this property requires a moderator
             * @example false
             */
            sticky?: boolean;
            /**
             * @description Setting this property requires a moderator
             * @example false
             */
            closed?: boolean;
            /**
             * @description Setting this property requires a moderator
             * @example [
             *       "highlighted"
             *     ]
             */
            moderatorTags?: components["schemas"]["Tag"][];
        };
        ToggleConversationClosedRequest: {
            /** @example false */
            closed: boolean;
        };
        ToggleConversationStickyStateRequest: {
            /** @example false */
            sticky: boolean;
        };
        ToggleConversationTrashRequest: {
            /** @example false */
            trashed: boolean;
        };
        ToggleReplyHighlightRequest: {
            /** @example false */
            highlighted: boolean;
        };
        ToggleReplyTrashedRequest: {
            /** @example false */
            trashed: boolean;
        };
        UnassignConversationModeratorRequest: {
            conversationIds: string[];
        };
        UnsetConversationModerationLabelRequest: {
            conversationIds: string[];
        };
        AssignIdeaStatusRequest: {
            /** @example 1 */
            ideaStatusId: string;
        };
        AssignIdeaModeratorRequest: {
            ideaIds: string[];
            /** @example 6 */
            assignedTo: string;
        };
        ChangeIdeaStatusTypeRequest: {
            /**
             * @description The type is used in analytics dashboards and lets the system know how to interpret various idea statuses.
             * @example closed
             * @enum {string}
             */
            type: "closed" | "delivered" | "open";
        };
        ConvertIdeaToConversationRequest: {
            /**
             * Format: int32
             * @example 31
             */
            categoryId: number;
        };
        ConvertIdeaToQuestionRequest: {
            /**
             * Format: int32
             * @example 31
             */
            categoryId: number;
        };
        CreateIdeaStatusRequest: {
            /** @example An ideaStatus to be added */
            name: string;
            /** @example #ffffff */
            backgroundColor?: string;
            /** @example #ffffff */
            textColor?: string;
            /** @example false */
            default?: boolean;
            /** @example true */
            visible?: boolean;
            /**
             * @description The type assigned to an ideation status and lets the system know how to interpret various idea statuses.
             * @example open
             * @enum {string}
             */
            type?: "closed" | "delivered" | "open";
        };
        EditIdeaContentRequest: {
            /** @example My updated content */
            content: string;
        };
        EditIdeaModeratorTagsRequest: {
            /**
             * @example [
             *       "important",
             *       "announcement"
             *     ]
             */
            moderatorTags: components["schemas"]["Tag"][];
        };
        EditIdeaProductAreasRequest: {
            /**
             * @description A comma-separated list of product area ids the Update refers to
             * @example [
             *       "1",
             *       "2"
             *     ]
             */
            productAreas: string[];
        };
        EditIdeaStatusRequest: {
            /** @example An ideaStatus to be added */
            name: string;
            /** @example #ffffff */
            backgroundColor?: string;
            /** @example #ffffff */
            textColor?: string;
            /** @example false */
            default?: boolean;
            /** @example true */
            visible?: boolean;
            /**
             * @description The type assigned to an ideation status and lets the system know how to interpret various idea statuses.
             * @example open
             * @enum {string}
             */
            type?: "closed" | "delivered" | "open";
        };
        EditIdeaTagsRequest: {
            /**
             * @example [
             *       "improvement",
             *       "suggestion"
             *     ]
             */
            tags: components["schemas"]["Tag"][];
        };
        EditIdeaTitleRequest: {
            /** @example My updated title */
            title: string;
        };
        EditIdeaReplyContentRequest: {
            /** @example My updated content */
            content: string;
        };
        /**
         * @example {
         *       "id": "1",
         *       "publicId": "5",
         *       "title": "Let's submit a idea",
         *       "content": "This is the opening post of a new idea",
         *       "author": {
         *         "id": 7,
         *         "username": "AwesomeUser",
         *         "customTitle": "Employee",
         *         "signature": "Always here to help you...",
         *         "avatar": "http://example.com/avatar123.jpg",
         *         "reputation": {
         *           "rank": "Super Hero",
         *           "rankIcon": "http://superhero.rank/icon.png",
         *           "rankIconThumb": "http://superhero.rank/icon_thumb.png",
         *           "votesReceived": 68,
         *           "repliesMade": 324,
         *           "badgesReceived": [
         *             "http://frequent-poster.badge/icon.png",
         *             "http://active-community-member.badge/icon.png"
         *           ]
         *         }
         *       },
         *       "submittedAt": "2017-04-10T15:29:06+00:00",
         *       "lastActivityAt": "2017-04-10T18:29:06+00:00",
         *       "replyCount": 21,
         *       "spamReplyCount": 21,
         *       "pendingReplyCount": 20,
         *       "trashedReplyCount": 19,
         *       "totalReplyCount": 18,
         *       "tags": [
         *         "announcement",
         *         "first topic"
         *       ],
         *       "moderatorTags": {
         *         "type": "object",
         *         "additionalProperties": true
         *       },
         *       "sticky": false,
         *       "closed": true,
         *       "trashed": false,
         *       "pendingApproval": false,
         *       "assignedModerator": "1",
         *       "moderationLabel": {
         *         "id": "1",
         *         "title": "Moderation Label"
         *       },
         *       "pinnedReplyId": "1",
         *       "ideaStatus": {
         *         "id": "1",
         *         "name": "New",
         *         "backgroundColor": "2aaae1",
         *         "textColor": "ffffff",
         *         "default": true,
         *         "visible": true,
         *         "type": "open"
         *       },
         *       "ideaStatusChangedAt": "2017-04-10T15:29:06+00:00",
         *       "votedBy": [
         *         "7",
         *         "8"
         *       ],
         *       "seoCommunityUrl": "/ideas/let-s-submit-an-idea-5"
         *     }
         */
        Idea: {
            readonly id?: string;
            readonly publicId?: string;
            readonly title?: string;
            readonly content?: string;
            author?: components["schemas"]["ConversationAuthor"];
            /** Format: date-time */
            readonly submittedAt?: string;
            /** Format: date-time */
            readonly lastActivityAt?: string;
            /** Format: int32 */
            readonly replyCount?: number;
            /** Format: int32 */
            readonly spamReplyCount?: number;
            /** Format: int32 */
            readonly pendingReplyCount?: number;
            /** Format: int32 */
            readonly trashedReplyCount?: number;
            /** Format: int32 */
            readonly totalReplyCount?: number;
            /** Format: int32 */
            readonly inclusiveReplyCount?: number;
            /** Format: int32 */
            readonly inclusiveVisibleReplyCount?: number;
            readonly tags?: string[];
            readonly moderatorTags?: string[];
            readonly votedBy?: string[];
            readonly sticky?: boolean;
            readonly closed?: boolean;
            readonly trashed?: boolean;
            readonly spam?: boolean;
            readonly reported?: boolean;
            readonly reportedContent?: unknown;
            readonly assignedModerator?: string;
            moderationLabel?: components["schemas"]["ModerationLabel"];
            readonly pinnedReplyId?: string;
            readonly productAreas?: string[];
            /** Format: date-time */
            readonly ideaStatusChangedAt?: string;
            readonly seoCommunityUrl?: string;
        };
        IdeaList: {
            result?: components["schemas"]["Idea"][];
        };
        /**
         * @example {
         *       "id": "1",
         *       "name": "An example IdeaStatus",
         *       "backgroundColor": "ffffff",
         *       "textColor": "000000",
         *       "default": false,
         *       "visible": true,
         *       "type": "delivered",
         *       "displayOrder": 0
         *     }
         */
        IdeaStatus: {
            readonly id?: string;
            readonly name?: string;
            readonly backgroundColor?: string;
            readonly textColor?: string;
            readonly default?: boolean;
            readonly visible?: boolean;
            /** @enum {string} */
            readonly type?: "" | "closed" | "delivered" | "open";
            readonly displayOrder?: number;
        };
        IdeaStatusList: {
            result?: components["schemas"]["IdeaStatus"][];
        };
        MergeIdeaVotesRequest: {
            /** @example 6 */
            toIdeaId: string;
        };
        MoveIdeaReplyRequest: {
            /** @example 6 */
            topicId: string;
        };
        PromoteIdeaReplyToConversationRequest: {
            /**
             * Format: int32
             * @example 31
             */
            categoryId: number;
            /** @example I have a question */
            title?: string;
        };
        ReorderIdeaStatusesRequest: {
            order: string[];
        };
        IdeaReply: {
            /** @example 2 */
            readonly id?: string;
            /** @example 5 */
            readonly publicReplyId?: string;
            /** @example I completely agree with the topic submiter */
            readonly content?: string;
            author?: components["schemas"]["ConversationAuthor"];
            /**
             * Format: date-time
             * @example 2017-04-10T15:29:06+00:00
             */
            readonly repliedAt?: string;
            /** Format: int32 */
            readonly inclusiveReplyCount?: number;
            /** Format: int32 */
            readonly inclusiveVisibleReplyCount?: number;
            /** @example false */
            readonly trashed?: boolean;
            /** @example false */
            readonly spam?: boolean;
            readonly reported?: boolean;
            readonly reportedContent?: unknown;
            /** @example false */
            readonly pendingApproval?: boolean;
            /** @example false */
            readonly highlighted?: boolean;
            readonly likedBy?: string[];
            /**
             * @description Direct URL to this reply
             * @example https://community.example.com/category-1/topic-title-123?postid=5#post5
             */
            readonly permalink?: string;
        };
        ReplyIdeaRequest: {
            /** @example Can anyone help me? */
            content: string;
            /**
             * @description Setting this to true will create a highlighted reply. This will require moderator access
             * @example false
             */
            highlight?: boolean;
        };
        IdeaReplyList: {
            result?: components["schemas"]["Reply"][];
        };
        SetIdeaModerationLabelRequest: {
            ideaIds: string[];
            /** @example 6 */
            moderationLabelId: string;
        };
        SubmitIdeaRequest: {
            /** @example Welcome to the community */
            title: string;
            /** @example Is this your first visit to our community-driven Help Center? Well then welcome to our small world of awesomeness! */
            content: string;
            /** @example 1,2,3 */
            productAreaIds?: string;
            /**
             * @example [
             *       "new",
             *       "welcome"
             *     ]
             */
            tags?: components["schemas"]["Tag"][];
            /**
             * Format: int32
             * @description The ID of the category to submit the idea in. Required when the community has enabled categories for ideas and product updates.
             * @example 16
             */
            categoryId?: number;
            /**
             * @description Setting this property requires a moderator
             * @example false
             */
            sticky?: boolean;
            /**
             * @description Setting this property requires a moderator
             * @example false
             */
            closed?: boolean;
            /**
             * @description Setting this property requires a moderator
             * @example [
             *       "highlighted"
             *     ]
             */
            moderatorTags?: components["schemas"]["Tag"][];
        };
        ToggleIdeaClosedRequest: {
            /** @example false */
            closed: boolean;
        };
        ToggleIdeaStickyStateRequest: {
            /** @example false */
            sticky: boolean;
        };
        ToggleIdeaTrashRequest: {
            /** @example false */
            trashed: boolean;
        };
        ToggleIdeaReplyHighlightRequest: {
            /** @example false */
            highlighted: boolean;
        };
        ToggleIdeaReplyTrashedRequest: {
            /** @example false */
            trashed: boolean;
        };
        UnassignIdeaModeratorRequest: {
            ideaIds: string[];
        };
        UnsetIdeaModerationLabelRequest: {
            ideaIds: string[];
        };
        ModerationLabel: {
            /**
             * @description Moderation label id
             * @example 1
             */
            id?: string;
            /**
             * @description Moderation label title
             * @example Moderation Label
             */
            title?: string;
        };
        CreateModeratorTagRequest: {
            /**
             * @example [
             *       "important",
             *       "announcement"
             *     ]
             */
            tags: components["schemas"]["Tag"][];
        };
        DeleteModeratorTagsRequest: {
            /** @description Moderator tag IDs to delete. Maximum of 1000 IDs can be provided */
            moderatorTagIds: string[];
        };
        ModeratorTag: {
            /** @example 1 */
            readonly id?: string;
            /** @example Review */
            readonly name?: string;
        };
        ModeratorTagList: {
            result?: components["schemas"]["ModeratorTag"][];
        };
        AssignProductAreasRequest: {
            /** @example 1,2 */
            ideaIds: string;
            /** @example 1,2,3 */
            productAreaIds: string;
        };
        CreateProductAreaRequest: {
            /** @example A productArea to be added */
            name: string;
            /** @example 1 */
            parentId?: string;
        };
        DeleteProductAreaRequest: {
            /** @example 1 */
            id: string;
        };
        /**
         * @example {
         *       "id": "1",
         *       "name": "An example productArea"
         *     }
         */
        ProductArea: {
            readonly id?: string;
            readonly name?: string;
        };
        ProductAreaList: {
            result?: components["schemas"]["ProductArea"][];
        };
        RenameProductAreaRequest: {
            /** @example 1 */
            id: string;
            /** @example A new productArea name */
            name: string;
        };
        AddProductUpdatePollRequest: {
            /** @example What is your favourite feature? */
            title: string;
            /**
             * @example [
             *       "Option A",
             *       "Option B"
             *     ]
             */
            options: string[];
        };
        AssignProductUpdateModeratorRequest: {
            productUpdateIds: string[];
            /** @example 6 */
            assignedTo: string;
        };
        ChangeProductUpdateAuthorRequest: {
            /** @example 7 */
            authorId: string;
        };
        CreateProductUpdateRequest: {
            /** @example This is an interesting productUpdate */
            title: string;
            /**
             * @description Supported types: 'png', 'jpeg', 'jpg', 'gif'
             * @example https://example.com/some-optional-image.png
             */
            featuredImage?: string;
            /**
             * @description Alternative text description for the featured image
             * @example Alt text for the featured image
             */
            featuredImageAltText?: string;
            /** @example New */
            publicLabel?: string;
            /** @example This will explain all you need to know about everything */
            content: string;
            poll?: components["schemas"]["Poll"];
            /**
             * @example [
             *       "question",
             *       "urgent"
             *     ]
             */
            tags?: components["schemas"]["Tag"][];
            /**
             * @description Setting this property requires a moderator
             * @example false
             */
            sticky?: boolean;
            /**
             * @description Setting this property requires a moderator
             * @example false
             */
            closed?: boolean;
            /**
             * @description Setting this property requires a moderator
             * @example [
             *       "highlighted"
             *     ]
             */
            moderatorTags?: components["schemas"]["Tag"][];
            /**
             * Format: int32
             * @description creation date in Unix timestamp format
             * @example 1706792282
             */
            createdAt?: number;
            /**
             * @description A comma-separated list of product area ids the Update refers to
             * @example [
             *       "1",
             *       "2"
             *     ]
             */
            productAreas?: string[];
            /**
             * Format: int32
             * @description The ID of the category to create the product update in. Required when the community has enabled categories for ideas and product updates.
             * @example 16
             */
            categoryId?: number;
        };
        EditProductUpdateContentRequest: {
            /** @example My updated content */
            content: string;
        };
        EditProductUpdateFeaturedImageAltTextRequest: {
            /**
             * @description Alternative text description for the featured image
             * @example Alt text for the featured image
             */
            featuredImageAltText: string;
        };
        EditProductUpdateFeaturedImageRequest: {
            /** @example http://example.com/featuredImage.jpg */
            featuredImage: string;
        };
        EditProductUpdateModeratorTagsRequest: {
            /**
             * @example [
             *       "important",
             *       "announcement"
             *     ]
             */
            moderatorTags: components["schemas"]["Tag"][];
        };
        EditProductUpdatePollOptionsRequest: {
            /**
             * @example [
             *       "option A",
             *       "option B"
             *     ]
             */
            options: components["schemas"]["EditProductUpdatePollOptionsRequest"][];
        };
        EditProductUpdatePollTitleRequest: {
            /** @example My updated poll title */
            title: string;
        };
        EditProductUpdateProductAreasRequest: {
            /**
             * @description A comma-separated list of product area ids the Update refers to
             * @example [
             *       "1",
             *       "2"
             *     ]
             */
            productAreas: string[];
        };
        EditProductUpdatePublicLabelRequest: {
            /** @example News */
            publicLabel: string;
        };
        EditProductUpdateReplyContentRequest: {
            /** @example My updated content */
            content: string;
        };
        EditProductUpdateTagsRequest: {
            /**
             * @example [
             *       "important",
             *       "announcement"
             *     ]
             */
            tags: components["schemas"]["Tag"][];
        };
        EditProductUpdateTitleRequest: {
            /** @example My updated title */
            title: string;
        };
        ProductUpdateEditor: {
            readonly id?: string;
            readonly username?: string;
            readonly avatar?: string;
        };
        ProductUpdateMoveReplyRequest: {
            /** @example 6 */
            topicId: string;
        };
        /**
         * @example {
         *       "id": "1",
         *       "publicId": "5",
         *       "title": "Let's create a product update",
         *       "featuredImage": "https://example.com/some-optional-image.png",
         *       "featuredImageAltText": "Alt text for the featured image",
         *       "publicLabel": "new",
         *       "content": "This is the content of a new productUpdate",
         *       "author": {
         *         "id": 7,
         *         "username": "AwesomeUser",
         *         "customTitle": "Employee",
         *         "signature": "Always here to help you...",
         *         "avatar": "http://example.com/avatar123.jpg",
         *         "reputation": {
         *           "rank": "Super Hero",
         *           "rankIcon": "http://superhero.rank/icon.png",
         *           "rankIconThumb": "http://superhero.rank/icon_thumb.png",
         *           "likesReceived": 68,
         *           "repliesMade": 324,
         *           "badgesReceived": [
         *             "http://frequent-poster.badge/icon.png",
         *             "http://active-community-member.badge/icon.png"
         *           ]
         *         }
         *       },
         *       "createdAt": "2017-04-10T15:29:06+00:00",
         *       "replyCount": 21,
         *       "spamReplyCount": 21,
         *       "pendingReplyCount": 20,
         *       "trashedReplyCount": 19,
         *       "totalReplyCount": 18,
         *       "tags": [
         *         "announcement",
         *         "important productUpdate"
         *       ],
         *       "moderatorTags": {
         *         "type": "object",
         *         "additionalProperties": true
         *       },
         *       "sticky": false,
         *       "closed": true,
         *       "trashed": false,
         *       "containsPoll": false,
         *       "lastEdit": {
         *         "id": "1",
         *         "editor": {
         *           "id": 7,
         *           "username": "AwesomeUser"
         *         },
         *         "editedAt": "2017-04-11T15:29:06+00:00"
         *       },
         *       "seoCommunityUrl": "/product-updates/let-s-create-a-product-update-5"
         *     }
         */
        ProductUpdate: {
            readonly id?: string;
            readonly publicId?: string;
            readonly title?: string;
            readonly featuredImage?: string;
            readonly featuredImageAltText?: string;
            readonly publicLabel?: string;
            readonly body?: string;
            author?: components["schemas"]["ConversationAuthor"];
            /** Format: date-time */
            readonly createdAt?: string;
            /** Format: int32 */
            readonly replyCount?: number;
            /** Format: int32 */
            readonly spamReplyCount?: number;
            /** Format: int32 */
            readonly pendingReplyCount?: number;
            /** Format: int32 */
            readonly trashedReplyCount?: number;
            /** Format: int32 */
            readonly totalReplyCount?: number;
            /** Format: int32 */
            readonly inclusiveReplyCount?: number;
            /** Format: int32 */
            readonly inclusiveVisibleReplyCount?: number;
            readonly tags?: string[];
            readonly productAreas?: components["schemas"]["ProductArea"][];
            readonly moderatorTags?: string[];
            readonly likedBy?: string[];
            readonly sticky?: boolean;
            readonly closed?: boolean;
            readonly trashed?: boolean;
            readonly containsPoll?: boolean;
            lastEdit?: components["schemas"]["ProductUpdateEdit"];
            readonly status?: string;
            scheduledBy?: components["schemas"]["Editor"];
            readonly seoCommunityUrl?: string;
        };
        ProductUpdateEdit: {
            readonly id?: string;
            readonly editor?: string[];
            readonly editedAt?: boolean;
        };
        ProductUpdateList: {
            result?: components["schemas"]["ProductUpdate"][];
        };
        ProductUpdatePollVoteRequest: {
            /** @example Option B */
            selectedOption: string;
        };
        ProductUpdateReply: {
            /** @example 2 */
            readonly id?: string;
            /** @example 5 */
            readonly publicReplyId?: string;
            /** @example I completely agree with the topic starter */
            readonly content?: string;
            author?: components["schemas"]["ConversationAuthor"];
            /**
             * Format: date-time
             * @example 2017-04-10T15:29:06+00:00
             */
            readonly repliedAt?: string;
            /** Format: int32 */
            readonly inclusiveReplyCount?: number;
            /** Format: int32 */
            readonly inclusiveVisibleReplyCount?: number;
            /** @example false */
            readonly trashed?: boolean;
            /** @example false */
            readonly spam?: boolean;
            readonly reported?: boolean;
            readonly reportedContent?: unknown;
            /** @example false */
            readonly pendingApproval?: boolean;
            /** @example false */
            readonly highlighted?: boolean;
            readonly likedBy?: string[];
            /**
             * @description Direct URL to this reply
             * @example https://community.example.com/category-1/topic-title-123?postid=5#post5
             */
            readonly permalink?: string;
        };
        ProductUpdateReplyList: {
            result?: components["schemas"]["ProductUpdateReply"][];
        };
        PromoteProductUpdateReplyToConversationRequest: {
            /**
             * Format: int32
             * @example 31
             */
            categoryId: number;
            /** @example I have a question */
            title?: string;
        };
        ReplyProductUpdateRequest: {
            /** @example Can anyone help me? */
            content: string;
            /**
             * @description Setting this to true will create a highlighted reply. This will require moderator access
             * @example false
             */
            highlight?: boolean;
        };
        SetProductUpdateModerationLabelRequest: {
            productUpdateIds: string[];
            /** @example 6 */
            moderationLabelId: string;
        };
        ToggleProductUpdateClosedRequest: {
            /** @example false */
            closed: boolean;
        };
        ToggleProductUpdateReplyHighlightRequest: {
            /** @example false */
            highlighted: boolean;
        };
        ToggleProductUpdateReplyTrashedRequest: {
            /** @example false */
            trashed: boolean;
        };
        ToggleProductUpdateStickyStateRequest: {
            /** @example false */
            sticky: boolean;
        };
        ToggleProductUpdateTrashedRequest: {
            /** @example false */
            trashed: boolean;
        };
        UnassignProductUpdateModeratorRequest: {
            productUpdateIds: string[];
        };
        UnsetProductUpdateModerationLabelRequest: {
            productUpdateIds: string[];
        };
        AddQuestionPollVoteRequest: {
            /** @example Option B */
            selectedOption: string;
        };
        AskQuestionRequest: {
            /** @example I have a question */
            title: string;
            /** @example Can anyone help me? */
            content: string;
            /**
             * Format: int32
             * @example 31
             */
            categoryId: number;
            poll?: components["schemas"]["Poll"];
            /**
             * @example [
             *       "question",
             *       "urgent"
             *     ]
             */
            tags?: components["schemas"]["Tag"][];
            /**
             * @description Setting this property requires a moderator
             * @example false
             */
            sticky?: boolean;
            /**
             * @description Setting this property requires a moderator
             * @example false
             */
            closed?: boolean;
            /**
             * @description Setting this property requires a moderator
             * @example [
             *       "highlighted"
             *     ]
             */
            moderatorTags?: components["schemas"]["Tag"][];
        };
        AssignQuestionModeratorRequest: {
            questionIds: string[];
            /** @example 6 */
            assignedTo: string;
        };
        EditQuestionContentRequest: {
            /** @example My updated content */
            content: string;
        };
        EditQuestionModeratorTagsRequest: {
            /**
             * @example [
             *       "important",
             *       "announcement"
             *     ]
             */
            moderatorTags: components["schemas"]["Tag"][];
        };
        EditQuestionPollOptionsRequest: {
            /**
             * @example [
             *       "option A",
             *       "option B"
             *     ]
             */
            options: components["schemas"]["EditQuestionPollOptionsRequest"][];
        };
        EditQuestionPollTitleRequest: {
            /** @example My updated poll title */
            title: string;
        };
        EditQuestionReplyContentRequest: {
            /** @example My updated content */
            content: string;
        };
        EditQuestionTagsRequest: {
            /**
             * @example [
             *       "improvement",
             *       "suggestion"
             *     ]
             */
            tags: components["schemas"]["Tag"][];
        };
        EditQuestionTitleRequest: {
            /** @example My updated title */
            title: string;
        };
        MoveQuestionToTopicRequest: {
            /** @example 6 */
            topicId: string;
            /** @example question */
            topicType: string;
        };
        QuestionMoveReplyRequest: {
            /** @example 6 */
            topicId: string;
            /** @example question */
            topicType: string;
        };
        PromoteQuestionReplyToConversationRequest: {
            /**
             * Format: int32
             * @example 31
             */
            categoryId: number;
            /** @example I have a question */
            title?: string;
        };
        Question: {
            /** @example 1 */
            readonly id?: string;
            /** @example 5 */
            readonly publicId?: string;
            /** @example How do I start a question? */
            readonly title?: string;
            /** @example Perhaps I should place my content here? */
            readonly content?: string;
            author?: components["schemas"]["ConversationAuthor"];
            /** @example 6 */
            readonly categoryId?: string;
            /**
             * Format: date-time
             * @example 2017-04-10T15:29:06+00:00
             */
            readonly askedAt?: string;
            /**
             * Format: date-time
             * @example 2017-04-10T18:29:06+00:00
             */
            readonly lastActivityAt?: string;
            /**
             * Format: int32
             * @example 21
             */
            readonly replyCount?: number;
            /** Format: int32 */
            readonly spamReplyCount?: number;
            /** Format: int32 */
            readonly pendingReplyCount?: number;
            /** Format: int32 */
            readonly trashedReplyCount?: number;
            /** Format: int32 */
            readonly totalReplyCount?: number;
            /** Format: int32 */
            readonly inclusiveReplyCount?: number;
            /** Format: int32 */
            readonly inclusiveVisibleReplyCount?: number;
            /**
             * @example [
             *       "faq"
             *     ]
             */
            readonly tags?: unknown;
            /**
             * @example [
             *       "100",
             *       "152",
             *       "203"
             *     ]
             */
            readonly likedBy?: unknown;
            /**
             * @description Refers to the reply ID of the reply which was accepted as best answer
             * @example 22
             */
            readonly answer?: string;
            /** @example false */
            readonly sticky?: boolean;
            /** @example true */
            readonly closed?: boolean;
            /** @example false */
            readonly trashed?: boolean;
            readonly spam?: boolean;
            readonly reported?: boolean;
            readonly reportedContent?: unknown;
            /**
             * @description Will be `true` if the question was created, but is still pending approval from a Moderator
             * @example false
             */
            readonly pendingApproval?: boolean;
            readonly containsPoll?: boolean;
            /** @example /category-name-6/how-do-i-start-a-question-5 */
            readonly seoCommunityUrl?: string;
        };
        QuestionList: {
            result?: components["schemas"]["Question"][];
        };
        QuestionReply: {
            /** @example 2 */
            readonly id?: string;
            /** @example 5 */
            readonly publicReplyId?: string;
            /** @example I completely agree with the topic starter */
            readonly content?: string;
            author?: components["schemas"]["ConversationAuthor"];
            /**
             * Format: date-time
             * @example 2017-04-10T15:29:06+00:00
             */
            readonly repliedAt?: string;
            /** Format: int32 */
            readonly inclusiveReplyCount?: number;
            /** Format: int32 */
            readonly inclusiveVisibleReplyCount?: number;
            /** @example false */
            readonly trashed?: boolean;
            readonly spam?: boolean;
            readonly reported?: boolean;
            readonly reportedContent?: unknown;
            /** @example false */
            readonly pendingApproval?: boolean;
            /** @example false */
            readonly highlighted?: boolean;
            readonly likedBy?: unknown;
            /**
             * @description Direct URL to this reply
             * @example https://community.example.com/category-1/topic-title-123?postid=5#post5
             */
            readonly permalink?: string;
        };
        QuestionReplyList: {
            result?: components["schemas"]["QuestionReply"][];
        };
        ReplyQuestionRequest: {
            /** @example Can anyone help me? */
            content: string;
            /**
             * @description Setting this to true will create a highlighted reply. This will require moderator access
             * @example false
             */
            highlight?: boolean;
        };
        SetQuestionModerationLabelRequest: {
            questionIds: string[];
            /** @example 6 */
            moderationLabelId: string;
        };
        ToggleQuestionClosedRequest: {
            /** @example false */
            closed: boolean;
        };
        ToggleQuestionReplyHighlightRequest: {
            /** @example false */
            highlighted: boolean;
        };
        ToggleQuestionReplyTrashedRequest: {
            /** @example false */
            trashed: boolean;
        };
        ToggleQuestionStickyStateRequest: {
            /** @example false */
            sticky: boolean;
        };
        ToggleQuestionTrashRequest: {
            /** @example false */
            trashed: boolean;
        };
        UnassignQuestionModeratorRequest: {
            questionIds: string[];
        };
        UnsetQuestionModerationLabelRequest: {
            questionIds: string[];
        };
        /**
         * @example {
         *       "id": "1",
         *       "reason": "reported reason",
         *       "reportedAt": "2017-04-10T15:29:06+00:00",
         *       "reportedBy": {
         *         "id": 7,
         *         "username": "AwesomeUser",
         *         "customTitle": "Employee",
         *         "signature": "Always here to help you...",
         *         "avatar": "http://example.com/avatar123.jpg",
         *         "reputation": {
         *           "rank": "Super Hero",
         *           "rankIcon": "http://superhero.rank/icon.png",
         *           "rankIconThumb": "http://superhero.rank/icon_thumb.png",
         *           "votesReceived": 68,
         *           "repliesMade": 324,
         *           "badgesReceived": [
         *             "http://frequent-poster.badge/icon.png",
         *             "http://active-community-member.badge/icon.png"
         *           ]
         *         }
         *       }
         *     }
         */
        ReportedContent: {
            readonly id?: string;
            readonly reason?: string;
            /** Format: date-time */
            readonly reportedAt?: string;
            reportedBy?: components["schemas"]["ConversationAuthor"];
        };
        CreatePublicTagRequest: {
            /** @example A tag to be added */
            name: string;
        };
        DeletePublicTagRequest: {
            /** @example 1 */
            id: string;
        };
        MergePublicTagsRequest: {
            /** @example A new tag name */
            name: string;
            ids: string[];
        };
        /**
         * @example {
         *       "id": "1",
         *       "name": "An example public tag"
         *     }
         */
        PublicTag: {
            readonly id?: string;
            readonly name?: string;
        };
        PublicTagList: {
            result?: components["schemas"]["PublicTag"][];
        };
        RenamePublicTagRequest: {
            /** @example 1 */
            id: string;
            /** @example A new tag name */
            name: string;
        };
        EventWebhookSubscription: {
            /** @example conversation.Started */
            readonly eventName?: string;
            readonly subscriptions?: string[];
        };
        SubscribeUrlWebhookRequest: {
            /** @example https://callback.example.com */
            url: string;
            /** @example username for Basic Auth. */
            username?: string;
            /** @example password for Basic Auth. */
            secret?: string;
            /**
             * @description Authentication type. Use 'aws_sigv4' for AWS Signature V4. Omit for Basic Auth.
             * @example aws_sigv4
             */
            auth_type?: string;
            /**
             * @description Customer IAM role ARN. Required when auth_type is aws_sigv4.
             * @example arn:aws:iam::123456789012:role/GainsightWebhookRole
             */
            role_arn?: string;
            /**
             * @description External ID for STS AssumeRole. Required when auth_type is aws_sigv4.
             * @example gainsight-customer-prod-2026
             */
            external_id?: string;
            /**
             * @description AWS region of the target endpoint. Required when auth_type is aws_sigv4.
             * @example us-west-2
             */
            region?: string;
            /**
             * @description AWS service for signing scope. Optional, defaults to execute-api.
             * @example execute-api
             */
            service?: string;
        };
        UnsubscribeUrlFromWebhookRequest: {
            /** @example https://callback.example.com */
            url: string;
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
        /** @description Category restricted */
        CategoryRestricted: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                /**
                 * @example {
                 *       "message": "Forbidden",
                 *       "description": "Category is not accessible for this user"
                 *     }
                 */
                "application/json": components["schemas"]["BadRequestException"];
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
        /** @description Validation error */
        ValidationError: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ValidationException"];
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
        /** @description Successful response */
        Poll: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": {
                    result?: components["schemas"]["PollResult"];
                };
            };
        };
        /** @description Successful response */
        Article: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": {
                    result?: components["schemas"]["Article"];
                };
            };
        };
        /** @description Successful response */
        ArticleList: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ArticleList"];
            };
        };
        /** @description Successful response */
        ArticleReply: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ArticleReply"];
            };
        };
        /** @description Successful response */
        ArticleReplyList: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ArticleReplyList"];
            };
        };
        /** @description Successful response */
        ProductUpdate: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": {
                    result?: components["schemas"]["ProductUpdate"];
                };
            };
        };
        /** @description Successful response */
        ProductUpdateList: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ProductUpdateList"];
            };
        };
        /** @description Successful response */
        ProductUpdateReply: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ProductUpdateReply"];
            };
        };
        /** @description Successful response */
        ProductUpdateReplyList: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ProductUpdateReplyList"];
            };
        };
        /** @description Successful response */
        Idea: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": {
                    result?: components["schemas"]["Idea"];
                };
            };
        };
        /** @description Successful response */
        IdeaList: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["IdeaList"];
            };
        };
        /** @description Successful response */
        IdeaStatusList: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["IdeaStatusList"];
            };
        };
        /** @description Successful response */
        IdeaReply: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["IdeaReply"];
            };
        };
        /** @description Successful response */
        IdeaReplyList: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["IdeaReplyList"];
            };
        };
        /** @description Successful response */
        Conversation: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": {
                    result?: components["schemas"]["Conversation"];
                };
            };
        };
        /** @description Successful response */
        ConversationList: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ConversationList"];
            };
        };
        /** @description Successful response */
        ConversationReply: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["Reply"];
            };
        };
        /** @description Successful response */
        ConversationReplyList: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ReplyList"];
            };
        };
        /** @description Successful response */
        Question: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": {
                    result?: components["schemas"]["Question"];
                };
            };
        };
        /** @description Successful response */
        QuestionList: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["QuestionList"];
            };
        };
        /** @description Successful response */
        QuestionReply: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": {
                    result?: components["schemas"]["QuestionReply"];
                };
            };
        };
        /** @description Successful response */
        QuestionReplyList: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["QuestionReplyList"];
            };
        };
        /** @description Successful response */
        TopicList: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": {
                    result?: {
                        /**
                         * @description Refers to the the type of content this topic was projected from
                         * @example conversation
                         * @enum {string}
                         */
                        readonly contentType?: "article" | "conversation" | "question";
                        /**
                         * @description The original ID of the content type this topic was based on. This ID can be used on the endpoints belonging to this content-type to fetch the original data
                         * @example 1
                         */
                        readonly id?: string;
                        /** @example 5 */
                        readonly publicId?: string;
                        /** @example Some conversation title */
                        readonly title?: string;
                        /** @example This is the content of a conversation */
                        readonly content?: string;
                        /**
                         * @description **Note:** applies to **article** type only, other content-types will always have an empty string value. This value can be an absolute URL to the image featured for this article, or an empty string if no image was provided
                         * @example
                         */
                        readonly featuredImage?: string;
                        /**
                         * @description **Note:** applies to **article** type only, other content-types will always have an empty string value. This value contains a user-defined label which will be shown to the public on the community
                         * @example
                         */
                        readonly publicLabel?: string;
                        /** @example 6 */
                        readonly categoryId?: string;
                        /** @example News */
                        readonly categoryName?: string;
                        /**
                         * @description A list of public tags assigned to the original content-type. These tags are shown to the public on the community
                         * @example [
                         *       "announcement",
                         *       "first topic"
                         *     ]
                         */
                        readonly tags?: unknown;
                        /**
                         * @description A list of moderator tags assigned to the original content-type. These tags are not shown to the public on the community. These tags can only be set by moderators in the Control environment
                         * @example [
                         *       "urgent",
                         *       "trending"
                         *     ]
                         */
                        readonly moderatorTags?: unknown;
                        /**
                         * @description A moderation label assigned to the original content-type. This label is not shown to the public on the community. This label can only be set by moderators in the Control environment
                         * @example checkup
                         */
                        readonly moderationLabel?: string;
                        /**
                         * @description The total number of visible replies
                         * @example 34
                         */
                        readonly replyCount?: number;
                        /** @example 124 */
                        readonly likes?: number;
                        /** @example 124 */
                        readonly votes?: number;
                        /**
                         * @description A list of user ids that voted for this idea
                         * @example [
                         *       "124",
                         *       "345"
                         *     ]
                         */
                        readonly voteSet?: unknown;
                        /**
                         * @description A flag indicating whether or not the original content-type was trashed. Trashed means not visible to the public on the community. If this value is `false` it means the content was visible
                         * @example false
                         */
                        readonly trashed?: boolean;
                        /** @description A flag indicating whether or not the original content-type was made sticky on the community. Sticky topics will always appear at the top of the overview pages on the community */
                        readonly sticky?: boolean;
                        /** @description A flag indicating if there is a best answer */
                        readonly bestAnswer?: boolean;
                        author?: components["schemas"]["Author"];
                        /** @description Representation of the author that replied most recently to this topic */
                        lastContributor?: components["schemas"]["Author"];
                        /**
                         * Format: date-time
                         * @example 2017-04-10T15:29:06+00:00
                         */
                        readonly createdAt?: string;
                        /**
                         * Format: date-time
                         * @description Date indicating when the original content-type received it's latest reply
                         * @example 2017-08-10T16:45:54+00:00
                         */
                        readonly lastActivityAt?: string;
                        /** @example published */
                        readonly status?: string;
                        /**
                         * @description A list of product areas assigned to the original content-type
                         * @example [
                         *       "community",
                         *       "embeddable"
                         *     ]
                         */
                        readonly productAreas?: unknown;
                    }[];
                };
            };
        };
    };
    parameters: {
        /** @description Defines the field to sort the results on. By default the response is sorted by oldest first. <br/><ul><li>oldestFirst : The least recent reply to the most recent reply.</li><li>mostRecentFirst : Ordered by most recent to least recent.</li> <li>mostLiked : Ordered by replies which have the most likes to the least likes.</li></ul> */
        ReplySort: "oldestFirst" | "mostRecentFirst" | "mostLiked";
        /** @description Selects the page to retrieve on paginated responses. Used in combination with the `pageSize` parameter to paginate over results */
        PageNumber: number;
        /** @description Limits the number of items returned in a single paginated response. Used in combination with the `page` parameter to paginate over results */
        PageSize: number;
        /**
         * @description A list of public ids
         * @example [
         *       "1",
         *       "2"
         *     ]
         */
        TopicPublicIds: string;
        /**
         * @description Deprecated it's recommended to use categoryIds
         * @example 123
         */
        TopicCategoryId: string;
        /**
         * @description A list of category ids
         * @example [
         *       "1",
         *       "2"
         *     ]
         */
        TopicCategoryIds: string;
        /**
         * @description A list of product area ids
         * @example [
         *       "1",
         *       "2"
         *     ]
         */
        TopicProductAreaIds: string;
        /** @description Deprecated, it's recommended to use contentTypes */
        ContentType: "article" | "conversation" | "question" | "productUpdate";
        /**
         * @description A list of topic content types
         * @example [
         *       "idea",
         *       "conversation"
         *     ]
         */
        TopicContentTypes: string;
        /**
         * @description A comma-separated list of public tags
         * @example [
         *       "announcement,official"
         *     ]
         */
        TopicTags: string;
        /**
         * @description A comma-separated list of moderator tags
         * @example [
         *       "urgent,trending"
         *     ]
         */
        TopicModeratorTags: string;
        /**
         * @description A comma-separated list of moderation labels
         * @example [
         *       "checkup,handled"
         *     ]
         */
        TopicModerationLabels: string;
        /** @description A date range to filter topics based on creation date */
        TopicCreatedAt: components["schemas"]["DateRange"];
        /** @description A date range to filter topics based on last activity */
        TopicLastActivity: components["schemas"]["DateRange"];
        /** @description Defines the field to sort the results on. The sort order will be descending. By default the results are ordered by recent activity from most recent to least recent */
        TopicSort: "lastActivityAt" | "createdAt" | "likes" | "voteCount" | "replyCount";
        /** @description ID of the article to interact with */
        PathArticleId: string;
        /** @description ID of the article reply to interact with */
        PathArticleReplyId: string;
        /** @description ID of the product update to interact with */
        PathProductUpdateId: string;
        /** @description ID of the product update reply to interact with */
        PathProductUpdateReplyId: string;
        /** @description ID of the idea to interact with */
        PathIdeaId: string;
        /** @description ID of the idea reply to interact with */
        PathIdeaReplyId: string;
        /** @description ID of the idea status to interact with */
        PathIdeaStatusId: string;
        /** @description ID of the conversation to interact with */
        PathConversationId: string;
        /** @description ID of the conversation reply to interact with */
        PathConversationReplyId: string;
        /** @description ID of the question to interact with */
        PathQuestionId: string;
        /** @description ID of the question reply to interact with */
        PathQuestionReplyId: string;
    };
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    getTopicList: {
        parameters: {
            query?: {
                /**
                 * @description The search term which will match the title, content. Skipping this parameter will return all topics
                 * @example search-term
                 */
                q?: string;
                /**
                 * @description A list of public ids
                 * @example [
                 *       "1",
                 *       "2"
                 *     ]
                 */
                "publicIds[]"?: components["parameters"]["TopicPublicIds"];
                /**
                 * @description Deprecated it's recommended to use categoryIds
                 * @example 123
                 */
                categoryId?: components["parameters"]["TopicCategoryId"];
                /**
                 * @description A list of category ids
                 * @example [
                 *       "1",
                 *       "2"
                 *     ]
                 */
                "categoryIds[]"?: components["parameters"]["TopicCategoryIds"];
                /**
                 * @description A list of product area ids
                 * @example [
                 *       "1",
                 *       "2"
                 *     ]
                 */
                "productAreaIds[]"?: components["parameters"]["TopicProductAreaIds"];
                /** @description Deprecated, it's recommended to use contentTypes */
                contentType?: components["parameters"]["ContentType"];
                /**
                 * @description A list of topic content types
                 * @example [
                 *       "idea",
                 *       "conversation"
                 *     ]
                 */
                "contentTypes[]"?: components["parameters"]["TopicContentTypes"];
                /**
                 * @description A comma-separated list of public tags
                 * @example [
                 *       "announcement,official"
                 *     ]
                 */
                tags?: components["parameters"]["TopicTags"];
                /**
                 * @description A comma-separated list of moderator tags
                 * @example [
                 *       "urgent,trending"
                 *     ]
                 */
                moderatorTags?: components["parameters"]["TopicModeratorTags"];
                /**
                 * @description A comma-separated list of moderation labels
                 * @example [
                 *       "checkup,handled"
                 *     ]
                 */
                moderationLabels?: components["parameters"]["TopicModerationLabels"];
                /** @description A date range to filter topics based on creation date */
                createdAt?: components["parameters"]["TopicCreatedAt"];
                /** @description A date range to filter topics based on last activity */
                lastActivityAt?: components["parameters"]["TopicLastActivity"];
                /** @description Defines the field to sort the results on. The sort order will be descending. By default the results are ordered by recent activity from most recent to least recent */
                sort?: components["parameters"]["TopicSort"];
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
            200: components["responses"]["TopicList"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    getTopicListForCategory: {
        parameters: {
            query?: {
                /**
                 * @description A list of public ids
                 * @example [
                 *       "1",
                 *       "2"
                 *     ]
                 */
                "publicIds[]"?: components["parameters"]["TopicPublicIds"];
                /**
                 * @description A comma-separated list of public tags
                 * @example [
                 *       "announcement,official"
                 *     ]
                 */
                tags?: components["parameters"]["TopicTags"];
                /**
                 * @description A comma-separated list of moderator tags
                 * @example [
                 *       "urgent,trending"
                 *     ]
                 */
                moderatorTags?: components["parameters"]["TopicModeratorTags"];
                /**
                 * @description A comma-separated list of moderation labels
                 * @example [
                 *       "checkup,handled"
                 *     ]
                 */
                moderationLabels?: components["parameters"]["TopicModerationLabels"];
                /** @description A date range to filter topics based on creation date */
                createdAt?: components["parameters"]["TopicCreatedAt"];
                /** @description A date range to filter topics based on last activity */
                lastActivityAt?: components["parameters"]["TopicLastActivity"];
                /** @description Defines the field to sort the results on. The sort order will be descending. By default the results are ordered by recent activity from most recent to least recent */
                sort?: components["parameters"]["TopicSort"];
                /** @description Selects the page to retrieve on paginated responses. Used in combination with the `pageSize` parameter to paginate over results */
                page?: components["parameters"]["PageNumber"];
                /** @description Limits the number of items returned in a single paginated response. Used in combination with the `page` parameter to paginate over results */
                pageSize?: components["parameters"]["PageSize"];
            };
            header?: never;
            path: {
                /** @description ID of the category to fetch topics for */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["TopicList"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    search: {
        parameters: {
            query?: {
                /**
                 * @description The search term which will match the title, content. Skipping this parameter will return all topics
                 * @example search-term
                 */
                q?: string;
                /**
                 * @description Filter the search results by trashed status, for example to retrieve only trashed topics. Not passing this parameter will return only visible topics
                 * @example true
                 */
                trashed?: boolean;
                /**
                 * @description A comma-separated list of category ids. Not passing this parameter will return topics from all categories
                 * @example [
                 *       "1",
                 *       "4",
                 *       "6"
                 *     ]
                 */
                categories?: string;
                /**
                 * @description A comma-separated list of content types
                 * @example [
                 *       "article"
                 *     ]
                 */
                contentTypes?: string;
                /**
                 * @description A comma-separated list of public tags
                 * @example [
                 *       "announcement,official"
                 *     ]
                 */
                tags?: components["parameters"]["TopicTags"];
                /**
                 * @description A comma-separated list of moderator tags
                 * @example [
                 *       "urgent,trending"
                 *     ]
                 */
                moderatorTags?: components["parameters"]["TopicModeratorTags"];
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
            200: components["responses"]["TopicList"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    createArticle: {
        parameters: {
            query: {
                /** @description The ID of the author of the article */
                authorId: string;
                /** @description The ID of the moderator who will create the article on behalf of the author (who in this case can be a registered user as well) */
                moderatorId?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateArticleRequest"];
            };
        };
        responses: {
            /** @description Article created */
            201: {
                headers: {
                    /** @description Article URL */
                    Location?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description The private ID of the created article */
                        id?: string;
                        /** @description The public ID of the created article */
                        publicId?: string;
                    };
                };
            };
            400: components["responses"]["MalformedInput"];
            403: components["responses"]["CategoryRestricted"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    publishArticle: {
        parameters: {
            query: {
                /** @description ID of the moderator publishing the article */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the article to interact with */
                id: components["parameters"]["PathArticleId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Article published */
            201: {
                headers: {
                    /** @description Article URL */
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
    replyArticle: {
        parameters: {
            query: {
                /** @description The ID of the author of this reply */
                authorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the article to interact with */
                id: components["parameters"]["PathArticleId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReplyArticleRequest"];
            };
        };
        responses: {
            /** @description Article was replied */
            201: {
                headers: {
                    /** @description Article reply URL */
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
    likeArticle: {
        parameters: {
            query: {
                /** @description ID the author giving the like */
                likedBy: string;
            };
            header?: never;
            path: {
                /** @description ID of the article to interact with */
                id: components["parameters"]["PathArticleId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Article was liked */
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
    unlikeArticle: {
        parameters: {
            query: {
                /** @description ID the author revoking the like */
                unlikedBy: string;
            };
            header?: never;
            path: {
                /** @description ID of the article to interact with */
                id: components["parameters"]["PathArticleId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Like was revoked from the discussion */
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
    editArticleContent: {
        parameters: {
            query: {
                /** @description ID of the author or moderator making the edits */
                authorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the article to interact with */
                id: components["parameters"]["PathArticleId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditArticleContentRequest"];
            };
        };
        responses: {
            /** @description Article edited */
            201: {
                headers: {
                    /** @description Article URL */
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
    editArticleTitle: {
        parameters: {
            query: {
                /** @description ID of the moderator making the edits */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the article to interact with */
                id: components["parameters"]["PathArticleId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditArticleTitleRequest"];
            };
        };
        responses: {
            /** @description Article edited */
            201: {
                headers: {
                    /** @description Article URL */
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
    likeArticleReply: {
        parameters: {
            query: {
                /** @description ID the author giving the like */
                likedBy: string;
            };
            header?: never;
            path: {
                /** @description Reply ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Reply was liked */
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
    unlikeArticleReply: {
        parameters: {
            query: {
                /** @description ID of the author who unlikes the reply */
                unlikedBy: string;
            };
            header?: never;
            path: {
                /** @description Reply ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Reply was liked */
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
    editArticleModeratorTags: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the moderator tags */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the article to interact with */
                id: components["parameters"]["PathArticleId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditArticleModeratorTagsRequest"];
            };
        };
        responses: {
            /** @description Article moderator tags were changed */
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
    editArticleTags: {
        parameters: {
            query: {
                /** @description ID of the author editing the article tags */
                authorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the article to interact with */
                id: components["parameters"]["PathArticleId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditArticleTagsRequest"];
            };
        };
        responses: {
            /** @description Article tags were changed */
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
    addArticleTags: {
        parameters: {
            query: {
                /** @description ID of the author editing the article tags */
                authorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the article to interact with */
                id: components["parameters"]["PathArticleId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AddPublicTagsRequest"];
            };
        };
        responses: {
            /** @description Article tags were changed */
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
    removeArticleTags: {
        parameters: {
            query: {
                /** @description ID of the author editing the article tags */
                authorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the article to interact with */
                id: components["parameters"]["PathArticleId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RemovePublicTagsRequest"];
            };
        };
        responses: {
            /** @description Article tags were changed */
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
    addArticleModeratorTags: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the article tags */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the article to interact with */
                id: components["parameters"]["PathArticleId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AddModeratorTagsRequest"];
            };
        };
        responses: {
            /** @description Article moderator tags were changed */
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
    removeArticleModeratorTags: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the article tags */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the article to interact with */
                id: components["parameters"]["PathArticleId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RemoveModeratorTagsRequest"];
            };
        };
        responses: {
            /** @description Article moderator tags were changed */
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
    editArticleFeaturedImage: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the featured image */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the article to interact with */
                id: components["parameters"]["PathArticleId"];
            };
            cookie?: never;
        };
        /** @description The featured image url. To remove the featured image from the article, then this field should be empty. */
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditArticleFeaturedImageRequest"];
            };
        };
        responses: {
            /** @description Article featured image was changed */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    editArticleFeaturedImageAltText: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the featured image alt text */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the article to interact with */
                id: components["parameters"]["PathArticleId"];
            };
            cookie?: never;
        };
        /** @description The featured image alt text. Alternative text for the featured image. */
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditArticleFeaturedImageAltTextRequest"];
            };
        };
        responses: {
            /** @description Article featured image alt text was changed */
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
    editArticlePublicLabel: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the public label */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the article to interact with */
                id: components["parameters"]["PathArticleId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditArticlePublicLabelRequest"];
            };
        };
        responses: {
            /** @description Article public label was changed */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
        };
    };
    toggleArticleStickyState: {
        parameters: {
            query: {
                /** @description ID of the moderator toggling the article sticky state */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the article to interact with */
                id: components["parameters"]["PathArticleId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ToggleArticleStickyStateRequest"];
            };
        };
        responses: {
            /** @description Article sticky state updated */
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
    toggleArticleClosed: {
        parameters: {
            query: {
                /** @description ID of the moderator toggling the closed state of the article */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the article to interact with */
                id: components["parameters"]["PathArticleId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ToggleArticleClosedRequest"];
            };
        };
        responses: {
            /** @description Article closed state was updated */
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
    toggleArticleTrashed: {
        parameters: {
            query: {
                /** @description ID of the moderator trashing or restoring the article */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the article to interact with */
                id: components["parameters"]["PathArticleId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ToggleArticleTrashedRequest"];
            };
        };
        responses: {
            /** @description Article was trashed */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["MalformedInput"];
            404: components["responses"]["NotFound"];
            500: components["responses"]["ServerError"];
        };
    };
    getArticle: {
        parameters: {
            query?: {
                /** @description ID of the moderator fetching the article */
                moderatorId?: string;
                /** @description When set to true, resolves oembed URLs in the content and replaces them with embed HTML */
                resolveEmbeds?: boolean;
            };
            header?: never;
            path: {
                /** @description ID of the article to fetch */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["Article"];
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    permanentlyDeleteArticle: {
        parameters: {
            query: {
                /** @description ID of the moderator permanently deleting the article */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the article to interact with */
                id: components["parameters"]["PathArticleId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Article permanently deleted */
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
    toggleArticleReplyTrashed: {
        parameters: {
            query: {
                /** @description ID of the moderator trashing/restoring the reply */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description Reply ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ToggleArticleReplyTrashedRequest"];
            };
        };
        responses: {
            /** @description Reply trashed state was updated */
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
    toggleArticleReplyHighlight: {
        parameters: {
            query: {
                /** @description ID of the moderator updating the reply */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description Reply ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ToggleArticleReplyHighlightRequest"];
            };
        };
        responses: {
            /** @description Reply highlight was updated */
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
    promoteArticleReply: {
        parameters: {
            query: {
                /** @description ID of the moderator promoting the reply */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description Reply ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PromoteArticleReplyToConversationRequest"];
            };
        };
        responses: {
            /** @description Reply promoted */
            201: {
                headers: {
                    /** @description Conversation URL */
                    Location?: string;
                    [name: string]: unknown;
                };
                content?: never;
            };
            403: components["responses"]["CategoryRestricted"];
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    moveArticle: {
        parameters: {
            query: {
                /** @description ID of the moderator moving the article */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the article to interact with */
                id: components["parameters"]["PathArticleId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["MoveRequest"];
            };
        };
        responses: {
            /** @description Article was moved */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            403: components["responses"]["CategoryRestricted"];
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    editArticleReply: {
        parameters: {
            query: {
                /** @description ID of the author or moderator making the edits */
                authorId: string;
            };
            header?: never;
            path: {
                /** @description Reply ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditArticleReplyContentRequest"];
            };
        };
        responses: {
            /** @description Reply edited */
            204: {
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
    addArticlePoll: {
        parameters: {
            query: {
                /** @description ID of the moderator adding the poll */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the article to interact with */
                id: components["parameters"]["PathArticleId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AddArticlePollRequest"];
            };
        };
        responses: {
            /** @description Poll was added to the article */
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
    editArticlePollTitle: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the article poll title */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the article to interact with */
                id: components["parameters"]["PathArticleId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditArticlePollTitleRequest"];
            };
        };
        responses: {
            /** @description Article poll title was changed */
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
    editArticlePollOptions: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the article poll options */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the article to interact with */
                id: components["parameters"]["PathArticleId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditArticlePollOptionsRequest"];
            };
        };
        responses: {
            /** @description Article poll options was changed */
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
    getArticlePollResult: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the article to fetch the poll results for */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["Poll"];
            404: components["responses"]["NotFound"];
            500: components["responses"]["ServerError"];
        };
    };
    articleDeletePoll: {
        parameters: {
            query: {
                /** @description ID of the moderator deleting the poll */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the article to interact with */
                id: components["parameters"]["PathArticleId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Poll attached to article deleted */
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
    addArticlePollVote: {
        parameters: {
            query: {
                /** @description ID of the author voting on the poll */
                authorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the article to interact with */
                id: components["parameters"]["PathArticleId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ArticlePollVoteRequest"];
            };
        };
        responses: {
            /** @description Poll vote has been processed */
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
    moveArticleReply: {
        parameters: {
            query: {
                /** @description ID of the moderator moving the reply */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description Reply ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ArticleMoveReplyRequest"];
            };
        };
        responses: {
            /** @description Reply moved */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            403: components["responses"]["CategoryRestricted"];
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    convertToProductUpdate: {
        parameters: {
            query: {
                /** @description ID of the moderator converting the article */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the article to interact with */
                id: components["parameters"]["PathArticleId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Conversion in progress */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            403: components["responses"]["CategoryRestricted"];
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    convertArticleToConversation: {
        parameters: {
            query: {
                /** @description ID of the moderator converting the article */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the article to interact with */
                id: components["parameters"]["PathArticleId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Conversion in progress */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            403: components["responses"]["CategoryRestricted"];
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    changeArticleAuthor: {
        parameters: {
            query: {
                /** @description ID of the moderator changing the author of the  article */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the article to interact with */
                id: components["parameters"]["PathArticleId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ChangeArticleAuthorRequest"];
            };
        };
        responses: {
            /** @description Author has been changed */
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
    approveArticleReply: {
        parameters: {
            query: {
                /** @description ID of the moderator approving the reply */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the article reply to interact with */
                id: components["parameters"]["PathArticleReplyId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Reply was approved */
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
    reportArticleReply: {
        parameters: {
            query: {
                /** @description ID of the author reporting the article reply */
                reportedBy: string;
            };
            header?: never;
            path: {
                /** @description ID of the article reply to interact with */
                id: components["parameters"]["PathArticleReplyId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AbstractReportRequest"];
            };
        };
        responses: {
            /** @description Article reply was reported */
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
    resolveReportedArticleReply: {
        parameters: {
            query: {
                /** @description ID of the moderator resolving the reported article reply */
                reportedBy: string;
            };
            header?: never;
            path: {
                /** @description ID of the article reply to interact with */
                id: components["parameters"]["PathArticleReplyId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Reported article reply was resolved */
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
    setArticleModerationLabel: {
        parameters: {
            query: {
                /** @description ID of the moderator to set the moderation label */
                moderatorId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SetArticleModerationLabelRequest"];
            };
        };
        responses: {
            /** @description Moderation label was set to article */
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
    unsetArticleModerationLabel: {
        parameters: {
            query: {
                /** @description ID of the moderator to unset the moderation label */
                moderatorId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UnsetArticleModerationLabelRequest"];
            };
        };
        responses: {
            /** @description Moderation label was unset from article */
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
    assignModerator: {
        parameters: {
            query: {
                /** @description ID of the moderator to assign the article */
                moderatorId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AssignArticleModeratorRequest"];
            };
        };
        responses: {
            /** @description Moderator was assigned to the article */
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
    unassignModerator: {
        parameters: {
            query: {
                /** @description ID of the moderator to unassign the article */
                moderatorId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UnassignArticleModeratorRequest"];
            };
        };
        responses: {
            /** @description The article was unassigned */
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
    getArticleList: {
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
            200: components["responses"]["ArticleList"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    getArticleListForCategory: {
        parameters: {
            query?: {
                /** @description Selects the page to retrieve on paginated responses. Used in combination with the `pageSize` parameter to paginate over results */
                page?: components["parameters"]["PageNumber"];
                /** @description Limits the number of items returned in a single paginated response. Used in combination with the `page` parameter to paginate over results */
                pageSize?: components["parameters"]["PageSize"];
            };
            header?: never;
            path: {
                /** @description ID of the category to fetch articles for */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["ArticleList"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    getRepliesForArticle: {
        parameters: {
            query?: {
                /** @description ID of the moderator fetching the replies */
                moderatorId?: string;
                /** @description Selects the page to retrieve on paginated responses. Used in combination with the `pageSize` parameter to paginate over results */
                page?: components["parameters"]["PageNumber"];
                /** @description Limits the number of items returned in a single paginated response. Used in combination with the `page` parameter to paginate over results */
                pageSize?: components["parameters"]["PageSize"];
                /** @description Defines the field to sort the results on. By default the response is sorted by oldest first. <br/><ul><li>oldestFirst : The least recent reply to the most recent reply.</li><li>mostRecentFirst : Ordered by most recent to least recent.</li> <li>mostLiked : Ordered by replies which have the most likes to the least likes.</li></ul> */
                sort?: components["parameters"]["ReplySort"];
            };
            header?: never;
            path: {
                /** @description ID of the article to fetch replies for */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["ArticleReplyList"];
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    getReplyForArticle: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the article to fetch the reply for */
                id: string;
                /** @description ID of the reply to fetch */
                replyId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["ArticleReply"];
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    getTrashedArticleList: {
        parameters: {
            query: {
                /** @description ID of the moderator fetching the trashed article list */
                moderatorId: string;
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
            200: components["responses"]["ArticleList"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    getDraftArticleList: {
        parameters: {
            query: {
                /** @description ID of the moderator fetching the draft article list */
                moderatorId: string;
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
            200: components["responses"]["ArticleList"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    markArticleReplyAsSpam: {
        parameters: {
            query: {
                /** @description ID of the moderator */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the article reply to interact with */
                id: components["parameters"]["PathArticleReplyId"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": {
                    /**
                     * @description Whether to ban the author of the content. Defaults to true if not specified.
                     * @example false
                     */
                    banUser?: boolean;
                };
            };
        };
        responses: {
            /** @description Article reply marked as spam */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    markArticleReplyAsNotSpam: {
        parameters: {
            query: {
                /** @description ID of the moderator */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the article reply to interact with */
                id: components["parameters"]["PathArticleReplyId"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": unknown;
            };
        };
        responses: {
            /** @description Article reply marked as not spam */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    getCategoryList: {
        parameters: {
            query?: {
                /** @description Selects the page to retrieve on paginated responses. Used in combination with the `pageSize` parameter to paginate over results */
                page?: components["parameters"]["PageNumber"];
                /** @description Limits the number of items returned in a single paginated response. Used in combination with the `page` parameter to paginate over results */
                pageSize?: components["parameters"]["PageSize"];
                /** @description ID of the user fetching the categories (required if wanting to see non-public categories) */
                authorId?: string;
                /** @description When true, excludes group entries (public, private and hidden groups) from the response so only categories are returned. Defaults to false if not specified. */
                excludeGroups?: boolean;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CategoryList"];
                };
            };
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    getCategory: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the category */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Category"];
                };
            };
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    getVisibleTopicsCount: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * @description Object mapping category IDs to their visible topics count
                         * @example {
                         *       "123": "5",
                         *       "456": "10",
                         *       "789": "3"
                         *     }
                         */
                        result?: {
                            [key: string]: string;
                        };
                    };
                };
            };
            500: components["responses"]["ServerError"];
        };
    };
    markConversationsAsSpam: {
        parameters: {
            query: {
                /** @description ID of the moderator */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the conversation to interact with */
                id: components["parameters"]["PathConversationId"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": {
                    /**
                     * @description Whether to ban the author of the content. Defaults to true if not specified.
                     * @example false
                     */
                    banUser?: boolean;
                };
            };
        };
        responses: {
            /** @description Covnersation marked as spam */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    markConversationAsNotSpam: {
        parameters: {
            query: {
                /** @description ID of the moderator */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the conversation to interact with */
                id: components["parameters"]["PathConversationId"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": unknown;
            };
        };
        responses: {
            /** @description Conversation marked as not spam */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    markConversationReplyAsSpam: {
        parameters: {
            query: {
                /** @description ID of the moderator */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the conversation reply to interact with */
                id: components["parameters"]["PathConversationReplyId"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": {
                    /**
                     * @description Whether to ban the author of the content. Defaults to true if not specified.
                     * @example false
                     */
                    banUser?: boolean;
                };
            };
        };
        responses: {
            /** @description Conversation reply marked as spam */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    markConversationReplyAsNotSpam: {
        parameters: {
            query: {
                /** @description ID of the moderator */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the conversation reply to interact with */
                id: components["parameters"]["PathConversationReplyId"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": unknown;
            };
        };
        responses: {
            /** @description Conversation reply marked as not spam */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    startConversation: {
        parameters: {
            query: {
                /** @description The ID of author of the conversation */
                authorId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["StartConversationRequest"];
            };
        };
        responses: {
            /** @description Conversation started */
            201: {
                headers: {
                    /** @description Conversation URL */
                    Location?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description The private ID of the created conversation */
                        id?: string;
                        /** @description The public ID of the created conversation */
                        publicId?: string;
                    };
                };
            };
            400: components["responses"]["MalformedInput"];
            403: components["responses"]["CategoryRestricted"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    likeConversation: {
        parameters: {
            query: {
                /** @description ID of the author giving the like */
                likedBy: string;
            };
            header?: never;
            path: {
                /** @description ID of the conversation to interact with */
                id: components["parameters"]["PathConversationId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Conversation was liked */
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
    unlikeConversation: {
        parameters: {
            query: {
                /** @description ID of the author revoking the like */
                unlikedBy: string;
            };
            header?: never;
            path: {
                /** @description ID of the conversation to interact with */
                id: components["parameters"]["PathConversationId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Like was revoked from the discussion */
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
    editConversationContent: {
        parameters: {
            query: {
                /** @description ID of the author or moderator making the edits */
                authorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the conversation to interact with */
                id: components["parameters"]["PathConversationId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditConversationContentRequest"];
            };
        };
        responses: {
            /** @description Conversation edited */
            201: {
                headers: {
                    /** @description Conversation URL */
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
    editConversationTags: {
        parameters: {
            query: {
                /** @description ID of the author editing the conversation tags */
                authorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the conversation to interact with */
                id: components["parameters"]["PathConversationId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditConversationTagsRequest"];
            };
        };
        responses: {
            /** @description Conversation tags were changed */
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
    addConversationTags: {
        parameters: {
            query: {
                /** @description ID of the author editing the conversation tags */
                authorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the conversation to interact with */
                id: components["parameters"]["PathConversationId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AddPublicTagsRequest"];
            };
        };
        responses: {
            /** @description Conversation tags were changed */
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
    removeConversationTags: {
        parameters: {
            query: {
                /** @description ID of the author editing the conversation tags */
                authorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the conversation to interact with */
                id: components["parameters"]["PathConversationId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RemovePublicTagsRequest"];
            };
        };
        responses: {
            /** @description Conversation tags were changed */
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
    addConversationModeratorTags: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the conversation tags */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the conversation to interact with */
                id: components["parameters"]["PathConversationId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AddModeratorTagsRequest"];
            };
        };
        responses: {
            /** @description Conversation moderator tags were changed */
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
    removeConversationModeratorTags: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the conversation tags */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the conversation to interact with */
                id: components["parameters"]["PathConversationId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RemoveModeratorTagsRequest"];
            };
        };
        responses: {
            /** @description Conversation moderator tags were changed */
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
    replyConversation: {
        parameters: {
            query: {
                /** @description The ID of the author of this reply */
                authorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the conversation to interact with */
                id: components["parameters"]["PathConversationId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReplyConversationRequest"];
            };
        };
        responses: {
            /** @description Conversation was replied */
            201: {
                headers: {
                    /** @description Conversation reply URL */
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
    addPollVote: {
        parameters: {
            query: {
                /** @description ID of the author voting on the poll */
                authorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the conversation to interact with */
                id: components["parameters"]["PathConversationId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PollVoteRequest"];
            };
        };
        responses: {
            /** @description Poll vote has been processed */
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
    toggleConversationTrashed: {
        parameters: {
            query: {
                /** @description ID of the moderator trashing/restoring the conversation */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the conversation to interact with */
                id: components["parameters"]["PathConversationId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ToggleConversationTrashRequest"];
            };
        };
        responses: {
            /** @description Conversation trashed state updated */
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
    toggleConversationClosed: {
        parameters: {
            query: {
                /** @description ID of the moderator toggling the closed state for this conversation */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the conversation to interact with */
                id: components["parameters"]["PathConversationId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ToggleConversationClosedRequest"];
            };
        };
        responses: {
            /** @description Conversation closed state was updated */
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
    moveConversation: {
        parameters: {
            query: {
                /** @description ID of the moderator moving the conversation */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the conversation to interact with */
                id: components["parameters"]["PathConversationId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["MoveRequest"];
            };
        };
        responses: {
            /** @description Conversation was moved */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            403: components["responses"]["CategoryRestricted"];
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    convertConversation: {
        parameters: {
            query: {
                /** @description ID of the moderator converting the conversation */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the conversation to interact with */
                id: components["parameters"]["PathConversationId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Conversion in progress */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            403: components["responses"]["CategoryRestricted"];
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    convertConversationToArticle: {
        parameters: {
            query: {
                /** @description ID of the moderator converting the conversation */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the conversation to interact with */
                id: components["parameters"]["PathConversationId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Conversion in progress */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            403: components["responses"]["CategoryRestricted"];
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    convertConversationToIdea: {
        parameters: {
            query: {
                /** @description ID of the moderator converting the conversation */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the conversation to interact with */
                id: components["parameters"]["PathConversationId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Conversion in progress */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            403: components["responses"]["CategoryRestricted"];
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    copyConversation: {
        parameters: {
            query: {
                /** @description ID of the moderator copying the conversation */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the conversation to interact with */
                id: components["parameters"]["PathConversationId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CopyConversationRequest"];
            };
        };
        responses: {
            /** @description Conversation was copied */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            403: components["responses"]["CategoryRestricted"];
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    editConversationTitle: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the conversation title */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the conversation to interact with */
                id: components["parameters"]["PathConversationId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditConversationTitleRequest"];
            };
        };
        responses: {
            /** @description Conversation title was changed */
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
    editConversationModeratorTags: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the moderator tags */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the conversation to interact with */
                id: components["parameters"]["PathConversationId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditConversationModeratorTagsRequest"];
            };
        };
        responses: {
            /** @description Conversation moderator tags were changed */
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
    toggleConversationStickyState: {
        parameters: {
            query: {
                /** @description ID of the moderator toggling the conversation sticky state */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the conversation to interact with */
                id: components["parameters"]["PathConversationId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ToggleConversationStickyStateRequest"];
            };
        };
        responses: {
            /** @description Conversation sticky state updated */
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
    getConversation: {
        parameters: {
            query?: {
                /** @description ID of the moderator fetching the conversation */
                moderatorId?: string;
                /** @description When set to true, resolves oembed URLs in the content and replaces them with embed HTML */
                resolveEmbeds?: boolean;
            };
            header?: never;
            path: {
                /** @description ID of the conversation to interact with */
                id: components["parameters"]["PathConversationId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["Conversation"];
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    permanentlyDeleteConversation: {
        parameters: {
            query: {
                /** @description ID of the moderator permanently deleting the conversation */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the conversation to interact with */
                id: components["parameters"]["PathConversationId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Conversation permanently deleted */
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
    toggleConversationReplyTrashed: {
        parameters: {
            query: {
                /** @description ID of the moderator trashing/restoring the reply */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description Reply ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ToggleReplyTrashedRequest"];
            };
        };
        responses: {
            /** @description Reply trashed state was updated */
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
    toggleConversationReplyHighlight: {
        parameters: {
            query: {
                /** @description ID of the moderator updating the reply */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description Reply ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ToggleReplyHighlightRequest"];
            };
        };
        responses: {
            /** @description Reply highlight was updated */
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
    promoteReply: {
        parameters: {
            query: {
                /** @description ID of the moderator promoting the reply */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description Reply ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PromoteReplyToConversationRequest"];
            };
        };
        responses: {
            /** @description Reply promoted */
            201: {
                headers: {
                    /** @description Conversation URL */
                    Location?: string;
                    [name: string]: unknown;
                };
                content?: never;
            };
            403: components["responses"]["CategoryRestricted"];
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    moveConversationReply: {
        parameters: {
            query: {
                /** @description ID of the moderator moving the reply */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description Reply ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["MoveReplyRequest"];
            };
        };
        responses: {
            /** @description Reply moved */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            403: components["responses"]["CategoryRestricted"];
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    likeReply: {
        parameters: {
            query: {
                /** @description ID the author giving the like */
                likedBy: string;
            };
            header?: never;
            path: {
                /** @description Reply ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Reply was liked */
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
    unlikeReply: {
        parameters: {
            query: {
                /** @description ID of the author who unlikes the reply */
                unlikedBy: string;
            };
            header?: never;
            path: {
                /** @description Reply ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Like was revoked from the reply */
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
    editConversationReply: {
        parameters: {
            query: {
                /** @description ID of the author or moderator making the edits */
                authorId: string;
            };
            header?: never;
            path: {
                /** @description Reply ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditReplyContentRequest"];
            };
        };
        responses: {
            /** @description Reply edited */
            204: {
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
    editConversationPollTitle: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the conversation poll title */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the conversation to interact with */
                id: components["parameters"]["PathConversationId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditConversationPollTitleRequest"];
            };
        };
        responses: {
            /** @description Conversation poll title was changed */
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
    editConversationPollOptions: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the conversation poll options */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the conversation to interact with */
                id: components["parameters"]["PathConversationId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditConversationPollOptionsRequest"];
            };
        };
        responses: {
            /** @description Conversation poll options was changed */
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
    getPollResult: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the conversation to interact with */
                id: components["parameters"]["PathConversationId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["Poll"];
            404: components["responses"]["NotFound"];
            500: components["responses"]["ServerError"];
        };
    };
    deleteConversationPoll: {
        parameters: {
            query: {
                /** @description ID of the moderator deleting the poll */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description Conversation ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Poll attached to conversation deleted */
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
    moveConversationToTopic: {
        parameters: {
            query: {
                /** @description ID of the moderator converting the conversation */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the conversation to interact with */
                id: components["parameters"]["PathConversationId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["MoveConversationToTopicRequest"];
            };
        };
        responses: {
            /** @description Conversation moved to topic */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            403: components["responses"]["CategoryRestricted"];
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    pinConversationReply: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Reply ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Reply was pinned */
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
    unpinConversationReply: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Reply ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Reply was pinned */
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
    approveConversation: {
        parameters: {
            query: {
                /** @description ID of the moderator approving the conversation */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the conversation to interact with */
                id: components["parameters"]["PathConversationId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Conversation was approved */
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
    approveConversationReply: {
        parameters: {
            query: {
                /** @description ID of the moderator approving the reply */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the conversation reply to interact with */
                id: components["parameters"]["PathConversationReplyId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Reply was approved */
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
    reportConversation: {
        parameters: {
            query: {
                /** @description ID of the author reporting the conversation */
                reportedBy: string;
            };
            header?: never;
            path: {
                /** @description ID of the conversation to interact with */
                id: components["parameters"]["PathConversationId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AbstractReportRequest"];
            };
        };
        responses: {
            /** @description Conversation was reported */
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
    reportConversationReply: {
        parameters: {
            query: {
                /** @description ID of the author reporting the conversation reply */
                reportedBy: string;
            };
            header?: never;
            path: {
                /** @description ID of the conversation reply to interact with */
                id: components["parameters"]["PathConversationReplyId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AbstractReportRequest"];
            };
        };
        responses: {
            /** @description Conversation reply was reported */
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
    resolveReportedConversation: {
        parameters: {
            query: {
                /** @description ID of the moderator resolving reported conversation */
                resolvedBy: string;
            };
            header?: never;
            path: {
                /** @description ID of the conversation to interact with */
                id: components["parameters"]["PathConversationId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Reported conversation was resolved */
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
    resolveReportedConversationReply: {
        parameters: {
            query: {
                /** @description ID of the moderator resolving the reported conversation reply */
                resolvedBy: string;
            };
            header?: never;
            path: {
                /** @description ID of the conversation reply to interact with */
                id: components["parameters"]["PathConversationReplyId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Reported conversation reply was resolved */
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
    setConversationModerationLabel: {
        parameters: {
            query: {
                /** @description ID of the moderator to set the moderation label */
                moderatorId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SetConversationModerationLabelRequest"];
            };
        };
        responses: {
            /** @description Moderation label was set to conversation */
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
    unsetConversationModerationLabel: {
        parameters: {
            query: {
                /** @description ID of the moderator to unset the moderation label */
                moderatorId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UnsetConversationModerationLabelRequest"];
            };
        };
        responses: {
            /** @description Moderation label was unset from conversation */
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
    conversations_assignModerator_post_assignModerator: {
        parameters: {
            query: {
                /** @description ID of the moderator to assign the conversation */
                moderatorId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AssignConversationModeratorRequest"];
            };
        };
        responses: {
            /** @description Moderator was assigned to the conversation */
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
    conversations_unassignModerator_post_unassignModerator: {
        parameters: {
            query: {
                /** @description ID of the moderator to unassign the conversation */
                moderatorId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UnassignConversationModeratorRequest"];
            };
        };
        responses: {
            /** @description The conversation was unassigned */
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
    getConversationList: {
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
            200: components["responses"]["ConversationList"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    getConversationListForCategory: {
        parameters: {
            query?: {
                /** @description Selects the page to retrieve on paginated responses. Used in combination with the `pageSize` parameter to paginate over results */
                page?: components["parameters"]["PageNumber"];
                /** @description Limits the number of items returned in a single paginated response. Used in combination with the `page` parameter to paginate over results */
                pageSize?: components["parameters"]["PageSize"];
            };
            header?: never;
            path: {
                /** @description ID of the category to fetch conversations */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["ConversationList"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    getTrashedConversationList: {
        parameters: {
            query: {
                /** @description ID of the moderator fetching the trashed conversation list */
                moderatorId: string;
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
            200: components["responses"]["ConversationList"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    markIdeaAsSpam: {
        parameters: {
            query: {
                /** @description ID of the moderator */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the idea to interact with */
                id: components["parameters"]["PathIdeaId"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": {
                    /**
                     * @description Whether to ban the author of the content. Defaults to true if not specified.
                     * @example false
                     */
                    banUser?: boolean;
                };
            };
        };
        responses: {
            /** @description Idea marked as spam */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    markIdeaAsNotSpam: {
        parameters: {
            query: {
                /** @description ID of the moderator */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the idea to interact with */
                id: components["parameters"]["PathIdeaId"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": unknown;
            };
        };
        responses: {
            /** @description Idea marked as not spam */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    markIdeaReplyAsSpam: {
        parameters: {
            query: {
                /** @description ID of the moderator */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the idea reply to interact with */
                id: components["parameters"]["PathIdeaReplyId"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": {
                    /**
                     * @description Whether to ban the author of the content. Defaults to true if not specified.
                     * @example false
                     */
                    banUser?: boolean;
                };
            };
        };
        responses: {
            /** @description Idea reply marked as spam */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    markIdeaReplyAsNotSpam: {
        parameters: {
            query: {
                /** @description ID of the moderator */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the idea reply to interact with */
                id: components["parameters"]["PathIdeaReplyId"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": unknown;
            };
        };
        responses: {
            /** @description Idea reply marked as not spam */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    submitIdea: {
        parameters: {
            query: {
                /** @description The ID of author of the idea */
                authorId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SubmitIdeaRequest"];
            };
        };
        responses: {
            /** @description Idea submitted */
            201: {
                headers: {
                    /** @description Idea URL */
                    Location?: string;
                    /** @description 1 if the idea is spam, 0 if not spam */
                    "Is-Spam"?: number;
                    /** @description 1 if the idea is pending, 0 if not pending */
                    "Is-Pending"?: number;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description The private ID of the created idea */
                        id?: string;
                        /** @description The public ID of the created idea */
                        publicId?: string;
                    };
                };
            };
            400: components["responses"]["MalformedInput"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    voteIdea: {
        parameters: {
            query: {
                /** @description ID of the author giving the vote */
                votedBy: string;
            };
            header?: never;
            path: {
                /** @description ID of the idea to interact with */
                id: components["parameters"]["PathIdeaId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Idea was voted */
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
    unvoteIdea: {
        parameters: {
            query: {
                /** @description ID of the author revoking the vote */
                unvotedBy: string;
            };
            header?: never;
            path: {
                /** @description ID of the idea to interact with */
                id: components["parameters"]["PathIdeaId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Vote was revoked from the idea */
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
    editIdeaContent: {
        parameters: {
            query: {
                /** @description ID of the author or moderator making the edits */
                authorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the idea to interact with */
                id: components["parameters"]["PathIdeaId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditIdeaContentRequest"];
            };
        };
        responses: {
            /** @description Idea edited */
            201: {
                headers: {
                    /** @description Idea URL */
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
    editIdeaTags: {
        parameters: {
            query: {
                /** @description ID of the author editing the idea tags */
                authorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the idea to interact with */
                id: components["parameters"]["PathIdeaId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditIdeaTagsRequest"];
            };
        };
        responses: {
            /** @description Idea tags were changed */
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
    addIdeaTags: {
        parameters: {
            query: {
                /** @description ID of the author editing the idea tags */
                authorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the idea to interact with */
                id: components["parameters"]["PathIdeaId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AddPublicTagsRequest"];
            };
        };
        responses: {
            /** @description Idea tags were changed */
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
    removeIdeaTags: {
        parameters: {
            query: {
                /** @description ID of the author editing the idea tags */
                authorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the idea to interact with */
                id: components["parameters"]["PathIdeaId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RemovePublicTagsRequest"];
            };
        };
        responses: {
            /** @description Idea tags were changed */
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
    addIdeaModeratorTags: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the idea tags */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the idea to interact with */
                id: components["parameters"]["PathIdeaId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AddModeratorTagsRequest"];
            };
        };
        responses: {
            /** @description Idea moderator tags were changed */
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
    removeIdeaModeratorTags: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the idea tags */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the idea to interact with */
                id: components["parameters"]["PathIdeaId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RemoveModeratorTagsRequest"];
            };
        };
        responses: {
            /** @description Idea moderator tags were changed */
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
    replyIdea: {
        parameters: {
            query: {
                /** @description The ID of the author of this reply */
                authorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the idea to interact with */
                id: components["parameters"]["PathIdeaId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReplyIdeaRequest"];
            };
        };
        responses: {
            /** @description Idea was replied */
            201: {
                headers: {
                    /** @description Idea reply URL */
                    Location?: string;
                    /** @description 1 if the reply is spam, 0 if not spam */
                    "Is-Spam"?: number;
                    /** @description 1 if the reply is pending, 0 if not pending */
                    "Is-Pending"?: number;
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["MalformedInput"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    toggleIdeaTrashed: {
        parameters: {
            query: {
                /** @description ID of the moderator trashing/restoring the idea */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the idea to interact with */
                id: components["parameters"]["PathIdeaId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ToggleIdeaTrashRequest"];
            };
        };
        responses: {
            /** @description Idea trashed state updated */
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
    toggleIdeaClosed: {
        parameters: {
            query: {
                /** @description ID of the moderator toggling the closed state for this idea */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the idea to interact with */
                id: components["parameters"]["PathIdeaId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ToggleIdeaClosedRequest"];
            };
        };
        responses: {
            /** @description Idea closed state was updated */
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
    editIdeaTitle: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the idea title */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the idea to interact with */
                id: components["parameters"]["PathIdeaId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditIdeaTitleRequest"];
            };
        };
        responses: {
            /** @description Idea title was changed */
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
    editIdeaModeratorTags: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the moderator tags */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the idea to interact with */
                id: components["parameters"]["PathIdeaId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditIdeaModeratorTagsRequest"];
            };
        };
        responses: {
            /** @description Idea moderator tags were changed */
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
    toggleIdeaStickyState: {
        parameters: {
            query: {
                /** @description ID of the moderator toggling the idea sticky state */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the idea to interact with */
                id: components["parameters"]["PathIdeaId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ToggleIdeaStickyStateRequest"];
            };
        };
        responses: {
            /** @description Idea sticky state updated */
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
    getIdea: {
        parameters: {
            query?: {
                /** @description ID of the moderator fetching the idea */
                moderatorId?: string;
                /** @description When set to true, resolves oembed URLs in the content and replaces them with embed HTML */
                resolveEmbeds?: boolean;
            };
            header?: never;
            path: {
                /** @description ID of the idea to interact with */
                id: components["parameters"]["PathIdeaId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["Idea"];
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    permanentlyDeleteIdea: {
        parameters: {
            query: {
                /** @description ID of the moderator permanently deleting the idea */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the idea to interact with */
                id: components["parameters"]["PathIdeaId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Idea permanently deleted */
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
    toggleIdeaReplyTrashed: {
        parameters: {
            query: {
                /** @description ID of the moderator trashing/restoring the reply */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description Reply ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ToggleReplyTrashedRequest"];
            };
        };
        responses: {
            /** @description Reply trashed state was updated */
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
    toggleIdeaReplyHighlight: {
        parameters: {
            query: {
                /** @description ID of the moderator updating the reply */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description Reply ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ToggleReplyHighlightRequest"];
            };
        };
        responses: {
            /** @description Reply highlight was updated */
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
    promoteIdeaReply: {
        parameters: {
            query: {
                /** @description ID of the moderator promoting the reply */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description Reply ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PromoteIdeaReplyToConversationRequest"];
            };
        };
        responses: {
            /** @description Reply promoted */
            201: {
                headers: {
                    /** @description Conversation URL */
                    Location?: string;
                    [name: string]: unknown;
                };
                content?: never;
            };
            403: components["responses"]["CategoryRestricted"];
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    moveIdeaReply: {
        parameters: {
            query: {
                /** @description ID of the moderator moving the reply */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description Reply ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["MoveReplyRequest"];
            };
        };
        responses: {
            /** @description Reply moved */
            201: {
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
    likeIdeaReply: {
        parameters: {
            query: {
                /** @description ID the author giving the like */
                likedBy: string;
            };
            header?: never;
            path: {
                /** @description Reply ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Reply was liked */
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
    unlikeIdeaReply: {
        parameters: {
            query: {
                /** @description ID of the author who unlikes the reply */
                unlikedBy: string;
            };
            header?: never;
            path: {
                /** @description Reply ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Like was revoked from the reply */
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
    editIdeaReply: {
        parameters: {
            query: {
                /** @description ID of the author or moderator making the edits */
                authorId: string;
            };
            header?: never;
            path: {
                /** @description Reply ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditReplyContentRequest"];
            };
        };
        responses: {
            /** @description Reply edited */
            204: {
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
    mergeIdeaVotes: {
        parameters: {
            query: {
                /** @description ID of the moderator to merge the votes */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description Idea Id to merge the votes from */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["MergeIdeaVotesRequest"];
            };
        };
        responses: {
            /** @description Idea votes were merged */
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
    setIdeaModerationLabel: {
        parameters: {
            query: {
                /** @description ID of the moderator to set the moderation label */
                moderatorId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SetIdeaModerationLabelRequest"];
            };
        };
        responses: {
            /** @description Moderation label was set to idea */
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
    unsetIdeaModerationLabel: {
        parameters: {
            query: {
                /** @description ID of the moderator to unset the moderation label */
                moderatorId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UnsetIdeaModerationLabelRequest"];
            };
        };
        responses: {
            /** @description Moderation label was unset from idea */
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
    ideas_assignModerator_post_assignModerator: {
        parameters: {
            query: {
                /** @description ID of the moderator to assign the idea */
                moderatorId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AssignIdeaModeratorRequest"];
            };
        };
        responses: {
            /** @description Moderator was assigned to the idea */
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
    ideas_unassignModerator_post_unassignModerator: {
        parameters: {
            query: {
                /** @description ID of the moderator to unassign the idea */
                moderatorId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UnassignIdeaModeratorRequest"];
            };
        };
        responses: {
            /** @description The idea was unassigned */
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
    createIdeaStatus: {
        parameters: {
            query: {
                /** @description The ID of the author of the IdeaStatus */
                authorId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateIdeaStatusRequest"];
            };
        };
        responses: {
            /** @description IdeaStatus created */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    editIdeaStatus: {
        parameters: {
            query: {
                /** @description ID of the moderator to edit the IdeaStatus */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description Idea Status Id to be edited */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditIdeaStatusRequest"];
            };
        };
        responses: {
            /** @description IdeaStatus created */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    deleteIdeaStatus: {
        parameters: {
            query: {
                /** @description ID of the moderator permanently deleting the idea status */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description Idea Status Id to be edited */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Idea Status permanently deleted */
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
    reorderIdeaStatuses: {
        parameters: {
            query: {
                /** @description ID of the moderator */
                moderatorId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReorderIdeaStatusesRequest"];
            };
        };
        responses: {
            /** @description Idea Statuses reordered */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    pinIdeaReply: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Reply ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Reply was pinned */
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
    unpinIdeaReply: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Reply ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Reply was pinned */
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
    assign_idea_status: {
        parameters: {
            query: {
                /** @description ID of the moderator assigning the idea status */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description Idea private ID to be assigned */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AssignIdeaStatusRequest"];
            };
        };
        responses: {
            /** @description Idea Status to be assigned */
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
    editIdeaProductAreas: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the idea product areas */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the idea to interact with */
                id: components["parameters"]["PathIdeaId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditIdeaProductAreasRequest"];
            };
        };
        responses: {
            /** @description ProductUpdate product areas were changed */
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
    changeIdeaStatusType: {
        parameters: {
            query: {
                /** @description ID of the moderator changing the Idea Status type */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the idea status to interact with */
                id: components["parameters"]["PathIdeaStatusId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ChangeIdeaStatusTypeRequest"];
            };
        };
        responses: {
            /** @description Idea Status type was changed */
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
    convertIdeaToQuestion: {
        parameters: {
            query: {
                /** @description ID of the moderator converting the idea */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the idea to interact with */
                id: components["parameters"]["PathIdeaId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ConvertIdeaToQuestionRequest"];
            };
        };
        responses: {
            /** @description Conversion in progress */
            202: {
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
    convertIdeaToConversation: {
        parameters: {
            query: {
                /** @description ID of the moderator converting the idea */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the idea to interact with */
                id: components["parameters"]["PathIdeaId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ConvertIdeaToConversationRequest"];
            };
        };
        responses: {
            /** @description Conversion in progress */
            202: {
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
    approveIdea: {
        parameters: {
            query: {
                /** @description ID of the moderator approving the idea */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the idea to interact with */
                id: components["parameters"]["PathIdeaId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Idea was approved */
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
    approveIdeaReply: {
        parameters: {
            query: {
                /** @description ID of the moderator approving the reply */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the idea reply to interact with */
                id: components["parameters"]["PathIdeaReplyId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Reply was approved */
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
    reportIdea: {
        parameters: {
            query: {
                /** @description ID of the author reporting the idea */
                reportedBy: string;
            };
            header?: never;
            path: {
                /** @description ID of the idea to interact with */
                id: components["parameters"]["PathIdeaId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AbstractReportRequest"];
            };
        };
        responses: {
            /** @description Idea was reported */
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
    reportIdeaReply: {
        parameters: {
            query: {
                /** @description ID of the author reporting the idea reply */
                reportedBy: string;
            };
            header?: never;
            path: {
                /** @description ID of the idea reply to interact with */
                id: components["parameters"]["PathIdeaReplyId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AbstractReportRequest"];
            };
        };
        responses: {
            /** @description Idea reply was reported */
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
    resolveReportedIdea: {
        parameters: {
            query: {
                /** @description ID of the moderator resolving reported idea */
                resolvedBy: string;
            };
            header?: never;
            path: {
                /** @description ID of the idea to interact with */
                id: components["parameters"]["PathIdeaId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Reported idea was resolved */
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
    resolveReportedIdeaReply: {
        parameters: {
            query: {
                /** @description ID of the moderator resolving the reported idea reply */
                reportedBy: string;
            };
            header?: never;
            path: {
                /** @description ID of the idea reply to interact with */
                id: components["parameters"]["PathIdeaReplyId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Reported idea reply was resolved */
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
    getIdeaList: {
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
            200: components["responses"]["IdeaList"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    getTrashedIdeaList: {
        parameters: {
            query: {
                /** @description ID of the moderator fetching the trashed idea list */
                moderatorId: string;
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
            200: components["responses"]["IdeaList"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    getIdeaStatusList: {
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
            200: components["responses"]["IdeaStatusList"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    getRepliesForIdea: {
        parameters: {
            query?: {
                /** @description ID of the moderator fetching the replies */
                moderatorId?: string;
                /**
                 * @description Filter trashed replies from result, for example to retrieve only not trashed replies. Not passing this parameter will return replies including trashed replies
                 * @example true
                 */
                onlyNotTrashed?: boolean;
                /** @description Selects the page to retrieve on paginated responses. Used in combination with the `pageSize` parameter to paginate over results */
                page?: components["parameters"]["PageNumber"];
                /** @description Limits the number of items returned in a single paginated response. Used in combination with the `page` parameter to paginate over results */
                pageSize?: components["parameters"]["PageSize"];
                /** @description Defines the field to sort the results on. By default the response is sorted by oldest first. <br/><ul><li>oldestFirst : The least recent reply to the most recent reply.</li><li>mostRecentFirst : Ordered by most recent to least recent.</li> <li>mostLiked : Ordered by replies which have the most likes to the least likes.</li></ul> */
                sort?: components["parameters"]["ReplySort"];
            };
            header?: never;
            path: {
                /** @description ID of the idea to interact with */
                id: components["parameters"]["PathIdeaId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["IdeaReplyList"];
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    getReplyForIdea: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the idea to interact with */
                id: components["parameters"]["PathIdeaId"];
                /** @description ID of the reply to fetch */
                replyId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["IdeaReply"];
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    deleteModeratorTags: {
        parameters: {
            query: {
                /**
                 * @description ID of the moderator deleting moderator tags
                 * @example 1
                 */
                moderatorId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["DeleteModeratorTagsRequest"];
            };
        };
        responses: {
            /** @description Moderator tags deleted */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["ValidationError"];
        };
    };
    getModeratorTagList: {
        parameters: {
            query?: {
                /**
                 * @description The search term which will match the moderator tag name. Skipping this parameter will return all moderator tags
                 * @example search-term
                 */
                q?: string;
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
            /** @description Successful response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ModeratorTagList"];
                };
            };
            422: components["responses"]["ValidationError"];
        };
    };
    createProductArea: {
        parameters: {
            query: {
                /** @description The ID of the author of the ProductArea */
                authorId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateProductAreaRequest"];
            };
        };
        responses: {
            /** @description ProductArea created */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    renameProductArea: {
        parameters: {
            query: {
                /** @description The ID of the moderator renaming ProductArea */
                moderatorId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RenameProductAreaRequest"];
            };
        };
        responses: {
            /** @description ProductArea renamed */
            200: {
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
    deleteProductArea: {
        parameters: {
            query: {
                /** @description The ID of the moderator deleting ProductArea */
                moderatorId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["DeleteProductAreaRequest"];
            };
        };
        responses: {
            /** @description ProductArea deleted */
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
    assignProductAreas: {
        parameters: {
            query: {
                /** @description The ID of the moderator assigning the ProductAreas to Ideas */
                moderatorId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AssignProductAreasRequest"];
            };
        };
        responses: {
            /** @description ProductAreas assigned */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    getProductAreaList: {
        parameters: {
            query?: {
                /**
                 * @description The search term which will match the product area name. Skipping this parameter will return all product areas
                 * @example search-term
                 */
                q?: string;
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
            /** @description Successful response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductAreaList"];
                };
            };
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    markProductUpdateReplyAsSpam: {
        parameters: {
            query: {
                /** @description ID of the moderator */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the product update reply to interact with */
                id: components["parameters"]["PathProductUpdateReplyId"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": {
                    /**
                     * @description Whether to ban the author of the content. Defaults to true if not specified.
                     * @example false
                     */
                    banUser?: boolean;
                };
            };
        };
        responses: {
            /** @description ProductUpdate reply marked as spam */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    markProductUpdateReplyAsNotSpam: {
        parameters: {
            query: {
                /** @description ID of the moderator */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the product update reply to interact with */
                id: components["parameters"]["PathProductUpdateReplyId"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": unknown;
            };
        };
        responses: {
            /** @description ProductUpdate reply marked as not spam */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    createProductUpdate: {
        parameters: {
            query: {
                /** @description The ID of the author of the productUpdate */
                authorId: string;
                /** @description The ID of the moderator who will create the product update on behalf of the author (who in this case can be a registered user as well) */
                moderatorId?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateProductUpdateRequest"];
            };
        };
        responses: {
            /** @description ProductUpdate created */
            201: {
                headers: {
                    /** @description ProductUpdate URL */
                    Location?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description The private ID of the created product update */
                        id?: string;
                        /** @description The public ID of the created product update */
                        publicId?: string;
                    };
                };
            };
            400: components["responses"]["MalformedInput"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    publishProductUpdate: {
        parameters: {
            query: {
                /** @description ID of the moderator publishing the productUpdate */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the product update to interact with */
                id: components["parameters"]["PathProductUpdateId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description ProductUpdate published */
            201: {
                headers: {
                    /** @description ProductUpdate URL */
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
    replyProductUpdate: {
        parameters: {
            query: {
                /** @description The ID of the author of this reply */
                authorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the product update to interact with */
                id: components["parameters"]["PathProductUpdateId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReplyProductUpdateRequest"];
            };
        };
        responses: {
            /** @description ProductUpdate was replied */
            201: {
                headers: {
                    /** @description ProductUpdate reply URL */
                    Location?: string;
                    /** @description 1 if the reply is spam, 0 if not spam */
                    "Is-Spam"?: number;
                    /** @description 1 if the reply is pending, 0 if not pending */
                    "Is-Pending"?: number;
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["MalformedInput"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    likeProductUpdate: {
        parameters: {
            query: {
                /** @description ID the author giving the like */
                likedBy: string;
            };
            header?: never;
            path: {
                /** @description ID of the product update to interact with */
                id: components["parameters"]["PathProductUpdateId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description ProductUpdate was liked */
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
    unlikeProductUpdate: {
        parameters: {
            query: {
                /** @description ID the author revoking the like */
                unlikedBy: string;
            };
            header?: never;
            path: {
                /** @description ID of the product update to interact with */
                id: components["parameters"]["PathProductUpdateId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Like was revoked from the discussion */
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
    editProductUpdateContent: {
        parameters: {
            query: {
                /** @description ID of the author or moderator making the edits */
                authorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the product update to interact with */
                id: components["parameters"]["PathProductUpdateId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditProductUpdateContentRequest"];
            };
        };
        responses: {
            /** @description ProductUpdate edited */
            201: {
                headers: {
                    /** @description ProductUpdate URL */
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
    editProductUpdateTitle: {
        parameters: {
            query: {
                /** @description ID of the moderator making the edits */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the product update to interact with */
                id: components["parameters"]["PathProductUpdateId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditProductUpdateTitleRequest"];
            };
        };
        responses: {
            /** @description ProductUpdate edited */
            201: {
                headers: {
                    /** @description ProductUpdate URL */
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
    likeProductUpdateReply: {
        parameters: {
            query: {
                /** @description ID the author giving the like */
                likedBy: string;
            };
            header?: never;
            path: {
                /** @description Reply ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Reply was liked */
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
    unlikeProductUpdateReply: {
        parameters: {
            query: {
                /** @description ID of the author who unlikes the reply */
                unlikedBy: string;
            };
            header?: never;
            path: {
                /** @description Reply ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Reply was liked */
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
    editProductUpdateModeratorTags: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the moderator tags */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the product update to interact with */
                id: components["parameters"]["PathProductUpdateId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditProductUpdateModeratorTagsRequest"];
            };
        };
        responses: {
            /** @description ProductUpdate moderator tags were changed */
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
    editProductUpdateTags: {
        parameters: {
            query: {
                /** @description ID of the author editing the productUpdate tags */
                authorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the product update to interact with */
                id: components["parameters"]["PathProductUpdateId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditProductUpdateTagsRequest"];
            };
        };
        responses: {
            /** @description ProductUpdate tags were changed */
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
    addProductUpdateTags: {
        parameters: {
            query: {
                /** @description ID of the author editing the productUpdate tags */
                authorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the product update to interact with */
                id: components["parameters"]["PathProductUpdateId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AddPublicTagsRequest"];
            };
        };
        responses: {
            /** @description ProductUpdate tags were changed */
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
    removeProductUpdateTags: {
        parameters: {
            query: {
                /** @description ID of the author editing the productUpdate tags */
                authorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the product update to interact with */
                id: components["parameters"]["PathProductUpdateId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RemovePublicTagsRequest"];
            };
        };
        responses: {
            /** @description ProductUpdate tags were changed */
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
    addProductUpdateModeratorTags: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the productUpdate tags */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the product update to interact with */
                id: components["parameters"]["PathProductUpdateId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AddModeratorTagsRequest"];
            };
        };
        responses: {
            /** @description ProductUpdate moderator tags were changed */
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
    removeProductUpdateModeratorTags: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the productUpdate tags */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the product update to interact with */
                id: components["parameters"]["PathProductUpdateId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RemoveModeratorTagsRequest"];
            };
        };
        responses: {
            /** @description ProductUpdate moderator tags were changed */
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
    editProductUpdateProductAreas: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the productUpdate product areas */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the product update to interact with */
                id: components["parameters"]["PathProductUpdateId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditProductUpdateProductAreasRequest"];
            };
        };
        responses: {
            /** @description ProductUpdate product areas were changed */
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
    editProductUpdateFeaturedImage: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the featured image */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the product update to interact with */
                id: components["parameters"]["PathProductUpdateId"];
            };
            cookie?: never;
        };
        /** @description The featured image url. To remove the featured image from the productUpdate, then this field should be empty. */
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditProductUpdateFeaturedImageRequest"];
            };
        };
        responses: {
            /** @description ProductUpdate featured image was changed */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    editProductUpdateFeaturedImageAltText: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the featured image alt text */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the product update to interact with */
                id: components["parameters"]["PathProductUpdateId"];
            };
            cookie?: never;
        };
        /** @description The featured image alt text. Alternative text for the featured image. */
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditProductUpdateFeaturedImageAltTextRequest"];
            };
        };
        responses: {
            /** @description ProductUpdate featured image alt text was changed */
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
    editProductUpdatePublicLabel: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the public label */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the product update to interact with */
                id: components["parameters"]["PathProductUpdateId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditProductUpdatePublicLabelRequest"];
            };
        };
        responses: {
            /** @description ProductUpdate public label was changed */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
        };
    };
    toggleProductUpdateStickyState: {
        parameters: {
            query: {
                /** @description ID of the moderator toggling the productUpdate sticky state */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the product update to interact with */
                id: components["parameters"]["PathProductUpdateId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ToggleProductUpdateStickyStateRequest"];
            };
        };
        responses: {
            /** @description ProductUpdate sticky state updated */
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
    toggleProductUpdateClosed: {
        parameters: {
            query: {
                /** @description ID of the moderator toggling the closed state of the productUpdate */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the product update to interact with */
                id: components["parameters"]["PathProductUpdateId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ToggleProductUpdateClosedRequest"];
            };
        };
        responses: {
            /** @description ProductUpdate closed state was updated */
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
    toggleProductUpdateTrashed: {
        parameters: {
            query: {
                /** @description ID of the moderator trashing or restoring the productUpdate */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the product update to interact with */
                id: components["parameters"]["PathProductUpdateId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ToggleProductUpdateTrashedRequest"];
            };
        };
        responses: {
            /** @description ProductUpdate was trashed */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["MalformedInput"];
            404: components["responses"]["NotFound"];
            500: components["responses"]["ServerError"];
        };
    };
    getProductUpdate: {
        parameters: {
            query?: {
                /** @description ID of the moderator fetching the productUpdate */
                moderatorId?: string;
                /** @description When set to true, resolves oembed URLs in the content and replaces them with embed HTML */
                resolveEmbeds?: boolean;
            };
            header?: never;
            path: {
                /** @description ID of the productUpdate to fetch */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["ProductUpdate"];
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    permanentlyDeleteProductUpdate: {
        parameters: {
            query: {
                /** @description ID of the moderator permanently deleting the productUpdate */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the product update to interact with */
                id: components["parameters"]["PathProductUpdateId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description ProductUpdate permanently deleted */
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
    toggleProductUpdateReplyTrashed: {
        parameters: {
            query: {
                /** @description ID of the moderator trashing/restoring the reply */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description Reply ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ToggleProductUpdateReplyTrashedRequest"];
            };
        };
        responses: {
            /** @description Reply trashed state was updated */
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
    toggleProductUpdateReplyHighlight: {
        parameters: {
            query: {
                /** @description ID of the moderator updating the reply */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description Reply ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ToggleProductUpdateReplyHighlightRequest"];
            };
        };
        responses: {
            /** @description Reply highlight was updated */
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
    promoteProductUpdateReply: {
        parameters: {
            query: {
                /** @description ID of the moderator promoting the reply */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description Reply ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PromoteProductUpdateReplyToConversationRequest"];
            };
        };
        responses: {
            /** @description Reply promoted */
            201: {
                headers: {
                    /** @description Conversation URL */
                    Location?: string;
                    [name: string]: unknown;
                };
                content?: never;
            };
            403: components["responses"]["CategoryRestricted"];
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    editProductUpdateReply: {
        parameters: {
            query: {
                /** @description ID of the author or moderator making the edits */
                authorId: string;
            };
            header?: never;
            path: {
                /** @description Reply ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditProductUpdateReplyContentRequest"];
            };
        };
        responses: {
            /** @description Reply edited */
            204: {
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
    addProductUpdatePoll: {
        parameters: {
            query: {
                /** @description ID of the moderator adding the poll */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the product update to interact with */
                id: components["parameters"]["PathProductUpdateId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AddProductUpdatePollRequest"];
            };
        };
        responses: {
            /** @description Poll was added to the product update */
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
    editProductUpdatePollTitle: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the productUpdate poll title */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the product update to interact with */
                id: components["parameters"]["PathProductUpdateId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditProductUpdatePollTitleRequest"];
            };
        };
        responses: {
            /** @description ProductUpdate poll title was changed */
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
    editProductUpdatePollOptions: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the productUpdate poll options */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the product update to interact with */
                id: components["parameters"]["PathProductUpdateId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditProductUpdatePollOptionsRequest"];
            };
        };
        responses: {
            /** @description ProductUpdate poll options was changed */
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
    getProductUpdatePollResult: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the productUpdate to fetch the poll results for */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["Poll"];
            404: components["responses"]["NotFound"];
            500: components["responses"]["ServerError"];
        };
    };
    productUpdateDeletePoll: {
        parameters: {
            query: {
                /** @description ID of the moderator deleting the poll */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the product update to interact with */
                id: components["parameters"]["PathProductUpdateId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Poll attached to productUpdate deleted */
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
    addProductUpdatePollVote: {
        parameters: {
            query: {
                /** @description ID of the author voting on the poll */
                authorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the product update to interact with */
                id: components["parameters"]["PathProductUpdateId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ProductUpdatePollVoteRequest"];
            };
        };
        responses: {
            /** @description Poll vote has been processed */
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
    moveProductUpdateReply: {
        parameters: {
            query: {
                /** @description ID of the moderator moving the reply */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description Reply ID */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ProductUpdateMoveReplyRequest"];
            };
        };
        responses: {
            /** @description Reply moved */
            201: {
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
    changeProductUpdateAuthor: {
        parameters: {
            query: {
                /** @description ID of the moderator changing the author of the product update */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the product update to interact with */
                id: components["parameters"]["PathProductUpdateId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ChangeProductUpdateAuthorRequest"];
            };
        };
        responses: {
            /** @description Author has been changed */
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
    approveProductUpdateReply: {
        parameters: {
            query: {
                /** @description ID of the moderator approving the reply */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the product update reply to interact with */
                id: components["parameters"]["PathProductUpdateReplyId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Reply was approved */
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
    reportProductUpdateReply: {
        parameters: {
            query: {
                /** @description ID of the author reporting the product update reply */
                reportedBy: string;
            };
            header?: never;
            path: {
                /** @description ID of the product update reply to interact with */
                id: components["parameters"]["PathProductUpdateReplyId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AbstractReportRequest"];
            };
        };
        responses: {
            /** @description Product update reply was reported */
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
    resolveReportedProductUpdateReply: {
        parameters: {
            query: {
                /** @description ID of the moderator resolving the reported product update reply */
                reportedBy: string;
            };
            header?: never;
            path: {
                /** @description ID of the product update reply to interact with */
                id: components["parameters"]["PathProductUpdateReplyId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Reported product update reply was resolved */
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
    setProductUpdateModerationLabel: {
        parameters: {
            query: {
                /** @description ID of the moderator to set the moderation label */
                moderatorId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SetProductUpdateModerationLabelRequest"];
            };
        };
        responses: {
            /** @description Moderation label was set to productUpdate */
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
    unsetProductUpdateModerationLabel: {
        parameters: {
            query: {
                /** @description ID of the moderator to unset the moderation label */
                moderatorId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UnsetProductUpdateModerationLabelRequest"];
            };
        };
        responses: {
            /** @description Moderation label was unset from productUpdate */
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
    productUpdates_assignModerator_post_assignModerator: {
        parameters: {
            query: {
                /** @description ID of the moderator to assign the productUpdate */
                moderatorId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AssignProductUpdateModeratorRequest"];
            };
        };
        responses: {
            /** @description Moderator was assigned to the productUpdate */
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
    productUpdates_unassignModerator_post_unassignModerator: {
        parameters: {
            query: {
                /** @description ID of the moderator to unassign the productUpdate */
                moderatorId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UnassignProductUpdateModeratorRequest"];
            };
        };
        responses: {
            /** @description The productUpdate was unassigned */
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
    getProductUpdateList: {
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
            200: components["responses"]["ProductUpdateList"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    getRepliesForProductUpdate: {
        parameters: {
            query?: {
                /** @description ID of the moderator fetching the replies */
                moderatorId?: string;
                /**
                 * @description Filter trashed replies from result, for example to retrieve only not trashed replies. Not passing this parameter will return replies including trashed replies
                 * @example true
                 */
                onlyNotTrashed?: boolean;
                /** @description Selects the page to retrieve on paginated responses. Used in combination with the `pageSize` parameter to paginate over results */
                page?: components["parameters"]["PageNumber"];
                /** @description Limits the number of items returned in a single paginated response. Used in combination with the `page` parameter to paginate over results */
                pageSize?: components["parameters"]["PageSize"];
                /** @description Defines the field to sort the results on. By default the response is sorted by oldest first. <br/><ul><li>oldestFirst : The least recent reply to the most recent reply.</li><li>mostRecentFirst : Ordered by most recent to least recent.</li> <li>mostLiked : Ordered by replies which have the most likes to the least likes.</li></ul> */
                sort?: components["parameters"]["ReplySort"];
            };
            header?: never;
            path: {
                /** @description ID of the productUpdate to fetch replies for */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["ProductUpdateReplyList"];
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    getReplyForProductUpdate: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the productUpdate to fetch the reply for */
                id: string;
                /** @description ID of the reply to fetch */
                replyId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["ProductUpdateReply"];
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    getTrashedProductUpdateList: {
        parameters: {
            query: {
                /** @description ID of the moderator fetching the trashed productUpdate list */
                moderatorId: string;
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
            200: components["responses"]["ProductUpdateList"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    getDraftProductUpdateList: {
        parameters: {
            query: {
                /** @description ID of the moderator fetching the draft productUpdate list */
                moderatorId: string;
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
            200: components["responses"]["ProductUpdateList"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    markQuestionAsSpam: {
        parameters: {
            query: {
                /** @description ID of the moderator */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the question to interact with */
                id: components["parameters"]["PathQuestionId"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": {
                    /**
                     * @description Whether to ban the author of the content. Defaults to true if not specified.
                     * @example false
                     */
                    banUser?: boolean;
                };
            };
        };
        responses: {
            /** @description Question marked as spam */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    markQuestionAsNotSpam: {
        parameters: {
            query: {
                /** @description ID of the moderator */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the question to interact with */
                id: components["parameters"]["PathQuestionId"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": unknown;
            };
        };
        responses: {
            /** @description Question marked as not spam */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    markQuestionReplyAsSpam: {
        parameters: {
            query: {
                /** @description ID of the moderator */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the question reply to interact with */
                replyId: components["parameters"]["PathQuestionReplyId"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": {
                    /**
                     * @description Whether to ban the author of the content. Defaults to true if not specified.
                     * @example false
                     */
                    banUser?: boolean;
                };
            };
        };
        responses: {
            /** @description Question reply marked as spam */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    markQuestionReplyAsNotSpam: {
        parameters: {
            query: {
                /** @description ID of the moderator */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the question reply to interact with */
                replyId: components["parameters"]["PathQuestionReplyId"];
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": unknown;
            };
        };
        responses: {
            /** @description Question reply marked as not spam */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    askQuestion: {
        parameters: {
            query: {
                /** @description The ID of the author of the question */
                authorId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AskQuestionRequest"];
            };
        };
        responses: {
            /** @description Question asked */
            201: {
                headers: {
                    /** @description Question URL */
                    Location?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description The private ID of the created question */
                        id?: string;
                        /** @description The public ID of the created question */
                        publicId?: string;
                    };
                };
            };
            400: components["responses"]["MalformedInput"];
            403: components["responses"]["CategoryRestricted"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    editQuestionTags: {
        parameters: {
            query: {
                /** @description ID of the author editing the question tags */
                authorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the question to interact with */
                id: components["parameters"]["PathQuestionId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditQuestionTagsRequest"];
            };
        };
        responses: {
            /** @description Question tags were changed */
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
    addQuestionTags: {
        parameters: {
            query: {
                /** @description ID of the author editing the question tags */
                authorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the question to interact with */
                id: components["parameters"]["PathQuestionId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AddPublicTagsRequest"];
            };
        };
        responses: {
            /** @description Question tags were changed */
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
    removeQuestionTags: {
        parameters: {
            query: {
                /** @description ID of the author editing the question tags */
                authorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the question to interact with */
                id: components["parameters"]["PathQuestionId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RemovePublicTagsRequest"];
            };
        };
        responses: {
            /** @description Question tags were changed */
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
    addQuestionModeratorTags: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the question tags */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the question to interact with */
                id: components["parameters"]["PathQuestionId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AddModeratorTagsRequest"];
            };
        };
        responses: {
            /** @description Question moderator tags were changed */
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
    removeQuestionModeratorTags: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the question tags */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the question to interact with */
                id: components["parameters"]["PathQuestionId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RemoveModeratorTagsRequest"];
            };
        };
        responses: {
            /** @description Question moderator tags were changed */
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
    replyQuestion: {
        parameters: {
            query: {
                /** @description The ID of the author of this reply */
                authorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the question to interact with */
                id: components["parameters"]["PathQuestionId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReplyQuestionRequest"];
            };
        };
        responses: {
            /** @description Question was replied */
            201: {
                headers: {
                    /** @description Question reply URL */
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
    addQuestionPollVote: {
        parameters: {
            query: {
                /** @description ID of the author voting on the poll */
                authorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the question to interact with */
                id: components["parameters"]["PathQuestionId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AddQuestionPollVoteRequest"];
            };
        };
        responses: {
            /** @description Poll vote has been processed */
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
    likeQuestion: {
        parameters: {
            query: {
                /** @description ID the author giving the like */
                likedBy: string;
            };
            header?: never;
            path: {
                /** @description ID of the question to interact with */
                id: components["parameters"]["PathQuestionId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Question was liked */
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
    unlikeQuestion: {
        parameters: {
            query: {
                /** @description ID the author revoking the like */
                unlikedBy: string;
            };
            header?: never;
            path: {
                /** @description ID of the question to interact with */
                id: components["parameters"]["PathQuestionId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Like was revoked from the question */
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
    answerQuestion: {
        parameters: {
            query: {
                /** @description ID of the author or moderator marking the answer */
                authorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the question reply to interact with */
                replyId: components["parameters"]["PathQuestionReplyId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Reply has been marked as answer */
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
    removeQuestionAnswer: {
        parameters: {
            query: {
                /** @description The ID of the author or moderator removing the reply. */
                authorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the question reply to interact with */
                replyId: components["parameters"]["PathQuestionReplyId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Answer removed from question */
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
    toggleQuestionReplyHighlight: {
        parameters: {
            query: {
                /** @description ID of the moderator updating the reply */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the question reply to interact with */
                replyId: components["parameters"]["PathQuestionReplyId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ToggleQuestionReplyHighlightRequest"];
            };
        };
        responses: {
            /** @description Reply highlight was updated */
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
    promoteQuestionReply: {
        parameters: {
            query: {
                /** @description ID of the moderator promoting the reply */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the question reply to interact with */
                replyId: components["parameters"]["PathQuestionReplyId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PromoteQuestionReplyToConversationRequest"];
            };
        };
        responses: {
            /** @description Reply promoted */
            201: {
                headers: {
                    /** @description Conversation URL */
                    Location?: string;
                    [name: string]: unknown;
                };
                content?: never;
            };
            403: components["responses"]["CategoryRestricted"];
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    toggleQuestionTrashedAction: {
        parameters: {
            query: {
                /** @description ID of the moderator trashing/restoring the question */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the question to interact with */
                id: components["parameters"]["PathQuestionId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ToggleQuestionTrashRequest"];
            };
        };
        responses: {
            /** @description Question trashed state updated */
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
    toggleQuestionClosed: {
        parameters: {
            query: {
                /** @description ID of the moderator toggling the closed state of this question */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the question to interact with */
                id: components["parameters"]["PathQuestionId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ToggleQuestionClosedRequest"];
            };
        };
        responses: {
            /** @description Question closed state was updated */
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
    convertQuestion: {
        parameters: {
            query: {
                /** @description ID of the moderator converting the question */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the question to interact with */
                id: components["parameters"]["PathQuestionId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Conversion in progress */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            403: components["responses"]["CategoryRestricted"];
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    convertQuestionToIdea: {
        parameters: {
            query: {
                /** @description ID of the moderator converting the question */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the question to interact with */
                id: components["parameters"]["PathQuestionId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Conversion in progress */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            403: components["responses"]["CategoryRestricted"];
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    moveQuestion: {
        parameters: {
            query: {
                /** @description ID of the moderator moving the question */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the question to interact with */
                id: components["parameters"]["PathQuestionId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["MoveRequest"];
            };
        };
        responses: {
            /** @description Question was moved */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            403: components["responses"]["CategoryRestricted"];
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    editQuestionTitle: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the question title */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the question to interact with */
                id: components["parameters"]["PathQuestionId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditQuestionTitleRequest"];
            };
        };
        responses: {
            /** @description Question title was changed */
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
    editQuestionModeratorTags: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the moderator tags */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the question to interact with */
                id: components["parameters"]["PathQuestionId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditQuestionModeratorTagsRequest"];
            };
        };
        responses: {
            /** @description Conversation moderator tags were changed */
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
    editQuestionContent: {
        parameters: {
            query: {
                /** @description ID of the author or moderator making the edits */
                authorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the question to interact with */
                id: components["parameters"]["PathQuestionId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditQuestionContentRequest"];
            };
        };
        responses: {
            /** @description Question edited */
            201: {
                headers: {
                    /** @description Conversation URL */
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
    toggleQuestionStickyState: {
        parameters: {
            query: {
                /** @description ID of the moderator toggling the question sticky state */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the question to interact with */
                id: components["parameters"]["PathQuestionId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ToggleQuestionStickyStateRequest"];
            };
        };
        responses: {
            /** @description Question sticky state updated */
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
    moveQuestionReply: {
        parameters: {
            query: {
                /** @description ID of the moderator moving the reply */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the question reply to interact with */
                replyId: components["parameters"]["PathQuestionReplyId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["QuestionMoveReplyRequest"];
            };
        };
        responses: {
            /** @description Reply moved */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            403: components["responses"]["CategoryRestricted"];
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    toggleQuestionReplyTrashed: {
        parameters: {
            query: {
                /** @description ID of the moderator trashing/restoring the reply */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the question reply to interact with */
                replyId: components["parameters"]["PathQuestionReplyId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ToggleQuestionReplyTrashedRequest"];
            };
        };
        responses: {
            /** @description Reply trashed state was updated */
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
    getQuestion: {
        parameters: {
            query?: {
                /** @description ID of the moderator fetching the question */
                moderatorId?: string;
                /** @description When set to true, resolves oembed URLs in the content and replaces them with embed HTML */
                resolveEmbeds?: boolean;
            };
            header?: never;
            path: {
                /** @description ID of the question to interact with */
                id: components["parameters"]["PathQuestionId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["Question"];
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    permanentlyDeleteQuestion: {
        parameters: {
            query: {
                /** @description ID of the moderator permanently deleting the question */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the question to interact with */
                id: components["parameters"]["PathQuestionId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Question permanently deleted */
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
    editQuestionReply: {
        parameters: {
            query: {
                /** @description ID of the author or moderator making the edits */
                authorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the question reply to interact with */
                replyId: components["parameters"]["PathQuestionReplyId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditQuestionReplyContentRequest"];
            };
        };
        responses: {
            /** @description Reply edited */
            204: {
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
    likeQuestionReply: {
        parameters: {
            query: {
                /** @description ID the author giving the like */
                likedBy: string;
            };
            header?: never;
            path: {
                /** @description ID of the question reply to interact with */
                replyId: components["parameters"]["PathQuestionReplyId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Reply was liked */
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
    unlikeQuestionReply: {
        parameters: {
            query: {
                /** @description ID of the author who unlikes the reply */
                unlikedBy: string;
            };
            header?: never;
            path: {
                /** @description ID of the question reply to interact with */
                replyId: components["parameters"]["PathQuestionReplyId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Like was revoked from the reply */
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
    editQuestionPollTitle: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the question poll title */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the question to interact with */
                id: components["parameters"]["PathQuestionId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditQuestionPollTitleRequest"];
            };
        };
        responses: {
            /** @description Question poll title was changed */
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
    editQuestionPollOptions: {
        parameters: {
            query: {
                /** @description ID of the moderator editing the question poll title */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the question to interact with */
                id: components["parameters"]["PathQuestionId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditQuestionPollOptionsRequest"];
            };
        };
        responses: {
            /** @description Question poll options changed */
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
    getQuestionPollResult: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the question to interact with */
                id: components["parameters"]["PathQuestionId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["Poll"];
            404: components["responses"]["NotFound"];
            500: components["responses"]["ServerError"];
        };
    };
    deleteQuestionPoll: {
        parameters: {
            query: {
                /** @description ID of the moderator deleting the question poll */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the question to interact with */
                id: components["parameters"]["PathQuestionId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Poll attached to question deleted */
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
    moveQuestionToTopic: {
        parameters: {
            query: {
                /** @description ID of the moderator moving the question */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the question to interact with */
                id: components["parameters"]["PathQuestionId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["MoveQuestionToTopicRequest"];
            };
        };
        responses: {
            /** @description Question moved to topic */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            403: components["responses"]["CategoryRestricted"];
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    approveQuestion: {
        parameters: {
            query: {
                /** @description ID of the moderator approving the question */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the question to interact with */
                id: components["parameters"]["PathQuestionId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Question was approved */
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
    approveQuestionReply: {
        parameters: {
            query: {
                /** @description ID of the moderator approving the reply */
                moderatorId: string;
            };
            header?: never;
            path: {
                /** @description ID of the question reply to interact with */
                replyId: components["parameters"]["PathQuestionReplyId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Reply was approved */
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
    reportQuestion: {
        parameters: {
            query: {
                /** @description ID of the author reporting the question */
                reportedBy: string;
            };
            header?: never;
            path: {
                /** @description ID of the question to interact with */
                id: components["parameters"]["PathQuestionId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AbstractReportRequest"];
            };
        };
        responses: {
            /** @description Question was reported */
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
    reportQuestionReply: {
        parameters: {
            query: {
                /** @description ID of the author reporting the question reply */
                reportedBy: string;
            };
            header?: never;
            path: {
                /** @description ID of the question reply to interact with */
                replyId: components["parameters"]["PathQuestionReplyId"];
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AbstractReportRequest"];
            };
        };
        responses: {
            /** @description Question reply was reported */
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
    resolveReportedQuestion: {
        parameters: {
            query: {
                /** @description ID of the moderator resolving reported question */
                resolvedBy: string;
            };
            header?: never;
            path: {
                /** @description ID of the question to interact with */
                id: components["parameters"]["PathQuestionId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Reported question was resolved */
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
    resolveReportedQuestionReply: {
        parameters: {
            query: {
                /** @description ID of the moderator resolving the reported question reply */
                resolvedBy: string;
            };
            header?: never;
            path: {
                /** @description ID of the question reply to interact with */
                replyId: components["parameters"]["PathQuestionReplyId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Reported question reply was resolved */
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
    setQuestionModerationLabel: {
        parameters: {
            query: {
                /** @description ID of the moderator to set the moderation label */
                moderatorId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SetQuestionModerationLabelRequest"];
            };
        };
        responses: {
            /** @description Moderation label was set to question */
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
    unsetQuestionModerationLabel: {
        parameters: {
            query: {
                /** @description ID of the moderator to unset the moderation label */
                moderatorId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UnsetQuestionModerationLabelRequest"];
            };
        };
        responses: {
            /** @description Moderation label was unset from question */
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
    questions_assignModerator_post_assignModerator: {
        parameters: {
            query: {
                /** @description ID of the moderator to assign the question */
                moderatorId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AssignQuestionModeratorRequest"];
            };
        };
        responses: {
            /** @description Moderator was assigned to the question */
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
    questions_unassignModerator_post_unassignModerator: {
        parameters: {
            query: {
                /** @description ID of the moderator to unassign the question */
                moderatorId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UnassignQuestionModeratorRequest"];
            };
        };
        responses: {
            /** @description The question was unassigned */
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
    getRepliesForQuestion: {
        parameters: {
            query?: {
                /** @description ID of the moderator fetching the replies */
                moderatorId?: string;
                /** @description Selects the page to retrieve on paginated responses. Used in combination with the `pageSize` parameter to paginate over results */
                page?: components["parameters"]["PageNumber"];
                /** @description Limits the number of items returned in a single paginated response. Used in combination with the `page` parameter to paginate over results */
                pageSize?: components["parameters"]["PageSize"];
                /** @description Defines the field to sort the results on. By default the response is sorted by oldest first. <br/><ul><li>oldestFirst : The least recent reply to the most recent reply.</li><li>mostRecentFirst : Ordered by most recent to least recent.</li> <li>mostLiked : Ordered by replies which have the most likes to the least likes.</li></ul> */
                sort?: components["parameters"]["ReplySort"];
            };
            header?: never;
            path: {
                /** @description ID of the question to interact with */
                id: components["parameters"]["PathQuestionId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["QuestionReplyList"];
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    getQuestionReply: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the question to interact with */
                id: components["parameters"]["PathQuestionId"];
                /** @description ID of the question reply to interact with */
                replyId: components["parameters"]["PathQuestionReplyId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["QuestionReply"];
            404: components["responses"]["NotFound"];
            500: components["responses"]["ServerError"];
        };
    };
    getQuestionList: {
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
            200: components["responses"]["QuestionList"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    getQuestionListForCategory: {
        parameters: {
            query?: {
                /** @description Selects the page to retrieve on paginated responses. Used in combination with the `pageSize` parameter to paginate over results */
                page?: components["parameters"]["PageNumber"];
                /** @description Limits the number of items returned in a single paginated response. Used in combination with the `page` parameter to paginate over results */
                pageSize?: components["parameters"]["PageSize"];
            };
            header?: never;
            path: {
                /** @description ID of the category to fetch questions for */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["QuestionList"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    getTrashedQuestionList: {
        parameters: {
            query: {
                /** @description ID of the moderator fetching the trashed question list */
                moderatorId: string;
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
            200: components["responses"]["QuestionList"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    getRepliesForConversation: {
        parameters: {
            query?: {
                /** @description ID of the moderator fetching the replies */
                moderatorId?: string;
                /** @description Selects the page to retrieve on paginated responses. Used in combination with the `pageSize` parameter to paginate over results */
                page?: components["parameters"]["PageNumber"];
                /** @description Limits the number of items returned in a single paginated response. Used in combination with the `page` parameter to paginate over results */
                pageSize?: components["parameters"]["PageSize"];
                /** @description Defines the field to sort the results on. By default the response is sorted by oldest first. <br/><ul><li>oldestFirst : The least recent reply to the most recent reply.</li><li>mostRecentFirst : Ordered by most recent to least recent.</li> <li>mostLiked : Ordered by replies which have the most likes to the least likes.</li></ul> */
                sort?: components["parameters"]["ReplySort"];
            };
            header?: never;
            path: {
                /** @description ID of the conversation to interact with */
                id: components["parameters"]["PathConversationId"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["ConversationReplyList"];
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    getReplyForConversation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the conversation to interact with */
                id: components["parameters"]["PathConversationId"];
                /** @description ID of the reply to fetch */
                replyId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: components["responses"]["ConversationReply"];
            404: components["responses"]["NotFound"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    createPublicTag: {
        parameters: {
            query: {
                /** @description The ID of the author of the tag */
                authorId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreatePublicTagRequest"];
            };
        };
        responses: {
            /** @description Tag created */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    renamePublicTag: {
        parameters: {
            query: {
                /** @description The ID of the moderator renaming tag */
                moderatorId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RenamePublicTagRequest"];
            };
        };
        responses: {
            /** @description Tag renamed */
            200: {
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
    deletePublicTag: {
        parameters: {
            query: {
                /** @description The ID of the moderator deleting tag */
                moderatorId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["DeletePublicTagRequest"];
            };
        };
        responses: {
            /** @description Tag deleted */
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
    mergePublicTags: {
        parameters: {
            query: {
                /** @description The ID of the moderator merging tags */
                moderatorId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["MergePublicTagsRequest"];
            };
        };
        responses: {
            /** @description Tags merged */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    getPublicTagsList: {
        parameters: {
            query?: {
                /**
                 * @description The search term which will match the public tag name. Skipping this parameter will return all public tags
                 * @example search-term
                 */
                q?: string;
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
            /** @description Successful response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PublicTagList"];
                };
            };
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
    subscribeWebhook: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The event name to subscribe to. */
                eventName: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SubscribeUrlWebhookRequest"];
            };
        };
        responses: {
            /** @description URL subscribed */
            202: {
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
    unsubscribeUrlFromWebhook: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The event name to unsubscribe from. */
                eventName: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UnsubscribeUrlFromWebhookRequest"];
            };
        };
        responses: {
            /** @description URL unsubscribed */
            204: {
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
    unsubscribeAllUrlsFromWebhook: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The event name to unsubscribe all urls from. */
                eventName: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description URLs unsubscribed */
            204: {
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
    listEventWebhookSubscriptions: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of EventWebhook subscriptions. */
            200: {
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
    getCategoryTree: {
        parameters: {
            query: {
                /** @description Array of category modules to retrieve. Valid values: community, knowledge-base, groups. Example: ?module[]=community&module[]=groups */
                module: string[];
                /** @description Optional array of top-level section IDs to filter by. Only available when querying a single module. Example: ?topLevelSectionIds[]=1&topLevelSectionIds[]=2 */
                topLevelSectionIds?: number[];
                /** @description The ID of the author making the request */
                authorId: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Categories tree retrieved successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "result": {
                     *         "community": [
                     *           {
                     *             "id": 1,
                     *             "type": "community",
                     *             "displayOrder": 0,
                     *             "title": "General Discussion",
                     *             "description": "General discussion category",
                     *             "parentId": null,
                     *             "isSection": true,
                     *             "heroImage": null,
                     *             "thumbnailImage": null,
                     *             "children": [
                     *               {
                     *                 "id": 2,
                     *                 "type": "community",
                     *                 "displayOrder": 0,
                     *                 "title": "Subcategory",
                     *                 "description": "A subcategory",
                     *                 "parentId": 1,
                     *                 "isSection": false,
                     *                 "heroImage": null,
                     *                 "thumbnailImage": null,
                     *                 "children": {
                     *                   "type": "object",
                     *                   "additionalProperties": true
                     *                 }
                     *               }
                     *             ]
                     *           }
                     *         ]
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @description Object keyed by category module, containing arrays of category trees */
                        result?: {
                            [key: string]: {
                                /**
                                 * Format: int32
                                 * @description Category ID
                                 * @example 1
                                 */
                                id?: number;
                                /**
                                 * @description Category module identifier (community, knowledge-base, or groups)
                                 * @example community
                                 */
                                type?: string;
                                /**
                                 * Format: int32
                                 * @description Display order for sorting
                                 * @example 0
                                 */
                                displayOrder?: number;
                                /**
                                 * @description Category title
                                 * @example General Discussion
                                 */
                                title?: string;
                                /**
                                 * @description Category description
                                 * @example General discussion category
                                 */
                                description?: string;
                                /**
                                 * Format: int32
                                 * @description Parent category ID, null for top-level categories
                                 * @example null
                                 */
                                parentId?: number | null;
                                /**
                                 * @description Whether this category is a container/section (renamed from isContainer)
                                 * @example true
                                 */
                                isSection?: boolean;
                                /**
                                 * @description Hero image filename (40-46 characters)
                                 * @example null
                                 */
                                heroImage?: string | null;
                                /**
                                 * @description Thumbnail image filename (40-46 characters)
                                 * @example null
                                 */
                                thumbnailImage?: string | null;
                                /** @description List of supported content types */
                                supportedContentTypes?: string[];
                                /** @description Nested array of child categories with the same structure */
                                children?: Record<string, never>[];
                            }[];
                        };
                    };
                };
            };
            400: components["responses"]["MalformedInput"];
            422: components["responses"]["ValidationError"];
            500: components["responses"]["ServerError"];
        };
    };
}
