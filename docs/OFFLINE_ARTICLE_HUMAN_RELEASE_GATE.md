# Offline Article Human Release Gate

M70 separates article readiness from article release.

Even if source metadata, reviewer sign-offs, image review, safety notes, freshness date, and escalation notes are complete, the article cannot be final-published automatically.

## Required Future Release Fields

- explicit human approval flag
- release reviewer
- release timestamp
- release note

## M70 Status

All release fields remain placeholders. `finalPublishAllowed` remains `false`.

This prevents a future CMS, automation, or AI-assisted workflow from treating completed metadata as permission to publish.
