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

| ID | Route / screen | Blocker type | Severity | Screenshot reference | Fix owner | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| M104-B001 | `/app/weather` production | weather/env | blocker | TBD | Owner | open | Cloudflare Weather env not owner-verified yet. |
| M104-B002 | Core mobile routes | visual | blocker | TBD | Owner / dev | open | Real-device screenshot QA is pending. |
| M104-B003 | Store icon | store asset | blocker | TBD | Owner / designer | open | Final app icon approval pending. |
| M104-B004 | Privacy policy URL | privacy/support | blocker | TBD | Owner | open | Public privacy policy URL pending. |
| M104-B005 | Support contact | privacy/support | blocker | TBD | Owner | open | Support email/contact path pending. |
| M104-B006 | Release channel / wrapper | store asset | important | TBD | Owner | open | PWA vs Android wrapper path not finalized. |
| M104-B007 | AI provider | AI safety | accepted | N/A | Owner | accepted | Production AI provider remains disabled by design and must stay separate unless explicitly approved. |

## Blank Rows For New Findings

| ID | Route / screen | Blocker type | Severity | Screenshot reference | Fix owner | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| M104-B008 | | | | | | | |
| M104-B009 | | | | | | | |
| M104-B010 | | | | | | | |
| M104-B011 | | | | | | | |
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

