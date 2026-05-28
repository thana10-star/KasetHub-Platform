# YouTube Single CTA And Search M131

M131 polishes the YouTube library after the in-app player milestone.

## Single CTA Rule

Home and `/app/youtube` list cards use one primary action:

```text
ดูวิดีโอ
```

Behavior:

- If a video has `videoId`, `ดูวิดีโอ` opens `/app/youtube/:videoId`.
- If a video is real but does not have `videoId`, `ดูวิดีโอ` may open the real YouTube URL as a fallback.
- The list no longer shows a second `เปิด YouTube` button on every card.
- The player detail page still keeps `เปิดใน YouTube` as the fallback action.

## In-Channel Search

`/app/youtube` now includes a compact search field:

```text
ค้นหาวิดีโอในช่อง
ค้นหาเรื่องที่สนใจ เช่น ขุดสระ ปุ๋ย น้ำ
```

Search behavior:

- Filters only the videos already loaded from the backend/manual fallback.
- Matches title and description when available.
- Works client-side only.
- Does not call YouTube `search.list`.
- Does not use a backend search endpoint.
- Shows `ไม่พบวิดีโอที่ตรงกับคำค้น` when there is no match.
- Shows `ล้างคำค้น` when a query is active.

## Deferred View Count

View counts are intentionally deferred. Real view counts require a separate `videos.list` / `statistics` design, quota review, cache behavior, and UI rules. M131 does not add view counts and does not invent engagement.

## Safety

- No YouTube API key is exposed to frontend code.
- No `VITE_YOUTUBE_API_KEY` is added.
- No `search.list` call is added.
- No view, like, comment, subscriber, or fake engagement data is shown.
- No autoplay is added.
