# Owner Price Row Verification Checklist M119

Date: 2026-05-27

Use this checklist before adding or approving each manual price row.

## Source Check

- [ ] Source URL opened by owner.
- [ ] Source name copied exactly.
- [ ] Source type identified: official, association, market, PDF, webpage, or owner manual note.
- [ ] Market/source context confirmed, such as farm-gate, wholesale, retail, seasonal reference, or auction.
- [ ] Attribution requirement understood.

## Price Check

- [ ] Price copied exactly.
- [ ] Unit copied exactly.
- [ ] Currency confirmed as THB.
- [ ] Quality grade, formula, crop type, or moisture context copied when relevant.
- [ ] No sample/demo/Home placeholder value used.
- [ ] No price invented, averaged, rounded, or converted silently.

## Date Check

- [ ] Source updated date confirmed.
- [ ] `updatedAt` entered from the source update date.
- [ ] `fetchedAt` entered as the owner check/copy time.
- [ ] Stale status checked against the source freshness window.

## UI Check

- [ ] `/app/prices` shows source, unit, updated date, and stale label if stale.
- [ ] Home switches to real rows only when validated rows exist.
- [ ] Home does not show sample rows and real rows in the same price card.
- [ ] Unsupported commodities remain source-pending.
- [ ] Fertilizer remains source-pending unless fully verified fertilizer data is provided.

## Evidence

- [ ] Screenshot or source note saved if the source changes often.
- [ ] Owner can explain where the price came from.
- [ ] Row can be removed quickly if the source is later found unreliable.
