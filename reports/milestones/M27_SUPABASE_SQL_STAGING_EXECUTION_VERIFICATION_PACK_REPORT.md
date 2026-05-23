# M27 Supabase SQL Staging Execution + Verification Pack Report

## Summary

M27 adds the manual Supabase SQL/RLS staging execution and verification pack for KasetHub. It gives the team a safe human checklist for running the existing draft schema and RLS files on a staging project later, plus a local-only app checklist page that summarizes expected tables, policies, indexes, triggers, warnings, and production blockers.

No Supabase connection, SQL execution, migration run, auth enablement, cloud sync, backend write, storage upload, real key, service-role key, or network call was added.

## Files Changed

- `src/services/supabase/supabase-sql-draft-validator.types.ts`
- `src/services/supabase/supabase-sql-draft-validator.ts`
- `src/routes/SupabaseSqlChecklistPage.tsx`
- `src/routes/SupabaseReadinessPage.tsx`
- `src/routes/SupabaseConnectionPage.tsx`
- `src/routes/AdminDashboardPage.tsx`
- `src/routes/QAPage.tsx`
- `src/app/App.tsx`
- `src/types/kaset.ts`
- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/SUPABASE_SQL_STAGING_EXECUTION_GUIDE.md`
- `docs/SUPABASE_MANUAL_VERIFICATION_PACK.md`
- `docs/SUPABASE_STAGING_SETUP_GUIDE.md`
- `docs/SUPABASE_STAGING_CONNECTION_DRY_RUN.md`
- `docs/SUPABASE_READINESS_AUDIT.md`
- `docs/SUPABASE_MIGRATION_CHECKLIST.md`
- `docs/SUPABASE_ENV_SETUP.md`
- `reports/milestones/M27_SUPABASE_SQL_STAGING_EXECUTION_VERIFICATION_PACK_REPORT.md`

## Routes Added

- `/app/supabase-sql-checklist`

## SQL Execution Guide Notes

- Added `docs/SUPABASE_SQL_STAGING_EXECUTION_GUIDE.md`.
- The guide requires pre-checks before SQL execution.
- It tells the operator to confirm the target project is staging, not production.
- It sets the execution order: schema SQL first, RLS policy SQL second.
- It includes table, RLS, index, constraint, service-role, rollback, cleanup, and screenshot checklists.
- It includes repeated "stop if unsure" warnings.

The SQL drafts were reviewed for comments. Existing staging/service-role cautions were already present, so no SQL comments or semantics were changed.

## Manual Verification Notes

- Added `docs/SUPABASE_MANUAL_VERIFICATION_PACK.md`.
- Checklist sections cover tables, triggers, RLS, public reads, user-owned policies, backend-only operations, storage planning, crop price tables, community moderation tables, admin/audit placeholders, auth provider status, and Edge Function status.
- The pack is intended for manual Supabase dashboard verification only.

## Validator Utility Notes

- `validateSupabaseSqlDraft()` is static/local only.
- It uses hardcoded expected draft artifact names.
- It does not read the file system from the browser.
- It does not connect to Supabase.
- It does not fetch schema or run SQL.
- It returns expected tables, policies, indexes, triggers, missing/future draft notes, staging warnings, production blockers, and manual checklist items.

## Screens Updated

- `/app/supabase-sql-checklist` shows SQL execution order, expected tables, expected RLS policies, indexes/triggers, manual verification checklist, warnings, and production blockers.
- `/app/supabase-readiness` links to the SQL staging checklist.
- `/app/supabase-connection` links to the SQL staging checklist.
- `/app/admin` adds Supabase SQL checklist cards in overview/system panels.
- `/app/qa` includes the SQL checklist in reviewed routes.

## Verification Commands

```bash
npm run lint
npm run build
```

Both passed. The production build completed with the existing Vite large chunk warning.

## Manual Route Checks

The in-app Browser plugin did not expose an available `iab` browser in this session, so route verification used local Vite on `http://127.0.0.1:5174` plus headless Chrome DOM checks.

Passed:

- `/app/supabase-sql-checklist`
- `/app/supabase-readiness`
- `/app/supabase-connection`
- `/app/admin`
- `/app/qa`
- `/app/profile`

The local Vite server was stopped after verification.

## Known Limitations

- No real Supabase project was connected.
- No SQL migration or RLS policy file was executed.
- No schema was fetched from Supabase.
- No real keys were added.
- No service-role key was added.
- No auth or cloud sync was enabled.
- No backend writes, storage uploads, or network calls were added.
- The validator is conceptual/static and cannot prove the real staging database state.
- Future M21-M24 tables remain documented/planned where they are not yet in the M18 SQL draft.

## Next Recommended Milestone

M28 should add the backend-owned admin RBAC and audit-log contract: server-side role checks, append-only audit logs, moderator/admin action contracts, expert review escalation, and staging RLS test cases before any real admin write path is enabled.
