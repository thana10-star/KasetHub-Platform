# M151 Gemini Live Retest + Answer Quality QA / Prompt Strong Fix Report

## Summary

M151 reviews the M150 live retest result and strengthens the Gemini request-builder prompt so the live assistant directly addresses detected crop/problem clues before asking follow-up questions. The change keeps the existing M149 live gates, high-risk input block, timeout wrapper, output validator, and fallback mapper intact.

## CONTEXT.md Read Confirmation

Read `CONTEXT.md` before implementation. Relevant context confirmed:

- AI provider execution must remain backend/server-side.
- Farmer-facing copy should be Thai, practical, and not overly technical.
- Provider secrets must not be exposed, committed, or moved into frontend env.
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
- `reports/milestones/M150*`

No `graphify-out` files were modified.

## Files Created/Modified

Created:

- `docs/ai/AI_GEMINI_LIVE_RETEST_QUALITY_QA_M151.md`
- `reports/milestones/M151_GEMINI_LIVE_RETEST_ANSWER_QUALITY_QA_PROMPT_STRONG_FIX_REPORT.md`

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

## M150 Live Retest Result

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
สวัสดีครับ KasetHub ยินดีช่วยเหลือครับ! เข้าใจว่ากำลังกังวลเรื่องปัญหาพืชอยู่ใช่ไหมครับ เพื่อ...
```

Quality result:

- live connection works
- response is still too generic
- response does not directly address `มันสำปะหลังใบเหลือง`
- response behaves like a clarification flow despite a concrete crop/problem clue

## Root Cause Hypothesis

The M150 request did make the raw question clearer, but the instruction still was not strong enough to override Gemini's tendency to start with a generic assistant greeting and clarification framing. The prompt needed an explicit task block that tells Gemini what crop/problem was detected, what task to answer, and what kind of opening is expected.

Parser and validator behavior did not appear to truncate or suppress the answer. The issue remains primarily prompt/request-shape priority, not endpoint wiring.

## Prompt/Request Builder Changes

Updated `gemini-request-builder.ts` so the Gemini request now uses four user content parts:

1. Direct task block
2. Raw farmer question
3. Detected context
4. Answer instruction

The new direct task block includes:

```text
ตอบคำถามนี้โดยตรง ห้ามตอบว่าคำถามไม่ชัด ถ้ามีคำถามอยู่แล้ว ให้เริ่มด้วยคำแนะนำตรวจเช็กเบื้องต้นทันที
If the user provided a concrete crop/problem clue, do not answer only with clarification questions.
Detected crop: มันสำปะหลัง
Detected problem: ใบเหลือง
Task: ให้คำแนะนำเบื้องต้นว่าใบมันสำปะหลังเหลืองควรเริ่มตรวจอะไร
Required answer opening: "ใบมันสำปะหลังเหลือง ควรเริ่มตรวจ..."
```

The prompt also adds a stricter rule against generic greetings when a concrete farmer question exists.

Answer format for plant-problem questions now targets:

```text
1. ตรวจใบและตำแหน่งที่เหลือง
2. ตรวจน้ำและดิน
3. ตรวจราก/โคนต้น
4. ตรวจแมลงหรือโรค
5. ตรวจธาตุอาหารและอายุพืช
6. ข้อมูลที่ควรถามเพิ่ม
```

## Problem Extraction Changes

Added lightweight problem extraction for common Thai symptom terms:

- `ใบเหลือง`
- `ใบไหม้`
- `ใบร่วง`
- `ต้นแคระ`
- `รากเน่า`
- `โคนเน่า`
- `แมลง`
- `เพลี้ย`
- `เชื้อรา`
- `น้ำขัง`
- `ดินแฉะ`
- `ขาดปุ๋ย`

For the M151 smoke question, the builder detects:

```text
crop: มันสำปะหลัง
cropContextSource: detected_from_question
problem: ใบเหลือง
problemContextSource: detected_from_question
topic: plant_problem
```

This context is prompt-only. It does not claim diagnostic certainty to users.

## Tests Updated

Updated request-builder tests for:

- detecting crop `มันสำปะหลัง`
- detecting problem `ใบเหลือง`
- including a direct task block
- including the direct-answer instruction
- including the no clarification-only rule
- including the required answer opening
- including the six plant-problem answer sections
- excluding secrets and avoiding fetch

Updated live-provider tests for:

- mocked live request body includes crop/problem/direct-answer instructions
- mocked live response remains parsed through the live provider path
- serialized response does not expose the placeholder key

Updated endpoint tests for:

- all live gates true with mocked fetch sends M151 crop/problem context in request body
- high-risk input still blocks before provider fetch
- unsafe mocked output still falls back safely
- `AI_LIVE_ENABLED=false` remains dry-run through existing tests

## Verification Results

Passed:

- `npm run lint`
- `npm run build`
- `npm run test -- functions/api/ai/farmer-assistant.test.ts functions/api/ai/providers/gemini-live-provider.test.ts functions/api/ai/providers/gemini-request-builder.test.ts functions/api/ai/providers/gemini-response-parser.test.ts functions/api/ai/guardrails/output-validator.test.ts functions/api/ai/guardrails/safety-fallbacks.test.ts`
- `git diff --check`

AI-focused tests: 6 files passed, 66 tests passed.

Build note: `npm run build` emitted the existing Vite chunk-size warning. Build-generated changes to `dist/index.html` and `tsconfig.app.tsbuildinfo` were restored so generated/cache artifacts are not part of M151.

`git diff --check` returned success with Windows line-ending warnings only.

Secret-pattern scan found no real `AIza...` or `sk-...` style key in M151-touched files.

## M151 Retest Steps

After deploying M151 and intentionally enabling the existing M149 live gates, run:

```powershell
Invoke-RestMethod `
  -Uri "https://kasethub.pages.dev/api/ai/farmer-assistant" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"question":"ใบมันสำปะหลังเหลืองควรเริ่มตรวจอะไร","topic":"plant_problem","userMode":"guest","clientRequestId":"m151-live-retest"}'
```

Expected:

- `status=ready`
- `provider=gemini`
- `providerMode=live`
- answer mentions `มันสำปะหลัง` or `ใบมันสำปะหลัง`
- answer mentions `ใบเหลือง`
- answer gives first-check steps before follow-up questions
- no chemical dosage
- no fake weather, price, source, or citation claims

## Known Limitations

- M151 does not execute a live Gemini request from this environment.
- Actual answer quality must be confirmed after deployment with the M151 retest prompt.
- Crop/problem extraction is intentionally small and deterministic.
- No memory, RAG, image input, price grounding, or weather grounding was added.
- Daily limits remain non-persistent unless future storage is added.

## Proposed Next Milestone

Recommend: **M152 Gemini Live Retest Result Review + First Public AI Readiness Decision**

M152 should:

- deploy M151
- run the live retest
- record the actual answer
- judge answer quality
- decide whether to keep live enabled, disable live, or do one more prompt refinement
- avoid image AI, memory, RAG, price/weather grounding, and full quota expansion

## Safety Confirmation

M151 did not:

- commit `GEMINI_API_KEY`
- add `VITE_GEMINI_API_KEY`
- expose secrets
- weaken high-risk chemical blocking
- remove live gates
- change unrelated systems
- modify `CONTEXT.md`
- modify `graphify-out`
- add fake weather, price, or source data
