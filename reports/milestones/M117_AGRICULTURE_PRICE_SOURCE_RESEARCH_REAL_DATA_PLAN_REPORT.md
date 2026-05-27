# M117 Agriculture Price Source Research + Real Price Data Plan Report

Date: 2026-05-27

## 1. Summary

M117 audited the current price experience, verified candidate Thai crop and fertilizer price sources, and created the real-price foundation docs for a future implementation milestone. No real data provider was connected, no fake live prices were added, and no backend behavior changed.

## 2. Current Price System Audit

Price-related routes:

- `/app/prices`
- `/app/prices/:priceId`, currently falls back to the source-pending prices hub
- `/app/crop-watch`

Where fixtures/mock rows still exist:

- `src/services/crop-prices/crop-price-fixtures.ts` contains demo/reference rows and trend points for internal/test/source-adapter behavior.
- `src/services/crop-prices/crop-price-sources.ts` and `src/services/crop-prices/crop-price-source-adapter.ts` still use fixture-backed source behavior.
- `src/data/mockData.ts` re-exports crop price fixture items for legacy/internal use.
- `src/routes/AppHomePage.tsx` has sample "ราคาวันนี้" rows for ข้าว, ยาง, มัน, and อ้อย.

User-facing fake-price status:

- `/app/prices` does not show fake numeric live prices.
- `/app/crop-watch` remains source-pending and does not show live price numbers.
- Home shows numeric sample rows, but they are clearly labeled "ข้อมูลตัวอย่าง", "รอเชื่อมแหล่งราคาจริง", "ยังไม่ใช่ราคาจริง", and "ตัวอย่างราคา".

Existing source-readiness docs:

- `docs/CROP_PRICE_DATA_SOURCE_FOUNDATION.md`
- `docs/CROP_PRICE_SOURCE_INTEGRATION_PLAN.md`
- `docs/CROP_WATCH_PRICE_ALERT_UX.md`
- `docs/prices/AGRICULTURE_PRICE_SOURCE_READINESS_M108_2.md`

What should remain guarded:

- Do not let fixture rows power `/app/prices` as live data.
- Do not mix Home sample rows with real rows after source connection.
- Keep trend arrows/charts out of real UI until historical real data exists.

First implementation target:

- Prefer official/open sources first: MOC Open Data for covered product codes, NABC/OAE Farm Plus if an approved export/API path exists, then crop-specific official sources such as RAOT and OCSB.
- If no stable API is ready, use an owner-curated manual JSON/table with explicit source URL, updated date, unit, and stale label.

## 3. Files Created

- `docs/prices/AGRICULTURE_PRICE_SOURCE_MATRIX_M117.md`
- `docs/prices/AGRICULTURE_PRICE_V1_SOURCE_STRATEGY_M117.md`
- `docs/prices/PRICE_DATA_MODEL_M117.md`
- `docs/prices/PRICE_ADAPTER_CONTRACT_M117.md`
- `docs/prices/PRICE_UI_RULES_M117.md`
- `docs/prices/FERTILIZER_PRICE_SOURCE_PLAN_M117.md`
- `reports/milestones/M117_AGRICULTURE_PRICE_SOURCE_RESEARCH_REAL_DATA_PLAN_REPORT.md`

## 4. Files Modified

- None outside the new M117 docs/report.

## 5. Source Candidate Matrix Summary

Verified strong candidates:

- MOC Open Data DIT agricultural price API and product catalog: official, daily, API-documented.
- data.go.th OAE daily agricultural price dataset: official open-data catalog with CSV/XML/JSON/Data API, but freshness metadata requires caution.
- NABC/OAE catalog: official CSV/PDF/XLSX catalog with monthly farmer-price datasets for selected commodities.
- DIT agriculture reports and price-list pages: official references, useful as backup and source evidence.
- RAOT rubber price pages: official crop-specific rubber source candidate.
- Thai Tapioca Starch Association weekly starch price: useful industry signal, not farm-gate cassava.
- OCSB open data catalog: official sugarcane/sugar seasonal source candidate.

Needs further verification:

- NABC/OAE Farm Plus data export/API terms.
- DIT price-list endpoint terms.
- Fertilizer datasets from data.go.th/OAE and whether they are fresh enough for V1.

## 6. Recommended V1 Source Strategy

Phase 1: keep source-pending UI and no fake live prices.

Phase 2: connect first 1-2 reliable sources for ข้าว, ยางพารา, มันสำปะหลัง, and อ้อย with source labels, updated date, and stale handling.

Phase 3: add fertilizer prices only after a source is verified or owner-curated manual data is prepared.

Phase 4: add regional/province views and charts only after reliable historical real data exists.

## 7. Crop/Product Price Plan

- ข้าว: start with MOC Open Data product codes and OAE/NABC monthly/farm-gate context.
- ยางพารา: verify RAOT stable access for central market/local/FOB price rows.
- มันสำปะหลัง: use OAE/NABC farm-gate monthly data and verify whether a fresher source exists; association starch prices can be context only.
- อ้อย: use OCSB seasonal/annual official prices and label as seasonal/reference, not daily market price.
- ปาล์มน้ำมัน, ข้าวโพด, พริก, ผัก/ผลไม้: add only after source coverage and units are verified.

## 8. Fertilizer Price Plan

Fertilizer should remain source-pending until verified. Candidate direction is DIT/OAE/data.go.th official sources, but package size, formula, province/shop, and freshness must be explicit. Owner-curated manual data is acceptable for V1 if clearly attributed and update-aware.

## 9. Data Model

Defined planning models for:

- `CommodityPrice`
- `FertilizerPrice`
- `PriceSourceStatus`

The model requires source, unit, updated date, fetched date, stale status, and default `isEstimated: false`.

## 10. Adapter Contract

Defined future adapter functions:

- `listSupportedCommodities()`
- `fetchLatestCommodityPrices()`
- `fetchLatestFertilizerPrices()`
- `normalizePriceRows()`
- `validatePriceRows()`
- `getSourceStatus()`

Validation rejects rows without source, unit, valid price, updated date, or attribution.

## 11. UI / No-Fake-Data Rules

Rules were documented for:

- Source-pending state with no numeric prices on `/app/prices`.
- Real rows requiring source, unit, updated date, and stale labels.
- Sample rows requiring explicit sample labels.
- No fake charts or sparklines.
- Home must not mix sample and real rows after source connection.

## 12. Tests / Checks Run

Passed:

- `npm run lint`
- `npm run build`
- `npm run test` - 47 test files passed, 435 tests passed
- `git diff --check`
- Route smoke for `/app/prices`, `/app`, `/app/weather`, `/app/community`, `/app/ai`, `/app/profile`

Route smoke notes:

- `/app/prices` rendered the source-pending price hub with "รอเชื่อมแหล่งข้อมูลจริง" and "ยังไม่แสดงราคาจริง".
- No route showed a not-found state.
- No document-level horizontal overflow was detected during the smoke pass.

## 13. Remaining Owner Decisions

- Pick the first source to implement: MOC API, NABC/OAE, RAOT/OCSB crop-specific, or owner-curated manual.
- Decide whether V1 should prioritize farm-gate, wholesale, retail, or clearly separate each type.
- Approve freshness windows per source.
- Decide whether fertilizer starts as manual-curated source or remains source-pending longer.
- Confirm attribution wording and any API/rate-limit requirements.

## 14. Next Recommended Milestone

M118 recommended:

- Implement a read-only price adapter for one approved source.
- Add strict validation and stale handling.
- Replace Home sample rows only when validated real data exists.
- Keep `/app/prices` source-pending for unsupported commodities.
- Add tests ensuring sample data is never displayed as live.
