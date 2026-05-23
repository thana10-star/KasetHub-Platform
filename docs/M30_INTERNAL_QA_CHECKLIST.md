# M30 Internal QA Checklist

Use this checklist before moving KasetHub from prototype review into real staging/backend work.

## Pre-Check

- Confirm this is still an Internal MVP / Prototype.
- Confirm no `.env.local` values or real keys are committed.
- Confirm no service-role key appears in frontend code, docs examples, or env templates.
- Confirm feature flags default to local/mock/disabled.
- Confirm the app runs without `.env.local`.

## Route Smoke Check

- Open `/app` and confirm the app shell renders.
- Open `/app/mvp-snapshot` and confirm the prototype/production warnings appear.
- Open `/app/admin` and confirm admin actions are mock/local only.
- Open `/app/qa` and confirm M30 route coverage summary appears.
- Open content, AI, price, community, auth, Supabase, and sync surfaces listed in `docs/M30_ROUTE_CHECKLIST.md`.

## UI Boundary Check

- AI screens must say guidance is not a guaranteed diagnosis.
- Plant image screens must say no real upload happens.
- Crop price screens must say `ราคาอ้างอิง` and demo/reference only.
- Community moderation screens must say reports remain local/mock only.
- Auth screens must say OTP/auth is not real.
- Supabase screens must say Supabase is not connected and service-role keys are forbidden in frontend.
- Guest Sync Edge screens must say no endpoint is deployed or called.

## Mobile / Senior-Friendly Check

- Primary buttons are large enough to tap.
- Thai copy is direct and not overly technical.
- Long text wraps inside cards and buttons.
- Route lists remain readable on mobile.
- Important warnings are visible before risky/demo actions.

## Data Safety Check

- Guest Memory remains local.
- Saved articles/videos remain local.
- Crop watch preferences remain local.
- Moderation reports/hidden posts remain local.
- AI credits remain local.
- No backend writes are triggered by route load.

## Build Check

```bash
npm run lint
npm run build
```

## Go / No-Go

M30 is a go for internal review if all route smoke checks pass and no production/backend claims appear. It is not a go for public production, app store release, real farmer data, real AI diagnosis, real crop price claims, or real community moderation.

