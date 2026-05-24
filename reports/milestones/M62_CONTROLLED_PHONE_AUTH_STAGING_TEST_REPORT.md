# M62 Controlled Supabase Phone Auth Staging Test Report

## Summary

M62 adds the controlled Supabase Phone Auth staging boundary for KasetHub. The app still defaults to local mock auth, but it now has a gated staging adapter that can request and verify Supabase Phone OTP only when explicit local staging flags, valid anon Supabase config, and cloud-sync-off safety checks all pass.

No production auth, cloud sync, Guest Memory upload, app table write, Edge Function deployment, service-role key, real key commit, or default network behavior was added.

## Files Changed

Phone Auth staging adapter and ownership services:

- `src/services/auth/phone-auth-staging-adapter.types.ts`
- `src/services/auth/phone-auth-staging-adapter.ts`
- `src/services/auth/auth-ownership-status.types.ts`
- `src/services/auth/auth-ownership-status.ts`
- `src/services/auth/phone-auth-staging-adapter.test.ts`
- `src/services/auth/phone-auth.types.ts`
- `src/services/auth/phone-auth-adapter.ts`
- `src/services/auth/phone-auth-staging-review.ts`

Routes and UI:

- `src/routes/AuthPhonePage.tsx`
- `src/routes/AuthPhoneStagingTestPage.tsx`
- `src/routes/AuthStatusPage.tsx`
- `src/routes/AuthSyncPreviewPage.tsx`
- `src/routes/AccountPreviewPage.tsx`
- `src/routes/QAPage.tsx`

Docs:

- `docs/M62_CONTROLLED_PHONE_AUTH_STAGING_TEST.md`
- `docs/M62_PHONE_AUTH_TEST_NUMBER_RUNBOOK.md`
- `docs/M62_PHONE_AUTH_SESSION_OWNERSHIP_REVIEW.md`
- `docs/M61_PHONE_AUTH_STAGING_TEST_PLAN.md`
- `docs/PHONE_AUTH_BOUNDARY.md`
- `docs/SUPABASE_AUTH_PHONE_OTP_STAGING_PLAN.md`
- `docs/SUPABASE_AUTH_REDIRECT_URL_CHECKLIST.md`
- `docs/SMS_PROVIDER_COST_AND_RATE_LIMIT_NOTES.md`
- `docs/GUEST_TO_ACCOUNT_SYNC_PLAN.md`
- `docs/PROJECT_BLUEPRINT.md`
- `README.md`

Build artifacts updated by verification:

- `dist/index.html`
- `tsconfig.app.tsbuildinfo`

## Routes Updated

- `/app/auth/phone`
- `/app/auth/phone-staging-test`
- `/app/auth/status`
- `/app/auth/sync-preview`
- `/app/account-preview`
- `/app/qa`

## Env Flags Required Locally

Controlled staging OTP requires local, uncommitted `.env.local` values:

```env
VITE_ENABLE_SUPABASE=true
VITE_ENABLE_AUTH=true
VITE_ENABLE_PHONE_AUTH=true
VITE_PHONE_AUTH_MODE=supabase_staging_ready
VITE_ENABLE_CLOUD_SYNC=false
VITE_SUPABASE_AUTH_REDIRECT_URL=http://localhost:5173/app/auth/status
VITE_AUTH_STAGING_LABEL=staging
```

Staging also requires valid `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Service-role keys remain blocked from frontend env.

## Staging OTP Behavior

`phone-auth-staging-adapter.ts` supports:

- `local_mock`
- `supabase_staging_disabled`
- `supabase_staging_ready`
- `production_disabled`

Default behavior remains `local_mock`. `supabase_staging_ready` can call Supabase Auth `signInWithOtp` and `verifyOtp` only when all staging gates pass. OTP values are not logged or stored by the app.

Successful staging verification stores only a local masked session preview. It does not persist tokens, write profile tables, write app tables, or trigger Guest Memory sync.

## Ownership Boundary Notes

`auth-ownership-status.ts` returns:

- guest only
- local mock phone session
- real Supabase phone staging session preview

`syncAllowed` remains `false` for every M62 state. Mock sessions do not count as real ownership. Real staging sessions can be represented with masked user id and masked phone number, but Guest Memory upload waits for a later ownership/RLS milestone.

## SMS / Cost Guardrails

M62 surfaces:

- `ทดสอบเฉพาะเบอร์ภายในเท่านั้น`
- SMS spending limit reminder
- resend cooldown reminder
- OTP attempt limit reminder
- rollback checklist
- no-cloud-sync warning

Test phone numbers must stay outside the repo and be used only with owner consent.

## Verification Commands

```bash
npm run lint
npm run test
npm run build
```

Results:

- `npm run lint` passed.
- `npm run test` passed: 3 files, 66 tests.
- `npm run build` passed.
- Vite reported the existing large chunk warning after production build.

Manual route checks:

- `/app/auth/phone`
- `/app/auth/phone-staging-test`
- `/app/auth/status`
- `/app/auth/sync-preview`
- `/app/account-preview`
- `/app/admin`
- `/app/next-phase`
- `/app/qa`

Results:

Manual route checks were run against `http://127.0.0.1:5173` using Chrome headless DOM rendering because the in-app Browser runtime reported no available browser session.

- `/app/auth/phone` passed.
- `/app/auth/phone-staging-test` passed.
- `/app/auth/status` passed.
- `/app/auth/sync-preview` passed.
- `/app/account-preview` passed.
- `/app/admin` passed.
- `/app/next-phase` passed.
- `/app/qa` passed.

## Known Limitations

- No production Phone Auth is enabled.
- No real OTP is sent unless local staging flags are explicitly enabled outside git.
- No `.env.local` or real Supabase key is committed.
- No service-role key path exists in frontend.
- No cloud sync or Guest Memory upload occurs.
- No profile/app tables are written.
- No Edge Functions are deployed.
- No live ownership/RLS sync gate is implemented yet.
- Staging session preview is local-only and masked.

## Next Recommended Milestone

M63 should add the ownership/RLS sync gate review: verify `auth.uid()` owner mapping, dry-run owner-scoped RLS checks, consent capture, idempotency, audit logging, and proof that Guest Memory upload remains blocked until all ownership checks pass.
