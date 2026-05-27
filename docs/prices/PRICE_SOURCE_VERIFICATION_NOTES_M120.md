# Price Source Verification Notes M120

Date: 2026-05-27

## Verification Result

M120 verified MOC/DIT Open Data as the safest first source path for rice, rubber, and cassava manual rows. It also verified an official government sugarcane seasonal/reference source from PRD / Thai Government material.

## MOC / DIT Open Data

Status: accepted for first rows.

Verified pages:

- Product price documentation: `https://data.moc.go.th/OpenData/GISProductPrice`
- Product catalog documentation: `https://data.moc.go.th/OpenData/GISProducts`

Why accepted:

- Official Ministry of Commerce / Department of Internal Trade source.
- Documentation states daily frequency.
- Product catalog exposes product IDs.
- Price output includes unit and dated `price_list`.
- Query returned 2026-05-27 rows for the selected products.

Rows accepted:

- `R11055` ข้าวเปลือกหอมมะลิ, 16,200-18,600 บาท/ตัน.
- `W16023` ยางแผ่นดิบชั้น 3 ราคาเกษตรกรขายได้ จ.สุราษฎร์ธานี, 79 บาท/ กก.
- `W16031` มันสำปะหลัง ราคาเกษตรกรขายได้ นครราชสีมา แป้ง 25%, 3-3.55 บาท/กก.

Important caveat:

- Rice and cassava are ranges from source `price_min` and `price_max`; the app must display them as ranges.
- These are source/market-specific rows, not national averages.

## NABC / OAE

Status: deferred.

Reason:

- Potentially valuable for farm-gate context, but M120 did not need it for first rows because MOC/DIT provided clearer API output and latest dated values.
- Continue verification for broader agriculture coverage and historical context.

## RAOT

Status: deferred for V1 crop-specific source.

Reason:

- RAOT remains useful for rubber-specific verification.
- M120 used MOC/DIT for the first rubber row because the API row had clear unit, date, and product context.

## OCSB / Sugarcane

Status: partially accepted as seasonal/reference through official government publication.

Verified source:

- PRD / Thai Government page: `https://www.prd.go.th/th/content/category/detail/id/33/iid/475030`

Accepted row:

- ราคาอ้อยขั้นต้น ฤดูการผลิตปี 2568/2569, 890 บาท/ตันอ้อย, 10 CCS.

Important caveat:

- This is not a daily market price.
- It is shown as `seasonal_reference`.
- Future work should verify and link the Royal Gazette or OCSB direct publication when available.

## Fertilizer

Status: deferred.

Reason:

- No fertilizer source was verified with formula, package size, unit, updated date, and fetched date.
- Fertilizer remains source-pending.

## Owner Action Needed

- Review the four added rows in `/app/prices`.
- Confirm that MOC/DIT source context is acceptable for V1 Home display.
- Decide whether sugarcane should appear on Home or only in `/app/prices` as reference in a future refinement.
- Continue verification for NABC/OAE, RAOT, OCSB/Royal Gazette, and fertilizer.
