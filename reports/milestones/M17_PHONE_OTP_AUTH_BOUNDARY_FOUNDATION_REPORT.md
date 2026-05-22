# M17 Phone OTP Auth Boundary Foundation Report

## Summary

M17 creates a phone-first auth boundary for KasetHub that can later connect to Supabase Auth phone OTP while staying local/mock-only by default. The app can now request a demo OTP, verify code `123456`, create a local mock phone session, show auth status, and gate Guest Memory sync dry-runs behind mock ownership. No real SMS, Supabase Auth call, LINE Login, Google Login, cloud sync, Supabase write, service-role key, or network call is added.

## Files Changed

- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/FARMER_FRIENDLY_AUTH_STRATEGY.md`
- `docs/GUEST_TO_ACCOUNT_SYNC_PLAN.md`
- `docs/GUEST_SYNC_PROOF_OF_CONCEPT.md`
- `docs/SUPABASE_ENV_SETUP.md`
- `docs/PHONE_AUTH_BOUNDARY.md`
- `src/vite-env.d.ts`
- `src/config/env.ts`
- `src/app/App.tsx`
- `src/types/kaset.ts`
- `src/services/auth/phone-auth.types.ts`
- `src/services/auth/phone-auth-local-mock.ts`
- `src/services/auth/phone-auth-adapter.ts`
- `src/services/account/account-status.types.ts`
- `src/services/account/account-status-service.ts`
- `src/routes/AuthPage.tsx`
- `src/routes/AuthPhonePage.tsx`
- `src/routes/AuthStatusPage.tsx`
- `src/routes/AuthSyncPreviewPage.tsx`
- `src/routes/AccountPreviewPage.tsx`
- `src/routes/ProfilePage.tsx`
- `reports/milestones/M17_PHONE_OTP_AUTH_BOUNDARY_FOUNDATION_REPORT.md`

## Routes Added

- `/app/auth/status`

## Env Flags Added

```bash
VITE_PHONE_AUTH_MODE=local_mock
VITE_ENABLE_PHONE_AUTH=false
VITE_ENABLE_PHONE_AUTH_LOCAL_MOCK=true
```

Default behavior:

- local mock OTP is available
- no real SMS is sent
- no Supabase Auth call happens
- no network calls happen
- no service-role key is exposed

## Phone Auth Behavior

Phone auth modes:

- `local_mock`
- `supabase_disabled`
- `supabase_ready_mock`
- `production_disabled`

The local mock validates Thai mobile numbers and accepts:

- `0812345678`
- `+66812345678`
- `66812345678`

Demo OTP code:

```text
123456
```

## Mock Session Behavior

The local mock stores a versioned localStorage session with:

- `mockUserId`
- `phoneNumberMasked`
- `provider: phone`
- `createdAt`
- `expiresAt`

The session is demo-only and does not represent a real Supabase Auth user.

## Screens Updated

- `/app/auth/phone`
  - phone input
  - OTP mock step
  - demo OTP notice
  - resend mock button
  - verify button
  - success state
  - session preview
  - link to sync preview
- `/app/auth/status`
  - current auth mode
  - phone auth flag status
  - mock session status
  - provider: guest/phone mock
  - expiry
  - clear mock session button
  - no real OTP/network notice
- `/app/auth/sync-preview`
  - shows ownership warning when no phone mock session exists
  - keeps payload preview visible
  - disables dry-run sync until a phone mock session exists
- `/app/account-preview`
  - shows phone mock session readiness
  - explains future sync needs account ownership
- `/app/profile`
  - shows account status card
  - links to auth status
- `/app/auth`
  - shows Phone Auth mock status and auth status link

## Verification Commands

```bash
npm run lint
npm run build
```

Both commands passed.

## Known Limitations

- No real OTP SMS
- No real Supabase Auth
- No real auth session
- No LINE Login
- No Google Login
- No real cloud sync
- No Supabase writes
- No network calls by default
- No service-role key in frontend
- Mock session is local to the current browser/device
- Sync preview ownership gate uses a mock session only

## Next Recommended Milestone

M18 should add a LINE Login test path and account-linking rules behind feature flags. It should keep LINE SDK and redirects disabled by default, define provider linking behavior with phone accounts, and preserve the Guest Memory ownership/sync rules established in M16-M17.
