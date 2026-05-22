# LINE Login Boundary

M19 adds a LINE Login boundary for KasetHub without enabling real LINE Login.

## Current Behavior

- `VITE_LINE_AUTH_MODE=local_mock` by default.
- `VITE_ENABLE_LINE_AUTH=false` by default.
- `VITE_ENABLE_LINE_AUTH_LOCAL_MOCK=true` by default.
- `/app/auth/line` can create a local LINE mock session.
- No LINE SDK is loaded.
- No redirect happens.
- No OAuth token is requested.
- No network call happens.
- No Supabase write happens.

## Why LINE Matters

LINE is important for Thai users because many farmers already use LINE groups, official accounts, and shared links. KasetHub should support LINE as a convenient secondary login path, especially for users who return from shared content or community channels.

Phone remains the recommended recovery path because phone OTP is easier to explain for account ownership and backup.

## Local Mock Session

The local mock session stores:

- `mockLineUserId`
- `displayName`
- optional `pictureUrl`
- `provider: line`
- `createdAt`
- `expiresAt`

This session is local to the browser and does not represent a real LINE identity.

## Future Real LINE Login

Future production work should:

- configure LINE Login in the LINE developer console
- keep LINE channel secret server-side only
- use Supabase Auth or a backend-owned OAuth callback
- validate provider identity before linking accounts
- require user confirmation before linking LINE to a phone account
- never expose LINE secrets or service-role keys in frontend code

## Guest Memory Sync Rule

Guest Memory should sync only after account ownership is clear. LINE-only preview is useful, but KasetHub should recommend adding phone as the recovery path before a real backup/sync.

## Current Screens

- `/app/auth/line`
- `/app/auth/linking`
- `/app/auth/status`
- `/app/auth/sync-preview`
- `/app/account-preview`
- `/app/profile`
