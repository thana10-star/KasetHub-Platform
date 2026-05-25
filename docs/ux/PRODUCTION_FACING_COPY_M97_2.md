# Production-facing Copy M97.2

## 1. Purpose

M97.2 makes normal farmer-facing pages feel like a real usable app instead of a test build.

The app still keeps local-first safety, disabled cloud sync, Admin/QA tools, export/restore, sync consent planning, and internal readiness routes. The change is copy and presentation only.

## 2. User-facing Copy Cleanup

Normal pages now avoid repeated test/prototype/dev wording near the top:

- `/app`
- `/app/my-farm`
- `/app/farm-records`
- `/app/help`
- `/app/profile`
- `/app/weather`
- `/app/ai`
- `/app/calculators`

Preferred wording treats saved information as real local user data:

- `ข้อมูลฟาร์มของคุณ`
- `รายการที่บันทึกไว้`
- `สมุดฟาร์มของฉัน`
- `ข้อมูลนี้บันทึกไว้ในเครื่องนี้`
- `ซิงก์บัญชีปิดอยู่`

## 3. Real Local Data Mode

Farm Records data is presented as real data saved by the user on this device.

The UI no longer implies that Farm Records are fake, demo-only, or test-only on normal screens. It still clearly says cloud sync is off in Profile/data-control surfaces.

No localStorage keys, Farm Records schema, export/restore behavior, sync consent state, or backend behavior changed.

## 4. Warning Relocation

Short calm copy is allowed on normal screens:

`ข้อมูลนี้บันทึกไว้ในเครื่องนี้`

Detailed warnings belong in:

- Profile `ข้อมูลและความเป็นส่วนตัว`
- `/app/farm-records#farm-records-export`
- `/app/farm-records#farm-records-restore`
- `/app/farm-records#farm-records-sync`
- collapsed `สำหรับทีมงานหรือทดสอบ`
- Admin/QA/internal routes

Normal Home, My Farm, Help, and Basic Farm Records no longer lead with sync/export/prototype language.

## 5. Advanced/Admin/QA Preservation

M97.2 does not remove routes or internal tools.

Admin, QA, staging, readiness, debug, sync prototype, export, restore, and technical status copy remain accessible in their existing advanced/internal locations.

## 6. What Remains Future

- Real account signup and cloud backup after auth/ownership/RLS are ready.
- Final legal/privacy/PDPA copy.
- Build-time or role-based hiding of internal tools after real auth/RBAC exists.
- Production AI/backend/weather/pricing integrations after explicit product and safety review.

## 7. Non-goals

- No Supabase read/write.
- No sync queue or cloud sync.
- No Farm Records storage/schema change.
- No localStorage key rename.
- No GPS/geolocation.
- No AI Farm Records processing.
- No receipt upload or OCR.
- No notifications.
- No route removal.
- No legal-final PDPA copy.
