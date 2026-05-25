# V1 Owner Verification Checklist M103

## Purpose

This checklist is for owner-side V1 release verification after M102. It focuses on Cloudflare Weather production setup, real-device mobile checks, screenshot capture, and store-readiness blockers.

M103 does not add new app systems. The V1 scope stays frozen.

## 1. Cloudflare Weather Live Check

Owner setup in Cloudflare Pages production environment variables:

- `VITE_WEATHER_MODE=open_meteo_ready`
- `VITE_ENABLE_REAL_WEATHER_API=true`
- `VITE_WEATHER_DEFAULT_LAT=13.7563`
- `VITE_WEATHER_DEFAULT_LON=100.5018`
- `VITE_WEATHER_DEFAULT_LABEL=กรุงเทพฯ`

Manual verification:

- [ ] Save the production env vars in Cloudflare Pages.
- [ ] Trigger a production deploy.
- [ ] Open `/app/weather` on the production URL.
- [ ] Confirm live forecast data loads.
- [ ] Confirm there is no GPS/geolocation permission prompt.
- [ ] Confirm the primary farmer UI does not show visible env, provider, debug, or internal labels.
- [ ] Confirm the page remains readable on a real phone.
- [ ] Confirm fallback behavior is still acceptable if live weather is disabled later.

Expected boundary:

- No Open-Meteo API key is needed for the current V1 path.
- Do not add secret keys to frontend `VITE_` variables.
- Do not commit `.env.local` or production env values.

## 2. Mobile Route Checklist

Open each route on a real phone:

- [ ] `/app`
- [ ] `/app/ai`
- [ ] `/app/weather`
- [ ] `/app/calculators`
- [ ] `/app/my-farm`
- [ ] `/app/farm-records`
- [ ] `/app/help`
- [ ] `/app/profile`

Check each route:

- [ ] No horizontal scroll.
- [ ] Thai labels are readable without zooming.
- [ ] Bottom navigation fits and remains tappable.
- [ ] AI card is visible from Home.
- [ ] Weather content is readable.
- [ ] Tools and calculators are usable on the phone.
- [ ] My Farm is not too crowded on the first screen.
- [ ] Farm Records Basic Mode is clear and starts from the main simple actions.
- [ ] No unexpected GPS, camera, upload, notification, login, or sync prompt appears.

## 3. Screenshot Capture Checklist

Capture store/release screenshots after the production route checks are clean:

- [ ] Home
- [ ] Ask AI
- [ ] Weather
- [ ] Tools / Calculators
- [ ] My Farm
- [ ] Farm Records Basic Mode
- [ ] Profile / Settings

Capture guidance:

- Use real Thai text in the app UI.
- Prefer a clean phone status bar and no debug overlays.
- Avoid showing personal farm data, private income/cost details, or test secrets.
- Use the production URL after Cloudflare Weather env is verified if possible.

## 4. Store Readiness Blockers

These items must be resolved before public store submission:

- [ ] App icon final.
- [ ] Screenshots final.
- [ ] Privacy policy URL final.
- [ ] Support email/contact final.
- [ ] App wrapper decision final.
- [ ] Production AI provider decision documented separately.
- [ ] Cloudflare Weather env confirmed in production.

## 5. Scope Freeze Reminder

Do not add these before closing the V1 release blockers:

- real AI provider enablement
- Supabase writes
- cloud sync
- GPS/geolocation
- OCR/image diagnosis
- receipt upload
- notifications
- Farm Records storage/schema changes
- store submission automation

## M104 Handoff

Use the M104 worksheets for the actual production verification pass:

- `docs/release/OWNER_PRODUCTION_VERIFICATION_WORKSHEET_M104.md`
- `docs/release/RELEASE_SCREENSHOT_CAPTURE_WORKSHEET_M104.md`
- `docs/release/V1_RELEASE_BLOCKER_LOG_M104.md`
- `docs/release/M104_OWNER_COMMANDS_AND_LINKS.md`

