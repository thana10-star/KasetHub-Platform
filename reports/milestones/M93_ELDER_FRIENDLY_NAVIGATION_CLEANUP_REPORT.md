# M93 Elder-Friendly Navigation Cleanup Report

## 1. Summary

M93 cleans up navigation for elderly and non-technical farmers by making My Farm available from the persistent bottom navigation and by separating Profile into clearer groups. The Home Farm Hub remains compact from M92.1, and full Farm Records details remain inside `/app/my-farm` and `/app/farm-records`.

M93 is UX/navigation only. It adds no Supabase schema, Supabase read/write, sync queue, cloud sync, GPS/geolocation, AI Farm Records processing, receipt upload, OCR, notifications, tax/bank/loan integration, or Farm Records storage change.

## 2. Files Created

- `docs/ux/ELDER_FRIENDLY_NAVIGATION_CLEANUP_M93.md`
- `reports/milestones/M93_ELDER_FRIENDLY_NAVIGATION_CLEANUP_REPORT.md`
- `src/routes/ProfilePage.tsx`
- `src/routes/ProfilePage.test.tsx`

## 3. Files Modified

- `README.md`
- `docs/MY_FARM_HUB_FOUNDATION.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/ux/HOME_FIRST_NAVIGATION_M92.md`
- `src/components/layout/BottomNav.tsx`
- `src/routes/AdminDashboardPage.tsx`
- `src/routes/QAPage.tsx`
- `src/services/admin/admin-dashboard-service.ts`
- `src/services/qa/mvp-readiness-audit.ts`
- `src/services/qa/route-registry.ts`

Verification/build also refreshed generated artifacts: `dist/index.html`, `node_modules/.vite/deps/_metadata.json`, and `tsconfig.app.tsbuildinfo`.

## 4. Navigation Audit Result

- Home already has the compact M92.1 My Farm launcher.
- `/app/my-farm` and `/app/farm-records` are stable and registered.
- Bottom navigation previously exposed Home, Video, AI, Community, and Profile, but not My Farm.
- Profile mixed farmer-facing links, account/settings links, privacy/data-control links, and internal Admin/QA/readiness links in one long flat list.
- Admin/QA/readiness routes are useful for development, but too technical for the main farmer-facing profile menu.

## 5. Profile/Menu Cleanup Behavior

Profile now groups links into:

- `บัญชีของฉัน`
- `ข้อมูลและความเป็นส่วนตัว`
- `ช่วยเหลือ`
- `สำหรับทีมงานหรือทดสอบ`

Admin, QA, Supabase readiness, staging, AI proxy status, content admin, and Guest Sync planning links remain accessible under the Advanced/team-testing group instead of appearing as one flat main menu.

## 6. Bottom Navigation Decision

M93 implements a dedicated My Farm bottom-nav slot because `/app/my-farm` already exists, the route is local-only, and My Farm is a core retention feature.

The bottom nav now uses:

- `หน้าแรก`
- `ฟาร์มของฉัน`
- `เครื่องมือ`
- `ถาม AI`
- `โปรไฟล์`

Video and community routes are not removed; they remain reachable from Home quick actions, content sections, route registry, and deep links.

## 7. My Farm Discoverability Behavior

My Farm is now reachable from:

- Home compact launcher.
- Bottom navigation.
- Profile Data & Privacy group.
- Related feature pages and route registry.

My Farm no longer depends on Profile discovery.

## 8. Elder-Friendly/Mobile Readability Behavior

- Thai-first bottom-nav labels are short and direct.
- `เครื่องมือ` replaces more technical calculator wording in bottom nav.
- `ถาม AI` is clearer than an unlabeled AI-only concept for non-technical users.
- Profile rows keep large tap targets and wrap Thai copy safely.
- Internal tooling is visually separated from farmer-facing account/privacy/help actions.
- Home compact Farm Hub remains compact and does not reintroduce detailed Farm Records metrics.

## 9. Tests/Checks Run

- `npm run lint` - passed.
- `npm run build` - passed. Vite emitted the existing large chunk size warning.
- `npm run test` - passed, 33 test files and 311 tests.
- Targeted M93 navigation tests - passed, 4 test files and 20 tests.
- `git diff --check` - no whitespace errors; Git reported existing LF-to-CRLF working-copy warnings.
- `npm run typecheck` - not available as a separate package script; `npm run build` runs `tsc -b`.

## 10. Manual Verification Result

- `http://127.0.0.1:5173/app` returned HTTP 200.
- `http://127.0.0.1:5173/app/my-farm` returned HTTP 200.
- `http://127.0.0.1:5173/app/farm-records` returned HTTP 200.
- `http://127.0.0.1:5173/app/profile` returned HTTP 200.
- Automated tests verify grouped Profile navigation, Advanced separation for Admin/QA/readiness links, My Farm bottom-nav access, compact Home Farm Hub preservation, My Farm rendering, and Farm Records rendering.
- In-app Browser verification was attempted, but `agent.browsers.list()` returned no browser targets. No screenshot, mobile-overflow, tap-target, or console-error browser check was available in this session.

## 11. Known Limitations

- Advanced/internal tools are grouped but not collapsed because the app does not yet have a shared disclosure component.
- No field usability session with elderly farmers was performed in this milestone.
- Video/community bottom-nav slots were replaced by My Farm/Tools, but those routes remain reachable elsewhere.

## 12. Next Recommended Milestone

M94 Elder-Friendly Settings Polish: add language/support placeholders, refine Profile copy after user testing, and consider a collapsible Advanced section when the shared UI pattern exists.
