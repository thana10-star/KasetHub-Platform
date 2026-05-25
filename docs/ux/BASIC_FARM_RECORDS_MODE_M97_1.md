# Basic Farm Records Mode M97.1

## Purpose

M97.1 reduces the default Farm Records complexity for elderly and non-technical farmers.

The app keeps the full local-first Farm Records system, but the first screen now focuses on three basic actions:

1. `เพิ่มแปลง`
2. `บันทึกรายรับ/รายจ่าย`
3. `บันทึกผลผลิต`

Advanced records, analytics, backup/restore, and sync-planning surfaces remain available lower on the page.

M97.2 follow-up: normal user-facing copy now treats Farm Records as real local user data. Test/prototype/debug wording is reduced on Home, My Farm, Farm Records basic mode, Help, Profile, Weather, AI, and Calculators. Detailed warnings and technical wording remain in data/privacy, advanced, Admin, QA, export, restore, and sync sections.

M98 follow-up: mobile/basic-flow triage keeps the three basic actions first, collapses secondary My Farm details under `ข้อมูลฟาร์มเพิ่มเติม`, and tightens Farm Records labels so normal forms and lists read Thai-first.

## Basic Mode Behavior

`/app/farm-records` now starts with `สมุดฟาร์มแบบง่าย`.

The basic copy says:

`เริ่มจากบันทึกแปลง รายรับรายจ่าย และผลผลิตก่อน รายละเอียดอื่นค่อยเพิ่มทีหลังได้`

The three main actions open the existing local forms:

- `เพิ่มแปลง` - `ตั้งชื่อแปลง เช่น แปลงข้าวหลังบ้าน`
- `บันทึกรายรับ/รายจ่าย` - `จดค่าใช้จ่ายหรือรายได้จากการขายผลผลิต`
- `บันทึกผลผลิต` - `จดน้ำหนักผลผลิตที่เก็บเกี่ยวได้`

No storage schema, localStorage key, or backend behavior changed.

## Secondary Activity Recording

`บันทึกงานในฟาร์ม` remains available as a secondary action:

- `จดงานในฟาร์มเพิ่มเติม`
- `เช่น ใส่ปุ๋ย พ่นยา ให้น้ำ หรือจ้างแรงงาน`

This keeps activity recording accessible without making it one of the required first steps.

## M97.2 Production-facing Copy

M97.2 keeps the same three-action Basic Farm Records Mode but changes normal copy from test-build language to real local-data language:

- `ข้อมูลฟาร์มของคุณ`
- `รายการที่คุณบันทึก`
- `สมุดฟาร์มของฉัน`
- `รายรับรายจ่ายของฟาร์ม`
- `ผลผลิตที่บันทึกไว้`

The basic top area no longer shows sync/export/prototype wording before the main actions. A short calm note can still say `ข้อมูลนี้บันทึกไว้ในเครื่องนี้`, while detailed export/restore/sync warnings stay lower in the advanced/data-control sections.

M97.2 does not change storage keys, schema, sync state, export/restore behavior, or backend behavior.

## Advanced Grouping

Advanced content is now visually introduced by:

- `ข้อมูลเพิ่มเติม / ขั้นสูง`
- `ส่วนนี้สำหรับดูรายละเอียด ต้นทุน การสำรองข้อมูล และการตั้งค่าขั้นสูง ไม่จำเป็นต้องใช้ตอนเริ่มต้น`

The advanced content includes crop cycles, detailed activity/ledger lists, analytics, break-even/cost details, export, restore, restore recovery, sync consent prototype, and readiness/status copy.

Existing anchors remain in place:

- `/app/farm-records#farm-cost-dashboard`
- `/app/farm-records#farm-harvest-yield`
- `/app/farm-records#farm-records-export`
- `/app/farm-records#farm-records-restore`
- `/app/farm-records#farm-records-sync`

## My Farm Simplification

`/app/my-farm` now starts with a simpler top card:

- `ฟาร์มของฉัน`
- `เริ่มจากเพิ่มแปลง แล้วบันทึกรายรับรายจ่ายหรือผลผลิต`

Primary actions are:

- `เปิดสมุดฟาร์ม`
- `บันทึกรายรับ/รายจ่าย`
- `บันทึกผลผลิต`

Only two simple facts are shown near the top: `กำไร/ขาดทุน` and `ผลผลิตรวม`.

## Help And Field Testing

`/app/help` now frames first use as three basic steps:

1. `เพิ่มแปลง`
2. `บันทึกรายรับ/รายจ่าย`
3. `บันทึกผลผลิต`

It also says farm work can be added later:

`ถ้าต้องการจดงานในฟาร์ม เช่น ใส่ปุ๋ย พ่นยา หรือให้น้ำ สามารถเพิ่มทีหลังได้`

`/app/field-test-feedback` now asks whether users understand the three main buttons, income/expense, harvest entry, excessive content, advanced words, and whether activity recording still needs to be on the first screen.

## Non-Goals

M97.1 does not remove existing Farm Records features, remove routes, delete fields, change Farm Records local storage/schema, rename localStorage keys, add Supabase read/write, add sync queue, enable cloud sync, add GPS/geolocation, add AI Farm Records processing, add receipt upload/OCR, add notifications, or collect personal data.
