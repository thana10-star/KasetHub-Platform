# M64 Guest Memory Sync Dry-run Payload Builder Report

## Summary

M64 adds the first safe local-only Guest Memory sync payload builder for KasetHub. The app can now preview future sync data groups, consent, idempotency, audit events, conflicts, owner scope, blockers, and privacy filters before any real Supabase upload exists.

No Guest Memory upload, cloud sync, Supabase app-table write, Edge Function deployment, service-role key in frontend, production auth enablement, or automatic SQL execution was added.

## Files Changed

Dry-run payload service:

- `src/services/backend/guest-sync-dry-run-payload.types.ts`
- `src/services/backend/guest-sync-dry-run-payload.ts`
- `src/services/backend/guest-sync-dry-run-payload.test.ts`

Routes and UI:

- `src/routes/GuestSyncDryRunPage.tsx`
- `src/routes/OwnershipRlsGatePage.tsx`
- `src/routes/AuthSyncPreviewPage.tsx`
- `src/routes/GuestSyncStatusPage.tsx`
- `src/routes/AccountPreviewPage.tsx`
- `src/routes/AdminDashboardPage.tsx`
- `src/routes/NextPhasePage.tsx`
- `src/routes/QAPage.tsx`
- `src/app/App.tsx`
- `src/types/kaset.ts`
- `src/services/qa/route-registry.ts`

Docs:

- `docs/M64_GUEST_MEMORY_SYNC_DRY_RUN_PAYLOAD.md`
- `docs/M64_SYNC_PAYLOAD_PRIVACY_FILTERS.md`
- `docs/M64_SYNC_CONFLICT_AND_IDEMPOTENCY_PLAN.md`
- `docs/M63_OWNERSHIP_RLS_SYNC_GATE_REVIEW.md`
- `docs/M63_GUEST_MEMORY_SYNC_CONSENT_AND_IDEMPOTENCY.md`
- `docs/M63_SYNC_AUDIT_LOGGING_PLAN.md`
- `docs/GUEST_TO_ACCOUNT_SYNC_PLAN.md`
- `docs/GUEST_SYNC_ENDPOINT_CONTRACT.md`
- `docs/GUEST_SYNC_PROOF_OF_CONCEPT.md`
- `docs/SUPABASE_SCHEMA_DRAFT.md`
- `docs/SUPABASE_TYPE_MAPPING.md`
- `docs/PROJECT_BLUEPRINT.md`
- `README.md`

Build artifacts updated by verification:

- `dist/index.html`
- `tsconfig.app.tsbuildinfo`

## Routes Added

- `/app/guest-sync-dry-run`

## Payload Groups

M64 previews:

- `savedItems`
- `farmRecords`
- `recentAiQuestions`
- `cropWatches`
- `calculatorSavedResults`
- `followedTopics`
- `likes`

Calculator saved results are included as safe summaries only.

## Privacy Filter Notes

The payload builder excludes or filters raw image fields, base64 image blobs, OTP codes, session tokens, service-role keys, provider keys, API keys, access/refresh tokens, and private env-like values.

## Consent / Idempotency Notes

The dry-run payload shows consent checklist, consent timestamp preview, sync request id preview, idempotency key preview, duplicate handling preview, audit preview, and conflict preview.

`uploadAllowed` remains `false` in every M64 state.

## Tests

Vitest coverage now includes:

- payload excludes raw image/base64 values
- payload excludes OTP/session/provider keys
- mock session does not allow upload
- missing consent blocks sync
- missing ownership blocks sync
- idempotency key is generated
- audit preview is generated
- calculator saved results are included as safe summary only
- M64 always returns `uploadAllowed: false`

Result:

- 5 test files passed.
- 83 tests passed.

## Verification Commands

```bash
npm run lint
npm run test
npm run build
```

Results:

- `npm run lint` passed.
- `npm run test` passed: 5 files, 83 tests.
- `npm run build` passed.
- Vite reported the existing large chunk warning after production build.

Manual route checks were run against `http://127.0.0.1:5173` using Chrome headless DOM rendering because the in-app Browser runtime reported no available browser session.

Checked routes:

- `/app/guest-sync-dry-run` passed.
- `/app/ownership-rls-gate` passed.
- `/app/auth/sync-preview` passed.
- `/app/guest-sync-status` passed.
- `/app/account-preview` passed.
- `/app/admin` passed.
- `/app/next-phase` passed.
- `/app/qa` passed.

## Known Limitations

- No real Guest Memory upload.
- No cloud sync.
- No Supabase app table writes.
- No Edge Function deployment or endpoint call.
- No service-role key in frontend.
- No real consent record is stored yet.
- No backend idempotency row or audit row exists yet.
- No owner-scoped RLS dry-run execution yet.
- No production auth enablement.

## Next Recommended Milestone

M65 should add a backend-owned Guest Memory sync validation contract draft: typed request/response payloads, owner id verification, consent evidence shape, idempotency key validation, audit log schema, dry-run conflict fixtures, and tests proving upload remains blocked until every ownership/RLS/safety check passes.
