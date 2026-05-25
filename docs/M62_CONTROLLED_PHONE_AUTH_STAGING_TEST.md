# M62 Controlled Phone Auth Staging Test

M62 adds a controlled Supabase Phone Auth staging boundary. The app can still run fully in local mock mode, and real OTP is attempted only when local staging flags are explicitly enabled.

## Required Local Flags

Keep these values out of git and place real values only in local `.env.local` for the staging test:

```env
VITE_ENABLE_SUPABASE=true
VITE_ENABLE_AUTH=true
VITE_ENABLE_PHONE_AUTH=true
VITE_PHONE_AUTH_MODE=supabase_staging_ready
VITE_ENABLE_CLOUD_SYNC=false
VITE_SUPABASE_AUTH_REDIRECT_URL=http://localhost:5173/app/auth/status
VITE_AUTH_STAGING_LABEL=staging
```

Also provide staging-only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Never use or expose the service-role key in frontend env.

## App Boundary

- Default mode remains `local_mock`.
- `supabase_staging_ready` activates only with explicit flags and valid Supabase anon config.
- `VITE_ENABLE_CLOUD_SYNC=true` blocks staging Phone Auth.
- Service-role-like keys block staging Phone Auth.
- Production mode is disabled.
- Guest Memory sync remains blocked.
- No profile, saved item, farm, or app table writes are made.

## Controlled Flow

1. Open `/app/auth/phone-staging-test`.
2. Confirm adapter status and blockers.
3. Confirm redirect URL and SMS cost guardrails.
4. Open `/app/auth/phone`.
5. Send OTP only to an approved internal test number.
6. Verify OTP and confirm masked session preview.
7. Open `/app/auth/status` and `/app/auth/sync-preview`.
8. Confirm ownership is detected but sync remains `false`.
9. Roll back flags and clear local staging session preview.

## Rollback

Return to:

```env
VITE_ENABLE_PHONE_AUTH=false
VITE_ENABLE_AUTH=false
VITE_PHONE_AUTH_MODE=local_mock
VITE_ENABLE_CLOUD_SYNC=false
```

Disable or pause the Phone/SMS provider in the Supabase staging dashboard if needed.
