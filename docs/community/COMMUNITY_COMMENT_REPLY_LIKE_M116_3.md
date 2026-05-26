# M116.3 Community Comment Reply And Like

Date: 2026-05-26

## Scope

M116.3 adds V1-scoped polish for comments:

- Users can like/unlike a comment or one-level reply.
- Users can reply to a top-level comment.
- The UI clearly shows "กำลังตอบกลับ ..." before sending a reply.
- Replies are shown indented under the parent comment.
- Replies do not become infinite nested threads.

Production community writes remain controlled by `VITE_ENABLE_COMMUNITY_WRITES=false` by default.

## Data Model

SQL draft: `supabase/sql/community_comment_replies_likes_m116_3.sql`.

Changes:

- `community_comments.parent_comment_id uuid null references community_comments(id)`
- `community_comment_likes(comment_id, user_id, created_at)`
- Primary key on `(comment_id, user_id)` to prevent duplicate likes.
- Indexes for `parent_comment_id`, `(post_id, parent_comment_id, created_at)`, comment-like user lookup, and comment-like count lookup.

Top-level comments have `parent_comment_id = null`. Replies have `parent_comment_id` pointing to a top-level comment.

## RLS Changes

The SQL draft updates comment insert policy so authenticated users can insert:

- A top-level comment on a published post.
- A reply whose parent comment is published, belongs to the same post, and is top-level.

`community_comment_likes` policies allow:

- Authenticated users to like as themselves only.
- Authenticated users to unlike their own comment like only.
- Authenticated users to select own likes or likes on visible published comments.

Anonymous users cannot insert comment likes or replies.

## Service Behavior

New service operations:

- `createReply(postId, parentCommentId, input)`
- `likeComment(commentId)`
- `unlikeComment(commentId)`

All write operations still require:

- `VITE_ENABLE_COMMUNITY_WRITES=true`
- A real Supabase authenticated user
- Supabase anon client only
- RLS enforcement in the database

The service blocks nested replies before insert. The SQL policy also guards parent/post consistency.

## UI Behavior

Top-level comments show:

- Author or `ผู้ใช้ KasetHub`
- Date
- Content
- `ถูกใจ` / `เลิกถูกใจ` with real count
- `ตอบกลับ`
- Own hide action when owned by the current user

Replies show:

- Indented layout under the parent comment
- Author/date/content
- Comment-like action
- Own hide action when owned by the current user
- No reply button, to keep V1 one-level only

When replying, the UI shows:

- `กำลังตอบกลับ <name>`
- `เขียนคำตอบ...`
- `ส่งคำตอบ`
- `ยกเลิก`

## Moderation Impact

Existing comment report/hide/delete policies still apply to comments and replies because replies are rows in `community_comments`.

Public moderation remains deferred. Production launch still needs an admin/moderation queue, rate limiting, and report handling process.

## No Fake Engagement

The UI must not invent comment likes, replies, names, or reply counts. Empty comments and empty reply lists are shown honestly.

## Deferred

- Infinite nested replies
- Backend-created reply notifications
- Dedicated comment moderation queue
- Comment-like aggregate trigger or RPC if staging RLS cannot support count reads
- Public production enablement
