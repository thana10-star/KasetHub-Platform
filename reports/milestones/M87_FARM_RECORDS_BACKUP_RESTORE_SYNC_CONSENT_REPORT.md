# M87 Farm Records Backup Restore + Sync Consent Gate Report

## 1. Summary

M87 adds safe local JSON backup restore readiness and a future-facing Sync Consent Gate for Farm Records / สมุดบันทึกฟาร์ม.

The milestone keeps Farm Records local-first. Users can paste or select a JSON backup, validate it, preview current-vs-backup counts and ledger totals, and restore it locally only after explicit confirmation with `RESTORE FARM RECORDS`. The page also now shows a disabled cloud sync readiness gate that documents what must be true before any future Supabase/cloud sync is allowed.

M87 adds no Supabase schema, Supabase read/write, sync queue, cloud sync, cloud backup, cloud delete, GPS/geolocation/map pin, AI farm-record processing, receipt upload, OCR, notifications, bank/loan/tax integration, server-side restore, or legal-final PDPA copy.

## 2. Files Created

- `docs/privacy/FARM_RECORDS_RESTORE_SYNC_CONSENT_M87.md`
- `reports/milestones/M87_FARM_RECORDS_BACKUP_RESTORE_SYNC_CONSENT_REPORT.md`
- `src/services/farm-records/farm-records-restore-service.ts`
- `src/services/farm-records/farm-records-restore-service.test.ts`
- `src/services/farm-records/farm-records-sync-consent-gate.ts`

## 3. Files Modified

- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/MY_FARM_HUB_FOUNDATION.md`
- `docs/privacy/FARM_RECORDS_DATA_CONTROL_M86.md`
- `docs/privacy/FARM_RECORDS_EXPORT_DELETE_PLAN_M85.md`
- `docs/privacy/FARM_RECORDS_PRIVACY_BOUNDARY_M83.md`
- `src/hooks/useFarmRecords.ts`
- `src/routes/FarmRecordsDebugPage.tsx`
- `src/routes/FarmRecordsDebugPage.test.tsx`
- `src/routes/MyFarmPage.tsx`
- `src/routes/MyFarmPage.test.tsx`
- `src/routes/AdminDashboardPage.tsx`
- `src/routes/QAPage.tsx`
- `src/services/admin/admin-dashboard-service.ts`
- `src/services/my-farm/my-farm-hub-service.test.ts`
- `src/services/qa/mvp-readiness-audit.ts`
- `src/services/qa/route-registry.ts`
- `src/services/farm-records/farm-records-service.ts`

Verification/build also refreshed generated artifacts: `dist/index.html` and `tsconfig.app.tsbuildinfo`.

## 4. Restore Helpers Added

- `parseFarmRecordsJsonBackup()` parses raw JSON backup text and returns a success/failure result without throwing.
- `validateFarmRecordsBackup()` validates the Farm Records export shape, required slices, stable IDs, dates, and non-negative finance amounts.
- Restore validation normalizes records through the existing M83 local state path.
- Raw `data:` image payloads are stripped from restore candidates.
- GPS/geolocation-like fields are not preserved in restored Farm Records state.
- `buildFarmRecordsRestorePreview()` compares current local state with backup state and returns counts, differences, summaries, latest backup record date, and restore mode options.
- `applyFarmRecordsRestore()` supports only `replace_local_farm_records`, requires `confirmed: true`, requires `RESTORE FARM RECORDS`, preserves the existing local storage key, and does not touch unrelated local storage keys.

## 5. Restore UI Behavior

`/app/farm-records#farm-records-restore` now includes:

- Restore Backup / กู้คืนข้อมูลจากไฟล์สำรอง section.
- Local-only restore copy.
- JSON file input.
- JSON paste textarea fallback.
- Friendly invalid JSON and validation error display.
- Valid backup preview with current counts, backup counts, count differences, current net profit, backup net profit, and latest backup record date.
- Confirmation checkbox.
- Required confirmation phrase input.
- Disabled restore button until backup validation and confirmation are complete.
- Success message after confirmed local restore and refreshed local counts.

CSV restore is not implemented in M87.

## 6. Sync Consent Gate Behavior

`/app/farm-records#farm-records-sync` now includes a disabled Cloud Sync Readiness section showing:

- Local-only mode active.
- Cloud sync not enabled.
- Supabase writes disabled.
- GPS not used.
- AI access disabled.
- Local export/restore tools available.

`src/services/farm-records/farm-records-sync-consent-gate.ts` documents future sync requirements: explicit user consent, authenticated ownership, owner-only RLS, export/delete tools, audit/idempotency, retention policy, separate AI consent, separate GPS consent, and rollback/recovery planning.

## 7. Privacy-Safe Local-First Behavior

- Reuses `kasethub.farmRecords.v1`.
- Adds no new storage key or migration.
- Restore affects only local Farm Records on this device.
- Restore does not touch unrelated app local storage keys.
- Adds no Supabase read/write, backend call, cloud sync, cloud backup, or cloud delete.
- Adds no GPS/geolocation/map pin/latitude/longitude.
- Sends no farm records or finance entries to AI.
- Adds no image/receipt upload.
- Raw image data and `data:` URI payloads are excluded from restore state.
- Sync consent gate is checklist-only and cannot start sync.

## 8. My Farm Integration

The My Farm Farm Records card now links to `/app/farm-records#farm-records-restore` with copy for local backup/restore and Cloud Sync not being enabled. The broader My Farm status remains local-only and does not imply cross-device backup.

## 9. Tests/Checks Run

- `npm run lint` - passed.
- `npm run build` - first run timed out at 120s; rerun with longer timeout passed. Vite emitted the existing large chunk size warning.
- `npm run test` - passed, 28 test files and 276 tests.
- Targeted M87 tests - passed, 3 test files and 20 tests.
- `git diff --check` - no whitespace errors; Git reported existing LF-to-CRLF working-copy warnings.
- `npm run typecheck` - not available as a separate package script; `npm run build` runs `tsc -b`.

## 10. Manual Verification Result

- `http://127.0.0.1:5173/app/farm-records` returned HTTP 200.
- `http://127.0.0.1:5173/app/my-farm` returned HTTP 200.
- Automated tests verify invalid JSON parse failure, non-Farm-Records validation failure, valid M86 JSON backup validation, restore preview counts, raw data URI stripping, GPS-like field exclusion, negative finance amount blocking, confirmation-required restore, unrelated local storage preservation, export-after-restore compatibility, restore/sync UI rendering, and My Farm restore entry rendering.
- In-app Browser verification was attempted, but `agent.browsers.list()` returned no browser targets. No screenshot, mobile-overflow, download-click, restore-click, or console-error browser check was available in this session.

## 11. Known Limitations

- No merge restore mode; M87 supports replace-local restore only.
- No CSV restore.
- No JSON import conflict resolver.
- No undo after restore.
- No bulk delete.
- No cloud sync, cloud backup, cloud restore, or cloud delete.
- No Supabase schema, read, write, sync queue, or migration.
- No GPS/geolocation/map pin/latitude/longitude.
- No AI reading or analysis of farm records or finance entries.
- No receipt/image upload.
- No dedicated browser/mobile screenshot artifact because the Browser target was unavailable.

## 12. Next Recommended Milestone

M88 Farm Records Restore Recovery UX + Sync Architecture Review: add safer restore recovery UX, local backup history guidance, and reviewed cloud-sync architecture artifacts before any Supabase writes or sync queue work.
