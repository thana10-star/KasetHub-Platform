import { farmExpenseCategoryIds, farmIncomeCategoryIds } from '@/services/farm-records/farm-records-config';
import { createFarmRecordsService, createMemoryFarmRecordsStorage } from '@/services/farm-records/farm-records-service';
import type {
  FarmActivityRecord,
  FarmExpenseCategory,
  FarmFinanceEntry,
  FarmIncomeCategory,
  FarmLedgerSummaryFilters,
  FarmPlot,
  FarmRecordsState,
} from '@/services/farm-records/farm-records.types';

export type FarmCostDashboardFilters = Pick<FarmLedgerSummaryFilters, 'farmPlotId' | 'cropCycleId' | 'startDate' | 'endDate'>;

export type FarmCostProfitStatus = 'profit' | 'loss' | 'break_even' | 'no_income' | 'no_expense' | 'no_data';

export type FarmCostCategoryBreakdownItem<Category extends string = string> = {
  category: Category;
  amount: number;
  entryCount: number;
  percentOfTotal: number;
};

export type FarmCostDashboard = {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  profitStatus: FarmCostProfitStatus;
  incomeEntryCount: number;
  expenseEntryCount: number;
  activityRecordCount: number;
  farmPlotCount: number;
  cropCycleCount: number;
  areaRaiTotal?: number;
  costPerRai?: number;
  incomePerRai?: number;
  profitPerRai?: number;
  expenseByCategory: FarmCostCategoryBreakdownItem<FarmExpenseCategory>[];
  incomeByCategory: FarmCostCategoryBreakdownItem<FarmIncomeCategory>[];
  topExpenseCategory?: FarmCostCategoryBreakdownItem<FarmExpenseCategory>;
  topIncomeCategory?: FarmCostCategoryBreakdownItem<FarmIncomeCategory>;
  latestFinanceDate?: string;
  latestActivityDate?: string;
  warnings: string[];
};

export type FarmBreakEvenOptions = {
  filters?: FarmCostDashboardFilters;
  expectedYieldKg?: number;
  expectedSellingPricePerKg?: number;
  areaRai?: number;
};

export type FarmBreakEvenEstimate = {
  totalExpense: number;
  expectedYieldKg?: number;
  expectedSellingPricePerKg?: number;
  areaRai?: number;
  breakEvenPricePerKg?: number;
  expectedRevenue?: number;
  estimatedProfitLoss?: number;
  breakEvenYieldKg?: number;
  warnings: string[];
};

function isWithinDateRange(dateValue: string, filters: FarmCostDashboardFilters = {}) {
  const dateTime = Date.parse(dateValue);
  if (Number.isNaN(dateTime)) return false;
  if (filters.startDate && dateTime < Date.parse(filters.startDate)) return false;
  if (filters.endDate && dateTime > Date.parse(filters.endDate)) return false;
  return true;
}

function matchesFinanceFilters(entry: FarmFinanceEntry, filters: FarmCostDashboardFilters = {}) {
  if (filters.farmPlotId && entry.farmPlotId !== filters.farmPlotId) return false;
  if (filters.cropCycleId && entry.cropCycleId !== filters.cropCycleId) return false;
  return isWithinDateRange(entry.entryDate, filters);
}

function matchesActivityFilters(record: FarmActivityRecord, filters: FarmCostDashboardFilters = {}) {
  if (filters.farmPlotId && record.farmPlotId !== filters.farmPlotId) return false;
  if (filters.cropCycleId && record.cropCycleId !== filters.cropCycleId) return false;
  return isWithinDateRange(record.activityDate, filters);
}

function getPlotAreaRai(plot: FarmPlot | undefined) {
  if (!plot) return 0;
  return (plot.areaRai ?? 0) + (plot.areaNgan ?? 0) / 4 + (plot.areaSquareWah ?? 0) / 400;
}

function resolveAreaRai(state: FarmRecordsState, filters: FarmCostDashboardFilters, entries: FarmFinanceEntry[], activities: FarmActivityRecord[]) {
  if (filters.cropCycleId) {
    const cycle = state.cropCycles.find((item) => item.id === filters.cropCycleId);
    return cycle?.areaRai ?? getPlotAreaRai(state.farmPlots.find((plot) => plot.id === cycle?.farmPlotId));
  }

  if (filters.farmPlotId) {
    return getPlotAreaRai(state.farmPlots.find((plot) => plot.id === filters.farmPlotId));
  }

  const plotIds = new Set<string>();
  entries.forEach((entry) => {
    if (entry.farmPlotId) plotIds.add(entry.farmPlotId);
  });
  activities.forEach((activity) => plotIds.add(activity.farmPlotId));

  return state.farmPlots
    .filter((plot) => !plot.isArchived && (plotIds.size === 0 || plotIds.has(plot.id)))
    .reduce((total, plot) => total + getPlotAreaRai(plot), 0);
}

function latestDate(values: string[]) {
  return values.filter(Boolean).sort((a, b) => Date.parse(b) - Date.parse(a))[0];
}

function buildCategoryBreakdown<Category extends FarmExpenseCategory | FarmIncomeCategory>(
  entries: FarmFinanceEntry[],
  categories: Category[],
  total: number,
) {
  const categorySet = new Set<string>(categories);
  const breakdown = entries.reduce<Record<string, { amount: number; entryCount: number }>>((items, entry) => {
    if (!categorySet.has(entry.category)) return items;

    const current = items[entry.category] ?? { amount: 0, entryCount: 0 };
    items[entry.category] = {
      amount: current.amount + entry.amount,
      entryCount: current.entryCount + 1,
    };
    return items;
  }, {});

  return Object.entries(breakdown)
    .map(([category, item]) => ({
      category: category as Category,
      amount: item.amount,
      entryCount: item.entryCount,
      percentOfTotal: total > 0 ? (item.amount / total) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
}

function resolveProfitStatus(incomeEntryCount: number, expenseEntryCount: number, totalIncome: number, totalExpense: number): FarmCostProfitStatus {
  if (incomeEntryCount === 0 && expenseEntryCount === 0) return 'no_data';
  if (incomeEntryCount === 0) return 'no_income';
  if (expenseEntryCount === 0) return 'no_expense';
  if (totalIncome === totalExpense) return 'break_even';
  return totalIncome > totalExpense ? 'profit' : 'loss';
}

function normalizePositiveNumber(value: number | undefined) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : undefined;
}

export function computeFarmCostDashboard(state: FarmRecordsState, filters: FarmCostDashboardFilters = {}): FarmCostDashboard {
  const financeEntries = state.farmFinanceEntries.filter((entry) => matchesFinanceFilters(entry, filters));
  const activityRecords = state.farmActivityRecords.filter((record) => matchesActivityFilters(record, filters));
  const incomeEntries = financeEntries.filter((entry) => entry.direction === 'income');
  const expenseEntries = financeEntries.filter((entry) => entry.direction === 'expense');
  const totalIncome = incomeEntries.reduce((total, entry) => total + entry.amount, 0);
  const totalExpense = expenseEntries.reduce((total, entry) => total + entry.amount, 0);
  const areaRai = resolveAreaRai(state, filters, financeEntries, activityRecords);
  const areaRaiTotal = areaRai > 0 ? areaRai : undefined;
  const summary = createFarmRecordsService(createMemoryFarmRecordsStorage(state)).computeFarmLedgerSummary(filters);
  const expenseByCategory = buildCategoryBreakdown(expenseEntries, farmExpenseCategoryIds, totalExpense);
  const incomeByCategory = buildCategoryBreakdown(incomeEntries, farmIncomeCategoryIds, totalIncome);
  const warnings: string[] = [
    'Local-only cost summary based only on records stored on this device.',
    'This is not official accounting, tax, loan, or financial advice.',
  ];

  if (!areaRaiTotal) {
    warnings.push('Area is missing or zero, so per-rai values cannot be calculated.');
  }

  if (incomeEntries.length === 0) {
    warnings.push('No income entries are recorded for this view.');
  }

  if (expenseEntries.length === 0) {
    warnings.push('No expense entries are recorded for this view.');
  }

  return {
    totalIncome,
    totalExpense,
    netProfit: totalIncome - totalExpense,
    profitStatus: resolveProfitStatus(incomeEntries.length, expenseEntries.length, totalIncome, totalExpense),
    incomeEntryCount: incomeEntries.length,
    expenseEntryCount: expenseEntries.length,
    activityRecordCount: activityRecords.length,
    farmPlotCount: filters.farmPlotId ? (state.farmPlots.some((plot) => plot.id === filters.farmPlotId) ? 1 : 0) : state.farmPlots.filter((plot) => !plot.isArchived).length,
    cropCycleCount: filters.cropCycleId ? (state.cropCycles.some((cycle) => cycle.id === filters.cropCycleId) ? 1 : 0) : state.cropCycles.length,
    areaRaiTotal,
    costPerRai: summary.costPerRai,
    incomePerRai: areaRaiTotal ? totalIncome / areaRaiTotal : undefined,
    profitPerRai: areaRaiTotal ? (totalIncome - totalExpense) / areaRaiTotal : undefined,
    expenseByCategory,
    incomeByCategory,
    topExpenseCategory: expenseByCategory[0],
    topIncomeCategory: incomeByCategory[0],
    latestFinanceDate: latestDate(financeEntries.map((entry) => entry.entryDate)),
    latestActivityDate: latestDate(activityRecords.map((record) => record.activityDate)),
    warnings,
  };
}

export function computeBreakEvenEstimate(state: FarmRecordsState, options: FarmBreakEvenOptions = {}): FarmBreakEvenEstimate {
  const dashboard = computeFarmCostDashboard(state, options.filters);
  const expectedYieldKg = normalizePositiveNumber(options.expectedYieldKg);
  const expectedSellingPricePerKg = normalizePositiveNumber(options.expectedSellingPricePerKg);
  const areaRai = normalizePositiveNumber(options.areaRai) ?? dashboard.areaRaiTotal;
  const expectedRevenue = expectedYieldKg && expectedSellingPricePerKg ? expectedYieldKg * expectedSellingPricePerKg : undefined;
  const warnings: string[] = [
    'Break-even is an estimate from local Farm Records data only.',
    'This is not official accounting, tax, loan, or financial advice.',
  ];

  if (!expectedYieldKg) {
    warnings.push('Enter expected yield in kg to estimate break-even price per kg.');
  }

  if (!expectedSellingPricePerKg) {
    warnings.push('Enter expected selling price per kg to estimate revenue and break-even yield.');
  }

  if (!areaRai) {
    warnings.push('Area is missing or zero; area-based context cannot be shown.');
  }

  if (dashboard.totalExpense === 0) {
    warnings.push('No expenses are recorded for this view, so break-even is limited.');
  }

  return {
    totalExpense: dashboard.totalExpense,
    expectedYieldKg,
    expectedSellingPricePerKg,
    areaRai,
    breakEvenPricePerKg: expectedYieldKg ? dashboard.totalExpense / expectedYieldKg : undefined,
    expectedRevenue,
    estimatedProfitLoss: expectedRevenue === undefined ? undefined : expectedRevenue - dashboard.totalExpense,
    breakEvenYieldKg: expectedSellingPricePerKg ? dashboard.totalExpense / expectedSellingPricePerKg : undefined,
    warnings,
  };
}

export function getFarmCostInsights(dashboard: FarmCostDashboard) {
  const insights: string[] = [];

  if (dashboard.topExpenseCategory) {
    insights.push(`ค่าใช้จ่ายสูงสุดคือ ${dashboard.topExpenseCategory.category}`);
  }

  if (dashboard.incomeEntryCount === 0) {
    insights.push('รอบนี้ยังไม่มีรายรับ');
  }

  if (dashboard.expenseEntryCount === 0) {
    insights.push('รอบนี้ยังไม่มีรายจ่าย');
  }

  if (dashboard.profitStatus === 'profit') {
    insights.push('กำไรสุทธิเป็นบวกจากข้อมูลที่บันทึก');
  } else if (dashboard.profitStatus === 'loss') {
    insights.push('กำไรสุทธิเป็นลบจากข้อมูลที่บันทึก');
  } else if (dashboard.profitStatus === 'break_even') {
    insights.push('รายรับและรายจ่ายเท่ากันจากข้อมูลที่บันทึก');
  }

  if (dashboard.costPerRai !== undefined) {
    insights.push(`ต้นทุนต่อไร่ประมาณ ${dashboard.costPerRai.toLocaleString('th-TH', { maximumFractionDigits: 0 })} บาท`);
  } else {
    insights.push('ข้อมูลยังไม่พอคำนวณต้นทุนต่อไร่');
  }

  if (dashboard.totalExpense <= 0) {
    insights.push('ข้อมูลยังไม่พอคำนวณจุดคุ้มทุน');
  }

  return insights;
}
