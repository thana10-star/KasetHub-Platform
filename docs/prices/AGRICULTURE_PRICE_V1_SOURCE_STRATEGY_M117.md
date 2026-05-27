# Agriculture Price V1 Source Strategy M117

Date: 2026-05-27

## Recommendation

KasetHub V1 should continue to treat price data as source-pending until at least one reliable, attributed, update-aware source is connected through a validation adapter. The app must not display demo prices as live market prices.

## Phase 1: Source-Pending Foundation

- Keep `/app/prices` in a source-pending state.
- Keep Home price rows clearly labeled as sample/source-pending while no real source is connected.
- Do not show numeric prices on `/app/prices` until rows include `sourceName`, `updatedAt`, `unit`, and validation status.
- Finish owner review of official candidate sources and rate/permission constraints.

## Phase 2: First Real Source Connection

Start with 4 key crops:

- ข้าว
- ยางพารา
- มันสำปะหลัง
- อ้อย

Preferred source order:

1. Official public API/open-data source if stable and fresh enough.
2. Approved official catalog/export source if not daily but still trustworthy.
3. Owner-curated manual JSON/table with explicit source URL, updated date, and manual-update label.

Display requirements:

- Source label
- Market name
- Unit
- Updated date/time
- Stale label when older than the configured freshness window
- No chart until historical real data is available

## Phase 3: Fertilizer Prices

Add fertilizer only after source verification for:

- ยูเรีย 46-0-0
- 15-15-15
- 16-20-0
- 21-0-0
- 0-0-60
- ปุ๋ยอินทรีย์ / ปุ๋ยคอก later if reliable local sources exist

Fertilizer rows must show package size or unit because prices vary between sack, kg, ton, shop, province, and brand.

## Phase 4: Regional Prices And Charts

- Add province/market filters only if the source supports regional granularity.
- Add mini charts/sparklines only after reliable historical data exists.
- Never synthesize chart history from a single latest price.

## First Implementation Target

Recommended first implementation:

1. Build a read-only adapter around MOC Open Data for commodities it clearly covers, especially rice and later vegetables/fruits.
2. In parallel, verify NABC/OAE Farm Plus as the preferred farmer-facing farm-gate source.
3. Use RAOT for rubber and OCSB for sugarcane only through a stable export/API or owner-approved manual ingestion.
4. If no stable API is ready, implement an owner-curated manual price JSON source with strict attribution and freshness checks.

## Why Not Scrape First

Uncontrolled scraping is not appropriate for V1 because:

- Layout changes can silently corrupt prices.
- Terms/rate limits may be unclear.
- Price units and market context can be misread.
- Farmers may act on the data, so stale or mis-normalized rows are harmful.

## Owner Decisions Needed

- Which first source should be approved for implementation: MOC API, NABC/OAE, or owner-curated manual source.
- Whether prices should prioritize farm-gate, wholesale market, retail market, or all with separate labels.
- Freshness thresholds by source and commodity.
- Whether fertilizer should launch as source-pending first or manual-curated first.

## M118 Implementation Note

M118 implemented the recommended manual-first foundation as a read-only adapter. The manual source starts empty, so `/app/prices` remains source-pending until owner-provided rows include source name, unit, price, `updatedAt`, and `fetchedAt`.

This does not replace the official-source strategy. It creates a safe bridge so the owner can add verified rows later while MOC, OAE/NABC, RAOT, OCSB, and fertilizer sources continue through verification.
