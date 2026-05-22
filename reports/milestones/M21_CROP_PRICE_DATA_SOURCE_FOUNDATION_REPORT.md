# M21 Crop Price Data Source Foundation Report

## Summary

M21 adds a local-only crop price data foundation for KasetHub. The app now models crop price sources, snapshots, markets, regions, units, grades, change direction, reliability, and source status while keeping every value as demo/reference sample data. No real API calls, scraping, network imports, backend writes, Supabase writes, migrations, or production price claims were added.

## Files Changed

- `src/services/crop-prices/crop-price.types.ts`
- `src/services/crop-prices/crop-price-sources.ts`
- `src/services/crop-prices/crop-price-fixtures.ts`
- `src/services/crop-prices/crop-price-source-adapter.ts`
- `src/routes/PricesPage.tsx`
- `src/routes/PriceDetailPage.tsx`
- `src/components/kaset/PriceRow.tsx`
- `src/app/App.tsx`
- `src/data/mockData.ts`
- `src/types/kaset.ts`
- `docs/CROP_PRICE_DATA_SOURCE_FOUNDATION.md`
- `docs/CROP_PRICE_SOURCE_INTEGRATION_PLAN.md`
- `docs/SUPABASE_SCHEMA_DRAFT.md`
- `docs/SUPABASE_TYPE_MAPPING.md`
- `docs/AI_AGRICULTURE_SAFETY_POLICY.md`
- `docs/AI_BACKEND_PROXY_CONTRACT.md`
- `reports/milestones/M21_CROP_PRICE_DATA_SOURCE_FOUNDATION_REPORT.md`

## Routes Added

- `/app/prices/:priceId`

Valid mock detail route checked:

- `/app/prices/price-rice-jasmine-105-yasothon-demo`

## Crop Price Model Notes

- `CropPriceSource` prepares future source registry metadata.
- `CropPriceSnapshot` groups source/reference rows for future imports.
- `CropPriceItem` is the user-facing latest reference row consumed by screens.
- `CropPriceMarket`, `CropPriceRegion`, `CropPriceUnit`, and `CropPriceQualityGrade` keep display context explicit.
- `CropPriceChangeDirection` supports `up`, `down`, and `same`.
- The adapter exposes local filtering by search, category, source, and region/market.

## Source/Reliability Notes

Supported planned sources:

- OAE / สำนักงานเศรษฐกิจการเกษตร
- DIT / กรมการค้าภายใน
- ตลาดไท
- รายงานตลาดท้องถิ่นโดยผู้ดูแล
- รายงานราคาจากชุมชน

Reliability levels:

- `official`
- `market_reference`
- `community_unverified`
- `demo_sample`

All fixture rows carry demo/sample copy and the required disclaimer:

> ราคาจริงขึ้นกับพื้นที่ เกรดสินค้า ความชื้น ฤดูกาล และผู้รับซื้อ

## Screens Updated

- `/app/prices` now has Thai mobile-first search, category chips, source filter, region/market filter, source/reliability badges, up/down/same trend indicators, follow crop, save/bookmark, share price card, and demo notices.
- `/app/prices/:priceId` shows crop name, latest reference price, source, market/region, unit, grade, mock trend, related articles/videos, follow CTA, ask AI CTA, share, save, and a strong disclaimer.
- Home/landing compact price rows now use the new crop price item model and link to detail pages.

## Documentation Updates

- Added crop price data source foundation docs.
- Added future source integration plan with freshness, attribution, anti-misinformation, caching, backend import job, admin review, and user disclaimer rules.
- Updated Supabase schema/type mapping docs for `crop_price_sources`, `crop_price_snapshots`, `crop_price_import_jobs`, and `community_price_reports`.
- Updated AI safety/backend contract docs so price explanations must cite source label/date, say `ราคาอ้างอิง`, and never guarantee sale price.

## Verification Commands

```bash
npm run lint
npm run build
```

Both passed. The production build completed with the existing Vite large chunk warning.

## Manual Route Checks

The in-app Browser plugin was present but did not expose an available browser in this session, so route verification used local Vite plus headless Chrome DOM checks.

Passed:

- `/app/prices`
- `/app/prices/price-rice-jasmine-105-yasothon-demo`
- `/app/profile`
- `/app/memory`
- `/app/qa`

## Known Limitations

- No real OAE, DIT, ตลาดไท, market, or community price data.
- No API calls, scraping, or browser import.
- No backend import job.
- No Supabase writes or migrations.
- No admin review queue.
- No price alert engine.
- No production price freshness validation.
- Share actions use the existing user-triggered share sheet only; no automatic network request is made by price loading.

## Next Recommended Milestone

M22 should add a backend/admin planning layer for crop price imports: source configuration, import job contract, admin review workflow, stale-data policy, and correction/rollback rules before any real price source is connected.
