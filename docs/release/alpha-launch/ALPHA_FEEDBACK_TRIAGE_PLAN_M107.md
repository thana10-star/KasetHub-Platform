# Alpha Feedback Triage Plan M107

## Purpose

Use this plan after collecting the first alpha feedback responses. The goal is to fix launch blockers and learn, not to start a broad feature expansion immediately.

## Severity Buckets

Blocker:

- route does not load
- Weather production is broken
- mobile layout is unreadable or unusable
- privacy/support link is missing for public sharing
- copy makes unsafe or official/guaranteed claims
- users cannot understand the first screen or main navigation

Important:

- key flow is confusing but still usable
- AI/Weather/Tools copy needs safety clarification
- common tester complaint repeats across many responses
- tap target or text size issue affects several users

Minor:

- small copy polish
- small spacing/readability issue
- one-off browser/device issue with workaround

Idea:

- useful feature request
- new calculator idea
- content/topic request
- support workflow improvement

Not now:

- broad cloud sync requests
- GPS/notifications/OCR/receipt upload
- Android/iOS wrapper details before first feedback is reviewed
- requests that increase safety, privacy, or maintenance risk too early

## Feedback Categories

- AI
- Weather
- Tools
- My Farm
- UI/mobile
- speed/performance
- privacy/trust
- content ideas

## Triage Workflow

1. Collect first 20-50 feedback responses.
2. Group feedback by category.
3. Mark each item as blocker, important, minor, idea, or not now.
4. Fix blockers only first.
5. Re-run lint/build/test/diff and route smoke after any app changes.
6. Re-check owner mobile flows.
7. Decide whether to run another alpha round or start Android wrapper planning.

## Decision Rules

- Do not add many new features immediately.
- Do not enable AI provider, cloud sync, GPS, OCR, upload, notifications, or wrapper work as a side effect of feedback triage.
- If feedback asks for risky advice or guaranteed outcomes, improve safety copy rather than making stronger claims.
- If users ask for Android install, decide wrapper timing only after blockers and support/privacy readiness are stable.

## Recommended Next Step

After the first 20-50 responses:

- close release blockers
- fix only critical mobile/readability/safety issues
- summarize top requested improvements
- decide Android wrapper timing from actual user demand
