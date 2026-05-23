# AI Proxy Adapter Strategy

M13 adds a test-only AI proxy adapter so KasetHub UI can switch between local fixtures and a future backend proxy without rewriting screen code. It does not call real AI APIs, run a backend server, write to Supabase, upload images, or expose provider keys.

## Why The Adapter Exists

Before M13, screens called the M11 local mock proxy directly. That was good for fixtures, but it made the UI know too much about where responses came from.

The adapter creates one stable boundary:

- `/app/ai` asks the adapter.
- `/app/analyze` asks the adapter.
- Local fixture responses remain the default.
- Future backend test clients can be added behind flags.
- Production can stay explicitly disabled until ready.

## Modes

Supported modes:

- `local_fixture`
- `backend_test_disabled`
- `backend_test_ready`
- `production_disabled`

Default:

```bash
VITE_AI_PROXY_MODE=local_fixture
VITE_ENABLE_AI_BACKEND_PROXY=false
VITE_ENABLE_LOCAL_AI_PROXY_HANDLER=false
```

If `VITE_AI_PROXY_MODE` is missing or invalid, the app falls back to `local_fixture`.

## Mode Behavior

`local_fixture`:

- Calls the M11 fixture service.
- Makes no network requests.
- Records last local fixture status in localStorage for the status screen.

`backend_test_disabled`:

- Returns a safe disabled response.
- Makes no network requests.
- Useful when a future backend exists but is intentionally off.

`backend_test_ready`:

- Indicates that test mode is requested.
- M14 can call the local in-process handler only if all test flags are enabled.
- Still does not call `fetch`.
- Future milestone can add fetch only behind explicit checks.

`production_disabled`:

- Always returns disabled responses.
- Prevents accidental production provider calls.

## Feature Flag Behavior

Public frontend flags:

- `VITE_AI_PROXY_MODE`
- `VITE_ENABLE_AI_BACKEND_PROXY`
- `VITE_ENABLE_LOCAL_AI_PROXY_HANDLER`

Rules:

- `local_fixture` works without `.env.local`.
- Backend requests are disabled by default.
- `VITE_ENABLE_AI_BACKEND_PROXY=true` alone does not trigger network calls.
- `VITE_ENABLE_LOCAL_AI_PROXY_HANDLER=true` only enables the in-process handler when mode is `backend_test_ready`.
- Provider keys are never read from frontend ENV.

## M14 Local Backend Boundary

M14 adds `src/services/ai-proxy/ai-proxy-backend-test-client.ts` and `src/server/ai-proxy/mock-ai-proxy-handler.ts`.

This path:

- receives backend-style request objects
- validates credit snapshots
- returns accepted/rejected status
- returns the same AI proxy response contract
- mutates no credits
- writes no Supabase data
- uploads no images
- calls no network

This is a prototype boundary, not production backend code.

## No Frontend Provider Keys

The frontend must never contain:

- OpenAI API keys
- Gemini API keys
- Supabase service-role keys
- provider fallback secrets
- model vendor credentials

Provider keys belong only in backend services, secure API routes, or Supabase Edge Functions.

## Future Fetch Boundary

A future backend client can be added inside `src/services/ai-proxy/ai-proxy-adapter.ts`, but only when:

- test endpoint exists
- auth/session handling is defined
- credit validation is backend-owned
- request payloads are validated
- provider keys stay server-side
- failures return the same response contract

Frontend screens should continue to consume:

- `askTextQuestion()`
- `analyzePlantImage()`
- `summarizeArticle()`
- `summarizeVideo()`

## Adding A New AI Endpoint Safely

1. Add request and response contract types.
2. Add fixture behavior in the M11 mock proxy.
3. Add adapter method or route branch.
4. Return disabled responses for backend modes until endpoint is ready.
5. Add UI status copy.
6. Document backend contract and safety policy.
7. Add tests or route checks before enabling any network path.

## M13 Boundary

M13 is an adapter and contract layer. It makes no real network calls and does not enable real AI, Supabase writes, uploads, auth, or provider keys.

## M30 Internal MVP Snapshot

M30 classifies AI / Plant analysis as `needs_real_api` with critical risk in the MVP readiness audit. This is intentional: the UI and contracts are ready for controlled staging work, but the product must not imply real AI diagnosis, real image upload, or production model behavior.

Before any AI staging endpoint is enabled, keep provider keys backend-owned, enforce credits server-side, log safety events, and preserve the existing disabled/local fixture fallback.
## M36 Phase Decision Note

M36 recommends Supabase staging first, then phone auth and Guest Sync, before AI provider work. If demo value is the priority, AI text proxy can move earlier on `staging/ai-proxy`, but only with backend-owned provider secrets, cost caps, rate limits, safety logs, and fixture fallback. Plant vision should wait until text proxy, image privacy, upload/storage, and expert escalation boundaries are ready.
