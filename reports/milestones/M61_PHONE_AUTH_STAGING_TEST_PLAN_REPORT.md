# M61 Phone Auth Staging Test Plan Report

## Summary

M61 returns KasetHub to the main Supabase/Auth production-readiness roadmap after the calculator sub-phase. It adds a staging-only Phone Auth review service, a Thai-first `/app/auth/phone-staging-test` route, UI status links across existing auth/readiness/admin/QA screens, docs, and tests that keep real Phone Auth blocked until explicit staging setup is complete.

No production Phone Auth, real OTP/SMS send, backend write, Supabase write, cloud sync, Edge Function deployment, service-role key, real key commit, or automatic network behavior was added.

## Files Changed

Phone Auth staging review services:

- `src/services/auth/phone-auth-staging-review.types.ts`
- `src/services/auth/phone-auth-staging-review.ts`
- `src/services/auth/phone-auth-staging-review.test.ts`

Routes and UI:

- `src/routes/AuthPhoneStagingTestPage.tsx`
- `src/routes/AuthPhonePage.tsx`
- `src/routes/AuthStatusPage.tsx`
- `src/routes/AuthSyncPreviewPage.tsx`
- `src/routes/AccountPreviewPage.tsx`
- `src/routes/SupabaseReadinessPage.tsx`
- `src/routes/AdminDashboardPage.tsx`
- `src/routes/NextPhasePage.tsx`
- `src/routes/QAPage.tsx`
- `src/app/App.tsx`
- `src/types/kaset.ts`
- `src/services/qa/route-registry.ts`

Docs:

- `docs/M61_PHONE_AUTH_STAGING_TEST_PLAN.md`
- `docs/M61_SUPABASE_AUTH_DASHBOARD_CHECKLIST.md`
- `docs/M61_PHONE_AUTH_ROLLBACK_PLAN.md`
- `docs/PHONE_AUTH_BOUNDARY.md`
- `docs/FARMER_FRIENDLY_AUTH_STRATEGY.md`
- `docs/SUPABASE_AUTH_PHONE_OTP_STAGING_PLAN.md`
- `docs/SUPABASE_AUTH_REDIRECT_URL_CHECKLIST.md`
- `docs/SMS_PROVIDER_COST_AND_RATE_LIMIT_NOTES.md`
- `docs/GUEST_TO_ACCOUNT_SYNC_PLAN.md`
- `docs/GUEST_SYNC_PROOF_OF_CONCEPT.md`
- `docs/PROJECT_BLUEPRINT.md`
- `README.md`

Build artifacts updated by verification:

- `dist/index.html`
- `tsconfig.app.tsbuildinfo`

## Routes Added

- `/app/auth/phone-staging-test`

## Phone Auth Staging Notes

`runPhoneAuthStagingReview()` now reviews:

- Supabase staging project evidence
- SQL/RLS execution evidence
- public read/RLS review evidence
- auth flags off by default
- phone auth mode
- redirect URL readiness
- SMS provider setup status
- test phone number plan
- OTP cost/rate-limit warning
- ownership requirement before Guest Memory sync
- rollback readiness
- production blockers

The review keeps `canSendRealOtp: false`, `noRealSms: true`, `noSupabaseWrite: true`, and `noCloudSync: true`.

## Redirect / SMS Setup Notes

M61 documents and surfaces checklist items for:

- Supabase dashboard Phone provider setup
- local, preview/staging, and future production redirect URLs
- SMS provider secrets staying server-side only
- SMS spending limits, cooldowns, attempt limits, and lockouts
- small-batch test phone number handling outside the repo
- rollback steps after staging tests

## Ownership / Sync Boundary Notes

Guest Memory sync remains blocked until a real Supabase session proves ownership. Phone mock sessions do not count as ownership. Cloud sync remains disabled until auth ownership, RLS owner checks, consent, idempotency, and backend-confirmed success are implemented.

Frontend service-role keys remain rejected. `.env.local` and real staging keys must stay out of git.

## Tests

Vitest coverage now includes:

- default phone staging review status is blocked until explicitly configured
- auth flags are off by default
- cloud sync is blocked until ownership exists
- service-role key patterns are not accepted in frontend config
- rollback steps exist before real OTP testing

## Verification Commands

```bash
npm run lint
npm run test
npm run build
```

Results:

- `npm run lint` passed.
- `npm run test` passed: 2 files, 58 tests.
- `npm run build` passed.
- Vite reported the existing large chunk warning after production build.

Manual route checks:

- `/app/auth/phone-staging-test`
- `/app/auth/status`
- `/app/auth/phone`
- `/app/auth/sync-preview`
- `/app/account-preview`
- `/app/supabase-readiness`
- `/app/admin`
- `/app/next-phase`
- `/app/qa`

Results:

Manual route checks were run against `http://127.0.0.1:5173` using Chrome headless DOM rendering because the in-app Browser runtime reported no available browser session.

- `/app/auth/phone-staging-test` passed.
- `/app/auth/status` passed.
- `/app/auth/phone` passed.
- `/app/auth/sync-preview` passed.
- `/app/account-preview` passed.
- `/app/supabase-readiness` passed.
- `/app/admin` passed.
- `/app/next-phase` passed.
- `/app/qa` passed.

## Known Limitations

- No real Phone Auth is enabled yet.
- No OTP or SMS is sent by the app.
- No Supabase Auth session is created.
- No cloud sync or Guest Memory upload exists.
- No Supabase writes or Edge Function deployments occur.
- No SMS provider secret, service-role key, or real key is committed.
- Staging test phone numbers are planned only and must be managed outside the repo.
- Production auth remains blocked until staging evidence, ownership proof, rollback validation, and cost/rate-limit controls are reviewed.

## Next Recommended Milestone

M62 should run the first controlled Supabase Phone Auth staging test with explicit local staging flags, a small internal test-number set, dashboard-side SMS cost guards, redirect verification, rollback validation, and proof that Guest Memory cloud sync remains blocked until real ownership is proven.
