# Calculator AI Edge Secret Checklist

M60 keeps calculator AI dry-run secrets out of the frontend.

## Required Secret Rules

- AI provider keys live only in backend or Edge Function secret stores.
- Supabase service-role keys live only in backend or Edge Function secret stores.
- Vite env must not contain provider keys.
- Vite env must not contain service-role keys.
- Saved calculator summaries must not contain secrets.
- Share/export text must not contain secrets.
- Route params and localStorage must not contain secrets.

## Accepted Frontend Env

The frontend may contain only non-secret dry-run flags:

```env
VITE_CALCULATOR_AI_EDGE_URL=
VITE_ENABLE_CALCULATOR_AI_EDGE_DRY_RUN=false
VITE_ENABLE_CALCULATOR_AI_EDGE_NETWORK=false
```

The URL remains empty by default. If a future staging URL is configured locally, the UI should mask it and still refuse fetch until a later milestone explicitly implements a dry-run client.

## M60 Proof

The M60 plan reports:

- `frontendProviderKeyAccepted: false`
- `frontendServiceRoleAccepted: false`
- `canCallEndpoint: false`
- `fetchWouldRun: false`
- `noSupabaseWrite: true`

Any future endpoint work must preserve these rules unless a reviewed staging milestone explicitly changes behavior.
