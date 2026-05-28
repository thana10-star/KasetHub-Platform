# M134 YouTube Load More / Pagination Report

## Summary

M134 adds safe load-more pagination for `/app/youtube`. The page keeps the M133 compact list layout, appends additional owner-channel videos from the backend, avoids duplicate video IDs, preserves local search over already loaded videos, and keeps the single `ดูวิดีโอ` CTA per card.

No fake videos, fake views, likes, comments, subscriber counts, frontend API keys, or YouTube `search.list` calls were added.

## Graphify Pre-check Result

Checked Graphify output before editing:

- `graphify-out/.graphify_analysis.json`
- `graphify-out/graph.json`

The graph confirmed the relevant surfaces were the YouTube Cloudflare Function, YouTube service/fallback layer, `/app/youtube` route, route registry, and YouTube tests. Actual source files were inspected after the Graphify pre-check before editing.

## Files Modified

- `functions/api/youtube/videos.ts`
- `functions/api/youtube/videos.test.ts`
- `src/services/youtube/youtube-service.ts`
- `src/services/youtube/youtube-service.test.ts`
- `src/routes/YoutubePage.tsx`
- `src/routes/YoutubePage.test.tsx`
- `src/routes/YoutubeVideoDetailPage.tsx`
- `src/services/qa/route-registry.ts`

## Backend/API Changes

- `/api/youtube/videos` now accepts `pageToken`.
- The backend passes `pageToken` to `playlistItems.list` for uploads-playlist pagination only.
- Cache keys now include page token so page one and later pages do not share cached responses.
- Existing `nextPageToken` response behavior remains.
- Existing server-side `videos.list` statistics behavior remains intact.
- View counts remain optional; missing view counts are not faked as zero.

## Frontend UI Changes

- `/app/youtube` shows `โหลดเพิ่มเติม` only when `nextPageToken` exists.
- Clicking `โหลดเพิ่มเติม` fetches the next backend page and appends videos to the existing list.
- The button shows `กำลังโหลด...` and is disabled while loading.
- Load-more failure keeps already loaded videos visible and shows a small recoverable error message.
- Duplicate videos are filtered by the in-app video identity/video ID.
- Search still filters only the currently loaded videos.
- M133 layout is preserved: thumbnail metadata stays under the thumbnail, and the right side keeps channel/title/single CTA.
- Loaded-more video links pass their already verified video metadata to the existing in-app player route, so page-two videos can open without changing the player UI.

## Tests Updated

- Backend test for passing `pageToken` to `playlistItems.list`.
- Service test for fetching paginated backend URLs.
- Service test for duplicate-safe video merging.
- Route tests for load-more button visibility, multi-page card layout, one CTA, search over loaded videos, and missing view-count behavior.
- Route test for opening a loaded-more video in the existing detail player via route state.

## Verification Results

Passed:

- `npm run lint`
- `npm run build`
- `npm run test`

Build note: Vite still reports the existing large bundle warning; this was not introduced by M134.

## Mobile Smoke Result

Used a local smoke server with mocked YouTube backend responses and a 390px headless browser.

Passed:

- `/app/youtube` initial list has no horizontal overflow.
- `โหลดเพิ่มเติม` appears when more videos exist.
- Clicking `โหลดเพิ่มเติม` appends the next page.
- Overlapping video IDs are not duplicated.
- The button disappears after the final page.
- Thumbnail metadata remains visible and compact.
- One `ดูวิดีโอ` CTA per card remains.
- Recoverable load-more error keeps existing videos visible and shows an error message.
- `/app/youtube/:videoId` remains responsive with the official player.
- Loaded-more video detail handoff keeps the official player available for videos beyond the first page.
- `/app` remains responsive and still links to the in-app player.

## Known Limitations

- M134 does not add infinite scroll.
- M134 does not add backend search or YouTube `search.list`.
- Pagination follows YouTube uploads-playlist `nextPageToken`; ordering depends on the YouTube API response.
- The UI filters only videos already loaded in the browser.

## Owner Retest Steps

1. Open `/app/youtube`.
2. Confirm the first batch of videos appears with thumbnail metadata under the image.
3. Confirm `โหลดเพิ่มเติม` appears only when more videos are available.
4. Tap `โหลดเพิ่มเติม` and confirm new videos append below existing videos.
5. Confirm duplicate videos do not appear.
6. Search in the channel search box and confirm it filters only currently loaded videos.
7. Confirm every video card has one `ดูวิดีโอ` CTA.
8. Open a video and confirm `/app/youtube/:videoId` still uses the in-app YouTube player.
9. Confirm there are no fake views, likes, comments, or subscriber counts.
