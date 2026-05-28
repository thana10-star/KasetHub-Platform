# YouTube Channel Backend Adapter M126

M126 prepared the channel-based latest-video path for the owner channel without enabling a live YouTube request from the browser. M127 implements the first Cloudflare Pages Function adapter from this plan.

Owner channel:

- handle: `@ruengkaset`
- URL: `https://www.youtube.com/@ruengkaset`

## Current Audit

- Channel config exists in `src/config/channel.ts` as `youtubeChannelUrl` and `youtubeChannelHandle`.
- Manual latest-video data lives in `src/services/youtube/youtube-manual-data.ts` and is currently empty.
- Home reads `getLatestVideo()` from `src/services/youtube/youtube-service.ts`.
- `/app/youtube` reads `listLatestVideos()` and `getYouTubeSourceStatus()`.
- `/app/youtube/:videoId` reads `getChannelVideoById()` and stays source-pending for unknown IDs.
- Existing server-shaped code is limited to local mock handlers under `src/server`.
- No Cloudflare Pages Functions directory or `/api/youtube/latest` route existed in the repo as of M126.

M127 adds:

- `functions/api/youtube/latest.ts`
- `functions/api/youtube/videos.ts`
- `docs/content/YOUTUBE_CLOUDFLARE_FUNCTION_M127.md`
- `docs/content/YOUTUBE_VIDEO_LIBRARY_M127.md`

## Recommended Architecture

Use a backend endpoint or Cloudflare Pages Function that owns the YouTube Data API call and returns normalized public video metadata to the frontend.

Recommended endpoint:

```http
GET /api/youtube/latest
GET /api/youtube/videos
```

Server-only environment variables:

```text
YOUTUBE_API_KEY
YOUTUBE_CHANNEL_ID
YOUTUBE_CHANNEL_HANDLE
YOUTUBE_CACHE_TTL_SECONDS
```

Notes:

- `YOUTUBE_API_KEY` must exist only in backend/server runtime configuration.
- `YOUTUBE_CHANNEL_ID` is preferred when known.
- `YOUTUBE_CHANNEL_HANDLE` can be used by the backend to resolve the channel before caching the resolved channel ID.
- `YOUTUBE_CACHE_TTL_SECONDS` controls cache freshness and protects quota.
- Do not create `VITE_YOUTUBE_API_KEY`.

## Data Flow

1. Backend receives `GET /api/youtube/latest` or `GET /api/youtube/videos`.
2. Backend checks cache. If fresh, return the cached normalized response.
3. Backend resolves the channel ID from `YOUTUBE_CHANNEL_ID` or `YOUTUBE_CHANNEL_HANDLE`.
4. Backend calls `channels.list` to read `contentDetails.relatedPlaylists.uploads`.
5. Backend calls `playlistItems.list` for the uploads playlist.
6. Backend may call `videos.list` only if extra metadata is needed.
7. Backend normalizes the result to `ChannelVideo[]`.
8. Frontend consumes the normalized result.
9. If the backend fails or is not configured, frontend falls back to owner-curated manual videos.
10. If manual videos are also empty, frontend keeps the source-pending state.

M127 keeps this fallback order and uses `/api/youtube/videos` for the library page.

## Adapter Contract

Frontend contract file:

- `src/services/youtube/youtube-backend-adapter.types.ts`

Response shape:

```ts
type YouTubeLatestBackendResponse = {
  status: 'not_configured' | 'ready' | 'error' | 'stale';
  channel: {
    id?: string;
    channelId?: string;
    handle?: string;
    channelHandle?: string;
    title?: string;
    url?: string;
    channelUrl?: string;
    channelName?: string;
    uploadsPlaylistId?: string;
  };
  fetchedAt?: string;
  cacheTtlSeconds?: number;
  nextPageToken?: string;
  videos: ChannelVideo[];
  errorMessage?: string;
};
```

`ChannelVideo` supports backend-normalized fields:

- `id`
- `videoId`
- `title`
- `url`
- `thumbnailUrl`
- `publishedAt`
- `description`
- `channelName`
- `source: 'youtube_api'`
- `isReal: true`
- `fetchedAt`
- `sourceUrl`

Do not add views, likes, comments, subscriber counts, guessed publish dates, or guessed durations unless a future milestone explicitly designs and verifies those fields.

## Not Configured Response

If the server is missing its API key or channel configuration, return:

```json
{
  "status": "not_configured",
  "channel": {
    "channelHandle": "@ruengkaset",
    "channelUrl": "https://www.youtube.com/@ruengkaset"
  },
  "videos": []
}
```

This lets Home and `/app/youtube` remain honest without fake video rows.

## Error And Stale Behavior

- `error`: backend call failed and no usable cache exists. Frontend should fall back to manual videos or source-pending.
- `stale`: backend call failed but a cached normalized list exists. Frontend may render the cached list only if the backend marks it stale and includes a `fetchedAt` value.
- `ready`: backend returned normalized videos from the owner channel.
- `not_configured`: backend lacks server-side configuration and should not call YouTube.

## Future Implementation Checklist

1. Add a backend runtime with a private env surface.
2. Add `GET /api/youtube/latest`.
3. Keep the API key server-side only.
4. Cache responses by channel ID and uploads playlist ID.
5. Normalize YouTube API rows into `ChannelVideo`.
6. Filter out invalid video URLs before returning to the frontend.
7. Preserve manual fallback.
8. Add route smoke and mobile smoke.
9. Add monitoring for API errors and quota exhaustion.
10. Keep frontend behavior source-pending until the backend returns verified real videos.
