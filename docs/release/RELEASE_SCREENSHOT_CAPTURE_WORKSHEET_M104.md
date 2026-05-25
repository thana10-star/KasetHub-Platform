# Release Screenshot Capture Worksheet M104

## Purpose

Use this worksheet to capture release/store screenshots after production deploy and mobile route QA are clean.

Capture from the production URL when possible. Do not use screenshots that show debug tools, personal data, private farm details, secrets, or unfinished owner-only controls as the main focus.

## Recommended Capture Setup

- Android phone portrait first.
- Use production URL.
- Avoid browser address bar if possible.
- Keep Thai text visible and readable.
- Use clean sample data only.
- Avoid personal farm, income, cost, phone, email, or location details.
- No debug/dev text in the visible screenshot.
- No GPS prompt, camera prompt, notification prompt, or upload prompt.
- Capture extra versions only after the main portrait screenshots are complete.

## Screenshot Worksheet

| # | Screenshot | Route | Target device | Orientation | What to show | Caption | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Home | `/app` | Android phone | Portrait | Ask AI entry, Weather/Tools signal, bottom nav fitting | `ถาม AI เช็กอากาศ ใช้เครื่องมือ ในแอพเดียว` | [ ] | |
| 2 | AI | `/app/ai` | Android phone | Portrait | AI input/question area, example prompts, safety note | `ถาม AI เกษตร เรื่องพืช ดิน ปุ๋ย โรค และแมลง` | [ ] | |
| 3 | Weather | `/app/weather` | Android phone | Portrait | Live forecast, rain/temperature/wind or agriculture risk, readable labels | `เช็กอากาศและความเสี่ยงเกษตร` | [ ] | |
| 4 | Tools | `/app/calculators` | Android phone | Portrait | Calculator list or main tools area, clear tap targets | `เครื่องมือคำนวณสำหรับเกษตรกร` | [ ] | |
| 5 | Plant Spacing Or Fertilizer Calculator | `/app/calculators/plant-spacing` or `/app/calculators/fertilizer` | Android phone | Portrait | One useful calculator screen with fields/results readable | `วางแผนระยะปลูกหรือปุ๋ยเบื้องต้น` | [ ] | |
| 6 | My Farm | `/app/my-farm` | Android phone | Portrait | Simple farm overview and entry to records | `บันทึกฟาร์ม รายรับรายจ่าย และผลผลิต` | [ ] | |
| 7 | Farm Records | `/app/farm-records` | Android phone | Portrait | Basic Mode and three main actions | `สมุดฟาร์มแบบง่าย เริ่มจาก 3 ปุ่มหลัก` | [ ] | |
| 8 | Help / Profile Optional | `/app/help` or `/app/profile` | Android phone | Portrait | Help/start guide or settings/support/privacy entry | `ใช้งานง่าย พร้อมคำแนะนำสำหรับเริ่มต้น` | [ ] | |

## Per-Screenshot Approval

For every screenshot:

- [ ] Route loaded from production URL.
- [ ] Thai text is readable.
- [ ] No horizontal clipping is visible.
- [ ] Bottom navigation is not cut off.
- [ ] No browser/debug/dev text is visible.
- [ ] No personal data is visible.
- [ ] Caption matches what appears on screen.
- [ ] Screenshot does not imply official warnings, guaranteed AI accuracy, guaranteed yield/profit, or expert replacement.

## Optional Additional Captures

Only after the main screenshots are approved:

- [ ] Tablet portrait.
- [ ] Android phone with larger font.
- [ ] PWA/home-screen installed view, if release path uses PWA.
- [ ] Android wrapper view, if wrapper path is later approved.

