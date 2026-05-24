# M64 Sync Payload Privacy Filters

M64 adds privacy filters before any future Guest Memory upload exists.

## Excluded Data

The dry-run payload must exclude or filter:

- raw image files
- base64 image blobs
- OTP codes
- Supabase session tokens
- service-role keys
- provider keys
- API keys and private env values
- refresh/access tokens
- password-like or secret-like metadata

## Image Boundary

Guest Memory should store lightweight metadata only. Raw photos and large base64 blobs must stay out of sync payloads. Future photo sync should use a backend-owned media upload flow with private buckets, signed URLs, deletion controls, and owner-scoped RLS.

## Calculator Boundary

Saved calculator summaries can sync only as safe local summaries in a later milestone. They must not be treated as official agronomy recommendations, and they must preserve disclaimers.

## M64 Behavior

The payload builder records filtered field paths in `excludedSensitiveFields` for local review. It does not send those paths to a backend and does not write audit rows.
