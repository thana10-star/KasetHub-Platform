# Farmer-Friendly Auth Strategy

## Product Principle

KasetHub should be guest-first. Farmers can browse videos, read articles, save useful content, ask mock AI questions, and track My Farm locally before creating an account.

## Ask Login Only When Needed

Ask for login when the user wants to:

- Backup data
- Post or comment
- Sync across devices
- Keep AI credit history
- Use future marketplace features

## Primary Future Login

Phone OTP should be the primary login path because many Thai farmers may not want to use email.

Thai copy:

- “สมัครด้วยเบอร์โทรเพื่อสำรองข้อมูล”
- “รหัสยืนยันจะถูกส่งไปยังเบอร์ของคุณ”
- “ข้อมูลที่บันทึกไว้ตอนนี้อยู่ในเครื่องนี้เท่านั้น”
- “เบอร์โทรเหมาะสำหรับผู้ใช้ทั่วไป”

## Secondary Login Options

LINE Login should be a strong secondary option because many users discover content through LINE groups or creators.

Google can be available for users already comfortable with Google accounts.

Email should not be required at first.

Thai copy:

- “LINE เหมาะสำหรับคนที่ใช้ LINE เป็นประจำ”
- “Google สำหรับผู้ใช้ที่มีบัญชีอยู่แล้ว”

## Guest-Friendly UX Copy

- “ใช้งานต่อได้เลย ไม่ต้องสมัคร”
- “ข้อมูลที่บันทึกไว้จะอยู่ในเครื่องนี้”
- “สมัครด้วยเบอร์โทรหรือ LINE ในอนาคตเพื่อสำรองและย้ายข้อมูลไปเครื่องอื่น”
- “ยังไม่เชื่อมต่อบัญชีจริงในเวอร์ชันนี้”

## Trust Notes

The app should explain what data will sync before account creation. AI history should be optional. My Farm data may feel sensitive, so consent and deletion controls should be visible.

## M07 Prototype Routes

- `/app/auth`: explains guest-first account creation and shows phone, LINE, and Google options.
- `/app/auth/phone`: shows phone number and OTP mock steps, with “ยังไม่ส่ง OTP จริงในเวอร์ชันนี้”.
- `/app/auth/line`: explains future LINE connection with no SDK or redirect.
- `/app/auth/google`: explains future Google connection with no SDK or redirect.
- `/app/auth/sync-preview`: shows consent checklist and dry-run Guest Memory sync summary.

M07 still has no real OTP, Supabase Auth, LINE Login, Google Login, SDK redirect, or network request.

## M15 Senior-Friendly Auth Polish

M15 keeps the auth experience simple for older/non-tech users:

- Keep “ใช้งานต่อได้เลย ไม่ต้องสมัคร” visible before account options.
- Say “สมัครเมื่ออยากสำรองข้อมูล” instead of pushing login early.
- Keep phone as the recommended future path because it is familiar and does not require email.
- Use large rows for phone, LINE, and Google choices.
- Keep mock-only warnings short: “ยังไม่มี OTP จริงในเวอร์ชันนี้”.
- Avoid technical words such as OAuth, redirect, provider, or token in user-facing copy.

Recommended short copy:

- “ยังใช้งานต่อได้ ไม่ต้องสมัครตอนนี้”
- “ข้อมูลที่บันทึกไว้ตอนนี้อยู่ในเครื่องนี้เท่านั้น”
- “สมัครด้วยเบอร์โทรเมื่ออยากสำรองข้อมูล”
- “LINE เหมาะสำหรับคนที่ใช้ LINE เป็นประจำ”
- “เวอร์ชันนี้ยังไม่เชื่อมต่อบัญชีจริง”

## M16 Sync Proof of Concept Copy

The sync proof of concept should reassure users before any future backup:

- “ทดสอบซิงก์จำลอง ยังไม่อัปโหลดจริง”
- “ข้อมูลในเครื่องจะไม่หาย”
- “ถ้าซิงก์ล้มเหลว คุณยังใช้งานต่อได้ตามเดิม”
- “ประวัติคำถาม AI จะซิงก์เมื่อคุณยินยอมเท่านั้น”
- “ประวัติฟาร์มต้องขออนุญาตก่อนสำรอง”

## M17 Phone OTP Boundary

M17 introduces a local mock phone OTP flow to prove the future account ownership step.

Rules:

- Guest mode remains the default.
- Phone is the primary future login method.
- Demo OTP `123456` is mock-only.
- No email is required.
- No real SMS is sent.
- No Supabase Auth call happens.
- Sync preview should require a mock phone session before running a dry-run sync.

Senior-friendly copy:

- “รหัสทดสอบคือ 123456”
- “ยังไม่ส่ง SMS จริง”
- “ยืนยันเบอร์จำลองแล้ว ยังไม่ใช่บัญชีจริง”
- “ต้องยืนยันเจ้าของบัญชีก่อนสำรองข้อมูลจริงในอนาคต”

SMS cost notes:

- Real OTP should be rate-limited.
- Resend should have cooldown.
- Repeated failed attempts should be blocked or delayed.
- SMS costs should be monitored before scaling.

## M19 LINE Login Boundary

LINE is a secondary but important login path for Thai users.

Rules:

- Phone remains the recommended recovery path.
- LINE can link to a phone account after user confirmation.
- LINE-only users should be encouraged to add phone before real backup.
- No LINE secret should ever be stored in frontend code.
- Guest Memory should sync only after account ownership is clear.

M19 keeps this mock-only with no LINE SDK, redirect, token, network call, or Supabase write.

## M28 Phone OTP Staging UX

M28 keeps the user-facing phone path local/mock, but adds `/app/auth/phone-staging` so the team can prepare a controlled Supabase Auth phone OTP staging test.

User-facing Thai copy must remain direct:

- "ยังไม่ส่ง OTP จริง"
- "ยังไม่เปิด auth จริง"
- "รอสักครู่ก่อนขอรหัสใหม่"
- "ข้อมูลในเครื่องจะยังไม่ถูกสำรองจนกว่าคุณจะยืนยันบัญชี"

Before real SMS is enabled, the team must verify:

- redirect URL returns to a clear account status screen
- SMS resend copy is calm and senior-friendly
- failed OTP attempts explain what to do next
- logout is obvious on shared devices
- Guest Sync remains disabled until session ownership is real
- service-role keys and SMS provider secrets never appear in frontend
