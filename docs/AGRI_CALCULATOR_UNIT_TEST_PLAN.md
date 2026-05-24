# Agri Calculator Unit Test Plan

M51 adds a static unit-test readiness plan in:

- `src/services/agri-calculators/agri-calculator-unit-test-plan.ts`

No test runner is added in M51. The plan prepares formal tests for a later milestone.

## Planned Groups

- spray mix math
- land unit conversion
- plant spacing
- fertilizer NPK helper
- yield estimate
- cost estimate
- crop profile example loading

## High-priority Assertions

Spray mix:

- 20cc/20L with 20L tank returns 20cc.
- 20cc/20L with 10L tank returns 10cc.
- 20cc/20L with 200L tank returns 200cc.
- zero and non-number inputs do not divide by zero.

Land units:

- `1 ไร่ = 1,600 ตารางเมตร`
- `1 งาน = 400 ตารางเมตร`
- `1 ตารางวา = 4 ตารางเมตร`

Plant spacing:

- 1 rai at 1m x 1m returns 1,600 plants.
- 5 rai at 1m x 0.8m returns 10,000 plants.
- usable area and seedling buffer remain separate.

Fertilizer:

- N target 4kg/rai with 46-0-0 returns about 8.70kg.
- all-zero NPK formula is invalid.
- all-zero nutrient targets are invalid.
- crop profiles do not inject crop-specific fertilizer doses.

## Medium-priority Assertions

Yield estimate:

- sample weight multiplication works.
- yield per rai divides by normalized area.
- low sample count warns.

Cost estimate:

- total cost divided by rai works.
- all-zero costs are invalid.
- negative costs are invalid.
- expected yield zero does not calculate cost per kg.

Crop profile loading:

- all required crop keys are present.
- every profile has spacing, area, yield, cost categories, and safety notes.
- every profile keeps `fertilizerPlanningStatus = planning_only`.
- no profile contains pesticide or product recommendations.

## Future Runner

A later milestone can add Vitest or the repo-standard test runner if selected. Tests should run against pure services first and avoid browser/network dependencies.
