# Store Screenshot Plan M103

## Purpose

This plan lists the V1 screenshots to capture after owner-side production and real-device mobile checks. Screenshots should show the actual app experience, not marketing mockups.

## Capture Rules

- Use a real phone or store-appropriate mobile viewport.
- Prefer production after Cloudflare Weather live env is verified.
- Keep Thai UI text readable.
- Avoid personal/private farm details.
- Hide browser/debug UI when possible.
- Do not show internal env labels, provider labels, console output, or test controls in primary screenshots.

## 1. Home

Route: `/app`

Purpose: Show the app as one clear farmer utility hub.

Suggested caption: `ถาม AI เช็กอากาศ ใช้เครื่องมือ ในแอพเดียว`

Must be visible:

- AI card or Ask AI entry near the top.
- Weather or tool entry visible enough to show daily utility.
- Bottom navigation fits.
- No crowded My Farm details on the first screen.

## 2. Ask AI

Route: `/app/ai`

Purpose: Show that farmers can ask agriculture questions in Thai.

Suggested caption: `ถาม AI เกษตร เรื่องพืช ดิน ปุ๋ย โรค และแมลง`

Must be visible:

- Main AI input or question area.
- Example prompts or farmer-friendly guidance.
- Safety note or clear reminder to verify important advice.
- No real provider/debug configuration exposed as the main UI.

## 3. Weather

Route: `/app/weather`

Purpose: Show weather and agriculture planning value.

Suggested caption: `เช็กอากาศและความเสี่ยงเกษตร`

Must be visible:

- Forecast summary.
- Rain/temperature/wind or agriculture risk information.
- Clear readable Thai labels.
- No GPS prompt.
- No env/provider/debug labels in the primary farmer UI.

## 4. Tools / Calculators

Route: `/app/calculators`

Purpose: Show practical tools for daily farm planning.

Suggested caption: `เครื่องมือคำนวณสำหรับเกษตรกร`

Must be visible:

- Calculator list or main calculator controls.
- Crop/planning context if available.
- Buttons and fields large enough to read.
- No dangerous pesticide dosage promise.

## 5. My Farm

Route: `/app/my-farm`

Purpose: Show simple farm tracking without making V1 feel like a complex management suite.

Suggested caption: `บันทึกฟาร์ม รายรับรายจ่าย และผลผลิต`

Must be visible:

- My Farm overview.
- Entry points to basic records.
- Clean first screen without dense analytics.
- Local-first or sync-off copy if visible.

## 6. Farm Records Basic Mode

Route: `/app/farm-records`

Purpose: Show the simplest record-keeping path.

Suggested caption: `สมุดฟาร์มแบบง่าย เริ่มจาก 3 ปุ่มหลัก`

Must be visible:

- Basic Mode heading or simple record-keeping surface.
- Three main actions: add plot, income/expense, harvest/production.
- Advanced controls lower on the page or not dominant.
- No schema/storage/debug language in the primary screenshot.

## 7. Help / Profile

Routes:

- `/app/help`
- `/app/profile`

Purpose: Show that users have guidance and settings/support entry points.

Suggested caption: `ใช้งานง่าย พร้อมคำแนะนำสำหรับเริ่มต้น`

Must be visible:

- Help/start guide or Profile/settings content.
- Contact/support placeholder only if it is final enough for release.
- Privacy/data-control entry if present.
- No unfinished internal-only tools as the main screenshot focus.

## Screenshot Approval Checklist

- [ ] All screenshots are from the final release build or production URL.
- [ ] Text is readable on phone-size images.
- [ ] No personal data or secrets are visible.
- [ ] No horizontal scroll or clipped bottom nav is visible.
- [ ] Screenshots match the store listing claims.
- [ ] Captions avoid guaranteed results, official warnings, and expert replacement claims.

