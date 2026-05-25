# M103 V1 Release Assets + Owner Verification Package Report

## 1. Summary

M103 prepares the V1 owner-verification and store-assets package without adding new feature systems.

The milestone creates owner-side checklists, Thai-first store listing copy, screenshot planning, app icon/visual direction, privacy/support release requirements, and wrapper decision notes. V1 scope remains frozen.

No real AI provider, Supabase writes, cloud sync, GPS/geolocation, OCR/image diagnosis, receipt upload, notifications, Farm Records storage/schema changes, wrapper implementation, store submission automation, or secrets were added.

## 2. Files Created

- `docs/release/V1_OWNER_VERIFICATION_CHECKLIST_M103.md`
- `docs/release/STORE_LISTING_COPY_DRAFT_M103.md`
- `docs/release/STORE_SCREENSHOT_PLAN_M103.md`
- `docs/release/APP_ICON_AND_VISUAL_DIRECTION_M103.md`
- `docs/release/PRIVACY_SUPPORT_RELEASE_REQUIREMENTS_M103.md`
- `docs/release/APP_WRAPPER_DECISION_M103.md`
- `reports/milestones/M103_V1_RELEASE_ASSETS_OWNER_VERIFICATION_PACKAGE_REPORT.md`

## 3. Files Modified

- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/release/V1_RELEASE_GATE_M102.md`
- `docs/release/V1_STORE_RELEASE_CHECKLIST_M100_1.md`

These updates are concise cross-links/status notes only.

## 4. Owner Verification Checklist Summary

Created a V1 owner checklist covering:

- Cloudflare Weather production env vars:
  - `VITE_WEATHER_MODE=open_meteo_ready`
  - `VITE_ENABLE_REAL_WEATHER_API=true`
  - `VITE_WEATHER_DEFAULT_LAT=13.7563`
  - `VITE_WEATHER_DEFAULT_LON=100.5018`
  - `VITE_WEATHER_DEFAULT_LABEL=กรุงเทพฯ`
- production deploy trigger
- `/app/weather` live forecast verification
- no GPS/geolocation prompt
- no visible env/provider/debug labels in primary farmer UI
- real-phone route checks for `/app`, `/app/ai`, `/app/weather`, `/app/calculators`, `/app/my-farm`, `/app/farm-records`, `/app/help`, and `/app/profile`
- screenshot capture list and store readiness blockers

## 5. Store Listing Copy Summary

Created a Thai-first listing copy draft with:

- app name options: `KasetHub` and `KasetHub เกษตรผู้ช่วย`
- three short-description options
- long description focused on Ask AI, Weather, Tools, Knowledge, My Farm, and local-first V1 data
- safety note for AI/weather/calculator usage
- no-overclaim rules
- keyword list for Thai agriculture discovery

The draft avoids claims that AI is always correct, replaces experts, is an official government tool, guarantees yield/profit, provides official weather warnings, or guarantees pesticide dosage certainty.

## 6. Screenshot Plan Summary

Created a route-based screenshot plan for:

- Home: `/app`
- Ask AI: `/app/ai`
- Weather: `/app/weather`
- Tools/Calculators: `/app/calculators`
- My Farm: `/app/my-farm`
- Farm Records Basic Mode: `/app/farm-records`
- Help/Profile: `/app/help` and `/app/profile`

Each screenshot includes purpose, suggested Thai caption, and what must be visible.

## 7. Icon / Visual Direction Summary

Created app icon and visual direction guidance:

- concept: green leaf + AI spark + farm field
- readable at small size
- Thai agriculture friendly
- modern but trustworthy
- suggested palette: green, warm yellow, soil brown, white/cream
- avoid official-looking seals, fake certification, pesticide/chemical imagery, and excessive detail
- includes an image-generation prompt for future owner use

## 8. Privacy / Support Requirements Summary

Created release requirements for:

- privacy policy URL before store release
- support email/contact before store release
- local-first Farm Records explanation
- AI data explanation if a real provider is enabled later
- coarse weather location explanation
- no GPS/geolocation in current V1
- no cloud sync in current V1 unless separately enabled
- future Thai privacy policy structure
- user deletion/export notes
- support path expectations

M103 does not write final legal policy text.

## 9. Wrapper Decision Summary

Created wrapper decision notes comparing:

- PWA only for early testing
- Android WebView wrapper
- Capacitor
- Expo / React Native later

Recommendation:

1. Start with Cloudflare web / PWA-style preview first.
2. Use real-device feedback and owner audience feedback.
3. Move to Android wrapper if needed.
4. Do not rush iOS until product feedback is clear.

Push notifications, GPS/geolocation, camera/OCR, receipt upload, cloud sync, and native permissions remain deferred.

## 10. Tests / Checks Run

- `npm run lint`: passed.
- `npm run build`: passed.
  - Vite still reports the existing large chunk warning.
- `npm run test`: passed.
  - 36 test files passed.
  - 330 tests passed.
- `git diff --check`: passed with line-ending warnings only.
- Route smoke with built Vite preview: passed.
  - `/app` 200
  - `/app/ai` 200
  - `/app/weather` 200
  - `/app/calculators` 200
  - `/app/my-farm` 200
  - `/app/farm-records` 200
  - `/app/help` 200
  - `/app/profile` 200

Preview server was stopped after route smoke.

## 11. Remaining Owner-Side Actions

- Set and verify Cloudflare Weather production env vars.
- Trigger production deploy.
- Open `/app/weather` on production and confirm live forecast loads.
- Confirm no GPS prompt.
- Confirm no visible env/provider/debug labels in primary farmer UI.
- Run real-device mobile route QA.
- Capture final screenshots.
- Approve final app icon.
- Publish or prepare privacy policy URL.
- Choose support email/contact path.
- Decide release channel/wrapper path.
- Keep production AI provider/backend decision separate and disabled until explicitly approved.

## 12. Next Recommended Milestone

M104 should be an owner-side production verification and release-asset capture milestone:

- verify Cloudflare Weather live production behavior
- capture real-device mobile screenshots
- confirm final privacy/support URLs
- decide PWA vs Android wrapper path
- fix only release-blocking mobile/layout/copy issues found during owner QA

## 13. Completion Checklist

- [x] Scope matched M103 only.
- [x] Owner verification checklist created.
- [x] Store listing copy draft created.
- [x] Store screenshot plan created.
- [x] Icon/visual direction doc created.
- [x] Privacy/support requirements doc created.
- [x] Wrapper decision doc created.
- [x] No broad features added.
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
- [x] M103 report created.

