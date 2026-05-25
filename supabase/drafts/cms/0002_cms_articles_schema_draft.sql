-- PLANNING ONLY
-- DO NOT RUN
-- DO NOT DEPLOY
-- REVIEW REQUIRED
--
-- KasetHub article CMS schema draft.
-- This file is intentionally stored in supabase/drafts/cms, not supabase/migrations.
-- M74 does not execute SQL and does not write Supabase data.

-- Existing public/articles table, if present, should remain the public-read content surface.
-- These draft tables are for future reviewed CMS persistence only.

create table if not exists public.article_versions (
  id uuid primary key default gen_random_uuid(),
  article_id uuid references public.articles(id) on delete cascade,
  future_cms_key text not null,
  slug text not null,
  title_th text not null,
  summary_th text not null,
  content_status text not null check (content_status in ('outline_only', 'starter_content', 'reviewed_draft', 'ready_for_full_publish')),
  review_status text not null default 'draft',
  offline_fallback_priority integer not null default 100,
  created_by uuid,
  reviewed_by uuid,
  last_reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.article_full_body_versions (
  id uuid primary key default gen_random_uuid(),
  article_version_id uuid not null references public.article_versions(id) on delete cascade,
  body_sections jsonb not null default '[]'::jsonb,
  template_version text not null,
  status text not null default 'draft',
  source_placeholder_status text not null default 'pending',
  safety_disclaimer_status text not null default 'required',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.article_source_reviews (
  id uuid primary key default gen_random_uuid(),
  article_version_id uuid not null references public.article_versions(id) on delete cascade,
  source_title text not null,
  source_type text not null,
  source_owner_organization text,
  citation_placeholder text,
  field_applicability_note_th text,
  freshness_date date,
  confidence text not null default 'placeholder',
  reviewer_id uuid,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.article_expert_reviews (
  id uuid primary key default gen_random_uuid(),
  article_version_id uuid not null references public.article_versions(id) on delete cascade,
  reviewer_role text not null,
  reviewer_id uuid,
  review_status text not null default 'pending',
  note_th text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.article_image_assets (
  id uuid primary key default gen_random_uuid(),
  article_version_id uuid references public.article_versions(id) on delete cascade,
  asset_role text not null check (asset_role in ('cover', 'inline')),
  storage_path text,
  offline_planned_path text,
  alt_text_th text not null,
  aspect_ratio text not null,
  byte_size integer,
  review_status text not null default 'planned_only',
  reviewer_id uuid,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.article_release_gates (
  id uuid primary key default gen_random_uuid(),
  article_version_id uuid not null references public.article_versions(id) on delete cascade,
  evidence_packet_complete boolean not null default false,
  release_audit_written boolean not null default false,
  human_approval_required boolean not null default true,
  human_approval_present boolean not null default false,
  release_reviewer_id uuid,
  release_note text,
  release_timestamp timestamptz,
  final_publish_allowed boolean not null default false,
  blockers text[] not null default array[]::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.article_release_audit_events (
  id uuid primary key default gen_random_uuid(),
  article_version_id uuid not null references public.article_versions(id) on delete cascade,
  release_gate_id uuid references public.article_release_gates(id) on delete set null,
  event_type text not null,
  actor_id uuid,
  actor_role text,
  status text not null default 'blocked',
  note_th text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.article_release_attempts (
  id uuid primary key default gen_random_uuid(),
  article_version_id uuid not null references public.article_versions(id) on delete cascade,
  release_gate_id uuid references public.article_release_gates(id) on delete set null,
  attempted_by uuid,
  attempted_role text,
  status text not null default 'blocked',
  blocked_reasons text[] not null default array[]::text[],
  final_publish_allowed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.article_reviewer_history (
  id uuid primary key default gen_random_uuid(),
  article_version_id uuid not null references public.article_versions(id) on delete cascade,
  reviewer_role text not null,
  reviewer_id uuid,
  before_status text,
  after_status text,
  note_th text,
  changed_at timestamptz not null default now()
);

create table if not exists public.article_cms_overrides (
  id uuid primary key default gen_random_uuid(),
  article_id uuid references public.articles(id) on delete cascade,
  article_version_id uuid references public.article_versions(id) on delete set null,
  future_cms_key text not null,
  cms_version_id text not null,
  override_status text not null default 'draft',
  title_th text,
  summary_th text,
  body_sections jsonb,
  safety_notes jsonb not null default '[]'::jsonb,
  freshness_date date,
  offline_fallback_required boolean not null default true,
  blockers text[] not null default array[]::text[],
  created_by uuid,
  created_at timestamptz not null default now()
);

-- Draft indexes for review only.
create index if not exists article_versions_future_cms_key_idx on public.article_versions(future_cms_key);
create index if not exists article_versions_slug_idx on public.article_versions(slug);
create index if not exists article_release_events_version_idx on public.article_release_audit_events(article_version_id);
create index if not exists article_cms_overrides_key_idx on public.article_cms_overrides(future_cms_key);

