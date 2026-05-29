# M147 Controlled Gemini Live Adapter Report

## Summary

M147 added a backend-only, live-capable Gemini adapter path while keeping the production endpoint dry-run/non-live by default. The adapter can build a Gemini `generateContent` request, use a server-side key only in an injected request header, parse mocked Gemini-like responses, and map provider/parser failures through safe Thai fallbacks.

No live Gemini request was executed. No Gemini SDK was added. No real provider key value was added.

## CONTEXT.md Read Confirmation

Read `CONTEXT.md` before implementation. Relevant constraints confirmed:

- KasetHub AI must be backend/server-side only for provider secrets.
- Farmer assistant responses must be Thai, practical, and safety-first.
- Unsafe pesticide/chemical guidance must be blocked or cautioned.
- Graphify context must be read before editing.
- `CONTEXT.md`, `graphify-out`, generated/cache files, and secrets must not be modified or committed.

## Graphify Pre-Check Result

Read:

- `graphify-out/.graphify_analysis.json`
- `graphify-out/graph.json`

Graphify confirmed the relevant AI dependency cluster around:

- `functions/api/ai/farmer-assistant.ts`
- `functions/api/ai/providers/*`
- `functions/api/ai/guardrails/*`
- `src/services/ai/ai-farmer-assistant-client.ts`
- `src/routes/AIPage.tsx`
- `docs/ai/*`
- `reports/milestones/M145*`
- `reports/milestones/M146*`

No `graphify-out` files were modified.

## Files Created/Modified

Created:

- `docs/ai/AI_GEMINI_LIVE_ADAPTER_M147.md`
- `functions/api/ai/providers/gemini-live-provider.ts`
- `functions/api/ai/providers/gemini-live-provider.test.ts`
- `reports/milestones/M147_CONTROLLED_GEMINI_LIVE_ADAPTER_REPORT.md`

Modified:

- `functions/api/ai/farmer-assistant.test.ts`
- `functions/api/ai/guardrails/rollout-gate.ts`
- `functions/api/ai/guardrails/rollout-gate.test.ts`
- `functions/api/ai/guardrails/safety-fallbacks.ts`
- `functions/api/ai/providers/provider-factory.ts`
- `functions/api/ai/providers/provider-factory.test.ts`
- `functions/api/ai/providers/provider-types.ts`

Unmodified by design:

- `CONTEXT.md`
- `graphify-out/*`
- `/app/ai` UI files
- Community, Weather, Prices, YouTube, Supabase, and auth code

## Current Readiness Summary

Before M147:

- `/api/ai/farmer-assistant` validated requests, blocked high-risk input, selected a provider, ran the provider through the timeout wrapper, validated output, and mapped unsafe output to fallback responses.
- `AI_PROVIDER=gemini` selected a dry-run adapter only.
- `AI_LIVE_ENABLED=true` was ignored/blocked by rollout gate design.
- M145 had inert Gemini request builder, safety settings, parser, and error mapper utilities.
- M146 documented Cloudflare secret setup and production dry-run verification.

After M147:

- the endpoint still remains dry-run/non-live by default
- a live-capable adapter exists for future controlled activation
- live-capable code is reachable only through explicit internal test gates and an injected mock fetcher

## Live Adapter Architecture Summary

New file:

- `functions/api/ai/providers/gemini-live-provider.ts`

The adapter:

- uses `buildGeminiFarmerAssistantRequest()` from M145
- builds a planned `models/{model}:generateContent` URL
- sends the API key only in the backend `x-goog-api-key` header
- accepts `fetcher` as a dependency
- uses `parseGeminiFarmerAssistantResponse()` for mocked provider responses
- uses `mapGeminiProviderError()` for HTTP/network-style failures
- maps failures through `mapGuardrailFailureToResponse()`

Reference check completed on 2026-05-29 against official Gemini docs:

- [Gemini GenerateContent API](https://ai.google.dev/api/generate-content)
- [Gemini API reference](https://ai.google.dev/api)

Final auth/model/API details still need verification immediately before live smoke.

## Gate Behavior Summary

`evaluateAIRolloutGate()` now supports:

- `disabled`
- `dry_run`
- `live_blocked`
- `live`

Live mode is allowed only when all internal gates are true:

- `AI_PROVIDER=gemini`
- `AI_LIVE_ENABLED=true`
- server-side `GEMINI_API_KEY` exists
- `allowLiveExecution=true` is passed internally
- injected `fetcher` exists

The production endpoint does not pass `allowLiveExecution` or injected fetch, so it remains dry-run/live-blocked after M147.

## Fetch Injection/No-Network Testing Summary

Tests verify:

- dry-run never calls fetch
- missing injected fetch keeps the adapter dry-run
- the live-capable adapter calls only the injected mock fetcher
- the request URL, headers, and body are inspectable without a network call
- placeholder key values are not returned in serialized responses
- global fetch is not called accidentally when not injected

## Endpoint Integration Summary

The provider factory now can construct the live-capable Gemini provider, but default endpoint use remains non-live because `selectFarmerAssistantProvider(env)` is called without live options.

Endpoint behavior remains:

- validation first
- high-risk input blocks before provider
- spam/rate-limit fixture still works
- provider timeout wrapper still wraps provider execution
- output validator still runs
- unsafe provider output is replaced with safe fallback

M147 adds an endpoint test proving `AI_PROVIDER=gemini`, `AI_LIVE_ENABLED=true`, and a server-side placeholder key still do not trigger global fetch or live output.

## Tests Updated

Added:

- `functions/api/ai/providers/gemini-live-provider.test.ts`

Updated:

- `functions/api/ai/farmer-assistant.test.ts`
- `functions/api/ai/providers/provider-factory.test.ts`
- `functions/api/ai/guardrails/rollout-gate.test.ts`

Covered cases:

- Gemini dry-run still does not require a key
- dry-run never calls fetch
- internal live adapter builds planned request shape
- key placeholder stays backend-only and is not serialized
- normal mocked Gemini-like response parses safely
- safety-blocked response maps to high-risk fallback
- malformed response maps safely
- 401/403 map to not-configured fallback
- 429 maps to rate-limit fallback
- 5xx and injected fetch failure map to safe error fallback
- endpoint remains dry-run when live flag and placeholder key are present

## Verification Results

Passed:

- `npm run lint`
- `npm run build`
- `npm run test -- functions/api/ai/farmer-assistant.test.ts functions/api/ai/providers/gemini-provider.test.ts functions/api/ai/providers/provider-factory.test.ts functions/api/ai/guardrails/output-validator.test.ts functions/api/ai/guardrails/safety-fallbacks.test.ts functions/api/ai/guardrails/provider-timeout.test.ts functions/api/ai/guardrails/rollout-gate.test.ts functions/api/ai/providers/gemini-request-builder.test.ts functions/api/ai/providers/gemini-safety-settings.test.ts functions/api/ai/providers/gemini-response-parser.test.ts functions/api/ai/providers/gemini-error-mapper.test.ts functions/api/ai/providers/gemini-live-provider.test.ts`
- `git diff --check`

AI-focused tests: 12 files passed, 75 tests passed.

Build note: `npm run build` emitted the existing Vite chunk-size warning. Build-generated changes to `dist/index.html` and `tsconfig.app.tsbuildinfo` were restored so generated/cache artifacts are not part of M147.

`git diff --check` returned success with Windows line-ending warnings only.

## Known Limitations

- No real Gemini request has been run.
- The default production endpoint still intentionally cannot reach live Gemini.
- Final Gemini model name, endpoint version, and auth details must be verified again before live smoke.
- The frontend still treats non-OpenAI ready responses as mock-preview style; this is acceptable because M147 does not expose live endpoint output.
- Rate limits remain fixture/planning-level and are not persistent storage-backed.

## Proposed Next Milestone

Recommend: **M148 Owner-Approved Gemini Live Smoke Test Plan + Cloudflare Secret Verification**

M148 should:

- keep `AI_LIVE_ENABLED=false` initially
- verify `GEMINI_API_KEY` exists as a Cloudflare secret only
- run production dry-run smoke tests
- only if the owner explicitly approves, enable `AI_LIVE_ENABLED=true` for a tiny live smoke test
- ask one normal plant question
- ask one high-risk blocked question
- verify rollback
- immediately set `AI_LIVE_ENABLED=false` after smoke if desired

## No-Live-Execution Confirmation

M147 did not add or execute:

- any real Gemini call
- any OpenAI call
- any external provider call during tests/build
- any real provider API key value
- any frontend provider key
- `VITE_GEMINI_API_KEY`
- `VITE_OPENAI_API_KEY`
- production live AI execution
- fake weather, price, or source data
