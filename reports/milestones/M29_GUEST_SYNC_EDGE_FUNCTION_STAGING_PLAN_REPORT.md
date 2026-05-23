# M29 Guest Sync Edge Function Staging Plan Report

## Summary

M29 prepares the first real Guest Memory sync endpoint plan for KasetHub as a future Supabase Edge Function named `guest-memory-sync`. The milestone adds local/static contract types, a staging readiness audit, a Thai UI readiness route, and manual staging docs for idempotency, merge rules, consent, service-role boundaries, validation, audit logs, and rollback.

No Edge Function was deployed or called. No service-role key, Supabase write, cloud sync, real auth, OTP, endpoint URL, migration, upload, backend write, or default network call was added. Local Guest Memory remains unchanged and active.

## Files Changed

- `.env.example`
- `README.md`
- `src/config/env.ts`
- `src/vite-env.d.ts`
- `src/services/backend/guest-sync-edge.types.ts`
- `src/services/backend/guest-sync-staging-readiness.ts`
- `src/services/supabase/supabase-readiness-audit.ts`
- `src/routes/GuestSyncEdgePage.tsx`
- `src/routes/AuthSyncPreviewPage.tsx`
- `src/routes/GuestSyncStatusPage.tsx`
- `src/routes/SupabaseReadinessPage.tsx`
- `src/routes/SupabaseConnectionPage.tsx`
- `src/routes/AdminDashboardPage.tsx`
- `src/routes/AccountPreviewPage.tsx`
- `src/routes/ProfilePage.tsx`
- `src/routes/QAPage.tsx`
- `src/app/App.tsx`
- `src/types/kaset.ts`
- `docs/GUEST_SYNC_EDGE_FUNCTION_CONTRACT.md`
- `docs/GUEST_SYNC_STAGING_TEST_PLAN.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/GUEST_SYNC_ENDPOINT_CONTRACT.md`
- `docs/GUEST_SYNC_PROOF_OF_CONCEPT.md`
- `docs/GUEST_TO_ACCOUNT_SYNC_PLAN.md`
- `docs/PHONE_AUTH_BOUNDARY.md`
- `docs/SUPABASE_AUTH_PHONE_OTP_STAGING_PLAN.md`
- `docs/SUPABASE_READINESS_AUDIT.md`
- `docs/SUPABASE_MANUAL_VERIFICATION_PACK.md`
- `docs/SUPABASE_TYPE_MAPPING.md`
- `reports/milestones/M29_GUEST_SYNC_EDGE_FUNCTION_STAGING_PLAN_REPORT.md`

## Routes Added

- `/app/guest-sync-edge`

## Env Flags Added

- `VITE_ENABLE_GUEST_SYNC_EDGE=false`
- `VITE_GUEST_SYNC_EDGE_MODE=disabled`

Both are placeholders only. No endpoint URL or secret was added.

## Edge Function Contract Notes

- Future endpoint name: `guest-memory-sync`
- Future method/path: `POST /functions/v1/guest-memory-sync`
- Auth requirement: valid Supabase user session
- Service-role key may exist only inside the Edge Function/backend secret boundary
- Browser remains anon-key/client-only
- Request/response types include auth context, idempotency key, validation result, merge result, rollback plan, and warnings
- Duplicate merge rules are documented for saved items, likes, followed topics, My Farm, and optional AI history

## Staging Test Plan Notes

The staging plan covers:

- saved items only
- saved items plus My Farm
- AI history not consented
- duplicate saved item merge
- partial success
- retry with the same idempotency key
- missing auth rejection
- invalid payload rejection
- rollback/manual cleanup

## Screens Updated

- `/app/guest-sync-edge` shows the full local contract readiness screen.
- `/app/auth/sync-preview` now shows Edge Function readiness, idempotency key preview, ownership requirement, and a staging-only checklist.
- `/app/guest-sync-status` links to the Edge Function staging plan.
- `/app/supabase-readiness` and `/app/supabase-connection` show Guest Sync Edge readiness/status.
- `/app/admin` shows a Guest Sync Edge Function staging status card.
- `/app/account-preview`, `/app/profile`, and `/app/qa` link to the new route.

## Security Boundary Notes

- No service-role key in frontend.
- No real endpoint URL.
- No Edge Function deployment.
- No endpoint call.
- No Supabase write.
- No cloud sync.
- No real auth or OTP.
- Local Guest Memory is not deleted or marked synced.
- Future writes must validate `auth.uid()`, consent, idempotency, owner checks, payload version, rate limits, and audit logging server-side.

## Verification Commands

```bash
npm run lint
npm run build
```

Both passed. The production build completed with the existing Vite large chunk warning.

## Manual Route Checks

The Browser plugin was available as a skill, but the in-app browser did not expose an `iab` browser in this session. Route verification used local Vite on `http://127.0.0.1:5174` plus headless Chrome DOM checks.

Passed:

- `/app/guest-sync-edge`
- `/app/auth/sync-preview`
- `/app/guest-sync-status`
- `/app/supabase-readiness`
- `/app/admin`
- `/app/account-preview`
- `/app/profile`

The local Vite server was stopped after verification.

## Known Limitations

- No deployed Supabase Edge Function.
- No real endpoint URL.
- No endpoint call.
- No service-role key.
- No Supabase writes.
- No cloud sync.
- No real auth or OTP.
- No staging database rows.
- No real audit log table writes.
- No rate-limit implementation.
- No automatic rollback tooling.
- No cross-device Guest Memory sync.

## Next Recommended Milestone

M30 should perform a controlled Supabase Auth phone OTP staging test adapter, still behind explicit flags, before any Guest Sync Edge Function implementation. After real session ownership is proven, M31 can implement the `guest-memory-sync` Edge Function on staging with idempotency, audit logs, rate limits, rollback drills, and cloud sync still disabled by default.
