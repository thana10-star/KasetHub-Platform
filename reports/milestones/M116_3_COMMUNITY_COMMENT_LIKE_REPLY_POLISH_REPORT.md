# M116.3 Community Comment Like + One-Level Reply Polish Report

Date: 2026-05-26

## 1. Summary

M116.3 adds V1-scoped comment interaction polish for staging Community testing:

- Comment like/unlike service and UI behavior.
- One-level replies to top-level comments.
- Clear replying target UI.
- SQL/RLS draft for comment replies and comment likes.
- Regression coverage for comment-like state, reply grouping, gated service behavior, and Supabase adapter calls.

Production writes remain disabled by default through `VITE_ENABLE_COMMUNITY_WRITES=false`.

## 2. Files Created

- `supabase/sql/community_comment_replies_likes_m116_3.sql`
- `docs/community/COMMUNITY_COMMENT_REPLY_LIKE_M116_3.md`
- `reports/milestones/M116_3_COMMUNITY_COMMENT_LIKE_REPLY_POLISH_REPORT.md`

## 3. Files Modified

- `src/routes/CommunityPage.tsx`
- `src/routes/community-page-helpers.ts`
- `src/routes/CommunityPage.test.tsx`
- `src/routes/CommunityPage.interaction.test.tsx`
- `src/services/community/community-service.ts`
- `src/services/community/community-service.test.ts`
- `src/services/community/community.types.ts`
- `docs/community/COMMUNITY_REAL_FOUNDATION_M109.md`
- `docs/community/COMMUNITY_RLS_AND_MODERATION_PLAN_M109.md`
- `docs/community/COMMUNITY_PUBLIC_LAUNCH_DECISION_M116.md`
- `docs/community/COMMUNITY_STAGING_UI_DEFECT_TEST_M116_1.md`

## 4. Data Model / SQL Changes

The staging SQL draft adds:

- `community_comments.parent_comment_id`
- `community_comment_likes`
- Indexes for parent replies and comment-like lookup
- RLS for authenticated comment likes/unlikes
- Updated comment insert policy to allow only top-level replies on the same published post

The SQL is a staging pack and does not enable production writes.

## 5. Comment Like Behavior

Comments and replies now show `ถูกใจ` / `เลิกถูกใจ` with a real count. The UI updates after a successful service action and reconciles against a refreshed comment list without letting stale backend counts immediately erase the successful local action.

Duplicate comment likes are handled by the database unique key and treated as a safe already-liked result by the service.

## 6. Reply Behavior

Users can tap `ตอบกลับ` on a top-level comment. The UI shows `กำลังตอบกลับ <name>`, a `เขียนคำตอบ...` textarea, `ส่งคำตอบ`, and `ยกเลิก`.

Submitted replies appear indented under the parent comment.

## 7. One-Level Reply Boundary

Replies do not show another reply button. The service also blocks replies to replies before insert. The SQL insert policy checks that `parent_comment_id` points to a top-level published comment on the same post.

## 8. UI / Mobile Behavior

The comment area stays compact:

- Top-level comments remain full-width.
- Replies are indented with a left border.
- Reply target copy appears directly under the selected comment.
- Empty reply lists show `ยังไม่มีคำตอบ` only while replying.

Production safety is unchanged:

- `VITE_ENABLE_COMMUNITY_WRITES=false` remains the default in `.env.example`.
- The adapter still uses the Supabase anon client and RLS.
- No service-role key or anonymous write path was added.
- No fake comment likes or replies were added.

## 9. Tests / Checks Run

- `npm run lint` passed.
- `npm run build` passed.
- `npm run test` passed: 44 files, 378 tests.
- `git diff --check` passed.
- Browser route smoke passed:
  - `/app/community`
  - `/app/notifications`
  - `/app`
  - `/app/prices`
  - `/app/ai`
  - `/app/weather`
  - `/app/profile`

## 10. Owner Staging Retest Steps

1. Apply `supabase/sql/community_comment_replies_likes_m116_3.sql` to Supabase staging.
2. Keep `VITE_ENABLE_COMMUNITY_WRITES=true` only in staging/preview.
3. Login as User A through `/app/login`.
4. Open `/app/community`.
5. Create or use a real post with comments.
6. Tap `ตอบกลับ` on a top-level comment.
7. Confirm `กำลังตอบกลับ ...` appears under the correct comment.
8. Type Thai text, submit, and confirm the reply appears indented.
9. Confirm replies do not show another reply button.
10. Tap `ถูกใจ` / `เลิกถูกใจ` on a comment and verify the count changes.
11. Login as User B and repeat comment-like and reply checks.
12. Confirm production remains disabled.

## 11. Known Limitations

- Comment-like count depends on staging RLS allowing visible comment-like row reads. A future RPC/backend aggregate may be better before public launch.
- Backend-created in-app notifications for replies/comment likes are still deferred.
- Moderation/admin queue and rate limiting are still required before production launch.
- No infinite nested threads by design.

## 12. Next Recommended Milestone

M117 should apply and verify the M116.3 SQL in staging, then add backend-created in-app notifications for post likes, post comments, comment replies, and possibly comment likes only after the core comment polish passes owner retest.
