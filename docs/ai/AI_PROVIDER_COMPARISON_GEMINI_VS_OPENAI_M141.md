# AI Provider Comparison Gemini vs OpenAI M141

Status: planning comparison only. Gemini is the owner-selected primary path for future implementation. This document does not call either provider.

## Decision Summary

| Role | Provider |
| --- | --- |
| Primary V1 provider | Gemini API |
| Secondary/future comparison | OpenAI |
| Fallback | disabled/mock/local fixture |

## Gemini As Primary

Why Gemini is the M141 primary path:

- Owner selected Gemini API.
- The existing architecture is backend-only and can support Gemini behind the same Cloudflare contract.
- Gemini Flash/Flash-Lite style models are suitable candidates for low-latency, high-volume text assistance, pending current-doc verification.
- Existing placeholder routing already contains Gemini-style provider candidates, though those are placeholders and not runtime integration.
- The M140 safety/prompt/validator design remains provider-independent.

Risks to verify:

- Current model slugs and launch stages.
- Rate limits and quota behavior for the selected account/project.
- API endpoint shape and SDK/raw-fetch compatibility with Cloudflare Pages Functions.
- Thai answer quality for farmer prompts.
- Safety behavior around chemical dosage, fake live data, and fake citations.
- Latency under Cloudflare timeout constraints.

## OpenAI As Secondary/Future Comparison

OpenAI remains useful as:

- a future quality benchmark
- a fallback comparison if Gemini fails Thai QA or safety QA
- a possible later secondary provider after the operational matrix is mature

OpenAI is not the primary implementation path after M141.

## Shared Requirements

Both providers would need the same KasetHub guardrails:

- server-side key only
- no frontend provider key
- no live provider call until owner approval
- max input length
- max output tokens
- timeout
- cooldown
- daily limits
- system prompt
- output validator
- no fake live weather/price/source data
- no fake citations
- no dangerous chemical guidance
- safe Thai error fallback

## Model Candidate Notes

Gemini candidates must be verified before implementation:

- `gemini-3.5-flash` or current stable Gemini Flash model
- `gemini-3.1-flash-lite` or current stable Gemini Flash-Lite model
- `gemini-2.5-flash`
- `gemini-2.5-flash-lite`

OpenAI candidates from M140 are now historical planning notes and should not drive the next implementation milestone.

## Recommendation

Proceed with:

```text
M142 Gemini Provider Dry-Run Adapter (AI_LIVE_ENABLED=false)
```

Do not proceed directly to live Gemini activation.

## Source Notes

Planning references checked during M141:

- [Gemini API model catalog](https://ai.google.dev/gemini-api/docs/models)
- [Gemini 2.5 Flash documentation](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-flash)
- [Gemini 2.5 Flash-Lite documentation](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-flash-lite)
