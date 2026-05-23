# Staging Supabase Safety Checklist

Use this checklist before any real Supabase staging experiment. M38 adds the checklist only; no connection or migration is performed.

## Before Enabling Supabase

- [ ] Confirm current branch is `staging/supabase`.
- [ ] Confirm target project is staging, not production.
- [ ] Confirm `.env.local` is local only and not staged.
- [ ] Confirm only Project URL and anon public key are used in frontend env.
- [ ] Confirm `VITE_ENABLE_SUPABASE=false` remains default in `.env.example`.

## Before Running SQL

- [ ] Confirm Supabase dashboard project name clearly says staging.
- [ ] Read `docs/SUPABASE_SQL_STAGING_EXECUTION_GUIDE.md`.
- [ ] Run schema SQL first.
- [ ] Run RLS SQL second.
- [ ] Verify tables, indexes, constraints, triggers, and RLS policies.
- [ ] Keep rollback/manual cleanup notes.

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

Do not use a production Supabase project for M39-M40 staging tests. Stop immediately if the Supabase dashboard, Project URL, or env label does not clearly identify a staging project.

