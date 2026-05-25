# M92 Home First Farm Hub + Elder-Friendly Navigation Report

## 1. Summary

M92 makes My Farm / Farm Records visible from the app home screen. The milestone adds a prominent Home Farm Hub card with Thai-first copy, large primary actions, local Farm Records summary facts, and four elder-friendly quick actions.

M92 is UX/navigation only. It adds no Supabase schema, Supabase read/write, sync queue, cloud sync, GPS/geolocation/map pins, AI Farm Records processing, receipt upload, OCR, notifications, tax/bank/loan integrations, or backend feature changes.

## 2. Files Created

- `docs/ux/HOME_FIRST_NAVIGATION_M92.md`
- `reports/milestones/M92_HOME_FIRST_FARM_HUB_NAVIGATION_REPORT.md`
- `src/routes/AppHomePage.test.tsx`
- `src/routes/home-farm-hub-model.ts`

## 3. Files Modified

- `README.md`
- `docs/MY_FARM_HUB_FOUNDATION.md`
- `docs/PROJECT_BLUEPRINT.md`
- `src/routes/AdminDashboardPage.tsx`
- `src/routes/AppHomePage.tsx`
- `src/routes/QAPage.tsx`
- `src/services/admin/admin-dashboard-service.ts`
- `src/services/qa/mvp-readiness-audit.ts`
- `src/services/qa/route-registry.ts`

Verification/build also refreshed generated artifacts: `dist/index.html` and `tsconfig.app.tsbuildinfo`.

## 4. Navigation Audit Result

- `/app/my-farm` and `/app/farm-records` already existed and were registered.
- My Farm was visible from Profile and related feature pages, but not prominent on the first home screen.
- The Profile page contains many internal/admin/readiness entries, making it a poor discovery path for elderly or non-technical farmers.
- The bottom navigation stays unchanged in M92 to avoid route churn; profile/menu simplification is documented for a future milestone.

## 5. Home-first Farm Hub Behavior

`/app` now shows a large Home Farm Hub card after the hero area with:

- `ฟาร์มของฉัน`
- `บันทึกงานในฟาร์ม รายรับรายจ่าย ต้นทุน กำไร และผลผลิต`
- Primary action to `/app/my-farm`
- Secondary action to `/app/farm-records`
- Local summary facts from `kasethub.farmRecords.v1`
- Local-only copy explaining that the summary is from this device and not cloud synced

## 6. My Farm Entry Behavior

Home quick actions now link to:

- `/app/my-farm`
- `/app/farm-records`
- `/app/farm-records#farm-cost-dashboard`
- `/app/weather`

My Farm and Farm Records routes are preserved.

## 7. Elder-friendly/Mobile Readability Behavior

- Primary home actions use large tap targets.
- Thai action labels are short and allowed to wrap.
- The home Farm Hub summary is capped at four facts.
- Quick actions avoid technical wording such as dashboard, ledger, sync, and prototype.
- The card uses responsive grids and avoids horizontal table layouts.

## 8. Profile/Menu Simplification Notes

`docs/ux/HOME_FIRST_NAVIGATION_M92.md` documents the current navigation problem, elderly/non-technical farmer behavior assumptions, the recommended home/profile hierarchy, and a future bottom navigation proposal.

M92 does not remove profile entries or routes.

## 9. Tests/Checks Run

- `npm run lint` - passed.
- `npm run build` - passed. Vite emitted the existing large chunk size warning.
- `npm run test` - passed, 32 test files and 306 tests.
- Targeted M92 tests - passed, 3 test files and 15 tests.
- `git diff --check` - no whitespace errors; Git reported existing LF-to-CRLF working-copy warnings.
- `npm run typecheck` - not available as a separate package script; `npm run build` runs `tsc -b`.

## 10. Manual Verification Result

- `http://127.0.0.1:5173/app` returned HTTP 200.
- `http://127.0.0.1:5173/app/my-farm` returned HTTP 200.
- `http://127.0.0.1:5173/app/farm-records` returned HTTP 200.
- Automated tests verify the Home Farm Hub card, My Farm link, Farm Records link, cost dashboard link, quick actions, local summary model, and empty-state model.
- In-app Browser verification was attempted after reading the Browser plugin instructions, but `agent.browsers.list()` returned no browser targets. No screenshot, mobile-overflow, tap-target, or console-error browser check was available in this session.

## 11. Known Limitations

- Profile menu remains cluttered with internal/admin/readiness entries.
- Bottom navigation does not yet include a dedicated My Farm tab.
- No user research session with elderly farmers was performed in this milestone.
- No Supabase schema/read/write, sync queue, cloud sync, GPS/geolocation, AI record processing, receipt upload, OCR, notifications, or tax/bank/loan integration was added.

## 12. Next Recommended Milestone

M93 Elder-Friendly Navigation Cleanup: reduce profile/menu clutter, consider a dedicated My Farm bottom-nav slot, and separate farmer-facing navigation from internal/admin/QA surfaces while preserving all existing routes.
