# AI Cloudflare Gemini Env Setup M144

Status: production setup guidance only. This document does not enable live Gemini, does not add a provider key value, and does not change runtime behavior.

## Purpose

Prepare Cloudflare Pages production configuration for the Gemini-first farmer assistant contract while keeping the backend in disabled or dry-run mode.

For M144, production must prove the contract boundary, not live AI quality:

- `/api/ai/farmer-assistant` exists.
- `/app/ai` may call the backend only when the frontend-safe flag is enabled.
- `AI_PROVIDER=gemini` may return the current dry-run/mock response.
- `AI_LIVE_ENABLED=false` must remain the production setting.
- No Gemini network request should happen.
- No provider secret should ever appear in frontend code, browser source, network payloads, docs, reports, or git history.

## Cloudflare Pages Location

Use the Cloudflare dashboard:

1. Open Cloudflare dashboard.
2. Go to Workers & Pages.
3. Select the KasetHub Pages project.
4. Go to Settings > Variables and Secrets.
5. Add the production variables below.
6. Add `GEMINI_API_KEY` only as an encrypted secret.
7. Redeploy after changing variables or secrets so Pages Functions receive the updated `context.env`.

Cloudflare's Pages Functions docs describe environment variables and secrets as bindings available to Functions through `context.env`. Secrets are encrypted and are intended for sensitive values such as API keys.

References:

- [Cloudflare Pages Functions bindings](https://developers.cloudflare.com/pages/functions/bindings/)
- [Cloudflare Pages Functions API reference](https://developers.cloudflare.com/pages/functions/api-reference/)

## Production Variables

Set these as production variables, not frontend secrets:

```text
AI_PROVIDER=gemini
AI_LIVE_ENABLED=false
AI_MODEL=<verify current Gemini model before live activation>
AI_TIMEOUT_MS=12000
AI_PROVIDER_TIMEOUT_MS=8000
AI_MAX_INPUT_CHARS=1200
AI_MAX_OUTPUT_TOKENS=700
AI_DAILY_LIMIT_GUEST=5
AI_DAILY_LIMIT_SIGNED_IN=20
AI_COOLDOWN_SECONDS=20
```

M144 rule: do not set `AI_LIVE_ENABLED=true` for production live execution.

Current M143 runtime behavior still cannot call Gemini even if the flag is accidentally set to true, but production should keep the setting false so the rollout record is clean.

## Secret

Add this only in Cloudflare Pages Variables and Secrets with encryption enabled:

```text
GEMINI_API_KEY=<Cloudflare secret only, never committed>
```

Rules:

- Never paste the real value into `.env`, `.env.*`, `.dev.vars`, docs, reports, screenshots, issue comments, chat logs, or code.
- Never add the value to frontend environment variables.
- Never expose the value through API responses, logs, test fixtures, or browser network payloads.
- M144 does not require this secret for the current dry-run behavior. It may be configured ahead of a later owner-approved milestone, but it must not be used by runtime code yet.

## Frontend-Safe Flag

If the owner wants `/app/ai` to call the backend contract in production, set:

```text
VITE_AI_BACKEND_CONTRACT_ENABLED=true
```

This is a frontend-safe boolean flag only. It is not a provider secret and does not authorize live Gemini execution.

If this flag is false or missing, `/app/ai` should keep the local fixture fallback path.

## Forbidden Frontend Env

Do not configure these as frontend variables:

```text
VITE_GEMINI_API_KEY
VITE_OPENAI_API_KEY
VITE_AI_PROVIDER_SECRET
```

Also forbid any provider secret under a `VITE_` prefix. Vite exposes `VITE_` variables to frontend code, so provider credentials must never use that prefix.

## Expected Production State For M144

With `AI_PROVIDER=gemini` and `AI_LIVE_ENABLED=false`, the backend may return:

```text
status=ready
provider=mock
providerMode=dry_run
```

or, if provider variables are not configured:

```text
status=not_configured
provider=disabled
providerMode=disabled
```

Both states are acceptable for M144 if they are safe, Thai, non-technical, and do not claim to be live Gemini output.

## Pre-Deploy Checks

- Confirm production variables are set only in Cloudflare, not committed files.
- Confirm `AI_LIVE_ENABLED=false`.
- Confirm `AI_MODEL` is a placeholder or verified value, but live activation is still blocked.
- Confirm `GEMINI_API_KEY` is encrypted secret only if configured.
- Confirm no forbidden frontend provider env exists.
- Confirm `VITE_AI_BACKEND_CONTRACT_ENABLED=true` only if the owner wants frontend backend-contract mode tested.
- Confirm no Gemini SDK or live request code was added.

## Post-Deploy Checks

- Call `/api/ai/farmer-assistant` with a normal prompt.
- Confirm response is dry-run/mock or not-configured, not live provider output.
- Call the high-risk chemical prompt from the M144 QA guide.
- Confirm `status=blocked` and `safetyLevel=high_risk`.
- Open `/app/ai` and submit a normal question when frontend contract mode is enabled.
- Confirm no browser source or network response contains `GEMINI_API_KEY`, provider key-looking values, stack traces, `undefined`, or `null`.

## Rollback Setting

Rollback is:

```text
AI_LIVE_ENABLED=false
```

For M144 this should already be the active value.

