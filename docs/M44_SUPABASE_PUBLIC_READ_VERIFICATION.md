# M44 Supabase Public Read Verification

M44 reviews the real `kasethub-staging` read-only probe result after M43. This is a human review step. The app does not enable auth, cloud sync, uploads, backend writes, AI calls, automatic migrations, or destructive SQL.

Current M44 status: `success`.

Actual result from `kasethub-staging`:

- public read probe: passed
- auth enabled: false
- cloud sync enabled: false
- service-role key used: no
- writes performed: no
- RLS remains enabled
- no unsafe public write observed

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

## Verified Results

| Table | Actual result | Rows returned count | Notes |
| --- | --- | ---: | --- |
| `articles` | empty table OK | 0 | Public read probe passed |
| `videos` | empty table OK | 0 | Public read probe passed |
| `crop_price_snapshots` | empty table OK | 0 | Public read probe passed |

Empty tables can be a successful result for a fresh staging database.

## Manual Staging SQL Patch Applied

A manual SQL grant/policy patch was applied directly in Supabase staging to allow anon/authenticated `SELECT` on these public/read-safe tables only:

- `articles`
- `videos`
- `crop_price_snapshots`

This patch was applied manually in `kasethub-staging`. It was not run automatically by the app or Codex, and no destructive SQL change is included in the repo.

## RLS Review

Review Supabase Dashboard table security and policies.

Confirmed:

- public/read-safe tables allow anon/authenticated read only where intended
- no public write policy was observed
- anon access remains limited to reviewed public read behavior
- RLS remains enabled
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

M44 public read verification is successful. Auth and cloud sync remain disabled until a later reviewed milestone explicitly enables them.
