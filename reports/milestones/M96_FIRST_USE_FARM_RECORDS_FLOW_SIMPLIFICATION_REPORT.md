# M96 First-Use Farm Records Flow Simplification Report

## 1. Summary

M96 simplifies the first-use Farm Records experience for elderly and non-technical farmers.

The work makes the path clearer across My Farm, Farm Records, Help, and Field-test Feedback:

1. เพิ่มแปลง
2. บันทึกงานในฟาร์ม
3. บันทึกรายรับรายจ่าย
4. บันทึกผลผลิต

No Farm Records storage/schema, Supabase, sync, GPS, AI processing, upload, OCR, notification, or backend behavior was added.

## 2. Files Created

- `docs/ux/FIRST_USE_FARM_RECORDS_FLOW_M96.md`
- `reports/milestones/M96_FIRST_USE_FARM_RECORDS_FLOW_SIMPLIFICATION_REPORT.md`

## 3. Files Modified

- `src/routes/FarmRecordsDebugPage.tsx`
- `src/routes/farm-records-page-model.ts`
- `src/routes/MyFarmPage.tsx`
- `src/routes/HelpPage.tsx`
- `src/routes/FieldTestFeedbackPage.tsx`
- `src/routes/FarmRecordsDebugPage.test.tsx`
- `src/routes/ProfilePage.test.tsx`
- `src/routes/MyFarmPage.test.tsx`
- `src/routes/AppHomePage.test.tsx`
- `src/services/qa/route-registry.ts`
- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/MY_FARM_HUB_FOUNDATION.md`
- `docs/ux/FARMER_START_GUIDE_AND_FIELD_TEST_M95.md`

## 4. My Farm First-use Guide Behavior

`/app/my-farm` now shows a compact card titled `เริ่มใช้ฟาร์มของฉัน`.

It explains: `เริ่มจากเพิ่มแปลง แล้วค่อยบันทึกงาน รายรับรายจ่าย และผลผลิต`.

It shows the 4 steps and keeps the actions:

- `เปิดสมุดฟาร์ม` -> `/app/farm-records`
- `ดูวิธีใช้` -> `/app/help`

## 5. Farm Records Empty State Behavior

`/app/farm-records` now includes a compact first-use path card and starts the action order with `เพิ่มแปลง`.

Empty-state copy was simplified:

- No plots: `ยังไม่มีแปลง` / `เริ่มจากเพิ่มแปลงของคุณก่อน`
- No farm work: `ยังไม่มีบันทึกงานในฟาร์ม`
- No income/expense: `ยังไม่มีรายรับรายจ่าย`
- No harvest: `ยังไม่มีข้อมูลผลผลิต`

Buttons use simple labels: `เพิ่มแปลง`, `เพิ่มกิจกรรม`, `เพิ่มเงิน`, and `เพิ่มผลผลิต`.

## 6. Form Copy Simplification

Create forms keep the same data fields and local service paths.

Labels are now more Thai-first and less intimidating:

- `แปลง`
- `รอบปลูก`
- `งานในฟาร์ม`
- `รายรับรายจ่าย`
- `ผลผลิต`
- `ผู้ซื้อ/ร้านค้า`
- `สิ่งที่ใช้ เช่น ปุ๋ย ยา เมล็ดพันธุ์`
- `ปริมาณที่ใช้`
- `หมายเหตุ`

Required fields use `(จำเป็น)`. Optional fields use `(ถ้ามี)`.

## 7. Help/Field-test Checklist Updates

`/app/help` adds `เริ่มบันทึกฟาร์ม 4 ขั้นตอน` and links to `/app/my-farm` and `/app/farm-records`.

`/app/field-test-feedback` now includes first-use observation questions about starting from plots, understanding `บันทึกงานในฟาร์ม`, understanding `เพิ่มเงิน`, finding `เพิ่มผลผลิต`, and knowing required vs optional fields.

The feedback surface remains static/local only with no backend submission and no personal-data collection.

## 8. Elder-friendly/Mobile Readability Behavior

- My Farm helper stays compact and below the local-data warning.
- Farm Records first-use card uses short text, step cards, and large action buttons.
- Empty states use direct next-action copy.
- Thai text is short and designed to wrap safely.
- Bottom nav remains unchanged with `ฟาร์มของฉัน`.

## 9. Tests/Checks Run

- `npm run lint` passed.
- `npm run build` passed. This runs `tsc -b`; no separate `npm run typecheck` script exists. Vite reported the existing large chunk warning.
- `npm run test` passed: 33 test files, 317 tests.
- Focused route tests passed: `npm run test -- FarmRecordsDebugPage ProfilePage MyFarmPage AppHomePage` passed 4 files / 26 tests.
- `git diff --check` passed with line-ending warnings only.

## 10. Manual Verification Result

Dev server was already running at `http://127.0.0.1:5173`.

HTTP 200 checks passed:

- `/app`
- `/app/my-farm`
- `/app/farm-records`
- `/app/help`
- `/app/field-test-feedback`
- `/app/profile`

The Browser connector was unavailable again (`agent.browsers.list()` returned `[]`), so visual/mobile overflow and console-error verification could not be completed in the in-app browser. Automated render tests and HTTP route checks were used as the fallback verification path.

## 11. Known Limitations

- The first-use flow is still a compact guide, not a full guided onboarding wizard.
- Visual/mobile verification still needs Browser connector availability.
- Field-test feedback remains static/local and does not persist notes.
- Some internal/export/sync readiness sections intentionally keep technical wording because they remain development/data-control surfaces.
- No Farm Records storage/schema/backend behavior changed.

## 12. Next Recommended Milestone

M97 should use Browser/mobile verification or real field-test observations to prioritize one narrow usability fix, such as making the first `เพิ่มแปลง` and `เพิ่มกิจกรรม` create flow even easier after a farmer taps the first-use card.
