# M113 Community Two-User Evidence + Staging Write Gate Report

## Summary

M113 records the owner-provided two-user staging RLS/storage evidence as passed and adds a narrow Supabase community write adapter behind `VITE_ENABLE_COMMUNITY_WRITES=true`. The default remains false, production writes remain disabled, and the frontend continues to use only the Supabase anon client with RLS.

## 1. Was Owner Two-User Evidence Provided?

Yes.

Evidence source: owner-run `scripts/manual/community-rls-smoke.mjs` output using the staging anon key and real staging User A/User B accounts.

Evidence IDs:

- Post ID: `e23619b4-0cc4-4c6c-8732-57720382f93e`
- Comment ID: `dd669388-a442-48b1-9a94-29779031089b`

Recorded in `docs/community/COMMUNITY_TWO_USER_EVIDENCE_STATUS_M113.md`.

## 2. Which Checks Passed?

Owner evidence passed:

- User A can create own post.
- User B can read User A published post.
- User B cannot update User A post.
- User A post content was not changed by User B.
- User B cannot delete User A post.
- User A post still exists after User B delete attempt.
- User B can comment on User A post.
- User A cannot delete User B comment.
- User B comment still exists after User A delete attempt.
- User B can like User A post.
- User B duplicate like fails or is blocked by unique constraint.
- User B can unlike own like.
- Anonymous cannot create post.
- User B can report User A post.
- User B can read own report.
- User A cannot list User B report.
- Anonymous cannot report.
- User A can upload image to own folder.
- User B cannot delete User A image.
- User B cannot upload into User A folder.
- Wrong file type is blocked.

## 3. Was Staging Write Adapter Implemented?

Yes, service-level adapter only.

Implemented in `src/services/community/community-service.ts`:

- `listPosts()` reads published posts from `community_posts`.
- `createPost()` requires flag + real Supabase user, optionally uploads one image, then inserts own post.
- `createComment()` requires flag + real Supabase user and inserts own comment.
- `likePost()` requires flag + real Supabase user and treats duplicate-like errors as already liked.
- `unlikePost()` deletes own like.
- `reportPost()` and `reportComment()` insert own reports.
- `hideOwnPost()` and `deleteOwnPost()` update own status to `hidden` or `deleted`.
- `hideOwnComment()` updates own comment status to `hidden`.

Implemented in `src/services/community/community-storage-service.ts`:

- validates JPG/PNG/WebP
- validates 3MB max
- uploads to `{user_id}/{post_id}/{filename}`
- stores path/metadata only

## 4. What Remains Behind Feature Flag?

All write operations remain behind `VITE_ENABLE_COMMUNITY_WRITES=true` and a real authenticated Supabase user session.

Default remains:

```text
VITE_ENABLE_COMMUNITY_WRITES=false
```

## 5. Is Production Still Disabled?

Yes.

No production env was changed. No `.env.local` or secret file was created or committed. Production must remain false until an owner-approved public launch milestone.

## 6. Is Service-Role Absent From Frontend?

Yes.

No service-role key path was added. The adapter uses the existing frontend Supabase anon client and relies on RLS.

## 7. Is Storage Safe?

Staging owner evidence passed the core storage checks:

- own-folder upload works
- cross-user delete fails
- cross-user upload fails
- wrong file type is blocked

The app adapter also validates allowed MIME types and 3MB max before upload.

## 8. Are Notifications Still Backend-Needed?

Yes.

M113 does not create like/reply notifications from the browser. Notification creation remains backend-needed because it must verify actor, recipient, target post/comment ownership, idempotency, and rate limits.

## 9. Can Staging Set `VITE_ENABLE_COMMUNITY_WRITES=true` For Controlled Testing?

Yes, for staging only, if the owner approves.

Production must remain false. The staging test must use real staging users, anon client only, and no service-role key in frontend env.

## 10. Tests/Checks Run

- `npm run lint` passed.
- `npm run build` passed, with the existing non-blocking large chunk warning.
- `npm run test` passed: 42 files, 355 tests.
- `git diff --check` passed with line-ending warnings only.
- Route smoke passed in the in-app browser for `/app/community`, `/app/notifications`, `/app`, `/app/prices`, `/app/ai`, `/app/weather`, and `/app/profile`.
- Route smoke confirmed `/app/community` keeps the gated copy and does not show fake community activity.

## 11. Next Recommended Milestone

M114 should run controlled staging app-level write testing with `VITE_ENABLE_COMMUNITY_WRITES=true` in staging only. It should verify real UI/service posting, commenting, like/unlike, reporting, own hide/delete, and one-image upload through the adapter, while production remains disabled.

## Files Created/Modified

Created:

- `docs/community/COMMUNITY_TWO_USER_EVIDENCE_STATUS_M113.md`
- `reports/milestones/M113_COMMUNITY_TWO_USER_EVIDENCE_STAGING_WRITE_GATE_REPORT.md`

Modified:

- `docs/community/COMMUNITY_STAGING_EXECUTION_WORKSHEET_M111.md`
- `docs/community/COMMUNITY_TWO_USER_RLS_TEST_M112.md`
- `docs/community/COMMUNITY_WRITE_ADAPTER_READINESS_M112.md`
- `docs/community/COMMUNITY_STAGING_APPLIED_STATUS_M112.md`
- `docs/community/COMMUNITY_BACKEND_BLOCKERS_M109.md`
- `src/services/community/community.types.ts`
- `src/services/community/community-service.ts`
- `src/services/community/community-storage-service.ts`
- `src/services/community/community-service.test.ts`
