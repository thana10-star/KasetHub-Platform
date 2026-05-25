# M17 Phone OTP Auth Boundary

M17 creates a phone-first authentication boundary for KasetHub while staying mock-only by default. It proves that future Guest Memory sync should require an authenticated owner before any real cloud upload.

## Product Principle

- Guest mode remains the default.
- Farmers can use the app without signup.
- Phone login is the primary future account path.
- Email is not required at first.
- Sync should be offered when users want backup or cross-device access.

## Current M17 Behavior

M17 does not send SMS and does not call Supabase Auth.

The local mock supports:

- `requestOtp(phoneNumber)`
- `verifyOtp(phoneNumber, otpCode)`
- `getMockSession()`
- `clearMockSession()`

Demo OTP:

```text
123456
```

The mock session stores:

- `mockUserId`
- `phoneNumberMasked`
- `provider: phone`
- `createdAt`
- `expiresAt`

Session storage is localStorage only and versioned.

## Feature Flags

Defaults:

```bash
VITE_PHONE_AUTH_MODE=local_mock
VITE_ENABLE_PHONE_AUTH=false
VITE_ENABLE_PHONE_AUTH_LOCAL_MOCK=true
```

Modes:

- `local_mock`: local-only mock OTP, no network.
- `supabase_disabled`: disabled response.
- `supabase_ready_mock`: future Supabase-ready test mode, still no network in M17.
- `production_disabled`: disabled response.

## Thai Phone Validation

M17 accepts Thai mobile phone numbers in these shapes:

- `0812345678`
- `+66812345678`
- `66812345678`

The UI uses simple Thai copy and avoids technical terms.

## Why Phone First

Phone OTP is familiar for many Thai users and does not require email. It fits the farmer-friendly strategy:

- “สมัครด้วยเบอร์โทรเมื่ออยากสำรองข้อมูล”
- “ใช้งานต่อได้ ไม่ต้องสมัครตอนนี้”
- “ข้อมูลที่บันทึกไว้ตอนนี้อยู่ในเครื่องนี้เท่านั้น”

## SMS Cost Consideration

Real SMS OTP has direct cost and abuse risk. Before production:

- rate-limit OTP requests
- add cooldown and resend limits
- verify phone ownership server-side
- avoid sending SMS on every screen visit
- consider LINE Login as a secondary lower-friction path
- log OTP attempts without exposing sensitive data

## Future Supabase Phone OTP

Future implementation should call Supabase Auth only from a clearly gated auth service. The browser may use the Supabase anon key, but service-role keys must never be exposed.

Future real flow:

1. User enters phone.
2. Supabase sends OTP.
3. User verifies OTP.
4. App receives authenticated session.
5. Guest Memory sync can run only after consent and authenticated ownership.

## Sync Ownership Rule

M17 updates `/app/auth/sync-preview` so dry-run sync requires a phone mock session. This proves the production rule:

- no account owner, no cloud sync
- local Guest Memory remains untouched
- My Farm sync requires consent
- AI question history sync is optional
- failed sync must preserve local data

## Security Notes

- No service-role key in frontend.
- No real OTP in M17.
- No network calls by default.
- No Supabase writes.
- Mock sessions are for prototype testing only.

## M18 Schema Link

Future real phone auth should map into:

- `profiles` for user-owned profile data
- `auth_link_events` for account/provider audit events
- `guest_sync_events` for backup/sync audit history

The M17 local mock session is not a real Supabase Auth session. M18 SQL is still a draft and should only be tested in staging after phone auth and sync ownership rules are reviewed.

## M19 LINE Linking

Phone remains the primary recovery path. LINE can become a linked provider after the user confirms ownership.

Rules:

- Phone-only account can later link LINE.
- Phone + LINE is a linking candidate, not a real linked account in M19.
- LINE-only preview should recommend adding phone before backup.
- Provider conflicts require explicit user confirmation.
- No LINE SDK, redirect, token, Supabase write, or network call exists in M19.
## M25 Supabase Staging Readiness Note

Phone Auth remains local/mock during M25. The staging readiness checklist requires:

- `VITE_ENABLE_PHONE_AUTH=false`
- `VITE_PHONE_AUTH_MODE=local_mock`
- no real SMS or Supabase Auth call
- no phone auth secrets in frontend ENV
- no cloud sync based on phone ownership until staging RLS passes

Real phone OTP should be enabled only in a later staging auth milestone with rate limits, abuse controls, recovery rules, and server-side audit logging.

## M28 Phone OTP Staging Plan

M28 adds planning only:

- `/app/auth/phone-staging`
- `src/services/auth/phone-auth-staging-readiness.ts`
- `docs/SUPABASE_AUTH_PHONE_OTP_STAGING_PLAN.md`
- `docs/SUPABASE_AUTH_REDIRECT_URL_CHECKLIST.md`
- `docs/SMS_PROVIDER_COST_AND_RATE_LIMIT_NOTES.md`

The app still does not send OTP SMS and does not call Supabase Auth.

Required defaults remain:

```bash
VITE_ENABLE_AUTH=false
VITE_ENABLE_PHONE_AUTH=false
VITE_PHONE_AUTH_MODE=local_mock
VITE_SUPABASE_AUTH_REDIRECT_URL=
VITE_AUTH_STAGING_LABEL=local
```

Before a real staging OTP test:

- configure Supabase Auth phone provider in a staging project only
- add local, Cloudflare preview, staging, and production redirect URLs deliberately
- configure SMS provider cost limits and OTP rate limits
- use private test phone numbers only
- confirm Supabase session ownership with `auth.uid()`
- keep `VITE_ENABLE_CLOUD_SYNC=false` until RLS ownership tests pass
- keep service-role keys out of frontend forever

## M29 Guest Sync Edge Dependency

The future `guest-memory-sync` Edge Function must not run from a phone mock session. It requires a real Supabase Auth session from staging first.

Phone auth staging must prove:

- OTP sign-in creates a valid session.
- `auth.uid()` maps to the account owner.
- Guest Sync consent is explicit.
- Cloud sync remains off until the Edge Function idempotency, merge, audit, and rollback tests pass.
- service-role remains server-side only.

## M61 First Staging Test Review

M61 adds `/app/auth/phone-staging-test` and `src/services/auth/phone-auth-staging-review.ts`.

The review checks:

- M42 staging project and SQL/RLS success.
- M44 public read/RLS review success.
- auth and phone flags are still off by default.
- redirect URL readiness.
- SMS provider readiness.
- private test phone number plan.
- OTP cost and rate-limit warnings.
- ownership requirements before Guest Memory sync.
- rollback readiness.
- production blockers.

M61 still does not enable real phone auth, send SMS, write Supabase data, deploy Edge Functions, or enable cloud sync.
## M62 Controlled Staging Boundary

M62 adds `src/services/auth/phone-auth-staging-adapter.ts` and `src/services/auth/auth-ownership-status.ts`.

Allowed only in local staging:

```env
VITE_PHONE_AUTH_MODE=supabase_staging_ready
VITE_ENABLE_SUPABASE=true
VITE_ENABLE_AUTH=true
VITE_ENABLE_PHONE_AUTH=true
VITE_ENABLE_CLOUD_SYNC=false
```

The adapter may request and verify Supabase Phone OTP only when all staging gates pass. It blocks if cloud sync is enabled, Supabase config is invalid, a service-role-like key is detected, or production mode is requested.

M62 stores only a local masked session preview after successful verification. It does not write profiles, app tables, Guest Memory, or cloud sync records.

## M63 Ownership/RLS Gate

M63 treats a real Supabase Phone Auth staging session as evidence only. It is not enough to upload Guest Memory.

Before sync, KasetHub must also verify `auth.uid()` owner mapping, collect user consent, require idempotency, prepare audit logging, and prove owner-scoped RLS behavior. The new route is `/app/ownership-rls-gate`.

Phone mock sessions still never count as ownership.
