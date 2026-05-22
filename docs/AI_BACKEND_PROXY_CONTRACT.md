# AI Backend Proxy Contract

M09 defines the future backend-owned AI request architecture. It does not add real endpoints, provider keys, AI calls, Supabase writes, or network requests.

## Product Boundary

The frontend must never call OpenAI, Gemini, or any other AI provider directly. Provider keys belong only in a secure backend service, API route, or Supabase Edge Function.

Frontend responsibilities:

- Collect user intent and context.
- Show estimated credit cost and safety copy.
- Send requests to KasetHub backend only in a future milestone.
- Keep local mock UX working for guests until backend exists.

Backend responsibilities:

- Validate auth or guest session.
- Check credits before model calls.
- Select model by routing policy.
- Add safety instructions and Thai agriculture context.
- Call provider APIs with server-side keys.
- Log usage and credit transactions.
- Return structured, safe responses.

## Endpoints

Future endpoint options:

```http
POST /api/ai/ask
POST /api/ai/analyze-plant-image
POST /api/ai/summarize-video
POST /api/ai/summarize-article
```

## `POST /api/ai/ask`

Purpose: Normal questions, risky or complex questions, and price explanations.

Request:

```json
{
  "requestType": "normal_text_question",
  "question": "ใบข้าวมีจุดสีน้ำตาลหลังฝนตก ควรตรวจอะไรบ้าง",
  "crop": "ข้าว",
  "province": "สุพรรณบุรี",
  "guestId": "guest_local_123",
  "userId": "future-user-id",
  "clientCreditPreview": 1,
  "metadata": {
    "sourceRoute": "/app/ai"
  }
}
```

For `price_explanation`, the request should include source context instead of asking the model to infer live prices:

```json
{
  "requestType": "price_explanation",
  "question": "ช่วยอธิบายราคาอ้างอิงข้าวหอมมะลิ 105",
  "crop": "ข้าวหอมมะลิ 105",
  "province": "ยโสธร",
  "guestId": "guest_local_123",
  "clientCreditPreview": 1,
  "metadata": {
    "sourceRoute": "/app/prices/price-rice-jasmine-105-yasothon-demo",
    "priceReference": {
      "priceId": "price-rice-jasmine-105-yasothon-demo",
      "referencePriceLabel": "15,150 บาท/ตัน",
      "sourceLabel": "OAE / สำนักงานเศรษฐกิจการเกษตร",
      "sourceDateTimeLabel": "ข้อมูลตัวอย่าง 23 พ.ค. 2569 09:00",
      "marketLabel": "ตลาดกลางตัวอย่างยโสธร",
      "regionLabel": "ยโสธร",
      "unitLabel": "บาท/ตัน",
      "qualityGradeLabel": "ข้าวเปลือกหอมมะลิมาตรฐาน",
      "reliabilityLevel": "official",
      "isDemoSample": true
    }
  }
}
```

Response:

```json
{
  "answerId": "ai_answer_123",
  "requestType": "risky_or_complex_question",
  "modelRoute": "strong_text",
  "providerUsed": "gemini_flash",
  "creditCost": 2,
  "answer": "คำตอบภาษาไทยแบบมีขั้นตอน...",
  "safetyLevel": "high",
  "disclaimers": [
    "คำแนะนำเกี่ยวกับโรคพืช ปุ๋ย หรือสารเคมีควรตรวจสอบกับผู้เชี่ยวชาญก่อนใช้งานจริง"
  ],
  "remainingCredits": 4,
  "createdAt": "2026-05-22T10:00:00.000Z"
}
```

`price_explanation` responses must:

- Say `ราคาอ้างอิง`.
- Cite source label and source date/time.
- Include market/region, unit, and grade when provided.
- Avoid guaranteeing sale price or telling the user a sale decision is certain.
- Include `ราคาจริงขึ้นกับพื้นที่ เกรดสินค้า ความชื้น ฤดูกาล และผู้รับซื้อ`.
- Clearly say when the referenced price is demo/sample data.

## `POST /api/ai/analyze-plant-image`

Purpose: Future plant image analysis with a vision model.

Request:

```json
{
  "imageAssetId": "storage_image_123",
  "crop": "ข้าว",
  "symptoms": "ใบมีจุดสีน้ำตาลหลังฝนตก",
  "guestId": "guest_local_123",
  "userId": "future-user-id",
  "clientCreditPreview": 3,
  "consent": {
    "allowImageProcessing": true,
    "allowSaveToMyFarm": false
  }
}
```

Response:

```json
{
  "analysisId": "analysis_123",
  "requestType": "plant_image_analysis",
  "modelRoute": "vision",
  "providerUsed": "future_vision_model",
  "creditCost": 3,
  "result": {
    "possibleIssue": "โรคใบจุดสีน้ำตาล",
    "confidence": 0.82,
    "symptoms": [],
    "treatments": []
  },
  "disclaimers": [
    "ผลวิเคราะห์ภาพเป็นข้อมูลเบื้องต้น ไม่ใช่การวินิจฉัยยืนยัน"
  ],
  "remainingCredits": 2
}
```

## `POST /api/ai/summarize-video`

Purpose: Summarize a YouTube video from imported metadata, transcript, or curated notes.

Request:

```json
{
  "videoId": "sample-video-id",
  "summaryGoal": "สรุปเป็นเช็กลิสต์สำหรับเกษตรกร",
  "guestId": "guest_local_123",
  "clientCreditPreview": 2
}
```

Response:

```json
{
  "summaryId": "video_summary_123",
  "requestType": "video_summary",
  "modelRoute": "summary",
  "providerUsed": "openai_mini",
  "creditCost": 2,
  "summary": "สรุปวิดีโอแบบย่อ...",
  "disclaimers": [
    "สรุปวิดีโออาจตกหล่นรายละเอียด ควรดูวิดีโอต้นฉบับประกอบ"
  ]
}
```

## `POST /api/ai/summarize-article`

Purpose: Summarize article content for reading assistance.

Request:

```json
{
  "articleId": "article-001",
  "summaryGoal": "สรุปประเด็นสำคัญ",
  "guestId": "guest_local_123",
  "clientCreditPreview": 1
}
```

Response:

```json
{
  "summaryId": "article_summary_123",
  "requestType": "article_summary",
  "modelRoute": "summary",
  "providerUsed": "openai_mini",
  "creditCost": 1,
  "summary": "สรุปบทความแบบย่อ...",
  "disclaimers": [
    "สรุปบทความเป็นการย่อความ ควรอ่านเนื้อหาต้นฉบับเมื่อต้องตัดสินใจสำคัญ"
  ]
}
```

## Credit Validation

Backend must:

- Recalculate credit cost from request type and safety classification.
- Ignore client-provided credit cost except as a UI preview.
- Check user/guest balance before provider calls.
- Deduct credits atomically after a successful accepted request.
- Record an `ai_credit_transactions` ledger entry.
- Return remaining credits.

## Model Routing

Initial policy:

- `normal_text_question`: cheap text model, 1 credit.
- `risky_or_complex_question`: stronger text model, 2 credits.
- `plant_image_analysis`: vision model, 3 credits.
- `video_summary`: summary model, 2 credits.
- `article_summary`: summary model, 1 credit.
- `price_explanation`: cheap text model plus source disclaimer, 1 credit.

## Provider Key Storage

- Store provider keys server-side only.
- Never expose provider keys through Vite ENV.
- Never commit provider keys to docs, reports, screenshots, or source code.
- Rotate keys if exposure is suspected.
- Use separate dev and production provider projects where possible.

## Rate Limiting and Abuse Prevention

- Rate limit by user ID, guest ID, IP/device signal, and request type.
- Cap high-cost image requests.
- Add cooldown for repeated failed or blocked prompts.
- Validate image file type, size, and scan metadata before processing.
- Prevent prompt injection from article/video transcripts.
- Use idempotency keys for retries.

## Safety Disclaimers

Responses involving disease, fertilizer, pesticide, chemicals, or plant health must include a Thai safety disclaimer. Price explanations must clearly state that prices are references only, cite source label/date, and must not guarantee sale price.

## Logging Strategy

Record:

- Request type
- Model route
- Provider used
- Credit cost
- Safety level
- Prompt summary, not necessarily raw prompt
- Answer summary
- User/guest ID
- Source route
- Latency and provider status
- Retry/fallback information

Sensitive prompts and images should have privacy and retention rules before production.

## Retry and Fallback Model Strategy

- Retry transient provider errors with a short capped retry policy.
- Fall back from preferred provider to secondary provider only when safety policy can still be applied.
- Never double-charge credits for backend retries.
- If all providers fail, return a graceful message and preserve credits when no answer was produced.

## M09 Frontend Boundary

`src/services/ai/ai-request-planner.ts` builds dry-run request plans only. It returns `canRunLocally: false` and never calls a backend or AI provider.

## M11 Mock Proxy Fixture Boundary

M11 adds `src/services/ai-proxy` as a frontend-only fixture layer. It is not a backend server and does not call network APIs.

Mock functions:

- `askTextQuestion()`
- `analyzePlantImage()`
- `summarizeVideo()`
- `summarizeArticle()`

Each mock response mirrors the future backend contract with:

- `requestId`
- `status`
- `requestType`
- `creditCost`
- `creditValidation`
- `modelPlan`
- `answer` or `result`
- `safetyDisclaimers`
- `warnings`
- `logsPreview`
- `retryable`
- `createdAt`

The mock proxy uses local M08 credit summary for dry-run validation only. It does not deduct credits by itself. `/app/ai` consumes local credits explicitly after a successful mock text response. `/app/analyze` previews 3-credit image analysis validation but does not deduct image-analysis credits in M11.

Future real backend work should preserve this response shape where practical, but must move trusted credit validation, model routing, safety checks, provider calls, logging, and credit deduction to a secure server or Edge Function.

## M12 Plant Image Storage Contract Addendum

Future `POST /api/ai/analyze-plant-image` should not accept raw browser images directly as the trusted long-term contract. The safer flow is:

1. Backend creates an upload intent for private storage.
2. User consents to image processing.
3. Image uploads to a private bucket.
4. Backend validates media, strips metadata, and runs moderation.
5. Backend creates a `plant_analysis_jobs` row.
6. AI proxy analyzes the approved media asset.
7. Backend stores a `plant_analysis_results` row.
8. User can save result to My Farm and later request image deletion.

Related future tables:

- `plant_media`
- `plant_analysis_jobs`
- `plant_analysis_results`

The AI proxy must receive only a backend-owned media reference such as `mediaObjectId` or `imageAssetId`, not a public URL controlled by the client. Signed URLs should be short-lived and issued only after permission checks.

## M13 Adapter Contract

M13 introduces `src/services/ai-proxy/ai-proxy-adapter.ts` as the frontend boundary for AI requests.

Adapter modes:

- `local_fixture`
- `backend_test_disabled`
- `backend_test_ready`
- `production_disabled`

Environment flags:

- `VITE_AI_PROXY_MODE=local_fixture`
- `VITE_ENABLE_AI_BACKEND_PROXY=false`

Rules:

- Default mode is always local fixture.
- Screens call the adapter, not the fixture service directly.
- Backend modes return safe disabled/test-not-ready responses in M13.
- M13 does not call `fetch`.
- Future backend fetch must preserve the M11 response shape where practical.
- Provider keys remain server-side only.

## M14 Local Backend Boundary Prototype

M14 adds an in-process handler that behaves like a backend boundary without being deployed.

Files:

- `src/server/ai-proxy/mock-ai-proxy.types.ts`
- `src/server/ai-proxy/mock-ai-proxy-handler.ts`
- `src/services/ai-proxy/ai-proxy-backend-test-client.ts`

The handler receives:

- backend-style request type
- requested credit cost
- local/guest credit summary snapshot
- session mode
- request metadata

The handler returns:

- credit validation result
- accepted/rejected status
- rejection reason for insufficient credit, safety block, or handler failure
- AI proxy response contract

Flag requirement:

```bash
VITE_AI_PROXY_MODE=backend_test_ready
VITE_ENABLE_AI_BACKEND_PROXY=true
VITE_ENABLE_LOCAL_AI_PROXY_HANDLER=true
```

M14 still performs no real network calls and has no provider keys. A real API route or Supabase Edge Function should replace the in-process handler in a later milestone.
