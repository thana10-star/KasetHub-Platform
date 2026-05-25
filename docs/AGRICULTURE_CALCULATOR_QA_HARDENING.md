# Agriculture Calculator QA Hardening

M50 hardens the M49 agriculture calculator foundation with deterministic fixtures, validation helpers, safer warning states, and an in-app QA route.

M51 builds on this by adding crop profile fixtures and a static unit-test readiness plan. M52 implements the first formal Vitest service-level tests for the calculator domain.

## Scope

- No backend writes.
- No Supabase writes or migrations.
- No AI API calls.
- No OCR.
- No payment, sponsor, or affiliate integration.
- No network calls.
- Calculator history and share summaries remain local-only.

## Files

- `src/services/agri-calculators/agri-calculator-test-fixtures.ts`
- `src/services/agri-calculators/agri-calculator-validation.ts`
- `src/routes/CalculatorQAPage.tsx`
- `/app/calculators/qa`
- `src/services/agri-calculators/agri-calculator-unit-test-plan.ts`
- `src/services/agri-calculators/agri-calculator-service.test.ts`
- `src/services/agri-calculators/agri-calculator-edge-fixtures.ts`

## Deterministic Test Cases

The QA route runs expected-vs-actual checks for:

- spray mix 20L from 20cc/20L
- spray mix 10L from 20cc/20L
- spray mix 200L from 20cc/20L
- plant spacing 1 rai at 1m x 1m
- plant spacing 5 rai at 1m x 0.8m
- fertilizer N target with 46-0-0
- yield estimate from sample weight and total units
- cost per rai from total cost and area

Statuses:

- `pass`: valid result and within tolerance
- `warn`: result matches but validation warnings need review
- `fail`: invalid result or outside tolerance

## Validation Rules

The validation layer guards:

- empty, zero, negative, and non-number inputs
- missing units from corrupted local state
- extremely high tank size, area, fertilizer amount, yield, cost, or plant count
- unsafe spray concentration warnings
- area too small or too large warnings
- divide-by-zero cases

Invalid results should not be saved into local calculator history.

## UX Rules

Calculator pages should keep:

- large numeric inputs and buttons
- a clear warning/error state before saving
- a larger primary result card
- `คำนวณใหม่` reset action
- link back to `/app/calculators`
- local-only history note

## Safety Copy

The calculators must keep Thai-first safety language:

- `สรุปผลคำนวณเบื้องต้น`
- `ควรตรวจสอบฉลาก/ผู้เชี่ยวชาญก่อนใช้งานจริง`
- `ควรอ่านฉลากจริงก่อนใช้`
- `เป็นการคำนวณเบื้องต้น`

Results are not guarantees and are not replacements for product labels, soil tests, agronomists, official land surveys, accounting advice, or legal requirements.

## Future Work

M50-M52 are still arithmetic QA and planning, not agronomy intelligence. Future milestones can add broader edge-case fixtures by crop, export/share polish, and eventually AI explanations only after deterministic outputs remain separate from advice.

The M52 tests cover spray mix math, Thai land unit conversion, plant spacing, fertilizer NPK helper, yield estimate, cost estimate, crop profile example loading, validation boundaries, and edge fixtures.
