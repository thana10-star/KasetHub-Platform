# M18 Supabase SQL Migration + RLS Policy Pack Report

## Summary

M18 creates the first complete Supabase SQL migration draft and RLS policy pack for KasetHub core data. The work covers user profiles, Guest Memory sync, saved items, My Farm, AI credits, community, articles, videos, crop prices, plant image media, image-analysis jobs/results, auth link events, and guest sync events. No Supabase connection, migration run, real auth, network call, service-role key, or cloud write is added.

## Files Changed

- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/SUPABASE_SCHEMA_DRAFT.md`
- `docs/GUEST_TO_ACCOUNT_SYNC_PLAN.md`
- `docs/GUEST_SYNC_ENDPOINT_CONTRACT.md`
- `docs/PHONE_AUTH_BOUNDARY.md`
- `docs/SUPABASE_STORAGE_IMAGE_ANALYSIS_SCHEMA.md`
- `docs/SUPABASE_ENV_SETUP.md`
- `docs/SUPABASE_TYPE_MAPPING.md`
- `docs/SUPABASE_MIGRATION_CHECKLIST.md`
- `supabase/migrations/0001_kasethub_core_schema.sql`
- `supabase/policies/0001_kasethub_rls_policies.sql`
- `src/routes/AccountPreviewPage.tsx`
- `reports/milestones/M18_SUPABASE_SQL_MIGRATION_RLS_POLICY_PACK_REPORT.md`

## SQL Tables Drafted

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

## RLS Policy Notes

The RLS draft enables row-level security and defines policies for:

- users reading/updating their own profile
- users managing their own saved items, likes, followed topics, farm records, crop watches, and notifications
- users reading their own AI credits, AI logs, media, jobs, results, auth link events, and sync events
- public read for visible community content, published articles, visible videos, and crop price snapshots
- authenticated users creating/updating their own community posts and comments
- backend-only write boundaries for credit mutation, share events, sync merge, moderation, uploads, and trusted imports

Admin/moderator policies remain placeholders until roles and support workflows are designed.

## Index/Constraint Notes

The schema draft includes:

- `updated_at` trigger function and triggers
- optional profile creation trigger placeholder
- user-owned lookup indexes
- `item_type + item_id` lookup indexes
- `crop_key + captured_at` price index
- `video_id` import index
- moderation status indexes
- image analysis job status indexes
- share source/ref indexes
- unique saved item, like, and followed topic constraints

## Type Mapping Notes

`docs/SUPABASE_TYPE_MAPPING.md` maps current frontend models to future tables:

- Guest Memory -> `saved_items`, `likes`, `followed_topics`, `farm_records`, `recent_ai_questions`
- AI credits -> `ai_credit_balances`, `ai_credit_transactions`, `rewarded_ad_events`, `ai_question_logs`
- plant image analysis -> `plant_media`, `plant_analysis_jobs`, `plant_analysis_results`
- community -> `community_posts`, `community_comments`
- content/YouTube -> `articles`, `videos`

## Verification Commands

```bash
npm run lint
npm run build
```

Both commands passed. The production build completed with the existing Vite chunk-size warning.

Manual route checks returned HTTP 200:

- `/app/account-preview`
- `/app/guest-sync-status`
- `/app/profile`
- `/app/memory`

## Known Limitations

- No real Supabase connection
- No migration was run
- No real auth or OTP
- No Supabase Storage bucket creation
- No service-role key
- No backend network call
- No cloud sync
- SQL and RLS require staging review before production
- Admin/moderator role policies are placeholders

## Next Recommended Milestone

M19 should add the LINE Login test path and account-linking rules behind feature flags. It should keep LINE SDK redirects disabled by default, define provider linking with phone accounts, and preserve the Guest Memory ownership and sync rules established in M16-M18.
