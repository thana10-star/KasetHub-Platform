# M142 Gemini Provider Dry-Run Adapter Report

## Summary

M142 adds a backend-only provider abstraction layer, Gemini dry-run adapter, disabled adapter, provider factory, and endpoint integration skeleton for `POST /api/ai/farmer-assistant`. Gemini remains dry-run only. No live provider call, provider key value, frontend provider key, or live AI execution was added.

## CONTEXT.md Read Confirmation

`CONTEXT.md` was read first and used as current project context. It confirms AI must remain backend/proxy only, no frontend provider key is allowed, AI answers must be Thai farmer-friendly, and pesticide/chemical overconfidence must remain blocked. `CONTEXT.md` was not modified.

## Graphify Pre-Check Result

Before editing, M142 read:

- `graphify-out/.graphify_analysis.json`
- `graphify-out/graph.json`

Graphify identified the AI route/service/test cluster around `/app/ai`, `src/routes/AIPage.tsx`, `src/services/ai`, AI proxy fixtures, AI docs, and prior reports. The graph was used as supplemental context only; actual source files were inspected before editing. `graphify-out` was not modified.

## Files Created/Modified

Created:

- `functions/api/ai/providers/provider-types.ts`
- `functions/api/ai/providers/ai-provider.ts`
- `functions/api/ai/providers/gemini-provider.ts`
- `functions/api/ai/providers/disabled-provider.ts`
- `functions/api/ai/providers/provider-factory.ts`
- `functions/api/ai/providers/gemini-provider.test.ts`
- `functions/api/ai/providers/provider-factory.test.ts`
- `docs/ai/AI_GEMINI_DRY_RUN_ADAPTER_M142.md`
- `reports/milestones/M142_GEMINI_PROVIDER_DRY_RUN_ADAPTER_REPORT.md`

Modified:

- `functions/api/ai/farmer-assistant.ts`
- `functions/api/ai/farmer-assistant.test.ts`

No frontend route, frontend env, Community, Weather, Prices, YouTube, Supabase, auth, or unrelated system files were changed.

## Current AI Architecture Summary

Current runtime before M142:

- `functions/api/ai/farmer-assistant.ts` provided a safe M138 backend contract stub.
- It accepted only `POST`, parsed JSON safely, validated farmer assistant input, blocked narrow high-risk patterns, rate-limited obvious spam, and returned fixture states.
- It still had historical OpenAI env guard logic and returned `not_configured` even when OpenAI env was present.
- `functions/api/ai/farmer-assistant.test.ts` verified no provider call was attempted.
- `src/services/ai/ai-farmer-assistant-client.ts` posts to `/api/ai/farmer-assistant` and normalizes safe contract states.
- `src/routes/AIPage.tsx` uses the backend contract only behind `VITE_AI_BACKEND_CONTRACT_ENABLED`; otherwise local fixture fallback remains default.
- `src/config/env.ts` exposes only frontend-safe flags and no provider secret.

M142 preserves that boundary while replacing the hardcoded provider guard with a provider selection layer.

## Provider Abstraction Summary

M142 adds provider-neutral types and interface:

- `providerName`
- `providerMode`
- `getHealth()`
- `generateAnswer()`

The interface is designed so future providers can fit without rewriting endpoint validation and safety flow:

- Gemini
- OpenAI
- disabled
- mock/local fixture

## Gemini Adapter Summary

`functions/api/ai/providers/gemini-provider.ts` implements a Gemini dry-run adapter only.

Behavior:

- `providerName: "gemini"`
- `providerMode: "dry_run"`
- returns `status: "ready"`
- returns `provider: "mock"`
- returns `providerMode: "dry_run"`
- returns the required dry-run Thai answer:
  `นี่เป็นคำตอบทดสอบจากระบบ AI เกษตรรุ่นทดลอง ขณะนี้ยังไม่ได้เปิดใช้งาน Gemini จริง`
- includes follow-up questions and disclaimers
- does not require `GEMINI_API_KEY`
- does not use `fetch`
- does not call Gemini or any external provider

## Provider Selector Summary

`functions/api/ai/providers/provider-factory.ts` selects providers safely:

- `AI_PROVIDER=gemini` returns Gemini dry-run adapter.
- Missing, disabled, off, none, or unknown providers return disabled adapter.
- `AI_PROVIDER=openai` is treated as unknown/disabled in M142.

## Runtime Gating Summary

M142 reads only:

- `AI_PROVIDER`
- `AI_LIVE_ENABLED`

Gate behavior:

- `AI_LIVE_ENABLED=false`: Gemini stays dry-run.
- `AI_LIVE_ENABLED=true`: Gemini still stays dry-run and reports `gemini_live_flag_ignored_in_m142`.

The live flag cannot activate Gemini in M142.

## Endpoint Integration Summary

`POST /api/ai/farmer-assistant` now:

1. Validates the request.
2. Runs existing safety blocks.
3. Runs existing spam/rate-limit check.
4. Selects a provider through the factory.
5. Executes disabled or dry-run adapter logic only.
6. Returns the existing safe response contract.

No provider API call, network request, database write, backend write, or frontend provider-key behavior was added.

## Tests Updated

Added or updated tests for:

- provider interface shape
- provider factory selection
- `AI_PROVIDER=gemini`
- `AI_PROVIDER=unknown`
- `AI_LIVE_ENABLED=false`
- `AI_LIVE_ENABLED=true` still dry-run
- endpoint returns Gemini dry-run response
- endpoint does not require `GEMINI_API_KEY`
- endpoint never attempts network request
- legacy OpenAI env remains non-live
- blocked safety flow still works
- rate-limit flow still works
- validation flow still works

## Verification Results

- `npm run lint`: passed.
- `npm run build`: passed. Vite reported the existing large chunk warning. Build-generated changes to `dist/index.html` and `tsconfig.app.tsbuildinfo` were restored so generated artifacts are not part of M142.
- `git diff --check`: passed. Git reported line-ending warnings for touched TypeScript files only.
- `npm run test -- functions/api/ai/farmer-assistant.test.ts functions/api/ai/providers/gemini-provider.test.ts functions/api/ai/providers/provider-factory.test.ts`: passed, 3 files and 20 tests.
- Added-line provider key scan found no Gemini/OpenAI key values or frontend provider key assignments. It only matched negative `AIza` test assertions.

## Known Limitations

- Gemini live execution is not implemented.
- `GEMINI_API_KEY` is not required or used.
- Output validation is not yet implemented as a reusable backend validator.
- Provider timeout wrapping is not yet implemented.
- Provider error mapping for real Gemini responses is not yet implemented.
- Rate limiting remains the existing obvious-spam/cooldown fixture behavior, not a persistent daily counter.
- Frontend still ignores `providerMode`; the backend response includes it for M142 observability while preserving `provider: "mock"` for current UI behavior.

## Proposed Next Milestone

Recommended:

```text
M143 Gemini Runtime Guardrail Integration
```

M143 should:

- add output validator skeleton
- add Gemini response validator
- add provider timeout wrapper
- add rollout gate checks
- add safety fallback mapper

M143 should still keep:

```text
AI_LIVE_ENABLED=false
```

No live Gemini call should happen in M143.

## No-Live-Provider Confirmation

M142 did not add:

- live Gemini calls
- live OpenAI calls
- external provider calls
- provider API key values
- frontend provider keys
- `VITE_GEMINI_API_KEY`
- `VITE_OPENAI_API_KEY`
- runtime live AI execution
- fake live AI output
- Community changes
- Weather changes
- Prices changes
- YouTube changes
- Supabase changes
- auth changes
- `CONTEXT.md` changes
- `graphify-out` changes
