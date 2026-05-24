# Supabase Type Mapping

M18 maps the TypeScript models already used by KasetHub into the first Supabase SQL draft. This is planning documentation only. The app still uses Guest Memory, local AI credits, local auth mock state, and mock proxy fixtures.

## Guest Memory

`GuestMemoryState` maps into cloud tables after a future authenticated sync:

- `savedItems` -> `saved_items`
- `likes` -> `likes`
- `followedTopics` -> `followed_topics`
- `farmRecords` -> `farm_records`
- `recentAIQuestions` -> `recent_ai_questions`

Merge keys:

- Saved items: `user_id + item_type + item_id`
- Likes: `user_id + item_type + item_id`
- Followed topics: `user_id + topic_type + topic_key`
- Farm records: keep both unless the same `local_id` is already synced
- Recent AI questions: sync only when user gives consent

## Auth and Profiles

Phone-first auth maps into:

- `profiles`
- `auth_link_events`
- `guest_sync_events`

The M17 phone mock session is not a real Supabase user. In production, a verified Supabase Auth user owns the `profiles.id` row and any synced Guest Memory records.

M19 LINE mock sessions map conceptually into:

- `profiles.line_user_id`
- `profiles.auth_providers`
- `auth_link_events`

LINE is a secondary provider. Phone remains the recommended recovery path, and future provider linking should ask for confirmation before merging accounts.

## AI Credits

Local M08 AI credit state maps into:

- `ai_credit_balances`
- `ai_credit_transactions`
- `rewarded_ad_events`
- `ai_question_logs`
- `recent_ai_questions`

Credit balances should not be trusted from the browser in production. A backend or Edge Function should validate credits, write transactions, and log AI requests.

## Plant Image Analysis

M10-M12 models map into:

- `plant_media`
- `plant_analysis_jobs`
- `plant_analysis_results`
- `farm_records`
- `saved_items`

Raw images should live in private Supabase Storage buckets, not Guest Memory/localStorage. The database stores metadata, job lifecycle, result summaries, and links to My Farm.

## Community

Mock community posts map into:

- `community_posts`
- `community_comments`
- `likes`
- `saved_items`
- `community_reports` future
- `hidden_content` future
- `moderation_actions` future
- `moderator_queue` future
- `community_rules` future

Public reads should only show visible/moderated content. Authenticated users can create and update their own posts/comments.

M23 local moderation models map conceptually into:

- `CommunityRule` -> `community_rules`
- `CommunityReportReason` -> `community_reports.reason` and `moderator_queue.reason`
- `CommunityReport` -> `community_reports`
- `ModerationStatus` -> `community_reports.status`, `moderator_queue.status`, and post/comment `moderation_status`
- `ModerationAction` -> `moderation_actions.action` and `moderator_queue.recommended_action`
- `HiddenContentRecord` -> `hidden_content`
- `CommunitySafetyNotice` -> `community_rules` or future safety content config
- `ModeratorQueueItem` -> `moderator_queue`

M23 state stays in `kasethub.communityModeration.v1` only. Production reports, hidden content, and moderator actions must be backend-owned, rate limited, audited, and protected by RLS. Personal hidden content should remain private to the user, while global moderation actions require moderator/admin roles.

## Content and YouTube

Article and YouTube models map into:

- `articles`
- `videos`
- `saved_items`
- `share_events`

Future YouTube imports should write through a backend job, not the browser.

M24 admin content review maps conceptually into:

- content counts -> `content_review_tasks`
- video import readiness -> `content_review_tasks` and `admin_audit_logs`
- future publish approval -> `admin_audit_logs` plus article/video status changes

The M24 dashboard is read-only and does not create review tasks.

## Crop Prices

M21 crop price source models map into:

- `crop_price_sources`
- `crop_price_snapshots`
- `crop_price_import_jobs` future
- `community_price_reports` future
- `crop_price_watches`
- `crop_price_alert_preferences` future
- `followed_topics`
- `saved_items`
- `notifications`

Type mapping:

- `CropPriceSource` -> `crop_price_sources`
- `CropPriceSnapshot` -> `crop_price_snapshots` plus import metadata
- `CropPriceItem` -> latest or historical `crop_price_snapshots` rows
- `CropPriceMarket` -> snapshot market fields now, possible normalized market table later
- `CropPriceRegion` -> snapshot region/province fields now, possible geography table later
- `CropPriceUnit` -> snapshot unit fields
- `CropPriceQualityGrade` -> snapshot quality grade fields
- `CropPriceReliabilityLevel` -> `reliability_level`
- `CropPriceSourceStatus` -> source `status` and snapshot publication rules
- `CropWatch` -> `crop_price_watches`
- `CropWatchAlertPreference` -> `crop_price_alert_preferences`
- `CropWatchAlertType` -> `alert_type`
- Guest Memory followed crop topics -> `followed_topics`
- Guest Memory saved price references -> `saved_items` with `item_type = crop_price`

Snapshots are public read only after source validation. Watches and alert preferences are private to the user. Community reports remain private or clearly unverified until moderation. Real alert evaluation should be backend-owned and should never trust client-only preferences for delivery without auth, consent, and freshness checks.

## Weather

M32 weather models map conceptually into:

- `weather_locations`
- `weather_forecast_snapshots`
- `weather_alert_preferences`
- `weather_alert_events`
- `notifications`

Type mapping:

- `WeatherLocation` -> `weather_locations`
- `WeatherSource` -> source metadata on `weather_forecast_snapshots` or a future normalized source registry
- `WeatherForecastDay` -> daily rows or JSON detail in `weather_forecast_snapshots`
- `WeatherForecastHour` -> hourly rows in `weather_forecast_snapshots`
- `AgricultureWeatherRisk` -> `risk_labels`
- `CropWorkRecommendation` -> derived recommendation output, not trusted source data
- `WeatherAlertMock` -> future `weather_alert_events`
- `WeatherReliabilityLevel` -> future source/reliability metadata

M32 state is fixture-only and does not store raw weather data in localStorage. Production forecast snapshots should be imported/cached by backend jobs, public only after source/freshness rules pass, and cited by source label/timestamp. Weather alert preferences and events are private to the authenticated user and must be backend-owned for delivery.

## Farm Area

M33 farm area models map conceptually into:

- `farm_plots`
- `farm_plot_measurements`
- `farm_plot_boundaries`
- `farm_plot_notes`

Type mapping:

- `FarmPlotRecord` -> `farm_plots` plus latest measurement summary fields
- `FarmAreaCalculationInput` -> `farm_plot_measurements.input_dimensions`
- `FarmAreaCalculationResult` -> `farm_plot_measurements` area fields and formula/disclaimer fields
- `FarmAreaShape` -> `farm_plot_measurements.shape`
- `FarmAreaMeasurementMethod` -> `measurement_method`
- `FarmAreaAccuracyLevel` -> `accuracy_level`
- Future GPS/map polygon data -> `farm_plot_boundaries`
- Future My Farm planning notes -> `farm_plot_notes`

M33 state is localStorage-only under `kasethub.farmArea.v1`. Production persistence requires real auth, owner-scoped RLS, private boundary defaults, deletion controls, and clear copy that estimates are not official land surveys. Precise GPS/map geometry should never be public-read by default.

## Agriculture Calculators

M49 calculator models map conceptually into:

- `calculator_history`
- `fertilizer_profiles`
- `planting_profiles`
- `farm_cost_records`
- `crop_calculator_profiles`
- `calculator_safety_notes`
- `calculator_result_reviews`
- `crop_rule_versions`
- `calculator_saved_results`
- `calculator_share_events`
- `calculator_rewarded_ad_unlocks`
- `calculator_export_events`
- `calculator_share_templates`
- `calculator_usage_stats`
- `calculator_ai_audit_logs`
- `calculator_ai_policy_versions`
- `calculator_ai_rate_limits`
- `calculator_ai_explanations`
- `calculator_ai_safety_events`
- `calculator_ai_request_logs`
- `calculator_ai_policy_checks`
- `calculator_ai_snapshot_locks`
- `calculator_ai_backend_events`
- `calculator_ai_edge_invocations`
- `calculator_ai_provider_attempts`
- `calculator_ai_dry_run_events`
- `calculator_ai_validation_failures`
- `calculator_ai_endpoint_health_checks`

Type mapping:

- `CalculatorCategory` -> `calculator_history.calculator_category`
- `CalculatorHistoryRecord` -> `calculator_history`
- `SprayMixInput` / `SprayMixResult` -> `calculator_history.input_payload/result_payload` with category `spray_mix`
- `FertilizerMixInput` / `FertilizerMixResult` -> `calculator_history` and future `fertilizer_profiles`
- `PlantSpacingInput` / `PlantSpacingResult` -> `calculator_history` and future `planting_profiles`
- `YieldEstimateInput` / `YieldEstimateResult` -> `calculator_history` until a future harvest record table exists
- `CostEstimateInput` / `CostEstimateResult` -> `farm_cost_records` plus optional `calculator_history`
- `CropCalculatorProfile` -> future `crop_calculator_profiles`
- `CropCalculatorKey` -> `crop_calculator_profiles.crop_key` and future `crop_rule_versions.crop_key`
- `CalculatorSafetyBoundarySection` -> future `calculator_safety_notes`
- `CalculatorResultSummary` -> future `calculator_saved_results`
- `CalculatorResultShareMetadata` -> future `calculator_share_events.share_channel/share_status` payload metadata
- `CalculatorExportTemplate` -> future `calculator_share_templates` for approved short/long text format versions
- `CalculatorExportTemplateVersion` -> `calculator_share_templates.template_type`
- copy/share/export fallback result -> future `calculator_export_events.export_status`
- future reviewed crop rule metadata -> `crop_rule_versions`
- future expert review or dispute workflow -> `calculator_result_reviews`
- future rewarded calculator convenience unlock -> `calculator_rewarded_ad_unlocks`
- aggregate calculator usage counts -> future `calculator_usage_stats`
- `CalculatorAIExecutionRequest` -> future backend request payload, not a frontend-write table
- `CalculatorAIExecutionSnapshot` -> `calculator_ai_audit_logs.snapshot_id/snapshot_lock_hash` and `calculator_ai_explanations.snapshot_id`
- `CalculatorAIPolicyVersion` -> `calculator_ai_policy_versions`
- `CalculatorAISafetyDecision` -> `calculator_ai_audit_logs.safety_decision/risk_level` and `calculator_ai_safety_events`
- `CalculatorAIRateLimitPlan` -> `calculator_ai_rate_limits`
- `CalculatorAIAuditLogPlan` -> `calculator_ai_audit_logs`
- `CalculatorAIEscalationRule` -> `calculator_ai_policy_versions.escalation_trigger_ids` plus `calculator_ai_safety_events.reason_codes`
- `CalculatorAIAdapterRequest` -> future `calculator_ai_request_logs` request envelope metadata, not a frontend-write table
- `CalculatorAIAdapterResponse` -> future `calculator_ai_backend_events` status/error metadata and `calculator_ai_explanations` only after backend safety filtering
- `CalculatorAIAdapterModeStatus` -> future `calculator_ai_backend_events.adapter_mode/backend_enabled/network_enabled`
- `CalculatorAIAdapterQAFixture` -> local QA fixture only; no production table unless converted into reviewed backend test cases
- `CalculatorAIEndpointPlan` -> planning-only service; future checklist evidence may inform `calculator_ai_policy_checks` and backend readiness docs
- locked result hash verification -> `calculator_ai_snapshot_locks.snapshot_lock_hash` plus `calculator_ai_policy_checks.check_status`
- `CalculatorAIEdgeRequest` -> future `calculator_ai_edge_invocations` request envelope metadata after deployment
- `CalculatorAIEdgeResponse` -> future `calculator_ai_edge_invocations.edge_status`, `calculator_ai_backend_events`, and `calculator_ai_explanations` after safety filtering
- `CalculatorAIEdgePolicyCheck` -> future `calculator_ai_policy_checks`
- `CalculatorAIEdgeAuditEvent` -> future `calculator_ai_audit_logs` and `calculator_ai_backend_events`
- `CalculatorAIEdgeRateLimitCheck` -> future `calculator_ai_rate_limits`
- `CalculatorAIEdgeTimeoutPlan` / `CalculatorAIEdgeFailureMode` -> future `calculator_ai_backend_events` and `calculator_ai_provider_attempts`
- `CalculatorAIEdgeDryRunPlan` -> future `calculator_ai_dry_run_events` only after staging review
- `CalculatorAIEdgeDryRunValidationCase` -> future `calculator_ai_validation_failures`
- `CalculatorAIEdgeDryRunAuditPreview` -> planning-only preview for future `calculator_ai_audit_logs`
- `CalculatorAIEdgeDryRunRateLimitPreview` -> planning-only preview for future `calculator_ai_rate_limits`
- endpoint URL status/health check -> future `calculator_ai_endpoint_health_checks`

M49-M60 state is localStorage-only under `kasethub.agriCalculators.v1` and `kasethub.calculatorResultSummaries.v1` plus static crop calculator fixtures, local AI architecture review fixtures, local adapter QA fixtures, endpoint planning services, Edge Function contract previews, and Edge dry-run plans. It stores recent calculations, favorite calculators, last inputs, and saved result summaries only on the current device. Production sync must require real auth, explicit consent, owner-scoped RLS, and clear disclaimers because calculator data can expose chemical use, fertilizer planning, plant density, yield expectations, and farm costs.

Future AI recommendations should not overwrite deterministic calculator output. Future crop rules must cite approved `crop_rule_versions`. Future calculator AI explanations must lock snapshots, select policy versions, reject blocked requests before provider calls, validate endpoint/network boundaries, keep provider/service-role keys server-only, and log safety decisions without storing secrets or hidden sponsor payloads. Future rewarded ads should unlock convenience or advanced modes only and must not block basic calculations, text export, or safety copy. Future sponsor or affiliate integrations must be labeled and must not use calculator history, saved summaries, export events, crop profiles, safety notes, rule versions, AI audit logs, policy versions, adapter events, request logs, snapshot locks, Edge invocation logs, provider attempts, or safety events for targeting without explicit consent and policy review.

## My Farm Hub

M34 My Farm hub models map conceptually into generated dashboard views and user-owned preferences:

- `farm_profiles`
- `farm_dashboard_preferences`
- `farm_timeline_events`
- `farm_insights`

Type mapping:

- `MyFarmHubSummary` -> computed dashboard summary, not a trusted client-written row
- `MyFarmQuickAction` -> frontend/default preference or future `farm_dashboard_preferences`
- `MyFarmTimelineItem` -> `farm_timeline_events`
- `MyFarmInsightCard` -> `farm_insights`
- `MyFarmLocalDataWarning` -> frontend safety copy, not a database table
- `MyFarmNextAction` -> computed recommendation from owned records and feature readiness

M34 does not persist My Farm hub data. It reads Guest Memory, Crop Watch, Farm Area, and Weather fixture state locally. Production My Farm should rebuild summaries/timelines server-side from user-owned source records under RLS. Client-only counts must not grant permissions, trigger notifications, or drive trusted AI/weather/price decisions.

## Notification Center

M35 notification models map conceptually into:

- `notification_preferences`
- `notification_events`
- `notification_deliveries`
- `notification_digest_jobs`

Type mapping:

- `NotificationItem` -> `notification_events` plus user delivery/read state
- `NotificationType` -> `notification_events.event_type`
- `NotificationPriority` -> `notification_events.priority`
- `NotificationSource` -> `notification_events.source_table/source_id` or source metadata
- `NotificationStatus` -> in-app user state or delivery/inbox state
- `NotificationPreference` -> `notification_preferences`
- `NotificationDigestPreview` -> `notification_digest_jobs` preview/output

M35 state is localStorage-only under `kasethub.notificationCenter.v1`. Production notification events must be backend-generated from trusted source records and must not treat browser local preferences as delivery consent. Delivery channels such as push, LINE, SMS, and email need explicit consent, quiet hours, rate limits, and delivery logs.

## Admin Dashboard

M24 admin models map conceptually into:

- `AdminRole` -> `admin_roles.role`
- `AdminDashboardSummary` -> computed backend/admin dashboard view
- `AdminModuleStatus` -> computed module health/readiness view
- `AdminTask` -> `content_review_tasks`, `crop_price_review_tasks`, `expert_review_requests`, or future admin task table
- `AdminRiskItem` -> `ai_safety_review_logs`, `expert_review_requests`, or computed risk view
- `AdminAuditLogPreview` -> `admin_audit_logs`
- `AdminReviewQueueSummary` -> `moderation_queue`, `content_review_tasks`, `crop_price_review_tasks`, and `expert_review_requests`
- `AdminHealthStatus` -> computed system health view

Future admin-related tables:

- `admin_roles`
- `admin_audit_logs`
- `moderation_queue`
- `expert_review_requests`
- `content_review_tasks`
- `crop_price_review_tasks`
- `ai_safety_review_logs`

Admin permissions must be enforced server-side. The frontend dashboard should never be the source of truth for role claims, publish permission, moderation action, price approval, AI safety decision, or support access.
## M25 Staging Readiness Mapping Notes

M25 adds frontend-only readiness audit models, not database tables:

- `SupabaseReadinessAudit`
- `SupabaseReadinessItem`
- `SupabaseReadinessAreaSummary`
- `SupabaseReadinessAction`
- `SupabaseProductionBlocker`

These types summarize staging readiness for existing schema drafts. They should not be persisted until a later admin/audit milestone decides whether readiness checks belong in `admin_audit_logs`, `system_health_checks`, or a deployment checklist table.

The future database mapping remains unchanged: `admin_roles`, `admin_audit_logs`, `moderation_queue`, `expert_review_requests`, `content_review_tasks`, `crop_price_review_tasks`, and `ai_safety_review_logs` are still future backend/admin tables and must be protected by RLS plus server-side role checks.

## M29 Guest Sync Edge Function Mapping Notes

M29 adds Edge Function contract types only:

- `GuestSyncEdgeRequest` -> future Edge Function request body for `guest-memory-sync`
- `GuestSyncEdgeResponse` -> future Edge Function response body
- `GuestSyncAuthContext` -> authenticated session context derived server-side from Supabase Auth
- `GuestSyncIdempotencyKey` -> future idempotency key stored with sync event/audit records
- `GuestSyncValidationResult` -> server validation summary
- `GuestSyncMergeResult` -> created/merged/skipped counts by Guest Memory section
- `GuestSyncRollbackPlan` -> staging rollback/manual cleanup guidance
- `GuestSyncStagingReadiness` -> frontend planning output only, not a database table

Future persistence should map sync attempts into `guest_sync_events` or a backend-owned audit table with `user_id`, `guest_id`, `idempotency_key`, request hash, consent snapshot, status, counts, error code, and timestamps. The frontend must not persist service-role credentials, trusted owner claims, or admin-only audit decisions.

## M63 Ownership/RLS Gate Mapping Notes

M63 adds frontend-only review models:

- `OwnershipGateStatus`
- `OwnershipGateCheck`
- `OwnershipGateBlocker`
- `OwnershipGateConsentRequirement`
- `OwnershipGateIdempotencyRequirement`
- `OwnershipGateAuditRequirement`
- `OwnershipGateRlsExpectation`

Future persistence may map to `guest_sync_consent_records`, `guest_sync_idempotency_keys`, `guest_sync_audit_logs`, and `guest_sync_rls_dry_run_results`. M63 keeps these as plans only and does not write Supabase data.

## M64 Guest Sync Dry-run Payload Mapping Notes

M64 adds frontend-only types:

- `GuestSyncDryRunPayload`
- `GuestSyncDryRunRecordGroup`
- `GuestSyncDryRunConsentPreview`
- `GuestSyncDryRunIdempotencyPreview`
- `GuestSyncDryRunAuditPreview`
- `GuestSyncDryRunConflictPreview`
- `GuestSyncDryRunOwnerScope`
- `GuestSyncDryRunBlocker`

The future backend mapping should treat these as preview models only. Safe groups may map to saved items, farm records, recent AI questions, crop watches, calculator saved results, followed topics, and likes after real ownership, consent, idempotency, audit, and owner-scoped RLS pass. M64 keeps `uploadAllowed=false` and performs no writes.

## M65 Offline Agriculture Article Mapping Notes

M65 adds frontend-only offline article models:

- `OfflineAgriArticleCategory`
- `OfflineAgriArticle`
- `OfflineAgriArticleDifficulty`
- `OfflineAgriArticleReadiness`
- `OfflineAgriArticleSection`
- `OfflineAgriArticleImageAsset`
- `OfflineAgriArticleSafetyNote`
- `OfflineAgriArticleCmsCompatibility`

Future CMS mapping:

- `OfflineAgriArticle` -> `agri_articles` plus versioned body tables
- `OfflineAgriArticleSection` -> article body sections or rich content blocks
- `OfflineAgriArticleImageAsset` -> `agri_article_image_assets`
- `OfflineAgriArticleSafetyNote` -> `agri_article_safety_notes`
- `futureCmsKey` -> stable CMS override key

M65 keeps all articles bundled in the frontend and offline available. No CMS rows, Supabase writes, image uploads, or external image URLs are added.

## M66 Offline Article QA / CMS Contract Mapping Notes

M66 adds frontend-only QA and override models:

- `ArticleQaStatus`
- `ArticleEditorialChecklist`
- `ArticleSafetyChecklist`
- `ArticleImageChecklist`
- `ArticleCmsOverrideRule`
- `ArticleVersionInfo`
- `ArticleContentReadinessScore`
- `OfflineAgriCmsOverridePayload`
- `OfflineAgriCmsOverrideDecision`

Future persistence may map:

- `ArticleVersionInfo` -> `article_versions`
- editorial checklist results -> `article_editorial_reviews`
- CMS override attempts -> `article_cms_overrides`
- image checklist metadata -> `article_image_assets`
- required disclaimer rules -> `article_safety_requirements`

M66 keeps every mapping as planning only and performs no Supabase writes or CMS fetches.

## M67 Offline Article Full Content Mapping Notes

M67 adds frontend-only full-content readiness models:

- `FullArticleBodyTemplate`
- `FullArticleSectionTemplate`
- `FullArticleReviewRequirement`
- `FullArticleSourcePlaceholder`
- `FullArticleExpertEscalationNote`
- `FullArticlePublishReadinessGate`
- `FullArticleDraftStatus`

Future persistence may map:

- `FullArticleBodyTemplate` -> `article_full_body_versions`
- source placeholders -> `article_source_reviews`
- review requirements and escalation notes -> `article_expert_reviews`
- publish gate output -> `article_publish_gates`
- image requirements -> `article_image_requirements`

M67 keeps all mappings as local planning only and performs no Supabase writes, CMS writes, or content fetches.

## M70 Editorial Evidence / Human Release Mapping Notes

M70 adds frontend-only evidence and release gate models:

- `ArticleEvidencePacket`
- `ArticleEvidenceItem`
- `ArticleSourceEvidence`
- `ArticleImageEvidence`
- `ArticleReviewerEvidence`
- `ArticleReleaseGate`
- `ArticleHumanApprovalRequirement`

Future persistence may map:

- evidence packets -> `article_evidence_packets`
- human release approval -> `article_release_reviews`
- gate blockers -> `article_release_gates`
- release attempts and decisions -> `article_release_audit_logs`

M70 keeps `finalPublishAllowed=false` and performs no Supabase writes, CMS writes, or production publishing.

## M71 Offline Article Release Audit Mapping Notes

M71 adds frontend-only release audit models:

- `ArticleReleaseAuditEvent`
- `ArticleReleaseAttempt`
- `ArticleReleaseBlockedReason`
- `ArticleReviewerChangeHistory`
- `ArticleReleaseDiffPreview`
- `ArticleReleaseAuditStatus`
- `ArticleAutomationBypassAttempt`

Future persistence may map:

- audit timeline -> `article_release_audit_events`
- blocked release attempts -> `article_release_attempts`
- reviewer state changes -> `article_reviewer_history`
- release diff previews -> `article_release_diff_previews`
- automation or CMS bypass attempts -> `article_automation_bypass_events`

M71 keeps every model local-only, keeps `finalPublishAllowed=false`, and performs no Supabase writes, CMS writes, or production publishing.

## M72 Offline Article CMS Persistence Mapping Notes

M72 adds frontend-only CMS persistence planning models:

- `ArticleCmsPersistencePlan`
- `ArticleCmsRole`
- `ArticleCmsWriteContract`
- `ArticleCmsReadContract`
- `ArticleCmsReleaseAuditWriteContract`
- `ArticleCmsMigrationChecklist`
- `ArticleCmsFallbackPolicy`
- `ArticleCmsPublishBlocker`

Future persistence may map:

- `ArticleCmsPersistencePlan.tables` -> reviewed migration checklist for article CMS tables
- role contracts -> backend/editor RBAC policy docs
- read contract -> public reviewed-only article reads and editor-only draft reads
- release audit write contract -> `article_release_audit_events` and `article_release_attempts`
- fallback policy -> bundled offline fallback behavior when CMS override is invalid

M72 performs no Supabase writes, CMS writes, migrations, CMS fetches, or production publishing.

## M73 CMS Migration Dry-run Mapping Notes

M73 adds frontend-only migration review models:

- `CmsMigrationReviewStatus`
- `CmsMigrationTableReview`
- `CmsMigrationRlsReview`
- `CmsMigrationRollbackPlan`
- `CmsMigrationSeedFixturePlan`
- `CmsMigrationPublishSafetyGate`
- `CmsMigrationBlocker`

Future persistence may map:

- table reviews -> migration review checklist entries
- RLS reviews -> policy review checklist entries
- rollback plan -> rollback script review
- seed fixture plan -> staging seed plan
- publish safety gate -> release gate and audit preconditions

M73 keeps `noMigrationRun=true`, `noSupabaseWrite=true`, and `frontendCanWriteCmsRows=false`.

## M74 CMS SQL Draft Artifact Mapping Notes

M74 adds frontend-only SQL draft registry models:

- `ArticleCmsSqlDraftExecutionStatus`
- `ArticleCmsSqlDraftReviewStatus`
- `ArticleCmsSqlDraftKind`
- `ArticleCmsSqlDraftArtifact`
- `ArticleCmsSqlDraftRegistry`

The registry maps checked-in files under `supabase/drafts/cms/` to planning metadata:

- execution status: `not_executed`
- review status: `needs_review`
- migration blocked: `true`
- in migrations folder: `false`
- frontend CMS write allowed: `false`
- final publish allowed: `false`

M74 performs no Supabase writes, migrations, CMS writes, CMS fetches, or production publishing.

## M75 Weather API Mapping Notes

M75 adds frontend weather adapter models:

- `WeatherMode`
- `WeatherModeStatus`
- `WeatherCurrentConditions`
- `WeatherLocationForecast`
- `WeatherAdapterResult`

Future persistence may map:

- forecast snapshots -> `weather_cache`
- provider status/fallback events -> `weather_api_events`
- reviewed coarse user preferences -> `farm_weather_preferences`

M75 performs no Supabase writes, backend writes, cloud sync, GPS request, or personal precise location storage. The default mode remains `local_fixture`.

## M76 Weather Cache / Coarse Location Mapping Notes

M76 adds frontend-only weather QA and cache models:

- `WeatherCacheEntry`
- `WeatherCacheStatus`
- `WeatherCoarseLocation`
- `WeatherLocationPrivacyStatus`
- `WeatherQaFixture`
- `WeatherRiskNote`

Future persistence may map:

- local weather cache status -> `weather_cache`
- coarse location selection -> `weather_location_preferences`
- fetch/fallback/stale events -> `weather_fetch_events`
- reviewed general risk note templates -> `weather_risk_notes`

M76 keeps all cache state local-only and performs no Supabase writes.
