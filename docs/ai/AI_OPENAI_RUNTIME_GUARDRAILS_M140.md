# AI OpenAI Runtime Guardrails M140

Status: planning and guardrails only. M140 does not enable live OpenAI calls, does not add API key values, does not add frontend provider keys, and does not change `/app/ai` to produce live AI output.

## Current AI Implementation Summary

M140 inspected the current AI farmer assistant surface before defining the runtime plan:

- `functions/api/ai/farmer-assistant.ts` is a Cloudflare Pages Function contract stub for `POST /api/ai/farmer-assistant`.
- The backend accepts only `POST`, parses JSON safely, validates `question`, `topic`, `userMode`, optional context strings, and `clientRequestId`.
- The backend default max input length is `1200` characters, configurable by server-side `AI_MAX_INPUT_CHARS` and capped at `4000`.
- The backend has narrow pre-provider guards for obvious spam, chemical dosage requests, dangerous chemical mixing requests, and emergency health wording.
- The backend reads only server-side `AI_PROVIDER`, `OPENAI_API_KEY`, `AI_MAX_INPUT_CHARS`, and `AI_COOLDOWN_SECONDS`.
- The backend returns `not_configured` even when `AI_PROVIDER=openai` and `OPENAI_API_KEY` are present, because M138 intentionally stops before provider execution.
- `functions/api/ai/farmer-assistant.test.ts` proves no provider call is attempted, even with local test env values.
- `src/services/ai/ai-farmer-assistant-client.ts` posts to `/api/ai/farmer-assistant`, normalizes response statuses, and falls back to safe Thai copy on invalid JSON or network failure.
- `src/routes/AIPage.tsx` calls the backend contract only when `VITE_AI_BACKEND_CONTRACT_ENABLED=true`; otherwise it keeps the existing local fixture path.
- `src/config/env.ts` exposes only the frontend-safe `aiBackendContractEnabled` flag for the M139 contract path and does not read frontend provider secrets.
- M136-M139 docs and reports consistently keep OpenAI backend-only, disabled by default, and without live provider execution.

## Graphify Pre-Check Result

Before editing, M140 read:

- `graphify-out/.graphify_analysis.json`
- `graphify-out/graph.json`

Graphify identified the AI route cluster around `src/routes/AIPage.tsx`, `src/services/ai`, older AI proxy and AI text planning modules, and AI docs/report nodes. The available graph appears older than the M138/M139 backend contract and did not fully surface `functions/api/ai/farmer-assistant.ts`, so actual source files were inspected before writing this plan. `graphify-out` must remain unmodified.

## OpenAI Runtime Recommendation

Official OpenAI docs were checked during M140 using official OpenAI web docs as a fallback because the dedicated OpenAI docs MCP tool was not available in this session:

- [OpenAI latest model guide](https://developers.openai.com/api/docs/guides/latest-model)
- [OpenAI model catalog](https://developers.openai.com/api/docs/models)

The docs currently identify newer GPT-5-family models, but exact model names can change and must be verified again before M141/M142 implementation.

Recommended V1 default:

```text
AI_MODEL=gpt-5.4-mini
```

Status: to verify before M141/M142 implementation.

Rationale:

- V1 farmer assistant is text-only, Thai, concise, and safety-sensitive.
- A mini model is a better first production default than the flagship model for a high-volume consumer app because cost and latency matter.
- QA should confirm Thai clarity, safety compliance, and refusal behavior before any live rollout.

Backup if cost or latency becomes a concern:

```text
AI_MODEL=gpt-5.4-nano
```

Status: to verify before M141/M142 implementation.

Backup rule:

- Use only after manual QA proves it still follows Thai structure, chemical safety, live-data honesty, and output validator expectations.
- If answer quality or safety drops, keep `gpt-5.4-mini` and reduce usage through rate limits instead.

Escalation model:

```text
gpt-5.5 or the current equivalent flagship model
```

Status: to verify before M141/M142 implementation.

Use only if mini-class QA fails for critical Thai safety behavior and owner accepts higher cost.

## Planned Runtime Shape

The future implementation should use a backend-only OpenAI provider adapter behind `AI_LIVE_ENABLED`. M140 does not implement this adapter.

Planned defaults:

```text
max input length: 1200 characters
max output tokens: 700
total endpoint timeout: 12000 ms
provider timeout: 8000 ms
retry policy: no automatic provider retry in V1
streaming: disabled for V1 unless owner approves later
image input: disabled for V1
memory: disabled for V1
RAG: disabled for V1
live weather/price claims: disabled unless real app data is explicitly integrated later
```

Retry policy details:

- Do not retry validation errors, blocked input, unsafe output, missing env, invalid key, provider `429`, or provider `400` responses.
- Do not automatically retry after a provider timeout in V1 because it may double cost and exceed the Cloudflare response budget.
- Let the UI show a farmer-friendly retry button for safe `error` and `rate_limited` states.
- A later owner-approved milestone may add one bounded retry for transient network failures if logging proves it is needed.

Provider request shape:

- Build the full system prompt server-side.
- Send only the trimmed question, optional crop/province/topic/user mode, and explicitly trusted app context.
- Do not send provider/model names from the browser.
- Do not send precise GPS, phone, email, national ID, or raw user history.
- Prefer the OpenAI Responses API or current recommended text API after re-checking official docs in the implementation milestone.

## Runtime Environment Plan

Server-side only:

```text
AI_PROVIDER=openai
OPENAI_API_KEY
AI_MODEL=gpt-5.4-mini
AI_TIMEOUT_MS=12000
AI_PROVIDER_TIMEOUT_MS=8000
AI_MAX_INPUT_CHARS=1200
AI_MAX_OUTPUT_TOKENS=700
AI_DAILY_LIMIT_GUEST=5
AI_DAILY_LIMIT_SIGNED_IN=20
AI_COOLDOWN_SECONDS=20
AI_LIVE_ENABLED=false
```

Rules:

- `AI_LIVE_ENABLED` must default to `false`.
- Missing `OPENAI_API_KEY` returns `not_configured`.
- `AI_PROVIDER` must be `openai` before any future OpenAI adapter is eligible.
- `AI_MODEL` is server-side only and must be verified against current OpenAI docs before implementation.
- `AI_TIMEOUT_MS` is the total endpoint budget; `AI_PROVIDER_TIMEOUT_MS` is the provider fetch budget.
- Provider errors must return safe Thai user-facing copy.
- Never expose model/provider stack traces to users.
- Never return secret values.
- Never log secret values.

Frontend-safe env:

```text
VITE_AI_BACKEND_CONTRACT_ENABLED=true
```

Forbidden frontend env:

```text
VITE_OPENAI_API_KEY
VITE_GEMINI_API_KEY
VITE_AI_PROVIDER_SECRET
any provider secret
```

## Production Rollout Gate

Safe activation sequence:

1. Confirm backend endpoint exists and still returns the M138/M139 contract.
2. Enable frontend contract mode with `VITE_AI_BACKEND_CONTRACT_ENABLED=true`.
3. Configure `OPENAI_API_KEY` only as a Cloudflare secret, never as a frontend env var.
4. Configure server-side `AI_PROVIDER=openai`, `AI_MODEL`, limits, and timeouts.
5. Keep `AI_LIVE_ENABLED=false`.
6. Deploy with live key present but live execution off.
7. Test production `not_configured` state first.
8. Confirm no browser payload, HTML, logs, or response contains provider secrets.
9. Owner reviews the manual QA prompt set.
10. Set `AI_LIVE_ENABLED=true` only after explicit owner approval.
11. Manually monitor the first live responses.
12. Roll back by setting `AI_LIVE_ENABLED=false`.

M140 does not implement the toggle.

## System Prompt Specification

The detailed prompt spec lives in `docs/ai/AI_SYSTEM_PROMPT_SPEC_M140.md`.

The future system prompt must require:

- Thai answers.
- Farmer-friendly plain language.
- Practical and not too long.
- Four standard sections:
  1. `สิ่งที่อาจเกิดขึ้น`
  2. `สิ่งที่ควรตรวจเช็ก`
  3. `วิธีเริ่มแก้แบบปลอดภัย`
  4. `เมื่อไหร่ควรถามผู้เชี่ยวชาญ`
- Clarifying questions when crop, province, symptoms, or timing are missing.
- No chemical dosage certainty.
- No dangerous mixing instructions.
- No fake citations.
- No fake live weather, price, or source data.
- Local agriculture office or expert escalation for high-risk cases.
- Disclaimers when chemicals, disease, animal health, human health, finance, legal, weather, price, or safety issues appear.

## Output Safety Validator Design

The future backend should validate generated AI text before returning it to `/app/ai`.

Input:

```ts
type FarmerAssistantOutputValidationInput = {
  question: string;
  answer: string;
  topic: FarmerAssistantTopic;
  inputSafetyLevel: FarmerAssistantSafetyLevel;
  trustedContext: {
    hasLiveWeatherData: boolean;
    hasLivePriceData: boolean;
    hasSourceData: boolean;
  };
};
```

Output:

```ts
type FarmerAssistantOutputValidationResult = {
  ok: boolean;
  safetyLevel: 'normal' | 'caution' | 'high_risk';
  reasons: string[];
};
```

Required checks:

- No dangerous chemical mixing instructions.
- No confident pesticide, herbicide, fungicide, insecticide, animal medicine, or fertilizer dosage without verified label/source context.
- No guaranteed diagnosis, profit, yield, cure, sale outcome, weather outcome, or market movement.
- No fake live price or weather claims when trusted app context is absent.
- No fake citation, official-source, or research claims when source context is absent.
- No medical or human emergency advice beyond immediate escalation.
- No long unsafe answer if input was high-risk.
- Answer is Thai or mostly Thai.
- No raw provider error, stack trace, API response, model ID, or secret-looking string.
- Required safety sections are present or the answer asks clarifying questions when context is missing.

Implementation approach:

- Start with deterministic string and regex checks before any model-based validator.
- Keep rules transparent and unit-tested.
- Treat validator failure as a safety event, not as a provider-visible error.
- Do not store the full raw question/answer by default.

Fallback behavior:

```json
{
  "status": "blocked",
  "answer": "คำตอบนี้อาจเสี่ยงต่อความปลอดภัย จึงขอไม่แสดงคำแนะนำดังกล่าว ควรตรวจสอบฉลากจริงและปรึกษาเจ้าหน้าที่เกษตรหรือผู้เชี่ยวชาญในพื้นที่ก่อนตัดสินใจ",
  "safetyLevel": "high_risk",
  "followUpQuestions": [
    "ต้องการให้ช่วยเตรียมรายการข้อมูลสำหรับคุยกับผู้เชี่ยวชาญไหม"
  ],
  "disclaimers": [
    "ระบบไม่แนะนำอัตราใช้สารเคมีหรือการผสมสารเคมีที่ไม่มีฉลากหรือแหล่งข้อมูลที่ตรวจสอบได้"
  ],
  "provider": "disabled"
}
```

Logging:

- Log only request ID, timestamp, status, topic, safety level, validator reason codes, latency, and coarse rate-limit key hash.
- Do not log raw full question or raw full answer by default.
- Do not log `OPENAI_API_KEY`, request headers, or provider raw error body.

## Abuse And Rate-Limit Plan

V1 controls:

```text
AI_MAX_INPUT_CHARS=1200
AI_MAX_OUTPUT_TOKENS=700
AI_COOLDOWN_SECONDS=20
AI_DAILY_LIMIT_GUEST=5
AI_DAILY_LIMIT_SIGNED_IN=20
```

Behavior:

- Enforce cooldown and daily limit before provider calls.
- Return `rate_limited` with safe Thai copy and `retryAfterSeconds` when known.
- Treat repeated junk, extreme repetition, and very long input as validation/rate-limit cases before provider work.
- Keep anonymous limits lower than signed-in limits.
- Do not implement billing in M140.
- Do not store raw questions by default.

Future tracking options:

- Cloudflare KV for simple per-day counters.
- Durable Object for stronger concurrency control.
- R2 for aggregated audit exports without raw prompts.
- Supabase only if owner approves privacy copy and schema.

## Error And Fallback Plan

All farmer-facing errors should be natural Thai, not technical wording.

| Case | Planned status | Farmer-facing copy rule | Log metadata |
| --- | --- | --- | --- |
| Missing `OPENAI_API_KEY` | `not_configured` | `ระบบ AI กำลังเตรียมเปิดใช้งาน ตอนนี้ยังไม่เปิดคำตอบจาก AI จริง` | `missing_key` only |
| `AI_LIVE_ENABLED=false` | `not_configured` | Same as missing key | `live_disabled` |
| Invalid API key or provider auth error | `not_configured` | Same as missing key | `provider_auth_error` |
| Provider timeout | `error` | `ระบบใช้เวลานานเกินไป ลองส่งคำถามอีกครั้ง` | `provider_timeout` |
| Provider `429` | `rate_limited` | `ช่วงนี้มีการใช้งานมาก ลองใหม่ภายหลัง` | `provider_rate_limited` |
| Provider `5xx` | `error` | `ยังตอบคำถามนี้ไม่ได้ ลองใหม่อีกครั้ง` | `provider_5xx` |
| Malformed provider response | `error` | `ยังตอบคำถามนี้ไม่ได้ ลองใหม่อีกครั้ง` | `malformed_provider_response` |
| Unsafe provider output | `blocked` or safe `ready` caution fallback | Replace with safe caution response | `output_validator_failed` |
| Network failure | `error` | `ยังเชื่อมต่อผู้ช่วย AI ไม่ได้ ลองใหม่อีกครั้ง` | `network_failure` |
| Validation error | `error` | `พิมพ์คำถามให้ครบและสั้นลง แล้วลองใหม่` | `validation_error` |
| High-risk blocked input | `blocked` | `คำถามนี้เสี่ยงต่อความปลอดภัย ควรปรึกษาผู้เชี่ยวชาญในพื้นที่` | `input_high_risk_blocked` |

Never return:

- raw provider error body
- stack trace
- `undefined`
- `null`
- model/provider debug text
- secret values
- fake weather, price, source, citation, diagnosis, yield, profit, or cure claims

## Manual QA Plan

The prompt set lives in `docs/ai/AI_MANUAL_QA_PROMPTS_M140.md`.

Before live launch, every candidate model must pass:

- normal plant problem prompt
- soil/fertilizer prompt
- water/irrigation prompt
- price/live-data honesty prompt
- weather/live-data honesty prompt
- pesticide dosage prompt
- chemical mixing prompt
- animal health concern prompt
- vague prompt requiring clarification
- abusive/spam prompt
- very long input prompt

Any failure on chemical safety, fake live data, secret leakage, or non-Thai answers blocks activation.

## Non-Goals

M140 does not:

- enable live OpenAI calls
- add an `OPENAI_API_KEY` value
- add frontend provider keys
- add `VITE_OPENAI_API_KEY`
- add `VITE_GEMINI_API_KEY`
- change `/app/ai` to produce live AI output
- modify M138 backend stub to call OpenAI
- integrate live weather or price data into AI
- add memory, RAG, image input, streaming, billing, or durable rate-limit storage
- modify Community, Weather, Prices, YouTube, Supabase, auth, or unrelated routes
