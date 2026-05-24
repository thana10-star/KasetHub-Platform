# Fertilizer And Planting Calculator Plan

M49 adds simple foundations for fertilizer, planting density, yield estimate, and cost estimate. These are calculator utilities, not agronomy recommendation engines.

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
