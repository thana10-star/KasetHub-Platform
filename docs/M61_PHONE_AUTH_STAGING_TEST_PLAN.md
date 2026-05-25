# M61 Phone Auth Staging Test Plan

M61 prepares the first real Supabase Phone Auth staging test without enabling real auth in production.

## Current Safe State

- `VITE_PHONE_AUTH_MODE=local_mock`
- `VITE_ENABLE_PHONE_AUTH=false`
- `VITE_ENABLE_AUTH=false`
- `VITE_ENABLE_CLOUD_SYNC=false`
- no real OTP is sent by the app
- no app data is written to Supabase
- no service-role key is used in frontend

## Required Before Real Staging OTP

- Confirm the Supabase project is `kasethub-staging`.
- Confirm M42 SQL/RLS success remains valid.
- Confirm M44 public read/RLS review remains valid.
- Add only staging-safe Supabase URL and anon key to local `.env.local`.
- Configure Supabase Auth Phone provider in the dashboard.
- Configure local and staging redirect URLs.
- Configure SMS provider, country policy, spending limit, resend cooldown, and failed-attempt limits.
- Prepare a private test phone number allowlist outside the repo.
- Keep `VITE_ENABLE_CLOUD_SYNC=false`.

## First Test Flow

1. Open `/app/auth/phone-staging-test`.
2. Confirm no service-role key is detected.
3. Confirm redirect URL and SMS setup are ready.
4. Temporarily enable staging-only auth flags locally.
5. Send OTP only to approved test numbers.
6. Confirm Supabase session exists and `auth.uid()` is available.
7. Do not run Guest Memory sync yet.
8. Roll back flags and provider settings after the test.

## Boundaries

M61 does not add a real auth adapter, send SMS, write Supabase data, enable cloud sync, deploy Edge Functions, or change production behavior.

## M62 Follow-up

M62 adds a controlled staging adapter for the next step. Real OTP remains off by default and only runs when local staging flags are explicitly set to `VITE_PHONE_AUTH_MODE=supabase_staging_ready`, `VITE_ENABLE_PHONE_AUTH=true`, `VITE_ENABLE_AUTH=true`, valid Supabase anon config is present, and `VITE_ENABLE_CLOUD_SYNC=false`.

M62 still does not sync Guest Memory or write app tables.
