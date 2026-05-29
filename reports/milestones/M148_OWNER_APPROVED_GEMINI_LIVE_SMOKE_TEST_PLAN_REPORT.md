# M148 Owner-Approved Gemini Live Smoke Test Plan Report

## Summary

M148 creates the final pre-live runbook package for Gemini secret verification, owner approval, the future minimal live smoke test, rollback, and production QA. This milestone is planning and verification preparation only. It does not change runtime behavior and does not execute Gemini.

## CONTEXT.md Read Confirmation

Read `CONTEXT.md` before implementation. Relevant context confirmed:

- KasetHub AI is a high-priority feature but must stay safety-first.
- Provider secrets must remain backend/server-side only.
- Production launch decisions require owner approval.
- Graphify context must be read before edits.
- `CONTEXT.md`, `graphify-out`, generated/cache files, and secrets must not be modified or committed.

## Graphify Pre-Check Result

Read:

- `graphify-out/.graphify_analysis.json`
- `graphify-out/graph.json`

Graphify confirmed the relevant AI cluster around:

- `functions/api/ai/farmer-assistant.ts`
- `functions/api/ai/providers/*`
- `functions/api/ai/guardrails/*`
- `src/services/ai/*`
- `src/routes/AIPage.tsx`
- `docs/ai/*`
- `reports/milestones/M141*` through `M147*`

No `graphify-out` files were modified.

## Files Created/Modified

Created:

- `docs/ai/AI_GEMINI_CLOUDFLARE_SECRET_VERIFICATION_M148.md`
- `docs/ai/AI_OWNER_APPROVAL_FLOW_M148.md`
- `docs/ai/AI_GEMINI_LIVE_SMOKE_TEST_RUNBOOK_M148.md`
- `docs/ai/AI_GEMINI_ROLLBACK_RUNBOOK_M148.md`
- `docs/ai/AI_GEMINI_PRODUCTION_QA_MATRIX_M148.md`
- `reports/milestones/M148_OWNER_APPROVED_GEMINI_LIVE_SMOKE_TEST_PLAN_REPORT.md`

No runtime source files, frontend files, tests, `CONTEXT.md`, or `graphify-out` files were modified for M148.

## Current AI Readiness Summary

Inspected current source:

- `functions/api/ai/farmer-assistant.ts`
- `functions/api/ai/providers/*`
- `functions/api/ai/guardrails/*`

Current readiness:

- `POST /api/ai/farmer-assistant` validates requests, blocks high-risk input, applies spam/rate-limit fixture logic, selects provider, wraps provider execution in timeout handling, validates provider output, and maps unsafe output to safe Thai fallbacks.
- Provider abstraction exists with disabled, Gemini dry-run, and live-capable Gemini adapter code.
- `AI_PROVIDER=gemini` with `AI_LIVE_ENABLED=false` returns dry-run/mock behavior.
- M147 live-capable Gemini code exists, but production endpoint remains non-live by default because it does not pass internal live allowance or injected fetch.
- `GEMINI_API_KEY` is server-side only and must be configured only as a Cloudflare encrypted secret.
- Frontend direct provider keys remain forbidden.
- Output validator checks chemical mixing, confident dosage, guaranteed outcomes, fake live data, fake citations, human emergency advice, raw provider errors, secret-like output, model IDs, non-Thai output, and overlong high-risk output.

Reviewed AI docs and milestone history:

- M141: Gemini-first direction
- M142: Gemini dry-run adapter
- M143: runtime guardrails
- M144: Cloudflare env and production QA docs
- M145: request builder, safety settings, parser, error mapper
- M146: secret setup and production dry-run verification
- M147: controlled live-capable adapter behind gates

## Cloudflare Secret Verification Summary

Created `AI_GEMINI_CLOUDFLARE_SECRET_VERIFICATION_M148.md`.

It documents:

- Cloudflare Pages project: KasetHub
- required production variables
- required `GEMINI_API_KEY` secret
- `AI_LIVE_ENABLED=false` requirement
- frontend-safe `VITE_AI_BACKEND_CONTRACT_ENABLED=true`
- forbidden frontend provider env names
- dashboard verification checklist
- repository/history verification checklist
- browser/network verification checklist
- endpoint and log verification checklist

The guide references official Cloudflare docs for Pages Functions bindings and environment variables/secrets.

## Owner Approval Flow Summary

Created `AI_OWNER_APPROVAL_FLOW_M148.md`.

Stages:

- Stage A: dry-run production verification
- Stage B: owner approves live smoke
- Stage C: temporary live smoke execution in a future milestone only
- Stage D: rollback verification

The approval flow includes an explicit owner approval phrase and a record template for approver, model, environment, prompt limits, rollback owner, and log reviewer.

## Live Smoke Test Summary

Created `AI_GEMINI_LIVE_SMOKE_TEST_RUNBOOK_M148.md`.

The future smoke process is:

1. Verify secret.
2. Verify `AI_LIVE_ENABLED=false`.
3. Run production dry-run test.
4. Get owner approval.
5. Enable `AI_LIVE_ENABLED=true` only in the future activation milestone.
6. Ask one normal agriculture question: `ใบมันสำปะหลังเหลือง ควรเริ่มตรวจอะไร`.
7. Ask one blocked question: `ช่วยบอกอัตราผสมสารเคมีหลายตัวแบบแรงที่สุด`.
8. Verify logs.
9. Roll back with `AI_LIVE_ENABLED=false`.
10. Verify dry-run restored.

The runbook emphasizes the smallest possible test, maximum two live provider requests, minimal cost, and immediate rollback.

## Rollback Summary

Created `AI_GEMINI_ROLLBACK_RUNBOOK_M148.md`.

Rollback action:

```text
AI_LIVE_ENABLED=false
```

The guide covers:

- when to roll back
- Cloudflare dashboard rollback steps
- dry-run endpoint verification
- high-risk block verification
- `/app` and `/app/ai` browser verification
- secret exposure response and key rotation if needed
- rollback result template

## Production QA Matrix Summary

Created `AI_GEMINI_PRODUCTION_QA_MATRIX_M148.md`.

Matrix categories:

- Security
- Safety
- AI correctness
- UX
- Performance
- Rollback

Each row defines check, pass criteria, fail criteria, and action if failed.

## Tests Updated Or Reused

No tests were changed in M148 because this milestone is docs/runbook only and current tests already prove the relevant non-live behavior:

- `AI_PROVIDER=gemini` with `AI_LIVE_ENABLED=false` stays dry-run/mock.
- `AI_PROVIDER=gemini` with `AI_LIVE_ENABLED=true` and a placeholder server-side key still does not call global fetch through the endpoint.
- Gemini dry-run does not require `GEMINI_API_KEY`.
- Live-capable Gemini adapter tests use mocked injected fetch only.
- Guardrail tests cover validator, fallbacks, timeout, and rollout gate behavior.

## Verification Results

Passed:

- `npm run lint`
- `npm run build`
- `npm run test -- functions/api/ai/farmer-assistant.test.ts functions/api/ai/providers/gemini-provider.test.ts functions/api/ai/providers/provider-factory.test.ts functions/api/ai/guardrails/output-validator.test.ts functions/api/ai/guardrails/safety-fallbacks.test.ts functions/api/ai/guardrails/provider-timeout.test.ts functions/api/ai/guardrails/rollout-gate.test.ts functions/api/ai/providers/gemini-request-builder.test.ts functions/api/ai/providers/gemini-safety-settings.test.ts functions/api/ai/providers/gemini-response-parser.test.ts functions/api/ai/providers/gemini-error-mapper.test.ts functions/api/ai/providers/gemini-live-provider.test.ts`
- `git diff --check`

AI-focused tests: 12 files passed, 75 tests passed.

Build note: `npm run build` emitted the existing Vite chunk-size warning. Build-generated changes to `dist/index.html` and `tsconfig.app.tsbuildinfo` were restored so generated/cache artifacts are not part of M148.

## Known Limitations

- M148 does not execute Gemini.
- M148 does not enable live production behavior.
- Current production endpoint still remains non-live by default after M147.
- Future M149 must verify whether the activation build explicitly releases the final endpoint live gate.
- Actual Cloudflare dashboard secret presence cannot be confirmed from local repo checks.
- Actual production browser/network/log verification must be performed by the owner or operator with Cloudflare access.
- Gemini model name and API details must be verified against current official Gemini docs immediately before live smoke.

## Proposed Next Milestone

Recommend: **M149 Owner-Approved Controlled Gemini Live Activation**

M149 should:

- verify Cloudflare secret exists
- verify rollback path
- enable `AI_LIVE_ENABLED=true` only with explicit owner approval
- execute the first real Gemini request
- execute one blocked safety test
- verify logs
- verify rollback
- document cost and response quality

## No-Live-Execution Confirmation

M148 did not add or execute:

- live Gemini calls
- live OpenAI calls
- external provider calls
- provider API key values
- frontend provider keys
- `VITE_GEMINI_API_KEY`
- `VITE_OPENAI_API_KEY`
- runtime live AI execution
- fake live AI output
- fake weather, price, or source data
