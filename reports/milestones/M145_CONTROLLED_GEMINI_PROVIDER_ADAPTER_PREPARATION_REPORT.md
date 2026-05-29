# M145 Controlled Gemini Provider Adapter Preparation Report

## Summary

M145 prepares backend-only Gemini adapter internals for a future controlled live provider milestone. It adds a request builder, safety-settings mapper, response parser, error mapper, and no-network tests while keeping Gemini dry-run only.

## CONTEXT.md Read Confirmation

`CONTEXT.md` was read first and used as the current project context. It confirms AI must remain backend/proxy only, no frontend provider key is allowed, AI answers must be Thai farmer-friendly, and unsafe pesticide/chemical overconfidence must remain blocked. `CONTEXT.md` was not modified.

## Graphify Pre-Check Result

Before editing, M145 read:

- `graphify-out/.graphify_analysis.json`
- `graphify-out/graph.json`

Graphify identified the AI route/service/test/docs cluster around `/app/ai`, `src/routes/AIPage.tsx`, `src/services/ai`, AI provider planning utilities, AI endpoint contract docs, and milestone reports. The graph was used as supplemental context only; actual source files and docs were inspected before editing. `graphify-out` was not modified.

## Files Created/Modified

Created:

- `functions/api/ai/providers/gemini-request-builder.ts`
- `functions/api/ai/providers/gemini-request-builder.test.ts`
- `functions/api/ai/providers/gemini-safety-settings.ts`
- `functions/api/ai/providers/gemini-safety-settings.test.ts`
- `functions/api/ai/providers/gemini-response-parser.ts`
- `functions/api/ai/providers/gemini-response-parser.test.ts`
- `functions/api/ai/providers/gemini-error-mapper.ts`
- `functions/api/ai/providers/gemini-error-mapper.test.ts`
- `docs/ai/AI_GEMINI_PROVIDER_ADAPTER_PREPARATION_M145.md`
- `reports/milestones/M145_CONTROLLED_GEMINI_PROVIDER_ADAPTER_PREPARATION_REPORT.md`

Modified:

- None outside the M145 provider-preparation docs/report set and new backend provider-preparation utilities/tests.

No `/app/ai` UI, frontend env code, Community, Weather, Prices, YouTube, Supabase, auth, `CONTEXT.md`, or `graphify-out` files were changed.

## Current AI Readiness Summary

Inspected current implementation:

- `functions/api/ai/farmer-assistant.ts`
- `functions/api/ai/providers/*`
- `functions/api/ai/guardrails/*`
- `src/services/ai/ai-farmer-assistant-client.ts`
- `src/routes/AIPage.tsx`
- `src/config/env.ts`
- M141-M144 Gemini AI docs and milestone reports

Current readiness:

- `POST /api/ai/farmer-assistant` validates JSON, question length, topic, user mode, and optional context.
- High-risk input blocks obvious chemical dosage, chemical mixing, and emergency-health patterns before provider execution.
- Obvious spam returns the existing safe `rate_limited` fixture path.
- Provider abstraction exists with disabled and Gemini dry-run adapters.
- `AI_PROVIDER=gemini` selects Gemini dry-run output only.
- `AI_LIVE_ENABLED=true` still cannot call live Gemini.
- Provider execution is wrapped by a timeout guard.
- Provider output passes through the deterministic output validator.
- Unsafe, malformed, timeout, or secret-like output maps to safe Thai fallback responses.
- `/app/ai` calls the backend contract only when `VITE_AI_BACKEND_CONTRACT_ENABLED=true`; otherwise local fixture fallback remains available.
- `src/config/env.ts` exposes no provider secret and reads only frontend-safe flags.

## Request Builder Summary

Created `functions/api/ai/providers/gemini-request-builder.ts`.

The builder:

- accepts validated farmer assistant request context
- accepts model and generation config
- builds a planned Gemini `generateContent` request body
- includes the Thai farmer assistant system instruction shape
- includes user question, topic, user mode, crop, and province context
- applies conservative generation config
- adds safety settings from the mapper
- marks the field shape as requiring verification before live activation

It does not include secrets, auth headers, SDK usage, or network calls.

Official references checked for the planned shape:

- [Gemini GenerateContent API](https://ai.google.dev/api/generate-content)
- [Gemini safety settings](https://ai.google.dev/gemini-api/docs/safety-settings)

## Safety Settings Mapper Summary

Created `functions/api/ai/providers/gemini-safety-settings.ts`.

The mapper prepares conservative future safety settings for:

- harassment
- hate speech
- sexually explicit content
- dangerous content
- civic integrity if supported by the selected API/model version

Dangerous content uses the strictest planned threshold. Unsupported categories are skipped safely. The mapper documentation and tests make clear that Gemini safety settings do not replace KasetHub's own input/output guardrails.

## Response Parser Summary

Created `functions/api/ai/providers/gemini-response-parser.ts`.

The parser handles mocked Gemini-like responses for:

- normal text
- empty candidates
- blocked/safety response
- malformed response
- missing text
- finish reason and safety metadata

It converts parser failures into safe internal reason codes and does not expose raw provider internals. Successful M145 parsed responses remain `provider: "mock"` and `providerMode: "dry_run"`.

## Error Mapper Summary

Created `functions/api/ai/providers/gemini-error-mapper.ts`.

The mapper converts future Gemini error shapes into safe internal reason codes:

- `gemini_timeout`
- `gemini_rate_limited`
- `gemini_auth_error`
- `gemini_quota_exceeded`
- `gemini_safety_blocked`
- `gemini_malformed_response`
- `gemini_provider_error`

It returns retryability and optional HTTP status only. It does not return raw provider messages or secret-like values.

## Gemini Provider Integration Summary

The live provider path remains unimplemented. The existing `gemini-provider.ts` dry-run adapter remains the only runtime Gemini adapter.

The new M145 utilities are preparation-only and are tested directly with mocked inputs. The endpoint and provider factory continue to keep Gemini in dry-run mode even when `AI_LIVE_ENABLED=true`.

## Tests Updated

Added no-network tests for:

- request builder shape
- Thai system instruction inclusion
- user question and optional context inclusion
- max output token application
- no secret fields
- no `fetch` call
- conservative safety settings
- unsupported safety category handling
- normal mocked Gemini text parsing
- empty candidates
- safety-blocked responses
- malformed responses
- missing text
- timeout, rate-limit, auth, quota, safety, malformed, and unknown provider error mapping

Existing endpoint, provider, provider factory, and guardrail tests remain part of the verification set.

## Verification Results

- `npm run lint`: passed.
- `npm run build`: passed. Vite reported the existing large chunk warning after production build. Build-generated changes to `dist/index.html` and `tsconfig.app.tsbuildinfo` were restored so generated artifacts are not part of M145.
- `npm run test -- functions/api/ai/farmer-assistant.test.ts functions/api/ai/providers/gemini-provider.test.ts functions/api/ai/providers/provider-factory.test.ts functions/api/ai/guardrails/output-validator.test.ts functions/api/ai/guardrails/safety-fallbacks.test.ts functions/api/ai/guardrails/provider-timeout.test.ts functions/api/ai/guardrails/rollout-gate.test.ts functions/api/ai/providers/gemini-request-builder.test.ts functions/api/ai/providers/gemini-safety-settings.test.ts functions/api/ai/providers/gemini-response-parser.test.ts functions/api/ai/providers/gemini-error-mapper.test.ts`: passed, 11 files and 61 tests.
- `git diff --check`: passed.
- Provider key pattern scan found no provider key values or frontend provider key assignments. It only matched negative secret-leak assertions in tests.

## Known Limitations

- Gemini live execution is still not implemented.
- `GEMINI_API_KEY` is still not required or used by runtime code.
- The request builder uses a planned Gemini request shape and must be verified against current Gemini documentation before live activation.
- No Gemini SDK was added.
- No production smoke test was executed in M145.
- Persistent daily counters are still not implemented.
- The parser is tested against mocked Gemini-like responses, not live provider output.

## Proposed Next Milestone

Recommended:

```text
M146 Gemini Secret Setup + Production Dry-Run Verification
```

M146 should:

- set or document setting `GEMINI_API_KEY` as a Cloudflare secret only
- keep `AI_LIVE_ENABLED=false`
- verify production endpoint still returns dry-run or not-configured behavior
- verify no frontend secret exposure
- run production smoke tests
- still make no live Gemini call

## No-Live-Provider Confirmation

M145 did not add:

- live Gemini calls
- live OpenAI calls
- external provider calls
- Gemini SDK
- provider API key values
- frontend provider keys
- `VITE_GEMINI_API_KEY`
- `VITE_OPENAI_API_KEY`
- runtime live AI execution
- fake live AI output
- fake weather/price/source data
- `/app/ai` UI changes
- Community changes
- Weather changes
- Prices changes
- YouTube changes
- Supabase changes
- auth changes
- `CONTEXT.md` changes
- `graphify-out` changes
