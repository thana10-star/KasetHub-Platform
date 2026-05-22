# KasetHub Platform

KasetHub Platform is a premium agriculture knowledge, community, and AI assistant prototype for Thailand. M01 established the scalable React foundation, M02 added mobile retention plus organic sharing foundations, M02.5 expanded social sharing, M03 turned YouTube into an API-ready agriculture channel hub, M04 added guest memory, M05 defined Supabase/auth-ready data models, M06 added a disabled-by-default Supabase environment/client scaffold, M07 prototyped farmer-friendly auth UX, M08 added local AI credits, M09 defined the AI backend proxy contract, M10 added plant image upload UX, M11 added a backend-shaped AI mock proxy fixture layer, M12 designed the Supabase Storage plus image-analysis schema foundation, M13 added a test-only AI proxy adapter, M14 added a local backend boundary prototype, M15 improved farmer accessibility plus visual QA polish, M16 added a Guest Memory sync proof of concept, M17 added a phone OTP auth boundary, M18 drafted Supabase SQL/RLS, M19 added LINE Login/account linking boundaries, and M20 adds the content management and publishing foundation without a real CMS, YouTube API, backend writes, or network calls.

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

## Routes

- `/` - public landing and app preview
- `/app` - main mobile app home
- `/app/youtube` - YouTube agriculture video hub
- `/app/youtube/:videoId` - YouTube video detail foundation
- `/app/ai` - AI agriculture assistant mock screen
- `/app/ai-proxy-status` - AI proxy adapter and backend readiness status
- `/app/ai-credits` - AI credit and rewarded unlock dashboard
- `/app/qa` - farmer accessibility and visual QA checklist
- `/app/analyze` - plant image upload and disease analysis mock workflow
- `/app/analysis-history` - local plant image analysis history
- `/app/image-privacy` - image privacy and future upload consent explanation
- `/app/community` - farmer community feed
- `/app/prices` - crop price tracking
- `/app/articles` - blog/news list
- `/app/articles/:articleId` - article detail and offline body cache preview
- `/app/content-admin-preview` - local content admin preview
- `/app/notifications` - notifications
- `/app/profile` - user profile
- `/app/account-preview` - future account backup and sync preview
- `/app/guest-sync-status` - Guest Memory sync adapter and backend readiness status
- `/app/auth` - farmer-friendly account creation prototype
- `/app/auth/status` - Phone Auth boundary and mock session status
- `/app/auth/linking` - Phone + LINE account linking rules preview
- `/app/auth/phone` - phone OTP mock flow
- `/app/auth/line` - LINE Login local mock boundary
- `/app/auth/google` - Google Login mock explanation
- `/app/auth/sync-preview` - Guest Memory sync consent and dry-run payload preview
- `/app/memory` - guest memory dashboard
- `/app/my-farm` - My Farm plant analysis history
- `/app/saved-articles` - saved/offline article foundation
- `/app/saved-videos` - saved YouTube videos foundation

## Run Locally

```bash
npm install
npm run dev
```

The app runs without `.env.local`. Guest Memory remains active when Supabase ENV or feature flags are missing.

Optional local ENV placeholders for future testing:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-placeholder
VITE_ENABLE_SUPABASE=false
VITE_ENABLE_AUTH=false
VITE_ENABLE_CLOUD_SYNC=false
VITE_AI_PROXY_MODE=local_fixture
VITE_ENABLE_AI_BACKEND_PROXY=false
VITE_ENABLE_LOCAL_AI_PROXY_HANDLER=false
VITE_GUEST_SYNC_MODE=local_fixture
VITE_ENABLE_GUEST_SYNC_BACKEND=false
VITE_ENABLE_LOCAL_GUEST_SYNC_HANDLER=false
VITE_PHONE_AUTH_MODE=local_mock
VITE_ENABLE_PHONE_AUTH=false
VITE_ENABLE_PHONE_AUTH_LOCAL_MOCK=true
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

All videos, posts, crop prices, articles, article bodies, content admin previews, YouTube import plans, offline cache previews, notifications, AI credit state, AI routing plans, AI proxy adapter status, AI mock proxy responses, local backend boundary responses, Guest Sync dry-run responses, phone auth mock sessions, LINE auth mock sessions, account-linking recommendations, local image previews, storage plans, image-analysis job previews, farm history, saved article state, saved video state, guest memory state, sync planning output, share state, auth screens, QA checks, SQL drafts, RLS drafts, and disease analysis outputs are demo/sample data. The app does not connect to YouTube Data API, AI providers, real auth, Supabase network operations or storage, real SMS OTP, LINE Login, LINE Messaging API, Google Login, Facebook SDK, analytics backend, real ads, payment, PWA service worker, Cache API, production CMS, or marketplace services in M20.
