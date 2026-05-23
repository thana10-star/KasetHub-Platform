# KasetHub Platform

KasetHub Platform is a premium agriculture knowledge, community, and AI assistant prototype for Thailand. M01 established the scalable React foundation, M02 added mobile retention plus organic sharing foundations, M02.5 expanded social sharing, M03 turned YouTube into an API-ready agriculture channel hub, M04 added guest memory, M05 defined Supabase/auth-ready data models, M06 added a disabled-by-default Supabase environment/client scaffold, M07 prototyped farmer-friendly auth UX, M08 added local AI credits, M09 defined the AI backend proxy contract, M10 added plant image upload UX, M11 added a backend-shaped AI mock proxy fixture layer, M12 designed the Supabase Storage plus image-analysis schema foundation, M13 added a test-only AI proxy adapter, M14 added a local backend boundary prototype, M15 improved farmer accessibility plus visual QA polish, M16 added a Guest Memory sync proof of concept, M17 added a phone OTP auth boundary, M18 drafted Supabase SQL/RLS, M19 added LINE Login/account linking boundaries, M20 added the content management and publishing foundation, M21 added crop price data source foundations, M22 added local crop watch plus price alert UX, M22.5 added the real owner YouTube channel link config, M23 added local/mock community moderation UX, M24 added a local/mock Admin Dashboard foundation, M25 added a Supabase staging setup checklist plus readiness audit, M26 added a Supabase staging connection dry-run boundary, M27 added the manual SQL staging execution guide plus verification pack, M28 added a Supabase Auth phone OTP staging plan, M29 added a Guest Sync Edge Function staging contract, M30 added an Internal MVP QA plus prototype snapshot, M31 added local-only image compression plus preflight quality checks, M32 added local/mock agriculture weather forecast UX, M33 added a local/mock farm area measurement planner, and M34 upgrades My Farm into a local-first farmer workspace without deploying endpoints, enabling cloud sync/auth, writing data, adding keys, uploading images, calling AI/weather/map APIs, requesting geolocation, using GPS, or making network calls by default.

M35-M44 continue the safe staging path with local notifications, real backend phase planning, the `staging/supabase` branch workflow, local env safety checks, manual Supabase project/SQL prep, the M41 real staging setup walkthrough, the successful M42 manual execution review, the M43 read-only public table probe, and the M44 public read/RLS review checkpoint. The project still must not commit real keys, expose service-role keys, enable auth/cloud sync, run SQL automatically, write Supabase data, or change production behavior.

## Tech Stack

- React + TypeScript + Vite
- TailwindCSS
- React Router
- lucide-react icons
- `@supabase/supabase-js` client scaffold behind feature flags
- Typed mock data only
- Frontend-safe sharing and localStorage saved article foundation

## M02 Features

- LINE share foundation through Web Share API, LINE share intent, then clipboard fallback
- Share actions on plant analysis, article cards, and video cards
- My Farm route with mock plant disease analysis history
- Saved/offline article foundation with localStorage
- Profile access to My Farm and saved articles without crowding bottom navigation

## M02.5 Social Sharing Expansion

- Social share service for native Web Share API, LINE, Facebook, and copy link
- Referral parameters added to shared links: `ref=line`, `ref=facebook`, `ref=native`, and `ref=copy`
- Mobile-first share sheet with Thai labels and large touch targets
- Share actions on analysis results, article cards, video cards, community posts, and My Farm records
- No Facebook SDK, LINE Login, analytics backend, or real API keys

## M03 YouTube Channel Integration Foundation

- API-ready YouTube channel, playlist, video, category, source status, and saved video models
- Premium `/app/youtube` channel hub with hero, stats, search mock, categories, playlists, latest videos, shorts, save, and share
- Video detail route at `/app/youtube/:videoId`
- Saved videos route at `/app/saved-videos`
- Inert YouTube API adapter boundary for future backend integration

## M04 Guest Memory & Save Framework

- Versioned local guest memory state in localStorage
- Generic saved item model for articles, videos, community posts, analysis results, crop prices, AI answers, tools, and future features
- Local likes, followed topics, recent AI questions, and My Farm records
- Compatibility wrappers for existing saved articles and saved videos
- Memory route at `/app/memory`
- Guest-first copy: users can use the app immediately without signup

## M05 Supabase/Auth-Ready Planning

- Backend-ready TypeScript models for profiles, saved items, likes, follows, farm records, AI questions, share events, notifications, articles, videos, and crop price watches
- Pure guest-to-cloud sync planner with no network calls
- Supabase schema draft
- Guest-to-account sync plan
- Farmer-friendly auth strategy
- Account preview route at `/app/account-preview`

## M06 Supabase Client + Environment Foundation

- Safe runtime env parsing in `src/config/env.ts`
- Feature flags default to off: `VITE_ENABLE_SUPABASE`, `VITE_ENABLE_AUTH`, and `VITE_ENABLE_CLOUD_SYNC`
- Supabase client helper returns `null` unless ENV and feature flags are ready
- No auth calls, data writes, phone OTP, LINE Login, Google Login, or cloud sync
- `/app/account-preview` shows Guest mode, local memory counts, Supabase readiness, and feature flag status
- Setup guide in `docs/SUPABASE_ENV_SETUP.md`

## M07 Farmer-Friendly Auth UX + Guest Sync Contract

- Mock auth routes for `/app/auth`, `/app/auth/phone`, `/app/auth/line`, `/app/auth/google`, and `/app/auth/sync-preview`
- Phone-first Thai UX for older/non-tech users, with LINE and Google as secondary future options
- No email requirement
- Phone OTP, LINE, and Google screens are mock-only with no SDK, redirect, SMS, auth call, or network request
- Dry-run Guest Memory sync payload builder in `src/services/backend/guest-sync-payload-builder.ts`
- Backend endpoint contract in `docs/GUEST_SYNC_ENDPOINT_CONTRACT.md`

## M08 AI Credit + Ad Unlock UX Foundation

- Versioned local AI credit state in `src/services/ai-credits`
- Daily free questions, rewarded credits, Pro placeholder credits, usage history, and unlock history
- `/app/ai` consumes local credits for mock questions and saves recent questions into Guest Memory
- Mock rewarded ad unlock grants 1 local credit with demo-only copy
- `/app/ai-credits` shows balance, usage history, unlock history, future Pro placeholder, and safety notes
- Strategy doc in `docs/AI_CREDIT_AD_UNLOCK_STRATEGY.md`

## M09 AI Backend Proxy + Credit Enforcement Contract

- AI provider placeholders for Gemini Flash-Lite, Gemini Flash, OpenAI mini, and future vision model
- Request routing policy for normal text, risky/complex questions, image analysis, video summary, article summary, and price explanation
- Credit cost policy: 1-3 credits depending on request type
- Dry-run AI request planner in `src/services/ai/ai-request-planner.ts`
- `/app/ai` shows automatic model selection preview and estimated credit cost
- `/app/ai-credits` shows the credit cost table
- `/app/analyze` shows future 3-credit image analysis cost and safety copy
- Contract docs in `docs/AI_BACKEND_PROXY_CONTRACT.md` and `docs/AI_AGRICULTURE_SAFETY_POLICY.md`

## M10 Plant Image Upload + Analysis UX Foundation

- Local image upload/preview service in `src/services/image-analysis`
- Upload validation for image type and size
- Premium `/app/analyze` workflow with upload, preview, mock analyzing state, result, save, share, retry, and remove actions
- Guest Memory-backed `/app/analysis-history`
- My Farm and Profile access to analysis history
- Future pipeline planning in `docs/PLANT_IMAGE_ANALYSIS_PIPELINE.md`

## M11 AI Mock Proxy Fixture Layer

- Backend-shaped mock AI proxy service in `src/services/ai-proxy`
- Mock operations for text questions, plant image analysis, article summaries, and video summaries
- Responses include request ID, status, credit validation, model plan, answer/result, warnings, safety disclaimers, logs preview, and retry state
- `/app/ai` now tests text AI through the mock proxy and consumes local credits only after successful validation
- `/app/analyze` now tests plant image analysis through the mock proxy with 3-credit dry-run validation and fixture failure states
- Developer/demo scenario selectors support success, insufficient credits, safety blocked, retryable failure, low confidence, no plant detected, blurry image, and safety warning
- Contract docs in `docs/AI_MOCK_PROXY_FIXTURE_LAYER.md`

## M12 Supabase Storage + Image Analysis Schema Draft

- Storage-ready plant media types in `src/services/storage`
- Image analysis job lifecycle types and planner in `src/services/image-analysis`
- No-network storage planner for proposed bucket, object path, thumbnail path, signed URL policy, moderation, deletion, and warnings
- `/app/analyze` shows a compact future backend flow panel with local preview, private upload, moderation, Vision AI, My Farm save, and deletion notes
- `/app/image-privacy` explains image privacy and future consent in simple Thai
- Schema doc in `docs/SUPABASE_STORAGE_IMAGE_ANALYSIS_SCHEMA.md`

## M13 AI Proxy Test Endpoint Contract + Fixture Adapter

- Adapter interface in `src/services/ai-proxy/ai-proxy-adapter.ts`
- Contract types in `src/services/ai-proxy/ai-proxy-contract.types.ts`
- Modes: `local_fixture`, `backend_test_disabled`, `backend_test_ready`, and `production_disabled`
- Default mode is `local_fixture`
- Feature flags: `VITE_AI_PROXY_MODE` and `VITE_ENABLE_AI_BACKEND_PROXY`
- `/app/ai` and `/app/analyze` now call the adapter instead of the fixture service directly
- `/app/ai-proxy-status` shows proxy mode, backend flag, provider-key safety, supported request types, and last fixture status
- Strategy doc in `docs/AI_PROXY_ADAPTER_STRATEGY.md`

## M14 Local Backend Boundary Prototype

- Server-shaped mock handler in `src/server/ai-proxy`
- Backend test client in `src/services/ai-proxy/ai-proxy-backend-test-client.ts`
- New flag: `VITE_ENABLE_LOCAL_AI_PROXY_HANDLER=false`
- `backend_test_ready` can call the local handler only when all M14 flags are enabled
- The local handler validates credit snapshots without mutating local credits
- `/app/ai-proxy-status` includes backend boundary readiness and a developer test panel
- Prototype doc in `docs/LOCAL_BACKEND_BOUNDARY_PROTOTYPE.md`

## M15 Farmer Accessibility + Visual QA Polish

- Adds shared readability/touch components: `NoticeBox`, `StatusPill`, and `LargeActionButton`
- Increases default button, badge, header, bottom navigation, share sheet, and profile-menu touch comfort
- Adds plain Thai notices across the main routes for Guest mode, demo data, local-only storage, image privacy, AI safety, and mock credits
- Adds `/app/qa` as a UX readiness checklist for reviewed routes, known risks, and next polish tasks
- Documents farmer accessibility and visual QA guidance in `docs/FARMER_ACCESSIBILITY_VISUAL_QA.md`
- Keeps every backend/API/auth/upload feature disabled or mock-only

## M16 Guest Memory Sync Proof of Concept

- Adds a backend-shaped guest sync mock handler in `src/server/guest-sync`
- Adds a guest sync adapter in `src/services/backend/guest-sync-adapter.ts`
- New safe-by-default flags: `VITE_GUEST_SYNC_MODE`, `VITE_ENABLE_GUEST_SYNC_BACKEND`, and `VITE_ENABLE_LOCAL_GUEST_SYNC_HANDLER`
- `/app/auth/sync-preview` can run a dry-run “ทดสอบซิงก์จำลอง” and show merge/skipped/conflict results
- `/app/account-preview` shows Guest Sync readiness and links to the sync preview
- `/app/guest-sync-status` shows sync mode, backend flags, no-service-role-in-frontend status, supported providers/records, and a test panel
- Local Guest Memory remains the source of truth and is never deleted after failed dry runs
- Proof-of-concept doc in `docs/GUEST_SYNC_PROOF_OF_CONCEPT.md`

## M17 Phone OTP Auth Boundary Foundation

- Adds phone auth types and adapter in `src/services/auth`
- Adds local mock OTP service with demo code `123456`
- New safe-by-default flags: `VITE_PHONE_AUTH_MODE`, `VITE_ENABLE_PHONE_AUTH`, and `VITE_ENABLE_PHONE_AUTH_LOCAL_MOCK`
- `/app/auth/phone` now supports phone input, OTP mock step, session preview, resend mock, clear session, and sync-preview link
- `/app/auth/status` shows current auth mode, phone flags, mock session, expiry, and no-network/service-role notices
- Account status detects `phone_mock_authenticated` while keeping Guest Memory active
- `/app/auth/sync-preview` now gates dry-run sync behind a phone mock session to prove future ownership requirements
- Boundary doc in `docs/PHONE_AUTH_BOUNDARY.md`

## M20 Content Management + Publishing Foundation

- Adds content domain fixtures, taxonomy, article body sections, related content, and publishing statuses in `src/services/content`
- Derives the legacy article cards from the content fixtures to avoid duplicate article fixtures
- Adds `/app/articles/:articleId` for full article reading, related videos/articles, save/share, and offline body cache metadata
- Adds `/app/content-admin-preview` for local article inventory, publishing status preview, YouTube import candidates, and cache readiness
- Adds a no-network YouTube import planner in `src/services/content/youtube-import-planner.ts`
- Enriches saved/offline article metadata with local body cache preview fields while preserving Guest Memory behavior
- Docs: `docs/CONTENT_MANAGEMENT_FOUNDATION.md`, `docs/YOUTUBE_IMPORT_CONTENT_STRATEGY.md`, and `docs/OFFLINE_ARTICLE_CACHE_STRATEGY.md`

## M21 Crop Price Data Source Foundation

- Adds typed crop price sources, snapshots, markets, regions, units, grades, reliability levels, and source statuses in `src/services/crop-prices`
- Upgrades `/app/prices` with search, filters, source/reliability badges, save/share/follow actions, and demo/reference disclaimers
- Adds `/app/prices/:priceId` for detail, mock trends, related content, AI CTA, and strong `ราคาอ้างอิง` safety copy
- Plans OAE, DIT, ตลาดไท, local market manual reports, and future community reports without calling any real source
- Docs: `docs/CROP_PRICE_DATA_SOURCE_FOUNDATION.md` and `docs/CROP_PRICE_SOURCE_INTEGRATION_PLAN.md`

## M22 Crop Watch + Price Alert UX Foundation

- Adds versioned local crop watch state in `src/services/crop-prices/crop-watch-service.ts`
- Adds `useCropWatch()` for local followed crops, preferred market/region, enabled status, and alert preferences
- Supports `price_up`, `price_down`, `target_price`, and `weekly_summary` preferences
- Adds `/app/crop-watch` for followed crops, latest mock price, alert preferences, enable/disable, and remove actions
- Updates `/app/prices`, `/app/prices/:priceId`, `/app/profile`, and `/app/notifications` with local-only crop watch and mock alert UX
- Docs: `docs/CROP_WATCH_PRICE_ALERT_UX.md`

## M22.5 Real Owner YouTube Channel Link

- Adds `src/config/channel.ts` with `youtubeChannelUrl = "https://www.youtube.com/@ruengkaset"`
- Uses the configured owner channel URL in the `/app/youtube` channel hero CTA
- Uses the configured owner handle/URL in the YouTube import planner and content admin preview
- Keeps all mock videos unchanged and does not call YouTube API, fetch channel data, add API keys, scrape, or make network requests

## M23 Community Moderation Foundation

- Adds local community moderation types, fixtures, service, and `useCommunityModeration()`
- Stores report and hidden-post demo state in `kasethub.communityModeration.v1`
- Updates `/app/community` with report, hide, undo, community rules summary, and agricultural safety notices
- Adds `/app/community-rules` and `/app/moderation-center`
- Keeps Guest Memory active for likes, saves, and existing local behavior
- Docs: `docs/COMMUNITY_MODERATION_FOUNDATION.md` and `docs/COMMUNITY_RULES_AND_SAFETY_POLICY.md`
- No real backend, Supabase write, real admin action, moderation API, AI moderation provider, scraping, or network call is enabled

## M24 Admin Dashboard Foundation

- Adds admin domain models, module fixtures, role labels, risk items, mock tasks, audit log previews, and dashboard summary builder
- Adds `/app/admin` with Overview, Content, Moderation, Crop Prices, AI Safety, and System tabs
- Connects existing local/mock data from content fixtures, YouTube import planner, community moderation, crop price sources, crop watch, AI proxy/credits, Guest Sync, Auth, and Supabase readiness
- Links Admin Dashboard from Profile and QA
- Docs: `docs/ADMIN_DASHBOARD_FOUNDATION.md` and `docs/ADMIN_ROLES_AND_PERMISSIONS_PLAN.md`
- No real admin auth, backend write, Supabase write, real moderation action, AI provider, YouTube API, or network call is enabled

## M25 Supabase Staging Setup Readiness Audit

- Adds browser-safe readiness audit types and service in `src/services/supabase`
- Adds `/app/supabase-readiness` with readiness score, checklist sections, blockers, warnings, ready items, next safe steps, and production blockers
- Links readiness checks from Admin Dashboard, Account Preview, QA, and Profile
- Adds `.env.example` placeholders only, with no real keys
- Adds `docs/SUPABASE_STAGING_SETUP_GUIDE.md` and `docs/SUPABASE_READINESS_AUDIT.md`
- Keeps Supabase disconnected: no migrations, auth, phone OTP, cloud sync, backend writes, service-role keys, or network calls

## M26 Supabase Staging Connection Dry Run

- Adds `src/services/supabase/supabase-connection-*` for client-safe staging config checks
- Adds `VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=false`
- Adds `/app/supabase-connection` with current flags, env detection, anon-key checks, no-write guarantees, warnings, and manual staging checklist
- Updates `/app/supabase-readiness`, `/app/admin`, `/app/account-preview`, and `/app/qa` with connection dry-run access
- Adds `docs/SUPABASE_STAGING_CONNECTION_DRY_RUN.md`
- Keeps network off by default; the optional public-read probe is guarded by Supabase flag, network-check flag, valid URL, and valid anon key

## M27 Supabase SQL Staging Execution Guide

- Adds `docs/SUPABASE_SQL_STAGING_EXECUTION_GUIDE.md`
- Adds `docs/SUPABASE_MANUAL_VERIFICATION_PACK.md`
- Adds static/browser-safe SQL draft validator types and service in `src/services/supabase`
- Adds `/app/supabase-sql-checklist` with SQL execution order, expected tables, RLS policies, indexes, triggers, manual checklist, warnings, and production blockers
- Links SQL checklist from readiness, connection, admin, and QA
- Does not connect to Supabase, run SQL, read files in the browser, write data, add keys, or make network calls

## M28 Supabase Auth Phone OTP Staging Plan

- Adds `src/services/auth/phone-auth-staging-*` for local phone OTP staging readiness checks
- Adds `/app/auth/phone-staging` with setup steps, current flags, redirect URL readiness, SMS cost/rate-limit warnings, session ownership rules, rollback checklist, and production blockers
- Updates `/app/auth/phone`, `/app/auth/status`, and `/app/auth/sync-preview` to keep local mock mode clear and link to the staging checklist
- Updates Supabase readiness, connection dry run, admin, account preview, profile, and QA links
- Adds `docs/SUPABASE_AUTH_PHONE_OTP_STAGING_PLAN.md`, `docs/SUPABASE_AUTH_REDIRECT_URL_CHECKLIST.md`, and `docs/SMS_PROVIDER_COST_AND_RATE_LIMIT_NOTES.md`
- Keeps real auth disabled: no real OTP, no SMS, no Supabase writes, no cloud sync, no real keys, no service-role key, and no network by default

## M29 Guest Sync Edge Function Staging Plan

- Adds `src/services/backend/guest-sync-edge.types.ts` and `src/services/backend/guest-sync-staging-readiness.ts`
- Adds `/app/guest-sync-edge` with the future `guest-memory-sync` Edge Function contract, auth/session requirement, service-role boundary, idempotency preview, merge rules, staging checklist, and production blockers
- Updates `/app/auth/sync-preview`, `/app/guest-sync-status`, `/app/supabase-readiness`, `/app/supabase-connection`, `/app/admin`, `/app/account-preview`, `/app/profile`, and `/app/qa` with Edge Function plan links/status
- Adds `docs/GUEST_SYNC_EDGE_FUNCTION_CONTRACT.md` and `docs/GUEST_SYNC_STAGING_TEST_PLAN.md`
- Adds safe placeholders for `VITE_ENABLE_GUEST_SYNC_EDGE=false` and `VITE_GUEST_SYNC_EDGE_MODE=disabled`
- Keeps Guest Sync local-only: no Edge Function deployment, no endpoint call, no service-role key, no Supabase write, no cloud sync, no real auth, and no network by default

## M30 Internal MVP QA + Prototype Snapshot

- Adds `src/services/qa/route-registry.ts`, `mvp-readiness.types.ts`, and `mvp-readiness-audit.ts`
- Adds `/app/mvp-snapshot` with module readiness, route coverage, storage mode, production blockers, and next-phase options
- Updates Admin, QA, and Profile with links/status for the Internal MVP snapshot
- Adds `docs/M30_INTERNAL_MVP_SNAPSHOT.md`, `docs/M30_INTERNAL_QA_CHECKLIST.md`, `docs/M30_NEXT_PHASE_DECISION.md`, and `docs/M30_ROUTE_CHECKLIST.md`
- Keeps the app clearly marked as Internal MVP / Prototype: no backend, Supabase connection, auth, cloud sync, real AI API, upload, or network calls added

## M31 Image Compression + Preflight Quality Foundation

- Adds local image compression and preflight services for plant analysis preparation
- Adds `/app/image-preflight` with photo tips, optimization explanation, future backend flow, and privacy notes
- Updates `/app/analyze` with readiness score, warning cards, original vs optimized size, compression preview, and retake guidance
- Links image preflight from Analyze, Profile, and QA
- Keeps images local-only: no real upload, no AI API, no Supabase Storage, no backend, no network calls, and no raw image/base64 persistence in Guest Memory

## M32 Weather Forecast Agriculture UX Foundation

- Adds local weather domain models, fixtures, adapter, and `useWeather()`
- Adds `/app/weather` with location selector, today card, hourly rain chance mock, 7-day forecast mock, farm work recommendations, risk badges, demo notices, and AI CTA
- Updates `/app/notifications` with mock weather alerts for heavy rain, heat, and high humidity/disease risk
- Links weather from Home quick actions, Profile, QA, and Admin
- Keeps weather local/mock only: no real weather API, no geolocation permission request, no backend/Supabase writes, no push notifications, no production weather claims, and no network calls

## M33 Farm Area Measurement Planner Foundation

- Adds local farm area models, fixtures, calculator utilities, and `useFarmArea()`
- Adds `/app/farm-area` with large mobile-friendly inputs, shape selector, rectangle/square/triangle calculations, Thai land unit conversion, saved local plot estimates, and a future GPS/map planning panel
- Adds `/app/farm-area-guide` with manual measuring guidance, tape measure tips, area formulas, Thai land unit rules, accuracy cautions, and future GPS/map notes
- Links farm area from Home quick actions, My Farm, Profile, QA, and Admin
- Keeps farm area local/mock only: no real GPS, map API, geolocation permission request, backend/Supabase writes, production survey claim, or network calls

## M34 My Farm Hub Upgrade Foundation

- Adds `src/services/my-farm` hub types and aggregation service plus `useMyFarmHub()`
- Upgrades `/app/my-farm` into a central Thai-first dashboard for plant analysis history, farm area plots, watched crops, mock weather context, saved articles/videos, recent AI questions, local timeline, and next actions
- Adds `/app/my-farm/settings` for local data status, backup account CTA, image privacy, Guest Memory, and future cloud sync guidance
- Links My Farm from Analyze, Farm Area, Weather, Crop Watch, Profile, and QA
- Keeps My Farm local-only: no real backend, Supabase writes, auth requirement, AI/weather API, GPS/map, sync, destructive clear action, or network calls

## Routes

- `/` - public landing and app preview
- `/app` - main mobile app home
- `/app/admin` - local/mock admin dashboard preview
- `/app/mvp-snapshot` - internal MVP route coverage and readiness snapshot
- `/app/next-phase` - M36 real backend phase decision and staging branch plan
- `/app/supabase-readiness` - local Supabase staging readiness checklist
- `/app/supabase-connection` - local Supabase staging connection dry-run boundary
- `/app/supabase-readonly-probe` - M43 read-only public table probe for staging
- `/app/supabase-setup-guide` - M41 real Supabase staging setup walkthrough and local progress
- `/app/supabase-sql-checklist` - manual Supabase SQL/RLS staging execution checklist
- `/app/env-safety` - local staging env safety check
- `/app/youtube` - YouTube agriculture video hub
- `/app/youtube/:videoId` - YouTube video detail foundation
- `/app/ai` - AI agriculture assistant mock screen
- `/app/ai-proxy-status` - AI proxy adapter and backend readiness status
- `/app/ai-credits` - AI credit and rewarded unlock dashboard
- `/app/qa` - farmer accessibility, visual QA, and M30 route coverage checklist
- `/app/weather` - agriculture weather forecast mock and crop-work recommendations
- `/app/farm-area` - local farm area calculator and saved plot estimates
- `/app/farm-area-guide` - manual farm area measurement guide
- `/app/analyze` - plant image upload and disease analysis mock workflow
- `/app/analysis-history` - local plant image analysis history
- `/app/image-privacy` - image privacy and future upload consent explanation
- `/app/image-preflight` - local image compression and preflight quality guide
- `/app/community` - farmer community feed
- `/app/community-rules` - local community rules and safety policy
- `/app/moderation-center` - local/mock community moderation center
- `/app/prices` - crop price tracking
- `/app/prices/:priceId` - crop price detail and watch preferences
- `/app/crop-watch` - local crop watch and demo alert preferences
- `/app/articles` - blog/news list
- `/app/articles/:articleId` - article detail and offline body cache preview
- `/app/content-admin-preview` - local content admin preview
- `/app/notifications` - notifications
- `/app/profile` - user profile
- `/app/account-preview` - future account backup and sync preview
- `/app/guest-sync-edge` - Guest Sync Edge Function staging contract and checklist
- `/app/guest-sync-status` - Guest Memory sync adapter and backend readiness status
- `/app/auth` - farmer-friendly account creation prototype
- `/app/auth/status` - Phone Auth boundary and mock session status
- `/app/auth/linking` - Phone + LINE account linking rules preview
- `/app/auth/phone` - phone OTP mock flow
- `/app/auth/phone-staging` - Supabase Auth phone OTP staging setup checklist
- `/app/auth/line` - LINE Login local mock boundary
- `/app/auth/google` - Google Login mock explanation
- `/app/auth/sync-preview` - Guest Memory sync consent and dry-run payload preview
- `/app/memory` - guest memory dashboard
- `/app/my-farm` - My Farm local farmer workspace hub
- `/app/my-farm/settings` - My Farm local data status and future sync guidance
- `/app/saved-articles` - saved/offline article foundation
- `/app/saved-videos` - saved YouTube videos foundation

## Run Locally

```bash
npm install
npm run dev
```

The app runs without `.env.local`. Guest Memory remains active when Supabase ENV or feature flags are missing.

Use `.env.example` for placeholder names. Optional local ENV placeholders for future testing:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-placeholder
VITE_ENABLE_SUPABASE=false
VITE_ENABLE_AUTH=false
VITE_ENABLE_CLOUD_SYNC=false
VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=false
VITE_AI_PROXY_MODE=local_fixture
VITE_ENABLE_AI_BACKEND_PROXY=false
VITE_ENABLE_LOCAL_AI_PROXY_HANDLER=false
VITE_GUEST_SYNC_MODE=local_fixture
VITE_ENABLE_GUEST_SYNC_BACKEND=false
VITE_ENABLE_GUEST_SYNC_EDGE=false
VITE_GUEST_SYNC_EDGE_MODE=disabled
VITE_ENABLE_LOCAL_GUEST_SYNC_HANDLER=false
VITE_PHONE_AUTH_MODE=local_mock
VITE_ENABLE_PHONE_AUTH=false
VITE_ENABLE_PHONE_AUTH_LOCAL_MOCK=true
VITE_SUPABASE_AUTH_REDIRECT_URL=
VITE_AUTH_STAGING_LABEL=local
VITE_LINE_AUTH_MODE=local_mock
VITE_ENABLE_LINE_AUTH=false
VITE_ENABLE_LINE_AUTH_LOCAL_MOCK=true
```

## Verify

```bash
npm run lint
npm run build
```

## Notes

## Supabase SQL Drafts

M18 adds database planning files only:

- `supabase/migrations/0001_kasethub_core_schema.sql`
- `supabase/policies/0001_kasethub_rls_policies.sql`
- `docs/SUPABASE_TYPE_MAPPING.md`
- `docs/SUPABASE_MIGRATION_CHECKLIST.md`

These are readable drafts for staging review. They are not run by the app and do not connect to Supabase.

## LINE Login Boundary

M19 adds a local-only LINE Login mock and account-linking planner. It does not load the LINE SDK, redirect to LINE, request OAuth tokens, write Supabase data, or call a network endpoint.

## Content Management Boundary

M20 adds content planning screens and services only. It does not add a production CMS, YouTube import job, transcript fetch, backend write, Supabase content mutation, service worker, Cache API storage, or network request.

## Crop Price and Alert Boundary

M21-M22 price and watch features are local-only. They do not call OAE, DIT, ตลาดไท, market websites, push notification services, Supabase, or backend jobs. All prices and alerts are demo/reference samples and must use `ราคาอ้างอิง` language.

## Farm Area Measurement Boundary

M33 farm area features are local/mock only. Saved plot estimates stay in `kasethub.farmArea.v1`. The app does not request GPS, geolocation, map tiles, map APIs, backend writes, Supabase writes, or network calls. Every area result must keep the disclaimer: “เป็นการคำนวณประมาณการ ไม่ใช่การรังวัดที่ดินอย่างเป็นทางการ”.

## My Farm Hub Boundary

M34 My Farm aggregates existing local data only. It reads Guest Memory, `kasethub.farmArea.v1`, `kasethub.cropWatch.v1`, and weather fixtures, then displays a dashboard and timeline. It does not create real accounts, sync to cloud, call AI/weather/map APIs, upload images, write Supabase data, or add destructive data clearing.

## Notification Center Boundary

M35 notifications are local/mock only. Read state and preferences stay in `kasethub.notificationCenter.v1`. The app does not request push permission, register real push, send LINE Messaging API messages, send email/SMS, run schedulers, call backend endpoints, or write Supabase notification data.

## M36 Real Backend Phase Decision Boundary

M36 adds `/app/next-phase` and static phase-planning services for deciding the safest next implementation path after the local/mock prototype. The recommended order is Supabase staging + SQL/RLS, phone auth staging, Guest Sync staging, AI text proxy, plant vision proxy, then PWA/mobile shell. AI text proxy may move earlier if demo value is the priority, but only on a staging branch with backend-owned secrets, cost caps, rate limits, safety logs, and fixture fallback.

M36 is planning only. It does not connect Supabase, enable auth, run migrations, call AI APIs, add API keys, add network calls, write backend data, or add production behavior. `main` remains the stable prototype; real integration experiments should use `staging/supabase`, `staging/ai-proxy`, and `staging/mobile`.

## M38 Supabase Staging Branch Setup

M38 creates the safe branch workflow for Supabase staging experiments on `staging/supabase`. `main` remains the stable prototype. The branch setup adds `docs/STAGING_SUPABASE_BRANCH_GUIDE.md`, `docs/STAGING_SUPABASE_SAFETY_CHECKLIST.md`, and static branch-status copy on `/app/next-phase`, `/app/supabase-readiness`, and `/app/admin`.

M38 does not connect Supabase, add real keys, create `.env.local`, run SQL migrations, enable auth, enable cloud sync, write backend data, or change production behavior. The next recommended milestone is M39 Supabase Staging Env Local Setup.

## M39 Supabase Staging Env Local Setup

M39 adds `docs/M39_SUPABASE_STAGING_ENV_LOCAL_SETUP.md`, a local env safety checker, and `/app/env-safety`. The route checks staging env presence, placeholder values, anon-key format-ish shape, service-role-like key risk, and dangerous feature flags without displaying full secret values and without making network calls.

Safe M39 staging readiness uses only local `.env.local` values:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_ENABLE_SUPABASE=true
VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=false
VITE_ENABLE_AUTH=false
VITE_ENABLE_CLOUD_SYNC=false
```

`.env.local`, `.env.production`, and `.env.staging` remain ignored. Do not commit real keys. Do not use service-role keys in frontend env. The app must still run with no `.env.local`.

## M40 Supabase Project Creation And SQL Run Prep

M40 adds manual setup docs for creating the real staging project and preparing SQL/RLS execution:

- `docs/M40_SUPABASE_PROJECT_CREATION_GUIDE.md`
- `docs/M40_SQL_RUN_PREP_CHECKLIST.md`
- `docs/M40_POST_SQL_VERIFICATION_GUIDE.md`

The recommended staging project name is `kasethub-staging`. Create it manually in Supabase, choose a region close to Thailand/Singapore if available, and save only the Project URL plus anon key locally. Never copy the service-role key into frontend env.

The app surfaces M40 guidance on `/app/supabase-sql-checklist`, `/app/supabase-readiness`, `/app/supabase-connection`, `/app/env-safety`, and `/app/admin`. M40 still does not connect Supabase, run SQL, add real keys, commit `.env.local`, enable auth, enable cloud sync, or write backend data.

## M41 Real Supabase Staging Setup Walkthrough

M41 adds the first full walkthrough for manually creating the real staging project and running existing SQL/RLS drafts safely:

- `docs/M41_REAL_SUPABASE_STAGING_SETUP_WALKTHROUGH.md`
- `docs/M41_SQL_EXECUTION_SCREENSHOT_CHECKLIST.md`
- `/app/supabase-setup-guide`
- `src/services/supabase/supabase-setup-progress.ts`

The local setup progress tracks project creation, env setup, schema SQL, RLS SQL, table verification, and staging safety verification in `localStorage` only. M41 still does not commit `.env.local`, expose service-role keys, run SQL automatically, enable auth, enable cloud sync, enable uploads, enable AI proxy, or write backend data.

## M43 Supabase Read-only Probe

M43 adds `/app/supabase-readonly-probe` and `src/services/supabase/supabase-readonly-probe.ts` for a guarded public table check against `kasethub-staging`.

The probe runs only when local staging env has `VITE_ENABLE_SUPABASE=true` and `VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=true`. It checks only `articles`, `videos`, and `crop_price_snapshots` with read-only count probes. Empty tables are treated as OK. Auth and cloud sync must remain false, no service-role key is allowed, and no insert/update/delete/upsert/upload/AI/API/backend write is added.

## M44 Supabase Public Read And RLS Review

M44 adds a pending review checkpoint for the real M43 probe results and RLS/no-public-write evidence. It asks the operator to run `/app/supabase-readonly-probe` locally against `kasethub-staging`, record the results for `articles`, `videos`, and `crop_price_snapshots`, and confirm that user-owned/private tables remain protected.

M44 is review-only until evidence is supplied. It does not commit `.env.local`, add real keys, use service-role credentials, enable auth, enable cloud sync, write Supabase data, run SQL automatically, upload files, call Edge Functions, call AI APIs, or change production behavior.

## Community Moderation Boundary

M23 moderation features are local/mock only. Reports and hidden posts stay on the current device. There is no real admin queue, no Supabase write, no moderation API, no AI moderation provider, and no network request. User-facing copy must keep “รายงานนี้ยังเป็นข้อมูลในเครื่องเท่านั้น”, “ยังไม่มีผู้ดูแลระบบจริงในเวอร์ชันนี้”, and “คำแนะนำเรื่องสารเคมี/โรคพืชควรตรวจสอบกับผู้เชี่ยวชาญ” visible near risky actions.

## Admin Dashboard Boundary

M24 admin features are local/mock only. “หน้านี้เป็นตัวอย่างระบบผู้ดูแล ยังไม่มีสิทธิ์จริง”, “ยังไม่เชื่อมต่อ backend”, and “การกดปุ่มในหน้านี้ไม่เปลี่ยนข้อมูลจริงบน server” must remain visible on admin surfaces. Admin pages must not perform real publish, approve, hide, delete, import, price review, AI review, or support actions until backend-owned RBAC and audit logs exist.

## Supabase Staging Readiness Boundary

M25 readiness features are audit/checklist only. `/app/supabase-readiness` must keep “ยังไม่ได้เชื่อมต่อ Supabase จริง”, “ห้ามใส่ service-role key ใน frontend”, and “ต้องทดสอบบน staging ก่อน production” visible. M26 adds `/app/supabase-connection` for anon-key/client-safe dry-run checks. M27 adds `/app/supabase-sql-checklist` for manual SQL/RLS execution planning. M28 adds `/app/auth/phone-staging` for Supabase Auth phone OTP staging setup planning. M29 adds `/app/guest-sync-edge` for the future `guest-memory-sync` Edge Function contract. M41 adds `/app/supabase-setup-guide` for local-only manual setup progress. M43 adds `/app/supabase-readonly-probe` for explicit-flag public table reads only. M44 adds pending public read/RLS review status surfaces before auth or sync. Network probing remains disabled by default through `VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=false`. The app must not connect to Supabase by default, run migrations automatically, deploy/call Edge Functions, add real ENV keys to the repo, enable auth, send phone OTP, enable cloud sync, write backend data, or upload files.

All videos, posts, crop prices, crop watches, price alerts, weather forecasts, weather alerts, farm area calculations, saved farm plot estimates, My Farm hub summaries, My Farm timeline items, notification center items, notification preferences, community moderation reports, hidden post records, moderator queue previews, admin dashboard summaries, admin tasks, admin risk previews, audit log previews, Supabase readiness scores, Supabase connection dry-run status, Supabase setup progress, Supabase SQL checklist output, phone OTP staging checklist output, Guest Sync Edge readiness output, staging checklist items, phase decision plans, articles, article bodies, content admin previews, YouTube import plans, offline cache previews, notifications, AI credit state, AI routing plans, AI proxy adapter status, AI mock proxy responses, local backend boundary responses, Guest Sync dry-run responses, phone auth mock sessions, LINE auth mock sessions, account-linking recommendations, local image previews, image compression previews, image preflight readiness scores, storage plans, image-analysis job previews, farm history, saved article state, saved video state, guest memory state, sync planning output, share state, auth screens, QA checks, SQL drafts, RLS drafts, and disease analysis outputs are demo/sample or planning data. The app does not connect to YouTube Data API, AI providers, real auth, Supabase writes or storage, Supabase Edge Functions, real SMS OTP, LINE Login, LINE Messaging API, Google Login, Facebook SDK, analytics backend, real ads, payment, PWA service worker, Cache API, production CMS, real price APIs, real weather APIs, real GPS, map APIs, geolocation, official land survey services, push notifications, LINE Messaging API delivery, moderation APIs, AI moderation providers, real admin auth, upload services, or marketplace services in M41.
