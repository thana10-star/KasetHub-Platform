# M119 Owner-Curated Real Price Rows V1 Report

Date: 2026-05-27

## 1. Summary

M119 prepared the owner-curated real price row workflow for KasetHub V1. No live real rows were added because the milestone prompt did not include verified owner price values with source, unit, `updatedAt`, `fetchedAt`, and attribution.

The manual source remains safe and empty by default.

## 2. Whether Real Owner Rows Were Added

No real owner rows were added.

Reason: no verified real values were provided in this milestone. Adding rows without source-confirmed values would violate the no-fake-price rule.

## 3. Files Created

- `docs/prices/OWNER_MANUAL_PRICE_ENTRY_TEMPLATE_M119.md`
- `docs/prices/OWNER_PRICE_ROW_VERIFICATION_CHECKLIST_M119.md`
- `docs/prices/OWNER_CURATED_PRICE_ROWS_M119.md`
- `reports/milestones/M119_OWNER_CURATED_REAL_PRICE_ROWS_REPORT.md`

## 4. Files Modified

- `src/services/prices/price-manual-data.ts`
- `src/routes/PricesPage.test.tsx`
- `src/routes/AppHomePage.test.tsx`
- `docs/prices/MANUAL_PRICE_SOURCE_V1_M118.md`
- `docs/prices/PRICE_VALIDATION_AND_STALENESS_M118.md`
- `docs/prices/PRICE_UI_RULES_M117.md`

## 5. Manual Price Input Format

Owner rows must include:

- commodity code and Thai name
- category
- market/source context
- unit
- numeric price
- currency
- source name
- source URL when available
- source type
- `updatedAt`
- `fetchedAt`
- optional notes, trend, and change values only when provided by the source

The prepared first commodity codes are `rice`, `rubber`, `cassava`, and `sugarcane`.

## 6. Validation Behavior

Existing validation remains strict:

- missing source rows are rejected
- missing `updatedAt` rows are rejected
- price <= 0 is rejected
- missing unit/name/market/fetched date is rejected
- stale valid rows are marked stale

M119 adds UI guard tests for invalid and stale row behavior.

## 7. `/app/prices` Behavior

Normal behavior remains source-pending because no live rows were added.

When tests inject valid rows, `/app/prices` shows price, unit, source, updated date, and stale label when applicable. Invalid rows are hidden and do not trigger live price display.

## 8. Home Price Behavior

Normal behavior remains sample/source-pending because no live rows were added.

When tests inject valid rows, Home switches to real-row mode and does not render sample rows in the same card. Invalid rows keep Home in sample/source-pending mode.

## 9. Fertilizer Status

Fertilizer remains guarded and source-pending. No fertilizer prices were added.

## 10. Tests / Checks Run

Focused tests passed:

- `npm run test -- src/routes/PricesPage.test.tsx src/routes/AppHomePage.test.tsx src/services/prices/price-validation.test.ts src/services/prices/price-adapter-service.test.ts`

Full verification passed:

- `npm run lint`
- `npm run build` - passed with the existing large chunk warning
- `npm run test` - 49 test files passed, 450 tests passed
- `git diff --check` - passed with Windows line-ending warnings only
- Route smoke for `/app/prices`, `/app`, `/app/weather`, `/app/community`, `/app/ai`, `/app/profile`

Route smoke notes:

- `/app/prices` remained source-pending with guarded fertilizer pricing.
- Home remained in sample/source-pending mode because live manual rows are empty.
- No route showed a not-found state.
- No document-level horizontal overflow was detected during route smoke.

## 11. Owner Actions Needed

- Open source URL for each intended row.
- Copy price and unit exactly.
- Confirm updated date and market/source context.
- Add only verified rows to the manual data file.
- Run tests and browser smoke before deploy.
- Keep fertilizer empty until source/unit/package data is verified.

## 12. Next Recommended Milestone

M120 recommended:

- Owner supplies the first verified row set.
- Add rows for one or more of rice, rubber, cassava, and sugarcane.
- Capture owner source notes/screenshots.
- Run production-like smoke to confirm Home and `/app/prices` switch to real-row mode safely.
