# M101 AI-First Home + AI Farmer Assistant UX Polish Report

## 1. Summary

M101 makes KasetHub feel more AI-first for V1 without enabling a new provider or adding backend systems.

Home now presents `ถาม AI เกษตร` as a clear primary entry, `/app/ai` is more farmer-facing with prompt examples and fallback guidance, and the standard AI safety note is shown around answer/fallback areas.

## 2. Files Created

- `src/services/ai/ai-farmer-assistant-copy.ts`
- `src/routes/AIPage.test.tsx`
- `docs/ai/AI_FARMER_ASSISTANT_UX_M101.md`
- `reports/milestones/M101_AI_FIRST_HOME_FARMER_ASSISTANT_UX_POLISH_REPORT.md`

## 3. Files Modified

- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/ai/AI_FARMER_ASSISTANT_SAFETY_POLICY_M100_1.md`
- `docs/release/V1_STORE_RELEASE_AI_FIRST_DIRECTION_M100_1.md`
- `docs/ux/FARMER_START_GUIDE_AND_FIELD_TEST_M95.md`
- `src/routes/AIPage.tsx`
- `src/routes/AppHomePage.tsx`
- `src/routes/AppHomePage.test.tsx`
- `src/routes/HelpPage.tsx`

Build-generated files were refreshed by `npm run build`.

## 4. AI Route Audit Result

`/app/ai` remains a farmer-facing AI assistant surface, but real provider execution is still not enabled by default.

The page now avoids presenting backend/proxy details as the main user experience. Provider/status/scenario controls remain available under `ข้อมูลเพิ่มเติม / สำหรับทีมงาน`.

## 5. Home AI-first Behavior

`/app` now shows a prominent `ถาม AI เกษตร` card near the top of Home.

The card explains that users can ask about:

- พืช
- ดิน
- ปุ๋ย
- โรค
- แมลง
- อากาศ
- การจัดการฟาร์ม

It links to `/app/ai` with `ถาม AI ตอนนี้` and includes short example chips such as `ใบเหลืองเกิดจากอะไร` and `เตรียมดินก่อนปลูกยังไง`.

My Farm, Weather, and Tools remain available without re-expanding Home or making the first screen crowded.

## 6. AI Page UX Behavior

`/app/ai` now uses the title `ถาม AI เกษตร` and a practical Thai-first description.

The input area uses:

- Placeholder: `พิมพ์คำถาม เช่น ใบมะนาวเหลืองเกิดจากอะไร`
- Button: `ถาม AI`

Prompt examples include:

- `ใบเหลืองเกิดจากอะไร`
- `ดินแข็งควรปรับปรุงยังไง`
- `ควรเตรียมดินก่อนปลูกข้าวโพดยังไง`
- `ฝนตกหลายวันต้องระวังอะไร`
- `ปุ๋ย 15-15-15 ใช้ต่างจาก 46-0-0 ยังไง`
- `แมลงกินใบควรเริ่มตรวจยังไง`

If AI is not enabled, the page shows a calm fallback state: `ระบบ AI กำลังเตรียมเปิดใช้งาน`.

## 7. Safety Note Behavior

Shared AI copy now lives in `src/services/ai/ai-farmer-assistant-copy.ts`.

The standard safety note is rendered near answer/fallback areas:

`คำตอบจาก AI อาจมีข้อผิดพลาด ควรตรวจสอบกับผู้เชี่ยวชาญ เจ้าหน้าที่เกษตร ฉลากสินค้า หรือแหล่งข้อมูลที่เชื่อถือได้ก่อนนำไปใช้จริง โดยเฉพาะเรื่องสารเคมี ปุ๋ย โรคพืช และความปลอดภัย`

Chemical/pesticide-related prompts can also show stronger caution copy:

`เรื่องสารเคมีควรตรวจฉลากจริงและคำแนะนำเจ้าหน้าที่ก่อนใช้เสมอ`

No certainty claims or unsafe pesticide dosage recommendations were added.

## 8. Advanced/Internal AI Link Behavior

AI proxy status, scenario controls, and internal/testing actions are grouped under `ข้อมูลเพิ่มเติม / สำหรับทีมงาน`.

Normal farmers first see the question box, examples, safety note, and fallback state rather than backend architecture or provider status.

## 9. Help Integration

`/app/help` now includes a `ถาม AI เกษตร` section.

It explains what farmers can ask, links to `/app/ai`, and repeats the safety boundary in short Thai copy.

## 10. Tests/Checks Run

- `npm run test -- AIPage AppHomePage ProfilePage` passed: 3 files, 14 tests.
- `npm run lint` passed.
- `npm run build` passed on rerun. This runs `tsc -b`; no separate `npm run typecheck` script exists. Vite reported the existing large chunk warning.
- `npm run test` passed: 36 files, 330 tests.
- `git diff --check` passed with line-ending warnings only.

Route HTTP 200 checks passed:

- `/app`
- `/app/ai`
- `/app/help`
- `/app/weather`
- `/app/calculators`
- `/app/my-farm`
- `/app/profile`

## 11. Known Limitations

- Real AI provider execution remains disabled/planned.
- No API keys or backend AI provider integration were added.
- Browser connector was unavailable again (`agent.browsers.list()` returned `[]`), so in-app mobile screenshot, horizontal-overflow, and console-error verification could not be completed from Codex.
- Store packaging, icon/screenshot preparation, and production AI provider approval remain future release work.

## 12. Next Recommended Milestone

M102 should stay tightly scoped around V1 release readiness:

- owner-side mobile screenshot QA for Home and AI
- final AI safety note placement review
- Cloudflare/Weather env verification
- app icon/store copy preparation
- no broad backend, sync, GPS, OCR, notification, or Farm Records schema work unless separately approved
