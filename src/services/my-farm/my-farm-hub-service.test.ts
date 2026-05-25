import { describe, expect, test } from 'vitest';
import { farmAreaFixturePlots } from '@/services/farm-area/farm-area-fixtures';
import { createDemoFarmRecordsState } from '@/services/farm-records/farm-records-fixtures';
import type { GuestMemoryState } from '@/services/guest-memory/guest-memory.types';
import { buildMyFarmHub } from '@/services/my-farm/my-farm-hub-service';
import { weatherForecasts } from '@/services/weather/weather-fixtures';

function createGuestMemory(): GuestMemoryState {
  return {
    version: 1,
    profile: {
      guestId: 'guest-my-farm-test',
      displayName: 'Demo guest',
      createdAt: '2026-05-01T00:00:00.000+07:00',
      updatedAt: '2026-05-01T00:00:00.000+07:00',
      mode: 'guest',
    },
    savedItems: [],
    likes: [],
    followedTopics: [],
    recentAIQuestions: [],
    farmRecords: [],
    migrations: [],
    updatedAt: '2026-05-01T00:00:00.000+07:00',
  };
}

describe('M90 My Farm farm records integration', () => {
  test('adds Farm Records entry point, status, and timeline items from local farm records', () => {
    const hub = buildMyFarmHub({
      guestMemory: createGuestMemory(),
      farmPlots: farmAreaFixturePlots,
      farmRecords: createDemoFarmRecordsState(),
      cropWatches: [],
      weatherForecast: weatherForecasts[0],
    });

    expect(hub.quickActions.some((action) => action.route === '/app/farm-records')).toBe(true);
    expect(hub.insights.some((insight) => insight.module === 'farm_records' && insight.route === '/app/farm-records')).toBe(true);
    expect(hub.summary.farmActiveCropCycleCount).toBe(1);
    expect(hub.summary.farmActivityRecordCount).toBeGreaterThan(0);
    expect(hub.summary.farmFinanceEntryCount).toBeGreaterThan(0);
    expect(hub.summary.farmLedgerNetProfit).toBe(22100);
    expect(hub.summary.farmCostPerRai).toBeCloseTo(1141.59, 2);
    expect(hub.summary.farmTotalHarvestKg).toBe(3200);
    expect(hub.summary.farmCostPerKg).toBeCloseTo(4.03, 2);
    expect(hub.summary.latestFarmHarvestDate).toBe('2026-09-02');
    expect(hub.summary.farmTopExpenseCategory).toContain('ปุ๋ย');
    expect(hub.summary.farmTopExpenseCategoryAmount).toBe(5200);
    expect(hub.summary.localStorageLabels).toContain('kasethub.farmRecords.v1');
    expect(hub.timeline.some((item) => item.type === 'farm_activity')).toBe(true);
    expect(hub.timeline.some((item) => item.type === 'farm_finance')).toBe(true);
    expect(hub.timeline.some((item) => item.type === 'farm_harvest')).toBe(true);
  });
});
