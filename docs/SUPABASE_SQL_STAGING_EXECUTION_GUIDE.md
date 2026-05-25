# Supabase SQL Staging Execution Guide

M27 prepares the manual execution guide for running KasetHub's draft SQL and RLS on a future Supabase staging project. This guide is for a human operator. The app does not connect to Supabase, does not run migrations, and does not write data.

## Stop If Unsure

Stop before running SQL if:

- You are not 100% sure the project is staging.
- The Supabase dashboard shows production data.
- You see a service-role key in frontend `.env.local`, Cloudflare public variables, source code, docs, screenshots, or reports.
- You have not read the rollback/cleanup section.
- You cannot explain which SQL file runs first.
- You are being asked to run this directly on production.

## Pre-Check Before Running SQL

1. Confirm the Supabase project name clearly says staging.
2. Confirm the Project URL matches the staging project.
3. Confirm the app still runs without `.env.local`.
4. Confirm `.env.example` has placeholders only.
5. Confirm `.env.local` is local-only and not committed.
6. Confirm frontend uses anon key only.
7. Confirm no service-role key appears in any `VITE_` variable.
8. Confirm `VITE_ENABLE_AUTH=false`.
9. Confirm `VITE_ENABLE_CLOUD_SYNC=false`.
10. Confirm `VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=false` unless testing a reviewed public-read probe.

## Files To Run

Run in this order:

1. `supabase/migrations/0001_kasethub_core_schema.sql`
2. `supabase/policies/0001_kasethub_rls_policies.sql`

Do not run the RLS policy file first. It depends on tables existing.

## Step 1: Run Schema SQL First

In the Supabase staging dashboard:

1. Open SQL Editor.
2. Create a new query.
3. Paste `supabase/migrations/0001_kasethub_core_schema.sql`.
4. Reconfirm the project is staging.
5. Run the query.
6. Save or screenshot the success result.
7. If any table/constraint/index error appears, stop and record the exact error.

## Step 2: Run RLS Policy SQL Second

After schema SQL succeeds:

1. Create a new SQL query.
2. Paste `supabase/policies/0001_kasethub_rls_policies.sql`.
3. Reconfirm the project is staging.
4. Run the query.
5. Save or screenshot the success result.
6. If any policy error appears, stop and record the exact error.

## Verify Tables Exist

In Table Editor, verify at least:

- `profiles`
- `saved_items`
- `likes`
- `followed_topics`
- `farm_records`
- `recent_ai_questions`
- `ai_credit_balances`
- `ai_credit_transactions`
- `rewarded_ad_events`
- `ai_question_logs`
- `share_events`
- `notifications`
- `community_posts`
- `community_comments`
- `articles`
- `videos`
- `crop_price_watches`
- `crop_price_snapshots`
- `plant_media`
- `plant_analysis_jobs`
- `plant_analysis_results`
- `auth_link_events`
- `guest_sync_events`

## Verify RLS Enabled

For every table above:

- Confirm Row Level Security is enabled.
- Confirm no private table has broad anon read/write access.
- Confirm public read policies are limited to visible/published/reference records.
- Confirm owner policies use `auth.uid()`.
- Confirm backend-only operations have no browser write policies.

## Verify Indexes And Constraints

Check:

- unique constraints for saved items, likes, followed topics, articles slug, videos video ID, plant media object path
- user lookup indexes
- item lookup indexes
- crop price lookup indexes
- moderation status indexes
- plant analysis job/status indexes
- text search index for articles
- `updated_at` trigger function and table triggers

## Verify No Service-Role Key In Frontend

Search:

- `.env.local`
- Cloudflare Pages frontend variables
- source files
- docs
- reports
- screenshots or copied setup notes

Only anon public key is allowed in frontend. Service-role belongs only in future secure backend/Edge Function secrets.

## Screenshot Checklist

Capture screenshots for the staging execution record:

- Supabase project name showing staging.
- SQL Editor result for schema SQL.
- SQL Editor result for RLS SQL.
- Table list showing core tables.
- One table detail showing RLS enabled.
- Policies page showing representative public read policy.
- Policies page showing representative owner policy.
- Index/constraint view for a representative table.
- Environment variable page showing no service-role key in frontend variables.

Do not include secret values in screenshots.

## Rollback / Cleanup Notes

If validation fails:

- Do not run production SQL.
- Save the error message and screenshot.
- If the project is disposable, recreate staging and rerun after fixing the draft.
- If cleanup is required, use a reviewed cleanup script only on staging.
- Do not manually delete random tables in production.
- Record the exact file revision used.

## After Manual Execution

Only after staging passes:

- Update milestone notes with execution date and result.
- Keep auth disabled until a dedicated auth/RLS user-session milestone.
- Keep cloud sync disabled until backend-owned consent, merge, idempotency, and audit logging exist.
- Keep admin actions mock-only until RBAC and audit logs exist.

## M40 Manual Project Creation Gate

Before running this guide in Supabase SQL Editor, complete:

- `docs/M40_SUPABASE_PROJECT_CREATION_GUIDE.md`
- `docs/M40_SQL_RUN_PREP_CHECKLIST.md`
- `/app/supabase-sql-checklist`

Recommended project name: `kasethub-staging`.

Run order remains:

1. `supabase/migrations/0001_kasethub_core_schema.sql`
2. `supabase/policies/0001_kasethub_rls_policies.sql`

Stop on any SQL error and save screenshots/logs. Do not continue into auth, cloud sync, uploads, Edge Functions, or AI during M40.
