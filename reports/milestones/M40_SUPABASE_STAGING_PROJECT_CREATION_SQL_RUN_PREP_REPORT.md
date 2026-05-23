# M40 Supabase Staging Project Creation + SQL Run Prep Report

## Summary

M40 prepares KasetHub for the manual creation of a real Supabase staging project and a careful human-run SQL/RLS execution later. It adds project creation docs, SQL run prep docs, post-SQL verification docs, a static checklist service, and in-app M40 guidance on the Supabase/admin readiness surfaces.

No Supabase project was created automatically. No app connection, real key, `.env.local`, SQL migration execution, auth enablement, cloud sync, backend write, or default network call was added.

## Current Branch

- `staging/supabase`

## Files Changed

- `src/services/supabase/supabase-staging-project-checklist.types.ts`
- `src/services/supabase/supabase-staging-project-checklist.ts`
- `src/routes/SupabaseSqlChecklistPage.tsx`
- `src/routes/SupabaseReadinessPage.tsx`
- `src/routes/SupabaseConnectionPage.tsx`
- `src/routes/EnvSafetyPage.tsx`
- `src/routes/AdminDashboardPage.tsx`
- `src/routes/NextPhasePage.tsx`
- `src/services/qa/route-registry.ts`
- `docs/M40_SUPABASE_PROJECT_CREATION_GUIDE.md`
- `docs/M40_SQL_RUN_PREP_CHECKLIST.md`
- `docs/M40_POST_SQL_VERIFICATION_GUIDE.md`
- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/STAGING_BRANCH_WORKFLOW_PLAN.md`
- `docs/STAGING_SUPABASE_BRANCH_GUIDE.md`
- `docs/STAGING_SUPABASE_SAFETY_CHECKLIST.md`
- `docs/M39_SUPABASE_STAGING_ENV_LOCAL_SETUP.md`
- `docs/SUPABASE_SQL_STAGING_EXECUTION_GUIDE.md`
- `docs/SUPABASE_MANUAL_VERIFICATION_PACK.md`
- `docs/SUPABASE_STAGING_SETUP_GUIDE.md`
- `docs/SUPABASE_MIGRATION_CHECKLIST.md`
- `reports/milestones/M40_SUPABASE_STAGING_PROJECT_CREATION_SQL_RUN_PREP_REPORT.md`

## UI Screens Updated

- `/app/supabase-sql-checklist` now shows M40 project creation, SQL run prep, and post-SQL verification sections.
- `/app/supabase-readiness` now shows an M40 manual project creation + SQL prep card.
- `/app/supabase-connection` now shows an M40 SQL run prep card while preserving no-write dry-run behavior.
- `/app/env-safety` now references M40 manual project creation before real staging env use.
- `/app/admin` now shows M40 SQL prep status in the overview.
- `/app/next-phase` copy now points the staging branch path at M40 instead of the old M39 next step.

## Manual Project Creation Notes

- Recommended staging project name: `kasethub-staging`.
- Choose Singapore/Southeast Asia or a region close to Thailand if available.
- Save only the Project URL and anon public key locally.
- Never copy the service-role key into frontend env, docs, screenshots, or Cloudflare public variables.
- Dashboard areas to locate before later work: SQL Editor, Authentication settings, Storage settings, Edge Functions, Table Editor, and RLS/policy views.

## SQL Run Prep Notes

Manual run order:

1. `supabase/migrations/0001_kasethub_core_schema.sql`
2. `supabase/policies/0001_kasethub_rls_policies.sql`

The docs emphasize:

- confirm staging before opening SQL Editor
- copy full file content carefully
- stop on any SQL error
- save screenshots/logs without secrets
- verify no broad public write policy is added

## Post-SQL Verification Notes

The new post-SQL guide covers:

- expected tables
- representative RLS policies
- expected indexes/triggers
- dashboard verification checks
- safe read-only SELECT checks
- rollback/cleanup steps for staging

It explicitly says not to test auth, cloud sync, uploads, Edge Functions, AI, phone OTP, Guest Sync writes, or admin actions in M40.

## Verification Commands

```bash
npm run lint
npm run build
```

Both passed. The production build completed with the existing Vite large chunk warning.

## Manual Route Checks

The in-app Browser plugin did not expose an available browser (`iab`) in this session, so route verification used local Vite on `http://127.0.0.1:5174` plus headless Chrome DOM checks.

Passed:

- `/app/supabase-sql-checklist`
- `/app/supabase-readiness`
- `/app/supabase-connection`
- `/app/env-safety`
- `/app/admin`
- `/app/qa`

The local Vite server was stopped after verification.

## Git Status

Before commit, the working tree contains the intended M40 source/docs/report changes only. Generated build artifacts were restored after verification.

## Known Limitations

- No Supabase project was created.
- No real keys were added.
- No `.env.local` was committed.
- No Supabase connection was made.
- No SQL was executed.
- No migrations were run automatically.
- No auth or phone OTP was enabled.
- No cloud sync or backend writes were enabled.
- Checklist output is static/manual and does not inspect a real Supabase project.

## Next Recommended Milestone

M41 should perform the first controlled manual staging execution record: the user creates `kasethub-staging`, runs the SQL/RLS drafts manually, captures screenshots/logs, and updates the project with the result while still keeping app auth/cloud sync/writes disabled.

