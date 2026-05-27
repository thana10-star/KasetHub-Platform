# Price Market Context Polish M122

Date: 2026-05-27

## Summary

M122 polishes how the first real agriculture price rows appear on Home and `/app/prices`. It does not add new price rows, providers, scraping, charts, fertilizer prices, backend writes, or fake data.

The goal is farmer-facing clarity: every displayed price should show what market/source context it belongs to, whether it is a range, whether it is a seasonal/reference value, which source it came from, and when it was updated.

## Current Real Row Audit

| Row | Home | `/app/prices` | Range | Reference/seasonal | Market context |
| --- | --- | --- | --- | --- | --- |
| ข้าวเปลือกหอมมะลิ | Yes | Yes | Yes | No | ราคาขายส่งข้าว ผลิตภัณฑ์ข้าวและกระสอบป่าน |
| ยางแผ่นดิบชั้น 3 | Yes | Yes | No | No | ราคาเกษตรกรขายได้ · สุราษฎร์ธานี |
| มันสำปะหลัง | Yes | Yes | Yes | No | นครราชสีมา · แป้ง 25% |
| อ้อย | No | Yes | No | Yes | ราคาอ้อยขั้นต้น ฤดูการผลิตปี 2568/2569 · 10 CCS |

## Home Display Rule

Home stays compact and trustworthy:

- Show only rows with `showOnHome: true`.
- Exclude stale rows by default.
- Hide seasonal/reference rows by default.
- Show at most 4 real rows.
- Do not backfill missing Home rows with sample values.
- Show commodity name, price/range, unit, concise context label, source, and updated date.
- Keep the CTA to `/app/prices` so farmers can review full context.

Current Home rows:

- ข้าวเปลือกหอมมะลิ: `ช่วงราคา`
- ยางแผ่นดิบชั้น 3: `สุราษฎร์ธานี`
- มันสำปะหลัง: `นครราชสีมา · แป้ง 25% · ช่วงราคา`

Sugarcane stays off Home because it is a seasonal/reference row, not a daily market signal.

## `/app/prices` Display Rule

`/app/prices` can show all validated rows, including reference and seasonal rows, but each row must include:

- commodity name
- price or price range
- unit
- market/province/source context
- concise source display name
- updated/reference date
- fetched/check time
- `ราคาล่าสุด`, `ช่วงราคา`, `ราคาอ้างอิงตามฤดูกาล`, or stale label as applicable

Unsupported commodities remain source-pending. Fertilizer remains source-pending.

## Range Price Meaning

Rows with `priceMax > price` are shown as ranges with an en dash, for example:

- `16,200–18,600 บาท/ตัน`
- `3–3.55 บาท/กก.`

The UI labels these rows with `ช่วงราคา`. KasetHub must not collapse the range into a midpoint or imply one exact market price.

## Seasonal/Reference Meaning

Sugarcane is labeled `ราคาอ้างอิงตามฤดูกาล`.

It is shown on `/app/prices` because it is verified and useful context, but it is not shown on Home by default because it is not a daily market price.

## Farmer-Facing Explanation Copy

`/app/prices` includes the short block `อ่านราคานี้อย่างไร`:

- ราคาบางรายการเป็นช่วงราคา เพราะขึ้นกับตลาด คุณภาพ และพื้นที่
- ราคาอ้างอิงตามฤดูกาลไม่ใช่ราคาตลาดรายวัน
- ควรตรวจสอบแหล่งข้อมูลและพื้นที่จริงก่อนตัดสินใจขาย/ซื้อ

## No-Fake-Data Rule

M122 does not add any new data. It only improves display rules for already verified rows. Sample Home values must never mix with real rows, and fertilizer remains guarded until a verified source is approved.
