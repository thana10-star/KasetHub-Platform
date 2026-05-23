# Weather API Integration Plan

This plan describes how KasetHub can later connect real weather data after the M32 local/mock foundation. No provider is connected in M32.

## Future Source Options

- TMD / กรมอุตุนิยมวิทยา for official Thai weather and warning context.
- Open-Meteo as a possible API provider for forecast data.
- Commercial weather providers if SLA, coverage, attribution, and cost fit KasetHub's needs.

## Source Selection Criteria

- Thailand coverage by province/district.
- Rainfall probability and intensity availability.
- Temperature, humidity, wind, UV, and warning data.
- Clear attribution requirements.
- Rate limits and caching allowance.
- Cost predictability.
- Reliability during storms or high-traffic periods.

## Caching Strategy

- Cache forecast snapshots in backend storage, not in the browser as a trusted source.
- Use freshness windows by data type:
  - hourly forecast: refresh every 1-3 hours when active.
  - daily forecast: refresh 2-4 times per day.
  - severe alerts: refresh more frequently when provider allows.
- Keep stale labels visible if data is older than policy.
- Do not show old warnings as current alerts.

## Location Privacy

- Default to manual province/location selection.
- Geolocation should be opt-in and explain the benefit in Thai.
- Store coarse location preferences where possible.
- Avoid storing precise latitude/longitude unless a feature truly requires it.
- Let users clear weather location preferences.

## Geolocation Permission Strategy

1. Show manual selector first.
2. Explain that geolocation is optional.
3. Ask permission only after user taps a clear button.
4. Handle denied permission without blocking the app.
5. Never request geolocation on page load.

## Agriculture Risk Rules

Future backend rules should map provider data into farmer-friendly labels:

- heavy rain: rainfall probability and expected amount above threshold.
- drought: extended low-rain period plus high temperature context.
- heat/high UV: temperature, heat index, and UV thresholds.
- strong wind: wind speed/gust thresholds relevant to spraying and orchard work.
- high humidity/disease risk: humidity duration plus crop-specific context.
- spraying window: low wind, low rain chance, moderate temperature.
- harvest window: low rain chance, dry enough conditions, crop-specific notes.

Rules must be documented, versioned, and reviewed before production use.

## User-Facing Disclaimer

Every production weather surface should include a short Thai disclaimer such as:

`ข้อมูลพยากรณ์อาจเปลี่ยนแปลง ควรตรวจสอบแหล่งทางการและสภาพพื้นที่จริงก่อนตัดสินใจทำงานในแปลง`

## Notification Future

Weather alerts should be evaluated server-side. The frontend should only display events created by a backend job after:

- source freshness check
- user consent check
- location preference check
- quiet-hour check
- dedupe/idempotency check
- delivery logging

## Backend Import Job Future

Future tables can include `weather_locations`, `weather_forecast_snapshots`, `weather_alert_preferences`, and `weather_alert_events`. Import jobs should record source, fetch time, payload hash, rows imported, freshness status, and rollback notes.

## Anti-Misinformation Rules

- Never state mock values as real forecasts.
- Always show source label and timestamp for real data.
- Mark stale forecasts.
- Avoid deterministic crop outcome claims.
- Escalate chemical/disease advice to expert guidance.
- Keep alert copy short, cautious, and source-attributed.
