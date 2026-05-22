# M16 Guest Memory Sync Proof Of Concept

M16 proves the future account-backup flow without real auth, Supabase writes, phone OTP, service-role keys, or network calls.

## Why This Exists

KasetHub should not force login early. Farmers can save useful items locally first, then choose to create an account later to back up data. M16 tests the shape of that future flow:

1. Read local Guest Memory.
2. Build a consent-aware sync payload.
3. Send it to a backend-shaped mock handler.
4. Preview merge, skipped, and conflict results.
5. Preserve local data on every failure.

## Routes

- `/app/auth/sync-preview` - user-facing dry-run sync preview
- `/app/account-preview` - account backup readiness summary
- `/app/guest-sync-status` - developer/prototype status and test panel

## Feature Flags

Defaults are safe and require no `.env.local`.

```bash
VITE_GUEST_SYNC_MODE=local_fixture
VITE_ENABLE_GUEST_SYNC_BACKEND=false
VITE_ENABLE_LOCAL_GUEST_SYNC_HANDLER=false
```

Modes:

- `local_fixture` uses a local fixture path and never fetches.
- `backend_test_disabled` returns disabled responses.
- `backend_test_ready` calls the local in-process handler only when both backend flags are true.
- `production_disabled` returns disabled responses.

M16 has no real fetch path.

## Mock Handler

Files:

- `src/server/guest-sync/mock-guest-sync-handler.ts`
- `src/server/guest-sync/mock-guest-sync.types.ts`

The handler accepts:

- M07 guest sync payload
- auth provider candidate: `phone`, `line`, or `google`
- `dryRun`
- consent fields
- local record counts
- fixture scenario

It returns:

- `syncRequestId`
- `status`
- `createdProfilePreview`
- `mergeSummary`
- `skippedRecords`
- `conflictSummary`
- `warnings`
- `retryable`
- `createdAt`

No writes happen.

## Fixture Scenarios

- `success`
- `partial_success`
- `duplicate_merge`
- `missing_consent`
- `failed_retryable`

## Data Safety Rules

- Local Guest Memory is the source of truth in M16.
- Local data is never deleted after sync failure.
- A future cloud sync should mark local data as synced only after confirmed backend success.
- My Farm sync requires user consent.
- AI question history sync is optional.
- Duplicate saved items merge by `itemType + itemId`.
- Service-role keys must never be exposed in frontend code.

## M17 Phone Auth Ownership Gate

M17 adds a local phone mock session so the sync proof can model authenticated ownership.

- Demo OTP is `123456`.
- The mock session stores a masked phone number and mock user ID in localStorage.
- `/app/auth/sync-preview` disables dry-run sync until a phone mock session exists.
- This is not a real Supabase Auth session.
- Future real sync should require a real authenticated user before upload.

## Future Real Backend

A real implementation should move sync handling to a backend API route or Supabase Edge Function. The backend should:

- verify authenticated user ownership
- validate consent server-side
- use service-role only server-side
- merge duplicates idempotently
- return the same response shape as the M16 mock handler
- preserve local data on client failure
- retry safely without creating duplicates
