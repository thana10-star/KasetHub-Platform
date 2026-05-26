# M116.4 Community Comment Submit Fix

Date: 2026-05-26

## What Changed

M116.4 tightens the normal top-level comment flow after staging showed that typing worked but tapping `ส่งคอมเมนต์` appeared disabled or did nothing.

Fixes:

- Top-level comment submit now uses a dedicated form submit path.
- The submit button is enabled when staging writes are enabled, the user is signed in, and the post id exists.
- Empty comments still show `กรุณาเขียนคอมเมนต์`.
- Comment success/error copy appears directly inside the comment panel, not only near the main composer.
- `createComment` explicitly inserts `parent_comment_id = null` for normal comments.
- Reply flow still uses `createReply(postId, parentCommentId, text)` and remains separate.

Production safety is unchanged. `VITE_ENABLE_COMMUNITY_WRITES=false` remains the default.

## Owner Retest Steps

1. Login User A through `/app/login`.
2. Open `/app/community`.
3. Open comments under a real post.
4. Type a normal top-level comment.
5. Confirm `ส่งคอมเมนต์` is enabled.
6. Submit.
7. Confirm the comment appears under the post or a friendly error appears in the comment panel.
8. Tap `ตอบกลับ` on a top-level comment.
9. Type and submit a reply.
10. Confirm the reply appears under the correct comment.
11. Login User B and repeat normal comment, reply, like, and report checks.

## Expected Result

- Normal comments do not require a reply target.
- Replies require a selected top-level parent comment.
- Empty comments show validation.
- No fake comments are shown.
- Production writes remain disabled unless the owner explicitly enables a later launch milestone.
