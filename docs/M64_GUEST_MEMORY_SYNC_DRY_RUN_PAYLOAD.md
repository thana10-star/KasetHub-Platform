# M64 Guest Memory Sync Dry-run Payload

M64 prepares the first safe local-only payload builder for future Guest Memory sync.

## Scope

- No Guest Memory upload.
- No cloud sync.
- No Supabase app table writes.
- No Edge Function deployment.
- No service-role key in frontend.
- No production auth enablement.
- No automatic SQL execution.

## App Route

- `/app/guest-sync-dry-run`

The route shows local data groups, record counts, consent preview, idempotency preview, audit preview, conflict preview, privacy filters, blockers, and `ยังไม่อัปโหลดข้อมูลจริง`.

## Payload Groups

The dry-run payload can preview:

- `savedItems`
- `farmRecords`
- `recentAiQuestions`
- `cropWatches`
- `calculatorSavedResults`
- `followedTopics`
- `likes`

Calculator saved results are included as safe summaries only. Raw calculator share text, full input recap, hidden recommendation content, or backend-only fields must not be treated as trusted cloud records.

## Upload Boundary

`buildGuestSyncDryRunPayload()` always returns:

- `dryRun: true`
- `uploadAllowed: false`
- `noSupabaseWrite: true`
- `noCloudSync: true`
- `noRawPhotos: true`

M64 is a preview milestone only. Future upload still requires real Supabase ownership, owner-scoped RLS checks, explicit consent, idempotency, audit logging, conflict handling, and backend-owned validation.
