# M141 AI Provider Decision Revision To Gemini Report

## Summary

M141 revises the future KasetHub AI farmer assistant provider strategy from OpenAI-first to Gemini-first. This milestone is documentation/planning only and does not change runtime behavior.

## CONTEXT.md Read Confirmation

`CONTEXT.md` was read first and used as the current project context. It confirms that AI remains a priority feature and must stay backend/proxy only, with no frontend provider key, no unsafe pesticide/chemical overconfidence, Thai farmer-friendly answers, and owner-confirmed provider decisions. `CONTEXT.md` was not modified.

## Graphify Pre-Check Result

Graphify files were read before editing:

- `graphify-out/.graphify_analysis.json`
- `graphify-out/graph.json`

Graphify identified the AI route/service cluster around `/app/ai`, `src/services/ai`, AI proxy fixtures, AI text planning modules, AI docs, and prior reports. The graph is supplemental and did not replace actual source inspection. `graphify-out` was not modified.

## Files Created/Modified

Created:

- `docs/ai/AI_PROVIDER_DIRECTION_REVISION_M141.md`
- `docs/ai/AI_GEMINI_RUNTIME_PLAN_M141.md`
- `docs/ai/AI_ROADMAP_REVISION_M141.md`
- `docs/ai/AI_PROVIDER_COMPARISON_GEMINI_VS_OPENAI_M141.md`
- `reports/milestones/M141_AI_PROVIDER_DECISION_REVISION_TO_GEMINI_REPORT.md`

Modified:

- `docs/ai/AI_BACKEND_FIXTURE_STATES_M137.md`
- `docs/ai/AI_BACKEND_PROXY_STUB_M138.md`
- `docs/ai/AI_FRONTEND_BACKEND_CONTRACT_WIRING_M139.md`
- `docs/ai/AI_LIVE_ROLLOUT_CHECKLIST_M140.md`
- `docs/ai/AI_OPENAI_RUNTIME_GUARDRAILS_M140.md`
- `docs/ai/AI_PROVIDER_DECISION_AND_BACKEND_CONTRACT_M137.md`
- `docs/ai/AI_REAL_PROVIDER_ARCHITECTURE_M136.md`
- `docs/ai/AI_SYSTEM_PROMPT_SPEC_M140.md`

## Previous Provider Direction Summary

M136 recommended OpenAI as the primary V1 text provider, with Gemini as a secondary/evaluation option and disabled/mock mode as fallback.

M137 locked OpenAI as the primary V1 provider path and documented the backend contract around an OpenAI-first future.

M138 created `POST /api/ai/farmer-assistant` as a safe backend stub and still made no provider call.

M139 wired `/app/ai` to the backend contract behind `VITE_AI_BACKEND_CONTRACT_ENABLED`, while keeping local fixture fallback as default.

M140 created OpenAI runtime guardrails, rollout checklist, system prompt spec, output validator design, manual QA prompts, and roadmap notes.

Historical reports were preserved. M141 adds forward revision docs instead of rewriting history.

## New Gemini-First Direction Summary

Primary V1 provider:

```text
Gemini API
```

Secondary/future comparison:

```text
OpenAI
```

Fallback:

```text
disabled/mock/local fixture mode
```

Rationale:

- Owner selected Gemini API.
- Backend-only architecture is preserved.
- Cloudflare-hosted backend remains the provider boundary.
- No frontend key is allowed.
- Gemini Flash/Flash-Lite style models are suitable candidates for Thai farmer assistant evaluation.
- Safety, prompt, validator, and rollout controls remain provider-independent.

## Env Plan Revision

Server-side env plan:

```text
AI_PROVIDER=gemini
GEMINI_API_KEY
AI_MODEL
AI_TIMEOUT_MS
AI_PROVIDER_TIMEOUT_MS
AI_MAX_INPUT_CHARS
AI_MAX_OUTPUT_TOKENS
AI_DAILY_LIMIT_GUEST
AI_DAILY_LIMIT_SIGNED_IN
AI_COOLDOWN_SECONDS
AI_LIVE_ENABLED=false
```

Frontend-safe env:

```text
VITE_AI_BACKEND_CONTRACT_ENABLED=true
```

Forbidden frontend env:

```text
VITE_GEMINI_API_KEY
VITE_OPENAI_API_KEY
VITE_AI_PROVIDER_SECRET
any provider secret
```

Rules:

- `AI_LIVE_ENABLED` defaults to `false`.
- Missing `GEMINI_API_KEY` should return `not_configured` in future Gemini implementation.
- Provider errors return safe Thai copy.
- Secret values and provider stack traces are never returned.

## Runtime Planning Revision

Gemini model candidates documented:

- `gemini-3.5-flash` or current stable Gemini Flash model.
- `gemini-2.5-flash` as a conservative stable candidate.
- `gemini-3.1-flash-lite` or current stable Gemini Flash-Lite model for cost/latency backup.
- `gemini-2.5-flash-lite` as an additional backup candidate.

All model names are marked: verify against current Gemini documentation before implementation.

Runtime defaults remain conservative:

- max input chars: `1200`
- max output tokens: `700`
- endpoint timeout: `12000 ms`
- provider timeout: `8000 ms`
- no automatic provider retry in V1
- no streaming in V1 unless owner approves later
- no image input in V1
- no memory in V1
- no RAG in V1
- no live weather/price claims unless app data is explicitly integrated later

## System Prompt Compatibility Summary

M140 system prompt design remains mostly provider-agnostic.

Confirmed unchanged:

- Thai answers.
- Farmer-friendly plain language.
- Practical short responses.
- Four-section answer shape.
- Clarifying questions when context is missing.
- No chemical dosage certainty.
- No dangerous mixing instructions.
- No fake weather/price/source data.
- No fake citations.
- High-risk expert escalation.

Gemini-specific considerations were documented separately:

- Keep system instruction concise and explicit.
- Do not enable grounding tools by default.
- Map Gemini safety blocks or empty outputs to safe `blocked` or `error` contract responses.
- Do not expose Gemini model names or safety ratings to users.

## Validator Compatibility Summary

M140 output validator design remains provider-independent and should work for Gemini outputs.

Same checks apply:

- no dangerous chemical mixing
- no confident pesticide/fertilizer dosage without verified source
- no guaranteed diagnosis/profit/yield/cure
- no fake live price/weather claims
- no fake citations/source claims
- no medical/human emergency advice
- no long unsafe high-risk output
- Thai or mostly Thai answer
- no raw provider errors, model IDs, stack traces, or secret-like strings

Fallback behavior remains:

- Replace unsafe output with safe caution/blocked response.
- Log minimal metadata and reason codes only.
- Do not log raw full question/answer by default.

## Roadmap Revision

Revised conservative sequence:

1. M142 Gemini Provider Dry-Run Adapter
2. M143 Gemini Runtime Guardrail Integration
3. M144 AI Production Contract QA
4. M145 Controlled Gemini Rollout (`AI_LIVE_ENABLED=false` default)
5. M146 Owner-Approved Live Gemini Activation

The next milestone should not activate live Gemini.

## Verification Results

- `npm run lint`: passed.
- `npm run build`: passed. Vite reported the existing large chunk warning after production build. Build-generated changes to `dist/index.html` and `tsconfig.app.tsbuildinfo` were restored so generated artifacts are not part of M141.
- `git diff --check`: passed. Git reported line-ending warnings for touched Markdown files only.
- `npm run test -- functions/api/ai/farmer-assistant.test.ts src/services/ai/ai-farmer-assistant-client.test.ts src/routes/AIPage.test.tsx`: passed, 3 files and 25 tests.
- Provider key pattern scan across AI docs and the M141 report found no provider key values or frontend provider key assignments.

## Known Limitations

- M141 is docs/planning only.
- No Gemini adapter was created.
- No runtime provider enum was changed.
- The M138 stub still contains historical OpenAI env guard logic and should be revised in a future dry-run adapter milestone.
- Gemini model names, launch stages, quotas, pricing, endpoint shape, and safety settings must be checked again immediately before implementation.

## Proposed Next Milestone

Recommended:

```text
M142 Gemini Provider Dry-Run Adapter (AI_LIVE_ENABLED=false)
```

M142 should:

- create provider adapter layer
- create Gemini provider interface
- create mocked Gemini responses
- keep `AI_LIVE_ENABLED=false`
- not execute live Gemini requests
- not require `GEMINI_API_KEY`
- prepare runtime integration safely

## No-Live-Provider Confirmation

M141 did not add:

- live Gemini calls
- live OpenAI calls
- external AI provider calls
- provider API key values
- frontend provider keys
- `VITE_GEMINI_API_KEY`
- `VITE_OPENAI_API_KEY`
- runtime AI execution changes
- fake AI live output
- Community, Weather, Prices, YouTube, Supabase, auth, or unrelated route changes

`CONTEXT.md` and `graphify-out` were not modified.
