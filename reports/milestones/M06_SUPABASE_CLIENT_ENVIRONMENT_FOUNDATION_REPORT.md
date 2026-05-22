# M06 Supabase Client + Environment Foundation Report

## Summary

M06 scaffolds Supabase integration safely behind environment checks and feature flags. KasetHub still runs in guest/local mode by default, Guest Memory remains the active storage layer, and no real auth, signup, cloud sync, phone OTP, LINE Login, Google Login, or data writes are enabled.

## Files Changed

- `package.json`
- `package-lock.json`
- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/SUPABASE_SCHEMA_DRAFT.md`
- `docs/GUEST_TO_ACCOUNT_SYNC_PLAN.md`
- `docs/GUEST_MEMORY_FRAMEWORK.md`
- `docs/SUPABASE_ENV_SETUP.md`
- `src/vite-env.d.ts`
- `src/config/env.ts`
- `src/config/feature-flags.ts`
- `src/services/supabase/supabase-config-check.ts`
- `src/services/supabase/supabase-status.ts`
- `src/services/supabase/supabase-client.ts`
- `src/services/account/account-status.types.ts`
- `src/services/account/account-status-service.ts`
- `src/routes/AccountPreviewPage.tsx`
- `reports/milestones/M06_SUPABASE_CLIENT_ENVIRONMENT_FOUNDATION_REPORT.md`
- `reports/milestones/m06-app.png`
- `reports/milestones/m06-profile.png`
- `reports/milestones/m06-memory.png`
- `reports/milestones/m06-account-preview.png`
- `reports/milestones/m06-articles.png`
- `reports/milestones/m06-youtube.png`
- `reports/milestones/m06-my-farm.png`

## Dependencies Added

- `@supabase/supabase-js`

The SDK is installed for future work, but the app does not create an active client unless Supabase ENV and feature flags are ready.

## Env Variables Added

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_ENABLE_SUPABASE=false`
- `VITE_ENABLE_AUTH=false`
- `VITE_ENABLE_CLOUD_SYNC=false`

The project builds and runs with no `.env.local` file.

## Feature Flag Behavior

- Supabase is off by default.
- Missing ENV keeps the app in guest/local mode.
- Auth and Cloud Sync remain independently gated.
- `getSupabaseClient()` returns `null` unless `VITE_ENABLE_SUPABASE=true`, Supabase URL is present, anon key is present, and config checks pass.
- The config check warns about missing ENV, invalid URL shape, placeholder anon keys, and accidental service-role key usage.

## Account Preview Updates

`/app/account-preview` now shows:

- Guest mode active
- Local memory count
- Supabase runtime status
- Feature flag cards for Supabase, Auth, and Cloud Sync
- Existing sync plan summary
- Future backup options for phone, LINE, and Google
- Disabled/mock backup CTA

Default status with no `.env.local` is “ยังไม่ได้เชื่อมต่อ Supabase”.

## Verification Commands

```bash
npm install
npm run lint
npm run build
```

All commands passed.

Manual route checks returned HTTP 200:

- `/app`
- `/app/profile`
- `/app/memory`
- `/app/account-preview`
- `/app/articles`
- `/app/youtube`
- `/app/my-farm`

Mobile screenshots were captured for the same routes.

## Known Limitations

- No real Supabase project is connected.
- No real auth, signup, login, phone OTP, LINE Login, or Google Login.
- No cloud sync or Guest Memory upload.
- No backend sync endpoint.
- No production API keys.
- No service-role key in frontend.
- Supabase status is a frontend readiness indicator only.

## Next Recommended Milestone

M07 should design the auth UX and backend-owned sync endpoint contract, including user consent, phone-first onboarding, LINE/Google secondary login paths, and a dry-run payload format for uploading Guest Memory without data loss.
