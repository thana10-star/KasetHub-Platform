# AI Backend Fixture States M137

Status: contract fixtures only. These examples are for future backend/UI tests. They are not live AI output and must not be presented as real provider answers.

## Fixture Rules

- Fixtures must not call OpenAI.
- Fixtures must not include real provider keys.
- Fixtures must not pretend to be live provider output.
- `ready` fixtures should use `provider: "mock"`.
- Missing provider configuration should use `provider: "disabled"`.
- Farmer-facing messages should be natural Thai and non-technical.
- Do not include fake live weather, fake prices, fake citations, or fake diagnosis certainty.

## Shared Response Shape

```ts
type FarmerAssistantResponse = {
  status: 'ready' | 'not_configured' | 'rate_limited' | 'blocked' | 'error';
  answer?: string;
  safetyLevel?: 'normal' | 'caution' | 'high_risk';
  followUpQuestions?: string[];
  disclaimers?: string[];
  provider?: 'openai' | 'disabled' | 'mock';
  requestId?: string;
  retryAfterSeconds?: number;
};
```

## ready

Purpose: preview the UI shape for a safe answer. This is not live OpenAI output.

```json
{
  "status": "ready",
  "answer": "ตัวอย่างคำตอบสำหรับทดสอบเท่านั้น: จากอาการที่เล่า อาจเกิดได้จากหลายสาเหตุ ควรเริ่มจากสังเกตดิน น้ำ ใบ และแมลงก่อนสรุป",
  "safetyLevel": "caution",
  "followUpQuestions": [
    "ปลูกพืชชนิดใด",
    "อาการเริ่มเมื่อไร",
    "ช่วงนี้ฝนตกหรือให้น้ำมากไหม"
  ],
  "disclaimers": [
    "นี่เป็นตัวอย่างสำหรับทดสอบสัญญา ไม่ใช่คำตอบจากผู้ให้บริการ AI จริง",
    "คำตอบจริงควรตรวจสอบกับผู้เชี่ยวชาญหรือหน่วยงานเกษตรในพื้นที่ก่อนใช้จริง"
  ],
  "provider": "mock",
  "requestId": "fixture-ready"
}
```

## not_configured

Purpose: backend exists, but provider is not enabled or server-side key is missing.

```json
{
  "status": "not_configured",
  "answer": "ระบบ AI กำลังเตรียมเปิดใช้งาน ตอนนี้ยังดูตัวอย่างคำถามและแนวทางการใช้งานได้",
  "safetyLevel": "normal",
  "followUpQuestions": [],
  "disclaimers": [
    "ยังไม่มีการเรียกผู้ให้บริการ AI จริง"
  ],
  "provider": "disabled",
  "requestId": "fixture-not-configured"
}
```

## rate_limited

Purpose: user/device has reached the current daily limit or cooldown.

```json
{
  "status": "rate_limited",
  "answer": "วันนี้ถามได้ครบตามจำนวนที่กำหนดแล้ว ลองใหม่ภายหลัง",
  "safetyLevel": "normal",
  "followUpQuestions": [],
  "disclaimers": [
    "ระบบจำกัดจำนวนคำถามเพื่อควบคุมค่าใช้จ่ายและให้บริการได้เสถียร"
  ],
  "provider": "disabled",
  "requestId": "fixture-rate-limited",
  "retryAfterSeconds": 3600
}
```

## blocked_high_risk

Purpose: request asks for unsafe chemical, pesticide, human/animal health, legal/financial certainty, or guaranteed outcome advice.

```json
{
  "status": "blocked",
  "answer": "คำถามนี้เสี่ยงต่อความปลอดภัย ควรปรึกษาผู้เชี่ยวชาญหรือหน่วยงานเกษตรในพื้นที่ก่อนตัดสินใจ",
  "safetyLevel": "high_risk",
  "followUpQuestions": [
    "ต้องการให้ช่วยเตรียมรายการข้อมูลสำหรับคุยกับผู้เชี่ยวชาญไหม"
  ],
  "disclaimers": [
    "ไม่ควรผสมหรือใช้สารเคมีโดยไม่มีฉลากจริงและคำแนะนำจากผู้เชี่ยวชาญ"
  ],
  "provider": "disabled",
  "requestId": "fixture-blocked-high-risk"
}
```

## provider_error

Purpose: provider or backend fails after request validation. Do not show raw error.

```json
{
  "status": "error",
  "answer": "ยังตอบคำถามนี้ไม่ได้ ลองใหม่อีกครั้ง",
  "safetyLevel": "normal",
  "followUpQuestions": [],
  "disclaimers": [
    "ระบบไม่แสดงรายละเอียดข้อผิดพลาดทางเทคนิคให้ผู้ใช้เห็น"
  ],
  "provider": "disabled",
  "requestId": "fixture-provider-error"
}
```

## timeout

Purpose: request takes too long.

```json
{
  "status": "error",
  "answer": "ระบบใช้เวลานานเกินไป ลองส่งคำถามอีกครั้ง",
  "safetyLevel": "normal",
  "followUpQuestions": [],
  "disclaimers": [
    "ยังไม่มีคำตอบจากผู้ให้บริการ AI และไม่ควรหักเครดิตถ้าไม่มีคำตอบ"
  ],
  "provider": "disabled",
  "requestId": "fixture-timeout"
}
```

## validation_error

Purpose: request is empty, malformed, or too long. Recommended HTTP status is `400`.

```json
{
  "status": "error",
  "answer": "พิมพ์คำถามให้สั้นลงอีกนิด แล้วลองใหม่",
  "safetyLevel": "normal",
  "followUpQuestions": [],
  "disclaimers": [
    "คำถามต้องไม่ว่างและควรยาวไม่เกิน 1,200 ตัวอักษรใน V1"
  ],
  "provider": "disabled",
  "requestId": "fixture-validation-error"
}
```

## Future Test Expectations

M138 endpoint tests should cover:

- Empty question returns validation error.
- Whitespace-only question returns validation error.
- Too-long question returns validation error.
- Missing provider key returns `not_configured`.
- Rate limit fixture returns `rate_limited` with `retryAfterSeconds`.
- High-risk blocked fixture returns `blocked` and `high_risk`.
- Provider error fixture returns safe user copy only.
- Timeout fixture returns safe user copy only.
- Ready fixture uses `provider: "mock"` until live provider scope is explicitly approved.
- No fixture contains fake live weather, fake prices, fake citations, fake diagnosis certainty, or fake chemical dosage.

