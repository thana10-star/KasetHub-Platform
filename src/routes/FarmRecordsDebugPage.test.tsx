import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { createDemoFarmRecordsState } from '@/services/farm-records/farm-records-fixtures';
import {
  createEmptyFarmRecordsState,
  createFarmRecordsService,
  createMemoryFarmRecordsStorage,
} from '@/services/farm-records/farm-records-service';
import {
  ActivityForm,
  EmptyState,
  FarmRecordsDebugPage,
  FinanceForm,
  HarvestForm,
  PlotForm,
} from '@/routes/FarmRecordsDebugPage';
import {
  activityFormFromRecord,
  buildFarmRecordsViewModel,
  changeFinanceFormDirection,
  createInitialActivityForm,
  createDefaultFarmRecordsFilters,
  createInitialFinanceForm,
  createInitialFarmPlotForm,
  createInitialHarvestForm,
  farmRecordsDeleteConfirmationMessage,
  farmRecordsFirstUseEmptyStates,
  financeFormFromEntry,
  validateFinanceForm,
  validateHarvestForm,
} from '@/routes/farm-records-page-model';

describe('M90 farm records farmer-facing page', () => {
  test('renders the Farm Records page shell from local demo state', () => {
    const html = renderToString(
      <MemoryRouter>
        <FarmRecordsDebugPage />
      </MemoryRouter>,
    );

    expect(html).toContain('สมุดบันทึกฟาร์ม');
    expect(html).toContain('บันทึกงานในฟาร์ม รายรับรายจ่าย และผลผลิตในเครื่องนี้');
    expect(html).toContain('ข้อมูลในเครื่องนี้');
    expect(html).toContain('รายรับรายจ่าย');
    expect(html).toContain('สรุปต้นทุนและกำไรฟาร์ม');
    expect(html).toContain('Expense by category');
    expect(html).toContain('Income by category');
    expect(html).toContain('Break-even Estimate');
    expect(html).toContain('Break-even price / kg');
    expect(html).toContain('This is not official accounting, tax, loan, or financial advice.');
    expect(html).toContain('Enter expected yield in kg');
    expect(html).toContain('ผลผลิตและการเก็บเกี่ยว');
    expect(html).toContain('ผลผลิตรวม');
    expect(html).toContain('ต้นทุนต่อกก.');
    expect(html).toContain('ผลผลิตต่อไร่');
    expect(html).toContain('กำไรต่อกก.');
    expect(html).toContain('จุดคุ้มทุนจริง/กก.');
    expect(html).toContain('เพิ่มผลผลิต');
    expect(html).not.toContain('Add harvest');
    expect(html).not.toContain('LOCAL HARVEST ESTIMATE ONLY');
    expect(html).not.toContain('Harvest records');
    expect(html).not.toContain('Yield per rai');
    expect(html).not.toContain('Cost per kg');
    expect(html).not.toContain('à¸');
    expect(html).not.toContain('à¹');
    expect(html).not.toContain('Â');
    expect(html).not.toContain('�');
    expect(html).toContain('ไทม์ไลน์ฟาร์มล่าสุด');
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
    expect(viewModel.harvestRecords.length).toBeGreaterThan(0);
    expect(viewModel.counts.harvestRecords).toBe(1);
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
    expect(viewModel.harvestRecords).toEqual([]);
    expect(viewModel.summary.totalIncome).toBe(0);
    expect(viewModel.summary.totalExpense).toBe(0);
  });

  test('renders M96 first-use guide and empty-state copy with the shared empty-state component', () => {
    const pageHtml = renderToString(
      <MemoryRouter>
        <FarmRecordsDebugPage />
      </MemoryRouter>,
    );
    const emptyStateHtml = renderToString(
      <>
        {Object.values(farmRecordsFirstUseEmptyStates).map((copy) => (
          <EmptyState actionLabel={copy.actionLabel} detail={copy.detail} key={copy.title} onAction={() => undefined} title={copy.title} />
        ))}
      </>,
    );

    expect(pageHtml).toContain('เริ่มใช้สมุดฟาร์ม');
    expect(pageHtml).toContain('เริ่มจากเพิ่มแปลง แล้วค่อยบันทึกงาน รายรับรายจ่าย และผลผลิต');
    expect(pageHtml).toContain('ขั้นตอน');
    expect(pageHtml).toContain('เพิ่มแปลง');
    expect(pageHtml).toContain('บันทึกงานในฟาร์ม');
    expect(pageHtml).toContain('บันทึกรายรับรายจ่าย');
    expect(pageHtml).toContain('บันทึกผลผลิต');
    expect(emptyStateHtml).toContain('ยังไม่มีแปลง');
    expect(emptyStateHtml).toContain('เริ่มจากเพิ่มแปลงของคุณก่อน');
    expect(emptyStateHtml).toContain('ยังไม่มีบันทึกงานในฟาร์ม');
    expect(emptyStateHtml).toContain('บันทึกสิ่งที่ทำ เช่น ใส่ปุ๋ย พ่นยา ให้น้ำ หรือเก็บเกี่ยว');
    expect(emptyStateHtml).toContain('ยังไม่มีรายรับรายจ่าย');
    expect(emptyStateHtml).toContain('บันทึกค่าใช้จ่าย เช่น ค่าปุ๋ย ค่ายา ค่าแรง หรือรายได้จากขายผลผลิต');
    expect(emptyStateHtml).toContain('ยังไม่มีข้อมูลผลผลิต');
    expect(emptyStateHtml).toContain('เมื่อเก็บเกี่ยวแล้ว ให้บันทึกน้ำหนักผลผลิตเพื่อดูต้นทุนต่อกก.');
    expect(emptyStateHtml).toContain('เพิ่มเงิน');
    expect(emptyStateHtml).toContain('เพิ่มผลผลิต');
  });

  test('blocks invalid negative harvest quantity before local create', () => {
    const form = createInitialHarvestForm('2026-09-01');
    form.farmPlotId = 'farm-plot-demo-rice-a';
    form.quantity = '-1';

    const validation = validateHarvestForm(form, createDemoFarmRecordsState().farmPlots);

    expect(validation.isValid).toBe(false);
    expect(validation.errors.length).toBeGreaterThan(0);
    expect(validation.errors).toContain('ปริมาณผลผลิตต้องเป็นตัวเลข 0 หรือมากกว่า');
  });

  test('renders the harvest create form with readable Thai labels', () => {
    const state = createDemoFarmRecordsState();
    const html = renderToString(
      <HarvestForm
        cycles={state.cropCycles}
        errors={[]}
        onCancel={() => undefined}
        onChange={() => undefined}
        onSubmit={(event) => event.preventDefault()}
        plots={state.farmPlots}
        values={createInitialHarvestForm('2026-09-01')}
      />,
    );

    expect(html).toContain('เพิ่มผลผลิต');
    expect(html).toContain('บันทึกผลผลิตช่วยคำนวณต้นทุนต่อกก.');
    expect(html).toContain('แปลง (จำเป็น)');
    expect(html).toContain('รอบปลูก (ถ้ามี)');
    expect(html).toContain('วันที่เก็บเกี่ยว');
    expect(html).toContain('ชื่อพืช (ถ้ามี)');
    expect(html).toContain('ปริมาณผลผลิต (จำเป็น)');
    expect(html).toContain('หน่วย');
    expect(html).toContain('เกรด/คุณภาพ (ถ้ามี)');
    expect(html).toContain('ผู้ซื้อ (ถ้ามี)');
    expect(html).toContain('ราคาขายต่อกก. (ถ้ามี)');
    expect(html).toContain('หมายเหตุ');
    expect(html).toContain('ข้าว, มะม่วง, มันสำปะหลัง');
    expect(html).toContain('บันทึก');
    expect(html).not.toContain('Add harvest');
    expect(html).not.toContain('Harvest date');
    expect(html).not.toContain('Crop name');
    expect(html).not.toContain('Quantity');
    expect(html).not.toContain('Unit');
    expect(html).not.toContain('à¸');
    expect(html).not.toContain('à¹');
    expect(html).not.toContain('Â');
    expect(html).not.toContain('�');
  });

  test('renders activity, finance, and plot forms with clearer Thai-first first-use labels', () => {
    const state = createDemoFarmRecordsState();
    const activityHtml = renderToString(
      <ActivityForm
        cycles={state.cropCycles}
        errors={[]}
        onCancel={() => undefined}
        onChange={() => undefined}
        onSubmit={(event) => event.preventDefault()}
        plots={state.farmPlots}
        submitLabel="บันทึก"
        title="เพิ่มกิจกรรม"
        values={createInitialActivityForm('2026-05-25')}
      />,
    );
    const financeHtml = renderToString(
      <FinanceForm
        cycles={state.cropCycles}
        errors={[]}
        onCancel={() => undefined}
        onChange={() => undefined}
        onSubmit={(event) => event.preventDefault()}
        plots={state.farmPlots}
        submitLabel="บันทึก"
        title="เพิ่มเงิน"
        values={createInitialFinanceForm('2026-05-25')}
      />,
    );
    const plotHtml = renderToString(
      <PlotForm
        errors={[]}
        onCancel={() => undefined}
        onChange={() => undefined}
        onSubmit={(event) => event.preventDefault()}
        values={createInitialFarmPlotForm()}
      />,
    );

    expect(activityHtml).toContain('บันทึกงานช่วยให้จำได้ว่าใส่ปุ๋ย พ่นยา หรือเก็บเกี่ยววันไหน');
    expect(activityHtml).toContain('ประเภทงานในฟาร์ม');
    expect(activityHtml).toContain('ชื่องานในฟาร์ม (จำเป็น)');
    expect(activityHtml).toContain('สิ่งที่ใช้ เช่น ปุ๋ย ยา เมล็ดพันธุ์ (ถ้ามี)');
    expect(activityHtml).toContain('ปริมาณที่ใช้ (ถ้ามี)');
    expect(financeHtml).toContain('บันทึกรายรับรายจ่ายช่วยดูต้นทุนและกำไร');
    expect(financeHtml).toContain('รายรับหรือรายจ่าย');
    expect(financeHtml).toContain('จำนวนเงิน (บาท)');
    expect(financeHtml).toContain('ผู้ซื้อ/ร้านค้า (ถ้ามี)');
    expect(plotHtml).toContain('เพิ่มแปลง');
    expect(plotHtml).toContain('ชื่อแปลง (จำเป็น)');
    expect(plotHtml).toContain('พื้นที่ (ไร่) ถ้ามี');
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
