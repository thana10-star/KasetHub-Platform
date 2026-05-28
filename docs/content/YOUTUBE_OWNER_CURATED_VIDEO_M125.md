# YouTube Owner-Curated Video M125

## Video Added

No video row was added in M125 because the owner-provided fields were placeholders:

- `videoUrl: [OWNER WILL PROVIDE]`
- `title: [OWNER WILL PROVIDE]`
- optional metadata also not provided

The app therefore remains source-pending for latest YouTube video content.

## Owner Data Used

No real owner video URL/title was available. The configured owner channel remains:

- `https://www.youtube.com/@ruengkaset`
- `@ruengkaset`

Channel config alone is not enough to create a video row.

## No-Fake-Engagement Rule

M125 does not add or render fake views, likes, comments, channel stats, fake duration, or guessed publish dates. Home and `/app/youtube` only render video metadata that comes from a real owner-curated row or a future backend-owned API adapter.

## How To Add The Next Video

1. Confirm the video belongs to the owner channel or an approved source.
2. Provide the real YouTube video URL and title.
3. Add one entry to `src/services/youtube/youtube-manual-data.ts`.
4. Use `source: 'owner_curated'` and `isReal: true`.
5. Add only known optional metadata.
6. Run lint, build, tests, route smoke, and mobile smoke.

Use `docs/content/YOUTUBE_OWNER_VIDEO_ENTRY_TEMPLATE_M125.md` as the entry checklist.

## Future API / Backend Plan

The YouTube API plan remains separate. Any future YouTube Data API key, OAuth token, import job, quota handling, and caching must live server-side. The frontend should consume only approved normalized video metadata.
