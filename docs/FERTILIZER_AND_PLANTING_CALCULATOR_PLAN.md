# Fertilizer And Planting Calculator Plan

M49 adds simple foundations for fertilizer, planting density, yield estimate, and cost estimate. M50 adds validation hardening, QA fixtures, and local share summaries. M51 adds crop-specific planning examples and safety boundaries. These are calculator utilities, not agronomy recommendation engines.

## Fertilizer Helper

Route: `/app/calculators/fertilizer`

Inputs:

- area
- area unit
- target N/P/K per rai
- fertilizer N/P/K percentages
- base nutrient for calculation

Current formula:

```text
target nutrient total = target kg per rai * area rai
fertilizer kg = target nutrient total / (fertilizer nutrient percent / 100)
```

When `auto` is selected, the helper uses the nutrient that produces the highest valid fertilizer amount as the arithmetic base.

Required warning:

- `เป็นการคำนวณเบื้องต้น`

M50 validation prevents divide-by-zero when a target nutrient or fertilizer percentage is missing, warns on very high fertilizer amounts, and blocks invalid saves until inputs are corrected.

M51 crop examples may fill area context only on the fertilizer page. They do not fill crop-specific NPK targets, fertilizer doses, or product names.

Boundary:

- No crop-specific fertilizer plan.
- No soil test interpretation.
- No timing schedule.
- No real agronomy recommendation.
- No product endorsement.

## Plant Spacing

Route: `/app/calculators/plant-spacing`

Inputs:

- land size
- land unit
- row spacing in centimeters
- plant spacing in centimeters
- usable area percentage
- seedling buffer percentage

Formula:

```text
area per plant = row spacing meters * plant spacing meters
usable area = total area square meters * usable area percent
estimated plant count = usable area / area per plant
seedling count = plant count * buffer
```

Thai unit rules:

- `1 ไร่ = 1,600 ตารางเมตร`
- `1 งาน = 400 ตารางเมตร`
- `1 ตารางวา = 4 ตารางเมตร`

M50 validation checks zero, negative, non-number, very small/large spacing, very small/large area, and unusually high plant counts.

M51 adds crop profile spacing examples for rice, cassava, sugarcane, maize, durian, longan, rubber, and mixed vegetables. These are labeled as starter form values, not final agronomy recommendations.

## Yield Estimate

Route: `/app/calculators/yield-estimate`

Inputs:

- area
- sample count
- average weight in kg
- estimated total units

Outputs:

- sample total kg
- estimated total kg
- estimated total ton
- yield per rai

M50 validation guards zero/negative sample inputs, very high yield estimates, and divide-by-zero for yield per rai.

M51 yield profile examples help fill sample count, average weight, and total units for calculator practice. They are not yield forecasts.

Boundary:

- Sampling quality is user-owned.
- No market grade adjustment.
- No moisture adjustment.
- No disease/weather correction.

## Cost Estimate

Route: `/app/calculators/cost`

Inputs:

- fertilizer/chemical cost
- labor
- water
- machinery
- other
- optional expected yield kg

Outputs:

- total cost
- cost per rai
- optional cost per kg
- break-even placeholder

M50 validation guards missing area, negative cost fields, all-zero costs, very high total cost, and very high cost per rai.

M51 cost profile examples list common cost categories by crop and fill area context. Users must enter their own real costs.

## M50 QA And Share Summary

`/app/calculators/qa` shows deterministic test cases with expected vs actual results for spray mix, plant spacing, fertilizer helper, yield estimate, and cost estimate.

Valid calculator pages can copy/share a local text summary. Every summary is labeled `สรุปผลคำนวณเบื้องต้น` and repeats `ควรตรวจสอบฉลาก/ผู้เชี่ยวชาญก่อนใช้งานจริง`. The share foundation does not create files, write backend data, call Supabase, call AI, or send calculator history to sponsors.

Boundary:

- No sale price feed.
- No loan/interest model.
- No tax/accounting advice.
- No payment system.

## Future AI Recommendation Integration

AI can later help explain what each input means, detect missing assumptions, or generate a checklist. It should not turn M49 formulas into hidden recommendations. Any AI-generated fertilizer or planting suggestion must be labeled, reviewed, and separated from deterministic calculator output.

## Future Sponsor And Affiliate Boundary

The foundation must stay neutral. Product or service sponsors may appear only after:

- clear ad labeling
- consent-aware tracking
- no influence over base formula output
- backend-owned audit records
- privacy review for calculation data

Calculation history should never be sent to sponsors or affiliates by default.
