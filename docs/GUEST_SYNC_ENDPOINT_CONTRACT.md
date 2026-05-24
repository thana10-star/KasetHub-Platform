# Guest Memory Sync Endpoint Contract

M07 defines the future backend-owned sync boundary. It does not add a real endpoint, Supabase Edge Function, auth, or network call.

## Endpoint Options

Preferred API route:

```http
POST /api/guest-memory/sync
```

Supabase Edge Function option:

```text
guest-memory-sync
```

The browser should call only a backend-owned endpoint after real auth and user consent exist. The endpoint can then use secure server credentials to merge Guest Memory into cloud tables.

## Request Payload

```json
{
  "endpointVersion": "2026-05-m07",
  "dryRun": true,
  "guestId": "guest_local_123",
  "authProviderCandidate": "phone",
  "consent": {
    "savedItems": true,
    "farmRecords": true,
    "recentAIQuestions": false
  },
  "localState": {
    "version": 1,
    "updatedAt": "2026-05-22T10:00:00.000Z"
  },
  "records": {
    "savedItems": [],
    "likes": [],
    "followedTopics": [],
    "farmRecords": [],
    "recentAIQuestions": []
  },
  "conflictPolicy": {
    "savedItems": "merge_by_item_type_and_item_id",
    "likes": "or_true_wins",
    "followedTopics": "merge_by_topic_id",
    "farmRecords": "keep_both_unless_same_local_id",
    "recentAIQuestions": "optional_user_consent",
    "profile": "cloud_wins_guest_name_suggested"
  }
}
```

## Response Payload

```json
{
  "success": true,
  "syncRunId": "sync_20260522_001",
  "dryRun": true,
  "userId": "future-user-id",
  "linkedGuestId": "guest_local_123",
  "created": {
    "savedItems": 2,
    "likes": 1,
    "followedTopics": 1,
    "farmRecords": 1,
    "recentAIQuestions": 0,
    "estimatedTotal": 5
  },
  "merged": {
    "savedItems": 0,
    "likes": 0,
    "followedTopics": 0,
    "farmRecords": 0,
    "recentAIQuestions": 0,
    "estimatedTotal": 0
  },
  "skipped": {
    "savedItems": 0,
    "likes": 0,
    "followedTopics": 0,
    "farmRecords": 0,
    "recentAIQuestions": 1,
    "estimatedTotal": 1
  },
  "warnings": ["ประวัติคำถาม AI ไม่ถูกซิงก์เพราะผู้ใช้ยังไม่ยินยอม"],
  "nextAction": "sync_complete"
}
```

## Validation Rules

- Require an authenticated user before non-dry-run sync.
- Require `guestId`, `endpointVersion`, `authProviderCandidate`, and `consent`.
- Accept `authProviderCandidate` values: `phone`, `line`, `google`.
- Reject `email` for the farmer-first initial auth flow.
- Validate `localState.version` against supported Guest Memory migrations.
- Validate each record shape server-side before insert.
- Enforce maximum payload size and maximum records per request.
- Strip or reject unknown sensitive fields, tokens, raw files, or large image payloads.

## Consent Rules

- `consent.savedItems=true` is required to sync saved items, likes, and followed topics.
- `consent.farmRecords=true` is required to sync My Farm records.
- `consent.recentAIQuestions=true` is optional and required only if AI history should be uploaded.
- If optional AI consent is false, the backend should skip AI history without failing the whole sync.
- Consent timestamp and source route should be recorded in an audit field or `auth_link_events`.

## Duplicate Merge Rules

- Saved items: merge by `user_id + item_type + item_id`.
- Likes: OR/true wins by `user_id + item_type + item_id`.
- Followed topics: merge by stable topic ID or normalized topic key.
- Farm records: keep both unless the same `local_id` already exists for the user.
- Recent AI questions: only create records when consent is true; dedupe by `local_id` when provided.

## Conflict Handling

- Preserve local timestamps such as `savedAt`, `likedAt`, `followedAt`, `createdAt`, and `askedAt`.
- Add server timestamps such as `synced_at` and `created_at` without overwriting local event time.
- Cloud profile wins for profile fields, but guest display name can be suggested to the user.
- If sync partially fails, return per-section created/merged/skipped counts and keep local Guest Memory untouched.

## Rate Limit Notes

- Limit sync attempts per user and guest ID.
- Add stricter limits for unauthenticated dry-run preview endpoints.
- Use idempotency keys in a future implementation to avoid duplicate writes after retries.
- Monitor payload size, record count, and repeated failed attempts.

## Security Notes

- Never expose a Supabase service role key in frontend code or Vite ENV.
- Service role access belongs only in a backend API route or Supabase Edge Function.
- Require real auth before writes.
- Verify the authenticated user ID server-side; do not trust a `userId` from the browser.
- Sanitize text fields and metadata before writing.
- Do not sync AI history unless the user explicitly allows it.

## RLS Notes

- User-owned tables should enforce `auth.uid() = user_id`.
- Backend sync can use service role in an Edge Function, but must still apply application-level ownership checks.
- Public content tables such as articles and videos can remain read-only for normal users.
- Admin/moderator roles should be separate from farmer accounts.

## M07 Frontend Boundary

`src/services/backend/guest-sync-payload-builder.ts` creates dry-run payload previews only. It does not fetch, post, write to Supabase, or mutate Guest Memory.

## M16 Mock Handler Response Shape

M16 adds a backend-shaped response preview for the same future endpoint.

Additional response fields used by the proof of concept:

- `syncRequestId`
- `status`: `success`, `partial_success`, `rejected`, or `failed`
- `createdProfilePreview`
- `mergeSummary`
- `skippedRecords`
- `conflictSummary`
- `warnings`
- `retryable`
- `createdAt`

Fixture scenarios:

- `success`
- `partial_success`
- `duplicate_merge`
- `missing_consent`
- `failed_retryable`

The mock handler is intentionally no-write. It exists so the frontend can test merge and failure handling before a real backend route or Supabase Edge Function exists.

Production sync must keep service-role access server-side only and must never delete local Guest Memory after a failed request.

## M18 Database Draft Alignment

The future `POST /api/guest-memory/sync` or `guest-memory-sync` Edge Function should write to:

- `profiles`
- `saved_items`
- `likes`
- `followed_topics`
- `farm_records`
- `recent_ai_questions`
- `auth_link_events`
- `guest_sync_events`

M18 includes `guest_sync_events` so sync attempts can be audited without trusting the browser. The frontend must never send or receive a service-role key. Backend code must verify `auth.uid()`, consent fields, duplicate merge keys, idempotency, and rate limits before writing.

## M19 Provider Linking Before Sync

When LINE Login is added for real, the sync endpoint should receive only an authenticated account context from the backend/auth layer. It should not trust a `lineUserId`, `phoneNumber`, or `userId` sent directly from the browser.

Required checks:

- Confirm phone/LINE provider ownership server-side.
- Confirm account-linking consent when adding LINE to a phone account.
- Reject duplicate provider conflicts until the user confirms ownership.
- Keep phone as the primary recovery path when both phone and LINE exist.
- Write `auth_link_events` for provider link/unlink attempts.
- Preserve local Guest Memory on failed or rejected sync.

## M29 Edge Function Contract

M29 narrows the first real sync endpoint plan to a Supabase Edge Function:

- endpoint name: `guest-memory-sync`
- method: `POST`
- future path: `/functions/v1/guest-memory-sync`
- auth requirement: valid Supabase user session
- service-role boundary: service-role key only inside the Edge Function
- frontend: anon key only, no service-role key, no endpoint call in M29

The Edge Function must validate `auth.uid()`, consent, payload version, owner id, idempotency key, duplicate merge rules, and rollback/audit behavior before writing. See `docs/GUEST_SYNC_EDGE_FUNCTION_CONTRACT.md` and `docs/GUEST_SYNC_STAGING_TEST_PLAN.md`.

## M63 Ownership/RLS Gate Dependency

M63 adds the `/app/ownership-rls-gate` review before this endpoint can be used. The endpoint must stay disabled until:

- the request owner is derived from Supabase Auth, not from browser-supplied owner fields
- `owner_id = auth.uid()` is verified server-side
- consent and idempotency are required
- audit logging exists
- owner-scoped RLS checks prove own-only access
- service-role credentials remain backend-only

M63 does not deploy or call the endpoint.
