# M128 YouTube UI Compact List Polish Report

## Summary

M128 polished the existing YouTube UI presentation without changing the backend adapter, API fallback, manual fallback, routing, or security behavior from M127.

Home and `/app/youtube` now present YouTube content as compact, title-focused cards. Descriptions are no longer rendered in the Home latest-video card or the `/app/youtube` video list cards.

## Graphify And Source Audit

- Checked Graphify context before editing, including the available Graphify output for route, service, test, and route-registry relationships.
- Inspected the actual source files before editing:
  - `src/routes/AppHomePage.tsx`
  - `src/routes/YoutubePage.tsx`
  - `src/routes/AppHomePage.test.tsx`
  - `src/routes/YoutubePage.test.tsx`
  - `src/services/youtube/youtube-service.ts`
- No `graphify-out` files were modified.

## Files Modified

- `src/routes/AppHomePage.tsx`
- `src/routes/YoutubePage.tsx`
- `src/routes/AppHomePage.test.tsx`
- `src/routes/YoutubePage.test.tsx`

## What Changed

### Home Latest Video Card

- Reduced the Home latest-video card from the previous larger block to a compact horizontal card.
- Thumbnail/placeholder size is now smaller on mobile.
- The card now shows:
  - thumbnail or placeholder icon
  - title
  - small source/channel text
  - `ดูวิดีโอ` CTA
- Title is clamped to 2 lines.
- The card keeps the same backend/manual/source-pending behavior.

### `/app/youtube` Video List

- Converted video list items to compact horizontal rows optimized for mobile.
- Thumbnail size is reduced so it does not dominate the screen.
- Each item now shows:
  - thumbnail or placeholder icon
  - channel/source text
  - title
  - optional published date
  - `ดูวิดีโอ` CTA
- Title is clamped to 3 lines.
- The page keeps the same backend/manual/source-pending behavior.

## Intentionally Removed From UI

- Home no longer renders the full video description.
- `/app/youtube` list cards no longer render full description text blocks.
- No fake views, likes, comments, subscribers, or other fake engagement metadata were added.

## Home Vs `/app/youtube`

- Home remains a lightweight latest-video preview. It is intentionally compact and limited to one latest item.
- `/app/youtube` remains the library surface. It can show many compact video rows when backend/manual videos exist, and it keeps the source-pending state when none are available.

## Behavior Safety

- No backend/API/security changes.
- No YouTube API key or `VITE_YOUTUBE_API_KEY` was added.
- No scraping.
- No autoplay.
- Existing backend-first, manual-fallback, source-pending behavior remains intact.

## Tests And Checks Run

- `npm run test -- src/routes/AppHomePage.test.tsx src/routes/YoutubePage.test.tsx` - passed, 28 tests.
- `npm run lint` - passed.
- `npm run build` - passed. Vite reported the existing large chunk warning.
- `npm run test` - passed, 53 files and 482 tests.
- Browser desktop smoke:
  - `/app` rendered without horizontal overflow.
  - `/app/youtube` rendered without horizontal overflow.
  - No fake engagement text was detected.
- Mobile smoke at 390px:
  - `/app` rendered without horizontal overflow.
  - Home latest-video card rendered compactly at about 358px by 106px.
  - `/app/youtube` rendered without horizontal overflow.
  - `/app/youtube` showed the honest source-pending state in the local no-key environment.
  - No English fake view text was detected.
- `git diff --check` - passed.

## Notes

- The local browser smoke used the source-pending path because no live YouTube API key is configured locally.
- Video-list rendering with real data is covered by route tests using injected real `ChannelVideo` data.

## Next Recommended Milestone

M129 should add a visual loading/stale-state refinement for YouTube backend responses, keeping the same no-fake-engagement and server-side-key rules.
