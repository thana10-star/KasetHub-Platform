# Community Moderation Foundation

M23 adds a local/mock moderation foundation for KasetHub community surfaces. It prepares the app for farmer post reports, hidden content, community rules, and future admin review without enabling real backend writes.

## Current Scope

- No real backend.
- No Supabase writes.
- No real user accounts required.
- No network calls.
- No real moderation API.
- No AI moderation provider.
- Guest Memory remains active for likes, saves, and follows.
- Reports and hidden posts are stored only in versioned localStorage.

## Local Storage

Current key:

- `kasethub.communityModeration.v1`

Stored local state:

- `reports`
- `hiddenPosts`
- `version`
- `migrations`
- `updatedAt`

The service uses safe parse and migration fallback. Bad or old data should fall back to an empty local state instead of blocking the community page.

## Domain Models

M23 adds:

- `CommunityRule`
- `CommunityReportReason`
- `CommunityReport`
- `ModerationStatus`
- `ModerationAction`
- `HiddenContentRecord`
- `CommunitySafetyNotice`
- `ModeratorQueueItem`

Report reasons:

- `spam`
- `rude_or_harassment`
- `dangerous_advice`
- `chemical_or_pesticide_risk`
- `scam_or_fake_sale`
- `off_topic`
- `personal_data`
- `other`

Moderation statuses:

- `pending_review`
- `reviewed`
- `action_taken`
- `dismissed`

## Local Behavior

The local service supports:

- `reportPost(postId, reason, note)`
- `hidePost(postId)`
- `unhidePost(postId)`
- `isPostHidden(postId)`
- `getReports()`
- `getHiddenPosts()`
- `clearLocalModerationDemo()`

These functions mutate localStorage only. They do not call `fetch`, Supabase, a backend job, a moderation provider, or any AI safety provider.

## UI Surfaces

M23 updates:

- `/app/community`
- `/app/community-rules`
- `/app/moderation-center`
- `/app/profile`
- `/app/qa`

Community post cards now support report and hide actions. Hidden posts show an undo card. Reports show local-only status copy.

## Required User Copy

User-facing moderation surfaces must keep these ideas visible:

- “รายงานนี้ยังเป็นข้อมูลในเครื่องเท่านั้น”
- “ยังไม่มีผู้ดูแลระบบจริงในเวอร์ชันนี้”
- “คำแนะนำเรื่องสารเคมี/โรคพืชควรตรวจสอบกับผู้เชี่ยวชาญ”

## Future Backend Shape

Future production moderation should move ownership to a backend or Supabase Edge Function:

- authenticated report creation
- rate limits
- duplicate report grouping
- staff review queues
- moderation action history
- appeal/correction workflow
- audit logs
- abuse/fraud detection
- expert escalation for chemical, disease, and safety advice

The frontend should never be trusted to decide final visibility for production community content.

## Anti-Misinformation Rules

- Agricultural chemical advice should be flagged for expert review when risky.
- Disease diagnosis claims should avoid certainty unless reviewed by a qualified source.
- Price or sale claims in community posts should not be treated as official references.
- Scam/fake sale reports should be prioritized once marketplace features exist.
- Personal data should be hidden or redacted by a backend-owned moderation action.

## Known Limitations

- No real admin queue.
- No cross-device sync.
- No authenticated reporter identity.
- No report abuse controls.
- No production content removal.
- No AI moderation or automated classification.

## M24 Admin Dashboard Connection

M24 surfaces community moderation state in `/app/admin`:

- local reports from `kasethub.communityModeration.v1`
- hidden posts count
- mock moderator queue summary
- moderation risks and future admin tasks

The admin dashboard does not perform real moderation actions. It only previews what a future backend-owned admin dashboard should monitor.

## M35 Notification Center Connection

M35 surfaces local community reports and mock moderator queue items inside `/app/notifications`. These notices are local/demo only and must not imply a real moderator has reviewed or acted on content. Future production moderation notifications require authenticated reports, backend-owned moderation status, delivery consent, rate limits, and audit logs.
