# Cloudflare Weather Live Enable M102

## Purpose

M102 prepares the owner-side steps to enable live Open-Meteo weather on the Cloudflare Pages production/main environment.

The current Weather path does not require an API key or secret. It uses coarse default coordinates and must not request GPS.

## Owner Steps

1. Open the Cloudflare Pages project for KasetHub.
2. Go to `Settings` -> `Environment variables`.
3. Add or update the production variables:
   - `VITE_WEATHER_MODE` = `open_meteo_ready`
   - `VITE_ENABLE_REAL_WEATHER_API` = `true`
   - `VITE_WEATHER_DEFAULT_LAT` = `13.7563`
   - `VITE_WEATHER_DEFAULT_LON` = `100.5018`
   - `VITE_WEATHER_DEFAULT_LABEL` = `กรุงเทพฯ`
4. Save the variables.
5. Trigger a production/main deploy.
6. Open `/app/weather`.
7. Confirm real forecast data loads.
8. Confirm the page does not request GPS permission.
9. Confirm there are no console errors.
10. Confirm mobile layout has no horizontal scroll.
11. If the env vars are removed or disabled later, confirm `/app/weather` still renders fallback/backup data.

## Default Location

The current safe default is Bangkok city-center:

- latitude: `13.7563`
- longitude: `100.5018`
- label: `กรุงเทพฯ`

The owner may change this to another coarse province/city-center location. Do not use an exact farm, home, or personal coordinate as the default.

## Secret Safety

- No Open-Meteo API key is required for the current public forecast endpoint.
- Do not add paid provider secrets to `VITE_` variables.
- Do not commit `.env.local`.
- If a future weather provider requires a secret key, move it behind a backend or Edge proxy before V1 release.

## Expected Result

When the production env vars are enabled, `/app/weather` should show current forecast data from Open-Meteo and still keep the same farmer-facing safety boundaries:

- no GPS prompt
- no precise location storage
- no Supabase write
- no backend write
- no cloud sync
- no notification
