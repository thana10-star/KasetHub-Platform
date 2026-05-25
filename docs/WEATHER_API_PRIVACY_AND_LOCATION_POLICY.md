# Weather API Privacy And Location Policy

M75 uses a privacy-first weather boundary.

## Location Rules

- No browser geolocation.
- No GPS prompt.
- No precise personal location storage.
- No farm/user location upload.
- No Supabase write.
- No backend write.
- No cloud sync.

The Open-Meteo path uses only configured env defaults:

- `VITE_WEATHER_DEFAULT_LAT`
- `VITE_WEATHER_DEFAULT_LON`
- `VITE_WEATHER_DEFAULT_LABEL`

The app displays the label, not the raw coordinates, in normal weather output.

## Default Safe Behavior

With default env values, the weather feature uses local fixture data and performs no network call.

Real weather fetching requires both:

- `VITE_WEATHER_MODE=open_meteo_ready`
- `VITE_ENABLE_REAL_WEATHER_API=true`

M100 confirms the current Open-Meteo public forecast endpoint does not require an API key. If a future provider requires a secret key, the integration should move behind a backend or Edge proxy before V1/store release.

## User-Facing Copy

Weather screens should state:

- no GPS is used
- no location is saved
- Open-Meteo data is external forecast data when enabled
- forecasts can be wrong and should be checked against real field conditions

## Future Work

Before user-selected farm weather preferences are added, KasetHub should define consent, coarse-location storage, cache expiry, deletion, and RLS rules. Precise location storage should remain opt-in and reviewed separately.

## M76 Coarse Location Rule

M76 adds only predefined coarse locations. Each location uses a province/city-center approximation with `precision = province_or_city_center`.

The app still blocks:

- GPS
- browser geolocation
- exact farm coordinates
- map pins
- precise personal location storage

Future persistence should store coarse location ids only unless a later milestone reviews consent, deletion, RLS, and privacy impact.
