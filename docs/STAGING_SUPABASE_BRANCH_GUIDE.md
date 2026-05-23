# Staging Supabase Branch Guide

This guide documents the safe setup for the `staging/supabase` branch. M38 creates the branch workflow only. It does not connect to Supabase, add keys, create `.env.local`, run SQL, enable auth, enable cloud sync, or write backend data.

## Purpose

Use `staging/supabase` for controlled real Supabase staging experiments:

- staging project URL and anon-key wiring later
- SQL/RLS execution verification later
- phone auth staging later
- Guest Sync Edge Function staging later
- branch-specific Cloudflare preview testing later

`main` remains the stable local/mock prototype and should keep working with no `.env.local`.

## Branch Commands

Create or switch to the branch:

```bash
git checkout -b staging/supabase
```

If it already exists:

```bash
git checkout staging/supabase
```

Return to stable prototype:

```bash
git checkout main
```

Update the staging branch from main:

```bash
git checkout staging/supabase
git merge main
```

## Secrets Rule

- Never commit `.env.local`.
- Never commit service-role keys.
- Never commit SMS provider secrets.
- Never commit production Supabase project credentials.
- Use `.env.example` as a placeholder template only.
- Only Supabase Project URL and anon public key may be used in frontend env later, and only for staging/local/preview.

## Merge Back Later

Merge back to `main` only when all are true:

- `npm run lint` passes.
- `npm run build` passes.
- route checklist passes.
- no `.env.local` or real keys are staged.
- staging SQL/RLS/auth behavior has rollback notes.
- local/mock mode still works with no `.env.local`.

## Rollback Rules

- Disable feature flags before reverting data-facing changes.
- Revert the merge commit if a staging merge breaks main.
- Rotate any key that might have appeared in logs or frontend output.
- Keep manual staging cleanup notes for test users, sync rows, audit logs, and SQL changes.

## Cloudflare Preview Branch Plan

- Use a branch preview for `staging/supabase`.
- Add only client-safe staging variables to Cloudflare Pages public build env.
- Keep service-role secrets only inside backend/Edge Function secret stores.
- Confirm preview URLs are not production URLs before auth redirect testing.

## M39 Next Step

M39 should prepare local-only Supabase staging env setup using `.env.example` as the template. It should still avoid committing `.env.local`, service-role keys, migrations, auth enablement, cloud sync, or backend writes.

## M39 Local Env Setup

Use `docs/M39_SUPABASE_STAGING_ENV_LOCAL_SETUP.md` before adding any staging values locally.

Recommended local-only flow:

```bash
Copy-Item .env.example .env.local
```

Then add only:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Keep these flags safe:

```bash
VITE_ENABLE_SUPABASE=true
VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=false
VITE_ENABLE_AUTH=false
VITE_ENABLE_CLOUD_SYNC=false
VITE_ENABLE_GUEST_SYNC_BACKEND=false
VITE_ENABLE_GUEST_SYNC_EDGE=false
```

Restart Vite after editing env values and verify `/app/env-safety` before opening `/app/supabase-connection`.
