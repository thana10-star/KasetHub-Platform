# M116.8 Home Dashboard Redesign

## Summary

M116.8 redesigns `/app` into a cleaner mobile dashboard for V1 use. The page now starts with a simple KasetHub header, a weather hero, a compact quick-action grid, a price preview, a Community preview, and a compact My Farm card.

## Layout Sections

1. Header
   - Shows `KasetHub` and `ผู้ช่วยเกษตรในมือถือ`.
   - Keeps notification and profile entry points visible.

2. Weather / price top stack
   - Links to `/app/weather`.
   - Uses the existing weather state when a live weather summary is available.
   - M116.9 replaces the larger Daily Insight block with a compact weather strip and a separate `ราคาวันนี้` card.
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

## M116.9 Hero Polish

M116.9 supersedes the M116.8 Daily Insight block with a cleaner top stack:

- Compact weather strip: shows location, weather summary, temperature, rain chance, and a `LIVE` badge only when ready non-fallback weather mode is available. Otherwise it shows `อัปเดตล่าสุด`.
- Separate `ราคาวันนี้` card: shows clearly labeled sample/source-pending crop rows for ข้าวเปลือกหอมมะลิ, ยางพารา, มันสำปะหลัง, and อ้อย.
- Latest video card: shows a safe channel-video placeholder without fake views or engagement.

Future price/chart readiness is documented separately in `docs/ux/HOME_HERO_PRICE_VIDEO_POLISH_M116_9.md`. No real-price claim, fake chart, or fake engagement is implemented in M116.9.

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
