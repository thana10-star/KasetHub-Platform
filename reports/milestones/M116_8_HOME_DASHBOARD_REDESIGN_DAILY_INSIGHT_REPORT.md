# M116.8 Home Dashboard Redesign + Daily Insight Hero Report

## 1. Summary

M116.8 updates `/app` into a cleaner mobile agriculture dashboard and polishes the top hero into a compact daily insight card. The work stays UI/layout-only: no backend behavior, production Community writes, AI provider, Supabase writes, cloud sync, GPS, or push notifications were changed.

## 2. Owner Reference Direction

The direction follows the owner-provided modern agriculture dashboard reference without cloning it: green agricultural identity, weather at the top, compact quick cards, price visibility, Community access, AI visibility, and My Farm as a Home card rather than a bottom-nav tab.

## 3. Files Created

- `docs/ux/HOME_DAILY_INSIGHT_HERO_M116_8.md`
- `reports/milestones/M116_8_HOME_DASHBOARD_REDESIGN_DAILY_INSIGHT_REPORT.md`

## 4. Files Modified

- `src/routes/AppHomePage.tsx`
- `src/routes/AppHomePage.test.tsx`
- `docs/ux/HOME_DASHBOARD_REDESIGN_M116_8.md`

## 5. New Home Layout Sections

- Top header with KasetHub name, short tagline, notification icon, and profile icon.
- Weather / Daily Insight hero near the top.
- 2-column quick action grid for AI, prices, Community, tools, My Farm, and help/knowledge.
- Price preview with honest source-pending copy and crop categories.
- Community preview with a real CTA state.
- Compact My Farm card.

## 6. Daily Insight Hero Behavior

The hero now includes `ข้อมูลวันนี้` with three rows: `อากาศ`, `งานเกษตร`, and `ราคา`. It also has two explicit CTA buttons: `ดูพยากรณ์` to `/app/weather` and `เช็กราคา` to `/app/prices`.

## 7. Color System

- Dark green: KasetHub identity and hero base.
- Soft blue: weather row.
- Soft yellow: normal farm work planning row.
- Soft orange: price/source readiness row.
- Soft red: only for high-risk weather or warning states, including the small status badge when Home needs the user to check the Weather page before relying on daily planning.

## 8. Weather Row Behavior

The weather row uses ready non-fallback weather values from the existing weather hook when available. If Home does not have usable weather values yet, it shows `เปิดดูพยากรณ์เพื่อวางแผนวันนี้`.

## 9. Farm Advice Row Behavior

The farm advice row stays short and practical. Normal state uses `เช็กฝนก่อนพ่นยา/ให้น้ำ`; high rain, heat, or wind switches the row to warning copy and a red warning accent.

## 10. Price Row Behavior

The price row says `ข้าว / มัน / ยาง / ปาล์ม กำลังเตรียมเชื่อมข้อมูลจริง`. It does not show fake price numbers, fake trends, trend arrows, sparklines, or charts.

## 11. Quick Action Grid Behavior

The quick action grid keeps 2-column mobile cards and links to existing routes: `/app/ai`, `/app/prices`, `/app/community`, `/app/calculators`, `/app/my-farm`, and `/app/help`.

## 12. Price Preview Behavior

The price preview section still shows `กำลังเตรียมเชื่อมแหล่งข้อมูลราคาจริง` with crop categories for `ข้าว`, `มันสำปะหลัง`, `ยางพารา`, and `ปาล์มน้ำมัน`.

## 13. Community Preview Behavior

Home keeps a compact Community CTA: `อ่าน ถาม และแบ่งปันเรื่องเกษตรกับชุมชน`. It does not seed fake posts, likes, comments, counts, or engagement.

## 14. My Farm Placement

My Farm remains visible on Home as both a quick action and a compact section card. It is not added back to the bottom navigation.

## 15. Future Price/Chart Readiness

When a real price source is connected later, Home can show 2-4 key commodities, latest price, mini trend chart/sparkline, source label, updated date, and stale-data label. No chart or graph is implemented in this milestone because there is no real price source yet.

## 16. No-Fake-Data Protection

Tests guard against fake numeric prices, fake price trend arrows, fake Community engagement, and internal milestone/prototype wording on Home.

## 17. Mobile Layout Notes

The hero uses compact rows, large touch targets, and two short CTA buttons that fit a 390px mobile viewport. The bottom nav remains unchanged: `หน้าแรก`, `ราคาเกษตร`, `ชุมชน`, `ถาม AI`, `โปรไฟล์`.

## 18. Tests/Checks Run

- `npm run test -- AppHomePage` passed.
- `npm run lint` passed.
- `npm run build` passed with the existing large-bundle warning.
- `npm run test` passed: 44 test files, 394 tests.
- `git diff --check` passed with line-ending warnings only.
- Route smoke passed for `/app`, `/app/weather`, `/app/ai`, `/app/prices`, `/app/community`, `/app/calculators`, `/app/my-farm`, and `/app/profile`.
- Mobile smoke passed for `/app` at 390px: daily insight rows visible, blue/yellow/orange/red accents present, CTAs fit, no horizontal overflow, bottom nav unchanged, and no fake data.

## 19. Known Limitations

- Price data remains source-pending, so the hero and price preview intentionally show no numeric prices or charts.
- Red warning styling appears only when weather data crosses high-risk thresholds or when Home does not yet have usable ready weather values and asks the user to check the Weather page.
- Community preview does not fetch or show latest posts on Home in this milestone.

## 20. Owner Retest Steps

1. Open `/app` on a mobile viewport around 390px wide.
2. Confirm `ข้อมูลวันนี้` appears inside the weather hero.
3. Confirm the `อากาศ`, `งานเกษตร`, and `ราคา` rows are visible.
4. Confirm `ดูพยากรณ์` opens `/app/weather`.
5. Confirm `เช็กราคา` opens `/app/prices`.
6. Confirm quick cards include AI, prices, Community, tools, My Farm, and help/knowledge.
7. Confirm price areas have no numeric prices, trend arrows, or charts.
8. Confirm Community has no fake posts or fake engagement on Home.
9. Confirm bottom nav remains `หน้าแรก`, `ราคาเกษตร`, `ชุมชน`, `ถาม AI`, `โปรไฟล์`.
