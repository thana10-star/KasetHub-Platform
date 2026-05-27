# M116.14 Community Moderation Setup Deferral Report

## 1. Summary

M116.14 documents the owner decision to defer owner-side Community moderation activation. The dashboard code and SQL/RPC draft remain in place, but the owner will not apply the admin moderation SQL, configure `VITE_ADMIN_EMAILS`, or verify the real queue right now.

No app behavior, routes, services, SQL, or env defaults were changed.

## 2. Files Created

- `docs/community/COMMUNITY_MODERATION_SETUP_DEFERRAL_M116_14.md`
- `docs/roadmap/AGRICULTURE_PRICE_NEXT_FOCUS_AFTER_COMMUNITY_M116_14.md`
- `reports/milestones/M116_14_COMMUNITY_MODERATION_SETUP_DEFERRAL_REPORT.md`

## 3. Files Modified

- `docs/release/V1_RELEASE_BLOCKER_LOG_M104.md`
- `docs/community/COMMUNITY_PUBLIC_LAUNCH_DECISION_M116.md`
- `docs/community/COMMUNITY_MODERATION_DASHBOARD_M116_13.md`
- `docs/community/COMMUNITY_REAL_FOUNDATION_M109.md`

## 4. Deferred Setup Items

- Applying `supabase/sql/community_admin_moderation_m116_13.sql`.
- Adding the owner Auth user to `public.admin_moderators`.
- Setting `VITE_ADMIN_EMAILS`.
- Verifying the real report queue in `/app/community-moderation`.

## 5. Why Deferral Is Acceptable Now

Production Community writes remain disabled by default with `VITE_ENABLE_COMMUNITY_WRITES=false`. The dashboard does not show fake reports, and real queue data remains unavailable until admin SQL/RPC setup is completed. This means the deferral is not blocking private/staging app exploration.

## 6. Blockers Before Public Community Launch

Community moderation setup is required before public Community write launch:

- admin SQL/RPC must be applied
- owner/admin must be inserted into `admin_moderators`
- `VITE_ADMIN_EMAILS` must be configured
- real queue access must be verified in-app
- non-admin denial must be verified
- signed-out denial must be verified
- no service-role frontend exposure must remain true

## 7. Next Focus

The next product focus is real agriculture crop/product prices and fertilizer prices. Community moderation activation stays documented as deferred and should be resumed before any public Community write launch decision.

## 8. Tests/Checks Run

- `npm run lint` passed.
- `npm run build` passed. Vite reported the existing large chunk warning, but the build completed successfully.
- `npm run test` passed: 47 test files, 435 tests.
- `git diff --check` passed with line-ending warnings only.

## 9. Known Limitations

- M116.14 does not apply SQL.
- M116.14 does not configure admin env.
- M116.14 does not verify real in-app report queue data.
- Rate limiting and backend notifications remain separate future work.

## 10. Next Recommended Milestone

Start real agriculture price source work, beginning with crop/product prices and fertilizer prices, while preserving the Community moderation setup blocker for public Community launch.
