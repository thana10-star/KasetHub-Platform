# M92.1 Home Farm Hub Compact Fix Report

## 1. Summary

M92.1 compacts the Home Farm Hub on `/app`. Real mobile preview showed the M92 card was too tall and pushed down AI, calculators, weather, videos, knowledge, and engagement entry points.

The Home Farm Hub now acts as a simple My Farm launcher. Detailed Farm Records metrics remain in `/app/my-farm` and `/app/farm-records`.

## 2. Files Created

- `reports/milestones/M92_1_HOME_FARM_HUB_COMPACT_FIX_REPORT.md`

## 3. Files Modified

- `README.md`
- `docs/MY_FARM_HUB_FOUNDATION.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/ux/HOME_FIRST_NAVIGATION_M92.md`
- `reports/milestones/M92_HOME_FIRST_FARM_HUB_NAVIGATION_REPORT.md`
- `src/routes/AdminDashboardPage.tsx`
- `src/routes/AppHomePage.tsx`
- `src/routes/AppHomePage.test.tsx`
- `src/routes/QAPage.tsx`
- `src/routes/home-farm-hub-model.ts`
- `src/services/admin/admin-dashboard-service.ts`
- `src/services/qa/mvp-readiness-audit.ts`
- `src/services/qa/route-registry.ts`

Verification/build also refreshed generated artifacts: `dist/index.html`, `node_modules/.vite/deps/_metadata.json`, and `tsconfig.app.tsbuildinfo`.

## 4. UI Change

The Home Farm Hub now shows only:

- `ฟาร์มของฉัน`
- `บันทึกงานในฟาร์ม รายรับรายจ่าย ต้นทุน และผลผลิต`
- A single primary button: `เปิดฟาร์มของฉัน`

The button links to `/app/my-farm`.

## 5. Removed From Home

The home card no longer shows:

- Profit/loss.
- Cost per kg.
- Latest harvest.
- Latest record.
- Cost dashboard quick action.
- Weather quick action inside the Farm Hub card.
- 2x2 Farm Records quick-action grid.
- Dense Farm Records metrics.

## 6. Preserved Detail Routes

- `/app/my-farm` still renders Farm Records status and details.
- `/app/farm-records` still renders Farm Records, cost dashboard, harvest/yield, export, restore, and sync consent prototype sections.
- Existing routes are preserved.

## 7. Privacy/Scope

M92.1 is navigation-only. It adds no Supabase read/write, sync queue, cloud sync, GPS/geolocation, AI Farm Records processing, receipt upload, OCR, notifications, tax/bank/loan integrations, or Farm Records local storage changes.

## 8. Tests/Checks Run

- `npm run lint` - passed.
- `npm run build` - first parallel run timed out while full tests were also running; rerun alone with a longer timeout passed. Vite emitted the existing large chunk size warning.
- `npm run test` - passed, 32 test files and 307 tests.
- Targeted M92.1 route tests - passed, 3 test files and 16 tests.
- `git diff --check` - no whitespace errors; Git reported existing LF-to-CRLF working-copy warnings.
- `npm run typecheck` - not available as a separate package script; `npm run build` runs `tsc -b`.

## 9. Manual Verification Result

- `http://127.0.0.1:5173/app` returned HTTP 200.
- `http://127.0.0.1:5173/app/my-farm` returned HTTP 200.
- `http://127.0.0.1:5173/app/farm-records` returned HTTP 200.
- Automated tests verify the compact Home card, `/app/my-farm` primary link, removal of detailed home metrics, preserved My Farm details, and preserved Farm Records route rendering.
- In-app Browser verification was attempted after reading the Browser plugin instructions, but `agent.browsers.list()` returned no browser targets. No screenshot, mobile-overflow, or console-error browser check was available in this session.

## 10. Known Limitations

- No dedicated screenshot/mobile artifact because the Browser connector had no available target.
- Profile menu remains cluttered and should be cleaned up in a future navigation milestone.

## 11. Next Recommended Milestone

M93 Elder-Friendly Navigation Cleanup: simplify Profile/internal route discovery and consider a dedicated My Farm bottom navigation slot without removing existing routes.
