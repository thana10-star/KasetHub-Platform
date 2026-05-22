# M19 LINE Login Boundary + Account Linking Rules Report

## Summary

M19 adds a local-only LINE Login boundary and account-linking planner for KasetHub. LINE is now modeled as an important secondary provider for Thai users, while phone remains the recommended recovery path. The app can create and clear a LINE mock session, preview phone + LINE linking rules, and show linking recommendations across auth/sync/profile screens. No real LINE SDK, redirect, OAuth token, Supabase Auth provider, network call, Supabase write, service-role key, or cloud sync is added.

## Files Changed

- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/FARMER_FRIENDLY_AUTH_STRATEGY.md`
- `docs/GUEST_TO_ACCOUNT_SYNC_PLAN.md`
- `docs/GUEST_SYNC_ENDPOINT_CONTRACT.md`
- `docs/PHONE_AUTH_BOUNDARY.md`
- `docs/SUPABASE_ENV_SETUP.md`
- `docs/SUPABASE_SCHEMA_DRAFT.md`
- `docs/SUPABASE_TYPE_MAPPING.md`
- `docs/LINE_LOGIN_BOUNDARY.md`
- `docs/ACCOUNT_LINKING_RULES.md`
- `supabase/migrations/0001_kasethub_core_schema.sql`
- `src/vite-env.d.ts`
- `src/config/env.ts`
- `src/app/App.tsx`
- `src/types/kaset.ts`
- `src/services/auth/line-auth.types.ts`
- `src/services/auth/line-auth-local-mock.ts`
- `src/services/auth/line-auth-adapter.ts`
- `src/services/auth/account-linking.types.ts`
- `src/services/auth/account-linking-planner.ts`
- `src/services/account/account-status.types.ts`
- `src/services/account/account-status-service.ts`
- `src/routes/AuthLinePage.tsx`
- `src/routes/AuthLinkingPage.tsx`
- `src/routes/AuthPage.tsx`
- `src/routes/AuthStatusPage.tsx`
- `src/routes/AuthSyncPreviewPage.tsx`
- `src/routes/AccountPreviewPage.tsx`
- `src/routes/ProfilePage.tsx`
- `reports/milestones/M19_LINE_LOGIN_BOUNDARY_ACCOUNT_LINKING_RULES_REPORT.md`

## Routes Added

- `/app/auth/linking`

## Env Flags Added

```bash
VITE_LINE_AUTH_MODE=local_mock
VITE_ENABLE_LINE_AUTH=false
VITE_ENABLE_LINE_AUTH_LOCAL_MOCK=true
```

Default behavior remains safe:

- local mock only
- no LINE SDK
- no redirect
- no OAuth token
- no network calls
- no Supabase writes
- no secrets in frontend

## LINE Mock Behavior

The LINE mock service supports:

- `startLineLoginMock()`
- `completeLineLoginMock()`
- `getLineMockSession()`
- `clearLineMockSession()`

Mock session fields:

- `mockLineUserId`
- `displayName`
- optional `pictureUrl`
- `provider: line`
- `createdAt`
- `expiresAt`

The session is versioned in localStorage and is local to the current browser/device.

## Account Linking Rules

M19 defines:

- phone is the primary recovery path
- LINE can link to a phone account
- phone session + LINE session = linking candidate
- LINE-only session = preview only, recommend adding phone
- duplicate provider conflict requires user confirmation
- Guest Memory sync should attach only to a confirmed account owner

No linking write happens in M19.

## Screens Updated

- `/app/auth`
  - shows LINE mock status and linking recommendation
- `/app/auth/line`
  - upgraded to LINE-specific mock flow with large LINE-style CTA
- `/app/auth/status`
  - shows phone mock status, LINE mock status, mock sessions, and linking recommendation
- `/app/auth/linking`
  - new account-linking rules preview
- `/app/auth/sync-preview`
  - shows LINE mock status and linking recommendation while preserving phone ownership gate
- `/app/account-preview`
  - shows LINE boundary status and linking recommendation
- `/app/profile`
  - adds account-linking access and LINE/linking status copy

## Verification Commands

```bash
npm run lint
npm run build
```

Both commands passed. The production build completed with the existing Vite chunk-size warning.

Manual route checks returned HTTP 200:

- `/app/auth`
- `/app/auth/line`
- `/app/auth/status`
- `/app/auth/linking`
- `/app/auth/sync-preview`
- `/app/account-preview`
- `/app/profile`

## Known Limitations

- No real LINE SDK
- No real LINE redirect
- No OAuth token
- No LINE channel secret
- No Supabase Auth provider connection
- No network calls
- No Supabase writes
- No cloud sync
- No service-role key
- LINE mock session is local to the browser/device
- Account linking is a planner/preview only

## Next Recommended Milestone

M20 should define the content management and publishing foundation for articles/videos. It should prepare admin/editor workflows, article body storage, YouTube import ownership, and offline article body caching without enabling production CMS or real YouTube import yet.
