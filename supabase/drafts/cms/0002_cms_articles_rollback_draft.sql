-- PLANNING ONLY
-- DO NOT RUN
-- DO NOT DEPLOY
-- REVIEW REQUIRED
--
-- KasetHub article CMS rollback draft.
-- This file is intentionally stored in supabase/drafts/cms, not supabase/migrations.
-- M74 does not execute SQL and does not write Supabase data.

-- Rollback notes:
-- - Do not run without a staging backup.
-- - Do not run without dependency review.
-- - Do not remove bundled offline fallback content from the app.
-- - Confirm no production article publishing depends on these drafts.

-- Drop draft tables in dependency order.
-- drop table if exists public.article_cms_overrides;
-- drop table if exists public.article_reviewer_history;
-- drop table if exists public.article_release_attempts;
-- drop table if exists public.article_release_audit_events;
-- drop table if exists public.article_release_gates;
-- drop table if exists public.article_image_assets;
-- drop table if exists public.article_expert_reviews;
-- drop table if exists public.article_source_reviews;
-- drop table if exists public.article_full_body_versions;
-- drop table if exists public.article_versions;

-- Existing public.articles, if present before this draft, should not be dropped here.
-- Offline bundled article fixtures remain in frontend source and are not affected by database rollback.

