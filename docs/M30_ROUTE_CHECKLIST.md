# M30 Route Checklist

Manual smoke-check routes for the M30 internal prototype snapshot.

## Required M30 Checks

- `/app`
- `/app/mvp-snapshot`
- `/app/admin`
- `/app/qa`
- `/app/youtube`
- `/app/articles`
- `/app/ai`
- `/app/analyze`
- `/app/prices`
- `/app/crop-watch`
- `/app/community`
- `/app/profile`
- `/app/supabase-readiness`
- `/app/auth/status`
- `/app/guest-sync-edge`

## Additional Useful Checks

- `/app/memory`
- `/app/account-preview`
- `/app/guest-sync-status`
- `/app/supabase-connection`
- `/app/supabase-sql-checklist`
- `/app/auth/phone-staging`
- `/app/moderation-center`
- `/app/content-admin-preview`
- `/app/ai-proxy-status`
- `/app/image-privacy`

## Expected Result

Every route should render without real backend calls, without real keys, without writes, and with clear prototype/local/demo boundaries where relevant.

