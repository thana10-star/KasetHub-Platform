# M127 YouTube Cloudflare Function Latest Library Report

## 1. Summary

M127 implements the first safe backend/server-side YouTube channel adapter for KasetHub. It adds Cloudflare Pages Function endpoints for the latest owner-channel video and the owner-channel video library, then updates Home and `/app/youtube` to consume those endpoints when available.

The app still falls back to verified owner-curated manual videos and then source-pending UI. No YouTube API key is exposed to frontend code, no fake videos or fake engagement stats are added, and no unrelated Community, Weather, Prices, AI, Profile, Farm Records, or bottom nav behavior was changed.

## 2. Files Created

- `functions/api/youtube/latest.ts`
- `functions/api/youtube/videos.ts`
- `functions/api/youtube/videos.test.ts`
- `src/services/youtube/youtube-cloudflare-normalizer.ts`
- `docs/content/YOUTUBE_CLOUDFLARE_FUNCTION_M127.md`
- `docs/content/YOUTUBE_VIDEO_LIBRARY_M127.md`
- `reports/milestones/M127_YOUTUBE_CLOUDFLARE_FUNCTION_LATEST_LIBRARY_REPORT.md`

## 3. Files Modified

- `src/routes/AppHomePage.tsx`
- `src/routes/AppHomePage.test.tsx`
- `src/routes/YoutubePage.tsx`
- `src/routes/YoutubePage.test.tsx`
- `src/services/youtube/youtube-service.ts`
- `src/services/youtube/youtube-service.test.ts`
- `src/services/youtube/youtube.types.ts`
- `src/services/youtube/youtube-backend-adapter.types.ts`
- `src/services/youtube/youtube-backend-adapter-contract.test.ts`
- `src/services/qa/route-registry.ts`
- `docs/content/YOUTUBE_CHANNEL_BACKEND_ADAPTER_M126.md`
- `docs/content/YOUTUBE_API_KEY_SECURITY_M126.md`
- `docs/content/YOUTUBE_LATEST_VIDEO_INTEGRATION_M124.md`

## 4. Backend Endpoint Behavior

- `GET /api/youtube/latest` returns one latest normalized video.
- `GET /api/youtube/videos` returns up to 50 normalized videos and may include `nextPageToken`.
- Missing `YOUTUBE_API_KEY` returns `status: 'not_configured'`, `videos: []`, and a safe message.
- Failed channel resolution or YouTube API errors return `status: 'error'` unless a warm cached response exists.
- If a warm cached response exists after an API failure, the endpoint returns `status: 'stale'`.

The repo previously had no `functions/` directory and no `/api` route. M127 creates the Cloudflare Pages Function structure.

## 5. YouTube API Flow

M127 uses the official channel uploads playlist path:

1. Use `YOUTUBE_CHANNEL_ID` when provided.
2. Otherwise resolve `YOUTUBE_CHANNEL_HANDLE`, defaulting to `@ruengkaset`.
3. Call `channels.list` with `part=contentDetails,snippet`.
4. Read `contentDetails.relatedPlaylists.uploads`.
5. Call `playlistItems.list` with `part=snippet,contentDetails`.
6. Normalize playlist items to `ChannelVideo`.

M127 does not use `search.list`, does not scrape YouTube pages, and does not call `videos.list` for stats.

## 6. Frontend Fallback Behavior

Frontend fallback order:

1. Backend-normalized Cloudflare Function videos.
2. Existing owner-curated manual videos.
3. Existing source-pending UI.

Backend fetch failures are swallowed by the frontend service and do not create broken screens. Local Vite development remains source-pending because `npm run dev` does not run Cloudflare Pages Functions.

## 7. Home Latest-Video Behavior

Home now tries `/api/youtube/latest`. If the backend returns a usable real video, Home shows thumbnail, title, description, channel name, and the real YouTube URL CTA. If backend data is unavailable, Home keeps the existing manual/source-pending behavior.

## 8. `/app/youtube` Library Behavior

`/app/youtube` now tries `/api/youtube/videos`. If the backend returns usable videos, the page renders the library list with thumbnail, title, description, optional published date, channel name, and `ดูวิดีโอ` link. If backend data is unavailable, it falls back to manual/source-pending state and the owner channel link.

## 9. Security / No-Frontend-Key Checks

- `YOUTUBE_API_KEY` appears only in Cloudflare Function server code, docs, reports, and tests.
- No `VITE_YOUTUBE_API_KEY` env assignment was added.
- `.env.example` was not changed to include YouTube secrets.
- Frontend production source under `src/` is tested to avoid YouTube API secret env names.
- No fake views, likes, comments, subscriber counts, or fake channel stats were added to the M127 Home or `/app/youtube` path.

## 10. Cache / Quota Notes

Default TTL is 21600 seconds, six hours.

The functions set:

```text
Cache-Control: public, max-age=21600, stale-while-revalidate=21600
```

A simple warm-isolate in-memory cache is included, but Cloudflare Pages Functions do not guarantee memory persistence. No KV, D1, or durable backend writes are added in this milestone.

## 11. Tests / Checks Run

- Graphify context checked: `graphify-out/.graphify_analysis.json` and `graphify-out/graph.json`.
- Focused tests passed: YouTube service, backend contract, Home, `/app/youtube`, and Cloudflare Function tests.
- `npm run lint` passed.
- `npm run build` passed. Vite reported the existing large chunk warning only.
- `npm run test` passed: 53 test files, 480 tests.
- Desktop route smoke passed for `/app`, `/app/youtube`, `/app/prices`, `/app/weather`, `/app/community`, `/app/ai`, `/app/profile`.
- Mobile smoke at 390px passed for `/app` and `/app/youtube`.
- `git diff --check` passed.

Local live endpoint smoke was not run because the repo has no local Cloudflare Pages Functions runtime script. Endpoint behavior is covered by unit tests, and live endpoint smoke is owner-side/Cloudflare-side after deploy.

## 12. Owner Setup Steps

In Cloudflare Pages environment/secrets, configure:

```text
YOUTUBE_API_KEY = server-side secret
YOUTUBE_CHANNEL_HANDLE = @ruengkaset
YOUTUBE_CHANNEL_ID = optional, add when known
YOUTUBE_CACHE_TTL_SECONDS = 21600
```

Owner test URLs after deployment:

- `/api/youtube/latest`
- `/api/youtube/videos`
- `/app`
- `/app/youtube`

If the key is not set, `/api/youtube/latest` and `/api/youtube/videos` should return `not_configured` and the app should remain source-pending.

## 13. Known Limitations

- Local Vite dev server does not execute Cloudflare Pages Functions.
- Handle resolution uses `channels.list` with `forHandle`; providing `YOUTUBE_CHANNEL_ID` is the most reliable production setup.
- Pagination is limited to returning `nextPageToken`; UI load-more is a future milestone.
- No `videos.list` call is included, so duration and engagement stats are intentionally absent.
- No durable cache such as KV/D1 is added.

## 14. Next Recommended Milestone

M128 should deploy/test the Cloudflare Pages Functions with the owner secret configuration, confirm the resolved channel ID, and add optional UI load-more/pagination only after the live endpoint is stable.
