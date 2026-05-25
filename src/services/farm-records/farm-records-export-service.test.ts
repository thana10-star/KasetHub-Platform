import { describe, expect, test } from 'vitest';
import { createDemoFarmRecordsState } from '@/services/farm-records/farm-records-fixtures';
import { createFarmRecordsService, createMemoryFarmRecordsStorage } from '@/services/farm-records/farm-records-service';
import {
  buildFarmRecordsJsonBackup,
  buildFinanceLedgerCsv,
  getFarmRecordsExportPreview,
  stringifyFarmRecordsJsonBackup,
} from '@/services/farm-records/farm-records-export-service';

describe('M86 farm records local export helpers', () => {
  test('builds JSON backup with all expected local slices and summary', () => {
    const state = createDemoFarmRecordsState();
    const backup = buildFarmRecordsJsonBackup({ state, exportedAt: '2026-05-25T10:00:00.000+07:00' });

    expect(backup.exportVersion).toBe(1);
    expect(backup.source).toBe('local_device');
    expect(backup.appFeature).toBe('farm_records');
    expect(backup.farmPlots).toHaveLength(2);
    expect(backup.cropCycles).toHaveLength(1);
    expect(backup.farmActivityRecords.length).toBeGreaterThan(0);
    expect(backup.farmFinanceEntries.length).toBeGreaterThan(0);
    expect(backup.farmHarvestRecords.length).toBeGreaterThan(0);
    expect(backup.summary.totalIncome).toBe(35000);
    expect(backup.summary.totalExpense).toBe(12900);
    expect(backup.summary.netProfit).toBe(22100);
    expect(JSON.parse(stringifyFarmRecordsJsonBackup(backup)).source).toBe('local_device');
  });

  test('excludes raw image data and data URI payloads from JSON backup', () => {
    const state = createDemoFarmRecordsState();
    state.farmActivityRecords[0].imageRefs = [
      {
        id: 'raw-image-ref',
        localUri: 'data:image/png;base64,SECRET_IMAGE_BYTES',
        filename: 'raw.png',
        caption: 'raw image should not export',
        createdAt: '2026-05-25T10:00:00.000+07:00',
      },
    ];
    state.farmFinanceEntries[0].receiptImageRefs = [
      {
        id: 'raw-receipt-ref',
        localUri: 'data:image/jpeg;base64,SECRET_RECEIPT_BYTES',
        filename: 'receipt.jpg',
        createdAt: '2026-05-25T10:00:00.000+07:00',
      },
    ];

    const json = stringifyFarmRecordsJsonBackup(buildFarmRecordsJsonBackup(state));

    expect(json).not.toContain('data:image');
    expect(json).not.toContain('SECRET_IMAGE_BYTES');
    expect(json).not.toContain('SECRET_RECEIPT_BYTES');
    expect(json).not.toContain('latitude');
    expect(json).not.toContain('longitude');
  });

  test('builds finance CSV with header and escaped cells', () => {
    const csv = buildFinanceLedgerCsv([
      {
        id: 'finance-csv-test',
        entryDate: '2026-05-25',
        direction: 'income',
        category: 'crop_sale',
        title: 'Sale, "Grade A"',
        amount: 1234,
        currency: 'THB',
        note: 'Line one\nLine two',
        createdAt: '2026-05-25T10:00:00.000+07:00',
        updatedAt: '2026-05-25T10:00:00.000+07:00',
      },
    ]);

    expect(csv.split('\n')[0]).toBe('entryDate,direction,category,title,amount,currency,farmPlotName,cropCycleName,quantity,unit,buyerOrVendor,note');
    expect(csv).toContain('"Sale, ""Grade A"""');
    expect(csv).toContain('"Line one\nLine two"');
  });

  test('empty finance CSV returns only the header row', () => {
    expect(buildFinanceLedgerCsv([])).toBe('entryDate,direction,category,title,amount,currency,farmPlotName,cropCycleName,quantity,unit,buyerOrVendor,note');
  });

  test('export preview counts local records and returns privacy warnings', () => {
    const preview = getFarmRecordsExportPreview(createDemoFarmRecordsState());

    expect(preview.plotCount).toBe(2);
    expect(preview.cropCycleCount).toBe(1);
    expect(preview.activityRecordCount).toBeGreaterThan(0);
    expect(preview.financeEntryCount).toBe(5);
    expect(preview.harvestRecordCount).toBe(1);
    expect(preview.totalIncome).toBe(35000);
    expect(preview.totalExpense).toBe(12900);
    expect(preview.netProfit).toBe(22100);
    expect(preview.jsonEstimatedBytes).toBeGreaterThan(0);
    expect(preview.csvEstimatedBytes).toBeGreaterThan(0);
    expect(preview.warnings.join(' ')).toContain('เครื่องนี้');
    expect(preview.warnings.join(' ')).toContain('คลาวด์');
    expect(preview.warnings.join(' ')).toContain('metadata');
  });

  test('archive plot and close/cancel crop cycle use local service guardrails', () => {
    const state = createDemoFarmRecordsState();
    const service = createFarmRecordsService(createMemoryFarmRecordsStorage(state));

    service.archiveFarmPlot('farm-plot-demo-rice-a');
    expect(service.getFarmPlotById('farm-plot-demo-rice-a')?.isArchived).toBe(true);
    expect(service.listActivityRecords({ farmPlotId: 'farm-plot-demo-rice-a' }).length).toBeGreaterThan(0);

    service.closeCropCycle('crop-cycle-demo-rice-2026-main', 'cancelled');
    expect(service.getCropCycleById('crop-cycle-demo-rice-2026-main')?.status).toBe('cancelled');
    expect(service.listFinanceEntries({ cropCycleId: 'crop-cycle-demo-rice-2026-main' }).length).toBeGreaterThan(0);
  });
});
