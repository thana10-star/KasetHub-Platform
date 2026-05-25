# M59 Calculator AI Backend Endpoint Contract + Edge Function Stub Report

## Summary

M59 drafts the future backend endpoint contract and Supabase Edge Function design stub for KasetHub calculator AI explanations. The app now has typed `calculator-ai-explain` request/response contracts, server-only key boundaries, lock-hash and policy checks, audit/rate-limit hooks, timeout planning, failure modes, tests, docs, and an in-app contract review route.

No real AI API calls, deployed Edge Function, provider keys, frontend service-role keys, Supabase writes, production behavior, or default network calls were added.

## Files Changed

Edge Function contract services:

- `src/services/agri-calculators/calculator-ai-edge-contract.types.ts`
- `src/services/agri-calculators/calculator-ai-edge-contract.ts`
- `src/services/agri-calculators/calculator-ai-endpoint-plan.ts`
- `src/services/agri-calculators/agri-calculator-service.test.ts`

Routes and UI:

- `src/routes/CalculatorAIEdgeContractPage.tsx`
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

- `docs/CALCULATOR_AI_EDGE_FUNCTION_CONTRACT.md`
- `docs/CALCULATOR_AI_EDGE_FUNCTION_SECURITY_PLAN.md`
- `docs/CALCULATOR_AI_BACKEND_ADAPTER_CONTRACT.md`
- `docs/CALCULATOR_AI_BACKEND_ARCHITECTURE.md`
- `docs/CALCULATOR_AI_EXPLANATION_BOUNDARY.md`
- `docs/CALCULATOR_AI_NETWORK_BOUNDARY_RULES.md`
- `docs/CALCULATOR_AI_POLICY_VERSIONING_PLAN.md`
- `docs/CALCULATOR_AI_PROMPT_SAFETY_POLICY.md`
- `docs/CALCULATOR_AI_STAGING_ENDPOINT_CHECKLIST.md`
- `docs/CALCULATOR_AI_STAGING_FLAGS_PLAN.md`
- `docs/CALCULATOR_AI_AUDIT_AND_RATE_LIMIT_PLAN.md`
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

- `/app/calculators/ai-edge-contract`

## Edge Function Contract Notes

The future endpoint name is:

- `calculator-ai-explain`

M59 defines:

- `CalculatorAIEdgeRequest`
- `CalculatorAIEdgeResponse`
- `CalculatorAIEdgeAuthContext`
- `CalculatorAIEdgePolicyCheck`
- `CalculatorAIEdgeAuditEvent`
- `CalculatorAIEdgeRateLimitCheck`
- `CalculatorAIEdgeTimeoutPlan`
- `CalculatorAIEdgeFailureMode`

The contract is a local design stub only. It does not deploy or call an Edge Function.

## Security Boundary Notes

- Provider keys must live only in backend or Edge Function secret stores.
- Supabase service-role keys must never be in frontend code or Vite env.
- The frontend payload excludes provider keys, service-role keys, and sponsor payloads.
- Lock-hash mismatch blocks before provider paths.
- Policy version mismatch blocks before provider paths.
- Sponsor, affiliate, chemical/product, label override, formula mutation, and hidden recommendation attempts remain blocked.

## Audit / Rate-limit / Timeout Notes

M59 adds local preview hooks for:

- request received
- snapshot lock verified
- policy checked
- rate limit checked
- provider skipped
- safety filtered
- timeout fallback

All audit events are marked `wouldWriteSupabase: false`. Timeout plans return safe disabled copy and cannot mutate deterministic calculator results.

## Tests

Vitest coverage now includes:

- Edge request and response contract creation
- endpoint name `calculator-ai-explain`
- provider keys and service-role keys excluded from frontend payloads
- no provider call, network call, or Supabase write
- lock-hash mismatch blocked before provider paths
- policy mismatch blocked before provider paths
- timeout plan cannot mutate deterministic results
- audit and rate-limit hooks remain planning-only

Result:

- 1 test file passed.
- 48 tests passed.

## Verification Commands

```bash
npm run lint
npm run test
npm run build
```

Results:

- `npm run lint` passed.
- `npm run test` passed: 1 file, 48 tests.
- `npm run build` passed.
- Vite reported the existing large chunk warning after production build.

Manual route checks were run against `http://127.0.0.1:5173` using Chrome headless DOM rendering because the in-app Browser runtime reported no available browser sessions.

Checked routes:

- `/app/calculators/ai-edge-contract` passed.
- `/app/calculators/ai-endpoint-plan` passed.
- `/app/calculators/ai-adapter-status` passed.
- `/app/calculators/qa` passed.
- `/app/admin` passed.
- `/app/next-phase` passed.
- `/app/qa` passed.

## Known Limitations

- No real AI API call yet.
- No Supabase Edge Function is deployed.
- No backend endpoint URL exists yet.
- No provider key or service-role key is configured.
- No Supabase writes, audit rows, rate-limit rows, or provider attempt rows occur.
- No live auth/session ownership check exists for calculator AI explanations yet.
- No provider-side safety filter integration exists yet.
- No crop-specific recommendation runtime or pesticide/chemical recommendation engine exists.
- No sponsor/affiliate integration exists.

## Next Recommended Milestone

M60 should add a staging-only Edge Function dry-run implementation plan with no provider call: local endpoint URL gating, request validation fixtures, server-only secret checklist, lock-hash verification tests, policy check fixtures, audit/rate-limit dry-run outputs, and proof that production/default frontend builds still cannot call the endpoint.
