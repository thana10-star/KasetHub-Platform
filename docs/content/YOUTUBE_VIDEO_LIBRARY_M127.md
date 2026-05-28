# YouTube Video Library M127

M127 makes `/app/youtube` ready to behave as the owner-channel video library instead of a one-video manual list.

## Frontend Behavior

Home:

1. Calls `/api/youtube/latest` in the browser.
2. If the response is `ready` or `stale` and includes a valid video, Home renders that latest video.
3. If the backend is `not_configured`, `error`, unavailable, or empty, Home falls back to owner-curated manual videos.
4. If manual videos are empty, Home keeps the source-pending card.

`/app/youtube`:

1. Calls `/api/youtube/videos`.
2. If the response is `ready` or `stale` and includes valid videos, the page renders the latest channel video list.
3. The page shows channel display information when the backend returns it.
4. If the backend is unavailable or empty, the page falls back to manual entries.
5. If manual entries are empty, the page keeps the source-pending state and owner-channel link.

## Video Cards

Cards can show:

- thumbnail
- title
- published date if provided by the backend
- channel name if provided
- `ดูวิดีโอ` link to the real YouTube URL

After M128/M129, Home and the `/app/youtube` list intentionally do not render long description blocks. Descriptions may remain in normalized data for future detail surfaces, but list cards stay title-focused.

Cards must not show:

- fake views
- fake likes
- fake comments
- fake subscriber counts
- guessed duration
- guessed publish dates

## Fallback Contract

Fallback order:

1. Backend-normalized videos from Cloudflare Pages Function.
2. Owner-curated manual videos in `src/services/youtube/youtube-manual-data.ts`.
3. Source-pending UI.

Manual entries remain a safety fallback, not the intended long-term channel update path.

## Owner Setup

In Cloudflare Pages, configure:

```text
YOUTUBE_API_KEY = server-side secret
YOUTUBE_CHANNEL_HANDLE = @ruengkaset
YOUTUBE_CHANNEL_ID = optional
YOUTUBE_CACHE_TTL_SECONDS = 21600
```

After deployment, test:

- `/api/youtube/latest`
- `/api/youtube/videos`
- `/app`
- `/app/youtube`

If the key is not configured, the endpoints should return `not_configured` and the app should remain source-pending rather than showing fake data.
