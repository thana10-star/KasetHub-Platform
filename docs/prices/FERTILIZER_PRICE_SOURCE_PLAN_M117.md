# Fertilizer Price Source Plan M117

Date: 2026-05-27

## Why Fertilizer Prices Matter

Fertilizer prices affect crop planning, input timing, and farm cash flow. For many Thai farmers, fertilizer price changes can be as important as crop sale prices because they directly affect production cost.

## Target Formulas

V1 should plan for:

- ยูเรีย 46-0-0
- 15-15-15
- 16-20-0
- 21-0-0
- 0-0-60
- ปุ๋ยอินทรีย์ / ปุ๋ยคอก later, only where a reliable regional/shop source exists

## Source Difficulty

Fertilizer is harder than crop prices because:

- Prices vary by province, shop, brand, package size, and delivery cost.
- Some official sources are news/control notices, not structured price feeds.
- Imported raw material costs can move before retail prices change.
- Local shop prices can differ from recommended or average prices.

## Candidate Source Direction

Official/public sources found during M117:

- data.go.th fertilizer price dataset titled "ราคาจำหน่ายปุ๋ยเคมี เฉลี่ยต่อกระสอบ", likely historical and requiring direct verification before use.
- DIT public notices and FAQ explaining fertilizer control, stock, and anti-overpricing actions.
- OAE article/search result for monthly wholesale/retail prices of important fertilizer formulas, direct data access still needs verification.
- NABC dashboard references fertilizer import and global price monitoring, useful for context but not yet verified as a consumable V1 feed.

## Unit And Package Normalization

Fertilizer rows must keep:

- Formula
- Package size, such as 50 kg sack
- Unit, such as THB/sack, THB/kg, or THB/ton
- Region/province when available
- Brand/shop notes when applicable

Do not convert sack price to kg price unless the package size is explicit and verified.

## V1 Cautious Approach

- Keep fertilizer price UI source-pending until a verified source is approved.
- Do not show fake fertilizer prices.
- Prefer owner-curated manual table for the first fertilizer version if no stable public API is confirmed.
- Manual fertilizer rows must show source, updated date, formula, package size, and stale status.

## Future Plan

- Verify official data.go.th/OAE/DIT fertilizer datasets with owner.
- Define source-specific freshness windows.
- Add a small fertilizer section after crop price validation is live.
- Add regional/shop comparison only after source coverage and permission are confirmed.
