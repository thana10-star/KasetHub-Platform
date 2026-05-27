# Price Adapter Contract M117

Date: 2026-05-27

This contract describes the future source adapter boundary. It does not implement or enable any real provider.

## Interface Concept

```ts
type PriceAdapter = {
  sourceName: string;
  listSupportedCommodities(): Promise<SupportedCommodity[]>;
  fetchLatestCommodityPrices(input?: PriceFetchInput): Promise<RawPriceRow[]>;
  fetchLatestFertilizerPrices(input?: PriceFetchInput): Promise<RawPriceRow[]>;
  normalizePriceRows(rows: RawPriceRow[]): Promise<CommodityPrice[] | FertilizerPrice[]>;
  validatePriceRows(rows: Array<CommodityPrice | FertilizerPrice>): ValidationResult;
  getSourceStatus(): Promise<PriceSourceStatus>;
};
```

## Adapter Rules

- Reject rows without `sourceName`.
- Reject rows without `updatedAt`, unless the source explicitly provides same-day context and the adapter documents that rule.
- Reject rows without `unit`.
- Reject rows without `price` or with non-positive numeric price.
- Reject rows where source attribution is missing.
- Never silently convert unknown units.
- Mark rows stale if older than the source freshness threshold.
- Do not display rows if validation fails.
- Do not mix sample/demo rows with real rows.
- Log/report source errors safely without exposing raw stack traces to users.

## Source-Specific Responsibilities

Each adapter must define:

- Source URL and attribution text.
- Supported commodity codes and Thai display names.
- Supported markets or regions.
- Freshness window.
- Data format and parsing behavior.
- Rate-limit or permission notes.
- Whether the source is official, association, market, or owner-curated manual.

## Validation Result

```ts
type ValidationResult = {
  ok: boolean;
  acceptedRowCount: number;
  rejectedRowCount: number;
  errors: Array<{
    code:
      | "missing_source"
      | "missing_updated_at"
      | "missing_unit"
      | "invalid_price"
      | "stale"
      | "unknown_unit"
      | "permission_unverified"
      | "parse_error";
    message: string;
    rowId?: string;
  }>;
};
```

## Display Gate

The UI may display real prices only when:

- `ValidationResult.ok` is true.
- At least one row is accepted.
- Source status is not `unavailable`.
- Each row has source, unit, price, updated date, and stale status.

If validation fails, `/app/prices` should show the source-pending or temporarily unavailable state, not partial unreliable data.

## M118 Implementation Note

M118 adds the first concrete implementation of this contract under `src/services/prices/`.

Implemented:

- manual commodity row type
- read-only manual source list
- commodity validation
- stale marking
- manual source status
- Home and `/app/prices` view integration

Still guarded:

- fertilizer display
- official API adapters
- backend writes
- charts and historical trends
