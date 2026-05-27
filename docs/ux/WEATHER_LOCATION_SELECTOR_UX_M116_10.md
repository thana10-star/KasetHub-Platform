# M116.10 Weather Location Selector UX

## Summary

M116.10 polishes the `/app/weather` page so farmers can choose an approximate province before reading the forecast. The selector now appears directly under the Weather page header and before the main current-weather card.

## Owner Feedback Addressed

The previous Weather page exposed location choices, but the controls could feel detached from the weather summary. The updated layout makes area selection a first step:

1. Header and short page subtitle.
2. `เลือกพื้นที่ของคุณ` selector card.
3. Main `อากาศตอนนี้` weather card.
4. Weather risk, refresh controls, source details, and longer forecast content.

## Selector Behavior

The primary selector is a simple province dropdown with a compact premium confirm button:

- Label: `จังหวัด`
- Button: `ยืนยันพื้นที่ของคุณ`
- Current state: `พื้นที่ปัจจุบัน: ...`
- Pending state: shows the selected area and asks the user to confirm before updating the forecast.

The dropdown is sourced from the shared weather province configuration and includes all 77 Thai provinces grouped by region. Shortcut chips are retained for common areas, but they update the pending selection instead of immediately switching the forecast. The confirm button runs the existing `selectLocation` flow.

## Follow-Up Polish

The M116.10 follow-up addressed two owner review items:

- Province coverage expanded from the original common presets to all 77 provinces of Thailand.
- The confirm button was reduced from a large block-style CTA to a smaller rounded green action with subtle shadow, icon support, and mobile-safe tap sizing.

## M116.11 Mobile Overflow Note

M116.11 tightened the mobile selector layout after owner screenshots showed sideways scrolling on `/app/weather`:

- The province dropdown and confirm button now use an explicit one-column mobile grid.
- The dropdown is full width on mobile.
- The confirm button sits below the dropdown on mobile and uses compact height with safe tap sizing.
- Common province chips wrap instead of forcing a horizontal page overflow.
- The page content wrapper clips accidental horizontal overflow without hiding normal vertical content.

## Privacy Boundary

This polish keeps the existing privacy model:

- No GPS.
- No browser geolocation prompt.
- No exact farm pin.
- No precise personal location storage.
- Area selection remains province-level using approximate province/city-center coordinates.

Primary page copy says `ไม่ใช้ GPS` and `ไม่เก็บตำแหน่งละเอียด` in farmer-facing language. Technical source/cache details stay lower in the `ข้อมูลเพิ่มเติม / รายละเอียดแหล่งข้อมูล` section.

## Province/City vs Amphoe

V1 remains province-level because it is broad enough for privacy-safe approximate forecasts and now covers every Thai province. District/amphoe selection can be added later with a vetted lat/lon mapping table, but this milestone does not invent district data or add precise location capture.

## Mobile Notes

At mobile width, the selector card uses a full-width native dropdown with a compact confirm button beneath it. Common-province chips wrap inside the selector card, so the page avoids horizontal overflow. The main weather card remains immediately below the selector.

## Non-Goals Preserved

- No GPS/geolocation.
- No maps or pins.
- No backend writes.
- No Weather provider changes.
- No fake weather data.
- No changes to Community, Prices, AI, or Farm Records.
