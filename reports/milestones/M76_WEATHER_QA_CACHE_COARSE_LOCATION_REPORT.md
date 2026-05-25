# M76 Weather QA + Cache + Coarse Location Report

## Summary

M76 hardens KasetHub weather with local-only cache readiness, stale-data UI, predefined coarse location selection, failure fixtures, QA visibility, and farmer-friendly risk note boundaries while keeping Open-Meteo flag-gated and offline fallback available.

No GPS/geolocation, precise personal location storage, Supabase writes, backend writes, cloud sync, AI API calls, payment/ads integration, or required default network calls were added.

## Files Changed

Weather cache, location, QA, and risk services:

- `src/services/weather/weather-cache.types.ts`
- `src/services/weather/weather-cache-service.ts`
- `src/services/weather/weather-location.types.ts`
- `src/services/weather/weather-location-fixtures.ts`
- `src/services/weather/weather-qa-fixtures.ts`
- `src/services/weather/weather-risk-notes.ts`
- `src/services/weather/weather.types.ts`
- `src/services/weather/weather-adapter.ts`
- `src/services/weather/weather-adapter.test.ts`
- `src/hooks/useWeather.ts`

Routes and entry points:

- `src/routes/WeatherPage.tsx`
- `src/routes/WeatherQAPage.tsx`
- `src/routes/AdminDashboardPage.tsx`
- `src/routes/NextPhasePage.tsx`
- `src/routes/QAPage.tsx`
- `src/app/App.tsx`
- `src/types/kaset.ts`
- `src/services/qa/route-registry.ts`
- `src/services/my-farm/my-farm-hub-service.ts`

Docs:

- `docs/WEATHER_QA_CACHE_COARSE_LOCATION.md`
- `docs/WEATHER_COARSE_LOCATION_PRIVACY_POLICY.md`
- `docs/WEATHER_CACHE_STALE_DATA_POLICY.md`
- `docs/WEATHER_FARMER_RISK_NOTE_BOUNDARY.md`
- `docs/REAL_WEATHER_API_OPEN_METEO.md`
- `docs/WEATHER_API_PRIVACY_AND_LOCATION_POLICY.md`
- `docs/WEATHER_API_FALLBACK_AND_CACHE_PLAN.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/SUPABASE_SCHEMA_DRAFT.md`
- `docs/SUPABASE_TYPE_MAPPING.md`
- `README.md`

Build artifacts updated by verification:

- `dist/index.html`
- `tsconfig.app.tsbuildinfo`

## Routes Added

- `/app/weather/qa`

## Coarse Location Notes

M76 adds predefined weather locations for:

- กรุงเทพฯ
- นครราชสีมา
- ขอนแก่น
- เชียงใหม่
- นครสวรรค์
- สุพรรณบุรี
- อุบลราชธานี
- สุราษฎร์ธานี
- สงขลา

Each fixture uses `precision = province_or_city_center` with an explicit Thai privacy note. These are approximate forecast lookup points, not farm coordinates, map pins, GPS, or stored personal locations.

## Cache Notes

Weather cache is local-only under:

- `kasethub.weatherCache.v1`

Cache is keyed by coarse location id and stores the forecast result, source mode, source label, timestamp, and stale window. The default stale window is 45 minutes.

Behavior:

- fresh cache avoids fetch
- stale cache shows stale status
- API failure can fall back to stale cache
- no cache plus API failure falls back to local fixture
- selected-location cache can be cleared locally
- no Supabase persistence

## QA / Failure Fixture Notes

`/app/weather/qa` shows:

- current mode
- cache status
- location privacy status
- Open-Meteo enabled/disabled status
- fallback expectations
- failure fixture matrix
- stale-data examples
- no-GPS/no-precise-storage proof

QA fixtures cover local fixture default, Open-Meteo disabled, Open-Meteo ready with flags, API failure with stale cache, and production disabled.

## Privacy / Location Notes

- No GPS.
- No browser geolocation.
- No map pin.
- No farm precise coordinate.
- No precise personal location storage.
- No Supabase write.
- No backend write.
- No cloud sync.

## Farmer Risk Note Boundaries

`/app/weather` now shows general notes:

- `ก่อนพ่นยาให้ดูฝนและลม`
- `ลมแรงอาจทำให้ละอองยาปลิว`
- `ฝนหลังพ่นยาอาจลดประสิทธิภาพ`
- `พยากรณ์อากาศอาจคลาดเคลื่อนได้`

These notes are general caution only. They do not recommend products, doses, chemical instructions, exact legal thresholds, or guaranteed outcomes.

## Tests

Vitest coverage includes:

- default mode does not fetch
- Open-Meteo ready requires explicit API flag before fetch
- cache hit avoids fetch
- stale cache shows stale status
- API failure falls back to stale cache if available
- no cache falls back to local fixture
- no geolocation call occurs
- coarse location fixtures do not store precise farm coordinates
- cache can be cleared
- risk notes are general/disclaimer-bound

Result:

- 16 test files passed.
- 180 tests passed.

## Verification Commands

```bash
npm run lint
npm run test
npm run build
```

Results:

- `npm run lint` passed.
- `npm run test` passed: 16 files, 180 tests.
- `npm run build` passed.
- Vite reported the existing large chunk warning after production build.

Manual route checks were run against `http://127.0.0.1:5173`. The in-app Browser runtime reported no available `iab` session, so checks used a local Edge headless DevTools DOM fallback.

Checked routes:

- `/app/weather` passed.
- `/app/weather/qa` passed.
- `/app` passed.
- `/app/my-farm` passed.
- `/app/admin` passed.
- `/app/next-phase` passed.
- `/app/qa` passed.

## Known Limitations

- Open-Meteo remains disabled by default.
- Cache is local-only and not synced.
- No Supabase weather tables or writes exist.
- No backend weather proxy exists.
- No GPS, map, or user precise location feature exists.
- Coarse location fixtures are limited to a small starter set.
- Weather risk notes remain general and do not replace labels, local experts, or official weather sources.

## Next Recommended Milestone

M77 should add weather UX and data-source readiness polish: source attribution QA, user-selected coarse-location persistence review, offline cache expiry messaging, optional manual refresh behavior, and tests proving cache/location settings remain local-only until explicit consent and RLS-reviewed sync exist.
