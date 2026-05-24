# Calculator AI Network Boundary Rules

M58 keeps calculator AI explanations in local planning mode. These rules define what must be true before any future network path is allowed.

## Default Rule

No network is allowed by default.

Default flags:

```env
VITE_CALCULATOR_AI_MODE=local_fixture
VITE_ENABLE_CALCULATOR_AI_BACKEND=false
VITE_ENABLE_CALCULATOR_AI_NETWORK=false
```

## Allowed Future Network Shape

The only acceptable future network shape is:

```text
Frontend adapter
-> backend-owned route or Edge Function
-> backend policy check
-> backend prompt builder
-> AI provider from backend secret boundary
-> backend safety filter
-> frontend display
```

The frontend must not call an AI provider directly.

## Hard Blocks

The adapter/backend must block:

- missing locked result values
- oversized payloads
- invalid crop profile context
- locked hash mismatch
- policy version mismatch
- sponsor or affiliate insertion
- chemical product recommendation
- deterministic result mutation
- hidden recommendation injection

## Formula Boundary

AI explanations can only echo locked values. They must not recompute formulas, change calculator outputs, or add recommendations that were not produced by reviewed deterministic logic.

## Sponsor Boundary

Sponsor or affiliate content must stay outside calculator AI prompts and results. Future sponsored surfaces must be labeled, separate, audited, and must not influence deterministic outputs, policy versions, or AI explanations.

## M58 Status

`backend_test_ready` is still a contract gate. Even when future flags are set, M58 has no endpoint URL and no provider integration. Network remains inactive unless a later milestone explicitly adds and tests a backend-owned path.

## M59 Edge Contract Status

M59 names the future endpoint `calculator-ai-explain`, but it still does not add a URL, fetch call, deployed Edge Function, provider key, service-role key, or default network path.

The typed Edge contract can preview request/response payloads only. Any future live call must still pass explicit staging flags and server-side checks for auth, lock hash, policy version, audit logging, rate limits, timeout behavior, and safety filtering.

## M60 Dry-run Network Boundary

M60 adds dry-run flags:

- `VITE_CALCULATOR_AI_EDGE_URL`
- `VITE_ENABLE_CALCULATOR_AI_EDGE_DRY_RUN`
- `VITE_ENABLE_CALCULATOR_AI_EDGE_NETWORK`

Rules:

- endpoint URL alone is not enough
- network flag alone is not enough
- dry-run flag plus network flag still does not fetch in M60
- production remains blocked
- provider keys and service-role keys remain forbidden in frontend config
