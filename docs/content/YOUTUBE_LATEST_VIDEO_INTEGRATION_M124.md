# YouTube Latest Video Integration M124

M124 adds a safe V1 foundation for showing real owner-channel videos without using the YouTube Data API in the browser.

## Owner-Curated Source Format

Owner-curated entries live in:

- `src/services/youtube/youtube-manual-data.ts`

Each entry must match `ChannelVideo` from `src/services/youtube/youtube.types.ts`:

```ts
{
  id: 'short-stable-id',
  title: 'Real video title',
  url: 'https://www.youtube.com/watch?v=REAL_VIDEO_ID',
  thumbnailUrl: 'https://img.youtube.com/vi/REAL_VIDEO_ID/hqdefault.jpg',
  publishedAt: '2026-05-20T00:00:00.000Z',
  description: 'Short real description from the owner/editor.',
  source: 'owner_curated',
  isReal: true,
  channelName: 'Channel display name',
}
```

The default list is empty. That keeps Home and `/app/youtube` in a source-pending state until the owner selects a real video.

## Why No Fake Stats

M124 must not invent views, likes, comments, publish dates, thumbnails, or engagement. If a field is not known from the real video or owner input, it should be omitted. This protects user trust and avoids making the app look more connected than it is.

## How To Add The First Real Video Safely

1. Confirm the video belongs to the owner channel or another source the owner is allowed to feature.
2. Copy the canonical YouTube video URL.
3. Add one `ChannelVideo` entry to `ownerCuratedYoutubeVideos`.
4. Set `source: 'owner_curated'` and `isReal: true`.
5. Add only known metadata. Leave optional fields out if uncertain.
6. Run lint, build, tests, and route smoke.

Do not add view counts, like counts, comment counts, or guessed dates.

## Future Backend / YouTube API Plan

A future milestone can add a backend-owned YouTube import path:

- Store YouTube API keys server-side only.
- Run channel/playlist imports from a backend job or API route.
- Normalize API results into the `ChannelVideo` shape before sending them to the frontend.
- Add caching, quota handling, retries, and audit logs server-side.
- Keep the frontend as a read-only consumer.

M126 adds the planning contract for this path in:

- `docs/content/YOUTUBE_CHANNEL_BACKEND_ADAPTER_M126.md`
- `docs/content/YOUTUBE_API_KEY_SECURITY_M126.md`
- `src/services/youtube/youtube-backend-adapter.types.ts`

The recommended future endpoint was `GET /api/youtube/latest`. M127 adds Cloudflare Pages Function endpoints for:

- `GET /api/youtube/latest`
- `GET /api/youtube/videos`

The frontend now tries the backend first and falls back to manual/source-pending behavior when the backend is unavailable, not configured, or empty.

## No Frontend API Key Rule

Never expose a YouTube API key, OAuth refresh token, service-role key, or import secret in frontend code, Vite env values, bundled config, localStorage, or checked-in docs. Browser code may only read already-approved public video metadata.
