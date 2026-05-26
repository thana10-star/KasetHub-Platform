# KasetHub Platform

KasetHub Platform is a premium agriculture knowledge, community, and AI assistant prototype for Thailand. M01 established the scalable React foundation, M02 added mobile retention plus organic sharing foundations, M02.5 expanded social sharing, M03 turned YouTube into an API-ready agriculture channel hub, M04 added guest memory, M05 defined Supabase/auth-ready data models, M06 added a disabled-by-default Supabase environment/client scaffold, M07 prototyped farmer-friendly auth UX, M08 added local AI credits, M09 defined the AI backend proxy contract, M10 added plant upload UX, M11 added backend-shaped mock AI proxy fixtures, M12 designed Supabase Storage and image-analysis schema foundations, M13-M14 added AI proxy adapter/local backend boundaries, M15 improved farmer accessibility, and M16-M64 built safe staging, auth, sync, admin, weather, farm area, My Farm, and calculator foundations without production backend writes. M83-M91 build the local-first Farm Records chain from storage through UI, edit, export, restore, sync consent prototype, cost dashboard, and harvest/yield cost-per-kg readiness. M92 makes My Farm visible from Home, M92.1 compacts that Home entry into a simple My Farm launcher, M93 cleans up bottom navigation/Profile grouping, M94 polishes Profile into elder-friendly settings, M95 adds a farmer start guide plus local/static field-test checklist, M96 simplifies the first-use Farm Records path, M97 polishes the first Add Plot/Add Activity flows, M97.1 adds Basic Farm Records Mode, M97.2 makes the main app copy production-facing while preserving local-only data boundaries and advanced/internal tools, M98 triages the mobile farmer basic flow with small density/copy/readability fixes, M98.1 improves calculator mobile UX, crop selection affordance, and the fertilizer/fertigation planning direction, M99 confirms the merged main branch with a release-preview smoke pass, M100 audits Weather real API readiness plus V1 Store Release Mode direction, M100.1 replans V1 around an AI-first farmer utility direction connected to Weather, tools, content, and simple My Farm, M101 polishes Home plus `/app/ai` so the farmer assistant is the first obvious V1 utility while keeping safety notes visible, and M102 adds the Weather live-enable checklist plus V1 release gate.

M35-M44 continue the safe staging path with local notifications, real backend phase planning, the `staging/supabase` branch workflow, local env safety checks, manual Supabase project/SQL prep, the M41 real staging setup walkthrough, the successful M42 manual execution review, the M43 read-only public table probe, and the M44 public read/RLS review checkpoint. M49-M60 return to farmer utility by adding, hardening, planning, testing, polishing, QA-hardening, AI-boundary planning, backend architecture review, a no-network adapter contract, staging endpoint checklists, an Edge Function contract draft, and a no-fetch dry-run plan for crop-aware calculator foundations while keeping all storage and summaries local. M61-M64 return to the production-readiness roadmap with Phone Auth staging planning, a controlled staging auth boundary, an ownership/RLS sync gate, and a local-only Guest Memory sync dry-run payload builder. M65-M74 build offline article/CMS readiness, M75 adds the first flag-gated real Open-Meteo weather API integration, M76-M77 harden weather cache/source UX, M78 adds planning-only agriculture weather risk readiness, M79 adds expert-review readiness for those weather risk rules, M80 adds release audit/governance readiness, M81-M82 add controlled AI text proxy readiness without provider calls by default, M83 adds local farm records and ledger storage, M84 adds the local farmer-facing records UI, M85 adds local edit/timeline/My Farm integration, M86 adds local export/data-control readiness, M87 adds validated local restore plus sync consent gating, M88 adds restore recovery plus sync architecture review, M89 adds the non-writing sync consent UX prototype, M90 adds the local Farm Cost Dashboard, M91 adds local harvest/yield and cost-per-kg readiness, M92 adds a Home-first Farm Hub entry, M93 cleans up elderly-friendly navigation, M94 polishes settings, M95 adds start-guide/field-test readiness, M96 simplifies the first-use Farm Records flow, M97 polishes the first Add Plot/Add Activity flow, M97.1 makes Farm Records basic-first, M97.2 reduces test/prototype wording on normal user-facing pages without enabling backend behavior, M98 keeps that basic flow visually calmer on mobile, M98.1 makes calculators more mobile-safe and useful without adding risky chemical recommendations, M99 verifies the merged `main` branch with lint/build/test plus route smoke, M100 documents Weather Open-Meteo env/Cloudflare readiness for V1 Store Release Mode, M100.1 sets the AI-first V1 release plan, M101 makes Home and `/app/ai` more farmer-facing with prompt examples, fallback copy, and safety notes, and M102 documents the Cloudflare live Weather enable steps plus V1 release gate. The project still must not commit real keys, expose service-role keys, enable production auth/cloud sync, run SQL automatically, write Supabase data, run real ads, call AI APIs, request GPS/geolocation, store personal precise location, or change production behavior.

M90 adds a local Farm Cost Dashboard and break-even estimate on top of Farm Records finance data. M91 adds local harvest records, yield summaries, cost per kg, income per kg, profit per kg, and recorded-harvest break-even metrics. M92 brings My Farm onto Home, M92.1 compacts it into a simple launcher, M93 adds the dedicated My Farm bottom-nav slot, M94 makes Profile a calmer settings page, M95 adds `/app/help` plus `/app/field-test-feedback`, M96 adds a clearer first-use path, M97 makes the first Add Plot/Add Activity forms calmer, M97.1 makes the default Farm Records presentation basic-first with advanced content lower, M97.2 treats Farm Records as real local user data in normal app copy, M98 keeps My Farm details secondary while tightening Thai-first Farm Records labels, M98.1 fixes calculator mobile affordance/overflow and shifts the weak chemical-mix surface toward a safer label-only tool plus fertilizer/fertigation planning, and M100 clarifies that Weather can use Open-Meteo when Cloudflare/frontend flags are enabled while staying backup-data safe by default. These remain local estimates/navigation/settings/help surfaces without AI, Supabase reads/writes, cloud sync, GPS, receipt upload, tax filing, backend feedback submission, or official accounting/loan claims.

## Tech Stack

- React + TypeScript + Vite
- TailwindCSS
- React Router
- lucide-react icons
- `@supabase/supabase-js` client scaffold behind feature flags
- Vitest for pure service-level calculator tests
- Typed mock data only
- Frontend-safe sharing and localStorage saved article foundation

## M75 Real Weather API Integration

- Adds Open-Meteo forecast support in `src/services/weather/weather-adapter.ts`.
- Adds `src/services/weather/weather-open-meteo-client.ts` with a timeout-safe public forecast client.
- Keeps defaults offline-safe: `VITE_WEATHER_MODE=local_fixture` and `VITE_ENABLE_REAL_WEATHER_API=false`.
- Uses configured default coordinates only; no GPS or browser geolocation.
- Updates `/app/weather` with current weather, precipitation, wind, humidity, 5-7 day forecast, source/fetched time, and farmer-facing backup-data state.
- Adds docs: `docs/REAL_WEATHER_API_OPEN_METEO.md`, `docs/WEATHER_API_PRIVACY_AND_LOCATION_POLICY.md`, and `docs/WEATHER_API_FALLBACK_AND_CACHE_PLAN.md`.

## M100 Weather Real API Production Readiness

- Confirms Weather already has a real Open-Meteo adapter.
- Confirms Open-Meteo public forecast use does not require an API key.
- Keeps live weather disabled by default unless `VITE_WEATHER_MODE=open_meteo_ready` and `VITE_ENABLE_REAL_WEATHER_API=true` are configured.
- Documents local and Cloudflare Pages env setup in `docs/weather/WEATHER_REAL_API_ENV_M100.md`.
- Documents the Cloudflare production checklist in `docs/release/WEATHER_CLOUDFLARE_PRODUCTION_CHECKLIST_M100.md`.
- Adds `docs/release/V1_STORE_RELEASE_DIRECTION_M100.md` for the V1 feature-freeze direction.
- Polishes `/app/weather` primary copy so normal farmers see backup/latest/source wording instead of mode/debug labels.

## M100.1 V1 Store Release AI-First Direction

- Replans V1 as an AI-first farmer utility app: ask AI, check weather, use tools, learn from content, and keep a simple farm notebook.
- Adds `docs/release/V1_STORE_RELEASE_AI_FIRST_DIRECTION_M100_1.md`.
- Adds `docs/ai/AI_FARMER_ASSISTANT_SAFETY_POLICY_M100_1.md`.
- Adds `docs/weather/WEATHER_V1_FOLLOW_UP_AFTER_M100_1.md`.
- Adds `docs/content/YOUTUBE_KNOWLEDGE_V1_INTEGRATION_M100_1.md`.
- Adds `docs/release/V1_STORE_RELEASE_CHECKLIST_M100_1.md`.
- Keeps broad new systems deferred: no Supabase writes, cloud sync, GPS, OCR, receipt upload, notifications, or unsafe AI recommendations.

## M101 AI-First Home And Farmer Assistant UX

- Adds a prominent `ถาม AI เกษตร` Home card with farmer prompt examples and a link to `/app/ai`.
- Updates `/app/ai` with farmer-facing title, input placeholder, `ถาม AI` button, examples, fallback copy, and safety notes.
- Adds shared AI farmer assistant copy in `src/services/ai/ai-farmer-assistant-copy.ts`.
- Moves AI status/scenario/ad-test controls under `ข้อมูลเพิ่มเติม / สำหรับทีมงาน`.
- Updates `/app/help` with a clear AI section and safety note.
- Keeps real AI provider execution disabled unless separately configured and approved.

## M102 Weather Live Enable + V1 Release Gate

- Confirms Weather live mode still depends on explicit Cloudflare/frontend flags and does not require an API key for the current Open-Meteo path.
- Adds `docs/release/CLOUDFLARE_WEATHER_LIVE_ENABLE_M102.md` with owner-side production env steps.
- Adds `docs/release/V1_RELEASE_GATE_M102.md` with honest V1 readiness/blocker status across AI, Weather, Tools, Help, My Farm, mobile UI, store assets, privacy/support, Cloudflare deploy, and wrapper decision.
- Adds a small Weather team-details note: `ข้อมูลพยากรณ์จริงพร้อมใช้งานเมื่อเปิดการตั้งค่าเซิร์ฟเวอร์`.
- Keeps no GPS/geolocation, no secrets, no Supabase writes, no cloud sync, no real AI provider enablement, and no new broad feature systems.

## M103 V1 Release Assets + Owner Verification Package

- Adds `docs/release/V1_OWNER_VERIFICATION_CHECKLIST_M103.md` for Cloudflare Weather live verification, real-phone route checks, screenshot capture, and store blockers.
- Adds store preparation docs for Thai-first listing copy, screenshot plan, icon/visual direction, privacy/support requirements, and wrapper decision options.
- Recommends Cloudflare web/PWA-style preview first, then Android wrapper if needed, while deferring iOS until product feedback is clear.
- Keeps V1 scope frozen: no real AI provider, Supabase writes, cloud sync, GPS/geolocation, OCR/image diagnosis, receipt upload, notifications, or Farm Records schema changes.

## M104 Owner Production Verification + Screenshot Capture

- Adds owner-side worksheets for production verification, screenshot capture, release blocker logging, and local commands/Cloudflare links.
- Keeps M104 focused on owner verification: no feature expansion, wrapper implementation, store submission, real AI provider, Supabase writes, cloud sync, GPS/geolocation, OCR, receipt upload, notifications, or Farm Records schema changes.

## M104.1 Weather UI Priority + App Navigation Polish

- Moves `/app/weather` to a farmer-first order: location, current weather, risk summary, update actions, then source/cache details under `ข้อมูลเพิ่มเติม`.
- Improves Weather risk colors so `ระวัง` is orange/yellow, high risk is red/pink, low risk is calm green, and watch/unknown states stay blue/neutral.
- Adds route scroll-to-top behavior while preserving hash anchors, and standardizes the shared header Home action as `กลับหน้าแรก`.
- Keeps Weather provider/API behavior unchanged and adds no GPS, Supabase writes, cloud sync, real AI provider, OCR, notifications, or Farm Records storage/schema changes.

## M105 V1 Store Readiness Decisions

- Adds release-readiness docs for final icon direction, privacy policy draft structure, support contact options, release channel, and final screenshot checklist.
- Locks V1 alpha feedback direction as Cloudflare/PWA preview first, with Android wrapper as the next candidate and iOS later.
- Keeps support email/form, public privacy URL, final icon exports, and screenshot approval as owner decisions.
- Does not generate final icon files, implement a wrapper, submit to stores, enable AI provider, add GPS, write Supabase data, or change app behavior.

## M106 Final Store Asset Package Lock

- Adds `docs/release/v1-package/` as the final owner approval package for V1 alpha sharing.
- Includes final store listing draft, public privacy page draft, support public copy, screenshot capture status, icon approval status, release channel lock, and final owner actions.
- Keeps the release channel locked to Cloudflare/PWA preview first, with Android wrapper after the first feedback round.
- Leaves remaining owner actions as publishing privacy/support URLs, approving icon assets, capturing screenshots, confirming production Weather, and sharing with testers.

## M107 Owner Publication + Alpha Feedback Launch

- Adds `docs/release/alpha-launch/` as the owner-facing launch pack for Cloudflare/PWA alpha sharing.
- Includes an owner launch checklist, Thai-first tester route guide, Google Form-style feedback draft, YouTube community post drafts, known limitations, and a feedback triage plan.
- Keeps first feedback focused on Home, AI, Weather, Tools, My Farm, Farm Records, Help/Profile, mobile readability, and trust/privacy clarity.
- Defers broad new features, AI provider enablement, Supabase writes, cloud sync, GPS, OCR, receipt upload, notifications, and wrapper implementation until after feedback is reviewed.

## M76 Weather QA Cache And Coarse Location

- Adds local-only weather cache services and stale/fresh status.
- Adds predefined province/city-center coarse locations for weather lookup.
- Adds `/app/weather/qa` with mode, cache, fallback, location privacy, and failure fixture checks.
- Updates `/app/weather` with coarse location selector, cache status, clear cache action, stale warning, and farmer risk notes.
- Keeps no GPS, no browser geolocation, no exact farm coordinates, no Supabase writes, and no required network calls by default.

## M78 Agriculture Weather Risk Readiness

- Adds planning-only agriculture weather risk categories and deterministic local assessments.
- Adds `/app/weather/risk-rules` with risk categories, threshold previews, blocked actions, disclaimers, and example assessments.
- Updates `/app/weather` and `/app/weather/qa` with general weather risk cards and no-product/no-prescription proof.
- Keeps risk guidance broad: no crop-specific prescription, no exact chemical/fertilizer dose, no sponsor/product recommendation, no GPS, and no Supabase writes.

## M79 Weather Risk Expert Review Readiness

- Adds local rule version metadata, source placeholders, pending reviewer sign-offs, and false-positive/false-negative examples.
- Adds `/app/weather/risk-review` to show expert review gates and prescriptive blockers.
- Keeps `prescriptiveAllowed=false` for every weather risk rule version.
- Still no AI, GPS, Supabase writes, product/sponsor recommendation, or exact chemical/fertilizer prescription.

## M80 Weather Risk Governance And Audit Readiness

- Adds local release audit fixtures, reviewer change history, reviewed-source simulations, and diff previews.
- Adds `/app/weather/risk-audit` to show blocked release attempts, stale review warnings, and human approval gate requirements.
- Proves automation/CMS cannot make weather risk rules prescriptive without a distinct human release step.
- Still no AI, GPS, Supabase writes, push notifications, product/sponsor recommendation, or exact chemical/fertilizer prescription.

## M61 Phone Auth Staging Test Plan

- Adds `src/services/auth/phone-auth-staging-review.ts` and typed review output for the first Supabase Phone Auth staging test.
- Adds `/app/auth/phone-staging-test` with Thai checklist copy for Supabase dashboard setup, redirect URLs, SMS provider readiness, test phone numbers, cost/rate limits, ownership before sync, and rollback steps.
- Updates Phone Auth, Auth Status, Sync Preview, Account Preview, Supabase Readiness, Admin, Next Phase, and QA screens with M61 staging status and no-real-OTP reminders.
- Adds env placeholders only: `VITE_PHONE_AUTH_MODE=local_mock`, `VITE_ENABLE_PHONE_AUTH=false`, `VITE_SUPABASE_AUTH_REDIRECT_URL=`, and `VITE_AUTH_STAGING_LABEL=local`.
- Vitest proves the default status is blocked, auth flags are off by default, cloud sync remains blocked until ownership exists, frontend service-role keys are rejected, and rollback steps exist.
- Keeps M61 planning-only: no real OTP, no real SMS by default, no cloud sync, no Supabase writes, no service-role key, no Edge Function deployment, and no production auth behavior.

## M62 Controlled Phone Auth Staging Test

- Adds a controlled staging adapter in `src/services/auth/phone-auth-staging-adapter.ts`.
- Adds ownership status in `src/services/auth/auth-ownership-status.ts`.
- Allows Supabase Phone OTP only when local staging flags are explicit: `VITE_PHONE_AUTH_MODE=supabase_staging_ready`, `VITE_ENABLE_SUPABASE=true`, `VITE_ENABLE_AUTH=true`, `VITE_ENABLE_PHONE_AUTH=true`, valid staging anon config, and `VITE_ENABLE_CLOUD_SYNC=false`.
- Updates `/app/auth/phone`, `/app/auth/phone-staging-test`, `/app/auth/status`, `/app/auth/sync-preview`, and `/app/account-preview` with staging status, redirect preview, SMS cost warnings, rollback reminders, and ownership status.
- Keeps Guest Memory sync blocked: no profile/app table writes and no cloud upload in M62.

## M53 Calculator Export/Share Polish

- Structured calculator result summaries in `src/services/agri-calculators/calculator-result-summary-service.ts`
- Local saved summaries route at `/app/calculators/saved-results`
- Calculator pages support copy summary, share summary, save local summary, and LINE share via the existing share service
- Rewarded ads strategy is planning-only: basic calculations remain free and no real AdMob, payment, sponsor, affiliate, backend write, Supabase write, AI call, PDF generation, or network call is added
- Docs: `docs/CALCULATOR_EXPORT_SHARE_FOUNDATION.md` and `docs/CALCULATOR_REWARDED_ADS_STRATEGY.md`

## M54 Calculator Export/Share QA

- Text export templates in `src/services/agri-calculators/calculator-export-template-service.ts`
- Export preview route at `/app/calculators/export-preview`
- Saved results now support filtering, compact/expanded view, LINE-friendly preview, quick copy, and delete confirmation
- Vitest covers template formatting, empty summary protection, clipboard fallback, unsupported native share, truncation, and LINE-friendly output
- Docs: `docs/CALCULATOR_EXPORT_TEMPLATE_GUIDE.md` and `docs/CALCULATOR_SHARE_QA_NOTES.md`

## M55 Calculator AI Explanation Boundary

- Adds AI explanation boundary types, policy, fixtures, and a planner in `src/services/agri-calculators`
- Adds `/app/calculators/ai-explanation-preview` for local-only explanation plan preview
- Saved results, calculator hub, QA, Admin, and safety routes link to the preview
- Vitest covers formula explanation allowance, sponsor/chemical/result-mutation blocking, result preservation, spray/fertilizer disclaimers, and `noRealAICall`
- Docs: `docs/CALCULATOR_AI_EXPLANATION_BOUNDARY.md` and `docs/CALCULATOR_AI_PROMPT_SAFETY_POLICY.md`

## M56 Real Backend AI Explanation Architecture Review

- Adds backend AI execution, snapshot, policy version, safety decision, rate-limit, abuse, audit, and escalation planning types
- Adds `/app/calculators/ai-architecture` for the no-real-AI backend review route
- Defines the future flow: Calculator -> Snapshot Lock -> Backend Policy Check -> Prompt Builder -> AI Explanation -> Safety Filter -> Final Display
- Vitest covers snapshot immutability, mutation blocking, sponsor rejection, invalid request rejection, policy selection, oversized payload, and invalid crop profile handling
- Docs: `docs/CALCULATOR_AI_BACKEND_ARCHITECTURE.md`, `docs/CALCULATOR_AI_POLICY_VERSIONING_PLAN.md`, and `docs/CALCULATOR_AI_AUDIT_AND_RATE_LIMIT_PLAN.md`

## M57 Calculator AI Backend Adapter Contract

- Adds disabled-by-default calculator AI adapter types and service contract
- Adds local fixture explanations from locked snapshots with `noRealAICall: true`
- Adds `/app/calculators/ai-adapter-status`
- Adds feature flags: `VITE_CALCULATOR_AI_MODE=local_fixture`, `VITE_ENABLE_CALCULATOR_AI_BACKEND=false`, and `VITE_ENABLE_CALCULATOR_AI_NETWORK=false`
- Vitest proves local fixture mode has no real AI call, disabled modes do not call a backend client, and `backend_test_ready` refuses client execution unless both explicit flags are true
- Docs: `docs/CALCULATOR_AI_BACKEND_ADAPTER_CONTRACT.md` and `docs/CALCULATOR_AI_STAGING_FLAGS_PLAN.md`

## M58 Calculator AI Adapter QA And Endpoint Planning

- Adds deterministic adapter QA fixtures for local fixture, disabled, network-disabled, blocked backend-test, invalid, oversized, sponsor, lock-hash mismatch, policy mismatch, and invalid-crop states
- Adds `/app/calculators/ai-endpoint-plan` for staging endpoint readiness, production blockers, backend-only prompt execution, lock-hash validation, policy checks, audit, rate limits, and abuse prevention
- Upgrades `/app/calculators/ai-adapter-status` and `/app/calculators/qa` with adapter state matrix, fixture-vs-disabled comparison, blocked reasons, no-network guarantee, and locked hash preservation
- Vitest proves disabled modes stay disabled, invalid and oversized requests are rejected, policy/hash mismatches block, sponsor insertion blocks, and no network path is active by default
- Docs: `docs/CALCULATOR_AI_STAGING_ENDPOINT_CHECKLIST.md` and `docs/CALCULATOR_AI_NETWORK_BOUNDARY_RULES.md`

## M59 Calculator AI Edge Function Contract Draft

- Adds typed `calculator-ai-explain` Edge Function request/response contract services
- Adds `/app/calculators/ai-edge-contract`
- Defines server-only provider key and service-role boundaries, lock-hash verification, policy checks, audit events, rate-limit hooks, timeout behavior, and failure modes
- Vitest proves the contract excludes frontend keys, does not call provider/network/Supabase, blocks lock-hash and policy mismatches, and keeps deterministic results immutable
- Docs: `docs/CALCULATOR_AI_EDGE_FUNCTION_CONTRACT.md` and `docs/CALCULATOR_AI_EDGE_FUNCTION_SECURITY_PLAN.md`

## M60 Calculator AI Edge Dry-run Plan

- Adds local dry-run readiness types and planner for the future `calculator-ai-explain` Edge Function
- Adds `/app/calculators/ai-edge-dry-run`
- Adds env placeholders: `VITE_CALCULATOR_AI_EDGE_URL`, `VITE_ENABLE_CALCULATOR_AI_EDGE_DRY_RUN`, and `VITE_ENABLE_CALCULATOR_AI_EDGE_NETWORK`
- Shows masked endpoint status, secret checklist, validation fixtures, audit/rate-limit dry-run preview, production blockers, and no-fetch proof
- Vitest proves default builds cannot call the endpoint, URL alone is not enough, network flag alone is not enough, dry-run+network still does not fetch in M60, secrets are not accepted in frontend config, and validation fixtures classify expected failures
- Docs: `docs/CALCULATOR_AI_EDGE_DRY_RUN_PLAN.md`, `docs/CALCULATOR_AI_EDGE_SECRET_CHECKLIST.md`, and `docs/CALCULATOR_AI_EDGE_DRY_RUN_VALIDATION_CASES.md`

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

## M49 Agriculture Calculator Core Foundation

- Adds typed agriculture calculator utilities in `src/services/agri-calculators`
- Adds `useAgriCalculators()` for local recent calculations, favorite calculators, and last inputs
- Adds `/app/calculators` plus spray mix, fertilizer, plant spacing, yield estimate, and cost estimate routes
- Links calculator access from Home, My Farm, Profile, QA, and Admin
- Uses Thai land unit rules: 1 ไร่ = 1,600 ตร.ม., 1 งาน = 400 ตร.ม., 1 ตารางวา = 4 ตร.ม.
- Keeps safety copy visible: preliminary calculation only, no guarantee, no agronomist replacement, read real labels before spray use
- Keeps calculators local-only: no backend writes, Supabase writes, AI calls, geolocation/map, cloud sync, payment, sponsor routing, or network calls

## M50 Agriculture Calculator QA Hardening

- Adds deterministic calculator fixtures and validation helpers in `src/services/agri-calculators`
- Adds `/app/calculators/qa` for expected vs actual, pass/warn/fail status, and calculator limitations
- Hardens empty, zero, negative, non-number, missing unit, high-value, unsafe concentration, area warning, and divide-by-zero handling
- Adds local-only copy/share result summaries with `สรุปผลคำนวณเบื้องต้น` and `ควรตรวจสอบฉลาก/ผู้เชี่ยวชาญก่อนใช้งานจริง`
- Adds clearer warning states, larger result cards, and `คำนวณใหม่` reset actions on calculator pages
- Keeps share/export foundation local-only: no files/PDFs, backend saves, Supabase writes, AI calls, sponsor routing, or network calls

## M51 Crop-specific Calculator Expansion Planning

- Adds crop profile fixtures for ข้าว, มันสำปะหลัง, อ้อย, ข้าวโพด, ทุเรียน, ลำไย, ยางพารา, and ผักผสม
- Adds crop selectors and `ใช้ตัวอย่างของพืชนี้` on fertilizer, plant spacing, yield estimate, and cost calculators
- Adds `/app/calculators/safety` for fertilizer/chemical, AI, sponsor, and recommendation boundaries
- Adds a static formal unit-test readiness plan for calculator services and crop profile loading
- Keeps crop examples as starter form values only: no exact crop fertilizer dose, pesticide/chemical recommendation, OCR, AI calls, sponsor routing, or backend writes

## M52 Formal Calculator Service Tests

- Adds Vitest and `npm run test` for pure calculator service tests
- Adds `src/services/agri-calculators/agri-calculator-service.test.ts` covering spray mix, Thai land conversion, plant spacing, fertilizer helper math, yield, cost, crop profile loading, and validation boundaries
- Adds `src/services/agri-calculators/agri-calculator-edge-fixtures.ts` for extreme concentration, tiny/huge land, invalid crop key, impossible spacing, unrealistic yield, negative cost, invalid units, and overflow-ish costs
- Updates `/app/calculators/qa` with formal coverage summary, edge-case examples, validation pass/warn/fail, and regression-safe notes
- Keeps formulas deterministic and keeps AI/recommendation layers separate from core calculator output

## Routes

- `/` - public landing and app preview
- `/app` - main mobile app home with compact M92.1 My Farm launcher and elder-friendly Thai action
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
- `/app/calculators` - agriculture calculator hub
- `/app/calculators/safety` - calculator safety and recommendation boundaries
- `/app/calculators/qa` - M50 agriculture calculator QA fixture checks
- `/app/calculators/saved-results` - local-only saved calculator result summaries
- `/app/calculators/export-preview` - text export template preview
- `/app/calculators/ai-explanation-preview` - local-only AI explanation boundary preview
- `/app/calculators/ai-architecture` - backend AI explanation architecture review
- `/app/calculators/ai-adapter-status` - disabled-by-default calculator AI adapter status
- `/app/calculators/ai-endpoint-plan` - calculator AI staging endpoint readiness checklist
- `/app/calculators/ai-edge-contract` - calculator AI Edge Function contract draft
- `/app/calculators/ai-edge-dry-run` - calculator AI Edge dry-run plan
- `/app/calculators/spray-mix` - spray/chemical mixing calculator
- `/app/calculators/plant-spacing` - plant spacing and seedling count calculator
- `/app/calculators/fertilizer` - fertilizer NPK helper foundation
- `/app/calculators/yield-estimate` - yield estimate foundation
- `/app/calculators/cost` - farm cost estimate foundation
- `/app/farm-area` - local farm area calculator and saved plot estimates
- `/app/farm-area-guide` - manual farm area measurement guide
- `/app/help` - M95-M97.1 farmer start guide with a 3-step basic Farm Records flow and plot/activity examples
- `/app/field-test-feedback` - M95-M97.1 static/local field-test checklist with basic-mode and first-use plot/activity questions, personal-data warning, and no backend submission
- `/app/farm-records` - M91/M92/M96/M97/M97.1/M98 local farm records, Basic Farm Records Mode, simplified Thai-first Add Plot/Add Activity/finance/harvest copy, JSON/CSV export, guarded JSON restore, restore risk review, disabled sync consent prototype, farm cost summary, cost-per-kg/yield metrics, break-even estimate, archive/close guardrails, recent timeline UI, and Home-first entry links
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
- `/app/profile` - Profile/settings page with language/help/support placeholders, Farm Records data-control links, cloud sync shown off, and collapsed internal tools
- `/app/account-preview` - future account backup and sync preview
- `/app/guest-sync-dry-run` - M64 local-only Guest Memory payload preview
- `/app/guest-sync-edge` - Guest Sync Edge Function staging contract and checklist
- `/app/guest-sync-status` - Guest Memory sync adapter and backend readiness status
- `/app/auth` - farmer-friendly account creation prototype
- `/app/auth/status` - Phone Auth boundary and mock session status
- `/app/auth/linking` - Phone + LINE account linking rules preview
- `/app/auth/phone` - phone OTP mock flow
- `/app/auth/phone-staging` - Supabase Auth phone OTP staging setup checklist
- `/app/auth/phone-staging-test` - M61 first Phone Auth staging test review and rollback checklist
- `/app/auth/line` - LINE Login local mock boundary
- `/app/auth/google` - Google Login mock explanation
- `/app/auth/sync-preview` - Guest Memory sync consent and dry-run payload preview
- `/app/memory` - guest memory dashboard
- `/app/my-farm` - My Farm local farmer workspace hub with a compact M97.1 basic Farm Records entry and M98 collapsed secondary details
- `/app/my-farm/settings` - My Farm local data status and future sync guidance with production-facing copy
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
VITE_CALCULATOR_AI_MODE=local_fixture
VITE_ENABLE_CALCULATOR_AI_BACKEND=false
VITE_ENABLE_CALCULATOR_AI_NETWORK=false
VITE_CALCULATOR_AI_EDGE_URL=
VITE_ENABLE_CALCULATOR_AI_EDGE_DRY_RUN=false
VITE_ENABLE_CALCULATOR_AI_EDGE_NETWORK=false
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
npm run test
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

## Agriculture Calculator Boundary

M49-M60 calculator features are local-only. Recent calculations, favorites, and last inputs stay in `kasethub.agriCalculators.v1`; saved result summaries stay in `kasethub.calculatorResultSummaries.v1`. Crop profiles are static planning fixtures. Local share summaries, AI explanation plans, backend AI architecture reviews, adapter QA fixtures, endpoint readiness plans, Edge Function contract previews, and Edge dry-run plans are generated on device and are not uploaded. The app does not write backend data, write Supabase data, call AI APIs, request geolocation, load maps, sync to cloud, take payments, route sponsor/affiliate offers, generate files/PDFs, or make network calls by default. Calculator results and crop examples are preliminary arithmetic/planning aids, not guarantees and not replacements for product labels, soil tests, agronomists, official surveys, or financial advice. Formal tests protect deterministic math, snapshot locks, adapter disabled states, no-network boundaries, Edge contract/dry-run boundaries, and AI boundaries from accidental drift before any future recommendation layer is introduced.

M61 Phone Auth staging planning is review-only. `/app/auth/phone-staging-test` shows the checklist for Supabase dashboard setup, redirect URLs, SMS provider readiness, test phone numbers, OTP cost/rate limits, ownership before Guest Memory sync, and rollback steps. The app still does not send OTP, trigger SMS, enable production auth, enable cloud sync, write Supabase data, deploy Edge Functions, add service-role keys, or commit real staging secrets.

## My Farm Hub Boundary

M34 My Farm aggregates existing local data only. It reads Guest Memory, `kasethub.farmArea.v1`, `kasethub.cropWatch.v1`, and weather fixtures, then displays a dashboard and timeline. It does not create real accounts, sync to cloud, call AI/weather/map APIs, upload images, write Supabase data, or add destructive data clearing.

## Farm Records And Ledger Boundary

M83 farm records and finance ledger data stay local under `kasethub.farmRecords.v1`. M84 reads and writes that same local state through farmer-facing forms for plots, crop cycles, activities, and finance entries. M85 adds local edit flows for activity and finance entries, recent timeline visibility, My Farm entry/status integration, and planning-only export/delete documentation. M86 adds local-device JSON backup preview/download, finance CSV preview/download, export warnings, farm plot archive UX, and crop-cycle close/cancel UX. M87 adds JSON backup parse/validate/preview/restore helpers, a strong local restore confirmation phrase, and a disabled sync consent gate checklist. M88 adds restore risk review, pre-restore local snapshot/download, a single latest restore snapshot key `kasethub.farmRecords.restoreSnapshot.v1`, and sync architecture/checklist documentation. M89 adds local-only sync consent prototype state under `kasethub.farmRecords.syncConsentPrototype.v1`; it is not legal consent and cannot enable cloud sync. M91 adds local `farmHarvestRecords` for harvested quantity/yield and cost-per-kg readiness while preserving the same Farm Records local storage key. Farm plots use coarse text location only; no GPS coordinates, map pins, precise location, geolocation request, or map API is added. Activity and receipt images are metadata placeholders only, not uploads or raw image/base64 storage, and `data:` image payloads are stripped from JSON backup, restore state, and pre-restore snapshots. Farm finance and harvest/yield entries can reveal income, costs, profit, production volume, and business behavior, so future cloud sync requires explicit opt-in consent, owner-only RLS, export/delete tools, audit/idempotency, retention policy, and a separate AI consent boundary before any AI analysis.

M90 adds local deterministic cost analytics, category breakdowns, My Farm cost summary fields, and break-even estimates derived only from local Farm Finance Ledger entries. These outputs are planning aids only, not official accounting, tax, loan, or legal advice, and they do not call AI, Supabase, cloud sync, GPS/geolocation, or receipt upload services.

M91 adds local harvest/yield modeling, demo harvest data, Harvest & Yield UI, cost-per-kg/profit-per-kg/yield-per-rai analytics, and export/restore/snapshot compatibility for the new slice. These outputs are still local estimates from user-entered records and are not official accounting, tax, loan, legal, yield guarantee, or financial advice.

M92 adds Home-first discovery for My Farm and Farm Records. M92.1 compacts the Home Farm Hub so it links only to My Farm from Home; detailed Farm Records summaries, cost/yield views, export/restore, and sync status remain inside `/app/my-farm` and `/app/farm-records`. M93 adds the dedicated My Farm bottom-nav slot. M94 makes `/app/profile` a calmer settings page with Farm Records export/restore/sync status links and cloud sync clearly marked off. M95 adds `/app/help`, a compact Home help entry, and a small My Farm helper card that links to Farm Records and the guide. M96 refines that helper and `/app/farm-records` around the first-use path. M97 polishes the first `เพิ่มแปลง` and `บันทึกงานในฟาร์ม` forms. M97.1 makes the default Farm Records screen `สมุดฟาร์มแบบง่าย` with three main actions: `เพิ่มแปลง`, `บันทึกรายรับ/รายจ่าย`, and `บันทึกผลผลิต`; advanced analytics, export/restore, sync planning, and detailed records sit lower under `ข้อมูลเพิ่มเติม / ขั้นสูง`. M98 keeps that journey calmer by collapsing secondary My Farm details and tightening Thai-first labels. It does not add backend calls, sync, GPS, AI processing, or Farm Records storage/schema changes.

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

## M63 Ownership/RLS Sync Gate

M63 adds `/app/ownership-rls-gate`, a review gate before any Guest Memory upload. It checks real Supabase Auth session evidence, rejects mock-only ownership, lists consent/idempotency/audit requirements, documents owner-scoped RLS expectations, and keeps `syncAllowed=false`.

M63 still does not upload Guest Memory, enable cloud sync, write Supabase app tables, deploy Edge Functions, add service-role keys to frontend, enable production auth, or execute SQL automatically.

## M64 Guest Memory Sync Dry-run Payload Builder

M64 adds `/app/guest-sync-dry-run`, a local-only payload preview before any Guest Memory upload. It groups saved items, farm records, recent AI questions, crop watches, calculator saved result summaries, followed topics, and likes.

The route and service preview consent, idempotency, audit events, conflicts, owner scope, blockers, and privacy filters. It excludes raw photos, base64 image blobs, OTP/session tokens, service-role keys, provider keys, and private env-like values. `uploadAllowed` remains false, and there are still no Supabase app-table writes or cloud sync.

## M65 Offline Agriculture Article Library

M65 adds an offline-first agriculture article library at `/app/articles/offline` with detail routes such as `/app/articles/offline/soil-types-before-planting`.

The library bundles Thai starter outlines for soil, water, fertilizer, rice, sugarcane, cassava, and farm finance. It includes planned local image paths, Thai alt text, safety notes, related calculator/app routes, and future CMS keys for Supabase compatibility.

M65 does not add CMS writes, Supabase writes, AI article generation, YouTube import, sponsor/affiliate injection, external image URLs, or network calls.

## M66 Offline Article Content QA And CMS Contract

M66 adds `/app/articles/offline-qa` plus local QA and CMS override services for the offline agriculture article library.

The QA layer checks article metadata, disclaimers, image plans, version fixtures, and CMS compatibility. CMS overrides are blocked if they remove required disclaimers, use external image URLs in offline mode, miss required freshness dates for finance/government/seasonal content, or fail the future CMS key/version checks.

M66 remains local-only: no Supabase writes, CMS writes, AI article generation, real image generation, external image loading, sponsor injection, or network calls.

## M67 Offline Article Full-content Readiness

M67 adds `/app/articles/full-content-readiness` as a local review route for future full offline agriculture articles.

It adds pilot full-content templates, source placeholders, review metadata placeholders, image requirements, expert escalation notes, and a publish gate that keeps all pilot articles blocked from `ready_for_full_publish`.

M67 does not add official full article bodies, Supabase writes, CMS writes, AI article generation, real image generation, external images, sponsor/affiliate injection, or hardcoded official finance/loan/government facts.

## M68 Offline Article Pilot Draft Workflow

M68 adds `/app/articles/pilot-draft-review` and richer local-only draft content for `soil-types-before-planting` (`ดิน 6 ชนิด รู้จักก่อนปลูก`).

The draft includes review/source placeholders, image needs, safety disclaimers, and publish blockers. It is still not a final official article, and no Supabase/CMS writes, AI article generation, external images, or sponsor/affiliate injection are added.

## M69 Pilot Article Editorial QA

M69 adds `/app/articles/editorial-review` for local-only editorial sign-off QA.

It defines pending reviewer sign-offs, source metadata placeholders, image review fixtures, final publish blockers, and a second low-risk `draft_template` pilot for `soil-ph-reading-yourself`. No article is marked final publish.

## M70 Editorial Evidence And Human Release Gate

M70 adds `/app/articles/editorial-evidence` for local-only evidence packet review.

It proves that even simulated-complete source, reviewer, and image metadata cannot publish an article automatically. A separate human release approval, reviewer, timestamp, and note remain required. No final article publish is enabled.

## M71 Offline Article Release Audit Readiness

M71 adds `/app/articles/release-audit` for local-only release audit review.

It shows blocked release attempts, reviewer change history, release diff previews, disclaimer/source/image change tracking, and automation bypass blocks. CMS override or automation alone still cannot publish an article. No final article publish, Supabase write, CMS write, AI generation, external image loading, or sponsor injection is enabled.

## M72 Offline Article CMS Persistence Contract

M72 adds `/app/articles/cms-persistence-plan` for local-only future CMS persistence planning.

It defines future article CMS tables, editor/reviewer/release roles, read/write contracts, release audit write requirements, offline fallback policy, and migration rollback checklist. Viewer cannot edit, automation cannot publish, admin cannot silently bypass the human release gate, and no database writes or migrations are run.

## M73 CMS Migration Dry-run Review Pack

M73 adds `/app/articles/cms-migration-review` for local-only CMS migration dry-run review.

It plans table DDL review, RLS expectations, rollback steps, seed fixtures, and publish safety gates for the future article CMS migration. Frontend CMS writes, public writes, automation final publish, and incomplete content publish remain blocked. No migrations, Supabase writes, CMS writes, image uploads, or production article publishing are enabled.

## M74 CMS SQL Draft Artifacts

M74 adds `/app/articles/cms-sql-drafts` plus planning-only SQL artifacts under `supabase/drafts/cms/`.

The draft files cover future article CMS schema, RLS policy planning, seed fixture planning, and rollback planning. They are marked `PLANNING ONLY`, `DO NOT RUN`, `DO NOT DEPLOY`, and `REVIEW REQUIRED`, are not in `supabase/migrations`, and are not executed by the app.

Frontend CMS writes and final article publish remain blocked. No SQL execution, migrations, Supabase writes, backend CMS writes, image uploads, AI article generation, sponsor injection, or production publishing are enabled.

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

M61 adds `/app/auth/phone-staging-test` for the first real Phone Auth staging test review. It keeps OTP/SMS/cloud sync off until staging flags, redirect URLs, SMS provider setup, test phone numbers, ownership/RLS, and rollback steps are explicitly checked.

M25 readiness features are audit/checklist only. `/app/supabase-readiness` must keep “ยังไม่ได้เชื่อมต่อ Supabase จริง”, “ห้ามใส่ service-role key ใน frontend”, and “ต้องทดสอบบน staging ก่อน production” visible. M26 adds `/app/supabase-connection` for anon-key/client-safe dry-run checks. M27 adds `/app/supabase-sql-checklist` for manual SQL/RLS execution planning. M28 adds `/app/auth/phone-staging` for Supabase Auth phone OTP staging setup planning. M29 adds `/app/guest-sync-edge` for the future `guest-memory-sync` Edge Function contract. M41 adds `/app/supabase-setup-guide` for local-only manual setup progress. M43 adds `/app/supabase-readonly-probe` for explicit-flag public table reads only. M44 adds pending public read/RLS review status surfaces before auth or sync. Network probing remains disabled by default through `VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=false`. The app must not connect to Supabase by default, run migrations automatically, deploy/call Edge Functions, add real ENV keys to the repo, enable auth, send phone OTP, enable cloud sync, write backend data, or upload files.

All videos, posts, crop prices, crop watches, price alerts, weather forecasts, weather alerts, farm area calculations, saved farm plot estimates, farm records, farm finance ledger entries, My Farm hub summaries, My Farm timeline items, notification center items, notification preferences, community moderation reports, hidden post records, moderator queue previews, admin dashboard summaries, admin tasks, admin risk previews, audit log previews, Supabase readiness scores, Supabase connection dry-run status, Supabase setup progress, Supabase SQL checklist output, phone OTP staging checklist output, Guest Sync Edge readiness output, staging checklist items, phase decision plans, articles, article bodies, content admin previews, YouTube import plans, offline cache previews, notifications, AI credit state, AI routing plans, AI proxy adapter status, AI mock proxy responses, local backend boundary responses, Guest Sync dry-run responses, phone auth mock sessions, LINE auth mock sessions, account-linking recommendations, local image previews, image compression previews, image preflight readiness scores, storage plans, image-analysis job previews, farm history, saved article state, saved video state, guest memory state, sync planning output, share state, auth screens, QA checks, SQL drafts, RLS drafts, and disease analysis outputs are demo/sample or planning data. The app does not connect to YouTube Data API, AI providers, real auth, Supabase writes or storage, Supabase Edge Functions, real SMS OTP, LINE Login, LINE Messaging API, Google Login, Facebook SDK, analytics backend, real ads, payment, PWA service worker, Cache API, production CMS, real price APIs, real weather APIs, real GPS, map APIs, geolocation, official land survey services, push notifications, LINE Messaging API delivery, moderation APIs, AI moderation providers, real admin auth, upload services, or marketplace services in M41.
## M77 Weather UX Polish

Weather remains offline-safe by default. M77 adds source attribution, manual refresh with cooldown, local-only coarse-location preference storage, stale cache messaging, `/app/weather/preferences`, and expanded `/app/weather/qa`.

Open-Meteo is still disabled unless explicit local flags enable it. No GPS, precise personal location storage, Supabase writes, or cloud sync were added.
## M81 Real AI Text Proxy Controlled Staging

- Adds `/app/ai-text-status` for a staging-only text proxy boundary.
- Keeps default behavior local fixture/no network.
- Blocks prescriptions, sponsor/product injection, diagnosis, guarantees, and unrestricted chat.
- Keeps provider keys and service-role keys out of frontend config.
- Adds audit and rate-limit previews without Supabase writes.

## M82 AI Text Endpoint Contract Dry-run

- Adds `/app/ai-text-endpoint-plan` for a backend-owned `ai-text-proxy` endpoint contract.
- Adds endpoint env placeholders with empty/false defaults.
- Adds planning-only draft artifacts under `supabase/drafts/ai-text-proxy/`.
- Keeps provider calls blocked, provider keys backend-only, service-role keys out of frontend, and calculator outputs immutable.
- No endpoint is deployed and no Supabase write occurs.

## M83 Farm Records + Farm Finance Ledger Foundation

- Adds typed farm plot, crop cycle, activity record, image metadata placeholder, finance entry, and computed ledger summary models in `src/services/farm-records`.
- Adds config-first activity types, crop cycle statuses, finance categories, labels, and allowed units.
- Adds versioned local-first storage under `kasethub.farmRecords.v1` with demo seed data and malformed-record normalization.
- Adds `/app/farm-records` and Admin/QA visibility for plot count, active cycle count, activity count, finance entry count, total income, total expense, and net profit.
- Adds `docs/privacy/FARM_RECORDS_PRIVACY_BOUNDARY_M83.md`.
- Keeps M83 foundation-only: no Supabase writes, no cloud sync, no precise GPS/location, no AI processing of records, no receipt upload, no PDF/CSV export, and no final PDPA legal copy.

## M84 Farm Records Farmer-Facing UI

- Upgrades `/app/farm-records` from debug preview into a farmer-facing local Farm Records / สมุดบันทึกฟาร์ม page.
- Adds summary cards, filters, plot list, crop cycle list, activity records, finance ledger entries, and computed ledger summary.
- Adds lightweight local create flows for farm plots, crop cycles, activity records, and finance entries, plus delete confirmations for activity and finance entries.
- Adds route/model tests for rendering, filtering, empty local data, invalid finance amounts, and service delete behavior.
- Keeps M84 local-only: no Supabase schema/write, no cloud sync, no GPS/geolocation/map pin, no AI reading of records, no receipt upload, no PDF/CSV export, and no final PDPA legal copy.

## M85 Farm Records Edit + My Farm Integration

- Adds safe local edit flows for farm activity records and finance ledger entries through the existing `kasethub.farmRecords.v1` service layer.
- Adds a Recent Farm Timeline that combines recent activity, income, and expense records.
- Adds My Farm entry/status integration with active cycle count, latest local activity/finance dates, and net profit.
- Adds `docs/privacy/FARM_RECORDS_EXPORT_DELETE_PLAN_M85.md` as planning only.
- Keeps M85 local-only: no Supabase schema/write, no cloud sync, no GPS/geolocation/map pin, no AI reading of records, no receipt upload, no actual PDF/CSV export, no bulk delete, and no final PDPA legal copy.

## M86 Farm Records Export/Delete Readiness

- Adds `src/services/farm-records/farm-records-export-service.ts` for local JSON backup, finance CSV, and export preview helpers.
- Adds `/app/farm-records#farm-records-export` UI for previewing/downloading JSON backup and finance CSV from this device.
- Strips raw `data:` image payloads from JSON backup output and exports image metadata only.
- Adds farm plot archive and crop-cycle harvested/cancelled guardrails instead of hard delete.
- Adds `docs/privacy/FARM_RECORDS_DATA_CONTROL_M86.md` and updates the M85 export/delete plan with implementation status.
- Keeps M86 local-only: no Supabase schema/write, no cloud sync, no cloud delete, no GPS/geolocation/map pin, no AI reading of records, no receipt upload, no bulk delete, no OCR, and no legal-final PDPA copy.

## M87 Farm Records Backup Restore + Sync Consent Gate

- Adds `src/services/farm-records/farm-records-restore-service.ts` for JSON backup parsing, validation, restore preview, and confirmed local restore.
- Adds `src/services/farm-records/farm-records-sync-consent-gate.ts` as a disabled/future checklist for cloud sync readiness.
- Adds `/app/farm-records#farm-records-restore` and `/app/farm-records#farm-records-sync` UI for restore preview/confirmation and local-only sync status.
- Adds My Farm backup/restore entry visibility and `docs/privacy/FARM_RECORDS_RESTORE_SYNC_CONSENT_M87.md`.
- Keeps M87 local-only: no Supabase schema/write/read, no sync queue, no cloud backup/delete, no GPS/geolocation/map pin, no AI reading of records, no receipt upload, no OCR, no notifications, and no legal-final PDPA copy.

## M88 Farm Records Restore Recovery + Sync Architecture Review

- Adds `src/services/farm-records/farm-records-restore-recovery-service.ts` for pre-restore local snapshots and restore risk review.
- Adds Restore Risk Review and Restore recovery guidance to `/app/farm-records#farm-records-restore`.
- Adds a current local backup/snapshot download action before restore and stores only one latest local pre-restore snapshot under `kasethub.farmRecords.restoreSnapshot.v1`.
- Updates the disabled Cloud Sync Readiness UI with clear ready/not-implemented checklist statuses.
- Adds `docs/sync/FARM_RECORDS_SYNC_ARCHITECTURE_REVIEW_M88.md` and `docs/sync/FARM_RECORDS_SYNC_READINESS_CHECKLIST_M88.md`.
- Keeps M88 local-only: no Supabase schema/read/write, no sync queue, no cloud sync, no cloud delete, no server-side restore, no GPS/geolocation/map pin, no AI reading of records, no receipt upload, no OCR, and no legal-final PDPA copy.

## M89 Farm Records Sync Consent UX Prototype

- Adds `src/services/farm-records/farm-records-sync-consent-prototype.ts` for local prototype-only consent preview state.
- Adds a Cloud Sync Consent Prototype to `/app/farm-records#farm-records-sync` with included/excluded data lists and separate consent categories for cloud sync, AI, GPS, and image/receipt upload.
- Keeps Enable Cloud Sync disabled and clearly explains that Supabase RLS, ownership tests, cloud export/delete, and privacy review are still required.
- Adds `docs/sync/FARM_RECORDS_OWNER_RLS_TEST_PLAN_M89.md` and `docs/sync/FARM_RECORDS_SYNC_CONSENT_UX_M89.md`.
- Keeps M89 local-only: no Supabase schema/read/write, no sync queue, no cloud sync, no cloud delete, no GPS/geolocation/map pin, no AI reading of records, no receipt upload, no OCR, and no legal-final PDPA copy.

## M90 Farm Cost Summary + Break-even Dashboard

- Adds `src/services/farm-records/farm-cost-analytics-service.ts` for local cost dashboard totals, profit/loss status, per-rai metrics, category breakdowns, top categories, break-even estimates, and deterministic local insights.
- Adds `/app/farm-records#farm-cost-dashboard` with total income, total expense, net profit/loss, cost per rai, profit per rai, top expense category, category rows, and a lightweight break-even calculator.
- Updates My Farm with local cost summary visibility for net profit, cost per rai, and top expense category.
- Adds `docs/farm-records/FARM_COST_DASHBOARD_M90.md`.
- Keeps M90 local-only: no Supabase schema/read/write, no sync queue, no cloud sync, no cloud backup/delete, no AI processing, no GPS/geolocation/map pin, no receipt upload, no OCR, no notifications, no bank/loan integration, and no official accounting/tax/legal claims.

## M91 Farm Records Harvest Yield + Cost-per-Kg Readiness

- Adds a local `farmHarvestRecords` slice for harvested quantity, unit, normalized kg, grade, buyer, optional sale price, and local notes.
- Adds local harvest CRUD helpers, demo harvest data, migration-safe defaults for old state, and JSON export/restore/pre-restore snapshot compatibility.
- Adds Harvest & Yield UI on `/app/farm-records#farm-harvest-yield` with total harvest kg, yield per rai, cost per kg, income per kg, profit per kg, latest harvest date, and local-only warnings.
- Updates the Farm Cost Dashboard and My Farm card with recorded harvest metrics where available.
- Keeps M91 local-only: no Supabase schema/read/write, no sync queue, no cloud sync, no cloud backup/delete, no AI processing, no GPS/geolocation/map pin, no receipt upload, no OCR, no notifications, no bank/loan integration, and no official accounting/tax/legal/yield guarantee claims.

## M92 Home First Farm Hub + Elder-Friendly Navigation

- Adds a compact Home Farm Hub card on `/app` so My Farm is visible without opening Profile or developer-heavy route lists.
- M92.1 removes Home Farm Records metrics and keeps detailed profit/cost/harvest summaries inside `/app/my-farm` and `/app/farm-records`.
- Keeps one elder-friendly Thai primary action: `เปิดฟาร์มของฉัน`.
- Adds `docs/ux/HOME_FIRST_NAVIGATION_M92.md` with the profile/menu simplification plan and future bottom navigation proposal.
- Keeps M92 navigation-only: no Supabase schema/read/write, no sync queue, no cloud sync, no GPS/geolocation, no AI record processing, no receipt upload, and no route removal.

## M93 Elder-Friendly Navigation Cleanup

- Adds a dedicated bottom-nav slot for `ฟาร์มของฉัน` and renames calculator access to `เครื่องมือ`.
- Refactors Profile from a long flat route list into grouped cards: `บัญชีของฉัน`, `ข้อมูลและความเป็นส่วนตัว`, `ช่วยเหลือ`, and `สำหรับทีมงานหรือทดสอบ`.
- Keeps Admin, QA, readiness, Supabase staging, and other internal tools accessible under the Advanced group instead of mixing them into the main farmer-facing menu.
- Keeps the compact M92.1 Home Farm Hub unchanged and preserves `/app/my-farm`, `/app/farm-records`, and all existing deep links.
- Adds `docs/ux/ELDER_FRIENDLY_NAVIGATION_CLEANUP_M93.md`.
- Keeps M93 navigation-only: no Supabase read/write, no sync queue, no cloud sync, no GPS/geolocation, no AI Farm Records processing, no receipt upload, no OCR, and no route removal.

## M94 Elder-Friendly Settings Polish

- Polishes `/app/profile` into `โปรไฟล์และการตั้งค่า` with simpler top copy and local-only safety status.
- Adds placeholders for `ภาษา`, `วิธีใช้แอพ`, and `ติดต่อทีมงาน`; M95 later links `วิธีใช้แอพ` to `/app/help`.
- Clarifies Farm Records data control with links to `/app/farm-records#farm-records-export`, `/app/farm-records#farm-records-restore`, and `/app/farm-records#farm-records-sync`.
- Shows `การซิงก์ข้อมูล` as `ปิดอยู่` with copy that data remains on this device.
- Collapses `สำหรับทีมงานหรือทดสอบ` by default while preserving Admin, QA, readiness, Supabase staging, AI proxy, content admin, moderation, and Guest Sync planning links.
- Adds `docs/ux/ELDER_FRIENDLY_SETTINGS_POLISH_M94.md`.
- Keeps M94 UX/settings-only: no route removal, no Farm Records storage change, no Supabase read/write, no sync queue, no cloud sync, no GPS/geolocation, no AI Farm Records processing, no receipt upload, no OCR, no real support chat, and no language-switch implementation.

## M95 Farmer Help Start Guide + Field-Test Feedback

- Adds `/app/help` with the title `วิธีเริ่มใช้ KasetHub` and short Thai cards for My Farm, farm activity, income/expense, cost/profit/harvest, tools, AI, and weather.
- Updates Profile `วิธีใช้แอพ` to link to `/app/help` while language and contact remain placeholders.
- Adds a compact `เริ่มใช้แอพ` Home card and a compact My Farm helper that M96 later refines into `เริ่มใช้ฟาร์มของฉัน`.
- Adds `/app/field-test-feedback` as a static/local checklist for observing real farmers or elderly users. It warns not to enter names, phone numbers, addresses, or personal details and has no backend submission.
- Adds `docs/ux/FARMER_START_GUIDE_AND_FIELD_TEST_M95.md`.
- Keeps M95 UX/help/testing-only: no backend feedback submission, no localStorage feedback key, no Supabase read/write, no cloud sync, no GPS/geolocation, no AI Farm Records processing, no receipt upload, no OCR, no notifications, no support chat, and no Farm Records storage/schema change.

## M96 First-Use Farm Records Flow Simplification

- Updates `/app/my-farm` with `เริ่มใช้ฟาร์มของฉัน` and the 4-step path: `เพิ่มแปลง`, `บันทึกงานในฟาร์ม`, `บันทึกรายรับรายจ่าย`, `บันทึกผลผลิต`.
- Adds the same compact first-use path to `/app/farm-records` and makes the main action order start with `เพิ่มแปลง`.
- Improves empty states for no plots, no farm work, no income/expense, and no harvest records with direct Thai copy and simple buttons.
- Simplifies create-form copy for plot, activity, finance, crop cycle, and harvest fields with Thai-first labels, required markers, and `ถ้ามี` on optional fields.
- Updates `/app/help` with `เริ่มบันทึกฟาร์ม 4 ขั้นตอน` and adds first-use observation questions to `/app/field-test-feedback`.
- Adds `docs/ux/FIRST_USE_FARM_RECORDS_FLOW_M96.md`.
- Keeps M96 UX/copy/flow-only: no Farm Records storage/schema change, no Supabase read/write, no sync queue, no cloud sync, no GPS/geolocation, no AI Farm Records processing, no receipt upload, no OCR, no notifications, and no personal-data collection.

## M97 First Add Plot + Add Activity Flow Polish

- Simplifies the Add Plot form with `ตั้งชื่อแปลงก่อน`, `พื้นที่กี่ไร่ (ถ้ามี)`, optional coarse location fields, `ไม่ต้องกรอกที่อยู่ละเอียดก็ได้`, and `ระบบยังไม่ใช้ GPS`.
- Renames the Add Activity form surface to `บันทึกงานในฟาร์ม`, moves required fields first, uses `หัวข้อสั้น ๆ`, and keeps optional input, unit, tag, and crop-cycle fields lower in the form.
- Updates activity type labels to farmer-friendly Thai: `พ่นยา`, `จ้างแรงงาน`, `ใช้เครื่องจักร`, `โรค/แมลง`, and `สภาพอากาศ`.
- Updates `/app/help` with plot/activity examples and `/app/field-test-feedback` with first Add Plot/Add Activity observation questions.
- Adds `docs/ux/FIRST_ADD_PLOT_ACTIVITY_FLOW_M97.md`.
- Keeps M97 UX/copy/form-flow-only: no Farm Records storage/schema change, no Supabase read/write, no sync queue, no cloud sync, no GPS/geolocation, no AI Farm Records processing, no receipt upload, no OCR, no notifications, and no route removal.

## M97.1 Basic Farm Records Mode

- Updates `/app/farm-records` to start with `สมุดฟาร์มแบบง่าย` and three dominant actions: `เพิ่มแปลง`, `บันทึกรายรับ/รายจ่าย`, and `บันทึกผลผลิต`.
- Keeps `บันทึกงานในฟาร์ม` available as secondary copy: `จดงานในฟาร์มเพิ่มเติม`.
- Introduces `ข้อมูลเพิ่มเติม / ขั้นสูง` before metrics, filters, crop cycles, detailed lists, analytics, export/restore, restore recovery, and sync consent prototype content.
- Simplifies `/app/my-farm` top area around `เปิดสมุดฟาร์ม`, `บันทึกรายรับ/รายจ่าย`, and `บันทึกผลผลิต`, with only `กำไร/ขาดทุน` and `ผลผลิตรวม` shown near the top.
- Updates `/app/help` to a 3-step basic flow and `/app/field-test-feedback` with basic-mode observation questions.
- Adds `docs/ux/BASIC_FARM_RECORDS_MODE_M97_1.md`.
- Keeps M97.1 UX/presentation-only: no feature removal, no route removal, no Farm Records storage/schema change, no localStorage key rename, no Supabase read/write, no sync queue/cloud sync, no GPS/geolocation, no AI Farm Records processing, no receipt upload, no OCR, and no notifications.

## M98 Mobile Preview Triage + Farmer Basic Flow QA

- Keeps Home compact and leaves the main Farm Records flow focused on `เพิ่มแปลง`, `บันทึกรายรับ/รายจ่าย`, and `บันทึกผลผลิต`.
- Moves the heavier My Farm counts, cost details, export/restore/sync status, and Farm Cost Dashboard link behind a collapsed `ข้อมูลฟาร์มเพิ่มเติม` disclosure so the first mobile screen stays calmer.
- Tightens Farm Records form/list copy to Thai-first labels for activity types, finance directions, unit labels, crop-cycle status, and plot badges.
- Adds break-word protection to Farm Records summary values so long numbers/units are less likely to overflow on mobile.
- Cleans local seeded Farm Records display copy so normal screens do not show `DEMO`/test-style labels.
- Adds `docs/ux/MOBILE_PREVIEW_TRIAGE_M98.md`.
- Keeps M98 QA/polish-only: no new feature systems, no route removal, no Farm Records storage/schema change, no Supabase read/write, no sync queue/cloud sync, no GPS/geolocation, no AI Farm Records processing, no receipt upload/OCR, and no notifications.

## M98.1 Calculator Mobile UX + Crop Selection + Fertigation Tool Rework

- Makes calculator crop selectors visibly tappable with `พืชที่เลือก`, `แตะเพื่อเปลี่ยนชนิดพืช`, highlighted select styling, and a chevron affordance.
- Changes the planting-distance default away from rice to `ข้าวโพด` and adds crop profiles/options for `ยูคาลิปตัส / ยูคา`, `พริก`, and `ปาล์มน้ำมัน` alongside corn, sugarcane, cassava, and rubber.
- Reworks calculator mobile layouts so area/unit rows and N/P/K inputs stack on narrow screens and avoid fixed-width overflow.
- Promotes `คำนวณปุ๋ย/การให้ปุ๋ย` as a more useful fertilizer/fertigation planning scaffold with crop stage and application method fields, including `ผ่านน้ำหยด`.
- Deprioritizes the old chemical mix surface by renaming it to `คำนวณตามฉลากยา/สาร` and keeping it limited to user-entered label arithmetic only.
- Adds `docs/ux/CALCULATOR_MOBILE_UX_M98_1.md`.
- Keeps M98.1 calculator UX/polish-only: no backend writes, no Supabase read/write, no cloud sync, no GPS/geolocation, no AI execution, no official agronomy recommendation, and no dangerous pesticide dosage advice.

## M99 Release Preview QA / Main Branch Smoke Pass

- Confirms `main` and `origin/main` point to merge commit `45793c7 Merge branch 'staging/supabase'`.
- Runs release-preview checks on merged main: `npm run lint`, `npm run build`, `npm run test`, and `git diff --check`.
- Verifies HTTP 200 locally for key farmer-facing routes plus sampled registered internal/status routes.
- Adds `docs/release/MAIN_BRANCH_RELEASE_PREVIEW_M99.md`.
- Keeps M99 QA/release-readiness-only: no new feature systems, no route removal, no Farm Records storage/schema change, no Supabase read/write, no sync queue/cloud sync, no GPS/geolocation, no AI Farm Records processing, no receipt upload/OCR, and no notifications.
