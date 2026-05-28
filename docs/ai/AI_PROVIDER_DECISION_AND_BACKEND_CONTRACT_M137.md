# AI Provider Decision And Backend Contract M137

Status: contract/foundation only. M137 does not call OpenAI, does not add an API key, does not create a live AI endpoint, and does not change `/app/ai` runtime behavior.

## Owner Decision

Primary V1 provider path:

```text
OpenAI API through backend/server-side infrastructure only.
```

Fallback:

```text
disabled/mock/local fixture mode remains available for staging, not_configured responses, cost safety, and provider outage.
```

Future comparison:

```text
Gemini may be evaluated later, but it is not part of the M137 implementation path.
```

This locks the next backend contract around an OpenAI-first farmer assistant. It does not permit frontend provider calls or live OpenAI calls yet.

## Current App Boundary

Current `/app/ai` still uses the existing AI proxy adapter and local fixtures:

- `src/routes/AIPage.tsx`
- `src/services/ai-proxy/ai-proxy-adapter.ts`
- `src/services/ai-proxy/ai-proxy-mock-service.ts`
- `src/services/ai/ai-request-planner.ts`

Current backend functions:

- `functions/api/youtube/latest.ts`
- `functions/api/youtube/videos.ts`

There is no AI Cloudflare Function in M137.

## Future Endpoint

```http
POST /api/ai/farmer-assistant
```

Planned Cloudflare Pages Function path:

```text
functions/api/ai/farmer-assistant.ts
```

M138 may create a no-provider contract stub at this path. M137 only documents the contract.

## Request Schema

```ts
type FarmerAssistantTopic =
  | 'plant_problem'
  | 'soil_fertilizer'
  | 'water'
  | 'weather'
  | 'price'
  | 'livestock'
  | 'general';

type FarmerAssistantUserMode = 'guest' | 'signed_in';

type FarmerAssistantRequest = {
  question: string;
  crop?: string;
  province?: string;
  topic?: FarmerAssistantTopic;
  userMode?: FarmerAssistantUserMode;
  clientRequestId?: string;
};
```

JSON example:

```json
{
  "question": "ใบมะนาวเหลืองหลังฝนตกหลายวันควรเริ่มตรวจอะไร",
  "crop": "มะนาว",
  "province": "นครปฐม",
  "topic": "plant_problem",
  "userMode": "guest",
  "clientRequestId": "local-optional-123"
}
```

## Request Validation

V1 validation rules:

- `question` is required.
- Trim input before validation.
- Reject empty questions.
- Recommended max question length: 1,200 characters.
- `province` is optional and should be broad province-level context only.
- Do not require precise location.
- Ignore client-provided model, provider, token limit, credit cost, or safety level if sent.
- If a simple guard detects obvious spam or abusive repeated junk, return a safe blocked/validation response before any provider call.
- If `topic` is missing or unknown, treat it as `general`.
- If `userMode` is missing, treat it as `guest`.
- `clientRequestId` is optional and must not be trusted as the server request ID.

M138 should implement validation before any provider work, even if the first endpoint only returns fixtures.

## Response Schema

```ts
type FarmerAssistantStatus =
  | 'ready'
  | 'not_configured'
  | 'rate_limited'
  | 'blocked'
  | 'error';

type FarmerAssistantSafetyLevel = 'normal' | 'caution' | 'high_risk';

type FarmerAssistantProvider = 'openai' | 'disabled' | 'mock';

type FarmerAssistantResponse = {
  status: FarmerAssistantStatus;
  answer?: string;
  safetyLevel?: FarmerAssistantSafetyLevel;
  followUpQuestions?: string[];
  disclaimers?: string[];
  provider?: FarmerAssistantProvider;
  requestId?: string;
  retryAfterSeconds?: number;
};
```

JSON example for a future successful response:

```json
{
  "status": "ready",
  "answer": "จากอาการที่เล่า อาจเกี่ยวกับน้ำขัง รากขาดอากาศ หรือธาตุอาหารบางอย่าง ควรเริ่มจากดูว่าดินแฉะนานไหม มีรากเน่าหรือกลิ่นอับหรือไม่ และมีจุดโรคหรือแมลงใต้ใบร่วมด้วยไหม",
  "safetyLevel": "caution",
  "followUpQuestions": [
    "ปลูกในดินหรือกระถาง",
    "ฝนตกต่อเนื่องกี่วัน",
    "มีจุดใบหรือแมลงใต้ใบไหม"
  ],
  "disclaimers": [
    "คำตอบนี้เป็นคำแนะนำเบื้องต้น ควรตรวจสอบกับผู้เชี่ยวชาญหรือหน่วยงานเกษตรในพื้นที่ก่อนใช้จริง"
  ],
  "provider": "openai",
  "requestId": "ai-farmer-20260528-001"
}
```

M137 fixture examples must use `provider: "mock"` or `provider: "disabled"` and must not pretend to be live OpenAI output.

## HTTP Behavior

Recommended HTTP mapping:

- `200`: `ready`, `not_configured`, or recoverable `blocked`.
- `400`: validation error such as missing/empty/too-long question.
- `405`: unsupported method.
- `413`: request body too large.
- `429`: `rate_limited`.
- `500`: internal `error` with safe user-facing copy only.
- `504`: timeout mapped to safe `error` response when platform supports it.

The response body should still use the normalized response shape where practical.

## Server-Side Environment Contract

Server-side only:

```text
AI_PROVIDER=openai
OPENAI_API_KEY=server-side secret only
AI_MODEL
AI_TIMEOUT_MS
AI_MAX_INPUT_CHARS
AI_MAX_OUTPUT_TOKENS
AI_DAILY_LIMIT_GUEST
AI_DAILY_LIMIT_SIGNED_IN
AI_COOLDOWN_SECONDS
```

Notes:

- `AI_PROVIDER=openai` selects the OpenAI primary path.
- Missing `OPENAI_API_KEY` must return `not_configured`, not crash.
- `AI_MODEL` is a server-side model choice and should be confirmed against current provider docs in the implementation milestone.
- `AI_MAX_INPUT_CHARS` should default to 1,200 for V1 if missing.
- The frontend may display generic enabled/disabled state later, but must not receive provider secrets.

Forbidden frontend env:

```text
VITE_OPENAI_API_KEY
VITE_GEMINI_API_KEY
VITE_AI_PROVIDER_SECRET
```

Also forbidden:

- any provider key in `src/`
- any provider key in committed docs/reports
- any provider key in screenshots/logs
- direct OpenAI calls from browser code

## Backend Processing Contract

Future backend flow:

1. Accept only `POST`.
2. Parse JSON safely.
3. Trim and validate `question`.
4. Normalize optional `crop`, `province`, `topic`, `userMode`, and `clientRequestId`.
5. Classify safety level: `normal`, `caution`, or `high_risk`.
6. Check simple spam/abuse guard.
7. Check rate limit and cooldown before provider call.
8. If provider env is missing, return `not_configured`.
9. Build KasetHub system prompt and request payload server-side.
10. Call OpenAI only in a later approved milestone.
11. Validate output before returning it.
12. Return normalized response with safe Thai copy.

M138 should stop before step 10 unless owner explicitly expands scope.

## Safety Contract

M138/M139 must preserve these minimum rules:

- Answer in simple Thai.
- Ask clarifying questions if crop, location, symptoms, timing, or goal is unclear.
- Do not claim guaranteed diagnosis.
- Do not give confident chemical, pesticide, herbicide, fungicide, animal medicine, or fertilizer dosage unless based on verified label/source data.
- Do not invent live weather, price, or official source data.
- Include disclaimers for chemicals, disease diagnosis, financial/legal-like claims, animal health, and human health.
- Recommend local agriculture office, veterinarian, agronomist, or relevant expert for high-risk cases.
- Do not create fake citations or fake official sources.
- Do not guarantee yield, profit, cure, market price, or sale outcome.
- Do not show raw provider errors to farmer users.

## Frontend Integration Contract

Future `/app/ai` behavior:

- Frontend sends the farmer question to `/api/ai/farmer-assistant`.
- Frontend never sees OpenAI key or any provider secret.
- UI handles `ready`, `not_configured`, `rate_limited`, `blocked`, and `error`.
- UI keeps natural Thai copy.
- UI keeps local fixture/disabled mode fallback until backend is explicitly enabled.
- UI does not show technical error wording such as `API error`, `provider failed`, `undefined`, or `null`.
- UI should preserve the existing safety note near answers.

Suggested user-facing copy:

- Loading: `กำลังเตรียมคำตอบ...`
- Not configured: `ระบบ AI กำลังเตรียมเปิดใช้งาน`
- Rate limited: `วันนี้ถามได้ครบแล้ว ลองใหม่ภายหลัง`
- Blocked: `คำถามนี้เสี่ยงต่อความปลอดภัย ควรปรึกษาผู้เชี่ยวชาญหรือหน่วยงานเกษตรในพื้นที่`
- Error: `ยังตอบคำถามนี้ไม่ได้ ลองใหม่อีกครั้ง`

## Logging And Privacy Contract

M138/M139 should not store raw questions by default.

Allowed minimal metadata:

- server request ID
- timestamp
- status
- topic
- safety level
- user mode
- coarse rate-limit key hash
- latency
- provider family when a provider is eventually called

Do not log:

- `OPENAI_API_KEY`
- provider raw responses with secrets
- exact home address
- precise GPS
- phone, LINE, email, national ID
- raw question by default

## M138 Readiness Checklist

M138 AI Backend Proxy Contract Stub / No Live Provider Call should:

- Create `functions/api/ai/farmer-assistant.ts`.
- Accept `POST` only.
- Validate request JSON.
- Trim `question`.
- Enforce max question length of 1,200 characters by default.
- Reject empty questions safely.
- Return fixture `ready` only when intentionally requested by a safe test mode, or otherwise return `not_configured`.
- Return `not_configured` when OpenAI is not enabled or `OPENAI_API_KEY` is missing.
- Include fixture responses for `not_configured`, `rate_limited`, `blocked`, `error`, `timeout`, and validation error.
- Add endpoint tests.
- Add secret-guard tests proving no frontend provider key is introduced.
- Still avoid OpenAI calls unless owner explicitly upgrades M138 scope.

## M137 Non-Goals

- No OpenAI request.
- No `OPENAI_API_KEY` value.
- No frontend AI key.
- No `VITE_OPENAI_API_KEY`.
- No `VITE_GEMINI_API_KEY`.
- No runtime `/app/ai` provider integration.
- No Supabase writes.
- No Community, Weather, Prices, YouTube, auth, or unrelated route changes.

