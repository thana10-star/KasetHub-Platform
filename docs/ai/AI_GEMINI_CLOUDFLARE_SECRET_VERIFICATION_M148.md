# AI Gemini Cloudflare Secret Verification M148

Status: verification runbook only. M148 does not enable live Gemini, does not add a provider key value, and does not change runtime behavior.

## Purpose

This runbook verifies that the KasetHub Cloudflare Pages production project can hold `GEMINI_API_KEY` safely as a backend-only encrypted secret before any future owner-approved live smoke test.

Cloudflare documents Pages Function secrets as encrypted text values that are not visible after they are set and are accessed programmatically through `context.env`.

References:

- [Cloudflare Pages Functions bindings](https://developers.cloudflare.com/pages/functions/bindings/)
- [Cloudflare Workers environment variables and secrets](https://developers.cloudflare.com/workers/configuration/environment-variables/)

## Cloudflare Pages Project

```text
Project: KasetHub
Production URL: https://kasethub.pages.dev
Backend endpoint: /api/ai/farmer-assistant
```

## Required Production Variables

Set these in Cloudflare Pages production variables:

```text
AI_PROVIDER=gemini
AI_LIVE_ENABLED=false
AI_MODEL=<verify before live test>
AI_TIMEOUT_MS=12000
AI_PROVIDER_TIMEOUT_MS=8000
AI_MAX_INPUT_CHARS=1200
AI_MAX_OUTPUT_TOKENS=700
AI_DAILY_LIMIT_GUEST=5
AI_DAILY_LIMIT_SIGNED_IN=20
AI_COOLDOWN_SECONDS=20
```

Important:

- `AI_LIVE_ENABLED=false` must remain the production value throughout M148.
- `AI_MODEL` must be verified against current Gemini documentation before the future live test.
- These backend variables do not belong in frontend `VITE_*` variables unless explicitly marked frontend-safe.

## Required Secret

Add or verify this as a Cloudflare encrypted secret only:

```text
GEMINI_API_KEY
```

Do not paste the real key into:

- source code
- docs
- reports
- tests
- `.env`
- `.env.*`
- `.dev.vars`
- shell scripts
- screenshots
- issue comments
- chat messages
- frontend/build variables
- browser-visible config

## Frontend-Safe Variable

Only this frontend flag is allowed for the AI backend contract:

```text
VITE_AI_BACKEND_CONTRACT_ENABLED=true
```

It does not contain provider credentials and does not enable live Gemini by itself.

## Forbidden Frontend Variables

Do not set:

```text
VITE_GEMINI_API_KEY
VITE_OPENAI_API_KEY
VITE_AI_PROVIDER_SECRET
```

Also forbid any provider secret under any `VITE_` prefix.

## Dashboard Verification Checklist

Use Cloudflare dashboard:

1. Open Workers & Pages.
2. Select the KasetHub Pages project.
3. Open Settings.
4. Open Variables and Secrets.
5. Select the production environment.
6. Confirm every required production variable is present.
7. Confirm `AI_LIVE_ENABLED=false`.
8. Confirm `GEMINI_API_KEY` exists as a secret/encrypted value.
9. Confirm the secret value is not visible in the dashboard after saving.
10. Confirm no forbidden frontend provider secret is present.
11. Redeploy only if Cloudflare indicates variable/secret changes require a new deployment.

Stop if:

- `AI_LIVE_ENABLED=true`
- a provider key appears as a plain variable instead of a secret
- a provider key appears under a `VITE_` name
- the real key has been pasted into any repo file

## Repository Verification Checklist

Run locally before live smoke:

```powershell
git status --short
git diff --cached --name-only
git diff --cached | findstr /i "GEMINI_API_KEY VITE_GEMINI_API_KEY VITE_OPENAI_API_KEY VITE_AI_PROVIDER_SECRET"
git log --all --oneline --decorate -- . ":!graphify-out"
git log -p --all -G "GEMINI_API_KEY|VITE_GEMINI_API_KEY|VITE_OPENAI_API_KEY|VITE_AI_PROVIDER_SECRET" -- . ":!graphify-out"
```

Expected:

- no staged files containing provider secret values
- no frontend provider key names added
- no real provider key value in git history
- `CONTEXT.md` and `graphify-out` are not modified by this check

If the owner wants to search for the exact real key, do it only in a private local shell and do not paste the key or output into docs, reports, chat, tickets, or screenshots.

## Browser Verification Checklist

After production dry-run deploy:

1. Open `https://kasethub.pages.dev/app`.
2. Open `https://kasethub.pages.dev/app/ai`.
3. Open browser developer tools.
4. Search page source and loaded scripts for forbidden frontend variables.
5. Submit a safe AI question only if `VITE_AI_BACKEND_CONTRACT_ENABLED=true`.
6. Inspect the network response from `/api/ai/farmer-assistant`.
7. Confirm no response contains provider secrets, key names, raw provider errors, model internals, `undefined`, or `null`.
8. Confirm output is dry-run/mock or not-configured, not live Gemini.

## Endpoint Verification Checklist

Use the M146 or M148 dry-run smoke commands against:

```text
https://kasethub.pages.dev/api/ai/farmer-assistant
```

Expected while `AI_LIVE_ENABLED=false`:

- normal safe prompt returns dry-run/mock or not-configured
- high-risk chemical prompt returns blocked/high_risk
- no live Gemini claim
- no provider secret exposure
- no stack trace or raw provider wording

## Log Verification Checklist

During dry-run verification:

- do not log raw full question/answer by default
- do not log `GEMINI_API_KEY`
- do not log key-looking values
- do not log request headers containing secrets
- do not log raw provider error bodies

If logs show any secret, stop, rotate the key, and do not continue to live smoke.

## Pass Criteria

M148 secret verification passes only if:

- `GEMINI_API_KEY` exists as Cloudflare encrypted secret only
- `AI_LIVE_ENABLED=false`
- no frontend provider secret exists
- no repo file contains a real key value
- no browser-visible response exposes secrets
- no production response claims live Gemini output
- rollback remains a single config action: set `AI_LIVE_ENABLED=false`
