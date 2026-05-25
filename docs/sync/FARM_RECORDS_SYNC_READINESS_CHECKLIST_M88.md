# Farm Records Sync Readiness Checklist M88

This checklist must be completed before Farm Records cloud sync is implemented or enabled. M88 does not implement sync, Supabase writes, cloud backup, or cloud delete.

## Consent And Privacy

- [ ] Consent UI ready.
- [ ] Consent copy reviewed.
- [ ] Privacy copy reviewed.
- [ ] Cloud sync consent separated from AI consent.
- [ ] Cloud sync consent separated from GPS/precise-location consent.
- [ ] Cloud sync consent separated from image/receipt upload consent.
- [ ] User-facing copy does not imply cloud backup before it exists.

## Ownership And RLS

- [ ] Ownership fields implemented.
- [ ] RLS policy drafted.
- [ ] RLS policy tested.
- [ ] Owner-only select tested.
- [ ] Owner-only insert/update/delete tested.
- [ ] Cross-user access denied.
- [ ] Unauthenticated access denied.
- [ ] No public read policy.
- [ ] Service-role boundary documented and not exposed to client.

## Export, Delete, And Recovery

- [x] Local JSON export ready.
- [x] Local finance CSV export ready.
- [x] Local restore validation ready.
- [x] Restore recovery guidance ready.
- [ ] Cloud export designed.
- [ ] Cloud delete designed.
- [ ] Bulk delete multi-confirmation designed.
- [ ] Recovery plan ready.
- [ ] Rollback/support playbook ready.

## Sync Queue And Conflict Handling

- [ ] Sync queue designed.
- [ ] Idempotency designed.
- [ ] Retry policy designed.
- [ ] Last error visibility designed.
- [ ] Conflict handling plan ready.
- [ ] Finance-entry conflict behavior reviewed.
- [ ] Delete/edit audit behavior reviewed.
- [ ] Audit events designed.

## Operations And QA

- [ ] Admin/support visibility designed.
- [ ] Security review completed.
- [ ] Manual QA completed.
- [ ] Browser/mobile QA completed.
- [ ] Offline/online transition QA completed.
- [ ] Disable-sync behavior tested.
- [ ] No-GPS/no-AI/no-receipt-upload boundaries retested.

## M88 Status

M88 completes only local recovery/readiness work and architecture review artifacts. Supabase schema, Supabase writes, sync queue, production cloud sync, and cloud delete remain blocked.

## M89 Status

- [x] Sync consent UX prototype added for local preview only.
- [x] Prototype consent state documented as not legal consent.
- [x] Owner/RLS future test plan added.
- [x] Disabled UI shows cloud sync is not available.
- [ ] Supabase schema implementation not started.
- [ ] Supabase RLS implementation not started.
- [ ] Sync queue not implemented.
- [ ] Cloud sync remains disabled.
- [ ] Cloud export/delete remains future work.
- [ ] Browser/mobile QA still required before production sync.
