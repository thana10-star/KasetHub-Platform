# Farm Records Privacy Boundary M83

M83 introduces the local-first Farm Records and Farm Finance Ledger foundation. These records can contain personal, household, and business-sensitive information even when no names or phone numbers are stored.

## Sensitive Data Boundary

- Farm activity records can reveal crop plans, work patterns, input use, labor patterns, machine use, pest or disease issues, and production timing.
- Farm finance ledger entries can reveal income, costs, profit, purchasing behavior, buyer/vendor relationships, debt-related costs, and business activity.
- Plot names and coarse location labels can still identify a farm when combined with other context.
- Image and receipt references are metadata placeholders only. M83 must not store raw image bytes, base64 payloads, or uploaded receipt files in local state.

## M83 Guarantees

- Farm Records are local-first only under `kasethub.farmRecords.v1`.
- No cloud sync is enabled by default.
- No Supabase writes are added.
- No GPS coordinates, map pins, precise coordinates, or geolocation requests are added.
- No AI processing or AI reading of farm records or finance entries is added.
- Demo data uses safe fictional examples only, with no real farmer names, phone numbers, or exact locations.

## M84 UI Note

M84 adds a farmer-facing local UI on `/app/farm-records` for viewing and creating farm plots, crop cycles, activity records, and finance entries. It uses the same `kasethub.farmRecords.v1` local state and keeps the M83 guarantees intact: no cloud sync, no Supabase write, no GPS/geolocation/map pin, no AI reading of records, no receipt upload, no export, and no legal-final PDPA copy.

## M85 UI And Planning Note

M85 adds local edit flows for activity records and finance entries, a Recent Farm Timeline, My Farm entry/status integration, and `docs/privacy/FARM_RECORDS_EXPORT_DELETE_PLAN_M85.md`. It keeps the same M83 guarantees intact: no cloud sync, no Supabase write, no GPS/geolocation/map pin, no AI reading of records, no receipt upload, no actual export, no bulk delete, and no legal-final PDPA copy.

## M86 Data Control Note

M86 adds local-device JSON backup and finance CSV preview/download helpers, export preview warnings, farm plot archive UX, and crop-cycle close/cancel UX. It keeps exports local to the device and strips raw `data:` image payloads from JSON backup output. It still adds no cloud sync, no cloud delete, no Supabase write, no GPS/geolocation/map pin, no AI reading of records, no receipt upload, no bulk delete, and no legal-final PDPA copy.

## M87 Restore And Sync Consent Note

M87 adds local JSON backup parse/validate/preview/restore helpers and a disabled sync consent gate. Restore requires explicit confirmation with the phrase `RESTORE FARM RECORDS`, replaces only local Farm Records under `kasethub.farmRecords.v1`, strips raw `data:` image payloads, and does not preserve GPS/geolocation-like fields. The sync gate is checklist-only and keeps cloud sync blocked until consent, ownership, owner-only RLS, export/delete, audit/idempotency, retention, AI consent, and GPS consent boundaries are ready. M87 still adds no Supabase read/write, no cloud sync, no cloud delete, no GPS/geolocation/map pin, no AI reading of records, no receipt upload, no OCR, no notifications, and no legal-final PDPA copy.

## M88 Restore Recovery And Sync Review Note

M88 adds restore recovery guidance, Restore Risk Review, pre-restore local snapshot/download, and sync architecture review/checklist documents. A single latest local snapshot may be stored under `kasethub.farmRecords.restoreSnapshot.v1`. The snapshot is local-device only and follows the same no raw image data, no `data:` payload, and no GPS/geolocation boundary. M88 still adds no Supabase schema/read/write, no sync queue, no cloud sync, no cloud delete, no AI reading of records, no receipt upload, no OCR, no notifications, and no legal-final PDPA copy.

## M89 Sync Consent Prototype Note

M89 adds a non-writing Cloud Sync Consent Prototype. Optional preview checkbox state may be stored under `kasethub.farmRecords.syncConsentPrototype.v1`, but this is local prototype UI state only, is not legal consent, and cannot enable sync. The prototype separates cloud sync, AI analysis, GPS/precise location, and image/receipt upload consent categories. M89 still adds no Supabase schema/read/write, no sync queue, no cloud sync, no cloud delete, no GPS/geolocation/map pin, no AI reading of records, no receipt upload, no OCR, no notifications, and no legal-final PDPA copy.

## M90 Cost Dashboard Note

M90 adds local deterministic cost analytics, category breakdowns, and break-even estimates from Farm Finance Ledger data. These calculations run only on records stored on this device and are planning aids, not official accounting, tax, loan, legal, or financial advice. M90 still adds no Supabase schema/read/write, no sync queue, no cloud sync, no cloud delete, no GPS/geolocation/map pin, no AI reading of records, no receipt upload, no OCR, no notifications, no bank/loan integration, and no legal-final PDPA copy.

## Future Consent Gates

- Future cloud sync must require explicit opt-in consent before any farm record or ledger entry leaves the device.
- Future AI analysis must require a separate AI consent boundary and clear explanation of what data is sent.
- Future export and delete tools are required before production-grade sync.
- Future Supabase RLS must enforce owner-only access for all farm plots, crop cycles, farm activity records, finance entries, image metadata, audit events, and sync status rows.
- Future sync must support conflict handling, idempotency, audit preview, deletion controls, and consent version tracking.

## Non-Goals For M83

- No final PDPA legal copy.
- No production privacy policy change.
- No cloud backup.
- No precise location storage.
- No receipt upload.
- No AI farm-record analysis.
- No production database schema or migration.
