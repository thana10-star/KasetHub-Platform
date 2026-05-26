# M111 Community Staging Execution Worksheet

Status: owner-executable worksheet. Use staging only. Do not enable public community writes until every required check passes.

M113 status: owner-run `scripts/manual/community-rls-smoke.mjs` passed the core two-user RLS/storage checks in Supabase staging. See `docs/community/COMMUNITY_TWO_USER_EVIDENCE_STATUS_M113.md`. Production writes remain disabled.

## 1. Before Applying SQL

- [ ] Confirm the Supabase project is the staging project, not production.
- [ ] Confirm the project reference/name shown in Supabase Dashboard matches the intended staging project.
- [ ] Confirm any needed staging backup/export has been taken.
- [ ] Confirm frontend env uses only the Supabase public anon key.
- [ ] Confirm no service-role key is present in `.env.local`, Cloudflare public variables, browser logs, screenshots, or repository files.
- [ ] Confirm `VITE_ENABLE_COMMUNITY_WRITES=false` remains the default.
- [ ] Confirm two test accounts are ready: User A and User B.
- [ ] Confirm test accounts do not use real sensitive personal data in display names, posts, comments, reports, or images.

Notes:

- Staging project:
- Operator:
- Date/time:
- Backup/export location, if any:
- User A masked ID:
- User B masked ID:

## 2. Apply SQL

- [ ] Open Supabase Dashboard.
- [ ] Select the staging project.
- [ ] Open SQL Editor.
- [ ] Paste the full contents of `supabase/sql/community_v1_schema_m110.sql`.
- [ ] Run the SQL.
- [ ] Record run timestamp.
- [ ] Record any errors exactly enough to debug without exposing secrets.

SQL run timestamp:

Errors or warnings:

Result: pass / fail / blocked

## 3. Verify Tables

Confirm these tables exist in `public`:

- [ ] `community_posts`
- [ ] `community_comments`
- [ ] `community_likes`
- [ ] `community_reports`
- [ ] `community_notifications`

Result: pass / fail / blocked

Notes:

## 4. Verify RLS Enabled

- [ ] `community_posts` has RLS enabled.
- [ ] `community_comments` has RLS enabled.
- [ ] `community_likes` has RLS enabled.
- [ ] `community_reports` has RLS enabled.
- [ ] `community_notifications` has RLS enabled.
- [ ] Policies exist for published reads, own inserts, own updates/deletes, own reports, and own notifications.
- [ ] No normal-user policy allows editing another user's rows.
- [ ] No anonymous insert/update/delete policy exists.

Result: pass / fail / blocked

Notes:

## 5. Verify Storage

- [ ] Bucket `community-post-images` exists.
- [ ] Bucket policy matches path convention `{user_id}/{post_id}/{filename}`.
- [ ] Authenticated users can upload only into their own first folder segment.
- [ ] Authenticated users can delete only their own image paths.
- [ ] Anonymous users cannot upload.
- [ ] Accepted MIME types are documented: `image/jpeg`, `image/png`, `image/webp`.
- [ ] Max size is documented: 3MB.
- [ ] If Supabase bucket limits do not enforce type/size in this project, record that client/service validation remains required.

Result: pass / fail / blocked

Notes:

## 6. Two-User Verification

Use User A and User B with real staging Supabase Auth sessions.

- [ ] User A creates a post.
- [ ] User B can read User A's published post.
- [ ] User B cannot update User A's post.
- [ ] User B cannot delete User A's post.
- [ ] User B comments on User A's published post.
- [ ] User A can read User B's published comment.
- [ ] User B can hide/delete User B's own comment.
- [ ] User A cannot delete User B's comment unless a future moderator role is added.
- [ ] User B likes User A's post.
- [ ] Duplicate like by User B fails through the unique key or is handled idempotently by the future service.
- [ ] User B can unlike User B's own like.
- [ ] Anonymous post insert fails.
- [ ] Anonymous comment insert fails.
- [ ] Anonymous like insert fails.
- [ ] Report insert works for an authenticated user.
- [ ] Normal users cannot list all reports.
- [ ] User can read only own report rows if the own-report select policy is retained.
- [ ] User can read only own notifications.
- [ ] User cannot create arbitrary notifications from the browser.

Result: pass / fail / blocked

Notes:

## 7. Storage Verification

- [ ] User A uploads image path `USER_A_UUID/POST_ID/filename.jpg`.
- [ ] User B cannot overwrite User A's image path.
- [ ] User B cannot delete User A's image path.
- [ ] User A can delete User A's own image path.
- [ ] Wrong file type is blocked by client/service validation.
- [ ] Oversized file is blocked by client/service validation.
- [ ] Staging bucket type/size limits are verified where Supabase supports them.

Result: pass / fail / blocked

Notes:

## 8. Result

Overall result: pass / fail / blocked

M113 recorded result: pass for core staging RLS/storage smoke test.

Decision:

- [ ] Keep `VITE_ENABLE_COMMUNITY_WRITES=false`.
- [ ] Allow staging-only `VITE_ENABLE_COMMUNITY_WRITES=true` for the next controlled service test.
- [ ] Blocked; fix SQL/RLS/storage/auth before M112.

Final notes:
