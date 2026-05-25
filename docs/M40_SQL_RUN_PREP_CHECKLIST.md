# M40 SQL Run Prep Checklist

This checklist prepares manual SQL execution on the Supabase staging project. Do not run this on production. Do not automate this step in the app.

For the first real staging run, use this together with:

- `docs/M41_REAL_SUPABASE_STAGING_SETUP_WALKTHROUGH.md`
- `docs/M41_SQL_EXECUTION_SCREENSHOT_CHECKLIST.md`
- `/app/supabase-setup-guide`

## Before Opening SQL Editor

- [ ] Current Git branch is `staging/supabase`.
- [ ] Supabase project name is `kasethub-staging` or clearly staging.
- [ ] Project is not production.
- [ ] `.env.local` is not committed.
- [ ] Only Project URL and anon key are allowed in frontend env.
- [ ] No service-role key appears in frontend env, docs, screenshots, or logs.
- [ ] Auth remains disabled in the app.
- [ ] Cloud sync remains disabled.
- [ ] Network dry-run check remains disabled unless intentionally testing a reviewed public/read-only probe later.
- [ ] Rollback/cleanup plan is understood.

## Open SQL Editor

In Supabase Dashboard:

1. Select the staging project.
2. Open SQL Editor.
3. Create a new query tab for schema SQL.
4. Confirm one more time the project is staging.

## Run Schema SQL First

Copy the full file content carefully:

```text
supabase/migrations/0001_kasethub_core_schema.sql
```

Paste it into SQL Editor and run it once.

Stop if:

- SQL Editor shows an error
- project identity is unclear
- the file content appears partial
- you accidentally opened production

Save screenshots/logs of the result. Do not include secrets.

## Run RLS Policies Second

Only after schema SQL succeeds, copy the full file content:

```text
supabase/policies/0001_kasethub_rls_policies.sql
```

Paste it into SQL Editor and run it once.

Stop if any policy fails. Save the exact error and screenshot.

## Immediate Checks After SQL

- [ ] Table list appears in Table Editor.
- [ ] RLS is enabled on drafted tables.
- [ ] Public read policies exist only for intended public data.
- [ ] No public insert/update/delete policy was added.
- [ ] User-owned policies reference `auth.uid()`.
- [ ] No auth provider has been enabled.
- [ ] No cloud sync has been enabled.

## What Not To Do In M40

Do not test yet:

- auth sign-in
- phone OTP
- cloud sync
- uploads
- Edge Functions
- AI calls
- frontend writes
- service-role behavior

These remain blocked in M41 too. M41 records the first staging setup progress and screenshot evidence, but still stops before auth, cloud sync, uploads, AI proxy, Edge Functions, frontend writes, or service-role behavior.
