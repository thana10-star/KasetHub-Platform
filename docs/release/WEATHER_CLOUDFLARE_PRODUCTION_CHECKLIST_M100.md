# Weather Cloudflare Production Checklist M100

## Goal

Verify that `/app/weather` can run in Cloudflare Pages production with the real Open-Meteo path enabled, while preserving the no-GPS and no-secret boundary.

## Checklist

1. Confirm main deploy is based on merge commit `45793c7` or newer.
2. In Cloudflare Pages, open the production environment variables.
3. Set `VITE_WEATHER_MODE=open_meteo_ready`.
4. Set `VITE_ENABLE_REAL_WEATHER_API=true`.
5. Set coarse default location variables:
   - `VITE_WEATHER_DEFAULT_LAT`
   - `VITE_WEATHER_DEFAULT_LON`
   - `VITE_WEATHER_DEFAULT_LABEL`
6. Confirm no secret weather API key is required for the current Open-Meteo public endpoint.
7. Trigger a fresh main deploy.
8. Open `/app/weather`.
9. Confirm weather data shows as coming from Open-Meteo.
10. Confirm refresh works and does not show a route error.
11. Temporarily test missing/disabled flags in a preview environment if needed:
    - `/app/weather` should still render with backup data.
12. Confirm the browser does not request GPS permission.
13. Confirm no exact farm location or personal coordinates are stored.
14. Confirm mobile layout has no horizontal scroll.
15. Confirm there are no console errors.
16. Confirm farmer-facing copy is Thai-first and does not read like a QA/debug page.

## Key Boundaries

- No Supabase write.
- No backend write.
- No cloud sync.
- No GPS/geolocation.
- No precise farm coordinate storage.
- No secrets in the frontend bundle.

## Owner Action

Codex cannot verify Cloudflare Pages deployment status from the local workspace without access to the Cloudflare project. The project owner should run this checklist after setting production environment variables.
