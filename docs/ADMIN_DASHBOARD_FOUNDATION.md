# Admin Dashboard Foundation

M24 adds a local/mock Admin Dashboard foundation for KasetHub. It gives future owners, admins, editors, moderators, expert reviewers, and support staff one preview surface for monitoring platform health before any real admin auth or backend writes exist.

## Current Boundary

- No real backend.
- No Supabase writes.
- No real admin auth.
- No real network calls.
- No real moderation actions.
- No real AI provider.
- No real YouTube API.
- Guest Memory remains active.

Required UI copy:

- “หน้านี้เป็นตัวอย่างระบบผู้ดูแล ยังไม่มีสิทธิ์จริง”
- “ยังไม่เชื่อมต่อ backend”
- “การกดปุ่มในหน้านี้ไม่เปลี่ยนข้อมูลจริงบน server”

## Route

- `/app/admin`

The route is linked from:

- `/app/profile`
- `/app/qa`

M25 also links `/app/admin` to `/app/supabase-readiness` so future admins can review staging blockers before turning on real Supabase.

## Admin Modules

M24 models these admin modules:

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

## Data Sources Used

The dashboard reads local/mock state from existing foundations:

- M20 content fixtures and YouTube import planner
- M21 crop price sources and demo reference price fixtures
- M22 crop watch localStorage state
- M23 community moderation localStorage state and mock moderator queue
- M08-M14 AI credits and AI proxy adapter status
- M16 Guest Sync adapter status
- M17-M19 phone/LINE auth and account boundary status
- M06 Supabase readiness status
- M25 Supabase staging readiness audit score and blockers

## Panels

`/app/admin` uses tabs inside a single route:

- Overview
- Content
- Moderation
- Crop Prices
- AI Safety
- System

This keeps the admin foundation lightweight while leaving room for future module routes.

## Future Backend Requirements

Before real admin actions exist, KasetHub should add:

- admin authentication and route guards
- role-based access control
- server-side permission checks
- append-only audit logs
- moderation queue assignment
- expert review workflow
- content review workflow
- crop price review workflow
- AI safety review workflow
- read-only support views
- strict RLS and service-role-only writes

The frontend must not own final admin decisions for production content, moderation, price publishing, AI safety, or user support.

## Known Limitations

- Dashboard numbers are mock/local and may be zero on a fresh browser.
- Buttons are preview-only or navigational.
- No admin action writes to a server.
- No queue assignment, approval, publish, hide, rollback, or escalation action is real.

## M25 Supabase Readiness Boundary

The admin dashboard now shows a Supabase staging readiness card and links to `/app/supabase-readiness`. This is still an audit/checklist only. It does not connect to Supabase, fetch project data, run migrations, enable auth, write backend records, or use service-role credentials.

## M30 Internal MVP Snapshot

The admin dashboard now links to `/app/mvp-snapshot` and shows a compact module readiness overview. The snapshot summarizes route coverage, storage mode, high-risk modules, production blockers, and recommended next milestones.

This remains local/mock only. It does not add admin auth, RBAC, server permissions, writes, backend reads, or destructive actions.
