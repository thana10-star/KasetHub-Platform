# Weather Real API Env M100

## Purpose

M100 confirms the current Weather feature status before V1 Store Release Mode.

Weather already has a real Open-Meteo adapter, but the app remains offline-safe by default unless explicit frontend flags enable the live provider.

## Provider

- Provider: Open-Meteo Forecast API
- Endpoint: `https://api.open-meteo.com/v1/forecast`
- API key: not required for the public forecast endpoint used here
- Client file: `src/services/weather/weather-open-meteo-client.ts`
- Adapter file: `src/services/weather/weather-adapter.ts`

## Required Env Vars

Default local/offline-safe mode:

```env
VITE_WEATHER_MODE=local_fixture
VITE_ENABLE_REAL_WEATHER_API=false
VITE_WEATHER_DEFAULT_LAT=13.7563
VITE_WEATHER_DEFAULT_LON=100.5018
VITE_WEATHER_DEFAULT_LABEL=กรุงเทพฯ
```

Real Open-Meteo mode:

```env
VITE_WEATHER_MODE=open_meteo_ready
VITE_ENABLE_REAL_WEATHER_API=true
VITE_WEATHER_DEFAULT_LAT=13.7563
VITE_WEATHER_DEFAULT_LON=100.5018
VITE_WEATHER_DEFAULT_LABEL=กรุงเทพฯ
```

The adapter fetches Open-Meteo only when both `VITE_WEATHER_MODE=open_meteo_ready` and `VITE_ENABLE_REAL_WEATHER_API=true` are set and coordinates are valid.

## Local Setup

Set the weather variables in `.env.local` for local live testing.

Do not commit `.env.local`.

No Open-Meteo API key is needed. If a future weather provider requires a secret key, it must not be exposed through `VITE_` variables and should move behind a backend or Edge proxy before store release.

## Cloudflare Pages Setup

Configure the same weather variables in Cloudflare Pages project settings for the main production environment.

For V1 live weather:

- `VITE_WEATHER_MODE=open_meteo_ready`
- `VITE_ENABLE_REAL_WEATHER_API=true`
- `VITE_WEATHER_DEFAULT_LAT=<reviewed coarse latitude>`
- `VITE_WEATHER_DEFAULT_LON=<reviewed coarse longitude>`
- `VITE_WEATHER_DEFAULT_LABEL=<Thai display label>`

The current Open-Meteo setup does not require a secret API key, so there is no frontend secret exposure risk from these variables.

## Missing Or Disabled Env Behavior

If live weather flags are missing or disabled:

- `/app/weather` still renders.
- The page shows bundled/local weather backup data.
- Manual refresh stays disabled.
- No Open-Meteo network request is required.
- No GPS, browser geolocation, precise farm coordinate, backend write, Supabase write, or cloud sync is used.

## Secret Safety

- Never commit real `.env.local` files.
- Never place service-role keys or paid weather-provider secrets in `VITE_` variables.
- Treat `VITE_WEATHER_DEFAULT_LAT/LON` as coarse public configuration only, not a private farm location.
