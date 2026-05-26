# Release Channel Decision Lock M106

## Locked Direction

- V1 feedback: Cloudflare/PWA preview
- Android wrapper: after first feedback round
- iOS: later
- Native permissions: deferred
- AI provider backend: separate future milestone
- Cloud sync: separate future milestone

## Rationale

Cloudflare/PWA preview is the lowest-risk first release path because it:

- gets feedback fastest
- avoids app-store delay before user validation
- keeps fixes lightweight after early tester feedback
- avoids native permission scope creep
- keeps local-first Farm Records behavior simpler to explain
- lets the owner test with the existing YouTube audience before packaging a store wrapper

## Android Wrapper Timing

Android wrapper work should start after:

- first feedback round is complete
- support contact is chosen
- privacy URL is published
- icon is approved
- screenshots are captured and approved
- local storage persistence is tested inside wrapper context

## iOS Timing

iOS remains later. Start iOS only after:

- PWA/Android feedback confirms product demand
- support/privacy/store assets are stable
- native scope is clearly controlled

## Deferred Native Permissions

Do not request these in the V1 feedback package:

- GPS/geolocation
- camera or OCR/image diagnosis
- receipt upload
- notifications
- contacts/files permissions
- payment permissions
- background jobs

## Separate Future Tracks

AI provider backend remains separate:

- no provider key in frontend
- no real AI provider enablement in this package
- backend/proxy/safety policy must be approved separately

Cloud sync remains separate:

- no Supabase writes
- no cloud backup claim
- no account/sync promise until implemented and verified

## Owner Lock Fields

- Production URL: TBD
- First feedback audience: owner YouTube audience / selected testers
- Android wrapper start decision date: TBD
- Android wrapper owner approval: TBD
