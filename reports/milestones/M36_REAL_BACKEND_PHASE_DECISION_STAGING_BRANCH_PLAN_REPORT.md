# M36 Real Backend Phase Decision + Staging Branch Plan Report

## Summary

M36 adds a planning-only decision layer for the next real implementation phase after the M01-M35 local/mock prototype. KasetHub now has a static phase decision service, `/app/next-phase`, staging branch workflow docs, and a risk register to help choose the safest path toward real Supabase, auth, Guest Sync, AI proxy, plant vision, and mobile/PWA work.

No Supabase connection, auth enablement, SQL migration, AI API call, API key, network call, backend write, or production behavior was added.

## Files Changed

- `src/services/phase-planning/phase-decision.types.ts`
- `src/services/phase-planning/phase-decision-service.ts`
- `src/routes/NextPhasePage.tsx`
- `src/app/App.tsx`
- `src/types/kaset.ts`
- `src/routes/AdminDashboardPage.tsx`
- `src/routes/QAPage.tsx`
- `src/routes/MvpSnapshotPage.tsx`
- `src/routes/ProfilePage.tsx`
- `src/services/qa/route-registry.ts`
- `README.md`
- `docs/M36_REAL_BACKEND_PHASE_DECISION.md`
- `docs/STAGING_BRANCH_WORKFLOW_PLAN.md`
- `docs/NEXT_PHASE_RISK_REGISTER.md`
- `docs/M36_NEXT_PHASE_ROUTE_CHECKLIST.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/M30_NEXT_PHASE_DECISION.md`
- `docs/M30_INTERNAL_MVP_SNAPSHOT.md`
- `docs/SUPABASE_STAGING_SETUP_GUIDE.md`
- `docs/AI_PROXY_ADAPTER_STRATEGY.md`
- `docs/NOTIFICATION_DELIVERY_FUTURE_PLAN.md`
- `reports/milestones/M36_REAL_BACKEND_PHASE_DECISION_STAGING_BRANCH_PLAN_REPORT.md`

## Routes Added

- `/app/next-phase`

## Phase Options

- `real_supabase_staging`
- `real_phone_auth_staging`
- `real_guest_sync_staging`
- `real_ai_text_proxy`
- `real_plant_vision_proxy`
- `pwa_offline_mobile_shell`
- `closed_test_preparation`

## Recommended Order

1. Supabase staging connection + SQL/RLS execution on staging.
2. Phone auth staging.
3. Guest Sync staging.
4. Real AI text proxy.
5. Plant vision proxy.
6. PWA/mobile wrapper.

AI text proxy can move earlier if demo value is the priority, but only with backend-owned secrets, cost caps, rate limits, safety logs, and fixture fallback.

## Branch Workflow Notes

- `main` remains the stable local/mock prototype.
- `staging/supabase` is for Supabase, SQL/RLS, phone auth, and Guest Sync experiments.
- `staging/ai-proxy` is for real AI text proxy and later plant vision work.
- `staging/mobile` is for PWA/offline/mobile shell experiments.
- Merge rules require lint, build, route checks, rollback notes, and no frontend secrets.

## Risk Register Notes

The M36 risk register covers:

- frontend secret leakage
- RLS cross-user access
- auth session ownership mismatch
- Guest Sync duplicate/data-loss risk
- AI cost and safety risk
- mock data being mistaken for production data
- staging branch drift from `main`

## Screens Updated

- `/app/next-phase` shows recommended path, ranked phase options, blockers, branch plan, risk register, and planning-only notices.
- `/app/admin` links to Next Phase and shows a readiness summary card.
- `/app/qa` links to Next Phase and includes it in route coverage.
- `/app/mvp-snapshot` links to Next Phase and notes the M36 decision.
- `/app/profile` links to Next Phase and shows a compact planning status card.

## Verification Commands

```bash
npm run lint
npm run build
```

Both passed. The production build completed with the existing Vite large chunk warning.

## Manual Route Checks

Checked with local Vite at `http://127.0.0.1:5174` plus headless Chrome DOM checks.

Passed:

- `/app/next-phase`
- `/app/admin`
- `/app/qa`
- `/app/mvp-snapshot`
- `/app/profile`
- `/app/supabase-readiness`
- `/app/ai-proxy-status`

The local Vite server was stopped after verification.

## Known Limitations

- No real Supabase connection.
- No real auth or phone OTP.
- No SQL migrations run.
- No AI provider/API call.
- No backend writes.
- No API keys or service-role keys.
- No network call was added by M36.
- Branch workflow is documentation/planning only.
- Risk scores are static planning values, not live telemetry.

## Next Recommended Milestone

M37 should execute the first real staging branch plan: create/use `staging/supabase`, configure a Supabase staging project with URL + anon key only in local/preview env, manually run SQL/RLS on staging, verify RLS and route behavior, and keep `main` stable with local/mock fallback.
