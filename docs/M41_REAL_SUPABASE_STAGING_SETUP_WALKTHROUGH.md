# M41 Real Supabase Staging Setup Walkthrough

This walkthrough prepares the first real KasetHub Supabase staging database setup. It is manual only. The app does not create the project, does not run SQL, does not enable auth, does not enable cloud sync, and does not write backend data.

Use this only on `staging/supabase`.

## SECTION A - Create Supabase Project

1. Go to https://supabase.com.
2. Sign in to the Supabase Dashboard.
3. Create an organization if you do not already have one for KasetHub staging work.
4. Create a new project.
5. Use this suggested project name:

```text
kasethub-staging
```

6. Choose Singapore or the closest region to Thailand if available.
7. Save the database password in your private password manager only.
8. Create the project.
9. Wait for database initialization to finish before opening SQL Editor.

Stop if the project name does not clearly say staging, if you see production data, or if you are unsure which project is selected.

## SECTION B - Collect Safe Frontend Values

Open the project settings/API page and collect only:

- Project URL
- anon/public key

The anon/public key is the only Supabase key allowed in frontend Vite env for this milestone.

Never use the service-role key in frontend. Never paste the service-role key into:

- `.env.local`
- `.env.example`
- README or docs
- screenshots
- browser console
- Cloudflare Pages public environment variables
- frontend source code

If the service-role key was exposed anywhere, stop and rotate it before continuing.

## SECTION C - Create Local .env.local

Create `.env.local` locally only. Do not commit it.

Use this shape:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_ENABLE_SUPABASE=true
VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=false
VITE_ENABLE_AUTH=false
VITE_ENABLE_CLOUD_SYNC=false
```

Rules:

- `.env.local` must stay local only.
- Do not add service-role keys.
- Do not add SMS, AI, map, or provider secrets.
- Keep auth disabled.
- Keep cloud sync disabled.
- Keep the dry-run network check disabled unless a later reviewed read-only probe milestone explicitly asks for it.
- Restart Vite after changing `.env.local`.

After restart, open:

- `/app/env-safety`
- `/app/supabase-connection`
- `/app/supabase-setup-guide`

Confirm the app masks values and still says auth/cloud sync are disabled.

## SECTION D - Run SQL Safely

Run SQL manually in Supabase Dashboard SQL Editor. Do not automate this from the app.

Exact order:

1. schema SQL
2. RLS SQL

Files:

```text
supabase/migrations/0001_kasethub_core_schema.sql
supabase/policies/0001_kasethub_rls_policies.sql
```

Step-by-step:

1. Confirm the dashboard project is `kasethub-staging` or clearly staging.
2. Open SQL Editor.
3. Copy the full contents of `supabase/migrations/0001_kasethub_core_schema.sql`.
4. Paste into SQL Editor.
5. Run once.
6. Stop if there is any error.
7. After schema succeeds, copy the full contents of `supabase/policies/0001_kasethub_rls_policies.sql`.
8. Paste into SQL Editor.
9. Run once.
10. Stop if there is any error.

Do not run SQL on production. Do not run partial file contents. Do not keep clicking Run after an error without understanding the cause.

## SECTION E - Verify Database

Use Supabase Dashboard to verify:

- tables exist
- RLS enabled
- indexes/triggers exist
- no public write policy

Suggested checks:

1. Open Table Editor and confirm expected tables exist.
2. Open each sensitive/user-owned table and confirm RLS is enabled.
3. Open policy view and confirm there is no broad anon/public insert, update, or delete policy.
4. Confirm public read policies exist only where intentionally drafted.
5. Confirm indexes and triggers exist from the SQL draft.
6. Use only safe read-only SELECT checks if you need SQL verification.

Do not insert, update, delete, upload, call Edge Functions, or test frontend writes during M41.

## SECTION F - STOP POINT

Stop after the staging database is created, SQL/RLS is run manually, and dashboard verification is captured.

Do not enable yet:

- auth
- cloud sync
- uploads
- AI proxy

Also do not enable:

- phone OTP
- Guest Sync Edge Function calls
- Storage buckets for real uploads
- admin actions
- service-role-backed jobs
- production redirects

The next milestone should review the SQL/RLS result and decide whether to proceed to auth staging or fix database issues first.

## Local Progress Tracking

Use `/app/supabase-setup-guide` to track local-only progress:

- project created
- env added
- schema SQL run
- RLS SQL run
- tables verified
- staging verified

This checklist uses only `localStorage`. It does not connect to Supabase and does not prove the remote database state by itself.
