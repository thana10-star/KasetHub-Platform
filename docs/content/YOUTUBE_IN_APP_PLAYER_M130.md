# YouTube In-App Player M130

M130 adds an in-app video detail experience for real owner-channel videos while keeping YouTube playback inside the official YouTube embedded player.

## Player Approach

The app uses the official YouTube iframe URL:

```text
https://www.youtube.com/embed/{videoId}
```

The app does not download, proxy, self-host, or alter YouTube video streams. Player controls remain YouTube controls, and the iframe is rendered without an autoplay query parameter.

## Routes

- `/app/youtube` remains the video library page.
- `/app/youtube/:videoId` is the in-app player detail page.

When a video has a real `videoId`, Home and `/app/youtube` route to `/app/youtube/:videoId` first. If a video does not have a `videoId`, the UI falls back to the real YouTube URL instead of inventing an embed.

After M131, Home and `/app/youtube` list cards use one CTA label, `ดูวิดีโอ`. The external `เปิดใน YouTube` fallback remains on the detail/player page, not on every list card.

## Detail Page Behavior

The detail page:

- loads backend/manual video data through the existing frontend YouTube service
- finds the video by `videoId` or internal `id`
- renders a responsive 16:9 official YouTube iframe when `videoId` is available
- shows the title, source/channel label, and published date if already available
- always shows `เปิดใน YouTube` as a fallback
- links back to `วิดีโอทั้งหมด`
- shows a safe not-found/source-pending state for unknown IDs

## Ads And Monetization

Ads, monetization, and playback eligibility are controlled by YouTube and by the video/channel embed settings. KasetHub does not add separate ads, hide YouTube controls, or modify the official player behavior.

## Safety Rules

- No `YOUTUBE_API_KEY` is exposed in frontend code.
- No `VITE_YOUTUBE_API_KEY` is added.
- No fake views, likes, comments, subscriber counts, duration, or engagement are shown.
- No autoplay is added.
- No scraping is added.
- No backend API key handling is changed.

## Fallbacks

If the iframe cannot play, the user can tap `เปิดใน YouTube`.

If the route cannot find a matching video, the page shows `ยังไม่พบวิดีโอนี้`, links back to the video library, and links to the owner channel when a channel URL is configured.
