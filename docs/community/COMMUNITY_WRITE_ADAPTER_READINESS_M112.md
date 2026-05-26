# M112 Community Write Adapter Readiness

## Decision

M112 decision was to keep real browser writes gated.

M113 update: owner-run two-user RLS/storage smoke testing passed in Supabase staging, so a narrow staging write adapter can be prepared behind `VITE_ENABLE_COMMUNITY_WRITES=true`. Production remains disabled and the UI must not fake a signed-in session.

## Current Service State After M113

`src/services/community/community-service.ts` now includes a narrow Supabase adapter path:

- `listPosts()` can read published rows when a Supabase client is configured.
- `createPost()`, `createComment()`, `likePost()`, `unlikePost()`, `reportPost()`, `reportComment()`, and own hide/delete require `VITE_ENABLE_COMMUNITY_WRITES=true` plus a real authenticated Supabase user.
- Writes use the anon client and rely on RLS.
- Duplicate likes are treated as already liked.
- Notification reads/mark-read still return `notification_backend_needed`.

`src/services/community/community-storage-service.ts` remains gated:

- validates JPG/PNG/WebP and 3MB max
- documents one image per post
- does not upload to Supabase Storage yet

`src/services/community/community-notification-service.ts` remains backend-needed:

- no push notifications
- no client-created like/reply notifications

## User Session Boundary

The Supabase client is anon-key only, which is correct for the frontend, but it is configured with:

- `autoRefreshToken: false`
- `detectSessionInUrl: false`
- `persistSession: false`

The adapter calls `client.auth.getUser()` at write time. If no real Supabase user is available, writes return a sign-in-required error. Local mock sessions are not accepted for community writes.

## Adapter Shape For Staging Testing

The M113 adapter follows this shape:

- Use the existing Supabase anon client only.
- Require a real authenticated session.
- Use `auth.uid()` as the source of ownership.
- Let RLS enforce cross-user denial.
- Keep production flag false.
- Map Supabase errors to calm, user-friendly messages.
- Keep no fake success states.

Operations:

- `listPosts()` reads `community_posts` where `status = published`.
- `createPost()` inserts own post after flag/session checks.
- `createComment()` inserts own comment after flag/session checks.
- `likePost()` inserts one like and handles duplicate-like errors idempotently if product chooses.
- `unlikePost()` deletes own like.
- `reportPost()` and `reportComment()` insert own reports.
- `hideOwnPost()` and `deleteOwnPost()` update/delete own posts only.
- `uploadCommunityPostImage()` validates type/size and uploads only to `{user_id}/{post_id}/{filename}`.

## What Remains Gated

- Production writes.
- Anonymous writes.
- Client-created notifications.
- Push notifications.
- Multiple images.
- Private chat, follow/friend, groups, marketplace, algorithmic ranking.
- Any service-role access from frontend.
- Any Farm Records storage/schema change.
