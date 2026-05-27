# Community Comment Count Visibility M116.7

M116.7 also polishes post comment count visibility. Posts should show visible comment activity directly on the card without requiring the user to open the comment panel first.

## Behavior

- The post action button shows `คอมเมนต์` with the visible count for every post.
- A zero count keeps the neutral compact button style.
- A count above zero uses the active soft style and a compact count badge so activity stands out.
- Counts include top-level comments and one-level replies.

## Count Source

The feed still prefers real backend data. `listPosts()` reads published `community_comments` rows by `post_id` when available and counts those rows for each post. This avoids relying only on a stale denormalized `community_posts.comment_count`.

If comment rows cannot be read, the UI falls back to the existing post `comment_count` value.

## Local Reconciliation

After a successful local action:

- Top-level comment submit increments the visible post count immediately.
- Reply submit increments the visible post count immediately.
- Hiding an owned comment/reply decrements the visible post count immediately.
- A stale feed refresh is reconciled so it does not overwrite the newer local count.

This does not add fake engagement. Counts only come from backend rows or confirmed user actions in the current session.

## Backend And Security Boundary

- No backend feature is added.
- Community write security is unchanged.
- Production writes remain disabled by default.
- RLS is not bypassed.
- No service-role key is introduced.

