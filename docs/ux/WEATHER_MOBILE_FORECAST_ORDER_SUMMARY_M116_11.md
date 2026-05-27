# M116.11 Weather Mobile Forecast Order Summary

## Summary

M116.11 fixes the `/app/weather` mobile overflow issue, moves the 5-7 day forecast directly below the current weather card, and adds a richer current-weather summary for daily farm planning.

This pass resumed from an interrupted working tree. The existing Weather page layout changes, summary helper, targeted tests, and draft docs were preserved, then verified and finished from that state.

## Mobile Overflow Fix

The location selector uses an explicit mobile-first layout:

- Province select is full width on mobile.
- `ยืนยันพื้นที่ของคุณ` sits below the select on mobile.
- The button keeps compact height and rounded premium styling.
- Common province chips wrap safely.
- Weather page content uses `min-w-0` and guarded horizontal overflow to prevent document-level sideways scroll.

## Forecast Order

The Weather page order is:

1. Header.
2. `เลือกพื้นที่ของคุณ`.
3. `อากาศตอนนี้`.
4. `พยากรณ์ 5-7 วัน`.
5. `ความเสี่ยงอากาศเบื้องต้น`.
6. Update actions.
7. Source/details.

Stale/fallback notices remain present but lower than the main forecast and risk planning flow.

## Rich Current Summary

The current weather card now renders a short planning summary from available values:

- Condition label.
- Today rain chance.
- Current or today wind speed.

Rules:

- Rain chance 50% or higher mentions the exact available percentage and advises checking before spraying/watering.
- Rain chance 30-49% says there may be rain in some periods and advises leaving room in outdoor plans.
- Rain chance below 30% uses low-rain copy without emphasizing the exact percentage.
- Wind at 24 km/h or higher adds a warning about plants or lightweight structures.
- If required values are unavailable, the summary falls back to `เปิดดูพยากรณ์เพื่อวางแผนงานวันนี้`.

The 24 km/h wind threshold follows the existing weather risk logic where wind at this level is treated as high enough to affect spraying decisions.

## Non-Goals Preserved

- No GPS or browser geolocation.
- No exact farm coordinates.
- No map pins.
- No Weather provider change.
- No fake weather values.
- No exact rain timing unless future hourly data supports it.
- No backend behavior changes.

## Verification

Completed checks:

- `npm run test -- WeatherPage weather-current-summary weather-adapter`
- `npm run lint`
- `npm run build`
- `npm run test`
- `git diff --check`
- Browser route smoke for `/app/weather`, `/app`, `/app/prices`, `/app/community`, `/app/ai`, and `/app/profile`
- 390px mobile smoke for `/app/weather`

390px mobile smoke confirmed:

- Document width stayed at 390px with no horizontal overflow.
- App scroll container stayed at 380px with no horizontal overflow.
- Province selector, dropdown, and confirm button fit inside the app frame.
- Selected area text remained visible.
- Current weather summary rendered richer planning copy.
- Forecast appeared after current weather and before the risk section.
