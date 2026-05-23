# M30 Internal MVP Snapshot

KasetHub after M01-M29 is an internal MVP / prototype. The product surface is broad enough to review with the team and selected testers, but it is not production-ready.

## Current Feature Summary

- Mobile-first agriculture app shell with Thai UI.
- YouTube hub, video detail, saved videos, article list/detail, and content admin preview.
- Local AI assistant, AI credits, AI proxy status, plant image analysis UX, image privacy, and analysis history.
- Crop price reference demo data, crop watch, and local alert preferences.
- Community posts, community rules, local report/hide behavior, and mock moderation center.
- Guest Memory for saved items, likes, follows, recent AI questions, and My Farm records.
- Mock auth, account preview, phone OTP staging plan, Guest Sync status, and Edge Function staging contract.
- Supabase readiness, connection dry-run boundary, and SQL staging checklist.
- Admin Dashboard, QA page, and M30 MVP snapshot page.

## Route Groups

### Core App

- `/app`
- `/app/profile`
- `/app/memory`
- `/app/my-farm`
- `/app/notifications`
- `/app/saved-articles`
- `/app/saved-videos`

### Content / YouTube

- `/app/youtube`
- `/app/youtube/:videoId`
- `/app/articles`
- `/app/articles/:articleId`
- `/app/content-admin-preview`

### AI / Plant Analysis

- `/app/ai`
- `/app/ai-credits`
- `/app/ai-proxy-status`
- `/app/analyze`
- `/app/analysis-history`
- `/app/image-privacy`

### Prices / Crop Watch

- `/app/prices`
- `/app/prices/:priceId`
- `/app/crop-watch`

### Community / Moderation

- `/app/community`
- `/app/community-rules`
- `/app/moderation-center`

### Auth / Account / Sync

- `/app/auth`
- `/app/auth/status`
- `/app/auth/linking`
- `/app/auth/phone`
- `/app/auth/phone-staging`
- `/app/auth/line`
- `/app/auth/google`
- `/app/auth/sync-preview`
- `/app/account-preview`
- `/app/guest-sync-status`
- `/app/guest-sync-edge`

### Supabase / Staging

- `/app/supabase-readiness`
- `/app/supabase-connection`
- `/app/supabase-sql-checklist`

### Admin / QA

- `/app/admin`
- `/app/qa`
- `/app/mvp-snapshot`

## Current Storage Mode

- Typed fixtures for content, videos, price data, admin data, and safety/planning data.
- Versioned localStorage for Guest Memory, saved items, AI credits, crop watch, moderation demo state, and mock auth/session state.
- No Supabase writes, no backend writes, no cloud sync, no upload, no push notification, and no production data source.

## Mock / Local-Only Boundaries

- Supabase is disabled unless future flags and local env are configured.
- Network dry-run checks are disabled by default.
- AI answers and plant analysis are mock fixtures.
- Crop prices are demo/reference samples only.
- Community reports and hidden posts remain on the current device.
- Auth flows are local/mock and do not send OTP or create real sessions.
- Guest Sync Edge Function is a contract only; it is not deployed or called.
- Admin Dashboard is a mock/local preview with no real permissions.

## Readiness By Area

| Area | Status | Notes |
| --- | --- | --- |
| Backend readiness | Needs backend | Contracts exist; no deployed backend or writes. |
| AI readiness | Needs real API | Proxy/adapters exist; no provider calls or keys. |
| Supabase readiness | Documentation only | Staging guides and dry-run boundaries exist; no connection by default. |
| Auth readiness | Blocked | Phone OTP plan exists; real auth is not enabled. |
| Community readiness | Needs backend | Local report/hide exists; no moderation backend. |
| Content readiness | Needs backend | Admin preview exists; no CMS publish workflow. |
| Crop price readiness | Needs real API | Source model exists; no real official/market data. |
| Admin readiness | Ready mock | Dashboard exists; no admin auth/RBAC. |
| Store readiness | Blocked | Needs backend, privacy/security review, monitoring, and production operations. |

## Production Blockers

- No real Supabase staging connection has been executed.
- No SQL/RLS has been run on staging.
- No real Auth session ownership exists.
- No backend write path or Edge Function is deployed.
- No admin RBAC, audit log, or protected moderation workflow exists.
- No AI provider, upload pipeline, safety monitoring, or cost controls are active.
- No real crop price source, freshness job, or correction workflow exists.
- No production privacy/security/legal review has been completed.

## Next-Phase Options

- Supabase Auth staging first: safest path for ownership and RLS.
- Guest Sync Edge Function staging after auth: validates idempotent sync.
- AI backend proxy staging: validates core AI value with higher safety/cost risk.
- Admin/CMS staging: useful before real community/content operations.
## M36 Phase Decision Link

After M35, the internal snapshot points to `/app/next-phase` for the real backend phase decision. The snapshot remains a prototype audit; the M36 page adds recommended order, branch workflow, production blockers, and risk register without enabling real Supabase, auth, AI, cloud sync, or network behavior.

