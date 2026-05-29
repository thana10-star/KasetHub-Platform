# AI Roadmap Revision M141

Status: planning revision only. This document replaces the OpenAI-first future roadmap with a Gemini-first roadmap. It does not implement provider code.

## Roadmap Principle

The provider direction is now Gemini-first, but the rollout remains conservative:

- backend-only provider calls
- no frontend provider key
- no live provider execution until owner approval
- disabled state first
- mocked provider tests before any live call
- output validator before production responses
- rollback by `AI_LIVE_ENABLED=false`

## Superseded Roadmap Language

Earlier docs proposed:

- OpenAI-first provider implementation.
- OpenAI dry-run adapter.
- OpenAI runtime guardrails.
- OpenAI live activation path.

That wording is superseded for future work by M141.

Historical reports remain unchanged because they document the state and owner decision at the time.

## Revised Milestone Sequence

### M142 Gemini Provider Dry-Run Adapter

Goal:

- Create the provider adapter layer and Gemini provider interface without live calls.

Scope:

- Add a provider abstraction if needed.
- Add Gemini provider adapter in mocked/dry-run mode only.
- Add mocked Gemini response fixtures.
- Keep `AI_LIVE_ENABLED=false`.
- Missing `GEMINI_API_KEY` must return `not_configured`.
- No live Gemini requests.
- No key values.
- No frontend provider key.
- No `/app/ai` live output.

Verification:

- Unit tests prove no provider fetch when `AI_LIVE_ENABLED=false`.
- Unit tests prove no provider fetch when `GEMINI_API_KEY` is missing.
- Unit tests prove mocked Gemini responses normalize into the existing response contract.

### M143 Gemini Runtime Guardrail Integration

Goal:

- Wire runtime guardrails around the mocked Gemini adapter.

Scope:

- Implement or stage output validator.
- Add Gemini provider timeout handling.
- Add malformed provider response handling.
- Add provider error mapping.
- Add high-risk input and unsafe-output tests.
- Keep live execution disabled.

Verification:

- Chemical dosage and dangerous mixing outputs are blocked.
- Fake live weather/price/source claims are blocked.
- Fake citations are blocked.
- Thai/mostly Thai requirement is checked.
- No raw provider errors or stack traces reach user-facing responses.

### M144 AI Production Contract QA

Goal:

- Validate production contract behavior before live provider activation.

Scope:

- Cloudflare env setup guide.
- Confirm `VITE_AI_BACKEND_CONTRACT_ENABLED=true`.
- Confirm `AI_PROVIDER=gemini`.
- Confirm `AI_LIVE_ENABLED=false`.
- Confirm missing/disabled Gemini state in production.
- Run manual QA prompt set against mocked and disabled paths.

Verification:

- Production returns `not_configured` safely.
- No frontend provider key.
- No secret in browser source/network payload.
- No raw question/answer storage by default.

### M145 Controlled Gemini Rollout

Goal:

- Prepare controlled rollout while keeping `AI_LIVE_ENABLED=false` by default.

Scope:

- Owner reviews model choice, limits, prompt, validator, and rollback.
- Confirm Gemini model slug against current docs.
- Confirm quota/rate limits and Cloudflare timeout behavior.
- Confirm monitoring dashboard or log summary.
- Keep live disabled until explicit activation milestone.

Verification:

- Manual QA prompt set passes.
- Validator failure path passes.
- Rate-limit path passes.
- Rollback path documented and tested.

### M146 Owner-Approved Live Gemini Activation

Goal:

- Enable live Gemini only after owner approval.

Scope:

- Configure `GEMINI_API_KEY` only as Cloudflare secret.
- Set `AI_LIVE_ENABLED=true` only after approval.
- Monitor first live responses manually.
- Keep immediate rollback path.

Verification:

- First live responses are Thai, cautious, and practical.
- No dangerous chemical guidance.
- No fake live data.
- No fake citations.
- No guaranteed diagnosis/profit/yield/cure.
- No provider secrets or stack traces.

Rollback:

```text
AI_LIVE_ENABLED=false
```

## What Stays Unchanged

- `/api/ai/farmer-assistant` remains the farmer assistant backend contract path.
- `/app/ai` remains frontend-only and never sees provider secrets.
- `VITE_AI_BACKEND_CONTRACT_ENABLED` remains the frontend-safe contract flag.
- Disabled/mock/local fixture mode remains available.
- M140 manual QA prompt set remains useful.
- M140 system prompt safety behavior remains useful.
- M140 output validator design remains useful.

## What Changes

- Primary provider becomes Gemini API.
- Server-side key becomes `GEMINI_API_KEY`.
- `AI_PROVIDER=gemini` becomes the future implementation path.
- OpenAI moves to secondary/future comparison.
- Next implementation milestone becomes Gemini dry-run adapter, not OpenAI adapter.

## Non-Goals

The revised roadmap does not authorize:

- live Gemini calls in M142-M145
- live OpenAI calls
- frontend provider keys
- `VITE_GEMINI_API_KEY`
- `VITE_OPENAI_API_KEY`
- fake live AI output
- fake weather/price/source data
- image input in V1
- memory in V1
- RAG in V1
- billing in V1
