# Staging Supabase Safety Checklist

Use this checklist before any real Supabase staging experiment. M38 adds the checklist only; no connection or migration is performed.

## Before Enabling Supabase

- [ ] Confirm current branch is `staging/supabase`.
- [ ] Confirm target project is staging, not production.
- [ ] Confirm `.env.local` is local only and not staged.
- [ ] Confirm only Project URL and anon public key are used in frontend env.
- [ ] Confirm `VITE_ENABLE_SUPABASE=false` remains default in `.env.example`.
- [ ] Open `/app/env-safety` and confirm there are no blockers.
- [ ] Confirm `VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=false`.
- [ ] Confirm auth, cloud sync, Guest Sync backend, and Guest Sync Edge flags are disabled.

## Before Running SQL

- [ ] Confirm Supabase dashboard project name clearly says staging.
- [ ] Recommended staging project name is `kasethub-staging`.
- [ ] Read `docs/M41_REAL_SUPABASE_STAGING_SETUP_WALKTHROUGH.md`.
- [ ] Read `docs/M41_SQL_EXECUTION_SCREENSHOT_CHECKLIST.md`.
- [ ] Read `docs/M40_SUPABASE_PROJECT_CREATION_GUIDE.md`.
- [ ] Read `docs/M40_SQL_RUN_PREP_CHECKLIST.md`.
- [ ] Read `docs/M40_POST_SQL_VERIFICATION_GUIDE.md`.
- [ ] Read `docs/SUPABASE_SQL_STAGING_EXECUTION_GUIDE.md`.
- [ ] Open `/app/supabase-setup-guide` and use the local checklist for progress only.
- [ ] Run schema SQL first.
- [ ] Run RLS SQL second.
- [ ] Verify tables, indexes, constraints, triggers, and RLS policies.
- [ ] Keep rollback/manual cleanup notes.
- [ ] Stop immediately if SQL Editor returns an error.

## Before Enabling Auth

- [ ] SQL/RLS staging checks passed.
- [ ] Redirect URLs are staging/local only.
- [ ] SMS provider cost/rate-limit plan is reviewed.
- [ ] Test phone number plan exists.
- [ ] Logout/session persistence behavior is checked.

## Before Enabling Cloud Sync

- [ ] Real Supabase Auth session ownership exists.
- [ ] Guest Sync Edge Function is deployed to staging only.
- [ ] Service-role key is only inside Edge Function secrets.
- [ ] Idempotency, consent, duplicate merge, partial success, and rollback tests pass.

## Before Pushing Branch

- [ ] Run `git status`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Confirm no `.env.local`, `.env.production`, or `.env.staging` is staged.
- [ ] Confirm `.env.example` contains placeholders only.
- [ ] Run a secret scan for service-role/provider keys.
- [ ] Confirm app still runs with no `.env.local`.

## Service-Role Warning

Service-role keys must never appear in:

- frontend code
- Vite env variables
- `.env.example`
- README/docs screenshots
- browser logs
- Cloudflare Pages public env

## Production Project Warning

Do not use a production Supabase project for M39-M41 staging tests. Stop immediately if the Supabase dashboard, Project URL, or env label does not clearly identify a staging project.

## M41 Stop Point

After creating the staging project, running schema SQL, running RLS SQL, and verifying tables/RLS/indexes/triggers, stop. Do not enable auth, cloud sync, uploads, AI proxy, Edge Functions, service-role-backed jobs, frontend writes, or production redirects.
