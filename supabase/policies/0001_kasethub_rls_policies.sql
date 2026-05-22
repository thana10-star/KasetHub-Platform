-- KasetHub Platform M18 RLS policy draft
-- Purpose: Supabase Row Level Security draft for the M18 core schema.
-- This file is not executed by the app and has not been run against a real
-- Supabase project. Review in staging before any real migration.
--
-- Service role reminder:
-- - Supabase service-role keys must stay in backend/Edge Functions only.
-- - Trusted credit mutation, sync merge, moderation, uploads, and imports
--   should use backend-owned code paths, not browser policies.

alter table public.profiles enable row level security;
alter table public.saved_items enable row level security;
alter table public.likes enable row level security;
alter table public.followed_topics enable row level security;
alter table public.farm_records enable row level security;
alter table public.recent_ai_questions enable row level security;
alter table public.ai_credit_balances enable row level security;
alter table public.ai_credit_transactions enable row level security;
alter table public.rewarded_ad_events enable row level security;
alter table public.ai_question_logs enable row level security;
alter table public.share_events enable row level security;
alter table public.notifications enable row level security;
alter table public.community_posts enable row level security;
alter table public.community_comments enable row level security;
alter table public.articles enable row level security;
alter table public.videos enable row level security;
alter table public.crop_price_watches enable row level security;
alter table public.crop_price_snapshots enable row level security;
alter table public.plant_media enable row level security;
alter table public.plant_analysis_jobs enable row level security;
alter table public.plant_analysis_results enable row level security;
alter table public.auth_link_events enable row level security;
alter table public.guest_sync_events enable row level security;

-- Profiles: users can read, insert, and update their own profile.
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
for select to authenticated
using (id = auth.uid());

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own on public.profiles
for insert to authenticated
with check (id = auth.uid());

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
for update to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- Saved items: users can CRUD their own saved items.
drop policy if exists saved_items_select_own on public.saved_items;
create policy saved_items_select_own on public.saved_items
for select to authenticated
using (user_id = auth.uid());

drop policy if exists saved_items_insert_own on public.saved_items;
create policy saved_items_insert_own on public.saved_items
for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists saved_items_update_own on public.saved_items;
create policy saved_items_update_own on public.saved_items
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists saved_items_delete_own on public.saved_items;
create policy saved_items_delete_own on public.saved_items
for delete to authenticated
using (user_id = auth.uid());

-- Likes: users can CRUD their own likes. Public counts should use safe views.
drop policy if exists likes_select_own on public.likes;
create policy likes_select_own on public.likes
for select to authenticated
using (user_id = auth.uid());

drop policy if exists likes_insert_own on public.likes;
create policy likes_insert_own on public.likes
for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists likes_update_own on public.likes;
create policy likes_update_own on public.likes
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists likes_delete_own on public.likes;
create policy likes_delete_own on public.likes
for delete to authenticated
using (user_id = auth.uid());

-- Followed topics: users can CRUD their own crop/topic follows.
drop policy if exists followed_topics_select_own on public.followed_topics;
create policy followed_topics_select_own on public.followed_topics
for select to authenticated
using (user_id = auth.uid());

drop policy if exists followed_topics_insert_own on public.followed_topics;
create policy followed_topics_insert_own on public.followed_topics
for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists followed_topics_update_own on public.followed_topics;
create policy followed_topics_update_own on public.followed_topics
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists followed_topics_delete_own on public.followed_topics;
create policy followed_topics_delete_own on public.followed_topics
for delete to authenticated
using (user_id = auth.uid());

-- My Farm: users can CRUD their own farm records.
drop policy if exists farm_records_select_own on public.farm_records;
create policy farm_records_select_own on public.farm_records
for select to authenticated
using (user_id = auth.uid());

drop policy if exists farm_records_insert_own on public.farm_records;
create policy farm_records_insert_own on public.farm_records
for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists farm_records_update_own on public.farm_records;
create policy farm_records_update_own on public.farm_records
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists farm_records_delete_own on public.farm_records;
create policy farm_records_delete_own on public.farm_records
for delete to authenticated
using (user_id = auth.uid());

-- Recent AI questions: user-owned, consent-aware history.
drop policy if exists recent_ai_questions_select_own on public.recent_ai_questions;
create policy recent_ai_questions_select_own on public.recent_ai_questions
for select to authenticated
using (user_id = auth.uid());

drop policy if exists recent_ai_questions_insert_own on public.recent_ai_questions;
create policy recent_ai_questions_insert_own on public.recent_ai_questions
for insert to authenticated
with check (user_id = auth.uid() and consent_to_sync = true);

drop policy if exists recent_ai_questions_delete_own on public.recent_ai_questions;
create policy recent_ai_questions_delete_own on public.recent_ai_questions
for delete to authenticated
using (user_id = auth.uid());

-- AI credits: users can read balances and ledgers. Mutations are backend-only.
drop policy if exists ai_credit_balances_select_own on public.ai_credit_balances;
create policy ai_credit_balances_select_own on public.ai_credit_balances
for select to authenticated
using (user_id = auth.uid());

drop policy if exists ai_credit_transactions_select_own on public.ai_credit_transactions;
create policy ai_credit_transactions_select_own on public.ai_credit_transactions
for select to authenticated
using (user_id = auth.uid());

drop policy if exists rewarded_ad_events_select_own on public.rewarded_ad_events;
create policy rewarded_ad_events_select_own on public.rewarded_ad_events
for select to authenticated
using (user_id = auth.uid());

drop policy if exists ai_question_logs_select_own on public.ai_question_logs;
create policy ai_question_logs_select_own on public.ai_question_logs
for select to authenticated
using (user_id = auth.uid());

drop policy if exists ai_question_logs_delete_own on public.ai_question_logs;
create policy ai_question_logs_delete_own on public.ai_question_logs
for delete to authenticated
using (user_id = auth.uid());

-- share_events are backend-insert only. No browser insert/select policy by default.

-- Notifications: users can read and mark their own notifications.
drop policy if exists notifications_select_own on public.notifications;
create policy notifications_select_own on public.notifications
for select to authenticated
using (user_id = auth.uid());

drop policy if exists notifications_update_own on public.notifications;
create policy notifications_update_own on public.notifications
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- Community posts: public read visible posts; authenticated users create/update/delete own.
drop policy if exists community_posts_public_read_visible on public.community_posts;
create policy community_posts_public_read_visible on public.community_posts
for select to anon, authenticated
using (moderation_status = 'visible');

drop policy if exists community_posts_insert_own on public.community_posts;
create policy community_posts_insert_own on public.community_posts
for insert to authenticated
with check (author_id = auth.uid());

drop policy if exists community_posts_update_own on public.community_posts;
create policy community_posts_update_own on public.community_posts
for update to authenticated
using (author_id = auth.uid())
with check (author_id = auth.uid());

drop policy if exists community_posts_delete_own on public.community_posts;
create policy community_posts_delete_own on public.community_posts
for delete to authenticated
using (author_id = auth.uid());

-- Community comments: public read visible comments; authenticated users create/update/delete own.
drop policy if exists community_comments_public_read_visible on public.community_comments;
create policy community_comments_public_read_visible on public.community_comments
for select to anon, authenticated
using (moderation_status = 'visible');

drop policy if exists community_comments_insert_own on public.community_comments;
create policy community_comments_insert_own on public.community_comments
for insert to authenticated
with check (author_id = auth.uid());

drop policy if exists community_comments_update_own on public.community_comments;
create policy community_comments_update_own on public.community_comments
for update to authenticated
using (author_id = auth.uid())
with check (author_id = auth.uid());

drop policy if exists community_comments_delete_own on public.community_comments;
create policy community_comments_delete_own on public.community_comments
for delete to authenticated
using (author_id = auth.uid());

-- Public content: articles and videos are public read when published/visible.
drop policy if exists articles_public_read_published on public.articles;
create policy articles_public_read_published on public.articles
for select to anon, authenticated
using (published_at is not null and moderation_status = 'published');

drop policy if exists videos_public_read_visible on public.videos;
create policy videos_public_read_visible on public.videos
for select to anon, authenticated
using (source_status in ('mock', 'api_ready', 'imported'));

-- Crop prices: snapshots are public read; watches are user-owned.
drop policy if exists crop_price_snapshots_public_read on public.crop_price_snapshots;
create policy crop_price_snapshots_public_read on public.crop_price_snapshots
for select to anon, authenticated
using (true);

drop policy if exists crop_price_watches_select_own on public.crop_price_watches;
create policy crop_price_watches_select_own on public.crop_price_watches
for select to authenticated
using (user_id = auth.uid());

drop policy if exists crop_price_watches_insert_own on public.crop_price_watches;
create policy crop_price_watches_insert_own on public.crop_price_watches
for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists crop_price_watches_update_own on public.crop_price_watches;
create policy crop_price_watches_update_own on public.crop_price_watches
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists crop_price_watches_delete_own on public.crop_price_watches;
create policy crop_price_watches_delete_own on public.crop_price_watches
for delete to authenticated
using (user_id = auth.uid());

-- Plant media, jobs, and results: users can read their own rows.
-- Uploads, signed URLs, moderation updates, AI jobs, and deletion fulfillment
-- should be backend/Edge Function operations.
drop policy if exists plant_media_select_own on public.plant_media;
create policy plant_media_select_own on public.plant_media
for select to authenticated
using (owner_user_id = auth.uid());

drop policy if exists plant_analysis_jobs_select_own on public.plant_analysis_jobs;
create policy plant_analysis_jobs_select_own on public.plant_analysis_jobs
for select to authenticated
using (owner_user_id = auth.uid());

drop policy if exists plant_analysis_results_select_own on public.plant_analysis_results;
create policy plant_analysis_results_select_own on public.plant_analysis_results
for select to authenticated
using (owner_user_id = auth.uid());

drop policy if exists plant_analysis_results_delete_own on public.plant_analysis_results;
create policy plant_analysis_results_delete_own on public.plant_analysis_results
for delete to authenticated
using (owner_user_id = auth.uid());

-- Account linking and sync audit: users can read their own security/sync history.
-- Inserts are backend-only to preserve trust and idempotency.
drop policy if exists auth_link_events_select_own on public.auth_link_events;
create policy auth_link_events_select_own on public.auth_link_events
for select to authenticated
using (user_id = auth.uid());

drop policy if exists guest_sync_events_select_own on public.guest_sync_events;
create policy guest_sync_events_select_own on public.guest_sync_events
for select to authenticated
using (user_id = auth.uid());

-- Admin/moderator policy placeholders:
-- - Add an app_roles table or profiles.role whitelist before enabling staff policies.
-- - Moderator access should be narrow: community queues, plant moderation queues,
--   article/video editorial workflows, and support diagnostics.
-- - Avoid broad access to raw AI prompts, private farm records, or plant images.
-- - Edge Functions using the service role may bypass RLS, so every trusted
--   function must validate ownership, consent, idempotency, and rate limits.
