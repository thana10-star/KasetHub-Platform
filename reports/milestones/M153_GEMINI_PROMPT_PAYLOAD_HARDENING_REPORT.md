# M153 Gemini Prompt Payload Hardening Report

## Summary

M153 hardens the Gemini Flash request payload so the farmer assistant has a clearer direct-answer task for concrete crop/problem questions. The payload now sends a compact structured block with `QUESTION`, detected crop/problem, topic, province, user mode, direct-answer instructions, and a required opening for the cassava yellow-leaf smoke prompt.

No live provider call was made during this milestone. All verification used local build/test commands and mocked/no-network provider tests.

## CONTEXT.md Read Confirmation

Read `CONTEXT.md` before implementation. Relevant project context confirmed:

- AI provider execution must stay backend/server-side.
- The farmer assistant should answer in Thai with practical, farmer-friendly wording.
- Provider secrets must not be exposed or committed.
- Safety gates and high-risk chemical blocking must remain in place.
- `CONTEXT.md`, `graphify-out`, generated/cache files, and secrets must not be modified or committed.

## Graphify Pre-Check Result

Read:

- `graphify-out/.graphify_analysis.json`
- `graphify-out/graph.json`

Graphify confirmed the relevant AI cluster around:

- `functions/api/ai/farmer-assistant.ts`
- `functions/api/ai/providers/*`
- `functions/api/ai/guardrails/*`
- `docs/ai/*`
- `reports/milestones/*`

No `graphify-out` files were modified.

## Files Created/Modified

Created:

- `docs/ai/AI_GEMINI_PROMPT_PAYLOAD_HARDENING_M153.md`
- `reports/milestones/M153_GEMINI_PROMPT_PAYLOAD_HARDENING_REPORT.md`

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

## Live Evidence Summary

M152 debug showed:

```text
model: gemini-2.5-flash
status: ready
provider: gemini
providerMode: live
debug.stage: success
debug.reasonCodes: success_live_validated
```

But the answer still stayed generic:

```text
ควรเริ่มตรวจว่าพืชมีอาการผิดปกติอย่างไรบ้างครับ...
```

The `gemini-2.5-pro` test returned `provider_timeout` with current timeout settings. That points to prompt/payload quality as the immediate Flash issue, while Pro timeout tuning remains a later decision.

## Prompt Payload Hardening Summary

Updated `gemini-request-builder.ts` so the first user part is now a structured direct-answer task block:

```text
TASK_TYPE: farmer_advice_direct_answer
MUST_ANSWER_DIRECTLY: true
LANGUAGE: th
QUESTION: ใบมันสำปะหลังเหลืองควรเริ่มตรวจอะไร
DETECTED_CROP: มันสำปะหลัง
DETECTED_PROBLEM: ใบเหลือง
TOPIC: plant_problem
PROVINCE: not_provided
USER_MODE: guest
REQUIRED_OPENING:
ใบมันสำปะหลังเหลือง ควรเริ่มตรวจ...
```

The raw farmer question remains in its own prompt part so it is visible separately from instructions.

## Generic-Answer Prevention Summary

Strengthened system and user instructions to prevent:

- generic greetings such as `สวัสดีครับ KasetHub ยินดีช่วยเหลือ`
- generic concern checks such as `คุณกำลังกังวลเรื่องปัญหาพืชใช่ไหม`
- saying the question is unclear when a non-empty question exists
- clarification-only answers when crop/problem context exists

For plant-problem answers, the requested outline now uses:

```text
1. ตรวจตำแหน่งใบเหลือง
2. ตรวจน้ำและสภาพดิน
3. ตรวจรากและโคนต้น
4. ตรวจแมลง/เพลี้ย/โรค
5. ตรวจธาตุอาหารและอายุพืช
6. คำถามที่ควรถามเพิ่ม
```

## Optional Quality Guard Summary

No new runtime quality fallback was added in M153. The M152 debug evidence showed provider success and validator success, so this milestone keeps the runtime behavior stable and focuses on payload hardening first. If Flash remains generic after retest, M154 should decide whether to add a quality fallback or switch/tune model settings.

## Tests Updated

Updated no-network tests for:

- request builder structured payload fields
- exact question preservation
- `DETECTED_CROP=มันสำปะหลัง`
- `DETECTED_PROBLEM=ใบเหลือง`
- required opening guidance
- generic greeting/clarification-only prevention
- required plant-problem outline
- live provider mocked request body shape
- endpoint mocked live request body shape
- high-risk and existing guardrail behavior remaining covered by existing tests

## Verification Results

Passed:

- `npm run test -- functions/api/ai/providers/gemini-request-builder.test.ts functions/api/ai/providers/gemini-live-provider.test.ts functions/api/ai/farmer-assistant.test.ts`
- `npm run lint`
- `npm run build`
- `npm run test -- functions/api/ai/farmer-assistant.test.ts functions/api/ai/providers/gemini-live-provider.test.ts functions/api/ai/providers/gemini-request-builder.test.ts functions/api/ai/providers/gemini-response-parser.test.ts functions/api/ai/guardrails/output-validator.test.ts functions/api/ai/guardrails/safety-fallbacks.test.ts`
- `git diff --check`

AI-focused test result:

- 6 files passed
- 74 tests passed

Focused builder/live/endpoint pre-check:

- 3 files passed
- 55 tests passed

Build note: `npm run build` emitted the existing Vite chunk-size warning. Build-generated changes to `dist/index.html` and `tsconfig.app.tsbuildinfo` were restored so generated/cache artifacts are not part of M153.

`git diff --check` returned success with Windows line-ending warnings only.

Secret-pattern scan found no real provider key value and no backend or frontend provider secret value in M153-touched diffs.

## Retest Steps

After deploying M153, run:

```powershell
$response = Invoke-RestMethod `
  -Uri "https://kasethub.pages.dev/api/ai/farmer-assistant" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"question":"ใบมันสำปะหลังเหลืองควรเริ่มตรวจอะไร","topic":"plant_problem","userMode":"guest","clientRequestId":"m153-live-retest"}'

$response | ConvertTo-Json -Depth 12
```

Pass criteria:

- `provider=gemini`
- `providerMode=live`
- `debug.stage=success` if debug is enabled
- answer mentions `มันสำปะหลัง`
- answer mentions `ใบเหลือง`
- answer gives first-check steps before follow-up questions
- answer does not start with a generic greeting
- no chemical dosage
- no fake weather, price, source, or citation claims

## Known Limitations

- M153 did not run a real Gemini call from this environment.
- M153 did not change model timeout settings for `gemini-2.5-pro`.
- M153 did not add image AI, memory, RAG, price/weather grounding, billing, or persistent quotas.
- M153 did not add a runtime quality fallback; that remains an M154 decision if Flash still responds generically.

## Proposed Next Milestone

Recommend: **M154 Gemini Live Retest + Decision: Keep Flash, Switch Model, or Add Quality Fallback**

M154 should:

- deploy M153
- run `m153-live-retest`
- evaluate the actual answer
- keep `gemini-2.5-flash` if Flash now passes
- consider a quality fallback or model switch with longer timeout if Flash remains generic
- keep scope limited and avoid image AI, memory, RAG, or price/weather grounding

## Safety Confirmation

M153 did not:

- commit a Gemini provider key value
- add a frontend provider key
- expose secrets
- weaken high-risk chemical blocking
- change live gates
- make a real Gemini/OpenAI/provider call during tests or build
- change unrelated systems
- modify `CONTEXT.md`
- modify `graphify-out`
- add fake weather, price, source, or citation data
