-- M116.3 Community comment replies + comment likes
-- Apply to staging first. Do not run in production without owner review.
-- This pack preserves V1 scope: top-level comments can have one level of replies only.

alter table public.community_comments
  add column if not exists parent_comment_id uuid references public.community_comments(id) on delete cascade;

create index if not exists community_comments_parent_comment_id_idx
  on public.community_comments (parent_comment_id);

create index if not exists community_comments_post_parent_created_at_idx
  on public.community_comments (post_id, parent_comment_id, created_at asc);

create table if not exists public.community_comment_likes (
  comment_id uuid not null references public.community_comments(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (comment_id, user_id)
);

create index if not exists community_comment_likes_user_id_idx
  on public.community_comment_likes (user_id);

create index if not exists community_comment_likes_comment_id_created_at_idx
  on public.community_comment_likes (comment_id, created_at desc);

alter table public.community_comment_likes enable row level security;

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
  and (
    parent_comment_id is null
    or exists (
      select 1
      from public.community_comments parent
      where parent.id = community_comments.parent_comment_id
        and parent.post_id = community_comments.post_id
        and parent.parent_comment_id is null
        and parent.status = 'published'
    )
  )
);

drop policy if exists community_comment_likes_select_visible_or_own on public.community_comment_likes;
create policy community_comment_likes_select_visible_or_own on public.community_comment_likes
for select to authenticated
using (
  user_id = auth.uid()
  or exists (
    select 1
    from public.community_comments c
    join public.community_posts p on p.id = c.post_id
    where c.id = community_comment_likes.comment_id
      and c.status = 'published'
      and p.status = 'published'
  )
);

drop policy if exists community_comment_likes_insert_own_on_published_comment on public.community_comment_likes;
create policy community_comment_likes_insert_own_on_published_comment on public.community_comment_likes
for insert to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.community_comments c
    join public.community_posts p on p.id = c.post_id
    where c.id = community_comment_likes.comment_id
      and c.status = 'published'
      and p.status = 'published'
  )
);

drop policy if exists community_comment_likes_delete_own on public.community_comment_likes;
create policy community_comment_likes_delete_own on public.community_comment_likes
for delete to authenticated
using (user_id = auth.uid());

comment on column public.community_comments.parent_comment_id is
  'M116.3 V1 one-level reply pointer. Null means top-level comment; replies should point to a top-level comment.';

comment on table public.community_comment_likes is
  'M116.3 separate like table for comments and one-level replies. One like per user per comment.';
