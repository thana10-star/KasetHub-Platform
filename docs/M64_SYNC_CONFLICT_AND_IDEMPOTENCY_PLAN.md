# M64 Sync Conflict And Idempotency Plan

M64 previews conflict handling and idempotency without uploading data.

## Idempotency Preview

The dry-run payload includes:

- `syncRequestId`
- `idempotencyKey`
- duplicate handling preview
- key scope: `guest_plus_owner_preview`

The key is a local preview. A future backend must generate or verify a server-trusted idempotency key bound to the real owner id.

## Conflict Preview

Planned merge policies:

- Saved items: merge by `itemType + itemId`.
- Farm records: keep both unless the same local id is already synced.
- Recent AI questions: sync only with optional explicit consent.
- Crop watches: merge by crop key and preferred market.
- Calculator saved results: safe summary only, merge by local summary id.
- Followed topics: merge by topic id.
- Likes: `true` wins.

## Retry Rule

Retrying the same request must not create duplicate cloud records. Partial success must be resumable. Local Guest Memory must remain intact until backend success is confirmed.

## M64 Boundary

No idempotency row, conflict row, sync row, or audit row is written in M64.
