# Weather API Fallback And Cache Plan

M75 adds real weather API readiness without making network access required.

## Fallback Behavior

Fallback to local fixture data when:

- weather mode is `local_fixture`
- weather mode is `open_meteo_disabled`
- weather mode is `production_disabled`
- real API flag is false
- configured coordinates are invalid
- browser fetch is unavailable
- Open-Meteo returns an error
- request times out

Fallback copy should clearly say the app is using local/mock weather data.

## Timeout

The Open-Meteo client uses a timeout so `/app/weather` does not hang on weak connections. Timeout failure must not break the weather route.

## Cache Planning

No persistent cache is added in M75.

Future cache planning may add:

- `weather_cache`
- `weather_api_events`
- `farm_weather_preferences`

Cache records should include:

- source label
- coarse location label or reviewed preference id
- fetched timestamp
- expiry timestamp
- stale status
- source response status
- no raw precise personal location unless separately consented and reviewed

## Stale Data

The UI should support a stale state before future cache persistence. Stale weather must be labeled as stale and should not be shown as live data.

## Offline First

The local fixture remains the baseline so the app is still useful with no network, no key, and no weather provider availability.

## M76 Local Cache Behavior

M76 adds local-only cache support:

- fresh cache avoids fetch
- stale cache displays a stale warning
- API failure can use stale cache
- no cache plus API failure falls back to local fixture
- selected-location cache can be cleared locally

No Supabase cache table or backend cache job is added in M76.
