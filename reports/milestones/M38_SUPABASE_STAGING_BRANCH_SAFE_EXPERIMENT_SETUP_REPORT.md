# M38 Supabase Staging Branch Creation + Safe Experiment Setup Report

## Summary

M38 creates the safe Git branch workflow for starting future Supabase staging experiments without risking the stable `main` prototype. The work was done on `staging/supabase` and remains branch/setup/documentation only. No Supabase connection, real keys, `.env.local`, SQL migration, auth enablement, cloud sync, backend write, or production behavior was added.

## Branch Created/Switched

- Baseline status before branch work: clean.
- Latest baseline commit: `e0db8c9 feat: complete M31-M36 platform planning and farmer utility foundations`.
- Snapshot tag confirmed: `m36-platform-planning-snapshot`.
- Branch created: `staging/supabase`.
- Current work mode: Supabase staging experiment setup.

## Files Changed

- `docs/STAGING_SUPABASE_BRANCH_GUIDE.md`
- `docs/STAGING_SUPABASE_SAFETY_CHECKLIST.md`
- `docs/STAGING_BRANCH_WORKFLOW_PLAN.md`
- `docs/M36_REAL_BACKEND_PHASE_DECISION.md`
- `docs/M36_NEXT_PHASE_ROUTE_CHECKLIST.md`
- `docs/PROJECT_BLUEPRINT.md`
- `README.md`
- `src/routes/NextPhasePage.tsx`
- `src/routes/SupabaseReadinessPage.tsx`
- `src/routes/AdminDashboardPage.tsx`
- `dist/index.html`
- `reports/milestones/M38_SUPABASE_STAGING_BRANCH_SAFE_EXPERIMENT_SETUP_REPORT.md`

## Safety Docs Added

- `docs/STAGING_SUPABASE_BRANCH_GUIDE.md` explains branch purpose, how to return to `main`, merge-back rules, rollback rules, Cloudflare preview branch planning, and command examples.
- `docs/STAGING_SUPABASE_SAFETY_CHECKLIST.md` covers checks before enabling Supabase, running SQL, enabling auth, enabling cloud sync, pushing the branch, secret scanning, service-role boundaries, and production-project warnings.

## Screens Updated

- `/app/next-phase` shows the recommended current branch `staging/supabase`, Supabase staging experiment mode, no-real-secrets warning, and next milestone M39.
- `/app/supabase-readiness` shows the same branch-mode guardrail near the readiness audit.
- `/app/admin` shows the M38 branch setup status in the admin overview.

## Verification Commands

```bash
git status
git log --oneline -1
git tag --list "m36-platform-planning-snapshot"
npm run lint
npm run build
```

All verification commands passed. The production build completed with the existing Vite large chunk warning.

## Manual Route Checks

Checked with local Vite on `http://127.0.0.1:5174` and Chrome DevTools Protocol.

Passed:

- `/app/next-phase`
- `/app/supabase-readiness`
- `/app/admin`
- `/app/qa`
- `/app/profile`

The local Vite server was stopped after verification.

## Git Status After Changes

Before staging the M38 commit, `git status --short` showed modified docs/screens plus new M38 docs/report. No `.env.local`, `.env.production`, or `.env.staging` files were present or staged.

Secret-pattern scan found only placeholder documentation examples:

- `https://your-project.supabase.co`
- `https://your-staging-project.supabase.co`
- `your-anon-key-placeholder`
- `your-staging-anon-key`

## Known Limitations

- No real Supabase connection.
- No real keys.
- No `.env.local`.
- No SQL migrations run.
- No auth or phone OTP enabled.
- No cloud sync.
- No backend writes.
- No runtime branch detection; UI branch status copy is static by design.
- No Cloudflare preview variables configured yet.

## Next Recommended Milestone

M39 should add a safe local Supabase staging env setup checklist and optional local-only config validation for `staging/supabase`, using `.env.example` as the template while still not committing `.env.local`, service-role keys, SQL execution, auth, cloud sync, or backend writes.
