# M109 Community RLS And Moderation Plan

## Table Model

Use the draft in `docs/community/COMMUNITY_SCHEMA_RLS_DRAFT_M109.md` for:

- `community_posts`
- `community_comments`
- `community_likes`
- `community_reports`
- `community_notifications`

No exact location fields, phone fields, image bytes, or service-role frontend access.

M110 staging pack: `supabase/sql/community_v1_schema_m110.sql` translates this model into a staging SQL/RLS/storage draft. Apply only to staging and verify with `docs/community/COMMUNITY_STAGING_VERIFICATION_M110.md`.

M116.3 comment polish pack: `supabase/sql/community_comment_replies_likes_m116_3.sql` adds `community_comments.parent_comment_id` and `community_comment_likes` for one-level replies and comment likes.

## RLS Matrix

| Area | Read | Insert | Update/Delete |
| --- | --- | --- | --- |
| Posts | Published posts readable if product policy allows public read | Authenticated users insert own posts only | Owner can hide/delete own posts only |
| Comments | Published comments readable with published posts | Authenticated users insert own comments only | Owner can hide/delete own comments only |
| Likes | User can read own like state; aggregate counts via controlled query/function | Authenticated user can like as self only | User can unlike own like only |
| Reports | Normal users cannot browse reports | Authenticated users create reports | Moderator/admin future role only |
| Notifications | User reads own notifications only | Controlled app logic or backend function | User marks own notifications read only |

## Comment Replies And Comment Likes

M116.3 keeps replies intentionally shallow:

- `community_comments.parent_comment_id = null` means a top-level comment.
- `parent_comment_id` pointing to a top-level comment means a V1 reply.
- Replies to replies are blocked in the service and guarded in the staging SQL insert policy.

`community_comment_likes` is separate from post likes:

- One row per `(comment_id, user_id)`.
- Authenticated users insert/delete only their own comment-like rows.
- Counts are read from visible comment-like rows where RLS permits.
- If staging count reads become too restrictive, a future RPC/backend aggregate can replace broad row reads.

## Storage Bucket Policy

Future bucket: `community-post-images`.

Policy requirements:
- Authenticated upload only
- Object path includes owner user id and post id
- One image per post enforced by app service and database metadata
- Accepted types: JPG, PNG, WebP
- Max size: 3MB
- No public anonymous upload
- Image bytes stay in storage, not database

## Moderation Flow

Reports create rows in `community_reports` with reason and optional note. Normal users see a calm confirmation: "ขอบคุณที่แจ้ง ทีมงานจะตรวจสอบ".

Reports do not automatically delete content. Future moderator/admin tooling can move posts/comments to `reported`, `hidden`, or `deleted`.

M116.12 report reason codes are database-safe values only: `spam`, `dangerous_information`, `personal_information`, `inappropriate`, and `other`. Thai labels stay in the UI, but the database receives only these codes. Duplicate reports are guarded in the app and can be guarded in SQL with `supabase/sql/community_report_unique_guard_m116_12.sql`.

M116.13 adds a minimal admin review surface at `/app/community-moderation` plus a SQL/RPC draft at `supabase/sql/community_admin_moderation_m116_13.sql`. The dashboard must read reports through admin-checked RPC, not direct broad table reads from normal users.

## Notification Ownership

Community notifications target `recipient_user_id`. RLS must restrict reads and mark-read updates to `recipient_user_id = auth.uid()`.

Like/reply notification insertion should happen through a controlled service path so users cannot create arbitrary notifications for other users.

## Rate Limiting Future

Add rate limits before public launch:
- Posts per user per hour/day
- Comments per user per hour/day
- Replies per user per hour/day
- Likes per user per minute
- Comment likes per user per minute
- Reports per user per day
- Uploads per user per day

M116.12 intentionally does not add CAPTCHA. Use authenticated-only reports, duplicate guards, and future backend rate limits first; consider CAPTCHA only if real abuse requires it.

## Admin/Moderator Future Role

M116.13 uses a narrow `admin_moderators` SQL draft for report review. Suggested future role sources for broader admin work:
- Dedicated `app_roles`
- Backend-only claims
- A reviewed profile role only if it is protected from self-editing

Moderators should only see data needed for report review, not private farm records, phone numbers, precise identity, or unrelated user data.

## Deletion And Hide Policy

V1 user actions:
- `hidden`: owner hides from normal feed while keeping row for audit/recovery.
- `deleted`: owner removes from normal feed and content may be blanked or retained per policy.
- Image should be deleted from storage if safe; otherwise it becomes unreferenced and scheduled for cleanup.
