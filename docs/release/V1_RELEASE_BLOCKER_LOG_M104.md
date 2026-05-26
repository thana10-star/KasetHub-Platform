# V1 Release Blocker Log M104

## Purpose

Use this log to track owner-side production verification, screenshot, privacy/support, and store-readiness blockers before V1 release.

Severity guide:

- `blocker`: must be resolved before public release or store submission.
- `important`: should be resolved before release unless explicitly accepted.
- `minor`: can be fixed after release if it does not mislead users or break core flows.

Status guide:

- `open`
- `in progress`
- `blocked`
- `resolved`
- `closed`
- `accepted`

## Blocker Types

- visual
- copy
- broken route
- weather/env
- AI safety
- privacy/support
- store asset

## Log

M104.2 note: Owner verified M104.1 on a real mobile device. Weather UI and navigation behavior are acceptable for V1.

M105 note: Store-readiness decision docs were created for icon direction, privacy structure, support contact options, release channel, and final screenshot capture.

M106 note: The final V1 package lock was created under `docs/release/v1-package/` for owner approval. Remaining open/in-progress items require owner-published URLs, files, or captures.

M107 note: The owner publication and alpha feedback launch pack was created under `docs/release/alpha-launch/`. This prepares sharing and feedback collection but does not close owner-pending URL, support, icon, or screenshot blockers.

| ID | Route / screen | Blocker type | Severity | Screenshot reference | Fix owner | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| M104-B001 | `/app/weather` production | weather/env | blocker | Owner production screenshots | Owner | resolved | Owner confirmed Cloudflare Weather env is working with live Open-Meteo data after production env setup. |
| M104-B002 | Core mobile routes | visual | blocker | Owner real-mobile check | Owner / dev | closed | M104.2 owner verified M104.1 on real mobile; Weather UI and navigation behavior are acceptable for V1. |
| M104-B003 | Store icon | store asset | blocker | M106 package icon status | Owner / designer | in progress | M106 icon approval status exists; remains in progress until owner-approved icon files exist and are exported. |
| M104-B004 | Privacy policy URL | privacy/support | blocker | M106 privacy public draft | Owner | open | M106 public privacy page draft exists; remains open until owner publishes a public privacy policy URL. |
| M104-B005 | Support contact | privacy/support | blocker | M106 support public copy | Owner | open | M106 support copy exists; remains open until owner selects and publishes support email or Google Form. |
| M104-B006 | Release channel / wrapper | store asset | important | M106 release channel lock | Owner | closed | M105/M106 decision locked: Cloudflare/PWA preview first, Android wrapper next candidate after feedback, iOS later. |
| M104-B007 | AI provider | AI safety | accepted | N/A | Owner | accepted | Production AI provider remains disabled by design and must stay separate unless explicitly approved. |

## Blank Rows For New Findings

| ID | Route / screen | Blocker type | Severity | Screenshot reference | Fix owner | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| M104-B008 | `/app/weather` | visual | blocker | Owner mobile screenshots | Codex | closed | M104.1 moved current weather and location above source/API details; M104.2 owner real-mobile check passed. |
| M104-B009 | `/app/weather` | visual | blocker | Owner mobile screenshots | Codex | closed | M104.1 improved Weather risk colors and mobile risk cards; M104.2 owner real-mobile check passed. |
| M104-B010 | App route changes | visual | important | Owner mobile feedback | Codex | closed | M104.1 added route scroll-to-top while preserving hash anchors; M104.2 owner real-mobile check passed. |
| M104-B011 | Main app pages | visual | important | Owner mobile feedback | Codex | closed | M104.1 standardized shared header Home affordance with `กลับหน้าแรก`; M104.2 owner real-mobile check passed. |
| M104-B012 | Store screenshots/listing | store asset | important | M106 package screenshot status | Owner | in progress | M106 final listing draft and screenshot status tracker exist; remains in progress until screenshots are captured and owner-approved. |

## Release Rule

Fix only release-blocking issues found during owner verification:

- broken routes
- unreadable mobile layout
- misleading or unsafe copy
- Weather production/env failures
- visible secrets or debug text
- store-required privacy/support/asset gaps

Do not use this log to start broad product expansion.
