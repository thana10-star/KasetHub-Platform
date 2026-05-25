# M63 Guest Memory Sync Consent And Idempotency

Guest Memory sync must be deliberate and retry-safe.

## Consent Requirements

- Explain what will be uploaded.
- Explain which account receives the data.
- Let users choose data groups where practical.
- Confirm that local data is not deleted until backend success is confirmed.
- Store consent evidence on the backend in a future milestone.

## Idempotency Requirements

- Every sync request needs an idempotency key.
- The key must be bound to the real owner id on the backend.
- Retrying the same request must not create duplicate rows.
- Partial success must be resumable.
- Duplicate saved items, likes, follows, and farm records need stable merge keys.

## M63 Boundary

M63 displays these requirements only. It does not capture real consent, create idempotency rows, or upload data.

## M64 Dry-run Preview

M64 turns the consent and idempotency plan into a local preview:

- data group consent toggles
- consent timestamp preview
- sync request id preview
- idempotency key preview
- duplicate handling preview
- local-only warning

The preview is not real consent evidence and does not enable upload.
