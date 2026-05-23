# Weather Forecast Agriculture Foundation

M32 adds a local/mock agriculture weather UX foundation for KasetHub. It prepares the product for rainfall, temperature, humidity, wind, UV/heat risk, disease-risk hints, and simple crop-work recommendations without connecting a real weather source.

## Current Boundary

- Data source: local fixtures only.
- User-facing label: `ข้อมูลตัวอย่าง`.
- Required disclaimer: `ยังไม่ใช่ข้อมูลพยากรณ์จริง`.
- No weather API.
- No geolocation permission request.
- No backend write.
- No Supabase write.
- No push notification.
- No production weather claim.

## App Surface

- `/app/weather` shows a location selector, today card, hourly rain chance mock, 7-day forecast mock, recommendation cards, risk badges, weather alert mock cards, and AI CTA.
- `/app/notifications` includes mock weather alert examples.
- Home quick actions, Profile, QA, and Admin link to weather.

## Local Data Model

Types live in `src/services/weather/weather.types.ts`:

- `WeatherLocation`
- `WeatherForecastDay`
- `WeatherForecastHour`
- `AgricultureWeatherRisk`
- `WeatherSource`
- `WeatherReliabilityLevel`
- `CropWorkRecommendation`
- `WeatherAlertMock`

Current fixture locations:

- กรุงเทพฯ
- เชียงใหม่
- นครราชสีมา
- ยโสธร
- จันทบุรี
- สุราษฎร์ธานี

## Agriculture Risk Rules

M32 uses simple rule labels only. They are not real agronomic warnings:

- `heavy_rain`
- `drought`
- `heat`
- `high_uv`
- `strong_wind`
- `high_humidity`
- `disease_risk`
- `good_spraying_window`
- `good_harvest_window`

Future production rules should be source-backed, region-aware, timestamped, and reviewed with agricultural experts before being used for advice or alerts.

## Crop Work Recommendation Boundary

Recommendations are phrased as low-risk suggestions:

- check fields after rain
- avoid spraying during wind/rain
- avoid hard work under high heat
- inspect drainage before heavy rain
- consider harvest timing only after checking local conditions

They must not become binding instructions. Any chemical, pesticide, disease, or harvest decision should encourage users to verify with local experts and official weather sources.

## Privacy

M32 does not request geolocation. Users choose from fixed sample locations. Future geolocation should be opt-in, explain why location is needed, allow manual province selection, and avoid storing precise coordinates unless strictly necessary.

## Notifications

M35 displays weather alerts inside the unified local Notification Center. They remain static mock cards only and do not trigger push, LINE, email, SMS, backend jobs, or Supabase writes. Future weather notifications require:

- user consent
- alert preferences
- source freshness checks
- backend evaluation job
- delivery log
- quiet hours
- clear disclaimer in every message

## AI Planning

The `/app/weather` CTA links to `/app/ai` only. It does not send weather context or call an AI provider. Future AI explanations must cite source label/date and avoid guaranteeing outcomes.

## My Farm Hub Relationship

M34 reads the selected/default mock weather context into `/app/my-farm` so farmers can see weather beside plots, crop watch, saved content, and recent questions. This remains fixture-only and does not store real forecast snapshots or request geolocation.
