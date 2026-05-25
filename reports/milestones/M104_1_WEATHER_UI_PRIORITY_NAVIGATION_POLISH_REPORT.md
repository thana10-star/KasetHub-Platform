# M104.1 Weather UI Priority + App Navigation Polish Report

## 1. Summary

M104.1 applies release-blocking Weather UI and app navigation polish from owner mobile production screenshots.

The Weather page now shows farmer-useful content first: coarse location, current weather, risk summary, and update actions before source/API/cache details. Risk colors are clearer, route changes scroll to the top, and the shared page header now provides a clear Home affordance.

No Weather provider/API behavior changed. No GPS/geolocation, Supabase writes, cloud sync, real AI provider, OCR/image diagnosis, notifications, secrets, or Farm Records storage/schema changes were added.

## 2. Files Created

- `src/components/layout/ScrollToTop.tsx`
- `src/components/layout/scroll-utils.ts`
- `src/components/layout/PageHeader.test.tsx`
- `src/components/layout/ScrollToTop.test.ts`
- `docs/ux/WEATHER_UI_NAVIGATION_POLISH_M104_1.md`
- `reports/milestones/M104_1_WEATHER_UI_PRIORITY_NAVIGATION_POLISH_REPORT.md`

## 3. Files Modified

- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/release/V1_RELEASE_BLOCKER_LOG_M104.md`
- `docs/release/OWNER_PRODUCTION_VERIFICATION_WORKSHEET_M104.md`
- `src/components/layout/AppShell.tsx`
- `src/components/layout/PageHeader.tsx`
- `src/routes/WeatherPage.tsx`
- `src/routes/WeatherPage.test.tsx`
- `src/services/weather/weather-agri-risk-boundary.ts`

Build output in `dist/` was refreshed by `npm run build`.

## 4. Weather Layout Priority Changes

`/app/weather` now follows this release-ready order:

1. Header: `สภาพอากาศเกษตร`
2. Coarse location selector
3. Main current weather card
4. Agriculture risk summary
5. Update actions
6. Source/cache/system details under `ข้อมูลเพิ่มเติม / รายละเอียดแหล่งข้อมูล`

The previous source/status-heavy block is no longer above current weather. Fallback/stale copy remains available but is kept as a smaller notice, not the hero content.

## 5. Risk Color Changes

Added shared risk visual mappings in `src/services/weather/weather-agri-risk-boundary.ts`:

- `low / ต่ำ`: calm green
- `watch / เฝ้าดู`: blue
- `caution / ระวัง`: orange/yellow
- `high / สูง`: red/pink

Weather risk cards now use level-based card backgrounds, borders, note colors, and badges. Cards are sorted by severity and stay one column on narrow mobile screens.

## 6. Scroll-To-Top Behavior

Added `ScrollToTop` in the app shell.

Expected behavior:

- Navigating to a new route scrolls the app content container to top.
- Window scroll is also reset for normal route changes.
- Hash routes are preserved by scrolling to the target element when the hash exists.

## 7. Home Navigation Behavior

Updated the shared `PageHeader` `showBack` affordance:

- The left header action now links to `/app`.
- The accessible label is `กลับหน้าแรก`.
- Main farmer routes using `PageHeader showBack` now have a consistent Home action.
- Bottom navigation Home remains available.

## 8. Tests / Checks Run

- Targeted tests: `npm run test -- WeatherPage PageHeader ScrollToTop` passed.
- `npm run lint`: passed.
- `npm run build`: passed.
  - Vite still reports the existing large chunk warning.
- `npm run test`: passed.
  - 38 test files passed.
  - 335 tests passed.
- `git diff --check`: passed with line-ending warnings only.
- Built-app route smoke passed:
  - `/app` 200
  - `/app/weather` 200
  - `/app/ai` 200
  - `/app/calculators` 200
  - `/app/my-farm` 200
  - `/app/farm-records` 200
  - `/app/help` 200
  - `/app/profile` 200

Preview server was stopped after route smoke.

## 9. Owner Mobile Verification Items

After production deploy, owner should verify:

- `/app/weather` starts with location/weather content, not API/source status.
- Current weather is visible near the top.
- Source/API/cache details are lower under `ข้อมูลเพิ่มเติม`.
- `ระวัง` appears orange/yellow.
- high risk appears red/pink.
- low risk does not look alarming.
- risk cards do not overflow horizontally on mobile.
- changing route starts at top.
- Home/back-to-home action is visible on main pages.

## 10. Known Limitations

- Codex verified locally with built route smoke, not the owner production Cloudflare deployment.
- Real-device visual verification still needs the owner phone after deploy.
- The Weather source details still include technical source/cache/system wording, but it is now lower in a collapsed details area.
- This milestone did not implement wrapper behavior or store submission.

## 11. Next Recommended Milestone

M104.2 should be owner mobile re-check and release blocker closure:

- deploy M104.1
- capture updated Weather screenshots
- confirm route scroll behavior on real phone
- close or reopen M104 blocker log items based on owner screenshots
- apply only tiny release-blocking copy/layout fixes if needed

## 12. Completion Checklist

- [x] Weather forecast/current data appears before API/source status.
- [x] Source/API details moved lower under details.
- [x] Risk colors improved.
- [x] Mobile Weather cards are one-column on narrow screens.
- [x] Route change scroll-to-top implemented.
- [x] Home/back-to-home affordance improved.
- [x] No Weather provider/API behavior changed.
- [x] No GPS/geolocation added.
- [x] No Supabase writes.
- [x] No cloud sync.
- [x] No AI provider enabled.
- [x] `npm run lint` passed.
- [x] `npm run build` passed.
- [x] `npm run test` passed.
- [x] `git diff --check` passed with line-ending warnings only.
- [x] M104.1 report created.

