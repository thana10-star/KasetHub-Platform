# Calculator AI Staging Flags Plan

M57 defines the flags needed before any future backend calculator AI explanation test. All flags default to local/no-network behavior.

## Default Local State

```env
VITE_CALCULATOR_AI_MODE=local_fixture
VITE_ENABLE_CALCULATOR_AI_BACKEND=false
VITE_ENABLE_CALCULATOR_AI_NETWORK=false
```

This returns deterministic local fixture text only.

## Backend Disabled State

```env
VITE_CALCULATOR_AI_MODE=backend_disabled
VITE_ENABLE_CALCULATOR_AI_BACKEND=false
VITE_ENABLE_CALCULATOR_AI_NETWORK=false
```

The adapter returns a disabled response. No backend client runs.

## Staging Contract-Ready State

```env
VITE_CALCULATOR_AI_MODE=backend_test_ready
VITE_ENABLE_CALCULATOR_AI_BACKEND=true
VITE_ENABLE_CALCULATOR_AI_NETWORK=true
```

This is only a future staging gate. M57 still has no real endpoint URL and no real AI provider call.

M59 names the future Edge Function `calculator-ai-explain`, but still does not add an endpoint URL, fetch path, provider key, or service-role key. The same flags remain a future staging gate only.

Before this mode can be used for real network traffic, a later milestone must add:

- backend-owned endpoint
- provider keys kept out of frontend
- rate limits and abuse controls
- policy version lookup
- snapshot lock hash verification
- safety filter before display
- audit logging plan with RLS review
- Edge Function secret handling for provider and service-role keys

## M60 Edge Dry-run Flags

M60 adds Edge-specific dry-run placeholders:

```env
VITE_CALCULATOR_AI_EDGE_URL=
VITE_ENABLE_CALCULATOR_AI_EDGE_DRY_RUN=false
VITE_ENABLE_CALCULATOR_AI_EDGE_NETWORK=false
```

These flags do not replace the adapter flags. They only let the app show readiness for a future staging dry run.

M60 rules:

- empty URL, dry-run false, and network false is the default
- URL alone is not enough
- network flag alone is not enough
- dry-run flag plus network flag is still not enough to call `fetch`
- provider keys and service-role keys are never accepted in frontend config
- production remains blocked

## Production Disabled State

```env
VITE_CALCULATOR_AI_MODE=production_disabled
VITE_ENABLE_CALCULATOR_AI_BACKEND=false
VITE_ENABLE_CALCULATOR_AI_NETWORK=false
```

Production remains disabled until a future explicit milestone.

## Hard Boundary

Basic calculator results, safety disclaimers, and deterministic formula outputs must remain available without AI, ads, payment, sponsor content, or backend sync.
