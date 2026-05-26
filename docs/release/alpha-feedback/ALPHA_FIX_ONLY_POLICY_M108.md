# Alpha Fix-only Policy M108

## Purpose

The first alpha feedback wave should improve launch quality without expanding product scope.

## Policy

During first alpha:

- Fix blockers.
- Fix confusing UX that prevents testers from understanding core flows.
- Fix broken routes.
- Fix unreadable mobile layouts.
- Fix misleading safety, AI, Weather, privacy, or support copy.
- Prefer small copy/layout/navigation fixes.

Do not:

- add large features from first feedback wave
- build Android wrapper before feedback confirms the app is useful
- enable risky AI provider behavior without separate approval
- add GPS/geolocation
- add cloud sync or Supabase writes
- add OCR, receipt upload, notifications, or payments
- change Farm Records storage/schema
- collect sensitive personal data

## What Counts As Fix Now

- route fails to load
- mobile page is unreadable
- bottom navigation or primary action is unusable
- Weather page is misleading or broken
- AI copy implies guaranteed correctness
- privacy/support path is missing before broader sharing
- tester cannot understand what to do on the first screen

## What Counts As Defer

- new crop modules
- new calculators beyond small copy fixes
- account/cloud sync
- native app wrapper
- AI provider launch
- GPS/location automation
- image diagnosis/OCR
- notifications
- marketplace/community expansion

## Review Rule

After each alpha fix:

- run lint/build/test/diff
- run route smoke
- update blocker/triage docs
- summarize what changed for the owner
