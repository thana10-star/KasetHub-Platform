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

| ID | Route / screen | Blocker type | Severity | Screenshot reference | Fix owner | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| M104-B001 | `/app/weather` production | weather/env | blocker | Owner production screenshots | Owner | resolved | Owner confirmed Cloudflare Weather env is working with live Open-Meteo data after production env setup. |
| M104-B002 | Core mobile routes | visual | blocker | Owner real-mobile check | Owner / dev | closed | M104.2 owner verified M104.1 on real mobile; Weather UI and navigation behavior are acceptable for V1. |
| M104-B003 | Store icon | store asset | blocker | TBD | Owner / designer | open | Final app icon approval pending. |
| M104-B004 | Privacy policy URL | privacy/support | blocker | TBD | Owner | open | Public privacy policy URL pending. |
| M104-B005 | Support contact | privacy/support | blocker | TBD | Owner | open | Support email/contact path pending. |
| M104-B006 | Release channel / wrapper | store asset | important | TBD | Owner | open | PWA vs Android wrapper path not finalized. |
| M104-B007 | AI provider | AI safety | accepted | N/A | Owner | accepted | Production AI provider remains disabled by design and must stay separate unless explicitly approved. |

## Blank Rows For New Findings

| ID | Route / screen | Blocker type | Severity | Screenshot reference | Fix owner | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| M104-B008 | `/app/weather` | visual | blocker | Owner mobile screenshots | Codex | closed | M104.1 moved current weather and location above source/API details; M104.2 owner real-mobile check passed. |
| M104-B009 | `/app/weather` | visual | blocker | Owner mobile screenshots | Codex | closed | M104.1 improved Weather risk colors and mobile risk cards; M104.2 owner real-mobile check passed. |
| M104-B010 | App route changes | visual | important | Owner mobile feedback | Codex | closed | M104.1 added route scroll-to-top while preserving hash anchors; M104.2 owner real-mobile check passed. |
| M104-B011 | Main app pages | visual | important | Owner mobile feedback | Codex | closed | M104.1 standardized shared header Home affordance with `กลับหน้าแรก`; M104.2 owner real-mobile check passed. |
| M104-B012 | | | | | | | |

## Release Rule

Fix only release-blocking issues found during owner verification:

- broken routes
- unreadable mobile layout
- misleading or unsafe copy
- Weather production/env failures
- visible secrets or debug text
- store-required privacy/support/asset gaps

Do not use this log to start broad product expansion.
