# M93.1 Harvest Form Thai Text / Encoding Fix Report

## 1. Summary

M93.1 fixes the Harvest & Yield mobile UI text issue found after M91/M93 review. The harvest create form now uses clean Thai-first labels and validation copy instead of mojibake/garbled Thai and English fallback text.

This is a text and responsive-layout bugfix only. It changes no Farm Records storage schema, harvest data model, Supabase behavior, sync queue, cloud sync, GPS/geolocation, AI Farm Records processing, receipt upload, OCR, or backend feature.

## 2. Files Modified

- `docs/farm-records/FARM_HARVEST_YIELD_M91.md`
- `src/routes/AppHomePage.test.tsx`
- `src/routes/FarmRecordsDebugPage.tsx`
- `src/routes/FarmRecordsDebugPage.test.tsx`
- `src/routes/ProfilePage.test.tsx`
- `src/routes/farm-records-page-model.ts`
- `src/services/farm-records/farm-cost-analytics-service.ts`
- `src/services/farm-records/farm-cost-analytics-service.test.ts`
- `src/services/farm-records/farm-records-config.ts`

## 3. Corrupted/English Text Fixed

- `Add harvest` -> `เพิ่มผลผลิต`.
- Harvest form title -> `เพิ่มข้อมูลผลผลิต`.
- Harvest form subtitle -> `บันทึกผลผลิตที่เก็บเกี่ยวได้จากแปลงหรือรอบปลูกนี้`.
- Harvest labels now use Thai-first copy:
  - `แปลง`
  - `รอบปลูก`
  - `วันที่เก็บเกี่ยว`
  - `ชื่อพืช (ถ้ามี)`
  - `ปริมาณผลผลิต`
  - `หน่วย`
  - `เกรด/คุณภาพ (ถ้ามี)`
  - `ผู้ซื้อ (ถ้ามี)`
  - `ราคาขายต่อกก. (ถ้ามี)`
  - `หมายเหตุ`
- Harvest validation messages now use readable Thai.
- Harvest unit labels now use Thai labels for kilogram, ton, sack, basket, and other.
- Harvest success/delete copy now says data is saved/deleted from this device.

## 4. Harvest Metric Mobile Layout Fix

The Harvest & Yield section previously allowed too many metric cards in one row inside the phone-width app shell, causing values such as `3,200 kg`, `283 kg/rai`, and `4.03 THB/kg` to break into unreadable fragments.

M93.1 changes the harvest metric card grid to a mobile-safe one/two-column layout and stacks the recorded harvest summary and warnings vertically. Form inputs now use `min-w-0`, and the harvest form fields stack in one column to avoid horizontal overflow on narrow screens.

Farmer-facing section labels were also changed to Thai-first copy, including `ผลผลิตและการเก็บเกี่ยว`, `ผลผลิตรวม`, `ผลผลิตต่อไร่`, `ต้นทุนต่อกก.`, `รายได้ต่อกก.`, `กำไรต่อกก.`, `สรุปผลผลิตที่บันทึก`, and `ข้อควรทราบ`.

## 5. Tests/Checks Run

- `npm run lint` - passed.
- `npm run build` - passed. Vite emitted the existing large chunk size warning.
- `npm run test` - passed, 33 test files and 312 tests.
- Targeted M93.1 UI/text tests - passed, 5 test files and 32 tests.
- `git diff --check` - no whitespace errors; Git reported existing LF-to-CRLF working-copy warnings.
- `npm run typecheck` - not available as a separate package script; `npm run build` runs `tsc -b`.

## 6. Manual Verification Result

- `http://127.0.0.1:5173/app/farm-records` returned HTTP 200.
- `http://127.0.0.1:5173/app/my-farm` returned HTTP 200.
- `http://127.0.0.1:5173/app` returned HTTP 200.
- Automated tests verify the Thai harvest add button, readable Thai form title/labels, absence of `Add harvest` in farmer-facing harvest UI, absence of mojibake markers, Thai harvest metric labels, and mobile-safe responsive grid classes.
- Browser connector verification was attempted, but `agent.browsers.list()` returned no browser targets. No screenshot, mobile-overflow, form-click, or console-error browser check was available in this session.

## 7. Known Limitations

- No Browser screenshot/mobile artifact yet if the Browser connector remains unavailable.
- The fix does not add harvest edit UI, harvest CSV export, or new harvest analytics.
