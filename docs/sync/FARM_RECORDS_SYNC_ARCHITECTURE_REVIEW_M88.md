# Farm Records Sync Architecture Review M88

## 1. Purpose

Farm Records sync must only be added after consent, owner-only access, RLS, export/delete, audit, idempotency, conflict review, and recovery are ready. Farm Records and Farm Finance Ledger data can reveal crop plans, labor behavior, input use, income, costs, profit, buyer/vendor patterns, and business activity.

M88 is architecture review only. It does not add Supabase schema, Supabase reads/writes, sync queue, cloud backup, cloud delete, GPS, AI processing, image upload, OCR, notifications, or server-side restore.

## M89 Status Update

M89 adds a non-writing Cloud Sync Consent Prototype and `docs/sync/FARM_RECORDS_OWNER_RLS_TEST_PLAN_M89.md`. The prototype is local UI only and may store preview checkbox state under `kasethub.farmRecords.syncConsentPrototype.v1`; this is not legal consent and cannot enable sync.

- Sync consent UX prototype added.
- Owner/RLS future test plan added.
- Supabase implementation is still not started.
- Sync queue is still not implemented.
- Cloud sync remains disabled.
- Cloud export/delete remains future work.
- AI, GPS, and image/receipt upload consent remain separate future gates.

## 2. Current Status

- Local-first storage is active under `kasethub.farmRecords.v1`.
- Local JSON export is available.
- Local finance CSV export is available.
- Local JSON restore is available with validation, preview, and explicit confirmation.
- Restore recovery guidance and pre-restore snapshot/download are available locally.
- Sync Consent Gate is disabled.
- Supabase writes are disabled.
- Cloud backup is not implemented.
- GPS/geolocation is not used.
- AI access to Farm Records is disabled.

## 3. Future Sync Data Model Draft

Conceptual tables only, no migration:

- `farm_plots`
- `crop_cycles`
- `farm_activity_records`
- `farm_finance_entries`
- `farm_record_sync_audit` or shared `audit_events`
- `farm_record_sync_conflicts` if user-visible conflict resolution is needed later

Each table needs ownership fields, timestamps, local/source IDs for idempotency, and clear deletion/archive semantics before any write path is enabled.

## 4. Ownership/RLS Requirements

- Every row must be owned by an authenticated user.
- Owner-only select, insert, update, and delete policies are required.
- No public read policy is allowed for Farm Records or finance ledger data.
- Cross-user access must be impossible through direct client queries.
- Service-role access may be used only for controlled backend/admin operations, never as a client bypass.
- RLS tests must cover reads, writes, deletes, cross-user denial, unauthenticated denial, and service-role boundaries before enabling writes.

## 5. Consent Requirements

Separate consent is required for:

- Cloud sync of Farm Records.
- AI analysis of Farm Records or Farm Finance Ledger.
- GPS or precise location if ever added.
- Image or receipt upload if ever added.

Cloud sync consent must not imply AI consent, GPS consent, receipt upload consent, marketing consent, or cross-device backup guarantees beyond what is implemented.

## 6. Sync Queue Design Draft

High-level only, no implementation in M88:

- Local operation ID.
- Entity type.
- Entity ID.
- Operation type.
- Local `updatedAt`.
- Sync status.
- Retry count.
- Last error.
- Idempotency key.

Queue behavior must support offline-first usage, retry without duplication, user-visible errors, cancellation/disable controls, and recovery from partial failures.

## 7. Conflict Strategy Draft

- Latest `updatedAt` alone is not enough for financial data.
- Additive records are easier to sync than destructive edits/deletes.
- Edits and deletes need audit trail and user-visible review for risky conflicts.
- Finance entries should preserve history carefully because changing a cost/income entry changes profit.
- Crop-cycle status changes need clear behavior when local and cloud states disagree.
- Prefer user-visible conflict review for destructive conflicts instead of silent overwrite.

## 8. Delete/Export Requirements Before Sync

- Local export must exist and remain available.
- Cloud export must be designed before production sync.
- Local delete behavior must remain clear.
- Cloud delete must respect owner-only access.
- Bulk delete must require multi-confirmation.
- Audit logs must exist for sync writes, deletes, and conflict decisions.
- Export/delete must not send Farm Records to AI.

## 9. Rollback/Recovery Requirements

- Users must be able to restore from a local backup.
- There must be a cloud sync disable switch.
- Users must be able to stop sync before more data leaves the device.
- Sync errors must be visible and actionable.
- No silent data loss.
- Rollback needs an operator/support playbook before production.

## 10. Explicit M88 Non-Goals

- No Supabase migration.
- No Supabase read or write.
- No sync queue implementation.
- No production cloud sync.
- No cloud backup.
- No cloud delete.
- No server-side restore.
- No GPS/geolocation/map pins.
- No AI Farm Records processing.
- No receipt/image upload.
- No legal-final PDPA policy copy.
