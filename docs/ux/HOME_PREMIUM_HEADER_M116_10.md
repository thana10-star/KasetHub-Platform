# M116.10 Home Premium Header Redesign

## Summary

M116.10 upgrades the `/app` Home header from a plain light bar into a branded premium header. The change is visual only and keeps route structure, feature logic, weather behavior, price behavior, Community behavior, security behavior, and bottom navigation unchanged.

## Header Design

- Dark green / rich green background.
- Rounded lower corners to separate the brand area from the dashboard content.
- Soft shadow for depth.
- Layered circular forms and curved accent lines built with CSS.
- Subtle white border/accent lines.
- Mobile-first spacing that keeps controls readable at around 390px width.

## Header Content

- Left side:
  - Rounded logo mark using the existing `Sprout` icon.
  - `KasetHub`.
  - `ผู้ช่วยเกษตรในมือถือ`.
- Right side:
  - Notification button linking to `/app/notifications`.
  - Profile button linking to `/app/profile`.

## Integration With Home

The weather strip below the header is pulled slightly upward so the header and weather card feel like one cohesive top stack. The weather strip, price snapshot, latest video card, quick cards, Community card, and My Farm card keep their existing behavior from M116.9.

## Guardrails

- No backend logic changed.
- No write behavior enabled.
- No weather, price, or Community data rules changed.
- No bottom nav item changed.
- No fake backend behavior or secrets added.
- Decorative styling uses CSS only and avoids heavy animation.
