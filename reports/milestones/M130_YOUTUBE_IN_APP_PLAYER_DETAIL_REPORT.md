# M130 YouTube In-App Player Detail Report

## 1. Summary

M130 adds an in-app YouTube video player detail page using the official YouTube iframe embed. Home and `/app/youtube` now route videos with a real `videoId` to `/app/youtube/:videoId` first, while preserving the external YouTube fallback.

No backend secret handling changed, no API key was exposed to frontend code, no fake engagement stats were added, and no video download/proxy/self-host behavior was added.

## 2. Current Behavior Audit

- Graphify context was checked first from `graphify-out/.graphify_analysis.json` and `graphify-out/graph.json`, then actual source files were inspected.
- Before M130, Home rendered a compact latest-video card but its real-video CTA opened the YouTube URL directly.
- Before M130, `/app/youtube` rendered compact list cards but each real-video CTA opened the YouTube URL directly.
- `/app/youtube/:videoId` already existed, but it only searched manual videos and did not render an iframe player.
- Available detail metadata includes `id`, `videoId`, `title`, `url`, `thumbnailUrl`, `publishedAt`, `description`, `channelName`, `source`, `isReal`, `fetchedAt`, and `sourceUrl`.

## 3. Files Created

- `docs/content/YOUTUBE_IN_APP_PLAYER_M130.md`
- `reports/milestones/M130_YOUTUBE_IN_APP_PLAYER_DETAIL_REPORT.md`

## 4. Files Modified

- `src/services/youtube/youtube-service.ts`
- `src/services/youtube/youtube-service.test.ts`
- `src/routes/AppHomePage.tsx`
- `src/routes/AppHomePage.test.tsx`
- `src/routes/YoutubePage.tsx`
- `src/routes/YoutubePage.test.tsx`
- `src/routes/YoutubeVideoDetailPage.tsx`
- `src/services/qa/route-registry.ts`
- `docs/content/YOUTUBE_VIDEO_LIBRARY_M127.md`
- `docs/content/YOUTUBE_LIVE_ENDPOINT_VERIFICATION_M129.md`

## 5. Player Route Behavior

`/app/youtube/:videoId` now:

- loads the same backend/manual fallback video list as `/app/youtube`
- finds videos by either backend `videoId` or internal `id`
- renders `https://www.youtube.com/embed/{videoId}` in a responsive 16:9 iframe when `videoId` exists
- shows title, channel/source label, and published date when available
- keeps `เปิดใน YouTube` visible
- links back to `วิดีโอทั้งหมด`

## 6. Home/List Link Behavior

- Home keeps the compact M128/M129 card and routes `ดูวิดีโอ` to `/app/youtube/:videoId` when a real `videoId` exists.
- Home falls back to the external URL only when a real video lacks `videoId`.
- `/app/youtube` uses `ดูในแอพ` as the primary action when `videoId` exists.
- `/app/youtube` also keeps `เปิด YouTube` as a small external fallback.

## 7. Official YouTube Player Rules

The iframe uses:

- `allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"`
- `allowFullScreen`
- `referrerPolicy="strict-origin-when-cross-origin"`
- `loading="lazy"`

No `autoplay=1` query parameter is added, and the app does not hide or replace YouTube controls.

## 8. Ads/Monetization Note

Ads and monetization are controlled by YouTube and by the channel/video embed settings. KasetHub does not add separate ads, alter YouTube playback, download videos, proxy streams, or self-host video files.

## 9. Fallback Behavior

- If the iframe cannot play, users can use `เปิดใน YouTube`.
- If the route cannot find a matching video, it shows `ยังไม่พบวิดีโอนี้`, links to `วิดีโอทั้งหมด`, and links to the owner channel when configured.
- If a real video lacks `videoId`, the page does not invent an embed and offers the external YouTube link.

## 10. Tests/Checks Run

- Focused tests: `npm run test -- src/services/youtube/youtube-service.test.ts src/routes/AppHomePage.test.tsx src/routes/YoutubePage.test.tsx` - passed, 44 tests.
- `npm run lint` - passed.
- `npm run build` - passed, with the existing Vite large chunk warning.
- `npm run test` - passed, 53 files and 490 tests.
- `git diff --check` - passed.
- API key source check: `YOUTUBE_API_KEY` references remain limited to Cloudflare Functions, tests, and docs; no `VITE_YOUTUBE_API_KEY` was added.
- Browser route smoke with local Vite:
  - `/app` passed.
  - `/app/youtube` passed.
  - `/app/youtube/sample-video-id` passed as the local no-backend fallback detail route.
  - `/app/prices` passed.
  - `/app/weather` passed.
  - `/app/community` passed.
  - `/app/ai` passed.
  - `/app/profile` passed.
- Mobile smoke at 390px:
  - `/app` had no horizontal overflow.
  - `/app/youtube` had no horizontal overflow.
  - `/app/youtube/sample-video-id` had no horizontal overflow and showed both the video-library link and owner-channel external fallback.

## 11. Owner Retest Steps

1. Open `/api/youtube/latest` and confirm `status: "ready"`.
2. Open `/api/youtube/videos` and confirm `status: "ready"` with videos that include `videoId`.
3. Open `/app` and tap `ดูวิดีโอ` on the latest-video card.
4. Confirm it opens `/app/youtube/:videoId` inside KasetHub.
5. Confirm the embedded YouTube player appears without autoplay.
6. Tap `เปิดใน YouTube` and confirm the external fallback works.
7. Open `/app/youtube` and confirm list cards use `ดูในแอพ` first and `เปิด YouTube` as fallback.
8. Confirm no fake views, likes, comments, subscribers, or long description blocks appear.

## 12. Known Limitations

- Local Vite does not execute Cloudflare Pages Functions, so local browser smoke cannot show a live backend video in the player route.
- The iframe render is covered by component tests with injected real video data.
- Unknown local detail routes correctly show the safe fallback state.
- No pagination/load-more, saved-video behavior, or engagement stats were added.

## 13. Next Recommended Milestone

M131 should add production-focused player QA and optional video-library pagination/load-more using the existing backend `nextPageToken` contract, still without frontend secrets or fake engagement stats.
