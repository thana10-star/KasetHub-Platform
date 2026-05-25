# AI Text Provider Key Security

M81 keeps provider secrets out of the app runtime.

Rules:

- No provider key is accepted in frontend config.
- No Supabase service-role key is accepted in frontend config.
- No direct OpenAI, Gemini, Anthropic, or other provider call is made from the browser.
- Provider keys must live only in backend/Edge Function secret storage in a future milestone.
- Audit and rate-limit checks must run server-side before any provider call.

Frontend flags are only mode gates:

```env
VITE_ENABLE_REAL_AI_TEXT=false
VITE_AI_TEXT_MODE=local_fixture
VITE_AI_TEXT_PROXY_MODE=staging_proxy
VITE_ENABLE_AI_TEXT_NETWORK=false
```

These flags do not contain secrets and do not authorize production behavior.

## M82 Endpoint Env Additions

```env
VITE_AI_TEXT_ENDPOINT_URL=
VITE_ENABLE_AI_TEXT_ENDPOINT_DRY_RUN=false
VITE_ENABLE_AI_TEXT_ENDPOINT_NETWORK=false
```

These values still do not contain provider keys. The endpoint URL is masked in UI, and provider/service-role keys remain rejected from frontend config.
