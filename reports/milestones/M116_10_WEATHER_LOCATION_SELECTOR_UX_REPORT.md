# M116.10 Weather Location Selector UX Report

## 1. Summary

Updated `/app/weather` so location selection is clearly visible near the top of the Weather page, before the main forecast card. The page now guides farmers to choose an approximate province/city first, then confirm before the weather view updates.

## 2. Owner Feedback Addressed

The owner review noted that farmers from other provinces may not understand where to choose their own area. The selector is now a dedicated top card titled `เลือกพื้นที่ของคุณ`, visually connected to the weather card below it.

## 3. Weather Page Layout Changes

The primary page order is now:

1. `สภาพอากาศเกษตร` header.
2. `เลือกพื้นที่ของคุณ` location selector card.
3. `อากาศตอนนี้` current weather card.
4. Weather risk section.
5. Refresh controls and lower source/details content.

## 4. Location Selector Behavior

The selector uses:

- A province/city dropdown.
- A large `ยืนยันพื้นที่ของคุณ` button.
- `พื้นที่ปัจจุบัน` selected-area feedback.
- Pending selected-area copy before confirm.
- Shortcut chips for common locations.

Confirming uses the existing weather `selectLocation` behavior.

## 5. Province/City vs Amphoe Decision

V1 remains province/city-level because the existing preset data is already coarse and privacy-safe. Amphoe-level support can be added later with a maintained mapping table, but no district database was introduced in this milestone.

## 6. Privacy / No-GPS Behavior

No GPS, browser geolocation, exact farm pin, map pin, or precise personal location storage was added. Copy now explicitly says the selector uses approximate province/city areas and does not store detailed location.

## 7. Tests / Checks Run

Completed:

- `npm run test -- WeatherPage`
- `npm run lint`
- `npm run build`
- `npm run test`
- `git diff --check`
- Browser route smoke: `/app/weather`, `/app`, `/app/prices`, `/app/community`, `/app/ai`, `/app/profile`
- Browser interaction smoke: selected `ขอนแก่น`, tapped `ยืนยันพื้นที่ของคุณ`, and confirmed the weather card updated to the selected area.

## 8. Mobile Smoke Result

Passed at 390px width:

- Selector visible near top.
- Selector appears before the current-weather card.
- Selected location is visible.
- Confirm button is visible and large enough to tap.
- Weather card remains readable below the selector.
- Bottom navigation remains visible.
- No horizontal overflow detected.

## 9. Known Limitations

- Location choices remain the existing province/city presets.
- Amphoe-level selection is not included.
- Weather source/cache details remain available lower on the page for transparency.

## 10. Owner Retest Steps

1. Open `/app/weather`.
2. Confirm `เลือกพื้นที่ของคุณ` appears before `อากาศตอนนี้`.
3. Select another province/city from the dropdown.
4. Tap `ยืนยันพื้นที่ของคุณ`.
5. Confirm the current weather card shows the selected area.
6. Confirm there is no GPS prompt and no map/pin request.
7. Check mobile width around 390px for readable layout and no horizontal scroll.
