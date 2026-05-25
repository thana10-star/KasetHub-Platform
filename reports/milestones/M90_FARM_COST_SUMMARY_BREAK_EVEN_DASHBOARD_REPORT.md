# M90 Farm Cost Summary + Break-even Dashboard Report

## 1. Summary

M90 adds a local-first Farm Cost Dashboard and Break-even Estimate to Farm Records / สมุดบันทึกฟาร์ม. The milestone helps farmers review total income, total expense, net profit/loss, cost per rai, profit per rai, category concentration, top expense categories, and estimated break-even numbers from the existing local Farm Finance Ledger.

M90 remains local-only. It adds no Supabase schema, Supabase read/write, sync queue, cloud sync, cloud backup/delete, GPS/geolocation/map pin, AI farm-record processing, receipt upload, OCR, notifications, tax filing, bank/loan integration, or official accounting/legal claims.

## 2. Files Created

- `docs/farm-records/FARM_COST_DASHBOARD_M90.md`
- `reports/milestones/M90_FARM_COST_SUMMARY_BREAK_EVEN_DASHBOARD_REPORT.md`
- `src/services/farm-records/farm-cost-analytics-service.ts`
- `src/services/farm-records/farm-cost-analytics-service.test.ts`

## 3. Files Modified

- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/MY_FARM_HUB_FOUNDATION.md`
- `docs/privacy/FARM_RECORDS_PRIVACY_BOUNDARY_M83.md`
- `src/routes/FarmRecordsDebugPage.tsx`
- `src/routes/FarmRecordsDebugPage.test.tsx`
- `src/routes/MyFarmPage.tsx`
- `src/routes/MyFarmPage.test.tsx`
- `src/routes/AdminDashboardPage.tsx`
- `src/routes/QAPage.tsx`
- `src/services/admin/admin-dashboard-service.ts`
- `src/services/my-farm/my-farm-hub-service.ts`
- `src/services/my-farm/my-farm-hub-service.test.ts`
- `src/services/my-farm/my-farm.types.ts`
- `src/services/qa/mvp-readiness-audit.ts`
- `src/services/qa/route-registry.ts`

Verification/build also refreshed generated artifacts: `dist/index.html` and `tsconfig.app.tsbuildinfo`.

## 4. Cost Analytics Service Behavior

`src/services/farm-records/farm-cost-analytics-service.ts` adds:

- `computeFarmCostDashboard()` for local income, expense, net profit, profit status, entry/activity counts, per-rai metrics, sorted category breakdowns, top categories, latest dates, and warnings.
- `computeBreakEvenEstimate()` for estimated break-even price per kg, expected revenue, estimated profit/loss, and break-even yield kg.
- `getFarmCostInsights()` for deterministic local Thai insights.

The service respects farm plot, crop cycle, start date, and end date filters. It handles empty data, zero area, missing yield, missing price, and divide-by-zero cases safely.

## 5. Dashboard UI Behavior

`/app/farm-records#farm-cost-dashboard` now shows:

- Total income.
- Total expense.
- Net profit/loss.
- Cost per rai.
- Profit per rai.
- Top expense category.
- Profit/loss status copy.
- Latest finance and activity dates.
- Deterministic local insights.
- Expense by category and income by category rows with percentages.

The dashboard uses the existing Farm Records filter state for farm plot, crop cycle, and date range.

## 6. Break-even Calculator Behavior

The Break-even Estimate section accepts:

- Expected yield in kg.
- Expected selling price per kg.
- Optional area rai override.

It outputs estimated break-even price per kg, expected revenue, estimated profit/loss, break-even yield kg, and warnings when inputs are missing or zero. Copy clearly says the estimate is based only on local records and is not accounting, tax, loan, legal, or financial advice.

## 7. My Farm Integration

`/app/my-farm` now surfaces Farm Records cost summary context:

- Farm Records insight routes to the Farm Records page.
- Summary fields include cost per rai when available.
- Summary fields include top expense category and amount when available.
- The My Farm Farm Records card links to `/app/farm-records#farm-cost-dashboard`.

The hub still says local-only and does not imply cloud backup or sync.

## 8. Privacy/Local-only/Accounting Disclaimer Behavior

- Calculations run only from `kasethub.farmRecords.v1`.
- No Supabase read/write or backend call is added.
- No cloud sync, cloud backup, or cloud delete is added.
- No AI analysis of farm records or finance entries is added.
- No GPS/geolocation/map pin/latitude/longitude is added.
- No receipt/image upload is added.
- UI and docs state that the dashboard is not official accounting, tax, loan, legal, or financial advice.

## 9. Tests/Checks Run

- `npm run lint` - passed.
- `npm run build` - passed after fixing a typed My Farm hash-route mismatch. Vite emitted the existing large chunk size warning.
- `npm run test` - passed, 31 test files and 297 tests.
- Targeted M90 tests - passed, 4 test files and 21 tests.
- `git diff --check` - no whitespace errors; Git reported existing LF-to-CRLF working-copy warnings.
- `npm run typecheck` - not available as a separate package script; `npm run build` runs `tsc -b`.

## 10. Manual Verification Result

- `http://127.0.0.1:5173/app/farm-records` returned HTTP 200.
- `http://127.0.0.1:5173/app/my-farm` returned HTTP 200.
- Automated tests verify dashboard totals, profit statuses, cost per rai safety, sorted category breakdowns, top expense category, break-even math, missing-input warnings, deterministic insights, filters, UI rendering, and My Farm cost summary visibility.
- In-app Browser verification was attempted after reading the Browser plugin instructions, but `agent.browsers.list()` returned no browser targets. No screenshot, mobile-overflow, calculator-click, or console-error browser check was available in this session.

## 11. Known Limitations

- Break-even is an estimate from recorded local ledger data only.
- No actual harvested quantity model yet, so actual cost per kg is not stored as source data.
- No saved dashboard presets.
- No chart library; category breakdowns use simple local rows.
- No Supabase schema, read, write, sync queue, cloud sync, cloud backup, or cloud delete.
- No AI reading or analysis of farm records or finance entries.
- No GPS/geolocation/map pin/latitude/longitude.
- No receipt/image upload.
- No official accounting, tax, loan, legal, or financial advice.
- No Browser screenshot/mobile artifact because no Browser target was available.

## 12. Next Recommended Milestone

M91 Farm Records Harvest Yield + Cost-per-Kg Readiness: add local harvested quantity modeling, yield summaries, and safer cost-per-kg analytics while keeping cloud sync, Supabase writes, AI processing, GPS, and official accounting/tax claims disabled.
