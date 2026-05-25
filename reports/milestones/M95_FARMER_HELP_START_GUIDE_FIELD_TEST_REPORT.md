# M95 Farmer Help Start Guide + Field-Test Feedback Report

## 1. Summary

M95 adds a lightweight farmer start guide and static/local field-test checklist.

The work helps first-time and elderly farmers understand what to tap first, how to begin using My Farm and Farm Records, and how the team can observe real user testing without backend writes or personal-data collection.

## 2. Files Created

- `src/routes/HelpPage.tsx`
- `src/routes/FieldTestFeedbackPage.tsx`
- `docs/ux/FARMER_START_GUIDE_AND_FIELD_TEST_M95.md`
- `reports/milestones/M95_FARMER_HELP_START_GUIDE_FIELD_TEST_REPORT.md`

## 3. Files Modified

- `src/app/App.tsx`
- `src/types/kaset.ts`
- `src/routes/ProfilePage.tsx`
- `src/routes/AppHomePage.tsx`
- `src/routes/MyFarmPage.tsx`
- `src/routes/ProfilePage.test.tsx`
- `src/services/qa/route-registry.ts`
- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/MY_FARM_HUB_FOUNDATION.md`
- `docs/ux/ELDER_FRIENDLY_SETTINGS_POLISH_M94.md`

## 4. Farmer Start Guide Behavior

`/app/help` renders `วิธีเริ่มใช้ KasetHub` with short Thai-first cards:

- `เริ่มจาก “ฟาร์มของฉัน”`
- `บันทึกงานในฟาร์ม`
- `บันทึกรายรับรายจ่าย`
- `ดูต้นทุน กำไร และผลผลิต`
- `ใช้เครื่องมือ / ถาม AI / เช็กอากาศ`

It links to `/app/my-farm`, `/app/farm-records`, `/app/calculators`, `/app/ai`, and `/app/weather`.

## 5. Profile/Help Integration

Profile `วิธีใช้แอพ` now links to `/app/help`.

`ภาษา` remains a placeholder, and `ติดต่อทีมงาน` remains a placeholder. No real language switching or support channel was added.

## 6. My Farm Helper Behavior

`/app/my-farm` now has a compact helper card titled `เริ่มบันทึกฟาร์มของคุณ`.

It explains: `เริ่มจากเพิ่มแปลง บันทึกงาน รายรับรายจ่าย และผลผลิต`.

Actions:

- `เปิดสมุดฟาร์ม` -> `/app/farm-records`
- `ดูวิธีใช้` -> `/app/help`

Home also has a small `เริ่มใช้แอพ` card linking to `/app/help` without changing the compact Home Farm Hub.

## 7. Field-test Feedback Behavior

`/app/field-test-feedback` is a static/local checklist for observing field testing with farmers or elderly users.

It includes:

- ผู้ทดสอบเข้าใจหน้าแรกไหม
- หา “ฟาร์มของฉัน” เจอไหม
- กดเพิ่มกิจกรรมได้ไหม
- กดเพิ่มรายรับรายจ่ายได้ไหม
- ตัวหนังสืออ่านง่ายไหม
- เมนูล่างเข้าใจไหม
- จุดที่ผู้ใช้สับสน
- ข้อเสนอแนะ
- คะแนนความง่าย 1-5

No backend submission and no localStorage feedback key were added.

## 8. Privacy/Local-only Feedback Boundary

The feedback page warns:

- Do not enter real names.
- Do not enter phone numbers.
- Do not enter addresses or personal details.
- Use the page only for observation notes during testing.

No Supabase read/write, backend feedback submission, support chat, notification, or cloud sync path was added.

## 9. Tests/Checks Run

- `npm run lint` passed.
- `npm run build` passed. This runs `tsc -b`; no separate `npm run typecheck` script exists. Vite reported the existing large chunk warning.
- `npm run test` passed: 33 test files, 315 tests.
- `npm run test -- ProfilePage` passed during development: 7 tests.
- `git diff --check` passed with line-ending warnings only.

## 10. Manual Verification Result

Dev server was already running at `http://127.0.0.1:5173`.

HTTP 200 checks passed:

- `/app/help`
- `/app/profile`
- `/app`
- `/app/my-farm`
- `/app/farm-records`
- `/app/field-test-feedback`

The Browser connector was unavailable again (`agent.browsers.list()` returned `[]`), so visual/mobile overflow and console-error verification could not be completed in the in-app browser. Automated render tests and HTTP route checks were used as the fallback verification path.

## 11. Known Limitations

- The help guide is intentionally lightweight, not a full help center.
- Field-test feedback is static/local only and does not persist notes.
- No real support contact, chat, or ticket flow exists.
- No language switching was implemented.
- No Farm Records storage/schema/backend behavior changed.

## 12. Next Recommended Milestone

M96 should use real field-test observations to prioritize one small usability fix set, such as simplifying the first Farm Records create flow or improving the wording around activity, income/expense, and harvest entry.
