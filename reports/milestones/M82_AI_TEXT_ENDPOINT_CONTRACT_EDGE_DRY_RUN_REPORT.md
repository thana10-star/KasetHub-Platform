# M82 AI Text Endpoint Contract + Edge Dry-run Report

## Summary

M82 prepares the backend-owned staging proxy endpoint contract for real AI text responses. The app now has typed `ai-text-proxy` request/response payloads, endpoint URL gating, server-only provider/service-role boundaries, audit/rate-limit dry-run outputs, timeout planning, planning-only Edge draft artifacts, docs, tests, and an in-app endpoint plan route.

No production AI enablement, provider key in frontend, service-role key in frontend, direct provider call, unrestricted AI chat, autonomous agronomy advice, exact chemical/fertilizer prescription, sponsor/product recommendation, image AI, Supabase write, or deployed Edge Function was added.

## Files Changed

AI text endpoint contract services:

- `src/services/ai-text/ai-text-endpoint-contract.types.ts`
- `src/services/ai-text/ai-text-endpoint-contract.ts`
- `src/services/ai-text/ai-text-endpoint-dry-run.ts`
- `src/services/ai-text/ai-text-endpoint-contract.test.ts`
- `src/services/ai-text/ai-text-proxy.types.ts`

Env, routes, and UI:

- `.env.example`
- `src/config/env.ts`
- `src/vite-env.d.ts`
- `src/routes/AITextEndpointPlanPage.tsx`
- `src/routes/AITextStatusPage.tsx`
- `src/routes/CalculatorAIExplanationPreviewPage.tsx`
- `src/routes/CalculatorAIAdapterStatusPage.tsx`
- `src/routes/WeatherPage.tsx`
- `src/routes/WeatherRiskRulesPage.tsx`
- `src/routes/WeatherRiskReviewPage.tsx`
- `src/routes/WeatherRiskAuditPage.tsx`
- `src/routes/WeatherQAPage.tsx`
- `src/routes/AdminDashboardPage.tsx`
- `src/routes/NextPhasePage.tsx`
- `src/routes/QAPage.tsx`
- `src/app/App.tsx`
- `src/types/kaset.ts`
- `src/services/qa/route-registry.ts`

Planning-only Edge draft artifacts:

- `supabase/drafts/ai-text-proxy/README.md`
- `supabase/drafts/ai-text-proxy/ai-text-proxy-contract.example.json`
- `supabase/drafts/ai-text-proxy/ai-text-proxy-security-checklist.md`

Docs:

- `docs/AI_TEXT_ENDPOINT_CONTRACT.md`
- `docs/AI_TEXT_ENDPOINT_DRY_RUN_PLAN.md`
- `docs/AI_TEXT_ENDPOINT_SECURITY_CHECKLIST.md`
- `docs/AI_TEXT_PROVIDER_TIMEOUT_POLICY.md`
- `docs/AI_TEXT_PROXY_STAGING_CONTRACT.md`
- `docs/AI_TEXT_PROVIDER_KEY_SECURITY.md`
- `docs/REAL_AI_TEXT_PROXY_CONTROLLED_STAGING.md`
- `docs/AI_TEXT_RATE_LIMIT_AND_AUDIT_PLAN.md`
- `docs/AI_TEXT_BLOCKED_ACTION_POLICY.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/SUPABASE_SCHEMA_DRAFT.md`
- `docs/SUPABASE_TYPE_MAPPING.md`
- `README.md`

Build artifacts updated by verification:

- `dist/index.html`
- `tsconfig.app.tsbuildinfo`

## Routes Added

- `/app/ai-text-endpoint-plan`

## Env Flags

M82 adds placeholders only:

```env
VITE_AI_TEXT_ENDPOINT_URL=
VITE_ENABLE_AI_TEXT_ENDPOINT_DRY_RUN=false
VITE_ENABLE_AI_TEXT_ENDPOINT_NETWORK=false
```

Defaults keep endpoint URL empty, dry-run disabled, and endpoint network disabled.

## Endpoint Contract Notes

The planned endpoint name is:

- `ai-text-proxy`

M82 defines:

- `AITextEndpointRequest`
- `AITextEndpointResponse`
- `AITextEndpointAuthContext`
- `AITextEndpointPolicyCheck`
- `AITextEndpointAuditEvent`
- `AITextEndpointRateLimitCheck`
- `AITextEndpointTimeoutPlan`
- `AITextEndpointFailureMode`
- `AITextEndpointBlockedReason`

Allowed request types remain calculator explanation, weather caution explanation, and educational explanation only.

## Security Boundary Notes

- Provider keys must live only in backend or Edge Function secret stores.
- Supabase service-role keys must never be in Vite/frontend env.
- Endpoint URL alone is not enough.
- Network flag alone is not enough.
- AI text mode alone is not enough.
- `production_disabled` blocks all calls.
- Unsafe categories are blocked before any provider path.
- Calculator locked snapshots remain immutable.

## Dry-run Notes

M82 keeps:

- `canCallEndpoint: false`
- `fetchWouldRun: false`
- `providerWouldRun: false`
- `providerCalled: false`
- `networkAttempted: false`
- `noSupabaseWrite: true`

Audit/rate-limit previews are local-only. Timeout plans return safe fallback copy and cannot mutate deterministic calculator results.

## Tests

Vitest coverage includes:

- endpoint URL alone does not enable network
- network flag alone does not enable network
- dry-run flag still does not call provider
- provider key is rejected from frontend config
- service-role key is rejected
- endpoint request blocks unsafe categories
- timeout plan returns safe fallback
- audit/rate-limit previews do not write Supabase
- production/default frontend cannot call provider
- calculator snapshot remains immutable

Result:

- 22 test files passed.
- 243 tests passed.

## Verification Commands

```bash
npm run lint
npm run test
npm run build
```

Results:

- `npm run lint` passed.
- `npm run test` passed: 22 files, 243 tests.
- `npm run build` passed.
- Vite reported the existing large chunk warning after production build.

Manual route checks:

- `/app/ai-text-status`
- `/app/ai-text-endpoint-plan`
- `/app/admin`
- `/app/next-phase`
- `/app/qa`
- `/app/calculators/ai-explanation-preview`
- `/app/weather/risk-rules`

Results:

Manual route checks were run against `http://127.0.0.1:5173` using Chrome/Edge headless DOM rendering.

- `/app/ai-text-status` passed.
- `/app/ai-text-endpoint-plan` passed.
- `/app/admin` passed.
- `/app/next-phase` passed.
- `/app/qa` passed.
- `/app/calculators/ai-explanation-preview` passed.
- `/app/weather/risk-rules` passed.

## Known Limitations

- No real backend AI text proxy endpoint exists yet.
- No Edge Function is deployed.
- No provider key is configured.
- No production AI behavior is enabled.
- No direct provider call exists in frontend.
- No unrestricted AI assistant flow exists.
- No Supabase audit/rate-limit/endpoint tables, writes, RLS policies, or migrations exist.
- No cloud sync write or user history upload exists.

## Next Recommended Milestone

M83 should add a staging-only local Edge Function implementation plan for AI text: non-deployed handler draft, server-secret validation checklist, endpoint URL gating fixtures, audit/rate-limit dry-run outputs, provider timeout fixtures, and proof that production/default frontend builds still cannot call the provider or bypass blocked actions.
