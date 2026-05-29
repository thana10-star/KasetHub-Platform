# M140 AI Real Provider Execution Planning Report

## Summary

M140 created the final pre-implementation planning and runtime guardrail package for future OpenAI execution in the KasetHub AI farmer assistant. This milestone is docs-only and does not enable live provider execution.

## CONTEXT.md Read Confirmation

`CONTEXT.md` was read first and used as the current project context. It confirms that AI must remain backend/proxy only, farmer-friendly, Thai, and safe around pesticide/chemical advice. `CONTEXT.md` was not modified.

## Graphify Pre-Check Result

Graphify files were read before editing:

- `graphify-out/.graphify_analysis.json`
- `graphify-out/graph.json`

Graphify identified the AI route/service/doc area around `/app/ai`, `src/services/ai`, older AI proxy planning modules, and AI docs. The graph did not fully include the newer M138/M139 `functions/api/ai/farmer-assistant.ts` contract path, so actual source files were inspected directly. `graphify-out` was not modified.

## Files Created/Modified

Created:

- `docs/ai/AI_OPENAI_RUNTIME_GUARDRAILS_M140.md`
- `docs/ai/AI_LIVE_ROLLOUT_CHECKLIST_M140.md`
- `docs/ai/AI_MANUAL_QA_PROMPTS_M140.md`
- `docs/ai/AI_SYSTEM_PROMPT_SPEC_M140.md`
- `reports/milestones/M140_AI_REAL_PROVIDER_EXECUTION_PLANNING_REPORT.md`

Modified:

- None outside the new M140 docs/report files.

## Current AI Implementation Inspection Summary

Inspected:

- `functions/api/ai/farmer-assistant.ts`
- `functions/api/ai/farmer-assistant.test.ts`
- `src/services/ai/ai-farmer-assistant-client.ts`
- `src/routes/AIPage.tsx`
- `src/config/env.ts`
- `docs/ai` from M136-M139
- `reports/milestones` from M136-M139

Current state:

- The backend endpoint exists at `POST /api/ai/farmer-assistant`.
- It validates JSON, question length, topic, user mode, and optional context fields.
- It blocks obvious spam and a narrow set of high-risk chemical/emergency-health prompts.
- It reads `AI_PROVIDER`, `OPENAI_API_KEY`, `AI_MAX_INPUT_CHARS`, and `AI_COOLDOWN_SECONDS`.
- It intentionally returns `not_configured` even when OpenAI env is present.
- Tests confirm no provider fetch occurs.
- The frontend backend client normalizes contract responses and uses safe Thai fallback copy for network/JSON failures.
- `/app/ai` calls the backend contract only behind `VITE_AI_BACKEND_CONTRACT_ENABLED`; local fixture fallback remains default.
- `src/config/env.ts` exposes no frontend provider key.

## OpenAI Runtime Recommendation

M140 checked official OpenAI docs through official web docs because the OpenAI docs MCP tool was not available in this session:

- [OpenAI latest model guide](https://developers.openai.com/api/docs/guides/latest-model)
- [OpenAI model catalog](https://developers.openai.com/api/docs/models)

Recommended V1 model:

```text
AI_MODEL=gpt-5.4-mini
```

Backup if cost or latency becomes a concern:

```text
AI_MODEL=gpt-5.4-nano
```

Both model names are marked to verify before M141/M142 implementation because current provider model names and recommended API parameters can change.

Planned runtime defaults:

- `AI_MAX_INPUT_CHARS=1200`
- `AI_MAX_OUTPUT_TOKENS=700`
- `AI_TIMEOUT_MS=12000`
- `AI_PROVIDER_TIMEOUT_MS=8000`
- no automatic provider retry in V1
- no streaming for V1 unless owner approves later
- no image input for V1
- no memory for V1
- no RAG for V1
- no live weather/price claims unless real app data is explicitly integrated later

## Env/Rollout Gate Summary

Server-side env plan:

- `AI_PROVIDER=openai`
- `OPENAI_API_KEY`
- `AI_MODEL`
- `AI_TIMEOUT_MS`
- `AI_PROVIDER_TIMEOUT_MS`
- `AI_MAX_INPUT_CHARS`
- `AI_MAX_OUTPUT_TOKENS`
- `AI_DAILY_LIMIT_GUEST`
- `AI_DAILY_LIMIT_SIGNED_IN`
- `AI_COOLDOWN_SECONDS`
- `AI_LIVE_ENABLED=false`

Frontend-safe env:

- `VITE_AI_BACKEND_CONTRACT_ENABLED=true`

Forbidden frontend env:

- `VITE_OPENAI_API_KEY`
- `VITE_GEMINI_API_KEY`
- `VITE_AI_PROVIDER_SECRET`
- any provider secret

Rollout gate:

- Configure key only as Cloudflare secret.
- Keep `AI_LIVE_ENABLED=false` initially.
- Test production `not_configured` state first.
- Enable live only after owner approval.
- Manually monitor first live responses.
- Roll back with `AI_LIVE_ENABLED=false`.

## System Prompt Summary

Created `docs/ai/AI_SYSTEM_PROMPT_SPEC_M140.md`.

The prompt requires:

- Thai answers.
- Farmer-friendly plain language.
- Practical, concise responses.
- Standard sections:
  1. `สิ่งที่อาจเกิดขึ้น`
  2. `สิ่งที่ควรตรวจเช็ก`
  3. `วิธีเริ่มแก้แบบปลอดภัย`
  4. `เมื่อไหร่ควรถามผู้เชี่ยวชาญ`
- Clarifying questions when crop, province, symptoms, timing, or goal are missing.
- No chemical dosage certainty.
- No dangerous mixing instructions.
- No fake citations.
- No fake live weather, price, or source data.
- Expert escalation for high-risk cases.

## Output Validator Design Summary

Designed a lightweight backend output validator for future implementation.

Validator checks:

- dangerous chemical mixing instructions
- confident chemical/pesticide/fertilizer dosage without verified source context
- guaranteed diagnosis/profit/yield/cure/sale outcome
- fake live price/weather claims
- fake citation/source claims
- medical/human emergency advice
- long unsafe answer when input is high-risk
- Thai or mostly Thai output
- raw provider errors, stack traces, model IDs, or secret-like strings

Fallback:

- Replace unsafe output with safe caution or blocked response.
- Log minimal metadata and reason codes only.
- Do not log raw full question/answer by default.
- Return `safetyLevel: "caution"` or `"high_risk"` when relevant.

## Abuse/Rate-Limit Summary

V1 controls documented:

- max input chars: `1200`
- max output tokens: `700`
- cooldown seconds: `20`
- anonymous daily limit: `5`
- signed-in daily limit: `20`
- `rate_limited` contract response
- no raw question storage by default
- optional future Cloudflare KV, Durable Object, R2, or Supabase tracking
- no billing implementation in M140

## Error/Fallback Summary

Documented behavior for:

- missing env
- invalid API key
- provider timeout
- provider `429`
- provider `5xx`
- malformed provider response
- unsafe provider output
- network failure
- validation error
- high-risk blocked input

All user-facing errors use natural Thai copy and avoid technical details, stack traces, provider errors, model names, and secret values.

## Manual QA Prompt Set Summary

Created `docs/ai/AI_MANUAL_QA_PROMPTS_M140.md`.

The set covers:

- normal plant problem
- soil/fertilizer question
- water/irrigation question
- price/live data honesty
- weather/live data honesty
- pesticide dosage request
- chemical mixing request
- animal health concern
- vague question requiring clarification
- abusive/spam input
- very long input
- prompt injection, fake citation, secret lure, and guaranteed-profit checks

Any high-risk safety, fake-live-data, secret-leakage, or mostly non-Thai failure blocks launch.

## Verification Results

Passed:

- `npm run lint`
- `npm run build`
  - Build passed.
  - Vite reported the existing large chunk size warning.
- `git diff --check`
- AI contract focused regression:
  - `npm run test -- functions/api/ai/farmer-assistant.test.ts src/services/ai/ai-farmer-assistant-client.test.ts src/routes/AIPage.test.tsx`
  - 3 test files passed.
  - 25 tests passed.

Full suite result:

- `npm run test` ran 55 test files and 533 tests.
- 54 test files passed and 532 tests passed.
- 1 existing non-AI test failed: `src/routes/AppHomePage.test.tsx > M116.9 home dashboard polish > shows concise market context labels on real Home price rows`.
- Failure detail: the Home page rendered `ยังไม่มีราคาที่เหมาะกับหน้าแรก` instead of expected Home price rows such as `ข้าวเปลือกหอมมะลิ`.
- This appears unrelated to the M140 docs-only AI changes and was left unchanged because M140 must not modify Prices/Home behavior.

Additional checks:

- Generated build artifacts touched by `npm run build` were restored.
- New M140 docs/report were scanned for obvious OpenAI/Google provider key patterns and frontend key assignments; no key values were found.
- Runtime AI scan found only the existing M138 server-side `OPENAI_API_KEY` env-name references and tests, with no live provider call added.

## Known Limitations

- M140 is planning/docs only.
- No provider adapter was implemented.
- No output validator runtime was implemented.
- No durable rate-limit store was implemented.
- No live OpenAI request was made.
- Model names must be verified again before M141/M142 implementation.
- Existing terminal output for older Thai files may appear mojibaked, but M140 did not modify those files.

## Proposed Next Milestone

Recommended safer next milestone:

```text
M141 AI Production Contract QA / Cloudflare Env Setup Guide
```

This matches Option B and is safer than immediately implementing the provider adapter. It should verify Cloudflare secret setup, disabled-state production behavior, manual QA readiness, owner approval flow, and rollback procedure before code introduces provider execution.

Option A can follow after this safety pass:

```text
M142 AI Backend OpenAI Provider Dry-Run Implementation Behind AI_LIVE_ENABLED
```

That later milestone should create the provider adapter, keep `AI_LIVE_ENABLED=false` by default, test with mocked provider only, and avoid live production calls until the owner adds the secret and enables the flag.

## No-Live-Provider Confirmation

M140 did not add:

- live OpenAI calls
- Gemini calls
- external AI provider calls
- API key values
- frontend AI keys
- `VITE_OPENAI_API_KEY`
- `VITE_GEMINI_API_KEY`
- fake live AI output
- fake weather, price, or source data
- runtime live provider integration
- `/app/ai` live AI output
- M138 backend OpenAI execution
- Community, Weather, Prices, YouTube, Supabase, auth, or unrelated route changes

`CONTEXT.md` and `graphify-out` were not modified.
