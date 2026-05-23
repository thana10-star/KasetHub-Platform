# M26 Supabase Staging Connection Dry Run Report

## Summary

M26 adds a safe Supabase staging connection dry-run boundary for KasetHub. The app can now inspect client-safe staging configuration, report whether Supabase URL/anon key are present, show feature flag state, detect placeholder or service-role-like keys, and explain the no-write staging checklist. The app still runs normally with no `.env.local`.

No real keys, service-role key, SQL migration, real auth, phone OTP, cloud sync, Supabase write, file upload, backend write, or default network call was added.

## Files Changed

- `.env.example`
- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/SUPABASE_ENV_SETUP.md`
- `docs/SUPABASE_STAGING_SETUP_GUIDE.md`
- `docs/SUPABASE_READINESS_AUDIT.md`
- `docs/SUPABASE_MIGRATION_CHECKLIST.md`
- `docs/SUPABASE_STAGING_CONNECTION_DRY_RUN.md`
- `src/config/env.ts`
- `src/vite-env.d.ts`
- `src/services/supabase/supabase-config-check.ts`
- `src/services/supabase/supabase-connection.types.ts`
- `src/services/supabase/supabase-connection-dry-run.ts`
- `src/routes/SupabaseConnectionPage.tsx`
- `src/routes/SupabaseReadinessPage.tsx`
- `src/routes/AdminDashboardPage.tsx`
- `src/routes/AccountPreviewPage.tsx`
- `src/routes/QAPage.tsx`
- `src/app/App.tsx`
- `src/types/kaset.ts`
- `reports/milestones/M26_SUPABASE_STAGING_CONNECTION_DRY_RUN_REPORT.md`

## Routes Added

- `/app/supabase-connection`

## Env Flags Added

```bash
VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=false
```

The default is `false`, so the app performs local checks only and makes no Supabase network call.

## Dry-Run Behavior

- If Supabase is disabled, the service returns local-only status.
- If Supabase ENV is missing, the service returns safe waiting status.
- If URL/anon key are configured, the service checks client-safe readiness.
- It reports env presence, anon key presence, placeholder detection, service-role-like key detection, auth/cloud sync flags, network-check flag, and no-write guarantees.
- It does not require auth and does not write data.

## Network Safety Notes

- Network probing is disabled by default.
- Optional probe is guarded by all of:
  - `VITE_ENABLE_SUPABASE=true`
  - `VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=true`
  - valid Supabase URL
  - usable anon key
- The optional probe reads only the future public/read-only `public_readiness_checks` table.
- If the table is missing, the result is `schema_not_applied_yet`, not an app failure.
- No private/user-owned tables are queried and no write methods are used.

## Screens Updated

- `/app/supabase-connection` shows the dry-run result, flags, env status, no-write guarantees, network probe status, warnings, and manual staging checklist.
- `/app/supabase-readiness` now includes a staging connection dry-run card and link.
- `/app/admin` now includes Supabase connection dry-run status cards and links.
- `/app/account-preview` links to the connection dry run.
- `/app/qa` includes the connection dry-run route in reviewed routes.

## Verification Commands

```bash
npm run lint
npm run build
```

Both passed. The production build completed with the existing Vite large chunk warning.

## Manual Route Checks

Route verification used local Vite on `http://127.0.0.1:5174` plus headless Chrome DOM checks. The local Vite server was stopped after verification.

Passed:

- `/app/supabase-readiness`
- `/app/supabase-connection`
- `/app/admin`
- `/app/account-preview`
- `/app/profile`
- `/app/qa`

## Known Limitations

- No real Supabase keys are committed.
- No real Supabase staging project is connected by default.
- No migrations are run.
- No real auth, phone OTP, LINE Login, or cloud sync is enabled.
- No Supabase writes, file uploads, backend writes, or private table reads.
- The optional public-read probe depends on a future public/read-only table or RPC.
- Schema status remains unknown/not checked when network check is disabled.
- Connection dry run is not a production health monitor.

## Next Recommended Milestone

M27 should add the backend-owned admin RBAC and audit-log contract: admin route guard design, role claims, server-side permission checks, append-only audit logs, review task lifecycle, RLS policy design, and rollback/correction rules before any real admin action is enabled.
