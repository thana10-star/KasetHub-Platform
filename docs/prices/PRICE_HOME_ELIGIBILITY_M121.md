# Price Home Eligibility M121

Date: 2026-05-27

## Purpose

M121 keeps Home trustworthy now that real price rows exist. Home should show only rows that are useful as current, compact, farmer-facing price signals. Detailed, stale, seasonal, and reference rows can still appear on `/app/prices`.

## Row Fields

M121 adds two row-level fields:

- `showOnHome`: explicit Home eligibility flag.
- `sourceDisplayName`: concise source label for UI display.

The full source details remain in `sourceName`, `sourceUrl`, `sourceType`, and `sourceAttribution`.

## Current Home Eligibility

| Commodity | showOnHome | Reason |
| --- | --- | --- |
| ข้าวเปลือกหอมมะลิ | true | Daily MOC/DIT row with clear date, unit, and range. |
| ยางแผ่นดิบชั้น 3 | true | Daily MOC/DIT row with clear date and unit. |
| มันสำปะหลัง | true | Daily MOC/DIT row with clear date, unit, and range. |
| อ้อย | false | Seasonal/reference row, not a daily market price. |

## Home Rules

- Home shows only rows with `showOnHome: true`.
- Home excludes stale rows.
- Home does not show seasonal/reference rows unless explicitly allowed later.
- Home shows a maximum of 4 real rows.
- Home never backfills missing real rows with sample rows.
- If valid rows exist but none are Home-eligible, Home shows a safe prompt to open `/app/prices`.
- If no valid rows exist, Home may show the existing sample/source-pending card.

## `/app/prices` Rules

`/app/prices` can show all validated rows:

- Home-eligible rows.
- Range rows.
- Stale rows with stale labels.
- Seasonal/reference rows with reference labels.
- Unsupported commodities as source-pending cards.

## Source Labels

User-facing labels:

- MOC/DIT rows: `กรมการค้าภายใน กระทรวงพาณิชย์`
- PRD / ThaiGov row: `ข้อมูลอ้างอิงจากรัฐบาลไทย / กรมประชาสัมพันธ์`

Detailed source names and URLs remain stored with each row.

## Range Labels

Rows with `priceMax > price` render as a range, for example:

- `16,200–18,600 บาท/ตัน`
- label: `ช่วงราคา`

The UI must not collapse ranges into a midpoint or imply one exact price.

## Reference Labels

Sugarcane remains visible on `/app/prices` but hidden from Home by default.

Labels:

- `ราคาอ้างอิงตามฤดูกาล`
- notes clarify that it is not a daily market price.

## Fertilizer

Fertilizer remains source-pending and guarded. M121 does not add fertilizer rows.
