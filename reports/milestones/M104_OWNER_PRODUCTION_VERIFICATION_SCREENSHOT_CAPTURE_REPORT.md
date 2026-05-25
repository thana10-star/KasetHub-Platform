# M104 Owner-Side Production Verification + Release Screenshot Capture Report

## 1. Summary

M104 prepares the owner-side production verification and release screenshot capture workflow.

The milestone adds concrete worksheets for GitHub/main checks, Cloudflare production deploy verification, Weather live env verification, real-phone route QA, AI safety QA, screenshot capture, store blocker tracking, and owner command/link references.

No product features were added. No real AI provider, Supabase writes, cloud sync, GPS/geolocation, OCR/image diagnosis, receipt upload, notifications, wrapper implementation, store submission automation, secrets, or Farm Records storage/schema changes were added.

## 2. Files Created

- `docs/release/OWNER_PRODUCTION_VERIFICATION_WORKSHEET_M104.md`
- `docs/release/RELEASE_SCREENSHOT_CAPTURE_WORKSHEET_M104.md`
- `docs/release/V1_RELEASE_BLOCKER_LOG_M104.md`
- `docs/release/M104_OWNER_COMMANDS_AND_LINKS.md`
- `reports/milestones/M104_OWNER_PRODUCTION_VERIFICATION_SCREENSHOT_CAPTURE_REPORT.md`

## 3. Files Modified

- `README.md`
- `docs/release/V1_STORE_RELEASE_CHECKLIST_M100_1.md`
- `docs/release/V1_RELEASE_GATE_M102.md`
- `docs/release/V1_OWNER_VERIFICATION_CHECKLIST_M103.md`

The modifications are concise cross-links to the M104 worksheets only.

No app code changes were made.

## 4. Owner Verification Worksheet Summary

Created `docs/release/OWNER_PRODUCTION_VERIFICATION_WORKSHEET_M104.md`.

It covers:

- GitHub/main confirmation
- production deploy trigger and success
- production and preview URL recording
- Cloudflare Weather env values
- `/app/weather` live forecast check
- no GPS prompt
- no console errors
- mobile route QA for `/app`, `/app/ai`, `/app/weather`, `/app/calculators`, `/app/my-farm`, `/app/farm-records`, `/app/help`, and `/app/profile`
- route checks for loading, horizontal scroll, Thai readability, bottom nav, and no obvious dev/prototype wording
- AI safety QA
- store blocker readiness

## 5. Screenshot Worksheet Summary

Created `docs/release/RELEASE_SCREENSHOT_CAPTURE_WORKSHEET_M104.md`.

It provides capture rows for:

- Home: `/app`
- AI: `/app/ai`
- Weather: `/app/weather`
- Tools: `/app/calculators`
- Plant spacing or fertilizer calculator
- My Farm: `/app/my-farm`
- Farm Records: `/app/farm-records`
- Help/Profile optional

Each row includes route, target device, orientation, what to show, caption, status checkbox, and notes.

The worksheet recommends Android phone portrait first, production URL, visible Thai text, no browser address bar when possible, no debug/dev text, and no personal data.

## 6. Release Blocker Log Summary

Created `docs/release/V1_RELEASE_BLOCKER_LOG_M104.md`.

The starter log includes known M103 blockers:

- Cloudflare Weather env not owner-verified
- real-device screenshot QA pending
- app icon final pending
- privacy policy URL pending
- support contact pending
- wrapper decision pending
- production AI provider disabled by design

The log includes fields for ID, route/screen, blocker type, severity, screenshot reference, fix owner, status, and notes.

## 7. Owner Commands / Links Summary

Created `docs/release/M104_OWNER_COMMANDS_AND_LINKS.md`.

It lists local verification commands:

- `git status --short`
- `git log --oneline --decorate -5`
- `npm run lint`
- `npm run build`
- `npm run test`
- `git diff --check`

It also includes Cloudflare Weather env values and the production routes to open.

## 8. Tests / Checks Run

- `npm run lint`: passed.
- `npm run build`: passed.
  - Vite still reports the existing large chunk warning.
- `npm run test`: passed.
  - 36 test files passed.
  - 330 tests passed.
- `git diff --check`: passed with line-ending warnings only.
- Built-app route smoke with temporary Vite preview: passed.
  - `/app` 200
  - `/app/ai` 200
  - `/app/weather` 200
  - `/app/calculators` 200
  - `/app/my-farm` 200
  - `/app/farm-records` 200
  - `/app/help` 200
  - `/app/profile` 200

Preview server was stopped after route smoke.

## 9. Remaining Owner-Side Actions

- Confirm GitHub `main` branch latest commit.
- Confirm no unintended PR is open.
- Set Cloudflare Weather production env vars.
- Trigger Cloudflare production deploy.
- Record production URL and preview URL if any.
- Open `/app/weather` on production and confirm live forecast loads.
- Confirm no GPS/geolocation prompt.
- Confirm no console errors on production.
- Run real-device mobile route QA.
- Capture final release screenshots.
- Approve final app icon.
- Prepare privacy policy URL.
- Choose support email/contact path.
- Decide release channel/wrapper path.

## 10. Known Limitations

- Codex cannot verify the owner Cloudflare production dashboard from this workspace.
- Codex cannot confirm production env values were saved in Cloudflare.
- Codex cannot capture real-device mobile screenshots from the owner phone.
- Codex cannot approve legal privacy/support wording for store release.
- Codex did not implement a wrapper or submit to any store.
- Static review did not find an obvious tiny primary-screen copy fix requiring an app code change; secondary QA/internal wording remains in team or QA areas.

## 11. Next Recommended Milestone

M105 should be an owner-results review and release-blocker triage milestone:

- owner fills the M104 worksheets
- owner attaches or references mobile screenshots
- release blockers are sorted by severity
- only small release-blocking layout/copy fixes are applied
- privacy/support/wrapper decisions are recorded before store submission work begins

## 12. Completion Checklist

- [x] Scope matched M104 only.
- [x] Owner production verification worksheet created.
- [x] Screenshot capture worksheet created.
- [x] Release blocker log created.
- [x] Owner commands/links doc created.
- [x] Cross-links updated.
- [x] No broad feature changes.
- [x] No AI provider enabled.
- [x] No Supabase writes.
- [x] No cloud sync.
- [x] No GPS/geolocation.
- [x] No secrets committed.
- [x] `npm run lint` passed.
- [x] `npm run build` passed.
- [x] `npm run test` passed.
- [x] `git diff --check` passed with line-ending warnings only.
- [x] Route smoke passed.
- [x] M104 report created.

