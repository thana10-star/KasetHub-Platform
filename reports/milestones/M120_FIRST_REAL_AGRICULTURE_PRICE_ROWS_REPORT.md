# M120 First Real Agriculture Price Rows Report

Date: 2026-05-27

## 1. Summary

M120 verified the first usable source path and added the first real owner-curated manual agriculture price rows. The first accepted sources are MOC/DIT Open Data for rice, rubber, and cassava, plus PRD / Thai Government material for sugarcane as a seasonal/reference row.

No fake prices, risky scraping, unverified API connection, backend writes, Supabase writes, fertilizer rows, charts, Community changes, Weather changes, AI changes, or bottom-nav changes were added.

## 2. Source Verification Result

Accepted:

- MOC/DIT Open Data for rice, rubber, and cassava.
- PRD / Thai Government publication for sugarcane seasonal/reference price.

Deferred:

- NABC/OAE: useful later, but MOC/DIT had clearer product IDs and latest dated rows for M120.
- RAOT: useful later for crop-specific rubber verification; MOC/DIT was enough for the first V1 row.
- OCSB/Royal Gazette: future direct sugarcane verification path.
- Fertilizer: not verified enough for live rows.

## 3. Whether Real Rows Were Added

Yes. Four manual rows were added.

## 4. Rows Added

Fetched at `2026-05-27T18:20:00+07:00`.

- Rice: ข้าวเปลือกหอมมะลิ, MOC product `R11055`, 16,200-18,600 บาท/ตัน, updated 2026-05-27.
- Rubber: ยางแผ่นดิบชั้น 3, MOC product `W16023`, 79 บาท/ กก., สุราษฎร์ธานี, updated 2026-05-27.
- Cassava: มันสำปะหลัง, MOC product `W16031`, 3-3.55 บาท/กก., นครราชสีมา แป้ง 25%, updated 2026-05-27.
- Sugarcane: อ้อย, 890 บาท/ตันอ้อย, 10 CCS, season 2568/2569, PRD / Thai Government source dated 2026-02-10.

## 5. Rows Rejected / Deferred

- Fertilizer: deferred because no formula/package/unit/freshness source was verified.
- Additional rice/rubber/cassava variants: deferred to avoid clutter and avoid presenting too many market contexts before owner review.
- OCSB/Royal Gazette direct sugarcane source: deferred for follow-up; current row is government seasonal/reference.

## 6. Source Attribution

MOC rows use:

- `MOC Open Data / กรมการค้าภายใน`
- `ข้อมูลราคาสินค้าเกษตร กรมการค้าภายใน กระทรวงพาณิชย์`

Sugarcane row uses:

- `กรมประชาสัมพันธ์ / รัฐบาลไทย`
- `กรมประชาสัมพันธ์ / รัฐบาลไทย อ้างข้อมูลมติคณะรัฐมนตรีตามข้อเสนอกระทรวงอุตสาหกรรม`

## 7. `/app/prices` Behavior

`/app/prices` now shows validated real rows with:

- commodity name
- price or price range
- unit
- market/source context
- source name
- updated date
- reference label for sugarcane
- pending cards for unsupported commodities

## 8. Home Price Behavior

Home now switches from sample/source-pending mode to real-row mode because validated rows exist.

Home shows up to 4 real rows and does not mix sample rows in the same card.

## 9. Fertilizer Status

Fertilizer remains source-pending and guarded. No fertilizer values were added.

## 10. Tests / Checks Run

Focused tests passed:

- `npm run test -- src/services/prices/price-validation.test.ts src/services/prices/price-adapter-service.test.ts src/routes/PricesPage.test.tsx src/routes/AppHomePage.test.tsx`

Full verification passed:

- `npm run lint`
- `npm run build` - passed with the existing large chunk warning
- `npm run test` - 49 test files passed, 452 tests passed
- `git diff --check` - passed with Windows line-ending warnings only
- Route smoke for `/app/prices`, `/app`, `/app/weather`, `/app/community`, `/app/ai`, `/app/profile`
- Mobile smoke for `/app/prices` and `/app` at 390px

Route smoke notes:

- `/app/prices` showed verified M120 rows, source labels, sugarcane reference label, and guarded fertilizer.
- Home showed real-row mode with no sample/real mixing.
- `/app/weather`, `/app/community`, `/app/ai`, and `/app/profile` rendered without not-found states.

Mobile smoke notes:

- `/app/prices` at 390px had no document-level horizontal overflow.
- `/app` at 390px had no document-level horizontal overflow.
- Price/source labels were present and readable in the DOM.

## 11. Remaining Owner Actions

- Review the four real rows in staging.
- Confirm whether rice and cassava ranges are acceptable for Home or should be shown only on `/app/prices`.
- Confirm whether sugarcane seasonal/reference row should remain on Home.
- Continue official source verification for RAOT, OCSB/Royal Gazette, NABC/OAE, and fertilizer.

## 12. Next Recommended Milestone

M121 recommended:

- Add owner review controls for which real rows are eligible for Home.
- Add more precise source labels for range rows.
- Add direct OCSB/Royal Gazette sugarcane verification.
- Continue fertilizer source verification without showing fake values.
