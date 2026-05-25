# M85 Farm Records Edit + My Farm Integration Report

## 1. Summary

M85 improves the local-first Farm Records / สมุดบันทึกฟาร์ม feature with safe edit flows for farm activity records and finance ledger entries, clearer local-only delete copy, a Recent Farm Timeline, and stronger My Farm hub integration.

The milestone remains local UI and planning only. It adds no Supabase schema, Supabase write, sync queue, cloud backup, GPS/geolocation/map pin, AI record processing, receipt upload, OCR, notification system, actual PDF export, actual CSV export, bulk delete, bank/loan/tax integration, or legal-final PDPA copy.

## 2. Files Created

- `docs/privacy/FARM_RECORDS_EXPORT_DELETE_PLAN_M85.md`
- `reports/milestones/M85_FARM_RECORDS_EDIT_MY_FARM_INTEGRATION_REPORT.md`
- `src/services/my-farm/my-farm-hub-service.test.ts`

## 3. Files Modified

- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/MY_FARM_HUB_FOUNDATION.md`
- `docs/privacy/FARM_RECORDS_PRIVACY_BOUNDARY_M83.md`
- `src/hooks/useMyFarmHub.ts`
- `src/routes/FarmRecordsDebugPage.tsx`
- `src/routes/FarmRecordsDebugPage.test.tsx`
- `src/routes/MyFarmPage.tsx`
- `src/routes/AdminDashboardPage.tsx`
- `src/routes/QAPage.tsx`
- `src/routes/farm-records-page-model.ts`
- `src/services/admin/admin-dashboard-service.ts`
- `src/services/my-farm/my-farm-hub-service.ts`
- `src/services/my-farm/my-farm.types.ts`
- `src/services/qa/mvp-readiness-audit.ts`
- `src/services/qa/route-registry.ts`

Verification/build also refreshed generated artifacts: `dist/index.html` and `tsconfig.app.tsbuildinfo`.

## 4. Edit Flows Added

- Activity cards now include an Edit action.
- Finance ledger cards now include an Edit action.
- Edit forms reuse the M84 create form style and prefill existing values.
- Save uses the existing M83 local service/hook update path.
- Cancel closes the form without changing the original record.
- Activity validation keeps required plot/date/type/title checks.
- Finance validation requires title, date, direction, category, and numeric non-negative amount.
- Direction changes reset mismatched finance categories safely.
- Service updates preserve `createdAt` and update `updatedAt`.

## 5. My Farm Integration Added

- `/app/my-farm` now reads `kasethub.farmRecords.v1` through `useFarmRecords()`.
- My Farm quick actions include a visible Farm Records entry point.
- My Farm shows Farm Records status for net profit, active crop cycles, latest activity date, and latest finance entry date.
- My Farm timeline now includes local farm activity and farm finance events.
- Admin/QA/route registry wording now describes the feature as local-first M85 UI, not production synced storage.

## 6. Recent Timeline Behavior

`/app/farm-records` now includes a Recent Farm Timeline that combines activity records, income entries, and expense entries, sorted by date descending. Timeline items show date, type, title, plot/crop-cycle context, activity type, and finance amount where relevant.

## 7. Privacy-Safe Local-First Behavior

- Reuses `kasethub.farmRecords.v1`.
- Adds no new local storage key or migration.
- Adds no Supabase writes, schema, sync queue, or cloud backup.
- Adds no GPS/geolocation/map pin/latitude/longitude.
- Sends no farm records or finance entries to AI.
- Adds no image/receipt upload.
- Delete confirmation copy now says records are deleted only from this device, cloud sync is not active, and recovery is unavailable without future export/backup.

## 8. Export/Delete Planning Document Summary

`docs/privacy/FARM_RECORDS_EXPORT_DELETE_PLAN_M85.md` documents why export/delete matters for PDPA and user trust, future export contents, future delete tools, safety requirements, future JSON/CSV/PDF format planning, and explicit M85 non-goals. It does not implement export, CSV, PDF, bulk delete, or cloud delete.

## 9. Tests/Checks Run

- `npm run lint` - passed.
- `npm run build` - passed. Vite emitted the existing large chunk size warning.
- `npm run test` - passed, 25 test files and 260 tests.
- Targeted M85 tests - passed, 2 test files and 11 tests.
- `npm run typecheck` - not available as a separate package script; `npm run build` runs `tsc -b`.

## 10. Manual Verification Result

- `http://127.0.0.1:5173/app/farm-records` returned HTTP 200.
- `http://127.0.0.1:5173/app/my-farm` returned HTTP 200.
- Automated tests verify edit prefill, edit save, cancel preservation, finance summary recomputation, invalid amount blocking, direction/category reset, recent timeline creation, My Farm entry/status integration, and delete copy.
- In-app Browser plugin verification was attempted, but `agent.browsers.list()` returned no browser targets. No screenshot or console-error browser check was available in this session.

## 11. Known Limitations

- No polished edit flows for plots or crop cycles.
- No undo after delete.
- No export, CSV, PDF, or bulk delete implementation.
- No Supabase schema, migration, write, sync queue, or cloud backup.
- No GPS/geolocation/map pin/latitude/longitude.
- No AI reading or analysis of farm records or finance entries.
- No receipt/image upload.
- No dedicated browser/mobile screenshot artifact because the Browser target was unavailable.

## 12. Next Recommended Milestone

M86 Farm Records Export/Delete Readiness: add reviewed local JSON backup preview, finance CSV preview, and stronger delete/archive UX planning before any cloud sync work.
