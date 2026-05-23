# Guest Sync Staging Test Plan

M29 prepares a manual staging test plan for the future `guest-memory-sync` Supabase Edge Function. Do not run this plan until a staging Supabase project, SQL/RLS, real auth session, and Edge Function implementation exist.

## Preconditions

- Staging Supabase project exists and is clearly not production.
- SQL schema has been run manually on staging.
- RLS policies have been run manually on staging.
- `/app/supabase-sql-checklist` has been used for manual verification.
- Supabase Auth phone OTP staging is configured and tested with a safe test user.
- Test user is authenticated with a valid Supabase session.
- `auth.uid()` ownership checks are understood and verified.
- `guest-memory-sync` Edge Function is deployed only to staging.
- Service-role key is configured only as an Edge Function secret.
- `VITE_ENABLE_CLOUD_SYNC=false` remains off until the specific test window.
- Rollback/cleanup owner is assigned.

## Test Case 1: Saved Items Only

1. Use a guest profile with saved articles/videos and no My Farm records.
2. Consent to saved items only.
3. Send a single sync request with a new idempotency key.
4. Verify saved rows are created for the authenticated user only.
5. Verify local Guest Memory is preserved.

Expected result: saved items sync, other sections skipped.

## Test Case 2: Saved Items + My Farm

1. Use a guest profile with saved items and farm records.
2. Consent to saved items and My Farm.
3. Send one request.
4. Verify saved rows and farm rows are created for the authenticated user.
5. Verify no rows are created for another user.

Expected result: both sections sync with owner id from session.

## Test Case 3: AI History Not Consented

1. Use a guest profile with recent AI questions.
2. Leave AI history consent off.
3. Send request.
4. Verify AI history rows are skipped.
5. Verify response explains the skipped section.

Expected result: AI history skipped, no failure.

## Test Case 4: Duplicate Saved Item Merge

1. Create an existing saved item in staging for the same user.
2. Send guest payload containing the same `itemType + itemId`.
3. Verify the duplicate is merged or ignored safely.
4. Verify no duplicate saved row appears.

Expected result: duplicate count appears in merge summary.

## Test Case 5: Partial Success

1. Use a payload where one section is valid and one section is intentionally invalid.
2. Send request with a new idempotency key.
3. Verify valid section result and rejected/skipped section.
4. Verify local Guest Memory is preserved.
5. Verify audit log captures partial status.

Expected result: `partial_success` or `rejected` with clear per-section counts.

## Test Case 6: Retry Same Idempotency Key

1. Send a valid sync request.
2. Retry the same request with the same idempotency key.
3. Verify no new duplicate rows are created.
4. Verify response returns original result or safe no-op.

Expected result: idempotent retry.

## Test Case 7: Auth Missing Rejection

1. Send the request without a valid Supabase session.
2. Verify request is rejected.
3. Verify no rows are created.
4. Verify no service-role behavior is exposed to the browser.

Expected result: `rejected`.

## Test Case 8: Invalid Payload Rejection

1. Send unsupported payload version or malformed records.
2. Verify validation failure.
3. Verify no rows are created.
4. Verify audit/error log captures the rejection without storing sensitive payloads unnecessarily.

Expected result: `rejected` with validation errors.

## Test Case 9: Rollback / Manual Cleanup

1. Capture user id, guest id, sync run id, and idempotency key.
2. Identify rows created by the test.
3. Perform staging cleanup with admin-approved SQL or dashboard workflow.
4. Verify rows are removed or marked as test cleanup according to policy.
5. Keep local Guest Memory unchanged.

Expected result: staging can be cleaned without impacting production or other users.

## Verification Checklist

- Local Guest Memory preserved after success, partial success, rejection, and retry.
- Cloud rows created only for the authenticated owner.
- Duplicate rows avoided.
- Sync event logged with `syncRunId`.
- Idempotency key can be replayed safely.
- Consent snapshot is respected.
- AI history is skipped when not consented.
- Auth missing request is rejected.
- Invalid payload is rejected.
- No service-role key appears in frontend env, browser devtools, logs, screenshots, or repository.
- `VITE_ENABLE_CLOUD_SYNC` is returned to `false` after staging test window.

## Stop Conditions

Stop immediately if:

- You are in a production Supabase project.
- A service-role key is visible in frontend code or public env.
- RLS ownership checks are uncertain.
- Test user identity is unclear.
- Duplicate rows are created unexpectedly.
- Local Guest Memory is modified before confirmed server success.
- Any request writes data without a verified Supabase session.
