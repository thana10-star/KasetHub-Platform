# M63 Ownership / RLS Sync Gate Review

M63 prepares the safety gate required before any Guest Memory upload to Supabase.

## Status

- No Guest Memory upload.
- No cloud sync.
- No Supabase app table writes.
- No Edge Function deployment.
- No service-role key in frontend.
- No production auth enablement.
- No automatic SQL execution.

## Gate Requirements

Before sync can be enabled in a later milestone, the app must prove:

- A real Supabase Auth session exists.
- A local mock phone session does not count as ownership.
- The backend owner id matches `auth.uid()`.
- Local Guest Memory data exists and can be summarized safely.
- The user explicitly consents to upload.
- An idempotency key exists for retries.
- Audit logging exists for success, partial success, failure, and rollback.
- RLS policies enforce owner-only access.
- Service-role keys stay backend-only.

## M63 Decision

M63 always returns `syncAllowed: false`. Even a real staging session is only evidence for review. Upload waits for owner-scoped RLS dry-run, consent capture, idempotency, and audit logging.

## App Route

- `/app/ownership-rls-gate`

The route shows ownership status, blockers, consent/idempotency/audit requirements, RLS expectations, and a clear `ยังไม่อัปโหลดข้อมูลจริง` notice.
