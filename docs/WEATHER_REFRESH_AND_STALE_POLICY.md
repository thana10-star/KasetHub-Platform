# Weather Refresh and Stale Policy

M77 adds manual refresh behavior only. There are no background jobs or automatic refresh loops.

Rules:

- Manual refresh is disabled in `local_fixture`, `open_meteo_disabled`, and `production_disabled`.
- Manual refresh is available only when Open-Meteo is ready and the API flag is enabled.
- Refresh has a cooldown so repeated taps do not hammer the public API.
- Fresh cache can be used without fetching again.
- Stale cache may be shown when Open-Meteo fails.
- If there is no cache, the app falls back to bundled local fixture data.

User-facing stale copy:

- `ใช้ข้อมูลล่าสุดที่มีในเครื่อง`
- `ตรวจสอบข้อมูลจากแหล่งทางการเพิ่มเติม`

