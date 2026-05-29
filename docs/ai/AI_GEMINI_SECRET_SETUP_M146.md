# AI Gemini Secret Setup M146

Status: production secret setup checklist only. This document does not enable live Gemini, does not add a real provider key value, and does not change runtime behavior.

## Purpose

M146 prepares the owner path for storing `GEMINI_API_KEY` safely in Cloudflare Pages while KasetHub AI remains non-live:

- Gemini is still dry-run/mock only.
- `AI_LIVE_ENABLED=false` must remain the production value.
- The app must not call Gemini or OpenAI.
- The frontend must never receive a provider secret.

Cloudflare Pages Functions expose variables, secrets, and bindings through `context.env`, and Cloudflare secrets are encrypted values used for sensitive data such as API keys. Cloudflare notes that secrets are not visible after they are set and are accessed programmatically through `context.env`.

References:

- [Cloudflare Pages Functions bindings](https://developers.cloudflare.com/pages/functions/bindings/)
- [Cloudflare Pages Functions API reference](https://developers.cloudflare.com/pages/functions/api-reference/)

## Owner Steps In Cloudflare Pages

1. Open the Cloudflare dashboard.
2. Go to Workers & Pages.
3. Select the KasetHub Pages project.
4. Open Settings.
5. Open Variables and Secrets.
6. Add or confirm the production variables below.
7. Add `GEMINI_API_KEY` only as an encrypted secret.
8. Redeploy after changes so Pages Functions receive the updated `context.env`.
9. Run the M146 production dry-run verification before any future live milestone.

## Production Variables

Set these as Cloudflare Pages production variables, not frontend provider secrets:

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

Important M146 rule:

```text
AI_LIVE_ENABLED=false
```

Do not set `AI_LIVE_ENABLED=true` in production for M146.

## Production Secret

Add this only as a Cloudflare encrypted secret:

```text
GEMINI_API_KEY=<set in Cloudflare as encrypted secret only>
```

This placeholder is not a key value. Do not paste the real key into this repo or into any document.

M146 current runtime note:

- `GEMINI_API_KEY` is not required by current code.
- `GEMINI_API_KEY` is not read by the dry-run Gemini adapter.
- Adding the secret in Cloudflare must not activate live Gemini.
- Production remains dry-run because `AI_LIVE_ENABLED=false` and live Gemini execution is not implemented.

## Frontend Production Variable

Set this only if the owner wants `/app/ai` to call the backend contract in production:

```text
VITE_AI_BACKEND_CONTRACT_ENABLED=true
```

This is a frontend-safe boolean flag. It is not a provider key and does not enable live Gemini.

## Forbidden Frontend Variables

Do not configure these in Cloudflare Pages frontend/build variables:

```text
VITE_GEMINI_API_KEY
VITE_OPENAI_API_KEY
VITE_AI_PROVIDER_SECRET
```

Also forbid any provider secret under any `VITE_` prefix. Vite exposes `VITE_` values to frontend code.

## Never Paste The Real Key Into

- source code
- docs
- reports
- tests
- `.env`
- `.env.*`
- `.dev.vars`
- committed shell history
- issue comments
- screenshots
- chat logs
- frontend variables
- browser-visible config
- API responses
- logs that may be copied into tickets

If unsure, do not add the key yet.

## Expected Production Behavior After Secret Setup

With:

```text
AI_PROVIDER=gemini
AI_LIVE_ENABLED=false
```

Expected backend response for normal safe prompts:

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

Both are acceptable in M146 if:

- copy is Thai and non-technical
- there is no live Gemini claim
- no model internals are exposed
- no provider secret is exposed
- high-risk chemical prompts remain blocked

## Stop Conditions

Stop and roll back to the previous production variable state if any smoke test shows:

- live Gemini output
- provider name/model internals in user copy
- API key text or key-like value
- stack trace
- raw provider error
- `AI_LIVE_ENABLED=true`
- high-risk chemical dosage or mixing instructions

