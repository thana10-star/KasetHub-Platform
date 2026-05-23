# Supabase Staging Connection Dry Run

M26 adds a safe connection boundary for a future Supabase staging project. It proves KasetHub can detect client-safe staging configuration while still running perfectly with no `.env.local`.

## Current Boundary

- No real keys are committed.
- No service-role key is allowed in frontend.
- No SQL migrations are run.
- No real auth, phone OTP, LINE Login, or cloud sync is enabled.
- No Supabase writes.
- No file upload.
- No backend writes.
- No network call by default.

## Route

- `/app/supabase-connection`

Linked from:

- `/app/supabase-readiness`
- `/app/admin`
- `/app/account-preview`
- `/app/qa`

## Feature Flag

```bash
VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=false
```

Default is `false`. With the default, the dry-run service performs local checks only:

- Supabase feature flag state
- URL presence
- anon key presence
- valid URL shape
- placeholder key detection
- service-role-like key detection
- auth/cloud sync disabled status

## Safe Local Staging ENV

Create `.env.local` only on your machine or staging deployment environment:

```bash
VITE_SUPABASE_URL=https://your-staging-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-staging-anon-key
VITE_ENABLE_SUPABASE=true
VITE_ENABLE_AUTH=false
VITE_ENABLE_CLOUD_SYNC=false
VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=false
```

Use only Project URL and anon public key. Never use the service-role key in frontend code, Vite env, Cloudflare public variables, screenshots, reports, docs, or issue comments.

## Dry Run vs Real Backend Use

The dry run is not a backend integration. It does not:

- authenticate users
- sync Guest Memory
- read private tables
- insert, update, delete, or upsert data
- upload files
- import crop prices
- run admin actions
- call Edge Functions
- use service-role credentials

It only reports whether the browser could safely create a Supabase anon client if staging config is present.

## Optional Public-Read Probe

If a later staging test enables:

```bash
VITE_ENABLE_SUPABASE=true
VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=true
```

and the URL/anon key are valid, the optional probe may read only a future public/read-only table:

- `public_readiness_checks`

The probe must not query private/user tables and must not write data.

## If Schema Is Not Applied Yet

If the public-read table does not exist, the app should show:

- `schema_not_applied_yet`

This is not an app failure. It means SQL/RLS have not been applied to staging yet. Return to:

- `docs/SUPABASE_STAGING_SETUP_GUIDE.md`
- `docs/SUPABASE_SQL_STAGING_EXECUTION_GUIDE.md`
- `docs/SUPABASE_MANUAL_VERIFICATION_PACK.md`
- `docs/SUPABASE_MIGRATION_CHECKLIST.md`

Then run the draft migration and RLS manually in staging only.

## M27 SQL Checklist Route

M27 adds `/app/supabase-sql-checklist` for a static staging SQL/RLS execution checklist. Use it after this dry-run page and before any manual SQL execution.

The route shows:

- SQL execution order: schema first, RLS second
- expected tables, policies, indexes, and triggers
- manual verification tasks
- production blockers
- a clear "ยังไม่ได้รัน SQL จริง" notice

It performs no network call and does not inspect the real Supabase project.

## Cloudflare Pages Plan

For a later staging deployment:

- Add only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- Keep auth and cloud sync disabled first.
- Keep dry-run network check disabled unless actively testing.
- Never add service-role keys to Pages variables that are exposed to the browser.
- Separate staging and production variables.
- Verify `/app/supabase-connection` and `/app/supabase-readiness` after deploy.

## Production Gate

Production remains blocked until:

- staging SQL/RLS tests pass
- auth providers are tested with real sessions
- cloud sync is backend-owned and consent-aware
- service-role boundaries are implemented server-side
- admin roles and audit logs are enforced
- backup and rollback are rehearsed
