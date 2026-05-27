# First Real Price Rows M120

Date: 2026-05-27

## Summary

M120 added the first verified owner-curated real agriculture price rows to the read-only manual source. These rows come from official or government sources and include source URL, unit, updated date, fetched date, source context, and attribution.

No sample Home values were reused. No scraping, backend writes, Supabase writes, charts, or fertilizer rows were added.

## Rows Added

Fetched at: `2026-05-27T18:20:00+07:00`

| Commodity | Source | Source URL | Price | Unit | Source context | Updated date | Frequency/type | Home suitability | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ข้าวเปลือกหอมมะลิ | MOC Open Data / กรมการค้าภายใน | `https://dataapi.moc.go.th/gis-product-prices?product_id=R11055&from_date=2026-05-01&to_date=2026-05-27` | 16,200-18,600 | บาท/ตัน | ราคาขายส่งข้าว ผลิตภัณฑ์ข้าวและกระสอบป่าน | 2026-05-27 | Daily market/API | Yes | Uses source-provided `price_min` and `price_max`; not collapsed into a fake single value. |
| ยางแผ่นดิบชั้น 3 | MOC Open Data / กรมการค้าภายใน | `https://dataapi.moc.go.th/gis-product-prices?product_id=W16023&from_date=2026-05-01&to_date=2026-05-27` | 79 | บาท/ กก. | ราคาเกษตรกรขายได้ จ.สุราษฎร์ธานี | 2026-05-27 | Daily market/API | Yes | Source `price_min` and `price_max` were both 79. |
| มันสำปะหลัง | MOC Open Data / กรมการค้าภายใน | `https://dataapi.moc.go.th/gis-product-prices?product_id=W16031&from_date=2026-05-01&to_date=2026-05-27` | 3-3.55 | บาท/กก. | ราคาเกษตรกรขายได้ นครราชสีมา แป้ง 25% | 2026-05-27 | Daily market/API | Yes | Uses source-provided range; not labeled as nationwide cassava. |
| อ้อย | กรมประชาสัมพันธ์ / รัฐบาลไทย | `https://www.prd.go.th/th/content/category/detail/id/33/iid/475030` | 890 | บาท/ตันอ้อย | ราคาอ้อยขั้นต้น ฤดูการผลิตปี 2568/2569 ที่ความหวาน 10 CCS | 2026-02-10 | Seasonal/reference | Yes, with reference label | Not daily market price. Displayed as seasonal/reference. |

## Source Evidence

MOC/DIT Open Data:

- Product price documentation states that agricultural price data is daily and maintained by the Department of Internal Trade.
- The product price output includes `unit`, `price_min_avg`, `price_max_avg`, and a `price_list` with `date`, `price_min`, and `price_max`.
- The product catalog API was used to verify product IDs for rice, rubber, and cassava.

Government sugarcane source:

- PRD page dated `10/02/2569` cites Thai Government information.
- The page states the Cabinet approved the initial sugarcane price for the 2568/2569 production season at 890 baht per ton cane at 10 CCS.
- This row is marked `seasonal_reference`.

## Stale Status

As of fetched date `2026-05-27T18:20:00+07:00`:

- MOC daily rows updated on 2026-05-27 are not stale.
- Sugarcane is seasonal/reference and remains within the seasonal-reference freshness window.

## Rows Not Added

No fertilizer rows were added because M120 did not verify a fertilizer source with formula, package size, unit, updated date, and fetched date.

No RAOT-specific rubber row was added because the MOC/DIT Open Data row already provided a verified official rubber farm-gate row for V1. RAOT remains a future crop-specific verification path.

No NABC/OAE rows were added because MOC/DIT had clearer product IDs, units, latest dates, and API output for the first manual entry.

## No-Fake-Price Confirmation

- Existing Home sample values were not used.
- Rows are entered only from source-verified values.
- Rice and cassava display ranges because the source returned min/max values.
- Sugarcane is explicitly reference/seasonal, not daily.
- Unsupported commodities remain source-pending.
