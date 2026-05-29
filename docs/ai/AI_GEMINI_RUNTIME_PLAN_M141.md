# AI Gemini Runtime Plan M141

Status: planning only. This document defines the Gemini-first runtime plan for future milestones. It does not connect Gemini, call Gemini, add a Gemini API key value, or change runtime AI behavior.

## Runtime Goal

Prepare the future KasetHub farmer assistant runtime to use Gemini API as the primary backend provider while preserving the M138/M139 contract and M140 safety guardrails.

## Gemini Model Candidates

All model names below must be verified against current Gemini documentation before implementation.

Recommended candidate for V1 text assistant:

```text
gemini-3.5-flash or the current stable Gemini Flash model
```

Status: verify against current Gemini documentation before implementation.

Why:

- The farmer assistant needs low-latency, high-volume Thai text answers.
- The model catalog currently presents Gemini Flash models as strong price/performance choices.
- The assistant is text-only in V1, so image/audio/live-specific Gemini models are out of scope.

Conservative stable candidate:

```text
gemini-2.5-flash
```

Status: verify against current Gemini documentation before implementation.

Why:

- Official docs describe Gemini 2.5 Flash as a price-performance model for low-latency, high-volume tasks that require reasoning.
- It is a reasonable fallback if newer Gemini 3.x model access, pricing, quota, or Cloudflare runtime compatibility is not ready.

Backup cost/latency candidate:

```text
gemini-3.1-flash-lite or the current stable Gemini Flash-Lite model
```

Status: verify against current Gemini documentation before implementation.

Additional backup:

```text
gemini-2.5-flash-lite
```

Status: verify against current Gemini documentation before implementation.

Why:

- Flash-Lite style models are positioned for fast, budget-sensitive workloads.
- Use only after QA confirms Thai quality, refusal behavior, live-data honesty, and output validator compatibility.

Do not use in V1:

- Gemini Live models
- Gemini TTS models
- Gemini image generation models
- Gemini video/media generation models
- Gemini Pro/highest-cost model by default

## Planned Runtime Defaults

```text
AI_PROVIDER=gemini
AI_MODEL=(Gemini model selected after current-doc verification)
AI_TIMEOUT_MS=12000
AI_PROVIDER_TIMEOUT_MS=8000
AI_MAX_INPUT_CHARS=1200
AI_MAX_OUTPUT_TOKENS=700
AI_DAILY_LIMIT_GUEST=5
AI_DAILY_LIMIT_SIGNED_IN=20
AI_COOLDOWN_SECONDS=20
AI_LIVE_ENABLED=false
```

V1 feature boundaries:

- no streaming unless owner approves later
- no image input for V1
- no audio input/output for V1
- no memory for V1
- no RAG for V1
- no Google Search grounding for V1 unless owner approves a sourced-data milestone
- no live weather or price claims unless app data is explicitly integrated later

## Server-Side Env Plan

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

- `GEMINI_API_KEY` must be configured only as a Cloudflare secret.
- Missing `GEMINI_API_KEY` returns `not_configured`.
- `AI_LIVE_ENABLED=false` returns `not_configured` even if a key exists.
- Provider stack traces and raw API errors never reach users.
- Secret values are never returned or logged.
- Frontend must never send model, provider, token, or secret values.

## Planned Backend Flow

Future implementation flow:

1. Accept only `POST`.
2. Parse JSON safely.
3. Validate question, optional crop/province/topic/user mode, and request ID.
4. Enforce max input chars before provider work.
5. Classify high-risk prompt patterns before provider work.
6. Enforce cooldown and daily limits before provider work.
7. Return `not_configured` if `AI_PROVIDER !== "gemini"`.
8. Return `not_configured` if `AI_LIVE_ENABLED !== "true"`.
9. Return `not_configured` if `GEMINI_API_KEY` is missing.
10. Build provider-agnostic system prompt server-side.
11. Call Gemini with total provider timeout budget.
12. Normalize Gemini output into the KasetHub response contract.
13. Run deterministic output safety validator.
14. Return `ready`, `blocked`, `rate_limited`, `not_configured`, or `error`.
15. Log minimal metadata only.

M141 implements none of these runtime steps.

## Timeout Strategy

Defaults:

```text
AI_TIMEOUT_MS=12000
AI_PROVIDER_TIMEOUT_MS=8000
```

Rules:

- Provider timeout must be shorter than total endpoint timeout.
- No automatic retry after timeout in V1.
- Timeout returns safe Thai `error` copy.
- Do not charge/consume future credits when no safe answer is returned.
- Log `provider_timeout` reason code only, not raw request/answer.

## Retry Policy

V1 should not automatically retry provider calls.

Do not retry:

- validation errors
- blocked input
- missing key
- live-disabled state
- invalid API key/auth error
- provider `400`
- provider `429`
- provider timeout
- unsafe provider output

Future option:

- A later milestone may add one bounded retry for transient network failures after production metrics justify it.

## Rate Limiting

V1 defaults:

```text
AI_MAX_INPUT_CHARS=1200
AI_MAX_OUTPUT_TOKENS=700
AI_COOLDOWN_SECONDS=20
AI_DAILY_LIMIT_GUEST=5
AI_DAILY_LIMIT_SIGNED_IN=20
```

Rules:

- Enforce before provider call.
- Return `rate_limited` with Thai copy and `retryAfterSeconds` when known.
- Store only minimal counters.
- Do not store raw question text by default.
- No billing implementation in M141/M142.

Future tracking options:

- Cloudflare KV for daily counters.
- Durable Object for stronger cooldown/concurrency control.
- R2 for aggregate audit exports.
- Supabase only after owner approves privacy copy and schema.

## Fallback Strategy

Fallback modes:

- `not_configured`: provider disabled, key missing, or live flag false.
- `blocked`: unsafe input or unsafe provider output.
- `rate_limited`: cooldown/daily limit/provider quota.
- `error`: timeout, network failure, malformed provider response, or provider service failure.
- local fixture: frontend fallback when backend contract mode is off.

User-facing errors:

- Must be Thai.
- Must not mention Gemini, API keys, stack traces, raw provider errors, `undefined`, or `null`.
- Must not pretend an AI answer exists when the provider is disabled.

## Rollout Gate

Future activation sequence:

1. Implement Gemini adapter behind `AI_LIVE_ENABLED=false`.
2. Test adapter with mocked Gemini responses only.
3. Confirm missing `GEMINI_API_KEY` returns `not_configured`.
4. Confirm `AI_LIVE_ENABLED=false` returns `not_configured` even with server-side key present.
5. Run manual QA prompt suite against mocked outputs and later controlled staging outputs.
6. Configure `GEMINI_API_KEY` only in Cloudflare secret storage.
7. Deploy disabled state to production first.
8. Owner approves model, limits, prompt, validator, and rollback.
9. Enable live only in a later milestone after explicit owner approval.
10. Roll back with `AI_LIVE_ENABLED=false`.

## System Prompt Compatibility

The M140 system prompt is mostly provider-agnostic and remains valid for Gemini:

- It does not rely on OpenAI-specific behavior.
- It requires Thai answers.
- It requires farmer-friendly copy.
- It blocks chemical dosage certainty and dangerous mixing.
- It blocks fake live weather/price/source data.
- It blocks fake citations and certainty claims.

Gemini-specific considerations:

- Keep the system instruction concise and high priority.
- Keep output shape explicit because the UI expects structured, readable Thai text.
- Do not enable grounding tools by default; otherwise the assistant may appear to have live sources.
- Do not expose Gemini model names or safety ratings to farmers.
- If Gemini returns safety blocks or empty candidates, map them to safe `blocked` or `error` responses.

## Output Validator Compatibility

The M140 validator design is provider-independent and should apply to Gemini outputs unchanged.

Validator still checks:

- dangerous chemical mixing instructions
- confident pesticide/fertilizer dosage without verified source context
- guaranteed diagnosis/profit/yield/cure
- fake live price/weather/source claims
- fake citations
- medical/human emergency advice
- long unsafe output after high-risk input
- Thai or mostly Thai output
- raw provider errors, model IDs, stack traces, and secret-like strings

Fallback behavior remains:

- Replace unsafe answer with safe caution response.
- Return `safetyLevel: "caution"` or `"high_risk"` when relevant.
- Log minimal metadata and reason codes only.
- Do not log raw full question/answer by default.

## Source Notes

Planning references checked during M141:

- [Gemini API model catalog](https://ai.google.dev/gemini-api/docs/models)
- [Gemini 2.5 Flash documentation](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-flash)
- [Gemini 2.5 Flash-Lite documentation](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-flash-lite)

All model slugs, launch stages, quotas, pricing, endpoint shape, and safety settings must be re-verified before implementation.
