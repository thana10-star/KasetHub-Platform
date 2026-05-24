# M62 Phone Auth Session Ownership Review

M62 can represent a Supabase Phone Auth staging session, but it does not allow Guest Memory sync yet.

## Ownership States

- `guest_only`: no session exists.
- `local_mock_phone`: local mock phone session exists, but it is not real ownership.
- `supabase_phone_staging`: Supabase Phone Auth staging session preview exists.

## Sync Rule

`syncAllowed` remains `false` for every state in M62.

Future sync requires:

- real Supabase session
- server-side `auth.uid()` ownership check
- owner-scoped RLS validation
- user consent
- backend idempotency key
- audit log
- rollback path

## Masking Rule

UI may show:

- masked user id
- masked phone number
- token presence booleans

UI must not show:

- access token
- refresh token
- OTP code
- service-role key
- full user id in screenshots or reports

## Why Mock Session Is Not Enough

The local mock session proves UX only. It does not prove Supabase Auth ownership, cannot pass RLS, and must never unlock cloud sync.

## M63 Follow-up

M63 adds the ownership/RLS sync gate and keeps `syncAllowed=false` even if a real staging session preview exists.

The gate checks consent, idempotency, audit logging, service-role separation, and owner-scoped RLS expectations before any future Guest Memory upload milestone.
