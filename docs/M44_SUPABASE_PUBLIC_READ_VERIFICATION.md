# M44 Supabase Public Read Verification

M44 reviews the real `kasethub-staging` read-only probe result after M43. This is a human review step. The app does not enable auth, cloud sync, uploads, backend writes, AI calls, automatic migrations, or destructive SQL.

Current M44 status: `pending operator probe`.

## Operator Steps

Use local `.env.local` only. Do not commit it.

Confirm:

```bash
VITE_ENABLE_SUPABASE=true
VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=true
VITE_ENABLE_AUTH=false
VITE_ENABLE_CLOUD_SYNC=false
```

Then open:

- `/app/supabase-readonly-probe`

Record the result for each public/read-safe table:

- `articles`
- `videos`
- `crop_price_snapshots`

Allowed results:

- `empty table OK`
- `read OK`
- `RLS/policy blocked`
- `table missing`

## Results To Provide

| Table | Actual result | Rows returned count | Notes |
| --- | --- | ---: | --- |
| `articles` | pending | pending | Waiting for operator evidence |
| `videos` | pending | pending | Waiting for operator evidence |
| `crop_price_snapshots` | pending | pending | Waiting for operator evidence |

Empty tables can be a successful result for a fresh staging database.

## RLS Review

Review Supabase Dashboard table security and policies.

Confirm:

- public/read-safe tables allow anon read only where intended
- no public write policy exists
- anon access is limited
- user-owned/private tables are protected
- service-role key was not used
- target project is `kasethub-staging`

## If A Policy Issue Appears

Do not auto-fix silently.

Document:

- exact table
- exact policy or grant issue
- copied error or screenshot summary
- whether anon can read/write unexpectedly
- smallest proposed SQL correction

Any SQL correction should be a separate reviewed milestone and should be run manually on staging only.

## Current Decision

Auth and cloud sync remain blocked until M44 evidence is reviewed and accepted.
