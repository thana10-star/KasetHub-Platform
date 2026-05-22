# M04 Guest Memory & Save Framework Report

## Summary

M04 adds a framework-first local memory system for guest users. KasetHub can now remember saved items, likes, followed topics, My Farm records, and recent AI questions locally without forcing login. Existing saved article and saved video features remain intact through compatibility wrappers over the new Guest Memory service.

## Files Changed

- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/GUEST_MEMORY_FRAMEWORK.md`
- `reports/milestones/M04_GUEST_MEMORY_SAVE_FRAMEWORK_REPORT.md`
- `src/app/App.tsx`
- `src/types/kaset.ts`
- `src/services/guest-memory/guest-memory.types.ts`
- `src/services/guest-memory/guest-memory-service.ts`
- `src/hooks/useGuestMemory.ts`
- `src/services/offline/offline-article-service.ts`
- `src/hooks/useSavedArticles.ts`
- `src/services/videos/saved-video-service.ts`
- `src/routes/MemoryPage.tsx`
- `src/routes/ProfilePage.tsx`
- `src/routes/AIPage.tsx`
- `src/routes/PricesPage.tsx`
- `src/routes/MyFarmPage.tsx`
- `src/components/kaset/CommunityPostCard.tsx`
- `src/components/kaset/DiseaseResultCard.tsx`
- `reports/milestones/m04-app.png`
- `reports/milestones/m04-profile.png`
- `reports/milestones/m04-memory.png`
- `reports/milestones/m04-community.png`
- `reports/milestones/m04-analyze.png`
- `reports/milestones/m04-prices.png`
- `reports/milestones/m04-ai.png`
- `reports/milestones/m04-my-farm.png`

## Routes Added

- `/app/memory`

## Data Model Notes

Guest Memory includes:

- `GuestProfile`
- `GuestMemoryState`
- `SavedItem`
- `SavedItemType`
- `LikeItem`
- `FollowedTopic`
- `RecentAIQuestion`
- `FarmHistoryRecord`
- `GuestMemoryExport`

`SavedItemType` supports `article`, `video`, `community_post`, `analysis_result`, `crop_price`, `ai_answer`, `tool`, and `future`.

## Migration/Compatibility Notes

- Existing `kasethub.savedArticles.v1` data is migrated into Guest Memory.
- Existing `kasethub.savedVideos.v1` data is migrated into Guest Memory.
- Saved article and saved video services keep their existing public APIs while using Guest Memory internally.
- The migration is defensive and keeps fallback defaults if localStorage is unavailable or malformed.

## Screens Updated

- Profile shows “ข้อมูลที่บันทึกไว้ในเครื่องนี้” and guest-memory counts.
- Memory page shows saved items, likes, followed topics, recent AI questions, My Farm access, export mock, and clear-memory confirmation.
- Articles and YouTube videos continue saving through their existing UI, now backed by Guest Memory.
- Community posts can be liked and saved.
- Analyze result can save an analysis result and My Farm record.
- Prices can follow crop/price topics.
- AI screen records recent mock questions.
- My Farm can show locally saved farm records from Guest Memory.

## Verification Commands

```bash
npm run lint
npm run build
```

Both commands passed.

Manual route checks returned HTTP 200:

- `/app`
- `/app/profile`
- `/app/memory`
- `/app/articles`
- `/app/saved-articles`
- `/app/youtube`
- `/app/saved-videos`
- `/app/community`
- `/app/analyze`
- `/app/my-farm`

Mobile screenshots were captured for the core M04 routes.

## Known Limitations

- No Supabase
- No real auth
- No backend
- No cloud sync
- No real analytics
- Export/import is framework-only in M04
- Data stays in the current browser/device
- Clearing browser storage removes guest memory

## Next Recommended Milestone

M05 should define the auth-ready data model and Supabase schema, including how guest memory maps to cloud tables and how phone/LINE account creation will sync local memory without data loss.
