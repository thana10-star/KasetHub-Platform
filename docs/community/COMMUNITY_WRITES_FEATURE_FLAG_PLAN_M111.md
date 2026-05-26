# M111 Community Writes Feature Flag Plan

## Default

`VITE_ENABLE_COMMUNITY_WRITES=false`

This is the required default for local development, preview, and production until staging verification passes and the owner approves the next milestone.

The flag controls only the frontend write UI/service path. It is not a security boundary. Supabase Auth and RLS must enforce ownership even when the flag is true.

## Staging Test

Set `VITE_ENABLE_COMMUNITY_WRITES=true` only in a staging or preview environment after:

- `supabase/sql/community_v1_schema_m110.sql` has been applied to staging.
- RLS is enabled on all community tables.
- Two real test users prove own-row writes and cross-user denial.
- Anonymous writes fail.
- `community-post-images` storage policy is verified.
- No service-role key is exposed to frontend env, browser logs, screenshots, or repository files.
- Owner explicitly approves a staging-only write test.

## When The Flag Is True

The app should still require:

- authenticated user session
- community backend service implementation
- RLS-protected Supabase calls through the anon client
- one image max per post
- report and safety copy
- no fake posts, fake likes, fake comments, or fake notifications

The UI should continue to show:

- do not post phone numbers, addresses, or sensitive personal data
- community information should be checked before real use
- chemical topics should follow labels and qualified local guidance

## Production Rule

Never set production `VITE_ENABLE_COMMUNITY_WRITES=true` until the owner approves a public community launch milestone after staging evidence is reviewed.

## Rollback

If any staging issue appears:

1. Set `VITE_ENABLE_COMMUNITY_WRITES=false`.
2. Redeploy the affected staging/preview environment.
3. Confirm `/app/community` returns to read/share/gated mode.
4. Preserve evidence of the failed RLS/storage/auth case.
5. Fix SQL, policy, service, or UI behavior before trying again.

Rollback does not require deleting the staging tables. It only closes the frontend write path while backend fixes are reviewed.

## Owner Approval Record

- Staging SQL applied:
- RLS two-user checks passed:
- Storage checks passed:
- Notification backend decision:
- Owner approved staging flag true:
- Owner approved production flag true:

