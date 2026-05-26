# M110 Community Staging Backend Enablement Report

## Summary

M110 moves the M109 gated community foundation toward controlled staging backend readiness. It adds a default-off community write feature flag, a staging SQL/RLS/storage policy pack, staging verification docs, notification strategy docs, and clearer gated UI/service behavior.

Public community writes remain disabled. The SQL pack is drafted for owner-side staging application and verification; it was not applied by the app.

## 1. Is Authenticated User ID Available?

Not safely enough for community writes.

The app can detect local mock phone sessions and a Supabase Phone Auth staging session preview, but it does not expose a verified, durable `auth.uid()` ownership path for public community table writes. Existing ownership code still marks sync/write behavior as blocked until RLS ownership checks pass.

## 2. Is Community SQL Applied Or Only Drafted?

Drafted only.

Created: `supabase/sql/community_v1_schema_m110.sql`.

The app does not run SQL or migrations automatically.

## 3. Are RLS Policies Drafted Or Applied?

Drafted only.

The SQL pack includes RLS policies for posts, comments, likes, reports, and notifications. Staging must verify two-user ownership and cross-user denial before writes can be enabled.

## 4. Is Storage Bucket Policy Drafted Or Applied?

Drafted only.

The SQL pack includes a `community-post-images` bucket draft with:

- 1 image per post enforced by app/service policy
- accepted MIME types: `image/jpeg`, `image/png`, `image/webp`
- max size: 3MB
- owner folder path: `{user_id}/{post_id}/{filename}`
- authenticated upload/delete to own folder
- public read for community images once posted

## 5. Are Community Writes Enabled Or Still Gated?

Still gated.

`VITE_ENABLE_COMMUNITY_WRITES=false` is now in `.env.example` and the app reads it through `publicEnv.enableCommunityWrites`. The flag controls UI/service enablement only; RLS remains the real security boundary.

## 6. Are Posts, Comments, And Likes Persisted?

No.

The frontend service still returns gated errors and does not fake success or write data. Persistence can be enabled only after staging SQL/RLS/storage/auth checks pass.

## 7. Are Notifications Backend-Created Or Still Gated?

Still gated/backend-needed.

The notification strategy requires like/reply notification creation to happen through a backend/server path that verifies actor, recipient, ownership, idempotency, and rate limits. No client-side notification insert policy is enabled.

## 8. What Owner/Staging Actions Remain?

1. Apply `supabase/sql/community_v1_schema_m110.sql` to the staging Supabase project.
2. Confirm RLS is enabled on all community tables.
3. Create two staging test users and verify own/cross-user behavior.
4. Verify anonymous writes fail.
5. Verify storage upload/delete is restricted to the user's own folder.
6. Decide whether public community image reads are acceptable for launch or whether signed URLs are required.
7. Add backend-created like/reply notifications.
8. Add moderation/admin queue and rate limiting before public launch.
9. Only then test `VITE_ENABLE_COMMUNITY_WRITES=true` in staging.

## 9. Tests/Checks Run

- `npm run lint` passed.
- `npm run build` passed.
- `npm run test` passed: 42 files, 348 tests.
- `git diff --check` passed with line-ending warnings only.
- Route smoke passed in the in-app browser for `/app/community`, `/app/notifications`, `/app`, `/app/prices`, `/app/calculators`, `/app/ai`, `/app/weather`, and `/app/profile`.
- Route smoke confirmed `/app/community` renders without fake community names/activity and the bottom nav includes `ชุมชน` without `เครื่องมือ` as a bottom tab.

## 10. Next Recommended Milestone

M111 should apply the M110 SQL pack to staging with owner-approved test users, verify RLS/storage/auth ownership end to end, and add a backend notification creation function or keep notifications explicitly gated.

## Files Created/Modified

Created:

- `supabase/sql/community_v1_schema_m110.sql`
- `docs/community/COMMUNITY_STAGING_VERIFICATION_M110.md`
- `docs/community/COMMUNITY_NOTIFICATION_STRATEGY_M110.md`
- `reports/milestones/M110_COMMUNITY_STAGING_BACKEND_ENABLEMENT_REPORT.md`

Modified:

- `.env.example`
- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/community/COMMUNITY_REAL_FOUNDATION_M109.md`
- `docs/community/COMMUNITY_BACKEND_BLOCKERS_M109.md`
- `docs/community/COMMUNITY_RLS_AND_MODERATION_PLAN_M109.md`
- `src/config/env.ts`
- `src/vite-env.d.ts`
- `src/routes/CommunityPage.tsx`
- `src/routes/CommunityPage.test.tsx`
- `src/services/community/community-service.ts`
- `src/services/community/community-notification-service.ts`
- `src/services/community/community-service.test.ts`
