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
