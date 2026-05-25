import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { createDemoFarmRecordsState } from '@/services/farm-records/farm-records-fixtures';
import { createEmptyFarmRecordsState, createFarmRecordsService, createMemoryFarmRecordsStorage } from '@/services/farm-records/farm-records-service';
import { FarmRecordsDebugPage } from '@/routes/FarmRecordsDebugPage';
import {
  activityFormFromRecord,
  buildFarmRecordsViewModel,
  changeFinanceFormDirection,
  createDefaultFarmRecordsFilters,
  createInitialFinanceForm,
  farmRecordsDeleteConfirmationMessage,
  financeFormFromEntry,
  validateFinanceForm,
} from '@/routes/farm-records-page-model';

describe('M90 farm records farmer-facing page', () => {
  test('renders the Farm Records page shell from local demo state', () => {
    const html = renderToString(
      <MemoryRouter>
        <FarmRecordsDebugPage />
      </MemoryRouter>,
    );

    expect(html).toContain('Farm Records /');
    expect(html).toContain('สมุดบันทึกฟาร์ม');
    expect(html).toContain('Local-first');
    expect(html).toContain('บัญชีฟาร์ม');
    expect(html).toContain('Farm Cost Dashboard');
    expect(html).toContain('สรุปต้นทุนและกำไรฟาร์ม');
    expect(html).toContain('Expense by category');
    expect(html).toContain('Income by category');
    expect(html).toContain('Break-even Estimate');
    expect(html).toContain('Break-even price / kg');
    expect(html).toContain('This is not official accounting, tax, loan, or financial advice.');
    expect(html).toContain('Enter expected yield in kg');
    expect(html).toContain('Recent Farm Timeline');
    expect(html).toContain('Export &amp; Data Control');
    expect(html).toContain('Download JSON Backup');
    expect(html).toContain('Download Finance CSV');
    expect(html).toContain('Delete/archive guidance');
    expect(html).toContain('Restore Backup');
    expect(html).toContain('Restore recovery guidance');
    expect(html).toContain('Download current local backup before restore');
    expect(html).toContain('RESTORE FARM RECORDS');
    expect(html).toContain('Cloud Sync Readiness');
    expect(html).toContain('Cloud Sync Consent Prototype');
    expect(html).toContain('Farm plots');
    expect(html).toContain('Raw image files');
    expect(html).toContain('Cloud sync consent');
    expect(html).toContain('AI analysis consent');
    expect(html).toContain('GPS/precise location consent');
    expect(html).toContain('Image/receipt upload consent');
    expect(html).toContain('Enable Cloud Sync');
    expect(html).toContain('Cloud sync is not available yet');
    expect(html).toContain('ownership tests');
    expect(html).toContain('Sync readiness checklist');
    expect(html).toContain('Prototype only');
    expect(html).toContain('Documented only');
    expect(html).toContain('Cloud sync remains disabled');
    expect(html).toContain('Supabase writes');
    expect(html).toContain('disabled=""');
    expect(html).not.toContain('Cloud sync is active');
  });

  test('builds summary cards, activity records, finance entries, and ledger summary from demo state', () => {
    const viewModel = buildFarmRecordsViewModel(createDemoFarmRecordsState(), createDefaultFarmRecordsFilters());

    expect(viewModel.counts.plots).toBe(2);
    expect(viewModel.counts.activeCropCycles).toBe(1);
    expect(viewModel.activityRecords.length).toBeGreaterThan(0);
    expect(viewModel.financeEntries.length).toBeGreaterThan(0);
    expect(viewModel.summary.totalIncome).toBe(35000);
    expect(viewModel.summary.totalExpense).toBe(12900);
    expect(viewModel.summary.netProfit).toBe(22100);
    expect(viewModel.recentTimeline.some((item) => item.kind === 'activity')).toBe(true);
    expect(viewModel.recentTimeline.some((item) => item.kind === 'income' || item.kind === 'expense')).toBe(true);
  });

  test('filters by plot, cycle, date, activity type, direction, and category without crashing', () => {
    const state = createDemoFarmRecordsState();
    const viewModel = buildFarmRecordsViewModel(state, {
      ...createDefaultFarmRecordsFilters(),
      farmPlotId: 'farm-plot-demo-rice-a',
      cropCycleId: 'crop-cycle-demo-rice-2026-main',
      startDate: '2026-05-01',
      endDate: '2026-05-18',
      activityType: 'fertilizing',
      financeDirection: 'expense',
      financeCategory: 'fertilizer',
    });

    expect(viewModel.activityRecords).toHaveLength(1);
    expect(viewModel.financeEntries).toHaveLength(1);
    expect(viewModel.summary.totalIncome).toBe(0);
    expect(viewModel.summary.totalExpense).toBe(5200);
  });

  test('handles empty local data for empty states', () => {
    const viewModel = buildFarmRecordsViewModel(createEmptyFarmRecordsState(), createDefaultFarmRecordsFilters());

    expect(viewModel.plots).toEqual([]);
    expect(viewModel.cropCycles).toEqual([]);
    expect(viewModel.activityRecords).toEqual([]);
    expect(viewModel.financeEntries).toEqual([]);
    expect(viewModel.summary.totalIncome).toBe(0);
    expect(viewModel.summary.totalExpense).toBe(0);
  });

  test('blocks invalid finance amounts before local create', () => {
    const form = createInitialFinanceForm('2026-05-25');
    form.title = 'Bad amount';
    form.amount = '-10';

    const validation = validateFinanceForm(form);

    expect(validation.isValid).toBe(false);
    expect(validation.errors).toContain('จำนวนเงินต้องเป็นตัวเลขไม่ติดลบ');

    form.amount = '';
    expect(validateFinanceForm(form).isValid).toBe(false);
  });

  test('prefills activity edit values and preserves data when edit is cancelled', () => {
    const state = createDemoFarmRecordsState();
    const original = state.farmActivityRecords[0];
    const form = activityFormFromRecord(original);

    expect(form.title).toBe(original.title);
    expect(form.activityDate).toBe(original.activityDate);
    expect(form.farmPlotId).toBe(original.farmPlotId);

    const service = createFarmRecordsService(createMemoryFarmRecordsStorage(state));
    expect(service.getActivityRecordById(original.id)?.title).toBe(original.title);
  });

  test('updates an activity record through the local service path', () => {
    const state = createDemoFarmRecordsState();
    const service = createFarmRecordsService(createMemoryFarmRecordsStorage(state));
    const original = state.farmActivityRecords[0];
    const updated = service.updateActivityRecord(original.id, {
      title: 'Edited farm activity',
      description: 'Updated locally only',
    });

    expect(updated?.title).toBe('Edited farm activity');
    expect(updated?.description).toBe('Updated locally only');
    expect(updated?.createdAt).toBe(original.createdAt);
    expect(updated?.updatedAt).not.toBe(original.updatedAt);
  });

  test('prefills and updates a finance entry while recomputing summary', () => {
    const state = createDemoFarmRecordsState();
    const service = createFarmRecordsService(createMemoryFarmRecordsStorage(state));
    const expense = state.farmFinanceEntries.find((entry) => entry.category === 'fertilizer');

    expect(expense).toBeDefined();
    const form = financeFormFromEntry(expense!);
    expect(form.title).toBe(expense!.title);
    expect(form.amount).toBe(String(expense!.amount));

    service.updateFinanceEntry(expense!.id, {
      title: 'Edited fertilizer cost',
      amount: 1000,
      category: 'seed',
      direction: 'expense',
    });

    const summary = service.computeFarmLedgerSummary();
    expect(service.getFinanceEntryById(expense!.id)?.title).toBe('Edited fertilizer cost');
    expect(summary.totalExpense).toBe(8700);
    expect(summary.netProfit).toBe(26300);
  });

  test('resets category safely when finance direction changes', () => {
    const expenseForm = createInitialFinanceForm('2026-05-25');
    expenseForm.category = 'fertilizer';

    const incomeForm = changeFinanceFormDirection(expenseForm, 'income');
    expect(incomeForm.direction).toBe('income');
    expect(incomeForm.category).toBe('crop_sale');
    expect(validateFinanceForm({ ...incomeForm, title: 'Sale', amount: '1000' }).isValid).toBe(true);
  });

  test('delete confirmation copy is local-only and mentions cloud/backup limits', () => {
    expect(farmRecordsDeleteConfirmationMessage).toContain('เครื่องนี้');
    expect(farmRecordsDeleteConfirmationMessage).toContain('คลาวด์');
    expect(farmRecordsDeleteConfirmationMessage).toContain('export/backup');
  });
});
