-- M116.13 Community moderation review dashboard support
-- Apply manually in Supabase staging after review. This file does not use or expose service-role keys.

create table if not exists public.admin_moderators (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'admin',
  created_at timestamptz not null default now(),
  constraint admin_moderators_role_check check (role in ('admin', 'moderator'))
);

alter table public.admin_moderators enable row level security;

alter table public.community_reports
  add column if not exists status text not null default 'pending',
  add column if not exists reviewed_at timestamptz,
  add column if not exists reviewed_by uuid references auth.users(id),
  add column if not exists action_note text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'community_reports_status_check'
      and conrelid = 'public.community_reports'::regclass
  ) then
    alter table public.community_reports
      add constraint community_reports_status_check
      check (status in ('pending', 'reviewed', 'dismissed', 'action_taken'));
  end if;
end $$;

create index if not exists community_reports_status_created_at_idx
on public.community_reports (status, created_at desc);

create or replace function public.is_community_admin()
returns boolean
language sql
security definer
set search_path = public, auth
stable
as $$
  select exists (
    select 1
    from public.admin_moderators moderator
    where moderator.user_id = auth.uid()
      and moderator.role in ('admin', 'moderator')
  );
$$;

create or replace function public.get_community_report_queue()
returns table (
  id uuid,
  reason text,
  note text,
  reporter_user_id uuid,
  target_type text,
  target_id uuid,
  target_preview text,
  target_author_display_name text,
  created_at timestamptz,
  status text,
  reviewed_at timestamptz
)
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.is_community_admin() then
    raise exception 'not community admin' using errcode = '42501';
  end if;

  return query
  select
    report.id,
    report.reason,
    report.note,
    report.reporter_user_id,
    case when report.comment_id is not null then 'comment' else 'post' end as target_type,
    coalesce(report.comment_id, report.post_id) as target_id,
    left(coalesce(comment.content_text, post.content_text, ''), 240) as target_preview,
    coalesce(comment.author_display_name, post.author_display_name) as target_author_display_name,
    report.created_at,
    report.status,
    report.reviewed_at
  from public.community_reports report
  left join public.community_posts post on post.id = report.post_id
  left join public.community_comments comment on comment.id = report.comment_id
  order by
    case when report.status = 'pending' then 0 else 1 end,
    report.created_at desc;
end;
$$;

create or replace function public.mark_community_report_reviewed(target_report_id uuid)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.is_community_admin() then
    raise exception 'not community admin' using errcode = '42501';
  end if;

  update public.community_reports
  set
    status = 'reviewed',
    reviewed_at = now(),
    reviewed_by = auth.uid()
  where id = target_report_id;
end;
$$;

create or replace function public.hide_reported_post(target_post_id uuid)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.is_community_admin() then
    raise exception 'not community admin' using errcode = '42501';
  end if;

  update public.community_posts
  set
    status = 'hidden',
    updated_at = now()
  where id = target_post_id;

  update public.community_reports
  set
    status = 'action_taken',
    reviewed_at = coalesce(reviewed_at, now()),
    reviewed_by = coalesce(reviewed_by, auth.uid()),
    action_note = coalesce(action_note, 'hidden post')
  where post_id = target_post_id
    and status = 'pending';
end;
$$;

create or replace function public.hide_reported_comment(target_comment_id uuid)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.is_community_admin() then
    raise exception 'not community admin' using errcode = '42501';
  end if;

  update public.community_comments
  set
    status = 'hidden',
    updated_at = now()
  where id = target_comment_id;

  update public.community_reports
  set
    status = 'action_taken',
    reviewed_at = coalesce(reviewed_at, now()),
    reviewed_by = coalesce(reviewed_by, auth.uid()),
    action_note = coalesce(action_note, 'hidden comment')
  where comment_id = target_comment_id
    and status = 'pending';
end;
$$;

grant execute on function public.is_community_admin() to authenticated;
grant execute on function public.get_community_report_queue() to authenticated;
grant execute on function public.mark_community_report_reviewed(uuid) to authenticated;
grant execute on function public.hide_reported_post(uuid) to authenticated;
grant execute on function public.hide_reported_comment(uuid) to authenticated;

-- Owner setup example after applying the draft:
-- insert into public.admin_moderators (user_id, email, role)
-- values ('OWNER_AUTH_USER_UUID', 'owner@example.com', 'admin')
-- on conflict (user_id) do update set email = excluded.email, role = excluded.role;
