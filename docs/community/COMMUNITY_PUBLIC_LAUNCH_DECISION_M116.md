# M116 Community Public Launch Decision

Date: 2026-05-26

## Current Status

Community remains a staging write adapter only.

- Default write flag remains `VITE_ENABLE_COMMUNITY_WRITES=false`.
- Production writes remain disabled.
- Staging SQL/RLS/storage checks passed in earlier owner evidence.
- M115 fixed the first staging UI defects for like count and comment crash.
- M116 app-level owner retest evidence is still pending.
- M116.3 adds staging-ready comment likes and one-level replies, pending owner staging retest after the SQL draft is applied.

## What Passed So Far

- Community schema, RLS policies, and storage bucket were applied in Supabase staging.
- Owner two-user RLS/storage smoke test passed in M113.
- `/app/login` exists for staging account sign-in.
- Community write adapter uses the anon Supabase client and relies on RLS.
- M115 local tests confirmed like/comment UI regressions are covered.
- No fake public community feed data is shown.

## What Is Still Missing

- Owner app-level staging retest after M115 deployment.
- Public moderation/admin review workflow.
- Rate limiting for posts, comments, likes, and reports.
- Backend-created like/reply in-app notifications, or an explicit owner decision to launch without them.
- Owner staging verification for comment likes and one-level replies.
- Support/report handling process for live community reports.
- Privacy/support URL readiness for public launch.
- Owner approval for production flag enablement.

## Why Production Should Remain Disabled

Production writes should stay disabled because the current Community path has not yet completed app-level staging retest after M115, and public moderation/rate-limit operations are not ready.

The feature flag is only a UI/app gate. Real production safety still depends on verified RLS, moderation capacity, report handling, and owner approval.

## Requirements Before Public Production

- Owner confirms User A/User B/anonymous app-level staging write tests pass.
- Moderation or admin queue exists for reports and hidden/reported content.
- Rate limiting plan exists and is accepted for public writes.
- Backend notifications are implemented, or owner accepts a no-notification public launch.
- Support/report handling owner is identified.
- Privacy and support URLs are public and linked where needed.
- Production environment is reviewed for anon key only and no service-role exposure.
- Owner explicitly approves setting production community writes on.

## Recommendation

Keep production community writes disabled.

Continue staging testing with `VITE_ENABLE_COMMUNITY_WRITES=true` only in staging/preview. Apply and verify the M116.3 comment-like/reply SQL in staging before broad owner testing. If the core write flow and comment polish pass, the next milestone should add backend-created in-app notifications only after confirming the community flow is stable.
