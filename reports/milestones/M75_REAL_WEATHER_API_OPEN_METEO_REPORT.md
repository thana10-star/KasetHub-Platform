# M75 Real Weather API Integration - Open-Meteo Report

## Summary

M75 adds KasetHub's first real external API integration through Open-Meteo weather data, while keeping the app offline-safe by default. Weather remains local fixture unless explicit env flags enable Open-Meteo, and the app does not request GPS or store precise personal location.

No Supabase writes, backend writes, cloud sync, AI API calls, payment/ads integration, GPS/geolocation request, precise personal location storage, or default network calls were added.

## Files Changed

Weather env and domain:

- `.env.example`
- `src/config/env.ts`
- `src/vite-env.d.ts`
- `src/services/weather/weather.types.ts`
- `src/services/weather/weather-open-meteo-client.ts`
- `src/services/weather/weather-adapter.ts`
- `src/services/weather/weather-adapter.test.ts`
- `src/hooks/useWeather.ts`

Routes and entry points:

- `src/routes/WeatherPage.tsx`
- `src/data/mockData.ts`
- `src/routes/MyFarmPage.tsx`
- `src/routes/ProfilePage.tsx`
- `src/routes/AdminDashboardPage.tsx`
- `src/routes/NextPhasePage.tsx`
- `src/routes/QAPage.tsx`
- `src/services/qa/route-registry.ts`

Docs:

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

No new route was required. M75 upgrades the existing route:

- `/app/weather`

## Env Flags

M75 adds:

```env
VITE_WEATHER_MODE=local_fixture
VITE_ENABLE_REAL_WEATHER_API=false
VITE_WEATHER_DEFAULT_LAT=13.7563
VITE_WEATHER_DEFAULT_LON=100.5018
VITE_WEATHER_DEFAULT_LABEL=กรุงเทพฯ
```

Supported modes:

- `local_fixture`
- `open_meteo_disabled`
- `open_meteo_ready`
- `production_disabled`

Default behavior remains `local_fixture` with no network call.

## Real API Behavior

`open_meteo_ready` can call Open-Meteo only when:

- `VITE_WEATHER_MODE=open_meteo_ready`
- `VITE_ENABLE_REAL_WEATHER_API=true`
- configured default lat/lon are valid

The client requests the Open-Meteo forecast endpoint for current temperature, humidity, precipitation, weather code, wind speed, and 7-day daily forecast fields. It uses timeout handling and falls back to local fixtures on errors.

The weather route shows source, fetched time, API mode/status, current weather, rain/precipitation, wind, humidity, and a 5-7 day forecast.

## Privacy / Location Notes

- No browser geolocation.
- No GPS prompt.
- No user precise location storage.
- No Supabase write.
- No backend write.
- No cloud sync.
- Open-Meteo uses only configured default coordinates from env.
- Normal weather result state does not store/display raw lat/lon.

## Fallback Notes

Fallback remains available for:

- default local mode
- disabled modes
- production disabled mode
- invalid coordinates
- fetch unavailable
- Open-Meteo failure
- timeout/error states

The UI shows local fixture/fallback copy and farmer-friendly caution that weather forecasts can be wrong.

## Tests

Vitest coverage includes:

- default mode uses local fixture
- `open_meteo_disabled` does not fetch
- `production_disabled` does not fetch
- `open_meteo_ready` builds the expected endpoint with configured lat/lon
- API failure falls back to fixture
- weather code maps to Thai label
- no geolocation call occurs
- no precise location is stored in result state

Result:

- 16 test files passed.
- 173 tests passed.

## Verification Commands

```bash
npm run lint
npm run test
npm run build
```

Results:

- `npm run lint` passed.
- `npm run test` passed: 16 files, 173 tests.
- `npm run build` passed.
- Vite reported the existing large chunk warning after production build.

Manual route checks were run against `http://127.0.0.1:5173`. The in-app Browser runtime reported no available `iab` session, so checks used a local Edge headless DevTools DOM fallback.

Checked routes:

- `/app/weather` passed.
- `/app` passed.
- `/app/my-farm` passed.
- `/app/profile` passed.
- `/app/admin` passed.
- `/app/next-phase` passed.
- `/app/qa` passed.

## Known Limitations

- Open-Meteo is disabled by default.
- No user-selected location UI yet.
- No GPS/geolocation support.
- No weather cache persistence.
- No Supabase weather tables or writes.
- No backend weather proxy.
- No farm-specific weather preferences.
- Weather values are forecasts and may be wrong for field-level decisions.

## Next Recommended Milestone

M76 should add weather integration QA polish: stale/cache planning UI, safe user-selected coarse location design, Open-Meteo failure fixtures, offline cache readiness, and tests proving GPS and precise location storage remain opt-in and blocked by default.
