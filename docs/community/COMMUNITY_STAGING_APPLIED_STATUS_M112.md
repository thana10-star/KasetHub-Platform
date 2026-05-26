# M112 Community Staging Applied Status

Status: owner-confirmed from Supabase staging screenshots. Codex did not apply SQL directly.

M113 update: owner manual smoke output passed the core two-user RLS/storage checks. See `docs/community/COMMUNITY_TWO_USER_EVIDENCE_STATUS_M113.md`.

## Owner-Confirmed Staging State

- SQL applied in staging: owner-confirmed.
- `community_posts` exists with the M110 schema: owner-confirmed.
- `community_comments` exists with the M110 schema: owner-confirmed.
- `community_likes` exists with the M110 schema: owner-confirmed.
- `community_reports` exists with the M110 schema: owner-confirmed.
- `community_notifications` exists with the M110 schema: owner-confirmed.
- RLS enabled on all five community tables: owner-confirmed.
- RLS policies exist for posts, comments, likes, reports, and notifications: owner-confirmed.
- Storage bucket `community-post-images` exists: owner-confirmed.
- Bucket `public=true`: owner-confirmed.
- Bucket file size limit is about 3MB: owner-confirmed.
- Accepted image MIME types include `image/jpeg`, `image/png`, and `image/webp`: owner-confirmed.

## Remaining Before Write UI

- Run two-user auth/RLS tests with real staging User A and User B.
- Verify anonymous inserts fail.
- Verify cross-user update/delete attempts fail.
- Verify duplicate like behavior.
- Verify report visibility is not broadly listable.
- Verify notification read access is owner-only.
- Verify storage upload to own folder works.
- Verify storage upload/delete against another user folder fails.
- Verify wrong image type and oversized image behavior.
- Add or approve a narrow app write adapter only after the two-user checks pass.

## Current App Decision

`VITE_ENABLE_COMMUNITY_WRITES=false` remains the default. The app continues to render Community in read/share/gated mode with no fake posts, fake likes, fake comments, or fake notifications.
