# M15 Farmer Accessibility + Visual QA Polish Report

## Summary

M15 improves KasetHub’s readability, touch comfort, Thai UX copy, and visual QA readiness for older/non-tech Thai farmers. The milestone keeps the existing M01-M14 architecture intact and adds no real backend, auth, Supabase writes, AI API calls, image uploads, payments, or new complex production features.

## Files Changed

- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/FARMER_FRIENDLY_AUTH_STRATEGY.md`
- `docs/AI_AGRICULTURE_SAFETY_POLICY.md`
- `docs/FARMER_ACCESSIBILITY_VISUAL_QA.md`
- `src/app/App.tsx`
- `src/types/kaset.ts`
- `src/styles/index.css`
- `src/components/layout/PageHeader.tsx`
- `src/components/layout/BottomNav.tsx`
- `src/components/ui/Button.tsx`
- `src/components/ui/Badge.tsx`
- `src/components/ui/SectionHeader.tsx`
- `src/components/ui/NoticeBox.tsx`
- `src/components/ui/StatusPill.tsx`
- `src/components/ui/LargeActionButton.tsx`
- `src/components/kaset/QuickActionGrid.tsx`
- `src/components/kaset/SocialShareSheet.tsx`
- `src/routes/AppHomePage.tsx`
- `src/routes/AIPage.tsx`
- `src/routes/AnalyzePage.tsx`
- `src/routes/YoutubePage.tsx`
- `src/routes/CommunityPage.tsx`
- `src/routes/PricesPage.tsx`
- `src/routes/ProfilePage.tsx`
- `src/routes/MemoryPage.tsx`
- `src/routes/AuthPage.tsx`
- `src/routes/AICreditsPage.tsx`
- `src/routes/QAPage.tsx`
- `reports/milestones/M15_FARMER_ACCESSIBILITY_VISUAL_QA_POLISH_REPORT.md`

## Routes Added

- `/app/qa`

## UX/Copy Improvements

- Added plain Thai notices across the main routes for:
  - Guest-first usage
  - Local-only saved data
  - Demo/mock data
  - Image privacy
  - AI safety
  - AI credit and rewarded-ad mock behavior
- Kept “ใช้งานต่อได้เลย ไม่ต้องสมัคร” visible in the auth area.
- Made prototype-only backend, AI, and upload states clearer without introducing real backend behavior.
- Added `/app/qa` to summarize reviewed routes, known UX risks, and next polish tasks.

## Accessibility Improvements

- Added shared UI helpers:
  - `NoticeBox`
  - `StatusPill`
  - `LargeActionButton`
- Increased default button height and label weight.
- Increased badge height and contrast weight.
- Improved page header readability by allowing subtitle wrapping.
- Increased bottom navigation tap targets.
- Increased share sheet action size.
- Increased quick action card text size and minimum card height.
- Increased profile menu row touch targets.
- Added CSS utility classes for readable Thai text, tap targets, form controls, and safety copy.

## Visual QA Notes

`docs/FARMER_ACCESSIBILITY_VISUAL_QA.md` documents a checklist for:

- Text readability
- Tap target size
- Contrast
- Thai language clarity
- Guest mode clarity
- Safety disclaimer clarity
- Image upload clarity
- AI credit clarity
- Saved/bookmark clarity
- Older-user usability notes
- Screenshot guidance for app home, AI, Analyze, YouTube, Profile, Memory, Auth, AI credits, and QA

## Verification Commands

```bash
npm run lint
npm run build
```

Both commands passed.

Manual route checks returned HTTP 200:

- `/app`
- `/app/ai`
- `/app/analyze`
- `/app/youtube`
- `/app/community`
- `/app/prices`
- `/app/profile`
- `/app/memory`
- `/app/auth`
- `/app/ai-credits`
- `/app/qa`

Local dev server used for checks:

- `http://127.0.0.1:5173/app/qa`

## Known Limitations

- No real backend
- No real AI API
- No Supabase writes
- No auth implementation
- No real image upload
- No real user testing with older farmers yet
- No automated screenshot or contrast test suite
- Developer/test panels still appear in prototype routes and should be hidden before production
- No in-app font-size setting yet

## Next Recommended Milestone

M16 should create a guest-memory sync proof of concept for phone account creation in a test-only backend boundary. It should preserve Guest Memory on failure, keep service-role secrets server-side, and maintain the clearer M15 UX copy around optional signup and local-only data.
