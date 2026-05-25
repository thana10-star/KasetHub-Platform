# Home-first Navigation M92

M92 makes My Farm / Farm Records visible from the first screen of the app. M92.1 keeps that visibility but compacts the Home Farm Hub so Home works as a launcher, not a detailed Farm Records dashboard.

This is a UX/navigation document only. It does not add Supabase reads/writes, sync queue, cloud sync, GPS, AI Farm Records processing, receipt upload, OCR, notifications, tax, bank, or loan features.

## Current Navigation Problem

- My Farm was reachable from `/app/my-farm`, Profile, QA, and related feature pages, but it was not a first-screen signal on Home.
- The M92 Home Farm Hub made My Farm visible, but real mobile preview showed the card was too tall.
- Detailed farm metrics on Home pushed down AI, calculators, weather, videos, knowledge, and engagement entry points.
- The Profile page contains many prototype/admin/readiness entries. This remains useful for internal testing but too dense as a discovery surface for elderly or non-technical farmers.

## M92.1 Product Decision

Home should be a simple launcher into My Farm. Detailed Farm Records data should live inside:

- `/app/my-farm`
- `/app/farm-records`
- `/app/farm-records#farm-cost-dashboard`
- `/app/farm-records#farm-harvest-yield`

The compact Home card should not show:

- Profit/loss
- Cost per kg
- Latest harvest
- Latest farm record
- Farm Records quick-action grids
- Cost dashboard/weather shortcuts inside the Farm Hub card
- Dense Farm Records metrics

## Home Hierarchy

Home should prioritize:

1. Hero / welcome section
2. Compact My Farm launcher
3. AI, calculators, weather, videos, knowledge, community, and engagement/reward-ad entry points

## Compact Home Copy

The M92.1 Home Farm Hub card uses:

- `ฟาร์มของฉัน`
- `บันทึกงานในฟาร์ม รายรับรายจ่าย ต้นทุน และผลผลิต`
- `เปิดฟาร์มของฉัน`

Primary route:

- `/app/my-farm`

## What Should Stay In My Farm / Farm Records

My Farm and Farm Records should continue to show:

- Farm Records summary/status
- Cost dashboard links and metrics
- Harvest/yield and cost-per-kg context
- Recent farm timeline
- Export/restore/data-control links
- Sync consent prototype status

## What Should Stay In Profile

Profile should eventually focus on:

- Account
- Language
- Privacy
- Backup/sync settings
- Logout
- Advanced/internal QA only behind a clearer developer/admin grouping

## What Should Stay On Home

Home should keep a small set of farmer-facing entry points:

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

## M92.1 Decision

M92.1 does not remove existing routes or profile entries. It keeps My Farm visible on Home, reduces vertical space, and preserves detailed Farm Records experiences inside My Farm and Farm Records.
