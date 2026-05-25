# Farm Records Owner/RLS Test Plan M89

## 1. Purpose

This plan defines the future Supabase ownership and RLS tests required before Farm Records cloud sync can be implemented. M89 does not add tables, migrations, Supabase reads/writes, sync queues, cloud backup, or cloud delete.

## 2. Assumptions

- Farm Records remains local-first under `kasethub.farmRecords.v1`.
- Future synced rows must belong to one authenticated user.
- Client code must never use a service-role key.
- Cloud sync consent, AI consent, GPS consent, and image/receipt upload consent are separate gates.

## 3. Future Table Ownership Requirements

Conceptual tables:

- `farm_plots`
- `crop_cycles`
- `farm_activity_records`
- `farm_finance_entries`
- `farm_harvest_records`
- `farm_record_sync_audit`
- `farm_record_sync_conflicts`, if conflict review is added later

Each table needs an immutable owner field, timestamps, local/source IDs for idempotency, and clear archive/delete semantics.

## 4. RLS Policy Test Matrix

| Table | Select Own | Insert Own | Update Own | Delete Own | Cross-User Deny | Anonymous Deny |
| --- | --- | --- | --- | --- | --- | --- |
| `farm_plots` | required | required | required | archive/delete rules required | required | required |
| `crop_cycles` | required | required | required | close/cancel/delete rules required | required | required |
| `farm_activity_records` | required | required | required | required | required | required |
| `farm_finance_entries` | required | required | required | required | required | required |
| `farm_harvest_records` | required | required | required | required | required | required |
| `farm_record_sync_audit` | required | backend-controlled insert | append-only preferred | deny by default | required | required |
| `farm_record_sync_conflicts` | required | backend/sync-controlled insert | reviewed update only | deny until designed | required | required |

## 5. Insert Tests

- Authenticated user can insert only rows with their own owner ID.
- Client cannot spoof another owner ID.
- Required ownership fields cannot be null.
- Finance entries require non-negative numeric amounts.
- GPS/latitude/longitude fields are not accepted unless a future consented schema adds them.

## 6. Select Tests

- User can read only their own plots, cycles, activities, finance entries, audit rows, and conflict rows.
- Cross-user rows return zero results.
- Anonymous users cannot read any Farm Records data.
- Public read policies are not allowed.

## 7. Update Tests

- User can update only their own rows.
- Cross-user update attempts fail.
- Owner field cannot be changed by client update.
- Archive/close/cancel status changes preserve linked records.
- Finance edits are audited or versioned before production sync.

## 8. Delete Tests

- User can delete only their own allowed activity/finance rows.
- Plot hard delete remains blocked unless linked-record behavior is explicitly designed.
- Bulk delete requires multi-confirmation and audit.
- Cross-user delete attempts fail.

## 9. Cross-User Access Denial Tests

- User A cannot select, insert as, update, or delete User B records.
- User A cannot infer User B row existence through errors, counts, or conflict rows.
- Sync conflict queries must be scoped to the owner.

## 10. Service-Role Boundary Tests

- Service-role keys are never exposed to frontend code or env shipped to browsers.
- Service-role operations are backend-only, audited, and narrowly scoped.
- Admin/support tools must not bypass owner checks without an approved support workflow.

## 11. Anonymous Access Denial Tests

- Anonymous select/insert/update/delete fails for every Farm Records table.
- Anonymous RPC or storage access cannot retrieve Farm Records or finance ledger data.
- Anonymous users cannot create audit or conflict rows.

## 12. Audit/Idempotency Tests

- Replayed sync operations with the same idempotency key do not duplicate records.
- Sync audit rows capture operation type, entity type, entity ID, owner ID, client operation ID, and result.
- Failed operations keep safe error visibility without leaking other-user data.

## 13. Cloud Delete/Export Tests

- Owner can export only their own cloud Farm Records data.
- Cloud delete affects only the owner account.
- Bulk cloud delete requires multi-confirmation and audit.
- Export excludes raw image bytes unless a future image-backup system exists.

## 14. Conflict/Sync Queue Tests

- Additive local records sync without duplication.
- Updates preserve local operation IDs and `updatedAt`.
- Deletes and finance edits produce audit/conflict records instead of silent loss.
- Latest timestamp alone is not accepted as the only conflict rule for finance data.

## 15. Manual QA Checklist

- Consent copy reviewed.
- Owner/RLS SQL reviewed by another engineer.
- Browser/mobile QA completed.
- Offline/online transition QA completed.
- Disable-sync behavior tested.
- Export/delete/recovery flows retested after sync prototype changes.

## 16. Non-Goals For M89

- No Supabase schema or migration.
- No Supabase read/write.
- No sync queue.
- No cloud sync, cloud backup, or cloud delete.
- No GPS/geolocation.
- No AI Farm Records processing.
- No receipt/image upload.
- No legal-final PDPA policy copy.
