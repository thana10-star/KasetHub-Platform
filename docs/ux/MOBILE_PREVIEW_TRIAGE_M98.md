# Mobile Preview Triage M98

## Purpose

M98 is a focused QA/polish pass for the production-facing farmer basic flow.

The goal is to keep normal farmer pages simple on mobile, especially:

1. `/app`
2. `/app/my-farm`
3. `/app/farm-records`
4. `/app/help`
5. `/app/profile`

No new feature system was added.

## QA Boundary

The intended mobile journey is:

1. Open `/app`.
2. Tap `ฟาร์มของฉัน`.
3. Tap `เปิดสมุดฟาร์ม`.
4. See `สมุดฟาร์มแบบง่าย`.
5. Use the three main actions: `เพิ่มแปลง`, `บันทึกรายรับ/รายจ่าย`, and `บันทึกผลผลิต`.

Advanced analytics, export/restore, sync planning, and admin/internal status should remain available but not dominate the first screen.

## Findings

- Browser preview was unavailable, so visual QA used static route/layout inspection plus render tests.
- `/app/my-farm` still had a large detailed metrics/data-control card too early in the page.
- Some Farm Records form/list labels still mixed Thai with English, such as finance directions, statuses, and unit labels.
- Some seeded Farm Records display copy still looked like demo/test data.
- Farm Records summary values needed extra wrapping protection for mobile.

## Fixes Applied

- Moved heavier My Farm counts, detailed Farm Records metrics, backup/restore/sync status, and the Farm Cost Dashboard deep link behind a collapsed `ข้อมูลฟาร์มเพิ่มเติม` section.
- Kept My Farm top focused on `เปิดสมุดฟาร์ม`, `บันทึกรายรับ/รายจ่าย`, `บันทึกผลผลิต`, `กำไร/ขาดทุน`, and `ผลผลิตรวม`.
- Changed Farm Records form/list labels to Thai-first text for activity labels, finance directions, finance categories, unit labels, crop-cycle statuses, plot status, and ledger badges.
- Added `break-words` to Farm Records summary values.
- Cleaned seeded local Farm Records display labels so normal pages do not show `DEMO` labels.
- Made `/app/my-farm/settings` copy calmer while preserving the data boundary that account sync is off.

## Browser Availability

The in-app Browser connector was unavailable during M98 (`agent.browsers.list()` returned `[]`).

Fallback verification used:

- HTTP 200 route checks.
- SSR render tests.
- Static code/layout inspection.
- Full lint, build, test, and diff checks.

## Remaining Visual QA

When a browser target is available, manually check:

- First mobile screen of `/app`.
- First mobile screen of `/app/my-farm`.
- First mobile screen of `/app/farm-records`.
- Add Plot, Add Finance, and Add Harvest forms at narrow width.
- Bottom nav readability.
- No horizontal overflow or clipped Thai text.

## Non-goals

- No new features.
- No route removal.
- No Farm Records storage/schema change.
- No Supabase read/write.
- No sync queue or cloud sync.
- No GPS/geolocation.
- No AI Farm Records processing.
- No receipt upload or OCR.
- No notifications.
