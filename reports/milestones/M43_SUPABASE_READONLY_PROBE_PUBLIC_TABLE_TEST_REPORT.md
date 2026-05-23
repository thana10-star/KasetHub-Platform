# M43 Supabase Read-only Probe + Public Table Test Report

## Summary

M43 adds a guarded read-only Supabase staging probe for `kasethub-staging`. The app can now create an anon Supabase client only when local staging env is present and both `VITE_ENABLE_SUPABASE=true` and `VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=true` are set. The probe checks only public/read-safe tables and never writes data.

No real keys, `.env.local`, service-role key, auth enablement, cloud sync, uploads, AI calls, Edge Function calls, backend writes, or production behavior were added.

## Files Changed

- `src/services/supabase/supabase-readonly-probe.types.ts`
- `src/services/supabase/supabase-readonly-probe.ts`
- `src/services/supabase/supabase-config-check.ts`
- `src/services/supabase/supabase-connection-dry-run.ts`
- `src/routes/SupabaseReadonlyProbePage.tsx`
- `src/app/App.tsx`
- `src/types/kaset.ts`
- `src/routes/SupabaseConnectionPage.tsx`
- `src/routes/SupabaseReadinessPage.tsx`
- `src/routes/EnvSafetyPage.tsx`
- `src/routes/AdminDashboardPage.tsx`
- `src/routes/NextPhasePage.tsx`
- `src/services/qa/route-registry.ts`
- `src/services/supabase/supabase-sql-draft-validator.ts`
- `docs/M43_SUPABASE_READONLY_PROBE.md`
- `docs/SUPABASE_STAGING_CONNECTION_DRY_RUN.md`
- `docs/SUPABASE_READINESS_AUDIT.md`
- `docs/M42_SUPABASE_MANUAL_EXECUTION_REVIEW.md`
- `docs/PROJECT_BLUEPRINT.md`
- `README.md`
- `reports/milestones/M43_SUPABASE_READONLY_PROBE_PUBLIC_TABLE_TEST_REPORT.md`

## Routes Added

- `/app/supabase-readonly-probe`

Linked from:

- `/app/supabase-connection`
- `/app/supabase-readiness`
- `/app/env-safety`
- `/app/admin`
- `/app/next-phase`

## Env Needed Locally

```bash
VITE_SUPABASE_URL=https://your-staging-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-staging-anon-key
VITE_ENABLE_SUPABASE=true
VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=true
VITE_ENABLE_AUTH=false
VITE_ENABLE_CLOUD_SYNC=false
```

These values belong in local `.env.local` only. They are not committed.

## Probe Behavior

- If env is missing, the route reports config missing and does not create a client.
- If the dry-run network flag is false, the route reports network disabled and does not call Supabase.
- If auth or cloud sync flags are true, the route blocks the probe.
- If the anon key looks like a service-role key, including decoded JWT payload role markers, the route blocks the probe.
- If guards pass, the route creates an anon client with session persistence disabled.
- It performs read-only count probes and does not display row data.
- Safe errors are sanitized and do not expose keys.

## Tables Probed

- `articles`
- `videos`
- `crop_price_snapshots`

## Results If Run

This commit did not include real keys or `.env.local`, so the committed app remains safe with no local env. The route can show:

- `network disabled` when `VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=false`
- `config missing` when URL or anon key is absent
- `empty table OK` when the table is reachable but has no public rows
- `read OK` when public rows are visible
- `RLS/policy blocked` when anon read is blocked
- `table missing` when the table is absent or not visible to PostgREST

## Safety Notes

- No real keys committed.
- No `.env.local` committed.
- No service-role key added.
- No write operations added.
- No auth enablement.
- No cloud sync.
- No uploads.
- No AI API calls.
- No Edge Function calls.
- No backend writes.
- App still works with no `.env.local`.
- Network reads are behind explicit local flags.

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

- `/app/supabase-readonly-probe`
- `/app/supabase-connection`
- `/app/supabase-readiness`
- `/app/env-safety`
- `/app/admin`
- `/app/next-phase`

Each checked route rendered the expected M43 read-only probe title/link/status content. The local Vite server and headless Chrome process were stopped after verification.

## Known Limitations

- The frontend probe does not prove every RLS policy.
- Empty tables can be successful for a fresh staging database.
- A policy that filters all rows may look like zero visible rows, not necessarily an error.
- Real Supabase verification still needs dashboard review for policies, grants, and table security.
- Auth/cloud sync remain disabled and out of scope.

## Next Recommended Milestone

M44 should review the M43 probe result from the real `kasethub-staging` project. If read-only public table probes pass or return expected empty results, the next safe step can be a focused RLS/public policy verification or phone auth staging planning milestone. Auth and cloud sync should remain disabled until that review passes.
