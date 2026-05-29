# AI Owner Approval Flow M148

Status: approval process only. This document does not approve or execute live Gemini.

## Purpose

The first real Gemini request must happen only after the owner explicitly approves a live smoke test. M148 defines the approval stages and stop conditions so the future live test is small, reversible, and auditable.

## Approval Principle

No real Gemini request may be sent until the owner approves:

- live test timing
- production environment
- Gemini model verified against current docs
- expected cost boundary
- exact test prompts
- rollback owner
- log review owner

## Stage A: Dry-Run Production Verification

Goal: prove production is safe while still non-live.

Required state:

```text
AI_PROVIDER=gemini
AI_LIVE_ENABLED=false
VITE_AI_BACKEND_CONTRACT_ENABLED=true
GEMINI_API_KEY=<Cloudflare encrypted secret only, if configured>
```

Actions:

1. Verify Cloudflare variables and secret with `AI_GEMINI_CLOUDFLARE_SECRET_VERIFICATION_M148.md`.
2. Run production dry-run API smoke tests.
3. Run `/app` and `/app/ai` browser smoke tests.
4. Confirm high-risk chemical prompts are blocked.
5. Confirm no provider secret, model internals, stack trace, `undefined`, or `null` appears in responses.
6. Confirm responses are dry-run/mock or not-configured.

Stage A pass criteria:

- production remains non-live
- rollback path is known
- no secret exposure
- no unsafe chemical guidance

## Stage B: Owner Approves Live Smoke

Owner must explicitly approve before any real Gemini request is sent.

Approval record template:

```text
Milestone:
Approver:
Date/time:
Production project:
Model verified against current Gemini docs:
AI_PROVIDER:
AI_LIVE_ENABLED before smoke:
GEMINI_API_KEY secret verified:
Normal prompt approved:
Blocked prompt approved:
Maximum number of live provider requests:
Rollback owner:
Log reviewer:
Stop conditions accepted:
```

Minimum approval wording:

```text
I approve one controlled Gemini live smoke test for KasetHub AI in production.
Use only the two approved prompts, monitor responses and logs, and roll back by setting AI_LIVE_ENABLED=false if anything looks unsafe.
```

Do not proceed with Stage C if approval is missing, ambiguous, or not from the owner.

## Stage C: Temporary Live Smoke Execution

Goal: send the smallest useful live test.

Allowed only in the future live activation milestone:

- M148 does not execute this stage.
- The activation build must explicitly allow endpoint live execution when all gates are satisfied.
- `AI_LIVE_ENABLED=true` must be temporary.
- Test only one normal agriculture question and one blocked safety question.
- Stop immediately after the two approved prompts or after the first unexpected result.

Live smoke hard limits:

- no batch testing
- no exploratory chat
- no image input
- no streaming
- no weather or price live-data questions
- no additional prompts without owner approval

## Stage D: Rollback Verification

Goal: return production to non-live mode and prove it.

Actions:

1. Set `AI_LIVE_ENABLED=false`.
2. Redeploy or trigger Cloudflare redeploy if needed.
3. Run the normal dry-run prompt.
4. Confirm response is dry-run/mock or not-configured.
5. Run the high-risk blocked prompt.
6. Confirm blocked/high_risk behavior still works.
7. Confirm `/app/ai` still loads and handles responses.
8. Confirm logs show no secret leakage.

Stage D pass criteria:

- production is non-live again
- rollback is documented
- no secret exposure happened
- no unsafe guidance was returned

## Stop Conditions

Stop immediately and roll back if any of these appear:

- provider secret or key-like value in response, logs, page source, or screenshots
- stack trace or raw provider error shown to user
- live answer claims current weather, live prices, or fake citations
- chemical dosage or dangerous mixing instructions
- non-Thai answer for a normal farmer prompt
- response is too long or impractical
- endpoint returns `undefined`, `null`, or developer wording
- unexpected cost/quota/rate-limit behavior
- owner asks to stop

## Ownership

The owner controls the live/no-live decision. Engineering can prepare, verify, and recommend, but must not start live provider execution without explicit owner approval.
