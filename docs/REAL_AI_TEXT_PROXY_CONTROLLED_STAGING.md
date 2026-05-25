# Real AI Text Proxy Controlled Staging

M81 adds the first controlled real AI text proxy integration surface without enabling production AI.

Default behavior:

- `local_fixture`
- no network
- no provider key in frontend
- no service-role key in frontend

Controlled staging path:

- `VITE_ENABLE_REAL_AI_TEXT=true`
- `VITE_AI_TEXT_MODE=staging_proxy_ready`
- `VITE_AI_TEXT_PROXY_MODE=staging_proxy`
- `VITE_ENABLE_AI_TEXT_NETWORK=true`

M81 still does not add a backend endpoint URL, so the staging path returns controlled disabled state until backend ownership, audit, rate limits, safety filtering, and release gates are implemented.

The in-app status route is `/app/ai-text-status`.

## M82 Endpoint Plan

M82 adds `/app/ai-text-endpoint-plan` for the backend-owned endpoint contract and Edge dry-run planning. It shows masked endpoint URL state, request/response contract preview, audit/rate-limit dry-run output, timeout fallback, blocked actions, and production blockers.

M82 still does not add a deployed endpoint or provider call.
