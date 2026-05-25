# M63 Owner-scoped RLS Dry-run Plan

This plan defines safe checks for a future staging-only owner-scoped RLS dry-run. M63 does not run SQL automatically.

## Planned Checks

- Authenticated user can read own rows.
- Authenticated user cannot read other users rows.
- Anonymous user cannot read user-owned rows.
- Insert requires `owner_id = auth.uid()`.
- Update/delete are own rows only.
- Service-role is reserved for backend sync only.

## Tables To Review

- Future Guest Memory import table.
- User-owned saved items.
- User-owned likes.
- User-owned followed topics.
- User-owned farm records.
- User-owned sync audit logs.
- User-owned idempotency keys.

## Safe Method

Use a staging Supabase project with temporary test users and test rows. Do not run against production. Do not write real app data. Do not use service-role keys in frontend. Record only masked owner ids in app UI.

## Exit Criteria

RLS dry-run can pass only when own-row reads/writes succeed, cross-user reads/writes fail, anon reads fail, and backend-only service-role use is documented.
