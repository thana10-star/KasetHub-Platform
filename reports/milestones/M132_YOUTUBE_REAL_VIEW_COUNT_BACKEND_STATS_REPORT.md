# M132 YouTube Real View Count Backend Stats Report

## 1. Summary

M132 adds real optional YouTube view counts to the existing backend YouTube adapter. The Cloudflare Function still loads channel videos through the uploads playlist flow, then calls backend-only `videos.list?part=statistics` for the returned video IDs and maps valid `statistics.viewCount` values into `ChannelVideo.viewCount`.

No fake views, likes, comments, subscribers, frontend YouTube API calls, or frontend API keys were added.

## 2. Files Created

- `docs/content/YOUTUBE_VIEW_COUNT_BACKEND_STATS_M132.md`
- `reports/milestones/M132_YOUTUBE_REAL_VIEW_COUNT_BACKEND_STATS_REPORT.md`

## 3. Files Modified

- `functions/api/youtube/videos.ts`
- `functions/api/youtube/videos.test.ts`
- `src/services/youtube/youtube.types.ts`
- `src/services/youtube/youtube-cloudflare-normalizer.ts`
- `src/services/youtube/youtube-service.ts`
- `src/services/youtube/youtube-service.test.ts`
- `src/routes/AppHomePage.tsx`
- `src/routes/AppHomePage.test.tsx`
- `src/routes/YoutubePage.tsx`
- `src/routes/YoutubePage.test.tsx`
- `src/routes/YoutubeVideoDetailPage.tsx`
- `src/services/qa/route-registry.ts`
- `docs/content/YOUTUBE_CLOUDFLARE_FUNCTION_M127.md`
- `docs/content/YOUTUBE_VIDEO_LIBRARY_M127.md`
- `docs/content/YOUTUBE_IN_APP_PLAYER_M130.md`
- `docs/content/YOUTUBE_SINGLE_CTA_SEARCH_M131.md`

## 4. Backend Statistics Behavior

After `playlistItems.list` succeeds, the function collects video IDs and calls `videos.list` with `part=statistics` server-side. It requests only statistics needed for real view counts.

If the statistics request fails, the endpoint still returns the real playlist videos without `viewCount`. If there are no video IDs, it skips the statistics request.

## 5. Normalization Behavior

`ChannelVideo` now has optional `viewCount?: number`.

The normalizer merges playlist metadata with `videos.list` statistics by `videoId`, parses `statistics.viewCount` as a safe non-negative integer, and omits invalid or missing counts. Missing views are not converted to fake zero.

## 6. View Count Formatting

The frontend formats real counts with `formatYouTubeViewCount()`:

- `999` -> `999 ครั้ง`
- `1200` -> `1.2 พันครั้ง`
- `12300` -> `1.2 หมื่นครั้ง`
- `1200000` -> `1.2 ล้านครั้ง`

`undefined` returns `null`, so the UI shows nothing when YouTube does not provide a count.

## 7. Home Behavior

Home still prefers the backend latest video, then manual fallback, then source-pending. When `viewCount` exists, the compact latest-video card shows the Thai view count label under the title/stale row. The CTA remains one `ดูวิดีโอ` button.

## 8. /app/youtube Behavior

The video library keeps the compact M131 list and local in-channel search. Cards show published date and real view count in a compact meta row when available, for example `เผยแพร่ 28 พ.ค. 2569 · 1.2 หมื่นครั้ง`.

Cards still use one `ดูวิดีโอ` CTA and do not show fake engagement.

## 9. Detail Page Behavior

`/app/youtube/:videoId` shows the real view count near the date when available. The page still uses the official YouTube iframe, does not autoplay, and keeps the `เปิดใน YouTube` fallback.

## 10. Quota/Cache Notes

Each cache refresh can use one `channels.list`, one `playlistItems.list`, and one `videos.list?part=statistics` call for up to 50 IDs. The existing default cache TTL remains `21600` seconds, which keeps V1 quota use controlled. No KV, D1, analytics, or backend writes were added.

## 11. Security/No-Frontend-Key Checks

`YOUTUBE_API_KEY` remains server-side in Cloudflare Function code. A static check over non-test `src` files found no `YOUTUBE_API_KEY` or `VITE_YOUTUBE_API_KEY` references.

The implementation does not call YouTube APIs from frontend code and does not use YouTube `search.list`.

## 12. Tests/Checks Run

- `npm run lint` passed.
- `npm run build` passed. Vite emitted the existing large-chunk warning; generated build artifacts were restored afterward.
- `npm run test` passed: 53 files, 498 tests.
- Focused YouTube/Home tests passed: 4 files, 56 tests.
- `git diff --check` passed.
- Route smoke passed with HTTP 200: `/app`, `/app/youtube`, `/app/youtube/m132-smoke-video`, `/app/prices`, `/app/weather`, `/app/community`, `/app/ai`, `/app/profile`.
- Mobile smoke at 390px passed with stubbed backend-ready YouTube data: `/app`, `/app/youtube`, and `/app/youtube/m132-smoke-video` had no horizontal overflow, showed `1.2 หมื่นครั้ง`, did not show `views`/fake Thai engagement labels, and the detail iframe had no `autoplay=1`.

## 13. Known Limitations

Local Vite does not run Cloudflare Pages Functions, so endpoint live smoke still needs Cloudflare production/staging. Local browser smoke used intercepted backend JSON to validate the frontend ready-state UI.

View counts depend on YouTube returning public statistics. If statistics are hidden, missing, invalid, or the statistics call fails, KasetHub hides the view label instead of guessing.

## 14. Owner Retest Steps

1. Open `/api/youtube/videos` after deploy and confirm returned videos include `viewCount` when YouTube provides it.
2. Open `/app` and confirm the latest-video card shows a compact real view count if available.
3. Open `/app/youtube` and confirm video cards show compact real view counts.
4. Open a video detail page and confirm the view count appears near the title/date.
5. Confirm likes, comments, subscriber counts, and fake engagement do not appear.
6. Confirm if `viewCount` is missing, the UI does not show fake `0 ครั้ง` unless YouTube actually returned zero.

## 15. Next Recommended Milestone

M133 should do production/staging verification of real `viewCount` values from `@ruengkaset`, including quota monitoring after deploy, a sample endpoint response capture without secrets, and any small typography adjustments from owner mobile review.
