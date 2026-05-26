# M115 Community Staging UI Defect Fix: Like Count + Comment Crash Report

Date: 2026-05-26

## 1. Summary

M115 fixes the owner-reported staging Community defects:

- Like/unlike now updates the visible like count after a successful service action.
- Clicking `คอมเมนต์` no longer crashes or blanks the app.
- Comment sections now open with safe empty/error states and a guarded comment form.

Production remains controlled by `VITE_ENABLE_COMMUNITY_WRITES=false` by default. No service-role keys, anonymous writes, fake posts, fake comments, or fake counts were added.

## 2. Defects Reproduced/Found

- Like count could remain at `0` because the UI depended on a refreshed post row whose stored `like_count` may be stale in staging.
- Comment input could crash because `event.currentTarget.value` was read inside a deferred state updater. React can clear `currentTarget` before that updater runs.
- Report reason selection used the same fragile event pattern and was hardened at the same time.
- Comment loading errors could throw through the UI path instead of leaving the post card usable.

## 3. Like Count Fix Behavior

- Like/unlike handlers now update local post state only after `likePost` or `unlikePost` returns success.
- The UI increments on successful like, decrements on successful unlike, and clamps at zero.
- Duplicate-like state does not double count.
- After a successful action, the feed refreshes from the backend.
- If the backend refresh returns a stale counter, the UI reconciles with the successful local action instead of reverting to `0`.
- `listPosts()` now aggregates readable `community_likes` rows for authenticated staging users when policy permits, so real like rows can display even when the denormalized post counter is stale.

## 4. Comment Crash Fix Behavior

- Clicking `คอมเมนต์` opens an inline comment section under the post.
- `listComments()` failures are caught and shown as a friendly message while the page stays usable.
- Empty comment submit shows `กรุณาเขียนคอมเมนต์`.
- Valid comment submit calls the community service, appends the returned real comment, clears the textarea, and refreshes posts safely.
- Comment arrays are normalized before rendering so `undefined`, `null`, and empty lists do not crash.

## 5. Service Shape Fixes

- Post mapping tolerates nullable author, image, count, date, category, and status fields.
- Comment mapping tolerates nullable author, count, date, and status fields.
- Null author display names still render as `ผู้ใช้ KasetHub`.
- Empty `listPosts()` returns remain a real empty state, not seeded/fake feed data.

## 6. UI/Error Handling Behavior

- Community async handlers now catch service exceptions and show user-facing status messages.
- The comment and report form handlers capture input values before state updates.
- The page avoids render-time throws for missing comments or stale backend counter data.
- Notifications remain backend-needed and are not faked.

## 7. Tests/Checks Run

- `npm run lint` passed.
- `npm run build` passed.
- `npm run test` passed: 44 files, 367 tests.
- `git diff --check` passed.
- Route smoke passed in the in-app browser:
  - `/app/community`
  - `/app/notifications`
  - `/app`
  - `/app/prices`
  - `/app/ai`
  - `/app/weather`
  - `/app/profile`
- Browser console errors during route smoke: none.

## 8. Owner Staging Retest Steps

Use `docs/community/COMMUNITY_STAGING_UI_DEFECT_TEST_M115.md`.

Core retest:

- Sign in as User A.
- Open `/app/community`.
- Click `Like`; verify visible count increases.
- Click `เลิกไลก์`; verify visible count decreases and never becomes negative.
- Click `คอมเมนต์`; verify the page does not blank.
- Submit an empty comment; verify validation copy appears.
- Submit a valid comment; verify it appears or the UI refreshes safely.
- Repeat like/comment/report with User B.

## 9. Known Limitations

- Real staging like/comment writes still require `VITE_ENABLE_COMMUNITY_WRITES=true`, a signed-in Supabase staging user, and staging RLS.
- Like/reply notifications are still backend-needed and gated.
- Anonymous users remain write-gated.
- If Supabase RLS blocks aggregate like reads, the UI still preserves the successful local like/unlike state after action success.

## 10. Next Recommended Milestone

M116 should run the owner staging retest, confirm real UI writes across User A/User B, and then decide whether to add backend-created in-app notifications for like/reply events.
