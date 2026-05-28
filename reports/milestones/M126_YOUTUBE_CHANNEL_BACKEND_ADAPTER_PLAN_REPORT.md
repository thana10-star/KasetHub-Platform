# M126 YouTube Channel Backend Adapter Plan Report

## 1. Summary

M126 prepares the safe channel-based latest-video path for the owner channel `@ruengkaset` without enabling a live YouTube API call. The app still falls back to the existing source-pending/manual behavior, while the backend contract and API-key safety docs now define the next implementation step.

No YouTube API key, secret, scraper, fake latest video, fake views, fake likes, fake comments, autoplay, backend write, or unrelated feature change was added.

## 2. Why Manual-Per-Video Is Not Enough

M125 kept `ownerCuratedYoutubeVideos` empty because no verified single video URL/title was provided. The owner clarified that the channel updates often, so manual entry is useful only as a fallback. The long-term path should read the channel uploads playlist server-side, cache normalized metadata, and let Home and `/app/youtube` consume that safe response.

## 3. Current YouTube Audit

- Current channel config: `src/config/channel.ts` stores `https://www.youtube.com/@ruengkaset` and `@ruengkaset`.
- Current manual service behavior: `src/services/youtube/youtube-service.ts` returns only real, safe YouTube video URLs from `ownerCuratedYoutubeVideos`; the default list remains empty.
- Home latest video source: `src/routes/AppHomePage.tsx` reads `getLatestVideo()` and renders the source-pending card when no real video exists.
- `/app/youtube` source: `src/routes/YoutubePage.tsx` reads `listLatestVideos()` and `getYouTubeSourceStatus()`.
- Backend/server routes: existing `src/server` code is local mock handler code only, not a deployed HTTP route layer.
- Cloudflare Pages Functions: no `functions/` directory or `/api/youtube/latest` function exists in the repo as of M126.

## 4. Recommended Backend Architecture

Use a server-side endpoint, preferably a Cloudflare Pages Function or equivalent backend route:

```http
GET /api/youtube/latest
```

Data flow:

1. Backend checks cache.
2. Backend resolves channel ID from `YOUTUBE_CHANNEL_ID` or `YOUTUBE_CHANNEL_HANDLE`.
3. Backend calls `channels.list` to get `contentDetails.relatedPlaylists.uploads`.
4. Backend calls `playlistItems.list` for latest uploads.
5. Backend optionally calls `videos.list` if a future milestone needs extra public metadata.
6. Backend normalizes rows into `ChannelVideo[]`.
7. Frontend reads normalized public metadata only.
8. If backend is unavailable, frontend falls back to manual curated entries.
9. If manual entries are empty, frontend stays source-pending.

## 5. API Key Safety Plan

Server-only env names are documented:

- `YOUTUBE_API_KEY`
- `YOUTUBE_CHANNEL_ID`
- `YOUTUBE_CHANNEL_HANDLE`
- `YOUTUBE_CACHE_TTL_SECONDS`

Frontend must not define a Vite/browser YouTube API key variable. A new test scans production frontend source files and fails if the YouTube API key env name or Vite API-key variant appears in `src` outside tests.

## 6. Adapter Contract

Created `src/services/youtube/youtube-backend-adapter.types.ts` with:

- `youtubeLatestBackendEndpointPath = '/api/youtube/latest'`
- `YouTubeLatestBackendChannel`
- `YouTubeLatestBackendResponse`
- `youtubeLatestBackendContract`
- `buildNotConfiguredYouTubeLatestResponse()`

Expanded `ChannelVideo` with optional backend-normalized fields:

- `videoId`
- `fetchedAt`
- `sourceUrl`

Expanded `YouTubeSourceStatus` with backend-ready status fields while preserving the current UI `state`.

## 7. Current Frontend Behavior

Home remains source-pending because there are no manual videos and no live backend endpoint. `/app/youtube` also remains source-pending and links to the public owner channel. No UI behavior changed for Community, Weather, Prices, AI, Profile, or Farm Records.

## 8. Tests/Checks Run

- Graphify context checked: `graphify-out/.graphify_analysis.json`, `graphify-out/graph.json`.
- Focused tests: `npm run test -- src/services/youtube/youtube-service.test.ts src/services/youtube/youtube-backend-adapter-contract.test.ts src/routes/YoutubePage.test.tsx src/routes/AppHomePage.test.tsx` passed.
- `npm run lint` passed.
- `npm run build` passed. Vite reported the existing large chunk warning only.
- `npm run test` passed: 52 files, 470 tests.
- Desktop route smoke passed for `/app`, `/app/youtube`, `/app/prices`, `/app/weather`, `/app/community`, `/app/ai`, `/app/profile`; no Vite overlay or console errors.
- Mobile smoke at 390px passed for `/app` and `/app/youtube`; scroll width matched viewport width, pending video copy was present, and no fake YouTube engagement was detected.
- `git diff --check` passed.

## 9. Owner Actions Needed

To enable live latest videos in a future milestone, the owner should provide or configure:

- YouTube Data API key as a server-side secret only.
- Confirmed channel ID, or permission to resolve/cache it from `@ruengkaset`.
- Cache TTL preference.
- Backend deployment target, such as Cloudflare Pages Functions.

No owner action is needed for the current frontend source-pending state.

## 10. Next Recommended Milestone

M127 should add the actual server-side `/api/youtube/latest` function once the backend runtime and secret store are confirmed. It should return `not_configured` without a secret, call YouTube only server-side when env is present, cache normalized results, and keep manual/source-pending fallback intact.
