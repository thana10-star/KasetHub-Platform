# Weather Source Attribution Policy

M77 requires every weather screen to tell the user where the data came from.

Required labels:

- `ข้อมูลอ้างอิงจาก Open-Meteo` when the flag-gated Open-Meteo path is active.
- `ข้อมูลออฟไลน์/ข้อมูลจำลอง` when local fixtures are used.
- `ข้อมูลอาจล่าช้าหรือคลาดเคลื่อนได้` on every weather result view.

The app must show:

- source label
- fetched time or fallback update label
- stale/cache age when available
- fallback reason when API data is not used
- no-GPS/no-precise-location status

Open-Meteo remains disabled unless `VITE_WEATHER_MODE=open_meteo_ready` and `VITE_ENABLE_REAL_WEATHER_API=true` are explicitly set.

