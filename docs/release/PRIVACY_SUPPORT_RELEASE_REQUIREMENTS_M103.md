# Privacy And Support Release Requirements M103

## Purpose

This document lists privacy and support requirements for V1 release preparation. It is not a final legal privacy policy.

Before public store submission, KasetHub needs a clear Thai privacy policy URL and a support contact path.

## Required Before Store Release

- [ ] Public privacy policy URL.
- [ ] Support email or support contact page.
- [ ] Store listing privacy answers aligned with actual V1 behavior.
- [ ] Thai user-facing privacy text reviewed by the owner.
- [ ] User data deletion/export notes reviewed for local-first V1 behavior.

## Data Explanation For V1

Farm Records:

- Farm Records are local-first in V1.
- Records can include plots, crop cycles, activities, finance entries, and harvest/production information.
- Current V1 does not enable cloud sync unless separately approved in a future milestone.
- Local records can reveal business-sensitive information, so screenshots and support messages should avoid exposing real private data.

AI questions:

- Real AI provider execution is not enabled in the current V1 scope.
- If a real AI provider is enabled later, the privacy policy must explain what questions are sent, where they are processed, retention expectations, safety filtering, and whether farm data is included.
- Farm Records should not be sent to AI automatically without a separate consent and privacy review.

Weather:

- Weather V1 uses coarse default location settings such as city/province-center coordinates.
- Current V1 does not request GPS/geolocation.
- Current V1 should not store precise farm or home coordinates.
- Weather information is for planning support, not official emergency warning.

Cloud sync:

- Current V1 does not enable cloud sync unless separately approved.
- Future sync would require explicit consent, authenticated ownership, owner-scoped access controls, export/delete support, retention rules, and a rollback plan.

## Draft Privacy Policy Structure For Later

A future final Thai privacy policy should cover:

1. Who operates KasetHub and how to contact support.
2. What data the app stores locally.
3. What data may be sent to services if live AI, weather, analytics, auth, or sync are enabled.
4. What data is not collected in current V1, including no GPS/geolocation and no cloud sync by default.
5. How users can export, delete, or reset local Farm Records data.
6. How support requests are handled.
7. Safety notes for AI, weather, calculators, and farm records.
8. Data retention and deletion expectations.
9. Changes to the policy.

## Support Contact Requirements

Before public release, choose one:

- support email, such as `support@...`
- website contact form
- social/contact page controlled by the owner

Support copy should tell users:

- how to report a problem
- what app version/device/browser they should include
- not to send private financial, farm, or identity details unless necessary
- that emergency weather, chemical, medical, legal, and financial decisions should use trusted official or expert sources

## Not Final Legal Text

M103 does not write a final legal policy. The owner should review the final privacy policy and support flow before public store submission.

