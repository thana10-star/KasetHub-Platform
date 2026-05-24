# M49 Agriculture Calculator Core Foundation Report

## Summary

M49 adds the first real agriculture calculator foundation for KasetHub. The app now has local-only calculator utilities and Thai-first mobile routes for spray mixing, fertilizer helper math, plant spacing, yield estimate, and cost estimate.

No backend writes, Supabase writes, AI API calls, geolocation/map calls, cloud sync, payment, sponsor routing, or network calls were added.

## Files Changed

Core calculator domain:

- `src/services/agri-calculators/agri-calculator.types.ts`
- `src/services/agri-calculators/agri-calculator-fixtures.ts`
- `src/services/agri-calculators/agri-calculator-service.ts`
- `src/hooks/useAgriCalculators.ts`

Routes and UI:

- `src/routes/CalculatorsPage.tsx`
- `src/routes/SprayMixCalculatorPage.tsx`
- `src/routes/PlantSpacingCalculatorPage.tsx`
- `src/routes/FertilizerCalculatorPage.tsx`
- `src/routes/YieldEstimateCalculatorPage.tsx`
- `src/routes/CostCalculatorPage.tsx`
- `src/routes/calculators/CalculatorUi.tsx`
- `src/routes/calculators/calculator-icons.ts`
- `src/app/App.tsx`
- `src/types/kaset.ts`

Entry points and QA/Admin visibility:

- `src/data/mockData.ts`
- `src/routes/MyFarmPage.tsx`
- `src/routes/ProfilePage.tsx`
- `src/routes/QAPage.tsx`
- `src/routes/AdminDashboardPage.tsx`
- `src/services/my-farm/my-farm.types.ts`
- `src/services/my-farm/my-farm-hub-service.ts`
- `src/services/qa/route-registry.ts`
- `src/services/qa/mvp-readiness.types.ts`
- `src/services/qa/mvp-readiness-audit.ts`

Docs:

- `docs/AGRICULTURE_CALCULATOR_FOUNDATION.md`
- `docs/SPRAY_MIXING_CALCULATOR_NOTES.md`
- `docs/FERTILIZER_AND_PLANTING_CALCULATOR_PLAN.md`
- `docs/SUPABASE_SCHEMA_DRAFT.md`
- `docs/SUPABASE_TYPE_MAPPING.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/MY_FARM_HUB_FOUNDATION.md`
- `docs/M30_NEXT_PHASE_DECISION.md`
- `README.md`

Build artifacts updated by verification:

- `dist/index.html`
- `tsconfig.app.tsbuildinfo`

## Routes Added

- `/app/calculators`
- `/app/calculators/spray-mix`
- `/app/calculators/plant-spacing`
- `/app/calculators/fertilizer`
- `/app/calculators/yield-estimate`
- `/app/calculators/cost`

## Calculator Notes

- Spray mix calculates required cc/ml/gram from label ratio and tank liters.
- Plant spacing estimates plant count, seedling count, and plant count per rai.
- Fertilizer helper estimates fertilizer amount from NPK percentage and target nutrient per rai.
- Yield estimate calculates sample weight, total kg, total ton, and yield per rai.
- Cost estimate totals fertilizer/chemical, labor, water, machinery, and other costs, then shows cost per rai and a break-even placeholder.

## Unit Conversion Notes

Thai land unit rules used:

- `1 ไร่ = 1,600 ตารางเมตร`
- `1 งาน = 400 ตารางเมตร`
- `1 ตารางวา = 4 ตารางเมตร`
- `1 ไร่ = 4 งาน = 400 ตารางวา`

## Safety / Disclaimer Notes

- Spray mix route includes `ควรอ่านฉลากจริงก่อนใช้`.
- Fertilizer route includes `เป็นการคำนวณเบื้องต้น`.
- All calculators explain that results are preliminary and not guaranteed.
- Calculator output is not a replacement for labels, soil tests, agronomists, official surveys, or financial advice.
- Local history stays in `kasethub.agriCalculators.v1`.

## Screens Updated

- Home quick actions
- My Farm quick actions and insight cards
- Profile menu
- QA reviewed route list
- Admin overview
- Internal MVP route registry/readiness audit

## Verification Commands

```bash
npm run lint
npm run build
```

Results:

- `npm run lint` passed.
- `npm run build` passed.
- Vite reported the existing large chunk warning after production build.

Manual route checks were run against `http://127.0.0.1:5173` using Chrome headless DOM rendering because the in-app browser runtime reported no available browser session.

Checked routes:

- `/app/calculators` passed.
- `/app/calculators/spray-mix` passed.
- `/app/calculators/plant-spacing` passed.
- `/app/calculators/fertilizer` passed.
- `/app/calculators/yield-estimate` passed.
- `/app/calculators/cost` passed.
- `/app/my-farm` passed.
- `/app/profile` passed.
- `/app/qa` passed.

## Known Limitations

- No real agronomy recommendation yet.
- No crop-specific fertilizer rule engine.
- No label OCR or chemical database.
- No soil test interpretation.
- No real yield model.
- No price/revenue integration for break-even.
- No Supabase sync or migrations.
- No AI recommendation integration.
- No sponsor or affiliate integration.

## Next Recommended Milestone

M50 should add calculator QA hardening: focused calculation test cases, edge-case fixtures, better empty/invalid-state handling, and optional export/share of local calculation summaries without backend sync.
