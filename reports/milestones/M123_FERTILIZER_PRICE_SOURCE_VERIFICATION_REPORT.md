# M123 Fertilizer Price Source Verification Report

Date: 2026-05-27

## 1. Summary

M123 reviewed fertilizer price source options and defined V1 data/UI rules. No fertilizer prices were added because no source is currently verified enough for safe in-app display with formula, package size, unit, source, updated date, fetched date, and market/shop context.

Crop price rows from M120-M122 remain unchanged.

## 2. Current Fertilizer Audit

Current app behavior:

- `/app/prices` shows a guarded `ราคาปุ๋ย` card.
- The card says `ยังไม่แสดงราคา`.
- The copy says fertilizer waits for a verified source and will not show numbers, formulas, or sack sizes until source/date context is clear.
- `manualFertilizerPriceRows` remains empty.
- Existing tests confirm `46-0-0` and `15-15-15` are not shown as price rows.

No fertilizer numeric prices are visible in the normal user-facing price page.

Existing fertilizer fields:

- `fertilizerCode`
- `fertilizerNameTh`
- `formula`
- `packageSize`
- `unit`
- `price`
- `currency`
- `region`
- `province`
- `sourceName`
- `sourceUrl`
- `sourceType`
- `sourceAttribution`
- `updatedAt`
- `fetchedAt`
- `isStale`
- `notes`

Missing before safe display:

- verified source row with formula
- explicit package size, such as 50 kg sack
- clear retail/wholesale/shop/province/reference context
- source update date
- fetched date
- freshness rule
- owner approval for whether fertilizer should ever appear on Home

## 3. Source Candidate Matrix Summary

Created `docs/prices/FERTILIZER_SOURCE_MATRIX_M123.md`.

Summary:

- data.go.th / Yasothon fertilizer average dataset is verified as an official public dataset, but it is annual/provincial and not formula-specific, so it is reference/history only.
- OAE monthly fertilizer wholesale/retail article appears promising, but still needs direct table/export, unit, formula list, and reuse verification.
- DIT FAQ and press releases are useful for policy, stock, and price-control context, but they are not structured app-ready price feeds.
- DIT event/promotion news may list product examples, but event prices should not become general fertilizer market prices.
- Owner-curated manual rows remain the safest V1 path after source evidence is collected.

## 4. V1 Fertilizer Data Rules

Created `docs/prices/FERTILIZER_V1_DATA_RULES_M123.md`.

Rules:

- Require formula, package size, unit, source, source attribution, updated date, fetched date, and context.
- Reject rows with missing formula/package/source/date.
- Reject rows where retail/wholesale/shop/reference meaning is unclear.
- Do not convert sack price to kg price unless sack size is verified.
- Do not put fertilizer on Home until owner approves a later milestone.

## 5. UI Rules

Created `docs/prices/FERTILIZER_UI_RULES_M123.md`.

Current UI rule remains:

- show source-pending fertilizer section
- show no numeric fertilizer prices
- show no formula rows
- show no fake charts
- show no fertilizer on Home

Future verified rows must show formula, package size, price/unit, source, updated date, stale label, and local/shop/market context.

## 6. Whether Any Rows Were Added

No fertilizer rows were added.

## 7. Why Fertilizer Remains Source-Pending

Fertilizer prices vary by formula, package size, brand, shop, province, retail/wholesale channel, event promotion, and delivery cost. The verified sources found in M123 either lacked formula/package detail for live rows or still need direct table/export confirmation.

Showing a vague annual average or narrative news value as live fertilizer price would be misleading, so the app remains guarded.

## 8. Tests/Checks Run

- `npm run lint` passed.
- `npm run build` passed. Vite still reports the existing large bundle warning.
- `npm run test` passed: 49 files, 455 tests.
- Browser route smoke passed for `/app/prices`, `/app`, `/app/weather`, `/app/community`, `/app/ai`, and `/app/profile`.
- Route smoke confirmed `/app/prices` still shows fertilizer source-pending copy and does not show `46-0-0` or `15-15-15`.
- `git diff --check` passed.

## 9. Remaining Owner Decisions

- Decide whether the first fertilizer row set should come from owner-curated shop/source evidence or a verified OAE/public table.
- Decide whether annual/province-average fertilizer datasets should appear as reference-only context later.
- Decide whether fertilizer should ever appear on Home or remain only on `/app/prices`.
- Provide source evidence for any first manual rows: formula, package size, price, source URL/evidence, updated date, fetched date, and shop/province/channel context.

## 10. Next Recommended Milestone

Recommended next milestone: collect owner-approved fertilizer source evidence and add manual fertilizer validation/display behind the same no-fake-data rules. If OAE table/export can be verified, prepare a source-specific adapter plan before entering rows.
