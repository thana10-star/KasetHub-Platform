# M44 Supabase Public Read Verification + RLS Probe Review Report

## Summary

M44 records the successful real `kasethub-staging` public read probe and RLS review. The operator ran `/app/supabase-readonly-probe` with local staging env, recorded results for `articles`, `videos`, and `crop_price_snapshots`, and confirmed that auth/cloud sync remained disabled with no service-role key, no writes, RLS still enabled, and no unsafe public write behavior observed.

M44 status is now `success`.

A manual SQL grant/policy patch was applied directly in Supabase staging to allow anon/authenticated `SELECT` on `articles`, `videos`, and `crop_price_snapshots`. The app did not run SQL automatically.

No real keys, `.env.local`, service-role key, auth enablement, cloud sync, uploads, AI calls, Edge Function calls, backend writes, automatic migrations, destructive SQL, or production behavior were added to the repo or app.

## Current Branch

- `staging/supabase`

## Files Changed

- `src/services/supabase/supabase-public-read-review.types.ts`
- `src/services/supabase/supabase-public-read-review.ts`
- `src/routes/SupabaseReadonlyProbePage.tsx`
- `src/routes/SupabaseReadinessPage.tsx`
- `src/routes/AdminDashboardPage.tsx`
- `src/routes/NextPhasePage.tsx`
- `src/services/qa/route-registry.ts`
- `docs/M44_SUPABASE_PUBLIC_READ_VERIFICATION.md`
- `docs/M44_RLS_PUBLIC_READ_REVIEW_CHECKLIST.md`
- `docs/M43_SUPABASE_READONLY_PROBE.md`
- `docs/PROJECT_BLUEPRINT.md`
- `README.md`
- `reports/milestones/M44_SUPABASE_PUBLIC_READ_RLS_PROBE_REVIEW_REPORT.md`

## Routes Updated

- `/app/supabase-readonly-probe`
- `/app/supabase-readiness`
- `/app/admin`
- `/app/next-phase`

Each route now surfaces:

- M44 verification status
- public read verification status
- RLS review status
- successful empty-table probe results

## Operator Evidence Received

Using local `.env.local` only:

```bash
VITE_ENABLE_SUPABASE=true
VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=true
VITE_ENABLE_AUTH=false
VITE_ENABLE_CLOUD_SYNC=false
```

Open:

- `/app/supabase-readonly-probe`

Actual results received for:

- `articles`: empty table OK, count 0
- `videos`: empty table OK, count 0
- `crop_price_snapshots`: empty table OK, count 0

Additional confirmation:

- auth enabled: false
- cloud sync enabled: false
- service-role key used: no
- writes performed: no
- public read probe: passed
- RLS remains enabled
- no unsafe public write observed

## Probe Review Status

| Table | Status | Notes |
| --- | --- | --- |
| `articles` | empty table OK | count 0; public read probe passed |
| `videos` | empty table OK | count 0; public read probe passed |
| `crop_price_snapshots` | empty table OK | count 0; public read probe passed |

## Manual Staging SQL Patch

A manual SQL grant/policy patch was applied in Supabase staging to allow anon/authenticated `SELECT` on:

- `articles`
- `videos`
- `crop_price_snapshots`

This patch was applied manually in `kasethub-staging`. No SQL was run automatically by the app or Codex, and no SQL migration file was changed in this milestone.

## RLS Review Status

Current status: success.

Reviewed evidence:

- public read tables allowed as intended for anon/authenticated `SELECT`
- no unsafe public write observed
- anon access limited to reviewed public read behavior
- RLS remains enabled
- service-role not used
- staging project confirmed as `kasethub-staging`

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
- No automatic migrations.
- No destructive SQL changes.
- App still works with no `.env.local`.
- Auth/cloud sync remain disabled after successful M44 review.

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
- `/app/supabase-readiness`
- `/app/admin`
- `/app/next-phase`
- `/app/profile`

After marking M44 successful, route checks were re-run for:

- `/app/supabase-readonly-probe`
- `/app/supabase-readiness`
- `/app/admin`
- `/app/next-phase`

Each checked route rendered the expected page title plus M44 `success`, empty-table OK, and `blockers: none` content where applicable. The local Vite server and headless Chrome process were stopped after verification.

## Known Limitations

- Codex did not inspect the real Supabase Dashboard.
- Codex did not run the real read-only probe with project keys.
- The frontend probe does not prove every RLS policy.
- Empty public tables can be successful for fresh staging.
- A policy that filters all rows can look like zero visible rows.
- Any policy issue must be documented and fixed in a separate reviewed SQL milestone.

## Next Recommended Milestone

M45 should keep auth/cloud sync disabled and decide the next safe step: either focused private-table RLS evidence review, or phone auth staging prep. If any future anon write or private/user-owned exposure is discovered, create a minimal SQL policy fix milestone before enabling auth or cloud sync.
