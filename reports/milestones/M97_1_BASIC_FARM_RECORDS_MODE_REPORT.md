# M97.1 Basic Farm Records Mode Report

## 1. Summary

M97.1 makes the default Farm Records experience basic-first.

The top of `/app/farm-records` now focuses on three essential actions: `เพิ่มแปลง`, `บันทึกรายรับ/รายจ่าย`, and `บันทึกผลผลิต`. Advanced content remains available lower on the page under `ข้อมูลเพิ่มเติม / ขั้นสูง`.

This is UX/presentation polish only. No Farm Records features, routes, fields, storage schema, localStorage keys, Supabase behavior, sync behavior, GPS/geolocation, AI processing, uploads, OCR, or notifications were added or removed.

## 2. Files Created

- `docs/ux/BASIC_FARM_RECORDS_MODE_M97_1.md`
- `reports/milestones/M97_1_BASIC_FARM_RECORDS_MODE_REPORT.md`

## 3. Files Modified

- `src/routes/FarmRecordsDebugPage.tsx`
- `src/routes/MyFarmPage.tsx`
- `src/routes/HelpPage.tsx`
- `src/routes/FieldTestFeedbackPage.tsx`
- `src/routes/FarmRecordsDebugPage.test.tsx`
- `src/routes/MyFarmPage.test.tsx`
- `src/routes/ProfilePage.test.tsx`
- `src/services/qa/route-registry.ts`
- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/MY_FARM_HUB_FOUNDATION.md`
- `docs/ux/FIRST_USE_FARM_RECORDS_FLOW_M96.md`
- `docs/ux/FARMER_START_GUIDE_AND_FIELD_TEST_M95.md`
- `reports/milestones/M97_FIRST_ADD_PLOT_ACTIVITY_FLOW_POLISH_REPORT.md`

## 4. Basic Mode Behavior

`/app/farm-records` now starts with:

- `สมุดฟาร์มแบบง่าย`
- `เริ่มจากบันทึกแปลง รายรับรายจ่าย และผลผลิตก่อน รายละเอียดอื่นค่อยเพิ่มทีหลังได้`

The three dominant action cards are:

- `เพิ่มแปลง` - `ตั้งชื่อแปลง เช่น แปลงข้าวหลังบ้าน`
- `บันทึกรายรับ/รายจ่าย` - `จดค่าใช้จ่ายหรือรายได้จากการขายผลผลิต`
- `บันทึกผลผลิต` - `จดน้ำหนักผลผลิตที่เก็บเกี่ยวได้`

These buttons open the existing local plot, finance, and harvest forms on the same page.

## 5. Advanced Sections Behavior

`บันทึกงานในฟาร์ม` remains available but is secondary:

- `จดงานในฟาร์มเพิ่มเติม`
- `เช่น ใส่ปุ๋ย พ่นยา ให้น้ำ หรือจ้างแรงงาน`

Advanced content is introduced lower by:

- `ข้อมูลเพิ่มเติม / ขั้นสูง`
- `ส่วนนี้สำหรับดูรายละเอียด ต้นทุน การสำรองข้อมูล และการตั้งค่าขั้นสูง ไม่จำเป็นต้องใช้ตอนเริ่มต้น`

Existing advanced sections and anchors remain accessible, including cost dashboard, harvest/yield, export, restore, and sync consent prototype anchors.

## 6. My Farm Simplification

`/app/my-farm` now starts with a simpler top card:

- `ฟาร์มของฉัน`
- `เริ่มจากเพิ่มแปลง แล้วบันทึกรายรับรายจ่ายหรือผลผลิต`

Primary actions:

- `เปิดสมุดฟาร์ม`
- `บันทึกรายรับ/รายจ่าย`
- `บันทึกผลผลิต`

Only two simple facts remain near the top: `กำไร/ขาดทุน` and `ผลผลิตรวม`.

## 7. Help/Field-test Updates

`/app/help` now uses the 3-step basic flow:

1. `เพิ่มแปลง`
2. `บันทึกรายรับ/รายจ่าย`
3. `บันทึกผลผลิต`

It explains that farm work can be added later:

- `ถ้าต้องการจดงานในฟาร์ม เช่น ใส่ปุ๋ย พ่นยา หรือให้น้ำ สามารถเพิ่มทีหลังได้`

`/app/field-test-feedback` now asks whether users understand the three main buttons, income/expense, harvest entry, whether any area is too crowded, whether advanced words are confusing, and whether activity recording should remain on the first screen.

## 8. Mobile/Readability Behavior

The Farm Records first screen now prioritizes large tap targets and short Thai labels. Metrics, filters, analytics, backup/restore, and sync-planning copy are lower and visually secondary.

My Farm also avoids a dashboard-heavy first impression by putting only basic actions and two simple facts near the top.

## 9. Tests/Checks Run

- `npm run lint` passed.
- `npm run build` passed. This runs `tsc -b`; no separate `npm run typecheck` script exists. Vite reported the existing large chunk warning.
- `npm run test` passed: 33 test files, 320 tests.
- `npm run test -- FarmRecordsDebugPage ProfilePage MyFarmPage` passed during development: 3 files, 25 tests.
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

The Browser connector was unavailable again (`agent.browsers.list()` returned `[]`), so visual/mobile overflow and console-error verification could not be completed in the in-app browser. HTTP route checks and automated render tests were used as the fallback verification path.

## 11. Known Limitations

- My Farm action links take users to `/app/farm-records`; the same-page Farm Records buttons open the specific forms.
- Advanced sections are visually grouped and lower on the page, not hidden behind a full persistent mode-switch system.
- Visual/mobile browser verification is still pending until the Browser connector is available.
- Existing build output includes the Vite large chunk warning.
- Generated/pre-existing dirty build artifacts remain in the worktree (`dist/index.html`, `node_modules/.vite/deps/_metadata.json`, and `tsconfig.app.tsbuildinfo`).

## 12. Next Recommended Milestone

M98 should validate this basic-mode layout with real field testing and use observations to decide whether `บันทึกงานในฟาร์ม` should stay secondary or become an optional toggle/expandable section.
