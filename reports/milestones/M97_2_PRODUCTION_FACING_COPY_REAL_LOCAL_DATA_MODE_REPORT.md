# M97.2 Production-Facing Copy + Real Local Data Mode Report

## 1. Summary

M97.2 cleans normal farmer-facing copy so KasetHub feels like a real local-first farmer app instead of a test build.

The main app now treats Farm Records and My Farm as real local user data, while technical warnings remain available in Profile data/privacy, Farm Records export/restore/sync, and advanced/internal areas.

## 2. Files Created

- `docs/ux/PRODUCTION_FACING_COPY_M97_2.md`
- `reports/milestones/M97_2_PRODUCTION_FACING_COPY_REAL_LOCAL_DATA_MODE_REPORT.md`

## 3. Files Modified

- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/MY_FARM_HUB_FOUNDATION.md`
- `docs/ux/BASIC_FARM_RECORDS_MODE_M97_1.md`
- `docs/ux/ELDER_FRIENDLY_SETTINGS_POLISH_M94.md`
- `src/routes/AppHomePage.tsx`
- `src/routes/MyFarmPage.tsx`
- `src/routes/FarmRecordsDebugPage.tsx`
- `src/routes/HelpPage.tsx`
- `src/routes/ProfilePage.tsx`
- `src/routes/WeatherPage.tsx`
- `src/routes/AIPage.tsx`
- `src/routes/CalculatorsPage.tsx`
- `src/routes/AppHomePage.test.tsx`
- `src/routes/MyFarmPage.test.tsx`
- `src/routes/FarmRecordsDebugPage.test.tsx`
- `src/routes/ProfilePage.test.tsx`
- `src/services/account/account-status-service.ts`
- `src/services/agri-calculators/agri-calculator-fixtures.ts`

Build-generated files were also refreshed by `npm run build`.

## 4. User-facing Copy Cleanup

Normal surfaces no longer lead with local/mock/prototype/test wording:

- Home notification copy now reads like a real app summary.
- My Farm uses `รายการที่บันทึกไว้`, `สมุดฟาร์มของฉัน`, and `บันทึกในเครื่องนี้`.
- Basic Farm Records uses a calm local-data note instead of repeated sync/GPS warnings.
- Help, Weather, AI, and Calculators avoid test-build wording in their primary areas.
- Calculator QA/AI planning cards moved behind `ข้อมูลเพิ่มเติม / ขั้นสูง`.

## 5. Real Local Data Mode Behavior

Farm Records data is presented as data the farmer saves on this device.

The UI now uses copy such as:

- `ข้อมูลฟาร์มของคุณ`
- `รายการที่บันทึกไว้`
- `สมุดฟาร์มของฉัน`
- `ข้อมูลนี้บันทึกไว้ในเครื่องนี้`

No Farm Records schema, storage key, export/restore behavior, sync consent state, or backend behavior changed.

## 6. Warning Relocation Behavior

Detailed technical warnings remain available in the right places:

- Profile `ข้อมูลและความเป็นส่วนตัว`
- `/app/farm-records#farm-records-export`
- `/app/farm-records#farm-records-restore`
- `/app/farm-records#farm-records-sync`
- collapsed Profile `สำหรับทีมงานหรือทดสอบ`
- Admin/QA/internal routes

Normal Home, My Farm, Help, and Farm Records basic mode no longer put sync/export/prototype warnings before the main farmer actions.

## 7. Advanced/Admin/QA Preservation

Admin, QA, staging, readiness, sync prototype, export, restore, and internal links were preserved.

Profile advanced remains collapsed by default, and Farm Records advanced/data-control anchors still render.

## 8. Tests/Checks Run

- `npm run lint` passed.
- `npm run build` passed. This runs `tsc -b`; no separate `npm run typecheck` script exists. Vite reported the existing large chunk warning.
- `npm run test` passed: 33 test files, 320 tests.
- `npm run test -- FarmRecordsDebugPage ProfilePage MyFarmPage` passed during development: 3 files, 25 tests.
- `git diff --check` passed with line-ending warnings only.

## 9. Manual Verification Result

Dev server was already running at `http://127.0.0.1:5173`.

HTTP 200 checks passed:

- `/app`
- `/app/my-farm`
- `/app/farm-records`
- `/app/help`
- `/app/profile`
- `/app/field-test-feedback`

The Browser connector was unavailable again (`agent.browsers.list()` returned `[]`), so in-app visual/mobile overflow and console-error verification could not be completed. Automated render tests and HTTP route checks were used as the fallback verification path.

## 10. Known Limitations

- Farm Records remain local-first only; there is still no cloud sync.
- Advanced Farm Records sections still contain technical sync/export/prototype copy by design.
- Weather, AI, and calculators still include internal status routes for development and QA.
- No legal-final PDPA copy was added.
- No production backend/auth/AI/GPS behavior was enabled.

## 11. Next Recommended Milestone

M98 should use the simpler production-facing app shell to run mobile visual QA with real device/browser access, then fix any remaining above-the-fold overflow, confusing English labels, or advanced content that still feels too prominent.
