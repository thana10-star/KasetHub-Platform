# M116.13 Community Moderation Review Dashboard Report

## 1. Summary

M116.13 adds an admin-only Community moderation review dashboard at `/app/community-moderation`. The dashboard is minimal by design: it lists real report queue data only through a database RPC, shows Thai reason labels, and exposes safe review/hide actions without permanent deletion.

## 2. Admin Access Strategy

- Frontend UI gate uses `VITE_ADMIN_EMAILS`.
- The current Supabase Auth email must match the allowlist.
- Signed-out users see `เข้าสู่ระบบก่อนดูรายงานชุมชน`.
- Signed-in non-admin users see `ไม่มีสิทธิ์เข้าถึงหน้านี้`.
- The frontend gate is not treated as a security boundary; SQL/RPC still performs the real admin check.

## 3. Files Created

- `src/routes/CommunityModerationPage.tsx`
- `src/routes/CommunityModerationPage.test.tsx`
- `src/services/community/community-admin-access.ts`
- `src/services/community/community-moderation-review-service.ts`
- `src/services/community/community-moderation-review-service.test.ts`
- `docs/community/COMMUNITY_MODERATION_DASHBOARD_M116_13.md`
- `supabase/sql/community_admin_moderation_m116_13.sql`
- `reports/milestones/M116_13_COMMUNITY_MODERATION_REVIEW_DASHBOARD_REPORT.md`

## 4. Files Modified

- `src/app/App.tsx`
- `src/config/env.ts`
- `src/routes/ProfilePage.tsx`
- `src/routes/ProfilePage.test.tsx`
- `src/services/qa/route-registry.ts`
- `src/types/kaset.ts`
- `src/vite-env.d.ts`
- `docs/community/COMMUNITY_REAL_FOUNDATION_M109.md`
- `docs/community/COMMUNITY_RLS_AND_MODERATION_PLAN_M109.md`
- `docs/community/COMMUNITY_PUBLIC_LAUNCH_DECISION_M116.md`

## 5. SQL/RPC/Admin Allowlist Status

SQL draft created: `supabase/sql/community_admin_moderation_m116_13.sql`

Owner must apply it manually in Supabase staging. The draft adds:

- `admin_moderators`
- `is_community_admin()`
- `get_community_report_queue()`
- `mark_community_report_reviewed()`
- `hide_reported_post()`
- `hide_reported_comment()`
- report status tracking columns

## 6. Moderation Route Behavior

Route: `/app/community-moderation`

The page renders:

- title `ตรวจรายงานชุมชน`
- subtitle `ดูโพสต์และคอมเมนต์ที่ถูกแจ้งรายงาน`
- signed-out gate
- non-admin gate
- admin dashboard with report summary cards and queue
- safe setup notice when backend RPC is not applied

## 7. Report Queue Behavior

The queue displays real RPC data only:

- Thai reason labels
- optional note
- shortened reporter id
- target type
- target preview
- target author display name
- created time
- status

No fake reports are added.

## 8. Actions Supported/Gated

Supported through RPC when SQL is applied:

- `ทำเครื่องหมายว่าตรวจแล้ว`
- `ซ่อนโพสต์`
- `ซ่อนคอมเมนต์`

Actions use status/hide behavior only. M116.13 does not permanently delete content.

## 9. Profile Integration

Profile shows `ตรวจรายงานชุมชน` in the team/internal section only when the signed-in email is allowlisted by `VITE_ADMIN_EMAILS`. Normal users do not see the link, and the route still blocks direct access.

## 10. Security Notes

- No service-role key is used in frontend code.
- The frontend uses the anon Supabase client.
- The report queue is read through admin-checked RPC.
- Existing report RLS should continue preventing normal users from browsing all reports.
- `VITE_ADMIN_EMAILS` is not a secret and is only a UI gate.

## 11. Tests/Checks Run

Checks run:

- `npm run test -- CommunityModerationPage community-moderation-review-service ProfilePage` passed.
- `npm run lint` passed.
- `npm run build` passed. Vite reported the existing large chunk warning, but the build completed successfully.
- `npm run test` passed: 47 test files, 435 tests.
- `git diff --check` passed. Git printed line-ending warnings only.

Route smoke in the in-app browser passed for:

- `/app/community-moderation`
- `/app/community`
- `/app/profile`
- `/app`
- `/app/prices`
- `/app/ai`
- `/app/weather`

Mobile smoke at 390px for `/app/community-moderation` passed:

- document width: 390px
- document scroll width: 390px
- app scroll width: 390px
- no document-level horizontal overflow
- signed-out admin gate visible
- title `ตรวจรายงานชุมชน` visible
- login action visible

Report list cards are covered by component tests with injected queue data because local browser smoke has no applied staging admin RPC/allowlist data and the app must not render fake reports.

## 12. Owner Setup Steps

1. Apply `supabase/sql/community_admin_moderation_m116_13.sql` in Supabase staging.
2. Add the owner Auth user id to `public.admin_moderators`.
3. Set `VITE_ADMIN_EMAILS=owner@example.com` in staging frontend env.
4. Deploy/restart the frontend.
5. Login as owner and open `/app/community-moderation`.
6. Confirm report queue loads.
7. Login as a normal user and confirm access is denied.
8. Confirm Profile shows the moderation link only for the owner/admin.

## 13. Known Limitations

- SQL must be applied manually before real queue data appears.
- `VITE_ADMIN_EMAILS` is UI-only; database admin membership is the real gate.
- There is no audit log table beyond report status fields.
- There is no exact post/comment deep link yet; `เปิดในชุมชน` opens `/app/community`.
- There is no CAPTCHA, push notification, AI moderation, or admin CMS.

## 14. Next Recommended Milestone

Add moderation audit history and backend rate limiting for report/review actions after the owner confirms the M116.13 SQL/RPC path in staging.
