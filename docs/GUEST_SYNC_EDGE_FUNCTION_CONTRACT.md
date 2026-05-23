# Guest Sync Edge Function Contract

M29 defines the future Supabase Edge Function boundary for syncing local Guest Memory into user-owned cloud rows. This is a contract only. KasetHub does not deploy the function, call the endpoint, enable cloud sync, enable real auth, or write to Supabase in this milestone.

## Endpoint

- Name: `guest-memory-sync`
- Future path: `POST /functions/v1/guest-memory-sync`
- Method: `POST`
- Caller: authenticated browser client with a valid Supabase user session
- Server credential: service-role key inside the Edge Function only
- Frontend credential: anon key only, never service-role

## Authentication Requirement

The request must be rejected unless:

- Supabase session is valid.
- `auth.uid()` resolves to the future owner user id.
- Session provider is an approved provider such as phone, LINE, or Google.
- The request user id matches every row owner that will be created or merged.
- Cloud sync consent is present.

Local phone mock sessions are not enough for the real endpoint.

## Service-Role Boundary

The service-role key must never appear in:

- Vite frontend environment variables.
- `.env.example`, `.env.local`, committed docs, logs, or screenshots.
- Cloudflare Pages public environment variables.
- Browser requests, localStorage, sessionStorage, or source maps.

The service-role key may be configured only as a Supabase Edge Function secret or equivalent backend secret. The Edge Function should use it after validating user session ownership.

## Request Payload

```ts
type GuestSyncEdgeRequest = {
  endpointVersion: '2026-05-m29';
  endpointName: 'guest-memory-sync';
  method: 'POST';
  idempotencyKey: string;
  auth: {
    userId: string;
    provider: 'phone' | 'line' | 'google';
    sessionIssuedAt?: string;
    sessionExpiresAt?: string;
    phoneNumberMasked?: string;
    lineUserId?: string;
    emailMasked?: string;
    isStagingTest: boolean;
  };
  payload: GuestMemorySyncRequestPayload;
  requestedAt: string;
  client: {
    appVersion: string;
    route: string;
  };
};
```

The `payload` reuses the existing Guest Memory dry-run shape from `src/services/backend/guest-sync-endpoint.types.ts`.

## Response Payload

```ts
type GuestSyncEdgeResponse = {
  success: boolean;
  syncRunId: string;
  idempotencyKey: string;
  userId: string;
  status: 'completed' | 'partial_success' | 'rejected' | 'failed_retryable';
  validation: GuestSyncValidationResult;
  mergeResult: GuestSyncMergeResult;
  rollbackPlan: GuestSyncRollbackPlan;
  warnings: string[];
  createdAt: string;
};
```

The response must include per-section created, merged, and skipped counts. The browser should preserve local Guest Memory unless the server confirms success and a later milestone defines a safe synced marker.

## Idempotency Key Rule

Every request must include an idempotency key.

- Key must be scoped to `userId`.
- Reusing the same key with the same payload returns the original result or a no-op response.
- Reusing the same key with a different payload must be rejected.
- Retry after network failure must not create duplicate rows.
- The server should record `userId`, `guestId`, key, request hash, status, counts, and created timestamp.

## Duplicate Merge Rules

- `saved_items`: merge by `itemType + itemId`.
- `likes`: `true` wins.
- `followed_topics`: merge by `topicId`.
- `farm_records`: keep both unless the same local id was already synced.
- `recent_ai_questions`: sync only when explicitly consented.
- Profile: cloud profile wins; guest display name can be suggested as metadata.

## Consent Validation

The Edge Function must validate consent before processing each section.

- Saved items, likes, and followed topics require saved-items consent.
- My Farm requires farm-record consent.
- AI history requires AI-history consent.
- Missing consent should skip that section, not infer permission.
- Consent snapshot should be stored in the sync audit log.

## Partial Success Behavior

Partial success is allowed only when:

- The server can report which sections succeeded.
- Failed sections are retryable without duplication.
- Local Guest Memory remains untouched.
- Audit logs include enough detail for manual cleanup.

The browser should never delete local data after partial success in the current plan.

## Rollback Strategy

Staging rollback should include:

- Disable `VITE_ENABLE_GUEST_SYNC_EDGE`.
- Set `VITE_GUEST_SYNC_EDGE_MODE=disabled`.
- Disable `VITE_ENABLE_CLOUD_SYNC`.
- Revoke affected test sessions if needed.
- Use sync run id and idempotency key to identify created rows.
- Manually clean staging rows by owner user id.
- Log the cleanup and keep screenshots of before/after checks.

Production rollback must not be attempted until a later admin/audit milestone defines approved tooling.

## Audit Log Strategy

Future sync should write append-only audit records for:

- `syncRunId`
- `userId`
- `guestId`
- `idempotencyKey`
- request hash
- consent snapshot
- created/merged/skipped counts
- status
- error code
- actor/source
- created timestamp

Audit rows should be admin/backend-readable only.

## Rate Limiting

Before staging:

- Limit sync attempts per user.
- Limit retries per idempotency key.
- Reject oversized payloads.
- Apply request body size limits.
- Add abuse logging for repeated invalid payloads.

## Ownership Validation

The Edge Function must:

- Read the authenticated Supabase user id from the verified session.
- Ignore any client-supplied owner id when writing rows.
- Set every created row owner to the authenticated user id.
- Refuse cross-user idempotency key reuse.
- Refuse writes when RLS ownership expectations are not verified in staging.

## RLS / Service-Role Boundary

Browser writes remain disabled unless a later milestone explicitly enables them. The Edge Function may use service-role only after validating session ownership. RLS policies must still be reviewed because service-role bypasses RLS; the function becomes responsible for enforcing owner checks.

## M29 Non-Goals

- No Edge Function deployment.
- No endpoint URL.
- No network request.
- No cloud sync.
- No Supabase write.
- No service-role key.
- No real auth.
- No production behavior.

## M30 Internal MVP Snapshot

M30 adds `/app/mvp-snapshot` and classifies Auth / Account / Sync as blocked until real staging auth, SQL/RLS verification, idempotency tests, and rollback checks are complete.

The Edge Function contract remains a future plan only. The snapshot must not deploy, call, or probe `guest-memory-sync`, and local Guest Memory remains the active storage source.
