# M110 Community Notification Strategy

## Decision

Community V1 uses in-app notifications only. Push notifications are deferred.

## Events

Supported notification types remain:

- `post_liked`
- `post_replied`
- `comment_replied`
- `post_reported_system`

V1 user-facing scope is limited to:

- someone liked your post
- someone replied/commented on your post

## Ownership

`community_notifications.recipient_user_id` is the owner column. RLS allows users to read and mark read only their own notifications.

Normal users must not read another user's notifications.

## Creation Path

Like/reply notification creation should be backend/server-created, preferably by a Supabase Edge Function or database function that verifies:

- authenticated actor user ID
- recipient owns the target post/comment
- actor is not spoofing another user
- target post/comment is visible and valid
- idempotency for repeat likes or duplicate retry requests
- rate limits and abuse checks

Client-side notification insert is not enabled in M110. A browser client could otherwise create arbitrary notifications for other users unless the insert path is carefully constrained.

## Current App Behavior

The existing `/app/notifications` route is available as an in-app notification surface, but community like/reply notification creation remains gated until a backend creation path is verified.

The UI must not fake notifications, fake likes, fake replies, or fake counts.

## Deferred

- Push notifications
- Device tokens
- Notification preferences
- Moderator/admin notification console
- Backend idempotency implementation
- Rate limiting implementation
