# M22 Crop Watch + Price Alert UX Foundation Report

## Summary

M22 adds a local-first crop watch and price alert UX foundation for KasetHub. Farmers can follow crops, store a preferred market/region context, enable simple alert preferences, see a crop-watch dashboard, and view mock price movement alerts. Everything remains local/demo only. No real price API, scraping, push notification, backend write, Supabase write, migration, or production price claim was added.

## Files Changed

- `src/services/crop-prices/crop-watch.types.ts`
- `src/services/crop-prices/crop-watch-service.ts`
- `src/hooks/useCropWatch.ts`
- `src/routes/CropWatchPage.tsx`
- `src/routes/PricesPage.tsx`
- `src/routes/PriceDetailPage.tsx`
- `src/routes/NotificationsPage.tsx`
- `src/routes/ProfilePage.tsx`
- `src/app/App.tsx`
- `src/data/mockData.ts`
- `src/types/kaset.ts`
- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/CROP_WATCH_PRICE_ALERT_UX.md`
- `docs/CROP_PRICE_DATA_SOURCE_FOUNDATION.md`
- `docs/CROP_PRICE_SOURCE_INTEGRATION_PLAN.md`
- `docs/GUEST_MEMORY_FRAMEWORK.md`
- `docs/SUPABASE_SCHEMA_DRAFT.md`
- `docs/SUPABASE_TYPE_MAPPING.md`
- `reports/milestones/M22_CROP_WATCH_PRICE_ALERT_UX_FOUNDATION_REPORT.md`

## Routes Added

- `/app/crop-watch`

## Crop Watch Model Notes

- `CropWatch` stores crop key/name, linked price fixture, preferred market/region, source label, latest demo reference price, enabled status, and alert preferences.
- `CropWatchAlertPreference` supports:
  - `price_up`
  - `price_down`
  - `target_price`
  - `weekly_summary`
- `crop-watch-service.ts` uses versioned localStorage with safe parse and migration fallback.
- `useCropWatch()` exposes watch, remove, enable/disable, alert toggle, target price, and local counts.

## Screens Updated

- `/app/prices` now shows watch status, quick alert buttons, local-only notice, and a link to `/app/crop-watch`.
- `/app/prices/:priceId` now shows a crop watch card, alert preference card, target price demo input, mock trend explanation, and safety-labeled AI CTA.
- `/app/crop-watch` shows followed crops, latest mock price, market/region, enabled status, alert preferences, edit/toggle, remove, and detail links.
- `/app/notifications` now includes mock price alerts:
  - “ราคาข้าวหอมมะลิปรับขึ้น”
  - “ราคามันสำปะหลังลดลง”
- `/app/profile` now links to crop watch and shows local watch/alert counts.

## Local-Only / Demo Notes

- Crop watch state is stored in `kasethub.cropWatch.v1`.
- Guest Memory followed topics still record broad crop interest.
- Crop Watch stores alert preferences separately because those preferences need their own versioned state.
- Mock alerts do not represent push delivery.
- Price values remain `ราคาอ้างอิง` demo/reference samples.
- Required disclaimer remains in price surfaces:

> ราคาจริงขึ้นกับพื้นที่ เกรดสินค้า ความชื้น ฤดูกาล และผู้รับซื้อ

## Documentation Updates

- Added `docs/CROP_WATCH_PRICE_ALERT_UX.md`.
- Updated README and project blueprint with M21/M22 route and boundary notes.
- Updated crop price source docs with crop watch and alert boundaries.
- Updated Guest Memory docs to explain Guest Memory vs Crop Watch local stores.
- Updated Supabase schema/type mapping docs for `crop_price_watches` and future `crop_price_alert_preferences`.

## Verification Commands

```bash
npm run lint
npm run build
```

Both passed. The production build completed with the existing Vite large chunk warning.

## Manual Route Checks

Port `5173` was already serving a different local app, so KasetHub was checked on `http://127.0.0.1:5174` with local Vite plus headless Chrome DOM checks.

Passed:

- `/app/prices`
- `/app/prices/price-rice-jasmine-105-yasothon-demo`
- `/app/crop-watch`
- `/app/notifications`
- `/app/profile`
- `/app/memory`

## Known Limitations

- No real price API.
- No scraping.
- No real push notification.
- No LINE Messaging API notification.
- No backend alert evaluation job.
- No Supabase writes or migrations.
- No cross-device sync for crop watches.
- No production price freshness checks.
- Target price is a local preference only.
- Mock alerts are static demo examples.

## Next Recommended Milestone

M23 should add the backend/admin planning layer for crop price imports and alert evaluation: source configuration, import job contract, source freshness checks, admin review, alert job contract, notification delivery consent, and correction/rollback workflow before any real price source or push channel is connected.
