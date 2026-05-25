# M51 Crop-specific Calculator Expansion Planning Report

## Summary

M51 adds crop-specific calculator planning foundations for KasetHub without turning deterministic calculators into hidden agronomy recommendations. The app now has static Thai crop profile fixtures, crop-aware example filling, a calculator safety route, and a formal unit-test readiness plan.

No backend writes, Supabase writes, AI API calls, real agronomy recommendation engine, pesticide recommendation engine, OCR, sponsor/affiliate integration, migrations, or network calls were added.

## Files Changed

Crop profile and safety foundations:

- `src/services/agri-calculators/crop-calculator-profile.types.ts`
- `src/services/agri-calculators/crop-calculator-profiles.ts`
- `src/services/agri-calculators/crop-calculator-boundaries.ts`
- `src/services/agri-calculators/agri-calculator-unit-test-plan.ts`

Routes and UI:

- `src/routes/CalculatorSafetyPage.tsx`
- `src/routes/CalculatorsPage.tsx`
- `src/routes/CalculatorQAPage.tsx`
- `src/routes/PlantSpacingCalculatorPage.tsx`
- `src/routes/FertilizerCalculatorPage.tsx`
- `src/routes/YieldEstimateCalculatorPage.tsx`
- `src/routes/CostCalculatorPage.tsx`
- `src/routes/calculators/CalculatorUi.tsx`
- `src/routes/ProfilePage.tsx`
- `src/routes/QAPage.tsx`
- `src/app/App.tsx`
- `src/types/kaset.ts`
- `src/services/qa/route-registry.ts`

Docs:

- `docs/CROP_SPECIFIC_CALCULATOR_EXPANSION_PLAN.md`
- `docs/CALCULATOR_SAFETY_AND_RECOMMENDATION_BOUNDARIES.md`
- `docs/AGRI_CALCULATOR_UNIT_TEST_PLAN.md`
- `docs/AGRICULTURE_CALCULATOR_FOUNDATION.md`
- `docs/AGRICULTURE_CALCULATOR_QA_HARDENING.md`
- `docs/FERTILIZER_AND_PLANTING_CALCULATOR_PLAN.md`
- `docs/SPRAY_MIXING_CALCULATOR_NOTES.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/SUPABASE_SCHEMA_DRAFT.md`
- `docs/SUPABASE_TYPE_MAPPING.md`
- `README.md`

Build artifacts updated by verification:

- `dist/index.html`
- `tsconfig.app.tsbuildinfo`

## Routes Added

- `/app/calculators/safety`

## Crop Profile Notes

Crop profile fixtures now cover:

- rice
- cassava
- sugarcane
- maize
- durian
- longan
- rubber
- vegetable_mixed

Each profile includes Thai display name, common spacing examples, common area/unit examples, yield input examples, cost categories commonly used, `fertilizerPlanningStatus = planning_only`, and safety notes.

Profiles do not recommend exact fertilizer doses by crop and do not recommend pesticide, chemical, hormone, or product use.

## UI Updates

- Calculator hub now shows the M51 crop profile list and links to calculator safety.
- Plant spacing, fertilizer, yield estimate, and cost estimate pages now include crop selectors.
- Each crop-aware page includes `ใช้ตัวอย่างของพืชนี้`.
- Crop examples are labeled with `ตัวอย่างนี้เป็นค่าเริ่มต้นเพื่อช่วยกรอก ไม่ใช่คำแนะนำทางวิชาการสุดท้าย`.
- Fertilizer crop examples fill area context only and do not inject crop-specific NPK targets or doses.
- Profile and QA pages now link to calculator safety.
- Calculator QA links to safety and shows unit-test readiness summary.

## Safety Boundary Notes

`/app/calculators/safety` explains:

- what calculators can do
- what calculators cannot do
- fertilizer and chemical safety boundaries
- why real labels, soil tests, and expert confirmation matter
- why AI explanations must not overwrite deterministic results
- why sponsored products must not be mixed secretly into AI or calculator recommendations

## Unit-test Plan Notes

`agri-calculator-unit-test-plan.ts` adds a static plan for:

- spray mix math
- land unit conversion
- plant spacing
- fertilizer NPK helper
- yield estimate
- cost estimate
- crop profile example loading

No test runner was added in M51.

## Supabase / Schema Planning Notes

Schema docs now include future planning notes for:

- `crop_calculator_profiles`
- `calculator_safety_notes`
- `calculator_result_reviews`
- `crop_rule_versions`

No migrations were run.

## Verification Commands

```bash
npm run lint
npm run build
```

Results:

- `npm run lint` passed.
- `npm run build` passed.
- Vite reported the existing large chunk warning after production build.

Manual route checks:

- `/app/calculators`
- `/app/calculators/safety`
- `/app/calculators/qa`
- `/app/calculators/plant-spacing`
- `/app/calculators/fertilizer`
- `/app/calculators/yield-estimate`
- `/app/calculators/cost`
- `/app/profile`
- `/app/qa`

Manual route checks were run against `http://127.0.0.1:5173` using Chrome headless DOM rendering because the in-app Browser runtime reported no available browser sessions.

Results:

- `/app/calculators` passed.
- `/app/calculators/safety` passed.
- `/app/calculators/qa` passed.
- `/app/calculators/plant-spacing` passed.
- `/app/calculators/fertilizer` passed.
- `/app/calculators/yield-estimate` passed.
- `/app/calculators/cost` passed.
- `/app/profile` passed.
- `/app/qa` passed.

## Known Limitations

- Crop profiles are static planning fixtures only.
- No exact crop fertilizer recommendations.
- No pesticide or chemical recommendation engine.
- No reviewed crop rule engine or rule version runtime.
- No formal test runner yet.
- No OCR or label database.
- No AI recommendation integration.
- No sponsor or affiliate integration.
- No Supabase sync, migrations, or backend writes.

## Next Recommended Milestone

M52 should add formal service-level unit tests for the calculator domain using the M51 plan, plus edge-case coverage for crop profile loading and validation boundaries before any crop-specific recommendation rules are introduced.
