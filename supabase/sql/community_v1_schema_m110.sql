-- KasetHub Platform M110 Community V1 staging SQL pack
-- Purpose: staging-only schema/RLS/storage draft for the real Community Feed V1.
-- Status: not applied by the app. Apply manually to a staging Supabase project,
-- then verify with two test users before enabling frontend writes.
--
-- Safety rules:
-- - Do not run in production until staging verification passes.
-- - Do not expose service-role keys to the frontend.
-- - Browser clients must use only the public anon key and RLS.
-- - No phone fields, exact location fields, GPS fields, or image bytes are stored here.

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

create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  author_user_id uuid not null references auth.users(id) on delete cascade,
  author_display_name text,
  content_text text not null,
  category text not null,
  image_path text,
  image_mime_type text,
  image_size_bytes integer,
  image_width integer,
  image_height integer,
  status text not null default 'published',
  like_count integer not null default 0,
  comment_count integer not null default 0,
  report_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint community_posts_content_not_blank check (length(trim(content_text)) > 0),
  constraint community_posts_status_check check (
    status in ('published', 'hidden', 'deleted', 'reported', 'pending_review')
  ),
  constraint community_posts_category_check check (
    category in (
      'ปัญหาพืช',
      'ดินและปุ๋ย',
      'อากาศ',
      'ราคาเกษตร',
      'เครื่องมือ/แอพ',
      'เรื่องเล่าจากฟาร์ม',
      'อื่น ๆ'
    )
  ),
  constraint community_posts_image_mime_check check (
    image_mime_type is null or image_mime_type in ('image/jpeg', 'image/png', 'image/webp')
  ),
  constraint community_posts_image_size_check check (
    image_size_bytes is null or (image_size_bytes > 0 and image_size_bytes <= 3145728)
  ),
  constraint community_posts_image_dimensions_check check (
    (image_width is null or image_width > 0) and (image_height is null or image_height > 0)
  ),
  constraint community_posts_counts_non_negative check (
    like_count >= 0 and comment_count >= 0 and report_count >= 0
  )
);

create table if not exists public.community_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  author_user_id uuid not null references auth.users(id) on delete cascade,
  author_display_name text,
  content_text text not null,
  status text not null default 'published',
  report_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint community_comments_content_not_blank check (length(trim(content_text)) > 0),
  constraint community_comments_status_check check (status in ('published', 'hidden', 'deleted', 'reported')),
  constraint community_comments_report_count_non_negative check (report_count >= 0)
);

create table if not exists public.community_likes (
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table if not exists public.community_reports (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.community_posts(id) on delete cascade,
  comment_id uuid references public.community_comments(id) on delete cascade,
  reporter_user_id uuid not null references auth.users(id) on delete cascade,
  reason text not null,
  note text,
  created_at timestamptz not null default now(),
  constraint community_reports_target_check check (
    ((post_id is not null)::integer + (comment_id is not null)::integer) = 1
  ),
  constraint community_reports_reason_check check (
    reason in ('spam', 'dangerous_information', 'personal_information', 'inappropriate', 'other')
  )
);

create table if not exists public.community_notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_user_id uuid not null references auth.users(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  post_id uuid references public.community_posts(id) on delete cascade,
  comment_id uuid references public.community_comments(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  constraint community_notifications_type_check check (
    type in ('post_liked', 'post_replied', 'comment_replied', 'post_reported_system')
  ),
  constraint community_notifications_title_not_blank check (length(trim(title)) > 0)
);

drop trigger if exists set_community_posts_updated_at on public.community_posts;
create trigger set_community_posts_updated_at
before update on public.community_posts
for each row execute function public.set_updated_at();

drop trigger if exists set_community_comments_updated_at on public.community_comments;
create trigger set_community_comments_updated_at
before update on public.community_comments
for each row execute function public.set_updated_at();

create index if not exists community_posts_created_at_idx on public.community_posts (created_at desc);
create index if not exists community_posts_category_created_at_idx on public.community_posts (category, created_at desc);
create index if not exists community_posts_status_created_at_idx on public.community_posts (status, created_at desc);
create index if not exists community_posts_author_user_id_idx on public.community_posts (author_user_id);

create index if not exists community_comments_post_id_created_at_idx on public.community_comments (post_id, created_at asc);
create index if not exists community_comments_author_user_id_idx on public.community_comments (author_user_id);
create index if not exists community_comments_status_idx on public.community_comments (status);

create index if not exists community_likes_user_id_idx on public.community_likes (user_id);
create index if not exists community_likes_post_id_created_at_idx on public.community_likes (post_id, created_at desc);

create index if not exists community_reports_post_id_idx on public.community_reports (post_id);
create index if not exists community_reports_comment_id_idx on public.community_reports (comment_id);
create index if not exists community_reports_reporter_user_id_idx on public.community_reports (reporter_user_id);
create index if not exists community_reports_created_at_idx on public.community_reports (created_at desc);

create index if not exists community_notifications_recipient_created_at_idx
  on public.community_notifications (recipient_user_id, created_at desc);
create index if not exists community_notifications_recipient_read_at_idx
  on public.community_notifications (recipient_user_id, read_at);
create index if not exists community_notifications_post_id_idx on public.community_notifications (post_id);

alter table public.community_posts enable row level security;
alter table public.community_comments enable row level security;
alter table public.community_likes enable row level security;
alter table public.community_reports enable row level security;
alter table public.community_notifications enable row level security;

drop policy if exists community_posts_read_published on public.community_posts;
create policy community_posts_read_published on public.community_posts
for select to anon, authenticated
using (status = 'published');

drop policy if exists community_posts_insert_own on public.community_posts;
create policy community_posts_insert_own on public.community_posts
for insert to authenticated
with check (
  author_user_id = auth.uid()
  and status = 'published'
  and (
    image_path is null
    or image_path like (auth.uid()::text || '/%')
  )
);

drop policy if exists community_posts_update_own_status on public.community_posts;
create policy community_posts_update_own_status on public.community_posts
for update to authenticated
using (author_user_id = auth.uid())
with check (
  author_user_id = auth.uid()
  and status in ('hidden', 'deleted', 'published')
  and (
    image_path is null
    or image_path like (auth.uid()::text || '/%')
  )
);

drop policy if exists community_posts_delete_own on public.community_posts;
create policy community_posts_delete_own on public.community_posts
for delete to authenticated
using (author_user_id = auth.uid());

drop policy if exists community_comments_read_published_with_post on public.community_comments;
create policy community_comments_read_published_with_post on public.community_comments
for select to anon, authenticated
using (
  status = 'published'
  and exists (
    select 1
    from public.community_posts p
    where p.id = community_comments.post_id
      and p.status = 'published'
  )
);

drop policy if exists community_comments_insert_own_on_published_post on public.community_comments;
create policy community_comments_insert_own_on_published_post on public.community_comments
for insert to authenticated
with check (
  author_user_id = auth.uid()
  and status = 'published'
  and exists (
    select 1
    from public.community_posts p
    where p.id = community_comments.post_id
      and p.status = 'published'
  )
);

drop policy if exists community_comments_update_own_status on public.community_comments;
create policy community_comments_update_own_status on public.community_comments
for update to authenticated
using (author_user_id = auth.uid())
with check (
  author_user_id = auth.uid()
  and status in ('hidden', 'deleted', 'published')
);

drop policy if exists community_comments_delete_own on public.community_comments;
create policy community_comments_delete_own on public.community_comments
for delete to authenticated
using (author_user_id = auth.uid());

drop policy if exists community_likes_select_visible_or_own on public.community_likes;
create policy community_likes_select_visible_or_own on public.community_likes
for select to authenticated
using (
  user_id = auth.uid()
  or exists (
    select 1
    from public.community_posts p
    where p.id = community_likes.post_id
      and p.status = 'published'
  )
);

drop policy if exists community_likes_insert_own_on_published_post on public.community_likes;
create policy community_likes_insert_own_on_published_post on public.community_likes
for insert to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.community_posts p
    where p.id = community_likes.post_id
      and p.status = 'published'
  )
);

drop policy if exists community_likes_delete_own on public.community_likes;
create policy community_likes_delete_own on public.community_likes
for delete to authenticated
using (user_id = auth.uid());

drop policy if exists community_reports_insert_own on public.community_reports;
create policy community_reports_insert_own on public.community_reports
for insert to authenticated
with check (reporter_user_id = auth.uid());

drop policy if exists community_reports_select_own on public.community_reports;
create policy community_reports_select_own on public.community_reports
for select to authenticated
using (reporter_user_id = auth.uid());

drop policy if exists community_notifications_select_own on public.community_notifications;
create policy community_notifications_select_own on public.community_notifications
for select to authenticated
using (recipient_user_id = auth.uid());

drop policy if exists community_notifications_update_own_read_at on public.community_notifications;
create policy community_notifications_update_own_read_at on public.community_notifications
for update to authenticated
using (recipient_user_id = auth.uid())
with check (recipient_user_id = auth.uid());

-- No browser/client insert policy for community_notifications in M110.
-- Like/reply notification creation should be added through a backend function
-- that verifies actor, recipient, post/comment ownership, idempotency, and rate limits.

-- Storage bucket draft for one public community image per post.
-- Community images are public content once posted; do not upload phone numbers,
-- addresses, ID cards, exact-location screenshots, or sensitive personal data.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'community-post-images',
  'community-post-images',
  true,
  3145728,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists community_post_images_public_read on storage.objects;
create policy community_post_images_public_read on storage.objects
for select to anon, authenticated
using (bucket_id = 'community-post-images');

drop policy if exists community_post_images_insert_own_folder on storage.objects;
create policy community_post_images_insert_own_folder on storage.objects
for insert to authenticated
with check (
  bucket_id = 'community-post-images'
  and (storage.foldername(name))[1] = auth.uid()::text
  and array_length(storage.foldername(name), 1) >= 2
);

drop policy if exists community_post_images_delete_own_folder on storage.objects;
create policy community_post_images_delete_own_folder on storage.objects
for delete to authenticated
using (
  bucket_id = 'community-post-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Expected object path:
-- community-post-images/{user_id}/{post_id}/{filename}
-- The app must still validate one image per post, allowed MIME type, and 3MB max
-- before upload. Staging must verify storage rejects wrong folders and oversized
-- or unsupported images where the Supabase project supports bucket limits.
