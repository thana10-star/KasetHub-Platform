# Elder-Friendly Settings Polish M94

## 1. Purpose

M94 polishes `/app/profile` into a simpler farmer-facing settings area for elderly and non-technical users.

The page keeps the M93 grouping, makes the first three groups visually primary, and moves internal tools into a softer collapsed section at the bottom.

## 2. What Was Improved

- The page title now reads `โปรไฟล์และการตั้งค่า`.
- The opening profile card is shorter and less visually heavy.
- Safety copy is shown near the top:
  - `ข้อมูลสำคัญของฟาร์มยังอยู่ในเครื่องนี้`
  - `การซิงก์ขึ้นคลาวด์ยังไม่เปิดใช้งาน`
  - `การตั้งค่าบางอย่างเป็นตัวอย่างสำหรับเวอร์ชันถัดไป`
- Primary rows use larger tap targets, clearer Thai labels, and status pills for future-only settings.
- Technical words are reduced in farmer-facing groups.

## 3. Profile Grouping Strategy

The M93 groups remain:

- `บัญชีของฉัน`
- `ข้อมูลและความเป็นส่วนตัว`
- `ช่วยเหลือ`
- `สำหรับทีมงานหรือทดสอบ`

The first three are normal settings groups. The fourth is secondary and collapsed by default.

## 4. Placeholder Settings Added

- `ภาษา`: shows `เลือกภาษาไทยหรืออังกฤษในอนาคต` and `เร็ว ๆ นี้`.
- `วิธีใช้แอพ`: shows `คู่มือเริ่มต้นสำหรับเกษตรกร` and `เร็ว ๆ นี้`.
- `ติดต่อทีมงาน`: shows `ช่องทางช่วยเหลือจะเพิ่มในเวอร์ชันถัดไป` and `เร็ว ๆ นี้`.
- `ข้อมูลและความเป็นส่วนตัว`: links to `/app/farm-records#farm-records-export`.
- `กู้คืนข้อมูลฟาร์ม`: links to `/app/farm-records#farm-records-restore`.
- `การซิงก์ข้อมูล`: links to `/app/farm-records#farm-records-sync`, shows `ยังไม่เปิดใช้งาน ข้อมูลยังอยู่ในเครื่องนี้`, and status `ปิดอยู่`.

These are placeholders or existing local routes only. M94 does not implement real language switching, support chat, legal-final privacy copy, or cloud sync.

## 5. Advanced/Internal Tools Policy

The `สำหรับทีมงานหรือทดสอบ` section uses a native collapsed disclosure.

It remains accessible and keeps links for Admin, QA/system checks, MVP snapshot, next phase, Supabase staging readiness, Phone OTP staging, AI proxy status, content admin preview, moderation, and Guest Sync planning.

Copy inside the section says:

`ส่วนนี้สำหรับทีมพัฒนา ไม่จำเป็นต้องใช้ในการใช้งานทั่วไป`

## 6. What Remains Future

- Real i18n/language switching after safe app-wide infrastructure exists.
- A richer help center after M95 start-guide field testing.
- Real support/contact channel.
- Final legal/privacy/PDPA copy.
- Production-grade account sync and cloud backup after auth, ownership, RLS, export/delete, audit, and explicit consent are ready.
- Build-time separation of internal tools after real auth/RBAC exists.

## 6.1 M95 Follow-up

M95 adds `/app/help` as the first farmer start guide and updates `วิธีใช้แอพ` in Profile to link there.

M95 also adds `/app/field-test-feedback` as a static/local checklist for observing real farmers or elderly users. It has no backend submission, no Supabase write, and warns not to enter personal data.

## 7. Non-goals

- No route removal.
- No Admin/QA/internal page deletion.
- No Farm Records storage change.
- No Supabase read/write.
- No sync queue or cloud sync.
- No GPS/geolocation.
- No AI Farm Records processing.
- No receipt upload, OCR, notifications, support chat, bank, tax, or loan integration.
