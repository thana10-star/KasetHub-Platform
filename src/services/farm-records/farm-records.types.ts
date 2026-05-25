export type FarmImageRef = {
  id: string;
  localUri?: string;
  storagePath?: string;
  filename?: string;
  caption?: string;
  createdAt: string;
};

export type FarmPlot = {
  id: string;
  name: string;
  displayCode?: string;
  areaRai?: number;
  areaNgan?: number;
  areaSquareWah?: number;
  province?: string;
  district?: string;
  subdistrict?: string;
  coarseLocationLabel?: string;
  notes?: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CropCycleStatus = 'planned' | 'active' | 'harvested' | 'cancelled';

export type CropCycle = {
  id: string;
  farmPlotId: string;
  cropName: string;
  variety?: string;
  seasonLabel?: string;
  startDate: string;
  expectedHarvestDate?: string;
  actualHarvestDate?: string;
  status: CropCycleStatus;
  areaRai?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type FarmActivityType =
  | 'planting'
  | 'fertilizing'
  | 'spraying'
  | 'watering'
  | 'harvesting'
  | 'labor'
  | 'machinery'
  | 'pest_disease'
  | 'weather_note'
  | 'soil_care'
  | 'other';

export type FarmActivityRecord = {
  id: string;
  farmPlotId: string;
  cropCycleId?: string;
  activityDate: string;
  activityType: FarmActivityType;
  title: string;
  description?: string;
  inputName?: string;
  inputQuantity?: number;
  inputUnit?: string;
  laborCount?: number;
  laborHours?: number;
  machineName?: string;
  weatherSummary?: string;
  imageRefs?: FarmImageRef[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
};

export type FarmFinanceDirection = 'income' | 'expense';

export type FarmExpenseCategory =
  | 'seed'
  | 'fertilizer'
  | 'pesticide'
  | 'herbicide'
  | 'labor'
  | 'machinery'
  | 'fuel'
  | 'water'
  | 'electricity'
  | 'rent'
  | 'transport'
  | 'packaging'
  | 'maintenance'
  | 'loan_interest'
  | 'other_expense';

export type FarmIncomeCategory =
  | 'crop_sale'
  | 'byproduct_sale'
  | 'subsidy'
  | 'service_income'
  | 'other_income';

export type FarmFinanceCategory = FarmExpenseCategory | FarmIncomeCategory;

export type FarmFinanceEntry = {
  id: string;
  farmPlotId?: string;
  cropCycleId?: string;
  relatedActivityRecordId?: string;
  entryDate: string;
  direction: FarmFinanceDirection;
  category: FarmFinanceCategory;
  title: string;
  amount: number;
  currency: 'THB' | string;
  quantity?: number;
  unit?: string;
  buyerOrVendor?: string;
  paymentMethod?: string;
  note?: string;
  receiptImageRefs?: FarmImageRef[];
  createdAt: string;
  updatedAt: string;
};

export type FarmLedgerSummary = {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  expenseByCategory: Partial<Record<FarmExpenseCategory, number>>;
  incomeByCategory: Partial<Record<FarmIncomeCategory, number>>;
  costPerRai?: number;
  costPerKg?: number;
  entryCount: number;
  activityCount: number;
};

export type FarmRecordsState = {
  version: 1;
  farmPlots: FarmPlot[];
  cropCycles: CropCycle[];
  farmActivityRecords: FarmActivityRecord[];
  farmFinanceEntries: FarmFinanceEntry[];
  migrations: string[];
  updatedAt: string;
};

export type FarmPlotInput = Omit<FarmPlot, 'id' | 'isArchived' | 'createdAt' | 'updatedAt'> &
  Partial<Pick<FarmPlot, 'id' | 'isArchived' | 'createdAt' | 'updatedAt'>>;

export type FarmPlotPatch = Partial<Omit<FarmPlot, 'id' | 'createdAt'>>;

export type CropCycleInput = Omit<CropCycle, 'id' | 'status' | 'createdAt' | 'updatedAt'> &
  Partial<Pick<CropCycle, 'id' | 'status' | 'createdAt' | 'updatedAt'>>;

export type CropCyclePatch = Partial<Omit<CropCycle, 'id' | 'createdAt'>>;

export type FarmActivityRecordInput = Omit<FarmActivityRecord, 'id' | 'createdAt' | 'updatedAt'> &
  Partial<Pick<FarmActivityRecord, 'id' | 'createdAt' | 'updatedAt'>>;

export type FarmActivityRecordPatch = Partial<Omit<FarmActivityRecord, 'id' | 'createdAt'>>;

export type FarmFinanceEntryInput = Omit<FarmFinanceEntry, 'id' | 'currency' | 'createdAt' | 'updatedAt'> &
  Partial<Pick<FarmFinanceEntry, 'id' | 'currency' | 'createdAt' | 'updatedAt'>>;

export type FarmFinanceEntryPatch = Partial<Omit<FarmFinanceEntry, 'id' | 'createdAt'>>;

export type FarmPlotListOptions = {
  includeArchived?: boolean;
};

export type FarmActivityRecordFilters = {
  farmPlotId?: string;
  cropCycleId?: string;
  startDate?: string;
  endDate?: string;
  activityType?: FarmActivityType;
};

export type FarmFinanceEntryFilters = {
  farmPlotId?: string;
  cropCycleId?: string;
  startDate?: string;
  endDate?: string;
  direction?: FarmFinanceDirection;
  category?: FarmFinanceCategory;
};

export type FarmLedgerSummaryFilters = FarmActivityRecordFilters &
  Pick<FarmFinanceEntryFilters, 'direction' | 'category'>;
