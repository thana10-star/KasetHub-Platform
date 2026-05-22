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

Public reads should only show visible/moderated content. Authenticated users can create and update their own posts/comments.

## Content and YouTube

Article and YouTube models map into:

- `articles`
- `videos`
- `saved_items`
- `share_events`

Future YouTube imports should write through a backend job, not the browser.

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
