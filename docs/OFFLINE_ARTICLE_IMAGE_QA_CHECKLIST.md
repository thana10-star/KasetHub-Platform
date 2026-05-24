# Offline Article Image QA Checklist

M66 adds image QA planning for offline agriculture articles.

## Required Metadata

Each article should have:

- planned local path
- Thai alt text
- future prompt note
- supported aspect ratio
- offline size warning
- `planned_asset` status until optimized files are intentionally added

## Offline Image Rules

- Offline mode must not depend on external image URLs.
- Prefer compressed `.webp`.
- Use one cover per article.
- Add only one to three inline images for important articles.
- Avoid heavy raw images and base64 blobs.

## Current Boundary

M66 keeps images as planned metadata and UI placeholders. No real image generation, CDN loading, or bundled heavy assets were added.

