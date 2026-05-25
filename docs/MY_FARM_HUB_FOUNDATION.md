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
- M83-M96 Farm Records and Farm Finance Ledger from `kasethub.farmRecords.v1` and `/app/farm-records`, including local edit/timeline/export/restore/recovery/data-control, sync consent prototype status, cost summary, category breakdowns, harvest/yield records, cost-per-kg metrics, break-even estimate status, a Home-first My Farm entry point, Profile settings data-control links, a farmer start guide link, a first-use 4-step helper, and cloud sync shown as off.
- Crop Watch followed crops and alert preferences from `kasethub.cropWatch.v1`.
- Agriculture calculator history and favorites from `kasethub.agriCalculators.v1`.
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
- เครื่องคำนวณเกษตร
- ดูสภาพอากาศ
- ติดตามราคาพืช
- ถาม AI

## M92 Home-first Entry

M92 adds a Home Farm Hub card on `/app` so farmers can open My Farm without hunting through Profile. M92.1 compacts that card to one primary `/app/my-farm` button so Home stays a launcher instead of a detailed Farm Records dashboard.

Detailed Farm Records summaries, cost/yield metrics, export/restore controls, and sync consent status stay inside `/app/my-farm` and `/app/farm-records`. M92.1 does not create a new store, does not sync, and does not change Farm Records service behavior.

## M93 Elder-friendly Navigation

M93 makes My Farm easier to reach from the persistent bottom navigation with a dedicated `ฟาร์มของฉัน` slot. Profile remains a secondary access path, but it is no longer the discovery surface for My Farm.

Profile is grouped into account, data/privacy, help, and advanced/internal testing sections. Farm Records backup/restore and local data control remain available from the data/privacy group, while Admin, QA, readiness, and staging tools move into `สำหรับทีมงานหรือทดสอบ`.

M93 does not change My Farm data aggregation, Farm Records local storage, sync consent state, export/restore behavior, or any backend boundary.

## M94 Elder-friendly Settings

M94 polishes `/app/profile` into `โปรไฟล์และการตั้งค่า` for elderly and non-technical farmers. The first three settings groups stay primary, while `สำหรับทีมงานหรือทดสอบ` is collapsed by default.

The Profile data/privacy group now links directly to `/app/farm-records#farm-records-export`, `/app/farm-records#farm-records-restore`, and `/app/farm-records#farm-records-sync`. It shows `การซิงก์ข้อมูล` as `ปิดอยู่` and explains that farm data remains on this device.

M94 adds no new My Farm source of truth, no Farm Records local storage change, no sync queue, no cloud sync, no Supabase read/write, no GPS, and no AI Farm Records processing.

## M95 Farmer Start Guide

M95 adds `/app/help` as a short guide for first-time farmers and elderly users. Home links to it with a compact `เริ่มใช้แอพ` card, Profile `วิธีใช้แอพ` links to it, and My Farm shows a compact helper for starting farm records.

The My Farm helper points to `/app/farm-records` and `/app/help` so users can move from reading the guide into recording plots, activities, income/expense, and harvest data.

M95 also adds `/app/field-test-feedback` as a static/local checklist for observing real users. It does not submit feedback, does not write Supabase data, and warns not to enter personal data.

## M96 First-use Farm Records Flow

M96 refines the My Farm helper into `เริ่มใช้ฟาร์มของฉัน` and makes the first path explicit:

1. เพิ่มแปลง
2. บันทึกงานในฟาร์ม
3. บันทึกรายรับรายจ่าย
4. บันทึกผลผลิต

`/app/farm-records` now uses the same path, starts quick actions with `เพิ่มแปลง`, improves empty states for plots, farm work, income/expense, and harvest, and simplifies create-form labels with required markers plus `ถ้ามี` for optional fields.

M96 does not add a new My Farm source of truth, does not change `kasethub.farmRecords.v1`, does not add backend feedback, and does not enable cloud sync, GPS, Supabase writes, receipt upload, OCR, notifications, or AI Farm Records processing.

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

M49 adds calculator-related future records that can also feed My Farm after auth and consent:

- `calculator_history`
- `fertilizer_profiles`
- `planting_profiles`
- `farm_cost_records`

M83 adds local-first source records, M84 adds the farmer-facing local UI, M85 surfaces Farm Records status inside My Farm, M86 adds a My Farm entry point to Farm Records data control, M87 links My Farm to guarded local backup/restore plus a disabled sync consent gate, M88 adds restore recovery guidance plus sync architecture review, M89 links My Farm to the non-writing sync consent prototype, M90 links My Farm to the local Farm Cost Dashboard, M91 adds harvest/yield and cost-per-kg summary visibility, M92/M92.1 make My Farm visible from Home with a compact Thai launcher, M93 adds a dedicated bottom-nav entry plus grouped Profile navigation, M94 clarifies Profile settings/data-control placeholders, M95 adds start-guide/field-test readiness, and M96 simplifies the first-use Farm Records path while still staying local-only. These records should later feed real My Farm cloud sync only after auth, consent, deletion/export tooling, restore/recovery review, audit/idempotency planning, and owner-scoped RLS:

- `farm_plots`
- `crop_cycles`
- `farm_activity_records`
- `farm_finance_entries`
- `farm_harvest_records`
- computed ledger summaries generated from owned records
- latest activity/finance/harvest dates and recent local farm timeline events
- local JSON backup and finance CSV readiness metadata
- local JSON restore readiness metadata
- pre-restore local snapshot/readiness metadata
- disabled cloud sync consent gate status
- local sync consent prototype status, which is not legal consent and does not enable sync
- local cost summary fields such as cost per rai, cost per kg, total harvest kg, net profit, top expense category, and break-even estimate readiness

## Safety Rules

- Do not upload raw images from My Farm.
- Do not treat mock weather as real forecast.
- Do not treat crop prices as production prices.
- Do not treat farm area estimates as official land survey results.
- Do not treat calculator output as an agronomist recommendation, product label, yield guarantee, or financial advice.
- Do not treat Farm Records cost dashboard or break-even estimates as official accounting, tax, loan, or legal advice.
- Do not treat harvest/yield or cost-per-kg estimates as official yield guarantees, accounting, tax, loan, or legal advice.
- Do not delete local data from the hub without an explicit, reviewed recovery/confirmation flow.
- Do not sync until real auth ownership and RLS are verified.
- Do not treat local notification preferences as real push/LINE/SMS consent.
- Do not process Farm Records or Farm Finance Ledger data with AI until a separate AI consent boundary exists.
