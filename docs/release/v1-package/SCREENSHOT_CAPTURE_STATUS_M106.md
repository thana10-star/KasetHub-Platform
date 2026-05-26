# Screenshot Capture Status M106

## Purpose

This tracker locks the final V1 screenshot capture list and records owner status for each screenshot. Use production or the approved release build where possible.

Status values:

- `pending`
- `captured`
- `approved`
- `needs retake`

## Capture Rules

- Use Android phone portrait first.
- Hide browser address bar if possible.
- Use clean sample data only.
- Do not show personal data, secrets, debug/internal labels, provider configuration, or unfinished status labels.
- Do not imply official warnings, guaranteed AI correctness, guaranteed yield/profit, or expert replacement.

## Screenshot Status Table

| # | Screenshot | Route | Caption | Screenshot file placeholder | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Home | `/app` | ถาม AI เช็กอากาศ ใช้เครื่องมือ ในแอพเดียว | TBD | pending | Show Ask AI, Weather/Tools signal, and bottom nav. |
| 2 | Ask AI | `/app/ai` | ถาม AI เกษตรเป็นภาษาไทย | TBD | pending | Show input, examples, and safety note. |
| 3 | Weather live | `/app/weather` | เช็กอากาศและความเสี่ยงเกษตร | TBD | pending | Show live weather, current condition, and risk card; avoid GPS prompt or API details as focus. |
| 4 | Tools | `/app/calculators` | เครื่องมือคำนวณสำหรับเกษตรกร | TBD | pending | Show calculator list and clear tap targets. |
| 5 | Calculator detail | `/app/calculators/plant-spacing` or `/app/calculators/fertilizer` | วางแผนระยะปลูกหรือปุ๋ยเบื้องต้น | TBD | pending | Show fields and result area; keep planning-only language visible. |
| 6 | My Farm | `/app/my-farm` | เก็บข้อมูลฟาร์มง่าย ๆ | TBD | pending | Show simple overview and entry to records; avoid personal farm data. |
| 7 | Farm Records Basic | `/app/farm-records` | สมุดฟาร์มแบบง่าย | TBD | pending | Show Basic Mode and main actions. |
| 8 | Help/Profile optional | `/app/help` or `/app/profile` | วิธีเริ่มใช้และข้อมูลช่วยเหลือ | TBD | pending | Use only if support/privacy entries are final enough. |

## Final Approval

- [ ] All required screenshots captured.
- [ ] All required screenshots approved by owner.
- [ ] Captions match visible screens.
- [ ] Screenshots match store listing claims.
- [ ] Screenshots avoid personal data and unfinished labels.
- [ ] Final files are named and archived for store/PWA package use.
