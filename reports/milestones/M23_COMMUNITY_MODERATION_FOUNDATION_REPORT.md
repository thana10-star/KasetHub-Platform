# M23 Community Moderation Foundation Report

## Summary

M23 adds a local/mock community moderation foundation for KasetHub. Farmers can report demo posts, hide and unhide posts on the current device, read community rules, and inspect a mock moderation center before any real community backend writes are enabled. Guest Memory remains active for existing likes, saves, shares, and local user behavior.

No real backend, Supabase write, real user account requirement, network call, real moderation API, AI moderation provider, real admin action, or production moderation decision was added.

## Files Changed

- `src/services/community-moderation/community-moderation.types.ts`
- `src/services/community-moderation/community-moderation-fixtures.ts`
- `src/services/community-moderation/community-moderation-service.ts`
- `src/hooks/useCommunityModeration.ts`
- `src/components/kaset/CommunityPostCard.tsx`
- `src/routes/CommunityPage.tsx`
- `src/routes/CommunityRulesPage.tsx`
- `src/routes/ModerationCenterPage.tsx`
- `src/routes/ProfilePage.tsx`
- `src/routes/QAPage.tsx`
- `src/app/App.tsx`
- `src/types/kaset.ts`
- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/FARMER_ACCESSIBILITY_VISUAL_QA.md`
- `docs/SUPABASE_SCHEMA_DRAFT.md`
- `docs/SUPABASE_TYPE_MAPPING.md`
- `docs/AI_AGRICULTURE_SAFETY_POLICY.md`
- `docs/COMMUNITY_MODERATION_FOUNDATION.md`
- `docs/COMMUNITY_RULES_AND_SAFETY_POLICY.md`
- `reports/milestones/M23_COMMUNITY_MODERATION_FOUNDATION_REPORT.md`

## Routes Added

- `/app/community-rules`
- `/app/moderation-center`

## Moderation Model Notes

- `CommunityRule` models user-facing rules and safety guidance.
- `CommunityReportReason` supports:
  - `spam`
  - `rude_or_harassment`
  - `dangerous_advice`
  - `chemical_or_pesticide_risk`
  - `scam_or_fake_sale`
  - `off_topic`
  - `personal_data`
  - `other`
- `CommunityReport` stores local report records.
- `ModerationStatus` supports `pending_review`, `reviewed`, `action_taken`, and `dismissed`.
- `ModerationAction` prepares future admin actions such as warning, hide, remove, escalation, and review.
- `HiddenContentRecord` stores local hidden post state.
- `CommunitySafetyNotice` keeps warning copy reusable.
- `ModeratorQueueItem` prepares the future admin/moderator review surface.

## Local Report/Hide Behavior

- Local state is stored in `kasethub.communityModeration.v1`.
- The service uses versioned localStorage with safe parse and migration fallback.
- Supported local-only functions:
  - `reportPost(postId, reason, note)`
  - `hidePost(postId)`
  - `unhidePost(postId)`
  - `isPostHidden(postId)`
  - `getReports()`
  - `getHiddenPosts()`
  - `clearLocalModerationDemo()`
- Reports and hidden posts never leave the current browser/device.
- Hidden posts show an undo card.
- Clearing the demo state removes local moderation records only.

## Screens Updated

- `/app/community` now shows report/hide actions on demo posts, a hidden-post undo state, a report reason sheet, community rules summary, local-only notice, and agricultural safety notice.
- `/app/community-rules` shows respectful discussion, no scam/fake sale, no dangerous chemical advice, no personal data posting, responsible photo use, source/disclaimer guidance, and reporting explanation.
- `/app/moderation-center` shows local reports, hidden posts, mock queue items, status badges, and admin/moderator future notes.
- `/app/profile` links to community rules and moderation center.
- `/app/qa` includes community rules and moderation center in reviewed route links.
- `CommunityPostCard` now supports optional report/hide actions, demo post labeling, and a local moderation status badge.

## Safety/Community Rules Notes

Required Thai copy appears in the UI:

- “รายงานนี้ยังเป็นข้อมูลในเครื่องเท่านั้น”
- “ยังไม่มีผู้ดูแลระบบจริงในเวอร์ชันนี้”
- “คำแนะนำเรื่องสารเคมี/โรคพืชควรตรวจสอบกับผู้เชี่ยวชาญ”

The docs define future rules for respectful discussion, scam/fake sale prevention, dangerous chemical advice, personal data, responsible photo use, source guidance, reporting, backend review, RLS, and audit logs.

## Verification Commands

```bash
npm run lint
npm run build
```

Both passed. The production build completed with the existing Vite large chunk warning.

## Manual Route Checks

The Browser plugin did not expose an available browser tool in this session, so route verification used local Vite on `http://127.0.0.1:5174` plus headless Chrome DOM checks.

Passed:

- `/app/community`
- `/app/community-rules`
- `/app/moderation-center`
- `/app/profile`
- `/app/qa`
- `/app/memory`

The local Vite server was stopped after verification.

## Known Limitations

- No real backend.
- No Supabase writes or migrations.
- No real user accounts.
- No real admin or moderator action.
- No real moderation API.
- No AI moderation provider.
- No network calls.
- No cross-device sync for reports or hidden posts.
- No report abuse prevention, rate limits, duplicate grouping, appeal workflow, or audit trail.
- Hidden content is personal/local only and does not remove content for other users.

## Next Recommended Milestone

M24 should add the backend/admin review contract for community moderation: authenticated report creation, moderator roles, queue assignment, action history, appeal/correction rules, expert escalation for chemical/disease advice, RLS policies, and audit logging before any real community writes are enabled.
