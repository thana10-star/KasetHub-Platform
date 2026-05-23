# Supabase Auth Redirect URL Checklist

Use this checklist before any real Supabase Auth phone OTP staging test. M28 does not enable real redirects.

## Required URL Groups

- Local dev: `http://localhost:5173/*` or the active local Vite port.
- Local IP dev: `http://127.0.0.1:5173/*` if used.
- Cloudflare Pages preview: preview deployment URL.
- Staging: stable staging domain.
- Production: production domain, only after staging passes.

## KasetHub Candidate Paths

- `/app/auth/status`
- `/app/account-preview`
- `/app/auth/sync-preview`
- `/app/profile`

Prefer returning to `/app/auth/status` after phone OTP so users can see clear account state before syncing.

## Supabase Dashboard Checks

- Site URL points to the staging app during staging tests.
- Additional Redirect URLs include local and staging URLs.
- Production URLs are not used during staging unless explicitly testing production.
- Wildcards are narrow and environment-specific.
- No service-role key is copied into any frontend variable.

## Cloudflare Pages Plan

- Store staging env vars only in the staging/preview environment.
- Store production env vars separately.
- Use anon key only.
- Keep `VITE_ENABLE_AUTH=false` until the staging OTP test milestone.
- Keep `VITE_ENABLE_CLOUD_SYNC=false` until RLS ownership checks pass.

## Failure Handling

If redirect returns to the wrong environment:

1. Stop the test.
2. Disable phone auth flags.
3. Remove the bad redirect URL.
4. Revoke any test sessions.
5. Document the mistake before retrying.

## User-Facing Copy

- "กลับไปที่สถานะบัญชี"
- "ยังไม่สำรองข้อมูลจนกว่าจะยืนยันบัญชีสำเร็จ"
- "หากใช้เครื่องร่วมกับผู้อื่น โปรดออกจากระบบหลังใช้งาน"
