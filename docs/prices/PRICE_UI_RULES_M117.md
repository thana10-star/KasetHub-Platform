# Price UI Rules M117

Date: 2026-05-27

## No Real Data Available

When real price data is unavailable:

- Show source-pending state.
- Do not show numeric prices on `/app/prices`.
- Do not show fake charts.
- Do not imply freshness.
- Use clear copy such as "รอเชื่อมแหล่งราคาจริง".

## Real Data Available

When real data is available and validated:

- Show price.
- Show unit.
- Show market or source context.
- Show source name.
- Show updated date/time.
- Show stale label if stale.
- Keep source attribution near the data, not hidden only in a details page.

## Sample/Demo Data

If sample/demo data is used:

- Label it clearly as sample.
- Use Thai copy such as "ข้อมูลตัวอย่าง" and "ยังไม่ใช่ราคาจริง".
- Never mix sample rows with real rows in the same list.
- Never use sample trend arrows or chart lines without a sample label.

## Home Price Card

Before real source connection:

- Home may keep the current clearly labeled sample/source-pending state.
- The card must continue to state "ข้อมูลตัวอย่าง" and "รอเชื่อมแหล่งราคาจริง".

After real source connection:

- Home should show only the top 4 validated commodities.
- Home should include source and updated date, or link to `/app/prices` where those are immediately visible.
- Home must not mix old sample rows with real rows.

## `/app/prices`

Before source connection:

- Keep the page as a source-pending agriculture price hub.
- It may list target commodities and explain source criteria.
- It must not show fake numeric prices.

After source connection:

- Group rows by crop/category if useful.
- Show source/freshness metadata in each row or group.
- Preserve empty and error states that do not invent prices.

## Mini Charts

Mini charts are allowed only when:

- Historical data comes from the same or clearly comparable source.
- Time points have real dates.
- Units are consistent.
- The chart shows source and freshness.

Do not create fake sparklines from static sample data.

## M118 Implementation Note

M118 connects `/app/prices` and the Home price card to a read-only adapter snapshot.

- When no validated rows exist, both surfaces keep their source-pending behavior.
- When validated rows exist, `/app/prices` shows price, unit, source, updated date, and stale label.
- When validated rows exist, Home shows up to 4 real rows and does not render the sample rows in that card.
- Fertilizer remains source-pending with no fake values.

## M119 Owner-Curated Row Note

M119 keeps manual live rows empty until the owner supplies verified values. The UI integration is ready for `rice`, `rubber`, `cassava`, and `sugarcane`, but unsupported or missing commodities continue to display source-pending copy.

Home must continue to use a single mode:

- sample/source-pending mode when no validated real rows exist
- real-row mode when at least one row validates

It must never mix the two modes in the same price card.

## M120 First Real Rows

M120 introduces real-row mode in normal app usage.

Rules now active:

- `/app/prices` shows verified rows with source, unit, updated date, and stale/reference labels.
- Home shows real rows and no longer shows sample rows in the same price card.
- Rice and cassava display source-provided ranges.
- Sugarcane displays a seasonal/reference label.
- Unsupported commodities remain source-pending.
- No chart or sparkline is shown because historical data is not connected.

## M121 Home Eligibility And Labels

Home now uses explicit eligibility:

- show only `showOnHome: true`
- hide stale rows by default
- hide seasonal/reference rows unless explicitly allowed
- do not backfill fewer than 4 real rows with sample rows

`/app/prices` remains the full review surface for daily, range, stale, and reference rows.

Range rows display with an en dash and `ช่วงราคา`, for example `16,200–18,600 บาท/ตัน`.

Sugarcane is labeled `ราคาอ้างอิงตามฤดูกาล` and is hidden from Home by default.

Concise source labels are shown in UI while detailed source metadata remains stored on the row.

## M122 Market Context Polish

Home real-row mode now shows:

- commodity name
- price or range
- unit
- concise market/context label
- source display name
- updated date

Home remains compact and shows only eligible, non-stale rows. It never backfills missing real rows with sample rows.

`/app/prices` now shows fuller context:

- market/province context
- `ราคาล่าสุด`
- `ช่วงราคา` for ranges
- `ราคาอ้างอิงตามฤดูกาล` for seasonal/reference rows
- `ข้อมูลเก่า / ควรตรวจสอบอีกครั้ง` when stale
- updated/reference date and fetched/check time

`/app/prices` also includes `อ่านราคานี้อย่างไร` with short farmer-facing guidance that ranges depend on market, quality, and area, and seasonal/reference prices are not daily market prices.

## M123 Fertilizer UI Rules

Fertilizer remains source-pending until verified fertilizer rows exist.

When no verified fertilizer rows exist:

- show `ราคาปุ๋ย`
- show `ยังไม่แสดงราคา`
- do not show numeric fertilizer prices
- do not show formula rows such as `46-0-0` or `15-15-15`
- do not show package sizes or fake charts
- do not show fertilizer on Home

When verified fertilizer rows exist later, each row must show formula, package size, price/unit, source, updated date, stale label, and province/shop/market context when relevant.

See:

- `docs/prices/FERTILIZER_SOURCE_MATRIX_M123.md`
- `docs/prices/FERTILIZER_V1_DATA_RULES_M123.md`
- `docs/prices/FERTILIZER_UI_RULES_M123.md`
