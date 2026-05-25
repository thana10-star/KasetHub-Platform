# M97 First Add Plot + Add Activity Flow Polish Report

## 1. Summary

M97 polishes the first two Farm Records actions: `เพิ่มแปลง` and `บันทึกงานในฟาร์ม`.

The work keeps Farm Records local-only and changes UX/copy/form flow only. No storage/schema, Supabase, sync, GPS, AI processing, upload, OCR, notification, or route behavior was added.

## 2. Files Created

- `docs/ux/FIRST_ADD_PLOT_ACTIVITY_FLOW_M97.md`
- `reports/milestones/M97_FIRST_ADD_PLOT_ACTIVITY_FLOW_POLISH_REPORT.md`

## 3. Files Modified

- `src/routes/FarmRecordsDebugPage.tsx`
- `src/routes/farm-records-page-model.ts`
- `src/services/farm-records/farm-records-config.ts`
- `src/routes/HelpPage.tsx`
- `src/routes/FieldTestFeedbackPage.tsx`
- `src/routes/FarmRecordsDebugPage.test.tsx`
- `src/routes/ProfilePage.test.tsx`
- `src/services/qa/route-registry.ts`
- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/MY_FARM_HUB_FOUNDATION.md`
- `docs/ux/FIRST_USE_FARM_RECORDS_FLOW_M96.md`
- `docs/ux/FARMER_START_GUIDE_AND_FIELD_TEST_M95.md`

## 4. Add Plot Flow Polish

The Add Plot form now uses:

- Title: `เพิ่มแปลง`
- Subtitle: `ตั้งชื่อแปลงก่อน เช่น แปลงข้าวหลังบ้าน หรือ สวนมะม่วง`
- Button: `บันทึกแปลง`
- Visible cancel action: `ยกเลิก`

Field order is name first, then optional area, province, district, subdistrict, and notes.

Helper copy was added:

- `ไม่ต้องกรอกที่อยู่ละเอียดก็ได้`
- `ระบบยังไม่ใช้ GPS`

Missing plot-name validation now says `กรุณากรอกชื่อแปลง`.

## 5. Add Activity Flow Polish

The Add Activity form now uses:

- Title: `บันทึกงานในฟาร์ม`
- Subtitle/example: `เช่น ใส่ปุ๋ย พ่นยา ให้น้ำ เก็บเกี่ยว หรือจ้างแรงงาน`
- Button: `บันทึกงาน`
- Visible cancel action: `ยกเลิก`

Required fields appear first: plot, work date, work type, and short title. Optional detail, input, quantity, unit, tag, and crop-cycle fields remain available lower in the form.

Activity validation now uses:

- `กรุณาเลือกแปลง`
- `กรุณาเลือกวันที่ทำงาน`
- `กรุณาเลือกประเภทงาน`
- `กรุณากรอกหัวข้อสั้น ๆ`

Activity type labels were updated to Thai-first farmer wording, including `พ่นยา`, `จ้างแรงงาน`, `ใช้เครื่องจักร`, `โรค/แมลง`, and `สภาพอากาศ`.

## 6. Empty-state Updates

No-plot copy now points to one clear action:

- `ยังไม่มีแปลง`
- `เริ่มจากตั้งชื่อแปลง เช่น แปลงข้าวหลังบ้าน`
- `เพิ่มแปลง`

No-activity copy now points to:

- `ยังไม่มีบันทึกงานในฟาร์ม`
- `บันทึกสิ่งที่ทำ เช่น ใส่ปุ๋ย พ่นยา หรือให้น้ำ`
- `เพิ่มกิจกรรม`

The existing page buttons still open the relevant local form through the Farm Records page state.

## 7. Help/Field-test Updates

`/app/help` now includes:

- `ตัวอย่างชื่อแปลง: แปลงข้าวหลังบ้าน`
- `ตัวอย่างงาน: ใส่ปุ๋ยข้าว วันที่ 12 มิ.ย.`

`/app/field-test-feedback` now asks:

- `ผู้ใช้กรอกชื่อแปลงได้เองไหม`
- `ผู้ใช้เข้าใจคำว่า “บันทึกงานในฟาร์ม” ไหม`
- `ผู้ใช้เลือกประเภทงานได้ไหม`
- `ผู้ใช้รู้ไหมว่าช่องไหนไม่จำเป็นต้องกรอก`

The feedback surface remains static/local only and does not submit or store feedback.

## 8. Mobile/Readability Behavior

The Add Plot and Add Activity forms remain one-column on mobile, with large full-width buttons, wrapping Thai labels, and optional fields marked with `ถ้ามี`.

The Add Activity form keeps the most important fields first and moves `รอบปลูก (ถ้ามี)` lower so the first screen is less intimidating.

## 9. Tests/Checks Run

- `npm run lint` passed.
- `npm run build` passed. This runs `tsc -b`; no separate `npm run typecheck` script exists. Vite reported the existing large chunk warning.
- `npm run test` passed: 33 test files, 319 tests.
- `npm run test -- FarmRecordsDebugPage ProfilePage` passed during development: 2 files, 23 tests.
- `git diff --check` passed with line-ending warnings only.

## 10. Manual Verification Result

Dev server was already running at `http://127.0.0.1:5173`.

HTTP 200 checks passed:

- `/app/farm-records`
- `/app/my-farm`
- `/app/help`
- `/app/field-test-feedback`
- `/app`
- `/app/profile`

The Browser connector was unavailable again (`agent.browsers.list()` returned `[]`), so visual/mobile overflow and console-error verification could not be completed in the in-app browser. HTTP route checks and automated render tests were used as the fallback verification path.

## 11. Known Limitations

- M97.1 follow-up: the default Farm Records screen was later simplified into Basic Farm Records Mode, so `บันทึกงานในฟาร์ม` remains available but is no longer one of the three primary first-screen actions.
- The form handoff opens the local form in the existing Farm Records page structure; no complex onboarding wizard or animated scroll flow was added.
- Visual/mobile verification is still pending until the Browser connector is available.
- Existing build output includes the Vite large chunk warning.
- Generated/pre-existing dirty build artifacts remain in the worktree (`dist/index.html`, `node_modules/.vite/deps/_metadata.json`, and `tsconfig.app.tsbuildinfo`).
- No Farm Records storage/schema/backend behavior changed.

## 12. Next Recommended Milestone

M98 should polish the next first-use actions: `เพิ่มเงิน` and `เพิ่มผลผลิต`, with the same Thai-first, low-intimidation approach and no backend/storage changes.
