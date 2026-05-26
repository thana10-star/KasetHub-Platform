# M112 Community Staging Two-User RLS Verification Report

## Summary

M112 records the owner-confirmed Supabase staging application state, prepares the exact two-user RLS/auth/storage verification flow, and reviews write adapter readiness. Real community writes remain gated because the two-user verification has not been recorded as passed and the app still lacks a durable community write-session adapter.

## 1. What Owner Supabase Checks Already Passed?

Owner-confirmed from Supabase staging screenshots:

- M110 SQL pack has been applied in staging.
- `community_posts` exists.
- `community_comments` exists.
- `community_likes` exists.
- `community_reports` exists.
- `community_notifications` exists.
- RLS is enabled on all five community tables.
- RLS policies exist for posts, comments, likes, reports, and notifications.
- Storage bucket `community-post-images` exists.
- Bucket is `public=true`.
- Bucket file size limit is about 3MB.
- Allowed image MIME types include `image/jpeg`, `image/png`, and `image/webp`.

Documented in `docs/community/COMMUNITY_STAGING_APPLIED_STATUS_M112.md`.

## 2. Were Two-User Tests Run?

Not by Codex.

The remaining two-user tests are owner-side because they require real staging User A and User B sessions. The test guide is ready at `docs/community/COMMUNITY_TWO_USER_RLS_TEST_M112.md`.

Owner-side remaining checks:

- User A creates post.
- User B reads but cannot update/delete User A post.
- User B comments and owns that comment.
- User A cannot delete User B comment.
- User B likes/unlikes own like and duplicate like is blocked or handled idempotently.
- Anonymous inserts fail.
- Report inserts work for authenticated users and are not broadly listable.
- Notification reads are owner-only.
- Storage own-folder upload works and cross-user folder writes/deletes fail.

## 3. Is User Session Available In App For Write Adapter?

Not safely enough yet.

The frontend Supabase client uses the public anon key only, which is correct, but it is configured without durable session persistence. Existing auth ownership state is local mock or staging preview oriented and does not yet expose a narrow real `auth.uid()` community write session helper for `author_user_id`, `user_id`, or `reporter_user_id`.

## 4. Were Write Adapters Implemented Or Still Gated?

Still gated.

No real Supabase write adapter was implemented in M112. The service continues to gate:

- `createPost`
- `createComment`
- `likePost`
- `unlikePost`
- `reportPost`
- `reportComment`
- own hide/delete actions

This is intentional until two-user RLS verification passes and owner approves a staging-only flag test.

## 5. Are Storage/Image Checks Implemented Or Still Owner-Side?

Partially implemented and still owner-side.

The app validates:

- one image per post policy
- `image/jpeg`
- `image/png`
- `image/webp`
- 3MB max

Actual Supabase Storage upload remains gated until owner-side storage checks pass for own folder upload and cross-user denial.

## 6. Are Notifications Backend-Created Or Still Gated?

Still gated/backend-needed.

M112 does not add client-created like/reply notifications. A future backend function must create notifications after verifying actor, recipient, target post/comment, idempotency, and rate limits.

## 7. Is Production Still Disabled?

Yes.

`VITE_ENABLE_COMMUNITY_WRITES=false` remains the default. No production write UI or service path was enabled.

## 8. What Must Happen Before Public Writes?

1. Owner completes and records the two-user RLS/auth/storage test.
2. Anonymous writes are confirmed blocked.
3. Cross-user update/delete attempts are confirmed blocked.
4. Storage own-folder and cross-user denial are confirmed.
5. No service-role key is exposed in frontend env or logs.
6. Owner approves staging-only `VITE_ENABLE_COMMUNITY_WRITES=true`.
7. A narrow staging write adapter is implemented and tested.
8. Backend-created notifications are implemented or explicitly kept gated.
9. Rate limiting and moderation queue plan are reviewed before any public production launch.

## 9. Tests/Checks Run

- `npm run lint` passed.
- `npm run build` passed, with the existing non-blocking large chunk warning.
- `npm run test` passed: 42 files, 348 tests.
- `git diff --check` passed with line-ending warnings only.
- Route smoke passed in the in-app browser for `/app/community`, `/app/notifications`, `/app`, `/app/prices`, `/app/ai`, `/app/weather`, and `/app/profile`.
- Route smoke confirmed `/app/community` shows the M112 database-ready/two-user-test gate and does not show fake community activity.

## 10. Next Recommended Milestone

M113 should run or ingest the completed two-user staging verification evidence. If it passes, M113 can add a narrow staging-only Supabase community write adapter behind `VITE_ENABLE_COMMUNITY_WRITES=true`, while production remains false.

## Files Created/Modified

Created:

- `docs/community/COMMUNITY_STAGING_APPLIED_STATUS_M112.md`
- `docs/community/COMMUNITY_TWO_USER_RLS_TEST_M112.md`
- `docs/community/COMMUNITY_WRITE_ADAPTER_READINESS_M112.md`
- `reports/milestones/M112_COMMUNITY_STAGING_TWO_USER_RLS_VERIFICATION_REPORT.md`

Modified:

- `src/services/community/community-service.ts`
- `src/routes/CommunityPage.tsx`
- `src/routes/CommunityPage.test.tsx`
- `src/services/community/community-service.test.ts`
