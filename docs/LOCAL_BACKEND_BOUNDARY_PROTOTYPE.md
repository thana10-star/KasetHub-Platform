# Local Backend Boundary Prototype

M14 creates the first local/test backend boundary for KasetHub AI proxy requests. It proves frontend-to-backend request flow, server-shaped credit validation, error handling, and response contract compatibility without real AI providers, provider keys, Supabase writes, image uploads, production deployment, or real auth.

## Why This Exists

M11 created local fixture responses. M13 added an adapter so screens do not depend directly on those fixtures. M14 adds a server-shaped handler behind that adapter.

This gives the project a safe middle step before a real API route or Supabase Edge Function exists.

## Local Fixture vs Backend-Shaped Handler

Local fixture:

- frontend-only fixture service
- default mode
- no backend-shaped request envelope
- good for fast UI development

Backend-shaped handler:

- accepts backend-style request objects
- receives requested credit cost
- receives a local credit summary snapshot
- receives request type and session mode
- returns the same AI proxy response contract
- does not mutate credits
- does not call network APIs

## Files

- `src/server/ai-proxy/mock-ai-proxy.types.ts`
- `src/server/ai-proxy/mock-ai-proxy-handler.ts`
- `src/services/ai-proxy/ai-proxy-backend-test-client.ts`

## Flag Requirements

Default:

```bash
VITE_AI_PROXY_MODE=local_fixture
VITE_ENABLE_AI_BACKEND_PROXY=false
VITE_ENABLE_LOCAL_AI_PROXY_HANDLER=false
```

The local handler is only used when all are true:

```bash
VITE_AI_PROXY_MODE=backend_test_ready
VITE_ENABLE_AI_BACKEND_PROXY=true
VITE_ENABLE_LOCAL_AI_PROXY_HANDLER=true
```

Even then, M14 still makes no `fetch` calls. The handler runs in-process as a prototype.

## Credit Validation Ownership

The local handler simulates server-owned validation:

- checks requested credit cost against a credit summary snapshot
- returns `creditValidation`
- accepts or rejects based on available credits
- returns an insufficient-credit reason when needed
- never mutates local credit state

The frontend remains responsible for local mock credit consumption after a successful adapter response. Real production credit mutation must move server-side later.

## Provider Key Safety

Provider keys must never exist in frontend code or Vite ENV.

Allowed future locations:

- server environment
- secure API route
- Supabase Edge Function secret storage

Disallowed:

- `VITE_*` variables
- browser localStorage
- screenshots
- docs
- reports
- frontend source files

## Future Replacement

The in-process handler can later be replaced by:

- local API route
- Supabase Edge Function
- serverless endpoint
- backend service

The replacement should keep response compatibility with the adapter:

- `requestId`
- `status`
- `requestType`
- `creditCost`
- `creditValidation`
- `modelPlan`
- `answer` or `result`
- `safetyDisclaimers`
- `warnings`
- `logsPreview`
- `retryable`
- `createdAt`

## No Production Use Warning

M14 is not production infrastructure. It has no real auth, no real backend deployment, no real provider calls, no real storage, and no trusted server-side credit ledger. It exists to prove boundaries and contracts before those systems are built.
