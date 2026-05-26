# M115 Community Staging UI Defect Test

Status: owner-executable retest checklist for staging only.

## Purpose

Use this checklist after deploying the M115 UI fix to staging with `VITE_ENABLE_COMMUNITY_WRITES=true`.

This test verifies two owner-reported defects:

- Like action succeeds but the visible count stays `0`.
- Clicking `คอมเมนต์` causes the app to blank/crash.

Production community writes must remain disabled unless the owner separately approves launch.

## User A Retest

- Sign in through `/app/login` with a real staging account.
- Open `/app/community`.
- Create a text post or use an existing real staging post.
- Confirm the post appears in the feed with no fake likes or fake comments.
- Click `Like`.
- Confirm the visible like count increases after the action succeeds.
- Click `เลิกไลก์`.
- Confirm the visible like count decreases and never becomes negative.
- Click `คอมเมนต์`.
- Confirm the app does not blank, disappear, or navigate away.
- Confirm a comment area opens under the post.
- Submit an empty comment.
- Confirm the UI shows a friendly validation message.
- Type a valid comment and submit.
- Confirm the comment appears or the page refreshes safely.
- Hide/delete User A's own post only if it is safe to remove the test data.

## User B Retest

- Sign in through `/app/login` with a second real staging account.
- Open `/app/community`.
- Confirm User B can read User A's published post.
- Click `คอมเมนต์`.
- Confirm no blank screen appears.
- Add a comment.
- Confirm the comment appears or the count refreshes safely.
- Click `Like`.
- Confirm the visible like count updates after success.
- Click `Like` again only if the button state still allows it.
- Confirm duplicate like does not create an extra visible count.
- Click `เลิกไลก์`.
- Confirm the visible like count decreases.
- Open report controls and submit one report reason if appropriate for staging test data.
- Confirm report shows a calm confirmation or safe error.

## Anonymous Retest

- Sign out through `/app/login` or `/app/profile`.
- Open `/app/community`.
- Confirm published posts are readable only if staging policy allows it.
- Confirm comment and like actions show the sign-in requirement.
- Confirm clicking comment does not crash the app.

## Expected Stable UI

- Like counts reflect real successful service actions or a refreshed backend read.
- Duplicate likes do not double-count.
- Comment sections tolerate empty comment arrays and service errors.
- Null author display names render as `ผู้ใช้ KasetHub`.
- Image paths render through the existing public bucket URL path when present.
- No fake posts, fake comments, fake names, or fake engagement counts are introduced.
- Notifications remain backend-needed and are not faked.

## If The Issue Remains

- Capture a screenshot of `/app/community`.
- Record the signed-in account used for testing, without passwords.
- Record whether the action was User A, User B, or anonymous.
- Record the post ID if visible in Supabase staging.
- Disable `VITE_ENABLE_COMMUNITY_WRITES` in staging if the UI becomes unstable.
