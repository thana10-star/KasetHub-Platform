# M58 Calculator AI Backend Adapter QA + Staging Endpoint Report

## Summary

M58 hardens the calculator AI backend adapter layer with deterministic QA fixtures, fixture-vs-disabled UI verification, a staging endpoint design checklist, and explicit no-network boundary rules before any live AI endpoint exists.

No real AI API calls, real backend endpoint calls, Supabase writes, AdMob/payment, sponsor/affiliate integration, cloud sync, or default network calls were added.

## Files Changed

Adapter QA and endpoint planning services:

- `src/services/agri-calculators/calculator-ai-adapter-qa-fixtures.ts`
- `src/services/agri-calculators/calculator-ai-endpoint-plan.types.ts`
- `src/services/agri-calculators/calculator-ai-endpoint-plan.ts`
- `src/services/agri-calculators/calculator-ai-adapter.types.ts`
- `src/services/agri-calculators/calculator-ai-adapter.ts`
- `src/services/agri-calculators/agri-calculator-service.test.ts`

Routes and UI:

- `src/routes/CalculatorAIEndpointPlanPage.tsx`
- `src/routes/CalculatorAIAdapterStatusPage.tsx`
- `src/routes/CalculatorAIArchitecturePage.tsx`
- `src/routes/CalculatorQAPage.tsx`
- `src/routes/CalculatorsPage.tsx`
- `src/routes/AdminDashboardPage.tsx`
- `src/routes/NextPhasePage.tsx`
- `src/routes/QAPage.tsx`
- `src/app/App.tsx`
- `src/types/kaset.ts`
- `src/services/qa/route-registry.ts`

Docs:

- `docs/CALCULATOR_AI_STAGING_ENDPOINT_CHECKLIST.md`
- `docs/CALCULATOR_AI_NETWORK_BOUNDARY_RULES.md`
- `docs/CALCULATOR_AI_BACKEND_ADAPTER_CONTRACT.md`
- `docs/CALCULATOR_AI_BACKEND_ARCHITECTURE.md`
- `docs/CALCULATOR_AI_POLICY_VERSIONING_PLAN.md`
- `docs/CALCULATOR_AI_AUDIT_AND_RATE_LIMIT_PLAN.md`
- `docs/CALCULATOR_AI_PROMPT_SAFETY_POLICY.md`
- `docs/CALCULATOR_REGRESSION_SAFETY.md`
- `docs/AI_AGRICULTURE_SAFETY_POLICY.md`
- `docs/SUPABASE_SCHEMA_DRAFT.md`
- `docs/SUPABASE_TYPE_MAPPING.md`
- `docs/PROJECT_BLUEPRINT.md`
- `README.md`

Build artifacts updated by verification:

- `dist/index.html`
- `tsconfig.app.tsbuildinfo`

## Routes Added

- `/app/calculators/ai-endpoint-plan`

## Adapter QA Notes

`calculator-ai-adapter-qa-fixtures.ts` adds deterministic fixture states for:

- local fixture success
- backend disabled
- backend network disabled
- backend test ready but blocked
- invalid request
- oversized request
- sponsor insertion blocked
- deterministic locked-hash mismatch blocked
- policy version mismatch blocked
- invalid crop profile

`/app/calculators/ai-adapter-status` now shows the adapter state matrix, fixture-vs-disabled comparison, current flags, backend blocked reasons, no-network guarantee, safe fallback behavior, and locked hash preservation status.

## Staging Endpoint Notes

`/app/calculators/ai-endpoint-plan` shows the future backend endpoint flow:

```text
Calculator -> Snapshot Lock -> Backend Policy Check -> Prompt Builder -> AI Explanation -> Safety Filter -> Final Display
```

The endpoint plan requires backend-only prompt execution, no frontend provider keys, request validation, lock-hash verification, policy version validation, audit logs, rate limits, abuse prevention, timeout handling, sponsor separation, no formula mutation, and no hidden recommendation injection.

## Safety / Network Boundary Notes

- Default adapter behavior remains no-network.
- `backend_test_ready` still blocks unless backend and network flags are explicitly enabled in a future reviewed milestone.
- No real endpoint URL was added.
- No frontend provider key path was added.
- Locked result hashes and policy versions are checked before any future backend path.
- Sponsor, chemical/product, hidden recommendation, and deterministic mutation attempts stay blocked.
- Basic deterministic calculator output remains immutable.

## Tests

Vitest coverage now includes:

- disabled modes stay disabled
- invalid requests are rejected
- oversized payloads are rejected
- policy mismatches are blocked
- sponsor insertion is blocked
- locked hash mismatches are blocked
- adapter status remains deterministic
- no network path is active by default

Result:

- 1 test file passed.
- 45 tests passed.

## Verification Commands

```bash
npm run lint
npm run test
npm run build
```

Results:

- `npm run lint` passed.
- `npm run test` passed: 1 file, 45 tests.
- `npm run build` passed.
- Vite reported the existing large chunk warning after production build.

Manual route checks were run against `http://127.0.0.1:5173` using Chrome headless DOM rendering because the in-app Browser runtime reported no available browser sessions.

Checked routes:

- `/app/calculators/ai-adapter-status` passed.
- `/app/calculators/ai-endpoint-plan` passed.
- `/app/calculators/ai-architecture` passed.
- `/app/calculators/qa` passed.
- `/app/admin` passed.
- `/app/next-phase` passed.
- `/app/qa` passed.

## Known Limitations

- No real AI API call yet.
- No backend endpoint exists yet.
- No backend writes or Supabase writes.
- No real policy table, request log, audit log, snapshot lock table, or rate-limit enforcement yet.
- No provider-side safety filter integration.
- No cloud sync or authenticated explanation history.
- No AdMob/payment integration.
- No sponsor/affiliate integration.
- No crop-specific recommendation runtime or pesticide/chemical recommendation engine.

## Next Recommended Milestone

M59 should add a backend endpoint contract draft or Edge Function design stub that remains disabled by default: typed request/response payloads, server-only provider-key handling, lock-hash verification, policy checks, audit logging, rate-limit hooks, timeout behavior, and tests proving frontend code still cannot call AI/network paths without explicit staging flags.
