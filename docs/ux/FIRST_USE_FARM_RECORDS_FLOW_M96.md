# First-Use Farm Records Flow M96

## 1. Purpose

M96 simplifies the first-use Farm Records experience for elderly and non-technical farmers.

The goal is to make the first action obvious: start with a farm plot, then record work, money, and harvest data.

## 2. Farmer Assumptions

- Users may not know the difference between `แปลง`, `รอบปลูก`, `กิจกรรม`, `รายรับรายจ่าย`, and `ผลผลิต`.
- Users need short Thai labels, large tap targets, and concrete examples.
- Optional fields should feel optional and say `ถ้ามี`.
- The app should guide without adding a heavy onboarding wizard.

## 3. First-Use Path

The repeated 4-step path is:

1. เพิ่มแปลง
2. บันทึกงานในฟาร์ม
3. บันทึกรายรับรายจ่าย
4. บันทึกผลผลิต

This appears on `/app/my-farm`, `/app/farm-records`, and `/app/help`.

## 4. Empty-State Strategy

`/app/farm-records` now uses direct next-step copy:

- No plots: `ยังไม่มีแปลง` and `เริ่มจากเพิ่มแปลงของคุณก่อน`.
- No farm work: `ยังไม่มีบันทึกงานในฟาร์ม` with examples such as fertilizer, spraying, watering, and harvest.
- No income/expense: `ยังไม่มีรายรับรายจ่าย` with examples such as fertilizer, chemicals, labor, and crop sale income.
- No harvest: `ยังไม่มีข้อมูลผลผลิต` and a reminder to record harvest weight for cost per kg.

## 5. Form Copy Simplification

Create forms keep the same data fields and local service behavior, but labels are clearer:

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

## 6. Help And Field-Test Updates

`/app/help` adds `เริ่มบันทึกฟาร์ม 4 ขั้นตอน`.

`/app/field-test-feedback` adds first-use observation questions:

- ผู้ใช้เข้าใจไหมว่าต้องเริ่มจากเพิ่มแปลง
- ผู้ใช้เข้าใจคำว่า “บันทึกงานในฟาร์ม” ไหม
- ผู้ใช้เข้าใจคำว่า “เพิ่มเงิน” หมายถึงรายรับรายจ่ายไหม
- ผู้ใช้หา “เพิ่มผลผลิต” เจอไหม
- ผู้ใช้รู้ไหมว่าช่องไหนจำเป็น/ไม่จำเป็น

The checklist remains static/local and does not submit to a backend.

## 7. What Remains Future

- Real field-test observations should decide which Farm Records flow to simplify next.
- A future lightweight guided mode may be useful if field testing shows users still get stuck.
- More Thai examples can be added after real crop/work patterns are observed.
- Visual/mobile QA should be completed once the Browser connector is available.

## 8. Non-goals

- No Supabase read/write.
- No sync queue or cloud sync.
- No GPS/geolocation.
- No AI Farm Records processing.
- No receipt upload or OCR.
- No notifications.
- No personal-data collection.
- No Farm Records local storage/schema changes.
- No route removal.
