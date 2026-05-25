# Farm Records Restore + Sync Consent M87

M87 adds local JSON backup restore readiness and a future-facing sync consent gate for Farm Records and Farm Finance Ledger. This is not a production PDPA policy and does not add Supabase writes, cloud sync, cloud delete, server-side restore, GPS, AI processing, receipt upload, OCR, notifications, bank/loan/tax integration, or legal-final copy.

## Why Restore Needs Validation

Farm Records backups can contain sensitive farm and finance history. Restore must be preview-first because it can replace the local plot, crop-cycle, activity, and ledger state on this device. Validation helps prevent malformed files, wrong app exports, raw image payloads, GPS-like fields, and invalid finance amounts from entering the local Farm Records store.

## Restore Behavior

- Restore is local device only.
- Restore targets only `kasethub.farmRecords.v1`.
- Restore replaces local Farm Records only after explicit confirmation.
- Restore requires the confirmation phrase `RESTORE FARM RECORDS`.
- Restore does not touch unrelated app local storage keys.
- Restore does not call Supabase.
- Restore does not call AI.
- Restore does not add GPS/geolocation/map pins.
- Restore does not run automatically when a file is selected.
- Users should export a backup before restoring if they want to keep current local records.

## Backup Restore Includes

- Farm plots with coarse text location only.
- Crop cycles.
- Farm activity records.
- Farm finance ledger entries.
- IDs and timestamps needed to preserve local relationships.
- Computed restore preview summary.
- Image and receipt metadata placeholders only.

## Backup Restore Excludes

- Raw image bytes.
- Base64 or `data:` image payloads.
- Receipt uploads.
- GPS coordinates, latitude, longitude, geolocation, coordinates, or map pins.
- Cloud sync state.
- Supabase data.
- AI history or AI analysis.
- Hidden backend internals or service-role secrets.

## Sync Consent Gate Requirements

Future cloud sync must remain blocked until all of these are reviewed and implemented:

- Explicit opt-in user consent before records leave the device.
- Authenticated user ownership.
- Owner-only Supabase RLS for plots, crop cycles, activities, finance entries, image metadata, sync status, and audit rows.
- Export/delete tools reviewed for synced data and conflict behavior.
- Audit logs, idempotency, conflict handling, rollback, and recovery plan.
- Data retention and deletion policy.
- AI consent separated from sync consent.
- GPS/geolocation consent separated from sync consent.

## Explicit M87 Non-Goals

- No Supabase schema, migration, read, write, or sync queue.
- No real cloud sync.
- No cloud backup or cloud delete.
- No server-side restore.
- No GPS, geolocation, map pin, latitude, or longitude.
- No AI reading or analysis of farm records.
- No receipt/image upload.
- No OCR.
- No notifications.
- No bank, loan, or tax integration.
- No legal-final PDPA policy copy.

## M88 Restore Recovery Status

M88 adds local restore recovery UX without changing the M87 cloud boundary:

- Restore Risk Review compares current local data with validated backup data before replacement.
- Users can download/generate the current local Farm Records snapshot before restore.
- The app may keep one latest pre-restore snapshot under `kasethub.farmRecords.restoreSnapshot.v1`.
- The snapshot is local-device only and uses the same sanitation boundary: no raw image data, no `data:` payloads, and no GPS/geolocation fields.
- M88 adds sync architecture review and readiness checklist docs, but still no Supabase schema, no Supabase read/write, no sync queue, no cloud sync, and no cloud delete.

## M89 Sync Consent Prototype Status

M89 adds a local-only Cloud Sync Consent Prototype so users can preview future consent categories before any real sync exists. Prototype checkbox state may be stored under `kasethub.farmRecords.syncConsentPrototype.v1`, but it is not legal consent, does not unlock cloud sync, and does not call Supabase. Cloud sync, AI analysis, GPS/precise location, and image/receipt upload remain separate future gates.
