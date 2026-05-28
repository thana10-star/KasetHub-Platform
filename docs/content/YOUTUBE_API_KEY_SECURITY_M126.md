# YouTube API Key Security M126

M126 keeps the YouTube Data API key out of frontend code and prepares a server-only path for future channel latest-video sync. M127 implements the first Cloudflare Pages Function endpoints while keeping the same server-only key rule.

## Rule

`YOUTUBE_API_KEY` is a server-side secret. It must not be committed, bundled, logged, copied into screenshots, or exposed through Vite/browser environment variables.

Never create a Vite/browser variable named `VITE_YOUTUBE_API_KEY`.

Frontend code may know the public owner channel handle and URL:

```text
@ruengkaset
https://www.youtube.com/@ruengkaset
```

Frontend code must not know the private API key.

## Allowed Places

The API key may live only in backend runtime configuration, for example:

- Cloudflare Pages Function secret variables.
- A server process environment that is not bundled into Vite.
- A CI/CD secret store used only by backend deploy steps.

## Disallowed Places

Do not place the API key in:

- `src/`
- `.env.example` as a Vite variable
- `VITE_*` variables
- localStorage/sessionStorage
- checked-in reports or screenshots
- client-side config files
- route registry metadata
- frontend tests as a usable value

M127 permits server-side function files under `functions/api/youtube/` to read `YOUTUBE_API_KEY` from `context.env`. Frontend files under `src/` must still not reference the key name or any key value.

Docs may mention the variable name `YOUTUBE_API_KEY`, but must never contain an actual key value.

## Backend Env Contract

Future backend/server env variables:

```text
YOUTUBE_API_KEY
YOUTUBE_CHANNEL_ID
YOUTUBE_CHANNEL_HANDLE
YOUTUBE_CACHE_TTL_SECONDS
```

`YOUTUBE_CHANNEL_ID` can be optional if the backend safely resolves the channel from `YOUTUBE_CHANNEL_HANDLE` and then caches the resolved ID.

## Frontend Contract

Frontend should consume only a normalized endpoint response:

```http
GET /api/youtube/latest
GET /api/youtube/videos
```

The response should contain public video metadata only:

- video ID
- title
- canonical YouTube URL
- thumbnail URL if provided by the backend
- published date if provided by the backend
- description if provided by the backend
- channel display data
- fetch/cache status

No fake engagement data should be added. No secret source fields should be returned.

## Failure Behavior

If the backend is missing config or the YouTube API fails:

1. Return `status: 'not_configured'` or `status: 'error'`.
2. Return `videos: []` unless a deliberately marked stale cache is available.
3. Let the frontend fall back to owner-curated manual videos.
4. If there are no manual videos, keep the source-pending UI.

This is safer than rendering fake latest videos or exposing a key to make the browser fetch YouTube directly.
