# Real Weather API: Open-Meteo

M75 adds the first real external API integration for KasetHub weather while keeping the default app path offline-safe.

## Provider

- Provider: Open-Meteo Forecast API
- Endpoint: `https://api.open-meteo.com/v1/forecast`
- Docs: https://open-meteo.com/en/docs
- Key requirement: no API key for the public forecast path used by M75
- Current use: current weather plus daily forecast
- Default app mode: `local_fixture`

Open-Meteo documentation notes that `/v1/forecast` accepts latitude, longitude, weather variables, and returns JSON forecast data. M75 uses only the configured default coordinates from env and does not request browser geolocation.

## Env Flags

```env
VITE_WEATHER_MODE=local_fixture
VITE_ENABLE_REAL_WEATHER_API=false
VITE_WEATHER_DEFAULT_LAT=13.7563
VITE_WEATHER_DEFAULT_LON=100.5018
VITE_WEATHER_DEFAULT_LABEL=กรุงเทพฯ
```

Allowed modes:

- `local_fixture`
- `open_meteo_disabled`
- `open_meteo_ready`
- `production_disabled`

The API is called only when `VITE_WEATHER_MODE=open_meteo_ready` and `VITE_ENABLE_REAL_WEATHER_API=true`.

## Requested Variables

Current:

- `temperature_2m`
- `relative_humidity_2m`
- `precipitation`
- `weather_code`
- `wind_speed_10m`

Daily:

- `weather_code`
- `temperature_2m_max`
- `temperature_2m_min`
- `precipitation_sum`
- `precipitation_probability_max`
- `wind_speed_10m_max`

## UI Boundary

`/app/weather` shows:

- current temperature
- humidity when available
- precipitation/rainfall
- wind speed
- 5-7 day forecast
- data source
- fetched time
- API mode/status
- fallback notice
- farmer-friendly warnings before spraying

## Safety Copy

The route must keep these reminders visible:

- `ข้อมูลอ้างอิงจาก API ภายนอก`
- `ก่อนพ่นยาให้ดูฝนและลม`
- `ข้อมูลอากาศเป็นการพยากรณ์ อาจคลาดเคลื่อนได้`

## M75 Boundaries

M75 does not add GPS, personal location storage, Supabase writes, backend writes, cloud sync, AI calls, payment, ads, or weather cache persistence.
