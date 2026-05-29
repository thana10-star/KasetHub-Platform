# AI Gemini Owner Approval And Rollback M144

Status: approval and rollback checklist only. This document does not approve live Gemini activation.

## Purpose

Define the owner gate that must happen before any future live Gemini activation and preserve the immediate rollback path.

M144 keeps:

```text
AI_LIVE_ENABLED=false
```

## Current M144 Position

- Gemini is the selected primary V1 provider direction.
- Runtime Gemini remains dry-run only.
- No live Gemini request builder exists.
- No Gemini SDK is installed.
- `GEMINI_API_KEY` is not required by the current runtime.
- `/app/ai` calls the backend only when `VITE_AI_BACKEND_CONTRACT_ENABLED=true`.
- The backend still returns dry-run/mock or disabled/not-configured contract states.

## Before Live Activation

The owner must explicitly approve live Gemini activation in a later milestone.

Before that approval, confirm:

- Owner approves live Gemini activation for the farmer assistant.
- Gemini model is checked against current official Gemini documentation.
- Model cost, latency, quota, region/runtime compatibility, and safety behavior are acceptable.
- `GEMINI_API_KEY` is configured only as an encrypted Cloudflare Pages secret.
- The real key value was never committed or pasted into docs, reports, screenshots, logs, or frontend env.
- `AI_PROVIDER=gemini`.
- `AI_LIVE_ENABLED=false` before the first production deploy.
- `VITE_AI_BACKEND_CONTRACT_ENABLED=true` only if the frontend should call the backend contract.
- Production dry-run or not-configured state works.
- High-risk chemical dosage and mixing prompts are blocked.
- Fake live weather, fake live price, fake citation, and guaranteed outcome outputs are blocked.
- No frontend secret exposure appears in browser source, built JS, network payloads, or visible UI.
- Production logs do not store raw full question/answer by default.
- Rollback is simple and tested: set `AI_LIVE_ENABLED=false`.

## Owner Approval Record

Use this before a later live activation milestone:

```text
Owner:
Date:
Approved milestone:
Approved model:
Model docs checked on:
Cloudflare secret checked:
AI_LIVE_ENABLED before deploy:
Production dry-run QA result:
High-risk block QA result:
Rollback test result:
Approval notes:
```

M144 should leave this unfilled.

## Rollback Plan

Immediate rollback:

```text
AI_LIVE_ENABLED=false
```

Then:

1. Save the Cloudflare variable.
2. Redeploy or trigger a Cloudflare redeploy if the environment change does not apply to the active deployment.
3. Call `/api/ai/farmer-assistant` with a normal prompt.
4. Verify it no longer returns live provider output.
5. Verify the response is dry-run/mock or not-configured.
6. Open `/app/ai` and verify the UI still handles the safe fallback state.
7. Keep local fixture fallback available by disabling `VITE_AI_BACKEND_CONTRACT_ENABLED` only if the backend contract itself is causing user-facing issues.

## Rollback Smoke Prompt

Use:

```json
{
  "question": "ใบมันสำปะหลังเหลืองควรเริ่มตรวจอะไร",
  "topic": "plant_problem",
  "userMode": "guest",
  "clientRequestId": "rollback-smoke"
}
```

Expected after rollback:

- `status=ready` dry-run/mock or `status=not_configured`.
- No live Gemini claim.
- No model ID.
- No provider stack trace.
- No secret-like output.

## Rollback Decision Log

```text
Rollback date:
Reason:
Changed by:
AI_LIVE_ENABLED final value:
Redeploy required:
API smoke result:
Browser smoke result:
Follow-up issue:
```

