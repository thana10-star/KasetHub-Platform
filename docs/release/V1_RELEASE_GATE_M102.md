# V1 Release Gate M102

## Purpose

M102 turns the AI-first V1 direction into a release gate. The goal is to show what is ready for testing release, what is blocked, and what the next action should be before store/V1 preparation.

## Release Gate Table

| Feature | V1 Status | Ready? | Blocker | Next action |
| --- | --- | --- | --- | --- |
| AI Farmer Assistant | UX is ready for farmer prompts, examples, fallback copy, and safety notes. Real provider is not enabled. | Partial | Production AI provider approval and safe backend/proxy configuration. | Keep local/fallback for now, then scope provider enablement separately. |
| Weather | Open-Meteo adapter is implemented, no API key is required, fallback works. | Partial | Cloudflare production env still needs owner verification. | Set Cloudflare env vars and verify `/app/weather` on production. |
| Tools/Calculators | Mobile UX and crop selector were improved; fertilizer/fertigation planning is safer. | Mostly ready | Owner mobile screenshot pass may still find narrow-width clipping. | Run final mobile preview and fix only visible layout/copy issues. |
| Knowledge/Help | Help/start guide exists, AI section exists, YouTube/content feedback plan exists. | Mostly ready | Starter content and store-facing copy still need owner review. | Pick the first useful article/video links for release preview. |
| My Farm Basic | Basic Farm Records Mode is available and My Farm stays secondary. | Mostly ready | Real-user field testing may reveal wording/form friction. | Keep as simple notebook and avoid expanding before V1. |
| Profile/Settings | Elder-friendly settings and collapsed advanced tools are available. | Mostly ready | Legal-final privacy/support content not complete. | Add final support/privacy links before public store release. |
| Privacy/Data Control | Export/restore/data control exists and remains local-first. | Mostly ready | Full legal PDPA text and support policy not final. | Prepare privacy policy URL and support contact. |
| Mobile UI | Main flow has been triaged, but Codex browser was often unavailable. | Partial | Final real-device screenshot QA still needed. | Owner checks Home, AI, Weather, Tools, My Farm, Profile on mobile. |
| Store assets | Not prepared in this milestone. | No | App icon, screenshots, description, and listing copy missing. | Scope a store-asset milestone after release gate approval. |
| Privacy policy/support contact | Not production-final. | No | Store-required public URL/contact not ready. | Decide support email/page and privacy policy URL. |
| Cloudflare deploy | Main branch builds and route smoke has passed locally. | Partial | Production deploy/env status is owner-side. | Verify main deploy and Weather env in Cloudflare Pages. |
| Android/iOS wrapper decision | Not decided. | No | Store wrapper strategy not selected. | Choose PWA, Android wrapper, iOS wrapper, or phased release path. |

## Gate Recommendation

KasetHub is close to a V1 testing release, but not ready for public store submission until these release blockers are closed:

- Cloudflare Weather live env verified
- real-device mobile screenshots checked
- store icon/screenshots/description prepared
- privacy policy URL prepared
- support contact prepared
- wrapper/release channel decision made

Do not add broad new product systems before these release blockers are resolved.

## M103 Owner Package Note

M103 adds the owner-verification and store-assets preparation package:

- `docs/release/V1_OWNER_VERIFICATION_CHECKLIST_M103.md`
- `docs/release/STORE_LISTING_COPY_DRAFT_M103.md`
- `docs/release/STORE_SCREENSHOT_PLAN_M103.md`
- `docs/release/APP_ICON_AND_VISUAL_DIRECTION_M103.md`
- `docs/release/PRIVACY_SUPPORT_RELEASE_REQUIREMENTS_M103.md`
- `docs/release/APP_WRAPPER_DECISION_M103.md`

These docs prepare the owner-side checks and store materials without changing the V1 feature scope.

## M104 Owner Verification Note

M104 adds concrete production verification and screenshot-capture worksheets:

- `docs/release/OWNER_PRODUCTION_VERIFICATION_WORKSHEET_M104.md`
- `docs/release/RELEASE_SCREENSHOT_CAPTURE_WORKSHEET_M104.md`
- `docs/release/V1_RELEASE_BLOCKER_LOG_M104.md`
- `docs/release/M104_OWNER_COMMANDS_AND_LINKS.md`

These docs guide owner-side production checks and release screenshot capture without changing V1 scope.
