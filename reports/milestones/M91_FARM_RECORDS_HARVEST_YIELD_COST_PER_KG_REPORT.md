# M91 Farm Records Harvest Yield + Cost-per-Kg Readiness Report

## 1. Summary

M91 adds local harvested quantity/yield modeling and safer cost-per-kg analytics to Farm Records / สมุดบันทึกฟาร์ม.

The milestone adds a dedicated local `farmHarvestRecords` slice, harvest CRUD service operations, demo harvest data, Harvest & Yield UI, cost-per-kg/yield analytics, My Farm harvest/cost-per-kg visibility, and export/restore/pre-restore compatibility for harvest records.

M91 remains local-only. It adds no Supabase schema, Supabase read/write, sync queue, cloud sync, cloud backup/delete, GPS/geolocation/map pin, AI farm-record processing, receipt upload, OCR, notifications, tax filing, bank/loan integration, production PDPA legal copy, or official accounting/tax/loan/yield guarantee claims.

## 2. Files Created

- `docs/farm-records/FARM_HARVEST_YIELD_M91.md`
- `reports/milestones/M91_FARM_RECORDS_HARVEST_YIELD_COST_PER_KG_REPORT.md`

## 3. Files Modified

- `README.md`
- `docs/MY_FARM_HUB_FOUNDATION.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/farm-records/FARM_COST_DASHBOARD_M90.md`
- `docs/privacy/FARM_RECORDS_DATA_CONTROL_M86.md`
- `docs/privacy/FARM_RECORDS_EXPORT_DELETE_PLAN_M85.md`
- `docs/privacy/FARM_RECORDS_PRIVACY_BOUNDARY_M83.md`
- `docs/privacy/FARM_RECORDS_RESTORE_SYNC_CONSENT_M87.md`
- `docs/sync/FARM_RECORDS_SYNC_ARCHITECTURE_REVIEW_M88.md`
- `docs/sync/FARM_RECORDS_SYNC_CONSENT_UX_M89.md`
- `docs/sync/FARM_RECORDS_OWNER_RLS_TEST_PLAN_M89.md`
- `docs/sync/FARM_RECORDS_SYNC_READINESS_CHECKLIST_M88.md`
- `src/hooks/useFarmRecords.ts`
- `src/routes/AdminDashboardPage.tsx`
- `src/routes/FarmRecordsDebugPage.tsx`
- `src/routes/FarmRecordsDebugPage.test.tsx`
- `src/routes/MyFarmPage.tsx`
- `src/routes/MyFarmPage.test.tsx`
- `src/routes/QAPage.tsx`
- `src/routes/farm-records-page-model.ts`
- `src/services/admin/admin-dashboard-service.ts`
- `src/services/farm-records/farm-cost-analytics-service.ts`
- `src/services/farm-records/farm-cost-analytics-service.test.ts`
- `src/services/farm-records/farm-records-config.ts`
- `src/services/farm-records/farm-records-export-service.ts`
- `src/services/farm-records/farm-records-export-service.test.ts`
- `src/services/farm-records/farm-records-fixtures.ts`
- `src/services/farm-records/farm-records-restore-recovery-service.ts`
- `src/services/farm-records/farm-records-restore-recovery-service.test.ts`
- `src/services/farm-records/farm-records-restore-service.ts`
- `src/services/farm-records/farm-records-restore-service.test.ts`
- `src/services/farm-records/farm-records-service.ts`
- `src/services/farm-records/farm-records-service.test.ts`
- `src/services/farm-records/farm-records-sync-consent-prototype.ts`
- `src/services/farm-records/farm-records.types.ts`
- `src/services/my-farm/my-farm-hub-service.ts`
- `src/services/my-farm/my-farm-hub-service.test.ts`
- `src/services/my-farm/my-farm.types.ts`
- `src/services/qa/mvp-readiness-audit.ts`
- `src/services/qa/route-registry.ts`

Verification/build also refreshed generated artifacts: `dist/index.html`, `node_modules/.vite/deps/_metadata.json`, and `tsconfig.app.tsbuildinfo`.

## 4. Harvest/Yield Model Behavior

- Added `FarmHarvestRecord` with plot/cycle links, harvest date, crop name, quantity/unit, normalized kg, grade, buyer, sale price per kg, gross income, note, and timestamps.
- Supported units are `kg`, `ton`, `sack`, `basket`, and `other`.
- `kg` and `ton` normalize to kg. Other units are preserved but excluded from cost-per-kg math until a future conversion model exists.
- Quantity validation requires numeric non-negative values.
- Dates remain stable string dates.

## 5. Local Storage/Migration Behavior

- Added `farmHarvestRecords` to `kasethub.farmRecords.v1`.
- Existing local storage key is preserved.
- Old local states default safely to an empty harvest array.
- Malformed harvest records are normalized or removed without crashing.
- No unrelated local storage keys are touched.

## 6. Harvest Analytics Behavior

`computeHarvestYieldSummary()` now computes:

- Total harvested kg.
- Harvest record count.
- Yield per rai.
- Total income, expense, and net profit.
- Cost per kg.
- Income per kg.
- Profit per kg.
- Average sale price per kg.
- Actual recorded break-even price per kg.
- Latest harvest date.
- Missing-data and non-normalized-unit warnings.

The M90 cost dashboard now includes harvest kg, harvest record count, yield per rai, cost per kg, income per kg, profit per kg, recorded break-even price per kg, and latest harvest date where available.

## 7. UI Behavior

`/app/farm-records#farm-harvest-yield` now shows:

- Harvest & Yield / ผลผลิตและการเก็บเกี่ยว.
- Total harvested kg.
- Harvest record count.
- Yield per rai.
- Cost per kg.
- Income per kg.
- Profit per kg.
- Average sale price per kg.
- Actual recorded break-even price per kg.
- Latest harvest date.
- Harvest warnings and local-only copy.
- Harvest record list.
- Local create form.
- Local delete confirmation for one harvest record.

## 8. Cost-per-Kg Dashboard Behavior

The Farm Cost Dashboard now shows recorded harvest metrics separately from the estimate calculator. Cost per kg and profit per kg are computed from local ledger expense/income and normalized harvested kg only.

The UI copy states that cost-per-kg and yield outputs are local estimates from records on this device and are not official accounting, tax, loan, legal, or yield guarantee outputs.

## 9. Export/Restore Compatibility

- JSON backup includes `farmHarvestRecords`.
- Export preview counts harvest records.
- Restore validation accepts old backups without harvest records and defaults to an empty slice.
- Restore validation checks harvest IDs, dates, and non-negative quantity for new backups.
- Restore preview and risk review include harvest record counts.
- Pre-restore snapshots include harvest records.
- Raw image `data:` payload and GPS/geolocation sanitation remain intact.
- Finance CSV remains finance-ledger focused only.

## 10. Privacy/Local-only/Accounting Disclaimer Behavior

- Harvest/yield data stays local under `kasethub.farmRecords.v1`.
- Harvest/yield data may reveal production volume and business performance.
- No Supabase read/write, sync queue, cloud sync, cloud backup, or cloud delete is added.
- No GPS/geolocation/map pin/latitude/longitude is added.
- No farm records or finance entries are sent to AI.
- No receipt/image upload is added.
- UI/docs state that cost-per-kg and yield values are estimates, not official accounting, tax, loan, legal, or yield guarantee claims.

## 11. Tests/Checks Run

- `npm run lint` - passed.
- `npm run build` - passed. Vite emitted the existing large chunk size warning.
- `npm run test` - passed, 31 test files and 303 tests.
- Targeted M91 tests - passed, 8 test files and 54 tests.
- `git diff --check` - no whitespace errors; Git reported existing LF-to-CRLF working-copy warnings.
- `npm run typecheck` - not available as a separate package script; `npm run build` runs `tsc -b`.

## 12. Manual Verification Result

- `http://127.0.0.1:5173/app/farm-records` returned HTTP 200.
- `http://127.0.0.1:5173/app/my-farm` returned HTTP 200.
- Automated tests verify harvest defaults, create/update/delete, unit normalization, invalid quantity blocking, harvest summary math, yield per rai, cost per kg, profit per kg, filters, export/restore/snapshot compatibility, UI rendering, and My Farm harvest/cost-per-kg visibility.
- In-app Browser verification was attempted after reading the Browser plugin instructions, but `agent.browsers.list()` returned no browser targets. No screenshot, mobile-overflow, form-click, or console-error browser check was available in this session.

## 13. Known Limitations

- No harvest edit form yet.
- No harvest CSV export.
- No restore conflict resolver or merge mode.
- Non-kg/ton harvest units are preserved but not converted to kg.
- No actual harvested-quality/grade analytics beyond display fields.
- No Supabase schema, read, write, sync queue, cloud sync, cloud backup, or cloud delete.
- No GPS/geolocation/map pin/latitude/longitude.
- No AI reading or analysis of farm records or finance entries.
- No receipt/image upload.
- No official accounting, tax, loan, legal, financial, or yield guarantee claim.
- No Browser screenshot/mobile artifact because no Browser target was available.

## 14. Next Recommended Milestone

M92 Farm Records Harvest Edit + Sales Linkage Readiness: add safe harvest edit flows, optional local linkage between harvest records and crop-sale income entries, and clearer actual-vs-estimated yield/cost views while keeping cloud sync, Supabase writes, AI processing, GPS, receipt upload, and official accounting/tax claims disabled.
