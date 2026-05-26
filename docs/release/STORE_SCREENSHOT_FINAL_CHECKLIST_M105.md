# Store Screenshot Final Checklist M105

## Purpose

This checklist turns the M103 screenshot plan and M104 capture worksheet into a final V1 capture list. Capture should use the final production build or production URL after owner approval.

## Capture Rules

- Use Android phone portrait first.
- Prefer production URL or approved release build.
- Keep Thai text readable.
- Hide browser address bar if possible.
- Use clean sample data only.
- Avoid personal farm, income, phone, email, or precise location details.
- Avoid debug/internal labels.
- Avoid unfinished status labels.
- Avoid visible console, provider configuration, env labels, or owner-only controls.
- Avoid claims that imply official warnings, guaranteed results, or expert replacement.

## Final Screenshot List

| # | Screenshot | Route | Caption | Must show | Avoid showing | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Home AI-first | `/app` | Ask AI, check weather, use tools, and record farm work in one app. | Ask AI entry near top, Weather/Tools signal, bottom nav fitting. | crowded farm details, debug labels, browser address bar. | [ ] |
| 2 | Ask AI | `/app/ai` | Ask agriculture questions in Thai and verify important advice. | AI input/question area, examples, safety note. | provider/debug config, guaranteed correctness claims, sensitive user data. | [ ] |
| 3 | Weather live | `/app/weather` | Check live weather and farm planning risk. | current weather, location, rain/temperature/wind or risk cards. | GPS prompt, API/env details as main focus, official warning claims. | [ ] |
| 4 | Tools | `/app/calculators` | Practical calculators for farm planning. | calculator list, clear tap targets, crop/planning context. | pesticide certainty, tiny unreadable fields, unfinished labels. | [ ] |
| 5 | Calculator detail | `/app/calculators/plant-spacing` or `/app/calculators/fertilizer` | Plan spacing or fertilizer estimates before field work. | fields, result area, planning-only context. | exact guarantee wording, chemical dosage certainty, clipped controls. | [ ] |
| 6 | My Farm | `/app/my-farm` | Keep simple farm information in one place. | farm overview, entry to records, local-first context if visible. | personal farm data, dense analytics, cloud-sync implication. | [ ] |
| 7 | Farm Records Basic | `/app/farm-records` | Record plots, costs, income, and harvest in Basic Mode. | Basic Mode, three main actions, readable buttons. | schema/storage wording, advanced controls as main focus, real private data. | [ ] |
| 8 | Help/Profile optional | `/app/help` or `/app/profile` | Start guide, settings, privacy, and support. | help/start guide or profile/settings/support/privacy entry. | unfinished support placeholders, internal-only tools, personal contact data. | [ ] |

## Per-Screenshot Approval

- [ ] Route loads from the approved production URL or release build.
- [ ] Text remains readable on phone-size export.
- [ ] Bottom navigation is visible and not clipped.
- [ ] No horizontal scroll or layout clipping appears.
- [ ] No personal data, secrets, or precise private location appears.
- [ ] No browser address bar appears if a wrapper/PWA capture is available.
- [ ] Caption matches the actual visible screen.
- [ ] Screenshot does not imply official status, guaranteed AI correctness, guaranteed profit/yield, or expert replacement.

## Final Store Package Inputs

- [ ] Final app icon approved.
- [ ] Final screenshot set approved.
- [ ] Store short description approved.
- [ ] Store long description approved.
- [ ] Privacy policy URL public.
- [ ] Support contact public.
- [ ] Release channel confirmed.
