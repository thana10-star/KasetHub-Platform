# Crop Price Data Source Foundation

M21 creates the crop price data foundation for KasetHub. The app still uses only local fixture data and does not call real price APIs, scrape websites, make network requests, write to a backend, or write to Supabase.

## Product Boundary

- M108.2 supersedes normal display of M21 fixture prices: farmer-facing price screens show source pending until a real source is connected.
- M21 fixture rows remain only for internal data-model testing and must not be presented as real market prices.
- No screen may present a fixture value as a real market price or show fake numeric commodity prices while source is pending.
- Every price item must show source label, date/time, market or region, unit, optional grade, reliability level, and the Thai disclaimer.
- Required disclaimer: `ราคาจริงขึ้นกับพื้นที่ เกรดสินค้า ความชื้น ฤดูกาล และผู้รับซื้อ`

## Local Files

- `src/services/crop-prices/crop-price.types.ts`
- `src/services/crop-prices/crop-price-sources.ts`
- `src/services/crop-prices/crop-price-fixtures.ts`
- `src/services/crop-prices/crop-price-source-adapter.ts`
- `src/services/crop-prices/crop-watch.types.ts`
- `src/services/crop-prices/crop-watch-service.ts`

`crop-price-source-adapter.ts` is the screen-facing boundary. It filters local fixture items by search, category, source, and region/market without any network behavior.

M22 adds crop watch preferences as a separate localStorage layer. Crop watches are user preferences over reference prices; they are not a source of price truth.

## Source Model

`CropPriceSource` stores future source identity and readiness:

- `id`
- `label`
- `shortLabel`
- `thaiName`
- `sourceType`
- `reliabilityLevel`
- `status`
- `attributionLabel`
- `plannedConnectionMethod`
- `freshnessPolicy`
- `notes`

Supported future sources:

- OAE / สำนักงานเศรษฐกิจการเกษตร
- DIT / กรมการค้าภายใน
- ตลาดไท
- รายงานตลาดท้องถิ่นโดยผู้ดูแล
- รายงานราคาจากชุมชน

## Reliability Levels

- `official`: future official agency data such as OAE or DIT.
- `market_reference`: market or local buying-point reference data.
- `community_unverified`: user/community reports before review.
- `demo_sample`: local demo data for prototype screens.

Reliability does not make a value a guaranteed sale price. When a real source is connected, the UI must still show attribution, freshness, unit, market/area, and non-guarantee copy.

## Price Item Contract

`CropPriceItem` represents a user-facing latest reference row:

- crop name and category
- source ID and source label
- reliability level
- market and region
- unit
- quality grade when available
- latest reference price
- captured date/time
- up/down/same change direction
- demo label
- summary
- disclaimer
- recent trend mock points
- related article/video IDs

## Snapshot Contract

`CropPriceSnapshot` groups imported or manually entered price items for a future backend import flow. In M21 it points only to local fixtures.

Future production snapshots should store:

- source ID
- source publish/captured time
- import job ID
- item count
- validation status
- reviewer status
- correction metadata

## UI Rules

- M108.2 supersedes the original sample-price UI for normal users.
- `/app/prices` now shows source-pending commodity cards until a real source is connected.
- `/app/prices/:priceId` remains as a legacy deep-link fallback to the same source-pending price hub.
- `/app/crop-watch` shows local followed crops, alert preferences, source-pending status, market/region, enabled status, and remove/edit controls.
- Guest Memory may store followed topics and saved price references locally.
- Crop Watch may store local alert preferences separately from Guest Memory.
- No production price claims or fake numeric commodity prices should appear in normal UI copy.

## Current Limitations

- No API calls.
- No scraping.
- No real source data.
- No backend import job.
- No Supabase tables or migrations.
- No admin review workflow.
- No real price alert engine or push notification.
- No automated freshness validation.

## M24 Admin Dashboard Connection

M24 surfaces crop price source readiness in `/app/admin` using the M21/M22 local data:

- source status counts for OAE, DIT, ตลาดไท, manual reports, and community reports
- demo price item count
- future crop price review task preview
- crop watch count from local M22 state

The admin dashboard does not approve sources, import prices, write snapshots, trigger alerts, or validate production freshness.
