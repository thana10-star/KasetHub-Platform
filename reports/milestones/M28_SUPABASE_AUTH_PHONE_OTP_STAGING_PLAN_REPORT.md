# M28 Supabase Auth Phone OTP Staging Plan Report

## Summary

M28 prepares KasetHub for a future controlled Supabase Auth phone OTP staging test. It adds a local-only readiness service, a Thai staging checklist route, environment placeholders, and documentation for phone provider setup, redirect URLs, SMS cost/rate limits, session ownership, and rollback.

No real auth was enabled. No OTP SMS was sent. No real Supabase keys, service-role key, Supabase write, cloud sync, LINE/Google real login, backend write, or default network call was added. The existing local mock phone OTP flow remains active.

## Files Changed

- `src/services/auth/phone-auth-staging.types.ts`
- `src/services/auth/phone-auth-staging-readiness.ts`
- `src/routes/AuthPhoneStagingPage.tsx`
- `src/routes/AuthPhonePage.tsx`
- `src/routes/AuthStatusPage.tsx`
- `src/routes/AuthSyncPreviewPage.tsx`
- `src/routes/SupabaseReadinessPage.tsx`
- `src/routes/SupabaseConnectionPage.tsx`
- `src/routes/AdminDashboardPage.tsx`
- `src/routes/AccountPreviewPage.tsx`
- `src/routes/ProfilePage.tsx`
- `src/routes/QAPage.tsx`
- `src/app/App.tsx`
- `src/config/env.ts`
- `src/vite-env.d.ts`
- `src/types/kaset.ts`
- `.env.example`
- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/PHONE_AUTH_BOUNDARY.md`
- `docs/FARMER_FRIENDLY_AUTH_STRATEGY.md`
- `docs/GUEST_TO_ACCOUNT_SYNC_PLAN.md`
- `docs/GUEST_SYNC_PROOF_OF_CONCEPT.md`
- `docs/SUPABASE_ENV_SETUP.md`
- `docs/SUPABASE_STAGING_SETUP_GUIDE.md`
- `docs/SUPABASE_READINESS_AUDIT.md`
- `docs/SUPABASE_MANUAL_VERIFICATION_PACK.md`
- `docs/SUPABASE_AUTH_PHONE_OTP_STAGING_PLAN.md`
- `docs/SUPABASE_AUTH_REDIRECT_URL_CHECKLIST.md`
- `docs/SMS_PROVIDER_COST_AND_RATE_LIMIT_NOTES.md`
- `reports/milestones/M28_SUPABASE_AUTH_PHONE_OTP_STAGING_PLAN_REPORT.md`

## Routes Added

- `/app/auth/phone-staging`

## Readiness Service Notes

- `runPhoneAuthStagingReadinessAudit()` is local/static only.
- It checks Supabase env readiness, phone auth flags, redirect URL readiness, SMS provider setup status, OTP rate-limit policy, test phone number plan, session ownership requirements, Guest Sync dependency, rollback readiness, and production blockers.
- It reads public frontend config and existing local adapter statuses only.
- It does not create a Supabase client, call Auth, send SMS, write data, or perform network checks.

## Phone OTP Staging Checklist Notes

The new route shows:

- readiness score and checklist sections
- current auth/Supabase flags
- staging setup steps
- future flags needed later
- redirect URL readiness
- session ownership rules
- safe rollback checklist
- production blockers
- required copy: "ยังไม่ส่ง OTP จริง" and "ยังไม่เปิด auth จริง"

## SMS/Rate-Limit Notes

Docs now cover:

- SMS provider setup considerations
- cost and spending-limit warnings
- resend cooldowns
- max attempts and lockout policy
- test phone number handling
- Thai UX copy for resend/failure states
- service-role and provider-secret safety

## Screens Updated

- `/app/auth/phone` keeps local mock mode visible and links to the staging checklist.
- `/app/auth/status` adds phone OTP staging planning copy and link.
- `/app/auth/sync-preview` explains that real sync requires real session ownership first.
- `/app/supabase-readiness` adds phone auth staging readiness status.
- `/app/supabase-connection` adds phone auth staging status and link.
- `/app/admin` adds phone auth staging readiness in overview/system panels.
- `/app/account-preview`, `/app/profile`, and `/app/qa` link to the new checklist.

## Verification Commands

```bash
npm run lint
npm run build
```

Both passed. The production build completed with the existing Vite large chunk warning.

## Manual Route Checks

The in-app Browser plugin did not expose an available `iab` browser in this session, so route verification used local Vite on `http://127.0.0.1:5174` plus headless Chrome DOM checks.

Passed:

- `/app/auth/phone-staging`
- `/app/auth/phone`
- `/app/auth/status`
- `/app/auth/sync-preview`
- `/app/supabase-readiness`
- `/app/supabase-connection`
- `/app/admin`
- `/app/profile`

The local Vite server was stopped after verification.

## Known Limitations

- No real Supabase Auth adapter.
- No real OTP SMS.
- No SMS provider configured.
- No redirect flow executed.
- No real Supabase keys committed.
- No service-role key.
- No Supabase writes.
- No cloud sync.
- No LINE/Google real login.
- No default network calls.
- No real account recovery or account deletion workflow yet.
- Readiness scoring is conceptual and cannot verify a real Supabase dashboard configuration.

## Next Recommended Milestone

M29 should add a controlled Supabase Auth phone OTP staging test adapter behind explicit flags: real staging-only Auth calls, redirect/session handling, test phone number procedure, logout verification, RLS ownership checks, and rollback drills while keeping cloud sync disabled.
