# M07 Farmer-Friendly Auth UX + Guest Sync Contract Report

## Summary

M07 adds a Thai-first, guest-friendly account creation prototype and defines the backend-owned Guest Memory sync endpoint contract. The app now has mock phone, LINE, Google, and sync-preview routes while keeping Guest Memory as the active storage layer. No real auth, OTP, SDK redirect, network call, Supabase write, or cloud sync is enabled.

## Files Changed

- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/FARMER_FRIENDLY_AUTH_STRATEGY.md`
- `docs/GUEST_TO_ACCOUNT_SYNC_PLAN.md`
- `docs/SUPABASE_ENV_SETUP.md`
- `docs/GUEST_SYNC_ENDPOINT_CONTRACT.md`
- `src/app/App.tsx`
- `src/types/kaset.ts`
- `src/components/ui/Button.tsx`
- `src/routes/AuthPage.tsx`
- `src/routes/AuthPhonePage.tsx`
- `src/routes/AuthProviderMockPage.tsx`
- `src/routes/AuthSyncPreviewPage.tsx`
- `src/routes/AccountPreviewPage.tsx`
- `src/routes/ProfilePage.tsx`
- `src/services/backend/guest-sync-endpoint.types.ts`
- `src/services/backend/guest-sync-payload-builder.ts`
- `reports/milestones/M07_FARMER_FRIENDLY_AUTH_UX_SYNC_CONTRACT_REPORT.md`
- `reports/milestones/m07-auth.png`
- `reports/milestones/m07-auth-phone.png`
- `reports/milestones/m07-auth-line.png`
- `reports/milestones/m07-auth-google.png`
- `reports/milestones/m07-auth-sync-preview.png`
- `reports/milestones/m07-account-preview.png`
- `reports/milestones/m07-profile.png`
- `reports/milestones/m07-memory.png`

## Routes Added

- `/app/auth`
- `/app/auth/phone`
- `/app/auth/line`
- `/app/auth/google`
- `/app/auth/sync-preview`

## Auth UX Notes

- The auth entry screen keeps “ใช้งานต่อได้เลย ไม่ต้องสมัคร” as the primary principle.
- Phone OTP is presented as the recommended future path for general users.
- LINE and Google are secondary future options with clear mock-only copy.
- Email is not required.
- Phone, LINE, and Google screens explicitly state that there is no real OTP, SDK, redirect, Supabase Auth, or network request in M07.
- Profile now links to “สมัคร/สำรองข้อมูล”.
- Account preview links to `/app/auth` and `/app/auth/sync-preview`.

## Sync Endpoint Contract Notes

`docs/GUEST_SYNC_ENDPOINT_CONTRACT.md` defines the future backend boundary:

- `POST /api/guest-memory/sync`
- Supabase Edge Function option: `guest-memory-sync`
- Request payload shape
- Response payload shape
- Validation rules
- Duplicate merge rules
- Conflict handling
- Consent fields
- Rate limit notes
- Security and RLS notes
- Service role usage only on backend/edge function

No endpoint is implemented in M07.

## Consent Model Notes

The dry-run builder accepts:

- `GuestMemoryState`
- consent options
- auth provider candidate: `phone`, `line`, or `google`

Consent rules:

- Saved items, likes, and followed topics require `consent.savedItems`.
- My Farm records require `consent.farmRecords`.
- Recent AI questions require optional `consent.recentAIQuestions`.
- Missing required consent produces blocked reasons.
- AI history consent false produces a warning and excludes AI history from the preview payload.

## Verification Commands

```bash
npm run lint
npm run build
```

Both commands passed.

Manual route checks returned HTTP 200:

- `/app/auth`
- `/app/auth/phone`
- `/app/auth/line`
- `/app/auth/google`
- `/app/auth/sync-preview`
- `/app/account-preview`
- `/app/profile`
- `/app/memory`

Mobile screenshots were captured for the same routes.

## Known Limitations

- No real Supabase Auth
- No real phone OTP or SMS
- No LINE Login
- No Google Login
- No SDK redirects
- No backend endpoint
- No cloud writes
- No Guest Memory upload
- No service-role key in frontend
- Sync preview is a dry-run payload builder only

## Next Recommended Milestone

M08 should implement a test-only backend sync proof of concept behind feature flags. It should create a real server/edge endpoint contract test, require authenticated ownership server-side, preserve Guest Memory locally on failure, and prove one safe phone-account sync path before adding LINE or Google.
