# M98 Mobile Preview Triage + Farmer Basic Flow QA Report

## 1. Summary

M98 ran a focused QA/polish pass on the production-facing farmer basic flow.

The main outcome is a calmer mobile path from Home to My Farm to Basic Farm Records Mode. My Farm keeps the basic actions prominent, advanced details are less dominant, and Farm Records form/list labels are more Thai-first.

## 2. Files Created

- `docs/ux/MOBILE_PREVIEW_TRIAGE_M98.md`
- `reports/milestones/M98_MOBILE_PREVIEW_TRIAGE_FARMER_BASIC_FLOW_QA_REPORT.md`

## 3. Files Modified

- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/MY_FARM_HUB_FOUNDATION.md`
- `docs/ux/BASIC_FARM_RECORDS_MODE_M97_1.md`
- `docs/ux/PRODUCTION_FACING_COPY_M97_2.md`
- `src/routes/MyFarmPage.tsx`
- `src/routes/MyFarmSettingsPage.tsx`
- `src/routes/FarmRecordsDebugPage.tsx`
- `src/routes/MyFarmPage.test.tsx`
- `src/routes/FarmRecordsDebugPage.test.tsx`
- `src/services/my-farm/my-farm-hub-service.ts`
- `src/services/my-farm/my-farm-hub-service.test.ts`
- `src/services/farm-records/farm-records-fixtures.ts`

Build-generated files were also refreshed by `npm run build`.

## 4. Mobile/Basic-flow QA Findings

- Browser preview was unavailable again, so no screenshot/mobile-device pass could be completed.
- Static route inspection found `/app/my-farm` still surfaced detailed Farm Records metrics and data-control status too early for the basic flow.
- Farm Records forms/lists still had some Thai/English mixed labels.
- Some seeded local Farm Records display labels still felt like demo/test data.
- Long Farm Records metric values needed extra wrapping protection.

## 5. Fixes Applied

- Moved My Farm detailed counts, Farm Records metrics, backup/restore/sync status, and Farm Cost Dashboard link behind a collapsed `ข้อมูลฟาร์มเพิ่มเติม` section.
- Kept My Farm first screen focused on `เปิดสมุดฟาร์ม`, `บันทึกรายรับ/รายจ่าย`, `บันทึกผลผลิต`, `กำไร/ขาดทุน`, and `ผลผลิตรวม`.
- Switched Farm Records activity, finance, unit, crop-cycle, plot status, and ledger direction labels to Thai-first text.
- Added `break-words` to Farm Records summary values.
- Cleaned local seeded Farm Records display copy so normal pages do not show `DEMO` labels.
- Calmed `/app/my-farm/settings` copy while preserving the boundary that account sync is off.

## 6. Routes Checked

HTTP 200 checks passed:

- `/app`
- `/app/my-farm`
- `/app/farm-records`
- `/app/help`
- `/app/profile`
- `/app/calculators`
- `/app/weather`
- `/app/ai`
- `/app/field-test-feedback`
- `/app/my-farm/settings`

## 7. Browser Connector Availability

The Browser connector was unavailable (`agent.browsers.list()` returned `[]`).

No browser screenshot, mobile overflow inspection, or console-error inspection was possible in the in-app browser.

## 8. Remaining Visual QA Items

When browser/mobile preview is available, still check:

- First screen of `/app`, `/app/my-farm`, and `/app/farm-records`.
- Add Plot, Add Finance, and Add Harvest forms at mobile width.
- Bottom nav readability.
- Thai text wrapping and horizontal overflow.
- Whether advanced Farm Records content still feels low-priority enough.

## 9. Tests/Checks Run

- `npm run lint` passed.
- `npm run build` passed. This runs `tsc -b`; no separate `npm run typecheck` script exists. Vite reported the existing large chunk warning.
- `npm run test` passed: 33 test files, 320 tests.
- `npm run test -- FarmRecordsDebugPage MyFarmPage AppHomePage ProfilePage` passed during development: 4 files, 29 tests.
- `git diff --check` passed with line-ending warnings only.

## 10. Known Limitations

- Visual mobile QA is still not complete because the Browser connector was unavailable.
- Advanced Farm Records export/restore/sync and internal/Admin/QA routes still contain technical wording by design.
- Farm Records remain local-first only; no cloud sync or backend storage was enabled.
- No legal-final PDPA copy was added.

## 11. Next Recommended Milestone

M99 should run a real mobile/browser screenshot QA pass when the Browser connector or a physical device is available, then fix any actual overflow, clipping, or tap-target issues found in the first Add Plot, Add Finance, and Add Harvest forms.
