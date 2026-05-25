# Weather Risk Release Audit Readiness

M80 adds local-only release audit readiness for agriculture weather risk rules.

The release audit layer records simulated events only. It does not write Supabase rows, backend logs, or production audit records.

## Audit Fixtures

- reviewed-source placeholder simulated
- release attempt blocked
- automation bypass blocked
- CMS publish blocked
- stale review detected
- rule reverted to planning-only

## Boundary

Every audit event remains `planningOnly: true` and `noSupabaseWrite: true`.

Automation, CMS, and local fixtures cannot make a rule prescriptive.
