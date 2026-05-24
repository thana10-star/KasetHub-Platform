# M50 Agriculture Calculator QA Hardening Report

## Summary

M50 hardens the M49 agriculture calculator foundation with deterministic test fixtures, validation utilities, safer warning/error states, and local-only copy/share summaries for calculator results.

No backend writes, Supabase writes, AI API calls, OCR, payment, sponsor/affiliate integration, file/PDF generation, or network calls were added.

## Files Changed

Calculator domain:

- `src/services/agri-calculators/agri-calculator-validation.ts`
- `src/services/agri-calculators/agri-calculator-test-fixtures.ts`
- `src/services/agri-calculators/agri-calculator-service.ts`

Routes and UI:

- `src/routes/CalculatorQAPage.tsx`
- `src/routes/CalculatorsPage.tsx`
- `src/routes/SprayMixCalculatorPage.tsx`
- `src/routes/PlantSpacingCalculatorPage.tsx`
- `src/routes/FertilizerCalculatorPage.tsx`
- `src/routes/YieldEstimateCalculatorPage.tsx`
- `src/routes/CostCalculatorPage.tsx`
- `src/routes/calculators/CalculatorUi.tsx`
- `src/app/App.tsx`
- `src/types/kaset.ts`

QA/Admin visibility:

- `src/routes/QAPage.tsx`
- `src/routes/AdminDashboardPage.tsx`
- `src/services/qa/route-registry.ts`

Docs:

- `docs/AGRICULTURE_CALCULATOR_QA_HARDENING.md`
- `docs/CALCULATOR_SHARE_SUMMARY_FOUNDATION.md`
- `docs/AGRICULTURE_CALCULATOR_FOUNDATION.md`
- `docs/SPRAY_MIXING_CALCULATOR_NOTES.md`
- `docs/FERTILIZER_AND_PLANTING_CALCULATOR_PLAN.md`
- `docs/PROJECT_BLUEPRINT.md`
- `README.md`

Build artifacts updated by verification:

- `dist/index.html`
- `tsconfig.app.tsbuildinfo`

## Routes Added

- `/app/calculators/qa`

## Test Cases

Deterministic fixture checks now cover:

- spray mix 20L from 20cc/20L = 20 cc
- spray mix 10L from 20cc/20L = 10 cc
- spray mix 200L from 20cc/20L = 200 cc
- plant spacing 1 rai at 1m x 1m = 1,600 plants
- plant spacing 5 rai at 1m x 0.8m = 10,000 plants
- fertilizer N target with 46-0-0 = about 8.70 kg
- yield estimate example = 500 kg
- cost per rai example = 2,000 baht/rai

`/app/calculators/qa` shows expected value, actual value, difference, pass/warn/fail status, warnings, and known limitations.

## Validation Notes

The validation layer handles:

- empty, zero, negative, and non-number values
- missing/corrupted area, spray amount, and tank-size units
- extremely high tank size, area, fertilizer amount, yield, cost, and plant count
- unsafe spray concentration warning
- area too small/too large warnings
- divide-by-zero prevention
- all-zero fertilizer targets and all-zero cost estimates

Invalid calculator results are shown with an error state and are not saved into local history.

## Share / Export Summary Notes

Valid calculator results now support:

- copy result summary text
- native share via the existing share service with fallback behavior
- local-only summary copy containing `สรุปผลคำนวณเบื้องต้น`
- safety copy containing `ควรตรวจสอบฉลาก/ผู้เชี่ยวชาญก่อนใช้งานจริง`

No PDF, file export, backend save, Supabase write, AI recommendation, sponsor routing, or affiliate integration was added.

## Screens Updated

- Calculator hub now links to calculator QA.
- Calculator QA route shows pass/warn/fail test cards.
- Spray mix, plant spacing, fertilizer, yield estimate, and cost estimate pages now show larger result cards, reset actions, invalid-state messaging, and local share-summary controls.
- QA page links to calculator QA.
- Admin overview shows M50 calculator QA status and links.

## Verification Commands

```bash
npm run lint
npm run build
```

Results:

- `npm run lint` passed.
- `npm run build` passed.
- Vite reported the existing large chunk warning after production build.

Manual route checks were run against `http://127.0.0.1:5173` using Chrome headless DOM rendering because the in-app Browser runtime reported no available browser sessions.

Checked routes:

- `/app/calculators` passed.
- `/app/calculators/qa` passed.
- `/app/calculators/spray-mix` passed.
- `/app/calculators/plant-spacing` passed.
- `/app/calculators/fertilizer` passed.
- `/app/calculators/yield-estimate` passed.
- `/app/calculators/cost` passed.
- `/app/qa` passed.
- `/app/admin` passed.

## Known Limitations

- QA fixtures are deterministic in-app checks, not a full test-runner suite yet.
- No crop-specific fertilizer rule engine.
- No label OCR or chemical database.
- No soil test interpretation.
- No real yield model.
- No price/revenue integration for complete break-even.
- No file/PDF export.
- No Supabase sync or migrations.
- No AI recommendation integration.
- No sponsor or affiliate integration.

## Next Recommended Milestone

M51 should add crop-specific calculator expansion planning: crop profiles, richer unit fixtures, formal unit tests around calculator services, and reviewed boundaries for future AI explanations without turning deterministic outputs into hidden recommendations.
