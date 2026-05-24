# Agriculture Calculator Foundation

M49 adds the first real agriculture calculator foundation for KasetHub. M50 hardens that foundation with validation helpers, deterministic QA fixtures, safer warning states, and local share summaries while staying fully local-only.

## Current Scope

- No backend writes.
- No Supabase writes.
- No AI API calls.
- No geolocation, GPS, or map.
- No cloud sync.
- No payment or sponsor transaction.
- No network call is required.
- Recent calculations, favorite calculators, and last inputs are stored only in `kasethub.agriCalculators.v1`.
- Share summaries are generated on device only and are not uploaded or saved to a backend.

## Routes

- `/app/calculators`
- `/app/calculators/qa`
- `/app/calculators/spray-mix`
- `/app/calculators/fertilizer`
- `/app/calculators/plant-spacing`
- `/app/calculators/yield-estimate`
- `/app/calculators/cost`

Entry points exist from Home quick actions, My Farm, Profile, QA, and Admin.

## Calculator Domain

Files:

- `src/services/agri-calculators/agri-calculator.types.ts`
- `src/services/agri-calculators/agri-calculator-fixtures.ts`
- `src/services/agri-calculators/agri-calculator-service.ts`
- `src/services/agri-calculators/agri-calculator-validation.ts`
- `src/services/agri-calculators/agri-calculator-test-fixtures.ts`
- `src/hooks/useAgriCalculators.ts`

Core types:

- `CalculatorCategory`
- `FertilizerMixInput` / `FertilizerMixResult`
- `SprayMixInput` / `SprayMixResult`
- `PlantSpacingInput` / `PlantSpacingResult`
- `YieldEstimateInput` / `YieldEstimateResult`
- `CostEstimateInput` / `CostEstimateResult`

## Thai Farming Unit Rules

The calculator foundation uses these Thai land unit conversions:

- `1 ไร่ = 4 งาน`
- `1 งาน = 100 ตารางวา`
- `1 ตารางวา = 4 ตารางเมตร`
- `1 ไร่ = 1,600 ตารางเมตร`
- `1 งาน = 400 ตารางเมตร`

All area outputs should show farmer-friendly labels: ไร่, งาน, ตารางวา, and ตารางเมตร where useful.

## Safety And Disclaimer Rules

Every calculator must keep clear copy that:

- Results are preliminary arithmetic.
- Results are not a guarantee.
- Results are not a replacement for an agronomist, product label, soil test, expert review, or official land survey.
- Spray mixing must say `ควรอ่านฉลากจริงก่อนใช้`.
- Fertilizer must say `เป็นการคำนวณเบื้องต้น`.
- Share summaries must say `สรุปผลคำนวณเบื้องต้น` and `ควรตรวจสอบฉลาก/ผู้เชี่ยวชาญก่อนใช้งานจริง`.
- Local history is stored only on the current device.

## M50 QA And Validation

`/app/calculators/qa` runs deterministic expected-vs-actual checks for spray mix, plant spacing, fertilizer helper, yield estimate, and cost estimate. It shows pass/warn/fail status and known limitations.

Validation now handles empty/zero/negative/non-number values, corrupted or missing units, extremely high values, unsafe concentration warnings, area too small/large warnings, and divide-by-zero prevention. Invalid results should not be saved into local history.

## Local Storage

`useAgriCalculators()` manages:

- recent calculations
- favorite calculators
- last inputs

The local state is intentionally not synced. Future sync must wait for real auth, owner-scoped RLS, consent, and a backend-owned merge path.

## Future AI Recommendation Boundary

Future AI integration can explain calculations or suggest what extra data to collect, but it must not silently change the arithmetic result. Any AI recommendation should:

- cite input assumptions
- keep safety disclaimers visible
- distinguish formula output from advice
- avoid chemical or fertilizer recommendations without reviewed rules
- route high-risk plant/chemical/fertilizer questions to expert review

## Future Sponsor And Affiliate Boundary

Sponsor or affiliate integration must stay separate from calculator output.

Rules:

- Do not bias fertilizer, chemical, seed, equipment, or lender suggestions inside the base calculator result.
- Label paid placements clearly.
- Keep organic calculator history separate from ad attribution.
- Do not send farm calculation data to sponsors without explicit consent.
- Backend-owned audit logs and privacy review are required before any monetized recommendation is enabled.
