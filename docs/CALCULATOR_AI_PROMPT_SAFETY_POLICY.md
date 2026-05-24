# Calculator AI Prompt Safety Policy

M55 adds a prompt-safety policy for future calculator explanations. The current app only builds a local prompt scaffold preview and never calls an AI provider.

## Prompt Goal

The prompt may ask a future AI model to explain the calculator result in simple Thai for farmers. It should be short, practical, and careful. It should not become an agronomy recommendation engine.

## Required Prompt Inputs

- calculator type and label
- deterministic result recap
- input recap
- crop label, if present
- validation warnings
- safety disclaimers
- allowed actions
- blocked actions

## Required Prompt Instructions

Every future prompt must include instructions equivalent to:

- Explain only the provided calculator output.
- Do not change any number in the deterministic result.
- Do not add fertilizer or chemical dose recommendations outside the calculator result.
- Do not recommend pesticide, herbicide, hormone, or fertilizer products.
- Do not mention sponsor or affiliate products.
- Do not promise yield, profit, disease control, or safety.
- Tell the user what to check with labels, soil tests, field data, prices, or an expert.

## Blocked Content

The prompt policy blocks:

- hidden sponsor content
- exact fertilizer dose by crop unless it is already a reviewed deterministic rule
- chemical product recommendations
- label overrides
- guaranteed crop outcomes
- statements that remove uncertainty
- model-generated formula changes

## Display Boundary

Future AI text must appear as an explanation area, not inside the deterministic result card. Calculator result cards should remain formula-owned and test-owned.

## Ads And Sponsors

Rewarded ads may unlock convenience features in the future, but must not unlock essential safety copy or change calculator formulas. Sponsor content must never be mixed into AI explanation prompts or result text unless a future policy explicitly labels it and separates it from the calculator result.

## Current M55 Status

- no real AI call
- no backend write
- no Supabase write
- no network call
- no sponsor content
- no recommendation engine
- local preview only

## M56 Backend Prompt Execution Plan

Future prompt execution should happen only in a backend-owned route or Edge Function after:

- deterministic result snapshot is locked
- policy version is selected
- prompt template version is selected
- blocked actions are rejected
- oversized and invalid payloads are rejected
- high-risk spray/fertilizer cases are escalated or filtered

The frontend must not hold provider keys and must not send mutable calculator state directly to an AI provider.

## M57 Adapter Gate

The M57 adapter sits before any future backend prompt execution. It keeps `local_fixture` as the default, returns deterministic fixture text from the locked snapshot, and reports `noRealAICall: true`.

`backend_test_ready` must not run a backend test client unless both flags are explicitly true:

- `VITE_ENABLE_CALCULATOR_AI_BACKEND=true`
- `VITE_ENABLE_CALCULATOR_AI_NETWORK=true`

Even with those flags, M57 has no real endpoint URL and no provider call. Future prompt execution must remain backend-owned and must preserve the locked result hash.

## M58 Network Boundary

M58 adds `docs/CALCULATOR_AI_NETWORK_BOUNDARY_RULES.md` and `docs/CALCULATOR_AI_STAGING_ENDPOINT_CHECKLIST.md`.

Before any real prompt reaches an AI provider:

- frontend must pass only a locked snapshot to a backend-owned route
- backend must verify lock hash and policy version
- backend must reject sponsor, chemical/product, fertilizer-dose invention, and result-mutation requests
- backend must record audit metadata after RLS/privacy review
- backend must enforce rate limits and timeout fallback behavior

Prompt safety remains explanation-only. The model must not mutate formulas or inject hidden recommendations.

## M59 Edge Prompt Boundary

The future `calculator-ai-explain` Edge Function may build prompts only after:

- auth/session context is verified
- snapshot lock hash matches
- policy version matches
- rate-limit hook passes
- sponsor/product payloads are absent
- payload size is within the contract limit

M59 does not build a live provider prompt. It only previews typed payloads, timeout behavior, audit hooks, and failure modes.
