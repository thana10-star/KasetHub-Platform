# M116.4 Community Comment Submit Gate Fix Report

Date: 2026-05-26

## 1. Summary

M116.4 fixes the top-level comment submit path for authenticated staging users with `VITE_ENABLE_COMMUNITY_WRITES=true`.

The change is intentionally narrow:

- Normal comments submit through a dedicated form path.
- Normal comments explicitly insert `parent_comment_id = null`.
- Comment errors/success appear beside the comment box.
- Reply behavior from M116.3 is preserved.

Production writes remain disabled by default.

## 2. Root Cause

The top-level comment UI had a loose button click path and surfaced failures only through the shared page action status near the composer. In staging, a failed or gated submit could look like the button did nothing. After M116.3 introduced `parent_comment_id`, the service also did not explicitly mark normal comments as top-level.

## 3. Top-Level Comment Submit Fix

- Added a real submit form around the top-level comment textarea and button.
- Added per-post submit status inside the comment panel.
- Added per-post submitting state so the button disables only while sending.
- Kept empty comment validation as `กรุณาเขียนคอมเมนต์`.
- Updated `createComment` to insert `parent_comment_id: null` for normal comments.
- Added a legacy fallback if a non-upgraded environment does not have `parent_comment_id`.

## 4. Reply Flow Preservation

Replies still use the separate `createReply(postId, parentCommentId, input)` path.

Normal comments do not require `parentCommentId`. Replies do require a selected top-level parent comment.

## 5. Tests Added

- Top-level comment submit gate helper allows flag/auth/post-id staging writes.
- Top-level comment submit gate blocks disabled writes, missing post id, and in-flight submit.
- `createComment` service test now verifies `parent_comment_id: null`.
- Existing reply/comment-like tests remain passing.

## 6. Checks Run

- `npm run lint` passed.
- `npm run build` passed.
- `npm run test` passed: 44 files, 379 tests.
- `git diff --check` passed.
- Browser route smoke passed:
  - `/app/community`
  - `/app/notifications`
  - `/app`
  - `/app/prices`
  - `/app/ai`
  - `/app/weather`
  - `/app/profile`

## 7. Owner Retest Steps

1. Login User A.
2. Open `/app/community`.
3. Open comments under a real post.
4. Type a normal top-level comment.
5. Confirm `ส่งคอมเมนต์` is enabled.
6. Submit the comment.
7. Confirm the comment appears or a friendly error appears in the comment panel.
8. Reply to a top-level comment.
9. Confirm the reply appears under the correct comment.
10. Login User B and repeat comment/reply/like/report.

## 8. Known Limitations

- Browser-created notifications remain deferred.
- Public launch still needs moderation/admin queue and rate limiting.
- No fake comments are added.

## 9. Next Recommended Milestone

M117 should verify the M116.4 staging retest, then proceed to backend-created in-app notifications only after top-level comments and replies are stable for User A/User B.
