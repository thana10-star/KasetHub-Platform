# M30 Internal MVP QA + Prototype Snapshot Report

## Summary

M30 adds an internal QA and prototype snapshot layer for KasetHub after M01-M29. The app now has a route registry, module readiness audit, `/app/mvp-snapshot` screen, updated Admin/QA/Profile access points, and a documentation pack for handoff into the next real staging/backend phase.

No real backend, Supabase connection, migration, auth, OTP, cloud sync, AI API call, upload, network call, production claim, or major new product feature was added.

## Files Changed

- `src/services/qa/route-registry.ts`
- `src/services/qa/mvp-readiness.types.ts`
- `src/services/qa/mvp-readiness-audit.ts`
- `src/routes/MvpSnapshotPage.tsx`
- `src/routes/AdminDashboardPage.tsx`
- `src/routes/QAPage.tsx`
- `src/routes/ProfilePage.tsx`
- `src/app/App.tsx`
- `src/types/kaset.ts`
- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/FARMER_ACCESSIBILITY_VISUAL_QA.md`
- `docs/ADMIN_DASHBOARD_FOUNDATION.md`
- `docs/SUPABASE_READINESS_AUDIT.md`
- `docs/AI_PROXY_ADAPTER_STRATEGY.md`
- `docs/GUEST_SYNC_EDGE_FUNCTION_CONTRACT.md`
- `docs/M30_INTERNAL_MVP_SNAPSHOT.md`
- `docs/M30_INTERNAL_QA_CHECKLIST.md`
- `docs/M30_NEXT_PHASE_DECISION.md`
- `docs/M30_ROUTE_CHECKLIST.md`
- `reports/milestones/M30_INTERNAL_MVP_QA_PROTOTYPE_SNAPSHOT_REPORT.md`

## Routes Added

- `/app/mvp-snapshot`

Accessible from:

- `/app/admin`
- `/app/qa`
- `/app/profile`

## Route Coverage

The route registry groups routes by:

- Core app
- Content/YouTube
- AI/Plant analysis
- Prices/Crop watch
- Community/Moderation
- Auth/Account/Sync
- Supabase/Staging
- Admin/QA

Manual smoke checks passed for:

- `/app`
- `/app/mvp-snapshot`
- `/app/admin`
- `/app/qa`
- `/app/youtube`
- `/app/articles`
- `/app/ai`
- `/app/analyze`
- `/app/prices`
- `/app/crop-watch`
- `/app/community`
- `/app/profile`
- `/app/supabase-readiness`
- `/app/auth/status`
- `/app/guest-sync-edge`

## Module Readiness Summary

- Core app: ready mock, medium risk.
- Content/YouTube: needs backend, high risk.
- AI/Plant analysis: needs real API, critical risk.
- Prices/Crop watch: needs real API, high risk.
- Community/Moderation: needs backend, high risk.
- Auth/Account/Sync: blocked, critical risk.
- Supabase/Staging: documentation only, high risk.
- Admin/QA: ready mock, medium risk.

## Screens Updated

- `/app/mvp-snapshot` shows overall prototype status, module readiness cards, route groups, storage readiness, production blockers, next recommended milestones, and next-phase options.
- `/app/admin` now includes an Internal MVP snapshot card and module readiness overview.
- `/app/qa` now links to the MVP snapshot, shows M30 route coverage summary, and includes a next-phase checklist.
- `/app/profile` now links to the Internal MVP snapshot.

## Verification Commands

```bash
npm run lint
npm run build
```

Both passed. The production build completed with the existing Vite large chunk warning.

## Manual Route Checks

The in-app Browser runtime was unavailable in this session, so route verification used local Vite on `http://127.0.0.1:5174` plus headless Chrome DOM checks.

Passed:

- `/app`
- `/app/mvp-snapshot`
- `/app/admin`
- `/app/qa`
- `/app/youtube`
- `/app/articles`
- `/app/ai`
- `/app/analyze`
- `/app/prices`
- `/app/crop-watch`
- `/app/community`
- `/app/profile`
- `/app/supabase-readiness`
- `/app/auth/status`
- `/app/guest-sync-edge`

The local Vite server was stopped after verification.

## Known Limitations

- M30 is a QA/snapshot milestone only.
- No real backend is connected.
- No Supabase project is connected.
- No SQL/RLS migration has been run.
- No real auth or OTP exists.
- No cloud sync exists.
- No real AI provider is called.
- No image upload exists.
- No crop price API/source import exists.
- No community moderation backend exists.
- No admin auth, RBAC, or audit log exists.
- Route checks are smoke checks, not full end-to-end tests.

## Production Blockers

- Supabase staging must be created, configured, and verified.
- SQL/RLS must be run and tested on staging.
- Auth session ownership must be proven before any user-owned write.
- Guest Sync Edge Function must be deployed and tested only after auth/RLS readiness.
- AI backend proxy must protect provider keys server-side and enforce safety/credits.
- Community moderation needs real reports, queues, rate limits, and audit logs.
- Crop prices need real source attribution, freshness policy, admin review, and correction workflow.
- Admin Dashboard needs real auth, RBAC, route guards, and append-only audit logs.
- Privacy/security/legal review, monitoring, backups, rollback, and incident processes are still required.

## Recommended Next Milestones

- M31 Controlled Supabase Auth staging adapter.
- M32 Guest Sync Edge Function staging implementation.
- M33 Admin RBAC and audit logs staging.
- M34 AI backend proxy and plant image upload staging.
- M35 Content and crop price import review workflow.

