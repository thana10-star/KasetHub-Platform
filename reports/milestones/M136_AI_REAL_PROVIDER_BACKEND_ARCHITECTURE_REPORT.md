# M136 AI Real Provider Backend Architecture Report

## Summary

M136 created a design-only architecture package for connecting KasetHub `/app/ai` to a real AI provider through backend/server-side infrastructure. No provider call, API key, runtime AI behavior, backend write, or frontend network path was implemented.

## CONTEXT.md Read Confirmation

`CONTEXT.md` was read first. It confirms that AI เกษตร is the next priority after YouTube and must be backend/proxy only, with no frontend provider key, no unsafe pesticide/chemical overconfidence, clear uncertainty, Thai farmer-friendly copy, and owner approval before implementation.

## Graphify Pre-Check Result

Graphify files were checked before editing:

- `graphify-out/.graphify_analysis.json`
- `graphify-out/graph.json`

No `src/graphify-out` copy exists in this workspace. Graphify pointed to the existing `/app/ai` route, AI proxy fixture layer, AI text dry-run contracts, route registry, AI docs, and prior AI milestone reports. Actual source files were still inspected before writing docs.

## Files Created

- `docs/ai/AI_REAL_PROVIDER_ARCHITECTURE_M136.md`
- `docs/ai/AI_FARMER_ASSISTANT_SAFETY_SPEC_M136.md`
- `reports/milestones/M136_AI_REAL_PROVIDER_BACKEND_ARCHITECTURE_REPORT.md`

## Files Modified

No runtime source files were modified.

## Existing /app/ai Inspection Summary

`/app/ai` is registered in `src/app/App.tsx` and renders `src/routes/AIPage.tsx`.

Current behavior:

- Uses `askTextQuestion()` from `src/services/ai-proxy/ai-proxy-adapter.ts`.
- Defaults to `local_fixture`.
- Does not call a real backend endpoint or AI provider.
- Does not expose provider keys in frontend.
- Uses local guest AI credit state and fixture responses.
- Shows safety copy from `src/services/ai/ai-farmer-assistant-copy.ts`.

Existing architecture pieces:

- `src/services/ai/ai-request-planner.ts` classifies request type, credit cost, and safety level.
- `src/services/ai/ai-routing-policy.ts` contains placeholder provider candidates only.
- `src/services/ai-text/*` contains controlled staging/dry-run contracts with provider calls blocked.
- `src/config/env.ts` has frontend flags for staged AI modes but no frontend provider key reads.
- `functions/api/` currently contains YouTube endpoints only; no AI Cloudflare Function exists.

## Provider Comparison Summary

OpenAI API:

- Strong candidate for V1 text assistant because of Thai response quality, structured answer fit, and safety-reviewable output.
- Needs strict backend-only key handling, cost caps, max lengths, timeout, and output validation.

Google Gemini API:

- Strong secondary candidate for low-latency and cost-sensitive workloads.
- Existing placeholder routing names Gemini tiers, but those placeholders are not a live implementation decision.
- Should be evaluated with real Thai farmer prompts before production use.

Fallback/mock/disabled mode:

- Required safety fallback.
- Keeps the app honest when backend/provider is missing.
- Not a real AI answer engine.

## Recommended Provider Path For Owner Approval

Recommended primary V1 path: OpenAI API for the first backend-owned text farmer assistant endpoint, pending owner approval in M137.

Gemini should remain a comparison/secondary option until the owner approves multi-provider complexity. Local fixture/disabled mode should remain available for staging, fallback, and cost safety.

## Backend API Architecture Summary

Proposed endpoint:

```http
POST /api/ai/farmer-assistant
```

Proposed Cloudflare path if this project follows the YouTube convention:

```text
functions/api/ai/farmer-assistant.ts
```

Server-side-only env:

- `AI_PROVIDER`
- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- `AI_MODEL`
- `AI_TIMEOUT_MS`
- `AI_PROVIDER_TIMEOUT_MS`
- `AI_MAX_INPUT_CHARS`
- `AI_MAX_OUTPUT_TOKENS`
- rate-limit/cooldown settings

Frontend-forbidden env:

- `VITE_OPENAI_API_KEY`
- `VITE_GEMINI_API_KEY`
- any frontend provider secret

The docs define request schema, response schema, validation flow, timeout behavior, rate limit plan, error statuses, safe fallback response, and minimal logging policy.

## Safety / Guardrail Summary

The safety spec requires the assistant to:

- answer in simple natural Thai
- ask clarifying questions when context is missing
- separate observations, likely causes, safe first steps, and expert escalation
- avoid dangerous pesticide/chemical certainty
- avoid exact dosage unless verified label/source data exists
- include disclaimers for chemicals, disease, finance/legal-like, medical-like, and safety topics
- avoid fake live weather/prices and fake citations
- avoid guaranteed diagnosis, yield, profit, cure, or sale outcome

## Cost / Rate Limit / Privacy Summary

Recommended V1 controls:

- max question length
- max response length
- anonymous daily limit
- cooldown after rapid requests
- provider timeout and endpoint timeout
- no double-charge on retries
- no raw question storage by default
- minimal metadata logs only
- no precise location collection by default
- no billing/payment implementation in M136

## Verification Results

Completed in this working session:

- `npm run lint` passed.
- `npm run build` passed. Vite still reports the existing large bundle warning, but the build completed successfully.
- `npm run test` passed: 53 test files and 510 tests.
- `git diff --check` passed.
- Source/function secret scan passed for non-test runtime files: no `VITE_OPENAI_API_KEY`, `VITE_GEMINI_API_KEY`, `OPENAI_API_KEY`, or `GEMINI_API_KEY` references were added to `src` or `functions`.

Generated build artifacts were restored after verification. `CONTEXT.md` remains unmodified by M136 and `graphify-out` was not changed.

## Known Limitations

- This milestone is architecture only.
- No provider was selected by the owner yet.
- No `/api/ai/farmer-assistant` function was created.
- No production rate-limit store was implemented.
- No real provider prompt or output validator was executed.
- Thai source text in older files still appears mojibaked in terminal output, but M136 did not change those files.

## Proposed M137

M137 AI Provider Owner Decision + Backend Contract:

- owner chooses OpenAI, Gemini, or disabled/mock-first path
- finalize endpoint contract and env names
- finalize provider/model selection from current official provider docs
- add fixtures for ready/not_configured/error/blocked/rate_limited states
- still avoid live provider calls unless owner explicitly approves the implementation milestone

## M136 Safety Confirmation

- No real provider call implemented.
- No API key added.
- No frontend AI key added.
- No `VITE_OPENAI_API_KEY` added.
- No `VITE_GEMINI_API_KEY` added.
- No secrets committed.
- No fake AI live data added.
- No `/app/ai` runtime behavior changed.
- No Community, Weather, Prices, YouTube, Supabase, auth, or unrelated route behavior changed.
- `CONTEXT.md` was not modified.
- `graphify-out` was not modified.
