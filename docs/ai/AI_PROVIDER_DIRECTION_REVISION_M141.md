# AI Provider Direction Revision M141

Status: planning revision only. M141 changes the documented provider direction from OpenAI-first to Gemini-first. It does not enable live Gemini calls, add provider key values, expose frontend provider secrets, or change runtime AI behavior.

## Decision

Primary V1 provider:

```text
Gemini API
```

Secondary/future comparison:

```text
OpenAI
```

Fallback:

```text
disabled/mock/local fixture mode
```

This supersedes the OpenAI-first provider direction documented in M136-M140 for future implementation planning. Historical milestone reports remain accurate records of the prior decision and should not be rewritten.

## Why The Direction Changed

The owner has selected Gemini API as the primary AI provider path for the KasetHub farmer assistant.

The architecture rules remain unchanged:

- Backend/server-side provider calls only.
- Cloudflare-hosted backend boundary.
- No provider key in frontend code or frontend environment variables.
- No fake AI output.
- No live provider activation until a future owner-approved milestone.
- Safety-first agriculture assistant behavior.
- Thai farmer-friendly answers.

## Current Implementation Boundary

Current runtime still matches M138/M139:

- `POST /api/ai/farmer-assistant` exists as a safe backend contract stub.
- The stub validates input and returns disabled/fixture responses.
- The stub does not call OpenAI, Gemini, or any external AI provider.
- `/app/ai` calls the backend contract only behind `VITE_AI_BACKEND_CONTRACT_ENABLED=true`.
- Local fixture fallback remains the default when the frontend contract flag is off.
- M141 does not modify runtime code.

Known legacy runtime detail:

- The M138 stub currently reads `OPENAI_API_KEY` as a historical no-call guard.
- This should be revised in a future Gemini adapter milestone, but M141 intentionally does not change execution logic.

## Previous Provider Direction Summary

M136:

- Recommended OpenAI as the primary V1 text provider.
- Listed Gemini as a secondary/evaluation option.
- Kept disabled/mock mode as required fallback.

M137:

- Locked OpenAI as the primary V1 provider path.
- Documented `/api/ai/farmer-assistant` contract around backend-only OpenAI.

M138:

- Created the backend contract stub.
- Still never called OpenAI.

M139:

- Wired `/app/ai` to the backend contract behind a frontend-safe flag.
- Still never called OpenAI.

M140:

- Created OpenAI runtime guardrails, rollout checklist, system prompt spec, validator design, and QA prompts.
- Still never called OpenAI.

M141:

- Revises future provider direction to Gemini-first.
- Keeps the M140 safety, validator, prompt, rollout, and QA discipline.
- Replaces OpenAI-specific future roadmap language with Gemini-first roadmap language.

## New Provider Direction

Future V1 implementation should target:

```text
AI_PROVIDER=gemini
```

Server-side only:

```text
AI_PROVIDER=gemini
GEMINI_API_KEY
AI_MODEL
AI_TIMEOUT_MS
AI_PROVIDER_TIMEOUT_MS
AI_MAX_INPUT_CHARS
AI_MAX_OUTPUT_TOKENS
AI_DAILY_LIMIT_GUEST
AI_DAILY_LIMIT_SIGNED_IN
AI_COOLDOWN_SECONDS
AI_LIVE_ENABLED=false
```

Frontend-safe:

```text
VITE_AI_BACKEND_CONTRACT_ENABLED=true
```

Forbidden frontend env:

```text
VITE_GEMINI_API_KEY
VITE_OPENAI_API_KEY
VITE_AI_PROVIDER_SECRET
any provider secret
```

Rules:

- `AI_LIVE_ENABLED` must default to `false`.
- Missing `GEMINI_API_KEY` must return `not_configured` in future Gemini implementation.
- Provider errors must return safe Thai user-facing copy.
- Never expose model/provider stack traces to users.
- Never return secret values.
- Never store raw questions or answers by default.

## Contract Direction

The existing farmer assistant response contract can remain mostly stable:

```ts
type FarmerAssistantStatus = 'ready' | 'not_configured' | 'rate_limited' | 'blocked' | 'error';
type FarmerAssistantSafetyLevel = 'normal' | 'caution' | 'high_risk';
```

Future M142 should revise provider typing to include Gemini in a mocked, non-live adapter layer:

```ts
type FarmerAssistantProvider = 'gemini' | 'openai' | 'disabled' | 'mock';
```

M141 does not make this runtime type change because it would touch source without changing behavior.

## Safety Continuity

Provider direction changed. Safety rules did not.

The assistant still must:

- answer in Thai
- use farmer-friendly plain language
- ask clarifying questions when crop/province/symptoms/timing are missing
- avoid chemical dosage certainty
- avoid dangerous chemical mixing instructions
- avoid fake live weather/price/source data
- avoid fake citations
- avoid guaranteed diagnosis, cure, yield, profit, or sale price
- recommend local agriculture office, veterinarian, agronomist, or relevant expert for high-risk cases

## Implementation Boundary

M141 does not:

- create a Gemini adapter
- call Gemini
- call OpenAI
- add `GEMINI_API_KEY` values
- add frontend provider keys
- add `VITE_GEMINI_API_KEY`
- add `VITE_OPENAI_API_KEY`
- change `/app/ai`
- modify M138 backend execution logic

## Source Notes

Gemini model names and launch stages must be verified against current Gemini documentation before implementation:

- [Gemini API model catalog](https://ai.google.dev/gemini-api/docs/models)
- [Gemini 2.5 Flash documentation](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-flash)
- [Gemini 2.5 Flash-Lite documentation](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-flash-lite)
