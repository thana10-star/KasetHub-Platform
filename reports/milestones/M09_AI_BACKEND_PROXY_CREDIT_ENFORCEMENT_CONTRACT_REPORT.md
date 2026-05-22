# M09 AI Backend Proxy + Credit Enforcement Contract Report

## Summary

M09 defines KasetHub’s backend-owned AI request architecture without adding real AI calls, provider keys, backend network calls, Supabase writes, or AdMob. The app now has typed AI provider placeholders, request routing, credit cost policy, dry-run request planning, backend proxy contract docs, and agriculture safety policy docs while keeping the M08 local AI credit UX active.

## Files Changed

- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/AI_CREDIT_AD_UNLOCK_STRATEGY.md`
- `docs/SUPABASE_SCHEMA_DRAFT.md`
- `docs/AI_BACKEND_PROXY_CONTRACT.md`
- `docs/AI_AGRICULTURE_SAFETY_POLICY.md`
- `src/services/ai/ai-provider.types.ts`
- `src/services/ai/ai-request.types.ts`
- `src/services/ai/ai-routing-policy.ts`
- `src/services/ai/ai-credit-cost-policy.ts`
- `src/services/ai/ai-request-planner.ts`
- `src/routes/AIPage.tsx`
- `src/routes/AICreditsPage.tsx`
- `src/routes/AnalyzePage.tsx`
- `reports/milestones/M09_AI_BACKEND_PROXY_CREDIT_ENFORCEMENT_CONTRACT_REPORT.md`
- `reports/milestones/m09-ai.png`
- `reports/milestones/m09-ai-credits.png`
- `reports/milestones/m09-analyze.png`
- `reports/milestones/m09-profile.png`
- `reports/milestones/m09-memory.png`

## AI Routing Notes

Provider/model placeholders:

- Gemini Flash-Lite placeholder
- Gemini Flash placeholder
- OpenAI mini placeholder
- Future vision model placeholder

Request routing:

- `normal_text_question` → cheap text model
- `risky_or_complex_question` → stronger text model
- `plant_image_analysis` → vision model
- `video_summary` → summary model
- `article_summary` → summary model
- `price_explanation` → cheap text model plus “ราคาอ้างอิง” disclaimer

`buildAIRequestPlan()` returns the selected model tier, provider candidate, safety level, disclaimers, warnings, estimated backend endpoint, credit cost, and `canRunLocally: false`.

## Credit Policy Notes

Credit cost policy:

- Normal text question = 1 credit
- Risky/complex question = 2 credits
- Image analysis = 3 credits
- Video summary = 2 credits
- Article summary = 1 credit
- Price explanation = 1 credit

M09 only defines policy functions. Real backend enforcement is not implemented yet. The M08 local guest credit system still powers the mock AI UX.

## Backend Proxy Contract Notes

`docs/AI_BACKEND_PROXY_CONTRACT.md` defines future endpoints:

- `POST /api/ai/ask`
- `POST /api/ai/analyze-plant-image`
- `POST /api/ai/summarize-video`
- `POST /api/ai/summarize-article`

The contract covers request payloads, response payloads, credit validation, model routing, provider key storage, rate limiting, abuse prevention, safety disclaimers, logging, retry/fallback strategy, and the rule that provider keys must never be exposed in frontend code.

## Safety Policy Notes

`docs/AI_AGRICULTURE_SAFETY_POLICY.md` defines:

- AI guidance is not guaranteed diagnosis.
- Disease, pesticide, fertilizer, and chemical advice must include safety disclaimers.
- Price advice must use “ราคาอ้างอิง”.
- Dangerous chemical overconfidence should be avoided.
- Local expert confirmation should be encouraged.
- Uploaded image privacy needs consent and deletion controls.
- Unsafe prompts should be blocked or escalated.

## Screens Updated

- `/app/ai`
  - Shows “ระบบเลือกโมเดลอัตโนมัติ”.
  - Shows provider candidate, model tier, estimated backend endpoint, and estimated credit cost.
  - Keeps consuming local M08 credits for mock questions.
  - Adds safety disclaimer under mock answer.
- `/app/ai-credits`
  - Adds “ค่าเครดิตตามประเภทคำถาม”.
  - Shows credit cost rows for normal questions, complex questions, image analysis, video summary, and article summary.
- `/app/analyze`
  - Shows “วิเคราะห์รูปภาพใช้ 3 เครดิตในอนาคต”.
  - Adds AI vision cost and safety copy.

## Verification Commands

```bash
npm run lint
npm run build
```

Both commands passed.

Manual route checks returned HTTP 200:

- `/app/ai`
- `/app/ai-credits`
- `/app/analyze`
- `/app/profile`
- `/app/memory`

Mobile screenshots were captured for the same routes.

## Known Limitations

- No real AI API calls
- No OpenAI or Gemini keys
- No backend calls
- No Supabase writes
- No real AdMob
- No real credit enforcement
- No provider fallback execution
- No uploaded image processing
- M09 routing is a dry-run planner only

## Next Recommended Milestone

M10 should create a test-only AI proxy mock endpoint or local fixture layer behind feature flags. It should prove backend-shaped responses, credit validation results, safety disclaimers, and failure handling without exposing provider keys or calling real AI providers.
