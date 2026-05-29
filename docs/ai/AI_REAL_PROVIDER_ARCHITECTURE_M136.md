# AI Real Provider Architecture M136

> M141 revision note: Future provider direction is now Gemini-first. Preserve this file as historical M136 context; use `docs/ai/AI_PROVIDER_DIRECTION_REVISION_M141.md` and `docs/ai/AI_GEMINI_RUNTIME_PLAN_M141.md` for implementation planning after M141.

Status: design only. M136 does not implement a real provider call, add an API key, create a production AI endpoint, or change `/app/ai` runtime behavior.

## Current KasetHub AI State

`/app/ai` is registered in `src/app/App.tsx` and renders `src/routes/AIPage.tsx`.

The current page calls the AI proxy adapter through `askTextQuestion()`. By default the adapter uses local fixtures and does not run `fetch`, call a provider, upload images, or write Supabase/backend data.

Relevant existing boundaries:

- `src/services/ai/ai-request-planner.ts` classifies request type, credit cost, safety level, and future endpoint.
- `src/services/ai/ai-routing-policy.ts` contains placeholder model routing only.
- `src/services/ai-proxy/ai-proxy-adapter.ts` keeps `local_fixture` as the default and marks network calls as disabled.
- `src/services/ai-text/*` contains a controlled staging/dry-run contract for specific AI text explanations, with provider calls blocked.
- `src/config/env.ts` exposes frontend feature flags, but it does not read provider secrets such as `VITE_OPENAI_API_KEY` or `VITE_GEMINI_API_KEY`.
- `functions/api/` currently contains YouTube endpoints only. There is no AI Cloudflare Function in M136.

M136 should be treated as a fresh owner decision point for the farmer assistant provider, not as permission to turn on the older placeholder routes.

## Recommended V1 Direction

Recommendation for owner approval before M137: use OpenAI API as the primary V1 text provider for `/api/ai/farmer-assistant`, with Gemini kept as a benchmark/secondary option and local disabled/mock mode kept as the safety fallback.

Why this recommendation:

- The first production AI value is conversational Thai farmer guidance, not image diagnosis.
- The response must be structured, cautious, and easy to safety-review.
- Server-side key handling, cost caps, timeouts, and structured output are more important than model novelty.
- The current frontend already expects safe answer cards and disclaimers, so M137 can focus on a backend contract before any provider call.

Final provider/model selection should be confirmed against current official provider docs and pricing during M137, before implementation.

## Provider Options

### OpenAI API

Pros:

- Strong general reasoning and Thai-language response quality for practical explanation.
- Good fit for structured outputs such as sections, follow-up questions, safety warnings, and concise answer cards.
- Mature server-side integration path for a Cloudflare Function or another backend.
- Useful safety controls can be layered with a strict system prompt, request validation, and output validation.

Cons:

- Owner must monitor token cost carefully as usage grows.
- A backend must enforce rate limits before any provider call.
- Provider behavior can still be overconfident without strong prompts and post-checks.

Cost/control considerations:

- Start with a low-cost text model chosen at implementation time.
- Cap input length, output length, daily anonymous usage, and retries.
- Do not send images or large context in the first text-only milestone.

Thai language considerations:

- Suitable for natural Thai farmer-facing answers.
- Still needs KasetHub-specific prompt rules to avoid formal or technical wording.

Backend implications:

- Store `OPENAI_API_KEY` server-side only.
- No `VITE_OPENAI_API_KEY`.
- Backend normalizes provider output into the KasetHub response contract.

Suitability for KasetHub V1:

- Recommended primary path for first real text assistant, pending owner approval.

### Google Gemini API

Pros:

- Strong candidate for low-latency, cost-sensitive text workloads.
- Existing placeholder routing in `src/services/ai/ai-routing-policy.ts` already names Gemini-style tiers.
- Good option to compare for Thai answers and future multimodal work.

Cons:

- Current placeholder names are not a live contract.
- Safety and output shape still need backend validation.
- Running multiple providers in V1 increases testing and operational complexity.

Cost/control considerations:

- Could be attractive for high-volume everyday questions.
- Still requires the same rate limits, max lengths, timeout, and retry policy.

Thai language considerations:

- Should be evaluated with real Thai farmer prompts in M137/M138.
- Tone may require additional prompt tuning.

Backend implications:

- Store `GEMINI_API_KEY` server-side only.
- No `VITE_GEMINI_API_KEY`.
- Backend maps Gemini output into the same KasetHub response schema.

Suitability for KasetHub V1:

- Good secondary/evaluation path. Do not enable alongside OpenAI until the operational and safety test matrix is ready.

### Fallback / Mock / Disabled Mode

Pros:

- Keeps `/app/ai` honest when the backend or provider is not configured.
- Lets KasetHub deploy UI safely without live provider spend.
- Preserves existing fixture tests and credit preview behavior.

Cons:

- Not a real answer engine.
- Should not be marketed as live AI guidance.

Cost/control considerations:

- No provider cost.
- Useful for staging, fallback, and owner demos where the provider is intentionally off.

Thai language considerations:

- Current copy is enough for explanation and examples, but not a substitute for live AI.

Backend implications:

- Endpoint can return `not_configured` or `disabled` with safe Thai copy.
- No provider key needed.

Suitability for KasetHub V1:

- Required fallback mode, not the main revenue/engagement path.

## Backend-Only Endpoint Design

Proposed endpoint:

```http
POST /api/ai/farmer-assistant
```

Cloudflare Pages Function path if this app keeps the same convention as YouTube:

```text
functions/api/ai/farmer-assistant.ts
```

Server-side environment only:

```text
AI_PROVIDER=openai | gemini | disabled
OPENAI_API_KEY=server-side secret only
GEMINI_API_KEY=server-side secret only
AI_MODEL=server-side model choice
AI_TIMEOUT_MS=12000
AI_PROVIDER_TIMEOUT_MS=8000
AI_MAX_INPUT_CHARS=1600
AI_MAX_OUTPUT_TOKENS=700
AI_DAILY_ANON_LIMIT=10
AI_COOLDOWN_SECONDS=20
```

Frontend must not contain:

```text
VITE_OPENAI_API_KEY
VITE_GEMINI_API_KEY
VITE_AI_PROVIDER_KEY
```

### Request Schema

```json
{
  "question": "ใบมะนาวเหลืองเกิดจากอะไร",
  "context": {
    "crop": "มะนาว",
    "province": "นครปฐม",
    "district": " optional",
    "growthStage": " optional",
    "symptoms": "ใบเหลืองหลังฝนตก",
    "recentWeatherSummary": "optional app-provided summary only",
    "priceContext": "optional app-provided source data only"
  },
  "client": {
    "sourceRoute": "/app/ai",
    "locale": "th-TH",
    "appVersion": "optional"
  }
}
```

Rules:

- `question` is required.
- Trim and normalize whitespace.
- Reject empty questions.
- Reject or ask the user to shorten questions over the server limit.
- Ignore client-provided model names, provider names, credit costs, and safety level.
- Treat app-provided weather/price context as factual only when it includes source metadata.

### Response Schema

```json
{
  "status": "ready",
  "requestId": "ai-farmer-20260528-abc123",
  "answer": {
    "title": "สาเหตุที่เป็นไปได้",
    "summary": "ใบเหลืองอาจเกิดได้จากน้ำขัง ธาตุอาหาร หรือโรคบางชนิด ต้องดูอาการร่วม",
    "sections": [
      {
        "heading": "สิ่งที่ควรสังเกต",
        "items": ["ดูว่าดินแฉะหรือมีกลิ่นอับไหม", "ดูว่ามีจุดใบหรือแมลงใต้ใบไหม"]
      }
    ],
    "followUpQuestions": ["ปลูกในดินหรือกระถาง", "ฝนตกต่อเนื่องกี่วัน"],
    "safetyNote": "คำตอบนี้เป็นคำแนะนำเบื้องต้น ควรตรวจสอบกับผู้เชี่ยวชาญหรือหน่วยงานเกษตรในพื้นที่ก่อนใช้จริง"
  },
  "safety": {
    "level": "medium",
    "disclaimers": ["เรื่องสารเคมี ปุ๋ย หรือโรคพืชควรตรวจสอบฉลากจริงและผู้เชี่ยวชาญก่อนใช้"]
  },
  "usage": {
    "charged": false,
    "estimatedInputChars": 120,
    "estimatedOutputTokens": 350
  },
  "createdAt": "2026-05-28T00:00:00.000Z"
}
```

Allowed statuses:

- `ready`: safe answer returned.
- `not_configured`: backend/provider not configured.
- `blocked`: request asks for unsafe or unsupported advice.
- `rate_limited`: user/device has exceeded the current limit.
- `error`: provider/backend failed and no answer was returned.

Never show raw provider errors to users.

## Backend Processing Flow

1. Parse JSON and validate method, content type, and size.
2. Validate question length and required fields.
3. Normalize source route and optional app context.
4. Classify risk: normal, risky/chemical/disease, price/live-data, unsupported.
5. Apply rate limit and cooldown before provider call.
6. Build KasetHub system prompt and safe request payload.
7. Call provider only if configured and allowed.
8. Enforce timeout and retry policy.
9. Validate generated answer shape and safety rules.
10. Return normalized response.
11. Log minimal metadata only.

## Error And Fallback Behavior

When provider key is missing:

```json
{
  "status": "not_configured",
  "requestId": "ai-farmer-disabled",
  "answer": null,
  "errorMessage": "ยังไม่เปิดใช้งานผู้ช่วย AI จริง",
  "createdAt": "2026-05-28T00:00:00.000Z"
}
```

When provider fails:

- Return `error` with friendly Thai copy.
- Do not charge credits.
- Do not show stack traces, provider names, or raw API messages to users.
- The frontend may keep the user question and show a retry button.

When the request is high-risk:

- Prefer clarifying questions and safe first steps.
- Block requests for dangerous chemical mixing, illegal use, guaranteed treatment, or exact dosage without a verified label/source.

## Frontend Integration Design

Future `/app/ai` flow:

1. User enters a question in Thai.
2. Frontend trims the question and sends it to `/api/ai/farmer-assistant`.
3. Backend handles provider key, safety prompt, rate limit, and validation.
4. UI shows loading, answer, disclaimer, retry, blocked, rate-limited, or not-configured state.
5. UI does not expose provider names, API keys, stack traces, or dev wording.

Frontend copy should stay farmer-facing:

- Loading: `กำลังเตรียมคำตอบ...`
- Not configured: `ระบบ AI กำลังเตรียมเปิดใช้งาน`
- Error: `ยังตอบคำถามนี้ไม่ได้ ลองใหม่อีกครั้ง`
- Blocked: `คำถามนี้เสี่ยงต่อความปลอดภัย ขอแนะนำให้ปรึกษาผู้เชี่ยวชาญหรือหน่วยงานเกษตรในพื้นที่`

## Cost And Rate Limit Design

V1 controls:

- Max question length: 1,600 characters.
- Max answer length: roughly 700 output tokens or a concise section limit.
- Anonymous daily limit: low default such as 5-10 requests per device/IP signal.
- Logged-in daily limit: higher, owner-controlled later.
- Cooldown: 15-30 seconds after each request.
- High-risk prompts may cost more or be capped more tightly.
- Provider timeout: about 8 seconds.
- Total endpoint timeout: about 12 seconds.
- No billing/payment implementation in M136.

Future monetization:

- Free daily quota.
- Rewarded credits.
- Premium monthly quota.
- Higher cap for logged-in verified users.
- Separate limits for text, image, video summary, and calculator explanation.

## Privacy And Logging Design

Default V1 policy:

- Do not store raw questions by default.
- Do not store exact location by default.
- Do not send unnecessary personal data to the provider.
- Do not include phone, LINE, email, precise address, or farm GPS unless a later consented feature requires it.
- Log only request ID, timestamp, source route, status, safety level, latency, provider family, token estimate, and coarse rate-limit key hash.
- If answer history is added later, require explicit product decision and privacy copy.

Provider logs and platform logs must not include secrets.

## Data Honesty Rules

The assistant must not claim live data unless the backend includes real app data in the request.

Examples:

- Do not invent live weather.
- Do not invent live crop prices.
- Do not invent official sources or citations.
- Do not claim disease diagnosis certainty.
- Do not invent pesticide labels, fertilizer rates, or legal/financial certainty.

## Proposed Milestone Sequence

M137 AI Provider Owner Decision + Backend Contract:

- Owner chooses provider path.
- Finalize request/response schema.
- Finalize env names, model choice, and test fixtures.
- No live provider call yet unless explicitly approved.

M138 AI Backend Proxy Foundation:

- Add Cloudflare Function shell.
- Missing key returns `not_configured`.
- Provider code remains behind server-side env and tests.
- Add rate-limit and timeout structure.

M139 AI UI Real Response Integration:

- `/app/ai` consumes backend response.
- Loading/error/not-configured/blocked states polished.
- Local fixture fallback preserved.

M140 AI Safety/Abuse/Rate Limit Hardening:

- Add stricter prompt policy, output checks, blocked prompt suite, and rate-limit persistence if approved.

M141 AI Production QA:

- Owner staging test, mobile QA, cost monitoring, copy review, and release checklist.
