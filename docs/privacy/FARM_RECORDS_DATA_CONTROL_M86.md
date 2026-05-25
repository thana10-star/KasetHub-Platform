# Farm Records Data Control M86

M86 adds local-only data control for Farm Records and Farm Finance Ledger before any future cloud sync. This is not a production PDPA policy and does not add cloud export, cloud delete, Supabase writes, GPS, AI processing, receipt upload, OCR, or server-side storage.

## Local Export Includes

- Farm plots with coarse text location only.
- Crop cycles.
- Farm activity records.
- Farm finance ledger entries.
- Farm harvest/yield records.
- Computed ledger summary.
- Record IDs and timestamps so a future backup/restore design can preserve relationships.
- Image and receipt metadata placeholders only.

## Local Export Excludes

- Raw image bytes.
- Base64 or `data:` image payloads.
- Receipt uploads.
- GPS coordinates, latitude, longitude, geolocation, or map pins.
- Cloud sync status, auth sessions, service-role keys, or hidden backend internals.
- Any AI analysis of farm records.

## Delete/Archive Behavior

- Activity records can be deleted one at a time from this device.
- Finance entries can be deleted one at a time from this device.
- Farm plots can be archived instead of hard-deleted; linked activity and finance records remain local.
- Crop cycles can be closed as harvested or cancelled; linked activity and finance records remain local.
- Bulk delete is not implemented in M86 because it needs stronger export, recovery, and multi-confirmation UX first.

## M87 Restore And Sync Gate Status

- JSON backup restore preview and confirmed local restore are implemented for `kasethub.farmRecords.v1`.
- Restore validates required Farm Records slices before apply.
- Restore strips raw `data:` image payloads and preserves image metadata only.
- Restore does not preserve GPS/geolocation-like fields.
- Restore requires explicit confirmation and the phrase `RESTORE FARM RECORDS`.
- Restore affects local Farm Records on this device only and does not touch unrelated local storage keys.
- Cloud sync remains disabled behind a consent/readiness gate.
- Supabase writes, cloud backup, and cloud delete remain future work.

## M88 Restore Recovery Status

- Restore Risk Review is shown before local restore.
- Current-vs-backup counts, estimated removed/added records, net profit changes, and latest record dates are surfaced.
- Users can download/generate a current local backup before restore.
- A single latest pre-restore snapshot may be stored under `kasethub.farmRecords.restoreSnapshot.v1`.
- The pre-restore snapshot is local-device only and does not create cloud backup.
- Sync architecture review and readiness checklist docs exist, but sync queue, Supabase writes, cloud sync, and cloud delete remain blocked.

## M89 Sync Consent Prototype Status

- Cloud Sync Consent Prototype UI exists for preview only.
- Optional prototype checkbox state may be stored under `kasethub.farmRecords.syncConsentPrototype.v1`.
- Prototype state is not legal consent and cannot enable sync.
- Owner/RLS future test plan exists, but Supabase schema, RLS, sync queue, cloud sync, and cloud delete remain blocked.

## M91 Harvest/Yield Status

- Local JSON backup includes `farmHarvestRecords`.
- Local restore accepts old backups without harvest records and validates new backups with harvest records.
- Pre-restore snapshots include harvest records.
- Harvest/yield data may reveal production volume and sale-price assumptions, so future cloud sync consent copy must include it.
- Supabase schema, sync queue, cloud sync, and cloud delete remain blocked.

## Future Requirements Before Cloud Sync

- Explicit opt-in consent before any farm record leaves the device.
- Owner-only Supabase RLS for all farm record tables.
- Export/delete tools reviewed against sync conflict behavior.
- Audit trail and idempotency for sync and cloud delete operations.
- Clear recovery, restore, and conflict copy.
- Separate AI consent before any farm record or finance entry is sent to an AI system.

## Future Requirements Before Production PDPA Release

- Production privacy policy review.
- Account-level export/delete request flow.
- Cloud delete behavior with owner verification.
- Data retention and audit policy.
- Human-readable explanation of exactly what is exported, synced, deleted, retained, or excluded.
