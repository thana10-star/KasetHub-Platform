# KasetHub Platform Blueprint

## Product Vision

KasetHub Platform is planned as a full agriculture ecosystem for Thailand: a knowledge hub, farmer community, AI assistant, plant disease analysis tool, price tracker, content platform, retention layer, organic sharing flow, YouTube channel hub, guest memory layer, auth-ready backend model, AI credit system, backend-owned AI proxy, plant image analysis pipeline, farmer accessibility layer, guest sync boundary, phone-first auth boundary, LINE account linking, admin operations, weather planning, farm area planning, My Farm workspace, agriculture calculators, and future marketplace. M01 establishes the frontend architecture and visual prototype without real backend or paid systems. M02 adds frontend foundations for LINE sharing, My Farm history, and saved/offline articles. M02.5 expands this into a reusable social sharing foundation for LINE, Facebook, native sharing, and copy link. M03 creates an API-ready YouTube channel integration foundation using mock data only. M04 adds a framework-first local memory system for guest users. M05 defines Supabase/auth-ready data models and guest-to-account sync planning without connecting a backend. M06 adds a Supabase client and environment foundation behind feature flags, still without real auth or cloud sync. M07 prototypes farmer-friendly auth UX and defines the backend-owned Guest Memory sync endpoint contract. M08 adds the local AI credit and rewarded-ad unlock UX foundation. M09 defines AI provider routing, credit cost policy, backend proxy contracts, and agriculture safety policy. M10 upgrades plant image upload and analysis UX without real upload or AI vision. M11 adds backend-shaped mock AI proxy fixtures for text AI and plant analysis without network calls. M12 drafts Supabase Storage, plant media, moderation, deletion, and image-analysis job lifecycle foundations without enabling real uploads. M13 adds an AI proxy adapter so screens can switch from local fixtures to a future backend test endpoint without UI rewrites. M14 adds an in-process local backend boundary prototype for AI proxy requests without deployment, provider keys, or real network calls. M15 improves readability, tap targets, plain Thai copy, and visual QA readiness for older/non-tech farmers. M16 adds a Guest Memory sync proof of concept that previews payload, handler, merge, conflict, and failure behavior without real auth or cloud writes. M17 adds a mock-only phone OTP auth boundary that proves sync ownership requirements before real Supabase Auth. M18 drafts Supabase SQL and RLS policies. M19 adds local-only LINE Login and account-linking rules. M20 adds content management and publishing foundations. M21 adds crop price data source foundations. M22 adds local crop watch and demo price alert UX. M22.5 adds the owner YouTube channel link config. M23 adds local/mock community moderation foundations. M24 adds a local/mock Admin Dashboard foundation. M25 adds a Supabase staging setup checklist plus readiness audit. M26 adds a safe Supabase staging connection dry-run boundary. M27 adds the manual SQL staging execution guide and verification checklist. M28 adds a Supabase Auth phone OTP staging plan. M29 adds the Guest Sync Edge Function staging contract. M30 adds the Internal MVP snapshot. M31 adds local image compression/preflight. M32 adds agriculture weather forecast UX with local fixtures only. M33 adds local/mock farm area measurement planning. M34 upgrades My Farm into a local-first farmer workspace. M49 adds local-only agriculture calculators for spray mixing, fertilizer helper math, planting density, yield estimates, and cost estimates. M50 hardens those calculators with validation, expected-vs-actual QA fixtures, safer Thai disclaimers, and local share summaries. M51 adds crop-specific planning profiles, unit-test readiness, and a calculator safety route. M52 adds formal Vitest service tests plus edge-case fixtures. M53 adds calculator copy/share/save summary polish and rewarded-ads strategy planning. M54 adds text export templates, saved-summary QA polish, share fallback hardening, and export preview UX. M55 defines the AI explanation boundary for calculator results. M56 reviews the future backend AI explanation architecture. M57 adds a disabled-by-default calculator AI backend adapter contract with local fixture mode and feature flags. M58 hardens adapter QA and adds a staging endpoint design checklist. M59 drafts the disabled-by-default `calculator-ai-explain` Edge Function contract. M60 adds a staging-only Edge dry-run implementation plan. M61 returns to the production-readiness roadmap with a no-real-OTP Supabase Phone Auth staging test review while still making no real AI call, backend write, Supabase write, cloud sync, production auth enablement, SMS send, sponsor routing, payment, real ad, PDF, or network call by default.

M35-M44 extend the safe path toward real staging by adding local notifications, backend phase planning, a Supabase staging branch workflow, local env safety checks, manual project/SQL preparation, the M41 real Supabase staging setup walkthrough with localStorage-only progress, manual execution review, read-only public probes, and RLS review checkpoints. M49-M60 add, harden, plan, test, polish, QA-harden, define AI explanation boundaries, review backend AI architecture, add a no-network adapter contract, document staging endpoint gates, draft an Edge Function contract, and add a no-fetch dry-run plan for crop-aware local calculator utility without enabling live backend AI. M61 resumes the Supabase/Auth readiness path with staging Phone Auth checklist surfaces, env flag review, redirect/SMS/test-number planning, ownership warnings, and rollback proof. These milestones still keep service-role keys out of the frontend, keep `.env.local` out of git, avoid automatic SQL execution, and stop before production auth/cloud sync/uploads/AI proxy/real ads.

## M53 Calculator Export/Share And Rewarded Ads Planning

- Adds structured `CalculatorResultSummary` models for copy/share/save flows.
- Adds `/app/calculators/saved-results` for local-only saved summaries.
- Upgrades calculator result cards with copy summary, share summary, save local summary, and LINE share actions.
- Adds planning-only rewarded ads cards to Admin, calculator safety, and calculator QA.
- Keeps basic calculations free, safety copy visible, and sponsor/affiliate content outside deterministic results.

## M54 Calculator Export/Share QA

- Adds text export templates for short LINE-friendly and long detail versions.
- Adds `/app/calculators/export-preview`.
- Hardens native share, clipboard fallback, empty summary, and oversized summary handling.
- Upgrades saved summaries with filter, compact/expanded views, LINE preview, quick copy, and delete confirmation.
- Extends Vitest coverage for export templates and share fallback helpers.

## M55 Calculator AI Explanation Boundary

- Adds `CalculatorAIExplanationRequest`, plan, boundary, risk, allowed action, and blocked action types.
- Adds local policy, fixtures, and planner services for explanation-only previews.
- Adds `/app/calculators/ai-explanation-preview` and links it from calculator hub, QA, saved results, Admin, and safety.
- Allows AI to explain inputs, formulas, result meaning, double-check items, expert escalation, and disclaimers.
- Blocks result mutation, chemical products, exact fertilizer doses not in the calculator, sponsor products, guaranteed yield/profit claims, label overrides, and hidden uncertainty.
- Keeps `noRealAICall: true` and deterministic result snapshots in the plan.

## M56 Real Backend AI Explanation Architecture Review

- Adds backend architecture types for execution requests, immutable snapshots, policy versions, safety decisions, rate-limit plans, abuse scenarios, audit log plans, and escalation rules.
- Adds `calculator-ai-backend-review.ts` with snapshot locking, request validation, policy version selection, safety decision planning, audit requirements, and backend-stage fixtures.
- Adds `/app/calculators/ai-architecture`.
- Defines the future flow: Calculator -> Snapshot Lock -> Backend Policy Check -> Prompt Builder -> AI Explanation -> Safety Filter -> Final Display.
- Adds tests for snapshot immutability, blocked mutation, banned sponsor insertion, invalid requests, policy version selection, oversized payload rejection, and invalid crop profile handling.
- Keeps no real AI call, no backend write, no Supabase write, no sponsor integration, and no network call.

## M57 Calculator AI Backend Adapter Contract

- Adds `CalculatorAIAdapterRequest`, response, status, error, and mode status types.
- Adds `calculator-ai-adapter.ts` and `calculator-ai-local-fixtures.ts`.
- Adds feature flags: `VITE_CALCULATOR_AI_MODE`, `VITE_ENABLE_CALCULATOR_AI_BACKEND`, and `VITE_ENABLE_CALCULATOR_AI_NETWORK`.
- Defaults to `local_fixture` with no network and deterministic Thai fixture explanations from locked snapshots.
- Adds `/app/calculators/ai-adapter-status`.
- Tests prove backend-disabled and production-disabled modes do not call a backend client, and `backend_test_ready` refuses client execution unless both backend and network flags are explicitly true.
- Keeps deterministic results immutable and blocks sponsor, chemical/product, fertilizer-dose invention, and result-mutation requests before any AI path.

## M58 Calculator AI Adapter QA And Endpoint Planning

- Adds `calculator-ai-adapter-qa-fixtures.ts` with deterministic adapter states for local fixture, backend disabled, network disabled, backend-test blocked, invalid request, oversized request, sponsor insertion, lock-hash mismatch, policy mismatch, and invalid crop profile.
- Adds `calculator-ai-endpoint-plan.ts` and endpoint plan types for backend-only prompt execution, request validation, lock-hash verification, policy validation, audit logs, rate limits, abuse prevention, timeout handling, sponsor separation, no formula mutation, and no hidden recommendation injection.
- Adds `/app/calculators/ai-endpoint-plan`.
- Upgrades `/app/calculators/ai-adapter-status` and `/app/calculators/qa` with adapter state matrix, fixture-vs-disabled comparison, current flags, backend blocked reasons, no-network guarantee, safe fallback behavior, and locked hash preservation.
- Tests prove disabled modes stay disabled, invalid and oversized requests are rejected, policy/hash mismatches block, sponsor insertion blocks, adapter status remains deterministic, and no network path is active by default.
- Keeps M58 planning-only: no real endpoint, no real AI call, no backend/Supabase write, no sponsor/affiliate integration, and no network call by default.

## M59 Calculator AI Edge Function Contract Draft

- Adds `CalculatorAIEdgeRequest`, response, auth context, policy check, audit event, rate-limit check, timeout plan, and failure mode types.
- Adds `calculator-ai-edge-contract.ts` for local contract previews around the future `calculator-ai-explain` Edge Function.
- Adds `/app/calculators/ai-edge-contract`.
- Defines server-only provider/service-role key handling, lock-hash verification, policy checks, audit hooks, rate-limit hooks, timeout behavior, sponsor separation, no formula mutation, and no hidden recommendation injection.
- Tests prove no provider/network/Supabase write is attempted, lock-hash and policy mismatches block before provider paths, and deterministic result values remain immutable.
- Keeps M59 planning-only: no deployed Edge Function, no real AI call, no provider key, no backend/Supabase write, and no network call by default.

## M60 Calculator AI Edge Dry-run Plan

- Adds `CalculatorAIEdgeDryRunMode`, readiness, validation case, audit preview, rate-limit preview, secret checklist, and production blocker types.
- Adds `calculator-ai-edge-dry-run-plan.ts` with local readiness behavior for endpoint URL, dry-run flag, network flag, adapter flags, auth readiness, server-only secret rules, and production blockers.
- Adds `/app/calculators/ai-edge-dry-run`.
- Adds `.env.example` placeholders for `VITE_CALCULATOR_AI_EDGE_URL`, `VITE_ENABLE_CALCULATOR_AI_EDGE_DRY_RUN`, and `VITE_ENABLE_CALCULATOR_AI_EDGE_NETWORK`.
- Tests prove default builds cannot call the endpoint, URL alone is not enough, network flag alone is not enough, dry-run plus network flags still do not fetch in M60, frontend config rejects secrets, validation fixtures classify expected failures, and production remains blocked.
- Keeps M60 planning-only: no deployed Edge Function, no fetch, no AI provider call, no provider key, no service-role key in frontend, no Supabase write, and no production behavior.

## M61 Phone Auth Staging Test Plan

- Adds `phone-auth-staging-review.types.ts` and `phone-auth-staging-review.ts` for staging-only Phone Auth review output.
- Adds `/app/auth/phone-staging-test`.
- Reviews Supabase staging prerequisites, SQL/RLS evidence, public read/RLS evidence, phone auth flags, redirect URL readiness, SMS provider setup, test phone number plan, OTP cost/rate-limit warnings, ownership before sync, rollback readiness, and blockers.
- Updates Phone Auth, Auth Status, Sync Preview, Account Preview, Supabase Readiness, Admin, Next Phase, and QA screens with M61 staging status.
- Tests prove the default status is blocked, auth flags stay off by default, cloud sync remains blocked until ownership exists, frontend service-role keys are rejected, and rollback steps exist.
- Keeps M61 planning-only: no production auth enablement, no real OTP/SMS by default, no Supabase write, no cloud sync, no service-role key, no `.env.local` commit, and no Edge Function deployment.

## M62 Controlled Phone Auth Staging Test

- Adds `phone-auth-staging-adapter.types.ts` and `phone-auth-staging-adapter.ts`.
- Adds `auth-ownership-status.types.ts` and `auth-ownership-status.ts`.
- Allows Supabase Phone OTP only in local staging mode with `VITE_PHONE_AUTH_MODE=supabase_staging_ready`, `VITE_ENABLE_SUPABASE=true`, `VITE_ENABLE_AUTH=true`, `VITE_ENABLE_PHONE_AUTH=true`, valid staging anon config, and `VITE_ENABLE_CLOUD_SYNC=false`.
- Blocks staging OTP when cloud sync is enabled, Supabase config is invalid, production mode is requested, or a service-role-like key appears in frontend env.
- Updates Phone Auth, staging test, Auth Status, Sync Preview, and Account Preview with staging status, redirect preview, SMS cost warnings, rollback reminders, and ownership status.
- Keeps Guest Memory sync blocked and does not write profile/app tables.

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

## M24 Admin Dashboard Foundation

- `src/services/admin` defines admin roles, module statuses, dashboard summary, tasks, risks, audit log previews, review queues, and health status.
- `/app/admin` provides one local/mock route with Overview, Content, Moderation, Crop Prices, AI Safety, and System tabs.
- The dashboard summarizes M20 content, YouTube import readiness, M23 moderation reports, M21 crop price sources, M22 crop watches, AI proxy/credit status, Guest Sync/Auth readiness, and Supabase status.
- `/app/profile` and `/app/qa` link to the admin preview.
- `docs/ADMIN_DASHBOARD_FOUNDATION.md` and `docs/ADMIN_ROLES_AND_PERMISSIONS_PLAN.md` define future RBAC, permissions, audit logs, and review workflows.
- No real admin auth, backend write, Supabase write, destructive action, moderation action, AI provider, YouTube API, or network call is enabled.

## M25 Supabase Staging Setup Readiness Audit

- `src/services/supabase/supabase-readiness-*` aggregates environment, feature flag, SQL/RLS draft, auth, guest sync, storage, AI proxy, admin role, crop price, and community moderation readiness.
- `/app/supabase-readiness` shows a local readiness score, checklist sections, blockers, warnings, ready items, next safe steps, and production blockers.
- `/app/admin`, `/app/account-preview`, `/app/profile`, and `/app/qa` link to the readiness route.
- `.env.example` contains placeholders only and no real keys.
- `docs/SUPABASE_STAGING_SETUP_GUIDE.md` and `docs/SUPABASE_READINESS_AUDIT.md` define the first staging connection checklist.
- No Supabase connection, migration, auth, cloud sync, phone OTP, backend write, service-role key, or network call is enabled.

## M26 Supabase Staging Connection Dry Run

- `src/services/supabase/supabase-connection-*` checks staging env presence, anon-key safety, feature flags, no-write guarantees, and optional public-read probe eligibility.
- `VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=false` keeps network checks off by default.
- `/app/supabase-connection` shows current flags, local dry-run result, env/anon key status, warnings, no-write guarantees, and manual staging checklist.
- `/app/supabase-readiness`, `/app/admin`, `/app/account-preview`, and `/app/qa` link to the connection dry run.
- Optional network probe is guarded by Supabase enabled, dry-run network flag enabled, valid URL, and usable anon key.
- No real keys, service-role key, migration, auth, phone OTP, cloud sync, Supabase write, upload, backend write, or default network call is enabled.

## M27 Supabase SQL Staging Execution Guide

- `docs/SUPABASE_SQL_STAGING_EXECUTION_GUIDE.md` defines the manual staging execution sequence.
- `docs/SUPABASE_MANUAL_VERIFICATION_PACK.md` defines table, trigger, RLS, policy, storage, crop price, community, admin/audit, auth, and Edge Function checks.
- `src/services/supabase/supabase-sql-draft-validator-*` exposes a static browser-safe list of expected SQL/RLS artifacts.
- `/app/supabase-sql-checklist` shows execution order, expected tables, policies, indexes, triggers, manual checklist, warnings, and production blockers.
- `/app/supabase-readiness`, `/app/supabase-connection`, `/app/admin`, and `/app/qa` link to the SQL checklist.
- No Supabase connection, migration execution, key, write, filesystem access, or network call is enabled.

## M28 Supabase Auth Phone OTP Staging Plan

- `src/services/auth/phone-auth-staging-*` audits Supabase env readiness, phone flags, redirect URL readiness, SMS provider setup, OTP rate-limit policy, test phone number planning, session ownership, Guest Sync dependency, rollback, and production blockers.
- `/app/auth/phone-staging` shows a Thai staging checklist with current flags, setup steps, SMS cost warnings, session ownership rules, rollback checklist, and production blockers.
- `/app/auth/phone`, `/app/auth/status`, and `/app/auth/sync-preview` keep local mock status visible and link to the staging checklist.
- `/app/supabase-readiness`, `/app/supabase-connection`, `/app/admin`, `/app/account-preview`, `/app/profile`, and `/app/qa` expose the phone OTP staging link/status.
- Docs cover Supabase phone provider setup, redirect URLs, SMS cost/rate limits, test phone numbers, Thai UX copy, logout/session behavior, rollback, and service-role safety.
- No real auth, OTP SMS, Supabase write, cloud sync, LINE/Google real login, real key, service-role key, or default network call is enabled.

## M29 Guest Sync Edge Function Staging Plan

- `src/services/backend/guest-sync-edge.types.ts` defines the future Edge Function request, response, auth context, idempotency key, validation result, merge result, rollback plan, and readiness output.
- `src/services/backend/guest-sync-staging-readiness.ts` audits feature flags, auth/session dependency, service-role boundary, idempotency, merge rules, consent, rollback, schema/RLS dependency, and production blockers without network calls.
- `/app/guest-sync-edge` shows the future `POST /functions/v1/guest-memory-sync` contract, current disabled flags, idempotency preview, merge rules, staging test checklist, and security boundaries.
- `/app/auth/sync-preview`, `/app/guest-sync-status`, `/app/supabase-readiness`, `/app/supabase-connection`, `/app/admin`, `/app/account-preview`, `/app/profile`, and `/app/qa` link to the Edge Function plan.
- `.env.example` adds `VITE_ENABLE_GUEST_SYNC_EDGE=false` and `VITE_GUEST_SYNC_EDGE_MODE=disabled`.
- `docs/GUEST_SYNC_EDGE_FUNCTION_CONTRACT.md` and `docs/GUEST_SYNC_STAGING_TEST_PLAN.md` define the staging-only contract and manual verification pack.
- No Edge Function deployment, endpoint call, service-role key, Supabase write, cloud sync, auth enabling, OTP, or default network call is enabled.

## M30 Internal MVP QA + Prototype Snapshot

- `src/services/qa/route-registry.ts` groups routes by Core app, Content/YouTube, AI/Plant analysis, Prices/Crop watch, Community/Moderation, Auth/Account/Sync, Supabase/Staging, and Admin/QA.
- `src/services/qa/mvp-readiness-*` returns module readiness, risk level, route coverage, storage mode, production blockers, and next-phase options without network calls.
- `/app/mvp-snapshot` shows the Internal MVP / Prototype state and clearly says it is not a Production App.
- `/app/admin`, `/app/qa`, and `/app/profile` link to the M30 snapshot.
- `docs/M30_INTERNAL_MVP_SNAPSHOT.md`, `docs/M30_INTERNAL_QA_CHECKLIST.md`, `docs/M30_NEXT_PHASE_DECISION.md`, and `docs/M30_ROUTE_CHECKLIST.md` define the handoff pack for the next backend/staging phase.
- No backend, Supabase connection, migration, auth, cloud sync, real AI API, upload, major feature, or network call is added.

## M31 Image Compression + Preflight Quality Foundation

- `src/services/image-analysis/image-compression-*` adds local browser-based resize/compression with default max 1280px and JPEG/WebP output planning.
- `src/services/image-analysis/image-preflight-*` checks file type, size, dimensions, too-small/very-large warnings, blur placeholder guidance, and plant-photo checklist without AI.
- `useImageCompression()` manages optimized preview object URLs and revokes them safely.
- `/app/analyze` now shows local preflight readiness, warning cards, compression preview, original vs optimized size, and retake tips before mock analysis.
- `/app/image-preflight` explains why resizing can reduce future AI cost, recommended photo tips, future backend upload flow, and privacy boundaries.
- No real AI API, upload, Supabase Storage, backend write, raw image/base64 persistence, or network call is added.

## M32 Weather Forecast Agriculture UX Foundation

- `src/services/weather/weather-*` adds local weather models, fixtures, source metadata, agriculture risk labels, and mock alerts.
- `useWeather()` exposes fixed sample locations and forecast fixtures without localStorage, geolocation, fetch, Supabase, or backend behavior.
- `/app/weather` shows location selection, today details, hourly rain chance mock, 7-day forecast mock, crop-work recommendations, risk badges, demo notices, and AI CTA.
- `/app/notifications` includes mock weather alerts for heavy rain, heat, and high humidity/disease risk.
- Home quick actions, Profile, QA, and Admin link to the weather route.
- No real weather API, geolocation permission request, backend write, Supabase write, push notification, production weather claim, or network call is added.

## M33 Farm Area Measurement Planner Foundation

- `src/services/farm-area/farm-area-*` adds local farm area models, fixtures, calculator utilities, unit conversion rules, and local saved plot records.
- `useFarmArea()` exposes rectangle, square, triangle, and custom polygon mock calculations plus versioned localStorage under `kasethub.farmArea.v1`.
- `/app/farm-area` shows large inputs, shape selection, Thai land unit conversion, save/remove local plot actions, local-only notices, and the official-survey disclaimer.
- `/app/farm-area-guide` explains manual measuring, tape measure tips, rectangle/triangle formulas, Thai land unit rules, safety/accuracy notes, and future GPS/map boundaries.
- Home quick actions, My Farm, Profile, QA, and Admin link to farm area planning.
- No real GPS, map API, geolocation permission request, backend write, Supabase write, official land survey claim, or network call is added.

## M34 My Farm Hub Upgrade Foundation

- `src/services/my-farm/my-farm-*` adds My Farm hub models and a local aggregation service.
- `useMyFarmHub()` combines Guest Memory, saved plant analysis summaries, farm area saved plots, crop watch preferences, weather fixtures, saved articles/videos, and recent AI questions.
- `/app/my-farm` is now a Thai-first farmer dashboard with hero summary, local-only notice, quick actions, overview cards, next actions, local data sections, and timeline.
- `/app/my-farm/settings` shows local data status, backup account CTA, image privacy link, Guest Memory link, future cloud sync guidance, and no new destructive action.
- Analyze, Farm Area, Weather, Crop Watch, Profile, QA, and route registry now link back to My Farm.
- No real backend, Supabase write, auth requirement, real AI/weather API, GPS/map, cloud sync, destructive clear action, or network call is added.

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

M24 adds this as a local/mock preview at `/app/admin`. Future implementation must add admin auth, route guards, server-side permission checks, role claims, RLS, append-only audit logs, review task tables, and safe rollback/correction paths before any publish, hide, import, review, support, or price action becomes real.

### Backend and Supabase

Supabase is a practical next step for authentication, Postgres data storage, row-level security, file storage, and realtime community updates. Initial tables can include users, profiles, posts, comments, videos, articles, crop prices, notifications, AI sessions, image analyses, and moderation reports.

M06 adds only a browser-safe client scaffold. The client is disabled unless `VITE_ENABLE_SUPABASE=true` and public Supabase ENV values are present. Auth and cloud sync remain separately gated by `VITE_ENABLE_AUTH` and `VITE_ENABLE_CLOUD_SYNC`. No service-role key, admin secret, phone OTP call, or data write should ever be placed in the frontend.

M25 adds `/app/supabase-readiness`, `.env.example`, and staging setup docs so the first staging project can be reviewed safely. M26 adds `/app/supabase-connection` and a dry-run service that can detect configured staging anon settings without writes. M27 adds `/app/supabase-sql-checklist` for manual SQL/RLS execution planning. M28 adds `/app/auth/phone-staging` for Supabase Auth phone OTP staging planning. M29 adds `/app/guest-sync-edge` for the future `guest-memory-sync` Supabase Edge Function contract. M30 adds `/app/mvp-snapshot` so route coverage, readiness, and production blockers are visible before the first real staging implementation. M41 adds `/app/supabase-setup-guide` with a localStorage-only progress checklist for manual project/env/SQL verification. M43 adds `/app/supabase-readonly-probe` for explicit-flag reads against public/read-safe tables only. M44 adds a pending public read/RLS review checkpoint before auth or sync. M61 adds `/app/auth/phone-staging-test` for the first Phone Auth staging test plan with redirect/SMS/test-number/rollback checks and ownership warnings before sync. Network probing is disabled by default and must stay public/read-only when explicitly enabled. These milestones still do not run migrations automatically, deploy/call Edge Functions, enable production auth, send OTP SMS automatically, enable cloud sync, add secrets to the repo, write data, or upload files.

### Auth-Ready Sync Planning

M05 keeps Guest Memory as active storage. When phone, LINE, or Google auth is added, the app should ask consent, upload local memory to a backend sync endpoint, merge saved items by `itemType + itemId`, preserve farm timestamps, and sync AI question history only if the user allows.

M07 makes that flow visible without enabling it. M29 narrows the first real endpoint plan to a future Supabase Edge Function named `guest-memory-sync`. The future sync endpoint must be backend-owned, validate auth server-side, apply consent rules, enforce idempotency, audit sync attempts, and use service-role credentials only inside the Edge Function/backend boundary.

### My Farm Data Model Future

My Farm should become a user-owned plant and plot history system. Future tables can include farms, plots, crops, crop seasons, image analysis records, diagnosis status, treatment plans, follow-up reminders, attached images, and expert review notes. M02 keeps this as typed mock records so the UX and data contracts can mature before backend work.

M34 makes My Farm the central workspace while staying local-only. Future cloud My Farm should use `farm_profiles`, dashboard preferences, timeline events, and generated insight records as views over user-owned source data rather than trusting a frontend-only dashboard summary.

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

### Weather Forecast Future

M32 keeps all weather behavior local/mock. Future production weather should connect through a backend-owned import/cache layer, cite source label and timestamp, respect location privacy, keep geolocation opt-in, and distinguish official/provider forecasts from app-generated crop-work recommendations. Weather alerts should require user consent, freshness checks, quiet hours, delivery logs, and clear disclaimers before any push or LINE notification is enabled.

### Farm Area Measurement Future

M33 keeps area measurement local/mock. Future production farm area tools should support authenticated user-owned plots, private GPS/map boundaries, opt-in geolocation only after a user action, map provider attribution, export/share consent, delete controls, and clear accuracy labels. KasetHub should never present app estimates as official land surveying.

### Agriculture Calculator Future

M49-M60 keep calculator behavior local-only. Future production calculators can sync history into `calculator_history`, save farmer presets into `fertilizer_profiles` and `planting_profiles`, store approved examples in `crop_calculator_profiles`, version future crop rules in `crop_rule_versions`, and record farm economics in `farm_cost_records` only after real auth, owner-scoped RLS, and explicit sync consent exist. AI recommendations must stay separate from deterministic calculator output, keep disclaimers visible, cite reviewed rule versions, and escalate high-risk chemical/fertilizer advice. Future calculator AI tables must lock snapshots, version policies, log safety decisions, validate request/hash/policy checks, and enforce rate limits without exposing secrets or hidden sponsor payloads. Sponsor or affiliate integrations must be clearly labeled and must not influence base formula results, share summaries, QA fixtures, crop profiles, rule versions, calculator history, explanation prompts, adapter status, endpoint readiness, Edge Function contracts, Edge dry-run plans, or backend AI policy versions without consent. Formal tests should guard deterministic math, adapter disabled states, no-network boundaries, Edge contract/dry-run boundaries, and AI explanation boundaries before any recommendation runtime is introduced.

### Notification Center Future

M35 keeps notifications as a local/mock in-app center. Future production delivery should use backend-generated `notification_events`, per-channel preferences, quiet hours, rate limits, digest jobs, and delivery logs. Browser local preferences are not production consent. Price/weather notifications must cite source context and stay clear about `ราคาอ้างอิง` or forecast uncertainty before push, LINE, SMS, or email delivery is enabled.

### LINE Login and Account Linking Boundary

M19 adds a local-only LINE Login mock and account-linking planner. LINE is treated as a secondary provider for Thai users, while phone remains the recommended recovery path. Future production work should confirm user ownership, ask before linking providers, keep LINE secrets server-side, and sync Guest Memory only after account ownership is clear.

## Suggested Milestone Path

1. M35 Notification Center Upgrade Foundation. Completed as local/mock in-app notification center.
2. M36 Real Backend Phase Decision + Staging Branch Plan. Completed as planning only.
3. M38-M41 Supabase staging branch, env safety, project creation, SQL/RLS walkthrough, and verification.
4. Phone Auth staging after schema/RLS checks, starting with M61 staging test review before real OTP.
5. Guest Sync Edge Function staging after real session ownership.
6. AI text proxy staging with backend-owned secrets.
7. Plant vision proxy and mobile/PWA work after storage/auth boundaries are proven.

## M36 Real Backend Phase Decision

M36 adds the planning layer for the first real implementation phase after the M01-M35 local/mock prototype. `/app/next-phase` ranks the options and recommends this order: Supabase staging + SQL/RLS, phone auth staging, Guest Sync staging, AI text proxy, plant vision proxy, then PWA/mobile shell. AI text proxy can move earlier if demo value is the priority, but it must stay on `staging/ai-proxy` with backend-owned secrets, cost caps, rate limits, safety logs, and fixture fallback.

Branch strategy:

- `main` remains the stable prototype.
- `staging/supabase` is for Supabase/Auth/Guest Sync experiments.
- `staging/ai-proxy` is for AI provider experiments.
- `staging/mobile` is for PWA/mobile shell experiments.

M36 does not connect Supabase, enable auth, run SQL, call AI APIs, add keys, add network calls, or write backend data.

## M38 Supabase Staging Branch Creation

M38 moves the real Supabase path into a branch-safe setup step. The working branch is `staging/supabase`; `main` remains the stable M36 prototype snapshot. M38 adds branch guide and safety checklist docs and surfaces static branch mode copy on Next Phase, Supabase Readiness, and Admin Dashboard.

Boundaries remain strict: no real Supabase connection, no real keys, no `.env.local`, no SQL execution, no auth, no cloud sync, no backend writes, and no production behavior changes. M39 should prepare local-only staging env setup next.

## M39 Supabase Staging Env Local Setup

M39 keeps work on `staging/supabase` and prepares the local env workflow for a future staging Supabase project. It adds `/app/env-safety`, `src/services/config/env-safety-check.ts`, and `docs/M39_SUPABASE_STAGING_ENV_LOCAL_SETUP.md`.

The app can now show whether staging URL and anon key are present, whether values look like placeholders, whether a service-role-like key was accidentally placed in frontend env, and whether dangerous flags such as auth/cloud sync/network probe are enabled too early. The check is local-only and masks values; it does not call Supabase.

M39 still does not connect Supabase, add real keys, commit `.env.local`, run SQL, enable auth, enable cloud sync, or write backend data.

## M40 Supabase Staging Project Creation And SQL Run Prep

M40 prepares the human-run Supabase staging step. It adds:

- `docs/M40_SUPABASE_PROJECT_CREATION_GUIDE.md`
- `docs/M40_SQL_RUN_PREP_CHECKLIST.md`
- `docs/M40_POST_SQL_VERIFICATION_GUIDE.md`
- `src/services/supabase/supabase-staging-project-checklist.ts`

The recommended project name is `kasethub-staging`. The manual order is: create staging project, save Project URL and anon key locally only, open SQL Editor, run `supabase/migrations/0001_kasethub_core_schema.sql`, then run `supabase/policies/0001_kasethub_rls_policies.sql`, then verify tables, RLS, policies, indexes, and triggers.

M40 is still guide/prep only. It does not create a Supabase project, connect the app, run migrations, add keys, commit `.env.local`, enable auth/cloud sync, or write backend data.

## M41 Real Supabase Staging Setup Walkthrough

M41 prepares the first controlled real staging setup. It adds:

- `docs/M41_REAL_SUPABASE_STAGING_SETUP_WALKTHROUGH.md`
- `docs/M41_SQL_EXECUTION_SCREENSHOT_CHECKLIST.md`
- `/app/supabase-setup-guide`
- `src/services/supabase/supabase-setup-progress.ts`

The route tracks project created, env added, schema SQL run, RLS SQL run, tables verified, and staging verified using localStorage only. It surfaces the next safe step, blockers, and explicit warnings: ห้ามใช้ service-role key, ใช้ staging เท่านั้น, ยังไม่เปิด auth, ยังไม่เปิด cloud sync, and หยุดก่อนเปิด auth/cloud sync.

M41 may guide the human operator through creating `kasethub-staging` and manually running SQL/RLS, but the app still does not create Supabase resources, run SQL, commit keys, expose service-role credentials, enable auth/cloud sync/uploads/AI proxy, or write backend data.

## M43 Supabase Read-only Probe

M43 adds `/app/supabase-readonly-probe` plus `src/services/supabase/supabase-readonly-probe.ts` and `.types.ts`.

The route creates an anon Supabase client only when local staging env is present and `VITE_ENABLE_SUPABASE=true` plus `VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=true`. It probes only `articles`, `videos`, and `crop_price_snapshots` with read-only count checks. Empty tables are OK. RLS/policy blocked, table missing, network disabled, config missing, and safe error states are shown without exposing keys.

M43 does not commit `.env.local`, add real keys, use service-role credentials, write Supabase data, enable auth, enable cloud sync, upload files, call Edge Functions, call AI APIs, or change production behavior.

## M44 Supabase Public Read And RLS Review

M44 adds `docs/M44_SUPABASE_PUBLIC_READ_VERIFICATION.md`, `docs/M44_RLS_PUBLIC_READ_REVIEW_CHECKLIST.md`, and `src/services/supabase/supabase-public-read-review.ts`.

M44 records the review checkpoint after the real M43 read-only probe. The operator must provide actual results for `articles`, `videos`, and `crop_price_snapshots`, plus RLS/no-public-write evidence from Supabase Dashboard. Until that evidence is supplied, status remains `pending operator probe`.

M44 does not commit `.env.local`, add real keys, use service-role credentials, write Supabase data, enable auth, enable cloud sync, run migrations automatically, upload files, call Edge Functions, call AI APIs, or change production behavior.

## M49 Agriculture Calculator Core Foundation

M49 adds `/app/calculators` plus `/app/calculators/spray-mix`, `/app/calculators/fertilizer`, `/app/calculators/plant-spacing`, `/app/calculators/yield-estimate`, and `/app/calculators/cost`.

The calculator domain lives under `src/services/agri-calculators` with typed inputs/results, fixtures, pure utility functions, and `useAgriCalculators()` for local recent calculations, favorites, and last inputs. It uses Thai unit rules for ไร่, งาน, ตารางวา, and ตารางเมตร. All pages keep Thai-first, senior-friendly forms, large buttons, and explicit warnings that outputs are preliminary calculations, not guarantees or replacements for product labels, agronomists, soil tests, official land surveys, or financial advice.

M49 does not write backend data, write Supabase data, call AI APIs, request geolocation, load maps, sync to cloud, take payments, route sponsor/affiliate offers, or require network calls.

## M50 Agriculture Calculator QA Hardening

M50 adds `/app/calculators/qa` and hardens the calculator foundation before crop-specific fertilizer or AI recommendation work.

The calculator domain now includes `agri-calculator-validation.ts` for empty/zero/negative/non-number/missing-unit/high-value validation and `agri-calculator-test-fixtures.ts` for deterministic expected-vs-actual checks. The QA page shows pass/warn/fail status, expected values, actual values, differences, warnings, and known limitations.

Calculator pages now keep invalid results out of local history, show clearer error states, use larger primary result cards, include `คำนวณใหม่`, and provide local-only copy/share summaries for valid results. Summaries include `สรุปผลคำนวณเบื้องต้น` and `ควรตรวจสอบฉลาก/ผู้เชี่ยวชาญก่อนใช้งานจริง`.

M50 does not add files/PDF export, backend save, Supabase write, AI call, OCR, payment, sponsor/affiliate integration, or network calls.

## M51 Crop-specific Calculator Expansion Planning

M51 adds crop profile planning fixtures for ข้าว, มันสำปะหลัง, อ้อย, ข้าวโพด, ทุเรียน, ลำไย, ยางพารา, and ผักผสม. Each profile includes Thai display name, spacing examples, area examples, yield input examples, common cost categories, `fertilizerPlanningStatus = planning_only`, and safety notes.

Crop-aware selectors now appear on fertilizer, plant spacing, yield estimate, and cost calculators. The action `ใช้ตัวอย่างของพืชนี้` fills starter form values only and keeps the note `ตัวอย่างนี้เป็นค่าเริ่มต้นเพื่อช่วยกรอก ไม่ใช่คำแนะนำทางวิชาการสุดท้าย`. Fertilizer examples fill area context only and do not inject crop-specific NPK targets, fertilizer doses, or product names.

M51 adds `/app/calculators/safety` and a static unit-test readiness plan for spray mix math, Thai land unit conversion, plant spacing, fertilizer NPK helper, yield estimate, cost estimate, and crop profile loading.

M51 does not add a real agronomy engine, pesticide recommendation engine, OCR, AI call, backend write, Supabase write, sponsor/affiliate integration, or network call.

## M52 Formal Calculator Service Tests

M52 adds Vitest for pure calculator service tests and `npm run test`.

The new `src/services/agri-calculators/agri-calculator-service.test.ts` covers spray mix ratio scaling, Thai land conversion, plant spacing, fertilizer helper math, yield estimate, cost estimate, crop profile example loading, invalid crop keys, and validation boundaries for zero, negative, NaN, empty, huge, tiny, invalid unit, divide-by-zero, and overflow-ish inputs.

M52 also adds `src/services/agri-calculators/agri-calculator-edge-fixtures.ts` and updates `/app/calculators/qa` with formal coverage summary, edge-case examples, validation pass/warn/fail, and regression-safe calculation notes.

M52 does not add recommendation logic, AI behavior, OCR, backend writes, Supabase writes, or network calls. The tests explicitly protect deterministic formulas from silent changes before a future recommendation layer exists.

## M55 Calculator AI Explanation Boundary

M55 adds the explanation-only AI boundary for calculator results. The service layer now includes calculator AI explanation types, a policy file, fixture requests, and a planner that returns allowed sections, blocked sections, risk level, prompt scaffold preview, safety disclaimers, result value snapshot, formula integrity flags, and `noRealAICall: true`.

`/app/calculators/ai-explanation-preview` shows the plan using spray-mix and fertilizer fixtures. It is linked from the calculator hub, calculator QA, saved results, Admin Dashboard, QA, and calculator safety. Saved result cards include `ดูแผน AI อธิบายผล`.

M55 does not call AI, write backend data, write Supabase data, add sponsor/affiliate content, add real ads, add payment, or create a recommendation engine. AI can explain formulas in the future, but it must not change deterministic output, recommend chemical products, invent fertilizer doses, mention sponsor products, override labels, guarantee yield/profit, or hide uncertainty.

## M56 Real Backend AI Explanation Architecture Review

M56 adds `/app/calculators/ai-architecture` and local architecture review services for future backend calculator explanations.

The new service layer defines `CalculatorAIExecutionRequest`, `CalculatorAIExecutionSnapshot`, `CalculatorAIPolicyVersion`, `CalculatorAISafetyDecision`, `CalculatorAIRateLimitPlan`, `CalculatorAIAbuseScenario`, `CalculatorAIAuditLogPlan`, and `CalculatorAIEscalationRule`.

The route shows the future pipeline, immutable snapshot lock, blocked actions, policy versions, audit/rate-limit plan, and future backend stages. It is linked from calculator QA, calculator safety, Admin Dashboard, Next Phase, QA, and the calculator hub.

M56 does not call AI, write backend data, write Supabase data, add AdMob/payment, add sponsor/affiliate behavior, sync to cloud, or make network calls.

## M57 Calculator AI Backend Adapter Contract

M57 adds a disabled-by-default adapter contract for future calculator AI explanations.

The new service layer defines `CalculatorAIAdapterRequest`, `CalculatorAIAdapterResponse`, `CalculatorAIAdapterStatus`, `CalculatorAIAdapterError`, and `CalculatorAIAdapterModeStatus`.

Adapter modes are `local_fixture`, `backend_disabled`, `backend_test_ready`, and `production_disabled`. The default flags are:

```env
VITE_CALCULATOR_AI_MODE=local_fixture
VITE_ENABLE_CALCULATOR_AI_BACKEND=false
VITE_ENABLE_CALCULATOR_AI_NETWORK=false
```

`/app/calculators/ai-adapter-status` shows mode, backend flag, network flag, current adapter path, supported request types, local fixture result, locked result hash, and future staging checklist.

M57 tests prove local fixture responses keep `noRealAICall: true`, disabled modes do not call a backend client, and `backend_test_ready` refuses client execution unless backend and network flags are explicitly true.

M57 still does not call AI, fetch a backend endpoint by default, write backend data, write Supabase data, sync to cloud, add payment/AdMob, or add sponsor/affiliate behavior.

## M58 Calculator AI Adapter QA And Endpoint Planning

M58 adds `/app/calculators/ai-endpoint-plan` and deterministic adapter QA fixtures for the future calculator AI backend path.

The new service layer adds `calculator-ai-adapter-qa-fixtures.ts`, `calculator-ai-endpoint-plan.types.ts`, and `calculator-ai-endpoint-plan.ts`. The QA suite covers local fixture success, backend disabled, backend network disabled, backend test ready but blocked, invalid request, oversized request, sponsor insertion blocked, deterministic mismatch blocked, policy version mismatch, and invalid crop profile.

The endpoint plan defines backend-only prompt execution, no frontend provider keys, request validation, lock-hash verification, policy version validation, audit log requirements, rate limits, abuse prevention, timeout handling, sponsor separation, no formula mutation, and no hidden recommendation injection.

M58 updates `/app/calculators/ai-adapter-status`, `/app/calculators/qa`, Admin Dashboard, Next Phase, QA, and the calculator hub with adapter QA and endpoint plan navigation.

M58 still does not call AI, create a backend endpoint, fetch by default, write backend data, write Supabase data, sync to cloud, add payment/AdMob, or add sponsor/affiliate behavior.

## M59 Calculator AI Edge Function Contract Draft

M59 adds `/app/calculators/ai-edge-contract` and a typed design stub for the future Supabase Edge Function named `calculator-ai-explain`.

The new service layer adds `calculator-ai-edge-contract.types.ts` and `calculator-ai-edge-contract.ts`. The contract defines request and response payloads, auth context, policy check, audit event preview, rate-limit check, timeout plan, failure modes, server-only provider key handling, and service-role boundaries.

M59 tests prove the contract excludes provider/service-role keys from frontend payloads, keeps provider/network/Supabase writes disabled, blocks lock-hash mismatch and policy mismatch before provider paths, and preserves deterministic result values.

M59 still does not deploy an Edge Function, call AI, fetch a backend endpoint by default, write backend data, write Supabase data, sync to cloud, add payment/AdMob, or add sponsor/affiliate behavior.

## M60 Calculator AI Edge Dry-run Plan

M60 adds `/app/calculators/ai-edge-dry-run` and local planning services for a future staging-only dry-run of `calculator-ai-explain`.

The new service layer adds `calculator-ai-edge-dry-run.types.ts` and `calculator-ai-edge-dry-run-plan.ts`. The dry-run plan checks endpoint URL presence, dry-run/network flags, adapter flags, auth readiness, secret boundaries, validation cases, audit preview, rate-limit preview, and production blockers.

M60 adds env placeholders only:

```env
VITE_CALCULATOR_AI_EDGE_URL=
VITE_ENABLE_CALCULATOR_AI_EDGE_DRY_RUN=false
VITE_ENABLE_CALCULATOR_AI_EDGE_NETWORK=false
```

M60 tests prove production/default frontend builds cannot call the endpoint and that even dry-run plus network flags do not fetch in this milestone.

M60 still does not deploy an Edge Function, call AI, fetch an endpoint, write backend data, write Supabase data, sync to cloud, add payment/AdMob, or add sponsor/affiliate behavior.

## M61 Phone Auth Staging Test Plan

M61 returns to the main Supabase/Auth readiness roadmap with `/app/auth/phone-staging-test`, a staging-only review route for the first real Supabase Phone Auth test.

The new service layer adds `phone-auth-staging-review.types.ts` and `phone-auth-staging-review.ts`. The review checks whether the staging Supabase project exists, whether SQL/RLS and public-read evidence are ready, whether auth flags are off by default, whether redirect URLs and SMS provider setup are ready, whether test phone numbers are planned, whether OTP cost/rate limits are acknowledged, whether ownership is proven before Guest Memory sync, and whether rollback steps exist.

M61 updates Phone Auth, Auth Status, Sync Preview, Account Preview, Supabase Readiness, Admin Dashboard, Next Phase, QA, and the route registry with staging status and links.

M61 tests prove the default review is blocked until explicitly configured, auth flags stay off by default, cloud sync remains blocked until ownership exists, frontend service-role keys are rejected, and rollback steps exist.

M61 still does not enable production Phone Auth, send real OTP/SMS by default, commit `.env.local`, add real keys, add service-role keys, enable cloud sync, write Supabase data, deploy Edge Functions, or change production behavior.

## M62 Controlled Phone Auth Staging Boundary

M62 adds a gated Phone Auth staging adapter that can request or verify Supabase Phone OTP only when local staging flags, valid anon config, and cloud-sync-off checks are explicitly enabled outside git. Default behavior remains local mock.

M62 can represent a masked real Supabase phone staging session, but Guest Memory upload and app table writes remain blocked.

## M63 Ownership/RLS Sync Gate Review

M63 adds `/app/ownership-rls-gate` and `ownership-rls-gate.ts` to review the relationship between a real Supabase Auth session, expected `auth.uid()` owner id, local Guest Memory data, consent capture, idempotency, audit logging, RLS owner policies, and service-role backend-only rules.

The gate intentionally keeps `syncAllowed=false` in every state. It is a review milestone only: no Guest Memory upload, no cloud sync, no Supabase app table writes, no Edge Function deployment, no production auth enablement, and no automatic SQL execution.

## M64 Guest Memory Sync Dry-run Payload Builder

M64 adds `/app/guest-sync-dry-run`, `guest-sync-dry-run-payload.types.ts`, and `guest-sync-dry-run-payload.ts` to preview the first safe Guest Memory sync payload without upload.

The dry-run payload groups saved items, farm records, recent AI questions, crop watches, calculator saved result summaries, followed topics, and likes. It previews consent, idempotency, audit events, conflicts, owner scope, blockers, and privacy filters while keeping `uploadAllowed=false`, `noSupabaseWrite=true`, and `noCloudSync=true`.

M64 updates Ownership/RLS Gate, Sync Preview, Guest Sync Status, Account Preview, Admin Dashboard, Next Phase, QA, and schema/docs with links and boundaries. It still does not upload Guest Memory, write Supabase app tables, enable cloud sync, deploy Edge Functions, place service-role keys in the frontend, run SQL, or enable production auth.

## M65 Offline Agriculture Article Library

M65 adds `/app/articles/offline` and `/app/articles/offline/:slug` as a hybrid offline-first agriculture article foundation.

The new content services define offline article taxonomy, metadata, starter outlines, planned image asset references, safety notes, and CMS compatibility keys. The starter library covers soil, water, fertilizer, rice, sugarcane, cassava, and farm finance with two topics per category.

M65 updates Articles, Profile, My Farm, Admin Dashboard, QA, route registry, schema docs, and content docs with the offline library entry point and safety boundaries.

M65 still does not write Supabase data, create backend CMS records, generate articles with AI, import YouTube content, inject sponsors/affiliates, use external image URLs, or require network calls.

## M66 Offline Article Content QA And CMS Contract

M66 adds `/app/articles/offline-qa`, article QA services, article version fixtures, and CMS override validation for the offline agriculture library.

The new QA layer proves future CMS content cannot remove required disclaimers, cannot use external image URLs for offline mode, and must preserve offline fallback when an override is invalid. It also documents image QA and version readiness before full articles are written.

M66 still does not write Supabase data, create CMS rows, generate article text with AI, generate real images, load external images, or add sponsor/affiliate content.

## M67 Offline Article Full-content Drafting Readiness

M67 adds `/app/articles/full-content-readiness` and full-article draft template services for five pilot topics: soil types before planting, NPK label basics, rice cost/profit per rai, cassava plant spacing per rai, and farm break-even price.

The publish gate blocks all pilots until source placeholders, reviewer metadata, last reviewed dates, image metadata, freshness dates when needed, required disclaimers, and expert escalation notes are complete. Offline fallback articles remain available.

M67 still does not publish full official articles, write Supabase/CMS data, generate article text with AI, generate images, load external images, inject sponsors, or hardcode official finance/loan/government facts.

## M68 One Reviewed Pilot Article Draft Workflow

M68 adds `/app/articles/pilot-draft-review` and the first richer local-only pilot article draft workflow for `soil-types-before-planting`.

The pilot title is `ดิน 6 ชนิด รู้จักก่อนปลูก`. It includes draft-only Thai body sections, a simple soil comparison table, observation steps, broad use examples, improvement ideas, mistakes to avoid, expert escalation notes, related app links, source placeholders, image requirements, and publish blockers.

The article detail route `/app/articles/offline/soil-types-before-planting` can show the richer draft, but the publish gate remains blocked. M68 still does not publish official full content, write Supabase/CMS data, generate articles with AI, generate images, load external images, inject sponsors, or hardcode official finance/loan/government facts.

## M69 Pilot Article Editorial QA Polish

M69 adds `/app/articles/editorial-review`, an offline-only editorial QA route for pilot article sign-off.

The new service layer defines reviewer roles, pending sign-off fixtures, final source metadata shape, image asset review fixtures, approval state, and final publish blockers. It keeps `soil-types-before-planting` blocked and adds a second low-risk `draft_template` pilot, `soil-ph-reading-yourself`, mapped back to the soil article fallback.

M69 still does not publish final articles, write Supabase/CMS data, generate text with AI, generate images, load external images, inject sponsors, or add official finance/loan/government facts.

## M70 Editorial Evidence Packet And Human Release Gate

M70 adds `/app/articles/editorial-evidence`, a local-only evidence packet and human release gate for offline agriculture articles.

The new service layer builds source evidence, reviewer evidence, image evidence, safety confirmation, freshness placeholders, escalation notes, and release blockers. It also includes a safe completion simulation proving that even completed metadata and review evidence cannot publish automatically without explicit human release approval, reviewer, timestamp, and note placeholders.

M70 still does not publish final articles, write Supabase/CMS data, generate text with AI, generate images, inject sponsors, or add official finance/loan/government facts.

## M71 Offline Article Release Audit Readiness

M71 adds `/app/articles/release-audit`, a local-only release audit readiness route for offline agriculture articles.

The new service layer records blocked publish attempt fixtures, reviewer change history placeholders, release diff previews, disclaimer/source/image change tracking, and automation bypass attempts. CMS override and automation remain unable to publish without the human release gate.

M71 still does not publish final articles, write Supabase/CMS data, generate text with AI, generate images, load external images, inject sponsors, or add production article publishing.

## M72 Offline Article CMS Persistence Contract Planning

M72 adds `/app/articles/cms-persistence-plan`, a local-only planning route for future backend-owned CMS persistence.

The new service layer defines CMS roles, write/read contracts, release audit write requirements, future table planning, offline fallback policy, and migration rollback checklist. Viewer cannot edit, automation cannot publish, admin cannot silently bypass human release, and release manager remains blocked without evidence and audit requirements.

M72 still does not run migrations, write Supabase/CMS data, fetch CMS content, upload images, generate articles with AI, inject sponsors, or publish production articles.

## M73 CMS Migration Dry-run Checklist And SQL Review Pack

M73 adds `/app/articles/cms-migration-review`, a local-only dry-run review pack for the future CMS article migration.

The new service layer defines table review planning, RLS expectation planning, rollback planning, seed fixture planning, and publish safety gates for article CMS persistence. Public writes, frontend CMS writes, automation publish, and incomplete content publish remain blocked.

M73 still does not run migrations, write Supabase/CMS data, fetch CMS content, upload images, generate articles with AI, inject sponsors, or publish production articles.

## M74 CMS SQL Draft Artifacts Planning

M74 adds `/app/articles/cms-sql-drafts`, a local-only route for checked-in planning SQL draft artifacts.

The new draft files live under `supabase/drafts/cms/`, not `supabase/migrations`, and cover future article CMS schema, RLS policy planning, seed fixture planning, and rollback planning. Each file is marked `PLANNING ONLY`, `DO NOT RUN`, `DO NOT DEPLOY`, and `REVIEW REQUIRED`.

The app registers these files with `executionStatus = not_executed`, `reviewStatus = needs_review`, and `migrationBlocked = true`. Frontend CMS writes and final article publish remain blocked.

M74 still does not run SQL, run migrations, write Supabase/CMS data, fetch CMS content, upload images, generate articles with AI, inject sponsors, or publish production articles.

## M75 Real Weather API Integration

M75 adds `/app/weather` as a flag-gated Open-Meteo weather integration with an offline-safe fallback.

The weather adapter supports `local_fixture`, `open_meteo_disabled`, `open_meteo_ready`, and `production_disabled`. Defaults keep `VITE_WEATHER_MODE=local_fixture` and `VITE_ENABLE_REAL_WEATHER_API=false`, so the app performs no network call unless local staging flags explicitly enable Open-Meteo.

When enabled, the adapter requests the Open-Meteo public forecast endpoint with configured default coordinates only. It maps current temperature, humidity, precipitation, wind speed, weather code, and a 5-7 day forecast into Thai farmer-friendly weather cards.

M75 updates Home, My Farm, Profile, Admin Dashboard, Next Phase, QA, and route registry entry points with weather status. The UI states that Open-Meteo is external forecast data, uses no GPS/geolocation, stores no personal precise location, and falls back to local fixture data on errors.

M75 still does not write Supabase data, write backend data, enable cloud sync, request GPS, store personal location, call AI, add payments/ads, or make weather API calls by default.

## M76 Weather QA Cache And Coarse Location

M76 adds `/app/weather/qa`, local-only weather cache readiness, predefined coarse location fixtures, stale-cache UI, failure fixtures, and farmer-friendly risk note boundaries.

The weather route now lets users choose among province/city-center fixtures for กรุงเทพฯ, นครราชสีมา, ขอนแก่น, เชียงใหม่, นครสวรรค์, สุพรรณบุรี, อุบลราชธานี, สุราษฎร์ธานี, and สงขลา. These are approximate forecast lookup locations, not farm coordinates.

M76 cache is local-only and keyed by coarse location id. Fresh cache can avoid fetch, stale cache is labeled, and stale cache can be used when Open-Meteo fails. If there is no usable cache, the app falls back to local fixture data.

M76 still does not request GPS/geolocation, store precise personal location, write Supabase data, write backend data, enable cloud sync, call AI, add payments/ads, or make network calls by default.
## M77 Weather UX + Data-source Readiness

M77 polishes the Open-Meteo weather integration with source attribution, manual refresh policy, stale/offline messaging, a local-only coarse-location preference route, cache QA, and no-sync privacy proof.

No GPS, precise location storage, Supabase writes, backend writes, cloud sync, or default network calls were added.

## M78 Agriculture Weather Risk Intelligence Readiness

M78 adds `/app/weather/risk-rules`, a local-only readiness route for agriculture weather risk categories, planning thresholds, blocked actions, disclaimers, and example assessments.

The weather route now shows general risk cards for spraying risk, irrigation timing, disease pressure, heat stress, field work risk, and harvest drying risk. These cards are deterministic and derived from the existing weather adapter/cache result.

M78 remains planning-only: no expert-reviewed agronomy engine, no AI API call, no GPS/geolocation, no precise personal location storage, no Supabase write, no backend write, no cloud sync, no push notification, no product/sponsor recommendation, no exact chemical/fertilizer dose, and no guaranteed outcome.

## M79 Weather Risk Expert-review Readiness

M79 adds `/app/weather/risk-review`, a local-only expert-review readiness route for agriculture weather risk rules.

The new service layer adds rule version metadata, source placeholders, pending reviewer sign-offs for agronomy, crop protection, weather data, and safety roles, false-positive examples, false-negative examples, and prescriptive blockers.

M79 keeps every weather risk rule at `planning_only` with `prescriptiveAllowed=false`. No rule can become prescriptive, recommend products, provide exact chemical/fertilizer doses, use GPS, write Supabase data, call AI, or send push notifications.

## M80 Weather Risk Governance And Audit Readiness

M80 adds `/app/weather/risk-audit`, a local-only release audit and governance QA route for weather risk rules.

The service layer adds reviewed-source simulations, reviewer history fixtures, release audit events, diff previews, stale review warnings, and human approval gate blockers.

M80 proves automation and CMS cannot turn a weather risk rule prescriptive. It still adds no AI calls, no production agronomy engine, no exact prescriptions, no product/sponsor recommendations, no GPS/geolocation, no Supabase writes, no backend writes, no cloud sync, and no automated push notifications.
## M81 Real AI Text Proxy Controlled Staging

M81 adds `src/services/ai-text` for a controlled staging-only text proxy boundary. It supports calculator explanation, weather caution explanation, and general educational explanation requests while blocking exact chemical/fertilizer prescription, sponsor/product insertion, autonomous diagnosis, guaranteed outcomes, and legal/financial certainty. `/app/ai-text-status` shows mode, network flags, audit preview, rate-limit preview, immutable calculator-output proof, and fallback status. Defaults remain `VITE_AI_TEXT_MODE=local_fixture`, `VITE_ENABLE_REAL_AI_TEXT=false`, and `VITE_ENABLE_AI_TEXT_NETWORK=false`.

## M82 AI Text Endpoint Contract Dry-run

M82 adds `src/services/ai-text/ai-text-endpoint-contract.ts` and `/app/ai-text-endpoint-plan` for a backend-owned `ai-text-proxy` endpoint contract. The endpoint URL is masked, dry-run/network flags default false, audit/rate-limit output remains preview-only, and timeout fallback cannot mutate calculator outputs.

## M83 Farm Records + Farm Finance Ledger Foundation

M83 adds `src/services/farm-records` with framework-first domain types for `FarmPlot`, `CropCycle`, `FarmActivityRecord`, `FarmFinanceEntry`, image metadata placeholders, and computed `FarmLedgerSummary`.

The local storage service uses `kasethub.farmRecords.v1`, safe migration/defaulting, malformed-record normalization, demo seed data, and service-level Vitest coverage for creates, filters, and summary math. `/app/farm-records`, Admin Dashboard, QA, and the route registry expose development visibility.

M83 stays foundation-only. It adds no Supabase writes, cloud sync, GPS/geolocation, precise map location, AI analysis of farm records, receipt upload, PDF/CSV export, notifications, or final PDPA legal copy. Future sync must require opt-in consent, owner-only RLS, export/delete tools, and a separate AI consent boundary.

## M84 Farm Records Farmer-Facing UI

M84 upgrades `/app/farm-records` into the first farmer-facing Farm Records / สมุดบันทึกฟาร์ม UI on top of the M83 local service.

The page now shows local-only privacy copy, summary cards, filters, farm plots, crop cycles, activity records, finance ledger entries, and computed ledger summary. It adds lightweight local create flows for farm plots, crop cycles, activity records, and finance entries, plus confirmation-based local deletes for activity and finance entries.

M84 keeps the same `kasethub.farmRecords.v1` local state key. It adds no Supabase schema, Supabase writes, cloud sync, sync queue, GPS/geolocation/map pins, AI farm-record reading, receipt upload, PDF/CSV export, notifications, OCR, or legal-final PDPA copy.

## M85 Farm Records Edit + My Farm Integration

M85 improves the local Farm Records farmer UI with safe edit flows for farm activity records and finance ledger entries. The edit forms reuse the M84 create form style, preserve local-created records through the existing M83 service path, validate required fields, block invalid finance amounts, and keep delete confirmation copy local-only.

M85 adds a Recent Farm Timeline on `/app/farm-records` and integrates Farm Records into `/app/my-farm` with an entry point, local ledger net profit, active crop cycle count, latest activity date, latest finance date, and farm-record timeline items.

M85 also adds `docs/privacy/FARM_RECORDS_EXPORT_DELETE_PLAN_M85.md` as planning only. It implements no real export, bulk delete, Supabase schema, Supabase writes, cloud sync, GPS/geolocation/map pins, AI record processing, OCR, receipt upload, notifications, PDF export, CSV export, or legal-final PDPA copy.

## M86 Farm Records Export/Delete Readiness

M86 adds local-device data control for Farm Records before any cloud sync. `src/services/farm-records/farm-records-export-service.ts` builds JSON backups, finance CSV strings, and export preview metadata from `kasethub.farmRecords.v1`.

The `/app/farm-records` page adds an Export & Data Control section with local-only warnings, JSON preview/download, finance CSV preview/download, estimated sizes, latest record date, and safe delete/archive guidance. It also exposes farm plot archive and crop-cycle harvested/cancelled actions as safer alternatives to hard delete.

M86 adds `docs/privacy/FARM_RECORDS_DATA_CONTROL_M86.md` and updates the M85 export/delete plan with implementation status. It adds no cloud export, cloud delete, Supabase schema, Supabase writes, sync queue, GPS/geolocation/map pins, AI record processing, OCR, receipt upload, notifications, bulk delete, bank/loan/tax integration, or legal-final PDPA copy.

## M87 Farm Records Backup Restore + Sync Consent Gate

M87 adds local JSON backup restore readiness before any future sync. `src/services/farm-records/farm-records-restore-service.ts` parses JSON backups without throwing, validates required Farm Records slices, normalizes through the existing local state path, strips raw `data:` image payloads, excludes GPS/geolocation-like fields, builds current-vs-backup previews, and applies local restore only with explicit confirmation and the `RESTORE FARM RECORDS` phrase.

The `/app/farm-records` page adds Restore Backup and Cloud Sync Readiness sections. Restore is preview-first and replace-local-only for `kasethub.farmRecords.v1`; it does not affect unrelated local storage. The sync consent gate is disabled/future-facing and documents requirements for explicit user consent, authenticated ownership, owner-only RLS, export/delete tools, audit/idempotency, retention policy, separate AI consent, and separate GPS consent. `/app/my-farm` links into the local backup/restore controls.

M87 adds `docs/privacy/FARM_RECORDS_RESTORE_SYNC_CONSENT_M87.md` and keeps all sync behavior blocked: no Supabase schema, read, write, sync queue, cloud backup, cloud delete, GPS/geolocation/map pins, AI record processing, OCR, receipt upload, notifications, bank/loan/tax integration, server-side restore, or legal-final PDPA copy.

## M88 Farm Records Restore Recovery + Sync Architecture Review

M88 adds a local restore recovery safety layer before any future sync. `src/services/farm-records/farm-records-restore-recovery-service.ts` builds sanitized pre-restore snapshots, stores only one latest local snapshot under `kasethub.farmRecords.restoreSnapshot.v1`, stringifies snapshots safely, and computes Restore Risk Review metadata comparing current local data with a validated backup.

The `/app/farm-records` page now shows Restore recovery guidance, a "Download current local backup before restore" action, Restore Risk Review counts, estimated removed/added records, current-vs-backup net profit, latest current/backup dates, and risk warnings before the existing restore confirmation. The restore button still requires validation, risk review availability, checkbox confirmation, and the `RESTORE FARM RECORDS` phrase.

M88 also creates `docs/sync/FARM_RECORDS_SYNC_ARCHITECTURE_REVIEW_M88.md` and `docs/sync/FARM_RECORDS_SYNC_READINESS_CHECKLIST_M88.md`. The disabled sync UI now shows local export/restore/recovery as ready and cloud consent, Supabase RLS, sync queue, conflict handling, cloud delete/export, and AI consent as not implemented or separate future gates. It still adds no Supabase schema, Supabase read/write, sync queue, cloud sync, cloud delete, server-side restore, GPS/geolocation/map pins, AI record processing, OCR, receipt upload, notifications, bank/loan/tax integration, or legal-final PDPA copy.

## M89 Farm Records Sync Consent UX Prototype

M89 adds a non-writing Cloud Sync Consent Prototype to `/app/farm-records#farm-records-sync`. The prototype explains what future sync would mean, what Farm Records data could be included, what is excluded by default, and why finance data needs careful consent. The Enable Cloud Sync action remains disabled.

`src/services/farm-records/farm-records-sync-consent-prototype.ts` stores optional local prototype checkbox state under `kasethub.farmRecords.syncConsentPrototype.v1`. This state is not legal consent, cannot unlock sync, and makes no backend calls. M89 also creates `docs/sync/FARM_RECORDS_OWNER_RLS_TEST_PLAN_M89.md` and `docs/sync/FARM_RECORDS_SYNC_CONSENT_UX_M89.md`, and updates the M88 sync architecture/checklist docs with M89 status. It still adds no Supabase schema, Supabase read/write, sync queue, cloud sync, cloud delete, GPS/geolocation/map pins, AI record processing, receipt upload, OCR, notifications, or legal-final PDPA copy.

## M90 Farm Cost Summary + Break-even Dashboard

M90 adds local cost analytics on top of the existing Farm Records and Farm Finance Ledger state. `src/services/farm-records/farm-cost-analytics-service.ts` computes income, expense, net profit, profit/loss status, per-rai metrics, category breakdowns, top categories, latest record dates, break-even estimates, and deterministic local insights without calling AI or a backend.

The `/app/farm-records#farm-cost-dashboard` section shows farmer-facing cost cards, expense/income category breakdowns, local-only status copy, and a lightweight break-even calculator for expected yield and selling price. `/app/my-farm` links to the cost dashboard and surfaces cost per rai plus the top expense category when available.

M90 keeps the same local storage boundary and adds no Supabase schema, Supabase read/write, sync queue, cloud sync, cloud backup/delete, GPS/geolocation/map pins, AI record processing, receipt upload, OCR, notifications, bank/loan integration, tax filing, or official accounting/legal claims.

## M91 Farm Records Harvest Yield + Cost-per-Kg Readiness

M91 adds local harvested-quantity modeling to Farm Records through a dedicated `farmHarvestRecords` slice under the existing `kasethub.farmRecords.v1` state. Harvest records store plot/cycle links, harvest date, crop name, quantity/unit, normalized kg where possible, optional grade/buyer/sale price, and local notes.

The local service adds harvest list/get/create/update/delete helpers, migration-safe defaults for old local state, demo harvest data, and export/restore/pre-restore snapshot compatibility. Old JSON backups without `farmHarvestRecords` still validate and restore with an empty harvest slice.

The `/app/farm-records#farm-harvest-yield` section shows total harvested kg, harvest record count, yield per rai, cost per kg, income per kg, profit per kg, average sale price, actual recorded break-even per kg, latest harvest date, and missing-data warnings. The M90 cost dashboard and `/app/my-farm` now surface harvest/cost-per-kg context when available.

M91 keeps the same local-only boundary and adds no Supabase schema, Supabase read/write, sync queue, cloud sync, cloud backup/delete, GPS/geolocation/map pins, AI record processing, receipt upload, OCR, notifications, bank/loan integration, tax filing, official accounting/legal claims, or yield guarantees.

## M92 Home First Farm Hub + Elder-Friendly Navigation

M92 moves Farm Records discovery onto the first app screen. M92.1 compacts `/app` into a Home Farm Hub launcher with Thai-first copy and one primary action for `/app/my-farm`.

The home card no longer shows Farm Records metrics, cost dashboard links, harvest details, or a 2x2 Farm Records quick-action grid. Those details remain in `/app/my-farm`, `/app/farm-records`, `/app/farm-records#farm-cost-dashboard`, and `/app/farm-records#farm-harvest-yield`.

`docs/ux/HOME_FIRST_NAVIGATION_M92.md` documents the current navigation problem, the M92.1 compact decision after mobile preview, why Farm Records should not be hidden in Profile, what should remain in Profile, what should be on Home, and a future bottom navigation proposal. M92.1 does not remove routes or change Farm Records data behavior.

M92 remains UX/navigation only: no Supabase schema/read/write, no sync queue, no cloud sync, no GPS/geolocation/map pins, no AI record processing, no receipt upload, no OCR, no notifications, no tax/bank/loan integration, and no backend feature changes.

The future endpoint is still not deployed. Frontend code cannot call a provider directly, cannot accept provider/service-role keys, cannot bypass blocked actions, and cannot enable production AI text behavior.
