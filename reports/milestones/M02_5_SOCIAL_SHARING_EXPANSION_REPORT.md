# M02.5 Social Sharing Expansion Report

## Summary

M02.5 upgrades KasetHub sharing from LINE-focused direct buttons into a reusable social sharing foundation for Thai users. The new layer supports native Web Share API, LINE share intent, Facebook share intent, and copy link fallback with referral parameters.

## Files Changed

- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `reports/milestones/M02_5_SOCIAL_SHARING_EXPANSION_REPORT.md`
- `src/services/share/social-share-service.ts`
- `src/services/share/share-service.ts`
- `src/components/kaset/SocialShareSheet.tsx`
- `src/components/kaset/ShareButton.tsx`
- `src/components/kaset/ArticleCard.tsx`
- `src/components/kaset/VideoCard.tsx`
- `src/components/kaset/DiseaseResultCard.tsx`
- `src/components/kaset/CommunityPostCard.tsx`
- `src/components/kaset/FarmAnalysisCard.tsx`
- `reports/milestones/m02-5-analyze.png`
- `reports/milestones/m02-5-articles.png`
- `reports/milestones/m02-5-community.png`
- `reports/milestones/m02-5-youtube.png`
- `reports/milestones/m02-5-my-farm.png`
- `reports/milestones/m02-5-profile.png`

## Components/Services Added

- `social-share-service.ts`
  - Creates referral URLs with `ref=line`, `ref=facebook`, `ref=native`, or `ref=copy`
  - Generates LINE and Facebook intent URLs
  - Uses native Web Share API where available
  - Falls back safely to copy link
- `SocialShareSheet`
  - Mobile-first bottom sheet
  - Thai labels for LINE, Facebook, native share, and copy link
  - Touch-friendly buttons and result messages
- Updated `ShareButton`
  - Opens the social share sheet
  - Keeps existing card usage simple

## Screens Updated

- `/app/analyze`
- `/app/articles`
- `/app/community`
- `/app/youtube`
- `/app/my-farm`

Profile remains unchanged functionally but was manually checked to ensure M02 retention routes still work.

## Verification Commands

```bash
npm run lint
npm run build
```

Both commands passed.

## Manual Checks

Requested routes checked locally:

- `/app/analyze`
- `/app/articles`
- `/app/community`
- `/app/youtube`
- `/app/my-farm`
- `/app/profile`

All returned HTTP 200 on the local Vite server. Mobile screenshots were captured for the same routes.

## Known Limitations

- No real Facebook SDK
- No LINE Login
- No LINE Messaging API
- No analytics backend or referral event persistence
- No Supabase or user identity
- Web Share API availability depends on browser/device support
- Clipboard fallback depends on browser permissions and secure context support
- `imageUrl` is accepted as metadata but not uploaded, transformed, or shared as a Web Share file in M02.5

## Next Recommended Milestone

M03 should define the authenticated data model and backend schema for users, saved articles, My Farm records, share/referral events, and content objects. Referral tracking and deep links should be designed before adding a mobile app or PWA install flow.
