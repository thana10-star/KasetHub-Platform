# Weather UI Navigation Polish M104.1

## Purpose

M104.1 applies V1 release-blocking Weather and navigation polish from owner mobile production screenshots.

This is UI/navigation polish only. It does not change the Weather provider, enable GPS, add Supabase writes, add cloud sync, enable real AI, add OCR/image diagnosis, add notifications, or change Farm Records storage/schema.

## Weather Page Priority

`/app/weather` now follows a farmer-first order:

1. Header: `สภาพอากาศเกษตร`
2. Coarse location selector
3. Main current weather card
4. Agriculture risk summary
5. Update actions
6. Source/cache/system details under `ข้อมูลเพิ่มเติม / รายละเอียดแหล่งข้อมูล`

The first user-facing Weather content is no longer an API/source/status block.

## Source And Status Placement

Primary Weather copy stays short:

- `ข้อมูลพยากรณ์ล่าสุด`
- `อัปเดตล่าสุด`
- `พื้นที่`
- no-GPS copy near the coarse location selector

Advanced details now hold:

- Open-Meteo/source wording
- cache/fallback wording
- mode/system status
- source-readiness links
- clear cache action

## Risk Colors

Weather agriculture risk levels now use shared visual classes:

- `low / ต่ำ`: green
- `watch / เฝ้าดู`: blue
- `caution / ระวัง`: orange/yellow
- `high / สูง`: red/pink

Risk cards are sorted by severity and stay one column on narrow mobile screens.

## Route Scroll Behavior

`ScrollToTop` is wired into the app shell.

- Normal route changes scroll the app content container to top.
- Hash routes such as `/app/farm-records#farm-cost-dashboard` preserve anchor navigation.

## Home Navigation

The shared page header `showBack` action now links to `/app` with accessible label `กลับหน้าแรก`.

This gives main pages a clear Home affordance while the bottom navigation Home slot remains available.

## Owner Mobile Verification

After deploy, check:

- `/app/weather` starts with location/weather, not API status.
- `ระวัง` risk cards look orange/yellow.
- high risk cards look red/pink.
- low risk cards do not look alarming.
- no horizontal overflow on Weather.
- changing routes starts at the top.
- main pages have a visible Home affordance.

