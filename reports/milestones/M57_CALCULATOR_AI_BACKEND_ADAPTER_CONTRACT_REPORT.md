# M57 Calculator AI Explanation Backend Adapter Contract Report

## Summary

M57 adds a disabled-by-default backend adapter contract for future KasetHub calculator AI explanations. The adapter defines request/response payloads, feature flags, local fixture mode, backend-disabled modes, and tests proving no backend client can run unless future explicit staging flags are enabled.

No real AI API call, real backend endpoint call by default, Supabase write, cloud sync, AdMob/payment, sponsor/affiliate integration, or network call by default was added.

## Files Changed

Adapter contract and fixtures:

- `src/services/agri-calculators/calculator-ai-adapter.types.ts`
- `src/services/agri-calculators/calculator-ai-adapter.ts`
- `src/services/agri-calculators/calculator-ai-local-fixtures.ts`
- `src/services/agri-calculators/agri-calculator-service.test.ts`

Environment:

- `.env.example`
- `src/config/env.ts`
- `src/vite-env.d.ts`

Routes and UI:

- `src/routes/CalculatorAIAdapterStatusPage.tsx`
- `src/routes/CalculatorAIExplanationPreviewPage.tsx`
- `src/routes/CalculatorAIArchitecturePage.tsx`
- `src/routes/CalculatorsPage.tsx`
- `src/routes/CalculatorSavedResultsPage.tsx`
- `src/routes/CalculatorQAPage.tsx`
- `src/routes/AdminDashboardPage.tsx`
- `src/routes/QAPage.tsx`
- `src/app/App.tsx`
- `src/types/kaset.ts`
- `src/services/qa/route-registry.ts`

Docs:

- `docs/CALCULATOR_AI_BACKEND_ADAPTER_CONTRACT.md`
- `docs/CALCULATOR_AI_STAGING_FLAGS_PLAN.md`
- `docs/CALCULATOR_AI_BACKEND_ARCHITECTURE.md`
- `docs/CALCULATOR_AI_POLICY_VERSIONING_PLAN.md`
- `docs/CALCULATOR_AI_AUDIT_AND_RATE_LIMIT_PLAN.md`
- `docs/CALCULATOR_AI_EXPLANATION_BOUNDARY.md`
- `docs/CALCULATOR_AI_PROMPT_SAFETY_POLICY.md`
- `docs/PROJECT_BLUEPRINT.md`
- `README.md`

Build artifacts updated by verification:

- `dist/index.html`
- `tsconfig.app.tsbuildinfo`

## Routes Added

- `/app/calculators/ai-adapter-status`

## Feature Flags

M57 adds calculator-specific AI adapter flags:

```env
VITE_CALCULATOR_AI_MODE=local_fixture
VITE_ENABLE_CALCULATOR_AI_BACKEND=false
VITE_ENABLE_CALCULATOR_AI_NETWORK=false
```

Default behavior remains `local_fixture` with no network.

## Adapter Behavior

Adapter modes:

- `local_fixture`: returns deterministic local Thai fixture explanation from the locked snapshot.
- `backend_disabled`: returns disabled response and does not call a backend client.
- `backend_test_ready`: refuses backend client execution unless both backend and network flags are explicitly true.
- `production_disabled`: returns disabled response until a future milestone explicitly enables production.

Responses include status, explanation text or disabled reason, policy version, prompt template version id, locked result hash, locked result values, safety disclaimers, blocked actions, audit preview, `noRealAICall: true`, and backend/network attempt flags.

## Local Fixture Notes

`calculator-ai-local-fixtures.ts` generates simple Thai explanation text only from the M56 locked snapshot. It does not recompute formulas, mutate results, add recommendations, mention products, mention sponsors, or change deterministic calculator values.

## Tests

Vitest coverage now includes:

- `local_fixture` returns `noRealAICall: true`.
- `backend_disabled` does not call a backend client.
- `production_disabled` does not call a backend client.
- `backend_test_ready` refuses backend client execution unless both explicit flags are true.
- adapter status exposes safe default flags and supported request types.
- response preserves locked hash and deterministic result values.
- sponsor, chemical, and product suggestion requests remain blocked before adapter output.

Result:

- 1 test file passed.
- 42 tests passed.

## Verification Commands

```bash
npm run lint
npm run test
npm run build
```

Results:

- `npm run lint` passed.
- `npm run test` passed: 1 file, 42 tests.
- `npm run build` passed.
- Vite reported the existing large chunk warning after production build.

Manual route checks were run against `http://127.0.0.1:5173` using Chrome headless DOM rendering because the in-app Browser plugin reported no available browser sessions.

Checked routes:

- `/app/calculators/ai-explanation-preview` passed.
- `/app/calculators/ai-architecture` passed.
- `/app/calculators/ai-adapter-status` passed.
- `/app/calculators/qa` passed.
- `/app/admin` passed.
- `/app/qa` passed.

## Known Limitations

- No real AI API call.
- No real backend endpoint or endpoint URL.
- No real backend fetch by default.
- No server-side rate-limit enforcement yet.
- No backend audit writes.
- No Supabase sync, migrations, or writes.
- No provider-side safety filter integration.
- No AI-generated explanation text beyond deterministic local fixtures.
- No sponsor/affiliate integration.
- No AdMob/payment integration.

## Next Recommended Milestone

M58 should add backend adapter QA around fixture-vs-disabled UI states and an explicit staging endpoint design checklist before any live network path exists. A later live-AI milestone should require backend-owned prompt execution, server-side policy lookup, lock-hash verification, rate limits, audit logging, and tests proving calculator results remain immutable.
