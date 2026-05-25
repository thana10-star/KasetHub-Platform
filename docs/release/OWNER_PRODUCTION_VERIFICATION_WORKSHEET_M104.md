# Owner Production Verification Worksheet M104

## Purpose

Use this worksheet during owner-side production verification for V1 release preparation. It is meant to be filled out while checking GitHub, Cloudflare production deploy, live Weather env, real-phone routes, AI safety, and store blockers.

M104 does not add product features or enable new systems.

## Verification Session

- Owner / checker:
- Date:
- Production URL:
- Preview URL, if any:
- Device(s):
- Browser(s):
- Notes:

## 1. GitHub / Main

- [ ] `main` branch latest commit confirmed.
- [ ] No unintended PR left open.
- [ ] Local working tree is clean or contains only known generated/release files.
- [ ] No `.env`, `.env.local`, API key, token, or secret is staged or committed.
- [ ] Latest release docs are visible in `docs/release/`.

Notes:

-

## 2. Cloudflare Production Deploy

- [ ] Production deploy triggered.
- [ ] Deploy successful.
- [ ] Production URL recorded.
- [ ] Preview URL recorded if any.
- [ ] Production URL opens without a blank screen.
- [ ] Deploy is from intended branch/commit.

Production URL:

Preview URL:

Deploy notes:

-

## M104.2 Owner Mobile Re-check Status

Owner verified M104.1 on a real mobile device. Weather UI and navigation behavior are acceptable for V1.

| Check | Status | Notes |
| --- | --- | --- |
| Weather UI | passed | Current Weather content priority is acceptable on mobile. |
| Weather live display | passed | Live Weather display is acceptable for V1. |
| Risk colors | passed | Low, caution, and high risk colors are acceptable on mobile. |
| Route scroll-to-top | passed | Route changes start at the top as expected. |
| Home/back affordance | passed | Main pages have an acceptable Home affordance. |
| Owner mobile check | passed | M104.1 passed owner real-mobile verification. |

## 3. Weather Live Env

Cloudflare Pages production env values:

- [ ] `VITE_WEATHER_MODE=open_meteo_ready`
- [ ] `VITE_ENABLE_REAL_WEATHER_API=true`
- [ ] `VITE_WEATHER_DEFAULT_LAT=13.7563`
- [ ] `VITE_WEATHER_DEFAULT_LON=100.5018`
- [ ] `VITE_WEATHER_DEFAULT_LABEL=กรุงเทพฯ`

Weather route verification:

- [ ] `/app/weather` shows live forecast.
- [ ] `/app/weather` starts with location/weather content, not source/API status.
- [ ] Weather source/API/cache details are lower under `ข้อมูลเพิ่มเติม / รายละเอียดแหล่งข้อมูล`.
- [ ] Risk color `ระวัง` is orange/yellow.
- [ ] High risk is red/pink and low risk is calm green/blue-green.
- [ ] No GPS/geolocation permission prompt appears.
- [ ] No console errors appear during page load.
- [ ] No visible env/provider/debug labels appear in the primary farmer UI.
- [ ] Forecast copy remains understandable on mobile.
- [ ] Weather page still communicates planning/safety limits.

Weather notes:

-

## 4. Mobile Route QA

Open each route on a real phone using the production URL.

| Route | Loads | No horizontal scroll | Thai text readable | Bottom nav OK | No obvious dev/prototype wording | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `/app` | [ ] | [ ] | [ ] | [ ] | [ ] | |
| `/app/ai` | [ ] | [ ] | [ ] | [ ] | [ ] | |
| `/app/weather` | [ ] | [ ] | [ ] | [ ] | [ ] | |
| `/app/calculators` | [ ] | [ ] | [ ] | [ ] | [ ] | |
| `/app/my-farm` | [ ] | [ ] | [ ] | [ ] | [ ] | |
| `/app/farm-records` | [ ] | [ ] | [ ] | [ ] | [ ] | |
| `/app/help` | [ ] | [ ] | [ ] | [ ] | [ ] | |
| `/app/profile` | [ ] | [ ] | [ ] | [ ] | [ ] | |

Extra checks:

- [ ] Home shows Ask AI clearly.
- [ ] Weather is readable and not crowded.
- [ ] Tools/calculators can be tapped and used.
- [ ] My Farm first screen is not too crowded.
- [ ] Farm Records Basic Mode is clear.
- [ ] Profile/support/privacy entries are understandable.
- [ ] No unexpected GPS, camera, upload, notification, login, cloud sync, or payment prompt appears.
- [ ] Navigating from a long page to a new route starts at the top.
- [ ] Main pages show a clear Home affordance, such as `กลับหน้าแรก`.

Mobile QA notes:

-

## 5. AI Safety QA

- [ ] AI page safety note is visible.
- [ ] AI fallback state is not broken when real provider is disabled.
- [ ] Copy does not claim AI is always correct.
- [ ] Copy does not claim AI replaces experts or official sources.
- [ ] Copy does not make unsafe certainty claims.
- [ ] Copy does not overclaim pesticide, chemical, fertilizer, disease, profit, or yield certainty.
- [ ] Any high-risk advice tells users to verify with labels, experts, local officers, or trusted sources.

AI notes:

-

## 6. Store Blocker Check

- [ ] App icon ready.
- [ ] Screenshots captured.
- [ ] Privacy URL ready.
- [ ] Support contact ready.
- [ ] Wrapper path decided.
- [ ] Cloudflare Weather production env verified.
- [ ] Production AI provider decision documented separately.

Store blocker notes:

-

## Final Decision

- [ ] Ready for next release step.
- [ ] Not ready; blockers added to `docs/release/V1_RELEASE_BLOCKER_LOG_M104.md`.

Decision notes:

-
