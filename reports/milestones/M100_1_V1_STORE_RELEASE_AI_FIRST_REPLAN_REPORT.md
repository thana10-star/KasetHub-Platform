# M100.1 V1 Store Release Replan + AI-First Farmer Utility Direction Report

## 1. Summary

M100.1 replans the V1 store/testing release around an AI-first farmer utility direction.

The new V1 framing is: ask AI, check weather, use tools, learn from content, and keep a simple farm notebook. This milestone stayed planning-focused and did not add broad feature systems.

## 2. Files Created

- `docs/release/V1_STORE_RELEASE_AI_FIRST_DIRECTION_M100_1.md`
- `docs/ai/AI_FARMER_ASSISTANT_SAFETY_POLICY_M100_1.md`
- `docs/weather/WEATHER_V1_FOLLOW_UP_AFTER_M100_1.md`
- `docs/content/YOUTUBE_KNOWLEDGE_V1_INTEGRATION_M100_1.md`
- `docs/release/V1_STORE_RELEASE_CHECKLIST_M100_1.md`
- `reports/milestones/M100_1_V1_STORE_RELEASE_AI_FIRST_REPLAN_REPORT.md`

## 3. Files Modified

- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/release/V1_STORE_RELEASE_DIRECTION_M100.md`
- `src/data/mockData.ts`

Build-generated files were refreshed by `npm run build`.

## 4. V1 Direction Summary

V1 is now positioned as a farmer utility app:

- AI farmer assistant
- Weather and agriculture risk
- Simple tools/calculators
- Knowledge from videos/articles
- Basic My Farm/Farm Records notebook

Main promise:

`ถามเรื่องเกษตร เช็กอากาศ ใช้เครื่องมือ และบันทึกฟาร์มง่าย ๆ ในแอพเดียว`

## 5. AI-First UX/Safety Plan

AI should be prominent from Home, bottom nav, Help, and later contextual cards.

Recommended copy:

- `ถาม AI เกษตร`
- `ถามเรื่องพืช ดิน ปุ๋ย โรค แมลง อากาศ และการจัดการฟาร์ม`
- `พิมพ์คำถามของคุณ เช่น ใบเหลืองเกิดจากอะไร หรือควรเตรียมดินก่อนปลูกอย่างไร`

Safety policy created:

- every AI answer should show a safety note
- high-risk topics require caution
- no certainty claims
- no dangerous chemical mixing instructions
- no exact pesticide rates unless framed as user-provided label calculation support
- no medical/legal/loan/tax guarantees

## 6. Weather Follow-up From M100

Weather remains a V1 priority.

M100 confirmed:

- Open-Meteo adapter exists
- Open-Meteo public endpoint does not require an API key
- live weather needs Cloudflare env flags
- fallback/backup data still renders without flags
- no GPS/geolocation or precise location storage is used

M100.1 connects that work into the broader V1 plan and keeps Cloudflare env verification as a release checklist item.

## 7. YouTube/Content Integration Plan

The owner’s agriculture YouTube audience should guide V1.

Recommended feedback prompts:

- what farmers want to ask AI
- what crop problems they see often
- what weather warnings they need
- what calculators they actually use
- whether they would keep a simple farm notebook

No YouTube API, backend feedback system, CMS expansion, or notifications were added.

## 8. Navigation Recommendation

Current bottom nav should stay for now:

- `หน้าแรก`
- `ฟาร์มของฉัน`
- `เครื่องมือ`
- `ถาม AI`
- `โปรไฟล์`

AI is already visible in the bottom nav. The next small UX pass should make Home more AI-first without crowding the page or re-expanding My Farm.

Home priority recommendation:

1. Ask AI
2. Weather
3. Tools
4. My Farm
5. Knowledge/help

## 9. V1 Release Checklist Summary

Checklist created for:

- AI, Weather, Tools, Knowledge, and Basic My Farm readiness
- mobile UI polish
- safety/legal copy
- lint/build/test/route smoke
- Cloudflare env/deploy checks
- later store assets such as icon, screenshots, description, privacy policy, support contact, and wrapper decision

## 10. Small Copy Updates Applied

Home quick-action copy was cleaned without changing routes or layout:

- AI: `ถามเรื่องเกษตรได้ทันที`
- Weather: `เช็กฝน ลม และความเสี่ยง`
- Tools: `ปุ๋ย ระยะปลูก ต้นทุน`

This removes developer/provider wording from the Home quick action while keeping scope small.

## 11. Tests/Checks Run

- `npm run lint` passed.
- `npm run build` passed. This runs `tsc -b`; no separate `npm run typecheck` script exists. Vite reported the existing large chunk warning.
- `npm run test` passed: 35 files, 327 tests.
- `git diff --check` passed with line-ending warnings only.

Route HTTP 200 checks passed:

- `/app`
- `/app/ai`
- `/app/weather`
- `/app/calculators`
- `/app/my-farm`
- `/app/help`
- `/app/profile`

## 12. Known Blockers

- Cloudflare Weather env still needs owner-side verification.
- Real mobile/browser visual QA was not repeated in M100.1.
- Real AI provider execution remains disabled/planned.
- Store assets, privacy policy URL, and support contact still need release preparation.
- Home may need a small future reorder/copy polish to feel more AI-first.

## 13. Next Recommended Milestone

M101 should be a tightly scoped AI-first Home and AI page polish milestone:

- make Home’s first screen emphasize Ask AI, Weather, and Tools
- improve AI prompt examples for real farmers
- add/verify AI answer safety note behavior
- keep My Farm compact and secondary
- do not enable real AI provider calls unless separately approved
