# KasetHub Platform Blueprint

## Product Vision

KasetHub Platform is planned as a full agriculture ecosystem for Thailand: a knowledge hub, farmer community, AI assistant, plant disease analysis tool, price tracker, content platform, retention layer, organic sharing flow, YouTube channel hub, guest memory layer, auth-ready backend model, AI credit system, backend-owned AI proxy, plant image analysis pipeline, farmer accessibility layer, guest sync boundary, phone-first auth boundary, LINE account linking, and future marketplace. M01 establishes the frontend architecture and visual prototype without real backend or paid systems. M02 adds frontend foundations for LINE sharing, My Farm history, and saved/offline articles. M02.5 expands this into a reusable social sharing foundation for LINE, Facebook, native sharing, and copy link. M03 creates an API-ready YouTube channel integration foundation using mock data only. M04 adds a framework-first local memory system for guest users. M05 defines Supabase/auth-ready data models and guest-to-account sync planning without connecting a backend. M06 adds a Supabase client and environment foundation behind feature flags, still without real auth or cloud sync. M07 prototypes farmer-friendly auth UX and defines the backend-owned Guest Memory sync endpoint contract. M08 adds the local AI credit and rewarded-ad unlock UX foundation. M09 defines AI provider routing, credit cost policy, backend proxy contracts, and agriculture safety policy. M10 upgrades plant image upload and analysis UX without real upload or AI vision. M11 adds backend-shaped mock AI proxy fixtures for text AI and plant image analysis without network calls. M12 drafts Supabase Storage, plant media, moderation, deletion, and image-analysis job lifecycle foundations without enabling real uploads. M13 adds an AI proxy adapter so screens can switch from local fixtures to a future backend test endpoint without UI rewrites. M14 adds an in-process local backend boundary prototype for AI proxy requests without deployment, provider keys, or real network calls. M15 improves readability, tap targets, plain Thai copy, and visual QA readiness for older/non-tech farmers. M16 adds a Guest Memory sync proof of concept that previews payload, handler, merge, conflict, and failure behavior without real auth or cloud writes. M17 adds a mock-only phone OTP auth boundary that proves sync ownership requirements before real Supabase Auth. M18 drafts Supabase SQL and RLS policies. M19 adds local-only LINE Login and account-linking rules. M20 adds content management and publishing foundations. M21 adds crop price data source foundations. M22 adds local crop watch and demo price alert UX. M22.5 adds the owner YouTube channel link config. M23 adds local/mock community moderation foundations without real backend, Supabase writes, moderation APIs, AI moderation, or network calls.

## M01 Foundation

- React + TypeScript + Vite web app
- TailwindCSS design system with premium green agriculture identity
- React Router route map for public and app experiences
- Mobile-first app shell with desktop preview wrapper
- Reusable card, badge, button, navigation, and Kaset-specific content components
- Typed mock data in `src/data`
- Domain types in `src/types`

## M02 Retention and Sharing Foundation

- Reusable `ShareButton` and `share-service` for mobile sharing
- Web Share API first, LINE share intent second, clipboard fallback last
- Article card save/offline actions backed by localStorage
- My Farm mock history route for saved plant disease analysis records
- Profile access points for retention features while keeping bottom navigation simple

## M02.5 Social Sharing Expansion

- `social-share-service.ts` centralizes social share metadata, referral URLs, native share, LINE share, Facebook share, and copy link fallback.
- `SocialShareSheet` provides a mobile-first bottom sheet with Thai actions and large touch targets.
- Shared links include referral parameters for future attribution: `ref=line`, `ref=facebook`, `ref=native`, and `ref=copy`.
- Share entry points now cover analysis results, articles, videos, community posts, and My Farm records.

## M03 YouTube Channel Integration Foundation

- `src/types/youtube.ts` defines channel, playlist, video, source status, and saved video models.
- `src/data/youtubeData.ts` holds mock owner-channel data, content pillars, playlists, latest videos, and shorts.
- `/app/youtube` is upgraded into a channel hub with hero, stats, search mock, category chips, playlists, saved video buttons, and social sharing.
- `/app/youtube/:videoId` provides a video detail foundation with related videos and “ถาม AI จากหัวข้อนี้”.
- `/app/saved-videos` stores saved video metadata in localStorage.
- `youtube-api-adapter.ts` is inert and exists only as the future API boundary.

## M04 Guest Memory & Save Framework

- `guest-memory-service.ts` centralizes local saved items, likes, followed topics, recent AI questions, and farm history records.
- Saved articles and saved videos are compatibility wrappers over Guest Memory.
- `/app/memory` gives users a transparent view of what is stored on this device.
- Profile shows guest-memory counts and explains that data is local until future phone/LINE sync exists.
- Screens can add new retention actions without creating one-off localStorage keys.

## M05 Supabase/Auth-Ready Data Model & Sync Planning

- `backend.types.ts` and `sync.types.ts` define backend-ready contracts before adding Supabase.
- `guest-to-cloud-sync-planner.ts` maps `GuestMemoryState` into a mock `GuestToCloudSyncPlan` without network calls.
- `/app/account-preview` shows guest mode, local memory counts, future phone/LINE/Google options, and estimated records to sync.
- Supabase schema, guest-to-account sync plan, and farmer-friendly auth strategy are documented before implementation.

## M06 Supabase Client + Environment Foundation

- `src/config/env.ts` reads public Vite ENV safely and defaults every backend feature off.
- `src/config/feature-flags.ts` separates requested flags from active runtime capability.
- `src/services/supabase` contains a no-network config check, runtime status, and a lazy client helper that returns `null` unless Supabase ENV and flags are ready.
- `src/services/account` reports guest/account readiness without calling auth.
- `/app/account-preview` now shows Guest mode active, local memory count, Supabase readiness, and Auth/Cloud Sync/Supabase flag status.
- `docs/SUPABASE_ENV_SETUP.md` explains safe `.env.local` setup and why service-role keys never belong in frontend code.

## M07 Farmer-Friendly Auth UX + Guest Sync Contract

- `/app/auth` introduces guest-first account creation copy for Thai farmers.
- `/app/auth/phone` shows a phone OTP mock flow with large inputs and no real SMS.
- `/app/auth/line` and `/app/auth/google` explain future provider connection without SDKs or redirects.
- `/app/auth/sync-preview` shows consent choices and a dry-run payload preview built from Guest Memory.
- `guest-sync-endpoint.types.ts` and `guest-sync-payload-builder.ts` define the future request/response and no-network payload builder.
- `docs/GUEST_SYNC_ENDPOINT_CONTRACT.md` defines `POST /api/guest-memory/sync` or Supabase Edge Function `guest-memory-sync`.

## M08 AI Credit + Ad Unlock UX Foundation

- `src/services/ai-credits` stores local guest AI credits with versioning, daily reset, usage history, and unlock history.
- `/app/ai` now consumes a local credit when a mock question is asked, saves the question into Guest Memory, and logs credit usage.
- Rewarded ad UX is demo-only: “ดูโฆษณา 1 ครั้ง = ได้เพิ่ม 1 คำถาม”.
- `/app/ai-credits` shows balance, daily free usage, rewarded credits, future Pro placeholder, usage history, unlock history, and safety notes.
- `docs/AI_CREDIT_AD_UNLOCK_STRATEGY.md` defines free usage, rewarded ads, abuse prevention, backend sync, cost control, and model routing future.

## M09 AI Backend Proxy + Credit Enforcement Contract

- `src/services/ai` defines provider placeholders, request types, routing policy, credit cost policy, and a dry-run request planner.
- `/app/ai` shows “ระบบเลือกโมเดลอัตโนมัติ”, estimated backend endpoint, provider candidate, and credit cost before mock asking.
- `/app/ai-credits` shows “ค่าเครดิตตามประเภทคำถาม”.
- `/app/analyze` shows that future plant image analysis costs 3 credits and includes safety copy.
- `docs/AI_BACKEND_PROXY_CONTRACT.md` defines future backend endpoints, payloads, credit validation, model routing, logging, retry/fallback, and provider-key protection.
- `docs/AI_AGRICULTURE_SAFETY_POLICY.md` defines safety rules for agriculture AI, price explanations, image privacy, and blocked/escalated prompt examples.

## M10 Plant Image Upload + Analysis UX Foundation

- `src/services/image-analysis` defines upload/session/result models and local validation.
- `useImageUpload()` manages local preview, upload states, mock analysis, retry, and cleanup.
- `/app/analyze` becomes a premium step-by-step workflow with mobile upload CTA, desktop drag/drop, image preview, skeleton loading, result card, save/share, follow-up AI, and failure states.
- `/app/analysis-history` shows Guest Memory-backed analysis summaries with styled thumbnail previews.
- Profile and My Farm link to analysis history.
- `docs/PLANT_IMAGE_ANALYSIS_PIPELINE.md` defines future upload, moderation, storage, backend proxy, vision routing, privacy, cost control, and queue/retry strategy.

## M11 AI Mock Proxy Fixture Layer

- `src/services/ai-proxy` defines backend-shaped response types, fixture data, and pure mock service functions.
- Mock operations cover text questions, plant image analysis, article summaries, and video summaries.
- Responses include request ID, status, credit validation, model plan, answer/result payload, safety disclaimers, warnings, logs preview, retryability, and timestamp.
- `/app/ai` now asks through the mock proxy and consumes local AI credits only after a successful mock validation.
- `/app/analyze` now renders plant image analysis from the mock proxy, including low confidence, no plant detected, blurry image, safety warning, insufficient credit, and retryable failure states.
- `docs/AI_MOCK_PROXY_FIXTURE_LAYER.md` explains how the fixture layer maps to the future real backend.

## M12 Supabase Storage + Image Analysis Schema Draft

- `src/services/storage` defines storage-ready plant media, access policy, moderation, deletion, and storage-plan types.
- `plant-media-storage-planner.ts` proposes private bucket, object path, thumbnail path, signed URL, moderation, deletion, and warnings without network calls.
- `image-analysis-job.types.ts` and `image-analysis-job-planner.ts` define the future image-analysis job lifecycle.
- `/app/analyze` shows a compact future backend flow panel that keeps current local preview separate from future private upload.
- `/app/image-privacy` explains current local-only behavior, future private upload, consent, deletion, and AI safety in simple Thai.
- `docs/SUPABASE_STORAGE_IMAGE_ANALYSIS_SCHEMA.md` drafts buckets, tables, RLS, Edge Functions, retention, and cost-control strategy.

## M13 AI Proxy Test Endpoint Contract + Fixture Adapter

- `ai-proxy-adapter.types.ts` defines adapter modes and shared status.
- `ai-proxy-adapter.ts` routes requests to local fixtures by default and returns safe disabled responses for backend modes.
- `ai-proxy-contract.types.ts` keeps request/response contracts aligned with M09 backend docs and M11 response shape.
- `/app/ai` and `/app/analyze` now call the adapter instead of the fixture service directly.
- `/app/ai-proxy-status` shows current mode, backend flag, provider key safety, supported request types, and last local fixture status.
- `docs/AI_PROXY_ADAPTER_STRATEGY.md` explains mode switching, env flags, and future fetch boundaries.

## M14 Local Backend Boundary Prototype

- `src/server/ai-proxy` defines a server-shaped mock AI proxy handler and request types.
- `ai-proxy-backend-test-client.ts` adds the first backend boundary client while keeping network disabled by default.
- `VITE_ENABLE_LOCAL_AI_PROXY_HANDLER=false` gates the in-process handler.
- `backend_test_ready` calls the local handler only when `VITE_ENABLE_AI_BACKEND_PROXY=true` and `VITE_ENABLE_LOCAL_AI_PROXY_HANDLER=true`.
- `/app/ai-proxy-status` shows local handler readiness, current adapter path, no-network status, and a developer test panel.
- `docs/LOCAL_BACKEND_BOUNDARY_PROTOTYPE.md` explains the boundary, credit validation ownership, and provider-key safety.

## M15 Farmer Accessibility + Visual QA Polish

- Shared UI now includes senior-friendly helpers: `NoticeBox`, `StatusPill`, and `LargeActionButton`.
- Default buttons, badges, page headers, bottom navigation, share sheet actions, quick actions, and profile rows have larger touch and reading surfaces.
- Main routes now include simple Thai notices for local-only storage, demo/mock data, image privacy, AI safety, and Guest-first account use.
- `/app/qa` records the UX readiness checklist, reviewed routes, known risks, and next polish tasks.
- `docs/FARMER_ACCESSIBILITY_VISUAL_QA.md` gives the visual QA checklist for future screenshots and user testing.
- No backend, auth, AI provider, Supabase write, or image upload behavior changes in M15.

### Farmer Accessibility Future

KasetHub should treat accessibility as part of product trust, not a late styling pass. Future milestones should add field testing with older farmers, font-size preferences, reduced developer/debug UI for production, clearer empty states, voice/read-aloud exploration, and automated contrast checks once the design system stabilizes.

## M16 Guest Memory Sync Proof of Concept

- `src/server/guest-sync` contains a backend-shaped no-write mock handler.
- `src/services/backend/guest-sync-adapter.ts` adds safe mode switching for local fixture, disabled backend, backend test ready, and production disabled states.
- `VITE_GUEST_SYNC_MODE`, `VITE_ENABLE_GUEST_SYNC_BACKEND`, and `VITE_ENABLE_LOCAL_GUEST_SYNC_HANDLER` default to safe local/disabled behavior.
- `/app/auth/sync-preview` runs dry-run sync tests and shows profile preview, merge summary, skipped records, conflict summary, and data safety copy.
- `/app/account-preview` shows Guest Sync readiness and links to the dry-run preview.
- `/app/guest-sync-status` shows adapter status and a developer test panel.
- Guest Memory remains the source of truth; dry-run failure never deletes or marks local data as synced.
- `docs/GUEST_SYNC_PROOF_OF_CONCEPT.md` documents the strategy.

### Guest Sync Future

A real sync implementation should live in a backend route or Supabase Edge Function. The frontend should send a consent-aware payload only after auth is established. The backend should validate ownership, apply merge rules idempotently, write with service-role credentials server-side only, and return a response compatible with the M16 mock handler. The client should preserve local Guest Memory until backend success is confirmed and should let users retry safely.

## M17 Phone OTP Auth Boundary Foundation

- `src/services/auth` defines phone auth types, adapter, and local mock service.
- The local mock accepts Thai mobile phone numbers and demo OTP `123456`.
- Mock session data is versioned in localStorage with masked phone number, mock user ID, provider, creation time, and expiry.
- `VITE_PHONE_AUTH_MODE=local_mock`, `VITE_ENABLE_PHONE_AUTH=false`, and `VITE_ENABLE_PHONE_AUTH_LOCAL_MOCK=true` keep defaults local and no-network.
- `/app/auth/phone` now walks through phone input, OTP mock, success state, session preview, resend mock, and sync-preview CTA.
- `/app/auth/status` shows mode, flags, session, expiry, and clear-session action.
- Account status can report `phone_mock_authenticated`, but this is still not a real Supabase session.
- `/app/auth/sync-preview` keeps payload preview visible but disables dry-run sync until a phone mock session exists.
- `docs/PHONE_AUTH_BOUNDARY.md` documents strategy, SMS cost, and future Supabase phone OTP boundary.

### Phone Auth Future

Phone OTP should become the primary account creation path for non-tech farmers. Real implementation should be behind explicit feature flags, rate limited, and connected to Supabase Auth or a backend-owned auth service. Guest mode must remain default. Guest Memory sync should require authenticated ownership, user consent, and backend-confirmed success before local sync markers are written.

## M18 Supabase SQL Migration + RLS Policy Pack

- `supabase/migrations/0001_kasethub_core_schema.sql` drafts the core tables for profiles, Guest Memory, content, community, AI, storage, auth links, and sync events.
- `supabase/policies/0001_kasethub_rls_policies.sql` drafts owner-scoped policies, public read policies, and backend-only write boundaries.
- `docs/SUPABASE_TYPE_MAPPING.md` and `docs/SUPABASE_MIGRATION_CHECKLIST.md` document review requirements.
- No migration is run and no Supabase connection is enabled.

## M19 LINE Login Boundary + Account Linking Rules

- `src/services/auth/line-auth-*` adds a local LINE mock session boundary.
- `src/services/auth/account-linking-planner.ts` defines phone, LINE, and conflict states without writing account links.
- `/app/auth/line`, `/app/auth/linking`, `/app/auth/status`, `/app/auth/sync-preview`, `/app/account-preview`, and `/app/profile` show local mock status and recommendations.
- `docs/LINE_LOGIN_BOUNDARY.md` and `docs/ACCOUNT_LINKING_RULES.md` document why LINE is secondary to phone recovery.
- No LINE SDK, redirect, OAuth token, Supabase Auth provider, or network request is enabled.

## M20 Content Management + Publishing Foundation

- `src/services/content/content.types.ts` defines content status, source, taxonomy, authors, article bodies, video content, and offline article cache metadata.
- `src/services/content/content-taxonomy.ts` and `content-fixtures.ts` provide local article/video fixtures, tags, authors, related content, and legacy article-card mapping.
- `/app/articles` now reads from content fixtures and supports search, content category, and difficulty filters.
- `/app/articles/:articleId` renders full article bodies, key takeaways, safety notes, related videos, related articles, save/share, and offline body cache metadata.
- `/app/content-admin-preview` previews local publishing workflow, article inventory, YouTube import candidates, and offline cache readiness.
- `src/services/content/youtube-import-planner.ts` maps local YouTube fixtures into import candidates without calling YouTube.
- `src/services/content/offline-article-cache.ts` summarizes cache readiness while saved article body previews remain Guest Memory metadata.
- Docs: `docs/CONTENT_MANAGEMENT_FOUNDATION.md`, `docs/YOUTUBE_IMPORT_CONTENT_STRATEGY.md`, and `docs/OFFLINE_ARTICLE_CACHE_STRATEGY.md`.
- No CMS, backend write, Supabase mutation, YouTube API, transcript fetch, service worker, Cache API, or network call is enabled.

## M21 Crop Price Data Source Foundation

- `src/services/crop-prices` defines crop price source, snapshot, item, market, region, unit, quality grade, reliability, and source status models.
- `/app/prices` shows local demo/reference price cards with search, filters, badges, save/share/follow, and strong `ราคาอ้างอิง` disclaimers.
- `/app/prices/:priceId` shows detail, latest reference price, source/date, market/region, unit, grade, mock trend, related content, and AI CTA safety copy.
- Future sources include OAE, DIT, ตลาดไท, local market manual reports, and community reports, but no source is connected in M21.
- Docs: `docs/CROP_PRICE_DATA_SOURCE_FOUNDATION.md` and `docs/CROP_PRICE_SOURCE_INTEGRATION_PLAN.md`.

## M22 Crop Watch + Price Alert UX Foundation

- `crop-watch.types.ts`, `crop-watch-service.ts`, and `useCropWatch.ts` add versioned localStorage crop watch state.
- Watches store followed crop, preferred market/region, latest mock reference price, enabled status, and alert preferences.
- Alert preferences support `price_up`, `price_down`, `target_price`, and `weekly_summary`.
- `/app/crop-watch` shows followed crops, alert preferences, latest mock price, enable/disable, remove, and links back to price details.
- `/app/notifications` includes mock crop price alert examples with demo/sample labels.
- No real price API, push notification, backend job, Supabase write, or production price claim is enabled.

## M22.5 Real Owner YouTube Channel Link

- `src/config/channel.ts` stores the real owner YouTube channel URL: `https://www.youtube.com/@ruengkaset`.
- `/app/youtube` uses the configured URL for the channel hero CTA.
- The YouTube import planner exposes the configured owner handle and URL for future ownership checks.
- `/app/content-admin-preview` shows the configured owner channel source.
- This remains link/config only: no YouTube API call, API key, channel fetch, scraping, or mock-video replacement is added.

## M23 Community Moderation Foundation

- `src/services/community-moderation` defines community rules, report reasons, local reports, hidden content records, statuses, actions, notices, and mock queue items.
- `useCommunityModeration()` wraps versioned localStorage state at `kasethub.communityModeration.v1`.
- `/app/community` now supports report, hide, undo, local-only notices, community rules summary, and agricultural safety warnings.
- `/app/community-rules` explains respectful discussion, scam/fake sale boundaries, dangerous chemical advice, personal data, responsible photos, source guidance, and reporting.
- `/app/moderation-center` shows local reports, hidden posts, mock queue statuses, and future admin/moderator notes.
- `/app/profile` and `/app/qa` link to the moderation surfaces.
- No real backend, Supabase write, real account requirement, moderation API, AI moderation provider, or network call is enabled.

## Future Architecture

### Web App

The current Vite app can evolve into the primary web product for farmers, content readers, admins, and community users. Future work should add authentication boundaries, data fetching, server state, search, saved content, settings, and analytics.

### Mobile App

The mobile-first React structure is designed to map cleanly to a future React Native or Expo app. Shared domain types, mock data contracts, route semantics, and screen composition should be preserved where practical.

### LINE Sharing Strategy

M02 uses a frontend-safe sharing strategy: call the native Web Share API when available, fall back to LINE share URL intent, then copy share text to the clipboard if a share window cannot be opened. Future LINE work should add optional LINE Login, friend/referral attribution, and LINE Messaging API notifications through a backend service. No LINE token or secret should ever live in the browser.

### Social Sharing Strategy

M02.5 separates share metadata from UI. Components pass title, description, URL, optional image URL, and optional source into a service that appends referral parameters and chooses the channel. Native sharing uses the browser Web Share API where available. LINE and Facebook use public share intent URLs without SDKs. Copy link uses the Clipboard API when available and returns a safe user-facing fallback message when it is not.

### LINE and Facebook Share Behavior

LINE sharing opens `social-plugins.line.me/lineit/share` with encoded title, description, and a `ref=line` URL. Facebook sharing opens `facebook.com/sharer/sharer.php` with a `ref=facebook` URL. No LINE Login, LINE Messaging API, Facebook SDK, app ID, or user identity is used in M02.5.

### Referral Tracking Future

M02.5 only appends referral query parameters on the client. A future backend should normalize referral events, record source, user/session context when consented, destination type, and conversion outcomes such as signup, saved article, follow, or AI usage. Attribution should be privacy-aware and resilient to repeated clicks or copied URLs.

### Deep Link Future

Shared URLs currently target web routes. Later mobile app and PWA milestones should introduce deep links or universal links that open specific analysis records, articles, videos, community posts, and farm history records. The web route should remain the fallback for users without the app installed.

### Admin Dashboard

A separate admin surface should support content moderation, article publishing, YouTube playlist curation, crop price data review, AI prompt evaluation, reports, and user management. It should use role-based access control from the backend.

### Backend and Supabase

Supabase is a practical next step for authentication, Postgres data storage, row-level security, file storage, and realtime community updates. Initial tables can include users, profiles, posts, comments, videos, articles, crop prices, notifications, AI sessions, image analyses, and moderation reports.

M06 adds only a browser-safe client scaffold. The client is disabled unless `VITE_ENABLE_SUPABASE=true` and public Supabase ENV values are present. Auth and cloud sync remain separately gated by `VITE_ENABLE_AUTH` and `VITE_ENABLE_CLOUD_SYNC`. No service-role key, admin secret, phone OTP call, or data write should ever be placed in the frontend.

### Auth-Ready Sync Planning

M05 keeps Guest Memory as active storage. When phone, LINE, or Google auth is added, the app should ask consent, upload local memory to a backend sync endpoint, merge saved items by `itemType + itemId`, preserve farm timestamps, and sync AI question history only if the user allows.

M07 makes that flow visible without enabling it. The future sync endpoint must be backend-owned, validate auth server-side, apply consent rules, and use service role only inside a secure API route or Edge Function.

### My Farm Data Model Future

My Farm should become a user-owned plant and plot history system. Future tables can include farms, plots, crops, crop seasons, image analysis records, diagnosis status, treatment plans, follow-up reminders, attached images, and expert review notes. M02 keeps this as typed mock records so the UX and data contracts can mature before backend work.

### YouTube API

The YouTube hub should later connect to curated channels or playlists through the YouTube Data API. Store normalized video metadata locally so category filtering, recommendations, and fallback content remain fast.

### YouTube API Boundary

M03 does not call YouTube Data API. The adapter should eventually be replaced by a backend-backed service that fetches channel profile, playlist items, video snippets, durations, thumbnails, statistics, and pagination tokens. API keys, OAuth tokens, quota handling, and import jobs must live server-side. The frontend should consume normalized `YouTubeVideo` and `YouTubePlaylist` objects, not raw API responses.

M22.5 adds only the real owner channel link as static config: `https://www.youtube.com/@ruengkaset`. The link helps route users and future import planning to the correct owner channel, but it does not validate ownership or fetch YouTube data.

### Saved Video Future

M03 saved videos use localStorage only. In a backend milestone, saved videos should belong to authenticated users, support sync across devices, and optionally store watch status, notes, and AI summary history. Saved videos should remain shareable through the M02.5 social sharing service.

### Guest Memory Future

M04 keeps users productive without login. Future auth should invite users to sync after they have already saved useful data. The local memory schema maps to cloud tables for saved items, liked items, followed topics, recent AI questions, and farm history. Sync should be explicit, privacy-aware, and deduplicate by stable item keys such as `itemType + itemId`.

### AI Video Summarization Future

The video detail route includes “ถาม AI จากหัวข้อนี้” to prepare for future video-aware AI prompts. A later backend can ingest transcript snippets, channel metadata, and user questions to generate summaries, checklists, and crop-specific follow-up suggestions.

### AI Chat

The AI assistant should use a backend proxy rather than calling AI providers from the browser. Future design should include prompt templates, safety instructions, Thai agriculture context, usage quotas, conversation history, and escalation copy for high-risk advice.

M08 adds the frontend credit system that a backend proxy can later enforce. Normal questions can cost 1 credit, complex questions can cost more, and image analysis should cost more than text because it uses vision and storage resources.

M09 defines that backend proxy contract. Provider keys must remain server-side, credit cost must be recalculated on the backend, and client estimates should never be trusted for billing or quota enforcement.

M11 adds `src/services/ai-proxy` as the frontend contract rehearsal layer. It returns backend-shaped responses without calling `fetch`, Supabase, OpenAI, Gemini, or any provider. Future backend work should preserve the response semantics while moving validation, logging, credit deduction, and provider calls server-side.

M13 adds `ai-proxy-adapter.ts` between screens and proxy implementations. This keeps local fixtures active by default while preparing a future backend client behind `VITE_AI_PROXY_MODE` and `VITE_ENABLE_AI_BACKEND_PROXY`.

M14 adds a local backend boundary client and handler behind `VITE_ENABLE_LOCAL_AI_PROXY_HANDLER`. It proves server-shaped credit validation and response compatibility but still does not call `fetch` or real providers.

### AI Vision and Image Analysis

The plant disease flow should upload images to secure storage, send analysis requests through the backend, and return structured results with confidence, symptoms, possible causes, treatment suggestions, and clear disclaimers. Results should be stored for user history and model quality review.

M10 keeps the image itself local with object URLs and stores only lightweight result metadata in Guest Memory. Future Supabase Storage should use private buckets, signed URLs, moderation, deletion controls, and backend-owned vision model routing.

M12 turns that into typed planning artifacts and schema docs. Raw images still stay out of Guest Memory/localStorage, but the future backend model now includes `plant_media`, `plant_analysis_jobs`, and `plant_analysis_results` with private buckets and deletion lifecycle.

### Offline Article and PWA Future

M02 saves article metadata to localStorage only. A later milestone should add a proper PWA strategy with service worker caching, article body snapshots, cache invalidation, offline status indicators, storage limits, and sync once the user signs in. Full offline mode should wait until article content and authentication data contracts are stable.

### Ad Reward System

M08 includes local rewarded-ad UX only. A real ad reward system should integrate through approved ad networks, verify completed views server-side, issue AI credits idempotently, and include fraud prevention plus clear user consent. Client-only ad events must never be trusted for production credits.

### Community Moderation

Community features should include reporting, keyword filters, moderator queues, user reputation, expert verification, rate limits, and audit logs. Agricultural advice should be clearly separated from verified expert guidance.

M23 rehearses this locally with report/hide actions, a rules route, and a mock moderation center. Future production moderation should add authenticated reports, duplicate grouping, admin review, action history, appeals/corrections, expert escalation for chemical and disease advice, and strict RLS. Client-side hidden state must not be treated as production moderation.

### Marketplace Future

Marketplace should remain out of M01. A later version can add listings, seller profiles, product reviews, inquiry chat, order intent, and payment integrations after trust, moderation, and compliance foundations are ready.

### Supabase SQL Migration Draft

M18 adds the first SQL draft pack:

- `supabase/migrations/0001_kasethub_core_schema.sql`
- `supabase/policies/0001_kasethub_rls_policies.sql`
- `docs/SUPABASE_TYPE_MAPPING.md`
- `docs/SUPABASE_MIGRATION_CHECKLIST.md`

The draft covers profiles, Guest Memory sync, saved items, My Farm, AI credits, community, articles, videos, crop prices, plant media, image-analysis jobs/results, auth link events, and guest sync events. It is not connected, not run, and not production-ready until staging RLS tests pass.

### Crop Price and Alert Future

M21-M22 keep all price and alert behavior local. Future production price alerts should require verified source snapshots, stale-data checks, user consent, backend alert evaluation jobs, quiet-hour controls, delivery logs, and disclaimers in every notification body. The frontend should never own trusted price imports or production alert delivery.

### LINE Login and Account Linking Boundary

M19 adds a local-only LINE Login mock and account-linking planner. LINE is treated as a secondary provider for Thai users, while phone remains the recommended recovery path. Future production work should confirm user ownership, ask before linking providers, keep LINE secrets server-side, and sync Guest Memory only after account ownership is clear.

## Suggested Milestone Path

1. M24: Crop price admin/import job contract and moderation review workflow
2. M25: Real content management for videos and articles, plus offline article body caching plan
3. M26: AI vision upload, My Farm persistence, and analysis history
4. M27: Admin dashboard MVP and mobile app extraction plan
5. M28: Field usability test iteration and production-readiness hardening
