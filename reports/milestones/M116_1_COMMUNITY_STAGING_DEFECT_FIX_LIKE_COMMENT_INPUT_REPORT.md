# M116.1 Community Staging Defect Fix: Like Count + Comment Input Report

Date: 2026-05-26

## 1. Summary

M116.1 applies a narrow fix for the owner-reported staging Community defects:

- Like count still appeared stale after a successful like.
- Typing into the comment textarea could blank/crash the app.

Production writes remain controlled by `VITE_ENABLE_COMMUNITY_WRITES=false` by default. No service-role key, anonymous writes, fake posts, fake comments, fake likes, push notifications, chat, follow system, GPS, or extra image support were added.

## 2. Owner-Reported Defects

- Login works.
- Creating a post works.
- Clicking Like appears to work, but the visible count stays `0`.
- Opening comments may work, but typing in the comment box can blank the app.
- Refresh restores the app until typing in the comment box again.

## 3. Root Cause Found

The code already had the first M115 guard, but the real browser behavior still pointed at two fragile areas:

- Comment textarea value handling still depended on React event shape enough that a real input path could fail.
- Like refresh could still let stale backend data compete with the successful local action too soon.

M116.1 makes both paths more defensive.

## 4. Comment Input Crash Fix

- Added a small `getTextInputValue()` helper that reads from `event.target` and returns a plain string.
- Routed comment textarea typing through `handleCommentTextChange(postId, value)`.
- Added both `onChange` and `onInput` handlers for the controlled textarea.
- Added empty/missing post ID guards for comment loading, typing, and submitting.
- Kept empty submit validation and service error handling visible instead of allowing render crashes.

## 5. Like Count Fix

- Like/unlike now applies the successful local UI count immediately after the service action succeeds.
- Backend refresh runs in the background instead of blocking the visible state update.
- Reconciliation preserves the action-derived count if refreshed backend rows are stale or omit the target post.
- `listPosts()` skips like-row queries when there are no valid post IDs.
- Added `docs/community/COMMUNITY_LIKE_COUNT_STRATEGY_M116_1.md` documenting why staging should not rely only on `community_posts.like_count`.

## 6. Tests Added

Added regression coverage for:

- Typing Thai text into the comment textarea.
- Keeping the page rendered while typing.
- Preserving the controlled textarea value.
- Empty comment validation.
- Friendly comment service error handling.
- Like count changing from `Like 0` to `เลิกไลก์ 1`.
- Stale backend refresh returning `likeCount: 0` without reverting a successful like.
- Preserving the locally updated post if a refresh omits it.

## 7. Verification Run

- `npm run test -- CommunityPage.interaction CommunityPage community-service` passed: 27 tests.
- `npm run lint` passed.
- `npm run build` passed with the existing large chunk warning.
- `npm run test` passed: 44 files, 371 tests.
- Route smoke passed on KasetHub local dev server at port 5174:
  - `/app/community`
  - `/app/notifications`
  - `/app`
  - `/app/prices`
  - `/app/ai`
  - `/app/weather`
  - `/app/profile`
- Browser route smoke showed no blank roots and no console errors.

Note: port 5173 was already serving another local app, so route smoke was rerun on port 5174 for this workspace.

## 8. Owner Retest Steps

Use `docs/community/COMMUNITY_STAGING_UI_DEFECT_TEST_M116_1.md`.

Core steps:

1. Login User A.
2. Open `/app/community`.
3. Click Like.
4. Confirm like count changes.
5. Click Unlike.
6. Confirm count changes back.
7. Click Comment.
8. Type Thai text into the comment box.
9. Confirm the page does not blank.
10. Submit comment.
11. Login User B and repeat comment, like, unlike, and report.

## 9. Known Limitations

- Real staging writes still require staging env with `VITE_ENABLE_COMMUNITY_WRITES=true` and real Supabase Auth.
- Production remains disabled by default.
- Backend-created like/reply notifications remain deferred.
- A backend-owned count strategy is still recommended before public production launch.
- Owner staging redeploy/retest is still required to close the blocker.

## 10. Next Recommended Milestone

After owner redeploys and retests M116.1, either:

- close the staging UI write blocker if like/comment typing pass, or
- open a focused M116.2 defect milestone with the exact browser console error and affected post/comment IDs.
