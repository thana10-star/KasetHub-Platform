# M129 YouTube Live Endpoint Verification UI States Report

## 1. Summary

M129 verifies the owner-provided production evidence for the live YouTube endpoint and adds UI polish for loading, stale, error, and not-configured states on Home and `/app/youtube`.

The YouTube integration behavior remains backend-first, manual fallback second, and source-pending last. No API secret handling was changed, no frontend API key was added, no scraping was added, and no fake engagement stats were added.

## 2. Owner Live Endpoint Evidence

Owner production testing confirmed:

- `/api/youtube/latest` returned `status: "ready"`.
- Channel handle resolved as `@ruengkaset`.
- Channel name resolved as `เรื่องเกษตรที่คนไทยควรรู้`.
- Latest real video returned:
  - `แจกแบบแปลนขุดสระ 3 ไร่ มีเกาะกลางน้ำ พร้อมเทคนิคคำนวณสโลปกันดินสไลด์`

No API key or secret value is recorded in repo docs.

## 3. Files Created

- `docs/content/YOUTUBE_LIVE_ENDPOINT_VERIFICATION_M129.md`
- `reports/milestones/M129_YOUTUBE_LIVE_ENDPOINT_VERIFICATION_UI_STATES_REPORT.md`

## 4. Files Modified

- `src/routes/AppHomePage.tsx`
- `src/routes/AppHomePage.test.tsx`
- `src/routes/YoutubePage.tsx`
- `src/routes/YoutubePage.test.tsx`
- `src/services/qa/route-registry.ts`
- `docs/content/YOUTUBE_VIDEO_LIBRARY_M127.md`

## 5. Loading State Behavior

Home now shows a compact loading card with:

- `กำลังโหลดวิดีโอล่าสุด`
- neutral skeleton thumbnail/button shapes
- no fake title
- no fake thumbnail
- no fake engagement

`/app/youtube` now shows:

- `กำลังโหลดวิดีโอจากช่อง`
- neutral skeleton rows
- no fake video rows
- no fake engagement

## 6. Ready / Live Behavior

When the backend returns `ready` with valid videos:

- Home shows the latest real video compactly.
- `/app/youtube` shows the compact video list.
- Titles remain clamped.
- Long descriptions remain hidden from Home and list cards.
- `ดูวิดีโอ` links point to the real YouTube URL.
- No views, likes, comments, subscribers, or guessed stats are shown.

## 7. Stale / Error / Not Configured Behavior

Stale:

- Real cached videos still render.
- Home and `/app/youtube` add `ข้อมูลอาจไม่ล่าสุด`.
- `/app/youtube` also explains that it is showing the latest data previously loaded.

Error with no fallback videos:

- Home shows `ยังโหลดวิดีโอจากช่องไม่ได้ กรุณาลองใหม่ภายหลัง`.
- `/app/youtube` shows friendly retry copy.
- Raw backend/API error messages are not shown to users.
- The owner YouTube channel link is preserved when available.

Not configured/no videos:

- Source-pending copy remains.
- `/app/youtube` keeps the owner channel link.
- No sample or fake videos are inserted.

## 8. Home Behavior

Home continues to use `/api/youtube/latest` through the existing frontend service. The card remains compact from M128 and now has explicit loading, stale, and error states around the same backend/manual/source-pending fallback path.

## 9. `/app/youtube` Behavior

`/app/youtube` continues to use `/api/youtube/videos` through the existing frontend service. The page keeps the compact M128 list layout and now adds clear loading, stale, error, and source-pending messaging.

## 10. Security / No Frontend Key Check

- `YOUTUBE_API_KEY` remains server-side in Cloudflare Function code and docs/tests only.
- No `VITE_YOUTUBE_API_KEY` was added.
- No secrets were committed.
- No scraping was added.
- Existing contract tests still guard frontend source from YouTube API key references.

## 11. Tests / Checks Run

- Graphify context checked first: `graphify-out/.graphify_analysis.json` and `graphify-out/graph.json`.
- Focused route tests passed: `npm run test -- src/routes/AppHomePage.test.tsx src/routes/YoutubePage.test.tsx` - 34 tests.
- `npm run lint` - passed.
- `npm run build` - passed, with the existing Vite large chunk warning.
- `npm run test` - passed, 53 files and 488 tests.
- Browser route smoke:
  - `/app` passed.
  - `/app/youtube` passed.
  - `/app/prices` passed.
  - `/app/weather` passed.
  - `/app/community` passed.
  - `/app/ai` passed.
  - `/app/profile` passed.
- Mobile smoke at 390px:
  - `/app` had no horizontal overflow.
  - Home latest-video card remained compact at about 358px by 106px.
  - `/app/youtube` had no horizontal overflow.
  - `/app/youtube` source-pending state remained readable locally.
  - No English fake view text was detected.
- `git diff --check` - passed.

## 12. Known Limitations

- Local Vite does not execute Cloudflare Pages Functions, so local browser smoke settles into source-pending after `/api/youtube/*` is unavailable.
- Live `ready` endpoint behavior is documented from owner-provided production evidence and covered locally by injected backend response tests.
- No UI pagination/load-more is added yet.
- No YouTube engagement stats are shown because M127 does not call `videos.list` for stats and M129 does not add stats.

## 13. Owner Retest Steps

1. Open `/api/youtube/latest` and confirm `status: "ready"`.
2. Open `/api/youtube/videos` and confirm `status: "ready"` with video list.
3. Open `/app` and confirm the latest video card is compact.
4. Open `/app/youtube` and confirm the video list is compact.
5. Confirm no long description blocks appear in Home or the list.
6. Confirm no fake views, likes, comments, or subscriber counts appear.
7. Temporarily remove/disable the YouTube key only in staging, if safe and planned, to confirm the `not_configured` state. Do not do this in production unless planned.

## 14. Next Recommended Milestone

M130 should add optional pagination/load-more for `/app/youtube` using the existing `nextPageToken` contract, still without fake engagement stats or frontend secrets.
