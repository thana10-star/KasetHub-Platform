# M34 My Farm Hub Upgrade Foundation Report

## Summary

M34 upgrades My Farm into a local-first farmer workspace. `/app/my-farm` now summarizes saved plant analysis, farm area plots, watched crops, mock weather context, saved articles/videos, recent AI questions, next actions, and a local timeline in one Thai-first dashboard.

No real backend, Supabase write, real auth requirement, real AI API, real weather API, map/GPS, cloud sync, destructive data loss action, or network call was added.

## Files Changed

- `src/services/my-farm/my-farm.types.ts`
- `src/services/my-farm/my-farm-hub-service.ts`
- `src/hooks/useMyFarmHub.ts`
- `src/routes/MyFarmPage.tsx`
- `src/routes/MyFarmSettingsPage.tsx`
- `src/app/App.tsx`
- `src/types/kaset.ts`
- `src/routes/AnalyzePage.tsx`
- `src/routes/FarmAreaPage.tsx`
- `src/routes/WeatherPage.tsx`
- `src/routes/CropWatchPage.tsx`
- `src/routes/ProfilePage.tsx`
- `src/routes/QAPage.tsx`
- `src/services/qa/route-registry.ts`
- `src/services/qa/mvp-readiness-audit.ts`
- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/GUEST_MEMORY_FRAMEWORK.md`
- `docs/FARM_AREA_MEASUREMENT_FOUNDATION.md`
- `docs/WEATHER_FORECAST_AGRICULTURE_FOUNDATION.md`
- `docs/CROP_WATCH_PRICE_ALERT_UX.md`
- `docs/PLANT_IMAGE_ANALYSIS_PIPELINE.md`
- `docs/M30_NEXT_PHASE_DECISION.md`
- `docs/SUPABASE_SCHEMA_DRAFT.md`
- `docs/SUPABASE_TYPE_MAPPING.md`
- `docs/MY_FARM_HUB_FOUNDATION.md`
- `reports/milestones/M34_MY_FARM_HUB_UPGRADE_FOUNDATION_REPORT.md`

## Routes Added

- `/app/my-farm/settings`

## Aggregation Notes

`useMyFarmHub()` aggregates local data from:

- Guest Memory farm records
- saved plant analysis result summaries
- farm area saved plots from `kasethub.farmArea.v1`
- crop watch records from `kasethub.cropWatch.v1`
- weather fixture context
- saved articles/videos
- recent AI questions

The hub does not create a new source of truth. It reads existing local stores and returns:

- `MyFarmHubSummary`
- `MyFarmQuickAction`
- `MyFarmTimelineItem`
- `MyFarmInsightCard`
- `MyFarmLocalDataWarning`
- `MyFarmNextAction`

## My Farm Dashboard Notes

`/app/my-farm` now includes:

- hero summary card
- local-only notice
- quick actions:
  - วิเคราะห์โรคพืช
  - วัดพื้นที่แปลง
  - ดูสภาพอากาศ
  - ติดตามราคาพืช
  - ถาม AI
- แปลงของฉัน
- ประวัติวิเคราะห์โรคพืช
- พืช/ราคาที่ติดตาม
- สภาพอากาศที่เกี่ยวข้อง
- บทความ/วิดีโอที่บันทึกไว้
- คำถาม AI ล่าสุด
- suggested next actions
- settings entry point

Empty states guide users to the next safe local action.

## Timeline Notes

The local timeline combines:

- saved analysis result
- Guest Memory farm record
- saved farm plot
- crop watch follow/update
- AI question
- saved article
- saved video

Timeline items show date, item type, title, CTA route, and local/demo source label.

## Screens Updated

- `/app/my-farm` upgraded into the central farmer workspace.
- `/app/my-farm/settings` added for local data status, backup CTA, image privacy, Guest Memory, and future cloud sync guidance.
- `/app/analyze` links back to My Farm Hub.
- `/app/farm-area` already links back to My Farm and now feeds the hub.
- `/app/weather` links back to My Farm Hub.
- `/app/crop-watch` links back to My Farm Hub.
- `/app/profile` links to My Farm settings.
- `/app/qa` and route registry include My Farm Hub/settings.

## Verification Commands

```bash
npm run lint
npm run build
```

Both passed. The production build completed with the existing Vite large chunk warning.

## Manual Route Checks

The in-app Browser plugin was unavailable in this session, so route verification used local Vite on `http://127.0.0.1:5174` plus a headless Chrome DOM check.

Passed:

- `/app/my-farm`
- `/app/my-farm/settings`
- `/app/analyze`
- `/app/farm-area`
- `/app/weather`
- `/app/crop-watch`
- `/app/profile`
- `/app/qa`

The local Vite server was stopped after verification.

## Known Limitations

- No real backend.
- No Supabase writes.
- No real auth requirement.
- No real cloud sync.
- No real AI API.
- No real weather API.
- No map/GPS.
- No cross-device My Farm workspace.
- My Farm timeline is local/demo only and rebuilt from local browser state.
- Settings route provides guidance only and does not add destructive clear-data behavior.

## Next Recommended Milestone

M35 should begin a controlled Supabase Auth staging adapter for real session ownership, or define the backend-owned My Farm sync/read model before any cloud My Farm data is enabled.
