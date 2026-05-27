# M116.8 Home Dashboard Redesign Report

## 1. Summary

Redesigned `/app` from an older prototype-style Home screen into a cleaner agriculture dashboard focused on weather, AI, prices, Community, tools, and My Farm. The work is UI/layout only and keeps existing routes and security behavior unchanged.

Continuation after the interrupted run found the main M116.8 Home implementation already present in the working tree. The restart pass preserved that work, verified the behavior, and updated this report and the UX note.

## 2. Owner Reference Direction

The new Home follows the owner-provided direction of a modern agriculture app dashboard: clean green styling, weather at the top, quick cards, market/price visibility, Community access, AI visibility, and My Farm as a Home card rather than a bottom-nav item.

## 3. Files Created

- `docs/ux/HOME_DASHBOARD_REDESIGN_M116_8.md`
- `reports/milestones/M116_8_HOME_DASHBOARD_REDESIGN_REPORT.md`

## 4. Files Modified

- `src/routes/AppHomePage.tsx`
- `src/routes/AppHomePage.test.tsx`
- `src/routes/home-farm-hub-model.ts`

## 5. New Home Layout Sections

- Top header: KasetHub name, tagline, notification icon, profile icon.
- Weather hero: prominent card linking to `/app/weather`.
- Quick action grid: AI, prices, Community, tools, My Farm, help/knowledge.
- Price preview: crop categories and honest pending-source copy.
- Community preview: CTA copy without seeded engagement.
- My Farm compact card: compact record-keeping CTA.

## 6. Weather Hero Behavior

The Home weather hero uses the existing weather hook. When live weather summary data is available, Home can show temperature, rain chance, and a short risk summary. When live data is not ready on the initial render, it stays honest and routes users to the Weather page without displaying API/source/debug details.

## 7. Quick Action Grid Behavior

The quick action area uses 2-column cards on mobile with existing Lucide icons only. Each card links to an existing route:

- `/app/ai`
- `/app/prices`
- `/app/community`
- `/app/calculators`
- `/app/my-farm`
- `/app/help`

## 8. Price Preview Behavior

Home does not render fake numeric prices. It shows the source-pending message `กำลังเตรียมเชื่อมแหล่งข้อมูลราคาจริง` and crop category chips for `ข้าว`, `มันสำปะหลัง`, `ยางพารา`, and `ปาล์มน้ำมัน`.

## 9. Community Preview Behavior

Home shows a compact Community CTA: `อ่าน ถาม และแบ่งปันเรื่องเกษตรกับชุมชน`. It does not seed fake posts, likes, comment counts, or engagement.

## 10. My Farm Placement

My Farm remains visible on Home as both a quick action and a compact section card. It is not added back to the bottom navigation. The bottom navigation remains `หน้าแรก`, `ราคาเกษตร`, `ชุมชน`, `ถาม AI`, `โปรไฟล์`.

## 11. Mobile Layout Notes

The new Home uses compact cards, fixed 2-column quick actions, wrapping labels, and large tap targets. Browser smoke checked `/app` at a 390px viewport with no horizontal overflow, visible bottom nav, readable cards, and My Farm present.

## 12. Tests/Checks Run

- `npm run test -- AppHomePage`
- `npm run lint`
- `npm run build`
- `npm run test`
- `git diff --check`
- Route smoke: `/app`, `/app/weather`, `/app/ai`, `/app/prices`, `/app/community`, `/app/calculators`, `/app/my-farm`, `/app/profile`
- Mobile smoke: `/app` at 390px

Continuation verification on 2026-05-27:

- `npm run lint` passed.
- `npm run build` passed with the existing large-bundle warning.
- `npm run test` passed: 44 test files, 394 tests.
- `git diff --check` passed with line-ending warnings only.
- Browser smoke used the correct KasetHub dev server at `http://127.0.0.1:5174`; port 5173 was occupied by another local Vite app.
- All requested routes rendered root content at the expected pathname with no Vite error overlay.
- Mobile Home smoke at 390px confirmed the weather hero near the top, all primary links, no horizontal overflow, unchanged bottom nav, no Mxx/readiness/debug/prototype wording, no fake price numbers, and no fake Community engagement.

## 13. Known Limitations

- Price data still waits for a real source connection, so Home intentionally shows no numeric market prices.
- Community preview does not fetch latest posts on Home in this milestone to avoid adding feed complexity or fake engagement.
- Weather live metrics depend on the existing weather mode and existing Weather service behavior.

## 14. Owner Retest Steps

1. Open `/app` on a mobile viewport around 390px wide.
2. Confirm the weather hero appears near the top and links to `/app/weather`.
3. Confirm quick cards link to AI, prices, Community, tools, My Farm, and help.
4. Confirm price preview shows categories but no numeric prices.
5. Confirm Community preview has no fake posts, likes, or comment counts.
6. Confirm My Farm appears on Home and bottom nav stays unchanged.
7. Check `/app/weather`, `/app/ai`, `/app/prices`, `/app/community`, `/app/calculators`, `/app/my-farm`, and `/app/profile`.
