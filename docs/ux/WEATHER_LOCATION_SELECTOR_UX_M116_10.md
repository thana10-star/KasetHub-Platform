# M116.10 Weather Location Selector UX

## Summary

M116.10 polishes the `/app/weather` page so farmers can choose an approximate province/city before reading the forecast. The selector now appears directly under the Weather page header and before the main current-weather card.

## Owner Feedback Addressed

The previous Weather page exposed location choices, but the controls could feel detached from the weather summary. The updated layout makes area selection a first step:

1. Header and short page subtitle.
2. `เลือกพื้นที่ของคุณ` selector card.
3. Main `อากาศตอนนี้` weather card.
4. Weather risk, refresh controls, source details, and longer forecast content.

## Selector Behavior

The primary selector is a simple province/city dropdown with a large confirm button:

- Label: `จังหวัด/เมืองใกล้เคียง`
- Button: `ยืนยันพื้นที่ของคุณ`
- Current state: `พื้นที่ปัจจุบัน: ...`
- Pending state: shows the selected area and asks the user to confirm before updating the forecast.

Shortcut chips are retained for the first few common areas, but they now update the pending selection instead of immediately switching the forecast. The confirm button runs the existing `selectLocation` flow.

## Privacy Boundary

This polish keeps the existing privacy model:

- No GPS.
- No browser geolocation prompt.
- No exact farm pin.
- No precise personal location storage.
- Area selection remains province/city-center level.

Primary page copy says `ไม่ใช้ GPS` and `ไม่เก็บตำแหน่งละเอียด` in farmer-facing language. Technical source/cache details stay lower in the `ข้อมูลเพิ่มเติม / รายละเอียดแหล่งข้อมูล` section.

## Province/City vs Amphoe

V1 remains province/city-level because that data already exists and is safe for approximate forecasts. District/amphoe selection can be added later with a vetted lat/lon mapping table, but this milestone does not invent district data or add precise location capture.

## Mobile Notes

At mobile width, the selector card uses a full-width dropdown and confirm button with large touch targets. The main weather card remains immediately below the selector, keeping the flow clear without horizontal scrolling.

## Non-Goals Preserved

- No GPS/geolocation.
- No maps or pins.
- No backend writes.
- No Weather provider changes.
- No fake weather data.
- No changes to Community, Prices, AI, or Farm Records.
