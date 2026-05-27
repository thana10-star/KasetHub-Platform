# M109 Community Real Foundation

## 1. V1 Scope

Community V1 is scoped to text posts, one optional image per post, one-level comments, like/unlike, share, report, own hide/delete, and in-app notifications for likes/replies.

Strictly excluded: private chat, follow/friend graph, push notifications, algorithmic ranking, groups, marketplace, GPS/geolocation, AI image diagnosis, multiple images, anonymous public writes, and fake engagement.

## 2. Implemented Path

M109 uses **Path B: contract + gated UI**.

Reason: the current app has Supabase scaffolding and SQL/RLS drafts, but real public writes, durable auth ownership, storage bucket policy, and backend-created community notifications are not safe-ready. The UI is polished and interactive where safe, but all write actions are gated honestly.

M110 update: a staging SQL/RLS/storage pack now exists at `supabase/sql/community_v1_schema_m110.sql`, and the frontend has `VITE_ENABLE_COMMUNITY_WRITES=false` by default. This does not enable public writes; it prepares the next owner-side staging verification step.

M116.3 update: comment polish is drafted and wired for staging with one-level replies and comment likes. SQL lives at `supabase/sql/community_comment_replies_likes_m116_3.sql`. Production writes still stay disabled by default.

M116.7 update: `น้ำและระบบน้ำ` is now a Community category for irrigation, drip systems, sprinklers, ponds, water shortage, flooding, brackish/saline water, pumps, pipes, and filters. This is a UI/category config update only and does not change write security.

M116.12 update: report reasons now submit database-safe codes (`spam`, `dangerous_information`, `personal_information`, `inappropriate`, `other`) while keeping Thai labels in the UI. Reports require login, block double-submit, remember locally reported targets during the session, and handle duplicate database errors safely. No CAPTCHA is added in V1.

M116.13 update: an admin-only report review route now exists at `/app/community-moderation`, gated by `VITE_ADMIN_EMAILS` in the UI and backed by a draft SQL/RPC admin allowlist at `supabase/sql/community_admin_moderation_m116_13.sql`. The frontend still uses the anon Supabase client and does not expose service-role keys.

## 3. Behavior

- Composer renders with category selection and safety copy.
- Categories include `ปัญหาพืช`, `ดินและปุ๋ย`, `น้ำและระบบน้ำ`, `อากาศ`, `ราคาเกษตร`, `เครื่องมือ/แอพ`, `เรื่องเล่าจากฟาร์ม`, and `อื่น ๆ`.
- Post submit is disabled with: "เข้าสู่ระบบก่อนโพสต์ คอมเมนต์ หรือกดไลก์".
- Feed renders an empty state and explicitly avoids fake posts, fake likes, fake comments, and fake names.
- Comment/reply, comment-like, post-like, report, own hide, and own delete controls are shown as gated V1 capabilities.
- Replies are one-level only: users can reply to a top-level comment, but replies do not show another reply action.
- Report reasons use Thai labels with database-safe codes, and report submission is allowed only when auth/RLS/write gates are ready.
- Share is implemented for `/app/community` using Web Share API with clipboard fallback. LINE and Facebook share links are plain URL sharers only.

## 4. One Image Policy

Image upload is gated in M109.

Future policy:
- Bucket: `community-post-images`
- Limit: 1 image per post
- Types: `image/jpeg`, `image/png`, `image/webp`
- Max size: 3MB
- Store path and metadata only in database
- No browser upload without authenticated owner-scoped storage policy

## 5. In-App Notifications

Notification route `/app/notifications` already exists, but it is local/demo today. Community like/reply notifications are documented in the service contract and gated until backend writes are safe.

No push notification is included in V1.

## 6. No Fake Engagement Rule

Production community surfaces must not render seeded posts, fake names, fake likes, fake comments, fake reply counts, or fake recent activity as real community data.

Allowed:
- Empty state
- Topic/category suggestions
- Test-only fixtures

## 7. Deferred

- Applying community schema migrations outside staging
- Completing M110 staging RLS verification with two real test users
- Storage bucket creation and policy verification
- Real auth/session ownership surfaced safely to the write service
- Server-side notification creation
- Broader moderation audit workflow and rate limits beyond the M116.13 review dashboard
- Rate limiting
- Individual post URLs

## 8. Privacy And Safety

Community stores no phone, exact address, precise location, GPS, or private identity requirement in public feed. Users are warned not to post phone numbers, addresses, or sensitive personal data. Chemical advice must be checked against labels and qualified local guidance before real use.
