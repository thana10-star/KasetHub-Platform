# M135.5 YouTube Home Entry + Copy Fix Report

## Summary

M135.5 fixes the `/app/youtube` ready-state info copy and adds a clear Home dashboard entry to the full YouTube video library at `/app/youtube`.

The change is limited to YouTube-facing UI copy, the Home dashboard YouTube library entry, tests, and this report. No backend/API/security behavior was changed.

## CONTEXT.md Read Confirmation

`CONTEXT.md` was read before editing. The relevant project context confirmed YouTube is a top-priority feature, copy should be natural Thai and non-technical, and YouTube must keep server-side API keys, no fake engagement, official iframe playback, and no autoplay.

## Graphify Pre-check Result

Checked before editing:

- `graphify-out/.graphify_analysis.json`
- `graphify-out/graph.json`

Graphify pointed to the expected dependencies: `src/routes/AppHomePage.tsx`, `src/routes/YoutubePage.tsx`, Home/Youtube tests, YouTube services, and route registry context. Actual source files were inspected before editing.

## Files Modified

- `src/routes/YoutubePage.tsx`
- `src/routes/AppHomePage.tsx`
- `src/routes/YoutubePage.test.tsx`
- `src/routes/AppHomePage.test.tsx`
- `reports/milestones/M135_5_YOUTUBE_HOME_ENTRY_COPY_FIX_REPORT.md`

## Copy Changes

Updated the `/app/youtube` top info box ready-state copy to:

`แสดงเฉพาะวีดีโอจากช่อง เรื่องเกษตรที่คนไทยควรรู้ เท่านั้น`

This fixes the owner-noted wording/typo concern, keeps copy user-facing, and avoids API/backend/dev wording.

## Home CTA/Card Changes

Added a compact, noticeable Home dashboard card linking to `/app/youtube`.

Title:
`คลังความรู้จากช่อง YouTube`

Description:
`รวมวีดีโอความรู้จากช่อง เรื่องเกษตรที่คนไทยควรรู้ ดูง่าย พาทำได้จริง ครบทั้งเรื่องดิน น้ำ ปุ๋ย เลี้ยงสัตว์ และเทคนิคการเกษตรต่าง ๆ`

CTA:
`ดูคลังวิดีโอ`

The card sits below the latest-video card, so it does not replace the current latest-video integration and makes the full library entry clear.

## Tests Updated

- `/app/youtube` renders the corrected info box copy.
- `/app/youtube` does not render the typo `คนไทน`.
- Home renders `คลังความรู้จากช่อง YouTube`.
- Home renders one `ดูคลังวิดีโอ` CTA.
- Home library card links to `/app/youtube`.
- Existing latest-video card still links to `/app/youtube/:videoId` when a `videoId` exists.
- Home does not add duplicate/broken YouTube external CTAs.

## Verification Results

Passed:

- `npm run lint`
- `npm run build`
- `npm run test`
- `git diff --check`

Build note: Vite still reports the existing large bundle warning. This was not introduced by M135.5.

## Mobile Smoke Result

Used a local production build with mocked YouTube backend responses at 390px width.

Passed:

- `/app` shows the YouTube library entry card.
- The Home library card links to `/app/youtube`.
- The latest-video Home card still links to the in-app player route when `videoId` exists.
- `/app/youtube` shows the corrected ready-state copy.
- The typo `คนไทน` is absent.
- No API/backend/dev wording appears in the `/app/youtube` top info box.
- No horizontal overflow on `/app`.
- No horizontal overflow on `/app/youtube`.

Temporary smoke screenshots were visually inspected and removed after the check.

## Owner Retest Steps

1. Open `/app`.
2. Confirm the latest-video card still appears.
3. Confirm the new `คลังความรู้จากช่อง YouTube` card appears near the YouTube area.
4. Tap `ดูคลังวิดีโอ` and confirm it opens `/app/youtube`.
5. Confirm `/app/youtube` shows `แสดงเฉพาะวีดีโอจากช่อง เรื่องเกษตรที่คนไทยควรรู้ เท่านั้น`.
6. Confirm no fake views, likes, comments, subscriber counts, frontend API key, `search.list`, autoplay, proxy, download, or self-host behavior was added.
