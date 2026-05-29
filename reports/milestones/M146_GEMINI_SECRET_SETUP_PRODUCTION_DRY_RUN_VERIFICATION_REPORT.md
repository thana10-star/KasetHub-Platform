# M146 Gemini Secret Setup + Production Dry-Run Verification Report

## Summary

M146 adds the Cloudflare Gemini secret setup checklist, production dry-run verification guide, and secret leak checklist for the KasetHub AI farmer assistant. This milestone is documentation and production-readiness verification planning only. Gemini remains dry-run/non-live only.

## CONTEXT.md Read Confirmation

`CONTEXT.md` was read first and used as the current project context. It confirms AI must remain backend/proxy only, no frontend provider key is allowed, AI answers must be Thai farmer-friendly, and unsafe pesticide/chemical overconfidence must remain blocked. `CONTEXT.md` was not modified.

## Graphify Pre-Check Result

Before editing, M146 read:

- `graphify-out/.graphify_analysis.json`
- `graphify-out/graph.json`

Graphify identified the AI route/service/test/docs cluster around `/app/ai`, `src/routes/AIPage.tsx`, `src/services/ai`, AI provider and guardrail utilities, AI endpoint contract docs, and milestone reports. The graph was used as supplemental context only; actual source files and docs were inspected before editing. `graphify-out` was not modified.

## Files Created/Modified

Created:

- `docs/ai/AI_GEMINI_SECRET_SETUP_M146.md`
- `docs/ai/AI_PRODUCTION_DRY_RUN_VERIFICATION_M146.md`
- `docs/ai/AI_SECRET_LEAK_CHECKLIST_M146.md`
- `reports/milestones/M146_GEMINI_SECRET_SETUP_PRODUCTION_DRY_RUN_VERIFICATION_REPORT.md`

Modified:

- None outside the M146 documentation/report set.

No runtime source, `/app/ai` UI, frontend env code, Community, Weather, Prices, YouTube, Supabase, auth, `CONTEXT.md`, or `graphify-out` files were changed.

## Current AI Readiness Summary

Inspected current implementation:

- `functions/api/ai/farmer-assistant.ts`
- `functions/api/ai/providers/*`
- `functions/api/ai/guardrails/*`
- `src/services/ai/ai-farmer-assistant-client.ts`
- `src/routes/AIPage.tsx`
- `src/config/env.ts`
- M144-M145 AI docs and milestone reports

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
- M145 request-builder/parser/error-mapper utilities are preparation-only and not a live execution path.
- `/app/ai` calls the backend contract only when `VITE_AI_BACKEND_CONTRACT_ENABLED=true`; otherwise local fixture fallback remains available.
- `src/config/env.ts` exposes no provider secret and reads only frontend-safe flags.

## Cloudflare Gemini Secret Setup Summary

Created `docs/ai/AI_GEMINI_SECRET_SETUP_M146.md`.

It documents Cloudflare Pages production variables:

```text
AI_PROVIDER=gemini
AI_LIVE_ENABLED=false
AI_MODEL=<verify current Gemini model before live activation>
AI_TIMEOUT_MS=12000
AI_PROVIDER_TIMEOUT_MS=8000
AI_MAX_INPUT_CHARS=1200
AI_MAX_OUTPUT_TOKENS=700
AI_DAILY_LIMIT_GUEST=5
AI_DAILY_LIMIT_SIGNED_IN=20
AI_COOLDOWN_SECONDS=20
```

It documents the production secret:

```text
GEMINI_API_KEY=<set in Cloudflare as encrypted secret only>
```

It confirms the frontend-safe production variable:

```text
VITE_AI_BACKEND_CONTRACT_ENABLED=true
```

It forbids:

```text
VITE_GEMINI_API_KEY
VITE_OPENAI_API_KEY
VITE_AI_PROVIDER_SECRET
```

Cloudflare references checked:

- [Cloudflare Pages Functions bindings](https://developers.cloudflare.com/pages/functions/bindings/)
- [Cloudflare Pages Functions API reference](https://developers.cloudflare.com/pages/functions/api-reference/)

## Production Dry-Run Verification Summary

Created `docs/ai/AI_PRODUCTION_DRY_RUN_VERIFICATION_M146.md`.

It includes PowerShell smoke tests for:

- normal plant problem prompt
- high-risk chemical prompt
- invalid empty prompt
- browser smoke for `/app`
- browser smoke for `/app/ai`
- 390px mobile smoke
- response checks for secret/model/stack-trace leakage

Expected production states remain:

- `ready` with `provider=mock` and `providerMode=dry_run`
- or `not_configured` with `provider=disabled`
- `blocked` and `high_risk` for high-risk chemical prompts

No smoke test should show live Gemini output.

## Secret Leak Checklist Summary

Created `docs/ai/AI_SECRET_LEAK_CHECKLIST_M146.md`.

It includes checks for:

- `git status --short`
- staged file names
- staged diff scans
- working tree scans
- generated `dist` scans
- Cloudflare-only secret inspection
- browser source/network checks
- commit history checks

The checklist allows variable-name references in docs but forbids real key values and frontend provider key assignments.

## Tests Updated Or Reused

No test files were changed in M146. This was intentional because M146 is documentation/setup verification planning only.

Existing tests already prove:

- `AI_PROVIDER=gemini` and `AI_LIVE_ENABLED=false` returns dry-run/mock.
- `AI_PROVIDER=gemini` and `AI_LIVE_ENABLED=true` still does not call live Gemini.
- The dry-run provider does not require `GEMINI_API_KEY`.
- The endpoint and providers do not call `fetch` in dry-run mode.
- Secret-like provider output is blocked by the output validator and fallback mapper.
- M145 request-builder/parser/error-mapper utilities use no-network mocked inputs only.

## Verification Results

- `npm run lint`: passed.
- `npm run build`: passed. Vite reported the existing large chunk warning after production build. Build-generated changes to `dist/index.html` and `tsconfig.app.tsbuildinfo` were restored so generated artifacts are not part of M146.
- `npm run test -- functions/api/ai/farmer-assistant.test.ts functions/api/ai/providers/gemini-provider.test.ts functions/api/ai/providers/provider-factory.test.ts functions/api/ai/guardrails/output-validator.test.ts functions/api/ai/guardrails/safety-fallbacks.test.ts functions/api/ai/guardrails/provider-timeout.test.ts functions/api/ai/guardrails/rollout-gate.test.ts functions/api/ai/providers/gemini-request-builder.test.ts functions/api/ai/providers/gemini-safety-settings.test.ts functions/api/ai/providers/gemini-response-parser.test.ts functions/api/ai/providers/gemini-error-mapper.test.ts`: passed, 11 files and 61 tests.
- `git diff --check`: passed.
- M146 docs/report secret-pattern scan found only expected placeholder/checklist references, not a real provider key value or frontend provider key assignment.

## Known Limitations

- M146 is docs/setup verification planning only.
- No production smoke test was executed against `https://kasethub.pages.dev` in this milestone.
- Gemini live execution is still not implemented.
- `GEMINI_API_KEY` is still not required or used by runtime code.
- Persistent daily counters are still not implemented.
- The M145 request builder still requires final verification against current Gemini docs before live activation.
- Cloudflare dashboard labels can change; this guide references current Cloudflare Pages documentation checked during M146.

## Proposed Next Milestone

Recommended:

```text
M147 Controlled Gemini Live Adapter Implementation Behind AI_LIVE_ENABLED
```

M147 should:

- implement Gemini fetch adapter with fetch injected/mocked in tests
- keep `AI_LIVE_ENABLED=false` by default
- require owner approval before any production live test
- add no-network unit tests
- add mocked live response tests
- add output validator enforcement
- not run real Gemini unless owner explicitly approves a later live smoke milestone

## No-Live-Provider Confirmation

M146 did not add:

- live Gemini calls
- live OpenAI calls
- external provider calls
- Gemini SDK
- real provider adapter
- provider API key values
- frontend provider keys
- `VITE_GEMINI_API_KEY`
- `VITE_OPENAI_API_KEY`
- `AI_LIVE_ENABLED=true`
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
