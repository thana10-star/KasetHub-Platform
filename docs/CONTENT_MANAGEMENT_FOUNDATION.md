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
