# M135 YouTube Production Visual QA Report

## Summary

M135 completed a focused production visual QA and edge-case polish pass for the YouTube feature after M133/M134. The YouTube list, load-more edge states, search empty state, in-app player detail page, and Home latest-video card were checked at 390px mobile width with mocked production-shaped YouTube responses.

No backend architecture, YouTube API flow, API key handling, Community, Weather, Prices, AI, Supabase, auth, or unrelated route behavior was changed.

## CONTEXT.md Read Confirmation

`CONTEXT.md` was read before the milestone work. It confirmed YouTube is the current top-priority content feature, with server-side YouTube API usage only, official iframe playback, no autoplay, and no fake engagement.

## Graphify Pre-check Result

Graphify context was checked before editing:

- `graphify-out/.graphify_analysis.json`
- `graphify-out/graph.json`

The graph pointed to the expected YouTube surfaces: `/app/youtube`, `/app/youtube/:videoId`, Home latest-video integration, YouTube service/fallback helpers, route registry, tests, and Cloudflare Function dependencies. Actual source files were inspected after the Graphify pre-check before editing.

## Files Modified

- `src/routes/AppHomePage.tsx`
- `src/routes/YoutubePage.tsx`
- `src/routes/YoutubeVideoDetailPage.tsx`
- `src/routes/YoutubePage.test.tsx`
- `src/services/qa/route-registry.ts`

## Visual Polish Changes

- Tightened `/app/youtube` card resilience for long Thai titles by preserving the compact M133 layout and adding safer word wrapping where long Thai text could otherwise stress the right column.
- Kept missing `viewCount` rows hidden without showing fake zero.
- Made thumbnail previews keep a consistent `aspect-video` shape so unusual thumbnail dimensions do not stretch the list.
- Replaced remaining technical/prototype-flavored user copy with natural Thai copy for loading, source-pending, error, stale, and no-search-results states.
- Kept `/app/youtube` to one `ดูวิดีโอ` CTA per card.
- Added defensive route-state validation on `/app/youtube/:videoId` so direct access or unusual route state fails safely.
- Passed Home latest-video route state into the in-app detail route when `videoId` exists, keeping the card visually unchanged but improving detail-page handoff.

## Edge Cases Checked

- 390px mobile width.
- Very long Thai video title in list cards.
- Short title in list cards.
- Missing `viewCount`.
- Missing description.
- Thumbnail dimensions kept visually consistent.
- First page only.
- Multiple pages after `โหลดเพิ่มเติม`.
- Local search with loaded videos.
- No search results state.
- Loading, stale, error, and not-configured copy paths kept user-friendly.
- Load-more failure after initial success keeps existing videos visible.
- Detail route from a loaded-more video.
- Direct unknown detail access remains safe.
- Home latest YouTube card still routes to the in-app player when `videoId` exists.

## Tests Updated

- Long Thai list title keeps the CTA and clamped layout.
- Missing `viewCount` hides the view row without fake views.
- No search results state uses the new production copy.
- Load-more failure keeps existing videos visible.
- Final-page load more behavior still removes the button.
- One `ดูวิดีโอ` CTA per card remains.
- Loaded-more video can open the detail route through route state.
- Detail page handles long Thai titles and direct unknown routes safely.
- Home latest card tests still confirm in-app routing and no fake engagement.

## Screenshot QA

All screenshots were generated from a production build served locally with mocked YouTube backend responses. Each PNG was opened and visually inspected.

- `reports/milestones/m135-youtube-initial-mobile.png`  
  Route/state: `/app/youtube` initial list.  
  Result: Pass. Long Thai title clamps cleanly, thumbnail metadata remains under image, CTA visible, no horizontal overflow.

- `reports/milestones/m135-youtube-after-load-more-mobile.png`  
  Route/state: `/app/youtube` after load more.  
  Result: Pass. Appended video is visible, duplicate item is not duplicated, final-page load-more button is gone, no horizontal overflow.

- `reports/milestones/m135-youtube-search-no-results-mobile.png`  
  Route/state: `/app/youtube` with local search no results.  
  Result: Pass. Empty state is clear, non-technical, and readable at 390px.

- `reports/milestones/m135-youtube-load-more-error-mobile.png`  
  Route/state: `/app/youtube` load-more failure after initial success.  
  Result: Pass. Existing videos remain visible, recoverable Thai error appears, load-more button remains available for retry.

- `reports/milestones/m135-youtube-detail-mobile.png`  
  Route/state: `/app/youtube/:videoId` from a loaded-more card.  
  Result: Pass. Official iframe area is responsive, no autoplay URL is used, fallback `เปิดใน YouTube` is visible.

- `reports/milestones/m135-home-latest-youtube-mobile.png`  
  Route/state: `/app` latest YouTube card.  
  Result: Pass. Home card remains compact, links to the in-app route, and has no fake engagement.

All screenshot smoke states reported `scrollWidth: 390` at 390px width.

## Verification Results

Passed:

- `npm run lint`
- `npm run build`
- `npm run test`
- `git diff --check`

Build note: Vite still reports the existing large bundle warning. This was not introduced by M135.

## Known Limitations

- Local screenshot QA used mocked YouTube endpoint responses so edge cases could be tested without real secrets or Cloudflare runtime.
- Local visual QA does not verify the production YouTube API key or live Cloudflare runtime; owner production already verifies live endpoint readiness separately.
- The headless browser shows the official YouTube iframe area, but it does not prove end-user playback success for every device/network condition.

## Owner Retest Steps

1. Open `/app/youtube` on a mobile-width screen.
2. Confirm long titles remain readable and do not push the `ดูวิดีโอ` button into an awkward position.
3. Confirm videos without view count do not show fake zero views.
4. Tap `โหลดเพิ่มเติม` and confirm new videos append without duplicates.
5. Search for a term that has no match and confirm the no-results state is friendly.
6. Temporarily test a load-more failure in staging if safe and confirm existing videos remain visible.
7. Open a loaded-more video and confirm `/app/youtube/:videoId` uses the official embedded player with `เปิดใน YouTube`.
8. Open `/app` and confirm the latest YouTube card stays compact and routes to the in-app player.

## Safety Confirmation

M135 did not add fake YouTube videos, fake views, likes, comments, subscriber counts, frontend API keys, `VITE_YOUTUBE_API_KEY`, YouTube `search.list`, autoplay, proxy/download/self-host behavior, or unrelated backend writes.
