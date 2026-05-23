# Guest To Account Sync Plan

## Principle

Guest mode local data stays on the device until the user chooses to create an account. KasetHub should not force login early. When a user signs up with phone, LINE, or Google, the app can ask permission to upload Guest Memory and merge it into cloud tables.

## Flow

1. User uses KasetHub as guest.
2. Guest Memory stores saves, likes, followed topics, My Farm records, and recent AI questions locally.
3. User taps a future backup CTA such as “สมัครด้วยเบอร์โทรเพื่อสำรองข้อมูล”.
4. Auth creates or finds a cloud profile.
5. App uploads Guest Memory through a backend sync endpoint.
6. Backend applies conflict policy and returns a sync result.
7. Local memory stores cloud linkage metadata so future actions can sync.

## Merge Rules

- Saved items: merge by `itemType + itemId`.
- Likes: OR/true wins. If either local or cloud says liked, keep liked.
- Followed topics: merge by topic ID.
- Farm records: keep both unless the same `localId` already exists in cloud.
- AI history: optional and synced only if user allows.
- Profile: cloud wins, but guest display name can be suggested.

## Timestamp Preservation

Farm records, saved items, likes, followed topics, and AI questions should preserve local timestamps. The backend should add `synced_at` without overwriting `saved_at`, `liked_at`, `followed_at`, `created_at`, or `asked_at`.

## Privacy Rules

AI question history should be opt-in. The sync UI should explain what will be uploaded. Users should be able to continue without syncing sensitive AI history.

## Failure Handling

If sync fails, keep Guest Memory untouched. Retry later. Never delete local memory until the server confirms success and the user has a cloud account.

## M05 Utility

`createGuestToCloudSyncPlan()` estimates records and prepares cloud-shaped objects without making network requests.

## M06 Feature Flag Gate

M06 introduces Supabase ENV and feature flags but does not upload Guest Memory. The account preview can show whether Supabase is disabled, waiting for ENV, or in test scaffold mode. Future sync must still require:

- User consent before upload.
- `VITE_ENABLE_SUPABASE=true` only for safe test environments.
- `VITE_ENABLE_AUTH=true` before any real login UI is enabled.
- `VITE_ENABLE_CLOUD_SYNC=true` before any sync request is allowed.
- A backend-owned sync endpoint; the browser should not write complex merged state directly into many tables.

If any flag or ENV value is missing, Guest Memory remains the active source of truth on the device.

## M07 Sync Contract

M07 defines `POST /api/guest-memory/sync` or Supabase Edge Function `guest-memory-sync` as the future backend-owned sync boundary. The current frontend only builds dry-run payload previews through `buildGuestSyncPayloadPreview()`.

Consent model:

- Saved items, likes, and followed topics sync only when `consent.savedItems=true`.
- My Farm records sync only when `consent.farmRecords=true`.
- Recent AI questions sync only when `consent.recentAIQuestions=true`; this is optional.

The future endpoint must authenticate the user server-side, validate every record, apply conflict rules, and return created/merged/skipped counts. Service role access must stay inside the backend or Edge Function.

## M08 AI Credit Sync Future

AI credit state remains local in M08. When account sync exists, the backend can optionally migrate:

- AI usage history if the user allows it.
- Rewarded unlock history for fraud review and continuity.
- Remaining rewarded credits if they were verified server-side.

Daily free counters should usually be recalculated server-side after login. AI question history should remain optional because it can contain sensitive farm details.

## M12 Plant Image Media Sync Future

Guest Memory should not sync raw image files because raw images are not stored locally in Guest Memory. Future account sync can migrate only lightweight analysis metadata unless the image was already uploaded through a backend-owned media flow.

Rules:

- Do not place base64 images in Guest Memory payloads.
- Sync saved analysis summaries and My Farm records first.
- Upload plant media only after image-specific consent.
- Link cloud media to `farm_records`, `saved_items`, and `plant_analysis_results` through backend IDs.
- Preserve local timestamps for analysis history.
- If upload fails, keep local Guest Memory untouched and do not delete local summaries.

## M16 Guest Sync Proof of Concept

M16 adds a no-write proof of concept for the future sync flow.

Implemented boundaries:

- `src/server/guest-sync/mock-guest-sync-handler.ts`
- `src/services/backend/guest-sync-adapter.ts`
- `/app/auth/sync-preview`
- `/app/guest-sync-status`

Safety behavior:

- Guest Memory remains the active source of truth.
- Dry-run responses never delete, mutate, or mark local data as synced.
- Failure responses are retryable when appropriate.
- Duplicate saved items are previewed as merged by `itemType + itemId`.
- AI question history remains optional and is skipped unless the user consents.
- My Farm sync requires explicit consent.

The real backend should preserve this behavior and only update local sync markers after a confirmed backend success.

## M17 Phone Ownership Gate

M17 adds a phone mock session so the product can prove that sync needs an account owner.

Frontend behavior:

- `/app/auth/phone` creates a local phone mock session after OTP `123456`.
- `/app/auth/sync-preview` keeps the payload visible but disables dry-run sync until the phone mock session exists.
- Account status can show `phone_mock_authenticated`, but this remains mock-only.

Future production behavior:

- Require a real Supabase Auth phone session before cloud sync.
- Verify the authenticated user server-side.
- Do not trust a user ID from the browser.
- Only mark Guest Memory as synced after backend success.
- Keep local data if OTP, auth, or sync fails.

## M18 Table Mapping

M18 adds a SQL draft pack for the future cloud tables used by this sync plan:

- `saved_items`
- `likes`
- `followed_topics`
- `farm_records`
- `recent_ai_questions`
- `auth_link_events`
- `guest_sync_events`

The sync endpoint should write through a backend or Supabase Edge Function after real auth is verified. Local Guest Memory should remain untouched until the backend confirms success, and AI question history should remain optional.

## M19 LINE Linking Rule

LINE can help users return from shared LINE content, but Guest Memory sync should attach only to a clear account owner.

Rules:

- Phone is the primary recovery path.
- LINE can link to an existing phone account after confirmation.
- LINE-only preview should recommend adding phone before real backup.
- Provider conflicts should block sync until the user confirms ownership.
- `auth_link_events` should record future provider linking actions.
- `guest_sync_events` should record sync attempts and merge summaries.

## M28 Phone OTP Staging Dependency

M28 does not enable real sync. It prepares the first phone OTP staging checklist at `/app/auth/phone-staging`.

Before Guest Memory can sync to cloud:

- Supabase phone OTP must pass staging with real session ownership.
- `auth.uid()` must match the owner in RLS.
- Redirect URLs must return users to a clear account status screen.
- SMS provider cost and rate limits must be configured.
- `VITE_ENABLE_CLOUD_SYNC=false` must remain until ownership, consent, merge, rollback, and audit rules pass.
- The frontend must never hold a service-role key.

## M29 Guest Sync Edge Function Dependency

The first real cloud sync endpoint should be a backend-owned Supabase Edge Function named `guest-memory-sync`.

Before enabling it:

- Deploy only to staging.
- Require a valid Supabase user session.
- Keep the service-role key only inside the Edge Function.
- Require an idempotency key for every sync attempt.
- Store a sync audit event with consent snapshot and merge counts.
- Reject missing auth, invalid payloads, cross-owner attempts, and duplicate idempotency misuse.
- Keep local Guest Memory preserved after success, partial success, or rejection until a later synced-marker policy is implemented.

M29 adds the contract and test plan only. It does not deploy or call the endpoint.
