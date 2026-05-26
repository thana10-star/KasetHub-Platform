# M108.2 Bottom Nav Market Price Replacement Report

## 1. Summary

M108.2 replaces the persistent bottom-navigation `ฟาร์มของฉัน` tab with `ราคาเกษตร` at `/app/prices`. My Farm remains available from Home, Profile/Help, `/app/my-farm`, and Farm Records links.

`/app/prices` is now a production-facing agriculture price hub in a source-pending state. It shows key commodity categories without fake numeric prices, fake trends, or invented update times.

## 2. Files Created

- `docs/prices/AGRICULTURE_PRICE_SOURCE_READINESS_M108_2.md`
- `reports/milestones/M108_2_BOTTOM_NAV_MARKET_PRICE_REPLACEMENT_REPORT.md`
- `src/routes/PricesPage.test.tsx`

## 3. Files Modified

- `README.md`
- `docs/CROP_PRICE_DATA_SOURCE_FOUNDATION.md`
- `docs/CROP_PRICE_SOURCE_INTEGRATION_PLAN.md`
- `docs/CROP_WATCH_PRICE_ALERT_UX.md`
- `docs/MY_FARM_HUB_FOUNDATION.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/release/V1_STORE_RELEASE_AI_FIRST_DIRECTION_M100_1.md`
- `docs/ux/ELDER_FRIENDLY_NAVIGATION_CLEANUP_M93.md`
- `src/app/App.tsx`
- `src/components/kaset/PriceRow.tsx`
- `src/components/layout/BottomNav.tsx`
- `src/data/mockData.ts`
- `src/routes/AppHomePage.tsx`
- `src/routes/AppHomePage.test.tsx`
- `src/routes/CropWatchPage.tsx`
- `src/routes/HelpPage.tsx`
- `src/routes/LandingPage.tsx`
- `src/routes/MyFarmPage.tsx`
- `src/routes/PriceDetailPage.tsx`
- `src/routes/PricesPage.tsx`
- `src/routes/ProfilePage.test.tsx`
- `src/routes/QAPage.tsx`
- `src/services/my-farm/my-farm-hub-service.ts`
- `src/services/notifications/notification-center-service.ts`
- `src/services/qa/route-registry.ts`

## 4. Bottom Nav Changes

Bottom navigation is now:

1. `หน้าแรก` -> `/app`
2. `ราคาเกษตร` -> `/app/prices`
3. `เครื่องมือ` -> `/app/calculators`
4. `ถาม AI` -> `/app/ai`
5. `โปรไฟล์` -> `/app/profile`

The `ราคาเกษตร` tab uses a price/tag icon and compact text sizing so the label fits on mobile. Browser smoke confirmed the nav no longer includes a My Farm tab.

## 5. My Farm Access Preservation

`/app/my-farm` was not removed. Farm Records, My Farm settings, local storage, export/restore, and sync-readiness sections remain intact.

My Farm remains visible as a compact Home entry and through secondary Profile/Help/Farm Records locations. The milestone does not delete My Farm data, storage, or routes.

## 6. Price Route Behavior

`/app/prices` renders the title `ราคาเกษตร` and subtitle `เช็กราคาสินค้าเกษตรและแนวโน้มเบื้องต้น`.

The page shows source-pending cards for:

- ข้าว
- ข้าวโพด
- มันสำปะหลัง
- อ้อย
- ยางพารา
- ปาล์มน้ำมัน
- พริก
- ผัก/ผลไม้

Each commodity card says the price source is being prepared and that real prices will not be shown until a data source is connected. Legacy `/app/prices/:priceId` links now render the same safe hub instead of the old sample detail page.

## 7. Real Price Data / Source Status

No real agriculture price API/source is connected yet.

M108.2 documents the required source quality, candidate source types, no-fake-price V1 rule, future adapter/cache/stale-data plan, and privacy boundary in `docs/prices/AGRICULTURE_PRICE_SOURCE_READINESS_M108_2.md`.

Legacy internal crop-price fixtures remain in the repository for planning/data-model history, but normal price routes and price-related notification copy no longer display their fake numeric values.

## 8. Tests / Checks Run

- `npm run lint` passed.
- `npm run build` passed.
- `npm run test` passed: 39 files, 338 tests.
- `git diff --check` passed.
- Route HTTP checks returned 200 for:
  - `/app`
  - `/app/prices`
  - `/app/my-farm`
  - `/app/farm-records`
  - `/app/calculators`
  - `/app/ai`
  - `/app/weather`
  - `/app/help`
  - `/app/profile`
- Browser smoke confirmed the required routes render non-empty content, the bottom nav links `ราคาเกษตร` to `/app/prices`, and `/app/prices` contains source-pending copy without fake price numbers.

## 9. Known Limitations

- No real source adapter is connected yet.
- No cache, stale-data label, source attribution display for real rows, or commodity mapping adapter exists yet.
- `npm run build` still reports the existing Vite large chunk warning after a successful build.
- Some older internal planning/admin/source files still reference legacy fixture price concepts, but normal `/app/prices` and `/app/prices/:priceId` no longer display fake prices.

## 10. Next Recommended Milestone

M108.3 should select and validate the first real agriculture price source, define the adapter contract, add source attribution/freshness labels, and keep the source-pending UI as the fallback until the adapter is trustworthy.

## Restart / Continuation Notes

At continuation time, the working tree already contained unrelated M108/M108.1 changes and partial M108.2 edits. I preserved those changes and only continued the missing M108.2 pieces.

Already present in the partial M108.2 tree:

- Bottom nav was partially changed to `ราคาเกษตร`.
- `/app/prices` had been rewritten toward source-pending content.
- Home, Help, My Farm, Crop Watch, and tests had partial price-hub updates.

Completed after restart:

- Removed the old price detail display path by making legacy detail routes fall back to the safe price hub.
- Updated stale route registry and price notification source-pending copy.
- Added/updated source-readiness docs and relevant navigation/price docs.
- Ran the full command checks and route smoke.
- Created this M108.2 report.
