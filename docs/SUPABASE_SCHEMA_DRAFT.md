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

Purpose: User-specific watched crops/prices.

Key columns: `id uuid`, `user_id`, `crop_name`, `category`, `province`, `market`, `threshold_above`, `threshold_below`, `created_at`, `updated_at`, `metadata jsonb`.

Indexes: `user_id`, `crop_name`, `province`.

RLS notes: Users can CRUD their own watches.

Admin/moderation notes: Price sources should be verified before alerts go live.

## `crop_price_snapshots`

Purpose: Historical crop price data.

Key columns: `id uuid`, `crop_name`, `category`, `market`, `province`, `unit`, `price`, `change_percent`, `source`, `captured_at`, `metadata jsonb`.

Indexes: `crop_name`, `province`, `captured_at desc`.

RLS notes: Public read after source verification.

Admin/moderation notes: Add source confidence and correction workflow.

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
