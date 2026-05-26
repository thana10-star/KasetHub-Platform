# M114 Community Staging UI Write Test Checklist

Status: owner-executable checklist for staging only.

## User A

- Sign in with a real staging account.
- Open `/app/community`.
- Confirm the composer is enabled only when `VITE_ENABLE_COMMUNITY_WRITES=true`.
- Create a text-only post.
- Create a post with one valid image.
- Confirm only one image can be attached per post.
- Confirm invalid file types are rejected before upload.
- Confirm files over 3MB are rejected before upload.
- Confirm User A can hide or delete User A's own post.

## User B

- Sign in with a second real staging account.
- Open `/app/community`.
- Confirm User B can read User A's published post.
- Confirm User B can comment on User A's post.
- Confirm User B can like User A's post.
- Confirm duplicate like does not create a second like count.
- Confirm User B can unlike User B's own like.
- Confirm User B can report User A's post with a Thai UI label mapped to a database reason code.
- Confirm User B cannot edit, hide, or delete User A's post.
- Confirm User B cannot delete or overwrite User A's image.

## Anonymous

- Open `/app/community` without signing in.
- Confirm reading published posts works only if staging policy allows anonymous reads.
- Confirm anonymous users cannot post.
- Confirm anonymous users cannot comment.
- Confirm anonymous users cannot like.
- Confirm anonymous users cannot report.

## Expected UI

- No fake posts are rendered.
- No fake likes, comments, names, or engagement counts are rendered.
- A real empty state appears when the database returns no posts.
- Errors are understandable and do not mention secrets.
- Share still works through Web Share or copy-link fallback.
- LINE and Facebook share links do not require SDKs or social account collection.
- Notification copy clearly says like/reply notifications are backend-needed and not enabled yet.

## Result

- Pass:
- Fail:
- Blocked:
- Notes:
