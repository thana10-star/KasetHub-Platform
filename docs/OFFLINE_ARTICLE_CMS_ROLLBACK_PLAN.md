# Offline Article CMS Rollback Plan

M73 requires rollback planning before any article CMS migration is run.

Rollback checklist:

- record migration id
- record dependency order
- prepare rollback SQL for article tables
- prepare rollback SQL for release/audit tables
- verify rollback does not remove bundled offline fallback
- verify frontend has no CMS write path
- verify public reads stay reviewed/published only
- verify release gate stays required after rollback

Rollback blockers:

- missing rollback SQL
- missing RLS review
- missing audit write contract
- missing seed fixture review
- missing human release gate proof

M73 does not execute rollback or migration scripts.

