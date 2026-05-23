# M33 Farm Area Measurement Planner Foundation Report

## Summary

M33 adds a local/mock farm area measurement foundation for KasetHub. Farmers can estimate simple plot areas, convert Thai land units, save local plot estimates, and read a manual measurement guide while the app prepares for future GPS/map measurement.

No real GPS, map API, geolocation permission request, backend write, Supabase write, production land survey claim, or network call was added.

## Files Changed

- `src/services/farm-area/farm-area.types.ts`
- `src/services/farm-area/farm-area-calculator.ts`
- `src/services/farm-area/farm-area-fixtures.ts`
- `src/hooks/useFarmArea.ts`
- `src/routes/FarmAreaPage.tsx`
- `src/routes/FarmAreaGuidePage.tsx`
- `src/app/App.tsx`
- `src/data/mockData.ts`
- `src/routes/AdminDashboardPage.tsx`
- `src/routes/MyFarmPage.tsx`
- `src/routes/ProfilePage.tsx`
- `src/routes/QAPage.tsx`
- `src/services/qa/route-registry.ts`
- `src/services/qa/mvp-readiness-audit.ts`
- `src/types/kaset.ts`
- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/FARMER_ACCESSIBILITY_VISUAL_QA.md`
- `docs/M30_NEXT_PHASE_DECISION.md`
- `docs/SUPABASE_SCHEMA_DRAFT.md`
- `docs/SUPABASE_TYPE_MAPPING.md`
- `docs/FARM_AREA_MEASUREMENT_FOUNDATION.md`
- `docs/FARM_AREA_GPS_MAP_FUTURE_PLAN.md`
- `reports/milestones/M33_FARM_AREA_MEASUREMENT_PLANNER_FOUNDATION_REPORT.md`

## Routes Added

- `/app/farm-area`
- `/app/farm-area-guide`

## Calculator Notes

- Rectangle: width x length.
- Square: side x side.
- Triangle: base x height / 2.
- `custom_polygon_mock` accepts a manual estimated square-meter value for future polygon planning.
- Invalid or zero inputs return warnings rather than crashing.
- Saved plot estimates use localStorage key `kasethub.farmArea.v1`.

## Unit Conversion Notes

Thai land unit rules are built into the calculator:

- 1 ตารางวา = 4 ตารางเมตร
- 1 งาน = 100 ตารางวา = 400 ตารางเมตร
- 1 ไร่ = 4 งาน = 1,600 ตารางเมตร

Additional reference conversions:

- 1 hectare = 10,000 square meters
- 1 acre = 4,046.8564224 square meters

## Screens Updated

- `/app/farm-area` shows shape selection, large number inputs, results in square meters/ตารางวา/งาน/ไร่/hectare/acre, save/remove local plot actions, Thai unit rules, and future GPS/map planning.
- `/app/farm-area-guide` explains manual land measurement, tape measure usage, simple formulas, Thai land units, accuracy cautions, and future GPS/map boundaries.
- Home quick actions link to farm area measurement.
- Profile, My Farm, QA, and Admin link to the farm area routes.
- Admin overview shows local saved farm plot count and a no-GPS/no-map boundary note.

## Future GPS/Map Notes

- Future GPS walking boundary must request location only after explicit user action.
- Future map polygon drawing needs provider attribution, privacy review, and backend/RLS planning.
- Future export/share needs explicit consent.
- Precise boundary coordinates must be private by default.
- The app must continue to show: “เป็นการคำนวณประมาณการ ไม่ใช่การรังวัดที่ดินอย่างเป็นทางการ”.

## Verification Commands

```bash
npm run lint
npm run build
```

Both passed. The production build completed with the existing Vite large chunk warning.

## Manual Route Checks

The in-app Browser plugin was unavailable in this session, so route verification used local Vite on `http://127.0.0.1:5174` plus a headless Chrome DOM check.

Passed:

- `/app/farm-area`
- `/app/farm-area-guide`
- `/app/profile`
- `/app/qa`
- `/app/admin`
- `/app`

The local Vite server was stopped after verification.

## Known Limitations

- No real GPS.
- No map API.
- No geolocation prompt.
- No backend writes.
- No Supabase writes.
- No cross-device sync.
- No official land survey or legal land document behavior.
- Saved plot estimates are local to the current browser/device.
- Polygon mode is a mock/manual planning mode only.

## Next Recommended Milestone

M34 should begin the controlled Supabase Auth phone OTP staging adapter or, if backend work remains paused, add a backend contract for user-owned farm plots with RLS, deletion, and location privacy rules before any real GPS/map measurement is enabled.
