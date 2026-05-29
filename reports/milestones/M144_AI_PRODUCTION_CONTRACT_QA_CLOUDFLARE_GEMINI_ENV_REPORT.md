# M144 AI Production Contract QA / Cloudflare Gemini Env Report

## Summary

M144 adds the production QA and Cloudflare environment setup package for the Gemini-first KasetHub AI farmer assistant contract. This milestone is documentation and production-readiness planning only. Gemini remains disabled/dry-run only, and no live provider execution was added.

## CONTEXT.md Read Confirmation

`CONTEXT.md` was read first and used as the current project context. It confirms AI must remain backend/proxy only, no frontend provider key is allowed, AI answers must be Thai farmer-friendly, and unsafe pesticide/chemical overconfidence must remain blocked. `CONTEXT.md` was not modified.

## Graphify Pre-Check Result

Before editing, M144 read:

- `graphify-out/.graphify_analysis.json`
- `graphify-out/graph.json`

Graphify identified the AI route/service/test/docs cluster around `/app/ai`, `src/routes/AIPage.tsx`, `src/services/ai`, prior AI proxy planning, AI endpoint contract docs, and milestone reports. The graph was used as supplemental context only; actual source files were inspected before writing the M144 docs. `graphify-out` was not modified.

## Files Created/Modified

Created:

- `docs/ai/AI_CLOUDFLARE_GEMINI_ENV_SETUP_M144.md`
- `docs/ai/AI_PRODUCTION_CONTRACT_QA_M144.md`
- `docs/ai/AI_GEMINI_OWNER_APPROVAL_AND_ROLLBACK_M144.md`
- `docs/ai/AI_PRODUCTION_QA_CHECKLIST_M144.md`
- `reports/milestones/M144_AI_PRODUCTION_CONTRACT_QA_CLOUDFLARE_GEMINI_ENV_REPORT.md`

Modified:

- None outside the M144 documentation/report set.

No runtime source, `/app/ai` UI, frontend env code, Community, Weather, Prices, YouTube, Supabase, auth, `CONTEXT.md`, or `graphify-out` files were changed.

## Current AI Readiness Summary

Inspected current implementation:

- `functions/api/ai/farmer-assistant.ts`
- `functions/api/ai/providers/*`
- `functions/api/ai/guardrails/*`
- `src/services/ai/ai-farmer-assistant-client.ts`
- `src/routes/AIPage.tsx`
- `src/config/env.ts`
- M141-M143 AI docs and reports

Current readiness:

- `POST /api/ai/farmer-assistant` validates JSON, question length, topic, user mode, and optional context.
- High-risk input blocks obvious chemical dosage, chemical mixing, and emergency-health patterns before provider execution.
- Obvious spam returns the existing safe `rate_limited` fixture path.
- Provider abstraction exists with disabled and Gemini dry-run adapters.
- `AI_PROVIDER=gemini` selects Gemini dry-run output only.
- `AI_LIVE_ENABLED=true` is still blocked from live execution and does not call Gemini.
- Provider calls are wrapped by a timeout guard.
- Provider output passes through the deterministic output validator.
- Unsafe, malformed, timeout, or secret-like output maps to safe Thai fallback responses.
- `/app/ai` calls the backend contract only when `VITE_AI_BACKEND_CONTRACT_ENABLED=true`; otherwise local fixture fallback remains available.
- `src/config/env.ts` exposes no provider secret and reads only frontend-safe flags.

## Cloudflare Env Guide Summary

Created `docs/ai/AI_CLOUDFLARE_GEMINI_ENV_SETUP_M144.md`.

It documents production Cloudflare Pages variables:

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

It documents `GEMINI_API_KEY` as Cloudflare encrypted secret only, never committed, and never exposed to frontend code.

It documents the frontend-safe flag:

```text
VITE_AI_BACKEND_CONTRACT_ENABLED=true
```

It forbids frontend provider secrets:

```text
VITE_GEMINI_API_KEY
VITE_OPENAI_API_KEY
VITE_AI_PROVIDER_SECRET
```

The guide references current Cloudflare Pages docs for Variables and Secrets and confirms M144 production should show only disabled/dry-run contract behavior.

## Production Smoke Guide Summary

Created `docs/ai/AI_PRODUCTION_CONTRACT_QA_M144.md`.

It covers:

- `/api/ai/farmer-assistant` normal prompt smoke
- high-risk pesticide dosage smoke
- chemical mixing smoke
- invalid empty/unsupported-topic smoke
- spam/rate-limit fixture smoke
- `/app` browser smoke
- `/app/ai` browser smoke
- 390px mobile overflow and copy smoke

Expected results stay safe:

- `ready` dry-run/mock or `not_configured` for normal prompts
- `blocked` and `high_risk` for high-risk chemical prompts
- `error` for invalid input
- no live Gemini claim
- no secret, stack trace, model ID, `undefined`, or `null`

## Owner Approval/Rollback Summary

Created `docs/ai/AI_GEMINI_OWNER_APPROVAL_AND_ROLLBACK_M144.md`.

It records that M144 does not approve live activation and that a later owner-approved milestone must confirm:

- model choice against current official Gemini docs
- Cloudflare secret-only key setup
- `AI_LIVE_ENABLED=false` before first deploy
- dry-run/not-configured production state
- high-risk block behavior
- no frontend secret exposure
- minimal logging
- rollback path

Rollback remains:

```text
AI_LIVE_ENABLED=false
```

## Production QA Checklist Summary

Created `docs/ai/AI_PRODUCTION_QA_CHECKLIST_M144.md`.

Checklist categories:

- Security: no frontend keys, no committed keys, no stack traces, no secret exposure.
- Safety: high-risk chemical blocks, fake live data blocks, fake citation blocks, expert escalation.
- UX: Thai copy, non-technical disabled/error states, loading and retry handling, 390px mobile fit.
- Operations: Cloudflare env values, dry-run state tested, rollback rehearsed, no raw full question/answer storage by default.

## Optional Tests Updated

No test files were changed in M144. This was intentional because M144 is documentation/setup planning only.

Existing M143 tests already prove:

- Gemini dry-run returns mock output without `GEMINI_API_KEY`.
- `AI_LIVE_ENABLED=true` still does not call live Gemini.
- Provider factory never selects live execution.
- Output validator and fallback paths block unsafe outputs.

## Verification Results

- `npm run lint`: passed.
- `npm run build`: passed. Vite reported the existing large chunk warning. Build-generated changes to `dist/index.html` and `tsconfig.app.tsbuildinfo` were restored so generated artifacts are not part of M144.
- `npm run test -- functions/api/ai/farmer-assistant.test.ts functions/api/ai/providers/gemini-provider.test.ts functions/api/ai/providers/provider-factory.test.ts functions/api/ai/guardrails/output-validator.test.ts functions/api/ai/guardrails/safety-fallbacks.test.ts functions/api/ai/guardrails/provider-timeout.test.ts functions/api/ai/guardrails/rollout-gate.test.ts`: passed, 7 files and 44 tests.
- `git diff --check`: passed after final docs/report creation.

## Known Limitations

- M144 is docs/setup guidance only.
- No production smoke test was executed against `https://kasethub.pages.dev` in this milestone.
- Gemini live execution is still not implemented.
- `GEMINI_API_KEY` is still not required or used by runtime code.
- Persistent daily counters are still not implemented.
- Model names must be verified against current Gemini documentation before any future live implementation.
- Cloudflare UI labels can change; the guide references current Cloudflare Pages Variables and Secrets documentation.

## Proposed Next Milestone

Recommended:

```text
M145 Controlled Gemini Provider Adapter Preparation
```

M145 should:

- prepare real Gemini request builder
- prepare response parser
- prepare safety-settings mapper
- prepare no-network mocked tests
- keep `AI_LIVE_ENABLED=false`
- still make no live Gemini call unless the owner explicitly approves a later live activation milestone

## No-Live-Provider Confirmation

M144 did not add:

- live Gemini calls
- live OpenAI calls
- external provider calls
- Gemini SDK
- real provider adapter
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
