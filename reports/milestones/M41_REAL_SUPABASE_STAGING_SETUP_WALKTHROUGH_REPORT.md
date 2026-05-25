# M41 Real Supabase Staging Setup Walkthrough Report

## Summary

M41 prepares KasetHub for the first real Supabase staging database setup. It adds a beginner-friendly manual walkthrough, a screenshot checklist, a new `/app/supabase-setup-guide` route, and localStorage-only setup progress state for project/env/SQL/RLS verification.

No real Supabase project was created by the app. No real keys, `.env.local`, service-role key, automatic SQL execution, auth enablement, cloud sync, uploads, AI proxy, backend writes, or production behavior were added.

## Current Branch

- `staging/supabase`

## Files Changed

- `src/services/supabase/supabase-setup-progress.types.ts`
- `src/services/supabase/supabase-setup-progress.ts`
- `src/routes/SupabaseSetupGuidePage.tsx`
- `src/app/App.tsx`
- `src/types/kaset.ts`
- `src/routes/SupabaseReadinessPage.tsx`
- `src/routes/SupabaseConnectionPage.tsx`
- `src/routes/SupabaseSqlChecklistPage.tsx`
- `src/routes/EnvSafetyPage.tsx`
- `src/routes/AdminDashboardPage.tsx`
- `src/routes/NextPhasePage.tsx`
- `src/routes/ProfilePage.tsx`
- `src/routes/QAPage.tsx`
- `src/services/qa/route-registry.ts`
- `docs/M41_REAL_SUPABASE_STAGING_SETUP_WALKTHROUGH.md`
- `docs/M41_SQL_EXECUTION_SCREENSHOT_CHECKLIST.md`
- `docs/M40_SUPABASE_PROJECT_CREATION_GUIDE.md`
- `docs/M40_SQL_RUN_PREP_CHECKLIST.md`
- `docs/M40_POST_SQL_VERIFICATION_GUIDE.md`
- `docs/STAGING_SUPABASE_BRANCH_GUIDE.md`
- `docs/STAGING_SUPABASE_SAFETY_CHECKLIST.md`
- `docs/PROJECT_BLUEPRINT.md`
- `README.md`
- `reports/milestones/M41_REAL_SUPABASE_STAGING_SETUP_WALKTHROUGH_REPORT.md`

## Routes Added

- `/app/supabase-setup-guide`

Linked from:

- `/app/supabase-readiness`
- `/app/supabase-connection`
- `/app/admin`
- `/app/next-phase`
- `/app/supabase-sql-checklist`
- `/app/env-safety`
- `/app/profile`
- `/app/qa`

## Setup Walkthrough Notes

The new walkthrough covers:

- create a Supabase project manually at `https://supabase.com`
- suggested staging project name: `kasethub-staging`
- choose Singapore/closest region if available
- wait for database initialization
- collect only Project URL and anon/public key
- create `.env.local` locally only
- restart Vite after env changes
- stop before auth, cloud sync, uploads, and AI proxy

## SQL Execution Notes

Manual SQL order remains:

1. `supabase/migrations/0001_kasethub_core_schema.sql`
2. `supabase/policies/0001_kasethub_rls_policies.sql`

The guide explicitly says to stop on SQL Editor errors and not rerun blindly. The app does not run SQL or inspect the remote database.

## Safety Notes

- No real keys committed.
- No `.env.local` committed.
- No service-role key added.
- No automatic SQL execution.
- No auth enablement.
- No cloud sync.
- No uploads.
- No AI proxy.
- No backend writes.
- Setup progress uses only `localStorage` key `kasethub.supabaseSetupProgress.v1`.
- The checklist is a local operator aid, not proof of remote Supabase state.

## Verification Commands

```bash
npm run lint
npm run build
```

Results:

- `npm run lint` passed.
- `npm run build` passed.
- Vite still reports the existing large chunk warning after minification.

## Manual Route Checks

The in-app Browser plugin was attempted first, but `iab` was unavailable in this session. Route verification used local Vite on `http://127.0.0.1:5174` plus headless Chrome/CDP DOM checks.

Passed:

- `/app/supabase-setup-guide`
- `/app/supabase-readiness`
- `/app/supabase-connection`
- `/app/supabase-sql-checklist`
- `/app/env-safety`
- `/app/admin`
- `/app/next-phase`

Each checked route rendered its expected page title and M41/service-role warning content. The local Vite server and headless Chrome process were stopped after verification.

## Known Limitations

- Codex did not create the real Supabase project.
- Codex did not run SQL in Supabase.
- The app does not verify remote tables/RLS/indexes automatically.
- Local progress can be checked manually and can be reset locally.
- Auth, cloud sync, uploads, Edge Functions, AI proxy, and frontend writes remain disabled/out of scope.
- Future remote verification must rely on dashboard screenshots or a later reviewed read-only verification milestone.

## Next Recommended Milestone

M42 should record the actual manual staging execution result: confirm `kasethub-staging` exists, review SQL/RLS success screenshots, document any SQL errors or fixes, and decide whether the next safe step is RLS correction or phone auth staging. Auth/cloud sync should remain disabled until that review passes.
