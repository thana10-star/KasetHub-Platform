# M52 Formal Calculator Service Tests + Edge-case Coverage Report

## Summary

M52 adds formal Vitest service-level coverage for KasetHub agriculture calculators, edge-case fixtures, and regression-safety notes before any advanced crop recommendation logic is introduced.

No backend writes, Supabase writes, AI API calls, OCR, network calls, or real recommendation engine behavior were added.

## Files Changed

Test setup:

- `package.json`
- `package-lock.json`

Calculator test and edge fixtures:

- `src/services/agri-calculators/agri-calculator-service.test.ts`
- `src/services/agri-calculators/agri-calculator-edge-fixtures.ts`
- `src/services/agri-calculators/agri-calculator-unit-test-plan.ts`

QA route:

- `src/routes/CalculatorQAPage.tsx`

Docs:

- `docs/CALCULATOR_REGRESSION_SAFETY.md`
- `docs/AGRI_CALCULATOR_UNIT_TEST_PLAN.md`
- `docs/AGRICULTURE_CALCULATOR_QA_HARDENING.md`
- `docs/CROP_SPECIFIC_CALCULATOR_EXPANSION_PLAN.md`
- `docs/PROJECT_BLUEPRINT.md`
- `README.md`

Build artifacts updated by verification:

- `dist/index.html`
- `tsconfig.app.tsbuildinfo`

## Test Coverage

Added Vitest via `npm run test`.

Formal service tests cover:

- spray mix ratio scaling
- Thai land unit conversion
- plant spacing density
- fertilizer NPK helper math
- yield estimate arithmetic
- cost estimate arithmetic
- crop profile example loading
- invalid crop key rejection
- validation boundaries
- M50 deterministic fixture regression suite
- M51 unit-test plan implementation status

Result:

- 1 test file passed.
- 18 tests passed.

## Edge-case Notes

Added `agri-calculator-edge-fixtures.ts` with deterministic edge fixtures for:

- extreme spray concentration
- extremely small land
- huge land
- invalid crop key
- impossible spacing
- unrealistic yield
- negative costs
- invalid units
- overflow-ish cost values

## Validation Coverage

Tests now cover:

- zero values
- negative values
- `NaN`
- empty string numeric inputs
- huge values
- tiny values
- divide-by-zero prevention
- invalid units from corrupted local state
- finite handling for overflow-ish values

## QA Route Updates

`/app/calculators/qa` now shows:

- formal test coverage summary
- edge-case examples
- validation pass/warn/fail status
- regression-safe calculation notes
- no scientific guarantee warning

The QA page still has no backend writes, Supabase writes, AI calls, or network calls.

## Verification Commands

```bash
npm run lint
npm run test
npm run build
```

Results:

- `npm run lint` passed.
- `npm run test` passed: 1 file, 18 tests.
- `npm run build` passed.
- Vite reported the existing large chunk warning after production build.

Manual route checks were run against `http://127.0.0.1:5173` using Chrome headless DOM rendering because the in-app Browser runtime reported no available browser sessions.

Checked routes:

- `/app/calculators/qa` passed.
- `/app/calculators/spray-mix` passed.
- `/app/calculators/plant-spacing` passed.
- `/app/calculators/fertilizer` passed.
- `/app/calculators/yield-estimate` passed.
- `/app/calculators/cost` passed.
- `/app/profile` passed.
- `/app/qa` passed.

## Known Limitations

- Tests are service-level only; no React component or browser automation test suite yet.
- No real agronomy recommendation engine.
- No crop-specific fertilizer rule runtime.
- No pesticide or chemical recommendation engine.
- No OCR or label database.
- No AI explanation or recommendation integration.
- No Supabase sync, migrations, or backend writes.

## Next Recommended Milestone

M53 should add calculator export/share polish or a rule-version design review before any crop-specific recommendation runtime. If recommendation work starts, it should first define reviewed rule metadata, versioning, expert escalation, and tests that prove deterministic formulas do not change silently.
