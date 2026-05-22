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
