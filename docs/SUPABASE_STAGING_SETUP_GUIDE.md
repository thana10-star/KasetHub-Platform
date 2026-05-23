# Supabase Staging Setup Guide

M25 prepares KasetHub for the first real Supabase staging connection without connecting the app, running migrations, enabling auth, writing data, or adding secrets. Use this guide when the team is ready to create a staging project manually.

## Boundaries

- Do not connect production first.
- Do not put a service-role key in frontend code, `.env.local`, Cloudflare public variables, screenshots, docs, or reports.
- Do not enable real auth, phone OTP, LINE Login, or cloud sync until staging RLS checks pass.
- Do not run migrations from the app.
- Do not add backend writes in this milestone.

## 1. Create Supabase Staging Project

1. Create a new Supabase project named for staging, not production.
2. Confirm the project has no real farmer/user data.
3. Copy only:
   - Project URL
   - anon public key
4. Do not copy or expose the service-role key to the frontend.

## 2. Create Local `.env.local`

Create `.env.local` only on the developer machine. Start with:

```bash
VITE_SUPABASE_URL=https://your-staging-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-staging-anon-key
VITE_ENABLE_SUPABASE=true
VITE_ENABLE_AUTH=false
VITE_ENABLE_CLOUD_SYNC=false
VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=false
VITE_AI_PROXY_MODE=local_fixture
VITE_ENABLE_AI_BACKEND_PROXY=false
VITE_GUEST_SYNC_MODE=local_fixture
VITE_ENABLE_GUEST_SYNC_BACKEND=false
VITE_PHONE_AUTH_MODE=local_mock
VITE_ENABLE_PHONE_AUTH=false
VITE_SUPABASE_AUTH_REDIRECT_URL=
VITE_AUTH_STAGING_LABEL=local
VITE_LINE_AUTH_MODE=local_mock
VITE_ENABLE_LINE_AUTH=false
```

This allows config readiness testing while keeping auth and sync closed.

## 3. Enable Flags Gradually

First staging pass:

- `VITE_ENABLE_SUPABASE=true`
- `VITE_ENABLE_AUTH=false`
- `VITE_ENABLE_CLOUD_SYNC=false`
- `VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=false`

Later passes, only after RLS tests:

- Enable `VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=true` only when testing a public/read-only probe.
- Enable auth in a dedicated milestone.
- Enable cloud sync only after ownership, consent, merge, rollback, and audit rules are ready.
- Keep AI, Guest Sync, Phone Auth, and LINE Auth backend flags disabled unless their staging contracts are being tested.

## 4. Run SQL Manually In Staging

Use Supabase SQL editor or a controlled admin workflow:

1. Review `supabase/migrations/0001_kasethub_core_schema.sql`.
2. Run it on staging only.
3. Review `supabase/policies/0001_kasethub_rls_policies.sql`.
4. Apply RLS policies after tables exist.
5. Verify every table expected to be private has RLS enabled.
6. Do not run these files against production until staging passes.

M27 adds the manual execution pack for this step:

- `docs/SUPABASE_SQL_STAGING_EXECUTION_GUIDE.md`
- `docs/SUPABASE_MANUAL_VERIFICATION_PACK.md`
- `/app/supabase-sql-checklist`

Use the guide before touching the SQL editor. It repeats the required order: schema SQL first, RLS policy SQL second, then manual verification. Stop if you are not certain the target project is staging.

## 5. Verify Tables And Reads

Check:

- Public read tables work only for intended public content, such as published articles, visible videos, and approved/reference crop prices.
- User-owned tables are not readable by anonymous users.
- Backend/admin-only tables reject browser writes.
- `updated_at` triggers and key indexes exist.
- Demo/sample price data remains labeled as reference/sample if seeded later.

After auth is enabled in a later milestone, verify:

- Authenticated users can read/write only their own saved items, farm records, crop watches, and sync records.
- Users cannot access another user's private data.
- Moderator/admin review tables require future role checks.

## 6. Storage Bucket Plan

Before real image upload:

- Create private plant media buckets in staging only.
- Apply bucket policies.
- Test metadata-only flows before image uploads.
- Keep deletion and retention policy documented.
- Do not store image-analysis service credentials in frontend.

## 7. Rollback Plan

- Export staging schema before material changes.
- Keep migration files versioned.
- Use a disposable staging project if early RLS tests fail badly.
- Prepare a reviewed rollback/down script before production.
- Never promote a migration that cannot be explained and reversed.

## 8. Backup Notes

- Confirm Supabase backup availability for staging and production plans.
- Record migration timestamp, reviewer, and schema hash/checksum if available.
- Keep seed data separate from real imports.
- Do not seed private user data.

## 9. Secrets Checklist

- Frontend may use anon key only.
- Service-role key belongs only in Supabase Edge Functions or trusted backend secret storage.
- AI provider keys belong server-side only.
- LINE channel secret belongs server-side only.
- SMS provider secrets belong server-side only.
- Cloudflare Pages variables exposed to Vite must be public-safe.

## 10. Cloudflare Pages Environment Plan

For staging deployment:

- Add Project URL and anon key as staging environment variables only.
- Keep `VITE_ENABLE_AUTH=false` and `VITE_ENABLE_CLOUD_SYNC=false` for the first deploy.
- Keep `VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=false` unless actively testing a public/read-only target.
- Do not add service-role keys to Cloudflare Pages public variables.
- Document who can edit environment variables.
- Verify the deployed `/app/supabase-readiness` and `/app/supabase-connection` pages before enabling more flags.

## M26 Connection Dry Run

M26 adds a no-write route at `/app/supabase-connection`.

Use it before any real backend work to confirm:

- staging URL is detected
- anon key is detected
- service-role-like key is not detected
- dry-run network check is disabled by default
- schema status is `unknown/not checked` until a public/read-only probe is explicitly enabled

If the future public-read probe says `schema_not_applied_yet`, return to the manual SQL/RLS steps above. Do not treat that as a frontend failure.

## M27 SQL Execution Checklist

M27 adds `/app/supabase-sql-checklist`, a local-only checklist page that summarizes:

- expected draft tables
- expected RLS policies
- expected indexes and triggers
- manual staging verification items
- production blockers

The checklist is static and conceptual. It does not read the Supabase project, run SQL, fetch schema, or write data. Use it alongside the two M27 docs when manually preparing a staging execution.

## M28 Phone OTP Auth Staging Checklist

M28 adds `/app/auth/phone-staging` and these docs:

- `docs/SUPABASE_AUTH_PHONE_OTP_STAGING_PLAN.md`
- `docs/SUPABASE_AUTH_REDIRECT_URL_CHECKLIST.md`
- `docs/SMS_PROVIDER_COST_AND_RATE_LIMIT_NOTES.md`

Do not enable real phone OTP until:

- SQL/RLS staging checks pass.
- Redirect URLs are configured for local, Cloudflare preview, staging, and production.
- SMS provider cost/rate limits are configured.
- Test phone numbers are ready and not committed.
- `auth.uid()` ownership checks pass.
- Rollback to `VITE_PHONE_AUTH_MODE=local_mock` is rehearsed.
- `VITE_ENABLE_CLOUD_SYNC=false` remains in place.

## 11. Promotion To Production

Production is blocked until:

- Staging migration and RLS tests pass.
- Auth provider tests pass with real sessions.
- Guest sync backend is idempotent and consent-aware.
- Admin roles and audit logs are enforced server-side.
- Backup and rollback procedures are practiced.
- Cost and rate limits are reviewed.
## M36 Branch Workflow Note

Run real Supabase work on `staging/supabase`, not directly on `main`.

- `main` stays the stable local/mock prototype.
- `staging/supabase` can hold staging URL/anon env wiring, SQL/RLS verification UI changes, phone auth staging, and Guest Sync Edge Function work.
- Never commit `.env.local`, service-role keys, SMS provider secrets, or production project credentials.
- Merge back only after `npm run lint`, `npm run build`, manual route checks, RLS verification, and rollback notes are complete.

## M39 Local Env Setup Step

Before any real Supabase staging connection work:

1. Read `docs/M39_SUPABASE_STAGING_ENV_LOCAL_SETUP.md`.
2. Copy `.env.example` to `.env.local` on your machine only.
3. Add only the staging Project URL and anon public key.
4. Keep network dry-run, auth, cloud sync, and Guest Sync Edge disabled.
5. Restart Vite.
6. Open `/app/env-safety`.
7. Continue to `/app/supabase-connection` only if env safety has no blockers.

Do not add service-role keys or production credentials to any frontend env file.
