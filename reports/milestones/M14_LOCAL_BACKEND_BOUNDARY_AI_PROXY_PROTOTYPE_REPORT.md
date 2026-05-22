# M14 Local Backend Boundary AI Proxy Prototype Report

## Summary

M14 creates the first local/test backend boundary for KasetHub AI proxy requests. The app can now prove frontend-to-backend-shaped request flow, server-shaped credit validation, disabled/error handling, and response contract compatibility without real AI providers, provider keys, Supabase writes, image uploads, real auth, production deployment, or network calls by default.

## Files Changed

- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/AI_PROXY_ADAPTER_STRATEGY.md`
- `docs/AI_BACKEND_PROXY_CONTRACT.md`
- `docs/AI_CREDIT_AD_UNLOCK_STRATEGY.md`
- `docs/LOCAL_BACKEND_BOUNDARY_PROTOTYPE.md`
- `src/vite-env.d.ts`
- `src/config/env.ts`
- `src/routes/AIProxyStatusPage.tsx`
- `src/services/ai-proxy/ai-proxy-adapter.types.ts`
- `src/services/ai-proxy/ai-proxy-adapter.ts`
- `src/services/ai-proxy/ai-proxy-backend-test-client.ts`
- `src/server/ai-proxy/mock-ai-proxy.types.ts`
- `src/server/ai-proxy/mock-ai-proxy-handler.ts`
- `reports/milestones/M14_LOCAL_BACKEND_BOUNDARY_AI_PROXY_PROTOTYPE_REPORT.md`

## Env Flags Added

```bash
VITE_ENABLE_LOCAL_AI_PROXY_HANDLER=false
```

The local handler only runs when all are set:

```bash
VITE_AI_PROXY_MODE=backend_test_ready
VITE_ENABLE_AI_BACKEND_PROXY=true
VITE_ENABLE_LOCAL_AI_PROXY_HANDLER=true
```

Default remains:

```bash
VITE_AI_PROXY_MODE=local_fixture
VITE_ENABLE_AI_BACKEND_PROXY=false
VITE_ENABLE_LOCAL_AI_PROXY_HANDLER=false
```

## Adapter Behavior

- `local_fixture` continues to use the existing M11 fixture service.
- `backend_test_disabled` returns safe disabled responses.
- `backend_test_ready` calls the local in-process handler only when all M14 flags are enabled.
- `production_disabled` returns safe disabled responses.
- No adapter path calls `fetch` in M14.
- Provider keys remain unavailable in frontend.

## Mock Handler Behavior

`mock-ai-proxy-handler.ts` accepts backend-shaped requests for:

- text question
- plant image analysis metadata only
- article summary
- video summary

The handler receives:

- requested credit cost
- local/guest credit summary snapshot
- request type
- user/session mode
- scenario metadata

It returns:

- AI proxy response contract
- credit validation result
- accepted/rejected status
- rejection reason for insufficient credit, safety block, or handler failure

The handler does not mutate credits.

## Screens Updated

- `/app/ai-proxy-status`
  - Shows local backend handler enabled/disabled.
  - Shows backend test readiness.
  - Shows current adapter path.
  - Shows no-provider-key and no-network status.
  - Adds developer test panel:
    - text success
    - insufficient credit
    - plant image analysis dry-run
    - failed retryable
  - Shows concise response preview instead of raw large JSON.

## Verification Commands

```bash
npm run lint
npm run build
```

Both commands passed.

Manual route checks returned HTTP 200:

- `/app/ai`
- `/app/analyze`
- `/app/ai-proxy-status`
- `/app/ai-credits`
- `/app/profile`

Local dev server used for checks:

- `http://127.0.0.1:5173/app/ai-proxy-status`

## Known Limitations

- No real OpenAI or Gemini calls
- No real provider keys
- No Supabase writes
- No real image uploads
- No production backend deployment
- No real auth requirement
- No real network calls by default
- Local handler is in-process and bundled for prototype testing
- No trusted server-side credit mutation yet
- No real API route or Edge Function yet

## Next Recommended Milestone

M15 should create a guest-memory sync proof of concept for phone account creation or a true local API route boundary behind feature flags. It should preserve Guest Memory on failure, keep service-role secrets server-side, and prove one real request/response path before adding LINE or Google account linking.
