# Price Validation And Staleness M118

Date: 2026-05-27

## Validation Goal

KasetHub should show agriculture prices only when a row is real, sourced, attributed, and fresh enough to be useful. Invalid rows are rejected before reaching `/app/prices` or Home.

## Commodity Validation Rules

Rows are rejected when:

- `price` is missing, not a number, or less than or equal to zero.
- `unit` is missing.
- `commodityNameTh` is missing.
- `marketName` is missing.
- `sourceName` is missing.
- `updatedAt` is missing or invalid.
- `fetchedAt` is missing or invalid.
- `isEstimated` is true.

Rows are normalized when valid:

- `currency` defaults to `THB`.
- `sourceType` defaults to `manual`.
- `trend` defaults to `unknown`.
- `isEstimated` is always `false`.
- `sourceAttribution` defaults to `sourceName` if no longer attribution text is provided.

## Staleness Rules

Default windows:

- `daily_market`: stale after 48 hours.
- `weekly_industry`: stale after 10 days.
- `seasonal_reference`: stale after 180 days unless a future source-specific rule replaces it.

Stale rows are not converted or hidden automatically in M118. They remain displayable with a stale label so the owner can see that the row is real but old. Future milestones can decide whether to hide stale rows by source.

## UI Display Rules

`/app/prices` shows real rows only when validation accepts at least one row. Each visible real row includes:

- commodity name
- price
- unit
- source name
- updated date
- stale label when stale

Home shows up to 4 validated real rows. If there are no validated real rows, Home keeps the sample/source-pending card. Home never mixes sample rows and real rows in the same price card.

## Source Status

The manual adapter reports:

- `not_connected` when no rows exist.
- `healthy` when valid rows exist and are fresh.
- `stale` when valid rows exist but at least one is stale.
- `degraded` when some rows pass and some rows are rejected.
- `unavailable` when rows exist but none pass validation.

## No Unit Guessing

The adapter does not convert unknown units. Owner-entered rows must provide the exact source unit, such as `บาท/ตัน`, `บาท/กก.`, or another verified source unit.

## Fertilizer Guard

Fertilizer validation/display remains source-pending. Fertilizer will need formula, package size, unit, source, updated date, and fetched date before numbers can be shown.
