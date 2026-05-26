# M109 Community Schema And RLS Draft

Draft only. Not applied.

## Schema

```sql
create table public.community_posts (
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
  status text not null default 'published' check (status in ('published', 'hidden', 'deleted', 'reported', 'pending_review')),
  like_count integer not null default 0,
  comment_count integer not null default 0,
  report_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.community_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  author_user_id uuid not null references auth.users(id) on delete cascade,
  author_display_name text,
  content_text text not null,
  status text not null default 'published' check (status in ('published', 'hidden', 'deleted', 'reported')),
  report_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.community_likes (
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table public.community_reports (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.community_posts(id) on delete cascade,
  comment_id uuid references public.community_comments(id) on delete cascade,
  reporter_user_id uuid not null references auth.users(id) on delete cascade,
  reason text not null,
  note text,
  created_at timestamptz not null default now(),
  check (post_id is not null or comment_id is not null)
);

create table public.community_notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_user_id uuid not null references auth.users(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  post_id uuid references public.community_posts(id) on delete cascade,
  comment_id uuid references public.community_comments(id) on delete cascade,
  type text not null check (type in ('post_liked', 'post_replied', 'comment_replied', 'post_reported_system')),
  title text not null,
  body text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
```

## Indexes

```sql
create index community_posts_status_created_idx on public.community_posts (status, created_at desc);
create index community_posts_author_idx on public.community_posts (author_user_id);
create index community_posts_category_idx on public.community_posts (category);
create index community_comments_post_created_idx on public.community_comments (post_id, created_at);
create index community_comments_author_idx on public.community_comments (author_user_id);
create index community_reports_post_idx on public.community_reports (post_id);
create index community_reports_comment_idx on public.community_reports (comment_id);
create index community_notifications_recipient_created_idx on public.community_notifications (recipient_user_id, created_at desc);
create index community_notifications_read_idx on public.community_notifications (recipient_user_id, read_at);
```

## RLS Draft

```sql
alter table public.community_posts enable row level security;
alter table public.community_comments enable row level security;
alter table public.community_likes enable row level security;
alter table public.community_reports enable row level security;
alter table public.community_notifications enable row level security;

create policy community_posts_read_published
on public.community_posts
for select to anon, authenticated
using (status = 'published');

create policy community_posts_insert_own
on public.community_posts
for insert to authenticated
with check (author_user_id = auth.uid());

create policy community_posts_update_own
on public.community_posts
for update to authenticated
using (author_user_id = auth.uid())
with check (author_user_id = auth.uid());

create policy community_posts_delete_own
on public.community_posts
for delete to authenticated
using (author_user_id = auth.uid());

create policy community_comments_read_published
on public.community_comments
for select to anon, authenticated
using (
  status = 'published'
  and exists (
    select 1 from public.community_posts p
    where p.id = post_id and p.status = 'published'
  )
);

create policy community_comments_insert_own
on public.community_comments
for insert to authenticated
with check (author_user_id = auth.uid());

create policy community_comments_update_own
on public.community_comments
for update to authenticated
using (author_user_id = auth.uid())
with check (author_user_id = auth.uid());

create policy community_comments_delete_own
on public.community_comments
for delete to authenticated
using (author_user_id = auth.uid());

create policy community_likes_select_own
on public.community_likes
for select to authenticated
using (user_id = auth.uid());

create policy community_likes_insert_own
on public.community_likes
for insert to authenticated
with check (user_id = auth.uid());

create policy community_likes_delete_own
on public.community_likes
for delete to authenticated
using (user_id = auth.uid());

create policy community_reports_insert_own
on public.community_reports
for insert to authenticated
with check (reporter_user_id = auth.uid());

create policy community_notifications_select_own
on public.community_notifications
for select to authenticated
using (recipient_user_id = auth.uid());

create policy community_notifications_update_own
on public.community_notifications
for update to authenticated
using (recipient_user_id = auth.uid())
with check (recipient_user_id = auth.uid());
```

## Storage Draft

Bucket: `community-post-images`

Object path pattern: `{owner_user_id}/{post_id}/{image_id}.{ext}`

Policies must allow authenticated users to upload/delete only paths under their own user id. Public read should be decided separately; private signed URLs are safer for early launch.
