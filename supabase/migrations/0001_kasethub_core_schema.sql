-- KasetHub Platform M18 core schema draft
-- Purpose: Supabase-ready table, trigger, index, and constraint draft for the
-- future backend. This file is documentation-grade SQL and has not been run
-- against a real Supabase project.
--
-- Safety rules:
-- - Do not commit service-role keys.
-- - Do not run this directly in production without staging review.
-- - RLS policies live in supabase/policies/0001_kasethub_rls_policies.sql.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Optional future profile bootstrap trigger placeholder.
-- In production this should be reviewed against the selected auth providers.
-- create or replace function public.handle_new_user()
-- returns trigger
-- language plpgsql
-- security definer
-- set search_path = public
-- as $$
-- begin
--   insert into public.profiles (id, display_name, auth_providers)
--   values (new.id, coalesce(new.raw_user_meta_data->>'display_name', 'KasetHub user'), array['phone']);
--   return new;
-- end;
-- $$;
--
-- create trigger on_auth_user_created
-- after insert on auth.users
-- for each row execute function public.handle_new_user();

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  phone_number text,
  line_user_id text,
  google_user_id text,
  email text,
  province text,
  crop_focus text[] not null default '{}',
  auth_providers text[] not null default '{}',
  role text not null default 'farmer',
  account_status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.saved_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  item_type text not null,
  item_id text not null,
  title text not null,
  summary text,
  thumbnail_url text,
  source_route text,
  tags text[] not null default '{}',
  saved_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  local_id text,
  metadata jsonb not null default '{}'::jsonb,
  constraint saved_items_unique_user_item unique (user_id, item_type, item_id)
);

create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  item_type text not null,
  item_id text not null,
  title text,
  source_route text,
  liked_at timestamptz not null default now(),
  local_id text,
  metadata jsonb not null default '{}'::jsonb,
  constraint likes_unique_user_item unique (user_id, item_type, item_id)
);

create table if not exists public.followed_topics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  topic_type text not null,
  topic_key text not null,
  title text not null,
  source_route text,
  followed_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  tags text[] not null default '{}',
  local_id text,
  metadata jsonb not null default '{}'::jsonb,
  constraint followed_topics_unique_user_topic unique (user_id, topic_type, topic_key)
);

create table if not exists public.farm_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  local_id text,
  crop_name text not null,
  disease_name text,
  record_date date,
  confidence numeric(5,2),
  symptoms_summary text,
  treatment_summary text,
  status text not null default 'watching',
  source_route text,
  media_object_id uuid,
  analysis_result_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.recent_ai_questions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  local_id text,
  question text not null,
  topic text,
  source_route text,
  asked_at timestamptz not null default now(),
  answer_summary text,
  consent_to_sync boolean not null default false,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.ai_credit_balances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  daily_free_limit integer not null default 3,
  daily_free_used integer not null default 0,
  rewarded_credits integer not null default 0,
  pro_credits integer not null default 0,
  last_reset_date date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  constraint ai_credit_balances_unique_user unique (user_id),
  constraint ai_credit_balances_non_negative check (
    daily_free_limit >= 0
    and daily_free_used >= 0
    and rewarded_credits >= 0
    and pro_credits >= 0
  )
);

create table if not exists public.ai_credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  transaction_type text not null,
  source text not null,
  delta integer not null,
  balance_after integer,
  related_question_id uuid,
  related_reward_event_id uuid,
  idempotency_key text,
  created_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.rewarded_ad_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  guest_id text,
  provider text not null,
  ad_unit_id text,
  provider_event_id text,
  credits_granted integer not null default 0,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  verified_at timestamptz,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.ai_question_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  guest_id text,
  request_type text not null,
  question_summary text,
  topic text,
  model_route text,
  provider_used text,
  credit_cost integer not null default 0,
  credit_source text,
  answer_summary text,
  safety_level text,
  disclaimers text[] not null default '{}',
  created_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.share_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  guest_id text,
  source text not null,
  item_type text,
  item_id text,
  source_route text,
  ref_param text,
  created_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text,
  notification_type text not null default 'system',
  read_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  topic text,
  province text,
  image_urls text[] not null default '{}',
  like_count integer not null default 0,
  comment_count integer not null default 0,
  moderation_status text not null default 'visible',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.community_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  moderation_status text not null default 'visible',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  title text not null,
  excerpt text,
  body text,
  category text,
  author_id uuid references public.profiles(id) on delete set null,
  cover_image_url text,
  published_at timestamptz,
  moderation_status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  constraint articles_unique_slug unique (slug)
);

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  video_id text not null,
  channel_id text,
  playlist_id text,
  title text not null,
  description text,
  thumbnail_url text,
  duration text,
  published_at timestamptz,
  view_count bigint,
  category text,
  tags text[] not null default '{}',
  is_short boolean not null default false,
  source_status text not null default 'mock',
  share_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  constraint videos_unique_video_id unique (video_id)
);

create table if not exists public.crop_price_watches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  crop_key text not null,
  crop_name text not null,
  category text,
  province text,
  market text,
  threshold_above numeric(12,2),
  threshold_below numeric(12,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.crop_price_snapshots (
  id uuid primary key default gen_random_uuid(),
  crop_key text not null,
  crop_name text not null,
  category text,
  market text,
  province text,
  unit text not null,
  price numeric(12,2) not null,
  change_percent numeric(7,3),
  source text,
  captured_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.plant_media (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references public.profiles(id) on delete set null,
  guest_session_id text,
  bucket_name text not null,
  object_path text not null,
  signed_url_expires_at timestamptz,
  thumbnail_path text,
  mime_type text not null,
  size_bytes bigint not null,
  width integer,
  height integer,
  checksum text,
  access_policy text not null default 'private_owner_only',
  moderation_status text not null default 'pending',
  moderation_reason text,
  deletion_requested_at timestamptz,
  linked_farm_record_id uuid,
  linked_saved_item_id uuid,
  analysis_job_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  constraint plant_media_unique_object_path unique (object_path)
);

create table if not exists public.plant_analysis_jobs (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references public.profiles(id) on delete set null,
  guest_session_id text,
  media_object_id uuid references public.plant_media(id) on delete set null,
  status text not null default 'pending_upload',
  request_type text not null default 'plant_image_analysis',
  model_route text,
  provider_candidate text,
  credit_cost integer not null default 3,
  credit_reserved boolean not null default false,
  retry_count integer not null default 0,
  moderation_status text not null default 'pending',
  error_code text,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.plant_analysis_results (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.plant_analysis_jobs(id) on delete cascade,
  media_object_id uuid references public.plant_media(id) on delete set null,
  owner_user_id uuid references public.profiles(id) on delete set null,
  guest_session_id text,
  crop_name text,
  disease_name text,
  confidence numeric(5,2),
  confidence_label text,
  symptoms text[] not null default '{}',
  causes text[] not null default '{}',
  treatment_suggestions text[] not null default '{}',
  urgency text not null default 'watch',
  safety_disclaimers text[] not null default '{}',
  should_consult_expert boolean not null default true,
  linked_farm_record_id uuid,
  linked_saved_item_id uuid,
  created_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.auth_link_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  guest_id text,
  provider text not null,
  event_type text not null,
  created_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

-- M19 account-linking note:
-- provider can be phone, line, google, or future provider keys.
-- profiles.auth_providers and profiles.line_user_id are enough for the first
-- draft. A future account_provider_links table may be added for verification
-- status, conflicts, revocation history, and detailed provider metadata.

create table if not exists public.guest_sync_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  guest_id text,
  provider text not null,
  sync_request_id text not null,
  status text not null,
  dry_run boolean not null default true,
  records_received jsonb not null default '{}'::jsonb,
  merge_summary jsonb not null default '{}'::jsonb,
  conflict_summary jsonb not null default '{}'::jsonb,
  warnings text[] not null default '{}',
  created_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

-- Foreign key links that need both sides to exist.
alter table public.farm_records
  drop constraint if exists farm_records_media_object_fk,
  add constraint farm_records_media_object_fk
  foreign key (media_object_id) references public.plant_media(id) on delete set null;

alter table public.farm_records
  drop constraint if exists farm_records_analysis_result_fk,
  add constraint farm_records_analysis_result_fk
  foreign key (analysis_result_id) references public.plant_analysis_results(id) on delete set null;

alter table public.plant_media
  drop constraint if exists plant_media_linked_farm_record_fk,
  add constraint plant_media_linked_farm_record_fk
  foreign key (linked_farm_record_id) references public.farm_records(id) on delete set null;

alter table public.plant_media
  drop constraint if exists plant_media_linked_saved_item_fk,
  add constraint plant_media_linked_saved_item_fk
  foreign key (linked_saved_item_id) references public.saved_items(id) on delete set null;

alter table public.plant_media
  drop constraint if exists plant_media_analysis_job_fk,
  add constraint plant_media_analysis_job_fk
  foreign key (analysis_job_id) references public.plant_analysis_jobs(id) on delete set null;

alter table public.plant_analysis_results
  drop constraint if exists plant_analysis_results_linked_farm_record_fk,
  add constraint plant_analysis_results_linked_farm_record_fk
  foreign key (linked_farm_record_id) references public.farm_records(id) on delete set null;

alter table public.plant_analysis_results
  drop constraint if exists plant_analysis_results_linked_saved_item_fk,
  add constraint plant_analysis_results_linked_saved_item_fk
  foreign key (linked_saved_item_id) references public.saved_items(id) on delete set null;

-- updated_at triggers.
drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_saved_items_updated_at on public.saved_items;
create trigger set_saved_items_updated_at before update on public.saved_items
for each row execute function public.set_updated_at();

drop trigger if exists set_followed_topics_updated_at on public.followed_topics;
create trigger set_followed_topics_updated_at before update on public.followed_topics
for each row execute function public.set_updated_at();

drop trigger if exists set_farm_records_updated_at on public.farm_records;
create trigger set_farm_records_updated_at before update on public.farm_records
for each row execute function public.set_updated_at();

drop trigger if exists set_ai_credit_balances_updated_at on public.ai_credit_balances;
create trigger set_ai_credit_balances_updated_at before update on public.ai_credit_balances
for each row execute function public.set_updated_at();

drop trigger if exists set_notifications_updated_at on public.notifications;
create trigger set_notifications_updated_at before update on public.notifications
for each row execute function public.set_updated_at();

drop trigger if exists set_community_posts_updated_at on public.community_posts;
create trigger set_community_posts_updated_at before update on public.community_posts
for each row execute function public.set_updated_at();

drop trigger if exists set_community_comments_updated_at on public.community_comments;
create trigger set_community_comments_updated_at before update on public.community_comments
for each row execute function public.set_updated_at();

drop trigger if exists set_articles_updated_at on public.articles;
create trigger set_articles_updated_at before update on public.articles
for each row execute function public.set_updated_at();

drop trigger if exists set_videos_updated_at on public.videos;
create trigger set_videos_updated_at before update on public.videos
for each row execute function public.set_updated_at();

drop trigger if exists set_crop_price_watches_updated_at on public.crop_price_watches;
create trigger set_crop_price_watches_updated_at before update on public.crop_price_watches
for each row execute function public.set_updated_at();

drop trigger if exists set_plant_media_updated_at on public.plant_media;
create trigger set_plant_media_updated_at before update on public.plant_media
for each row execute function public.set_updated_at();

drop trigger if exists set_plant_analysis_jobs_updated_at on public.plant_analysis_jobs;
create trigger set_plant_analysis_jobs_updated_at before update on public.plant_analysis_jobs
for each row execute function public.set_updated_at();

-- Core user-data indexes.
create index if not exists profiles_phone_number_idx on public.profiles (phone_number);
create unique index if not exists profiles_phone_number_unique_idx on public.profiles (phone_number) where phone_number is not null;
create unique index if not exists profiles_line_user_id_unique_idx on public.profiles (line_user_id) where line_user_id is not null;
create unique index if not exists profiles_google_user_id_unique_idx on public.profiles (google_user_id) where google_user_id is not null;
create index if not exists profiles_crop_focus_gin_idx on public.profiles using gin (crop_focus);

create index if not exists saved_items_user_id_idx on public.saved_items (user_id);
create index if not exists saved_items_item_lookup_idx on public.saved_items (item_type, item_id);
create index if not exists saved_items_saved_at_idx on public.saved_items (saved_at desc);
create index if not exists saved_items_tags_gin_idx on public.saved_items using gin (tags);

create index if not exists likes_user_id_idx on public.likes (user_id);
create index if not exists likes_item_lookup_idx on public.likes (item_type, item_id);
create index if not exists likes_liked_at_idx on public.likes (liked_at desc);

create index if not exists followed_topics_user_id_idx on public.followed_topics (user_id);
create index if not exists followed_topics_topic_lookup_idx on public.followed_topics (topic_type, topic_key);
create index if not exists followed_topics_tags_gin_idx on public.followed_topics using gin (tags);

create index if not exists farm_records_user_id_idx on public.farm_records (user_id);
create index if not exists farm_records_user_local_id_idx on public.farm_records (user_id, local_id);
create index if not exists farm_records_crop_name_idx on public.farm_records (crop_name);
create index if not exists farm_records_status_idx on public.farm_records (status);
create index if not exists farm_records_created_at_idx on public.farm_records (created_at desc);

create index if not exists recent_ai_questions_user_id_idx on public.recent_ai_questions (user_id);
create index if not exists recent_ai_questions_asked_at_idx on public.recent_ai_questions (asked_at desc);
create index if not exists recent_ai_questions_topic_idx on public.recent_ai_questions (topic);

-- AI credit and usage indexes.
create index if not exists ai_credit_balances_last_reset_date_idx on public.ai_credit_balances (last_reset_date);
create index if not exists ai_credit_transactions_user_id_idx on public.ai_credit_transactions (user_id);
create index if not exists ai_credit_transactions_source_idx on public.ai_credit_transactions (source);
create index if not exists ai_credit_transactions_created_at_idx on public.ai_credit_transactions (created_at desc);
create unique index if not exists ai_credit_transactions_idempotency_unique_idx
  on public.ai_credit_transactions (idempotency_key)
  where idempotency_key is not null;

create unique index if not exists rewarded_ad_events_provider_event_unique_idx
  on public.rewarded_ad_events (provider_event_id)
  where provider_event_id is not null;
create index if not exists rewarded_ad_events_user_id_idx on public.rewarded_ad_events (user_id);
create index if not exists rewarded_ad_events_guest_id_idx on public.rewarded_ad_events (guest_id);
create index if not exists rewarded_ad_events_status_idx on public.rewarded_ad_events (status);
create index if not exists rewarded_ad_events_created_at_idx on public.rewarded_ad_events (created_at desc);

create index if not exists ai_question_logs_user_id_idx on public.ai_question_logs (user_id);
create index if not exists ai_question_logs_guest_id_idx on public.ai_question_logs (guest_id);
create index if not exists ai_question_logs_topic_idx on public.ai_question_logs (topic);
create index if not exists ai_question_logs_safety_level_idx on public.ai_question_logs (safety_level);
create index if not exists ai_question_logs_created_at_idx on public.ai_question_logs (created_at desc);

-- Sharing and notification indexes.
create index if not exists share_events_user_id_idx on public.share_events (user_id);
create index if not exists share_events_guest_id_idx on public.share_events (guest_id);
create index if not exists share_events_source_ref_idx on public.share_events (source, ref_param);
create index if not exists share_events_item_lookup_idx on public.share_events (item_type, item_id);
create index if not exists share_events_created_at_idx on public.share_events (created_at desc);

create index if not exists notifications_user_id_idx on public.notifications (user_id);
create index if not exists notifications_read_at_idx on public.notifications (read_at);
create index if not exists notifications_created_at_idx on public.notifications (created_at desc);

-- Community and content indexes.
create index if not exists community_posts_topic_idx on public.community_posts (topic);
create index if not exists community_posts_province_idx on public.community_posts (province);
create index if not exists community_posts_author_id_idx on public.community_posts (author_id);
create index if not exists community_posts_created_at_idx on public.community_posts (created_at desc);
create index if not exists community_posts_moderation_status_idx on public.community_posts (moderation_status);

create index if not exists community_comments_post_id_idx on public.community_comments (post_id);
create index if not exists community_comments_author_id_idx on public.community_comments (author_id);
create index if not exists community_comments_created_at_idx on public.community_comments (created_at);
create index if not exists community_comments_moderation_status_idx on public.community_comments (moderation_status);

create index if not exists articles_category_idx on public.articles (category);
create index if not exists articles_published_at_idx on public.articles (published_at desc);
create index if not exists articles_moderation_status_idx on public.articles (moderation_status);
create index if not exists articles_title_body_search_idx
  on public.articles using gin (to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(body, '')));

create index if not exists videos_video_id_idx on public.videos (video_id);
create index if not exists videos_playlist_id_idx on public.videos (playlist_id);
create index if not exists videos_category_idx on public.videos (category);
create index if not exists videos_published_at_idx on public.videos (published_at desc);
create index if not exists videos_tags_gin_idx on public.videos using gin (tags);

-- Crop price indexes.
create index if not exists crop_price_watches_user_id_idx on public.crop_price_watches (user_id);
create index if not exists crop_price_watches_crop_key_idx on public.crop_price_watches (crop_key);
create index if not exists crop_price_watches_province_idx on public.crop_price_watches (province);
create index if not exists crop_price_snapshots_crop_date_idx on public.crop_price_snapshots (crop_key, captured_at desc);
create index if not exists crop_price_snapshots_province_idx on public.crop_price_snapshots (province);
create index if not exists crop_price_snapshots_market_idx on public.crop_price_snapshots (market);

-- Plant image analysis indexes.
create index if not exists plant_media_owner_user_id_idx on public.plant_media (owner_user_id);
create index if not exists plant_media_guest_session_id_idx on public.plant_media (guest_session_id);
create index if not exists plant_media_moderation_status_idx on public.plant_media (moderation_status);
create index if not exists plant_media_analysis_job_id_idx on public.plant_media (analysis_job_id);
create index if not exists plant_media_created_at_idx on public.plant_media (created_at desc);
create index if not exists plant_media_checksum_idx on public.plant_media (checksum);

create index if not exists plant_analysis_jobs_owner_user_id_idx on public.plant_analysis_jobs (owner_user_id);
create index if not exists plant_analysis_jobs_guest_session_id_idx on public.plant_analysis_jobs (guest_session_id);
create index if not exists plant_analysis_jobs_media_object_id_idx on public.plant_analysis_jobs (media_object_id);
create index if not exists plant_analysis_jobs_status_idx on public.plant_analysis_jobs (status);
create index if not exists plant_analysis_jobs_owner_status_idx on public.plant_analysis_jobs (owner_user_id, status);
create index if not exists plant_analysis_jobs_created_at_idx on public.plant_analysis_jobs (created_at desc);

create index if not exists plant_analysis_results_job_id_idx on public.plant_analysis_results (job_id);
create index if not exists plant_analysis_results_media_object_id_idx on public.plant_analysis_results (media_object_id);
create index if not exists plant_analysis_results_owner_user_id_idx on public.plant_analysis_results (owner_user_id);
create index if not exists plant_analysis_results_guest_session_id_idx on public.plant_analysis_results (guest_session_id);
create index if not exists plant_analysis_results_crop_name_idx on public.plant_analysis_results (crop_name);
create index if not exists plant_analysis_results_disease_name_idx on public.plant_analysis_results (disease_name);
create index if not exists plant_analysis_results_created_at_idx on public.plant_analysis_results (created_at desc);

-- Auth and sync audit indexes.
create index if not exists auth_link_events_user_id_idx on public.auth_link_events (user_id);
create index if not exists auth_link_events_guest_id_idx on public.auth_link_events (guest_id);
create index if not exists auth_link_events_provider_idx on public.auth_link_events (provider);
create index if not exists auth_link_events_created_at_idx on public.auth_link_events (created_at desc);

create unique index if not exists guest_sync_events_sync_request_unique_idx on public.guest_sync_events (sync_request_id);
create index if not exists guest_sync_events_user_id_idx on public.guest_sync_events (user_id);
create index if not exists guest_sync_events_guest_id_idx on public.guest_sync_events (guest_id);
create index if not exists guest_sync_events_status_idx on public.guest_sync_events (status);
create index if not exists guest_sync_events_created_at_idx on public.guest_sync_events (created_at desc);
