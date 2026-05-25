# M61 Phone Auth Rollback Plan

M61 requires rollback steps before sending any real staging OTP.

## Immediate Rollback

1. Set `VITE_ENABLE_PHONE_AUTH=false`.
2. Set `VITE_ENABLE_AUTH=false`.
3. Set `VITE_PHONE_AUTH_MODE=local_mock`.
4. Keep `VITE_ENABLE_CLOUD_SYNC=false`.
5. Disable Phone provider or SMS provider in the Supabase staging dashboard if needed.
6. Revoke test sessions created during the staging OTP test.
7. Confirm `/app/auth/phone` returns to local mock behavior.

## Incident Notes

Record:

- date/time
- test phone number owner, stored outside repo
- provider status
- OTP delivery result
- redirect result
- SMS cost
- reason for rollback
- follow-up owner

## Non-negotiable Boundaries

- Do not commit `.env.local`.
- Do not commit real Supabase keys.
- Do not expose service-role keys in frontend.
- Do not enable cloud sync as part of rollback recovery.
- Do not delete local Guest Memory automatically.
