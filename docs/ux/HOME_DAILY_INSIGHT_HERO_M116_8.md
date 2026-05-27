# M116.8 Home Daily Insight Hero

## Purpose

The Home hero gives farmers a compact start-of-day summary without turning Home into a data-heavy report. It keeps weather near the top, makes AI and prices easy to reach through the dashboard below, and adds a denser `ข้อมูลวันนี้` block for quick scanning.

## Current Hero Content

- Main title: `สภาพอากาศวันนี้`
- Location: existing coarse weather location label
- Weather values: temperature and rain chance only when the existing weather hook has ready non-fallback data
- Primary CTAs: `ดูพยากรณ์` to `/app/weather` and `เช็กราคา` to `/app/prices`
- Daily insight title: `ข้อมูลวันนี้`

## Daily Insight Rows

1. `อากาศ`
   - Soft blue accent.
   - Uses existing weather condition, temperature, and rain chance only when ready non-fallback weather data is available.
   - Uses `เปิดดูพยากรณ์เพื่อวางแผนวันนี้` when Home does not yet have usable weather values.

2. `งานเกษตร`
- Soft yellow accent for normal planning guidance.
- Switches to soft red only for high-risk weather signals such as rain chance at or above 70%, heat at or above 35°C, or wind at or above 24 กม./ชม.
- Keeps advice short, such as checking rain before spraying or watering.

3. `ราคา`
   - Soft orange accent.
   - Uses `ข้าว / มัน / ยาง / ปาล์ม กำลังเตรียมเชื่อมข้อมูลจริง`.
   - Does not show numeric prices, trend arrows, sparklines, or charts before a real price source exists.

## Color Language

- Dark green remains the KasetHub identity color and hero base.
- Blue is for weather state.
- Yellow is for normal farm work planning.
- Orange is for price/market readiness.
- Red is reserved for real high-risk or warning states only.
- The hero status badge uses soft red when Home needs the user to check the Weather page before relying on daily planning, or when available weather values are high-risk.

## Future Price And Chart Readiness

When a real price source is connected later, the hero or nearby price section can show:

- 2-4 selected commodity prices.
- Latest price values.
- A compact mini trend chart or sparkline.
- Source label and updated date.
- A stale-data label when the source is old or unavailable.

Do not add those price values, trend arrows, or charts until they are backed by real data and a clear source timestamp.

## Guardrails

- No backend behavior changes.
- No production Community writes.
- No AI provider enablement.
- No Supabase writes or cloud sync.
- No GPS/geolocation.
- No push notifications.
- No fake prices, fake price trends, fake charts, or fake Community engagement.
- Bottom navigation remains `หน้าแรก`, `ราคาเกษตร`, `ชุมชน`, `ถาม AI`, `โปรไฟล์`.
