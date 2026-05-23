export type FarmAreaUnit = 'square_meter' | 'square_wa' | 'ngan' | 'rai' | 'hectare' | 'acre';

export type FarmAreaShape = 'rectangle' | 'square' | 'triangle' | 'custom_polygon_mock';

export type FarmAreaMeasurementMethod =
  | 'manual_tape'
  | 'manual_estimate'
  | 'gps_walk_future'
  | 'map_polygon_future'
  | 'satellite_provider_future';

export type FarmAreaAccuracyLevel =
  | 'rough_estimate'
  | 'field_estimate'
  | 'gps_mock_planned'
  | 'official_survey_required';

export type FarmAreaPlannerStatus =
  | 'local_demo'
  | 'ready_for_manual_estimate'
  | 'future_gps_planned'
  | 'future_map_planned';

export type FarmAreaCalculationInput = {
  shape: FarmAreaShape;
  widthMeters?: number;
  lengthMeters?: number;
  sideMeters?: number;
  baseMeters?: number;
  heightMeters?: number;
  estimatedAreaSquareMeters?: number;
  method: FarmAreaMeasurementMethod;
};

export type FarmAreaCalculationResult = {
  input: FarmAreaCalculationInput;
  isValid: boolean;
  squareMeters: number;
  squareWa: number;
  ngan: number;
  rai: number;
  hectare: number;
  acre: number;
  formulaLabel: string;
  areaLabels: Record<FarmAreaUnit, string>;
  accuracyLevel: FarmAreaAccuracyLevel;
  plannerStatus: FarmAreaPlannerStatus;
  warnings: string[];
  disclaimer: string;
};

export type FarmPlotRecord = {
  id: string;
  name: string;
  shape: FarmAreaShape;
  method: FarmAreaMeasurementMethod;
  accuracyLevel: FarmAreaAccuracyLevel;
  plannerStatus: FarmAreaPlannerStatus;
  areaSquareMeters: number;
  areaLabels: Record<FarmAreaUnit, string>;
  dimensionsLabel: string;
  createdAt: string;
  createdAtLabel: string;
  disclaimer: string;
};

export type FarmAreaState = {
  version: 1;
  plots: FarmPlotRecord[];
};
