# M125 Add First Owner-Curated YouTube Video Report

## 1. Summary

M125 did not add a real owner-curated video row because no verified owner YouTube video URL/title was provided. The manual video data source remains empty, Home and `/app/youtube` stay source-pending, and validation/tests now more explicitly reject channel-only or non-YouTube URLs.

## 2. Whether Owner Video Was Provided

No. The supplied owner data contained placeholders:

- `videoUrl: [OWNER WILL PROVIDE]`
- `title: [OWNER WILL PROVIDE]`
- optional metadata also not provided

Because the URL/title were missing, M125 did not invent or add a video.

## 3. Files Created

- `docs/content/YOUTUBE_OWNER_VIDEO_ENTRY_TEMPLATE_M125.md`
- `docs/content/YOUTUBE_OWNER_CURATED_VIDEO_M125.md`
- `reports/milestones/M125_ADD_FIRST_OWNER_CURATED_YOUTUBE_VIDEO_REPORT.md`

## 4. Files Modified

- `src/routes/YoutubePage.tsx`
- `src/routes/YoutubePage.test.tsx`
- `src/services/youtube/youtube-service.ts`
- `src/services/youtube/youtube-service.test.ts`
- `src/services/qa/route-registry.ts`

## 5. Video Row Behavior

`src/services/youtube/youtube-manual-data.ts` remains empty. The service now accepts only real YouTube video URLs:

- accepted: `https://www.youtube.com/watch?v=...`
- accepted: `https://www.youtube.com/shorts/...`
- accepted: `https://www.youtube.com/embed/...`
- accepted: `https://youtu.be/...`
- rejected: channel homepages such as `https://www.youtube.com/@ruengkaset`
- rejected: non-YouTube URLs
- rejected: unsafe protocols
- rejected: entries where `isReal` is not `true`

## 6. Home Behavior

Home remains source-pending because no real owner-curated video row exists. Existing tests still prove that an injected valid owner-curated video renders title, description, thumbnail, and safe CTA without engagement stats.

## 7. `/app/youtube` Behavior

`/app/youtube` remains source-pending with the owner channel link. The page can now be tested with an injected video list, and tests prove a valid owner-curated row appears while invalid/channel-only rows are filtered.

## 8. No-Fake-Engagement Protection

No fake views, likes, comments, channel stats, fake duration, guessed publish date, API key, scraping, backend write, or autoplay behavior was added.

## 9. Tests / Checks Run

- `npm run test -- AppHomePage YoutubePage youtube-service` passed: 3 files, 28 tests.
- `npm run lint` passed.
- `npm run build` passed. Vite kept the existing large chunk warning.
- `npm run test` passed: 51 files, 466 tests.
- `git diff --check` passed with Windows line-ending warnings only.
- Browser route smoke passed for `/app`, `/app/youtube`, `/app/prices`, `/app/weather`, `/app/community`, `/app/ai`, and `/app/profile`.
- Mobile smoke passed at 390px for `/app` and `/app/youtube`: latest-video/source-pending text present, no fake engagement, no horizontal overflow.

## 10. Owner Retest Steps

1. Open `/app` and confirm the latest-video card says `กำลังเตรียมเชื่อมวิดีโอล่าสุดจากช่อง`.
2. Open `/app/youtube` and confirm it shows the source-pending state.
3. Confirm no views, likes, comments, subscriber counts, or fake stats appear.
4. Provide a real YouTube video URL and title for the next update.

## 11. Next Recommended Milestone

M126 should add the first real owner-provided video row once the owner supplies a verified YouTube video URL/title. After that, run the same Home, `/app/youtube`, route, mobile, and no-fake-engagement checks.
