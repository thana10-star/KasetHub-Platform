# M111 Community Staging RLS/Auth/Storage Verification Prep Report

## Summary

M111 prepares the owner-side staging verification workflow for Community database writes. It does not apply SQL, enable public writes, or add real Supabase write calls. Community remains in gated read/share mode until staging RLS/auth/storage checks pass and the owner approves a staging-only write flag test.

## 1. Was SQL Applied By Codex?

No.

Codex did not apply SQL to Supabase. The current environment does not safely prove a target staging project, authenticated test users, or owner approval for applying SQL. The workflow remains owner-side through the Supabase Dashboard.

## 2. Is The SQL Draft Present?

Yes.

Present: `supabase/sql/community_v1_schema_m110.sql`.

The draft includes community tables, constraints, indexes, RLS policies, and the `community-post-images` storage bucket policy draft.

## 3. Is RLS Documented And Ready For Staging Test?

Yes, documented and ready for owner-side staging test.

Created:

- `docs/community/COMMUNITY_STAGING_EXECUTION_WORKSHEET_M111.md`
- `docs/community/COMMUNITY_STAGING_SQL_TEST_SNIPPETS_M111.md`

The worksheet covers table checks, RLS enabled checks, two-user verification, anonymous write denial, cross-user denial, reports, notifications, and results recording.

## 4. Is Storage Policy Documented And Ready For Staging Test?

Yes, documented and ready for staging verification.

The worksheet and SQL snippets cover bucket `community-post-images`, path convention `{user_id}/{post_id}/{filename}`, own-folder upload/delete, no anonymous upload, accepted types, and 3MB max size.

## 5. Is `VITE_ENABLE_COMMUNITY_WRITES` Still False By Default?

Yes.

`.env.example` contains:

```text
VITE_ENABLE_COMMUNITY_WRITES=false
```

`src/config/env.ts` reads it with a false fallback.

## 6. Are Frontend Writes Still Gated?

Yes.

The community service still returns gated errors for post, comment, like/unlike, report, own hide/delete, and comment operations. Storage upload returns `storage_not_ready`. Notification operations return `notification_backend_needed`.

## 7. Are Service Role Keys Absent From Frontend?

Yes.

The M111 audit found no `VITE_SERVICE_ROLE`, `SERVICE_ROLE`, or similar dangerous frontend env reference in `.env.example`, `src/config/env.ts`, or `src/vite-env.d.ts`.

Existing docs correctly mention service-role keys only as forbidden/backend-only warnings.

## 8. What Owner Actions Remain In Supabase Dashboard?

1. Confirm the selected Supabase project is staging, not production.
2. Confirm no service-role key is placed in frontend env or Cloudflare public variables.
3. Apply `supabase/sql/community_v1_schema_m110.sql` in the SQL Editor.
4. Confirm community tables exist.
5. Confirm RLS is enabled and policies exist.
6. Confirm storage bucket and owner-folder policies exist.
7. Create or use two staging test users.
8. Run the two-user RLS/auth/storage verification worksheet.
9. Record pass/fail/blocked outcomes.
10. Decide whether to approve `VITE_ENABLE_COMMUNITY_WRITES=true` for staging only in M112.

## 9. What Must Pass Before M112?

- SQL applied to staging without unresolved errors.
- RLS enabled on all five community tables.
- User A can create/read/update own allowed rows.
- User B can read published content but cannot edit/delete User A rows.
- Anonymous inserts fail.
- Duplicate likes fail or are handled idempotently.
- Reports insert for authenticated users only and are not broadly listable.
- Notifications are readable only by recipient and cannot be browser-inserted arbitrarily.
- Storage upload/delete is restricted to the user's own folder.
- Wrong file type and oversized image behavior is verified.
- No service-role key is exposed.
- Owner approves staging-only write flag testing.

## 10. Tests/Checks Run

- `npm run lint` passed.
- `npm run build` passed, with the existing non-blocking large chunk warning.
- `npm run test` passed: 42 files, 348 tests.
- `git diff --check` passed with line-ending warnings only.
- Route smoke passed in the in-app browser for `/app/community`, `/app/notifications`, `/app`, `/app/prices`, `/app/calculators`, `/app/ai`, `/app/weather`, and `/app/profile`.
- Route smoke confirmed `/app/community` shows the write-after-security gate, no fake community activity, `ชุมชน` remains in bottom navigation, and `เครื่องมือ` is not a bottom tab.

## 11. Files Created/Modified

Created:

- `docs/community/COMMUNITY_STAGING_EXECUTION_WORKSHEET_M111.md`
- `docs/community/COMMUNITY_STAGING_SQL_TEST_SNIPPETS_M111.md`
- `docs/community/COMMUNITY_WRITES_FEATURE_FLAG_PLAN_M111.md`
- `docs/community/COMMUNITY_SERVICE_READINESS_REVIEW_M111.md`
- `reports/milestones/M111_COMMUNITY_STAGING_RLS_AUTH_STORAGE_VERIFICATION_PREP_REPORT.md`

Modified:

- No production behavior files were intentionally changed for M111.

## 12. Next Recommended Milestone

M112 should be a controlled staging-only implementation milestone if, and only if, the owner applies the SQL pack and the M111 worksheet passes. M112 can then add a narrow Supabase community adapter behind `VITE_ENABLE_COMMUNITY_WRITES=true` for staging, while production remains disabled.
