# M61 Supabase Auth Dashboard Checklist

Use this checklist before any controlled Supabase Phone Auth staging test.

## Project

- Use `kasethub-staging` only.
- Do not use production for the first OTP test.
- Keep `.env.local` uncommitted.
- Use only Project URL and anon key in frontend-accessible env.
- Keep service-role keys out of Vite, browser, and Cloudflare public env.

## Auth Settings

- Enable Phone provider only for staging.
- Configure Site URL for the staging app.
- Add local dev redirect URLs.
- Add staging/preview redirect URLs.
- Keep production redirects parked until production review.

## SMS Provider

- Configure provider secret in Supabase/Auth settings only.
- Set sender/country policy for Thailand testing.
- Set spending limit.
- Set resend cooldown.
- Set max OTP request and verification attempts.
- Confirm support path for missing SMS.

## Test Numbers

- Keep test phone numbers in a private tracker, not git.
- Use only numbers with owner consent.
- Start with 1-2 test numbers.
- Remove stale test numbers after the test.

## Exit Criteria

- OTP arrives on approved test number.
- Redirect returns to `/app/auth/status` or another reviewed account screen.
- Supabase session is visible to the app.
- `auth.uid()` can be used for ownership checks.
- No app data write or Guest Memory sync is performed.
