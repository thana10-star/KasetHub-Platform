# M122 Price Home Review + Market Context Polish Report

Date: 2026-05-27

## 1. Summary

M122 polished the first real agriculture price rows on Home and `/app/prices` so farmers can better understand market context, source, unit, update date, range meaning, and reference/seasonal meaning.

No new price rows, APIs, scraping, charts, fertilizer prices, backend writes, or unrelated app behavior were added.

## 2. Current Real Price Audit

| Row | Home behavior | `/app/prices` behavior | Range | Reference/seasonal | User risk reviewed |
| --- | --- | --- | --- | --- | --- |
| ข้าวเปลือกหอมมะลิ | Shows on Home | Shows full detail | Yes | No | Could look like exact price without `ช่วงราคา`; M122 keeps range label visible. |
| ยางแผ่นดิบชั้น 3 | Shows on Home | Shows full detail | No | No | Needs province context; M122 shows `สุราษฎร์ธานี`. |
| มันสำปะหลัง | Shows on Home | Shows full detail | Yes | No | Could be mistaken as generic cassava; M122 shows `นครราชสีมา · แป้ง 25% · ช่วงราคา`. |
| อ้อย | Hidden from Home | Shows full detail | No | Yes | Could be mistaken as daily market price; M122 keeps `ราคาอ้างอิงตามฤดูกาล`. |

Source labels and units were already present, but Home needed more market context and `/app/prices` needed a short explanation block.

## 3. Files Created

- `docs/prices/PRICE_MARKET_CONTEXT_POLISH_M122.md`
- `reports/milestones/M122_PRICE_HOME_REVIEW_MARKET_CONTEXT_POLISH_REPORT.md`

## 4. Files Modified

- `src/routes/AppHomePage.tsx`
- `src/routes/PricesPage.tsx`
- `src/routes/AppHomePage.test.tsx`
- `src/routes/PricesPage.test.tsx`
- `docs/prices/FIRST_REAL_PRICE_ROWS_M120.md`
- `docs/prices/PRICE_HOME_ELIGIBILITY_M121.md`
- `docs/prices/PRICE_UI_RULES_M117.md`
- `docs/prices/OWNER_CURATED_PRICE_ROWS_M119.md`

## 5. Home Price Polish

Home now shows only Home-eligible, non-stale rows and keeps sample rows out once real rows exist.

Home rows now include:

- commodity name
- price/range
- unit
- concise market context
- source display name
- updated date

Current Home context labels:

- Rice: `ช่วงราคา`
- Rubber: `สุราษฎร์ธานี`
- Cassava: `นครราชสีมา · แป้ง 25% · ช่วงราคา`

Sugarcane remains excluded from Home because it is seasonal/reference.

## 6. `/app/prices` Polish

`/app/prices` now shows fuller context per real row:

- market/province/source context
- `ราคาล่าสุด` for fresh rows
- `ช่วงราคา` for range rows
- `ราคาอ้างอิงตามฤดูกาล` for sugarcane
- `ข้อมูลเก่า / ควรตรวจสอบอีกครั้ง` for stale rows
- source display name
- updated/reference date
- fetched/check time

Unsupported commodities remain source-pending. Fertilizer remains source-pending.

## 7. Market Context Labels

M122 uses existing row fields only:

- `marketName`
- `province`
- `freshnessPolicy`
- `priceMax`
- `sourceDisplayName`
- `updatedAt`
- `fetchedAt`

No fake market context was added.

## 8. Range/Reference Explanation

Range rows continue to show an en dash and the `ช่วงราคา` label.

Sugarcane remains labeled as `ราคาอ้างอิงตามฤดูกาล` and is not presented as a daily market price.

## 9. Farmer-Facing Explanation Block

`/app/prices` now includes `อ่านราคานี้อย่างไร`:

- ราคาบางรายการเป็นช่วงราคา เพราะขึ้นกับตลาด คุณภาพ และพื้นที่
- ราคาอ้างอิงตามฤดูกาลไม่ใช่ราคาตลาดรายวัน
- ควรตรวจสอบแหล่งข้อมูลและพื้นที่จริงก่อนตัดสินใจขาย/ซื้อ

## 10. Tests/Checks Run

- `npx vitest run src/routes/AppHomePage.test.tsx src/routes/PricesPage.test.tsx` passed: 2 files, 23 tests.
- `npm run lint` passed.
- `npm run build` passed. Vite still reports the existing large bundle warning.
- `npm run test` passed: 49 files, 455 tests.
- Browser route smoke passed for `/app`, `/app/prices`, `/app/weather`, `/app/community`, `/app/ai`, and `/app/profile`.
- Mobile smoke at 390px passed for `/app` and `/app/prices`; no horizontal overflow, context/source labels readable, and no sample/real mixing.
- `git diff --check` passed.

## 11. Owner Review Items

- Confirm Home feels compact enough with rice, rubber, and cassava real rows.
- Confirm sugarcane should remain off Home while visible as seasonal/reference on `/app/prices`.
- Confirm the `อ่านราคานี้อย่างไร` copy is farmer-friendly and clear.

## 12. Next Recommended Milestone

Recommended next milestone: add fertilizer source verification or expand official price source coverage, but only after source/unit/freshness rules are verified. Do not add charts until reliable historical data exists.
