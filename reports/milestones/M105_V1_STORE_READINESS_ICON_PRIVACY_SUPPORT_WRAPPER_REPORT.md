# M105 V1 Store Readiness: Icon, Privacy, Support, Wrapper Report

## 1. Summary

M105 prepares the remaining V1 store-readiness decisions after M104.2 closed the Weather/navigation blockers.

This milestone created final planning docs for the app icon, privacy policy structure, support contact path, release channel/wrapper direction, and store screenshot checklist. No app source code changes were made. No wrapper was implemented.

## 2. Files Created

- `docs/release/APP_ICON_FINAL_BRIEF_M105.md`
- `docs/release/PRIVACY_POLICY_DRAFT_STRUCTURE_M105.md`
- `docs/release/SUPPORT_CONTACT_DECISION_M105.md`
- `docs/release/V1_RELEASE_CHANNEL_DECISION_M105.md`
- `docs/release/STORE_SCREENSHOT_FINAL_CHECKLIST_M105.md`
- `reports/milestones/M105_V1_STORE_READINESS_ICON_PRIVACY_SUPPORT_WRAPPER_REPORT.md`

## 3. Files Modified

- `docs/release/V1_RELEASE_BLOCKER_LOG_M104.md`

Reviewed and left unchanged:

- `docs/release/STORE_LISTING_COPY_DRAFT_M103.md`

Generated build artifacts remained modified after the requested build:

- `dist/index.html`
- `tsconfig.app.tsbuildinfo`

## 4. App Icon Final Brief Summary

The M105 icon brief finalizes a simple V1 direction:

- green leaf
- subtle AI spark or digital helper cue
- farm field / soil base
- readable at small sizes

It documents what to avoid: government seal look, fake certification badges, pesticide/chemical imagery, tiny clutter, and Thai text inside the icon. It also includes three prompt variants and future export targets, including a `1024x1024` master and later Android adaptive/web/PWA sizes.

No image files were generated.

## 5. Privacy Policy Draft Structure Summary

The privacy structure is Thai-first and explicitly not legal-final.

It covers:

- app data used in V1, including local Farm Records, Weather coarse location, calculator inputs, and future AI questions if enabled
- data not used in V1, including precise GPS, cloud sync, receipt upload, OCR, notifications, payment, and real user accounts if not enabled
- local-first Farm Records behavior and browser/uninstall caveats
- Weather using coarse location and Open-Meteo
- AI safety language for any later provider enablement
- user choices for export/delete/contact support
- owner placeholders for support and privacy URLs

## 6. Support Contact Decision Summary

The support decision doc compares:

- email support
- Google Form
- Facebook Page / YouTube community
- LINE Official later
- in-app support later

Recommendation for V1: start with a simple support email or Google Form. Do not add in-app chat yet.

Owner placeholders remain:

- support email: TBD
- support form URL: TBD
- YouTube channel: owner can add later

## 7. Release Channel / Wrapper Decision Summary

The release channel doc compares:

- Cloudflare web/PWA preview
- Android WebView wrapper
- Capacitor Android wrapper
- iOS later

Decision status:

- V1 alpha feedback: Cloudflare/PWA preview
- Android wrapper: next candidate
- iOS: later

Native permissions remain deferred.

## 8. Screenshot Final Checklist Summary

The final screenshot checklist covers:

- Home AI-first
- Ask AI
- Weather live
- Tools
- Calculator detail
- My Farm
- Farm Records Basic
- Help/Profile optional

Each row includes route, caption, must-show, avoid-showing, and status. The checklist reinforces avoiding debug/internal labels, personal data, browser address bar when possible, and unfinished status labels.

## 9. Blocker Log Updates

Updated `docs/release/V1_RELEASE_BLOCKER_LOG_M104.md`:

- Store icon moved to `in progress` because the final icon brief exists, but owner approval/export is still pending.
- Privacy policy URL remains `open` until a public URL exists.
- Support contact remains `open` until the owner picks and publishes an email or form URL.
- Release channel / wrapper moved to `closed` with M105 decision: Cloudflare/PWA preview first, Android wrapper next candidate, iOS later.
- Store screenshots/listing added as `in progress` because the final checklist exists, but final capture and owner approval are still pending.
- Weather/navigation blockers remain closed.

## 10. Tests / Checks Run

- `npm run lint`: passed.
- `npm run build`: passed.
  - Vite still reports the existing large chunk warning.
- `npm run test`: passed.
  - 38 test files passed.
  - 335 tests passed.
- `git diff --check`: passed.
  - Git reported line-ending normalization warnings only.

Route smoke against local built preview passed:

- `/app`: passed.
- `/app/ai`: passed.
- `/app/weather`: passed.
- `/app/calculators`: passed.
- `/app/my-farm`: passed.
- `/app/farm-records`: passed.
- `/app/help`: passed.
- `/app/profile`: passed.

The temporary preview server was stopped after route smoke.

## 11. Remaining Owner Decisions

- Approve final app icon concept and generated/exported assets.
- Publish or record final privacy policy URL.
- Pick and publish support email or Google Form URL.
- Capture and approve final store screenshots.
- Finalize store listing package using the existing M103 copy draft.
- Decide when to start Android wrapper implementation after Cloudflare/PWA alpha feedback.

## 12. Next Recommended Milestone

M106 should be final owner store asset publication and release package lock:

- owner selects final support contact
- owner publishes privacy URL
- owner approves final icon asset
- owner captures/approves screenshots
- store listing copy is locked
- blocker log is updated to close remaining owner-pending store items

## Completion Checklist

- [x] Scope matched M105 only.
- [x] App icon final brief created.
- [x] Privacy policy draft structure created.
- [x] Support contact decision doc created.
- [x] V1 release channel decision doc created.
- [x] Store screenshot final checklist created.
- [x] Blocker log updated.
- [x] No broad features added.
- [x] No AI provider enabled.
- [x] No Supabase writes.
- [x] No cloud sync.
- [x] No GPS/geolocation.
- [x] No wrapper implemented.
- [x] No secrets committed.
- [x] `npm run lint` passed.
- [x] `npm run build` passed.
- [x] `npm run test` passed.
- [x] `git diff --check` passed.
- [x] Route smoke passed.
- [x] M105 report created.
