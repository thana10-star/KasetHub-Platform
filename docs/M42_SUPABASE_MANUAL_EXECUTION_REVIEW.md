# M42 Supabase Manual Execution Review

This milestone records the result of the first manual Supabase staging execution after the operator creates `kasethub-staging` and runs the existing SQL/RLS drafts by hand.

Current review status: `pending`

Reason: no confirmed Supabase Dashboard result, screenshot, or copied SQL error has been provided yet.

M42 does not enable auth, cloud sync, uploads, AI proxy, Edge Functions, backend writes, or production behavior.

## Review Status Options

- `pending` - waiting for manual setup evidence from Supabase Dashboard.
- `success` - schema SQL and RLS SQL succeeded, tables/RLS were checked, and no broad public write policy was found.
- `needs SQL fix` - SQL Editor returned an error that needs a minimal reviewed correction before rerunning manually.
- `blocked` - the project, env, secret handling, or RLS/public policy state is unsafe enough to stop the next milestone.

## Information Needed From User

Please provide:

- whether the Supabase project was created
- whether schema SQL ran successfully
- whether RLS SQL ran successfully
- screenshots or copied SQL errors, if any
- whether tables appear in Table Editor
- whether RLS appears enabled

Suggested concise reply shape:

```text
Project created: yes/no
Schema SQL: success/error
RLS SQL: success/error
Tables visible: yes/no
RLS enabled: yes/no
Errors/screenshots: attached or pasted below
```

## Current Manual Execution Result

| Check | Current result |
| --- | --- |
| Supabase project created | Not provided |
| Project name confirmed as staging | Not provided |
| Schema SQL run | Not provided |
| RLS SQL run | Not provided |
| SQL Editor errors | None provided |
| Tables visible in Table Editor | Not provided |
| RLS enabled | Not provided |
| Public write policy review | Not provided |
| Auth/cloud sync still disabled | Not provided |

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

No schema or RLS file should be changed until the exact error is reviewed and the fix is clearly safe.

## Minimal Correction Rules

- Prefer ordering, idempotency, syntax, or missing dependency fixes over broad rewrites.
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

Send the manual setup result or SQL error details for review.

If everything succeeded and screenshots confirm safe RLS/public policy state, M42 can be marked `success` and the next milestone can decide the next safe staging step.

If SQL failed, M42 should become `needs SQL fix` and the next milestone should apply only the minimal reviewed SQL correction.

If secrets, production data, broad public writes, or unclear project selection appear, M42 should become `blocked`.
