# Farm Records Export/Delete Plan M85

M85 documents the future export and delete boundary for Farm Records and Farm Finance Ledger. It does not implement export, bulk delete, cloud delete, Supabase writes, cloud sync, GPS, AI analysis, OCR, receipt upload, PDF export, or CSV export.

## Why Export/Delete Matters

Farm Records can contain sensitive household and business information. The finance ledger can reveal income, costs, profit, purchasing behavior, buyer/vendor relationships, and farm operating patterns. Export and delete tools are required for user trust, PDPA readiness, account recovery planning, and any future opt-in sync path.

## Future Export Contents

Future full data export should include:

- farm plots with coarse location text only
- crop cycles
- farm activity records
- farm finance entries
- farm harvest/yield records
- image and receipt metadata placeholders only, not raw image bytes
- local metadata such as local schema version, record timestamps, and migration markers

## Future Delete Tools

Future delete tooling should support:

- delete one activity record
- delete one finance entry
- archive a farm plot
- close or cancel a crop cycle
- delete all local farm records after strong confirmation

Plot and crop-cycle hard delete should be reviewed carefully because linked activity and finance records may need preservation, archive behavior, or a clear cascade policy.

## Safety Requirements

- Bulk delete must require multiple confirmations.
- Before sync exists, all destructive copy must clearly say local device only.
- Before sync exists, UI must not imply cloud backup or cross-device recovery.
- Future cloud delete must require real ownership, owner-only Supabase RLS, and an audit trail.
- Future cloud delete must define idempotency, conflict handling, retention expectations, and sync status behavior.
- Delete/export must not send records to AI.

## Future Export Formats

- JSON for full local data backup and restore planning.
- CSV for finance ledger review.
- PDF summary later, after layout, privacy, and legal review.

## Explicit M85 Non-Goals

- No actual export implementation.
- No CSV export implementation.
- No PDF export implementation.
- No actual bulk delete implementation.
- No cloud delete implementation.
- No Supabase schema, migration, write, sync queue, or cloud backup.

## M86 Implementation Status

M86 implements the first local-device data control layer:

- JSON local backup preview/download is implemented for `kasethub.farmRecords.v1`.
- Finance CSV preview/download is implemented for local finance ledger entries.
- Export preview counts plots, crop cycles, activity records, finance entries, totals, estimated sizes, latest record date, and local-only warnings.
- Exports remain local device only and do not create cloud backups.
- Image files remain excluded; only metadata placeholders are exported.
- `data:` image payloads are stripped from JSON backup output.
- Farm plot archive is exposed as a safer alternative to hard delete.
- Crop cycle close/cancel is exposed as a safer alternative to hard delete.
- Bulk delete remains future.
- Cloud delete remains future.
- Supabase sync/write/delete remains future.

## M87 Restore And Sync Consent Status

M87 extends the local-device data control layer:

- JSON backup parse/validate/preview is implemented.
- Confirmed local JSON restore is implemented for `kasethub.farmRecords.v1`.
- Restore requires explicit confirmation and the phrase `RESTORE FARM RECORDS`.
- Restore strips raw `data:` image payloads and excludes GPS/geolocation-like fields from restored state.
- Restore does not touch unrelated local storage keys.
- A disabled sync consent gate documents future requirements for opt-in consent, authenticated ownership, owner-only RLS, export/delete tools, audit/idempotency, retention policy, separate AI consent, and separate GPS consent.
- Bulk delete remains future.
- Cloud restore/delete remains future.
- Supabase sync/read/write/delete remains future.

## M88 Restore Recovery And Sync Review Status

M88 extends readiness without implementing cloud sync:

- Restore Risk Review compares current local data against validated backup data.
- Pre-restore current local snapshot/download is available.
- One latest local pre-restore snapshot may be stored under `kasethub.farmRecords.restoreSnapshot.v1`.
- Sync architecture review and readiness checklist documents are created under `docs/sync`.
- Bulk delete remains future.
- Cloud export/delete remains future.
- Supabase schema, sync queue, read, write, and delete remain future.

## M91 Harvest/Yield Export Status

M91 adds `farmHarvestRecords` to local JSON backup, restore validation, restore preview, and pre-restore snapshots. Old backups without harvest records still restore with an empty slice. Finance CSV remains finance-ledger focused only; harvest CSV/export remains future work.
