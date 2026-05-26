# M116.1 Community Staging UI Defect Retest

Date: 2026-05-26

Use this checklist after deploying the M116.1 fix to staging with Community writes enabled only in staging.

## User A

1. Login as User A through `/app/login`.
2. Open `/app/community`.
3. Create or use a real staging post.
4. Click `Like`.
5. Confirm the visible like count changes from `0` to `1`, or increases by one from the previous real count.
6. Click `เลิกไลก์`.
7. Confirm the visible count decreases and never becomes negative.
8. Click `คอมเมนต์`.
9. Type Thai text into the comment box, for example `ทดสอบคอมเมนต์จากมือถือ`.
10. Confirm the page does not blank or disappear while typing.
11. Submit an empty comment.
12. Confirm friendly validation appears.
13. Submit a valid comment.
14. Confirm the comment appears or a friendly service error appears while the page remains usable.
15. After applying M116.3 SQL in staging, tap `ตอบกลับ` on a top-level comment.
16. Confirm `กำลังตอบกลับ ...` appears under the correct comment.
17. Type Thai text into `เขียนคำตอบ...` and confirm the page does not blank.
18. Submit the reply and confirm it appears indented under the parent comment.
19. Confirm replies do not show another reply button.
20. Tap `ถูกใจ` on a comment and confirm its count increases only after the service action succeeds.
21. Tap `เลิกถูกใจ` on the same comment and confirm the count decreases without going negative.

## User B

1. Login as User B through `/app/login`.
2. Open `/app/community`.
3. Read User A's post.
4. Repeat like, unlike, comment typing, valid comment submit, and report.
5. Reply to User A's top-level comment and confirm the reply target is visually clear.
6. Like/unlike User A's comment.
7. Confirm User B cannot hide/delete User A's post.
8. Confirm User B cannot delete User A's image.

## Anonymous

1. Sign out.
2. Open `/app/community`.
3. Confirm read-only feed behavior matches staging policy.
4. Confirm post, comment, like, and report actions require sign-in.

## Expected Result

- Like count updates only after a successful service action.
- A stale backend `like_count = 0` does not immediately overwrite a successful like in the UI.
- Typing in the comment textarea does not crash the app.
- Comment submit is safe.
- Comment replies are one-level only and visually attached to the parent comment.
- Comment-like counts update only from real service actions.
- No fake posts, comments, likes, names, or notifications are shown.
- Production remains disabled unless the owner explicitly approves a later launch milestone.
