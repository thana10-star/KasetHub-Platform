# M133 YouTube List Metadata Layout Polish Report

## Summary

M133 polishes only the `/app/youtube` list card layout. Published date and real view count now sit under the thumbnail on the left side, while the right side stays focused on channel name, title, and the single `ดูวิดีโอ` CTA.

No backend/API/security behavior changed.

## Graphify Pre-Check

The requested `src/graphify-out/graph.json` and `src/graphify-out/.graphify_analysis.json` files were not present in this workspace. The root `graphify-out` files were available and checked for YouTube route context, then the real source files were inspected before editing.

## Files Modified

- `src/routes/YoutubePage.tsx`
- `src/routes/YoutubePage.test.tsx`
- `src/services/youtube/youtube-service.ts`
- `src/services/youtube/youtube-service.test.ts`

## Layout Changes

List cards now render:

- Left side: thumbnail, published date, and real view count when available.
- Right side: channel name, clamped title, and one `ดูวิดีโอ` CTA.

The title clamp was tightened to two lines in the list card to keep the right side shorter and more balanced on mobile.

## View Count Wording

The view formatter now supports a list-card option for natural Thai wording:

```text
มีคนดูแล้ว 4.5 พันครั้ง
```

Home and the detail page continue using the shorter existing count label, so this milestone stays scoped to the list layout polish.

## Missing View Count Behavior

If `viewCount` is missing, the list card hides the view row. It does not show fake `0 ครั้ง`, fake views, likes, comments, or subscriber counts.

## Tests Updated

Added/updated tests for:

- metadata appearing after the thumbnail and before the right-side title
- natural Thai view-count text in list cards
- graceful hiding when `viewCount` is missing
- one CTA per card remains intact
- formatter keeps compact labels and supports the list prefix

## Verification Results

- `npm run lint` passed.
- `npm run build` passed. Vite emitted the existing large-chunk warning; generated build artifacts were restored afterward.
- `npm run test` passed: 53 files, 499 tests.
- `git diff --check` passed.
- Browser route smoke passed with HTTP 200 for `/app/youtube` and `/app/youtube/m133-smoke-video`.
- Mobile smoke at 390px passed with stubbed backend-ready YouTube data: no horizontal overflow, thumbnail metadata visible under the image, natural view-count copy visible on the list card, one `ดูวิดีโอ` CTA on the list card, and the detail page still used the official iframe without autoplay.

## Owner Retest Steps

1. Open `/app/youtube` on mobile.
2. Confirm each thumbnail has date and view count underneath when available.
3. Confirm the right side feels shorter: channel, title, and one `ดูวิดีโอ` button.
4. Confirm missing views do not show fake zero.
5. Confirm `/app/youtube/:videoId` still opens the in-app player and keeps `เปิดใน YouTube`.
