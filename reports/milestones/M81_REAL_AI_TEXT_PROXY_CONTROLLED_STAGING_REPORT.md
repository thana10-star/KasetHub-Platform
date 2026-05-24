# M81 Real AI Text Proxy Controlled Staging Report

## Summary

M81 adds the first controlled real AI text proxy integration boundary for KasetHub. The app now has a staging-only AI text proxy domain, env flags, fixture fallback, blocked-action policy, audit/rate-limit previews, provider-key safety checks, UI status route, docs, and tests.

No production AI enablement, frontend provider key, frontend service-role key, unrestricted AI chat, autonomous agronomy advice, exact chemical/fertilizer prescription, sponsor/product recommendation, image AI, Supabase write, backend write, cloud sync write, or default network call was added.

## Files Changed

AI text proxy services:

- `src/services/ai-text/ai-text-proxy.types.ts`
- `src/services/ai-text/ai-text-proxy.ts`
- `src/services/ai-text/ai-text-policy.ts`
- `src/services/ai-text/ai-text-fixtures.ts`
- `src/services/ai-text/ai-text-audit-preview.ts`
- `src/services/ai-text/ai-text-proxy.test.ts`

Env, routes, and UI:

- `.env.example`
- `src/config/env.ts`
- `src/vite-env.d.ts`
- `src/routes/AITextStatusPage.tsx`
- `src/routes/AIProxyStatusPage.tsx`
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

Docs:

- `docs/AI_TEXT_PROXY_STAGING_CONTRACT.md`
- `docs/AI_TEXT_PROVIDER_KEY_SECURITY.md`
- `docs/AI_TEXT_SAFETY_BOUNDARY.md`
- `docs/REAL_AI_TEXT_PROXY_CONTROLLED_STAGING.md`
- `docs/AI_TEXT_RATE_LIMIT_AND_AUDIT_PLAN.md`
- `docs/AI_TEXT_BLOCKED_ACTION_POLICY.md`
- `docs/CALCULATOR_AI_BACKEND_ARCHITECTURE.md`
- `docs/CALCULATOR_AI_BACKEND_ADAPTER_CONTRACT.md`
- `docs/WEATHER_RISK_SAFETY_POLICY.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/SUPABASE_SCHEMA_DRAFT.md`
- `docs/SUPABASE_TYPE_MAPPING.md`
- `README.md`

Build artifacts updated by verification:

- `dist/index.html`
- `tsconfig.app.tsbuildinfo`

## Routes Added

- `/app/ai-text-status`

## AI Proxy Notes

M81 supports these modes:

- `local_fixture`
- `staging_proxy_disabled`
- `staging_proxy_ready`
- `production_disabled`

Default behavior remains `local_fixture` with no network. The staging proxy can only be considered when `VITE_ENABLE_REAL_AI_TEXT=true`, `VITE_AI_TEXT_MODE=staging_proxy_ready`, `VITE_AI_TEXT_PROXY_MODE=staging_proxy`, and `VITE_ENABLE_AI_TEXT_NETWORK=true`.

Because M81 does not add a backend endpoint URL, the staging-ready path still returns a controlled disabled state instead of calling a provider.

## Safety Boundary Notes

Allowed request types:

- calculator explanation
- weather caution explanation
- educational explanation

Blocked actions:

- exact pesticide recommendation
- exact fertilizer dose
- guaranteed yield/profit
- legal/financial certainty
- sponsor/product injection
- autonomous diagnosis
- unsafe medical/chemical advice
- unsupported request type

Calculator explanation responses preserve locked output snapshots and keep deterministic results immutable.

## Audit / Rate-limit Notes

M81 adds local previews for audit and rate-limit planning:

- `wouldWriteAuditLog: false`
- `wouldWriteRateLimit: false`
- `noSupabaseWrite: true`
- `noCloudSyncWrite: true`
- release gate required before broader rollout

Future schema planning now includes:

- `ai_text_requests`
- `ai_text_audit_logs`
- `ai_text_rate_limits`
- `ai_text_release_gates`
- `ai_text_blocked_actions`

No migrations were run.

## Tests

Vitest coverage includes:

- default mode stays local fixture
- no network without flags
- frontend cannot access provider key
- blocked actions are rejected
- immutable calculator result is preserved
- no sponsor/product recommendation is generated
- no exact chemical/fertilizer prescription is generated
- no guaranteed outcome language is generated
- audit preview is generated
- rate-limit preview is generated

Result:

- 21 test files passed.
- 231 tests passed.

## Verification Commands

```bash
npm run lint
npm run test
npm run build
```

Results:

- `npm run lint` passed.
- `npm run test` passed: 21 files, 231 tests.
- `npm run build` passed.
- Vite reported the existing large chunk warning after production build.

Manual route checks were run against `http://127.0.0.1:5173` using Chrome headless DOM rendering.

Checked routes:

- `/app/ai-text-status` passed.
- `/app/weather` passed.
- `/app/weather/risk-rules` passed.
- `/app/calculators/ai-explanation-preview` passed.
- `/app/calculators/ai-adapter-status` passed.
- `/app/admin` passed.
- `/app/next-phase` passed.
- `/app/qa` passed.

## Known Limitations

- No real backend AI text proxy endpoint exists yet.
- No provider key is configured.
- No production AI behavior is enabled.
- No direct provider call exists in frontend.
- No unrestricted AI assistant flow exists.
- No Supabase audit/rate-limit tables, writes, RLS policies, or migrations exist.
- No cloud sync write or user history upload exists.
- Calculator/weather AI text remains narrow, guarded, and fallback-oriented.

## Next Recommended Milestone

M82 should add a backend-owned staging proxy endpoint contract or local Edge Function dry-run for AI text: typed request/response payloads, server-only provider-key checks, endpoint URL gating, audit/rate-limit dry-run output, provider timeout handling, and tests proving production/default frontend builds still cannot call the provider or bypass blocked actions.
