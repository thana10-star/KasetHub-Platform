# Home-first Navigation M92

M92 makes My Farm / Farm Records visible from the first screen of the app. This is a UX/navigation milestone only. It does not add Supabase reads/writes, sync queue, cloud sync, GPS, AI Farm Records processing, receipt upload, OCR, notifications, tax, bank, or loan features.

## Current Navigation Problem

- The app home route previously emphasized content, notifications, and generic quick actions before the Farm Records retention feature.
- My Farm was reachable from `/app/my-farm`, Profile, QA, and related feature pages, but it was not a first-screen signal on Home.
- Farm Records had grown into a useful local record book, but everyday farmers could miss it if they did not open Profile, QA, or developer-facing lists.
- The Profile page contains many prototype/admin/readiness entries. This is useful for internal testing but too dense as a discovery surface for elderly or non-technical farmers.

## Farmer Behavior Assumption

Older farmers and everyday users often use the first visible screen and large obvious buttons. They may not explore nested menus, profile pages, debug labels, sync planning pages, or technical settings. The most important retention feature should therefore be visible on Home.

## M92 Home Hierarchy

Home should prioritize:

1. My Farm / Farm Records
2. Weather
3. Calculators
4. Knowledge, videos, community, and AI help

The M92 home Farm Hub card uses Thai-first copy:

- `ฟาร์มของฉัน`
- `บันทึกงานในฟาร์ม รายรับรายจ่าย ต้นทุน กำไร และผลผลิต`
- `เปิดฟาร์มของฉัน`
- `เปิดสมุดฟาร์ม`

## Home Quick Actions

The Home Farm Hub shows four large actions:

- `ฟาร์มของฉัน` -> `/app/my-farm`
- `บันทึกงานในฟาร์ม` -> `/app/farm-records`
- `รายรับรายจ่าย` -> `/app/farm-records#farm-cost-dashboard`
- `เช็กอากาศวันนี้` -> `/app/weather`

Labels avoid technical words such as dashboard, ledger, sync, and prototype.

## What Should Stay In Profile

Profile should eventually focus on:

- Account
- Language
- Privacy
- Backup/sync settings
- Logout
- Advanced/internal QA only behind a clearer developer/admin grouping

## What Should Stay On Home

Home should keep a small set of farmer-facing actions:

- My Farm
- Weather
- Calculators
- Knowledge/videos/community
- AI help, only with clear local/mock/provider status

## Future Bottom Navigation Proposal

Before production, consider a simpler bottom navigation:

- Home
- My Farm
- Weather or Tools
- Knowledge/AI
- Profile

Do not move sync, backup, or privacy controls out of settings entirely. Those controls should remain findable from My Farm and Profile, but they should not be the primary way to discover Farm Records.

## M92 Decision

M92 does not remove existing routes or profile entries. It adds home-first access and documents the cleanup plan so future milestones can reduce menu clutter without breaking internal QA surfaces.
