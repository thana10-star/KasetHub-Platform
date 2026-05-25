# AI Text Endpoint Dry-run Plan

M82 dry-run proves that frontend builds still cannot call the AI text endpoint or provider.

Gating rules:

- Endpoint URL alone is not enough.
- Network flag alone is not enough.
- AI text mode alone is not enough.
- `production_disabled` blocks all calls.
- Provider keys and service-role keys are rejected from frontend config.
- M82 dry-run never calls the provider.

Default env:

```env
VITE_AI_TEXT_ENDPOINT_URL=
VITE_ENABLE_AI_TEXT_ENDPOINT_DRY_RUN=false
VITE_ENABLE_AI_TEXT_ENDPOINT_NETWORK=false
```

Dry-run output:

- Masked endpoint URL status.
- Request/response contract preview.
- Audit preview with no Supabase write.
- Rate-limit preview with no Supabase write.
- Timeout fallback that cannot mutate calculator output.
- Production blockers.
