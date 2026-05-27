# M116.13 Community Moderation Review Dashboard

## Why this exists

Community reports can now be submitted in staging, but before M116.13 the owner had to inspect `community_reports` manually in Supabase SQL Editor. M116.13 adds a minimal in-app review surface at `/app/community-moderation` so an approved admin can see reported posts/comments and take safe review actions.

## Admin-only access strategy

The app uses a small V1 frontend gate:

- Set `VITE_ADMIN_EMAILS=owner@example.com,another@example.com` in the staging frontend environment.
- The app reads the current Supabase Auth user email.
- Signed-out users see `เข้าสู่ระบบก่อนดูรายงานชุมชน`.
- Signed-in users whose email is not allowlisted see `ไม่มีสิทธิ์เข้าถึงหน้านี้`.
- Only allowlisted users see the dashboard UI and the Profile link.

`VITE_ADMIN_EMAILS` is not a secret. It only hides the UI. Report data must still be protected by database RLS/RPC.

## Report Queue Behavior

The dashboard shows:

- summary cards for total reports, pending reports, reported posts, and reported comments
- reason labels in Thai
- optional report note
- shortened reporter user id only
- target type: `โพสต์` or `คอมเมนต์`
- target preview and target author display name
- created time and status

The UI does not add fake reports. If the backend RPC is not applied yet, the page shows a safe setup notice instead of mock data.

## RLS/RPC Security Design

The SQL draft is:

`supabase/sql/community_admin_moderation_m116_13.sql`

It adds:

- `admin_moderators` allowlist table keyed by Supabase Auth `user_id`
- `public.is_community_admin()` security-definer function
- `public.get_community_report_queue()` admin-only RPC
- `public.mark_community_report_reviewed(report_id)` admin-only RPC
- `public.hide_reported_post(post_id)` admin-only RPC
- `public.hide_reported_comment(comment_id)` admin-only RPC
- report status fields on `community_reports`

Normal direct report table access remains protected by existing RLS. Existing normal-user policy allows users to insert their own report and select only their own report rows.

## Why Service Role Is Not Used In Frontend

The frontend uses the existing anon Supabase client and calls admin-checked RPC functions. No service-role key is committed, read from Vite env, or exposed to the browser. The database function must reject non-admin users even if they discover the route or RPC name.

## Actions Supported

M116.13 supports safe status/hide actions through RPC when the SQL draft is applied:

- mark a report as reviewed
- hide a reported post
- hide a reported comment

The dashboard does not permanently delete content and does not auto-moderate content.

## What Remains Manual

The owner still needs to:

- apply the M116.13 SQL draft in Supabase staging
- add the owner Auth user id to `admin_moderators`
- set `VITE_ADMIN_EMAILS` for the staging frontend
- verify non-admin accounts cannot read report queue data

## Future Plan

Recommended next steps:

- backend rate limits for reports and moderation actions
- moderation audit log with action notes
- dismiss/report-resolution workflow
- admin role management outside raw SQL
- optional CAPTCHA only if real abuse appears
- richer link from a report to the exact post/comment after route-level deep links exist

## Owner Setup Steps

1. Apply `supabase/sql/community_admin_moderation_m116_13.sql` in Supabase staging.
2. Find the owner user id in Supabase Auth.
3. Insert the owner into `public.admin_moderators`:

```sql
insert into public.admin_moderators (user_id, email, role)
values ('OWNER_AUTH_USER_UUID', 'owner@example.com', 'admin')
on conflict (user_id) do update
set email = excluded.email,
    role = excluded.role;
```

4. Set staging frontend env:

```text
VITE_ADMIN_EMAILS=owner@example.com
```

5. Deploy/restart the frontend.
6. Login as the owner and open `/app/community-moderation`.
7. Login as a normal user and confirm the page says `ไม่มีสิทธิ์เข้าถึงหน้านี้`.
8. Open Profile as the owner and confirm `ตรวจรายงานชุมชน` is visible.
9. Open Profile as a normal user and confirm the link is hidden.
