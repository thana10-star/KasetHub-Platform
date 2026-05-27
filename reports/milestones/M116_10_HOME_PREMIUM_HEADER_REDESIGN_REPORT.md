# M116.10 Home Premium Header Redesign Report

## 1. Summary

M116.10 redesigns the `/app` Home header into a branded premium green header with a logo mark, decorative curved layers, matched notification/profile controls, and rounded lower corners. The work is UI/design-only.

## 2. Scope

- Changed the Home header visual treatment.
- Kept the weather strip, price snapshot, latest video card, quick actions, Community preview, My Farm card, routes, bottom nav, and data behavior unchanged.
- Did not change backend logic, security behavior, writes, AI provider, weather behavior, price behavior, or Community behavior.

## 3. Files Created

- `docs/ux/HOME_PREMIUM_HEADER_M116_10.md`
- `reports/milestones/M116_10_HOME_PREMIUM_HEADER_REDESIGN_REPORT.md`

## 4. Files Modified

- `src/routes/AppHomePage.tsx`
- `src/routes/AppHomePage.test.tsx`

## 5. Header Behavior

The new header shows:

- Logo mark using the existing `Sprout` icon.
- `KasetHub`.
- `ผู้ช่วยเกษตรในมือถือ`.
- Notification entry point.
- Profile entry point.

## 6. Visual Treatment

- Rich green background.
- Layered circular shapes.
- Thin white curved accent lines.
- Rounded lower corners.
- Soft shadow/depth.
- White translucent icon controls that match the branded header.

## 7. Mobile Notes

The header is built for mobile-first use around 390px wide. It keeps the brand text, logo, notification button, and profile button visible without horizontal overflow, and the weather card below remains readable.

## 8. Tests And Verification

- `npm run test -- AppHomePage` passed: 12 tests.
- `npm run lint` passed.
- `npm run build` passed with the existing large-bundle warning.
- `npm run test` passed: 44 test files, 397 tests.
- `git diff --check` passed with line-ending warnings only.
- Route smoke passed for `/app`, `/app/weather`, `/app/prices`, `/app/community`, `/app/ai`, and `/app/profile`.
- Mobile smoke around 390px for `/app` passed: no horizontal overflow, premium header visible and styled, logo visible, notification/profile controls visible, weather strip readable, and bottom nav unchanged.

## 9. Known Limitations

- No real logo asset exists yet, so the header uses the existing farm/leaf-style `Sprout` icon.
- Decorative shapes are CSS-based rather than a bespoke brand illustration.

## 10. Owner Retest Steps

1. Open `/app` at about 390px wide.
2. Confirm the premium green header appears at the top.
3. Confirm the logo mark, `KasetHub`, and subtitle are readable.
4. Confirm notification and profile buttons are visible and tappable.
5. Confirm the weather strip below remains readable.
6. Confirm bottom nav remains unchanged.
