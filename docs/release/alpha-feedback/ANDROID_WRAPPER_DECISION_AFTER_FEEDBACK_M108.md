# Android Wrapper Decision After Feedback M108

## Purpose

This framework decides when Android wrapper work should begin after the first alpha feedback round.

## Decision Inputs

- first 20-50 alpha feedback responses
- production URL stability
- Weather usefulness/readability
- AI usefulness and safety clarity
- Tools usefulness
- My Farm/Farm Records clarity
- mobile layout quality
- privacy/support readiness
- tester demand for install/native app

## Start Android Wrapper If

- 20-50 testers find AI, Weather, or Tools useful
- no blocker remains open
- production Weather is stable
- support contact and privacy URL are published
- owner accepts local-first data limitations
- several testers ask for easier install or home-screen/native app access
- screenshots/icon/listing are close enough for wrapper packaging

## Polish Web/PWA First If

- users are confused by Home or navigation
- AI/Weather/Tools usefulness is unclear
- mobile text/layout issues repeat
- privacy/support trust is not settled
- Weather or core routes still have blockers
- tester feedback mainly asks for clarity rather than install

## Reposition Before Wrapper If

- Weather is not useful to testers
- AI is not useful or creates trust concerns
- Tools are not understandable
- My Farm/Farm Records feels too complex for alpha users
- users do not understand the app's main promise

## Raise Wrapper Priority If

- most feedback asks for native install
- users struggle with browser/PWA access
- owner needs a store-like internal test track
- core flows are stable and useful
- support/privacy/icon/screenshot assets are ready

## Keep iOS Later

iOS remains later until:

- Android/PWA demand is proven
- support and privacy flows are stable
- mobile UI has passed another real-device round
- native permission scope is clearly controlled

## Decision Status

- Current decision: wait for first feedback round
- Android wrapper: not started
- iOS: later
- Native permissions: deferred
