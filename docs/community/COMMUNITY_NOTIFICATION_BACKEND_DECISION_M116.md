# M116 Community Notification Backend Decision

Date: 2026-05-26

## Decision

Like/reply notification creation remains backend-needed.

Do not create like/reply notifications directly from the browser client. Client-created notification inserts are too easy to abuse unless they are protected by a server-side function or a tightly scoped RPC that validates actor, recipient, and source object ownership.

## Current Policy

- V1 notification type remains in-app only.
- Push notifications remain deferred.
- `/app/notifications` can show notifications owned by the signed-in user.
- Community like/reply notification creation remains gated until a backend path exists.
- Do not fake notifications in the UI.

## Required Backend Behavior

A safe backend notification path should:

- Require an authenticated actor.
- Verify the liked/replied post or comment exists and is visible.
- Resolve the recipient from the post/comment owner.
- Avoid self-notifications for the actor's own post/comment.
- Enforce idempotency where useful, especially for repeated likes.
- Apply rate limiting or abuse controls.
- Insert with a server-controlled path that is compatible with RLS.
- Return user-friendly errors without leaking policy details.

## Candidate Implementation

Use a Supabase Edge Function or controlled RPC:

- `notify_post_liked(post_id)`
- `notify_post_replied(post_id, comment_id)`

The function/RPC should validate ownership and create `community_notifications` rows server-side. The frontend should call it only after the core like/comment action succeeds.

## M117 Gate

M117 should add backend-created in-app notifications only after the M116 owner app-level staging retest confirms the core Community write flow is stable.

If M116 retest fails, fix the core write defect first and keep notifications deferred.
