# M111 Community Staging SQL Test Snippets

Do not run on production unless reviewed.

These snippets are for owner-side staging verification. Replace placeholders with temporary staging test IDs only:

- `<USER_A_UUID>`
- `<USER_B_UUID>`
- `<POST_ID>`
- `<COMMENT_ID>`
- `<NOTIFICATION_ID>`

Prefer testing through the Supabase client as each real test user where possible. Direct SQL in the dashboard often runs with elevated privileges and can bypass the exact browser/RLS behavior being tested.

## Confirm Tables Exist

```sql
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in (
    'community_posts',
    'community_comments',
    'community_likes',
    'community_reports',
    'community_notifications'
  )
order by table_name;
```

## Confirm RLS Is Enabled

```sql
select schemaname, tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in (
    'community_posts',
    'community_comments',
    'community_likes',
    'community_reports',
    'community_notifications'
  )
order by tablename;
```

Expected: `rowsecurity = true` for every table.

## List Community Policies

```sql
select schemaname, tablename, policyname, permissive, roles, cmd
from pg_policies
where schemaname = 'public'
  and tablename like 'community_%'
order by tablename, policyname;
```

Expected:

- Published post/comment read policies exist.
- Own insert/update/delete policies exist for posts/comments.
- Own insert/delete policies exist for likes.
- Reports are insert-own and select-own only.
- Notifications are select-own and update-own only.
- No notification browser insert policy exists in M111.

## Insert Own Post Example

Run as authenticated User A through an anon-client session.

```sql
insert into public.community_posts (
  author_user_id,
  author_display_name,
  content_text,
  category
)
values (
  '<USER_A_UUID>',
  'User A Test',
  'M111 staging test post. No personal data.',
  'อื่น ๆ'
)
returning id;
```

Expected: succeeds only when `author_user_id = auth.uid()`.

## Cross-User Post Update Should Fail

Run as authenticated User B through an anon-client session.

```sql
update public.community_posts
set content_text = 'User B should not be able to edit this post'
where id = '<POST_ID>'
  and author_user_id = '<USER_A_UUID>';
```

Expected: blocked by RLS or updates zero rows. User B must not edit User A's post.

## Owner Hide Own Post

Run as authenticated User A through an anon-client session.

```sql
update public.community_posts
set status = 'hidden'
where id = '<POST_ID>'
  and author_user_id = '<USER_A_UUID>';
```

Expected: succeeds for User A. Hidden post should disappear from normal published feed reads.

## Insert Comment On Published Post

Run as authenticated User B through an anon-client session.

```sql
insert into public.community_comments (
  post_id,
  author_user_id,
  author_display_name,
  content_text
)
values (
  '<POST_ID>',
  '<USER_B_UUID>',
  'User B Test',
  'M111 staging test comment.'
)
returning id;
```

Expected: succeeds only when User B is authenticated as `<USER_B_UUID>` and the post is published.

## Cross-User Comment Delete Should Fail

Run as authenticated User A through an anon-client session against a User B comment.

```sql
delete from public.community_comments
where id = '<COMMENT_ID>'
  and author_user_id = '<USER_B_UUID>';
```

Expected: blocked by RLS or deletes zero rows. User A is not a moderator in M111.

## Like Unique Constraint Test

Run as authenticated User B through an anon-client session.

```sql
insert into public.community_likes (post_id, user_id)
values ('<POST_ID>', '<USER_B_UUID>');
```

Run the same insert a second time.

```sql
insert into public.community_likes (post_id, user_id)
values ('<POST_ID>', '<USER_B_UUID>');
```

Expected: first insert succeeds, second insert fails on `(post_id, user_id)` unique/primary key or is handled idempotently by future service code.

## Unlike Own Like

Run as authenticated User B through an anon-client session.

```sql
delete from public.community_likes
where post_id = '<POST_ID>'
  and user_id = '<USER_B_UUID>';
```

Expected: succeeds for User B's own like only.

## Report Insert Test

Run as authenticated User B through an anon-client session.

```sql
insert into public.community_reports (
  post_id,
  reporter_user_id,
  reason,
  note
)
values (
  '<POST_ID>',
  '<USER_B_UUID>',
  'spam',
  'M111 staging report test.'
)
returning id;
```

Expected: succeeds only when `reporter_user_id = auth.uid()`.

## Reports Not Listable By Normal Users

Run as authenticated User A and User B separately.

```sql
select id, post_id, comment_id, reporter_user_id, reason, created_at
from public.community_reports
order by created_at desc;
```

Expected: each normal user sees only own reports if the select-own policy is retained. No normal user can browse all reports.

## Notifications Select Own Only

Run as authenticated User A.

```sql
select id, recipient_user_id, actor_user_id, post_id, comment_id, type, title, read_at, created_at
from public.community_notifications
order by created_at desc;
```

Expected: User A sees only rows where `recipient_user_id = <USER_A_UUID>`.

Run as authenticated User B and verify User A rows are not visible.

## Notification Browser Insert Should Not Exist

Run as authenticated User B through an anon-client session.

```sql
insert into public.community_notifications (
  recipient_user_id,
  actor_user_id,
  post_id,
  type,
  title
)
values (
  '<USER_A_UUID>',
  '<USER_B_UUID>',
  '<POST_ID>',
  'post_liked',
  'This browser insert should fail'
);
```

Expected: fails because M111 does not define a browser/client insert policy for `community_notifications`.

## Anonymous Insert Should Fail

Run with no authenticated user session through anon access.

```sql
insert into public.community_posts (
  author_user_id,
  content_text,
  category
)
values (
  '<USER_A_UUID>',
  'Anonymous insert should fail.',
  'อื่น ๆ'
);
```

Expected: fails because only authenticated users may insert own posts.

