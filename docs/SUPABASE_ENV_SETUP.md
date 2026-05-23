# Supabase Environment Setup

M06 adds a Supabase client scaffold, but KasetHub still runs fully in guest/local mode without `.env.local`. Do not add real production keys until a later backend milestone is ready.

## Local `.env.local`

Create `.env.local` only on your machine:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-placeholder
VITE_ENABLE_SUPABASE=false
VITE_ENABLE_AUTH=false
VITE_ENABLE_CLOUD_SYNC=false
VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=false
VITE_GUEST_SYNC_MODE=local_fixture
VITE_ENABLE_GUEST_SYNC_BACKEND=false
VITE_ENABLE_LOCAL_GUEST_SYNC_HANDLER=false
VITE_PHONE_AUTH_MODE=local_mock
VITE_ENABLE_PHONE_AUTH=false
VITE_ENABLE_PHONE_AUTH_LOCAL_MOCK=true
VITE_SUPABASE_AUTH_REDIRECT_URL=
VITE_AUTH_STAGING_LABEL=local
VITE_LINE_AUTH_MODE=local_mock
VITE_ENABLE_LINE_AUTH=false
VITE_ENABLE_LINE_AUTH_LOCAL_MOCK=true
```

Keep all flags `false` by default. With these defaults the app makes no Supabase auth or data calls, and Guest Memory remains the active storage layer.

## Feature Flags

- `VITE_ENABLE_SUPABASE=false`: Supabase client helper returns `null`; app stays in guest/local mode.
- `VITE_ENABLE_AUTH=false`: no real signup, login, OTP, LINE Login, or Google Login can run.
- `VITE_ENABLE_CLOUD_SYNC=false`: Guest Memory is not uploaded to cloud.
- `VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=false`: Supabase connection dry-run does local checks only and makes no network call by default.
- `VITE_GUEST_SYNC_MODE=local_fixture`: Guest Sync uses no-network local fixture behavior.
- `VITE_ENABLE_GUEST_SYNC_BACKEND=false`: backend sync boundary is disabled.
- `VITE_ENABLE_LOCAL_GUEST_SYNC_HANDLER=false`: in-process guest sync handler is disabled unless explicitly testing `backend_test_ready`.
- `VITE_PHONE_AUTH_MODE=local_mock`: Phone Auth uses local mock behavior.
- `VITE_ENABLE_PHONE_AUTH=false`: no real phone auth or Supabase Auth call can run.
- `VITE_ENABLE_PHONE_AUTH_LOCAL_MOCK=true`: demo OTP local mock is available for prototype testing.
- `VITE_SUPABASE_AUTH_REDIRECT_URL=`: reserved for a future staging-safe Auth redirect URL.
- `VITE_AUTH_STAGING_LABEL=local`: labels the current auth readiness context.
- `VITE_LINE_AUTH_MODE=local_mock`: LINE Auth uses local mock behavior.
- `VITE_ENABLE_LINE_AUTH=false`: no real LINE SDK, redirect, OAuth token, or provider connection can run.
- `VITE_ENABLE_LINE_AUTH_LOCAL_MOCK=true`: LINE mock session is available for prototype testing.

These are independent gates. Cloud sync should require Supabase ENV, Supabase flag, auth flag, user consent, and a backend-owned sync endpoint in a later milestone.

Guest Sync flags are also independent. M16 does not call `fetch`; even `backend_test_ready` only uses the local in-process handler when both Guest Sync backend flags are true.

## Anon Key vs Service Role Key

Use only the Supabase anon public key in frontend code. The anon key is designed to be used with Row Level Security policies and browser clients.

Never put a service role key in:

- `.env.local` with a `VITE_` prefix
- frontend source code
- deployed static hosting ENV for the browser bundle
- screenshots, reports, docs, or issue comments

The service role key bypasses RLS and belongs only in secure backend/server environments.

## Safe Behavior in M06

- Missing `.env.local`: app runs normally in guest mode.
- Missing URL or anon key: account preview shows Supabase waiting for ENV.
- Feature flags off: no Supabase client is created for app behavior.
- Invalid or placeholder values: config check reports warnings and keeps the client disabled.
- Real auth and cloud sync are intentionally not implemented yet.

## M07 Auth UX Boundary

M07 adds mock auth screens for phone, LINE, and Google plus a sync preview. These screens do not call Supabase Auth and do not require ENV. They exist to validate farmer-friendly copy, consent, and endpoint payload shape before real auth is enabled.

## M16 Guest Sync Boundary

M16 adds `VITE_GUEST_SYNC_MODE`, `VITE_ENABLE_GUEST_SYNC_BACKEND`, and `VITE_ENABLE_LOCAL_GUEST_SYNC_HANDLER` for test-only Guest Memory sync previews. Defaults make no network calls and perform no cloud writes. Service-role keys still must never be placed in frontend ENV.

## M17 Phone Auth Boundary

M17 adds local phone auth flags for a demo OTP flow. The demo OTP is `123456`; it is not sent by SMS. Future Supabase phone OTP should stay behind feature flags and must not use service-role keys in frontend code.

## M19 LINE Auth Boundary

M19 adds local LINE auth flags for a demo LINE session. No LINE SDK, redirect, OAuth token, channel secret, Supabase write, or network request is used. Future real LINE Login must keep LINE secrets server-side and should link to phone accounts only after user confirmation.

## Future Setup

When a later milestone adds real auth and sync, use separate development and production Supabase projects, create migrations from `docs/SUPABASE_SCHEMA_DRAFT.md`, enable RLS before real users, and route guest-memory sync through a backend endpoint instead of writing complex merged state directly from the browser.

## M18 SQL Drafts

M18 adds draft migration files under `supabase/`:

- `supabase/migrations/0001_kasethub_core_schema.sql`
- `supabase/policies/0001_kasethub_rls_policies.sql`

Do not run these against production. Review them in a staging project, verify RLS with anon/authenticated users, and keep service-role keys out of all frontend ENV values.

## M25 Staging Readiness

M25 adds `.env.example`, `/app/supabase-readiness`, `docs/SUPABASE_STAGING_SETUP_GUIDE.md`, and `docs/SUPABASE_READINESS_AUDIT.md`.

Use `.env.example` as the source of placeholder names only. The real `.env.local` must stay local to the developer or staging deployment environment and should start with:

```bash
VITE_ENABLE_SUPABASE=true
VITE_ENABLE_AUTH=false
VITE_ENABLE_CLOUD_SYNC=false
```

Only the Supabase Project URL and anon public key are allowed in frontend Vite ENV. Never add a service-role key to any `VITE_` variable. `/app/supabase-readiness` is a local audit page only; it does not call Supabase, fetch schema, run migrations, enable auth, or write data.

## M26 Connection Dry Run

M26 adds `/app/supabase-connection` and `VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=false`.

With the default flag, the page checks only local config and never calls Supabase. If a future staging test sets both `VITE_ENABLE_SUPABASE=true` and `VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=true`, the only allowed probe is a public/read-only check. Missing schema should be reported as `schema_not_applied_yet`, not as an app failure. Auth, cloud sync, writes, uploads, and service-role keys remain forbidden.

## M27 SQL Staging Checklist

M27 adds `/app/supabase-sql-checklist`, `docs/SUPABASE_SQL_STAGING_EXECUTION_GUIDE.md`, and `docs/SUPABASE_MANUAL_VERIFICATION_PACK.md`.

These artifacts help a human operator run the draft SQL later, but they do not need extra environment variables and do not connect to Supabase. The app must still work with no `.env.local`.

Before any staging SQL execution:

- Confirm `.env.local` contains only Project URL and anon key.
- Confirm no service-role key appears in any `VITE_` variable.
- Keep `VITE_ENABLE_AUTH=false`.
- Keep `VITE_ENABLE_CLOUD_SYNC=false`.
- Keep `VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=false` unless a public/read-only probe is explicitly being tested.
- Run schema SQL first and RLS SQL second, manually, in the staging project only.

## M28 Phone OTP Staging Plan

M28 adds `/app/auth/phone-staging` and phone OTP staging docs. These do not send SMS and do not enable real auth.

Keep defaults:

```bash
VITE_ENABLE_AUTH=false
VITE_ENABLE_PHONE_AUTH=false
VITE_PHONE_AUTH_MODE=local_mock
VITE_SUPABASE_AUTH_REDIRECT_URL=
VITE_AUTH_STAGING_LABEL=local
```

Only a later controlled staging test should set a redirect URL and turn on phone auth flags. Service-role keys and SMS provider secrets must never be placed in frontend ENV.

## M39 Local Env Safety

M39 adds `/app/env-safety` and `docs/M39_SUPABASE_STAGING_ENV_LOCAL_SETUP.md`.

Use it when preparing `.env.local` on `staging/supabase`:

- copy `.env.example` locally
- set only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- set `VITE_ENABLE_SUPABASE=true` only for local staging readiness
- keep `VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=false`
- keep `VITE_ENABLE_AUTH=false`
- keep `VITE_ENABLE_CLOUD_SYNC=false`
- keep Guest Sync backend/Edge flags disabled

The env safety page masks values and performs local checks only. It does not call Supabase, verify schema, authenticate a user, write data, or upload files.
