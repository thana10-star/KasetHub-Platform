# M149 Owner-Approved Controlled Gemini Live Activation Report

## Summary

M149 wires the final backend live gate for Gemini execution while preserving safe defaults. The farmer assistant endpoint can now reach the live-capable Gemini adapter only when the owner-controlled server-side gates are all enabled and a backend-only Cloudflare secret exists.

No real Gemini request was executed during implementation or tests. No real provider key was added.

## CONTEXT.md Read Confirmation

Read `CONTEXT.md` before implementation. Relevant constraints confirmed:

- KasetHub AI provider execution must stay backend/server-side only.
- Agriculture assistant output must remain Thai, practical, and safety-first.
- Chemical dosage and dangerous mixing guidance must be blocked or cautioned.
- Owner approval is required for production live activation.
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
- `reports/milestones/M147*`
- `reports/milestones/M148*`

No `graphify-out` files were modified.

## Files Created/Modified

Created:

- `docs/ai/AI_GEMINI_LIVE_ACTIVATION_M149.md`
- `reports/milestones/M149_OWNER_APPROVED_CONTROLLED_GEMINI_LIVE_ACTIVATION_REPORT.md`

Modified:

- `functions/api/ai/farmer-assistant.ts`
- `functions/api/ai/farmer-assistant.test.ts`
- `functions/api/ai/providers/provider-types.ts`

Unmodified by design:

- `CONTEXT.md`
- `graphify-out/*`
- `/app/ai` UI files
- Community, Weather, Prices, YouTube, Supabase, and auth code

## Live Gate Behavior

M149 adds the server-side env:

```text
AI_ALLOW_LIVE_EXECUTION=false
```

The endpoint now allows live Gemini execution only when all gates are true:

- `AI_PROVIDER=gemini`
- `AI_LIVE_ENABLED=true`
- `AI_ALLOW_LIVE_EXECUTION=true`
- server-side `GEMINI_API_KEY` exists
- backend/runtime `fetch` is available
- request validation passes
- input safety block does not block
- provider output passes the output validator

If `AI_LIVE_ENABLED=true` but `AI_ALLOW_LIVE_EXECUTION` is not true, the endpoint remains dry-run/live-blocked and does not call Gemini. If `GEMINI_API_KEY` is missing while both live flags are true, the endpoint returns a safe `not_configured` response before provider fetch.

The endpoint never reads frontend provider key names such as `VITE_GEMINI_API_KEY`.

## Cloudflare Setup Steps

Created `AI_GEMINI_LIVE_ACTIVATION_M149.md` with exact owner setup steps.

Production variables start disabled:

```text
AI_PROVIDER=gemini
AI_LIVE_ENABLED=false
AI_ALLOW_LIVE_EXECUTION=false
AI_MODEL=<verified Gemini model>
AI_TIMEOUT_MS=12000
AI_PROVIDER_TIMEOUT_MS=8000
AI_MAX_INPUT_CHARS=1200
AI_MAX_OUTPUT_TOKENS=700
AI_DAILY_LIMIT_GUEST=5
AI_DAILY_LIMIT_SIGNED_IN=20
AI_COOLDOWN_SECONDS=20
```

Secret:

```text
GEMINI_API_KEY=<Cloudflare encrypted secret only>
```

Frontend:

```text
VITE_AI_BACKEND_CONTRACT_ENABLED=true
```

Forbidden frontend env:

- `VITE_GEMINI_API_KEY`
- `VITE_OPENAI_API_KEY`
- `VITE_AI_PROVIDER_SECRET`

The guide also requires verifying the current Gemini model and API shape against official Gemini docs before the first smoke.

## Owner Live Smoke Instructions

The owner-controlled smoke sequence is:

1. Deploy with `AI_LIVE_ENABLED=false` and `AI_ALLOW_LIVE_EXECUTION=false`.
2. Confirm dry-run or not-configured behavior.
3. Set `AI_LIVE_ENABLED=true` while keeping `AI_ALLOW_LIVE_EXECUTION=false`.
4. Confirm still dry-run/live-blocked.
5. Set `AI_ALLOW_LIVE_EXECUTION=true` only for the tiny smoke.
6. Ask one normal agriculture question.
7. Ask one high-risk blocked question.
8. Review logs for secrets/provider internals.
9. Roll back by setting both live flags false.

The high-risk prompt should block before provider fetch.

## Rollback Instructions

Rollback is:

```text
AI_LIVE_ENABLED=false
AI_ALLOW_LIVE_EXECUTION=false
```

After rollback, re-run the dry-run prompt and high-risk prompt. Pass only if the endpoint no longer returns live provider output, no secret appears, and `/app/ai` still works.

## Tests Updated

Updated `functions/api/ai/farmer-assistant.test.ts` to cover:

- default dry-run behavior remains safe
- `AI_LIVE_ENABLED=true` alone does not call Gemini
- `AI_ALLOW_LIVE_EXECUTION=true` alone does not call Gemini
- both live flags true without `GEMINI_API_KEY` returns safe `not_configured`
- frontend `VITE_GEMINI_API_KEY` is ignored and not leaked
- all backend gates true with mocked fetch calls the mocked Gemini live path
- Cloudflare-style global fetch is used only after all live gates are enabled
- high-risk input blocks before mocked fetch
- unsafe mocked Gemini output maps to safety fallback
- mocked 401/403/429/5xx provider errors map safely
- placeholder key does not appear in serialized responses

All new live-path tests use mocked fetch only.

## Verification Results

Passed:

- `npm run lint`
- `npm run build`
- `npm run test -- functions/api/ai/farmer-assistant.test.ts functions/api/ai/providers/gemini-provider.test.ts functions/api/ai/providers/provider-factory.test.ts functions/api/ai/providers/gemini-live-provider.test.ts functions/api/ai/guardrails/output-validator.test.ts functions/api/ai/guardrails/safety-fallbacks.test.ts functions/api/ai/guardrails/provider-timeout.test.ts functions/api/ai/guardrails/rollout-gate.test.ts functions/api/ai/providers/gemini-request-builder.test.ts functions/api/ai/providers/gemini-safety-settings.test.ts functions/api/ai/providers/gemini-response-parser.test.ts functions/api/ai/providers/gemini-error-mapper.test.ts`
- `git diff --check`

AI-focused tests: 12 files passed, 86 tests passed.

Build note: `npm run build` emitted the existing Vite chunk-size warning. Build-generated changes to `dist/index.html` and `tsconfig.app.tsbuildinfo` were restored so generated/cache artifacts are not part of M149.

`git diff --check` returned success with Windows line-ending warnings only.

Early targeted check also passed:

- `npm run test -- functions/api/ai/farmer-assistant.test.ts functions/api/ai/providers/gemini-live-provider.test.ts functions/api/ai/providers/provider-factory.test.ts`

## Known Limitations

- No production Gemini smoke was run in M149.
- Local verification can prove mocked behavior, but cannot prove Cloudflare secret existence.
- `AI_MODEL` must be verified against current Gemini docs immediately before owner live smoke.
- Persistent daily limit storage remains future work.
- Production log review must be performed by the owner/operator with Cloudflare access.

## Proposed Next Milestone

Recommend: **M150 Gemini First Live Smoke Result Review + AI UX Polish**

M150 should:

- review actual first Gemini answer quality
- adjust prompt/copy if needed
- verify safety block
- verify rollback
- decide whether to keep live enabled or disable after test
- avoid expanding scope to image AI, memory, or RAG yet

## No-Secret/No-Test-Live Confirmation

M149 did not add or execute:

- any real Gemini call during tests/build
- any OpenAI call
- any uncontrolled external provider call
- any real `GEMINI_API_KEY` value
- any frontend provider key
- `VITE_GEMINI_API_KEY`
- `VITE_OPENAI_API_KEY`
- fake weather, price, or source data

M149 does add a backend live-capable endpoint path, but it is gated by owner-controlled production env and still defaults to non-live behavior.
