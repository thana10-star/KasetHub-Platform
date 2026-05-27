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
- M116.12 fixes report reason mapping so Thai UI labels submit database-safe reason codes, and adds simple report anti-abuse guards without CAPTCHA.
- M116.13 adds an admin-only moderation review dashboard and SQL/RPC draft, pending owner application and staging verification.
- M116.14 defers owner-side moderation activation so the next focus can move to real crop/product prices and fertilizer prices.

## What Passed So Far

- Community schema, RLS policies, and storage bucket were applied in Supabase staging.
- Owner two-user RLS/storage smoke test passed in M113.
- `/app/login` exists for staging account sign-in.
- Community write adapter uses the anon Supabase client and relies on RLS.
- M115 local tests confirmed like/comment UI regressions are covered.
- No fake public community feed data is shown.

## What Is Still Missing

- Owner app-level staging retest after M115 deployment.
- Owner application and verification of the M116.13 moderation dashboard SQL/RPC/admin allowlist. M116.14 status: deferred / owner setup pending.
- Rate limiting for posts, comments, likes, and reports.
- Backend-created like/reply in-app notifications, or an explicit owner decision to launch without them.
- Owner staging verification for comment likes and one-level replies.
- Owner staging verification for report submission across all reason options.
- Owner application/verification of the optional report unique-index guard.
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

M116.12 should also be retested in staging before any public write decision: report `สแปม`, report `เนื้อหาไม่เหมาะสม`, retry the same target, and confirm signed-out users cannot submit reports.

M116.13 should be applied and retested before public write enablement: add the owner to `admin_moderators`, set `VITE_ADMIN_EMAILS`, confirm `/app/community-moderation` loads for the owner, and confirm normal users cannot access report data.

M116.14 owner decision: do not perform the owner-side moderation setup right now. This is not blocking private/staging app exploration, but it is required before public Community write launch. Reports can be created, but dashboard queue requires admin SQL/RPC setup before real in-app review.
