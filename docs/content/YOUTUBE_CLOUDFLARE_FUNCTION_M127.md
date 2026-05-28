# YouTube Cloudflare Function M127

M127 adds Cloudflare Pages Function endpoints for server-side YouTube latest-video and video-library reads.

Endpoints:

```http
GET /api/youtube/latest
GET /api/youtube/videos
```

The endpoints use the official YouTube Data API channel uploads playlist flow. They do not scrape YouTube pages and do not use `search.list` as the main path.

Official API references:

- `channels.list`: https://developers.google.com/youtube/v3/docs/channels/list
- `playlistItems.list`: https://developers.google.com/youtube/v3/docs/playlistItems/list

## Files

- `functions/api/youtube/latest.ts`
- `functions/api/youtube/videos.ts`
- `src/services/youtube/youtube-cloudflare-normalizer.ts`

## Server-Side Env

Configure these in Cloudflare Pages Function environment/secrets, not Vite:

```text
YOUTUBE_API_KEY
YOUTUBE_CHANNEL_HANDLE=@ruengkaset
YOUTUBE_CHANNEL_ID=
YOUTUBE_CACHE_TTL_SECONDS=21600
```

`YOUTUBE_API_KEY` must stay server-side. Do not add `VITE_YOUTUBE_API_KEY`.

`YOUTUBE_CHANNEL_ID` is optional. If it is not configured, the function attempts to resolve the channel from `YOUTUBE_CHANNEL_HANDLE` using `channels.list` with `forHandle`. If handle resolution fails in production, add the channel ID as `YOUTUBE_CHANNEL_ID`.

## Response Behavior

When the server key is missing:

```json
{
  "status": "not_configured",
  "channel": {
    "handle": "@ruengkaset",
    "url": "https://www.youtube.com/@ruengkaset"
  },
  "cacheTtlSeconds": 21600,
  "videos": [],
  "errorMessage": "YouTube server API key is not configured."
}
```

When ready, the function returns normalized `ChannelVideo` rows with:

- `id`
- `videoId`
- `title`
- `description`
- `publishedAt`
- `thumbnailUrl`
- `url`
- `channelName`
- `source: 'youtube_api'`
- `isReal: true`
- `fetchedAt`
- `sourceUrl`

No views, likes, comments, subscriber counts, or fake engagement fields are returned.

## YouTube API Flow

1. Read server env.
2. Resolve the channel by `YOUTUBE_CHANNEL_ID` or `YOUTUBE_CHANNEL_HANDLE`.
3. Call `channels.list` with `part=contentDetails,snippet`.
4. Read `contentDetails.relatedPlaylists.uploads`.
5. Call `playlistItems.list` with `part=snippet,contentDetails`.
6. Return one latest video from `/api/youtube/latest`.
7. Return up to 50 videos from `/api/youtube/videos`.

## Cache And Quota Notes

The function sets response cache headers:

```text
Cache-Control: public, max-age=21600, stale-while-revalidate=21600
```

It also uses a simple in-memory cache for warm isolates. Cloudflare Pages Functions do not guarantee that memory persists, so response cache headers are the reliable V1 cache layer. No KV, D1, or backend storage writes are added in M127.

If the YouTube API fails and a warm cached response exists, the endpoint returns `status: 'stale'` with cached videos. Without a cache, it returns `status: 'error'` and `videos: []`.

## Local Runtime Note

The existing `npm run dev` Vite server does not run Cloudflare Pages Functions. Function behavior is covered by unit tests locally. Live endpoint smoke should be run in Cloudflare Pages or a future local Pages runtime.
