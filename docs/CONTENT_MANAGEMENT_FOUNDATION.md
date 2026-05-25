# Content Management Foundation

M20 defines the first content management and publishing foundation for KasetHub without adding a production CMS.

## Current Scope

- Article, video, and knowledge-post domain types live in `src/services/content/content.types.ts`.
- Taxonomy, authors, and tag fixtures live in `src/services/content/content-taxonomy.ts`.
- Article bodies, related content, offline cache versions, and video content projections live in `src/services/content/content-fixtures.ts`.
- `/app/articles` renders the content fixture list with search, category, and difficulty filters.
- `/app/articles/:articleId` renders article body sections, checklists, safety notes, related articles/videos, save/share actions, and offline body cache metadata.
- `/app/content-admin-preview` gives a local editor/admin preview of inventory, publishing status, import candidates, and cache readiness.

## Publishing Model

Content status values:

- `draft`
- `review`
- `scheduled`
- `published`
- `archived`

Content source values:

- `manual`
- `youtube_import`
- `ai_assisted`
- `community_curated`

These statuses are frontend planning fields only in M20. They do not create CMS records, audit logs, database rows, moderation events, or scheduled jobs.

## Content Boundaries

M20 does not add:

- production CMS
- backend content API
- Supabase article/video writes
- YouTube API calls
- transcript fetching
- AI article generation
- service worker or Cache API storage
- admin authentication or role checks

All content is local fixture data.

## M24 Admin Dashboard Connection

M24 adds `/app/admin` as a local/mock overview for content operations. The dashboard reads M20 article/video fixtures and the YouTube import planner to show:

- draft/review/published counts
- YouTube import readiness
- content review tasks
- audit log previews

This does not publish content, approve imports, write CMS records, call YouTube, fetch transcripts, or change server state.

## Owner YouTube Channel Config

M22.5 adds the real KasetHub owner channel link as static config:

- `src/config/channel.ts`
- `youtubeChannelUrl = "https://www.youtube.com/@ruengkaset"`

The configured URL is used by the YouTube channel hero CTA, YouTube import planner, and content admin preview owner-channel source. It does not call YouTube API, fetch channel data, add API keys, scrape, or replace the current mock videos.

## Future CMS Requirements

A real content system should add:

- backend-owned create/update/publish endpoints
- editor, reviewer, moderator, and admin roles
- audit trail for status changes
- preview and scheduled publish workflows
- versioned article bodies
- media ownership checks
- safety review gates for disease, fertilizer, pesticide, pricing, and AI-assisted claims
- public read APIs that expose only published content
- RLS or backend authorization aligned with the M18 schema draft

## M65 Offline Agriculture Article Library

M65 adds a separate offline-first agriculture article foundation:

- `src/services/content/offline-agri-article.types.ts`
- `src/services/content/offline-agri-article-taxonomy.ts`
- `src/services/content/offline-agri-article-fixtures.ts`
- `src/services/content/offline-agri-article-service.ts`
- `/app/articles/offline`
- `/app/articles/offline/:slug`

The M65 library bundles evergreen Thai agriculture article outlines and starter snippets for offline reading. It covers soil, water, fertilizer, rice, sugarcane, cassava, and farm finance. It does not replace the M20 article fixtures; it prepares a more CMS-compatible schema for future Supabase content.

M65 still does not add Supabase writes, backend CMS writes, AI article generation, YouTube import, sponsor/affiliate injection, external image URLs, or network calls.

## M66 Offline Article QA And CMS Contract

M66 adds `offline-agri-article-qa.ts` and `offline-agri-cms-override.ts` to harden the M65 library before full article content is added.

The QA layer checks metadata, outline sections, required disclaimers, image metadata, version fixtures, and body/source readiness. The CMS override contract blocks disclaimer removal, external offline images, stale title/summary updates, and missing freshness dates for finance/government/seasonal content.

`/app/articles/offline-qa` surfaces the current QA score and warnings without calling a backend or CMS.

## M67 Offline Article Full-content Readiness

M67 adds pilot full-content draft templates for five article topics and a readiness route at `/app/articles/full-content-readiness`.

The new service layer prepares source placeholders, review requirements, image requirements, expert escalation notes, and publish blockers. All templates remain `draft_template`; none are official full articles.

M67 still does not write CMS records, generate article text with AI, generate real images, load external images, add sponsor content, or hardcode official finance/loan/government facts.
