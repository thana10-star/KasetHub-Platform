# Fertilizer V1 Data Rules M123

Date: 2026-05-27

## Decision

Fertilizer remains source-pending until a row passes strict source, unit, formula, package, and date checks.

M123 does not add fertilizer prices.

## Required Fields

Every fertilizer row must include:

- `fertilizerCode`
- `fertilizerNameTh`
- `formula`, such as `46-0-0`
- `packageSize`, such as `50 กก.`
- `unit`, such as `บาท/กระสอบ`
- `price`
- `currency`
- `sourceName`
- `sourceUrl` when available
- `sourceType`
- `sourceAttribution`
- `updatedAt`
- `fetchedAt`
- `isStale`
- `notes` when source context needs explanation

If the source is local, shop-specific, wholesale, retail, or event-specific, the row must also include the relevant province/shop/market context.

## Reject Rows When

Reject or hide a fertilizer row if:

- formula is missing
- package size is missing
- unit is missing
- source name is missing
- updated date is missing
- fetched date is missing
- price is missing or `<= 0`
- source does not clearly say whether the price is retail, wholesale, shop, province average, event promotion, or reference/history
- package size is unclear, such as “per sack” without sack size when the source does not define the sack
- a row mixes brands, formulas, or markets into one average unless the source explicitly defines that average
- the row is owner-entered but lacks source evidence

## Freshness Defaults

Recommended defaults:

- Official daily source: stale after 48 hours.
- Monthly OAE-style source: stale after 45 days.
- Annual provincial reference dataset: reference-only, not Home/live.
- Owner-curated shop/manual row: stale after 14 days unless owner sets a shorter window.
- Event/promotion row: stale after event end date or 7 days after publication if no event end is provided.

## Unit Rules

- Do not convert sack price to kg price unless package size is explicit and verified.
- Preserve the source unit in `notes` if a normalized display unit is added later.
- Use separate rows for wholesale, retail, shop price, event promotion, province average, and reference/history.
- Do not compare prices across formulas without making formula and package size visible.

## Home Eligibility

Fertilizer rows must not appear on Home until owner explicitly approves Home display in a later milestone.

The first fertilizer release should appear only on `/app/prices`, below crop prices, with source and stale labels visible.

## First Safe Implementation Path

Recommended V1 path:

1. Keep fertilizer source-pending.
2. Verify OAE/direct table or owner-curated source evidence.
3. Add manual rows only after row-level fields pass validation.
4. Show rows only on `/app/prices`.
5. Add Home eligibility later after owner review.
