# M88 Farm Records Restore Recovery + Sync Architecture Review Report

## 1. Summary

M88 improves Farm Records restore safety and produces cloud-sync architecture review artifacts before any future Supabase write path.

The milestone adds a local restore recovery layer with sanitized pre-restore snapshots, a Restore Risk Review, pre-restore backup/download UX, clearer disabled sync readiness statuses, My Farm backup/restore status copy, and sync architecture/checklist documentation. M88 remains local-first and does not implement real cloud sync.

M88 adds no Supabase schema, migration, read, write, sync queue, cloud backup, cloud delete, server-side restore, GPS/geolocation/map pin, AI farm-record processing, receipt upload, OCR, notifications, bank/loan/tax integration, dangerous bulk delete, automatic restore, or legal-final PDPA copy.

## 2. Files Created

- `docs/sync/FARM_RECORDS_SYNC_ARCHITECTURE_REVIEW_M88.md`
- `docs/sync/FARM_RECORDS_SYNC_READINESS_CHECKLIST_M88.md`
- `reports/milestones/M88_FARM_RECORDS_RESTORE_RECOVERY_SYNC_ARCHITECTURE_REPORT.md`
- `src/services/farm-records/farm-records-restore-recovery-service.ts`
- `src/services/farm-records/farm-records-restore-recovery-service.test.ts`

## 3. Files Modified

- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/MY_FARM_HUB_FOUNDATION.md`
- `docs/privacy/FARM_RECORDS_DATA_CONTROL_M86.md`
- `docs/privacy/FARM_RECORDS_EXPORT_DELETE_PLAN_M85.md`
- `docs/privacy/FARM_RECORDS_PRIVACY_BOUNDARY_M83.md`
- `docs/privacy/FARM_RECORDS_RESTORE_SYNC_CONSENT_M87.md`
- `src/routes/FarmRecordsDebugPage.tsx`
- `src/routes/FarmRecordsDebugPage.test.tsx`
- `src/routes/MyFarmPage.tsx`
- `src/routes/MyFarmPage.test.tsx`
- `src/routes/AdminDashboardPage.tsx`
- `src/routes/QAPage.tsx`
- `src/services/admin/admin-dashboard-service.ts`
- `src/services/farm-records/farm-records-restore-service.test.ts`
- `src/services/farm-records/farm-records-sync-consent-gate.ts`
- `src/services/qa/mvp-readiness-audit.ts`
- `src/services/qa/route-registry.ts`

Verification/build also refreshed generated artifacts: `dist/index.html` and `tsconfig.app.tsbuildinfo`.

## 4. Restore Recovery Safety Layer

- Added `buildPreRestoreSnapshot()` for JSON-safe local pre-restore snapshots.
- Added `stringifyPreRestoreSnapshot()`.
- Added `getRestoreRiskReview()` with current/backup counts, removed/added estimates, net-profit change, latest current/backup dates, and warnings.
- Added single-snapshot local storage support under `kasethub.farmRecords.restoreSnapshot.v1`.
- Snapshot helpers reuse the M86 export sanitation boundary, excluding raw `data:` image payloads and GPS/geolocation-like fields.
- Persisted snapshots are local-device only and do not touch unrelated local storage keys.

## 5. Restore UI Recovery Behavior

`/app/farm-records#farm-records-restore` now includes:

- Restore recovery guidance card.
- “Download current local backup before restore” action.
- Last pre-restore snapshot status when available.
- Restore Risk Review after a valid backup is parsed and validated.
- Current-vs-backup counts.
- Estimated removed/added activity and finance records.
- Current net profit, backup net profit, changed net profit estimate.
- Latest current record date and latest backup record date.
- Risk warnings before restore.

The restore button remains disabled until the backup is valid, the risk review exists, the checkbox is checked, and the confirmation phrase matches `RESTORE FARM RECORDS`.

## 6. Sync Architecture Review Artifacts

`docs/sync/FARM_RECORDS_SYNC_ARCHITECTURE_REVIEW_M88.md` documents:

- Purpose and current local-only status.
- Conceptual future data model tables only, with no migration.
- Ownership/RLS requirements.
- Separate consent requirements for cloud sync, AI, GPS, and images/receipts.
- High-level sync queue draft.
- Conflict strategy draft.
- Delete/export requirements before sync.
- Rollback/recovery requirements.
- M88 non-goals.

`docs/sync/FARM_RECORDS_SYNC_READINESS_CHECKLIST_M88.md` tracks consent, privacy, ownership/RLS, export/delete/recovery, sync queue, idempotency, audit, operations, security, manual QA, and browser/mobile QA readiness.

## 7. Sync Readiness Checklist UI Updates

The disabled Cloud Sync Readiness section now shows:

- Local Farm Records: Ready.
- Local export: Ready.
- Local restore: Ready.
- Restore recovery guidance: Ready.
- User cloud consent: Not implemented.
- Supabase RLS: Not implemented.
- Sync queue: Not implemented.
- Conflict handling: Not implemented.
- Cloud delete/export: Not implemented.
- AI consent: Separate future gate.

The Cloud sync action remains disabled and no backend calls are added.

## 8. Privacy-Safe Local-First Behavior

- Reuses `kasethub.farmRecords.v1`.
- Adds only the scoped latest snapshot key `kasethub.farmRecords.restoreSnapshot.v1`.
- Adds no Supabase schema/read/write or sync queue.
- Adds no cloud sync, cloud backup, cloud restore, or cloud delete.
- Adds no GPS/geolocation/map pin/latitude/longitude.
- Sends no farm records or finance entries to AI.
- Adds no image/receipt upload.
- Does not implement automatic restore or dangerous bulk delete.

## 9. My Farm Integration

The My Farm Farm Records card now shows `Backup/Restore ready locally` while still showing `local-only` and `no cloud sync`. It continues linking to `/app/farm-records#farm-records-restore`.

## 10. Tests/Checks Run

- `npm run lint` - passed.
- `npm run build` - passed. Vite emitted the existing large chunk size warning.
- `npm run test` - passed, 29 test files and 282 tests.
- Targeted M88 tests - passed, 4 test files and 26 tests.
- `git diff --check` - no whitespace errors; Git reported existing LF-to-CRLF working-copy warnings.
- `npm run typecheck` - not available as a separate package script; `npm run build` runs `tsc -b`.

## 11. Manual Verification Result

- `http://127.0.0.1:5173/app/farm-records` returned HTTP 200.
- `http://127.0.0.1:5173/app/my-farm` returned HTTP 200.
- Automated tests verify sanitized pre-restore snapshots, raw data URI exclusion, GPS-like field exclusion, risk review count comparison and warnings, export-compatible sanitized current backup behavior, persisted snapshot isolation, restore helper compatibility, restore guidance UI rendering, pre-restore download action rendering, disabled restore/sync states, updated sync readiness statuses, and My Farm backup/restore status rendering.
- In-app Browser verification was attempted, but `agent.browsers.list()` returned no browser targets. No screenshot, mobile-overflow, restore paste/click, download-click, or console-error browser check was available in this session.

## 12. Known Limitations

- No one-click undo after restore.
- No merge restore mode.
- No CSV restore.
- No cloud export/delete.
- No sync queue implementation.
- No Supabase schema, migration, read, or write.
- No production cloud sync.
- No server-side restore.
- No GPS/geolocation/map pin/latitude/longitude.
- No AI analysis of farm records or finance entries.
- No receipt/image upload.
- No dedicated browser/mobile screenshot artifact because the Browser target was unavailable.

## 13. Next Recommended Milestone

M89 Farm Records Sync Consent UX Prototype: add a non-writing consent UX prototype and owner/RLS test plan for future sync while keeping Supabase writes and sync queues disabled.
