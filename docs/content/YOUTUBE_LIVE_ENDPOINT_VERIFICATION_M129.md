# YouTube Live Endpoint Verification M129

M129 records the first owner production verification for the Cloudflare Pages Function YouTube adapter and documents the UI states added around the live endpoint.

## Owner Production Evidence

Owner production testing confirmed:

- `/api/youtube/latest` returned `status: "ready"`.
- The channel resolved from handle `@ruengkaset`.
- The resolved channel name was `เรื่องเกษตรที่คนไทยควรรู้`.
- The latest real video returned from the YouTube Data API was:
  - `แจกแบบแปลนขุดสระ 3 ไร่ มีเกาะกลางน้ำ พร้อมเทคนิคคำนวณสโลปกันดินสไลด์`

No API key is included in this document.

## Endpoint Contract

Production endpoints:

```http
GET /api/youtube/latest
GET /api/youtube/videos
```

The backend uses the YouTube Data API server-side through Cloudflare Pages Functions:

1. Resolve channel by `YOUTUBE_CHANNEL_ID` when configured, otherwise `YOUTUBE_CHANNEL_HANDLE`.
2. Read the channel uploads playlist with `channels.list`.
3. Read latest videos from the uploads playlist with `playlistItems.list`.
4. Normalize items into `ChannelVideo`.
5. Return `ready`, `not_configured`, `error`, or `stale`.

## Security Rules

- `YOUTUBE_API_KEY` is server-side only.
- Do not add `VITE_YOUTUBE_API_KEY`.
- Do not commit secrets.
- Do not scrape YouTube pages.
- Do not show fake views, likes, comments, subscribers, or guessed stats.

## Cache TTL

The production cache TTL remains:

```text
YOUTUBE_CACHE_TTL_SECONDS=21600
```

This is 6 hours. The function also sends cache headers for ready/stale responses.

## UI State Behavior

Home:

- Loading: shows `กำลังโหลดวิดีโอล่าสุด` in a compact skeleton card.
- Ready: shows the latest real video with compact thumbnail, title, channel/source label, and after M130 routes `ดูวิดีโอ` to the in-app player when `videoId` is available.
- Stale: keeps showing real cached video data and adds `ข้อมูลอาจไม่ล่าสุด`.
- Error with no fallback video: shows `ยังโหลดวิดีโอจากช่องไม่ได้ กรุณาลองใหม่ภายหลัง` and links to the owner channel when available.
- Not configured/no data: keeps the source-pending copy.

`/app/youtube`:

- Loading: shows `กำลังโหลดวิดีโอจากช่อง` and neutral skeleton rows.
- Ready: shows the compact video list.
- Stale: shows real cached videos with `ข้อมูลอาจไม่ล่าสุด`.
- Error with no fallback videos: shows friendly retry copy and the owner channel link.
- Not configured/no data: keeps the source-pending copy and owner channel link.

Descriptions are not rendered as long blocks in Home or the `/app/youtube` list.

M130 adds `/app/youtube/:videoId` as the official YouTube iframe player page. The player route keeps `เปิดใน YouTube` visible and does not add autoplay, custom playback controls, or fake engagement stats.

## Test URLs

After deployment, verify:

- `/api/youtube/latest`
- `/api/youtube/videos`
- `/app`
- `/app/youtube`

Expected production result with the key configured:

- API endpoints return `status: "ready"`.
- Home shows the latest real video compactly.
- `/app/youtube` shows the compact real video list.
- No fake views, likes, comments, or subscriber counts are shown.

## Local Limitation

The local Vite dev server does not execute Cloudflare Pages Functions. Local tests cover ready, stale, error, loading, and source-pending UI states by injecting backend response objects. Live endpoint verification is performed in Cloudflare/production.
