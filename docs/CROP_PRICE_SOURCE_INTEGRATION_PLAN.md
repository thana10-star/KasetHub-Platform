# Crop Price Source Integration Plan

This plan describes how KasetHub can later connect crop price sources without weakening attribution, freshness, and anti-misinformation rules. M21 is planning-only and fixture-only.

## Future Source List

| Source | Type | Planned method | Initial reliability |
| --- | --- | --- | --- |
| OAE / สำนักงานเศรษฐกิจการเกษตร | Official agency | API or approved data feed | `official` |
| DIT / กรมการค้าภายใน | Official agency | API or approved data feed | `official` |
| ตลาดไท | Market reference | Approved feed or manual import | `market_reference` |
| Local market manual report | Admin/manual | Admin entry or CSV import | `market_reference` |
| Community price report | User/community | In-app submission with review | `community_unverified` |

## Official vs Market vs Community Data

Official data:

- Highest attribution requirement.
- Must show agency label and data date.
- Should not be mixed with unverified community reports in the same badge.

Market reference data:

- Useful for direction and planning.
- Must show market name, region, unit, and grade.
- Must avoid implying a guaranteed buying price.

Community data:

- Useful for early local signals.
- Must be marked unverified until reviewed.
- Should not power notifications, AI price advice, or public trend summaries before review.

## API and Manual Import Options

Future import paths:

- Backend API connector for approved official feeds.
- Scheduled backend import job for source files or feeds.
- Admin CSV/manual entry for local markets.
- Admin review queue for community submissions.
- Correction workflow for wrong or stale rows.

Browser code must not own source credentials, import jobs, or trusted writes.

## Freshness Policy

Each source must define:

- expected update frequency
- source publish time
- import time
- stale-after window
- fallback display when stale
- correction and rollback process

User-facing copy should say `ข้อมูลอาจล่าช้า` when outside freshness policy.

## Source Attribution Rules

Every user-facing price explanation must include:

- source label
- source date/time
- market or region
- unit
- grade when available
- reliability badge
- non-guarantee copy that price can differ by area, grade, moisture, season, and buyer

Do not remove attribution in share cards, AI answers, notifications, or saved references.

## Anti-Misinformation Rules

- Never guarantee sale price.
- Never claim fixture/demo data is real.
- In M108.2 source-pending state, do not show fake numeric prices at all.
- Never combine sources into a single average unless the method is documented.
- Never show community reports as official.
- Always show the disclaimer: `ราคาจริงขึ้นกับพื้นที่ เกรดสินค้า ความชื้น ฤดูกาล และผู้รับซื้อ`
- AI must cite source label/date and avoid treating a price as a guaranteed sale price.
- Price alerts must also cite source/date and avoid guaranteed-sale or buyer-quote wording.

## Caching Strategy

Future caching should be backend-owned:

- Store normalized snapshots in `crop_price_snapshots`.
- Cache latest public reference rows for fast reads.
- Keep raw import payloads private or admin-only.
- Add TTL/stale flags by source.
- Use immutable snapshots for auditability.
- Avoid localStorage as the trusted price cache.

## Backend Import Job Future

`crop_price_import_jobs` should track:

- source ID
- import mode
- status
- started/completed time
- row counts
- rejected row counts
- validation warnings
- source file/feed metadata
- admin reviewer
- rollback/correction links

Imports should be idempotent and backend-only.

## Price Alert Job Future

Real crop watch alerts should be evaluated only after trusted snapshots are imported and freshness checks pass.

Future backend alert jobs should track:

- user alert preference ID
- source snapshot ID
- alert type
- threshold or target price
- previous reference price
- latest reference price
- decision result
- delivery channel
- delivery status
- quiet-hour and opt-out checks

No browser code should send production push/LINE/SMS alerts by itself.

## Admin Review Future

Admin review should support:

- source setup and status control
- manual row entry
- CSV preview before publish
- community report moderation
- correction notes
- stale data warnings
- attribution preview
- publish/unpublish controls

Community reports should remain hidden or clearly marked until reviewed.

## User-Facing Disclaimers

Short copy for price cards:

> ราคาจริงขึ้นกับพื้นที่ เกรดสินค้า ความชื้น ฤดูกาล และผู้รับซื้อ

AI price explanation copy:

> คำตอบนี้อธิบายจากแหล่งข้อมูลที่ระบุ ไม่รับประกันราคาขายจริง

Stale data copy:

> ข้อมูลนี้อาจล่าช้า ควรตรวจสอบกับตลาดหรือผู้รับซื้อในพื้นที่ก่อนตัดสินใจขาย
