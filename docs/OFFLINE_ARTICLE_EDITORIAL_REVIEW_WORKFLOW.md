# Offline Article Editorial Review Workflow

M69 adds a local-only editorial QA workflow for offline agriculture articles before any pilot article can become final.

## Reviewer Roles

- `content_editor`
- `agriculture_expert`
- `safety_reviewer`
- `image_reviewer`

All M69 sign-offs are placeholders and remain `pending`.

## Current Pilot Coverage

- `soil-types-before-planting`: richer reviewed draft candidate, still blocked
- `soil-ph-reading-yourself`: second low-risk draft template, fallback mapped to `soil-types-before-planting`

## Publish Boundary

No article can be marked final until every required sign-off, source metadata item, image review item, safety disclaimer, and final human review is represented.

M69 does not write CMS data, call Supabase, generate articles with AI, generate images, load external images, or inject sponsors.

## M70 Evidence Packet Layer

M70 adds a separate evidence packet and human release gate. This means a pilot can show completed source/reviewer/image metadata in a local simulation and still remain blocked until an explicit human release approval is represented.

The editorial review workflow is therefore not the same as final publish.
