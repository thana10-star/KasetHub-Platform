# First Add Plot + Add Activity Flow M97

## Purpose

M97 polishes the first two Farm Records actions for elderly and non-technical farmers:

1. `เพิ่มแปลง`
2. `บันทึกงานในฟาร์ม`

The goal is to make the first data entry moment feel simple, Thai-first, and less intimidating without changing Farm Records storage, schema, or backend behavior.

## Add Plot Flow

`/app/farm-records` keeps the same local Farm Records create path, but the plot form now starts with a clearer title and helper copy:

- `เพิ่มแปลง`
- `ตั้งชื่อแปลงก่อน เช่น แปลงข้าวหลังบ้าน หรือ สวนมะม่วง`

The field order is:

1. `ชื่อแปลง`
2. `พื้นที่กี่ไร่ (ถ้ามี)`
3. `จังหวัด (ถ้ามี)`
4. `อำเภอ (ถ้ามี)`
5. `ตำบล (ถ้ามี)`
6. `หมายเหตุ (ถ้ามี)`

The form also explains:

- `ไม่ต้องกรอกที่อยู่ละเอียดก็ได้`
- `ระบบยังไม่ใช้ GPS`

Validation uses `กรุณากรอกชื่อแปลง` when the name is missing. Location and exact address remain optional, and no GPS/geolocation behavior is added.

## Add Activity Flow

The activity form now presents the action as `บันทึกงานในฟาร์ม`, with example copy:

- `เช่น ใส่ปุ๋ย พ่นยา ให้น้ำ เก็บเกี่ยว หรือจ้างแรงงาน`

Required fields appear before optional fields:

1. `แปลง (จำเป็น)`
2. `วันที่ทำงาน (จำเป็น)`
3. `ประเภทงาน (จำเป็น)`
4. `หัวข้อสั้น ๆ (จำเป็น)`
5. `รายละเอียดเพิ่มเติม (ถ้ามี)`
6. `สิ่งที่ใช้ เช่น ปุ๋ย ยา เมล็ดพันธุ์ (ถ้ามี)`
7. `ปริมาณที่ใช้ (ถ้ามี)`
8. `หน่วย (ถ้ามี)`
9. `แท็ก (ถ้ามี)`
10. `รอบปลูก (ถ้ามี)`

Validation now uses:

- `กรุณาเลือกแปลง`
- `กรุณาเลือกวันที่ทำงาน`
- `กรุณาเลือกประเภทงาน`
- `กรุณากรอกหัวข้อสั้น ๆ`

## Activity Type Labels

Farmer-facing activity labels are Thai-first:

- `ปลูก`
- `ใส่ปุ๋ย`
- `พ่นยา`
- `ให้น้ำ`
- `เก็บเกี่ยว`
- `จ้างแรงงาน`
- `ใช้เครื่องจักร`
- `โรค/แมลง`
- `สภาพอากาศ`
- `ดูแลดิน`
- `อื่น ๆ`

The Add Activity form renders these labels without English helper text.

## Empty States

The Farm Records empty states now point to one clear next action:

- No plot: `เริ่มจากตั้งชื่อแปลง เช่น แปลงข้าวหลังบ้าน` and `เพิ่มแปลง`
- No activity: `บันทึกสิ่งที่ทำ เช่น ใส่ปุ๋ย พ่นยา หรือให้น้ำ` and `เพิ่มกิจกรรม`

The existing buttons still open the relevant form through the local page state.

## Help And Field Testing

`/app/help` now includes examples:

- `ตัวอย่างชื่อแปลง: แปลงข้าวหลังบ้าน`
- `ตัวอย่างงาน: ใส่ปุ๋ยข้าว วันที่ 12 มิ.ย.`

`/app/field-test-feedback` adds observation prompts for whether users can enter a plot name, understand `บันทึกงานในฟาร์ม`, choose an activity type, and identify optional fields.

## Non-Goals

M97 does not change Farm Records local storage/schema, add Supabase read/write, cloud sync, sync queue, GPS/geolocation, AI Farm Records processing, receipt upload, OCR, notifications, backend feedback submission, or route removal.
