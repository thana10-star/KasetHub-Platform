import { describe, expect, test, vi } from 'vitest';
import {
  computeBreakEvenEstimate,
  computeFarmCostDashboard,
  computeHarvestYieldSummary,
  getFarmCostInsights,
} from '@/services/farm-records/farm-cost-analytics-service';
import { createDemoFarmRecordsState } from '@/services/farm-records/farm-records-fixtures';
import { createEmptyFarmRecordsState } from '@/services/farm-records/farm-records-service';
import type { FarmFinanceEntry, FarmRecordsState } from '@/services/farm-records/farm-records.types';

function createEntry(entry: Partial<FarmFinanceEntry> & Pick<FarmFinanceEntry, 'id' | 'direction' | 'category' | 'amount'>): FarmFinanceEntry {
  return {
    entryDate: '2026-05-25',
    title: entry.id,
    currency: 'THB',
    createdAt: '2026-05-25T08:00:00.000+07:00',
    updatedAt: '2026-05-25T08:00:00.000+07:00',
    ...entry,
  };
}

function stateWithFinanceEntries(entries: FarmFinanceEntry[]): FarmRecordsState {
  return {
    ...createEmptyFarmRecordsState(),
    farmFinanceEntries: entries,
  };
}

describe('M90 farm cost analytics service', () => {
  test('computes dashboard totals, net profit, and demo counts', () => {
    const dashboard = computeFarmCostDashboard(createDemoFarmRecordsState());

    expect(dashboard.totalIncome).toBe(35000);
    expect(dashboard.totalExpense).toBe(12900);
    expect(dashboard.netProfit).toBe(22100);
    expect(dashboard.profitStatus).toBe('profit');
    expect(dashboard.incomeEntryCount).toBe(1);
    expect(dashboard.expenseEntryCount).toBe(4);
    expect(dashboard.activityRecordCount).toBe(4);
    expect(dashboard.farmPlotCount).toBe(2);
    expect(dashboard.cropCycleCount).toBe(1);
    expect(dashboard.harvestRecordCount).toBe(1);
    expect(dashboard.harvestKg).toBe(3200);
    expect(dashboard.costPerKg).toBeCloseTo(4.03, 2);
  });

  test('profit status handles no-data, no-income, no-expense, break-even, profit, and loss', () => {
    expect(computeFarmCostDashboard(createEmptyFarmRecordsState()).profitStatus).toBe('no_data');
    expect(computeFarmCostDashboard(createDemoFarmRecordsState(), { cropCycleId: 'crop-cycle-demo-rice-2026-main' }).profitStatus).toBe('no_income');
    expect(computeFarmCostDashboard(createDemoFarmRecordsState(), { farmPlotId: 'farm-plot-demo-mixed-orchard' }).profitStatus).toBe('no_expense');

    const breakEvenState = stateWithFinanceEntries([
      createEntry({ id: 'expense-break-even', direction: 'expense', category: 'seed', amount: 100 }),
      createEntry({ id: 'income-break-even', direction: 'income', category: 'crop_sale', amount: 100 }),
    ]);
    const lossState = stateWithFinanceEntries([
      createEntry({ id: 'expense-loss', direction: 'expense', category: 'seed', amount: 200 }),
      createEntry({ id: 'income-loss', direction: 'income', category: 'crop_sale', amount: 100 }),
    ]);

    expect(computeFarmCostDashboard(breakEvenState).profitStatus).toBe('break_even');
    expect(computeFarmCostDashboard(lossState).profitStatus).toBe('loss');
  });

  test('computes per-rai values when area is available and avoids divide-by-zero', () => {
    const riceDashboard = computeFarmCostDashboard(createDemoFarmRecordsState(), {
      cropCycleId: 'crop-cycle-demo-rice-2026-main',
    });
    const emptyDashboard = computeFarmCostDashboard(createEmptyFarmRecordsState());

    expect(riceDashboard.areaRaiTotal).toBe(8);
    expect(riceDashboard.costPerRai).toBe(1612.5);
    expect(riceDashboard.profitPerRai).toBe(-1612.5);
    expect(emptyDashboard.areaRaiTotal).toBeUndefined();
    expect(emptyDashboard.costPerRai).toBeUndefined();
    expect(emptyDashboard.yieldPerRai).toBeUndefined();
    expect(emptyDashboard.costPerKg).toBeUndefined();
  });

  test('sorts expense categories descending and computes top category', () => {
    const dashboard = computeFarmCostDashboard(createDemoFarmRecordsState());

    expect(dashboard.expenseByCategory.map((item) => item.category)).toEqual(['fertilizer', 'seed', 'labor', 'machinery']);
    expect(dashboard.topExpenseCategory?.category).toBe('fertilizer');
    expect(dashboard.topExpenseCategory?.amount).toBe(5200);
    expect(dashboard.topExpenseCategory?.entryCount).toBe(1);
  });

  test('computes break-even price, revenue, profit/loss, and break-even yield', () => {
    const estimate = computeBreakEvenEstimate(createDemoFarmRecordsState(), {
      filters: { cropCycleId: 'crop-cycle-demo-rice-2026-main' },
      expectedYieldKg: 3000,
      expectedSellingPricePerKg: 8,
    });

    expect(estimate.totalExpense).toBe(12900);
    expect(estimate.breakEvenPricePerKg).toBe(4.3);
    expect(estimate.expectedRevenue).toBe(24000);
    expect(estimate.estimatedProfitLoss).toBe(11100);
    expect(estimate.breakEvenYieldKg).toBe(1612.5);
  });

  test('handles missing yield and price safely', () => {
    const estimate = computeBreakEvenEstimate(createDemoFarmRecordsState());

    expect(estimate.breakEvenPricePerKg).toBeUndefined();
    expect(estimate.expectedRevenue).toBeUndefined();
    expect(estimate.estimatedProfitLoss).toBeUndefined();
    expect(estimate.breakEvenYieldKg).toBeUndefined();
    expect(estimate.warnings.join(' ')).toContain('expected yield');
    expect(estimate.warnings.join(' ')).toContain('expected selling price');
  });

  test('computes harvest yield, cost per kg, and profit per kg safely', () => {
    const summary = computeHarvestYieldSummary(createDemoFarmRecordsState(), {
      cropCycleId: 'crop-cycle-demo-rice-2026-main',
    });

    expect(summary.harvestRecordCount).toBe(1);
    expect(summary.totalHarvestKg).toBe(3200);
    expect(summary.yieldPerRai).toBe(400);
    expect(summary.costPerKg).toBeCloseTo(4.03125, 5);
    expect(summary.incomePerKg).toBe(0);
    expect(summary.profitPerKg).toBeCloseTo(-4.03125, 5);
    expect(summary.breakEvenPricePerKg).toBeCloseTo(4.03125, 5);
    expect(summary.averageSalePricePerKg).toBe(10.9);
    expect(summary.latestHarvestDate).toBe('2026-09-02');
  });

  test('harvest yield summary handles missing harvest data and filters by plot/cycle/date', () => {
    const state = createDemoFarmRecordsState();
    const orchardSummary = computeHarvestYieldSummary(state, { farmPlotId: 'farm-plot-demo-mixed-orchard' });
    const dateFilteredSummary = computeHarvestYieldSummary(state, { startDate: '2026-09-01', endDate: '2026-09-03' });
    const missingDateSummary = computeHarvestYieldSummary(state, { endDate: '2026-08-31' });

    expect(orchardSummary.totalHarvestKg).toBe(0);
    expect(orchardSummary.costPerKg).toBeUndefined();
    expect(orchardSummary.warnings.join(' ')).toContain('ข้อมูลผลผลิต');
    expect(dateFilteredSummary.totalHarvestKg).toBe(3200);
    expect(missingDateSummary.harvestRecordCount).toBe(0);
    expect(missingDateSummary.totalHarvestKg).toBe(0);
  });

  test('returns deterministic local insights without AI', () => {
    const dashboard = computeFarmCostDashboard(createDemoFarmRecordsState(), {
      cropCycleId: 'crop-cycle-demo-rice-2026-main',
    });
    const insights = getFarmCostInsights(dashboard);

    expect(insights.join(' ')).toContain('ค่าใช้จ่ายสูงสุดคือ fertilizer');
    expect(insights.join(' ')).toContain('รอบนี้ยังไม่มีรายรับ');
    expect(insights.join(' ')).toContain('ต้นทุนต่อไร่ประมาณ');
  });

  test('filters by plot, crop cycle, and date affect dashboard totals', () => {
    const byPlot = computeFarmCostDashboard(createDemoFarmRecordsState(), { farmPlotId: 'farm-plot-demo-rice-a' });
    const byDate = computeFarmCostDashboard(createDemoFarmRecordsState(), {
      startDate: '2026-05-18',
      endDate: '2026-05-18',
    });

    expect(byPlot.totalIncome).toBe(0);
    expect(byPlot.totalExpense).toBe(12900);
    expect(byDate.totalExpense).toBe(5200);
    expect(byDate.activityRecordCount).toBe(1);
  });

  test('does not use fetch or backend calls for local analytics', () => {
    const previousFetch = globalThis.fetch;
    const fetchMock = vi.fn();
    Object.defineProperty(globalThis, 'fetch', { configurable: true, value: fetchMock });

    try {
      computeFarmCostDashboard(createDemoFarmRecordsState());
      computeHarvestYieldSummary(createDemoFarmRecordsState());
      computeBreakEvenEstimate(createDemoFarmRecordsState(), { expectedYieldKg: 1000, expectedSellingPricePerKg: 10 });
      expect(fetchMock).not.toHaveBeenCalled();
    } finally {
      Object.defineProperty(globalThis, 'fetch', { configurable: true, value: previousFetch });
    }
  });
});
