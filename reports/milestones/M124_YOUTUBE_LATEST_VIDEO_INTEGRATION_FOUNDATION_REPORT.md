# M124 YouTube Latest Video Real Integration Foundation Report

## 1. Summary

M124 adds a safe latest-video foundation for KasetHub V1. Home now reads from a real-video service, `/app/youtube` shows either owner-curated real videos or a source-pending state, and the old mock YouTube hub is no longer surfaced as latest real content.

## 2. Current YouTube State Audit

1. Existing `/app/youtube` route: yes. The app already had `/app/youtube` and `/app/youtube/:videoId`.
2. Home link to it: yes. The Home latest-video CTA linked to `/app/youtube`.
3. Real channel URL configured: yes. `src/config/channel.ts` contains `https://www.youtube.com/@ruengkaset` and `@ruengkaset`. No channel ID or API key is configured.
4. Fake video data shown before M124: yes on the legacy `/app/youtube` hub and detail route, via `src/data/youtubeData.ts` mock videos and mock stats. Home itself was already source-pending and did not show fake engagement.
5. Safest V1 path: Path A, owner-curated static latest-video entries, empty by default until the owner adds a real URL.

## 3. Files Created

- `src/services/youtube/youtube.types.ts`
- `src/services/youtube/youtube-manual-data.ts`
- `src/services/youtube/youtube-service.ts`
- `src/services/youtube/youtube-service.test.ts`
- `src/routes/YoutubePage.test.tsx`
- `docs/content/YOUTUBE_LATEST_VIDEO_INTEGRATION_M124.md`
- `reports/milestones/M124_YOUTUBE_LATEST_VIDEO_INTEGRATION_FOUNDATION_REPORT.md`

## 4. Files Modified

- `src/routes/AppHomePage.tsx`
- `src/routes/AppHomePage.test.tsx`
- `src/routes/YoutubePage.tsx`
- `src/routes/YoutubeVideoDetailPage.tsx`
- `src/services/qa/route-registry.ts`

## 5. Integration Path Chosen

Path A: owner-curated static latest video source.

The default curated list is empty, so no fake video is shown as real. The service filters out entries that are not marked `isReal: true` or do not have a safe HTTP(S) URL.

## 6. Home Video Behavior

Home calls `getLatestVideo()` by default. If a real curated video exists, it shows the title, optional thumbnail, short description, channel name, and a `ดูวิดีโอ` external CTA. If no real video exists, Home keeps the honest pending text: `กำลังเตรียมเชื่อมวิดีโอล่าสุดจากช่อง`.

## 7. `/app/youtube` Behavior

`/app/youtube` now renders `วิดีโอเกษตร`. If real curated videos exist, it lists them. If none exist, it shows a source-pending state and a link back to Home, plus the configured owner channel URL.

`/app/youtube/:videoId` no longer falls back to legacy mock video data. Unknown IDs remain source-pending.

## 8. No-Fake-Engagement Protection

M124 does not add or display invented views, likes, comments, or engagement counts. The new `ChannelVideo` model has no engagement fields. Existing legacy mock fixtures remain in the codebase for older planning/admin surfaces, but the Home latest-video card and `/app/youtube` route no longer surface them as real channel content.

## 9. Tests / Checks Run

- `npm run test -- AppHomePage YoutubePage youtube-service` passed.
- `npm run lint` passed.
- `npm run build` passed. Vite kept the existing large chunk warning.
- `npm run test` passed: 51 files, 463 tests.
- `git diff --check` passed with Windows line-ending warnings only.
- Browser route smoke passed for `/app`, `/app/youtube`, `/app/prices`, `/app/weather`, `/app/community`, `/app/ai`, and `/app/profile`.
- Mobile smoke at 390px passed for `/app`: latest video section present/readable, pending text and CTA visible, no fake engagement, and no horizontal overflow.

## 10. Owner Action Needed To Add First Real Video

Add the first real entry to `ownerCuratedYoutubeVideos` in `src/services/youtube/youtube-manual-data.ts` using a verified YouTube video URL. Set `source: 'owner_curated'` and `isReal: true`. Add only known title, URL, optional thumbnail URL, optional published date, description, and channel name.

## 11. Next Recommended Milestone

M125 should add the first verified owner-curated agriculture video and run a release-preview QA pass. A later milestone can add a backend-owned YouTube Data API import adapter with server-side keys, quota handling, caching, and normalized read-only frontend metadata.
