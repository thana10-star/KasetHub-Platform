# Supabase Manual Verification Pack

This pack is the checklist to use after manually running KasetHub's draft SQL/RLS on a Supabase staging project. It is not automation and does not require app network access.

## Tables Created

- [ ] `profiles`
- [ ] `saved_items`
- [ ] `likes`
- [ ] `followed_topics`
- [ ] `farm_records`
- [ ] `recent_ai_questions`
- [ ] `ai_credit_balances`
- [ ] `ai_credit_transactions`
- [ ] `rewarded_ad_events`
- [ ] `ai_question_logs`
- [ ] `share_events`
- [ ] `notifications`
- [ ] `community_posts`
- [ ] `community_comments`
- [ ] `articles`
- [ ] `videos`
- [ ] `crop_price_watches`
- [ ] `crop_price_snapshots`
- [ ] `plant_media`
- [ ] `plant_analysis_jobs`
- [ ] `plant_analysis_results`
- [ ] `auth_link_events`
- [ ] `guest_sync_events`

## Triggers Created

- [ ] `public.set_updated_at()` exists.
- [ ] `set_profiles_updated_at`
- [ ] `set_saved_items_updated_at`
- [ ] `set_followed_topics_updated_at`
- [ ] `set_farm_records_updated_at`
- [ ] `set_ai_credit_balances_updated_at`
- [ ] `set_notifications_updated_at`
- [ ] `set_community_posts_updated_at`
- [ ] `set_community_comments_updated_at`
- [ ] `set_articles_updated_at`
- [ ] `set_videos_updated_at`
- [ ] `set_crop_price_watches_updated_at`
- [ ] `set_plant_media_updated_at`
- [ ] `set_plant_analysis_jobs_updated_at`

## RLS Enabled

- [ ] RLS enabled on every table.
- [ ] No private table allows anonymous writes.
- [ ] Backend-only tables have no browser write policies.
- [ ] Policies were reviewed after running the RLS SQL file.

## Public Read Policies

- [ ] `community_posts_public_read_visible`
- [ ] `community_comments_public_read_visible`
- [ ] `articles_public_read_published`
- [ ] `videos_public_read_visible`
- [ ] `crop_price_snapshots_public_read`

Public reads must expose only visible, published, or reference rows.

## User-Owned Policies

- [ ] `profiles_*_own`
- [ ] `saved_items_*_own`
- [ ] `likes_*_own`
- [ ] `followed_topics_*_own`
- [ ] `farm_records_*_own`
- [ ] `recent_ai_questions_*_own`
- [ ] `crop_price_watches_*_own`
- [ ] `plant_media_select_own`
- [ ] `plant_analysis_jobs_select_own`
- [ ] `plant_analysis_results_select_own`
- [ ] `auth_link_events_select_own`
- [ ] `guest_sync_events_select_own`

All user-owned policies must use `auth.uid()` and must not trust client-submitted owner IDs.

## Backend-Only Operations

Confirm browser clients cannot directly write:

- [ ] AI credit transactions and rewarded ad verification
- [ ] share event trust/audit rows
- [ ] plant media upload fulfillment
- [ ] plant analysis job state transitions
- [ ] guest sync merge events
- [ ] auth link audit events
- [ ] future imports and admin review tasks

## Storage Planning Tables

- [ ] `plant_media`
- [ ] `plant_analysis_jobs`
- [ ] `plant_analysis_results`

Confirm these are metadata planning tables only. No bucket upload, signed URL, AI provider call, or file storage is enabled by this SQL pack.

## Crop Price Tables

- [ ] `crop_price_snapshots`
- [ ] `crop_price_watches`

Confirm snapshot rows are public reference/read-only planning data and user watches are owner-scoped. Future tables such as `crop_price_sources`, `crop_price_import_jobs`, and `crop_price_review_tasks` remain later migration work.

## Community Moderation Tables

- [ ] `community_posts`
- [ ] `community_comments`

Confirm moderation status filters exist. Future tables such as `community_reports`, `hidden_content`, `moderation_actions`, `moderator_queue`, and `community_rules` remain later migration work.

## Admin / Audit Placeholders

The M18 SQL draft does not create full admin RBAC. Verify that these are not accidentally treated as production-ready:

- [ ] `admin_roles` not yet live
- [ ] `admin_audit_logs` not yet live
- [ ] `content_review_tasks` not yet live
- [ ] `crop_price_review_tasks` not yet live
- [ ] `ai_safety_review_logs` not yet live
- [ ] `expert_review_requests` not yet live

## Auth Provider Not Yet Enabled

- [ ] Supabase Auth remains disabled for real users.
- [ ] Phone OTP remains disabled.
- [ ] LINE Login remains disabled.
- [ ] Google Login remains disabled.
- [ ] Guest mode remains the active product behavior.

## Phone OTP Staging Readiness

- [ ] `/app/auth/phone-staging` reviewed before enabling phone auth.
- [ ] `VITE_ENABLE_AUTH=false` until the controlled staging OTP test.
- [ ] `VITE_ENABLE_PHONE_AUTH=false` until the controlled staging OTP test.
- [ ] `VITE_PHONE_AUTH_MODE=local_mock` remains default.
- [ ] Supabase Auth redirect URLs are configured for staging only.
- [ ] SMS provider cost/rate limits are configured.
- [ ] Test phone numbers are not committed to the repo.
- [ ] Session ownership with `auth.uid()` is tested before cloud sync.
- [ ] `VITE_ENABLE_CLOUD_SYNC=false` remains in place.

## Edge Functions Not Yet Deployed

- [ ] No Guest Sync Edge Function deployed.
- [ ] No AI proxy Edge Function deployed.
- [ ] No crop price import job deployed.
- [ ] No moderation/admin action function deployed.
- [ ] No service-role key exposed to frontend.

## M29 Guest Sync Edge Function Checklist

- [ ] `guest-memory-sync` contract reviewed.
- [ ] Endpoint is not deployed before staging auth and RLS checks pass.
- [ ] `VITE_ENABLE_GUEST_SYNC_EDGE=false` remains default.
- [ ] `VITE_GUEST_SYNC_EDGE_MODE=disabled` remains default.
- [ ] Idempotency key storage plan reviewed.
- [ ] Duplicate merge rules reviewed for saved items, likes, followed topics, My Farm, and AI history.
- [ ] Consent validation plan reviewed.
- [ ] Rollback/manual cleanup owner assigned for staging test.
- [ ] Service-role key is configured only inside Edge Function secrets when implementation begins.
- [ ] `/app/guest-sync-edge` still says no real endpoint call.

## Final Sign-Off

- [ ] Screenshots captured without secrets.
- [ ] Errors, if any, recorded.
- [ ] Rollback/cleanup plan reviewed.
- [ ] Production remains untouched.
- [ ] App route `/app/supabase-sql-checklist` still says SQL has not been run by the app.

## M40 Post-SQL Verification Addendum

After manually running the M18 schema and RLS SQL on `kasethub-staging`, also read:

- `docs/M40_POST_SQL_VERIFICATION_GUIDE.md`

Confirm:

- schema SQL ran before RLS SQL
- table list appears as expected
- RLS is enabled on private/user-owned tables
- public read policies are limited to published/visible/reference data
- no public write policy was accidentally added
- auth, uploads, Edge Functions, AI, and cloud sync remain untested and disabled
