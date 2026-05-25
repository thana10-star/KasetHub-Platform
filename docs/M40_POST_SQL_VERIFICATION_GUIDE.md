# M40 Post-SQL Verification Guide

Use this guide after manually running the schema SQL and RLS SQL on the staging project. It is a verification guide only. The frontend still does not connect or write data by default.

For M41, also use `docs/M41_SQL_EXECUTION_SCREENSHOT_CHECKLIST.md` and `/app/supabase-setup-guide` to record local progress and screenshot evidence without secrets.

## Expected Tables

Core identity and Guest Memory:

- `profiles`
- `saved_items`
- `likes`
- `followed_topics`
- `farm_records`
- `share_events`
- `notifications`

AI and credits:

- `recent_ai_questions`
- `ai_credit_balances`
- `ai_credit_transactions`
- `rewarded_ad_events`
- `ai_question_logs`

Community and content:

- `community_posts`
- `community_comments`
- `articles`
- `videos`

Crop prices and plant analysis:

- `crop_price_watches`
- `crop_price_snapshots`
- `plant_media`
- `plant_analysis_jobs`
- `plant_analysis_results`

Auth/sync planning:

- `auth_link_events`
- `guest_sync_events`

## Expected Policies

Verify representative policies:

- owner policies use `auth.uid()`
- `articles_public_read_published`
- `videos_public_read_visible`
- `crop_price_snapshots_public_read`
- `community_posts_public_read_visible`
- `community_comments_public_read_visible`
- private user tables do not allow anon reads
- browser writes exist only where explicitly intended by the draft

Use `docs/SUPABASE_MANUAL_VERIFICATION_PACK.md` for the longer policy list.

## Expected Indexes And Triggers

Check:

- user lookup indexes
- item lookup indexes
- crop price date/market indexes
- article search index
- community moderation status indexes
- plant analysis job/status indexes
- `set_updated_at` trigger function
- table-level `updated_at` triggers

## Quick Dashboard Checks

- Table Editor shows expected tables.
- Each user/private table has RLS enabled.
- Policy view shows no broad public write policy.
- SQL Editor history shows schema SQL ran before RLS SQL.
- Authentication providers are not enabled for real users.
- Storage buckets are not created for uploads yet.
- Edge Functions are not deployed.

## Safe Manual SELECT Checks

If needed, run only read-only checks such as:

```sql
select table_name
from information_schema.tables
where table_schema = 'public'
order by table_name;
```

And:

```sql
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
order by tablename;
```

Do not insert, update, delete, upload, or call Edge Functions during M40 verification.

## Do Not Test Yet

Do not test:

- auth
- cloud sync
- uploads
- Edge Functions
- AI
- phone OTP
- Guest Sync writes
- admin actions

## Rollback / Cleanup

If staging needs reset:

1. Save error messages and screenshots.
2. Record the exact Git commit and SQL file versions used.
3. Prefer recreating the staging project if it is disposable.
4. If cleanup is required, use a reviewed cleanup script on staging only.
5. Do not apply fixes to production.

Production remains blocked until staging SQL/RLS verification passes and later auth/session tests prove ownership boundaries.

After M41 verification, stop. Do not enable auth, cloud sync, uploads, AI proxy, Edge Functions, or frontend writes until a later milestone explicitly scopes that work.
