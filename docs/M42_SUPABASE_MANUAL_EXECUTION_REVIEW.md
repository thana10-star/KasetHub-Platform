# M42 Supabase Manual Execution Review

This milestone records the result of the first manual Supabase staging execution after the operator creates `kasethub-staging` and runs the existing SQL/RLS drafts by hand.

Current review status: `success`

Reason: the operator confirmed that `kasethub-staging` was created, schema SQL succeeded, 23 tables are visible, RLS SQL succeeded, RLS is enabled from Supabase table security, and SQL errors were `none`.

M42 does not enable auth, cloud sync, uploads, AI proxy, Edge Functions, backend writes, or production behavior.

## Review Status Options

- `pending` - waiting for manual setup evidence from Supabase Dashboard.
- `success` - schema SQL and RLS SQL succeeded, tables/RLS were checked, and no broad public write policy was found.
- `needs SQL fix` - SQL Editor returned an error that needs a minimal reviewed correction before rerunning manually.
- `blocked` - the project, env, secret handling, or RLS/public policy state is unsafe enough to stop the next milestone.

## Information Provided By User

The operator provided:

- Supabase project created: yes
- Project name: `kasethub-staging`
- Schema SQL ran successfully: yes
- Tables visible in Table Editor: yes
- Table count: 23
- RLS policy SQL ran successfully: yes
- RLS enabled: yes, confirmed from Supabase table security
- SQL errors: none

No service-role key, database password, connection string, `.env.local`, or real key value was provided or recorded.

## Current Manual Execution Result

| Check | Current result |
| --- | --- |
| Supabase project created | Yes |
| Project name confirmed as staging | `kasethub-staging` |
| Schema SQL run | Success |
| RLS SQL run | Success |
| SQL Editor errors | None |
| Tables visible in Table Editor | Yes |
| Table count | 23 |
| RLS enabled | Yes, confirmed from Supabase table security |
| Public write policy review | No issue reported in M42 result |
| Auth/cloud sync still disabled | Must remain disabled until a later milestone |

## SQL Files Under Review

Run order remains manual and unchanged:

1. `supabase/migrations/0001_kasethub_core_schema.sql`
2. `supabase/policies/0001_kasethub_rls_policies.sql`

Do not run these from the app. Do not run them automatically from Codex. Do not run them on production.

## SQL Error Review Policy

If SQL errors are provided:

1. Copy the exact error text from SQL Editor.
2. Identify which file was running: schema SQL or RLS SQL.
3. Note whether the full file or a partial selection was run.
4. Include a screenshot if it does not expose secrets.
5. Propose the smallest safe SQL correction.
6. Document whether the correction changes schema, RLS policy logic, indexes, triggers, or only syntax/order.

No SQL errors were reported for M42, so no schema or RLS file change is proposed.

## Minimal Correction Rules

- No SQL correction is needed for this successful M42 result.
- For future SQL issues, prefer ordering, idempotency, syntax, or missing dependency fixes over broad rewrites.
- Do not add public insert/update/delete policies to make an error disappear.
- Do not disable RLS as a workaround.
- Do not drop tables, policies, triggers, or indexes unless explicitly instructed and reviewed.
- Do not use service-role key for frontend verification.
- Keep all reruns manual in the Supabase Dashboard SQL Editor.

## Safety Stop Point

Stop before enabling:

- auth
- phone OTP
- cloud sync
- uploads
- AI proxy
- Edge Functions
- backend writes
- production redirects

Visible operator warnings remain:

- `ห้ามใช้ service-role key`
- `ใช้ staging เท่านั้น`
- `หยุดก่อนเปิด auth/cloud sync`

## Next Safe Step

M42 is recorded as successful.

Next safe step: plan the next reviewed staging milestone while keeping auth, phone OTP, cloud sync, uploads, AI proxy, Edge Functions, and backend writes disabled.

M43 may perform an explicit-flag read-only probe against `articles`, `videos`, and `crop_price_snapshots` using only Project URL and anon key. Empty tables are OK. No writes, auth, cloud sync, uploads, AI calls, Edge Functions, or service-role keys are allowed.

No automatic SQL execution should be added as a result of this milestone.

If later evidence shows secrets, production data, broad public writes, or unclear project selection, M42 should be re-opened and treated as `blocked` until corrected.
