import type {
  CostEstimateInput,
  PlantSpacingInput,
  ThaiAreaUnit,
  YieldEstimateInput,
} from '@/services/agri-calculators/agri-calculator.types';

export type CropCalculatorKey =
  | 'rice'
  | 'cassava'
  | 'sugarcane'
  | 'maize'
  | 'eucalyptus'
  | 'chili'
  | 'oil_palm'
  | 'durian'
  | 'longan'
  | 'rubber'
  | 'vegetable_mixed';

export type CropFertilizerPlanningStatus = 'planning_only';

export type CropSpacingExample = Pick<
  PlantSpacingInput,
  'rowSpacingCm' | 'plantSpacingCm' | 'usableAreaPercent' | 'seedlingBufferPercent'
> & {
  id: string;
  label: string;
  note: string;
};

export type CropAreaUnitExample = {
  id: string;
  label: string;
  areaValue: number;
  areaUnit: ThaiAreaUnit;
  note: string;
};

export type CropYieldInputExample = Pick<
  YieldEstimateInput,
  'landSizeValue' | 'landSizeUnit' | 'sampleCount' | 'averageWeightKg' | 'estimatedTotalUnits'
> & {
  id: string;
  label: string;
  note: string;
};

export type CropCostInputExample = Pick<
  CostEstimateInput,
  'landSizeValue' | 'landSizeUnit' | 'fertilizerCost' | 'laborCost' | 'waterCost' | 'machineryCost' | 'otherCost' | 'expectedYieldKg'
> & {
  id: string;
  label: string;
  note: string;
};

export type CropCalculatorProfile = {
  cropKey: CropCalculatorKey;
  thaiDisplayName: string;
  shortLabel: string;
  commonSpacingExamples: CropSpacingExample[];
  commonUnitExamples: CropAreaUnitExample[];
  yieldEstimateInputExamples: CropYieldInputExample[];
  costInputExample: CropCostInputExample;
  costCategoriesCommonlyUsed: string[];
  fertilizerPlanningStatus: CropFertilizerPlanningStatus;
  fertilizerPlanningNote: string;
  safetyDisclaimerNotes: string[];
};
