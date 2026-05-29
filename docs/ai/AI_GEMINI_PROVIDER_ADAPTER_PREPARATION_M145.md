# AI Gemini Provider Adapter Preparation M145

Status: backend adapter preparation only. M145 does not enable live Gemini execution, does not add a provider API key value, and does not change frontend behavior.

## Purpose

M145 prepares the internal pieces a future Gemini provider adapter will need:

- Gemini request payload builder
- Gemini safety-settings mapper
- Gemini response parser
- Gemini error mapper
- no-network mocked tests

These utilities are intentionally inert. They build and parse plain objects only. They do not import a Gemini SDK, do not call `fetch`, do not require `GEMINI_API_KEY`, and do not produce live AI output.

## Current Runtime Boundary

Current runtime behavior remains:

1. `/api/ai/farmer-assistant` validates the request.
2. High-risk input is blocked before provider selection.
3. `AI_PROVIDER=gemini` selects the Gemini dry-run adapter.
4. The provider runs through the M143 timeout wrapper.
5. Output passes through the M143 validator.
6. Unsafe output maps to safe Thai fallback copy.
7. The response remains `provider: "mock"` and `providerMode: "dry_run"` for Gemini dry-run output.

`AI_LIVE_ENABLED=true` still cannot activate live Gemini in M145.

## Request Builder Design

File:

```text
functions/api/ai/providers/gemini-request-builder.ts
```

The builder creates a planned Gemini `generateContent` request shape for future use. It accepts:

- validated farmer assistant question/context
- model config
- max output token config
- conservative generation config
- optional safety settings

It returns:

- `model`
- `endpointPath`
- `body`
- `verificationNote`

The body includes:

- system instruction text for the Thai farmer assistant
- user question
- optional crop/province/topic/user-mode context
- conservative generation config
- safety settings from the mapper

Planned defaults:

```text
maxOutputTokens=700
temperature=0.3
topP=0.9
responseMimeType=text/plain
streaming=false
```

The request builder does not include:

- API keys
- auth headers
- provider secret fields
- URLs that execute a request
- SDK calls
- `fetch`

Important live-activation note: exact Gemini field names, endpoint path, model name, and safety category support must be verified against current Gemini documentation immediately before live implementation.

References to verify before live activation:

- [Gemini GenerateContent API](https://ai.google.dev/api/generate-content)
- [Gemini safety settings](https://ai.google.dev/gemini-api/docs/safety-settings)

## System Instruction Shape

The planned system instruction remains aligned with the M140/M141 provider-agnostic prompt design:

- answer in Thai
- use farmer-friendly plain language
- keep answers practical and not too long
- use four sections:
  - `สิ่งที่อาจเกิดขึ้น`
  - `สิ่งที่ควรตรวจเช็ก`
  - `วิธีเริ่มแก้แบบปลอดภัย`
  - `เมื่อไหร่ควรถามผู้เชี่ยวชาญ`
- ask clarifying questions when crop/province/symptoms are missing
- avoid chemical dosage certainty
- avoid dangerous mixing instructions
- avoid fake citations
- avoid fake live weather/price/source claims
- recommend local agriculture office or expert for high-risk cases

## Safety Settings Mapper Design

File:

```text
functions/api/ai/providers/gemini-safety-settings.ts
```

The mapper prepares conservative future Gemini safety settings for:

- harassment
- hate speech
- sexually explicit content
- dangerous content
- civic integrity if supported by the live API/model version

Planned behavior:

- dangerous content uses a stricter threshold
- other categories use conservative medium-and-above blocking
- unsupported categories are skipped safely
- civic integrity can be omitted if unsupported by the selected Gemini model/API version

These settings are not a replacement for KasetHub guardrails. The M143 input block, output validator, fallback mapper, and rollout gate remain required.

## Response Parser Design

File:

```text
functions/api/ai/providers/gemini-response-parser.ts
```

The parser accepts mocked Gemini-like response objects and converts them into provider-neutral internal output.

It handles:

- normal text response
- empty candidates
- blocked or safety response
- malformed response
- missing text
- finish reason
- safety ratings metadata

It returns safe internal reason codes:

```text
gemini_empty_candidates
gemini_safety_blocked
gemini_malformed_response
gemini_missing_text
```

The parser does not expose raw provider internals to frontend responses. For M145, successfully parsed responses still use:

```text
provider=mock
providerMode=dry_run
```

This avoids any live Gemini claim before owner-approved activation.

## Error Mapper Design

File:

```text
functions/api/ai/providers/gemini-error-mapper.ts
```

The error mapper converts future provider errors into safe internal reason codes:

```text
gemini_timeout
gemini_rate_limited
gemini_auth_error
gemini_quota_exceeded
gemini_safety_blocked
gemini_malformed_response
gemini_provider_error
```

The mapper returns:

- reason code
- retryable flag
- safe log code
- optional HTTP status

It does not return raw provider messages, stack traces, request IDs, model internals, or secret-like values.

## No-Network Testing Strategy

M145 tests cover:

- request builder output shape
- Thai system instruction inclusion
- question and context inclusion
- max output token application
- no secret fields
- no `fetch` call
- conservative safety settings
- unsupported safety category handling
- normal mocked response parsing
- empty candidates
- safety-blocked responses
- malformed responses
- missing text
- timeout/rate-limit/auth/quota/safety/malformed/unknown error mapping
- Gemini provider remains dry-run
- endpoint path remains dry-run through existing tests

All tests use local mocked objects only.

## Why Live Gemini Remains Disabled

M145 intentionally stops before live execution because the system still needs:

- owner approval for live activation
- verified Gemini model selection
- Cloudflare secret setup verification
- final request endpoint verification
- response parser validation against current API output
- production dry-run verification
- rollback rehearsal

Runtime must continue to treat `AI_LIVE_ENABLED=true` as non-live until a later milestone explicitly changes the gate.

## M146 Recommendation

Recommended next milestone:

```text
M146 Gemini Secret Setup + Production Dry-Run Verification
```

M146 should:

- set or document setting `GEMINI_API_KEY` as a Cloudflare secret only
- keep `AI_LIVE_ENABLED=false`
- verify production endpoint still returns dry-run or not-configured behavior
- verify no frontend secret exposure
- run production smoke tests
- still make no live Gemini call

