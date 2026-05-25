# Calculator Regression Safety

M52 adds formal service-level tests for the agriculture calculator domain. The goal is to keep deterministic math stable before adding crop-specific rules, AI explanations, or future expert-reviewed recommendations.

## Core Principle

The calculator service is the source of deterministic arithmetic. Given the same input, it should produce the same output unless a migration note explicitly records a formula change.

## What Must Stay Stable

- spray mix ratio scaling
- Thai land unit conversion
- plant spacing density
- fertilizer NPK helper math
- yield estimate arithmetic
- cost estimate arithmetic
- validation status for unsafe inputs
- crop profile loading as planning-only examples

## Recommendation Boundary

A future recommendation layer must not silently change calculator output. If KasetHub later adds crop-specific rules, those rules must be:

- separate from pure calculator formulas
- labeled as reviewed recommendations
- versioned
- cited by source/rule version
- covered by tests
- clearly distinguishable from user-entered arithmetic

## AI Boundary

Future AI explanations may describe inputs, assumptions, and next checks. AI must not:

- overwrite deterministic output
- hide formula changes
- invent crop fertilizer doses
- recommend pesticide or chemical products
- mix sponsor content into advice

## Crop Profile Boundary

Crop profile examples are starter values to help users fill forms. They are not final recommendations and must keep:

```text
ตัวอย่างนี้เป็นค่าเริ่มต้นเพื่อช่วยกรอก ไม่ใช่คำแนะนำทางวิชาการสุดท้าย
```

## Edge-case Coverage

M52 edge fixtures cover:

- extreme spray concentration
- extremely small land
- huge land
- invalid crop key
- impossible spacing
- unrealistic yield
- negative costs
- invalid units
- overflow-ish cost values

These tests protect against divide-by-zero, invalid localStorage state, unsafe concentrations, high-value warnings, and unexpected `Infinity` results.

## Export/Share Regression Safety

M54 adds tests for text export templates and share fallback helpers. These tests protect:

- short LINE-friendly text generation
- long detail text generation
- empty summary blocking
- unsupported native share fallback
- clipboard copy success and missing clipboard states
- oversized summary truncation

Template and share changes must not alter deterministic calculator formulas. Future AI explanations, sponsor placements, or rewarded unlocks must read calculator output as an input, not rewrite the formula result.

## M55 AI Explanation Regression Safety

M55 adds a local-only AI explanation planner. It is not an AI runtime. The planner must preserve calculator output by treating `CalculatorResultSummary.resultRecap` as a locked snapshot.

Regression checks now cover:

- formula explanation is allowed
- sponsor product requests are blocked
- chemical product recommendations are blocked
- deterministic result mutation is blocked
- calculator result values are preserved in the explanation plan
- fertilizer and spray calculations receive extra safety disclaimers
- `noRealAICall` remains `true`

Future AI integrations must call the planner/policy before constructing prompts and must keep AI text separate from deterministic result cards.

## M56 Backend Architecture Regression Safety

M56 extends tests from local explanation planning into backend architecture planning. Regression checks now cover:

- frozen `CalculatorAIExecutionSnapshot` result values
- blocked deterministic mutation attempts
- banned sponsor insertion
- invalid explanation request rejection
- policy version selection
- oversized payload and invalid crop profile rejection

Future backend AI work must keep these checks passing before adding network calls or provider integration.

## M57-M58 Adapter And Endpoint Regression Safety

M57 adds the disabled-by-default adapter contract. M58 adds deterministic adapter QA fixtures plus a staging endpoint design checklist. These are still local-only safety layers, not a backend integration.

Regression checks now cover:

- `local_fixture` responses keep `noRealAICall: true`
- `backend_disabled` and `production_disabled` stay disabled
- `backend_test_ready` refuses a backend path unless explicit backend and network flags are enabled
- invalid, oversized, sponsor, chemical/product, result-mutation, invalid-crop, policy-mismatch, and locked-hash-mismatch requests are blocked before any network path
- locked result hashes remain preserved in adapter responses and QA fixtures
- endpoint readiness remains `blocked_until_backend_exists`

Future endpoint work must not add frontend provider keys, hidden sponsor content, formula mutation, or a network path that bypasses lock-hash, policy, audit, rate-limit, and safety checks.

## M59 Edge Function Contract Regression Safety

M59 adds tests for the future `calculator-ai-explain` Edge Function contract.

Regression checks now cover:

- typed request payloads exclude provider keys, service-role keys, and sponsor payloads
- response previews keep provider, network, and Supabase writes disabled
- lock-hash mismatch blocks before provider paths
- policy mismatch blocks before provider paths
- timeout plans cannot mutate deterministic results
- audit and rate-limit hooks remain planning-only

Future Edge Function work must keep these tests passing before adding a deployed function or staging network call.

## M60 Edge Dry-run Regression Safety

M60 adds tests for the staging-only Edge dry-run plan.

Regression checks now cover:

- default frontend builds cannot call the endpoint
- a configured dry-run URL alone is not enough
- the Edge network flag alone is not enough
- dry-run plus network flags still do not run `fetch` in M60
- frontend config rejects provider keys and service-role keys
- validation fixtures classify missing snapshot, lock-hash mismatch, policy mismatch, oversized payload, sponsor insertion, chemical request, missing auth, and timeout fallback cases
- production blockers remain until auth, audit logging, and rate limits are implemented

Future dry-run clients must keep these checks passing before adding any fetch path, Edge deployment, provider integration, Supabase write, or production behavior.
