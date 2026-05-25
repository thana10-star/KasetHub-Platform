# M94 Elder-Friendly Settings Polish Report

## 1. Summary

M94 polishes `/app/profile` into a clearer `โปรไฟล์และการตั้งค่า` page for elderly and non-technical farmers.

The page keeps the M93 groups, adds safe placeholders for language/help/support, clarifies local data and cloud sync status, and collapses internal/Admin/QA tools by default while preserving their links.

## 2. Files Created

- `docs/ux/ELDER_FRIENDLY_SETTINGS_POLISH_M94.md`
- `reports/milestones/M94_ELDER_FRIENDLY_SETTINGS_POLISH_REPORT.md`

## 3. Files Modified

- `src/routes/ProfilePage.tsx`
- `src/routes/ProfilePage.test.tsx`
- `src/services/qa/route-registry.ts`
- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/MY_FARM_HUB_FOUNDATION.md`
- `docs/ux/ELDER_FRIENDLY_NAVIGATION_CLEANUP_M93.md`

Generated/pre-existing dirty files (`dist/index.html`, `node_modules/.vite/deps/_metadata.json`, `tsconfig.app.tsbuildinfo`) were not part of the M94 source edits.

## 4. Profile/Settings Polish Behavior

- `/app/profile` now uses the title `โปรไฟล์และการตั้งค่า`.
- The profile header is shorter and less visually dominant.
- Safety copy explains that farm data remains on this device, cloud sync is not enabled, and some settings are future placeholders.
- The first three groups remain visually primary: `บัญชีของฉัน`, `ข้อมูลและความเป็นส่วนตัว`, and `ช่วยเหลือ`.

## 5. Placeholder Settings Behavior

- `ภาษา`: placeholder only, marked `เร็ว ๆ นี้`.
- `วิธีใช้แอพ`: placeholder only, marked `เร็ว ๆ นี้`.
- `ติดต่อทีมงาน`: placeholder only, marked `เร็ว ๆ นี้`.
- `ข้อมูลและความเป็นส่วนตัว`: links to `/app/farm-records#farm-records-export`.
- `กู้คืนข้อมูลฟาร์ม`: links to `/app/farm-records#farm-records-restore`.
- `การซิงก์ข้อมูล`: links to `/app/farm-records#farm-records-sync`, shows `ยังไม่เปิดใช้งาน ข้อมูลยังอยู่ในเครื่องนี้`, and status `ปิดอยู่`.

## 6. Advanced/Internal Section Behavior

`สำหรับทีมงานหรือทดสอบ` is collapsed by default with a native disclosure.

Admin, QA/system checks, MVP snapshot, next phase, Supabase staging readiness, Phone OTP staging, AI proxy status, AI credits, image preflight, moderation, content admin, Guest Sync status/Edge plan, and account linking links remain accessible.

## 7. Elder-Friendly/Mobile Readability Behavior

- Rows use large minimum tap targets.
- Thai labels are short and wrap-friendly.
- Technical labels are reduced in the primary groups.
- Cloud sync is shown as off without enabling any sync path.
- Advanced tools are visually secondary and do not dominate the first screen.
- Bottom nav remains unchanged with `หน้าแรก`, `ฟาร์มของฉัน`, `เครื่องมือ`, `ถาม AI`, and `โปรไฟล์`.

## 8. Tests/Checks Run

- `npm run lint` passed.
- `npm run build` passed. This runs `tsc -b`; no separate `npm run typecheck` script exists. Vite reported the existing large chunk warning.
- `npm run test` passed: 33 test files, 313 tests.
- `npm run test -- ProfilePage` passed during development: 5 tests.
- `git diff --check` passed with line-ending warnings only.

## 9. Manual Verification Result

Dev server started at `http://127.0.0.1:5173`.

HTTP 200 checks passed:

- `/app/profile`
- `/app`
- `/app/my-farm`
- `/app/farm-records`

The Browser connector was unavailable in this session (`agent.browsers.list()` returned `[]`), so visual/mobile overflow and console-error verification could not be completed in the in-app browser. Automated render tests and HTTP route checks were used as the fallback verification path.

## 10. Known Limitations

- Language switching is not implemented.
- Help center content is not implemented.
- Support/contact is placeholder only; no chat or backend exists.
- Privacy copy is intentionally plain and not legal-final PDPA copy.
- Cloud sync remains disabled; no sync queue or Supabase read/write was added.
- No Farm Records storage/schema/backend behavior changed.

## 11. Next Recommended Milestone

M95 should focus on a lightweight farmer help/start guide and field-test feedback for the settings page, still without enabling cloud sync, support chat, legal-final copy, or backend writes.
