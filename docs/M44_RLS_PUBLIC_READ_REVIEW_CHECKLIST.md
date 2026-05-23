# M44 RLS Public Read Review Checklist

Use this checklist while reviewing `kasethub-staging` after the M43 read-only probe.

## Public Read Tables

- [ ] `articles` result recorded
- [ ] `videos` result recorded
- [ ] `crop_price_snapshots` result recorded
- [ ] Empty-table result treated as OK when expected
- [ ] Public rows, if any, are safe to expose

## No Public Write

- [ ] Anon cannot insert into public/read tables
- [ ] Anon cannot update public/read tables
- [ ] Anon cannot delete public/read tables
- [ ] Anon cannot upsert public/read tables
- [ ] No broad public write policy exists

## Anon Access Limited

- [ ] Anon access is limited to intended public/read-safe tables
- [ ] Anon cannot access private user-owned records
- [ ] Anon cannot access moderation/admin records
- [ ] Anon cannot access AI credit or job ownership records
- [ ] Anon cannot access guest sync private payloads

## User-owned Tables Protected

- [ ] Profiles/user account rows require owner/session policy
- [ ] Saved items require owner/session policy
- [ ] My Farm records require owner/session policy
- [ ] Guest Memory sync records require owner/session policy
- [ ] Community write paths require reviewed auth/moderation policies
- [ ] AI credit/job records require owner or backend policy

## Service-role And Staging Safety

- [ ] Only Project URL and anon/public key were used locally
- [ ] No service-role key was used in the frontend
- [ ] No database password or connection string was used
- [ ] Target project is `kasethub-staging`
- [ ] `.env.local` remains uncommitted
- [ ] Auth remains disabled
- [ ] Cloud sync remains disabled

## Rollback Steps If A Policy Mistake Exists

1. Keep `VITE_ENABLE_AUTH=false` and `VITE_ENABLE_CLOUD_SYNC=false`.
2. Stop using the affected public route until the policy is reviewed.
3. Capture the exact policy/table/error evidence.
4. Revoke or disable the unsafe policy manually in Supabase Dashboard if it allows broad public writes.
5. Propose the smallest SQL patch in a follow-up milestone.
6. Re-run the read-only probe manually after the reviewed patch is applied.
7. Do not enable auth or cloud sync until the re-review passes.
