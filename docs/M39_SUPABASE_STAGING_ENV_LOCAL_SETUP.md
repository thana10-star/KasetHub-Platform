# M39 Supabase Staging Env Local Setup

M39 prepares local environment handling for a future real Supabase staging project. It does not connect to Supabase by default, does not add real keys, does not run SQL, does not enable auth, and does not enable cloud sync.

## Safe Starting Point

Confirm you are on the staging experiment branch:

```bash
git branch --show-current
```

Expected:

```text
staging/supabase
```

The app must still run with no `.env.local`.

## Create `.env.local`

Create a local file from the placeholder template:

```bash
Copy-Item .env.example .env.local
```

On macOS/Linux:

```bash
cp .env.example .env.local
```

`.env.local` must stay on your machine only. Do not commit it.

## Values That Are Safe For Frontend Staging

Only these Supabase values are allowed in Vite/frontend env:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Use the staging Project URL and staging anon public key only.

## Values That Must Never Be Used

Never put a service-role key in:

- `.env.local`
- `.env.example`
- Vite variables
- frontend source code
- README or docs screenshots
- Cloudflare Pages public environment variables
- browser logs

Service-role keys belong only in a trusted backend or Supabase Edge Function secret store.

## Enable Supabase Readiness Only

For M39, the safest local staging setting is:

```bash
VITE_ENABLE_SUPABASE=true
VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=false
VITE_ENABLE_AUTH=false
VITE_ENABLE_CLOUD_SYNC=false
VITE_ENABLE_GUEST_SYNC_BACKEND=false
VITE_ENABLE_GUEST_SYNC_EDGE=false
VITE_ENABLE_PHONE_AUTH=false
VITE_ENABLE_LINE_AUTH=false
```

This lets the app detect staging env presence while keeping network checks, auth, cloud sync, and writes disabled.

## Restart Vite

Vite reads env values at startup. After editing `.env.local`, stop and restart the dev server:

```bash
npm run dev
```

## Verify In The App

Open:

- `/app/env-safety`
- `/app/supabase-connection`
- `/app/supabase-readiness`

Expected M39 behavior:

- URL detected only if `VITE_SUPABASE_URL` is set.
- anon key detected only if `VITE_SUPABASE_ANON_KEY` is set.
- secret values are masked.
- service-role-like key warning is visible if a dangerous key is detected.
- network check remains disabled.
- auth and cloud sync remain disabled.
- no data is written.

## Return To Mock-Only Mode

To return to the fully local prototype:

```bash
VITE_ENABLE_SUPABASE=false
VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=false
VITE_ENABLE_AUTH=false
VITE_ENABLE_CLOUD_SYNC=false
```

Then restart Vite.

You may also remove `.env.local`; the app must still run.

## Stop Conditions

Stop before continuing if:

- the target Supabase project is production
- `.env.local` is staged in Git
- a service-role key appears anywhere in frontend env
- auth or cloud sync flags are enabled
- dry-run network check is enabled without a reviewed public/read-only target
- the app fails to run with no `.env.local`

