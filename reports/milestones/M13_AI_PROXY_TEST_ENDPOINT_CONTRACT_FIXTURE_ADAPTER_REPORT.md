# M13 AI Proxy Test Endpoint Contract + Fixture Adapter Report

## Summary

M13 adds a test-only AI proxy adapter layer so KasetHub screens can switch between local fixtures and a future backend proxy without changing UI code. Local fixture mode remains the default. Backend modes return safe disabled/test-not-ready responses, and no real AI API, backend server, Supabase write, image upload, provider key, or network request is added.

## Files Changed

- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/AI_BACKEND_PROXY_CONTRACT.md`
- `docs/AI_MOCK_PROXY_FIXTURE_LAYER.md`
- `docs/AI_CREDIT_AD_UNLOCK_STRATEGY.md`
- `docs/AI_PROXY_ADAPTER_STRATEGY.md`
- `src/vite-env.d.ts`
- `src/config/env.ts`
- `src/app/App.tsx`
- `src/types/kaset.ts`
- `src/routes/AIPage.tsx`
- `src/routes/AnalyzePage.tsx`
- `src/routes/AICreditsPage.tsx`
- `src/routes/AIProxyStatusPage.tsx`
- `src/routes/ProfilePage.tsx`
- `src/services/ai-proxy/ai-proxy-adapter.types.ts`
- `src/services/ai-proxy/ai-proxy-contract.types.ts`
- `src/services/ai-proxy/ai-proxy-adapter.ts`
- `reports/milestones/M13_AI_PROXY_TEST_ENDPOINT_CONTRACT_FIXTURE_ADAPTER_REPORT.md`

## Routes Added

- `/app/ai-proxy-status`

## Adapter Mode Notes

Supported modes:

- `local_fixture`
- `backend_test_disabled`
- `backend_test_ready`
- `production_disabled`

Default mode is `local_fixture`. Invalid or missing `VITE_AI_PROXY_MODE` also falls back to `local_fixture`.

Adapter methods:

- `askTextQuestion()`
- `analyzePlantImage()`
- `summarizeArticle()`
- `summarizeVideo()`

In `local_fixture` mode, the adapter delegates to the existing M11 mock service. In backend modes, it returns backend-shaped disabled responses and does not call `fetch`.

## Screens Updated

- `/app/ai`
  - Calls the adapter instead of the mock service directly.
  - Shows AI proxy mode, local fixture status, backend-disabled copy, and link to status page.
- `/app/analyze`
  - Calls the adapter instead of the mock service directly.
  - Shows proxy mode inside the future backend flow panel.
- `/app/ai-credits`
  - Links to AI proxy status.
- `/app/profile`
  - Links to AI proxy status.
- `/app/ai-proxy-status`
  - Shows current mode, backend proxy flag, provider key status, environment readiness, supported request types, last local fixture status, and safety notes.

## Feature Flag Notes

New public flags:

```bash
VITE_AI_PROXY_MODE=local_fixture
VITE_ENABLE_AI_BACKEND_PROXY=false
```

Rules:

- App works with no `.env.local`.
- Backend proxy is disabled by default.
- `VITE_ENABLE_AI_BACKEND_PROXY=true` does not trigger network calls in M13.
- Provider keys are never read from frontend ENV.
- Future fetch behavior must be added only inside the adapter boundary and behind explicit flags.

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

- No real AI API
- No real backend server
- No Supabase writes
- No real image upload
- No provider keys
- No network requests by default
- Backend modes are disabled/test-not-ready responses only
- No real server-side credit enforcement yet
- No real AI proxy endpoint is implemented

## Next Recommended Milestone

M14 should create the first test-only backend sync or AI proxy proof of concept with a real local/server boundary behind feature flags. It should keep provider keys server-side, validate credits server-side in dry-run mode, preserve local Guest Memory on failure, and return the same adapter response contract without enabling production AI calls.
