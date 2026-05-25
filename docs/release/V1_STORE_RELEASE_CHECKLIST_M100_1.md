# V1 Store Release Checklist M100.1

## 1. Core Feature Readiness

AI:

- AI entry is obvious from Home and bottom nav.
- AI page explains users can ask agriculture questions in plain Thai.
- Every AI answer includes a safety note.
- High-risk answers avoid dangerous chemical, disease, finance, legal, and health claims.

Weather:

- Cloudflare Pages weather env vars are configured.
- `/app/weather` loads live Open-Meteo data when enabled.
- Fallback/backup data works when live weather is unavailable.
- No GPS/geolocation prompt appears.

Tools:

- calculators are mobile-safe.
- crop selector looks tappable.
- fertilizer/fertigation remains planning-only.
- pesticide/chemical calculation remains label-only and low prominence.

Knowledge:

- starter videos/articles are easy to find.
- YouTube audience feedback plan is ready.
- content links should support AI/weather/tools later without heavy CMS work.

My Farm:

- Farm Records remains Basic Mode by default.
- My Farm is simple and not the dominant V1 promise.
- export/restore/sync/data-control remain available but secondary.

## 2. UI/Mobile Polish

- no horizontal overflow on core routes
- Thai labels readable
- tap targets large enough
- bottom nav labels fit
- icons and colors feel consistent
- Home does not become crowded
- advanced/internal tools stay visually secondary

Core routes to preview:

- `/app`
- `/app/ai`
- `/app/weather`
- `/app/calculators`
- `/app/my-farm`
- `/app/help`
- `/app/profile`

## 3. Safety And Legal

- AI disclaimer visible under answers.
- Weather disclaimer visible on forecast/risk surfaces.
- Calculator disclaimer visible near estimates.
- Local data/privacy copy is calm and clear.
- No dangerous recommendations.
- No claim that AI/weather/calculators replace experts or official sources.
- Full legal-final PDPA copy remains a later item unless required before store submission.

## 4. Technical Release Checks

- `npm run lint`
- `npm run build`
- `npm run test`
- `git diff --check`
- route HTTP smoke
- Cloudflare main deploy
- production env vars verified
- no `.env.local` committed
- no API secrets in frontend bundle
- no Supabase writes or cloud sync enabled

## 5. Store Preparation Later

- app icon
- splash/launch image if wrapper requires it
- app screenshots
- short store description
- privacy policy URL
- support contact
- Android/iOS wrapper decision
- production domain/deep-link decision
- release/rollback checklist

## 6. Release Rule

Before V1, fix only things that improve launch quality:

- AI clarity
- Weather live/fallback readiness
- mobile layout
- confusing Thai copy
- safety notes
- route/deploy failures

Defer broad new systems until after the first store/testing release.

## 7. M102 Release Gate Addendum

M102 adds `docs/release/V1_RELEASE_GATE_M102.md` as the current release gate table.

The main blockers before store/testing release are:

- Cloudflare Weather live env verification
- real-device mobile screenshot QA
- store icon/screenshots/description
- privacy policy URL
- support contact
- Android/iOS/PWA wrapper decision

Do not start broad AI provider, cloud sync, GPS, OCR, receipt upload, notification, or Farm Records schema work before these release-gate items are decided.

## 8. M103 Release Assets Addendum

M103 adds the release-assets and owner-verification package:

- `docs/release/V1_OWNER_VERIFICATION_CHECKLIST_M103.md`
- `docs/release/STORE_LISTING_COPY_DRAFT_M103.md`
- `docs/release/STORE_SCREENSHOT_PLAN_M103.md`
- `docs/release/APP_ICON_AND_VISUAL_DIRECTION_M103.md`
- `docs/release/PRIVACY_SUPPORT_RELEASE_REQUIREMENTS_M103.md`
- `docs/release/APP_WRAPPER_DECISION_M103.md`

Use these docs to close owner-side checks before public store submission. They do not enable real AI, Supabase writes, cloud sync, GPS/geolocation, OCR/image diagnosis, receipt upload, notifications, or wrapper implementation.

## 9. M104 Owner Verification Addendum

M104 adds owner-side production verification worksheets:

- `docs/release/OWNER_PRODUCTION_VERIFICATION_WORKSHEET_M104.md`
- `docs/release/RELEASE_SCREENSHOT_CAPTURE_WORKSHEET_M104.md`
- `docs/release/V1_RELEASE_BLOCKER_LOG_M104.md`
- `docs/release/M104_OWNER_COMMANDS_AND_LINKS.md`

Use these during production deploy verification, mobile route QA, screenshot capture, and blocker tracking.
