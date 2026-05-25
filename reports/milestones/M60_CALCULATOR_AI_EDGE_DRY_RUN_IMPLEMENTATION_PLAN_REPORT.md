# M60 Calculator AI Edge Dry-run Implementation Plan Report

## Summary

M60 prepares a staging-only dry-run implementation plan for the future `calculator-ai-explain` Supabase Edge Function. The app now has local dry-run readiness types, validation fixtures, server-only secret checklist, audit/rate-limit previews, production blockers, env placeholders, tests, docs, and an in-app dry-run route.

No real AI provider call, provider key, service-role key in frontend, deployed Edge Function, Supabase write, default network call, cloud sync, AdMob/payment, sponsor/affiliate integration, or production behavior was added.

## Files Changed

Edge dry-run planning services:

- `src/services/agri-calculators/calculator-ai-edge-dry-run.types.ts`
- `src/services/agri-calculators/calculator-ai-edge-dry-run-plan.ts`
- `src/services/agri-calculators/calculator-ai-endpoint-plan.ts`
- `src/services/agri-calculators/agri-calculator-service.test.ts`

Routes, env, and UI:

- `src/routes/CalculatorAIEdgeDryRunPage.tsx`
- `src/routes/CalculatorAIEdgeContractPage.tsx`
- `src/routes/CalculatorAIEndpointPlanPage.tsx`
- `src/routes/CalculatorsPage.tsx`
- `src/routes/AdminDashboardPage.tsx`
- `src/routes/NextPhasePage.tsx`
- `src/routes/QAPage.tsx`
- `src/app/App.tsx`
- `src/config/env.ts`
- `src/vite-env.d.ts`
- `src/types/kaset.ts`
- `src/services/qa/route-registry.ts`
- `.env.example`

Docs:

- `docs/CALCULATOR_AI_EDGE_DRY_RUN_PLAN.md`
- `docs/CALCULATOR_AI_EDGE_SECRET_CHECKLIST.md`
- `docs/CALCULATOR_AI_EDGE_DRY_RUN_VALIDATION_CASES.md`
- `docs/CALCULATOR_AI_EDGE_FUNCTION_CONTRACT.md`
- `docs/CALCULATOR_AI_EDGE_FUNCTION_SECURITY_PLAN.md`
- `docs/CALCULATOR_AI_STAGING_ENDPOINT_CHECKLIST.md`
- `docs/CALCULATOR_AI_NETWORK_BOUNDARY_RULES.md`
- `docs/CALCULATOR_AI_BACKEND_ADAPTER_CONTRACT.md`
- `docs/CALCULATOR_AI_AUDIT_AND_RATE_LIMIT_PLAN.md`
- `docs/CALCULATOR_AI_STAGING_FLAGS_PLAN.md`
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

- `/app/calculators/ai-edge-dry-run`

## Env Flags

M60 adds placeholders only:

```env
VITE_CALCULATOR_AI_EDGE_URL=
VITE_ENABLE_CALCULATOR_AI_EDGE_DRY_RUN=false
VITE_ENABLE_CALCULATOR_AI_EDGE_NETWORK=false
```

Defaults keep endpoint URL empty, dry-run disabled, and network disabled.

## Dry-run Readiness Notes

`buildCalculatorAIEdgeDryRunPlan()` checks:

- endpoint URL missing/present
- dry-run flag false/true
- Edge network flag false/true
- M57 adapter mode/backend/network flags
- auth/session ownership not ready
- server-only provider key requirement
- service-role key blocked from frontend
- production blockers

All current M60 readiness paths keep:

- `canCallEndpoint: false`
- `fetchWouldRun: false`
- `noRealEndpointCall: true`
- `noSupabaseWrite: true`
- `noProductionBehavior: true`

## Secret Checklist Notes

The secret checklist confirms:

- provider keys must live only in backend or Edge Function secret stores
- Supabase service-role keys must live only in backend or Edge Function secret stores
- frontend config does not accept provider keys
- frontend config does not accept service-role keys
- endpoint URL is optional, empty by default, and masked when shown

## Validation Fixtures

Dry-run validation fixtures cover:

- valid locked snapshot
- missing snapshot
- lock-hash mismatch
- policy mismatch
- oversized payload
- sponsor injection attempt
- chemical recommendation attempt
- no auth/session
- timeout fallback

Every fixture keeps `noFetch: true`.

## Tests

Vitest coverage now proves:

- default build cannot call the endpoint
- dry-run URL alone is not enough
- network flag alone is not enough
- dry-run flag plus network flag still does not call fetch in M60
- provider keys are not accepted in frontend config
- service-role keys are not accepted in frontend config
- validation fixtures classify expected failures
- production blockers remain until auth, audit, and rate limits are implemented

Result:

- 1 test file passed.
- 53 tests passed.

## Verification Commands

```bash
npm run lint
npm run test
npm run build
```

Results:

- `npm run lint` passed.
- `npm run test` passed: 1 file, 53 tests.
- `npm run build` passed.
- Vite reported the existing large chunk warning after production build.

Manual route checks:

- `/app/calculators/ai-edge-dry-run`
- `/app/calculators/ai-edge-contract`
- `/app/calculators/ai-endpoint-plan`
- `/app/calculators/ai-adapter-status`
- `/app/admin`
- `/app/next-phase`
- `/app/qa`

Manual route checks were run against `http://127.0.0.1:5173` using Chrome headless DOM rendering because the in-app Browser runtime reported no available browser sessions.

Results:

- `/app/calculators/ai-edge-dry-run` passed.
- `/app/calculators/ai-edge-contract` passed.
- `/app/calculators/ai-endpoint-plan` passed.
- `/app/calculators/ai-adapter-status` passed.
- `/app/admin` passed.
- `/app/next-phase` passed.
- `/app/qa` passed.

## Known Limitations

- No real AI provider call yet.
- No deployed Supabase Edge Function.
- No real endpoint URL.
- No provider key or service-role key is configured.
- No frontend fetch path.
- No Supabase writes, audit rows, rate-limit rows, validation-failure rows, or health-check rows.
- No live auth/session ownership check for calculator AI explanations.
- No provider-side safety filter integration.
- No production behavior.
- No sponsor/affiliate integration.
- No AdMob/payment integration.

## Next Recommended Milestone

M61 should add a staging-only Edge Function dry-run stub outside production paths: a non-deployed or local-only function draft, backend-owned validation helpers, lock-hash verification fixtures, server-secret verification checklist, audit/rate-limit dry-run outputs, and tests proving production/default frontend builds still cannot call it.
