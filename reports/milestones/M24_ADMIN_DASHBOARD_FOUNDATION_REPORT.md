# M24 Admin Dashboard Foundation Report

## Summary

M24 adds a local/mock Admin Dashboard foundation for KasetHub. Future admins can preview platform health across content, YouTube import readiness, community moderation, crop price sources, crop watch, AI safety, plant analysis, Guest Sync, Auth, and system health before any real admin auth or backend writes exist.

No real backend, Supabase write, admin auth, network call, moderation action, AI provider, YouTube API, destructive action, or server-side state change was added.

## Files Changed

- `src/services/admin/admin.types.ts`
- `src/services/admin/admin-fixtures.ts`
- `src/services/admin/admin-dashboard-service.ts`
- `src/routes/AdminDashboardPage.tsx`
- `src/app/App.tsx`
- `src/routes/ProfilePage.tsx`
- `src/routes/QAPage.tsx`
- `src/types/kaset.ts`
- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/FARMER_ACCESSIBILITY_VISUAL_QA.md`
- `docs/COMMUNITY_MODERATION_FOUNDATION.md`
- `docs/CONTENT_MANAGEMENT_FOUNDATION.md`
- `docs/CROP_PRICE_DATA_SOURCE_FOUNDATION.md`
- `docs/AI_AGRICULTURE_SAFETY_POLICY.md`
- `docs/SUPABASE_SCHEMA_DRAFT.md`
- `docs/SUPABASE_TYPE_MAPPING.md`
- `docs/ADMIN_DASHBOARD_FOUNDATION.md`
- `docs/ADMIN_ROLES_AND_PERMISSIONS_PLAN.md`
- `reports/milestones/M24_ADMIN_DASHBOARD_FOUNDATION_REPORT.md`

## Routes Added

- `/app/admin`

Accessible from:

- `/app/profile`
- `/app/qa`

## Admin Module Notes

Admin modules modeled:

- `content`
- `youtube_import`
- `community`
- `moderation`
- `crop_prices`
- `crop_watch`
- `ai_safety`
- `plant_analysis`
- `guest_sync`
- `auth`
- `system_health`

`/app/admin` uses tabs inside a single route:

- Overview
- Content
- Moderation
- Crop Prices
- AI Safety
- System

The route shows summary cards, review queue cards, module health cards, local reports, crop price source readiness, YouTube import readiness, AI safety/risk previews, Guest Sync/Auth readiness, and recent audit log previews.

## Role/Permission Notes

Planned admin roles:

- `owner`
- `admin`
- `editor`
- `moderator`
- `expert_reviewer`
- `support`

Future permissions documented:

- content publish
- video import approve
- community moderation
- crop price review
- AI safety review
- plant analysis escalation
- user support
- audit logs

M24 does not grant any real permission. Role labels and permissions are planning artifacts only.

## Data Sources Used

The admin dashboard reads existing local/mock data from:

- M20 content fixtures and YouTube import planner
- M23 community moderation reports and mock moderator queue
- M21 crop price sources and demo price items
- M22 crop watch localStorage state
- M08 AI credit state
- M13/M14 AI proxy adapter status
- M16 Guest Sync adapter status
- M17/M19 phone and LINE auth adapter status
- M06 Supabase status
- Guest Memory local state for user-local counts

All data remains local/mock. No admin page performs real writes.

## Screens Updated

- `/app/admin` added as the Admin Dashboard preview.
- `/app/profile` links to Admin Dashboard.
- `/app/qa` includes Admin Dashboard in reviewed route links.

Required boundary copy appears in the admin UI:

- “หน้านี้เป็นตัวอย่างระบบผู้ดูแล ยังไม่มีสิทธิ์จริง”
- “ยังไม่เชื่อมต่อ backend”
- “การกดปุ่มในหน้านี้ไม่เปลี่ยนข้อมูลจริงบน server”

## Documentation Updates

- Added `docs/ADMIN_DASHBOARD_FOUNDATION.md`.
- Added `docs/ADMIN_ROLES_AND_PERMISSIONS_PLAN.md`.
- Updated README and project blueprint for M24.
- Updated accessibility/QA guidance for admin preview clarity.
- Updated content, community moderation, crop price, and AI safety docs to describe `/app/admin` monitoring.
- Updated Supabase schema/type mapping docs for:
  - `admin_roles`
  - `admin_audit_logs`
  - `moderation_queue`
  - `expert_review_requests`
  - `content_review_tasks`
  - `crop_price_review_tasks`
  - `ai_safety_review_logs`

No migrations were run.

## Verification Commands

```bash
npm run lint
npm run build
```

Both passed. The production build completed with the existing Vite large chunk warning.

## Manual Route Checks

Checked with local Vite plus headless Chrome DOM markers:

- `/app/admin`
- `/app/profile`
- `/app/qa`
- `/app/content-admin-preview`
- `/app/moderation-center`
- `/app/prices`
- `/app/ai-proxy-status`

## Known Limitations

- No real admin auth.
- No backend writes.
- No Supabase writes or migrations.
- No real admin role enforcement.
- No real moderation action.
- No real content publish action.
- No real crop price review or import job.
- No real AI safety provider or review backend.
- No real YouTube API or transcript import.
- No destructive actions.
- Audit logs are fixture previews only.
- Dashboard counts are local/mock and browser-specific where localStorage is involved.

## Next Recommended Milestone

M25 should define backend-owned admin RBAC and audit logging: admin route guard contract, role claims, server-side permission checks, append-only audit logs, review task lifecycle, RLS policy design, and safe rollback/correction rules before any real admin action is enabled.
