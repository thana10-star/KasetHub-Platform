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
