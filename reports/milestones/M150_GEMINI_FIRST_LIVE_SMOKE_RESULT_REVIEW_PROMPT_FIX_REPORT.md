# M150 Gemini First Live Smoke Result Review + Prompt Fix Report

## Summary

M150 reviews the first real Gemini live smoke result and fixes the Gemini request-builder prompt shape that caused Gemini to treat a clear farmer question as unclear. The live safety gates remain unchanged.

## CONTEXT.md Read Confirmation

Read `CONTEXT.md` before implementation. Relevant context confirmed:

- AI is a priority feature but must stay backend/server-side for provider execution.
- Farmer-facing copy should be Thai, practical, and not technical.
- Provider secrets must not be exposed or committed.
- Graphify context must be read before editing.
- `CONTEXT.md`, `graphify-out`, generated/cache files, and secrets must not be modified or committed.

## Graphify Pre-Check Result

Read:

- `graphify-out/.graphify_analysis.json`
- `graphify-out/graph.json`

Graphify confirmed the relevant AI dependency cluster around:

- `functions/api/ai/farmer-assistant.ts`
- `functions/api/ai/providers/*`
- `functions/api/ai/guardrails/*`
- `docs/ai/*`
- `reports/milestones/M149*`

No `graphify-out` files were modified.

## Files Created/Modified

Created:

- `docs/ai/AI_GEMINI_FIRST_LIVE_RESULT_REVIEW_M150.md`
- `reports/milestones/M150_GEMINI_FIRST_LIVE_SMOKE_RESULT_REVIEW_PROMPT_FIX_REPORT.md`

Modified:

- `functions/api/ai/providers/gemini-request-builder.ts`
- `functions/api/ai/providers/gemini-request-builder.test.ts`
- `functions/api/ai/providers/gemini-live-provider.test.ts`
- `functions/api/ai/farmer-assistant.test.ts`

Unmodified by design:

- `CONTEXT.md`
- `graphify-out/*`
- `/app/ai` UI files
- Community, Weather, Prices, YouTube, Supabase, and auth code

## First Live Smoke Result

Production returned:

```text
status: ready
provider: gemini
providerMode: live
```

Question:

```text
ใบมันสำปะหลังเหลืองควรเริ่มตรวจอะไร
```

Observed issue:

```text
ตอนนี้ทางเรายังไม่ได้รับคำถามที่ชัดเจนนะครับ...
```

Expected behavior:

- recognize this as a clear plant-problem question
- answer with practical first checks for cassava yellow leaves
- ask follow-up questions only after giving safe initial guidance

## Root Cause Hypothesis

The request builder sent the question, but the prompt did not strongly prioritize direct answering before follow-up questions. The previous instruction told the model to ask for missing crop/province/symptoms when information was incomplete, which likely caused Gemini to over-clarify even though the farmer question was clear.

The parser and output validator did not appear to suppress the question. The issue is most likely prompt/request-shape priority.

## Prompt/Request Builder Fix

Updated `gemini-request-builder.ts` so the request clearly separates:

- system instruction
- farmer question
- detected context
- answer instruction

The farmer question is now its own short Gemini content part:

```text
Farmer question / คำถามเกษตรกรที่ต้องตอบโดยตรง:
ใบมันสำปะหลังเหลืองควรเริ่มตรวจอะไร
```

The answer instruction now explicitly says:

- answer the farmer question directly first
- do not say the question is unclear or missing when the farmer question has text
- if crop/province/age/symptom details are missing, still provide safe first-check steps first, then ask follow-up questions

System output format now targets:

```text
1. สิ่งที่ควรตรวจเช็กก่อน
2. สาเหตุที่พบบ่อย
3. วิธีเริ่มแก้แบบปลอดภัย
4. ข้อมูลที่ควรถามเพิ่ม
```

## Optional Crop Extraction

Added lightweight crop extraction for common Thai crop names:

- `มันสำปะหลัง`
- `ข้าว`
- `ทุเรียน`
- `มะม่วง`
- `พริก`
- `ยางพารา`
- `อ้อย`
- `ข้าวโพด`

For the smoke question, the builder detects:

```text
crop: มันสำปะหลัง
cropContextSource: detected_from_question
province: not provided
```

Provided crop context still wins over detected crop context. The detector is only optional prompt context and does not claim certainty to users.

## Tests Updated

Updated request-builder tests for:

- exact user question text appears clearly in its own prompt part
- question is not buried only inside a long instruction block
- topic context is included
- cassava crop is derived from `ใบมันสำปะหลังเหลืองควรเริ่มตรวจอะไร`
- direct-answer-first instruction is present
- no secrets are included and no fetch is called

Updated live-provider tests for:

- mocked cassava yellow-leaf response parses cleanly
- serialized response does not include the placeholder key
- `providerMode` remains `live` only in mocked live-adapter tests

Updated endpoint tests for:

- with all live gates true and mocked fetch, the M150 question reaches the request body clearly
- high-risk input still blocks before provider fetch
- unsafe output still fallback-blocks
- `AI_LIVE_ENABLED=false` remains dry-run through existing tests

## Verification Results

Passed:

- `npm run lint`
- `npm run build`
- `npm run test -- functions/api/ai/farmer-assistant.test.ts functions/api/ai/providers/gemini-live-provider.test.ts functions/api/ai/providers/gemini-request-builder.test.ts functions/api/ai/providers/gemini-response-parser.test.ts functions/api/ai/guardrails/output-validator.test.ts functions/api/ai/guardrails/safety-fallbacks.test.ts`
- `git diff --check`

AI-focused tests: 6 files passed, 66 tests passed.

Build note: `npm run build` emitted the existing Vite chunk-size warning. Build-generated changes to `dist/index.html` and `tsconfig.app.tsbuildinfo` were restored so generated/cache artifacts are not part of M150.

`git diff --check` returned success with Windows line-ending warnings only.

Secret-pattern scan found no real `AIza...` or `sk-...` style key in M150-touched files.

Early targeted check passed:

- `npm run test -- functions/api/ai/providers/gemini-request-builder.test.ts functions/api/ai/providers/gemini-live-provider.test.ts functions/api/ai/farmer-assistant.test.ts`

## Retest Steps

After deploying M150 and intentionally enabling the M149 live gates, run:

```powershell
Invoke-RestMethod `
  -Uri "https://kasethub.pages.dev/api/ai/farmer-assistant" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"question":"ใบมันสำปะหลังเหลืองควรเริ่มตรวจอะไร","topic":"plant_problem","userMode":"guest","clientRequestId":"m150-live-retest"}'
```

Expected:

- `status=ready`
- `provider=gemini`
- `providerMode=live`
- answer directly addresses cassava yellow leaves
- first-check steps appear before follow-up questions
- no chemical dosage
- no fake weather, price, source, or citation claims

## Known Limitations

- M150 does not execute a new live Gemini request from this environment.
- The actual quality improvement must be confirmed after deployment with the M150 retest prompt.
- Crop extraction is intentionally small and only covers common Thai crop names.
- No memory, RAG, image input, price grounding, or weather grounding was added.
- Daily limits remain non-persistent unless future storage is added.

## Proposed Next Milestone

Recommend: **M151 Gemini Live Retest + Answer Quality QA**

M151 should:

- deploy M150
- run the same live retest
- record the real answer
- evaluate quality, safety, Thai wording, and follow-up behavior
- decide whether to keep live enabled or disable after test
- avoid image AI, memory, RAG, and price/weather grounding expansion

## Safety Confirmation

M150 did not:

- commit `GEMINI_API_KEY`
- add `VITE_GEMINI_API_KEY`
- expose secrets
- weaken high-risk chemical blocking
- remove live gates
- change unrelated systems
- modify `CONTEXT.md`
- modify `graphify-out`
- add fake weather, price, or source data
