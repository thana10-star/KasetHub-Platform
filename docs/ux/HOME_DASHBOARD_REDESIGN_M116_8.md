# M116.8 Home Dashboard Redesign

## Summary

M116.8 redesigns `/app` into a cleaner mobile dashboard for V1 use. The page now starts with a simple KasetHub header, a weather hero, a compact quick-action grid, a price preview, a Community preview, and a compact My Farm card.

## Layout Sections

1. Header
   - Shows `KasetHub` and `ผู้ช่วยเกษตรในมือถือ`.
   - Keeps notification and profile entry points visible.

2. Weather / Daily Insight hero
   - Links to `/app/weather`.
   - Uses the existing weather state when a live weather summary is available.
   - Adds a compact `ข้อมูลวันนี้` block with color-coded rows for `อากาศ`, `งานเกษตร`, and `ราคา`.
   - Adds explicit CTAs for `ดูพยากรณ์` (`/app/weather`) and `เช็กราคา` (`/app/prices`).
   - Avoids API/source/debug wording on Home.

3. Quick action grid
   - Uses 2-column mobile cards.
   - Links to AI, prices, Community, calculators, My Farm, and help/knowledge.

4. Price preview
   - Shows crop categories only: `ข้าว`, `มันสำปะหลัง`, `ยางพารา`, `ปาล์มน้ำมัน`.
   - Shows `กำลังเตรียมเชื่อมแหล่งข้อมูลราคาจริง`.
   - Does not show numeric prices before the real source is connected.

5. Community preview
   - Links to `/app/community`.
   - Uses a CTA state instead of seeded posts, likes, or comment counts.

6. My Farm card
   - Stays on Home as a compact card.
   - Links to `/app/my-farm`.
   - Uses the copy `บันทึกงาน รายรับรายจ่าย และผลผลิต`.

## Mobile Notes

- Quick actions use a 2-column grid that wraps text inside fixed cards.
- Cards use compact spacing and large enough touch targets.
- The Home page avoids horizontal scrolling at 390px.
- My Farm remains visible on Home but is not added back to bottom navigation.

## Scope Boundaries

- No backend behavior changed.
- No production Community write setting changed.
- No AI provider enabled.
- No fake price data added.
- No fake price trends or charts added.
- No fake Community posts, likes, comments, or engagement added.
- Existing route links and bottom navigation are preserved.

## Daily Insight Hero

The Home hero now includes a denser daily insight block:

- Weather row: soft blue, uses live weather values only when the existing weather hook has ready non-fallback data. Otherwise it uses `เปิดดูพยากรณ์เพื่อวางแผนวันนี้`.
- Farm work row: soft yellow for normal planning advice. It switches to soft red only when the available weather values cross high-risk thresholds such as high rain chance, high heat, or strong wind.
- Hero status badge: soft red when Home needs the user to check the Weather page for usable forecast values, or when weather values cross high-risk thresholds.
- Price row: soft orange, uses `ข้าว / มัน / ยาง / ปาล์ม กำลังเตรียมเชื่อมข้อมูลจริง` without numeric prices, trend arrows, or charts.

Future price/chart readiness is documented separately in `docs/ux/HOME_DAILY_INSIGHT_HERO_M116_8.md`. No fake chart or fake price UI is implemented in M116.8.

## Restart Verification Notes

On the continuation pass after the interrupted Codex run, the working tree already contained the core M116.8 Home redesign:

- Weather hero near the top of `/app`.
- Quick cards for AI, prices, Community, tools, My Farm, and help/knowledge.
- Price preview with category chips only, not numeric prices.
- Community preview with CTA copy only, not seeded posts or engagement.
- Compact My Farm card linking to `/app/my-farm`.
- Bottom navigation still using the existing five tabs: `/app`, `/app/prices`, `/app/community`, `/app/ai`, and `/app/profile`.

The continuation pass completed verification and documentation only. No backend behavior was changed, and production Community writes were not enabled.

Checks run during continuation:

- `npm run lint`
- `npm run build`
- `npm run test`
- `git diff --check`
- Browser route smoke on `http://127.0.0.1:5174` for `/app`, `/app/weather`, `/app/ai`, `/app/prices`, `/app/community`, `/app/calculators`, `/app/my-farm`, and `/app/profile`
- Mobile Home smoke at 390px viewport
