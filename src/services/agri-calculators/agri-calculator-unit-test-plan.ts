export type AgriCalculatorUnitTestGroup =
  | 'spray_mix_math'
  | 'land_unit_conversion'
  | 'plant_spacing'
  | 'fertilizer_npk_helper'
  | 'yield_estimate'
  | 'cost_estimate'
  | 'crop_profile_examples';

export type AgriCalculatorUnitTestPriority = 'high' | 'medium';

export type AgriCalculatorUnitTestPlanItem = {
  id: string;
  group: AgriCalculatorUnitTestGroup;
  title: string;
  priority: AgriCalculatorUnitTestPriority;
  plannedAssertions: string[];
  fixtureSource: string;
  testFile: string;
  status: 'planned' | 'implemented';
};

export const agriCalculatorUnitTestPlan: AgriCalculatorUnitTestPlanItem[] = [
  {
    id: 'spray-mix-ratio-scaling',
    group: 'spray_mix_math',
    title: 'Spray mix ratio scaling',
    priority: 'high',
    fixtureSource: 'agri-calculator-test-fixtures.ts',
    testFile: 'agri-calculator-service.test.ts',
    status: 'implemented',
    plannedAssertions: [
      '20cc/20L with 20L tank returns 20cc',
      '20cc/20L with 10L tank returns 10cc',
      '20cc/20L with 200L tank returns 200cc',
      'zero or non-number inputs return invalid result and no divide-by-zero',
    ],
  },
  {
    id: 'thai-land-unit-conversion',
    group: 'land_unit_conversion',
    title: 'Thai land unit conversion',
    priority: 'high',
    fixtureSource: 'agri-calculator-service.ts',
    testFile: 'agri-calculator-service.test.ts',
    status: 'implemented',
    plannedAssertions: [
      '1 rai equals 1,600 square meters',
      '1 ngan equals 400 square meters',
      '1 square wa equals 4 square meters',
      'area labels show rai, ngan, square wa, and square meters',
    ],
  },
  {
    id: 'plant-spacing-density',
    group: 'plant_spacing',
    title: 'Plant spacing density',
    priority: 'high',
    fixtureSource: 'agri-calculator-test-fixtures.ts and crop-calculator-profiles.ts',
    testFile: 'agri-calculator-service.test.ts',
    status: 'implemented',
    plannedAssertions: [
      '1 rai at 1m x 1m returns 1,600 plants',
      '5 rai at 1m x 0.8m returns 10,000 plants',
      'usable area and seedling buffer are applied separately',
      'missing spacing returns invalid result',
    ],
  },
  {
    id: 'fertilizer-npk-helper',
    group: 'fertilizer_npk_helper',
    title: 'Fertilizer NPK helper',
    priority: 'high',
    fixtureSource: 'agri-calculator-test-fixtures.ts',
    testFile: 'agri-calculator-service.test.ts',
    status: 'implemented',
    plannedAssertions: [
      'N target 4kg/rai with 46-0-0 returns about 8.70kg fertilizer',
      'all-zero NPK formula returns invalid result',
      'all-zero target nutrients return invalid result',
      'crop profile loading does not inject crop-specific fertilizer dose',
    ],
  },
  {
    id: 'yield-estimate-sample-total',
    group: 'yield_estimate',
    title: 'Yield estimate sample total',
    priority: 'medium',
    fixtureSource: 'agri-calculator-test-fixtures.ts',
    testFile: 'agri-calculator-service.test.ts',
    status: 'implemented',
    plannedAssertions: [
      '1,000 units at 0.5kg returns 500kg',
      'yield per rai divides by normalized area',
      'low sample count produces warning',
      'zero area does not divide by zero',
    ],
  },
  {
    id: 'cost-estimate-per-rai',
    group: 'cost_estimate',
    title: 'Cost estimate per rai',
    priority: 'medium',
    fixtureSource: 'agri-calculator-test-fixtures.ts',
    testFile: 'agri-calculator-service.test.ts',
    status: 'implemented',
    plannedAssertions: [
      '4,000 baht over 2 rai returns 2,000 baht/rai',
      'all-zero cost fields return invalid result',
      'negative cost fields return invalid result',
      'expected yield zero does not calculate cost per kg',
    ],
  },
  {
    id: 'crop-profile-example-loading',
    group: 'crop_profile_examples',
    title: 'Crop profile example loading',
    priority: 'medium',
    fixtureSource: 'crop-calculator-profiles.ts',
    testFile: 'agri-calculator-service.test.ts',
    status: 'implemented',
    plannedAssertions: [
      'all required crop keys are present',
      'each crop has spacing, area, yield, cost category, and safety notes',
      'fertilizerPlanningStatus is planning_only for every crop',
      'no profile contains pesticide product recommendations',
    ],
  },
];

export function summarizeAgriCalculatorUnitTestPlan() {
  return {
    totalCount: agriCalculatorUnitTestPlan.length,
    highPriorityCount: agriCalculatorUnitTestPlan.filter((item) => item.priority === 'high').length,
    mediumPriorityCount: agriCalculatorUnitTestPlan.filter((item) => item.priority === 'medium').length,
    implementedCount: agriCalculatorUnitTestPlan.filter((item) => item.status === 'implemented').length,
    groups: Array.from(new Set(agriCalculatorUnitTestPlan.map((item) => item.group))),
  };
}
