# M118 Agriculture Price Read-Only Adapter Foundation Report

Date: 2026-05-27

## 1. Summary

M118 implemented the first safe read-only agriculture price adapter foundation. It uses an owner-curated manual source structure that starts empty by default, strict validation, stale marking, and guarded UI integration for `/app/prices` and Home.

No fake prices were promoted to live data. No risky scraping, unverified API, backend writes, Supabase price writes, charts, or unrelated product behavior were added.

## 2. Files Created

- `src/services/prices/price.types.ts`
- `src/services/prices/price-manual-data.ts`
- `src/services/prices/manual-price-source.ts`
- `src/services/prices/price-validation.ts`
- `src/services/prices/price-source-status.ts`
- `src/services/prices/price-adapter-service.ts`
- `src/services/prices/price-validation.test.ts`
- `src/services/prices/price-adapter-service.test.ts`
- `docs/prices/MANUAL_PRICE_SOURCE_V1_M118.md`
- `docs/prices/PRICE_VALIDATION_AND_STALENESS_M118.md`
- `reports/milestones/M118_AGRICULTURE_PRICE_READ_ONLY_ADAPTER_FOUNDATION_REPORT.md`

## 3. Files Modified

- `src/routes/PricesPage.tsx`
- `src/routes/PricesPage.test.tsx`
- `src/routes/AppHomePage.tsx`
- `src/routes/AppHomePage.test.tsx`
- `docs/prices/AGRICULTURE_PRICE_V1_SOURCE_STRATEGY_M117.md`
- `docs/prices/PRICE_ADAPTER_CONTRACT_M117.md`
- `docs/prices/PRICE_UI_RULES_M117.md`

## 4. Adapter Behavior

The adapter reads manual commodity rows, validates them, marks stale rows, and returns a snapshot for UI surfaces.

Default behavior:

- manual commodity rows are empty
- source status is `not_connected`
- no live prices are displayed
- fertilizer remains source-pending

## 5. Manual Source Behavior

The manual source is owner-curated and read-only. It is intended for verified real rows with explicit source names and update dates.

It intentionally does not reuse existing Home sample rows or old crop-price fixtures.

## 6. Validation / Staleness Behavior

Validation rejects rows missing source, unit, commodity name, market name, `updatedAt`, `fetchedAt`, or a positive numeric price. Estimated rows are rejected.

Freshness defaults:

- daily market: 48 hours
- weekly industry: 10 days
- seasonal reference: 180 days

Stale rows are labeled stale instead of silently converted or hidden.

## 7. `/app/prices` Behavior

When no validated rows exist, `/app/prices` keeps the source-pending state and shows no numeric prices.

When validated rows exist, `/app/prices` shows:

- commodity name
- price
- unit
- market
- source name
- updated date
- stale label when stale

Unsupported commodities remain source-pending.

## 8. Home Price Behavior

Home keeps sample/source-pending rows while no validated real rows exist.

When validated real rows exist, Home shows up to 4 real rows and does not mix them with sample rows in the price card.

## 9. Fertilizer Status

Fertilizer remains guarded and source-pending. Types and empty manual hooks exist, but no fertilizer prices are displayed.

## 10. Tests / Checks Run

Focused tests passed:

- `npm run test -- src/services/prices/price-validation.test.ts src/services/prices/price-adapter-service.test.ts src/routes/PricesPage.test.tsx src/routes/AppHomePage.test.tsx`

Full verification passed:

- `npm run lint`
- `npm run build` - passed with the existing large chunk warning
- `npm run test` - 49 test files passed, 446 tests passed
- `git diff --check` - passed with Windows line-ending warnings only
- Route smoke for `/app/prices`, `/app`, `/app/weather`, `/app/community`, `/app/ai`, `/app/profile`

Route smoke notes:

- `/app/prices` rendered source-pending pricing and guarded fertilizer pricing.
- Home rendered the sample/source-pending price card because the manual source is empty.
- No route showed a not-found state.
- No document-level horizontal overflow was detected during the smoke pass.

## 11. Remaining Owner Actions

- Choose real manual rows and sources.
- Add only verified values with source, unit, `updatedAt`, and `fetchedAt`.
- Decide whether stale rows should remain visible or be hidden in a future milestone.
- Verify fertilizer source options before enabling fertilizer price display.

## 12. Next Recommended Milestone

M119 recommended:

- Add owner-approved real manual rows or a small admin-controlled JSON import workflow.
- Add owner retest steps for real row entry.
- Optionally connect the first verified official adapter after source/API terms are confirmed.
