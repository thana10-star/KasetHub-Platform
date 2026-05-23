# My Farm Hub Foundation

M34 upgrades `/app/my-farm` from a plant-analysis history page into a local-first farmer workspace. The hub summarizes the useful local data a farmer has already created across KasetHub without adding backend writes or real sync.

## Current Boundary

- No real backend.
- No Supabase write.
- No real auth requirement.
- No real AI API.
- No real weather API.
- No map or GPS.
- No network call.
- No destructive data loss action.
- Guest Memory and localStorage remain active.

User-facing copy should keep saying that My Farm data is stored on this device only until a real account/cloud sync path is enabled.

## Data Sources

M34 aggregates existing local sources only:

- Guest Memory farm records.
- Saved plant analysis result summaries.
- Farm area saved plots from `kasethub.farmArea.v1`.
- Crop Watch followed crops and alert preferences from `kasethub.cropWatch.v1`.
- Weather fixture context from the selected/default mock weather location.
- Saved articles and videos from Guest Memory.
- Recent AI questions from Guest Memory.

The hub does not create a new source of truth. It reads existing stores and turns them into summary cards, quick actions, timeline items, and next-action suggestions.

## New Files

- `src/services/my-farm/my-farm.types.ts`
- `src/services/my-farm/my-farm-hub-service.ts`
- `src/hooks/useMyFarmHub.ts`

Key types:

- `MyFarmHubSummary`
- `MyFarmQuickAction`
- `MyFarmTimelineItem`
- `MyFarmInsightCard`
- `MyFarmLocalDataWarning`
- `MyFarmNextAction`

## Dashboard Sections

`/app/my-farm` now shows:

- hero summary card
- local-only notice
- quick actions
- overview insight cards
- suggested next actions
- saved plots
- plant analysis history
- watched crops/price context
- mock weather context
- saved articles/videos
- recent AI questions
- notification summary link
- local timeline
- settings link

Quick actions:

- วิเคราะห์โรคพืช
- วัดพื้นที่แปลง
- ดูสภาพอากาศ
- ติดตามราคาพืช
- ถาม AI

## Timeline Rules

The local timeline is built from:

- saved analysis result
- Guest Memory farm record
- saved farm plot
- crop watch follow/update
- AI question
- saved article
- saved video

Timeline items include date, item type, title, CTA route, and a local/demo source label. Items are sorted newest first and capped to keep the dashboard readable.

## Settings Route

`/app/my-farm/settings` shows:

- local data status
- local storage source labels
- notification settings link
- backup account CTA
- image privacy link
- Guest Memory link
- future cloud sync note
- clear-data guidance without adding a new destructive action

## Future Cloud Sync

Future backend work should keep My Farm as a dashboard over user-owned data rather than a separate monolithic table. Cloud sync should map source records into separate backend-owned tables, then generate dashboard views from them.

Recommended future tables:

- `farm_profiles`
- `farm_dashboard_preferences`
- `farm_timeline_events`
- `farm_insights`

These should complement existing/future records such as `farm_records`, `farm_plots`, `farm_plot_measurements`, `crop_price_watches`, saved content, and AI history.

## Safety Rules

- Do not upload raw images from My Farm.
- Do not treat mock weather as real forecast.
- Do not treat crop prices as production prices.
- Do not treat farm area estimates as official land survey results.
- Do not delete local data from the hub without an explicit, reviewed recovery/confirmation flow.
- Do not sync until real auth ownership and RLS are verified.
- Do not treat local notification preferences as real push/LINE/SMS consent.
