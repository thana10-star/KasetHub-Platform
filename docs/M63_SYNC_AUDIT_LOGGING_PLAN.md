# M63 Sync Audit Logging Plan

Audit logging is required before Guest Memory cloud sync.

## Required Audit Events

- Sync requested.
- Auth/session verified.
- Consent verified.
- Idempotency key accepted.
- RLS owner check passed.
- Records prepared.
- Records created.
- Records merged.
- Records skipped.
- Partial success.
- Retry requested.
- Failure and rollback.

## Data Minimization

Audit logs should store masked user display values in UI and avoid sensitive payloads. Backend logs may store owner ids only where required for security and debugging.

## Rollback Requirement

Local Guest Memory must remain intact until backend confirms success. Failure logs must support safe retry without deleting local data.

## M63 Boundary

No audit table is created and no audit row is written in M63.

## M64 Audit Preview

M64 adds a local `auditPreview` inside the dry-run payload. It shows a planned audit event id, event types, masked owner id, record count, and generated timestamp, while keeping `wouldWriteAuditLog: false`.
