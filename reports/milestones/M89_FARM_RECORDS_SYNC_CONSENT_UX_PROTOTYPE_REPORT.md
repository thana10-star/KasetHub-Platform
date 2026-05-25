# M89 Farm Records Sync Consent UX Prototype Report

## 1. Summary

M89 adds a non-writing Cloud Sync Consent Prototype for Farm Records / สมุดบันทึกฟาร์ม and creates the future owner/RLS test plan needed before any cloud sync implementation.

The prototype explains what future cloud sync would mean, what data could be included, what is excluded by default, and why Farm Finance data requires careful consent. The Enable Cloud Sync action remains disabled. M89 adds no Supabase schema, migration, read, write, sync queue, cloud sync, cloud backup, cloud delete, GPS/geolocation/map pin, AI farm-record processing, receipt upload, OCR, notifications, payment/billing, or legal-final PDPA copy.

## 2. Files Created

- `docs/sync/FARM_RECORDS_OWNER_RLS_TEST_PLAN_M89.md`
- `docs/sync/FARM_RECORDS_SYNC_CONSENT_UX_M89.md`
- `reports/milestones/M89_FARM_RECORDS_SYNC_CONSENT_UX_PROTOTYPE_REPORT.md`
- `src/services/farm-records/farm-records-sync-consent-prototype.ts`
- `src/services/farm-records/farm-records-sync-consent-prototype.test.ts`

## 3. Files Modified

- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/MY_FARM_HUB_FOUNDATION.md`
- `docs/privacy/FARM_RECORDS_DATA_CONTROL_M86.md`
- `docs/privacy/FARM_RECORDS_PRIVACY_BOUNDARY_M83.md`
- `docs/privacy/FARM_RECORDS_RESTORE_SYNC_CONSENT_M87.md`
- `docs/sync/FARM_RECORDS_SYNC_ARCHITECTURE_REVIEW_M88.md`
- `docs/sync/FARM_RECORDS_SYNC_READINESS_CHECKLIST_M88.md`
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

## 4. Sync Consent UX Prototype Behavior

`/app/farm-records#farm-records-sync` now includes a Cloud Sync Consent Prototype section with:

- Future sync explanation.
- Included data list: farm plots, crop cycles, activity records, finance ledger entries, image metadata only, and restore/export metadata.
- Excluded data list: raw image files, GPS/precise coordinates, AI analysis history, unrelated local storage, and non-Farm-Records app data.
- Separate consent categories for cloud sync, AI analysis, GPS/precise location, and image/receipt upload.
- Calm Thai/English copy stating data is still local, cloud sync is not enabled, future sync requires consent, and finance records may be sensitive.
- Disabled Enable Cloud Sync button with blocker copy for Supabase RLS, ownership tests, cloud export/delete, and privacy review.

## 5. Prototype Local State Behavior

`src/services/farm-records/farm-records-sync-consent-prototype.ts` adds prototype-only local state under `kasethub.farmRecords.syncConsentPrototype.v1`.

This state is local-only, is not legal consent, does not unlock sync, does not call Supabase, and does not touch unrelated local storage keys.

## 6. Owner/RLS Test Plan Summary

`docs/sync/FARM_RECORDS_OWNER_RLS_TEST_PLAN_M89.md` defines future tests for conceptual Farm Records sync tables, owner-only select/insert/update/delete, cross-user denial, anonymous denial, service-role boundaries, audit/idempotency, cloud export/delete, and conflict/sync queue behavior.

No Supabase schema, migration, policy, or query was implemented.

## 7. Updated Sync Readiness Status

The disabled sync readiness checklist now distinguishes:

- Local Farm Records, export, restore, and restore recovery as ready.
- Sync consent UX as prototype only.
- Owner/RLS design as documented only.
- Supabase RLS, sync queue, conflict handling, cloud delete/export, and production privacy policy as not implemented.
- AI consent as a separate future gate.

## 8. Privacy-Safe Local-First Behavior

- Reuses `kasethub.farmRecords.v1` for Farm Records data.
- Adds only the scoped prototype key `kasethub.farmRecords.syncConsentPrototype.v1`.
- Adds no Supabase read/write, backend call, sync queue, cloud backup, or cloud delete.
- Adds no GPS/geolocation/map pin/latitude/longitude.
- Sends no farm records or finance entries to AI.
- Adds no receipt/image upload.
- Does not collect legal consent.

## 9. My Farm Integration

The My Farm Farm Records card now links to `/app/farm-records#farm-records-sync` and shows:

- `Backup/Restore ready locally`
- `Cloud Sync: Not enabled`
- `Sync consent: Prototype only`

The hub still does not imply cloud backup or cross-device sync.

## 10. Tests/Checks Run

- `npm run lint` - passed.
- `npm run build` - passed. Vite emitted the existing large chunk size warning.
- `npm run test` - passed, 30 test files and 288 tests.
- Targeted M89 tests - passed, 4 test files and 26 tests.
- `git diff --check` - no whitespace errors; Git reported existing LF-to-CRLF working-copy warnings.
- `npm run typecheck` - not available as a separate package script; `npm run build` runs `tsc -b`.

## 11. Manual Verification Result

- `http://127.0.0.1:5173/app/farm-records` returned HTTP 200.
- `http://127.0.0.1:5173/app/my-farm` returned HTTP 200.
- Automated tests verify the consent prototype section, included/excluded data lists, separate consent categories, disabled Enable Cloud Sync action, local prototype state, readiness blockers, My Farm sync status, and no sync-enabled copy.
- In-app Browser verification was attempted after reading the Browser plugin instructions, but `agent.browsers.list()` returned no browser targets. No screenshot, mobile-overflow, checkbox-click, or console-error browser check was available in this session.

## 12. Known Limitations

- Prototype checkbox state is local UI preview only and is not legal consent.
- No real consent versioning or withdrawal flow.
- No Supabase schema, migration, read, write, RLS policy, or sync queue.
- No production cloud sync, cloud backup, or cloud delete.
- No cloud export/delete implementation.
- No GPS/geolocation/map pin/latitude/longitude.
- No AI reading or analysis of farm records or finance entries.
- No receipt/image upload.
- No Browser screenshot/mobile artifact because no Browser target was available.

## 13. Next Recommended Milestone

M90 Farm Records Sync RLS Draft Review: create planning-only SQL/RLS draft artifacts and policy review fixtures for future Farm Records sync while keeping migrations, Supabase writes, and sync queues disabled.
