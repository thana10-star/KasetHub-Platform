# M112 Community Two-User RLS Test

Status: owner-side staging test guide. Use only the staging Supabase project and temporary test accounts.

Do not use production. Do not use service-role keys in frontend env, browser tests, screenshots, or reports.

M113 status: owner manual smoke output passed the core User A/User B checks listed below. Evidence is recorded in `docs/community/COMMUNITY_TWO_USER_EVIDENCE_STATUS_M113.md`.

## Test Accounts

1. Create or sign in User A in staging.
2. Create or sign in User B in staging.
3. Record both user UUIDs in a private owner note.
4. Use masked IDs in reports or screenshots.

User A UUID:

User B UUID:

## Post Ownership

1. User A creates a post in `community_posts`.
2. Confirm the inserted row has `author_user_id = User A UUID`.
3. User B reads the published post.
4. User B attempts to update User A's post content or status.
5. Expected: User B cannot update User A's post.
6. User B attempts to delete User A's post.
7. Expected: User B cannot delete User A's post.

Result: pass / fail / blocked

Notes:

## Comments

1. User B comments on User A's published post.
2. Confirm the inserted row has `author_user_id = User B UUID`.
3. User A reads User B's published comment.
4. User B hides or deletes User B's own comment.
5. Expected: User B can hide/delete own comment if the staging policy allows the chosen action.
6. User A attempts to delete User B's comment.
7. Expected: User A cannot delete User B's comment unless a future moderator role is added.

Result: pass / fail / blocked

Notes:

## Likes

1. User B likes User A's post.
2. Confirm one row exists in `community_likes` for `(post_id, User B UUID)`.
3. User B attempts to like the same post again.
4. Expected: duplicate like is blocked by the primary key or handled idempotently by the future app service.
5. User B unlikes own like.
6. Expected: User B can delete only User B's own like.

Result: pass / fail / blocked

Notes:

## Anonymous Writes

1. Use an unauthenticated/anonymous session.
2. Attempt to insert a post.
3. Attempt to insert a comment.
4. Attempt to insert a like.
5. Attempt to insert a report.
6. Expected: all anonymous inserts fail.

Result: pass / fail / blocked

Notes:

## Reports

1. User B reports User A's post.
2. Confirm the inserted row has `reporter_user_id = User B UUID`.
3. User B reads own report if the own-report select policy is retained.
4. User A attempts to list reports.
5. Expected: User A cannot see User B's report.
6. Confirm normal users cannot list all reports.

Result: pass / fail / blocked

Notes:

## Notifications

1. Insert or seed a staging notification for User A through an owner-approved backend or SQL dashboard test path.
2. User A reads notifications.
3. Expected: User A can see only notifications where `recipient_user_id = User A UUID`.
4. User B reads notifications.
5. Expected: User B cannot see User A notifications.
6. User B attempts browser/client notification insert.
7. Expected: browser/client notification insert fails because M112 has no safe client-created notification path.

Result: pass / fail / blocked

Notes:

## Storage

1. User A uploads an image to `community-post-images/UserA_UUID/PostId/filename.jpg`.
2. Expected: upload to own folder works.
3. User B attempts to upload to `community-post-images/UserA_UUID/PostId/other.jpg`.
4. Expected: User B upload to User A folder fails.
5. User B attempts to overwrite or delete User A image.
6. Expected: User B cannot overwrite/delete User A image.
7. Upload `image/jpeg`, `image/png`, and `image/webp` test files.
8. Expected: allowed image types pass within the size limit.
9. Upload a wrong file type.
10. Expected: blocked by app/service validation and bucket settings where supported.
11. Upload an oversized file above about 3MB.
12. Expected: blocked by app/service validation and bucket settings where supported.

Result: pass / fail / blocked

Notes:

## Final Decision

- [ ] Two-user RLS checks passed.
- [ ] Storage checks passed.
- [ ] Anonymous writes failed.
- [ ] No service-role key was exposed.
- [ ] Notifications remain backend-needed unless a safe backend function is added.
- [ ] Owner approves staging-only `VITE_ENABLE_COMMUNITY_WRITES=true` for adapter testing.
- [ ] Keep production `VITE_ENABLE_COMMUNITY_WRITES=false`.

Overall result: pass / fail / blocked

M113 recorded result: pass for the owner-run core staging smoke test. Keep production writes disabled.
