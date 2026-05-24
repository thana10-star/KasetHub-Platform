# Calculator AI Explanation Boundary

M55 defines the safe boundary for future AI explanations of agriculture calculator results. The feature is planning and preview only: there is no real AI API call, no network call, no backend write, no Supabase write, no sponsor integration, and no hidden recommendation behavior.

## Purpose

The future AI layer may help farmers understand deterministic calculator outputs in simple Thai. It may explain what the inputs mean, how the formula was applied, what the result means, and what should be double-checked before real-world use.

The AI layer must treat calculator output as locked input. It must not mutate formula results, replace calculator math, add crop-specific fertilizer doses, recommend chemical products, or claim a guaranteed yield or profit.

## New Service Files

- `src/services/agri-calculators/calculator-ai-explanation.types.ts`
- `src/services/agri-calculators/calculator-ai-explanation-policy.ts`
- `src/services/agri-calculators/calculator-ai-explanation-fixtures.ts`
- `src/services/agri-calculators/calculator-ai-explanation-planner.ts`

## Route

`/app/calculators/ai-explanation-preview` shows a local-only preview of:

- example calculator result
- explanation plan
- allowed actions
- blocked actions
- prompt scaffold preview
- safety disclaimers
- `noRealAICall: true`

## Allowed Actions

- explain inputs
- explain formulas
- explain result meaning
- suggest what to double-check
- suggest asking an expert
- explain safety disclaimer

## Blocked Actions

- change deterministic result
- recommend chemical products
- recommend exact fertilizer dose not in the calculator
- mention sponsor product
- claim guaranteed yield or profit
- override label instructions
- hide uncertainty

## Formula Integrity

Every explanation plan returns formula integrity flags:

- `deterministicResultUnchanged: true`
- `noFormulaMutation: true`
- `noHiddenRecommendation: true`

These are not runtime security controls yet. They are explicit contract fields and tests for the future AI boundary.

## Thai Safety Copy

The UI must clearly say:

- `ยังไม่เรียก AI จริง`
- `ผลคำนวณเบื้องต้น`
- AI can explain but must not change the result
- check real labels, soil test, area, price, and expert advice before real use

## Future Integration Requirements

Before any real AI call is added:

- use a backend-owned AI proxy, never frontend provider keys
- log prompt policy version and calculator result snapshot server-side
- keep deterministic calculator values outside the model's control
- show AI output separately from formula result
- reject sponsor/product placement inside explanation prompts
- test that the same calculator inputs still produce the same deterministic result

## M56 Backend Architecture Review

M56 adds `/app/calculators/ai-architecture` and the `calculator-ai-backend-review` service. It defines the future backend flow:

```text
Calculator -> Snapshot Lock -> Backend Policy Check -> Prompt Builder -> AI Explanation -> Safety Filter -> Final Display
```

The snapshot lock freezes result recap values before AI. The backend review plan says AI receives an explanation-only snapshot, cannot recompute formulas, cannot mutate outputs, and must echo locked result values only.

M56 still does not call AI, write backend data, write Supabase data, sync to cloud, or add sponsor/affiliate behavior.

## M57 Adapter Contract

M57 adds a frontend adapter contract for future calculator AI explanations:

- `calculator-ai-adapter.types.ts`
- `calculator-ai-adapter.ts`
- `calculator-ai-local-fixtures.ts`

The adapter default is `local_fixture`. It returns deterministic Thai fixture explanations from the locked snapshot and includes `noRealAICall: true`.

`/app/calculators/ai-adapter-status` shows the current mode, backend flag, network flag, supported request type, locked hash, and future staging checklist.

The adapter still blocks hidden sponsor content, chemical/product recommendations, deterministic result mutation, and fertilizer dose invention before any AI path can run.
