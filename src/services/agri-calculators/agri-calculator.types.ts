import type { AppRoute } from '@/types/kaset';

export type CalculatorCategory =
  | 'spray_mix'
  | 'fertilizer_mix'
  | 'plant_spacing'
  | 'yield_estimate'
  | 'cost_estimate';

export type ThaiAreaUnit = 'rai' | 'ngan' | 'square_wa' | 'square_meter';

export type MixAmountUnit = 'cc' | 'ml' | 'gram';

export type TankSizeOption = 10 | 15 | 20 | 200 | 'custom';

export type NutrientKey = 'nitrogen' | 'phosphorus' | 'potassium';

export type FertilizerBaseNutrient = NutrientKey | 'auto';

export type CalculatorCardTone = 'green' | 'gold' | 'sky' | 'rose' | 'earth';

export type CalculatorCard = {
  id: CalculatorCategory;
  label: string;
  shortLabel: string;
  description: string;
  route: AppRoute;
  iconKey: 'spray' | 'fertilizer' | 'spacing' | 'yield' | 'cost';
  tone: CalculatorCardTone;
  disclaimer: string;
};

export type AreaLabels = {
  rai: string;
  ngan: string;
  squareWa: string;
  squareMeters: string;
};

export type FertilizerProfile = {
  id: string;
  label: string;
  nPercent: number;
  pPercent: number;
  kPercent: number;
  note: string;
};

export type FertilizerMixInput = {
  areaValue: number;
  areaUnit: ThaiAreaUnit;
  targetNitrogenKgPerRai: number;
  targetPhosphorusKgPerRai: number;
  targetPotassiumKgPerRai: number;
  fertilizerNPercent: number;
  fertilizerPPercent: number;
  fertilizerKPercent: number;
  baseNutrient: FertilizerBaseNutrient;
};

export type FertilizerMixResult = {
  isValid: boolean;
  areaSquareMeters: number;
  areaRai: number;
  areaLabels: AreaLabels;
  estimatedFertilizerKg: number;
  estimatedFertilizerLabel: string;
  estimatedBags50Kg: number;
  estimatedBags50KgLabel: string;
  targetTotalKg: Record<NutrientKey, number>;
  suppliedTotalKg: Record<NutrientKey, number>;
  limitingNutrient: FertilizerBaseNutrient;
  warnings: string[];
  disclaimer: string;
};

export type SprayMixInput = {
  tankLiters: number;
  tankSizeOption: TankSizeOption;
  dosageAmount: number;
  dosageUnit: MixAmountUnit;
  dosageWaterLiters: number;
};

export type SprayMixResult = {
  isValid: boolean;
  tankLiters: number;
  requiredAmount: number;
  requiredAmountLabel: string;
  concentrationPerLiter: number;
  concentrationLabel: string;
  isConcentrationHigh: boolean;
  warnings: string[];
  disclaimer: string;
  safetyNotes: string[];
};

export type PlantSpacingInput = {
  landSizeValue: number;
  landSizeUnit: ThaiAreaUnit;
  rowSpacingCm: number;
  plantSpacingCm: number;
  seedlingBufferPercent: number;
  usableAreaPercent: number;
};

export type PlantSpacingResult = {
  isValid: boolean;
  landAreaSquareMeters: number;
  areaLabels: AreaLabels;
  rowSpacingMeters: number;
  plantSpacingMeters: number;
  estimatedPlantCount: number;
  estimatedSeedlingCount: number;
  plantsPerRai: number;
  warnings: string[];
  disclaimer: string;
};

export type YieldEstimateInput = {
  landSizeValue: number;
  landSizeUnit: ThaiAreaUnit;
  sampleCount: number;
  averageWeightKg: number;
  estimatedTotalUnits: number;
};

export type YieldEstimateResult = {
  isValid: boolean;
  areaRai: number;
  areaLabels: AreaLabels;
  sampleTotalKg: number;
  estimatedTotalKg: number;
  estimatedTotalTon: number;
  yieldPerRaiKg: number;
  yieldPerRaiTon: number;
  warnings: string[];
  disclaimer: string;
};

export type CostEstimateInput = {
  landSizeValue: number;
  landSizeUnit: ThaiAreaUnit;
  fertilizerCost: number;
  laborCost: number;
  waterCost: number;
  machineryCost: number;
  otherCost: number;
  expectedYieldKg?: number;
};

export type CostEstimateResult = {
  isValid: boolean;
  areaRai: number;
  areaLabels: AreaLabels;
  totalCost: number;
  totalCostLabel: string;
  costPerRai: number;
  costPerRaiLabel: string;
  costPerKg?: number;
  costPerKgLabel?: string;
  breakEvenEstimateLabel: string;
  costItems: Array<{
    id: keyof Pick<CostEstimateInput, 'fertilizerCost' | 'laborCost' | 'waterCost' | 'machineryCost' | 'otherCost'>;
    label: string;
    amount: number;
  }>;
  warnings: string[];
  disclaimer: string;
};

export type AgriCalculatorInputByCategory = {
  spray_mix: SprayMixInput;
  fertilizer_mix: FertilizerMixInput;
  plant_spacing: PlantSpacingInput;
  yield_estimate: YieldEstimateInput;
  cost_estimate: CostEstimateInput;
};

export type AgriCalculatorResultByCategory = {
  spray_mix: SprayMixResult;
  fertilizer_mix: FertilizerMixResult;
  plant_spacing: PlantSpacingResult;
  yield_estimate: YieldEstimateResult;
  cost_estimate: CostEstimateResult;
};

export type CalculatorHistoryRecord = {
  id: string;
  category: CalculatorCategory;
  title: string;
  summary: string;
  resultLabel: string;
  createdAt: string;
  createdAtLabel: string;
  input: AgriCalculatorInputByCategory[CalculatorCategory];
  result: AgriCalculatorResultByCategory[CalculatorCategory];
  disclaimer: string;
};

export type AgriCalculatorState = {
  version: 1;
  recentCalculations: CalculatorHistoryRecord[];
  favoriteCalculatorIds: CalculatorCategory[];
  lastInputs: Partial<AgriCalculatorInputByCategory>;
  updatedAt: string;
};
