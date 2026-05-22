# M05 Supabase/Auth-Ready Data Model & Sync Planning Report

## Summary

M05 designs the backend-ready data model and sync plan for KasetHub without adding Supabase, auth, API keys, or network calls. Guest Memory remains the active storage layer while the app gains cloud-shaped TypeScript models, a pure guest-to-cloud sync planner, planning docs, and an in-app account preview screen.

## Files Changed

- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/GUEST_MEMORY_FRAMEWORK.md`
- `docs/SUPABASE_SCHEMA_DRAFT.md`
- `docs/GUEST_TO_ACCOUNT_SYNC_PLAN.md`
- `docs/FARMER_FRIENDLY_AUTH_STRATEGY.md`
- `reports/milestones/M05_SUPABASE_AUTH_READY_DATA_MODEL_REPORT.md`
- `src/app/App.tsx`
- `src/types/kaset.ts`
- `src/services/backend/backend.types.ts`
- `src/services/backend/sync.types.ts`
- `src/services/backend/guest-to-cloud-sync-planner.ts`
- `src/routes/AccountPreviewPage.tsx`
- `src/routes/ProfilePage.tsx`
- `reports/milestones/m05-profile.png`
- `reports/milestones/m05-memory.png`
- `reports/milestones/m05-account-preview.png`
- `reports/milestones/m05-articles.png`
- `reports/milestones/m05-youtube.png`
- `reports/milestones/m05-my-farm.png`

## Routes Added

- `/app/account-preview`

## Backend Model Notes

M05 defines backend-ready models for:

- `UserProfile`
- `AuthProviderType`
- `CloudSavedItem`
- `CloudLike`
- `CloudFollowedTopic`
- `CloudFarmRecord`
- `CloudRecentAIQuestion`
- `CloudShareEvent`
- `CloudAIUsageCredit`
- `CloudNotification`
- `CloudCommunityPost`
- `CloudArticle`
- `CloudVideo`
- `CloudCropPriceWatch`
- `GuestToCloudSyncPlan`
- `SyncConflictPolicy`

## Supabase Schema Notes

`docs/SUPABASE_SCHEMA_DRAFT.md` includes draft tables, purpose, key columns, indexes, RLS notes, and future admin/moderation notes for profiles, saved items, likes, followed topics, farm records, AI history, share events, credits, notifications, community, articles, videos, crop prices, and auth link events.

## Guest-to-Account Sync Notes

`createGuestToCloudSyncPlan()` accepts `GuestMemoryState` and returns a no-network plan with:

- `savedItemsToCreate`
- `likesToCreate`
- `topicsToFollow`
- `farmRecordsToCreate`
- `recentAIQuestionsToCreate`
- `estimatedRecords`
- `warnings`

Conflict policy:

- Saved items: merge by `itemType + itemId`
- Likes: OR/true wins
- Followed topics: merge
- Farm records: keep both unless same local ID
- AI history: optional user consent
- Profile: cloud wins, guest display name can be suggested

## Verification Commands

```bash
npm run lint
npm run build
```

Both commands passed.

Manual route checks returned HTTP 200:

- `/app/profile`
- `/app/memory`
- `/app/account-preview`
- `/app/articles`
- `/app/youtube`
- `/app/my-farm`

Mobile screenshots were captured for the same routes.

## Known Limitations

- No real Supabase client
- No real auth
- No phone OTP
- No LINE Login
- No Google auth
- No backend endpoint
- No cloud sync
- No API keys
- Account preview is mock/planning UI only

## Next Recommended Milestone

M06 should scaffold Supabase behind feature flags and environment checks, still without production keys, then prove how account creation will safely upload Guest Memory through a backend-owned sync endpoint.
