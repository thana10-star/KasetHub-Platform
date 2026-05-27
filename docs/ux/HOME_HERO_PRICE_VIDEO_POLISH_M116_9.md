# M116.9 Home Hero + Price Snapshot + Latest Video Polish

## Summary

M116.9 makes the Home top area denser and more premium without changing backend behavior. The large green weather hero has been replaced by a compact weather strip, a separate source-pending crop price snapshot, and a safe latest-video card.

## Weather Strip

- Shows the selected location/province label.
- Shows a short weather summary from the existing weather state.
- Shows temperature and rain chance in compact metric tiles.
- Shows a green `LIVE` badge with a subtle pulse only when weather is ready and non-fallback.
- Shows `อัปเดตล่าสุด` when live mode is not truly available, so Home does not fake live status.
- Links remain available through the `ดูพยากรณ์` CTA.

## Price Snapshot

The `ราคาวันนี้` card is a sample/source-pending panel, not a real market feed.

Rows:

- `ข้าวเปลือกหอมมะลิ` - `12,800` - `▲ 1.2%`
- `ยางพารา` - `58.50` - `▼ 0.8%`
- `มันสำปะหลัง` - `3.20` - `▲ 2.1%`
- `อ้อย` - `1,120` - `▲ 0.6%`

Guardrails:

- The card says `ข้อมูลตัวอย่าง · รอเชื่อมแหล่งราคาจริง`.
- The badge says `ยังไม่ใช่ราคาจริง`.
- Up values use green and down values use red.
- No chart, sparkline, or real-price freshness claim is shown yet.

## Latest Video Card

Home now includes `วิดีโอล่าสุดจากช่อง` with:

- Thumbnail-style visual area.
- Title and short placeholder description.
- CTA `ดูวิดีโอ` linking to `/app/youtube`.
- No fake views, likes, comments, watch counts, or engagement.

## Future Readiness

The price snapshot structure is intentionally row-based so a real source can later provide:

- Real crop value.
- Source label.
- Updated timestamp.
- Stale-data state.
- Tiny sparkline/graph.

Do not add those real-data affordances until the source exists.

## Unchanged Scope

- Bottom nav remains `หน้าแรก`, `ราคาเกษตร`, `ชุมชน`, `ถาม AI`, `โปรไฟล์`.
- My Farm remains on Home cards, not bottom nav.
- No backend behavior changed.
- No new write behavior enabled.
- No AI provider enabled.
- No fake Community engagement added.
