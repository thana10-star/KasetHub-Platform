# V1 Release Channel Decision M105

## Purpose

This document records the V1 release-channel decision after M104.2 owner mobile verification. It does not implement a wrapper, submit to stores, or add native permissions.

## Option 1. Cloudflare Web / PWA Preview

Pros:

- fastest way to collect real user feedback
- already aligned with the production Weather verification path
- no app store review delay
- easy to update after owner/user feedback
- no native permissions required

Risks:

- less discoverable than a store listing
- users may need guidance to add to home screen
- store screenshots and icon still need separate final production later

Best use:

- V1 alpha feedback
- owner-guided tester group
- final mobile checks before wrapper work

## Option 2. Android WebView Wrapper

Pros:

- quickest store-like path after the web/PWA preview
- can reuse the current Cloudflare app
- good first native target for Thai farmer testing

Risks:

- WebView behavior and storage persistence must be tested
- store policy requirements apply
- app updates must not surprise users with local data loss
- native permissions should remain off unless separately scoped

Best use:

- next candidate after Cloudflare/PWA feedback
- Android alpha/internal testing

## Option 3. Capacitor Android Wrapper

Pros:

- more structured wrapper path than a minimal WebView
- can later support Android store packaging with clearer build tooling
- leaves room for carefully scoped native integrations in later milestones

Risks:

- adds setup/build complexity
- requires safe-area, routing, storage, and update testing
- may tempt premature GPS, camera, notification, or file permissions

Best use:

- if Android wrapper work needs a maintained framework rather than a minimal WebView

## Option 4. iOS Later

Pros:

- eventual broader platform coverage
- useful if the product proves strong with mobile testers

Risks:

- slower review and packaging path
- more device/layout testing
- not needed before first V1 feedback

Best use:

- later, after product feedback and Android/PWA learnings

## Recommendation

- For fastest feedback: Cloudflare web/PWA preview first.
- For store-like testing: Android wrapper next.
- Do not rush iOS before product feedback.
- Keep native permissions deferred.

## Decision Status

- V1 alpha feedback: Cloudflare/PWA preview
- Android wrapper: next candidate
- iOS: later

## Deferred Native Permissions

Do not request these in V1 release-channel work:

- GPS/geolocation
- camera or OCR/image diagnosis
- receipt upload
- notifications
- cloud sync/background jobs
- payment
- contacts/files permissions

## Wrapper Readiness Notes

Before Android wrapper work begins, verify:

- local Farm Records data persistence after app restart
- local data behavior after app update
- export/restore path remains visible
- privacy/support URL is public
- final icon and screenshots are approved
- store listing does not claim official, guaranteed, or expert-replacement results
