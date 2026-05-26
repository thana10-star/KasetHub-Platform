# M110 Community Staging Verification

Status: manual staging checklist. The app does not apply SQL, create buckets, or enable public writes automatically.

## Before Starting

- Use the staging Supabase project only.
- Use frontend anon key only in local/Cloudflare public env.
- Do not copy service-role keys into Vite env, screenshots, reports, or frontend code.
- Keep `VITE_ENABLE_COMMUNITY_WRITES=false` until every check below passes.
- Use temporary test users with non-sensitive display names.

## Checklist

1. Apply `supabase/sql/community_v1_schema_m110.sql` to staging.
2. Confirm these tables exist: `community_posts`, `community_comments`, `community_likes`, `community_reports`, `community_notifications`.
3. Confirm RLS is enabled on all five tables.
4. Create two test users: User A and User B.
5. User A creates a post using only authenticated anon-client access.
6. User B can read User A's published post.
7. User B cannot edit, hide, delete, or change counts on User A's post.
8. User B creates a comment on User A's published post.
9. User A receives a reply notification only if a backend notification function exists; otherwise record backend-needed.
10. User B likes User A's post and cannot double-like because `(post_id, user_id)` is unique.
11. User A receives a like notification only if a backend notification function exists; otherwise record backend-needed.
12. User A can hide own post and it disappears from normal published feed.
13. User A can delete own post if deletion is accepted for staging.
14. User B can create a report for a post or comment.
15. Normal users cannot list all reports; each user can see only own report rows if that policy is retained.
16. Create bucket `community-post-images` from the SQL pack or dashboard settings.
17. Verify upload path is restricted to `community-post-images/{auth.uid()}/{post_id}/{filename}`.
18. Verify User B cannot upload into User A's folder.
19. Verify User A can delete an image in their own folder.
20. Verify wrong MIME types and files larger than 3MB are blocked by client validation and, where available, bucket limits.
21. Confirm no service-role key exists in frontend env, browser logs, screenshots, or repository files.
22. Confirm `/app/community` remains gated when `VITE_ENABLE_COMMUNITY_WRITES=false`.
23. Only after all ownership/RLS/storage checks pass, test `VITE_ENABLE_COMMUNITY_WRITES=true` in staging with test users.

## Pass Criteria

Community writes may move to the next milestone only when:

- User ownership is proven with real Supabase Auth users.
- Cross-user write attempts fail.
- Anonymous writes fail.
- Storage ownership and one-image policy are verified.
- Notification creation is backend-owned or explicitly kept gated.
- The frontend still contains no service-role key path.
