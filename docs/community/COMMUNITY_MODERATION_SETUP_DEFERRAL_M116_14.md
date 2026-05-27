# M116.14 Community Moderation Setup Deferral

## Current Implemented State

The Community moderation review path is implemented but not owner-activated.

- `/app/community-moderation` exists.
- The dashboard shell is admin-gated in the UI with `VITE_ADMIN_EMAILS`.
- Profile can show the moderation link for allowlisted admins.
- The SQL/RPC draft exists at `supabase/sql/community_admin_moderation_m116_13.sql`.
- The frontend uses the anon Supabase client only.
- No service-role key is used in frontend code.
- No fake reports are shown.
- Production Community writes remain controlled by `VITE_ENABLE_COMMUNITY_WRITES=false` by default.

Reports can be created, but dashboard queue requires admin SQL/RPC setup before real in-app review.

## Deferred Owner Setup

The owner decided not to perform these setup steps right now:

- apply `supabase/sql/community_admin_moderation_m116_13.sql`
- add the owner Auth user to `public.admin_moderators`
- set `VITE_ADMIN_EMAILS`
- verify the real report queue in `/app/community-moderation`

## Why Setup Is Deferred

The owner wants the next focus to move to real agriculture crop/product prices and fertilizer prices. Community moderation setup is therefore deferred as an owner activation task rather than continued immediately.

This is not blocking private/staging app exploration because production Community writes remain disabled by default and the moderation dashboard does not expose report rows until the admin SQL/RPC setup is applied.

## What Remains Blocked

- Real in-app review of the `community_reports` queue.
- Admin review actions against real reports.
- Owner confirmation that non-admin users cannot access report queue data.
- Public Community write launch.

## What Is Safe To Continue Now

- Work on real crop/product price sources.
- Work on fertilizer price sources.
- Continue private or staging Community exploration with production writes disabled.
- Continue documentation and planning for future moderation/rate-limit work.

## Required Before Public Community Write Launch

Community moderation setup is required before public Community write launch.

Before public writes are considered, the owner must:

- apply the M116.13 moderation SQL/RPC draft
- add the owner/admin user to `admin_moderators`
- configure `VITE_ADMIN_EMAILS` in the staging frontend environment
- confirm `/app/community-moderation` loads real report queue data for the owner/admin
- confirm signed-in non-admin users cannot access the dashboard queue
- confirm signed-out users are blocked
- confirm production frontend still has no service-role key exposure
- decide whether report rate limiting or additional moderation audit logging is needed before launch

## Owner Checklist For Later

1. Find the owner user id in Supabase Auth.
2. Apply `supabase/sql/community_admin_moderation_m116_13.sql` in Supabase staging.
3. Insert the owner into `public.admin_moderators`.
4. Set `VITE_ADMIN_EMAILS=owner@example.com` in staging frontend env.
5. Redeploy or restart the staging frontend.
6. Login as the owner and open `/app/community-moderation`.
7. Confirm real report queue data appears after reports exist.
8. Login as a normal user and confirm `ไม่มีสิทธิ์เข้าถึงหน้านี้`.
9. Sign out and confirm the page requires login.
10. Keep production Community writes disabled until all public launch blockers are resolved.
