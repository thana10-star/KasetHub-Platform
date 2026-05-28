# YouTube Owner Video Entry Template M125

M125 did not receive a verified owner video URL/title, so no real row was added to `ownerCuratedYoutubeVideos`.

Use this template only after the owner provides a real YouTube video URL and title. Do not add it with placeholder values.

```ts
{
  id: 'stable-video-id-from-owner',
  title: 'OWNER PROVIDED TITLE',
  url: 'https://www.youtube.com/watch?v=OWNER_VIDEO_ID',
  thumbnailUrl: 'OWNER PROVIDED THUMBNAIL URL IF KNOWN',
  publishedAt: 'OWNER PROVIDED ISO DATE IF KNOWN',
  description: 'OWNER PROVIDED DESCRIPTION IF KNOWN',
  source: 'owner_curated',
  isReal: true,
  channelName: 'เรื่องเกษตรที่คนไทยควรรู้',
}
```

Required fields:

- `id`
- `title`
- `url`
- `source: 'owner_curated'`
- `isReal: true`
- `channelName`

Optional fields:

- `thumbnailUrl`
- `publishedAt`
- `description`

Validation rules:

- URL must be HTTP(S).
- URL must be a real YouTube video URL, such as `youtube.com/watch?v=...`, `youtube.com/shorts/...`, or `youtu.be/...`.
- Channel homepages such as `https://www.youtube.com/@ruengkaset` are not video rows.
- Do not add views, likes, comments, fake duration, guessed publish dates, or channel stats.
- Do not add a YouTube API key or any secret to frontend code.
