# M55 Calculator AI Explanation Boundary Report

## Summary

M55 defines a safe AI explanation boundary for KasetHub calculator results. The app now has local-only AI explanation types, policy fixtures, a planner, service tests, and a preview route that shows how future AI may explain deterministic calculator outputs without changing formulas or adding hidden recommendations.

No real AI API calls, backend writes, Supabase writes, sponsor/affiliate integration, AdMob integration, payment, hidden recommendations, or network calls were added.

## Files Changed

AI explanation boundary services:

- `src/services/agri-calculators/calculator-ai-explanation.types.ts`
- `src/services/agri-calculators/calculator-ai-explanation-policy.ts`
- `src/services/agri-calculators/calculator-ai-explanation-fixtures.ts`
- `src/services/agri-calculators/calculator-ai-explanation-planner.ts`
- `src/services/agri-calculators/agri-calculator-service.test.ts`

Routes and UI:

- `src/routes/CalculatorAIExplanationPreviewPage.tsx`
- `src/routes/CalculatorsPage.tsx`
- `src/routes/CalculatorSavedResultsPage.tsx`
- `src/routes/CalculatorQAPage.tsx`
- `src/routes/CalculatorSafetyPage.tsx`
- `src/routes/AdminDashboardPage.tsx`
- `src/routes/QAPage.tsx`
- `src/app/App.tsx`
- `src/types/kaset.ts`
- `src/services/qa/route-registry.ts`

Docs:

- `docs/CALCULATOR_AI_EXPLANATION_BOUNDARY.md`
- `docs/CALCULATOR_AI_PROMPT_SAFETY_POLICY.md`
- `docs/CALCULATOR_REGRESSION_SAFETY.md`
- `docs/CALCULATOR_EXPORT_SHARE_FOUNDATION.md`
- `docs/CALCULATOR_REWARDED_ADS_STRATEGY.md`
- `docs/CALCULATOR_SAFETY_AND_RECOMMENDATION_BOUNDARIES.md`
- `docs/AI_AGRICULTURE_SAFETY_POLICY.md`
- `docs/PROJECT_BLUEPRINT.md`
- `README.md`

Build artifacts updated by verification:

- `dist/index.html`
- `tsconfig.app.tsbuildinfo`

## Routes Added

- `/app/calculators/ai-explanation-preview`

## Explanation Boundary Notes

Allowed future AI actions:

- explain inputs
- explain formulas
- explain result meaning
- suggest what to double-check
- suggest asking an expert
- explain safety disclaimer

Blocked actions:

- change deterministic result
- recommend chemical products
- recommend exact fertilizer dose not in calculator
- mention sponsor product
- claim guaranteed yield/profit
- override label instructions
- hide uncertainty

`buildCalculatorAIExplanationPlan()` returns `noRealAICall: true`, a prompt scaffold preview, allowed/blocked sections, risk level, safety disclaimers, and a locked result value snapshot.

## Prompt Safety Notes

The prompt scaffold preview instructs future AI to explain only the provided calculator output. It explicitly blocks formula mutation, hidden sponsor content, chemical product recommendations, fertilizer doses outside the calculator result, label overrides, and guaranteed outcomes.

Spray and fertilizer plans receive extra safety disclaimers for real label checks, soil/expert review, and not overriding deterministic formula output.

## Tests

Vitest coverage now includes:

- AI explanation planner allows formula explanation.
- sponsor product requests are blocked.
- chemical product recommendation requests are blocked.
- deterministic result mutation is blocked.
- calculator result values are preserved in the plan.
- fertilizer dose invention outside the calculator is blocked.
- spray/fertilizer disclaimers are included.
- `noRealAICall` remains `true`.

Result:

- 1 test file passed.
- 30 tests passed.

## Screens Updated

- Calculator hub links to the AI explanation preview with `M55 preview`.
- Calculator QA links to the AI explanation preview.
- Saved results cards include `ดูแผน AI อธิบายผล`.
- Saved results page has a direct AI explanation preview action.
- Calculator safety links to the AI explanation boundary.
- Admin Dashboard links to the AI explanation boundary.
- QA route list and route registry include the new preview route.

## Verification Commands

```bash
npm run lint
npm run test
npm run build
```

Results:

- `npm run lint` passed.
- `npm run test` passed: 1 file, 30 tests.
- `npm run build` passed.
- Vite reported the existing large chunk warning after production build.

Manual route checks were run against `http://127.0.0.1:5173` using Chrome headless DOM rendering because the in-app Browser runtime reported no available browser sessions.

Checked routes:

- `/app/calculators` passed.
- `/app/calculators/ai-explanation-preview` passed.
- `/app/calculators/saved-results` passed.
- `/app/calculators/qa` passed.
- `/app/calculators/safety` passed.
- `/app/admin` passed.
- `/app/qa` passed.

## Known Limitations

- No real AI API call or backend AI proxy integration yet.
- No AI-generated explanation text is produced.
- Prompt scaffold is a local preview only.
- No server-side policy logging or audit trail yet.
- No Supabase sync, migrations, or backend writes.
- No crop-specific recommendation runtime.
- No pesticide or chemical recommendation engine.
- No sponsor/affiliate integration.
- No real AdMob or payment integration.

## Next Recommended Milestone

M56 should add a real-backend AI explanation design review before implementation: backend-owned prompt execution, policy version logging, result snapshot locking, abuse/rate limits, safety escalation, and tests proving deterministic calculator values remain unchanged across AI explanation flows.
