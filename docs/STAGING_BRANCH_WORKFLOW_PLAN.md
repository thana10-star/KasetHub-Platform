# Staging Branch Workflow Plan

M36 keeps `main` as the stable local/mock prototype and uses separate staging branches for real integration experiments.

## Branches

- `main`: stable prototype. No real backend/API/auth behavior. Must build with no `.env.local`.
- `staging/supabase`: Supabase staging, SQL/RLS, phone auth, Guest Sync Edge Function experiments.
- `staging/ai-proxy`: AI text proxy and later plant vision proxy experiments.
- `staging/mobile`: PWA/offline/mobile shell and closed-device testing experiments.

## Merge Rules

- Run `npm run lint` and `npm run build`.
- Check the route checklist for the affected module and core app routes.
- Keep local/mock fallback working when env flags are absent or false.
- Do not merge production secrets, service-role keys, AI provider keys, or private endpoint URLs.
- Do not merge backend writes unless staging RLS/auth/rollback checks are documented.

## Rollback Rules

- Tag or note a clean prototype snapshot before large staging merges.
- Prefer reverting the merge commit for code rollback.
- Disable feature flags before rolling back data-facing integrations.
- Rotate keys if there is any suspicion of secret exposure.
- Keep manual cleanup notes for staging SQL, auth test users, sync events, and AI logs.

## Cloudflare Preview Strategy

- Use preview deployments per staging branch.
- Store only client-safe variables in Cloudflare Pages public build env.
- Keep service-role and AI provider keys in backend/Edge Function secret stores only.
- Confirm preview URLs are separate from production URLs before testing redirects.

## Test Commands

```bash
npm run lint
npm run build
```

Manual route checks must include the changed module plus `/app`, `/app/profile`, `/app/qa`, `/app/admin`, and `/app/mvp-snapshot`.

