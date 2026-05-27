# Fertilizer Source Matrix M123

Date: 2026-05-27

## Purpose

M123 reviews fertilizer price source options before KasetHub shows any fertilizer prices. The decision remains conservative: no fertilizer row should appear until formula, package size, unit, source, date, and local/market context are clear.

## Source Matrix

| Source name | Source URL | Source type | Formula coverage | Package size coverage | Unit | Update frequency / freshness | Province/shop context | Attribution | V1 suitability | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| data.go.th / Yasothon fertilizer average price dataset | `https://www.data.go.th/dataset/dataset_11_431` | Official open data catalog; CSV/XLS resources | Not formula-specific in verified metadata | Not explicit beyond sack-level unit | บาท/กระสอบ | Annual; metadata shows 2560-2568 title, resource last year 2567, package modified 2026-04 | จังหวัดยโสธร | data.go.th / สำนักงานจังหวัดยโสธร | Reference/history only, not V1 live price | verified | Useful to prove a public fertilizer dataset exists, but it lacks formula, package size, shop/market, and daily/monthly freshness required for live display. |
| OAE monthly fertilizer wholesale/retail article | `https://oae.go.th/home/article/469` | Official webpage/table | Search result confirms at least 46-0-0 row and wholesale/retail context | Needs direct table/export verification | Likely บาท/ตัน or บาท/กระสอบ depending table column; not safe until verified | Monthly article appears current in search result | Wholesale Bangkok / retail context appears in search result | สำนักงานเศรษฐกิจการเกษตร | Promising for later manual or adapter entry after direct table validation | needs verification | Do not add rows yet. Need owner/Codex follow-up to confirm complete formula list, units, package size, update date, and whether data can be reused in-app. |
| DIT fertilizer controls and FAQ | `https://www.dit.go.th/th/faq/general/general-questions/` | Official policy/FAQ webpage | Mentions fertilizer controls and urea market pressure, not formula price rows | No app-ready package size row | None for price rows | Policy/FAQ; not a price feed | National control context | กรมการค้าภายใน กระทรวงพาณิชย์ | Context only | not suitable | Useful for explaining controlled goods, price-display obligation, and complaint channel, but not a structured fertilizer price source. |
| DIT fertilizer stock/price situation news | `https://www.dit.go.th/th/news/press-releases/2569/ข่าวเลขท-882569-ค้าภายใน-ลงพื้นที่ตรวจคลังปุ๋ยอยุธยา-ย้ำสต็อกเพียงพอ-เร่งหาแหล่งนำเข้าใหม่-ติดตามโครงสร้างราคา-ดูแลเกษตรกรไม่ให้ได้รับผลกระทบ-13-มีนาคม-2569/` | Official news webpage | Mentions urea 46-0-0 and broad stock/price movement | No stable package-level row | Mentions per-sack movement in narrative, not a row | Event/news-based | National/warehouse context | กรมการค้าภายใน กระทรวงพาณิชย์ | Context only | not suitable | Good current situation source, but narrative news must not become live fertilizer prices. |
| DIT “ปุ๋ยถูก ยาดี ต้องที่ธงเขียว” event news | Example: `https://www.dit.go.th/` press release pages | Official event/news webpage | Event pages may list formulas and brands | Event-specific package/brand context may exist | Per sack in event copy | Event-specific | Event province/shop/brand context | กรมการค้าภายใน กระทรวงพาณิชย์ | Future event/reference only | future | Could be shown later as a clearly labeled event/promotion row if owner approves, but not as a general fertilizer market price. |
| Owner-curated manual fertilizer source | Owner-provided source URL, receipt, shop page, or official table | Manual | Any verified formula | Required before display | Required before display | Owner-defined; should be stale after owner-defined window | Required if local/shop source | Original source plus owner update date | Best practical V1 path after source proof | future | Safe first path if owner enters verified rows with formula, package size, source, updatedAt, fetchedAt, and shop/province context. |
| Fertilizer company / retailer pages | Retailer/company pages | Commercial webpage | Brand/formula-specific | Usually explicit package size | Usually explicit retail unit | Page-dependent | Shop/branch/delivery context varies | Retailer/company | Low priority | future | Only use with permission/clear terms and local context. Do not scrape uncontrolled product pages in V1. |

## M123 Decision

No fertilizer prices are added in M123.

The strongest next path is owner-curated manual fertilizer rows, but only after each row has formula, package size, unit, source URL or source evidence, source date, fetched date, and local/market context.

The data.go.th Yasothon dataset is verified as a public dataset, but it is not suitable for live V1 fertilizer display because it is annual, province-average, and not formula-specific. OAE looks promising but still needs direct table/export verification before any row can be entered.
