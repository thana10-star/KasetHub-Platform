# AI Gemini Prompt Payload Hardening M153

Status: implementation and retest guide for the Gemini Flash prompt-quality issue.

## Live Issue Evidence

M152 debug showed the live path reached Gemini and passed KasetHub guardrails:

```text
model: gemini-2.5-flash
status: ready
provider: gemini
providerMode: live
debug.stage: success
debug.reasonCodes: success_live_validated
```

The answer still stayed generic:

```text
ควรเริ่มตรวจว่าพืชมีอาการผิดปกติอย่างไรบ้างครับ...
```

The `gemini-2.5-pro` comparison returned `provider_timeout` under the current timeout, so M153 focuses on hardening the Flash payload first. The M152 debug result means this is not primarily a parser, validator, or fallback-mapper failure for Flash.

## Why Parser And Validator Are Not The Main Issue

The successful M152 trace means:

- Gemini returned text.
- The response parser found usable answer text.
- The provider timeout wrapper did not fire.
- The output validator allowed the answer.
- The fallback mapper did not replace the answer.

The weak answer was therefore model behavior caused by insufficiently explicit prompt/payload structure.

## Why Model Switch Alone Is Not Enough

`gemini-2.5-pro` may need a longer provider timeout before it can be judged fairly. Switching models without hardening the request payload could hide the same prompt ambiguity or introduce higher latency/cost. M153 makes the Flash payload more explicit before deciding whether to keep Flash, add quality fallback, or retest another model.

## Structured Payload Shape

The first Gemini user part now uses a compact task block:

```text
TASK_TYPE: farmer_advice_direct_answer
MUST_ANSWER_DIRECTLY: true
LANGUAGE: th
QUESTION: ใบมันสำปะหลังเหลืองควรเริ่มตรวจอะไร
DETECTED_CROP: มันสำปะหลัง
DETECTED_CROP_SOURCE: detected_from_question
DETECTED_PROBLEM: ใบเหลือง
DETECTED_PROBLEM_SOURCE: detected_from_question
TOPIC: plant_problem
PROVINCE: not_provided
USER_MODE: guest

INSTRUCTION:
- Start by answering the QUESTION directly.
- Do not open with generic greeting.
- Do not say the question is unclear.
- Do not only ask follow-up questions.
- Because DETECTED_CROP and DETECTED_PROBLEM are present, give safe first-check steps immediately.
- Ask follow-up questions only at the end.
- If QUESTION is non-empty and DETECTED_CROP or DETECTED_PROBLEM exists, never respond as if no question was provided.
- Avoid generic openings such as "สวัสดีครับ KasetHub ยินดีช่วยเหลือ", "คุณกำลังกังวลเรื่องปัญหาพืชใช่ไหม", or "คำถามยังไม่ชัด".

REQUIRED_OPENING:
ใบมันสำปะหลังเหลือง ควรเริ่มตรวจ...

TASK: ให้คำแนะนำเบื้องต้นว่าใบมันสำปะหลังเหลืองควรเริ่มตรวจอะไร
```

The raw farmer question is still repeated in its own prompt part so it is not buried inside a long instruction block.

## Required Answer Outline

For plant-problem questions with crop/problem context, the request now reinforces this outline:

```text
1. ตรวจตำแหน่งใบเหลือง
2. ตรวจน้ำและสภาพดิน
3. ตรวจรากและโคนต้น
4. ตรวจแมลง/เพลี้ย/โรค
5. ตรวจธาตุอาหารและอายุพืช
6. คำถามที่ควรถามเพิ่ม
```

Safety rules remain unchanged:

- no chemical dosage certainty
- no dangerous chemical mixing instructions
- no guaranteed diagnosis, yield, profit, or cure
- no fake live weather, price, source, or citation claims
- follow-up questions only after first-check guidance

## Retest Command

Run only after deploy and only with owner-controlled Gemini live gates:

```powershell
$response = Invoke-RestMethod `
  -Uri "https://kasethub.pages.dev/api/ai/farmer-assistant" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"question":"ใบมันสำปะหลังเหลืองควรเริ่มตรวจอะไร","topic":"plant_problem","userMode":"guest","clientRequestId":"m153-live-retest"}'

$response | ConvertTo-Json -Depth 12
```

## Pass Criteria

- `provider=gemini`
- `providerMode=live`
- `debug.stage=success` if `AI_DEBUG_RESPONSE=true`
- answer mentions `มันสำปะหลัง`
- answer mentions `ใบเหลือง`
- answer gives first-check steps before follow-up questions
- answer does not start with a generic greeting
- no chemical dosage
- no fake weather, price, source, or citation claims

## Fail Criteria

- answer begins with a generic greeting or generic concern check
- answer says the question is unclear despite the question being present
- answer asks only follow-up questions before giving first-check steps
- answer omits both `มันสำปะหลัง` and `ใบเหลือง`
- answer includes unsafe chemical dosage or fake live data

## Rollback Reminder

If the retest still fails quality or safety expectations, keep the live gates controlled and rollback by setting:

```text
AI_LIVE_ENABLED=false
AI_ALLOW_LIVE_EXECUTION=false
```

Then run the dry-run smoke test again.
