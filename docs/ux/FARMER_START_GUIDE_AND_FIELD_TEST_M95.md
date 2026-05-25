# Farmer Start Guide And Field-Test Feedback M95

## 1. Why Help/Start Guide Is Needed

M92-M94 made My Farm and Profile easier to find, but first-time farmers still need a short path for what to tap first.

M95 adds a lightweight `/app/help` guide so farmers can start with `ฟาร์มของฉัน`, then record work, money, and harvest information without reading a long manual.

## 2. Elderly/Non-technical Farmer Assumptions

- The first useful action should be visible and repeated in simple Thai.
- Users may not know the words ledger, dashboard, sync, or readiness.
- Users need short cards, large tap targets, and concrete examples.
- Field testing should observe confusion without collecting personal data.

## 3. Start Guide Structure

`/app/help` uses the title `วิธีเริ่มใช้ KasetHub` and five short sections:

- `เริ่มจาก “ฟาร์มของฉัน”`
- `บันทึกงานในฟาร์ม`
- `บันทึกรายรับรายจ่าย`
- `ดูต้นทุน กำไร และผลผลิต`
- `ใช้เครื่องมือ / ถาม AI / เช็กอากาศ`

The page links to:

- `/app/my-farm`
- `/app/farm-records`
- `/app/calculators`
- `/app/ai`
- `/app/weather`

M96 follow-up: `/app/help` now also includes `เริ่มบันทึกฟาร์ม 4 ขั้นตอน`:

1. เพิ่มแปลง
2. บันทึกงานในฟาร์ม
3. บันทึกรายรับรายจ่าย
4. บันทึกผลผลิต

## 4. Field-test Checklist

`/app/field-test-feedback` is a static/local checklist for the project owner to use while observing farmers or elderly users.

Checklist topics:

- ผู้ทดสอบเข้าใจหน้าแรกไหม
- หา “ฟาร์มของฉัน” เจอไหม
- กดเพิ่มกิจกรรมได้ไหม
- กดเพิ่มรายรับรายจ่ายได้ไหม
- ตัวหนังสืออ่านง่ายไหม
- เมนูล่างเข้าใจไหม
- ผู้ใช้เข้าใจไหมว่าต้องเริ่มจากเพิ่มแปลง
- ผู้ใช้เข้าใจคำว่า “บันทึกงานในฟาร์ม” ไหม
- ผู้ใช้เข้าใจคำว่า “เพิ่มเงิน” หมายถึงรายรับรายจ่ายไหม
- ผู้ใช้หา “เพิ่มผลผลิต” เจอไหม
- ผู้ใช้รู้ไหมว่าช่องไหนจำเป็น/ไม่จำเป็น
- จุดที่ผู้ใช้สับสน
- ข้อเสนอแนะ
- คะแนนความง่าย 1-5

## 5. Privacy Boundary For Local Feedback

The feedback page does not submit to a backend and does not write Supabase data.

The page tells testers:

- Do not enter real names.
- Do not enter phone numbers.
- Do not enter addresses or personal details.
- Use the page only to record observation notes during testing.

No `kasethub.fieldTestFeedback.v1` localStorage key was added in M95 because the current implementation is static/local only.

## 6. What Remains Future

- Real field-test results and prioritized fixes.
- A richer help center after user testing proves which topics are needed.
- Optional local-only note persistence after privacy review.
- Real support contact channel after backend/support operations exist.
- Production language switching after safe i18n infrastructure exists.

## 7. Non-goals

- No Supabase read/write.
- No backend feedback submission.
- No real support chat.
- No notifications.
- No cloud sync or sync queue.
- No GPS/geolocation.
- No AI Farm Records processing.
- No receipt upload or OCR.
- No legal-final PDPA copy.
- No Farm Records local storage/schema changes.
- No route removal.
