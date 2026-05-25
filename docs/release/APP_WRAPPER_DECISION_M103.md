# App Wrapper Decision M103

## Purpose

This document compares release-channel options for KasetHub V1. It documents the decision space only. M103 does not start Android, iOS, PWA, or store submission implementation.

## Option 1: PWA Only For Early Testing

Pros:

- Fastest way to get real user feedback from the Cloudflare web app.
- No app store review required for the first testing loop.
- Keeps the release focused on Weather, AI UX, tools, and basic Farm Records.
- Easier to fix copy/layout issues quickly.

Cons:

- Less discoverable than app stores.
- Some users may not know how to install a PWA to the home screen.
- Store-style screenshots and icon can still be prepared, but native store presence is deferred.

Store implications:

- No Google Play/App Store submission yet.
- Privacy/support links still recommended before wider public sharing.

## Option 2: Android WebView Wrapper

Pros:

- Faster native-store path than a full app rewrite.
- Can reuse the existing Cloudflare web app.
- Android is often the practical first store target for Thai farmer testing.

Cons:

- Needs wrapper maintenance and store policy checks.
- WebView behavior can differ from mobile browsers.
- Offline/local storage behavior must be tested carefully.
- Any future native permissions must be handled cautiously.

Store implications:

- Requires app icon, screenshots, privacy policy URL, support contact, app content rating, and store listing copy.
- Should avoid requesting permissions that V1 does not need.

## Option 3: Capacitor

Pros:

- More structured wrapper path than a minimal WebView.
- Can package the existing web app for Android and later iOS.
- Leaves room for carefully scoped native capabilities later.

Cons:

- Adds build and release complexity.
- Requires testing storage, routing, safe-area layout, and updates.
- Native permissions can create scope creep if not controlled.

Store implications:

- Similar store requirements to Android WebView.
- Push notifications and GPS should remain deferred unless separately scoped.

## Option 4: Expo / React Native Later

Pros:

- Better long-term native app foundation if KasetHub becomes mobile-first.
- Can provide deeper native UX later.
- Useful if future product direction requires native camera, offline workflows, or device APIs.

Cons:

- Slowest path for V1.
- Likely requires rebuilding screens and state flows.
- Higher risk of delaying user feedback.

Store implications:

- Native store requirements still apply.
- Not recommended before V1 feedback unless the product strategy changes.

## Recommendation

For fastest V1 feedback:

1. Start with Cloudflare web / PWA-style preview first.
2. Use real-device mobile checks and owner audience feedback.
3. Move to Android wrapper if users need store install or home-screen distribution.
4. Do not rush iOS until product feedback is clear.

## Deferred Capabilities

Keep these deferred for V1 wrapper decisions:

- push notifications
- GPS/geolocation
- camera/OCR/image diagnosis
- receipt upload
- cloud sync
- background jobs
- native contacts/files permissions

## Offline And Local Storage Caution

Farm Records are local-first in V1. Before wrapping the app, verify:

- localStorage persists after app restart
- app updates do not wipe local data
- export/restore remains easy to find
- users understand cloud sync is off
- screenshots and support docs do not imply cloud backup exists

