# M139 AI Frontend Contract Wiring Report

## Summary

M139 connects `/app/ai` to the M138 backend contract stub behind a frontend-safe flag. The app can now exercise backend contract states such as `not_configured`, `blocked`, `rate_limited`, and `error` without enabling live OpenAI or any external AI provider.

Default behavior remains safe: if the flag is not enabled, `/app/ai` keeps the existing local fixture flow.

## CONTEXT.md Read Confirmation

`CONTEXT.md` was read first and used as the current project context. It was not modified.

## Graphify Pre-Check Result

Graphify context was checked before editing:

- `graphify-out/.graphify_analysis.json`
- `graphify-out/graph.json`

Graphify showed the relevant AI cluster around `/app/ai`, `src/services/ai-proxy`, `src/services/ai`, the M138 function, docs, and tests. Actual source files were inspected before editing. `graphify-out` was not modified.

## Files Created/Modified

Created:

- `src/services/ai/ai-farmer-assistant-client.ts`
- `src/services/ai/ai-farmer-assistant-client.test.ts`
- `docs/ai/AI_FRONTEND_BACKEND_CONTRACT_WIRING_M139.md`
- `reports/milestones/M139_AI_FRONTEND_CONTRACT_WIRING_REPORT.md`

Modified:

- `src/config/env.ts`
- `src/vite-env.d.ts`
- `src/routes/AIPage.tsx`
- `src/routes/AIPage.test.tsx`

## Existing AI Flow Inspection Summary

Current `/app/ai` flow before M139:

- renders `src/routes/AIPage.tsx`
- uses `askTextQuestion()` from `src/services/ai-proxy/ai-proxy-adapter.ts`
- defaults to `local_fixture`
- does not run real provider fetches
- keeps AI credits and safety copy in the UI
- shows disabled/preparation copy when real AI is unavailable

M139 preserved this path as the default fallback.

## Frontend Client Changes

Added `src/services/ai/ai-farmer-assistant-client.ts`.

The client:

- posts JSON to `/api/ai/farmer-assistant`
- normalizes the M138 response contract
- handles `not_configured`, `blocked`, `rate_limited`, and `error`
- accepts non-2xx responses when the backend still returns a valid contract body
- handles invalid JSON and network failure with safe Thai fallback copy
- does not read provider API keys
- does not call OpenAI, Gemini, or external AI providers directly

## /app/ai UI Behavior Changes

When backend contract mode is disabled:

- `/app/ai` keeps the existing local fixture behavior.

When backend contract mode is enabled:

- valid questions call `/api/ai/farmer-assistant`
- backend disabled/not_configured responses are shown with farmer-friendly copy
- blocked high-risk responses are shown calmly and prominently
- rate-limited responses show retry guidance
- error responses stay non-technical
- ready mock responses are labeled as test preview only
- no local credit is consumed for disabled contract responses

The page layout was not redesigned.

## Feature Flag/Mode Behavior

New frontend-safe flag:

```text
VITE_AI_BACKEND_CONTRACT_ENABLED=true
```

Default:

```text
false
```

No provider secret is exposed. This flag only selects whether the frontend submits to the M138 backend contract endpoint.

## Status Handling Summary

`not_configured`

- Shows: `ตอนนี้ผู้ช่วย AI เกษตรยังไม่ได้เปิดใช้งานเต็มรูปแบบ เรากำลังเตรียมระบบให้ตอบได้อย่างปลอดภัยและน่าเชื่อถือ`
- Does not mention API keys.

`blocked`

- Shows backend safety copy.
- Does not add chemical dosage or mixing advice.

`rate_limited`

- Shows retry-friendly Thai copy.
- Includes seconds when provided.

`error`

- Shows safe fallback copy.
- Does not expose stack traces, raw provider errors, `undefined`, or `null`.

`ready/mock`

- Displays as test preview only.
- Does not present fixture output as real expert/provider output.

## Tests Updated

Added or updated tests for:

- client posts to `/api/ai/farmer-assistant`
- client maps `not_configured`
- client maps `blocked`
- client maps `rate_limited`
- client handles validation/error responses
- client handles invalid JSON
- client handles network failure
- client does not require provider keys
- `/app/ai` renders friendly `not_configured` copy
- blocked high-risk UI keeps safe copy
- rate-limit UI shows retry guidance
- backend error UI avoids technical wording
- ready mock output is labeled as test preview
- local fixture fallback remains available by default

## Verification Results

Passed:

- `npm run test -- src/services/ai/ai-farmer-assistant-client.test.ts src/routes/AIPage.test.tsx`
  - 2 test files passed
  - 14 tests passed
- `npm run lint`
- `npm run build`
  - Build passed.
  - Vite reported the existing large chunk size warning.
- `npm run test`
  - 55 test files passed
  - 533 tests passed
- `git diff --check`

Additional checks:

- No `VITE_OPENAI_API_KEY`, `VITE_GEMINI_API_KEY`, or `VITE_AI_PROVIDER_SECRET` references were found in non-test `src` or `functions` code.
- No committed-looking OpenAI or Google provider key patterns were found in `src`, `functions`, `docs`, or `reports`.
- Generated build/cache artifacts touched by `npm run build` and local dev smoke were restored before final diff review.

## Route And Mobile Smoke

Temporary local dev server:

```text
VITE_AI_BACKEND_CONTRACT_ENABLED=true
npm run dev -- --host 127.0.0.1 --port 5176
```

Browser smoke was run with installed local Chrome at a 390px viewport. The in-app browser tool was not exposed in this session, and bundled Playwright was missing `playwright-core`, so Chrome DevTools Protocol was used directly.

Results:

- `/app` mobile route smoke: passed, no horizontal overflow.
- `/app/ai` initial mobile route smoke: passed, no horizontal overflow.
- `/app/ai` normal question with mocked backend contract `not_configured`: passed, disabled contract state rendered, no horizontal overflow, no secret/technical wording.
- `/app/ai` high-risk question with mocked backend contract `blocked`: passed, blocked state rendered, no horizontal overflow, no dosage/secret/technical wording.

Local limitation:

- Vite does not serve Cloudflare Pages Functions directly, so the smoke test patched browser `fetch` to return M138-shaped contract responses. Unit tests cover the real frontend client behavior against `/api/ai/farmer-assistant`.

## Known Limitations

- Live OpenAI is still disabled.
- `/app/ai` only calls the backend contract when `VITE_AI_BACKEND_CONTRACT_ENABLED=true`.
- Local Vite may not serve Cloudflare Pages Functions directly; production or a Pages-compatible local runtime is needed for full endpoint smoke.
- Rate limits are still contract/fixture-level until M140 or a later backend hardening milestone.
- The M138 safety blocker remains narrow and should be hardened before live provider output.

## Proposed Next Milestone

Recommended next:

```text
M140 AI Real Provider Execution Planning / OpenAI Runtime Guardrails
```

M140 should confirm exact OpenAI model, Cloudflare env setup, provider timeout, max tokens, system prompt, output safety validator, abuse/rate-limit strategy, production rollout flag, and explicit owner approval before enabling live calls.

## No-Live-Provider Confirmation

M139 did not add:

- live OpenAI calls
- Gemini calls
- external AI provider calls
- API key values
- frontend AI keys
- `VITE_OPENAI_API_KEY`
- `VITE_GEMINI_API_KEY`
- real-provider runtime execution
- fake live AI output
- fake weather, price, or source data
- Community, Weather, Prices, YouTube, Supabase, auth, or unrelated route changes
