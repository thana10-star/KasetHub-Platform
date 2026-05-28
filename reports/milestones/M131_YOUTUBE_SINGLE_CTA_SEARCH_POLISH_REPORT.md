# M131 YouTube Single CTA Search Polish Report

## 1. Summary

M131 polishes the YouTube library after the in-app player milestone. Home keeps a single `ดูวิดีโอ` CTA, `/app/youtube` list cards now use one `ดูวิดีโอ` action per card, and the video library has a compact client-side search field for videos already loaded from the owner channel.

No backend/API/security behavior changed. No YouTube `search.list`, no `videos.list`/statistics, no view counts, no fake engagement, and no frontend API key were added.

## 2. Owner Feedback Addressed

- Removed the extra `เปิด YouTube` action from `/app/youtube` list cards.
- Kept the external `เปิดใน YouTube` fallback inside `/app/youtube/:videoId`.
- Added a compact in-channel search box for loaded channel videos.
- Kept Home and library cards title-focused and compact.

## 3. Files Created

- `docs/content/YOUTUBE_SINGLE_CTA_SEARCH_M131.md`
- `reports/milestones/M131_YOUTUBE_SINGLE_CTA_SEARCH_POLISH_REPORT.md`

## 4. Files Modified

- `src/routes/YoutubePage.tsx`
- `src/routes/YoutubePage.test.tsx`
- `src/routes/AppHomePage.test.tsx`
- `src/services/youtube/youtube-service.ts`
- `src/services/youtube/youtube-service.test.ts`
- `src/services/qa/route-registry.ts`
- `docs/content/YOUTUBE_IN_APP_PLAYER_M130.md`
- `docs/content/YOUTUBE_VIDEO_LIBRARY_M127.md`

## 5. Single CTA Behavior

Home:

- The latest-video CTA remains `ดูวิดีโอ`.
- If `videoId` exists, the CTA routes to `/app/youtube/:videoId`.
- If `videoId` is missing, the CTA can still open the real YouTube URL.
- No second `เปิด YouTube` action was added to the Home card.

`/app/youtube`:

- Cards with `videoId` now show one `ดูวิดีโอ` action to the in-app player route.
- Cards without `videoId` can use the same single `ดูวิดีโอ` action as an external fallback.
- The list no longer renders an `เปิด YouTube` button on every card.

## 6. Search Behavior

- Search field label: `ค้นหาวิดีโอในช่อง`.
- Placeholder: `ค้นหาเรื่องที่สนใจ เช่น ขุดสระ ปุ๋ย น้ำ`.
- Filtering is local to the currently loaded `ChannelVideo[]`.
- Matching checks title and description.
- Empty search restores the full loaded list.
- No-match copy: `ไม่พบวิดีโอที่ตรงกับคำค้น`.
- `ล้างคำค้น` clears an active search.

## 7. Detail Fallback Behavior

`/app/youtube/:videoId` still shows the official YouTube iframe and keeps `เปิดใน YouTube` visible. This is the only routine external YouTube fallback for videos that have `videoId`.

## 8. Why View Count Is Deferred

Real view counts require `videos.list` with `statistics`, quota review, cache policy, and UI rules. M131 intentionally avoids that scope and does not invent views, likes, comments, subscribers, or engagement.

## 9. Tests/Checks Run

- Graphify context checked first: `graphify-out/.graphify_analysis.json` and `graphify-out/graph.json`.
- Focused tests: `npm run test -- src/routes/AppHomePage.test.tsx src/routes/YoutubePage.test.tsx src/services/youtube/youtube-service.test.ts` - passed, 48 tests.
- `npm run lint` - passed.
- `npm run build` - passed, with the existing Vite large chunk warning.
- `npm run test` - passed, 53 files and 494 tests.
- `git diff --check` - passed.
- Static safety check: no `VITE_YOUTUBE_API_KEY` was added; M131 did not add code calls to YouTube `search.list` or `videos.list` statistics.
- Browser route smoke with local Vite and stubbed YouTube ready responses:
  - `/app` passed.
  - `/app/youtube` passed.
  - `/app/youtube/m131-smoke-pond` passed.
  - `/app/prices` passed.
  - `/app/weather` passed.
  - `/app/community` passed.
  - `/app/ai` passed.
  - `/app/profile` passed.
- Mobile smoke at 390px:
  - `/app/youtube` had no horizontal overflow.
  - Search field fit within the viewport.
  - Two loaded video cards rendered two in-app video links and zero external YouTube list links.
  - Search filtered to the matching loaded video.
  - Clear restored the full list.
  - `/app/youtube/m131-smoke-pond` showed the iframe and one external YouTube detail fallback.

## 10. Owner Retest Steps

1. Open `/app` and confirm the latest video card has one `ดูวิดีโอ` button.
2. Open `/app/youtube` and confirm each card has only one `ดูวิดีโอ` button.
3. Tap `ดูวิดีโอ` and confirm it opens the in-app player route.
4. On the player route, confirm `เปิดใน YouTube` is still visible.
5. Search for a term like `ขุดสระ`, `ปุ๋ย`, or `น้ำ`.
6. Confirm the list filters without a page reload.
7. Tap `ล้างคำค้น` and confirm the full loaded list returns.
8. Confirm no views, likes, comments, subscriber counts, or fake engagement appear.

## 11. Next Recommended Milestone

M132 should evaluate real YouTube view-count support as a separate backend/statistics milestone, including `videos.list` quota impact, cache TTL, and UI display rules.
