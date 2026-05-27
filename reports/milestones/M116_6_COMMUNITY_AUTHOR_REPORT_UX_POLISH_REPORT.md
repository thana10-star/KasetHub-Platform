# M116.6 Community Author Display Name + Report Dialog UX Polish Report

## 1. Summary

M116.6 improves Community staging usability by making author labels more meaningful and moving report reasons out of the post card into a compact dialog pattern. The work stays UI/service scoped and does not change Community security gates, RLS assumptions, production write defaults, storage schema, or backend privileges.

## 2. Owner Feedback Addressed

- Replaced the weak public fallback `ผู้ใช้ KasetHub` with `สมาชิก KasetHub`.
- Added a safe current-user display fallback from the email local part only.
- Connected Login/Profile identity expectations by showing a Profile preview for `ชื่อที่แสดงในชุมชน`.
- Removed the always-visible report reason selector from post cards.
- Kept report action compact and opened a focused report dialog instead.

## 3. Author Display Strategy

Community now resolves author display names in this order:

1. Stored `author_display_name` from the post/comment row.
2. Signed-in user's profile/auth display name when creating new posts, comments, or replies.
3. Sanitized email local part for the current user's own content when no display name exists.
4. `สมาชิก KasetHub` for missing names on other users' content.

## 4. Privacy Behavior

- Full email addresses are not rendered in public Community feed cards.
- Email fallback uses only the local part, for example `community-user-a@test.local` becomes `community-user-a`.
- Missing author labels for other users use `สมาชิก KasetHub`.
- Profile currently shows a read-only community display preview; a full profile display-name editor remains a future scoped milestone.

## 5. Report Dialog Behavior

- Post cards now show only the compact `รายงาน` action.
- Clicking report opens a dialog/bottom-sheet style panel with title, helper copy, reason radios, optional note, cancel, and submit buttons.
- Comments/replies use the same dialog pattern when report actions are available.
- If writes/report backend is gated, the dialog shows a friendly message instead of permanently expanding controls inside the card.
- Successful submit shows `ขอบคุณที่แจ้ง ทีมงานจะตรวจสอบ`.

## 6. Reason Code Mapping

UI labels map to database-safe reason codes:

- `สแปม` -> `spam`
- `ข้อมูลอันตราย` -> `dangerous_information`
- `ข้อมูลส่วนตัว` -> `personal_information`
- `เนื้อหาไม่เหมาะสม` -> `inappropriate`
- `อื่น ๆ` -> `other`

The service keeps the database reason field as a code and does not send Thai labels.

## 7. Tests/Checks Run

- `npm run lint` passed.
- `npm run build` passed. Vite reported the existing large chunk warning after a successful build.
- `npm run test` passed: 44 test files, 387 tests.
- `git diff --check` passed.
- Mobile route smoke at a 390px viewport passed for `/app/community`, `/app/notifications`, `/app`, `/app/prices`, `/app/ai`, `/app/weather`, and `/app/profile`.
- Route smoke confirmed no horizontal overflow, visible bottom nav, no old composer safety-gate copy, and no inline report reason selector on Community.

## 8. Owner Retest Steps

1. Open `/app/community` on a mobile viewport.
2. Confirm post/comment author names show either a stored name, a safe current-user label, or `สมาชิก KasetHub`.
3. Confirm no full email address appears in public Community cards.
4. Tap `รายงาน` on a post and confirm the reason options appear in a separate dialog.
5. Select `สแปม`, add an optional note, and confirm `ส่งรายงาน` submits or shows the gated-friendly message.
6. Open `/app/profile` while signed in and confirm `ชื่อที่แสดงในชุมชน` is visible.

## 9. Known Limitations

- There is not yet a complete user-editable `ชื่อที่แสดงในชุมชน` Profile setting.
- Existing posts/comments with null `author_display_name` cannot recover another user's profile label client-side without a scoped public profile-display-name read path.
- Report submission remains behind the existing Community write gate and backend readiness behavior.

## 10. Next Recommended Milestone

Add a narrowly scoped Profile display-name setting backed by safe RLS: users can update only their own display name, Community can read only public display-name fields needed for author labels, and moderation retains server-side identity checks without exposing private account data.
