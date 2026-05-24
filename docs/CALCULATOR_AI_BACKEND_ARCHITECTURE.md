# Calculator AI Backend Architecture

M56 reviews the real backend architecture for future calculator AI explanations before live AI calls are enabled. This is design and local preview only. No AI provider is called, no backend write happens, and no Supabase write or migration is run.

## Target Flow

```text
Calculator
-> Snapshot Lock
-> Backend Policy Check
-> Prompt Builder
-> AI Explanation
-> Safety Filter
-> Final Display
```

## Core Rule

Deterministic calculator values are immutable. AI may explain locked values, but it must not recompute formulas, mutate results, invent fertilizer or chemical recommendations, insert sponsor content, or hide uncertainty.

## New Service Files

- `src/services/agri-calculators/calculator-ai-backend.types.ts`
- `src/services/agri-calculators/calculator-ai-backend-review.ts`

## Route

`/app/calculators/ai-architecture` shows:

- explanation pipeline
- deterministic snapshot lock
- blocked actions
- policy version examples
- audit and rate-limit plan
- future backend stages
- no-real-AI notice

## Backend Responsibilities

A future backend AI explanation endpoint should:

- receive a locked calculator snapshot, not raw mutable calculator state
- verify policy and prompt template versions
- reject blocked actions before provider calls
- build prompts server-side with backend-owned provider keys
- filter AI output before returning it
- store audit logs only after auth, consent, schema, and RLS are reviewed

## Current M56 Boundary

- no real AI call
- no backend endpoint
- no backend write
- no Supabase write
- no cloud sync
- no sponsor/affiliate integration
- no AdMob/payment integration
- local architecture review only

## M57 Adapter Contract Layer

M57 adds `calculator-ai-adapter.ts` on top of this architecture. The adapter keeps `local_fixture` as the default mode and still performs no fetch by default.

New route:

- `/app/calculators/ai-adapter-status`

Adapter modes:

- `local_fixture`
- `backend_disabled`
- `backend_test_ready`
- `production_disabled`

Feature flags:

- `VITE_CALCULATOR_AI_MODE=local_fixture`
- `VITE_ENABLE_CALCULATOR_AI_BACKEND=false`
- `VITE_ENABLE_CALCULATOR_AI_NETWORK=false`

`backend_test_ready` cannot run a backend test client unless both backend and network flags are explicitly true. M57 still defines no real endpoint URL and no provider call.

## M58 Endpoint Plan

M58 adds a planning-only endpoint checklist route:

- `/app/calculators/ai-endpoint-plan`

The route and `calculator-ai-endpoint-plan.ts` define:

- backend-only prompt execution
- no frontend provider keys
- backend route or Edge Function ownership
- request validation
- lock-hash verification
- policy version validation
- audit log requirement
- rate limits
- abuse prevention
- timeout handling
- sponsor separation
- no formula mutation
- no hidden recommendation injection

No endpoint is created in M58 and no network path is enabled.
