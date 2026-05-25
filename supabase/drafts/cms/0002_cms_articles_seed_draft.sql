-- PLANNING ONLY
-- DO NOT RUN
-- DO NOT DEPLOY
-- REVIEW REQUIRED
--
-- KasetHub article CMS seed draft.
-- This file is intentionally stored in supabase/drafts/cms, not supabase/migrations.
-- M74 does not execute SQL and does not write Supabase data.

-- Seed idea: offline article categories.
-- insert into public.article_versions (...) values (...);
-- Categories should map from bundled offline taxonomy:
-- soil, water, fertilizer, rice, sugarcane, cassava, farm_finance.

-- Seed idea: pilot article mapping.
-- soil-types-before-planting should map to the bundled offline fallback.
-- No final publish state should be seeded without human release approval.

-- Seed idea: reviewer role fixtures.
-- content_editor, agriculture_expert, safety_reviewer, image_reviewer,
-- release_manager, admin should be represented in backend role tables
-- only after RBAC design review.

-- Seed idea: release gate fixtures.
-- Seed blocked release gates only:
-- evidence_packet_complete = false
-- release_audit_written = false
-- human_approval_required = true
-- human_approval_present = false
-- final_publish_allowed = false

-- Seed idea: fallback article fixtures.
-- CMS invalid or missing -> app must keep bundled offline article available.

-- Do not seed:
-- - real official source claims
-- - finance/loan/government claims without freshness metadata
-- - sponsor/affiliate content
-- - external image URLs for offline mode
-- - final publish rows

