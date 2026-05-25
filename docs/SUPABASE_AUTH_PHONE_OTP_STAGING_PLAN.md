# Supabase Auth Phone OTP Staging Plan

M28 prepares KasetHub for a future Supabase Auth phone OTP staging test. It does not enable real auth, send SMS, add keys, write to Supabase, enable cloud sync, or add network calls by default.

## Current Boundary

- `/app/auth/phone` remains local mock with demo OTP `123456`.
- `/app/auth/phone-staging` is a checklist page only.
- `VITE_ENABLE_AUTH=false`.
- `VITE_ENABLE_PHONE_AUTH=false`.
- `VITE_PHONE_AUTH_MODE=local_mock`.
- No service-role key in frontend.
- No SMS provider secret in frontend.

## Staging Setup Sequence

1. Confirm the Supabase project is staging, not production.
2. Add only Project URL and anon key to local `.env.local` or staging environment.
3. Keep `VITE_ENABLE_CLOUD_SYNC=false`.
4. Configure Supabase Auth Site URL and Redirect URLs.
5. Configure phone provider/SMS provider inside Supabase dashboard only.
6. Set OTP resend cooldown, attempt limits, lockout, and spend guardrails.
7. Prepare private staging test phone numbers without committing them to the repo.
8. Run a controlled staging OTP test.
9. Confirm the resulting Supabase session has a stable `auth.uid()`.
10. Test RLS owner checks before enabling any writes or sync.

## Future Flags

Use these only in a controlled staging test:

```bash
VITE_ENABLE_SUPABASE=true
VITE_ENABLE_AUTH=true
VITE_ENABLE_PHONE_AUTH=true
VITE_PHONE_AUTH_MODE=supabase_ready_mock
VITE_SUPABASE_AUTH_REDIRECT_URL=https://staging.example.com/app/auth/status
VITE_AUTH_STAGING_LABEL=staging
VITE_ENABLE_CLOUD_SYNC=false
```

M28 does not add a real adapter. A later milestone must add the adapter and keep it gated.

## Session Ownership Checks

- Treat phone number input as untrusted client data.
- Use Supabase session user ID as the owner identity.
- RLS must compare `auth.uid()` to `user_id`.
- Guest Sync must require consent, idempotency, and backend validation.
- LINE linking must not change ownership without explicit confirmation.

## Logout And Session Persistence

- Confirm logout clears the Supabase session.
- Guest Memory should stay local after logout unless the user explicitly clears it.
- Session persistence should survive refresh only after the user understands account state.
- Shared devices should show clear logout and local-data warnings.

## Account Deletion Future

Before production, define:

- account deletion request path
- identity verification before deletion
- Guest Memory/local data behavior
- Supabase Auth user deletion boundary
- storage/media deletion and retention
- audit log retention

## Rollback

- Set `VITE_ENABLE_AUTH=false`.
- Set `VITE_ENABLE_PHONE_AUTH=false`.
- Set `VITE_PHONE_AUTH_MODE=local_mock`.
- Disable the phone provider in Supabase staging if needed.
- Revoke test sessions.
- Verify `/app/auth/phone` returns to local mock behavior.
- Document any SMS cost or abuse event.

## Thai UX Copy

Use plain copy:

- "ยังไม่ส่ง OTP จริง"
- "ยังไม่เปิด auth จริง"
- "รหัสจะถูกส่งไปยังเบอร์ของคุณ"
- "รอสักครู่ก่อนกดส่งรหัสอีกครั้ง"
- "ข้อมูลในเครื่องจะยังไม่ถูกสำรองจนกว่าคุณจะยืนยันบัญชี"

## Production Blockers

- No successful staging OTP test yet.
- Redirect URLs not verified.
- SMS provider cost/rate limits not tested.
- RLS owner checks not tested with real sessions.
- Guest Sync still disabled.
- Account deletion and recovery are not finalized.

## M29 Guest Sync Edge Function Dependency

The future `guest-memory-sync` Edge Function must be tested only after phone OTP staging can create a valid Supabase session.

Required sequence:

1. Confirm staging project and SQL/RLS.
2. Confirm phone OTP session ownership with `auth.uid()`.
3. Deploy Edge Function only to staging.
4. Keep service-role key inside Edge Function secrets only.
5. Test idempotency, consent, duplicate merge, partial success, invalid payload rejection, and rollback.
6. Keep `VITE_ENABLE_CLOUD_SYNC=false` outside a controlled staging test window.

M29 adds the contract and readiness screen only. It does not send OTP, deploy an Edge Function, call an endpoint, or write Supabase data.

## M61 Staging Test Review

M61 returns to the Phone Auth roadmap after the calculator sub-phase.

New route:

- `/app/auth/phone-staging-test`

New service:

- `src/services/auth/phone-auth-staging-review.ts`

M61 uses M42 and M44 evidence as prerequisites, then reviews redirect URLs, SMS provider setup, private test phone numbers, OTP cost/rate limits, ownership before sync, and rollback. It keeps `canSendRealOtp: false`, `noRealSms: true`, `noSupabaseWrite: true`, and `noCloudSync: true`.

The first real OTP test must still happen in a future milestone after the dashboard setup and rollback plan are reviewed.
## M62 Controlled Phone Auth Staging Test

M62 changes the future staging mode name to `supabase_staging_ready` and adds an adapter that can call Supabase Auth only when local flags are explicitly enabled.

Required local staging flags:

```env
VITE_ENABLE_SUPABASE=true
VITE_ENABLE_AUTH=true
VITE_ENABLE_PHONE_AUTH=true
VITE_PHONE_AUTH_MODE=supabase_staging_ready
VITE_ENABLE_CLOUD_SYNC=false
```

The app may request and verify OTP through Supabase Auth in this mode, but it must not write app tables or trigger Guest Memory sync.
