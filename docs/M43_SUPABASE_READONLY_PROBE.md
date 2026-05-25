# M43 Supabase Read-only Probe

M43 verifies that the frontend can connect to the real `kasethub-staging` Supabase project with only browser-safe values, then performs read-only public table probes.

The probe never writes data and never needs a service-role key.

## Local .env.local

Create or update `.env.local` locally only. Do not commit it.

```bash
VITE_SUPABASE_URL=https://your-staging-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-staging-anon-key
VITE_ENABLE_SUPABASE=true
VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=true
VITE_ENABLE_AUTH=false
VITE_ENABLE_CLOUD_SYNC=false
```

Restart Vite after editing `.env.local`.

## Required Local Values

- `VITE_SUPABASE_URL` from the `kasethub-staging` API settings page.
- `VITE_SUPABASE_ANON_KEY` from the anon/public key only.
- `VITE_ENABLE_SUPABASE=true`.
- `VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=true`.
- `VITE_ENABLE_AUTH=false`.
- `VITE_ENABLE_CLOUD_SYNC=false`.

Do not use the service-role key. The app blocks service-role-like values, including decoded JWT payloads with `role: service_role`.

## Route

Open:

- `/app/supabase-readonly-probe`

Linked from:

- `/app/supabase-connection`
- `/app/supabase-readiness`
- `/app/env-safety`
- `/app/admin`
- `/app/next-phase`

## Tables Probed

The probe checks only these public/read-safe tables:

- `articles`
- `videos`
- `crop_price_snapshots`

Each table uses a read-only count/head-style query. The app displays counts and status only. It does not display row data.

## Expected Results

Empty tables are OK.

- `empty table OK`: the read-only check succeeded and no public rows were returned.
- `read OK`: the read-only check succeeded and public rows are visible.
- `RLS/policy blocked`: anon read was blocked by grants, RLS, or policy configuration.
- `table missing`: the table was not found by the anon read probe.
- `network disabled`: `VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=false`, so no Supabase request was made.

## What Not To Do

- Do not commit `.env.local`.
- Do not paste real keys into docs, reports, screenshots, or source code.
- Do not use service-role key in frontend.
- Do not insert, update, delete, upsert, or call RPC.
- Do not enable auth.
- Do not enable cloud sync.
- Do not upload files.
- Do not call Edge Functions.
- Do not call AI APIs.
- Do not query private/user-owned tables.

## Safety Notes

M43 is a staging-only read probe. It does not replace Supabase Dashboard verification and does not prove every RLS rule. If a public table is unexpectedly blocked, review the table grants and public read policies before enabling auth or cloud sync.

Keep `VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=false` when not actively checking staging.

After running the probe, use M44 to record the actual table results and RLS/no-public-write review evidence before enabling auth or cloud sync.
