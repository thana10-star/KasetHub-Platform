# M36 Real Backend Phase Decision

M36 is a planning milestone after the M01-M35 local/mock prototype. It does not connect Supabase, enable auth, call AI APIs, add secrets, write backend data, or add production behavior.

## Decision

Recommended first real implementation path:

1. Supabase staging connection + SQL/RLS execution on staging.
2. Phone auth staging.
3. Guest sync staging.
4. Real AI text proxy.
5. Plant vision proxy.
6. PWA/mobile wrapper.

AI text proxy can move earlier if demo value is the priority, but it must happen in `staging/ai-proxy` with backend-owned secrets, rate limits, cost caps, safety logging, and fixture fallback.

## Why Supabase First

Supabase staging should come first because it proves the most important security foundations before user data moves:

- schema can be applied to a staging project
- RLS can be tested with anon, owner, other-user, and future admin contexts
- frontend env uses only URL and anon key
- service-role keys stay server-side only
- rollback and manual cleanup are documented before real writes

## Phase Options

- `real_supabase_staging`: safest first step; verifies schema/RLS/env/rollback.
- `real_phone_auth_staging`: follows Supabase; proves session ownership and redirect URLs.
- `real_guest_sync_staging`: follows phone auth; sync needs a real authenticated owner.
- `real_ai_text_proxy`: can be parallel/earlier for demo value; must protect provider keys.
- `real_plant_vision_proxy`: later because image privacy and AI safety risks are higher.
- `pwa_offline_mobile_shell`: later after core routes and backend boundaries stabilize.
- `closed_test_preparation`: begins when staging path, privacy copy, and support workflow are ready.

## Stop Conditions

Stop real implementation work if any of these happens:

- a service-role key or AI provider key appears in frontend code, Vite env, or repository files
- the app requires `.env.local` to run basic local/mock routes
- RLS allows one user to read or write another user's private data
- a staging branch starts writing production data
- mock price, weather, AI, or moderation data can be mistaken for production claims

## Production Blockers

- no real Supabase SQL/RLS verification yet
- no real auth/session ownership yet
- no deployed Guest Sync Edge Function
- no backend-owned AI proxy or provider-key storage
- no production privacy/security review
- no monitoring, rate limits, backup, rollback, or incident process

