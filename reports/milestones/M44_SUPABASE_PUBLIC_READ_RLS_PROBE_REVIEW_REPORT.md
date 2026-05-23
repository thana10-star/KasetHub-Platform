# M44 Supabase Public Read Verification + RLS Probe Review Report

## Summary

M44 adds a pending review layer for the real `kasethub-staging` public read probe and RLS review. It asks the operator to run `/app/supabase-readonly-probe` with local staging env, record results for `articles`, `videos`, and `crop_price_snapshots`, and confirm that RLS protects private/user-owned tables with no unsafe public write behavior.

No actual probe results were provided during this implementation, so M44 remains `pending operator probe`.

No real keys, `.env.local`, service-role key, auth enablement, cloud sync, uploads, AI calls, Edge Function calls, backend writes, automatic migrations, destructive SQL, or production behavior were added.

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
- blockers while operator evidence is missing

## Operator Evidence Requested

Using local `.env.local` only:

```bash
VITE_ENABLE_SUPABASE=true
VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=true
VITE_ENABLE_AUTH=false
VITE_ENABLE_CLOUD_SYNC=false
```

Open:

- `/app/supabase-readonly-probe`

Provide results for:

- `articles`
- `videos`
- `crop_price_snapshots`

Allowed result categories:

- `empty table OK`
- `read OK`
- `RLS/policy blocked`
- `table missing`

## Probe Review Status

| Table | Status | Notes |
| --- | --- | --- |
| `articles` | pending | Waiting for operator probe result |
| `videos` | pending | Waiting for operator probe result |
| `crop_price_snapshots` | pending | Waiting for operator probe result |

## RLS Review Status

Current status: pending.

Still needs evidence for:

- public read tables allowed only as intended
- no public write policy
- anon access limited
- user-owned tables protected
- service-role not used
- staging project confirmed

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
- Auth/cloud sync remain blocked until M44 evidence is reviewed.

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

Each checked route rendered the expected page title and M44 status content where applicable. `/app/profile` was also checked to confirm the existing profile page still rendered. The local Vite server and headless Chrome process were stopped after verification.

## Known Limitations

- Codex did not inspect the real Supabase Dashboard.
- Codex did not run the real read-only probe with project keys.
- M44 remains pending until the operator provides actual probe results and RLS evidence.
- The frontend probe does not prove every RLS policy.
- Empty public tables can be successful for fresh staging.
- A policy that filters all rows can look like zero visible rows.
- Any policy issue must be documented and fixed in a separate reviewed SQL milestone.

## Next Recommended Milestone

After the operator provides M44 evidence:

- If all public read results are expected and RLS/no-public-write evidence is clean, mark M44 `success`.
- If a public read table is unexpectedly blocked or missing, document whether this is expected and decide whether a small policy/table fix is needed.
- If anon can write or private/user-owned data is exposed, keep M44 `blocked` and create a minimal SQL policy fix milestone before enabling auth or cloud sync.
