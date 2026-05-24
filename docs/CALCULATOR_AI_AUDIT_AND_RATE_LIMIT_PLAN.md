# Calculator AI Audit And Rate Limit Plan

M56 defines future audit logging and rate-limit planning for calculator AI explanations. The current implementation is local-only and does not write audit rows.

## Rate-limit Planning

Planned limits:

- 5 basic explanations per day
- 3 future rewarded-ad convenience unlocks per day
- repeated request window: 10 minutes
- repeated request max count: 3
- max prompt payload: 4,200 characters
- max user question: 800 characters
- oversized payload action: reject before AI
- invalid crop profile action: reject or clear crop context

Basic calculator results and safety copy must remain free. Rewarded ads may unlock convenience only, not essential warnings or formula output.

## Abuse Scenarios

Planned abuse handling covers:

- repeated explanation spam for the same summary
- oversized prompt payloads
- hidden sponsor insertion attempts
- unsafe chemical/product recommendation requests

All of these should be rejected, rate-limited, escalated, or audited before any provider call.

## Audit Log Fields

Future audit logs should record:

- request id
- user/session hash
- calculator category
- snapshot id
- snapshot lock hash
- policy version id
- prompt template version id
- safety decision
- risk level
- blocked action ids
- created timestamp

Raw provider keys, service-role keys, hidden sponsor payloads, and precise location data must never appear in calculator AI audit logs.

## Future Supabase Tables

Planned tables:

- `calculator_ai_audit_logs`
- `calculator_ai_policy_versions`
- `calculator_ai_rate_limits`
- `calculator_ai_explanations`
- `calculator_ai_safety_events`

No migrations are run in M56.

## M57 Adapter Audit Preview

M57 adapter responses include an audit preview only:

- request id
- snapshot id
- snapshot lock hash
- policy version id
- prompt template version id
- safety decision status
- risk level
- `wouldWriteBackendAuditLog: false`
- `wouldWriteSupabase: false`

No rate-limit counter is enforced yet and no audit row is written. Future backend work must enforce daily limits server-side before enabling any real provider call.
