# Calculator AI Edge Dry-run Plan

M60 prepares a staging-only dry-run plan for the future `calculator-ai-explain` Supabase Edge Function. This is still planning only: no endpoint is deployed, no fetch runs, no provider is called, and no Supabase rows are written.

## Env Flags

Default values:

```env
VITE_CALCULATOR_AI_EDGE_URL=
VITE_ENABLE_CALCULATOR_AI_EDGE_DRY_RUN=false
VITE_ENABLE_CALCULATOR_AI_EDGE_NETWORK=false
```

These flags are separate from the M57 adapter flags. A configured URL alone is not enough. A network flag alone is not enough. Even with dry-run and network flags enabled, M60 still returns `fetchWouldRun: false`.

## Readiness Checks

The local plan checks:

- endpoint URL missing or present
- dry-run flag false or true
- edge network flag false or true
- calculator AI adapter mode and backend/network flags
- auth/session ownership not ready
- provider key must be server-only
- service-role key must never be frontend
- production remains blocked

## Dry-run Output

`buildCalculatorAIEdgeDryRunPlan()` returns:

- readiness mode and label
- masked endpoint URL status
- secret checklist
- validation fixture cases
- audit dry-run preview
- rate-limit dry-run preview
- production blockers
- `canCallEndpoint: false`
- `fetchWouldRun: false`
- `noRealEndpointCall: true`

## Current Boundary

M60 does not add a real endpoint URL, fetch implementation, Edge Function deployment, provider key, service-role key, Supabase write, or production behavior.
