# YouTube View Count Backend Stats M132

M132 adds optional real YouTube view counts for owner-channel videos. The counts come from the backend Cloudflare Pages Function only, using the official YouTube Data API `videos.list` endpoint with `part=statistics`.

## Backend-Only Rule

View counts are never invented and are never fetched from frontend code.

- `YOUTUBE_API_KEY` stays server-side in Cloudflare Pages Functions.
- No `VITE_YOUTUBE_API_KEY` is added.
- Frontend code does not call YouTube APIs directly.
- The backend still does not use YouTube `search.list`.
- The app still does not show likes, comments, subscriber counts, or fake engagement.

## API Flow

The endpoint flow is now:

1. Resolve the channel with `channels.list`.
2. Read the uploads playlist from `contentDetails.relatedPlaylists.uploads`.
3. Read up to 50 videos with `playlistItems.list`.
4. Collect returned video IDs.
5. Call `videos.list` with `part=statistics` and the comma-separated IDs.
6. Map `statistics.viewCount` onto matching normalized `ChannelVideo` rows as `viewCount`.
7. Return videos with `viewCount` only when YouTube returned a valid integer.

If the statistics request fails, the endpoint still returns the real playlist videos without `viewCount`. A missing or invalid `viewCount` remains undefined; the app does not substitute `0`.

## Normalized Field

`ChannelVideo` now supports:

```ts
viewCount?: number;
```

The raw number is stored. Display formatting stays in the frontend helper:

```ts
formatYouTubeViewCount(value?: number): string | null
```

Current display examples:

- `999` -> `999 ครั้ง`
- `1200` -> `1.2 พันครั้ง`
- `12300` -> `1.2 หมื่นครั้ง`
- `1200000` -> `1.2 ล้านครั้ง`

If `viewCount` is missing, the helper returns `null` and the UI renders no view label.

## UI Rules

Home:

- Shows the latest real backend/manual video as before.
- Shows compact view count only when `viewCount` exists.
- Keeps the single `ดูวิดีโอ` CTA.
- Does not show likes/comments/subscribers.

`/app/youtube`:

- Shows compact view count in the card meta row when available.
- Combines date and views as a short row, for example `เผยแพร่ 25 พ.ค. 2569 · 1.2 หมื่นครั้ง`.
- Keeps one `ดูวิดีโอ` CTA per card.
- Keeps local in-channel search only.

`/app/youtube/:videoId`:

- Shows view count near the title/date when available.
- Keeps the official YouTube iframe and `เปิดใน YouTube` fallback.
- Does not autoplay or alter YouTube controls.

## Cache And Quota

The function still uses the existing cache TTL, defaulting to `21600` seconds. Each refresh can use:

- one `channels.list` request
- one `playlistItems.list` request
- one `videos.list?part=statistics` request for up to 50 IDs

With the six-hour TTL, quota use stays controlled for V1. No KV, D1, analytics tracking, or backend storage writes are added in M132.

## Missing Views

If YouTube omits statistics, the statistics call fails, or the returned count is invalid:

- `viewCount` is omitted.
- Home/list/detail do not show a view label.
- The app does not show a fake zero.

The only time `0 ครั้ง` appears is when YouTube explicitly returns a valid `viewCount` of `0`.
