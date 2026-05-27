# M121 Price Home Eligibility + Source Label Polish Report

Date: 2026-05-27

## 1. Summary

M121 polished the first real price rows after M120. It adds explicit Home eligibility, concise source display labels, clearer range/reference labels, and Home filtering so seasonal/reference or stale rows do not appear on Home by default.

No fake rows, new API, scraping, charts, backend writes, fertilizer rows, Community changes, Weather changes, or AI changes were added.

## 2. Files Created

- `docs/prices/PRICE_HOME_ELIGIBILITY_M121.md`
- `reports/milestones/M121_PRICE_HOME_ELIGIBILITY_SOURCE_LABEL_POLISH_REPORT.md`

## 3. Files Modified

- `src/services/prices/price.types.ts`
- `src/services/prices/price-validation.ts`
- `src/services/prices/price-adapter-service.ts`
- `src/services/prices/price-adapter-service.test.ts`
- `src/services/prices/price-validation.test.ts`
- `src/services/prices/price-manual-data.ts`
- `src/routes/AppHomePage.tsx`
- `src/routes/AppHomePage.test.tsx`
- `src/routes/PricesPage.tsx`
- `src/routes/PricesPage.test.tsx`
- `docs/prices/OWNER_CURATED_PRICE_ROWS_M119.md`
- `docs/prices/MANUAL_PRICE_SOURCE_V1_M118.md`
- `docs/prices/PRICE_UI_RULES_M117.md`
- `docs/prices/FIRST_REAL_PRICE_ROWS_M120.md`

## 4. Home Eligibility Behavior

Rows now include `showOnHome`.

Current settings:

- Rice: true
- Rubber: true
- Cassava: true
- Sugarcane: false

Home filters out stale rows and rows without `showOnHome: true`. If valid rows exist but none are eligible, Home shows safe copy and links to `/app/prices` instead of showing samples.

## 5. Source Label Behavior

Rows now include `sourceDisplayName`.

User-facing labels:

- MOC/DIT: `กรมการค้าภายใน กระทรวงพาณิชย์`
- PRD / ThaiGov: `ข้อมูลอ้างอิงจากรัฐบาลไทย / กรมประชาสัมพันธ์`

Detailed source metadata remains stored in source fields.

## 6. Range Price Behavior

Rows with `priceMax > price` display as ranges with an en dash:

- `16,200–18,600`
- `3–3.55`

`/app/prices` adds the `ช่วงราคา` label. Home includes `ช่วงราคา` next to the unit.

## 7. Reference / Seasonal Behavior

Sugarcane remains visible on `/app/prices` with `ราคาอ้างอิงตามฤดูกาล`.

Sugarcane does not appear on Home by default.

## 8. `/app/prices` Behavior

`/app/prices` still shows all valid rows:

- daily/current rows
- range rows
- seasonal/reference rows
- unsupported commodities as source-pending
- fertilizer source-pending

## 9. Home Behavior

Home shows only Home-eligible, non-stale real rows. It does not mix real rows with sample rows and does not backfill fewer than 4 real rows with sample values.

## 10. Tests / Checks Run

Focused tests passed:

- `npm run test -- src/services/prices/price-validation.test.ts src/services/prices/price-adapter-service.test.ts src/routes/PricesPage.test.tsx src/routes/AppHomePage.test.tsx`

Full verification passed:

- `npm run lint`
- `npm run build` - passed with the existing large chunk warning after rerun with a longer timeout
- `npm run test` - 49 test files passed, 454 tests passed
- `git diff --check` - passed with Windows line-ending warnings only
- Route smoke for `/app`, `/app/prices`, `/app/weather`, `/app/community`, `/app/ai`, `/app/profile`
- Mobile smoke for `/app` and `/app/prices`

Route smoke notes:

- Home showed Home-eligible real rows, concise source labels, and no sample/real mixing.
- `/app/prices` showed range and seasonal/reference labels.
- Weather, Community, AI, and Profile routes rendered without not-found states.

Mobile smoke notes:

- `/app` at 390px had no document-level horizontal overflow.
- `/app/prices` at 390px had no document-level horizontal overflow.
- Source, range, and reference labels were present in the page text.

## 11. Owner Review Items

- Confirm rice and cassava ranges are acceptable on Home.
- Confirm sugarcane should stay hidden from Home by default.
- Confirm concise source labels are clear enough for farmers.
- Decide whether future rows need a separate `homePriority` field.

## 12. Next Recommended Milestone

M122 recommended:

- Owner review of the Home price card with real rows.
- Optional Home row priority controls.
- More source-specific labels for market type and province.
- Continue fertilizer source verification without showing fake values.
