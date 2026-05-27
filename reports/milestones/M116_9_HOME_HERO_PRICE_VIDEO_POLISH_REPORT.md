# M116.9 Home Hero + Price Snapshot + Latest Video Card Polish Report

## 1. Summary

M116.9 polishes the KasetHub Home dashboard top area into a denser, more premium mobile layout. The top Home stack now has a compact weather strip, a separate source-pending `ราคาวันนี้` price snapshot, visible Weather/Price CTAs, and a latest-video placeholder card.

## 2. Files Created

- `docs/ux/HOME_HERO_PRICE_VIDEO_POLISH_M116_9.md`
- `reports/milestones/M116_9_HOME_HERO_PRICE_VIDEO_POLISH_REPORT.md`

## 3. Files Modified

- `src/routes/AppHomePage.tsx`
- `src/routes/AppHomePage.test.tsx`
- `docs/ux/HOME_DASHBOARD_REDESIGN_M116_8.md`

## 4. Weather Strip Behavior

The weather panel shows location, weather summary, temperature, and rain chance. It shows a pulsing green `LIVE` badge only when the existing weather state is ready and non-fallback. Otherwise it shows `อัปเดตล่าสุด`.

## 5. Price Snapshot Behavior

The `ราคาวันนี้` card shows four Thai crop rows:

- ข้าวเปลือกหอมมะลิ
- ยางพารา
- มันสำปะหลัง
- อ้อย

The sample values and arrows are clearly labeled as source-pending with `ข้อมูลตัวอย่าง · รอเชื่อมแหล่งราคาจริง` and `ยังไม่ใช่ราคาจริง`.

## 6. Latest Video Card Behavior

Home includes `วิดีโอล่าสุดจากช่อง` with a thumbnail-style visual, safe placeholder copy, and a `ดูวิดีโอ` CTA to `/app/youtube`. It does not show fake views or engagement.

## 7. Preserved Behavior

- Bottom nav remains `/app`, `/app/prices`, `/app/community`, `/app/ai`, `/app/profile`.
- My Farm remains visible on Home and is not added back to bottom nav.
- Existing routes remain available.
- No backend behavior or security behavior changed.
- No write behavior, AI provider, Supabase writes, cloud sync, GPS, or push notifications were enabled.

## 8. No-Fake-Data Protection

- Weather does not show `LIVE` unless live mode is truly available.
- Price snapshot is visibly source-pending and not represented as real market data.
- Latest video card avoids fake views, likes, comments, or engagement.
- Community preview remains a safe CTA state on Home.

## 9. Mobile Layout Notes

The top stack is designed for a 390px mobile viewport: compact panels, 2-column metric and CTA grids, wrapping crop names, and no horizontal overflow.

## 10. Tests And Verification

- `npm run test -- AppHomePage` passed: 11 tests.
- `npm run lint` passed.
- `npm run build` passed with the existing large-bundle warning.
- `npm run test` passed: 44 test files, 396 tests.
- `git diff --check` passed with line-ending warnings only.
- Mobile browser smoke around 390px passed for `/app`, `/app/weather`, `/app/prices`, `/app/community`, `/app/ai`, and `/app/profile`.
- `/app` mobile smoke confirmed weather strip, safe live/fallback label, separate price snapshot, four crop rows, CTAs, latest video card, unchanged bottom nav, no horizontal overflow, no farm-work row, no fake Community engagement, and no unlabeled freshness claim.

## 11. Known Limitations

- Crop prices are sample/source-pending values only.
- No real price source, timestamp freshness, sparkline, or chart is implemented yet.
- Latest video is a safe placeholder until a real latest-video integration is available.

## 12. Owner Retest Steps

1. Open `/app` at about 390px wide.
2. Confirm the compact weather strip appears at the top.
3. Confirm `LIVE` is absent unless live weather is truly available.
4. Confirm `ราคาวันนี้` appears as a separate card with four crop rows.
5. Confirm the price card says it is sample/source-pending and not real price data.
6. Confirm `ดูพยากรณ์` and `เช็กราคา` are visible and usable.
7. Confirm `วิดีโอล่าสุดจากช่อง` appears without fake engagement.
8. Confirm bottom nav remains unchanged.
