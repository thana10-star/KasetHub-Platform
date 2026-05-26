# M109 Community Backend Blockers

M109 did not enable real community writes.

M110 update: the staging SQL/RLS/storage draft has been created, but it has not been applied or verified by the app. Community writes remain disabled by default behind `VITE_ENABLE_COMMUNITY_WRITES=false`.

M113 update: owner evidence confirms the M110 SQL/RLS/storage pack was applied in Supabase staging and the core two-user RLS/storage smoke test passed. This clears the main staging RLS/storage blocker for a controlled staging adapter, but production writes, public launch, backend notifications, moderation operations, and rate limiting remain blocked.

## Blockers

1. Real auth ownership is not production-ready.
   - Phone auth is currently local/mock or staging-preview oriented.
   - The M113 adapter requires `client.auth.getUser()` and does not accept local mock sessions for writes.
   - Production auth ownership is still not approved for public community writes.

2. RLS is not applied and verified for the M109 community model.
   - M113 owner evidence marks the core staging RLS checks as passed.
   - Production RLS/public launch approval is still deferred.

3. Storage is not ready for community images.
   - M113 owner evidence confirms `community-post-images` exists and core owner-folder checks passed in staging.
   - Production storage launch approval and cleanup policy are still deferred.

4. Notification creation is not backend-controlled.
   - The notification center is local/demo.
   - Like/reply notifications need owner-safe insertion logic.

5. Moderation and report review are not operational.
   - Report reasons and flow are specified.
   - A real report queue and admin/moderator role are deferred.

## Required Before Public Launch

- Apply and review `supabase/sql/community_v1_schema_m110.sql` in staging.
- Verify auth session ownership end-to-end.
- Create and test storage bucket policies.
- Add server-side notification creation.
- Add moderation queue and role checks.
- Add rate limiting.
- Run route, service, RLS, storage, and abuse-case QA.
