# Elder-Friendly Navigation Cleanup M93

M93 reduces navigation clutter for elderly and non-technical farmers while preserving every existing route.

This is a UX/navigation milestone only. It adds no Supabase read/write path, sync queue, cloud sync, GPS/geolocation, AI Farm Records processing, receipt upload, OCR, notifications, tax, bank, or loan feature.

## 1. Current Issue

- My Farm is now visible from Home after M92/M92.1, but Profile still mixed farmer-facing links, account settings, privacy/data controls, Admin, QA, readiness, and internal development tools in one long list.
- Long flat menus make it hard for older users to find the next useful action.
- Internal labels such as Admin, QA, readiness, sync prototype, and Supabase are useful for the team, but they should not compete with farmer-facing actions.
- Home must stay compact after M92.1 so AI, calculators, weather, videos, knowledge, and engagement entry points remain visible.

## 2. User Behavior Assumption

Real family/mobile observation suggests many everyday farmers will look mostly at the first screen and the bottom navigation. They may not explore Profile deeply, and they may stop if a page looks like a technical settings list.

The app should make the main farmer actions obvious without requiring profile-menu discovery.

## 3. Farmer-Facing Navigation Hierarchy

Recommended primary navigation:

1. `หน้าแรก`
2. `ฟาร์มของฉัน`
3. `เครื่องมือ`
4. `ถาม AI`
5. `โปรไฟล์`

Home should remain a compact launcher surface. My Farm and Farm Records should hold detailed farm status, cost, yield, export/restore, and sync-consent information.

## 4. Profile Menu Grouping Proposal

Profile should be grouped into:

- `บัญชีของฉัน`: account state, sign-in preview, saved articles/videos, notification settings.
- `ข้อมูลและความเป็นส่วนตัว`: My Farm, Farm Records backup/restore, local memory, image privacy, future backup preview.
- `ช่วยเหลือ`: calculators, weather, farm-area tools, offline knowledge, community rules.
- `สำหรับทีมงานหรือทดสอบ`: Admin, QA, readiness, Supabase staging, phone OTP staging, AI proxy status, content admin, Guest Sync plans, and other internal tools.

Technical words can remain in the Advanced group because that area is explicitly for team/testing work.

## 5. Bottom Navigation Recommendation

M93 implements a dedicated `ฟาร์มของฉัน` bottom-nav slot because:

- `/app/my-farm` already exists.
- The route is local-only and stable.
- My Farm is a retention core, not an internal tool.
- Home still links to My Farm with the compact M92.1 launcher.
- Existing video/community routes remain reachable from Home quick actions and route registry.

M93 also renames calculator access in bottom nav to `เครื่องมือ` to avoid technical wording.

## 6. What Was Implemented In M93

- Profile menu was refactored from one long flat list into four grouped cards.
- Internal/Admin/QA/readiness links moved into `สำหรับทีมงานหรือทดสอบ`.
- Bottom navigation now shows `หน้าแรก`, `ฟาร์มของฉัน`, `เครื่องมือ`, `ถาม AI`, and `โปรไฟล์`.
- Home compact Farm Hub remains compact and still links only to `/app/my-farm`.
- `/app/my-farm`, `/app/farm-records`, Admin, QA, readiness, video, community, weather, calculators, and all existing deep links remain available.

## 7. What Remains Future

- Field testing with older farmers and family users.
- A production-ready settings page with language and support contact flows.
- A final decision on whether Weather or Knowledge should become a bottom-nav slot after usage data.
- Collapsible advanced sections if the design system adds a disclosure component.
- Separating internal/Admin surfaces from production builds when real auth/RBAC exists.

## 8. Non-goals

- No route removal.
- No Farm Records storage change.
- No Supabase schema/read/write.
- No sync queue or cloud sync.
- No GPS/geolocation.
- No AI processing of Farm Records.
- No receipt upload, OCR, notifications, tax, bank, or loan integration.
- No full design-system rewrite.
