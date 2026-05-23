# Supabase Readiness Audit

M25 adds a local-only readiness audit for the first Supabase staging connection. The audit does not call Supabase, fetch schema, run SQL, write data, enable auth, or add secrets. It reads frontend config, existing local adapter statuses, and known planning artifacts.

## App Routes

- `/app/supabase-readiness`
- `/app/supabase-connection`
- `/app/supabase-sql-checklist`
- `/app/auth/phone-staging`

The routes are linked from:

- `/app/admin`
- `/app/account-preview`
- `/app/qa`
- `/app/profile`

M26 adds `/app/supabase-connection` for anon-key/client-safe connection dry-run checks. It does not write data or require network by default.

M27 adds `/app/supabase-sql-checklist` for the manual SQL/RLS staging execution checklist. It is static/local only and does not connect to Supabase, run SQL, read database schema, or write data.

M28 adds `/app/auth/phone-staging` for Supabase Auth phone OTP staging planning. It is local-only and does not enable real auth, send OTP SMS, write data, or call Supabase.

Required notices:

- "ยังไม่ได้เชื่อมต่อ Supabase จริง"
- "ห้ามใส่ service-role key ใน frontend"
- "ต้องทดสอบบน staging ก่อน production"
- "ยังไม่ได้รัน SQL จริง"
- "ยังไม่ส่ง OTP จริง"
- "ยังไม่เปิด auth จริง"

## Schema Completeness Checklist

- Core profiles and account-linking tables are drafted.
- Guest Memory saved items, likes, follows, farm records, and AI history tables are drafted.
- Content, video, YouTube import, article body, and offline cache planning exists.
- Plant media, image-analysis jobs, storage metadata, and deletion plans exist.
- Crop price source, snapshot, import job, community report, crop watch, and alert tables are documented.
- Admin role, audit log, review task, moderation queue, expert review, and AI safety review tables are planned.

## RLS Review Checklist

- RLS enabled on every private/user-owned table.
- Public read policies are limited to published/visible/reference content.
- Owner policies use `auth.uid()` and never trust client-submitted user IDs.
- Moderator/admin policies are role-based and tested with real staging sessions.
- Backend-only writes are denied from browser anon/authenticated clients.
- Service-role actions live in Edge Functions or backend jobs only.

## Index Checklist

- `user_id` lookups for saved items, farm records, crop watches, and sync records.
- `item_type + item_id` uniqueness for saved/liked/followed items.
- `crop_key + captured_at` and source/region filters for crop prices.
- `video_id`, `youtube_video_id`, and publish status filters for content.
- `moderation_status`, queue status, and report reason filters.
- Image-analysis job status and media ownership filters.
- Audit log actor/module/time filters.

## Auth Provider Checklist

- Phone OTP remains disabled until a dedicated staging auth milestone.
- LINE Login remains disabled until redirect, callback, and account-linking rules are tested.
- Google remains secondary and must not replace phone recovery planning.
- Guest mode remains available.
- Guest-to-cloud sync requires consent and authenticated ownership.

## Storage Bucket Checklist

- Private plant image bucket planned for staging.
- Signed URL and thumbnail policy reviewed.
- Deletion/retention policy documented.
- Image moderation/escalation path documented.
- No storage upload is enabled before bucket RLS is tested.

## Edge Function And Service-Role Boundary Checklist

- No service-role key in frontend.
- Edge Functions validate `auth.uid()`, role, consent, idempotency, and rate limits.
- Guest sync merge, AI credit mutation, admin review actions, crop price imports, and moderation decisions are backend-owned.
- Provider/API secrets stay server-side.

## M26 Connection Dry-Run Checklist

- `VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=false` by default.
- With no `.env.local`, the app remains local-only.
- If staging URL and anon key are configured, dry-run checks client readiness only.
- No auth session is required.
- No private/user-owned tables are queried.
- No insert/update/delete/upsert is allowed.
- Optional future probe may read only `public_readiness_checks` or another reviewed public/read-only target.
- If that target does not exist, show `schema_not_applied_yet` and continue safely.

## M27 SQL/RLS Execution Checklist

- Open `/app/supabase-sql-checklist` before touching the Supabase SQL editor.
- Confirm the target project is staging, not production.
- Review `docs/SUPABASE_SQL_STAGING_EXECUTION_GUIDE.md`.
- Use `docs/SUPABASE_MANUAL_VERIFICATION_PACK.md` as the sign-off checklist.
- Run `supabase/migrations/0001_kasethub_core_schema.sql` first.
- Run `supabase/policies/0001_kasethub_rls_policies.sql` second.
- Verify tables, triggers, RLS, policies, indexes, and constraints manually in the Supabase dashboard.
- Keep auth, cloud sync, Edge Functions, storage uploads, and service-role frontend access disabled.
- Stop if the SQL editor target, project name, or environment is unclear.

## M28 Phone OTP Staging Checklist

- Open `/app/auth/phone-staging` before configuring phone OTP in Supabase.
- Keep `VITE_ENABLE_AUTH=false` and `VITE_ENABLE_PHONE_AUTH=false` until a controlled staging test.
- Configure Auth redirect URLs before any real OTP test.
- Configure SMS provider cost guards, resend cooldown, max attempts, and lockouts.
- Use private test phone numbers only.
- Verify session ownership with `auth.uid()` and RLS before any write.
- Keep `VITE_ENABLE_CLOUD_SYNC=false` until ownership and consent checks pass.
- Never expose service-role keys or SMS provider secrets in frontend.

## Cost And Rate-Limit Checklist

- Phone/SMS retry limits.
- LINE/OAuth abuse limits.
- AI request credit validation and provider budget caps.
- Image upload size and storage lifecycle limits.
- Crop price import rate and stale-source controls.
- Community report abuse and spam controls.

## Staging-To-Production Promotion Checklist

- SQL migration applied and reviewed on staging.
- RLS tested with anon, authenticated owner, different authenticated user, moderator, admin, and service-role job contexts.
- Backup and rollback practiced.
- Admin roles enforced server-side.
- Audit logs append-only.
- Secrets reviewed.
- Cloudflare Pages staging variables separated from production.
- Manual QA route check passed for `/app/supabase-readiness`, `/app/admin`, `/app/account-preview`, `/app/qa`, `/app/profile`, and `/app/memory`.
- Manual QA route check passed for `/app/supabase-connection` before enabling any network probe.
- Manual QA route check passed for `/app/supabase-sql-checklist` before any staging SQL is run.
- Manual QA route check passed for `/app/auth/phone-staging` before any real OTP test.
- Manual QA route check passed for `/app/guest-sync-edge` before any Guest Sync Edge Function is deployed or called.

## M29 Guest Sync Edge Function Readiness

M29 adds a local-only readiness surface for the future `guest-memory-sync` Supabase Edge Function.

Checklist additions:

- `VITE_ENABLE_GUEST_SYNC_EDGE=false` remains the default.
- `VITE_GUEST_SYNC_EDGE_MODE=disabled` remains the default.
- `/app/guest-sync-edge` must state that no endpoint has been deployed or called.
- service-role key remains server-side only and never appears in frontend env.
- Cloud sync remains disabled until phone auth session ownership, SQL/RLS, idempotency, audit logs, and rollback tests pass on staging.
- `docs/GUEST_SYNC_EDGE_FUNCTION_CONTRACT.md` and `docs/GUEST_SYNC_STAGING_TEST_PLAN.md` must be reviewed before any implementation.

## M30 Internal MVP Snapshot Relationship

M30 adds `/app/mvp-snapshot` as the broad prototype readiness layer above the Supabase-specific readiness pages. Supabase remains documentation/checklist/dry-run only, while the MVP snapshot makes it visible that Auth/Account/Sync and Supabase/Staging are not production-ready.

Manual QA additions:

- `/app/mvp-snapshot` must render without `.env.local`.
- `/app/mvp-snapshot` must say the product is still an Internal MVP / Prototype and not a Production App.
- The snapshot must not perform Supabase network checks, migrations, writes, auth calls, storage uploads, or Edge Function calls.
