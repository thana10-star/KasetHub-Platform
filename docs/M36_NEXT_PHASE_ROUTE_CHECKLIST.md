# M36 Next Phase Route Checklist

Check these routes before and after real backend work. The app must still work without `.env.local` unless a staging-specific check explicitly says otherwise.

## Core App

- `/app`
- `/app/profile`
- `/app/memory`
- `/app/notifications`
- `/app/notification-settings`

## Auth / Account / Sync

- `/app/auth`
- `/app/auth/status`
- `/app/auth/phone`
- `/app/auth/phone-staging`
- `/app/auth/sync-preview`
- `/app/account-preview`
- `/app/guest-sync-status`
- `/app/guest-sync-edge`

## Supabase Readiness

- `/app/supabase-readiness`
- `/app/supabase-connection`
- `/app/supabase-sql-checklist`

M38 branch-mode checks:

- `/app/next-phase` shows recommended branch `staging/supabase`.
- `/app/supabase-readiness` shows Supabase staging experiment mode.
- `/app/admin` shows M38 branch setup status.
- No route should require `.env.local`.

## AI / Image Analysis

- `/app/ai`
- `/app/ai-proxy-status`
- `/app/ai-credits`
- `/app/analyze`
- `/app/image-preflight`
- `/app/analysis-history`

## My Farm / Farmer Tools

- `/app/my-farm`
- `/app/my-farm/settings`
- `/app/weather`
- `/app/farm-area`
- `/app/farm-area-guide`
- `/app/prices`
- `/app/crop-watch`

## Community / Content

- `/app/community`
- `/app/community-rules`
- `/app/moderation-center`
- `/app/youtube`
- `/app/articles`
- `/app/content-admin-preview`

## Admin / QA

- `/app/admin`
- `/app/qa`
- `/app/mvp-snapshot`
- `/app/next-phase`
