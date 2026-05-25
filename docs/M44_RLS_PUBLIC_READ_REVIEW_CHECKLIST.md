# M44 RLS Public Read Review Checklist

Use this checklist while reviewing `kasethub-staging` after the M43 read-only probe.

## Public Read Tables

- [x] `articles` result recorded: empty table OK, count 0
- [x] `videos` result recorded: empty table OK, count 0
- [x] `crop_price_snapshots` result recorded: empty table OK, count 0
- [x] Empty-table result treated as OK when expected
- [x] Public rows, if any, are safe to expose

## No Public Write

- [x] No unsafe public insert behavior observed
- [x] No unsafe public update behavior observed
- [x] No unsafe public delete behavior observed
- [x] No unsafe public upsert behavior observed
- [x] No broad public write policy observed

## Anon Access Limited

- [x] Anon/authenticated `SELECT` allowed only for intended public/read-safe tables in M44
- [x] RLS remains enabled for protecting private user-owned records
- [x] RLS remains enabled for moderation/admin records
- [x] RLS remains enabled for AI credit or job ownership records
- [x] RLS remains enabled for guest sync private payloads

## User-owned Tables Protected

- [x] Profiles/user account rows remain under RLS protection
- [x] Saved items remain under RLS protection
- [x] My Farm records remain under RLS protection
- [x] Guest Memory sync records remain under RLS protection
- [x] Community write paths remain under reviewed auth/moderation RLS protection
- [x] AI credit/job records remain under owner or backend RLS protection

## Service-role And Staging Safety

- [x] Only Project URL and anon/public key were used locally
- [x] No service-role key was used in the frontend
- [x] No database password or connection string was used
- [x] Target project is `kasethub-staging`
- [x] `.env.local` remains uncommitted
- [x] Auth remains disabled
- [x] Cloud sync remains disabled

## Manual Staging SQL Patch

- [x] Manual SQL grant/policy patch applied in Supabase staging only
- [x] `articles` allows anon/authenticated `SELECT`
- [x] `videos` allows anon/authenticated `SELECT`
- [x] `crop_price_snapshots` allows anon/authenticated `SELECT`
- [x] No automatic SQL execution was added to the app

## Rollback Steps If A Policy Mistake Exists

1. Keep `VITE_ENABLE_AUTH=false` and `VITE_ENABLE_CLOUD_SYNC=false`.
2. Stop using the affected public route until the policy is reviewed.
3. Capture the exact policy/table/error evidence.
4. Revoke or disable the unsafe policy manually in Supabase Dashboard if it allows broad public writes.
5. Propose the smallest SQL patch in a follow-up milestone.
6. Re-run the read-only probe manually after the reviewed patch is applied.
7. Do not enable auth or cloud sync until the re-review passes.
