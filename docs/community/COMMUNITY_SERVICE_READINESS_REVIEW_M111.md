# M111 Community Service Readiness Review

## Current Implementation

Community is still a gated service contract.

`src/services/community/community-service.ts`:

- `listPosts()` returns an empty real-feed result.
- `createPost()` returns a gated error.
- `createComment()` returns a gated error.
- `likePost()` and `unlikePost()` return gated errors.
- `reportPost()` and `reportComment()` return gated errors.
- `hideOwnPost()`, `deleteOwnPost()`, and `hideOwnComment()` return gated errors.
- `listNotifications()` and `markNotificationRead()` return `notification_backend_needed`.

`src/services/community/community-storage-service.ts`:

- Documents bucket `community-post-images`.
- Validates accepted image MIME types and 3MB max size.
- Keeps `storageEnabled=false`.
- `uploadCommunityPostImage()` returns `storage_not_ready`.

`src/services/community/community-notification-service.ts`:

- Defines in-app-only notification policy.
- Keeps push disabled.
- Returns `notification_backend_needed` because like/reply notification creation should be backend-owned.

## Does The Service Call Supabase?

No.

The current community service does not call Supabase tables or Supabase Storage. This is intentional until staging RLS/auth/storage checks pass.

## Is User Session Available?

Not safely enough for community writes.

The app can detect local mock phone sessions and a Supabase Phone Auth staging session preview. That is not the same as a verified production-ready `auth.uid()` write path for community rows. M112 should add a narrow authenticated session adapter only after owner-side staging tests prove RLS behavior.

## Is Image Upload Integrated?

No.

Client-side validation exists for:

- one image per post policy
- `image/jpeg`
- `image/png`
- `image/webp`
- 3MB max

Actual Supabase Storage upload remains gated until the `community-post-images` bucket and owner-folder policies are verified in staging.

## Are Notifications Backend-Created?

No.

M111 keeps notification creation gated. Like/reply notification insertion should be implemented through a backend/server path that verifies actor, recipient, target post/comment, idempotency, and rate limits. Browser-side arbitrary notification creation should remain blocked.

## Are Report Submissions Persisted?

No.

Report reasons and UI copy exist, but `reportPost()` and `reportComment()` remain gated. Future persistence must use authenticated RLS-protected inserts where `reporter_user_id = auth.uid()`.

## Required Changes For M112 If Staging Passes

1. Add a narrow community Supabase adapter using the existing public anon client only.
2. Add an authenticated session helper that returns the real `auth.uid()` for staging writes.
3. Implement `listPosts()` against published posts only.
4. Implement `createPost()` behind `VITE_ENABLE_COMMUNITY_WRITES=true`, real auth session, and service readiness.
5. Implement `listComments()` and `createComment()` for published posts.
6. Implement `likePost()` and `unlikePost()` with duplicate-like handling.
7. Implement `reportPost()` and `reportComment()` as insert-only normal-user actions.
8. Implement own hide/delete actions as owner-only status updates or deletes, matching the final staging policy.
9. Integrate image upload only after storage owner-folder checks pass.
10. Keep notification creation gated unless a backend function exists.
11. Add Supabase mocked service tests for success, RLS errors, duplicate like, unauthenticated writes, and feature-flag-off behavior.
12. Keep no fake posts, no fake counts, no service-role key, no anonymous writes, and no production flag enablement.

## What Should Remain Gated

- Production community writes.
- Anonymous post/comment/like/report actions.
- Image upload before storage policy verification.
- Client-side notification creation.
- Push notifications.
- Multiple images.
- Private chat, follow/friend system, groups, marketplace, and algorithmic ranking.
- Any flow that requires service-role access from the frontend.

