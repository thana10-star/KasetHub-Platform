# Price Data Model M117

Date: 2026-05-27

This model is a planning contract for future implementation. It does not enable writes or connect a provider.

## CommodityPrice

```ts
type CommodityPrice = {
  id: string;
  commodityCode: string;
  commodityNameTh: string;
  category: "crop" | "rubber" | "sugarcane" | "fruit" | "vegetable" | "livestock" | "other";
  marketName: string;
  province?: string;
  unit: string;
  price: number;
  priceMax?: number;
  currency: "THB";
  changeAmount?: number;
  changePercent?: number;
  trend: "up" | "down" | "flat" | "unknown";
  sourceName: string;
  sourceUrl?: string;
  sourceType: "api" | "csv" | "webpage" | "pdf" | "manual" | "unknown";
  updatedAt: string;
  fetchedAt: string;
  isStale: boolean;
  isEstimated: false;
  notes?: string;
};
```

Required fields for display:

- `commodityCode`
- `commodityNameTh`
- `marketName`
- `unit`
- `price`
- `priceMax` when a source provides a min/max range
- `currency`
- `sourceName`
- `updatedAt`
- `fetchedAt`
- `isStale`
- `isEstimated`

`isEstimated` must default to `false`. Estimated prices are out of scope for V1.

## FertilizerPrice

```ts
type FertilizerPrice = {
  id: string;
  fertilizerCode: string;
  fertilizerNameTh: string;
  formula: string;
  packageSize: string;
  unit: string;
  price: number;
  currency: "THB";
  region?: string;
  province?: string;
  marketName?: string;
  shopName?: string;
  sourceName: string;
  sourceDisplayName?: string;
  sourceUrl?: string;
  sourceType: "api" | "csv" | "webpage" | "pdf" | "manual" | "unknown";
  sourceAttribution: string;
  updatedAt: string;
  fetchedAt: string;
  isStale: boolean;
  notes?: string;
};
```

Fertilizer must not be displayed without `formula`, `packageSize`, `unit`, `sourceName`, `sourceAttribution`, `updatedAt`, and `fetchedAt`.

M123 adds stricter fertilizer planning rules:

- `formula` must be visible, such as `46-0-0`.
- `packageSize` must be explicit, such as `50 กก.`.
- `unit` must be explicit, such as `บาท/กระสอบ`.
- `marketName`, `shopName`, `province`, or `region` must be kept when the source is local, shop-specific, wholesale, retail, event-specific, or province-average.
- Do not display rows where retail/wholesale/reference context is unclear.
- Annual/province-average fertilizer datasets should be reference-only, not Home/live prices.

## PriceSourceStatus

```ts
type PriceSourceStatus = {
  sourceName: string;
  status: "healthy" | "stale" | "degraded" | "unavailable" | "not_connected";
  lastSuccessAt?: string;
  lastErrorAt?: string;
  freshnessWindowHours: number;
  attribution: string;
};
```

## Freshness Rules

Recommended defaults:

- Daily government/API source: stale after 48 hours unless the source explicitly skips weekends/holidays.
- Weekly report source: stale after 10 days.
- Monthly catalog source: stale after 45 days.
- Seasonal sugarcane source: stale after the next season begins or after owner-defined season expiry.
- Manual source: stale after owner-defined expiry, default 7 days for commodity prices and 14 days for fertilizer unless a slower cadence is documented.

## Normalization Rules

- Do not silently convert unknown units.
- Preserve original unit in `notes` if a normalized unit is displayed.
- Use separate rows for farm-gate, wholesale, retail, FOB, and seasonal reference prices.
- Do not average unrelated markets unless the source already defines the average.
- Do not infer province from market name unless a verified mapping exists.
