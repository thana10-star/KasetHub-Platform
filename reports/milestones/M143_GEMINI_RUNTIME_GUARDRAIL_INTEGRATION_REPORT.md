# M143 Gemini Runtime Guardrail Integration Report

## Summary

M143 adds backend-only guardrail infrastructure around the Gemini dry-run path: output validator, safety fallback mapper, provider timeout wrapper, rollout gate, endpoint integration, and tests. Gemini remains dry-run only, and live provider execution is still unavailable.

## CONTEXT.md Read Confirmation

`CONTEXT.md` was read first and used as current project context. It confirms AI must remain backend/proxy only, no frontend provider key is allowed, AI answers must be Thai farmer-friendly, and unsafe pesticide/chemical overconfidence must remain blocked. `CONTEXT.md` was not modified.

## Graphify Pre-Check Result

Before editing, M143 read:

- `graphify-out/.graphify_analysis.json`
- `graphify-out/graph.json`

Graphify identified the AI route/service/test cluster around `/app/ai`, `src/routes/AIPage.tsx`, `src/services/ai`, AI provider planning types, AI proxy fixtures, AI docs, and prior reports. The graph was used as supplemental context only; actual source files were inspected before editing. `graphify-out` was not modified.

## Files Created/Modified

Created:

- `functions/api/ai/guardrails/output-validator.ts`
- `functions/api/ai/guardrails/output-validator.test.ts`
- `functions/api/ai/guardrails/safety-fallbacks.ts`
- `functions/api/ai/guardrails/safety-fallbacks.test.ts`
- `functions/api/ai/guardrails/provider-timeout.ts`
- `functions/api/ai/guardrails/provider-timeout.test.ts`
- `functions/api/ai/guardrails/rollout-gate.ts`
- `functions/api/ai/guardrails/rollout-gate.test.ts`
- `docs/ai/AI_GEMINI_RUNTIME_GUARDRAILS_M143.md`
- `reports/milestones/M143_GEMINI_RUNTIME_GUARDRAIL_INTEGRATION_REPORT.md`

Modified:

- `functions/api/ai/farmer-assistant.ts`
- `functions/api/ai/farmer-assistant.test.ts`
- `functions/api/ai/providers/gemini-provider.ts`
- `functions/api/ai/providers/provider-factory.ts`
- `functions/api/ai/providers/provider-factory.test.ts`

No `/app/ai` UI, frontend env, Community, Weather, Prices, YouTube, Supabase, auth, or unrelated route files were changed.

## Current AI Architecture Summary

Current M142 architecture before M143:

- `POST /api/ai/farmer-assistant` exists as the backend contract endpoint.
- The endpoint validates input, blocks narrow high-risk chemical/emergency patterns, rate-limits obvious spam, selects a provider, and returns the stable farmer assistant response contract.
- `functions/api/ai/providers/*` contains provider-neutral types, a provider interface, disabled adapter, Gemini dry-run adapter, and provider factory.
- `AI_PROVIDER=gemini` returns Gemini dry-run mock output only.
- `AI_LIVE_ENABLED=true` did not enable live Gemini in M142.
- `src/services/ai/ai-farmer-assistant-client.ts` posts to the backend and normalizes known contract fields.
- `src/routes/AIPage.tsx` calls the backend only behind `VITE_AI_BACKEND_CONTRACT_ENABLED`; otherwise local fixture fallback remains default.
- `src/config/env.ts` exposes no provider secret.

M143 keeps that architecture and adds guardrails around the provider path.

## Output Validator Summary

`output-validator.ts` validates raw provider answer text using deterministic checks.

It detects:

- dangerous chemical mixing
- confident pesticide/fertilizer dosage without label/source cue
- guaranteed diagnosis/profit/yield/cure/sale outcome
- fake live weather, price, or market claims
- fake citation/source claims
- human medical emergency advice
- raw provider errors and stack traces
- secret-like strings
- model IDs
- mostly non-Thai output
- overlong output for high-risk input

It returns `allowed`, `safetyLevel`, `reasonCodes`, and optional `sanitizedAnswer`.

## Safety Fallback Mapper Summary

`safety-fallbacks.ts` maps unsafe output and provider failures into safe Thai contract responses.

Examples:

- unsafe chemical output -> `blocked`, `high_risk`
- fake live data -> cautious `ready`
- provider timeout -> safe `error`
- malformed provider response -> safe `error`
- non-Thai output -> safe `error`
- secret-like output -> safe `error`

It does not expose provider internals.

## Provider Timeout Wrapper Summary

`provider-timeout.ts` wraps provider `generateAnswer()` promises and returns reason codes instead of raw errors.

Behavior:

- default timeout: `8000 ms`
- endpoint reads `AI_PROVIDER_TIMEOUT_MS`
- max cap: `30000 ms`
- timeout returns `provider_timeout`
- thrown errors return `provider_error`
- invalid response shape returns `provider_malformed_response`

M143 tests use mocked promises only.

## Rollout Gate Summary

`rollout-gate.ts` introduces safe gate modes:

- `disabled`
- `dry_run`
- `live_blocked`

Rules:

- missing/disabled provider -> `disabled`
- `AI_PROVIDER=gemini` with missing/false `AI_LIVE_ENABLED` -> `dry_run`
- `AI_PROVIDER=gemini` with `AI_LIVE_ENABLED=true` -> `live_blocked`
- unknown provider -> `disabled`

The provider factory still returns Gemini dry-run in M143. `live_blocked` is a marker that live execution is not available yet.

## Endpoint Integration Summary

`farmer-assistant.ts` now:

1. validates request
2. keeps existing input safety block
3. keeps existing spam/rate-limit fixture
4. selects provider
5. runs provider through timeout wrapper
6. validates output
7. maps unsafe output and provider failures through fallback mapper
8. returns the same contract shape

No provider network call is added.

## Tests Updated

Added or updated tests for:

- output validator safe Thai answer
- output validator chemical mixing, dosage, guaranteed outcomes, fake live data, fake citations, raw errors, model IDs, secret-like output, non-Thai output, and overlong high-risk output
- safety fallback mapper for chemical, fake live data, timeout, and secret-like output
- timeout wrapper fast response, timeout, configured timeout, thrown errors, and malformed response
- rollout gate disabled, dry-run, live-blocked, and unknown provider states
- endpoint Gemini dry-run
- endpoint unsafe mocked provider output fallback
- endpoint timeout fallback
- `AI_LIVE_ENABLED=true` still dry-run/no live call
- existing validation, safety block, and rate-limit behavior

## Verification Results

- `npm run lint`: passed.
- `npm run build`: passed. Vite reported the existing large chunk warning. Build-generated changes to `dist/index.html` and `tsconfig.app.tsbuildinfo` were restored so generated artifacts are not part of M143.
- `git diff --check`: passed. Git reported line-ending warnings for touched TypeScript files only.
- `npm run test -- functions/api/ai/farmer-assistant.test.ts functions/api/ai/providers/gemini-provider.test.ts functions/api/ai/providers/provider-factory.test.ts functions/api/ai/guardrails/output-validator.test.ts functions/api/ai/guardrails/safety-fallbacks.test.ts functions/api/ai/guardrails/provider-timeout.test.ts functions/api/ai/guardrails/rollout-gate.test.ts`: passed, 7 files and 44 tests.
- Added-line provider key scan found no Gemini/OpenAI key values or frontend provider key assignments.

## Known Limitations

- Gemini live execution is still not implemented.
- `GEMINI_API_KEY` is still not required or used.
- The validator is deterministic and intentionally lightweight, not a complete NLP classifier.
- Persistent daily rate limiting is still not implemented.
- The frontend still ignores `providerMode`; backend keeps it for observability while preserving current UI compatibility.
- Production Cloudflare env setup and owner approval checklist are not part of M143.

## Proposed Next Milestone

Recommended:

```text
M144 AI Production Contract QA / Cloudflare Gemini Env Setup Guide
```

M144 should:

- document Cloudflare env setup for Gemini
- confirm `AI_PROVIDER=gemini`
- confirm `GEMINI_API_KEY` is secret only
- confirm `AI_LIVE_ENABLED=false`
- test production disabled/dry-run state
- prepare owner approval checklist
- still make no live Gemini call

## No-Live-Provider Confirmation

M143 did not add:

- live Gemini calls
- live OpenAI calls
- external provider calls
- provider API key values
- frontend provider keys
- `VITE_GEMINI_API_KEY`
- `VITE_OPENAI_API_KEY`
- runtime live AI execution
- fake live AI output
- fake weather/price/source data
- Community changes
- Weather changes
- Prices changes
- YouTube changes
- Supabase changes
- auth changes
- `/app/ai` UI changes
- `CONTEXT.md` changes
- `graphify-out` changes
