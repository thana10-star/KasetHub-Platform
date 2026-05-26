# M114 Community Staging Write Flag Enablement

Status: owner-run staging guide only. Do not use this to enable production writes.

## Safety Position

- Default remains `VITE_ENABLE_COMMUNITY_WRITES=false`.
- Production must stay false until the owner explicitly approves a later public-write milestone.
- The flag only enables the UI/service path. Supabase RLS remains the real security boundary.
- Frontend must use only the public anon key. Do not add service-role keys to any frontend environment.

## Before Enabling The Flag

1. Confirm the app is connected to the staging Supabase project, not production.
2. Confirm M113 two-user RLS/storage evidence passed.
3. Confirm `community_posts`, `community_comments`, `community_likes`, `community_reports`, and `community_notifications` exist in staging.
4. Confirm RLS is enabled on all five community tables.
5. Confirm the `community-post-images` bucket exists in staging.
6. Confirm bucket public read is acceptable for staging community images.
7. Confirm the bucket file size limit is about 3MB.
8. Confirm accepted MIME types are `image/jpeg`, `image/png`, and `image/webp`.
9. Confirm staging has two real test accounts: User A and User B.

## Enable Staging/Preview Only

1. Open the staging or preview deployment environment settings.
2. Set:

```env
VITE_ENABLE_COMMUNITY_WRITES=true
```

3. Do not set this value in production.
4. Redeploy only the staging/preview app.
5. Open `/app/community`.
6. Confirm the page says staging write testing is enabled.
7. Sign in as User A.
8. Create a text post.
9. Create a post with one valid image.
10. Sign out, then sign in as User B.
11. Read User A's post.
12. Comment, like, unlike, and report User A's post.
13. Confirm User B cannot edit, hide, delete, overwrite, or remove User A content or image.
14. If any check fails, set `VITE_ENABLE_COMMUNITY_WRITES=false` and redeploy staging.

## Rollback

1. Set staging/preview `VITE_ENABLE_COMMUNITY_WRITES=false`.
2. Redeploy staging/preview.
3. Confirm `/app/community` returns to read/share/gated mode.
4. Record the issue before continuing.

## Production Rule

Production remains disabled after M114. Public community writes require a later owner-approved milestone after staging UI evidence is captured.
