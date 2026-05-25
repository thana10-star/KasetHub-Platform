# M84 Farm Records Farmer-Facing UI Report

## 1. Summary

M84 upgrades `/app/farm-records` from an M83 debug/preview surface into the first farmer-facing local Farm Records / สมุดบันทึกฟาร์ม page.

The page now lets a farmer view farm plots, crop cycles, activity records, finance ledger entries, and ledger summary numbers from the M83 local-first service layer. It adds scoped local create flows for plots, crop cycles, activities, and finance entries, plus safe delete confirmations for activity and finance entries.

M84 remains local UI only. It adds no Supabase schema, Supabase write, cloud sync, sync queue, GPS/geolocation/map pin, AI record reading, receipt upload, PDF export, CSV export, notifications, OCR, or legal-final PDPA copy.

## 2. Files Created

- `src/routes/farm-records-page-model.ts`
- `src/routes/FarmRecordsDebugPage.test.tsx`
- `reports/milestones/M84_FARM_RECORDS_FARMER_UI_REPORT.md`

## 3. Files Modified

- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/MY_FARM_HUB_FOUNDATION.md`
- `docs/privacy/FARM_RECORDS_PRIVACY_BOUNDARY_M83.md`
- `src/hooks/useFarmRecords.ts`
- `src/routes/FarmRecordsDebugPage.tsx`
- `src/routes/AdminDashboardPage.tsx`
- `src/routes/QAPage.tsx`
- `src/services/admin/admin-dashboard-service.ts`
- `src/services/farm-records/farm-records-service.test.ts`
- `src/services/qa/mvp-readiness-audit.ts`
- `src/services/qa/route-registry.ts`

Verification/build also refreshed generated/cache artifacts: `dist/index.html` and `tsconfig.app.tsbuildinfo`.

## 4. UI Features Added

- Farmer-facing header with `Farm Records / สมุดบันทึกฟาร์ม`.
- Visible local-only privacy copy: records stay on this device first, no cloud sync, no detailed GPS.
- Summary cards for plots, active crop cycles, activity records, total income, total expense, and net profit.
- Simple filter bar for farm plot, crop cycle, date range, activity type, finance direction, and finance category.
- Farm plot cards with coarse location, area, active cycle count, current crop label, and archived status.
- Crop cycle cards with crop, variety, season, dates, status, and linked plot.
- Activity record cards with date, activity type labels, title, plot, crop cycle, input metadata, description preview, and tags.
- Finance ledger cards with date, direction, category, title, amount, plot/cycle, buyer/vendor, and note preview.
- Ledger summary section using computed local summary data with category breakdowns, cost per rai, entry count, and activity count.

## 5. Create/Edit/Delete Behavior

- Added local create flow for activity records.
- Added local create flow for finance entries.
- Added local create flow for farm plots.
- Added local create flow for crop cycles.
- Added confirmation-based local delete for activity records.
- Added confirmation-based local delete for finance entries.
- Edit flows are not included in M84; they remain a future UI milestone.
- Plot/crop-cycle hard delete is not added. Plots can still be represented safely through the existing local model without destructive linked-record deletion.

## 6. Privacy-Safe Local-First Behavior

- Reuses the M83 `kasethub.farmRecords.v1` local storage key.
- Uses the M83 service and validation/normalization path instead of a parallel UI state store.
- Does not add Supabase writes, cloud sync, sync queue, or production backend calls.
- Does not add GPS coordinates, geolocation, map pins, latitude, or longitude.
- Does not send records or finance data to AI.
- Does not upload receipts or images.
- Keeps visible Thai copy explaining local-first storage and no detailed GPS.

## 7. Responsive/Mobile Notes

- The page uses mobile-first card layouts instead of wide tables.
- Summary cards wrap into two columns on small screens.
- Filters and forms use stacked responsive grids.
- Buttons keep large tap targets.
- Thai labels are allowed to wrap inside controls and cards.
- Browser mobile screenshot verification could not be completed because the in-app Browser connector had no available target in this session.

## 8. Tests/Checks Run

- `npm run lint` - passed.
- `npm run build` - passed. Vite emitted the existing large chunk size warning.
- `npm run test` - passed, 24 test files and 254 tests.
- Targeted Farm Records tests - passed, 2 test files and 11 tests.
- `npm run typecheck` - not available as a separate package script; `npm run build` runs `tsc -b`.
- One discarded targeted test invocation used the unsupported Vitest option `--runInBand`; the same targeted tests were rerun without that option and passed.

## 9. Manual Verification Result

- Existing dev server returned HTTP 200 for `http://127.0.0.1:5173/app/farm-records`.
- Automated server-render test verified the route renders the Farm Records page shell.
- Automated view-model tests verified demo summary data, activity records, finance entries, filtered summaries, empty local data handling, and invalid finance amount blocking.
- In-app Browser plugin verification was attempted, but `agent.browsers.list()` returned no browser targets. No screenshot or console-error browser check was available in this session.

## 10. Known Limitations

- No polished edit flows yet.
- No full CRUD management for linked plot/crop-cycle deletion.
- No Supabase schema, migration, write, sync queue, or cloud backup.
- No GPS, geolocation, map pin, latitude, longitude, or precise location storage.
- No AI reading or analysis of farm records or finance entries.
- No receipt/image upload; M83 metadata placeholders remain only.
- No PDF/CSV export.
- No final legal PDPA policy copy.
- No dedicated browser/mobile screenshot artifact because the Browser target was unavailable.

## 11. Next Recommended Milestone

M85 Farm Records Edit + My Farm Integration: add safe edit flows for activity and finance entries, stronger My Farm entry points/timeline integration, and export/delete planning while keeping the local-first privacy boundary intact.
