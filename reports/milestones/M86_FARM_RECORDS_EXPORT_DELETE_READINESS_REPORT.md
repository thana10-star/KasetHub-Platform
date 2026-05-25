# M86 Farm Records Export/Delete Readiness Report

## 1. Summary

M86 adds local-device export and data-control readiness for Farm Records / สมุดบันทึกฟาร์ม before any future cloud sync. The milestone adds JSON backup helpers, finance CSV helpers, export preview metadata, an Export & Data Control section on `/app/farm-records`, safer archive/close guardrails, and a My Farm data-control entry point.

M86 remains local-first only. It adds no Supabase schema, Supabase write, sync queue, cloud backup, cloud delete, GPS/geolocation/map pin, AI farm-record processing, receipt upload, OCR, notifications, bank/loan/tax integration, bulk delete, server storage, or legal-final PDPA copy.

## 2. Files Created

- `docs/privacy/FARM_RECORDS_DATA_CONTROL_M86.md`
- `reports/milestones/M86_FARM_RECORDS_EXPORT_DELETE_READINESS_REPORT.md`
- `src/services/farm-records/farm-records-export-service.ts`
- `src/services/farm-records/farm-records-export-service.test.ts`
- `src/routes/MyFarmPage.test.tsx`

## 3. Files Modified

- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/MY_FARM_HUB_FOUNDATION.md`
- `docs/privacy/FARM_RECORDS_EXPORT_DELETE_PLAN_M85.md`
- `docs/privacy/FARM_RECORDS_PRIVACY_BOUNDARY_M83.md`
- `src/hooks/useFarmRecords.ts`
- `src/routes/FarmRecordsDebugPage.tsx`
- `src/routes/FarmRecordsDebugPage.test.tsx`
- `src/routes/MyFarmPage.tsx`
- `src/routes/AdminDashboardPage.tsx`
- `src/routes/QAPage.tsx`
- `src/services/admin/admin-dashboard-service.ts`
- `src/services/qa/mvp-readiness-audit.ts`
- `src/services/qa/route-registry.ts`

Verification/build also refreshed generated artifacts: `dist/index.html` and `tsconfig.app.tsbuildinfo`.

## 4. Export Helpers Added

- `buildFarmRecordsJsonBackup()` creates a JSON-safe local backup object with export metadata, farm plots, crop cycles, activity records, finance entries, summary, privacy note, and optional filters.
- `stringifyFarmRecordsJsonBackup()` returns pretty JSON for preview/download.
- `buildFinanceLedgerCsv()` returns UTF-8 friendly CSV with escaped commas, quotes, and newlines.
- `getFarmRecordsExportPreview()` returns counts, totals, estimated JSON/CSV sizes, latest record date, and local-only warnings.
- Export sanitation explicitly whitelists fields and strips `data:` image payloads while preserving image metadata placeholders.

## 5. Export UI Behavior

`/app/farm-records#farm-records-export` now shows an Export & Data Control section with:

- Local-only explanation.
- Record counts and ledger totals.
- Latest record date.
- Estimated JSON and CSV sizes.
- Preview JSON Backup.
- Download JSON Backup.
- Preview Finance CSV.
- Download Finance CSV.
- Truncated preview textareas to avoid rendering huge exports.

Downloads use a local `Blob` + object URL helper with filenames:

- `kasethub-farm-records-backup-YYYY-MM-DD.json`
- `kasethub-farm-finance-ledger-YYYY-MM-DD.csv`

## 6. Delete/Archive Readiness Behavior

- Farm plots can be archived from the Farm Records page.
- Archived plots are visually marked through the existing archived state.
- Linked activity and finance records remain local when a plot is archived.
- Active/planned crop cycles can be marked harvested or cancelled.
- Linked activity and finance records remain local when a crop cycle status changes.
- The data-control guidance card explains current local delete support and why bulk delete is not implemented yet.

## 7. Privacy-Safe Local-First Behavior

- Reuses `kasethub.farmRecords.v1`.
- Adds no new storage key or migration.
- Adds no Supabase writes, sync queue, cloud export, or cloud delete.
- Adds no GPS/geolocation/map pin/latitude/longitude.
- Sends no farm records or finance entries to AI.
- Adds no receipt/image upload.
- JSON backup excludes raw image bytes and `data:` URI payloads.
- User-facing copy says exports come from this device only, cloud sync is not active, downloaded files should be stored safely, and images are metadata-only.

## 8. My Farm Integration

The My Farm Farm Records status card now links to `/app/farm-records#farm-records-export` with copy for exporting and managing Farm Records data. The broader My Farm integration from M85 remains local-only and continues to show Farm Records summary/status without implying sync.

## 9. Tests/Checks Run

- `npm run lint` - passed.
- `npm run build` - passed. Vite emitted the existing large chunk size warning.
- `npm run test` - passed, 27 test files and 267 tests.
- Targeted M86 tests - passed, 4 test files and 18 tests.
- `git diff --check` - no whitespace errors; Git reported existing LF-to-CRLF working-copy warnings.
- `npm run typecheck` - not available as a separate package script; `npm run build` runs `tsc -b`.

## 10. Manual Verification Result

- `http://127.0.0.1:5173/app/farm-records` returned HTTP 200.
- `http://127.0.0.1:5173/app/my-farm` returned HTTP 200.
- Automated tests verify JSON backup contents, summary inclusion, JSON serialization, raw `data:` image exclusion, CSV header and escaping, empty CSV header behavior, export preview warnings, export UI rendering, My Farm data-control entry rendering, archive plot behavior, and crop-cycle close/cancel behavior.
- In-app Browser plugin verification was attempted, but `agent.browsers.list()` returned no browser targets. No screenshot, download-click, mobile-overflow, or console-error browser check was available in this session.

## 11. Known Limitations

- No bulk delete.
- No restore/import flow for JSON backups.
- No production PDF export.
- CSV export is finance-ledger focused only.
- Browser download behavior is implemented but not screenshot/click verified because no Browser target was available.
- No Supabase schema, migration, write, sync queue, cloud backup, or cloud delete.
- No GPS/geolocation/map pin/latitude/longitude.
- No AI reading or analysis of farm records or finance entries.
- No receipt/image upload.
- No legal-final PDPA policy copy.

## 12. Next Recommended Milestone

M87 Farm Records Backup Restore + Sync Consent Gate: add reviewed local JSON restore validation, stronger backup recovery UX, and a consent/readiness gate for any future cloud sync design while keeping Supabase writes disabled until RLS, ownership, and PDPA review are ready.
