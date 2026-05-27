-- M116.12 Community report anti-abuse guard
-- Apply manually in Supabase staging after confirming the M110 community schema exists.
-- This keeps V1 simple: one authenticated user can report a given post/comment once.

create unique index if not exists community_reports_unique_post_report
on public.community_reports (reporter_user_id, post_id)
where post_id is not null;

create unique index if not exists community_reports_unique_comment_report
on public.community_reports (reporter_user_id, comment_id)
where comment_id is not null;
