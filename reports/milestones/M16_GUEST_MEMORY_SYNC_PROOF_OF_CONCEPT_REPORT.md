# M16 Guest Memory Sync Proof of Concept Report

## Summary

M16 creates a test-only Guest Memory sync proof of concept for future phone/LINE/Google account backup. The app can now preview the flow from local Guest Memory to sync payload, backend-shaped handler, merge result, skipped records, conflict summary, and failure handling while preserving local data. No real Supabase writes, auth, OTP, service-role keys, cloud sync, or network calls are added.

## Files Changed

- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/GUEST_TO_ACCOUNT_SYNC_PLAN.md`
- `docs/GUEST_SYNC_ENDPOINT_CONTRACT.md`
- `docs/FARMER_FRIENDLY_AUTH_STRATEGY.md`
- `docs/SUPABASE_ENV_SETUP.md`
- `docs/GUEST_SYNC_PROOF_OF_CONCEPT.md`
- `src/vite-env.d.ts`
- `src/config/env.ts`
- `src/app/App.tsx`
- `src/types/kaset.ts`
- `src/server/guest-sync/mock-guest-sync.types.ts`
- `src/server/guest-sync/mock-guest-sync-handler.ts`
- `src/services/backend/guest-sync-adapter.types.ts`
- `src/services/backend/guest-sync-adapter.ts`
- `src/routes/AuthSyncPreviewPage.tsx`
- `src/routes/AccountPreviewPage.tsx`
- `src/routes/GuestSyncStatusPage.tsx`
- `src/routes/ProfilePage.tsx`
- `reports/milestones/M16_GUEST_MEMORY_SYNC_PROOF_OF_CONCEPT_REPORT.md`

## Routes Added

- `/app/guest-sync-status`

## Env Flags Added

```bash
VITE_GUEST_SYNC_MODE=local_fixture
VITE_ENABLE_GUEST_SYNC_BACKEND=false
VITE_ENABLE_LOCAL_GUEST_SYNC_HANDLER=false
```

Default behavior remains safe:

- no `.env.local` required
- no network calls
- no Supabase writes
- no service-role key in frontend
- Guest Memory remains local source of truth

## Mock Handler Behavior

`mock-guest-sync-handler.ts` accepts:

- M07 guest sync payload
- auth provider candidate: `phone`, `line`, or `google`
- `dryRun`
- consent fields
- local record counts
- fixture scenario

It returns:

- `syncRequestId`
- `status`: `success`, `partial_success`, `rejected`, or `failed`
- `createdProfilePreview`
- `mergeSummary`
- `skippedRecords`
- `conflictSummary`
- `warnings`
- `retryable`
- `createdAt`

Fixture scenarios:

- `success`
- `partial_success`
- `duplicate_merge`
- `missing_consent`
- `failed_retryable`

The handler does not write data or mutate Guest Memory.

## Sync Adapter Behavior

`guest-sync-adapter.ts` supports:

- `local_fixture`
- `backend_test_disabled`
- `backend_test_ready`
- `production_disabled`

Behavior:

- `local_fixture` calls the local no-write handler.
- `backend_test_ready` calls the local handler only when `VITE_ENABLE_GUEST_SYNC_BACKEND=true` and `VITE_ENABLE_LOCAL_GUEST_SYNC_HANDLER=true`.
- disabled/production modes return safe disabled responses.
- no mode calls `fetch` in M16.

## Screens Updated

- `/app/auth/sync-preview`
  - shows sync mode status and backend readiness
  - keeps consent checklist
  - adds fixture scenario selector
  - adds “ทดสอบซิงก์จำลอง” dry-run button
  - shows response preview card with profile, merge, skipped, conflict, and safety notes
- `/app/account-preview`
  - shows Guest Sync readiness
  - links to sync preview and status page
- `/app/guest-sync-status`
  - shows mode, backend flags, local handler status, service-role safety, supported providers, supported record types, and a small test panel
- `/app/profile`
  - adds access to “สถานะ Guest Sync”

## Data Safety Notes

- Local Guest Memory is never deleted after sync failure.
- M16 does not mark local data as synced.
- Future production sync should only mark data as synced after backend-confirmed success.
- My Farm sync requires explicit consent.
- AI question history sync is optional.
- Duplicate saved items merge by `itemType + itemId`.
- Service-role keys must stay backend/Edge Function only.

## Verification Commands

```bash
npm run lint
npm run build
```

Both commands passed.

## Known Limitations

- No real Supabase writes
- No real auth
- No real phone OTP
- No LINE Login
- No Google Login
- No real network calls
- No cloud sync
- No service-role key
- Sync handler is in-process and bundled for prototype testing
- No real server-side idempotency or ownership validation yet

## Next Recommended Milestone

M17 should create a phone OTP mock-to-real auth boundary behind feature flags. It should keep OTP disabled by default, prove auth session ownership before sync, and preserve the M16 response contract before adding LINE or Google account linking.
