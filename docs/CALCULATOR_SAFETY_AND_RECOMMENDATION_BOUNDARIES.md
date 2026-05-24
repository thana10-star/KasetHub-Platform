# Calculator Safety And Recommendation Boundaries

M51 adds `/app/calculators/safety` to make calculator boundaries visible before KasetHub adds advanced crop-specific or AI-assisted features.

## What Calculators Can Do

- Convert Thai land units.
- Calculate spray mix amounts from label ratios typed by the user.
- Estimate plant count, seedling count, yield, and cost from deterministic formulas.
- Help farmers prepare numbers for a conversation with an expert.

## What Calculators Cannot Do Yet

- Recommend fertilizer doses by crop, soil, season, or plant age.
- Recommend pesticide, chemical, hormone, or product use.
- Read labels through OCR.
- Validate legal restrictions or worker safety requirements.
- Guarantee yield, profit, disease control, or field safety.

## Fertilizer Safety Boundary

The fertilizer helper is still a basic NPK arithmetic tool. It must keep:

- `เป็นการคำนวณเบื้องต้น`
- visible no-guarantee copy
- soil test and expert confirmation reminders
- separation between user-entered targets and future reviewed rules

Crop profiles use `fertilizerPlanningStatus = planning_only`. They must not contain exact crop fertilizer recommendations yet.

## Chemical Safety Boundary

Spray mix remains label-first. It must keep:

- `ควรอ่านฉลากจริงก่อนใช้`
- warnings for high concentration
- reminders to follow real label and legal restrictions
- no product suggestions
- no pesticide recommendation engine

## AI Boundary

Future AI can explain inputs and surface missing assumptions. It must not:

- overwrite deterministic results
- hide uncertainty
- produce fertilizer or chemical recommendations without reviewed rules
- mix sponsor content into advice
- present calculations as guaranteed outcomes

## Sponsor/Affiliate Boundary

Sponsored products must never be silently mixed into calculator output or AI explanations. Paid placement must be labeled, separated from deterministic results, and never use calculator history without explicit consent and backend-owned audit logs.

## Why Confirmation Matters

Farm safety depends on context the calculator does not know: real label text, soil test, water availability, plant age, local regulations, worker safety, weather, disease pressure, and field history. These must be checked before real-world use.
