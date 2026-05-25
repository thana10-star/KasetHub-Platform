# M39 Supabase Staging Env Local Setup Report

## Summary

M39 prepares the `staging/supabase` branch for safe local Supabase staging environment setup. It adds a local-only env safety checker, a Thai UI route for reviewing staging env status, and docs for adding a staging Project URL plus anon key locally later. No real Supabase connection, real keys, service-role key, `.env.local`, migration, auth enablement, cloud sync, backend write, or default network call was added.

## Current Branch

- `staging/supabase`

## Files Changed

- `.gitignore`
- `README.md`
- `docs/M39_SUPABASE_STAGING_ENV_LOCAL_SETUP.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/STAGING_SUPABASE_BRANCH_GUIDE.md`
- `docs/STAGING_SUPABASE_SAFETY_CHECKLIST.md`
- `docs/SUPABASE_ENV_SETUP.md`
- `docs/SUPABASE_STAGING_CONNECTION_DRY_RUN.md`
- `docs/SUPABASE_STAGING_SETUP_GUIDE.md`
- `src/services/config/env-safety.types.ts`
- `src/services/config/env-safety-check.ts`
- `src/routes/EnvSafetyPage.tsx`
- `src/app/App.tsx`
- `src/routes/SupabaseConnectionPage.tsx`
- `src/routes/SupabaseReadinessPage.tsx`
- `src/routes/AdminDashboardPage.tsx`
- `src/routes/NextPhasePage.tsx`
- `src/routes/QAPage.tsx`
- `src/services/qa/route-registry.ts`
- `src/types/kaset.ts`
- `reports/milestones/M39_SUPABASE_STAGING_ENV_LOCAL_SETUP_REPORT.md`

## Routes Added

- `/app/env-safety`

Accessible from:

- `/app/supabase-connection`
- `/app/supabase-readiness`
- `/app/admin`
- `/app/qa`
- `/app/next-phase`

## Env Safety Notes

- Checks missing Supabase env values.
- Detects placeholder-like values.
- Checks Supabase URL format-ish shape.
- Checks anon key format-ish shape.
- Warns if a service-role-like key appears in frontend env.
- Blocks early auth/cloud sync/Guest Sync backend/Guest Sync Edge/phone/LINE auth flags.
- Warns if `VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=true`.
- Masks env values in the UI and never displays full keys.
- Performs no network calls.

## Docs Updated

- Added the M39 local env setup guide.
- Updated branch/safety docs to require `/app/env-safety` before connection dry-run checks.
- Updated Supabase env/setup/dry-run docs with M39 safe values and stop conditions.
- Updated README and project blueprint with the M39 boundary.

## Verification Commands

```bash
npm run lint
npm run build
```

Both passed. The production build completed with the existing Vite large chunk warning.

## Manual Route Checks

The in-app Browser plugin did not expose an available browser (`iab`) in this session, so route verification used local Vite on `http://127.0.0.1:5174` plus headless Chrome DOM checks.

Passed:

- `/app/env-safety`
- `/app/supabase-connection`
- `/app/supabase-readiness`
- `/app/admin`
- `/app/qa`
- `/app/next-phase`

The local Vite server was stopped after verification.

## Git Status

Before commit, the working tree contains the intended M39 source/docs/report changes only. No `.env.local`, `.env.production`, `.env.staging`, real Supabase key, service-role key, or generated build artifact is included.

## Known Limitations

- No real Supabase project is connected.
- No real keys are committed.
- No `.env.local` is committed.
- No SQL migration is run.
- No real auth or phone OTP is enabled.
- No cloud sync or Guest Sync Edge call is enabled.
- No backend write or network probe runs by default.
- Env checks are format/safety heuristics only; they do not verify a real Supabase project.

## Next Recommended Milestone

M40 should add a carefully gated Supabase staging anon-client readiness test using local `.env.local` values, still with network probing disabled by default and no auth/cloud sync/writes until SQL/RLS staging verification is complete.

