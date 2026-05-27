# Owner Manual Price Entry Template M119

Date: 2026-05-27

## Purpose

Use this template when the owner is ready to add real manually curated agriculture price rows. Do not use placeholder values as live data.

M119 did not receive verified owner price values, so live manual rows remain empty.

## Required Fields Per Row

Each row must provide:

- `commodityCode`: stable English code such as `rice`, `rubber`, `cassava`, or `sugarcane`
- `commodityNameTh`: Thai display name
- `category`: `crop`, `rubber`, `sugarcane`, or another supported category
- `marketName`: market, agency, buying point, or official context
- `province`: optional when the source is regional
- `unit`: exact source unit, for example `บาท/ตัน` or `บาท/กก.`
- `price`: numeric value copied from the source
- `currency`: `THB`
- `trend`: optional, `up`, `down`, `flat`, or `unknown`
- `changeAmount`: optional, only if source provides it
- `changePercent`: optional, only if source provides it
- `sourceName`: exact source name
- `sourceUrl`: source page URL when available
- `sourceType`: `manual`, `api`, `csv`, `webpage`, `pdf`, or `unknown`
- `sourceAttribution`: attribution text shown or stored with the row
- `updatedAt`: when the source says the price was updated
- `fetchedAt`: when the owner copied or checked the row
- `notes`: optional context such as quality grade, moisture, market type, or caveat

## First Supported Commodity Codes

- `rice` / ข้าว
- `rubber` / ยางพารา
- `cassava` / มันสำปะหลัง
- `sugarcane` / อ้อย

Not all four need data. The UI shows only rows that pass validation.

## Placeholder Example Only

Do not use this as live data.

```ts
{
  id: 'rice-source-yyyy-mm-dd',
  commodityCode: 'rice',
  commodityNameTh: 'ข้าว',
  category: 'crop',
  marketName: 'ชื่อแหล่ง/ตลาดที่ตรวจสอบแล้ว',
  province: 'จังหวัดถ้ามี',
  unit: 'บาท/ตัน',
  price: 0,
  currency: 'THB',
  trend: 'unknown',
  sourceName: 'ชื่อแหล่งข้อมูลจริง',
  sourceUrl: 'https://example.com/source',
  sourceType: 'manual',
  sourceAttribution: 'ข้อความอ้างอิงแหล่งข้อมูล',
  updatedAt: 'YYYY-MM-DDT00:00:00.000Z',
  fetchedAt: 'YYYY-MM-DDT00:00:00.000Z',
  notes: 'รายละเอียดเกรดหรือเงื่อนไขจากแหล่งข้อมูล',
}
```

## Entry Rules

- Do not enter a row without opening and checking the source.
- Do not enter sample, guessed, averaged, or remembered prices.
- Do not change units unless the source explicitly provides the converted unit.
- Do not mix source types in one row.
- Use one row per commodity, market, grade, and unit.
- Leave unsupported commodities source-pending.
- Leave fertilizer empty until formula, package size, unit, source, `updatedAt`, and `fetchedAt` are verified.
