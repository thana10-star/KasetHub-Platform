# Offline Article Image Review Standard

M69 adds image review fixtures for pilot article assets.

## Required Fields

- image kind: cover or inline
- planned offline path
- Thai alt text
- aspect ratio
- max size target
- prompt note
- reviewed status

## M69 Rules

- Planned assets remain `planned_only`.
- No real image generation occurs.
- No external image or CDN URL is allowed.
- Missing alt text, missing offline path, external URL, or unreviewed status blocks final publish.

## Size Targets

- Cover image target: around 180KB or less.
- Inline image target: around 140KB or less.
- Prefer compressed `.webp`.
