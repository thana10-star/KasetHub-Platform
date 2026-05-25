# Offline Article Content QA

M66 adds a local-only QA layer for the M65 offline agriculture article library.

## QA Checks

The QA service checks:

- title exists
- summary exists
- category exists
- outline sections exist
- required disclaimers exist
- planned image metadata exists
- no external image URL is used
- finance articles include finance disclaimer
- fertilizer or chemical-adjacent articles include label disclaimer
- body readiness is clear
- source status is clear

## Current Route

`/app/articles/offline-qa` shows article count, category count, score summary, articles needing full content, image warnings, disclaimer coverage, CMS override rules, and a no-network/offline-safe notice.

## Boundary

M66 does not add full official articles, Supabase writes, CMS writes, AI article generation, image generation, external image loading, or sponsor content.

## M67 Full-content Readiness

M67 adds `/app/articles/full-content-readiness` for pilot full-article templates. QA now distinguishes between safe offline outlines and future full article drafts. A pilot full article remains blocked until sources, reviewer metadata, safety notes, image metadata, freshness dates when needed, and expert escalation notes are complete.
