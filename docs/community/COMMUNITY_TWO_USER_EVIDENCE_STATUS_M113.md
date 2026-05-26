# M113 Community Two-User Evidence Status

Status: passed in Supabase staging from owner manual smoke test output.

Evidence source: owner-run `scripts/manual/community-rls-smoke.mjs` using the staging anon key and real staging User A/User B accounts.

Evidence date: 2026-05-26, owner-provided in M113 request.

Staging test IDs from owner run:

- Post ID: `e23619b4-0cc4-4c6c-8732-57720382f93e`
- Comment ID: `dd669388-a442-48b1-9a94-29779031089b`

This is staging evidence only. Production community writes remain disabled by default.

## Passed Checks

- Post create: User A can create own post.
- Public read: User B can read User A published post.
- Cross-user post update denial: User B cannot update User A post.
- Post integrity after denied update: User A post content was not changed by User B.
- Cross-user post delete denial: User B cannot delete User A post.
- Post integrity after denied delete: User A post still exists after User B delete attempt.
- Comment create: User B can comment on User A post.
- Cross-user comment delete denial: User A cannot delete User B comment.
- Comment integrity after denied delete: User B comment still exists after User A delete attempt.
- Like: User B can like User A post.
- Duplicate like prevention: User B duplicate like fails or is blocked by unique constraint.
- Unlike: User B can unlike own like.
- Anonymous post denial: anonymous user cannot create post.
- Report insert: User B can report User A post.
- Own report read: User B can read own report.
- Cross-user report read denial: User A cannot list User B report.
- Anonymous report denial: anonymous user cannot report.
- Own-folder image upload: User A can upload image to own folder.
- Cross-user image delete denial: User B cannot delete User A image.
- Cross-user image upload denial: User B cannot upload into User A folder.
- Wrong file type denial: wrong file type is blocked.

## M113 Decision

The core staging RLS/storage checks are accepted as passed for adapter preparation.

The app may add a narrow staging write adapter behind `VITE_ENABLE_COMMUNITY_WRITES=true`, but:

- `.env.example` must remain `VITE_ENABLE_COMMUNITY_WRITES=false`.
- Production must remain disabled until a later owner-approved launch milestone.
- Frontend must use only the Supabase anon key and rely on RLS.
- Notifications remain backend-needed; browser-created like/reply notifications are not enabled.
- No fake posts, fake likes, fake comments, or fake success states are allowed.

