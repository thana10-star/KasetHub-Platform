# Manual Price Source V1 M118

Date: 2026-05-27

## Purpose

M118 adds the first safe read-only price adapter foundation for KasetHub. The adapter starts with an owner-curated manual source so real prices can be added later with explicit source attribution while official APIs are still being verified.

No manual price rows are enabled by default. This prevents existing Home sample values or old fixture values from becoming live prices by accident.

## Implemented Files

- `src/services/prices/price.types.ts`
- `src/services/prices/price-manual-data.ts`
- `src/services/prices/manual-price-source.ts`
- `src/services/prices/price-validation.ts`
- `src/services/prices/price-source-status.ts`
- `src/services/prices/price-adapter-service.ts`

## Manual Source Behavior

The manual source is read-only in the frontend. It does not write to Supabase and does not connect to an external API.

Default state:

- `manualCommodityPriceRows` is empty.
- `manualFertilizerPriceRows` is empty.
- `/app/prices` remains source-pending.
- Home keeps the clearly labeled sample/source-pending price card.

When owner-provided real rows are added later, rows must pass validation before the UI displays them.

## Required Row Fields

Each commodity row must include:

- `id`
- `commodityCode`
- `commodityNameTh`
- `marketName`
- `unit`
- `price`
- `sourceName`
- `updatedAt`
- `fetchedAt`

Recommended fields:

- `category`
- `province`
- `sourceUrl`
- `sourceAttribution`
- `freshnessPolicy`
- `notes`

## Example Real Row Shape

```ts
{
  id: 'rice-owner-source-2026-05-27',
  commodityCode: 'rice',
  commodityNameTh: 'ข้าว',
  category: 'crop',
  marketName: 'ตลาดหรือแหล่งอ้างอิงที่ตรวจสอบแล้ว',
  province: 'กรุงเทพมหานคร',
  unit: 'บาท/ตัน',
  price: 12500,
  currency: 'THB',
  sourceName: 'ชื่อแหล่งข้อมูลจริง',
  sourceUrl: 'https://example.com/source-page',
  sourceType: 'manual',
  updatedAt: '2026-05-27T00:00:00.000Z',
  fetchedAt: '2026-05-27T01:00:00.000Z',
  freshnessPolicy: 'daily_market',
}
```

The example above is a format example only. Do not copy the sample price into production unless it is replaced with a verified real value and real source.

## Owner Workflow Later

1. Choose a verified source for each row.
2. Enter only real prices with source name, unit, updated date, and fetched date.
3. Keep source URL when available.
4. Run validation tests.
5. Verify `/app/prices` shows the row with source and stale status.
6. Verify Home shows real rows only when rows pass validation.

## Why Manual First

Manual source is safer for V1 because:

- The owner controls which data is real and approved.
- Every displayed row must carry source attribution.
- Invalid rows are hidden.
- No risky scraping is needed.
- Official APIs can still be evaluated without blocking the app structure.

## Fertilizer Status

Fertilizer remains source-pending in M118. Types and empty manual data hooks exist, but the UI does not show fertilizer price numbers until a source is verified and validation rules are expanded for fertilizer rows.

## M119 Owner Entry Note

M119 keeps live manual rows empty because no verified owner price values were supplied. It adds owner-entry templates and checklists for later use.

Use:

- `docs/prices/OWNER_MANUAL_PRICE_ENTRY_TEMPLATE_M119.md`
- `docs/prices/OWNER_PRICE_ROW_VERIFICATION_CHECKLIST_M119.md`
- `docs/prices/OWNER_CURATED_PRICE_ROWS_M119.md`

The first prepared commodity codes are `rice`, `rubber`, `cassava`, and `sugarcane`.

## M120 First Real Rows

M120 adds verified manual rows for `rice`, `rubber`, `cassava`, and `sugarcane`.

The rows remain read-only frontend data. They do not add backend writes or Supabase price writes.

Source rules added in M120:

- Use MOC/DIT Open Data values only when product ID, unit, date, and source context are clear.
- Preserve source min/max ranges instead of inventing a single midpoint.
- Mark sugarcane as seasonal/reference, not daily market price.
- Keep fertilizer source-pending until formula, package size, unit, and freshness are verified.

## M121 Home Eligibility

M121 adds:

- `showOnHome`: controls whether a validated row can appear on Home.
- `sourceDisplayName`: concise user-facing source label.

Home now shows only eligible, non-stale rows. `/app/prices` still shows all valid rows with range/reference/stale labels.

Current source display labels:

- `กรมการค้าภายใน กระทรวงพาณิชย์`
- `ข้อมูลอ้างอิงจากรัฐบาลไทย / กรมประชาสัมพันธ์`
