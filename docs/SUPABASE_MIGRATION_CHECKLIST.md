# Supabase Migration Checklist

This checklist is for the future staging migration. M18 only creates draft SQL files and does not connect to Supabase.

## Before Running SQL

- Create a Supabase staging project.
- Confirm no production data exists in the target project.
- Keep service-role keys out of frontend `.env.local`.
- Review `supabase/migrations/0001_kasethub_core_schema.sql`.
- Review `supabase/policies/0001_kasethub_rls_policies.sql`.
- Confirm auth providers are still disabled until the auth milestone is ready.
- Decide whether `profiles` should be created by a trigger or by a backend onboarding function.

## Staging Execution

- Run the schema migration in staging only.
- Run the RLS policy draft after the tables exist.
- Verify all tables have Row Level Security enabled.
- Verify indexes and unique constraints were created.
- Confirm `updated_at` triggers update records correctly.
- Do not seed real user data during the first test.

## RLS Verification

- Test public read for published `articles`.
- Test public read for visible `videos`.
- Test public read for `crop_price_snapshots`.
- Test anonymous users cannot read private saved items, farm records, AI logs, media, jobs, or sync events.
- Test an authenticated user can CRUD only their own `saved_items`, `likes`, `followed_topics`, and `farm_records`.
- Test an authenticated user cannot read another user profile or private data.
- Test community posts/comments are public read only when `moderation_status = visible`.
- Test backend-only tables reject browser writes unless a specific policy is intentionally added.

## Service Role Safety

- Service-role keys must be used only in Supabase Edge Functions or trusted backend jobs.
- Never put a service-role key in a Vite environment variable.
- Edge Functions must validate `auth.uid()`, ownership, consent, idempotency, and rate limits.
- Credit mutations and Guest Memory sync merges must be backend-owned.

## Backup and Rollback

- Export the staging schema before further changes.
- Keep the migration files versioned.
- If staging validation fails, drop the staging project or roll back using a reviewed down script.
- Do not run production migrations until staging RLS tests pass.

## Later Seed Data

- Seed demo articles and videos only after RLS is verified.
- Seed crop price snapshots with clearly marked sample/source fields.
- Seed no private user data.
- Keep mock/demo data separate from imported production data.

## Performance Checks

- Validate indexes for `user_id` lookups.
- Validate `item_type + item_id` lookups.
- Validate `crop_key + captured_at` price queries.
- Validate `video_id` imports.
- Validate moderation queue filters.
- Validate plant analysis job status queries.
- Validate share source/ref queries.

## M25 Staging Readiness Gate

Before the first staging run:

- Open `/app/supabase-readiness` and review blockers, warnings, and next safe steps.
- Confirm `.env.example` contains placeholders only.
- Confirm `.env.local` is not committed.
- Confirm only Project URL and anon key are used in frontend ENV.
- Confirm `VITE_ENABLE_AUTH=false` and `VITE_ENABLE_CLOUD_SYNC=false` for the first staging pass.
- Confirm `VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=false` unless explicitly testing a public/read-only probe.
- Confirm service-role key is available only to future backend/Edge Function secret storage, not the browser.
- Read `docs/SUPABASE_STAGING_SETUP_GUIDE.md` and `docs/SUPABASE_READINESS_AUDIT.md` before running SQL.
- Keep production untouched until staging RLS tests pass.

## M26 Connection Dry Run Gate

Before running SQL, `/app/supabase-connection` may show `schema applied: unknown/not checked`; that is expected. After SQL/RLS is applied on staging, a future public-read probe can be enabled to check only a public/read-only target. If the probe returns `schema_not_applied_yet`, review the migration state instead of treating the frontend as broken. The probe must never write data or query private tables.

## M27 Manual SQL Execution Pack

Before opening the Supabase SQL editor, review:

- `docs/SUPABASE_SQL_STAGING_EXECUTION_GUIDE.md`
- `docs/SUPABASE_MANUAL_VERIFICATION_PACK.md`
- `/app/supabase-sql-checklist`

Execution order for staging:

1. Confirm the selected Supabase project is staging, not production.
2. Run `supabase/migrations/0001_kasethub_core_schema.sql`.
3. Run `supabase/policies/0001_kasethub_rls_policies.sql`.
4. Verify tables, triggers, indexes, constraints, and RLS manually.
5. Capture dashboard screenshots for the staging execution record.

Stop if project identity, SQL file version, service-role handling, or rollback approach is unclear.

## M40 Staging Project Creation And SQL Prep

Before first SQL execution, complete the M40 pack:

- [ ] Create a new staging-only Supabase project named `kasethub-staging` or similarly clear.
- [ ] Choose a region close to Thailand/Singapore if available.
- [ ] Save Project URL and anon key locally only.
- [ ] Confirm service-role key is not copied into frontend env.
- [ ] Open SQL Editor on staging only.
- [ ] Run schema SQL first: `supabase/migrations/0001_kasethub_core_schema.sql`.
- [ ] Run RLS SQL second: `supabase/policies/0001_kasethub_rls_policies.sql`.
- [ ] Stop on SQL error and save screenshots/logs.
- [ ] Verify table list, RLS enabled, expected policies, indexes, and triggers.
- [ ] Confirm auth/cloud sync/uploads/Edge Functions/AI remain disabled.

Related docs:

- `docs/M40_SUPABASE_PROJECT_CREATION_GUIDE.md`
- `docs/M40_SQL_RUN_PREP_CHECKLIST.md`
- `docs/M40_POST_SQL_VERIFICATION_GUIDE.md`
