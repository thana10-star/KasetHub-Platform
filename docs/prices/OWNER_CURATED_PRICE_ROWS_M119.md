# Owner-Curated Price Rows M119

Date: 2026-05-27

## Summary

M119 prepares KasetHub for owner-curated real price rows, but no live real rows were added because no verified owner price values were provided in this milestone.

The manual source remains safe:

- `manualCommodityPriceRows` is empty.
- `manualFertilizerPriceRows` is empty.
- `/app/prices` remains source-pending in normal app usage.
- Home keeps the labeled sample/source-pending price card in normal app usage.

## How To Add Rows Later

1. Use `docs/prices/OWNER_MANUAL_PRICE_ENTRY_TEMPLATE_M119.md`.
2. Complete `docs/prices/OWNER_PRICE_ROW_VERIFICATION_CHECKLIST_M119.md`.
3. Add only verified rows to `src/services/prices/price-manual-data.ts`.
4. Run tests.
5. Verify `/app/prices` and Home in the browser.

## What Qualifies As Verified

A row qualifies only when it has:

- source name
- source URL when available
- market or source context
- exact unit
- exact numeric price
- `updatedAt`
- `fetchedAt`
- owner confirmation that the value is not sample/demo data

Rows missing any required field are rejected or hidden by validation.

## Stale Label Behavior

Daily market rows become stale after 48 hours. Weekly/industry rows become stale after 10 days. Seasonal/reference rows use a longer reference window.

Stale rows can still display, but the UI labels them as `ข้อมูลเก่า` so the owner and users do not mistake old data for fresh market data.

## Why Fake Prices Are Forbidden

Farmers may act on price data when planning sales, transport, and input purchases. A fake or mislabeled price can cause real financial harm. Sample rows can help the UI layout, but they must never be shown as live prices.

## Home Switching Rule

Home uses one mode at a time:

- If no validated real rows exist, Home shows sample/source-pending rows with clear labels.
- If validated real rows exist, Home shows up to four real rows and does not render sample rows in that price card.

This prevents mixing real and sample values.

## Fertilizer Status

Fertilizer remains guarded. Do not add fertilizer rows until source, formula, package size, unit, price, `updatedAt`, and `fetchedAt` are verified.

## M120 Update

M120 added the first verified manual rows for rice, rubber, cassava, and sugarcane.

- Rice, rubber, and cassava use MOC/DIT Open Data rows with source dates on 2026-05-27.
- Sugarcane uses an official government seasonal/reference source dated 2026-02-10.
- Rice and cassava show ranges because the source provides `price_min` and `price_max`.
- Home switches to real-row mode because validated rows now exist.
- Fertilizer remains source-pending.

## M121 Home Eligibility Update

M121 adds `showOnHome` and `sourceDisplayName` to manual rows.

Home eligibility:

- Rice: `showOnHome: true`
- Rubber: `showOnHome: true`
- Cassava: `showOnHome: true`
- Sugarcane: `showOnHome: false`

Home excludes stale rows and does not backfill missing real rows with sample values. Sugarcane remains visible on `/app/prices` as seasonal/reference data.

## M122 Market Context Update

M122 does not change owner-entered values or add new rows. It clarifies how existing verified rows should be read:

- Home eligible rows show concise market context and source/update text.
- Range rows must keep the `ช่วงราคา` label.
- Sugarcane remains labeled as `ราคาอ้างอิงตามฤดูกาล` and stays off Home by default.
- `/app/prices` shows source display name, updated/reference date, fetched/check time, and `อ่านราคานี้อย่างไร`.
- Owner-entered rows should keep `marketName`, `province`, `notes`, and `sourceDisplayName` accurate because these fields feed the farmer-facing context.
