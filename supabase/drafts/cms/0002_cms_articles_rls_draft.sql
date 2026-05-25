-- PLANNING ONLY
-- DO NOT RUN
-- DO NOT DEPLOY
-- REVIEW REQUIRED
--
-- KasetHub article CMS RLS draft.
-- This file is intentionally stored in supabase/drafts/cms, not supabase/migrations.
-- M74 does not execute SQL and does not write Supabase data.

-- Role checks below are placeholders. Future implementation must replace them
-- with backend-owned claims, membership tables, or reviewed auth checks.

-- alter table public.article_versions enable row level security;
-- alter table public.article_full_body_versions enable row level security;
-- alter table public.article_source_reviews enable row level security;
-- alter table public.article_expert_reviews enable row level security;
-- alter table public.article_image_assets enable row level security;
-- alter table public.article_release_gates enable row level security;
-- alter table public.article_release_audit_events enable row level security;
-- alter table public.article_release_attempts enable row level security;
-- alter table public.article_reviewer_history enable row level security;
-- alter table public.article_cms_overrides enable row level security;

-- Public read only published/released articles.
-- create policy "public_read_released_article_versions"
-- on public.article_versions
-- for select
-- using (content_status = 'ready_for_full_publish' and review_status = 'released');

-- Editors draft only. They may create/update drafts, but cannot set released.
-- create policy "content_editors_draft_only_article_versions"
-- on public.article_versions
-- for all
-- using (review_status in ('draft', 'review_pending'))
-- with check (review_status in ('draft', 'review_pending'));

-- Reviewers are scoped to their review table only.
-- create policy "agriculture_expert_review_scope"
-- on public.article_expert_reviews
-- for all
-- using (reviewer_role = 'agriculture_expert')
-- with check (reviewer_role = 'agriculture_expert');

-- create policy "safety_reviewer_review_scope"
-- on public.article_expert_reviews
-- for all
-- using (reviewer_role = 'safety_reviewer')
-- with check (reviewer_role = 'safety_reviewer');

-- create policy "image_reviewer_review_scope"
-- on public.article_image_assets
-- for update
-- using (review_status in ('planned_only', 'review_pending'))
-- with check (review_status in ('review_pending', 'reviewed'));

-- Release manager cannot bypass audit.
-- create policy "release_manager_requires_audit"
-- on public.article_release_gates
-- for update
-- using (release_audit_written = true and evidence_packet_complete = true)
-- with check (
--   release_audit_written = true
--   and evidence_packet_complete = true
--   and human_approval_required = true
-- );

-- Automation cannot final publish.
-- create policy "automation_cannot_final_publish"
-- on public.article_release_attempts
-- for insert
-- with check (
--   attempted_role <> 'automation'
--   and final_publish_allowed = false
-- );

-- Admin cannot silently bypass human release gate.
-- create policy "admin_release_requires_human_gate"
-- on public.article_release_gates
-- for update
-- using (human_approval_required = true)
-- with check (
--   human_approval_required = true
--   and human_approval_present = true
--   and release_reviewer_id is not null
--   and release_timestamp is not null
--   and release_note is not null
-- );

-- Service role backend only.
-- Service-role credentials must never be placed in frontend env.
-- Backend-owned jobs may write audit rows only after policy/release checks pass.

-- Drafts blocked from anon/public.
-- create policy "anon_cannot_read_unpublished_drafts"
-- on public.article_full_body_versions
-- for select
-- using (false);

