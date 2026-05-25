# M98.1 Calculator Mobile UX + Crop Selection + Fertigation Tool Rework Report

## 1. Summary

M98.1 improves the `เครื่องมือ` calculator area after real mobile Safari feedback.

The work makes crop selection visibly tappable, reduces mobile overflow risk in calculator forms, moves planting-distance examples away from rice as the default, and shifts the weak chemical-mix surface toward a safer label-only tool while promoting fertilizer/fertigation planning.

## 2. Files Created

- `src/routes/CalculatorsPage.test.tsx`
- `docs/ux/CALCULATOR_MOBILE_UX_M98_1.md`
- `reports/milestones/M98_1_CALCULATOR_MOBILE_UX_CROP_SELECTION_FERTIGATION_REPORT.md`

## 3. Files Modified

- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/AGRICULTURE_CALCULATOR_FOUNDATION.md`
- `docs/FERTILIZER_AND_PLANTING_CALCULATOR_PLAN.md`
- `src/routes/CalculatorsPage.tsx`
- `src/routes/PlantSpacingCalculatorPage.tsx`
- `src/routes/FertilizerCalculatorPage.tsx`
- `src/routes/YieldEstimateCalculatorPage.tsx`
- `src/routes/CostCalculatorPage.tsx`
- `src/routes/SprayMixCalculatorPage.tsx`
- `src/routes/CalculatorSavedResultsPage.tsx`
- `src/routes/CalculatorExportPreviewPage.tsx`
- `src/routes/QAPage.tsx`
- `src/routes/calculators/CalculatorUi.tsx`
- `src/services/agri-calculators/agri-calculator-fixtures.ts`
- `src/services/agri-calculators/agri-calculator-service.ts`
- `src/services/agri-calculators/agri-calculator-service.test.ts`
- `src/services/agri-calculators/calculator-result-summary-service.ts`
- `src/services/agri-calculators/crop-calculator-boundaries.ts`
- `src/services/agri-calculators/crop-calculator-profile.types.ts`
- `src/services/agri-calculators/crop-calculator-profiles.ts`
- `src/services/my-farm/my-farm-hub-service.ts`
- `src/services/qa/route-registry.ts`

Build-generated files were also refreshed by `npm run build`.

## 4. Crop Selector UI Fix

Crop selection now looks like an interactive control instead of plain text.

The shared `CropProfilePicker` now shows:

- `พืชที่เลือก`
- `เลือกพืช`
- `แตะเพื่อเปลี่ยนชนิดพืช`
- highlighted green selector styling
- a down chevron affordance
- a current-crop summary card

## 5. Plant Spacing Crop Adjustments

`/app/calculators/plant-spacing` now defaults to `ข้าวโพด` instead of rice.

Calculator crop options now include:

- ข้าวโพด
- อ้อย
- มันสำปะหลัง
- ยางพารา
- ยูคาลิปตัส / ยูคา
- พริก
- ปาล์มน้ำมัน

Rice remains available but is no longer the headline/default spacing example.

## 6. Responsive/Mobile Layout Fixes

Calculator form layouts now reduce horizontal overflow risk:

- area + unit rows stack on mobile and only split on larger screens
- fertilizer N/P/K inputs stack on mobile
- unit suffixes can wrap instead of pushing inputs wider
- result values use break-word protection
- share action buttons use one column on mobile
- calculator landing primary cards use mobile-safe grids

## 7. Chemical/Fertigation Tool Decision

The fertilizer tool is now promoted as `คำนวณปุ๋ย/การให้ปุ๋ย`.

It adds a safe planning scaffold:

- `อายุพืช / ระยะพืช`
- `วิธีให้ปุ๋ย`
- `หว่าน/โรย`
- `ผ่านน้ำหยด`
- `ผสมน้ำรด`

The old chemical mix route remains accessible but is renamed/deprioritized as `คำนวณตามฉลากยา/สาร`.

It only helps calculate from label values the user enters. It does not recommend pesticide dosage.

## 8. Safety Boundaries

M98.1 did not add backend writes, Supabase read/write, cloud sync, GPS/geolocation, AI execution, receipt upload, OCR, notifications, or official agronomy recommendations.

The fertilizer/fertigation scaffold uses user-entered target rates only and tells users to check soil, crop stage, field conditions, labels, and local officer/agronomist guidance before real use.

The pesticide/chemical surface remains label-only and does not invent rates or override product labels.

## 9. Tests/Checks Run

- `npm run lint` passed.
- `npm run build` passed. This runs `tsc -b`; no separate `npm run typecheck` script exists. Vite reported the existing large chunk warning.
- `npm run test` passed: 34 test files, 325 tests.
- `npm run test -- CalculatorsPage agri-calculator-service` passed during development: 2 files, 58 tests.
- `git diff --check` passed with line-ending warnings only.

## 10. Manual Verification Result

Dev server was already running at `http://127.0.0.1:5173`.

HTTP 200 checks passed:

- `/app/calculators`
- `/app/calculators/plant-spacing`
- `/app/calculators/fertilizer`
- `/app/calculators/yield-estimate`
- `/app/calculators/cost`
- `/app/calculators/spray-mix`
- `/app`
- `/app/my-farm`

The Browser connector was unavailable again (`agent.browsers.list()` returned `[]`), so in-app mobile screenshots, real visual overflow inspection, and console-error checks could not be completed. Automated render tests, static layout inspection, and HTTP route checks were used as the fallback verification path.

## 11. Known Limitations

- No real mobile screenshot pass was possible in this environment.
- Fertigation logic is still a safe scaffold, not crop-stage agronomy recommendations.
- Crop spacing values are starter examples only and must be verified locally.
- The chemical/label calculator remains accessible for route compatibility but is intentionally limited and deprioritized.
- Advanced calculator AI/QA planning routes still contain technical wording by design.

## 12. Next Recommended Milestone

M98.2 should use real mobile screenshots from the project owner to do a second calculator visual QA pass, especially on narrow Safari widths, then tune any remaining clipping around long Thai labels, unit suffixes, result cards, and saved/export summary pages.
