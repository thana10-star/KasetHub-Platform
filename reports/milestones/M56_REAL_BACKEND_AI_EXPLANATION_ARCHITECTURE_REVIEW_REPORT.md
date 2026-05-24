# M56 Real Backend AI Explanation Architecture Review Report

## Summary

M56 designs the future backend AI explanation architecture for KasetHub calculator explanations before enabling live AI calls. The milestone adds local-only backend architecture types, snapshot locking rules, policy version planning, audit/rate-limit planning, safety escalation fixtures, tests, docs, and an in-app architecture review route.

No real AI API calls, backend writes, Supabase writes, AdMob integration, sponsor/affiliate integration, cloud sync, or network calls were added.

## Files Changed

Backend AI architecture services:

- `src/services/agri-calculators/calculator-ai-backend.types.ts`
- `src/services/agri-calculators/calculator-ai-backend-review.ts`
- `src/services/agri-calculators/agri-calculator-service.test.ts`

Routes and UI:

- `src/routes/CalculatorAIArchitecturePage.tsx`
- `src/routes/CalculatorAIExplanationPreviewPage.tsx`
- `src/routes/CalculatorsPage.tsx`
- `src/routes/CalculatorQAPage.tsx`
- `src/routes/CalculatorSafetyPage.tsx`
- `src/routes/AdminDashboardPage.tsx`
- `src/routes/NextPhasePage.tsx`
- `src/routes/QAPage.tsx`
- `src/app/App.tsx`
- `src/types/kaset.ts`
- `src/services/qa/route-registry.ts`

Docs:

- `docs/CALCULATOR_AI_BACKEND_ARCHITECTURE.md`
- `docs/CALCULATOR_AI_POLICY_VERSIONING_PLAN.md`
- `docs/CALCULATOR_AI_AUDIT_AND_RATE_LIMIT_PLAN.md`
- `docs/CALCULATOR_AI_EXPLANATION_BOUNDARY.md`
- `docs/CALCULATOR_AI_PROMPT_SAFETY_POLICY.md`
- `docs/CALCULATOR_REGRESSION_SAFETY.md`
- `docs/AI_AGRICULTURE_SAFETY_POLICY.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/SUPABASE_SCHEMA_DRAFT.md`
- `docs/SUPABASE_TYPE_MAPPING.md`
- `README.md`

Build artifacts updated by verification:

- `dist/index.html`
- `tsconfig.app.tsbuildinfo`

## Routes Added

- `/app/calculators/ai-architecture`

## Snapshot Locking Notes

M56 defines `CalculatorAIExecutionSnapshot` for future backend AI explanation requests. Snapshot rules:

- calculator result values are frozen before AI explanation
- AI receives an explanation-only snapshot
- AI cannot recompute formulas
- AI cannot mutate outputs
- AI must echo locked result values only
- snapshot includes a deterministic lock hash for future backend verification

The current implementation is a local architecture review only and does not send snapshots to a backend.

## Policy Version Notes

M56 defines local `CalculatorAIPolicyVersion` examples:

- `calc-ai-policy-v2026-05-m56`
- `calc-ai-policy-v2026-05-m56-strict`

Policy versions include prompt template ids, allowed actions, blocked actions, escalation triggers, banned response categories, sponsor separation rules, and audit requirements.

Banned categories include hidden sponsor/affiliate content, chemical product recommendation, fertilizer dose outside the locked snapshot, guaranteed yield/profit, label override, and uncertainty removal.

## Audit / Rate-limit Notes

M56 defines a future `CalculatorAIAuditLogPlan` and `CalculatorAIRateLimitPlan`.

Planned controls include:

- daily explanation limit
- rewarded-ad convenience boundary
- repeated request handling
- oversized payload rejection
- invalid crop profile handling
- spam prevention
- safety events for blocked/sponsor/chemical/label override attempts

Future schema planning now includes:

- `calculator_ai_audit_logs`
- `calculator_ai_policy_versions`
- `calculator_ai_rate_limits`
- `calculator_ai_explanations`
- `calculator_ai_safety_events`

No migrations were run.

## Tests

Vitest coverage now includes:

- snapshot immutability before AI explanation
- blocked deterministic result mutation attempts
- banned sponsor insertion rejection
- invalid explanation request rejection when locked result values are missing
- policy version selection
- oversized explanation payload rejection
- invalid crop profile rejection

Result:

- 1 test file passed.
- 36 tests passed.

## Verification Commands

```bash
npm run lint
npm run test
npm run build
```

Results:

- `npm run lint` passed.
- `npm run test` passed: 1 file, 36 tests.
- `npm run build` passed.
- Vite reported the existing large chunk warning after production build.

Manual route checks were run against `http://127.0.0.1:5173` using Chrome headless DOM rendering because the in-app Browser runtime reported no available browser sessions.

Checked routes:

- `/app/calculators/ai-architecture` passed.
- `/app/calculators/ai-explanation-preview` passed.
- `/app/calculators/qa` passed.
- `/app/calculators/safety` passed.
- `/app/admin` passed.
- `/app/next-phase` passed.
- `/app/qa` passed.

## Known Limitations

- No real AI API call yet.
- No backend endpoint or Edge Function exists yet.
- No backend writes or Supabase writes.
- No cloud sync or authenticated explanation history.
- No real policy table or audit log table.
- No provider-side safety filter integration.
- No real rate-limit enforcement.
- No sponsor/affiliate integration.
- No AdMob/payment integration.

## Next Recommended Milestone

M57 should add a disabled-by-default backend adapter contract for calculator AI explanations: request/response payloads, feature flags, local fixture mode, backend-disabled mode, and tests proving the adapter cannot call a network endpoint unless future explicit staging flags are enabled.
