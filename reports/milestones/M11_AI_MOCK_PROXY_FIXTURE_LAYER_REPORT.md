# M11 AI Mock Proxy Fixture Layer Report

## Summary

M11 adds a backend-shaped mock AI proxy fixture layer for KasetHub text AI and plant image analysis. The app can now test request/response contracts, credit validation previews, model routing, safety disclaimers, retryable failures, insufficient-credit states, and image-analysis scenarios without calling real AI providers, backend servers, Supabase, uploads, or network APIs.

## Files Changed

- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/AI_BACKEND_PROXY_CONTRACT.md`
- `docs/AI_CREDIT_AD_UNLOCK_STRATEGY.md`
- `docs/PLANT_IMAGE_ANALYSIS_PIPELINE.md`
- `docs/AI_MOCK_PROXY_FIXTURE_LAYER.md`
- `src/services/ai-proxy/ai-proxy.types.ts`
- `src/services/ai-proxy/ai-proxy-fixtures.ts`
- `src/services/ai-proxy/ai-proxy-mock-service.ts`
- `src/services/ai-credits/ai-credit.types.ts`
- `src/services/ai-credits/ai-credit-service.ts`
- `src/hooks/useAICredits.ts`
- `src/routes/AIPage.tsx`
- `src/routes/AnalyzePage.tsx`
- `reports/milestones/M11_AI_MOCK_PROXY_FIXTURE_LAYER_REPORT.md`

## Mock Proxy Response Notes

The mock proxy supports:

- `askTextQuestion()`
- `analyzePlantImage()`
- `summarizeArticle()`
- `summarizeVideo()`

Responses include:

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

Supported statuses are `success`, `rejected`, `insufficient_credits`, `safety_blocked`, and `failed`.

## Screens Updated

- `/app/ai`
  - Uses `askTextQuestion()` mock proxy responses.
  - Shows request ID, backend-shaped status, credit validation, model plan, answer, safety disclaimers, warnings, logs preview, and retry UI.
  - Consumes local credits only after successful mock validation.
  - Adds a visible “โหมดจำลองสำหรับทดสอบ” selector.
- `/app/analyze`
  - Uses `analyzePlantImage()` mock proxy responses.
  - Shows request ID, 3-credit validation preview, model plan, backend-shaped analysis result, safety copy, and retry/failure states.
  - Keeps image preview local and does not upload or persist raw images.
  - Adds a visible plant fixture scenario selector.

## Credit Validation Notes

- Mock backend validation uses the local M08 AI credit summary.
- The mock proxy does not consume credits by itself.
- Text AI consumes local credits only after a successful mock proxy response.
- Plant image analysis validates 3 credits as a dry-run preview only in M11.
- `consumeCredits(amount)` was added while preserving `consumeCredit()` compatibility.
- Scenario controls can force insufficient-credit responses for UI testing.

## Fixture Scenarios

M11 supports:

- success
- insufficient credits
- safety blocked
- failed retryable
- low confidence
- no plant detected
- blurry image
- safety warning

Plant image fixtures include disease name, crop name, confidence, symptoms, causes, treatment suggestions, urgency, follow-up questions, recommended actions, and expert-consultation guidance.

## Verification Commands

```bash
npm run lint
npm run build
```

Both commands passed.

Manual route checks returned HTTP 200:

- `/app/ai`
- `/app/analyze`
- `/app/ai-credits`
- `/app/analysis-history`
- `/app/profile`
- `/app/memory`

Local dev server used for checks:

- `http://127.0.0.1:5173/app/ai`

## Known Limitations

- No real OpenAI or Gemini API calls
- No real backend server
- No Supabase writes
- No real image upload
- No provider keys
- No network requests
- No trusted production credit enforcement
- No real moderation pipeline
- No real image persistence
- Fixture responses are deterministic demo data

## Next Recommended Milestone

M12 should define the Supabase Storage and image-analysis database schema draft for plant media, including private buckets, signed URL access, moderation status, deletion requests, My Farm media linkage, and backend-owned vision analysis job lifecycle.
