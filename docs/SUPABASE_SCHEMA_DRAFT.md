# Supabase Schema Draft

This draft prepares KasetHub for Supabase. M05 defined the data model without adding a client. M06 adds a disabled-by-default frontend client scaffold, but still does not add real auth, keys, backend endpoints, or data writes.

## M06 Environment and Client Boundary

- Frontend ENV may only contain `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- `VITE_ENABLE_SUPABASE`, `VITE_ENABLE_AUTH`, and `VITE_ENABLE_CLOUD_SYNC` default to `false`.
- The Supabase client helper returns `null` unless ENV is present and `VITE_ENABLE_SUPABASE=true`.
- Service role keys must never be committed, exposed through Vite, or used in browser code.
- Tables below remain a planning draft until a backend migration milestone creates them.

## `profiles`

Purpose: User identity and farmer profile after phone, LINE, Google, or email signup.

Key columns: `id uuid primary key`, `display_name`, `phone_number`, `line_user_id`, `google_user_id`, `email`, `province`, `crop_focus text[]`, `auth_providers text[]`, `created_at`, `updated_at`, `metadata jsonb`.

Indexes: unique phone, unique LINE user ID, unique Google user ID, GIN crop focus.

RLS notes: Users can select/update their own profile. Admins can read for support and moderation.

Admin/moderation notes: Add verified expert flags and account risk status later.

## `saved_items`

Purpose: Cloud version of Guest Memory saved articles, videos, posts, analysis results, prices, AI answers, tools, and future items.

Key columns: `id uuid`, `user_id`, `item_type`, `item_id`, `title`, `summary`, `thumbnail_url`, `source_route`, `tags text[]`, `saved_at`, `updated_at`, `local_id`, `metadata jsonb`.

Indexes: `(user_id, item_type, item_id)` unique, `user_id`, GIN tags.

RLS notes: Users can CRUD their own saved items.

Admin/moderation notes: Admins do not need item metadata by default except abuse/debug cases.

## `likes`

Purpose: Liked posts and future liked content.

Key columns: `id uuid`, `user_id`, `item_type`, `item_id`, `title`, `source_route`, `liked_at`, `local_id`, `metadata jsonb`.

Indexes: `(user_id, item_type, item_id)` unique, `item_type, item_id`.

RLS notes: Users manage their own likes. Public aggregate counts should be served through views/functions.

Admin/moderation notes: Keep audit trails for abuse and bot-like behavior later.

## `followed_topics`

Purpose: Followed crops, price categories, communities, and future topics.

Key columns: `id uuid`, `user_id`, `topic_type`, `title`, `source_route`, `followed_at`, `tags text[]`, `local_id`, `metadata jsonb`.

Indexes: `(user_id, topic_type, topic_key)` unique, `user_id`, GIN tags.

RLS notes: Users manage their own follows.

Admin/moderation notes: Topic taxonomy can later be admin-managed.

## `farm_records`

Purpose: My Farm disease and crop history synced from guest memory or AI vision.

Key columns: `id uuid`, `user_id`, `local_id`, `crop_name`, `disease_name`, `date`, `confidence`, `symptoms_summary`, `treatment_summary`, `status`, `source_route`, `created_at`, `updated_at`, `metadata jsonb`.

Indexes: `user_id`, `(user_id, local_id)`, `crop_name`, `status`.

RLS notes: Users can CRUD their own farm records.

Admin/moderation notes: Expert review workflow can add review status and reviewer ID later.

## `recent_ai_questions`

Purpose: Optional AI history synced only with user consent.

Key columns: `id uuid`, `user_id`, `local_id`, `question`, `topic`, `source_route`, `asked_at`, `answer_summary`, `consent_to_sync`, `metadata jsonb`.

Indexes: `user_id`, `asked_at desc`, `topic`.

RLS notes: Users can read/delete their own AI history. Sync should require consent.

Admin/moderation notes: Use privacy controls before staff access.

## `share_events`

Purpose: Future referral and sharing attribution.

Key columns: `id uuid`, `user_id nullable`, `guest_id nullable`, `source`, `item_type`, `item_id`, `source_route`, `ref_param`, `created_at`, `metadata jsonb`.

Indexes: `source`, `item_type,item_id`, `created_at desc`, `guest_id`.

RLS notes: Inserts through backend only. Users do not need direct read access.

Admin/moderation notes: Aggregate only for dashboards; avoid exposing raw user-level sharing data broadly.

## `ai_credits`

Purpose: User AI credit balances from signup bonus, rewards, admin grants, or future paid plans.

Key columns: `id uuid`, `user_id`, `balance`, `source`, `expires_at`, `created_at`, `updated_at`, `metadata jsonb`.

Indexes: `user_id`, `expires_at`.

RLS notes: Users can read their balance. Mutations through backend functions only.

Admin/moderation notes: Admin grants require audit logging.

## `ai_credit_balances`

Purpose: Current normalized AI credit balance per user.

Key columns: `id uuid`, `user_id`, `daily_free_limit`, `daily_free_used`, `rewarded_credits`, `pro_credits`, `last_reset_date`, `updated_at`, `metadata jsonb`.

Indexes: unique `user_id`, `last_reset_date`.

RLS notes: Users can read their own balance. Mutations should go through backend functions only.

Admin/moderation notes: Manual adjustments require audit trails and reason codes.

## `ai_credit_transactions`

Purpose: Ledger of credit grants and spends.

Key columns: `id uuid`, `user_id`, `source`, `delta`, `balance_after`, `related_question_id`, `related_reward_event_id`, `created_at`, `metadata jsonb`.

Indexes: `user_id`, `source`, `created_at desc`.

RLS notes: Users can read summarized history. Inserts through backend only.

Admin/moderation notes: Use idempotency keys for rewarded ads and payment events.

## `rewarded_ad_events`

Purpose: Verified ad reward completion events.

Key columns: `id uuid`, `user_id`, `guest_id`, `provider`, `ad_unit_id`, `provider_event_id`, `credits_granted`, `status`, `created_at`, `verified_at`, `metadata jsonb`.

Indexes: unique `provider_event_id`, `user_id`, `guest_id`, `created_at desc`, `status`.

RLS notes: Backend insert only. Users can see a safe summary, not raw provider payloads.

Admin/moderation notes: Needed for fraud review, repeated failures, and ad reward disputes.

## `ai_usage_logs`

Purpose: Track AI usage, cost, quota, and safety metadata.

Key columns: `id uuid`, `user_id`, `feature`, `request_type`, `prompt_summary`, `model_route`, `provider_used`, `credit_delta`, `safety_level`, `backend_endpoint`, `created_at`, `metadata jsonb`.

Indexes: `user_id`, `feature`, `created_at desc`.

RLS notes: Users can read their own usage summaries, not raw safety internals.

Admin/moderation notes: Keep redaction and retention policies.

## `ai_question_logs`

Purpose: User-facing AI question history and cost metadata.

Key columns: `id uuid`, `user_id`, `guest_id`, `request_type`, `question_summary`, `topic`, `model_route`, `provider_used`, `credit_cost`, `credit_source`, `answer_summary`, `safety_level`, `disclaimers text[]`, `created_at`, `metadata jsonb`.

Indexes: `user_id`, `guest_id`, `topic`, `created_at desc`, `safety_level`.

RLS notes: Users can read/delete their own history. Sync should require consent.

Admin/moderation notes: Sensitive content should be redacted before support or model-quality review.

## `notifications`

Purpose: In-app notifications for AI, price, community, content, and system events.

Key columns: `id uuid`, `user_id`, `title`, `body`, `type`, `read_at`, `created_at`, `metadata jsonb`.

Indexes: `user_id`, `read_at`, `created_at desc`.

RLS notes: Users can read/update their own notifications.

Admin/moderation notes: Admin broadcasts should be audited.

## `community_posts`

Purpose: Farmer community feed.

Key columns: `id uuid`, `author_id`, `body`, `topic`, `province`, `image_urls text[]`, `like_count`, `comment_count`, `moderation_status`, `created_at`, `updated_at`, `metadata jsonb`.

Indexes: `topic`, `province`, `author_id`, `created_at desc`, `moderation_status`.

RLS notes: Public can read visible posts. Authenticated users can create. Authors can update within policy.

Admin/moderation notes: Moderator queue, report counts, and hidden reasons should be added.

## `community_comments`

Purpose: Replies on community posts.

Key columns: `id uuid`, `post_id`, `author_id`, `body`, `moderation_status`, `created_at`, `updated_at`, `metadata jsonb`.

Indexes: `post_id`, `author_id`, `created_at`, `moderation_status`.

RLS notes: Public can read visible comments. Authenticated users can create.

Admin/moderation notes: Support report and expert answer flags later.

## `community_reports` Future

Purpose: User-submitted reports for posts, comments, sale claims, dangerous advice, personal data, or other community safety concerns.

Key columns: `id uuid`, `reporter_user_id nullable`, `guest_session_id nullable`, `target_type`, `target_id`, `reason`, `note`, `status`, `created_at`, `updated_at`, `reviewer_id nullable`, `reviewed_at nullable`, `metadata jsonb`.

Indexes: `target_type`, `target_id`, `reason`, `status`, `reporter_user_id`, `created_at desc`.

RLS notes: Authenticated users can create reports and read their own reports. Public users should not read report details. Moderator/admin roles can read and update review fields through server-owned policies.

Admin/moderation notes: Duplicate reports should be grouped. Reporter identity and notes must be protected. Production report writes should be rate limited and audited.

## `hidden_content` Future

Purpose: Per-user hidden post/comment records and backend moderation visibility overrides.

Key columns: `id uuid`, `owner_user_id nullable`, `guest_session_id nullable`, `target_type`, `target_id`, `hide_scope`, `reason`, `hidden_at`, `expires_at nullable`, `created_by_role`, `metadata jsonb`.

Indexes: `owner_user_id`, `guest_session_id`, `target_type`, `target_id`, `hide_scope`, `hidden_at desc`.

RLS notes: Users can read and manage their own personal hidden content. Global or moderator hidden records require backend/admin role policies.

Admin/moderation notes: Personal hide is not the same as production content removal. Moderator hidden records need audit trails and appeal/correction paths.

## `moderation_actions` Future

Purpose: Immutable action log for warnings, hides, removals, dismissals, escalations, and reversals.

Key columns: `id uuid`, `actor_user_id`, `actor_role`, `target_type`, `target_id`, `report_id nullable`, `action`, `reason`, `status_before`, `status_after`, `created_at`, `metadata jsonb`.

Indexes: `target_type`, `target_id`, `report_id`, `actor_user_id`, `action`, `created_at desc`.

RLS notes: End users should not read broad action logs. Admin/moderator reads should be role-gated. Public content state should be exposed through posts/comments, not raw logs.

Admin/moderation notes: Keep actions append-only for auditability. Corrections should add a new reversal/correction action rather than deleting history.

## `moderator_queue` Future

Purpose: Review queue for reports, risky agricultural advice, scam/fake sale flags, and personal data exposure.

Key columns: `id uuid`, `target_type`, `target_id`, `primary_report_id nullable`, `reason`, `priority`, `status`, `assigned_to nullable`, `recommended_action`, `created_at`, `updated_at`, `reviewed_at nullable`, `metadata jsonb`.

Indexes: `status`, `priority`, `reason`, `assigned_to`, `created_at desc`.

RLS notes: Queue items are moderator/admin only. Client apps should receive only user-safe content status, not queue internals.

Admin/moderation notes: Chemical/pesticide and disease advice reports should support expert escalation before any official-looking recommendation is shown.

## `community_rules` Future

Purpose: Admin-managed community rules, safety copy, and localized user-facing policy text.

Key columns: `id uuid`, `slug`, `title`, `summary`, `detail`, `priority`, `status`, `locale`, `effective_from`, `created_at`, `updated_at`, `metadata jsonb`.

Indexes: unique `slug + locale`, `status`, `priority`.

RLS notes: Public can read active rules. Admin/editor roles can manage draft and retired rules through backend-controlled policies.

Admin/moderation notes: Rule changes should be versioned so reports can reference the rule text active at the time of the report.

## `admin_roles` Future

Purpose: Role assignments for owner, admin, editor, moderator, expert reviewer, and support users.

Key columns: `id uuid`, `user_id`, `role`, `scope`, `status`, `granted_by`, `granted_at`, `revoked_at nullable`, `metadata jsonb`.

Indexes: `user_id`, `role`, `status`, `scope`.

RLS notes: Owner/admin role management must be backend-owned. Users should not be able to grant themselves roles from the client.

Admin/moderation notes: Role changes must create audit log rows and should support emergency revoke.

## `admin_audit_logs` Future

Purpose: Append-only record of admin, editor, moderator, support, and expert reviewer actions.

Key columns: `id uuid`, `actor_user_id`, `actor_role`, `module`, `action`, `target_type`, `target_id`, `reason`, `status`, `created_at`, `metadata jsonb`.

Indexes: `actor_user_id`, `actor_role`, `module`, `target_type`, `target_id`, `created_at desc`.

RLS notes: Audit logs are admin/owner read only. Inserts should be backend-owned and append-only.

Admin/moderation notes: Do not delete audit logs for corrections. Add reversal/correction records instead.

## `moderation_queue` Future

Purpose: Unified queue for community reports, scam/fake sale flags, chemical/pesticide risk, dangerous advice, and personal-data exposure.

Key columns: `id uuid`, `source_report_id nullable`, `target_type`, `target_id`, `reason`, `priority`, `status`, `assigned_to nullable`, `assigned_role`, `recommended_action`, `created_at`, `updated_at`, `metadata jsonb`.

Indexes: `status`, `priority`, `assigned_to`, `assigned_role`, `reason`, `created_at desc`.

RLS notes: Queue internals should be visible only to moderator/admin/expert roles. Public feeds should only read final visible content state.

Admin/moderation notes: This can eventually replace or merge with the earlier `moderator_queue` draft name after schema review.

## `expert_review_requests` Future

Purpose: Escalations for plant disease, chemical, pesticide, fertilizer, crop price, and other high-risk agriculture guidance.

Key columns: `id uuid`, `request_type`, `target_type`, `target_id`, `requested_by`, `assigned_expert_id nullable`, `status`, `risk_summary`, `expert_notes`, `created_at`, `reviewed_at nullable`, `metadata jsonb`.

Indexes: `request_type`, `status`, `assigned_expert_id`, `target_type`, `target_id`, `created_at desc`.

RLS notes: Expert review requests are role-gated. Users may see safe summaries only when product policy allows.

Admin/moderation notes: Use for AI safety, plant analysis escalation, crop price validation, and dangerous community advice.

## `content_review_tasks` Future

Purpose: Editorial review tasks for articles, video import outlines, safety notes, and publish readiness.

Key columns: `id uuid`, `content_id`, `content_type`, `status`, `assigned_to nullable`, `review_stage`, `due_at nullable`, `created_at`, `updated_at`, `metadata jsonb`.

Indexes: `content_id`, `status`, `assigned_to`, `review_stage`, `created_at desc`.

RLS notes: Editors/admins can read and update assigned tasks through backend policies. Public users cannot read review tasks.

Admin/moderation notes: Publish actions should require a completed task and create audit log rows.

## `crop_price_review_tasks` Future

Purpose: Review tasks for price sources, snapshots, community price reports, stale-data flags, and correction/rollback decisions.

Key columns: `id uuid`, `source_id nullable`, `snapshot_id nullable`, `community_report_id nullable`, `status`, `assigned_to nullable`, `freshness_status`, `review_notes`, `created_at`, `updated_at`, `metadata jsonb`.

Indexes: `source_id`, `snapshot_id`, `community_report_id`, `status`, `freshness_status`, `created_at desc`.

RLS notes: Price review tasks are admin/expert only. Public reads should only use approved snapshots.

Admin/moderation notes: Never let client-only price rows drive production alerts or AI price explanations.

## `ai_safety_review_logs` Future

Purpose: Review logs for AI questions, risky prompts, blocked responses, plant-analysis escalation, and price explanation safety.

Key columns: `id uuid`, `ai_request_id nullable`, `request_type`, `risk_type`, `status`, `reviewer_id nullable`, `reviewer_role`, `decision`, `created_at`, `reviewed_at nullable`, `metadata jsonb`.

Indexes: `ai_request_id`, `request_type`, `risk_type`, `status`, `reviewer_id`, `created_at desc`.

RLS notes: AI safety logs may contain sensitive user content and should be tightly role-gated with retention/redaction policy.

Admin/moderation notes: Logs should cite source labels/dates for price explanations and preserve safety decisions for audit.

## `articles`

Purpose: Blog/news content.

Key columns: `id uuid`, `slug`, `title`, `excerpt`, `body`, `category`, `author_id`, `cover_image_url`, `published_at`, `moderation_status`, `created_at`, `updated_at`, `metadata jsonb`.

Indexes: unique slug, `category`, `published_at desc`, text search index on title/body.

RLS notes: Public can read published articles. Admin/editor roles can manage drafts.

Admin/moderation notes: Add editorial workflow and revision history.

## `videos`

Purpose: Normalized YouTube video metadata.

Key columns: `id uuid`, `video_id`, `channel_id`, `playlist_id`, `title`, `description`, `thumbnail_url`, `duration`, `published_at`, `view_count`, `category`, `tags text[]`, `is_short`, `source_status`, `share_url`, `created_at`, `updated_at`, `metadata jsonb`.

Indexes: unique video_id, `playlist_id`, `category`, `published_at desc`, GIN tags.

RLS notes: Public can read imported/visible videos. Admin/import job manages records.

Admin/moderation notes: Support curation status and featured flags later.

## `crop_price_watches`

Purpose: User-specific watched crops/prices and preferred reference context.

Key columns: `id uuid`, `user_id`, `crop_key`, `crop_name`, `category`, `preferred_source_id nullable`, `preferred_market_key`, `preferred_market_label`, `preferred_region_key`, `preferred_region_label`, `enabled`, `created_at`, `updated_at`, `local_id`, `metadata jsonb`.

Indexes: `user_id`, `(user_id, crop_key)` unique, `crop_name`, `preferred_region_key`, `enabled`.

RLS notes: Users can CRUD their own watches.

Admin/moderation notes: Price sources should be verified before alerts go live. Admins do not need direct access to user watch preferences except support/debug views.

## `crop_price_alert_preferences` Future

Purpose: Per-watch alert preferences for price movement, target price, and weekly summaries.

Key columns: `id uuid`, `watch_id`, `user_id`, `alert_type`, `enabled`, `target_price nullable`, `last_evaluated_snapshot_id nullable`, `last_triggered_at nullable`, `quiet_hours jsonb`, `delivery_channels text[]`, `created_at`, `updated_at`, `local_id`, `metadata jsonb`.

Indexes: `watch_id`, `user_id`, `alert_type`, `enabled`, `last_triggered_at desc`.

RLS notes: Users can CRUD their own alert preferences. Evaluation and delivery writes should be backend-owned.

Admin/moderation notes: Do not send production alerts unless source freshness, attribution, and disclaimer rules pass.

## `crop_price_sources`

Purpose: Registry of official, market, manual, and community price sources.

Key columns: `id uuid`, `source_key`, `label`, `short_label`, `thai_name`, `source_type`, `reliability_level`, `status`, `attribution_label`, `planned_connection_method`, `freshness_policy`, `created_at`, `updated_at`, `metadata jsonb`.

Indexes: unique `source_key`, `source_type`, `status`, `reliability_level`.

RLS notes: Public can read enabled source metadata. Admin/import services manage records.

Admin/moderation notes: Source status controls whether rows can be published, imported, or shown only as planned.

## `crop_price_snapshots`

Purpose: Historical and latest crop price reference rows imported from verified source workflows.

Key columns: `id uuid`, `source_id`, `import_job_id nullable`, `crop_key`, `crop_name`, `category`, `reference_price`, `currency`, `unit_label`, `unit_quantity_label`, `quality_grade_label`, `quality_grade_description`, `market_key`, `market_label`, `market_type`, `region_key`, `region_label`, `province`, `source_captured_at`, `source_published_at`, `imported_at`, `change_amount`, `change_percent`, `change_direction`, `reliability_level`, `publication_status`, `attribution_label`, `disclaimer`, `metadata jsonb`.

Indexes: `source_id`, `crop_key`, `crop_name`, `category`, `region_key`, `market_key`, `source_captured_at desc`, `publication_status`, `reliability_level`.

RLS notes: Public read only for published and non-stale reference rows. Admin/import services insert and correct rows.

Admin/moderation notes: Add correction workflow, stale flags, reviewer notes, and immutable audit history before production alerts.

## `crop_price_import_jobs` Future

Purpose: Backend-owned source import lifecycle for APIs, approved feeds, CSV/manual imports, and future scheduled jobs.

Key columns: `id uuid`, `source_id`, `job_type`, `status`, `started_at`, `completed_at`, `source_window_start`, `source_window_end`, `rows_received`, `rows_imported`, `rows_rejected`, `warning_count`, `error_message`, `reviewer_id nullable`, `published_at nullable`, `metadata jsonb`.

Indexes: `source_id`, `status`, `started_at desc`, `job_type`.

RLS notes: Backend/admin only. Users do not read raw import jobs.

Admin/moderation notes: Required for idempotency, rollback, rejected row review, and source freshness dashboards.

## `community_price_reports` Future

Purpose: User-submitted local price reports before moderation and source validation.

Key columns: `id uuid`, `reporter_user_id`, `crop_name`, `category`, `reported_price`, `currency`, `unit_label`, `quality_grade_label`, `market_label`, `province`, `reported_at`, `evidence_note`, `moderation_status`, `reviewer_id nullable`, `reviewed_at nullable`, `linked_snapshot_id nullable`, `created_at`, `updated_at`, `metadata jsonb`.

Indexes: `reporter_user_id`, `crop_name`, `province`, `reported_at desc`, `moderation_status`.

RLS notes: Users can create and read their own reports. Public reads only after moderation and only if surfaced as community/unverified or reviewed reference data.

Admin/moderation notes: Community reports must stay clearly separate from official data and should not drive AI or alerts until reviewed.

## `weather_locations` Future

Purpose: User-selectable weather locations and source mapping for province/district-level forecast display.

Key columns: `id uuid`, `location_key`, `label`, `province`, `district nullable`, `region`, `latitude nullable`, `longitude nullable`, `source_location_ref nullable`, `status`, `created_at`, `updated_at`, `metadata jsonb`.

Indexes: unique `location_key`, `province`, `district`, `region`, `status`.

RLS notes: Public can read active coarse locations. Admin/import jobs manage source mapping. Precise user geolocation should not be stored here.

Admin/moderation notes: Keep location privacy guidance separate from provider source mapping and support manual selection first.

## `weather_forecast_snapshots` Future

Purpose: Cached forecast snapshots from official/provider sources before display, AI explanation, or alert evaluation.

Key columns: `id uuid`, `location_id`, `source_key`, `source_label`, `forecast_date`, `forecast_hour nullable`, `temperature_c`, `rain_chance_percent`, `rain_amount_mm nullable`, `humidity_percent`, `wind_kph`, `uv_index nullable`, `risk_labels text[]`, `source_published_at nullable`, `imported_at`, `freshness_status`, `disclaimer`, `metadata jsonb`.

Indexes: `location_id`, `source_key`, `forecast_date`, `forecast_hour`, `imported_at desc`, `freshness_status`, GIN `risk_labels`.

RLS notes: Public read only for active, non-stale snapshots that pass attribution/freshness rules. Inserts and corrections are backend/import-job only.

Admin/moderation notes: Do not let stale or unreviewed provider rows drive production alerts or AI weather explanations.

## `weather_alert_preferences` Future

Purpose: User preferences for weather alerts such as heavy rain, heat, high humidity, wind, or weekly summaries.

Key columns: `id uuid`, `user_id`, `location_id`, `alert_type`, `enabled`, `threshold_config jsonb`, `quiet_hours jsonb`, `delivery_channels text[]`, `last_triggered_at nullable`, `created_at`, `updated_at`, `metadata jsonb`.

Indexes: `user_id`, `location_id`, `alert_type`, `enabled`, `last_triggered_at desc`.

RLS notes: Users can CRUD their own alert preferences after real auth. Alert evaluation and delivery writes are backend-owned.

Admin/moderation notes: Alerts require consent, freshness checks, dedupe, quiet hours, and delivery audit logs.

## `weather_alert_events` Future

Purpose: Backend-created weather alert events generated from approved forecast snapshots and user preferences.

Key columns: `id uuid`, `user_id`, `location_id`, `forecast_snapshot_id nullable`, `alert_type`, `title`, `body`, `severity`, `source_label`, `source_timestamp`, `status`, `delivery_channel`, `created_at`, `delivered_at nullable`, `metadata jsonb`.

Indexes: `user_id`, `location_id`, `alert_type`, `severity`, `status`, `created_at desc`.

RLS notes: Users can read their own alert events. Inserts and delivery status updates are backend-owned.

Admin/moderation notes: Alert bodies must include source/date and should never guarantee field conditions or crop outcomes.

## `farm_plots` Future

Purpose: User-owned farm plot profile records created from manual estimates or future GPS/map measurement flows.

Key columns: `id uuid`, `user_id`, `name`, `crop_context nullable`, `province nullable`, `district nullable`, `measurement_method`, `accuracy_level`, `latest_area_square_meters`, `latest_area_rai`, `latest_measurement_id nullable`, `status`, `created_at`, `updated_at`, `local_id`, `metadata jsonb`.

Indexes: `user_id`, `(user_id, name)`, `measurement_method`, `accuracy_level`, `status`, `created_at desc`.

RLS notes: Users can CRUD their own plot records after real auth. Admin/support access should be role-gated and audited.

Admin/moderation notes: Plot records must not imply official land ownership or official survey status.

## `farm_plot_measurements` Future

Purpose: Calculation and measurement history for a plot, including manual rectangle/square/triangle estimates and future GPS/map outputs.

Key columns: `id uuid`, `plot_id`, `user_id`, `shape`, `measurement_method`, `accuracy_level`, `input_dimensions jsonb`, `area_square_meters`, `area_square_wa`, `area_ngan`, `area_rai`, `area_hectare`, `area_acre`, `formula_label`, `disclaimer`, `measured_at`, `created_at`, `metadata jsonb`.

Indexes: `plot_id`, `user_id`, `measurement_method`, `shape`, `measured_at desc`.

RLS notes: Users can read/create their own measurements. Updates should usually create a new measurement row rather than overwrite history.

Admin/moderation notes: Keep the disclaimer with each measurement so exports and AI explanations do not detach area values from their accuracy boundary.

## `farm_plot_boundaries` Future

Purpose: Private GPS/map polygon geometry for future plot boundary measurement.

Key columns: `id uuid`, `plot_id`, `user_id`, `boundary_source`, `geometry_geojson`, `point_count`, `accuracy_meters nullable`, `provider_label nullable`, `captured_at`, `created_at`, `updated_at`, `deleted_at nullable`, `metadata jsonb`.

Indexes: `plot_id`, `user_id`, `boundary_source`, `captured_at desc`, `deleted_at`.

RLS notes: Precise boundary coordinates are private user data. Users can read/delete their own boundaries. Public read is disabled by default.

Admin/moderation notes: Geolocation and map-provider access must be opt-in, audited when shared/exported, and never loaded as a side effect of opening the calculator page.

## `farm_plot_notes` Future

Purpose: User notes tied to a farm plot for crop planning, irrigation, weather context, or area calculation reminders.

Key columns: `id uuid`, `plot_id`, `user_id`, `note_type`, `body`, `linked_crop_key nullable`, `linked_weather_location_id nullable`, `created_at`, `updated_at`, `metadata jsonb`.

Indexes: `plot_id`, `user_id`, `note_type`, `created_at desc`.

RLS notes: Users can CRUD their own notes. Backend-generated notes should be labeled separately from user-entered notes.

Admin/moderation notes: Future support/admin views should avoid broad access to private plot notes unless explicit support consent and audit logging exist.

## `calculator_history` Future

Purpose: Optional cloud version of M49 local agriculture calculator history after real auth and sync consent exist.

Key columns: `id uuid`, `user_id`, `local_id`, `calculator_category`, `input_payload jsonb`, `result_payload jsonb`, `result_summary`, `disclaimers text[]`, `created_at`, `synced_at`, `metadata jsonb`.

Indexes: `user_id`, `calculator_category`, `created_at desc`, `(user_id, local_id)`.

RLS notes: Users can read/delete their own calculator history. Inserts should require authenticated ownership and explicit sync consent.

Admin/moderation notes: Calculator history can reveal farm economics, chemical use, and production planning. Support/admin access should be rare, audited, and purpose-limited.

## `fertilizer_profiles` Future

Purpose: User-owned or admin-reviewed fertilizer formula profiles used by future calculator defaults and recommendation workflows.

Key columns: `id uuid`, `owner_user_id nullable`, `profile_type`, `label`, `n_percent`, `p_percent`, `k_percent`, `source_label`, `review_status`, `created_at`, `updated_at`, `metadata jsonb`.

Indexes: `owner_user_id`, `profile_type`, `review_status`, `(n_percent, p_percent, k_percent)`.

RLS notes: Public can read only approved generic profiles. Users can manage their own private profiles. Admin-reviewed profiles require backend/admin policies.

Admin/moderation notes: Product-specific fertilizer profiles must not become hidden ads. Sponsored or affiliate profiles need clear labeling and audit logs.

## `planting_profiles` Future

Purpose: Saved crop/spacing presets and planting density assumptions for future user-owned farm planning.

Key columns: `id uuid`, `user_id`, `crop_name`, `row_spacing_cm`, `plant_spacing_cm`, `seedling_buffer_percent`, `usable_area_percent`, `source_label`, `created_at`, `updated_at`, `metadata jsonb`.

Indexes: `user_id`, `crop_name`, `created_at desc`.

RLS notes: Users can CRUD their own planting profiles. Public/default presets should be backend-reviewed and clearly labeled as examples.

Admin/moderation notes: Presets should not imply guaranteed yield. AI or sponsor-generated presets must be labeled separately from farmer-entered profiles.

## `farm_cost_records` Future

Purpose: User-owned farm cost estimates and actual cost records derived from future cost calculator and My Farm workflows.

Key columns: `id uuid`, `user_id`, `farm_plot_id nullable`, `season_label nullable`, `record_type`, `area_rai`, `fertilizer_cost`, `labor_cost`, `water_cost`, `machinery_cost`, `other_cost`, `total_cost`, `expected_yield_kg nullable`, `break_even_payload jsonb`, `created_at`, `updated_at`, `metadata jsonb`.

Indexes: `user_id`, `farm_plot_id`, `record_type`, `season_label`, `created_at desc`.

RLS notes: Users can CRUD their own cost records. Public read is disabled by default.

Admin/moderation notes: Cost records are sensitive financial planning data. They must not be used for credit, ads, affiliate targeting, or pricing offers without explicit consent and policy review.

## `crop_calculator_profiles` Future

Purpose: Admin-reviewed crop example profiles for calculator form defaults such as spacing examples, area examples, yield input examples, and cost category labels.

Key columns: `id uuid`, `crop_key`, `thai_display_name`, `profile_status`, `fertilizer_planning_status`, `spacing_examples jsonb`, `unit_examples jsonb`, `yield_examples jsonb`, `cost_categories text[]`, `safety_notes text[]`, `source_label`, `review_status`, `rule_version_id nullable`, `created_at`, `updated_at`, `metadata jsonb`.

Indexes: unique `crop_key`, `profile_status`, `fertilizer_planning_status`, `review_status`.

RLS notes: Public can read only approved planning profiles. Admin/editor/expert roles manage drafts through backend-controlled policies.

Admin/moderation notes: Profiles must not contain exact fertilizer doses or pesticide/product recommendations until reviewed rule versions exist. Sponsored profiles must be clearly labeled and separated from base examples.

## `calculator_safety_notes` Future

Purpose: Versioned safety copy for calculator boundaries, fertilizer/chemical warnings, AI explanation boundaries, and sponsor/affiliate separation.

Key columns: `id uuid`, `note_key`, `title`, `body`, `locale`, `risk_area`, `status`, `effective_from`, `retired_at nullable`, `created_at`, `updated_at`, `metadata jsonb`.

Indexes: unique `note_key + locale + effective_from`, `risk_area`, `status`.

RLS notes: Public can read active notes. Admin/editor/expert roles manage drafts and retired notes.

Admin/moderation notes: Safety copy should be versioned so exported summaries and AI explanations can cite the boundary text active at the time.

## `calculator_result_reviews` Future

Purpose: Expert or admin review records for user-submitted calculator results, risky fertilizer/chemical questions, disputed output, or future AI explanation quality checks.

Key columns: `id uuid`, `calculator_history_id nullable`, `user_id nullable`, `calculator_category`, `risk_area`, `review_status`, `reviewer_id nullable`, `review_summary`, `recommended_action`, `created_at`, `reviewed_at nullable`, `metadata jsonb`.

Indexes: `calculator_history_id`, `user_id`, `calculator_category`, `risk_area`, `review_status`, `created_at desc`.

RLS notes: Users may read safe summaries of their own review requests. Moderator/admin/expert reads and writes must be role-gated and audited.

Admin/moderation notes: Use for high-risk fertilizer, chemical, and AI explanation escalation. Review records must not expose private calculator payloads broadly.

## `crop_rule_versions` Future

Purpose: Version registry for future crop-specific recommendation rules after expert review, source citation, and safety policy approval.

Key columns: `id uuid`, `crop_key`, `rule_area`, `version_label`, `status`, `source_refs jsonb`, `approved_by nullable`, `approved_at nullable`, `effective_from nullable`, `retired_at nullable`, `created_at`, `updated_at`, `metadata jsonb`.

Indexes: `crop_key`, `rule_area`, `status`, `effective_from`, unique `crop_key + rule_area + version_label`.

RLS notes: Public can read only approved, active rule metadata. Rule authoring and approval are backend/admin/expert only.

Admin/moderation notes: Future AI recommendations must cite rule versions and must not mix sponsor influence into deterministic calculator output or expert-reviewed rule logic.

## `calculator_saved_results` Future

Purpose: Optional cloud sync target for M53 saved calculator summaries after real auth, consent, and owner-scoped RLS exist.

Key columns: `id uuid`, `user_id`, `local_id`, `calculator_category`, `summary_title`, `input_recap text[]`, `result_recap text[]`, `warning_recap text[]`, `safety_disclaimer`, `calculator_route`, `share_text`, `created_at`, `synced_at`, `deleted_at nullable`, `metadata jsonb`.

Indexes: `user_id`, `calculator_category`, `created_at desc`, `(user_id, local_id)`, `deleted_at`.

RLS notes: Users can read/delete their own saved summaries. Inserts require explicit sync consent and must never trust client payloads as official recommendations.

Admin/moderation notes: Saved summaries may reveal chemical use, costs, yield expectations, and farm planning. Support/admin access must be audited and purpose-limited.

## `calculator_share_events` Future

Purpose: Optional analytics/audit events for calculator summary shares after consent and privacy review.

Key columns: `id uuid`, `user_id nullable`, `saved_result_id nullable`, `calculator_category`, `share_channel`, `share_status`, `shared_at`, `consent_version nullable`, `metadata jsonb`.

Indexes: `user_id`, `saved_result_id`, `calculator_category`, `share_channel`, `shared_at desc`.

RLS notes: If stored, users should see their own share history. Event inserts should be backend-owned or consent-gated, not automatic local tracking.

Admin/moderation notes: Do not store raw share text unless necessary. Avoid sponsor targeting without explicit consent.

## `calculator_rewarded_ad_unlocks` Future

Purpose: Future rewarded-ad unlock records for calculator convenience or advanced modes, never for essential safety information.

Key columns: `id uuid`, `user_id`, `unlock_type`, `calculator_category nullable`, `ad_provider`, `provider_reward_id nullable`, `status`, `granted_at`, `expires_at nullable`, `metadata jsonb`.

Indexes: `user_id`, `unlock_type`, `calculator_category`, `status`, `granted_at desc`.

RLS notes: Users can read their own unlock history. Grant validation should be backend-owned and rate limited.

Admin/moderation notes: Basic calculator results and safety copy must stay free. Unlocks must not insert hidden sponsor/product recommendations into deterministic results.

## `calculator_export_events` Future

Purpose: Optional consent-gated audit/analytics events for text exports, copy actions, native share fallback, and future file exports.

Key columns: `id uuid`, `user_id nullable`, `saved_result_id nullable`, `calculator_category`, `export_version`, `export_channel`, `export_status`, `template_key nullable`, `created_at`, `consent_version nullable`, `metadata jsonb`.

Indexes: `user_id`, `saved_result_id`, `calculator_category`, `export_channel`, `created_at desc`.

RLS notes: Users may read their own export history if surfaced. Inserts should be backend-owned or explicitly consent-gated.

Admin/moderation notes: Do not store raw export text by default. Export analytics must not become hidden sponsor targeting.

## `calculator_share_templates` Future

Purpose: Versioned templates for short LINE-friendly and long detail calculator export text after product/legal review.

Key columns: `id uuid`, `template_key`, `calculator_category`, `template_version`, `locale`, `template_type`, `body_template`, `status`, `effective_from`, `retired_at nullable`, `created_at`, `updated_at`, `metadata jsonb`.

Indexes: unique `template_key + template_version + locale`, `calculator_category`, `template_type`, `status`, `effective_from`.

RLS notes: Public can read active approved templates. Drafts and retired versions are admin/editor only.

Admin/moderation notes: Template changes must keep safety copy visible and must not add AI or sponsor recommendations to deterministic results.

## `calculator_usage_stats` Future

Purpose: Aggregated calculator usage metrics for product QA and capacity planning without exposing raw user inputs.

Key columns: `id uuid`, `period_start`, `period_granularity`, `calculator_category`, `event_type`, `count`, `source_surface`, `created_at`, `metadata jsonb`.

Indexes: `period_start`, `period_granularity`, `calculator_category`, `event_type`, `source_surface`.

RLS notes: Aggregate stats are admin/product only unless a public transparency dashboard is reviewed.

Admin/moderation notes: Stats should be aggregated and privacy-preserving. Do not infer chemical, cost, or yield behavior for individual users.

## `farm_profiles` Future

Purpose: User-owned My Farm workspace profile that can group farms, plots, crop focus, preferred province, and dashboard defaults.

Key columns: `id uuid`, `user_id`, `display_name`, `primary_province nullable`, `crop_focus text[]`, `default_weather_location_id nullable`, `created_at`, `updated_at`, `metadata jsonb`.

Indexes: `user_id`, `primary_province`, GIN `crop_focus`.

RLS notes: Users can CRUD their own farm profile. Public read is disabled by default.

Admin/moderation notes: Farm profile data can reveal business/location context and should not be broadly visible to support/admin roles without purpose and audit logging.

## `farm_dashboard_preferences` Future

Purpose: Per-user dashboard settings for My Farm section order, hidden modules, default quick actions, and local-to-cloud sync preferences.

Key columns: `id uuid`, `user_id`, `section_order text[]`, `hidden_sections text[]`, `default_quick_actions text[]`, `sync_preferences jsonb`, `created_at`, `updated_at`, `metadata jsonb`.

Indexes: unique `user_id`.

RLS notes: Users can read/update their own preferences. Backend may initialize defaults after signup.

Admin/moderation notes: Preferences should not grant permissions or override backend safety rules.

## `farm_timeline_events` Future

Purpose: Backend-generated My Farm timeline events derived from owned records such as plant analyses, plot measurements, crop watches, saved content, and AI questions.

Key columns: `id uuid`, `user_id`, `event_type`, `source_table`, `source_id`, `title`, `subtitle`, `event_at`, `route_hint`, `visibility`, `created_at`, `metadata jsonb`.

Indexes: `user_id`, `event_type`, `event_at desc`, `(source_table, source_id)`.

RLS notes: Users can read their own events. Events should be generated by backend jobs/functions or safe triggers, not trusted from frontend summaries.

Admin/moderation notes: Timeline events should be rebuildable from source records and avoid duplicating sensitive payloads such as raw images or precise boundaries.

## `farm_insights` Future

Purpose: Generated farmer-facing insight cards for My Farm, such as stale analysis reminders, watched-crop summaries, weather context, and plot planning prompts.

Key columns: `id uuid`, `user_id`, `insight_type`, `title`, `body`, `severity`, `source_refs jsonb`, `generated_at`, `expires_at nullable`, `dismissed_at nullable`, `created_at`, `metadata jsonb`.

Indexes: `user_id`, `insight_type`, `severity`, `generated_at desc`, `expires_at`, `dismissed_at`.

RLS notes: Users can read and dismiss their own insights. Generation should be backend-owned and respect source freshness/safety rules.

Admin/moderation notes: Insights must cite source context when they mention prices/weather and must not imply guaranteed yield, price, disease diagnosis, or official land measurement.

## `auth_link_events`

Purpose: Audit guest-to-account linking and provider changes.

Key columns: `id uuid`, `user_id`, `guest_id`, `provider`, `event_type`, `created_at`, `metadata jsonb`.

Indexes: `user_id`, `guest_id`, `provider`, `created_at desc`.

RLS notes: Backend insert only. Users can read limited account security history.

Admin/moderation notes: Useful for fraud review and support recovery.

## `plant_media`

Purpose: Store metadata for private plant image uploads and thumbnails.

Key columns: `id uuid`, `owner_user_id nullable`, `guest_session_id nullable`, `bucket_name`, `object_path`, `thumbnail_path`, `mime_type`, `size_bytes`, `width`, `height`, `checksum`, `moderation_status`, `moderation_reason`, `signed_url_expires_at`, `deletion_requested_at`, `linked_farm_record_id`, `linked_saved_item_id`, `analysis_job_id`, `created_at`, `updated_at`, `metadata jsonb`.

Indexes: unique `object_path`, `owner_user_id`, `guest_session_id`, `moderation_status`, `analysis_job_id`, `created_at desc`, `checksum`.

RLS notes: Users can read their own media rows. Inserts, moderation updates, signed URL issuance, and deletes should go through backend or Edge Functions.

Admin/moderation notes: Reviewer access should be role-gated and audited.

## `plant_analysis_jobs`

Purpose: Track image analysis lifecycle from private upload through moderation and AI processing.

Key columns: `id uuid`, `owner_user_id nullable`, `guest_session_id nullable`, `media_object_id`, `status`, `request_type`, `model_route`, `provider_candidate`, `credit_cost`, `credit_reserved`, `retry_count`, `moderation_status`, `error_code`, `error_message`, `created_at`, `updated_at`, `completed_at`, `metadata jsonb`.

Indexes: `owner_user_id`, `guest_session_id`, `media_object_id`, `status`, `created_at desc`, `(owner_user_id, status)`.

RLS notes: Users can read their own job summaries. Mutations should be backend-owned.

Admin/moderation notes: Needed for provider failure review, retry audit, and cost control.

## `plant_analysis_results`

Purpose: Store structured AI vision output linked to media, My Farm, and saved analysis records.

Key columns: `id uuid`, `job_id`, `media_object_id`, `owner_user_id nullable`, `guest_session_id nullable`, `crop_name`, `disease_name`, `confidence`, `confidence_label`, `symptoms text[]`, `causes text[]`, `treatment_suggestions text[]`, `urgency`, `safety_disclaimers text[]`, `should_consult_expert`, `linked_farm_record_id`, `linked_saved_item_id`, `created_at`, `metadata jsonb`.

Indexes: `job_id`, `media_object_id`, `owner_user_id`, `guest_session_id`, `crop_name`, `disease_name`, `created_at desc`.

RLS notes: Users can read and delete their own results. Expert review should use separate redacted views.

Admin/moderation notes: Model quality review must avoid broad access to raw images.

## `guest_sync_events`

Purpose: Audit dry-run and future real Guest Memory sync attempts.

Key columns: `id uuid`, `user_id nullable`, `guest_id`, `provider`, `sync_request_id`, `status`, `dry_run`, `records_received jsonb`, `merge_summary jsonb`, `conflict_summary jsonb`, `warnings text[]`, `created_at`, `metadata jsonb`.

Indexes: unique `sync_request_id`, `user_id`, `guest_id`, `status`, `created_at desc`.

RLS notes: Users can read their own sync history. Inserts should be backend-only.

Admin/moderation notes: Useful for support and fraud review, but should not expose raw private payloads broadly.

## `notification_preferences` Future

Purpose: Store user-owned notification category/channel preferences after real auth and consent exist.

Key columns: `id uuid`, `user_id`, `notification_type`, `channel`, `enabled`, `quiet_hours_start nullable`, `quiet_hours_end nullable`, `consent_version`, `updated_at`, `created_at`, `metadata jsonb`.

Indexes: unique `(user_id, notification_type, channel)`, `user_id`, `notification_type`, `channel`, `enabled`.

RLS notes: Users can read/update their own preferences. Backend may initialize defaults. Local M35 preferences in `kasethub.notificationCenter.v1` are not production consent.

Admin/moderation notes: Admins should not override opt-out except for legally required system notices.

## `notification_events` Future

Purpose: Store backend-generated notification events from weather, crop price, My Farm, moderation, content, account/sync, and system sources.

Key columns: `id uuid`, `user_id nullable`, `event_type`, `priority`, `source_table nullable`, `source_id nullable`, `title`, `body`, `cta_route`, `source_label`, `source_timestamp nullable`, `status`, `created_at`, `expires_at nullable`, `metadata jsonb`.

Indexes: `user_id`, `event_type`, `priority`, `status`, `created_at desc`, `(source_table, source_id)`.

RLS notes: Users can read their own events. Public/system events need carefully scoped public-read policies or backend fan-out.

Admin/moderation notes: Events mentioning prices/weather must cite source context and should be generated only after freshness and safety checks.

## `notification_deliveries` Future

Purpose: Track delivery attempts for push, LINE, email, SMS, and in-app delivery channels.

Key columns: `id uuid`, `event_id`, `user_id`, `channel`, `provider`, `delivery_status`, `attempt_count`, `last_attempt_at`, `delivered_at nullable`, `failure_code nullable`, `failure_message nullable`, `created_at`, `metadata jsonb`.

Indexes: `event_id`, `user_id`, `channel`, `delivery_status`, `last_attempt_at desc`.

RLS notes: Users may read limited delivery status for their own notifications. Provider payloads and failure details should be redacted or admin-only.

Admin/moderation notes: Delivery logs need rate-limit and abuse review but must never expose provider secrets.

## `notification_digest_jobs` Future

Purpose: Batch low-priority events into daily/weekly digests based on user preferences and quiet hours.

Key columns: `id uuid`, `user_id`, `digest_type`, `status`, `event_ids uuid[]`, `scheduled_for`, `sent_at nullable`, `created_at`, `metadata jsonb`.

Indexes: `user_id`, `digest_type`, `status`, `scheduled_for`.

RLS notes: Backend-owned writes only. Users can read digest status if surfaced.

Admin/moderation notes: Digest jobs should respect opt-out and should not hide urgent safety notices.

## M18 SQL Draft Pack

M18 turns this schema plan into draft SQL files:

- `supabase/migrations/0001_kasethub_core_schema.sql`
- `supabase/policies/0001_kasethub_rls_policies.sql`

These files are not run by the app. They are intended for staging review, RLS testing, and future migration refinement before any real Supabase connection is enabled.

## M19 LINE Account Linking Notes

The current draft supports LINE linking through:

- `profiles.line_user_id`
- `profiles.auth_providers`
- `auth_link_events.provider = line`
- `guest_sync_events.provider = line`

A future `account_provider_links` table may be added if KasetHub needs detailed provider verification status, conflict status, revocation history, or multiple linked provider records per account. Phone should remain the recommended recovery path while LINE acts as an important secondary provider for Thai users.
## M25 Staging Readiness Notes

M25 does not change the SQL draft and does not run migrations. It adds a readiness audit that checks whether this schema planning is ready for a first staging project review.

Before staging:

- Treat `supabase/migrations/0001_kasethub_core_schema.sql` as a draft to run manually in staging only.
- Apply `supabase/policies/0001_kasethub_rls_policies.sql` only after table creation.
- Keep auth, phone OTP, LINE Login, and cloud sync disabled for the first staging pass.
- Verify public read tables, user-owned tables, backend-only tables, admin review tables, crop price review tables, and community moderation tables separately.
- Keep service-role keys out of frontend ENV and reserve them for future Edge Functions/backend jobs.
