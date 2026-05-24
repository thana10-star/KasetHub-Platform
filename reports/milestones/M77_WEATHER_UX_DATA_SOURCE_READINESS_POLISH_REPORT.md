# M77 Weather UX + Data-source Readiness Polish Report

## Summary

M77 polishes KasetHub weather UX and data-source readiness with source attribution, manual refresh policy, local-only coarse-location preference persistence, stale/offline messaging, cache QA helpers, and a weather preferences route.

No GPS/geolocation, precise personal location storage, Supabase writes, backend writes, cloud sync, AI API calls, payment/ads integration, required default network calls, or background refresh jobs were added.

## Files Changed

Weather source, refresh, cache QA, and preference services:

- `src/services/weather/weather-source-readiness.types.ts`
- `src/services/weather/weather-source-readiness.ts`
- `src/services/weather/weather-refresh-policy.ts`
- `src/services/weather/weather-cache-qa.ts`
- `src/services/weather/weather-source-readiness.test.ts`
- `src/hooks/useWeather.ts`

Routes and entry points:

- `src/routes/WeatherPreferencesPage.tsx`
- `src/routes/WeatherPage.tsx`
- `src/routes/WeatherQAPage.tsx`
- `src/routes/AdminDashboardPage.tsx`
- `src/routes/MyFarmPage.tsx`
- `src/routes/ProfilePage.tsx`
- `src/routes/NextPhasePage.tsx`
- `src/routes/QAPage.tsx`
- `src/app/App.tsx`
- `src/types/kaset.ts`
- `src/services/qa/route-registry.ts`
- `src/data/mockData.ts`

Docs:

- `docs/WEATHER_SOURCE_ATTRIBUTION_POLICY.md`
- `docs/WEATHER_REFRESH_AND_STALE_POLICY.md`
- `docs/WEATHER_LOCAL_PREFERENCE_PERSISTENCE.md`
- `docs/WEATHER_OFFLINE_FALLBACK_UX.md`
- `docs/REAL_WEATHER_API_OPEN_METEO.md`
- `docs/WEATHER_QA_CACHE_COARSE_LOCATION.md`
- `docs/WEATHER_API_FALLBACK_AND_CACHE_PLAN.md`
- `docs/WEATHER_COARSE_LOCATION_PRIVACY_POLICY.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/SUPABASE_SCHEMA_DRAFT.md`
- `docs/SUPABASE_TYPE_MAPPING.md`
- `README.md`

Build artifacts updated by verification:

- `dist/index.html`
- `tsconfig.app.tsbuildinfo`

## Routes Added

- `/app/weather/preferences`

## UX Polish Notes

`/app/weather` now shows clearer source labels, fetched time, stale age, fallback reason, local/offline badges, manual refresh state, and a direct link to weather preferences.

The page keeps farmer-friendly general notes:

- `ก่อนพ่นยาให้ดูฝนและลม`
- `ลมแรงอาจทำให้ละอองยาปลิว`
- `ฝนหลังพ่นยาอาจลดประสิทธิภาพ`
- `พยากรณ์อากาศอาจคลาดเคลื่อนได้`

## Source Attribution Notes

Weather results now distinguish:

- `ข้อมูลอ้างอิงจาก Open-Meteo`
- `ข้อมูลออฟไลน์/ข้อมูลจำลอง`
- `ข้อมูลอาจล่าช้าหรือคลาดเคลื่อนได้`

`/app/weather/qa` shows a source readiness matrix for attribution, cache freshness, fallback reason, and privacy boundary proof.

## Refresh Policy Notes

Manual refresh is disabled in local fixture and disabled modes. It is only available when Open-Meteo is flag-gated ready. A cooldown policy prevents repeated refresh taps.

No auto background refresh, scheduler, or background job was added.

## Local Persistence Notes

Weather preference storage uses only:

- `kasethub.weatherLocalPreference.v1`

Stored fields are selected coarse location id, selected label, updated timestamp, and source mode. The preference record does not store lat/lon, GPS, farm coordinates, map pins, session tokens, or precise personal location.

`/app/weather/preferences` can clear local weather cache and preference state. No Supabase sync or backend write occurs.

## Offline / Stale UX Notes

M77 adds visible stale/offline messaging:

- stale cache badge
- offline fallback badge
- API unavailable notice
- `ใช้ข้อมูลล่าสุดที่มีในเครื่อง`
- `ตรวจสอบข้อมูลจากแหล่งทางการเพิ่มเติม`

If Open-Meteo fails and stale cache exists, stale cache can be shown with a warning. If there is no cache, local fixture fallback remains available.

## Tests

Vitest coverage now includes:

- manual refresh disabled in `local_fixture`
- stale age computed correctly
- cache freshness states map correctly
- selected location persists locally only
- no Supabase write occurs
- clear cache clears preference and cache
- offline fallback reason is displayed
- no GPS/geolocation is used
- no precise coordinates are stored
- refresh cooldown is respected

Result:

- 17 test files passed.
- 190 tests passed.

## Verification Commands

```bash
npm run lint
npm run test
npm run build
```

Results:

- `npm run lint` passed.
- `npm run test` passed: 17 files, 190 tests.
- `npm run build` passed.
- Vite reported the existing large chunk warning after production build.

Manual route checks were run against `http://127.0.0.1:5173`. The in-app Browser runtime reported no available `iab` session, so checks used a local Chrome headless DOM fallback.

Checked routes:

- `/app/weather` passed.
- `/app/weather/qa` passed.
- `/app/weather/preferences` passed.
- `/app` passed.
- `/app/my-farm` passed.
- `/app/profile` passed.
- `/app/admin` passed.
- `/app/next-phase` passed.
- `/app/qa` passed.

## Known Limitations

- Open-Meteo remains disabled by default.
- Weather preferences and cache are local-only.
- No Supabase weather tables, writes, RLS policies, or migrations exist.
- No backend weather proxy exists.
- No GPS, map, farm pin, or precise location feature exists.
- No cloud sync or consent-backed weather preference upload exists.
- Manual refresh is client-side only and has no backend audit trail.
- Farmer risk notes remain general and do not replace labels, local experts, or official weather sources.

## Next Recommended Milestone

M78 should add agriculture weather risk intelligence readiness: crop-work risk categories, rain/wind/humidity threshold planning, safe disclaimer boundaries, and tests proving risk notes stay general until expert-reviewed agronomy rules exist.
