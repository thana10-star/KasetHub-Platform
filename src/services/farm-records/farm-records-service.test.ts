import { describe, expect, test } from 'vitest';
import {
  createEmptyFarmRecordsState,
  createFarmRecordsService,
  createMemoryFarmRecordsStorage,
  getFarmRecordsState,
  migrateFarmRecordsState,
} from '@/services/farm-records/farm-records-service';
import { mvpRouteGroups } from '@/services/qa/route-registry';

function createEmptyService() {
  const storage = createMemoryFarmRecordsStorage(createEmptyFarmRecordsState());
  return createFarmRecordsService(storage);
}

describe('M83 farm records local-first service', () => {
  test('default local state contains farm records slices safely', () => {
    const state = getFarmRecordsState(createMemoryFarmRecordsStorage());

    expect(state.version).toBe(1);
    expect(Array.isArray(state.farmPlots)).toBe(true);
    expect(Array.isArray(state.cropCycles)).toBe(true);
    expect(Array.isArray(state.farmActivityRecords)).toBe(true);
    expect(Array.isArray(state.farmFinanceEntries)).toBe(true);
    expect(Array.isArray(state.farmHarvestRecords)).toBe(true);
    expect(state.farmPlots.length).toBeGreaterThanOrEqual(1);
    expect(state.farmFinanceEntries.some((entry) => entry.direction === 'income')).toBe(true);
    expect(state.farmFinanceEntries.some((entry) => entry.direction === 'expense')).toBe(true);
  });

  test('creates plot, crop cycle, activity, income, expense, and computes ledger summary', () => {
    const service = createEmptyService();
    const plot = service.createFarmPlot({
      name: 'Test Rice Plot',
      areaRai: 2,
      province: 'Demo province',
      coarseLocationLabel: 'Demo coarse location',
    });
    const cycle = service.createCropCycle({
      farmPlotId: plot.id,
      cropName: 'Rice',
      startDate: '2026-05-01',
      status: 'active',
      areaRai: 2,
    });
    const activity = service.createActivityRecord({
      farmPlotId: plot.id,
      cropCycleId: cycle.id,
      activityDate: '2026-05-02',
      activityType: 'planting',
      title: 'Planting day',
      inputName: 'Seed',
      inputQuantity: 40,
      inputUnit: 'kg',
    });

    service.createFinanceEntry({
      farmPlotId: plot.id,
      cropCycleId: cycle.id,
      relatedActivityRecordId: activity.id,
      entryDate: '2026-05-02',
      direction: 'expense',
      category: 'seed',
      title: 'Seed cost',
      amount: 3000,
    });
    service.createFinanceEntry({
      farmPlotId: plot.id,
      cropCycleId: cycle.id,
      entryDate: '2026-05-03',
      direction: 'expense',
      category: 'labor',
      title: 'Labor cost',
      amount: 2000,
    });
    service.createFinanceEntry({
      farmPlotId: plot.id,
      cropCycleId: cycle.id,
      entryDate: '2026-05-20',
      direction: 'income',
      category: 'crop_sale',
      title: 'Demo crop sale',
      amount: 10000,
    });

    const summary = service.computeFarmLedgerSummary({ farmPlotId: plot.id, cropCycleId: cycle.id });

    expect(service.listFarmPlots()).toHaveLength(1);
    expect(service.listCropCyclesByPlot(plot.id)).toHaveLength(1);
    expect(service.listActivityRecords({ farmPlotId: plot.id })).toHaveLength(1);
    expect(summary.totalIncome).toBe(10000);
    expect(summary.totalExpense).toBe(5000);
    expect(summary.netProfit).toBe(5000);
    expect(summary.expenseByCategory.seed).toBe(3000);
    expect(summary.expenseByCategory.labor).toBe(2000);
    expect(summary.incomeByCategory.crop_sale).toBe(10000);
    expect(summary.costPerRai).toBe(2500);
    expect(summary.entryCount).toBe(3);
    expect(summary.activityCount).toBe(1);
  });

  test('creates, filters, normalizes, updates, and deletes harvest records locally', () => {
    const service = createEmptyService();
    const plot = service.createFarmPlot({ name: 'Harvest Test Plot', areaRai: 2 });
    const cycle = service.createCropCycle({ farmPlotId: plot.id, cropName: 'Rice', startDate: '2026-05-01', areaRai: 2 });

    const harvest = service.createHarvestRecord({
      farmPlotId: plot.id,
      cropCycleId: cycle.id,
      harvestDate: '2026-09-01',
      cropName: 'Rice',
      quantity: 1.5,
      quantityUnit: 'ton',
      salePricePerKg: 9,
    });

    expect(harvest.normalizedQuantityKg).toBe(1500);
    expect(service.listHarvestRecords({ farmPlotId: plot.id })).toHaveLength(1);
    expect(service.listHarvestRecords({ cropCycleId: cycle.id })).toHaveLength(1);
    expect(service.listHarvestRecords({ startDate: '2026-09-02' })).toEqual([]);
    expect(service.listHarvestRecords({ cropName: 'Rice' })).toHaveLength(1);

    const updated = service.updateHarvestRecord(harvest.id, { quantity: 2, quantityUnit: 'kg' });
    expect(updated?.normalizedQuantityKg).toBe(2);
    expect(service.deleteHarvestRecord(harvest.id)).toBe(true);
    expect(service.listHarvestRecords()).toEqual([]);
  });

  test('blocks invalid harvest quantity and date through service validation', () => {
    const service = createEmptyService();
    const plot = service.createFarmPlot({ name: 'Invalid Harvest Plot' });

    expect(() =>
      service.createHarvestRecord({
        farmPlotId: plot.id,
        harvestDate: 'bad-date',
        quantity: 10,
        quantityUnit: 'kg',
      }),
    ).toThrow('Farm harvest record requires');

    expect(() =>
      service.createHarvestRecord({
        farmPlotId: plot.id,
        harvestDate: '2026-09-01',
        quantity: -1,
        quantityUnit: 'kg',
      }),
    ).toThrow('Farm harvest record requires');
  });

  test('filters by plot, cycle, date, activity type, direction, and category do not crash', () => {
    const service = createEmptyService();
    const plotA = service.createFarmPlot({ name: 'Plot A', areaRai: 1 });
    const plotB = service.createFarmPlot({ name: 'Plot B', areaRai: 1 });
    const cycleA = service.createCropCycle({ farmPlotId: plotA.id, cropName: 'Mango', startDate: '2026-01-01' });

    service.createActivityRecord({
      farmPlotId: plotA.id,
      cropCycleId: cycleA.id,
      activityDate: '2026-01-10',
      activityType: 'watering',
      title: 'Water trees',
    });
    service.createFinanceEntry({
      farmPlotId: plotA.id,
      cropCycleId: cycleA.id,
      entryDate: '2026-01-10',
      direction: 'expense',
      category: 'water',
      title: 'Water cost',
      amount: 500,
    });
    service.createFinanceEntry({
      farmPlotId: plotB.id,
      entryDate: '2026-02-10',
      direction: 'income',
      category: 'service_income',
      title: 'Machine service',
      amount: 1500,
    });

    expect(service.listActivityRecords({ cropCycleId: cycleA.id, activityType: 'watering' })).toHaveLength(1);
    expect(service.listActivityRecords({ startDate: '2026-01-01', endDate: '2026-01-31' })).toHaveLength(1);
    expect(service.listFinanceEntries({ farmPlotId: plotA.id, direction: 'expense', category: 'water' })).toHaveLength(1);
    expect(service.listFinanceEntries({ farmPlotId: plotA.id, startDate: '2026-03-01' })).toEqual([]);
    expect(service.computeFarmLedgerSummary({ category: 'service_income' }).totalIncome).toBe(1500);
  });

  test('malformed and empty data is normalized without crashing or preserving raw images', () => {
    const state = migrateFarmRecordsState({
      version: 1,
      farmPlots: [{ id: 'bad-plot' }, { id: 'ok-plot', name: 'OK Plot', areaRai: 'not-a-number' }],
      cropCycles: [{ id: 'bad-cycle', farmPlotId: 'ok-plot' }],
      farmActivityRecords: [
        { title: 'missing plot' },
        {
          id: 'ok-activity',
          farmPlotId: 'ok-plot',
          title: 'Sanitized activity',
          activityType: 'not-real',
          imageRefs: [{ id: 'raw-image', localUri: 'data:image/png;base64,abc', filename: 'raw.png' }],
        },
      ],
      farmFinanceEntries: [{ id: 'ok-finance', title: 'Bad amount', amount: 'abc', direction: 'income', category: 'fertilizer' }],
      farmHarvestRecords: [
        { id: 'bad-harvest', farmPlotId: 'ok-plot', harvestDate: '2026-09-01', quantity: -1, quantityUnit: 'kg' },
        { id: 'ok-harvest', farmPlotId: 'ok-plot', harvestDate: '2026-09-02', quantity: 2, quantityUnit: 'ton' },
      ],
      migrations: ['keep-this'],
      updatedAt: 'bad-date',
    });
    const service = createFarmRecordsService(createMemoryFarmRecordsStorage(state));

    expect(state.farmPlots).toHaveLength(1);
    expect(state.cropCycles).toEqual([]);
    expect(state.farmActivityRecords[0]?.activityType).toBe('other');
    expect(state.farmActivityRecords[0]?.imageRefs?.[0]?.localUri).toBeUndefined();
    expect(state.farmFinanceEntries[0]?.amount).toBe(0);
    expect(state.farmFinanceEntries[0]?.category).toBe('other_income');
    expect(state.farmHarvestRecords).toHaveLength(1);
    expect(state.farmHarvestRecords[0]?.normalizedQuantityKg).toBe(2000);
    expect(() => service.computeFarmLedgerSummary()).not.toThrow();
  });

  test('deletes activity and finance entries without crashing and updates summary', () => {
    const service = createEmptyService();
    const plot = service.createFarmPlot({ name: 'Delete Test Plot', areaRai: 1 });
    const activity = service.createActivityRecord({
      farmPlotId: plot.id,
      activityDate: '2026-05-10',
      activityType: 'watering',
      title: 'Water crop',
    });
    const expense = service.createFinanceEntry({
      farmPlotId: plot.id,
      relatedActivityRecordId: activity.id,
      entryDate: '2026-05-10',
      direction: 'expense',
      category: 'water',
      title: 'Water cost',
      amount: 500,
    });

    expect(service.computeFarmLedgerSummary().totalExpense).toBe(500);
    expect(service.deleteActivityRecord(activity.id)).toBe(true);
    expect(service.listActivityRecords()).toEqual([]);
    expect(service.getFinanceEntryById(expense.id)?.relatedActivityRecordId).toBeUndefined();
    expect(service.deleteFinanceEntry(expense.id)).toBe(true);
    expect(service.listFinanceEntries()).toEqual([]);
    expect(service.computeFarmLedgerSummary().totalExpense).toBe(0);
  });

  test('farm records route is registered for smoke navigation', () => {
    const routeList = mvpRouteGroups.flatMap((group) => group.routes.map((route) => route.route));

    expect(routeList).toContain('/app/farm-records');
    expect(routeList).toContain('/app');
    expect(routeList).toContain('/app/admin');
  });
});
