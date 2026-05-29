# AI Backend Proxy Stub M138

> M141 revision note: Future provider direction is now Gemini-first. Preserve this file as historical M138 backend contract context; do not read its OpenAI-specific future notes as current implementation direction.

Status: backend contract stub only. M138 creates the Cloudflare Pages Function endpoint and validates the request shape, but it does not call OpenAI, Gemini, or any external AI provider.

## Endpoint

```http
POST /api/ai/farmer-assistant
```

Cloudflare Pages Function path:

```text
functions/api/ai/farmer-assistant.ts
```

Supported behavior in M138:

- Accepts `POST` only.
- Returns `405` for other methods.
- Parses JSON safely.
- Validates the farmer question and optional context fields.
- Returns normalized fixture responses.
- Blocks a narrow set of high-risk chemical or emergency-health requests.
- Returns `not_configured` when the provider is missing, disabled, or even present, because live provider execution is intentionally out of scope for this milestone.

M138 intentionally does not connect `/app/ai` to this endpoint yet.

## Request Contract

```ts
type FarmerAssistantRequest = {
  question: string;
  crop?: string;
  province?: string;
  topic?:
    | 'plant_problem'
    | 'soil_fertilizer'
    | 'water'
    | 'weather'
    | 'price'
    | 'livestock'
    | 'general';
  userMode?: 'guest' | 'signed_in';
  clientRequestId?: string;
};
```

Validation rules:

- `question` is required.
- `question` is trimmed before validation.
- Empty questions are rejected.
- Default max question length is `1200` characters.
- `AI_MAX_INPUT_CHARS` can lower or raise the limit server-side, capped at `4000`.
- `topic`, when provided, must be one of the allowed values.
- `userMode`, when provided, must be `guest` or `signed_in`.
- `crop`, `province`, and `clientRequestId` are optional strings.
- Precise location is not required.
- Invalid JSON returns a safe validation response without a stack trace.

## Response Contract

```ts
type FarmerAssistantResponse = {
  status: 'ready' | 'not_configured' | 'rate_limited' | 'blocked' | 'error';
  answer?: string;
  safetyLevel?: 'normal' | 'caution' | 'high_risk';
  followUpQuestions?: string[];
  disclaimers?: string[];
  provider?: 'openai' | 'disabled' | 'mock';
  requestId?: string;
  retryAfterSeconds?: number;
};
```

M138 user-facing responses use natural Thai copy and avoid technical wording such as raw provider errors, stack traces, `undefined`, or `null`.

## Fixture States

The function includes fixture helpers for:

- `ready_mock`
- `not_configured`
- `rate_limited`
- `blocked_high_risk`
- `provider_error`
- `timeout`
- `validation_error`

Rules for all fixtures:

- No OpenAI call.
- No Gemini call.
- No external provider call.
- No fake live weather, fake prices, fake citations, or guaranteed diagnosis.
- No chemical dosage advice.
- `ready_mock` uses `provider: "mock"`.
- Disabled/error states use `provider: "disabled"`.

## Safety Blocking Stub

M138 includes a deliberately small high-risk guard for obvious cases:

- pesticide or chemical dosage requests
- dangerous chemical mixing requests
- human or animal emergency-health phrasing

Blocked responses return:

```json
{
  "status": "blocked",
  "safetyLevel": "high_risk",
  "provider": "disabled"
}
```

The answer tells the farmer that the app cannot provide dangerous dosage or mixing instructions and recommends reading the real product label and contacting a local agricultural office or expert.

This is not a full safety classifier. M140 should harden this area before live provider rollout.

## Environment Contract

The stub reads these server-side variables safely:

```text
AI_PROVIDER
OPENAI_API_KEY
AI_MAX_INPUT_CHARS
AI_COOLDOWN_SECONDS
```

Security rules:

- Missing env never crashes the endpoint.
- `OPENAI_API_KEY` is never returned in a response.
- Secret values are not logged.
- No frontend env key is added.
- `VITE_OPENAI_API_KEY` and `VITE_GEMINI_API_KEY` remain forbidden.
- The stub still returns `not_configured` even if `AI_PROVIDER=openai` and `OPENAI_API_KEY` are present, because M138 must not call OpenAI.

## M139/M140 Path

Recommended next milestone:

```text
M139 AI Frontend Contract Wiring / Disabled Backend State
```

M139 should connect `/app/ai` to this backend contract carefully:

- show `not_configured` and disabled states with farmer-friendly copy
- keep existing fixture fallback if needed
- do not call OpenAI unless owner explicitly approves a live-provider milestone
- keep provider keys server-side only

M140 should add stronger abuse, rate-limit, privacy, timeout, and safety hardening before live provider output is trusted in production.
