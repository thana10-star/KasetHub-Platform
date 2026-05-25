import { useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import {
  Activity,
  Archive,
  Banknote,
  Calculator,
  CheckCircle2,
  ClipboardList,
  CloudOff,
  Coins,
  Download,
  Filter,
  FileJson,
  FileSpreadsheet,
  Leaf,
  ListChecks,
  Pencil,
  Plus,
  ReceiptText,
  RotateCcw,
  ShieldCheck,
  Sprout,
  Trash2,
  Upload,
  WalletCards,
  Wheat,
  X,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { useFarmRecords } from '@/hooks/useFarmRecords';
import {
  allowedFarmRecordUnits,
  cropCycleStatuses,
  farmActivityTypes,
  farmExpenseCategories,
  farmFinanceCategoryLabels,
  farmHarvestQuantityUnits,
  farmIncomeCategories,
} from '@/services/farm-records/farm-records-config';
import {
  computeBreakEvenEstimate,
  computeFarmCostDashboard,
  computeHarvestYieldSummary,
  getFarmCostInsights,
  type FarmBreakEvenEstimate,
  type FarmCostCategoryBreakdownItem,
  type FarmCostProfitStatus,
} from '@/services/farm-records/farm-cost-analytics-service';
import {
  buildFarmRecordsJsonBackup,
  buildFinanceLedgerCsv,
  getFarmRecordsExportPreview,
  stringifyFarmRecordsJsonBackup,
} from '@/services/farm-records/farm-records-export-service';
import {
  applyFarmRecordsRestore,
  farmRecordsRestoreConfirmationPhrase,
  parseFarmRecordsJsonBackup,
  validateFarmRecordsBackup,
} from '@/services/farm-records/farm-records-restore-service';
import {
  buildPreRestoreSnapshot,
  getLastPreRestoreSnapshot,
  getRestoreRiskReview,
  storeLastPreRestoreSnapshot,
  stringifyPreRestoreSnapshot,
} from '@/services/farm-records/farm-records-restore-recovery-service';
import {
  farmRecordsSyncPrototypeConsentCategories,
  farmRecordsSyncPrototypeExcludedData,
  farmRecordsSyncPrototypeIncludedData,
  getSyncConsentPrototypeReadiness,
  getSyncConsentPrototypeWarnings,
  loadSyncConsentPrototypeState,
  saveSyncConsentPrototypeState,
} from '@/services/farm-records/farm-records-sync-consent-prototype';
import type { FarmRecordsSyncConsentPrototypeState } from '@/services/farm-records/farm-records-sync-consent-prototype';
import { getFarmRecordsSyncReadiness } from '@/services/farm-records/farm-records-sync-consent-gate';
import type { FarmRecordsSyncChecklistStatus } from '@/services/farm-records/farm-records-sync-consent-gate';
import type {
  CropCycle,
  CropCycleStatus,
  FarmActivityRecord,
  FarmActivityType,
  FarmFinanceCategory,
  FarmFinanceDirection,
  FarmFinanceEntry,
  FarmLedgerSummary,
  FarmPlot,
} from '@/services/farm-records/farm-records.types';
import { normalizeHarvestQuantityToKg } from '@/services/farm-records/farm-records-service';
import {
  activityFormFromRecord,
  buildFarmRecordsViewModel,
  changeFinanceFormDirection,
  createDefaultFarmRecordsFilters,
  createInitialActivityForm,
  createInitialCropCycleForm,
  createInitialFarmPlotForm,
  createInitialFinanceForm,
  createInitialHarvestForm,
  farmRecordsDeleteConfirmationMessage,
  financeFormFromEntry,
  parseCommaTags,
  parseOptionalNonNegativeNumber,
  validateActivityForm,
  validateCropCycleForm,
  validateFarmPlotForm,
  validateFinanceForm,
  validateHarvestForm,
  type ActivityFormValues,
  type CropCycleFormValues,
  type FarmPlotFormValues,
  type FarmRecordsPageFilters,
  type FinanceFormValues,
  type HarvestFormValues,
} from '@/routes/farm-records-page-model';

type FormMode = 'activity' | 'finance' | 'plot' | 'cycle' | 'harvest' | null;
type ExportPreviewMode = 'json' | 'csv' | null;
type SyncConsentPrototypeToggleKey = Exclude<keyof FarmRecordsSyncConsentPrototypeState, 'updatedAt'>;
type BreakEvenFormValues = {
  expectedYieldKg: string;
  expectedSellingPricePerKg: string;
  areaRaiOverride: string;
};

const activityLabels = farmActivityTypes.reduce(
  (labels, activity) => ({
    ...labels,
    [activity.id]: `${activity.label.th} / ${activity.label.en}`,
  }),
  {} as Record<FarmActivityType, string>,
);

const statusLabels = cropCycleStatuses.reduce(
  (labels, status) => ({
    ...labels,
    [status.id]: `${status.label.th} / ${status.label.en}`,
  }),
  {} as Record<CropCycleStatus, string>,
);

const archivePlotConfirmationMessage =
  'เก็บแปลงนี้เป็น archived หรือไม่? กิจกรรมและรายการเงินที่ผูกกับแปลงนี้จะยังอยู่ในเครื่องนี้ ไม่ได้ลบข้อมูล และยังไม่มีการซิงก์คลาวด์';

const closeCropCycleConfirmationMessage =
  'เปลี่ยนสถานะรอบปลูกนี้หรือไม่? รายการกิจกรรมและบัญชีเดิมจะยังอยู่ในเครื่องนี้ เป็นการเปลี่ยนสถานะเท่านั้น';

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('th-TH', {
    currency: 'THB',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(value);
}

function formatOptionalCurrency(value: number | undefined) {
  return value === undefined ? 'ยังคำนวณไม่ได้' : formatCurrency(value);
}

function formatNumber(value: number, maximumFractionDigits = 2) {
  return value.toLocaleString('th-TH', { maximumFractionDigits });
}

function formatOptionalNumber(value: number | undefined, unit: string, maximumFractionDigits = 2) {
  return value === undefined ? 'ยังคำนวณไม่ได้' : `${formatNumber(value, maximumFractionDigits)} ${unit}`;
}

function formatPercent(value: number) {
  return `${formatNumber(value, 1)}%`;
}

function getProfitStatusCopy(status: FarmCostProfitStatus) {
  if (status === 'profit') return 'รอบนี้มีกำไรจากข้อมูลที่บันทึก';
  if (status === 'loss') return 'รอบนี้ยังขาดทุนจากข้อมูลที่บันทึก';
  if (status === 'break_even') return 'รายรับและรายจ่ายเท่ากันจากข้อมูลที่บันทึก';
  if (status === 'no_income') return 'ยังไม่มีรายการรายรับ';
  if (status === 'no_expense') return 'ยังไม่มีรายการรายจ่าย';
  return 'ยังไม่มีข้อมูลเพียงพอ';
}

function getProfitStatusTone(status: FarmCostProfitStatus): 'green' | 'rose' | 'sky' | 'gold' {
  if (status === 'profit') return 'green';
  if (status === 'loss') return 'rose';
  if (status === 'break_even') return 'sky';
  return 'gold';
}

function createExportDateStamp() {
  return new Date().toISOString().slice(0, 10);
}

function downloadTextFile(filename: string, contents: string, mimeType: string) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;

  const blob = new Blob([contents], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  return true;
}

function truncatePreview(value: string, maxLength = 4000) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength)}\n... preview truncated ...`;
}

function previewCsv(value: string, maxLines = 8) {
  const lines = value.split('\n');
  return lines.length <= maxLines ? value : `${lines.slice(0, maxLines).join('\n')}\n... preview truncated ...`;
}

function formatCountDelta(value: number) {
  if (value > 0) return `+${value.toLocaleString('th-TH')}`;
  return value.toLocaleString('th-TH');
}

function getSyncChecklistTone(status: FarmRecordsSyncChecklistStatus) {
  if (status === 'ready') return 'green';
  if (status === 'prototype_only') return 'sky';
  if (status === 'documented_only') return 'sky';
  if (status === 'separate_future_gate') return 'sky';
  return 'gold';
}

function getSyncChecklistLabel(status: FarmRecordsSyncChecklistStatus) {
  if (status === 'ready') return 'Ready';
  if (status === 'prototype_only') return 'Prototype only';
  if (status === 'documented_only') return 'Documented only';
  if (status === 'separate_future_gate') return 'Separate future gate';
  return 'Not implemented';
}

function formatArea(plot: FarmPlot) {
  const parts = [
    plot.areaRai === undefined ? undefined : `${plot.areaRai.toLocaleString('th-TH')} ไร่`,
    plot.areaNgan === undefined ? undefined : `${plot.areaNgan.toLocaleString('th-TH')} งาน`,
    plot.areaSquareWah === undefined ? undefined : `${plot.areaSquareWah.toLocaleString('th-TH')} ตร.ว.`,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(' ') : 'ยังไม่ระบุพื้นที่';
}

function formatLocation(plot: FarmPlot) {
  return plot.coarseLocationLabel || [plot.subdistrict, plot.district, plot.province].filter(Boolean).join(', ') || 'ไม่ระบุพื้นที่แบบละเอียด';
}

function getPlotName(plots: FarmPlot[], plotId?: string) {
  if (!plotId) return 'ไม่ระบุแปลง';
  return plots.find((plot) => plot.id === plotId)?.name ?? 'ไม่พบแปลง';
}

function getCycleLabel(cycles: CropCycle[], cycleId?: string) {
  if (!cycleId) return undefined;
  const cycle = cycles.find((item) => item.id === cycleId);
  return cycle ? `${cycle.cropName}${cycle.seasonLabel ? ` - ${cycle.seasonLabel}` : ''}` : 'ไม่พบรอบปลูก';
}

function getFinanceCategoryLabel(category: FarmFinanceCategory) {
  const label = farmFinanceCategoryLabels[category];
  return label ? `${label.th} / ${label.en}` : category;
}

function getHarvestUnitLabel(unitId: string) {
  const unit = farmHarvestQuantityUnits.find((item) => item.id === unitId);
  return unit ? `${unit.label.th} / ${unit.label.en}` : unitId;
}

function FormField({
  children,
  hint,
  label,
}: {
  children: ReactNode;
  hint?: string;
  label: string;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-bold text-kaset-ink">
      <span>{label}</span>
      {children}
      {hint ? <span className="text-xs font-semibold leading-5 text-slate-500">{hint}</span> : null}
    </label>
  );
}

function inputClassName() {
  return 'min-h-12 min-w-0 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-kaset-ink outline-none transition placeholder:text-slate-400 focus:border-kaset-leaf focus:ring-2 focus:ring-kaset-leaf/20';
}

function textAreaClassName() {
  return `${inputClassName()} min-h-24 py-3 leading-6`;
}

function FormErrors({ errors }: { errors: string[] }) {
  if (errors.length === 0) return null;

  return (
    <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm font-semibold leading-6 text-rose-800">
      {errors.map((error) => (
        <p key={error}>{error}</p>
      ))}
    </div>
  );
}

function EmptyState({
  actionLabel,
  detail,
  onAction,
  title,
}: {
  actionLabel?: string;
  detail: string;
  onAction?: () => void;
  title: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-kaset-deep/20 bg-white p-4 text-center">
      <p className="font-extrabold leading-6 text-kaset-ink">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
      {actionLabel && onAction ? (
        <button
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-kaset-deep px-4 text-sm font-extrabold text-white"
          onClick={onAction}
          type="button"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Activity;
  label: string;
  value: number | string;
}) {
  return (
    <Card className="p-4">
      <Icon aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
      <p className="mt-3 text-xl font-extrabold leading-7 text-kaset-ink sm:text-2xl">{typeof value === 'number' ? value.toLocaleString('th-TH') : value}</p>
      <p className="mt-1 text-xs font-bold leading-4 text-slate-500">{label}</p>
    </Card>
  );
}

function SectionTitle({
  action,
  badge,
  title,
}: {
  action?: React.ReactNode;
  badge?: string;
  title: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-lg font-extrabold leading-7 text-kaset-ink">{title}</h2>
        {badge ? <p className="mt-1 text-xs font-bold uppercase tracking-wide text-kaset-leaf">{badge}</p> : null}
      </div>
      {action}
    </div>
  );
}

function CategoryBreakdown({
  emptyLabel,
  items,
}: {
  emptyLabel: string;
  items: Array<{ label: string; value: number }>;
}) {
  if (items.length === 0) {
    return <p className="rounded-lg bg-kaset-mist p-3 text-sm font-semibold leading-6 text-slate-600">{emptyLabel}</p>;
  }

  return (
    <div className="grid gap-2">
      {items.map((item) => (
        <div className="flex items-center justify-between gap-3 rounded-lg bg-kaset-mist p-3" key={item.label}>
          <p className="min-w-0 text-sm font-bold leading-5 text-kaset-ink">{item.label}</p>
          <p className="shrink-0 text-sm font-extrabold text-kaset-deep">{formatCurrency(item.value)}</p>
        </div>
      ))}
    </div>
  );
}

function getBreakdownItems(summary: FarmLedgerSummary, direction: FarmFinanceDirection) {
  const source = direction === 'income' ? summary.incomeByCategory : summary.expenseByCategory;

  return Object.entries(source)
    .map(([category, value]) => ({
      label: getFinanceCategoryLabel(category as FarmFinanceCategory),
      value: value ?? 0,
    }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);
}

function CostCategoryBreakdown({
  emptyLabel,
  items,
}: {
  emptyLabel: string;
  items: FarmCostCategoryBreakdownItem[];
}) {
  if (items.length === 0) {
    return <p className="rounded-lg bg-kaset-mist p-3 text-sm font-semibold leading-6 text-slate-600">{emptyLabel}</p>;
  }

  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div className="rounded-lg bg-white p-3 ring-1 ring-slate-100" key={item.category}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="min-w-0 font-extrabold leading-6 text-kaset-ink">{getFinanceCategoryLabel(item.category as FarmFinanceCategory)}</p>
            <p className="text-sm font-extrabold text-kaset-deep">{formatCurrency(item.amount)}</p>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-kaset-mist">
            <div className="h-full rounded-full bg-kaset-leaf" style={{ width: `${Math.min(100, item.percentOfTotal)}%` }} />
          </div>
          <p className="mt-2 text-xs font-bold leading-5 text-slate-500">
            {formatPercent(item.percentOfTotal)} · {item.entryCount.toLocaleString('th-TH')} entries
          </p>
        </div>
      ))}
    </div>
  );
}

function getTimelineKindLabel(kind: 'activity' | 'income' | 'expense') {
  if (kind === 'income') return 'รายรับ / Income';
  if (kind === 'expense') return 'รายจ่าย / Expense';
  return 'กิจกรรม / Activity';
}

function ActivityForm({
  cycles,
  errors,
  onCancel,
  onChange,
  onSubmit,
  plots,
  submitLabel,
  title,
  values,
}: {
  cycles: CropCycle[];
  errors: string[];
  onCancel: () => void;
  onChange: (values: ActivityFormValues) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  plots: FarmPlot[];
  submitLabel: string;
  title: string;
  values: ActivityFormValues;
}) {
  const cycleOptions = cycles.filter((cycle) => !values.farmPlotId || cycle.farmPlotId === values.farmPlotId);

  return (
    <Card className="p-4">
      <form className="grid gap-4" onSubmit={onSubmit}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-extrabold text-kaset-ink">{title}</h2>
          <button aria-label="ปิดฟอร์ม" className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-700" onClick={onCancel} type="button">
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
        <FormErrors errors={errors} />
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label="แปลงปลูก">
            <select
              className={inputClassName()}
              onChange={(event) =>
                onChange({
                  ...values,
                  farmPlotId: event.target.value,
                  cropCycleId: cycleOptions.some((cycle) => cycle.id === values.cropCycleId && cycle.farmPlotId === event.target.value)
                    ? values.cropCycleId
                    : '',
                })
              }
              value={values.farmPlotId}
            >
              <option value="">เลือกแปลง</option>
              {plots.map((plot) => (
                <option key={plot.id} value={plot.id}>
                  {plot.name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="รอบปลูก (ถ้ามี)">
            <select className={inputClassName()} onChange={(event) => onChange({ ...values, cropCycleId: event.target.value })} value={values.cropCycleId}>
              <option value="">ไม่ผูกกับรอบปลูก</option>
              {cycleOptions.map((cycle) => (
                <option key={cycle.id} value={cycle.id}>
                  {cycle.cropName} {cycle.seasonLabel ? `- ${cycle.seasonLabel}` : ''}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="วันที่">
            <input className={inputClassName()} onChange={(event) => onChange({ ...values, activityDate: event.target.value })} type="date" value={values.activityDate} />
          </FormField>
          <FormField label="ประเภทกิจกรรม">
            <select
              className={inputClassName()}
              onChange={(event) => onChange({ ...values, activityType: event.target.value as FarmActivityType })}
              value={values.activityType}
            >
              {farmActivityTypes.map((activity) => (
                <option key={activity.id} value={activity.id}>
                  {activity.label.th} / {activity.label.en}
                </option>
              ))}
            </select>
          </FormField>
        </div>
        <FormField label="ชื่อกิจกรรม">
          <input className={inputClassName()} onChange={(event) => onChange({ ...values, title: event.target.value })} placeholder="เช่น ใส่ปุ๋ยครั้งที่ 1" value={values.title} />
        </FormField>
        <FormField label="รายละเอียด (ถ้ามี)">
          <textarea className={textAreaClassName()} onChange={(event) => onChange({ ...values, description: event.target.value })} value={values.description} />
        </FormField>
        <div className="grid gap-3 sm:grid-cols-3">
          <FormField label="ปัจจัยการผลิต">
            <input className={inputClassName()} onChange={(event) => onChange({ ...values, inputName: event.target.value })} placeholder="ปุ๋ย เมล็ดพันธุ์" value={values.inputName} />
          </FormField>
          <FormField label="ปริมาณ">
            <input className={inputClassName()} inputMode="decimal" onChange={(event) => onChange({ ...values, inputQuantity: event.target.value })} value={values.inputQuantity} />
          </FormField>
          <FormField label="หน่วย">
            <select className={inputClassName()} onChange={(event) => onChange({ ...values, inputUnit: event.target.value })} value={values.inputUnit}>
              <option value="">ไม่ระบุ</option>
              {allowedFarmRecordUnits.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.label.th} / {unit.label.en}
                </option>
              ))}
            </select>
          </FormField>
        </div>
        <FormField hint="คั่นด้วย comma เช่น rice, fertilizer" label="แท็ก (ถ้ามี)">
          <input className={inputClassName()} onChange={(event) => onChange({ ...values, tags: event.target.value })} value={values.tags} />
        </FormField>
        <Button className="w-full" type="submit">
          <Plus aria-hidden="true" className="h-5 w-5" />
          {submitLabel}
        </Button>
      </form>
    </Card>
  );
}

function FinanceForm({
  cycles,
  errors,
  onCancel,
  onChange,
  onSubmit,
  plots,
  submitLabel,
  title,
  values,
}: {
  cycles: CropCycle[];
  errors: string[];
  onCancel: () => void;
  onChange: (values: FinanceFormValues) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  plots: FarmPlot[];
  submitLabel: string;
  title: string;
  values: FinanceFormValues;
}) {
  const categoryOptions = values.direction === 'income' ? farmIncomeCategories : farmExpenseCategories;
  const cycleOptions = cycles.filter((cycle) => !values.farmPlotId || cycle.farmPlotId === values.farmPlotId);

  return (
    <Card className="p-4">
      <form className="grid gap-4" onSubmit={onSubmit}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-extrabold text-kaset-ink">{title}</h2>
          <button aria-label="ปิดฟอร์ม" className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-700" onClick={onCancel} type="button">
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
        <FormErrors errors={errors} />
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label="ประเภทรายการ">
            <select
              className={inputClassName()}
              onChange={(event) => {
                const direction = event.target.value as FarmFinanceDirection;
                onChange(changeFinanceFormDirection(values, direction));
              }}
              value={values.direction}
            >
              <option value="expense">รายจ่าย / Expense</option>
              <option value="income">รายรับ / Income</option>
            </select>
          </FormField>
          <FormField label="หมวดหมู่">
            <select
              className={inputClassName()}
              onChange={(event) => onChange({ ...values, category: event.target.value as FarmFinanceCategory })}
              value={values.category}
            >
              {categoryOptions.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label.th} / {category.label.en}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="วันที่">
            <input className={inputClassName()} onChange={(event) => onChange({ ...values, entryDate: event.target.value })} type="date" value={values.entryDate} />
          </FormField>
          <FormField label="จำนวนเงิน (THB)">
            <input className={inputClassName()} inputMode="decimal" onChange={(event) => onChange({ ...values, amount: event.target.value })} value={values.amount} />
          </FormField>
        </div>
        <FormField label="ชื่อรายการ">
          <input className={inputClassName()} onChange={(event) => onChange({ ...values, title: event.target.value })} placeholder="เช่น ซื้อปุ๋ย หรือ ขายผลผลิต" value={values.title} />
        </FormField>
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label="แปลงปลูก (ถ้ามี)">
            <select
              className={inputClassName()}
              onChange={(event) =>
                onChange({
                  ...values,
                  farmPlotId: event.target.value,
                  cropCycleId: cycleOptions.some((cycle) => cycle.id === values.cropCycleId && cycle.farmPlotId === event.target.value)
                    ? values.cropCycleId
                    : '',
                })
              }
              value={values.farmPlotId}
            >
              <option value="">ไม่ระบุแปลง</option>
              {plots.map((plot) => (
                <option key={plot.id} value={plot.id}>
                  {plot.name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="รอบปลูก (ถ้ามี)">
            <select className={inputClassName()} onChange={(event) => onChange({ ...values, cropCycleId: event.target.value })} value={values.cropCycleId}>
              <option value="">ไม่ผูกกับรอบปลูก</option>
              {cycleOptions.map((cycle) => (
                <option key={cycle.id} value={cycle.id}>
                  {cycle.cropName} {cycle.seasonLabel ? `- ${cycle.seasonLabel}` : ''}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="จำนวน/ปริมาณ">
            <input className={inputClassName()} inputMode="decimal" onChange={(event) => onChange({ ...values, quantity: event.target.value })} value={values.quantity} />
          </FormField>
          <FormField label="หน่วย">
            <select className={inputClassName()} onChange={(event) => onChange({ ...values, unit: event.target.value })} value={values.unit}>
              <option value="">ไม่ระบุ</option>
              {allowedFarmRecordUnits.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.label.th} / {unit.label.en}
                </option>
              ))}
            </select>
          </FormField>
        </div>
        <FormField label="ผู้ซื้อ/ผู้ขาย (ถ้ามี)">
          <input className={inputClassName()} onChange={(event) => onChange({ ...values, buyerOrVendor: event.target.value })} value={values.buyerOrVendor} />
        </FormField>
        <FormField label="หมายเหตุ (ถ้ามี)">
          <textarea className={textAreaClassName()} onChange={(event) => onChange({ ...values, note: event.target.value })} value={values.note} />
        </FormField>
        <Button className="w-full" type="submit">
          <Plus aria-hidden="true" className="h-5 w-5" />
          {submitLabel}
        </Button>
      </form>
    </Card>
  );
}

export function HarvestForm({
  cycles,
  errors,
  onCancel,
  onChange,
  onSubmit,
  plots,
  values,
}: {
  cycles: CropCycle[];
  errors: string[];
  onCancel: () => void;
  onChange: (values: HarvestFormValues) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  plots: FarmPlot[];
  values: HarvestFormValues;
}) {
  const cycleOptions = cycles.filter((cycle) => !values.farmPlotId || cycle.farmPlotId === values.farmPlotId);

  return (
    <Card className="p-4">
      <form className="grid gap-4" onSubmit={onSubmit}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-extrabold leading-7 text-kaset-ink">เพิ่มข้อมูลผลผลิต</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">บันทึกผลผลิตที่เก็บเกี่ยวได้จากแปลงหรือรอบปลูกนี้</p>
          </div>
          <button aria-label="ปิดฟอร์ม" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-700" onClick={onCancel} type="button">
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
        <FormErrors errors={errors} />
        <div className="grid min-w-0 gap-3">
          <FormField label="แปลง">
            <select
              className={inputClassName()}
              onChange={(event) =>
                onChange({
                  ...values,
                  farmPlotId: event.target.value,
                  cropCycleId: cycleOptions.some((cycle) => cycle.id === values.cropCycleId && cycle.farmPlotId === event.target.value)
                    ? values.cropCycleId
                    : '',
                })
              }
              value={values.farmPlotId}
            >
              <option value="">เลือกแปลง</option>
              {plots.map((plot) => (
                <option key={plot.id} value={plot.id}>
                  {plot.name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="รอบปลูก">
            <select className={inputClassName()} onChange={(event) => onChange({ ...values, cropCycleId: event.target.value })} value={values.cropCycleId}>
              <option value="">ไม่ผูกกับรอบปลูก</option>
              {cycleOptions.map((cycle) => (
                <option key={cycle.id} value={cycle.id}>
                  {cycle.cropName} {cycle.seasonLabel ? `- ${cycle.seasonLabel}` : ''}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="วันที่เก็บเกี่ยว">
            <input className={inputClassName()} onChange={(event) => onChange({ ...values, harvestDate: event.target.value })} type="date" value={values.harvestDate} />
          </FormField>
          <FormField label="ชื่อพืช (ถ้ามี)">
            <input className={inputClassName()} onChange={(event) => onChange({ ...values, cropName: event.target.value })} placeholder="ข้าว, มะม่วง, มันสำปะหลัง" value={values.cropName} />
          </FormField>
          <FormField label="ปริมาณผลผลิต">
            <input className={inputClassName()} inputMode="decimal" onChange={(event) => onChange({ ...values, quantity: event.target.value })} value={values.quantity} />
          </FormField>
          <FormField label="หน่วย">
            <select className={inputClassName()} onChange={(event) => onChange({ ...values, quantityUnit: event.target.value as HarvestFormValues['quantityUnit'] })} value={values.quantityUnit}>
              {farmHarvestQuantityUnits.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.label.th} / {unit.label.en}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="เกรด/คุณภาพ (ถ้ามี)">
            <input className={inputClassName()} onChange={(event) => onChange({ ...values, grade: event.target.value })} value={values.grade} />
          </FormField>
          <FormField label="ผู้ซื้อ (ถ้ามี)">
            <input className={inputClassName()} onChange={(event) => onChange({ ...values, buyer: event.target.value })} value={values.buyer} />
          </FormField>
          <FormField label="ราคาขายต่อกก. (ถ้ามี)">
            <input className={inputClassName()} inputMode="decimal" onChange={(event) => onChange({ ...values, salePricePerKg: event.target.value })} value={values.salePricePerKg} />
          </FormField>
        </div>
        <FormField label="หมายเหตุ">
          <textarea
            className={textAreaClassName()}
            onChange={(event) => onChange({ ...values, note: event.target.value })}
            placeholder="บันทึกเพิ่มเติม เช่น คุณภาพผลผลิตหรือสถานที่ขาย"
            value={values.note}
          />
        </FormField>
        <Button className="w-full" type="submit">
          <Plus aria-hidden="true" className="h-5 w-5" />
          บันทึก
        </Button>
      </form>
    </Card>
  );
}

function PlotForm({
  errors,
  onCancel,
  onChange,
  onSubmit,
  values,
}: {
  errors: string[];
  onCancel: () => void;
  onChange: (values: FarmPlotFormValues) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  values: FarmPlotFormValues;
}) {
  return (
    <Card className="p-4">
      <form className="grid gap-4" onSubmit={onSubmit}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-extrabold text-kaset-ink">เพิ่มแปลงปลูก</h2>
          <button aria-label="ปิดฟอร์ม" className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-700" onClick={onCancel} type="button">
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
        <FormErrors errors={errors} />
        <FormField label="ชื่อแปลง">
          <input className={inputClassName()} onChange={(event) => onChange({ ...values, name: event.target.value })} placeholder="เช่น แปลงนาข้าวหลังบ้าน" value={values.name} />
        </FormField>
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label="พื้นที่ (ไร่)">
            <input className={inputClassName()} inputMode="decimal" onChange={(event) => onChange({ ...values, areaRai: event.target.value })} value={values.areaRai} />
          </FormField>
          <FormField label="จังหวัด">
            <input className={inputClassName()} onChange={(event) => onChange({ ...values, province: event.target.value })} value={values.province} />
          </FormField>
          <FormField label="อำเภอ">
            <input className={inputClassName()} onChange={(event) => onChange({ ...values, district: event.target.value })} value={values.district} />
          </FormField>
          <FormField label="ตำบล">
            <input className={inputClassName()} onChange={(event) => onChange({ ...values, subdistrict: event.target.value })} value={values.subdistrict} />
          </FormField>
        </div>
        <FormField label="หมายเหตุ (ถ้ามี)">
          <textarea className={textAreaClassName()} onChange={(event) => onChange({ ...values, notes: event.target.value })} value={values.notes} />
        </FormField>
        <Button className="w-full" type="submit">
          <Plus aria-hidden="true" className="h-5 w-5" />
          บันทึกแปลง
        </Button>
      </form>
    </Card>
  );
}

function CropCycleForm({
  errors,
  onCancel,
  onChange,
  onSubmit,
  plots,
  values,
}: {
  errors: string[];
  onCancel: () => void;
  onChange: (values: CropCycleFormValues) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  plots: FarmPlot[];
  values: CropCycleFormValues;
}) {
  return (
    <Card className="p-4">
      <form className="grid gap-4" onSubmit={onSubmit}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-extrabold text-kaset-ink">เพิ่มรอบปลูก</h2>
          <button aria-label="ปิดฟอร์ม" className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-700" onClick={onCancel} type="button">
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
        <FormErrors errors={errors} />
        <FormField label="แปลงปลูก">
          <select className={inputClassName()} onChange={(event) => onChange({ ...values, farmPlotId: event.target.value })} value={values.farmPlotId}>
            <option value="">เลือกแปลง</option>
            {plots.map((plot) => (
              <option key={plot.id} value={plot.id}>
                {plot.name}
              </option>
            ))}
          </select>
        </FormField>
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label="ชื่อพืช">
            <input className={inputClassName()} onChange={(event) => onChange({ ...values, cropName: event.target.value })} placeholder="เช่น ข้าว มะม่วง มันสำปะหลัง" value={values.cropName} />
          </FormField>
          <FormField label="พันธุ์ (ถ้ามี)">
            <input className={inputClassName()} onChange={(event) => onChange({ ...values, variety: event.target.value })} value={values.variety} />
          </FormField>
          <FormField label="ฤดูกาล/รอบ">
            <input className={inputClassName()} onChange={(event) => onChange({ ...values, seasonLabel: event.target.value })} placeholder="เช่น นาปี 2569" value={values.seasonLabel} />
          </FormField>
          <FormField label="สถานะ">
            <select className={inputClassName()} onChange={(event) => onChange({ ...values, status: event.target.value as CropCycleStatus })} value={values.status}>
              {cropCycleStatuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.label.th} / {status.label.en}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="วันที่เริ่ม">
            <input className={inputClassName()} onChange={(event) => onChange({ ...values, startDate: event.target.value })} type="date" value={values.startDate} />
          </FormField>
          <FormField label="คาดว่าจะเก็บเกี่ยว">
            <input className={inputClassName()} onChange={(event) => onChange({ ...values, expectedHarvestDate: event.target.value })} type="date" value={values.expectedHarvestDate} />
          </FormField>
        </div>
        <Button className="w-full" type="submit">
          <Plus aria-hidden="true" className="h-5 w-5" />
          บันทึกรอบปลูก
        </Button>
      </form>
    </Card>
  );
}

export function FarmRecordsDebugPage() {
  const today = useMemo(() => getTodayDate(), []);
  const farmRecords = useFarmRecords();
  const [filters, setFilters] = useState<FarmRecordsPageFilters>(() => createDefaultFarmRecordsFilters());
  const [activeForm, setActiveForm] = useState<FormMode>(null);
  const [activityForm, setActivityForm] = useState<ActivityFormValues>(() => createInitialActivityForm(today));
  const [financeForm, setFinanceForm] = useState<FinanceFormValues>(() => createInitialFinanceForm(today));
  const [plotForm, setPlotForm] = useState<FarmPlotFormValues>(() => createInitialFarmPlotForm());
  const [cycleForm, setCycleForm] = useState<CropCycleFormValues>(() => createInitialCropCycleForm(today));
  const [harvestForm, setHarvestForm] = useState<HarvestFormValues>(() => createInitialHarvestForm(today));
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [editingFinanceEntryId, setEditingFinanceEntryId] = useState<string | null>(null);
  const [exportPreviewMode, setExportPreviewMode] = useState<ExportPreviewMode>(null);
  const [restoreRawText, setRestoreRawText] = useState('');
  const [restoreConfirmed, setRestoreConfirmed] = useState(false);
  const [restoreConfirmationPhrase, setRestoreConfirmationPhrase] = useState('');
  const [breakEvenForm, setBreakEvenForm] = useState<BreakEvenFormValues>({
    areaRaiOverride: '',
    expectedSellingPricePerKg: '',
    expectedYieldKg: '',
  });
  const [lastPreRestoreSnapshotCreatedAt, setLastPreRestoreSnapshotCreatedAt] = useState(() => getLastPreRestoreSnapshot()?.createdAt ?? '');
  const [syncConsentPrototypeState, setSyncConsentPrototypeState] = useState<FarmRecordsSyncConsentPrototypeState>(() =>
    loadSyncConsentPrototypeState(),
  );

  const activePlots = farmRecords.state.farmPlots.filter((plot) => !plot.isArchived);
  const viewModel = useMemo(() => buildFarmRecordsViewModel(farmRecords.state, filters), [farmRecords.state, filters]);
  const filteredCycleOptions = farmRecords.state.cropCycles.filter((cycle) => !filters.farmPlotId || cycle.farmPlotId === filters.farmPlotId);
  const categoryFilterOptions =
    filters.financeDirection === 'income' ? farmIncomeCategories : filters.financeDirection === 'expense' ? farmExpenseCategories : [...farmExpenseCategories, ...farmIncomeCategories];
  const farmCostFilters = useMemo(
    () => ({
      cropCycleId: filters.cropCycleId || undefined,
      endDate: filters.endDate || undefined,
      farmPlotId: filters.farmPlotId || undefined,
      startDate: filters.startDate || undefined,
    }),
    [filters.cropCycleId, filters.endDate, filters.farmPlotId, filters.startDate],
  );
  const farmCostDashboard = useMemo(() => computeFarmCostDashboard(farmRecords.state, farmCostFilters), [farmRecords.state, farmCostFilters]);
  const harvestYieldSummary = useMemo(() => computeHarvestYieldSummary(farmRecords.state, farmCostFilters), [farmRecords.state, farmCostFilters]);
  const farmCostInsights = useMemo(() => getFarmCostInsights(farmCostDashboard), [farmCostDashboard]);
  const breakEvenEstimate = useMemo<FarmBreakEvenEstimate>(
    () =>
      computeBreakEvenEstimate(farmRecords.state, {
        areaRai: parseOptionalNonNegativeNumber(breakEvenForm.areaRaiOverride),
        expectedSellingPricePerKg: parseOptionalNonNegativeNumber(breakEvenForm.expectedSellingPricePerKg),
        expectedYieldKg: parseOptionalNonNegativeNumber(breakEvenForm.expectedYieldKg),
        filters: farmCostFilters,
      }),
    [breakEvenForm.areaRaiOverride, breakEvenForm.expectedSellingPricePerKg, breakEvenForm.expectedYieldKg, farmCostFilters, farmRecords.state],
  );
  const exportBackup = useMemo(() => buildFarmRecordsJsonBackup(farmRecords.state), [farmRecords.state]);
  const exportPreview = useMemo(() => getFarmRecordsExportPreview(farmRecords.state), [farmRecords.state]);
  const jsonExportText = useMemo(() => stringifyFarmRecordsJsonBackup(exportBackup), [exportBackup]);
  const financeCsvText = useMemo(
    () =>
      buildFinanceLedgerCsv(exportBackup.farmFinanceEntries, {
        cropCycles: exportBackup.cropCycles,
        farmPlots: exportBackup.farmPlots,
      }),
    [exportBackup],
  );
  const restoreParseResult = useMemo(() => (restoreRawText.trim() ? parseFarmRecordsJsonBackup(restoreRawText) : undefined), [restoreRawText]);
  const restoreValidation = useMemo(
    () => (restoreParseResult?.ok ? validateFarmRecordsBackup(restoreParseResult.parsedBackup) : undefined),
    [restoreParseResult],
  );
  const restoreRiskReview = useMemo(
    () =>
      restoreValidation?.normalizedState
        ? getRestoreRiskReview(farmRecords.state, restoreValidation.normalizedState)
        : undefined,
    [farmRecords.state, restoreValidation],
  );
  const preRestoreSnapshot = useMemo(() => buildPreRestoreSnapshot(farmRecords.state), [farmRecords.state]);
  const preRestoreSnapshotText = useMemo(() => stringifyPreRestoreSnapshot(preRestoreSnapshot), [preRestoreSnapshot]);
  const syncReadiness = useMemo(() => getFarmRecordsSyncReadiness(), []);
  const syncConsentPrototypeWarnings = useMemo(() => getSyncConsentPrototypeWarnings(), []);
  const syncConsentPrototypeReadiness = useMemo(() => getSyncConsentPrototypeReadiness(), []);
  const canApplyRestore =
    Boolean(restoreValidation?.isValid && restoreValidation.normalizedState) &&
    Boolean(restoreRiskReview) &&
    restoreConfirmed &&
    restoreConfirmationPhrase === farmRecordsRestoreConfirmationPhrase;

  function openForm(mode: FormMode) {
    setFormErrors([]);
    setSuccessMessage('');
    setEditingActivityId(null);
    setEditingFinanceEntryId(null);

    if (mode === 'activity') {
      setActivityForm(createInitialActivityForm(today));
    }

    if (mode === 'finance') {
      setFinanceForm(createInitialFinanceForm(today));
    }

    if (mode === 'plot') {
      setPlotForm(createInitialFarmPlotForm());
    }

    if (mode === 'cycle') {
      setCycleForm(createInitialCropCycleForm(today));
    }

    if (mode === 'harvest') {
      setHarvestForm(createInitialHarvestForm(today));
    }

    setActiveForm(mode);
  }

  function closeForm() {
    setFormErrors([]);
    setActiveForm(null);
    setEditingActivityId(null);
    setEditingFinanceEntryId(null);
  }

  function startEditActivity(record: FarmActivityRecord) {
    setActivityForm(activityFormFromRecord(record));
    setEditingActivityId(record.id);
    setEditingFinanceEntryId(null);
    setFormErrors([]);
    setSuccessMessage('');
    setActiveForm('activity');
  }

  function startEditFinanceEntry(entry: FarmFinanceEntry) {
    setFinanceForm(financeFormFromEntry(entry));
    setEditingFinanceEntryId(entry.id);
    setEditingActivityId(null);
    setFormErrors([]);
    setSuccessMessage('');
    setActiveForm('finance');
  }

  function updateFilter<Key extends keyof FarmRecordsPageFilters>(key: Key, value: FarmRecordsPageFilters[Key]) {
    setFilters((current) => {
      const next = { ...current, [key]: value };

      if (key === 'farmPlotId') {
        next.cropCycleId = '';
      }

      if (key === 'financeDirection') {
        const direction = value as FarmFinanceDirection | '';
        if (!direction) {
          return next;
        }

        if (next.financeCategory) {
          const options = direction === 'income' ? farmIncomeCategories : farmExpenseCategories;
          next.financeCategory = options.some((category) => category.id === next.financeCategory) ? next.financeCategory : '';
        }
      }

      return next;
    });
  }

  function handleActivitySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateActivityForm(activityForm, activePlots);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    const activityPayload = {
      farmPlotId: activityForm.farmPlotId,
      cropCycleId: activityForm.cropCycleId || undefined,
      activityDate: activityForm.activityDate,
      activityType: activityForm.activityType,
      title: activityForm.title.trim(),
      description: activityForm.description.trim() || undefined,
      inputName: activityForm.inputName.trim() || undefined,
      inputQuantity: parseOptionalNonNegativeNumber(activityForm.inputQuantity),
      inputUnit: activityForm.inputUnit || undefined,
      tags: parseCommaTags(activityForm.tags),
    };

    if (editingActivityId) {
      farmRecords.updateActivityRecord(editingActivityId, activityPayload);
    } else {
      farmRecords.createActivityRecord(activityPayload);
    }

    setActivityForm(createInitialActivityForm(today));
    setFormErrors([]);
    setEditingActivityId(null);
    setSuccessMessage(editingActivityId ? 'บันทึกการแก้ไขกิจกรรมแล้ว ข้อมูลยังอยู่ในเครื่องนี้เท่านั้น' : 'บันทึกกิจกรรมแล้ว ข้อมูลยังอยู่ในเครื่องนี้เท่านั้น');
    setActiveForm(null);
  }

  function handleFinanceSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateFinanceForm(financeForm);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    const financePayload = {
      farmPlotId: financeForm.farmPlotId || undefined,
      cropCycleId: financeForm.cropCycleId || undefined,
      entryDate: financeForm.entryDate,
      direction: financeForm.direction,
      category: financeForm.category,
      title: financeForm.title.trim(),
      amount: Number(financeForm.amount),
      quantity: parseOptionalNonNegativeNumber(financeForm.quantity),
      unit: financeForm.unit || undefined,
      buyerOrVendor: financeForm.buyerOrVendor.trim() || undefined,
      note: financeForm.note.trim() || undefined,
    };

    if (editingFinanceEntryId) {
      farmRecords.updateFinanceEntry(editingFinanceEntryId, financePayload);
    } else {
      farmRecords.createFinanceEntry(financePayload);
    }

    setFinanceForm(createInitialFinanceForm(today));
    setFormErrors([]);
    setEditingFinanceEntryId(null);
    setSuccessMessage(editingFinanceEntryId ? 'บันทึกการแก้ไขรายการเงินแล้ว ข้อมูลยังอยู่ในเครื่องนี้เท่านั้น' : 'บันทึกรายการเงินแล้ว ข้อมูลยังอยู่ในเครื่องนี้เท่านั้น');
    setActiveForm(null);
  }

  function handlePlotSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateFarmPlotForm(plotForm);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    const coarseLocationLabel = [plotForm.subdistrict.trim(), plotForm.district.trim(), plotForm.province.trim()].filter(Boolean).join(', ') || undefined;
    farmRecords.createFarmPlot({
      name: plotForm.name.trim(),
      areaRai: parseOptionalNonNegativeNumber(plotForm.areaRai),
      province: plotForm.province.trim() || undefined,
      district: plotForm.district.trim() || undefined,
      subdistrict: plotForm.subdistrict.trim() || undefined,
      coarseLocationLabel,
      notes: plotForm.notes.trim() || undefined,
    });
    setPlotForm(createInitialFarmPlotForm());
    setFormErrors([]);
    setSuccessMessage('บันทึกแปลงปลูกแล้ว');
    setActiveForm(null);
  }

  function handleCycleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateCropCycleForm(cycleForm, activePlots);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    farmRecords.createCropCycle({
      farmPlotId: cycleForm.farmPlotId,
      cropName: cycleForm.cropName.trim(),
      variety: cycleForm.variety.trim() || undefined,
      seasonLabel: cycleForm.seasonLabel.trim() || undefined,
      startDate: cycleForm.startDate,
      expectedHarvestDate: cycleForm.expectedHarvestDate || undefined,
      status: cycleForm.status,
    });
    setCycleForm(createInitialCropCycleForm(today));
    setFormErrors([]);
    setSuccessMessage('บันทึกรอบปลูกแล้ว');
    setActiveForm(null);
  }

  function handleHarvestSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateHarvestForm(harvestForm, activePlots);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    const quantity = Number(harvestForm.quantity);
    const salePricePerKg = parseOptionalNonNegativeNumber(harvestForm.salePricePerKg);
    const normalizedQuantityKg = normalizeHarvestQuantityToKg(quantity, harvestForm.quantityUnit);

    farmRecords.createHarvestRecord({
      farmPlotId: harvestForm.farmPlotId,
      cropCycleId: harvestForm.cropCycleId || undefined,
      harvestDate: harvestForm.harvestDate,
      cropName: harvestForm.cropName.trim() || undefined,
      quantity,
      quantityUnit: harvestForm.quantityUnit,
      grade: harvestForm.grade.trim() || undefined,
      buyer: harvestForm.buyer.trim() || undefined,
      salePricePerKg,
      grossIncome: salePricePerKg === undefined || normalizedQuantityKg === undefined ? undefined : normalizedQuantityKg * salePricePerKg,
      note: harvestForm.note.trim() || undefined,
    });
    setHarvestForm(createInitialHarvestForm(today));
    setFormErrors([]);
    setSuccessMessage('บันทึกข้อมูลผลผลิตไว้ในเครื่องนี้แล้ว');
    setActiveForm(null);
  }

  function handleDeleteActivity(id: string) {
    if (window.confirm(farmRecordsDeleteConfirmationMessage)) {
      farmRecords.deleteActivityRecord(id);
      if (editingActivityId === id) {
        closeForm();
      }
      setSuccessMessage('ลบกิจกรรมจากเครื่องนี้แล้ว');
    }
  }

  function handleDeleteFinanceEntry(id: string) {
    if (window.confirm(farmRecordsDeleteConfirmationMessage)) {
      farmRecords.deleteFinanceEntry(id);
      if (editingFinanceEntryId === id) {
        closeForm();
      }
      setSuccessMessage('ลบรายการเงินจากเครื่องนี้แล้ว');
    }
  }

  function handleDeleteHarvestRecord(id: string) {
    if (window.confirm(farmRecordsDeleteConfirmationMessage)) {
      farmRecords.deleteHarvestRecord(id);
      setSuccessMessage('ลบรายการผลผลิตจากเครื่องนี้แล้ว');
    }
  }

  function handlePreviewJsonBackup() {
    setExportPreviewMode('json');
    setSuccessMessage('แสดงตัวอย่าง JSON backup จากข้อมูลในเครื่องนี้');
  }

  function handlePreviewFinanceCsv() {
    setExportPreviewMode('csv');
    setSuccessMessage('แสดงตัวอย่าง Finance CSV จากข้อมูลบัญชีในเครื่องนี้');
  }

  function handleDownloadJsonBackup() {
    const downloaded = downloadTextFile(`kasethub-farm-records-backup-${createExportDateStamp()}.json`, jsonExportText, 'application/json');
    setSuccessMessage(downloaded ? 'ดาวน์โหลด JSON backup จากข้อมูลในเครื่องนี้แล้ว' : 'ไม่สามารถดาวน์โหลดในสภาพแวดล้อมนี้ได้ กรุณาใช้ตัวอย่าง JSON แทน');
  }

  function handleDownloadFinanceCsv() {
    const downloaded = downloadTextFile(`kasethub-farm-finance-ledger-${createExportDateStamp()}.csv`, financeCsvText, 'text/csv');
    setSuccessMessage(downloaded ? 'ดาวน์โหลด Finance CSV จากข้อมูลในเครื่องนี้แล้ว' : 'ไม่สามารถดาวน์โหลดในสภาพแวดล้อมนี้ได้ กรุณาใช้ตัวอย่าง CSV แทน');
  }

  function handleDownloadPreRestoreSnapshot() {
    const stored = storeLastPreRestoreSnapshot(preRestoreSnapshot);
    if (stored.ok) {
      setLastPreRestoreSnapshotCreatedAt(stored.snapshot.createdAt);
    }

    const downloaded = downloadTextFile(
      `kasethub-farm-records-pre-restore-${createExportDateStamp()}.json`,
      preRestoreSnapshotText,
      'application/json',
    );

    setSuccessMessage(
      downloaded
        ? 'ดาวน์โหลดข้อมูลปัจจุบันก่อนกู้คืนแล้ว และบันทึก snapshot ล่าสุดไว้ในเครื่องนี้'
        : stored.ok
          ? 'บันทึก snapshot ล่าสุดไว้ในเครื่องนี้แล้ว แต่ไม่สามารถดาวน์โหลดในสภาพแวดล้อมนี้ได้'
          : 'ไม่สามารถดาวน์โหลดหรือบันทึก snapshot ในสภาพแวดล้อมนี้ได้',
    );
  }

  function handleSyncConsentPrototypeChange(key: SyncConsentPrototypeToggleKey, checked: boolean) {
    const nextState = saveSyncConsentPrototypeState({
      ...syncConsentPrototypeState,
      [key]: checked,
    });
    setSyncConsentPrototypeState(nextState);
    setSuccessMessage('Sync consent prototype state was saved on this device only. It is not legal consent and does not enable cloud sync.');
  }

  async function handleRestoreFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setRestoreRawText(text);
    setRestoreConfirmed(false);
    setRestoreConfirmationPhrase('');
    setSuccessMessage('โหลดไฟล์สำรองเพื่อรอตรวจสอบแล้ว ยังไม่ได้กู้คืนข้อมูล');
  }

  function handleRestoreTextChange(value: string) {
    setRestoreRawText(value);
    setRestoreConfirmed(false);
    setRestoreConfirmationPhrase('');
  }

  function handleApplyRestore() {
    if (!restoreValidation?.normalizedState || !restoreRiskReview) return;

    const storedSnapshot = storeLastPreRestoreSnapshot(preRestoreSnapshot);

    const result = applyFarmRecordsRestore(restoreValidation.normalizedState, {
      mode: 'replace_local_farm_records',
      confirmed: restoreConfirmed,
      confirmationPhrase: restoreConfirmationPhrase,
    });

    if (!result.ok) {
      setSuccessMessage(result.errors.join(' '));
      return;
    }

    farmRecords.refresh();
    setRestoreConfirmed(false);
    setRestoreConfirmationPhrase('');
    if (storedSnapshot.ok) {
      setLastPreRestoreSnapshotCreatedAt(storedSnapshot.snapshot.createdAt);
    }
    setSuccessMessage(
      `กู้คืนข้อมูลสมุดฟาร์มในเครื่องนี้แล้ว: ${result.counts.farmPlotCount.toLocaleString('th-TH')} แปลง · ${result.counts.financeEntryCount.toLocaleString('th-TH')} รายการบัญชี การกู้คืนมีผลเฉพาะเครื่องนี้เท่านั้น`,
    );
  }

  function handleArchiveFarmPlot(id: string) {
    if (window.confirm(archivePlotConfirmationMessage)) {
      farmRecords.archiveFarmPlot(id);
      setSuccessMessage('เก็บแปลงเป็น archived แล้ว รายการที่ผูกไว้ยังอยู่ในเครื่องนี้');
    }
  }

  function handleCloseCropCycle(id: string, status: 'harvested' | 'cancelled') {
    if (window.confirm(closeCropCycleConfirmationMessage)) {
      farmRecords.closeCropCycle(id, status);
      setSuccessMessage(status === 'harvested' ? 'ปิดรอบปลูกเป็น harvested แล้ว' : 'เปลี่ยนรอบปลูกเป็น cancelled แล้ว');
    }
  }

  const filterSummary = viewModel.summary;
  const exportPreviewText = exportPreviewMode === 'json' ? truncatePreview(jsonExportText) : exportPreviewMode === 'csv' ? previewCsv(financeCsvText) : '';

  return (
    <div>
      <PageHeader
        title="Farm Records / สมุดบันทึกฟาร์ม"
        subtitle="บันทึกกิจกรรม รายรับ รายจ่าย และรอบปลูกแบบ local-first"
        showBack
      />
      <div className="grid gap-5 px-5 pb-6">
        <Card className="overflow-hidden bg-kaset-deep text-white">
          <div className="relative p-5">
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative flex gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
                <Leaf aria-hidden="true" className="h-7 w-7" />
              </span>
              <div className="min-w-0 flex-1">
                <Badge className="bg-white/15 text-white" tone="green">
                  Local-first
                </Badge>
                <h2 className="mt-3 text-2xl font-extrabold leading-8">สมุดฟาร์มและบัญชีฟาร์มในเครื่องนี้</h2>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  ข้อมูลนี้ถูกเก็บในเครื่องก่อน ยังไม่ซิงก์ขึ้นคลาวด์
                </p>
              </div>
            </div>
          </div>
        </Card>

        <NoticeBox tone="success" icon={ShieldCheck} title="ขอบเขตความเป็นส่วนตัว">
          ตอนนี้ข้อมูลสมุดฟาร์มถูกเก็บในเครื่องนี้ก่อน ยังไม่มีการซิงก์ขึ้นคลาวด์ และยังไม่มีการใช้ GPS แบบละเอียด
        </NoticeBox>

        <section className="grid grid-cols-2 gap-3">
          <SummaryCard icon={Leaf} label="แปลงปลูก" value={viewModel.counts.plots} />
          <SummaryCard icon={Sprout} label="รอบปลูก active" value={viewModel.counts.activeCropCycles} />
          <SummaryCard icon={ClipboardList} label="กิจกรรมฟาร์ม" value={viewModel.counts.activityRecords} />
          <SummaryCard icon={Wheat} label="รายการเก็บเกี่ยว" value={viewModel.counts.harvestRecords} />
          <SummaryCard icon={Banknote} label="รายรับรวม" value={formatCurrency(farmRecords.summary.totalIncome)} />
          <SummaryCard icon={ReceiptText} label="รายจ่ายรวม" value={formatCurrency(farmRecords.summary.totalExpense)} />
          <SummaryCard icon={Coins} label="กำไรสุทธิ" value={formatCurrency(farmRecords.summary.netProfit)} />
        </section>

        <section className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Button className="w-full px-3" onClick={() => openForm('activity')} variant="primary">
              <Plus aria-hidden="true" className="h-5 w-5" />
              เพิ่มกิจกรรม
            </Button>
            <Button className="w-full px-3" onClick={() => openForm('finance')} variant="secondary">
              <Plus aria-hidden="true" className="h-5 w-5" />
              เพิ่มเงิน
            </Button>
            <Button className="w-full px-3" onClick={() => openForm('plot')} variant="soft">
              <Plus aria-hidden="true" className="h-5 w-5" />
              เพิ่มแปลง
            </Button>
            <Button className="w-full px-3" onClick={() => openForm('cycle')} variant="ghost">
              <Plus aria-hidden="true" className="h-5 w-5" />
              เพิ่มรอบปลูก
            </Button>
            <Button className="w-full px-3" onClick={() => openForm('harvest')} variant="soft">
              <Plus aria-hidden="true" className="h-5 w-5" />
              เพิ่มผลผลิต
            </Button>
          </div>

          {successMessage ? <StatusPill tone="success">{successMessage}</StatusPill> : null}

          {activeForm === 'activity' ? (
            <ActivityForm
              cycles={farmRecords.state.cropCycles}
              errors={formErrors}
              onCancel={closeForm}
              onChange={setActivityForm}
              onSubmit={handleActivitySubmit}
              plots={activePlots}
              submitLabel={editingActivityId ? 'บันทึกการแก้ไข' : 'บันทึกกิจกรรม'}
              title={editingActivityId ? 'แก้ไขกิจกรรมฟาร์ม' : 'เพิ่มกิจกรรมฟาร์ม'}
              values={activityForm}
            />
          ) : null}
          {activeForm === 'finance' ? (
            <FinanceForm
              cycles={farmRecords.state.cropCycles}
              errors={formErrors}
              onCancel={closeForm}
              onChange={setFinanceForm}
              onSubmit={handleFinanceSubmit}
              plots={activePlots}
              submitLabel={editingFinanceEntryId ? 'บันทึกการแก้ไข' : 'บันทึกรายการเงิน'}
              title={editingFinanceEntryId ? 'แก้ไขรายรับ/รายจ่าย' : 'เพิ่มรายรับ/รายจ่าย'}
              values={financeForm}
            />
          ) : null}
          {activeForm === 'plot' ? <PlotForm errors={formErrors} onCancel={closeForm} onChange={setPlotForm} onSubmit={handlePlotSubmit} values={plotForm} /> : null}
          {activeForm === 'cycle' ? (
            <CropCycleForm
              errors={formErrors}
              onCancel={closeForm}
              onChange={setCycleForm}
              onSubmit={handleCycleSubmit}
              plots={activePlots}
              values={cycleForm}
            />
          ) : null}
          {activeForm === 'harvest' ? (
            <HarvestForm
              cycles={farmRecords.state.cropCycles}
              errors={formErrors}
              onCancel={closeForm}
              onChange={setHarvestForm}
              onSubmit={handleHarvestSubmit}
              plots={activePlots}
              values={harvestForm}
            />
          ) : null}
        </section>

        <Card className="p-4">
          <div className="mb-4 flex items-center gap-2">
            <Filter aria-hidden="true" className="h-5 w-5 text-kaset-deep" />
            <h2 className="font-extrabold text-kaset-ink">ตัวกรอง</h2>
            {viewModel.hasActiveFilters ? <StatusPill tone="info">กำลังกรอง</StatusPill> : null}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="แปลงปลูก">
              <select className={inputClassName()} onChange={(event) => updateFilter('farmPlotId', event.target.value)} value={filters.farmPlotId}>
                <option value="">ทุกแปลง</option>
                {farmRecords.state.farmPlots.map((plot) => (
                  <option key={plot.id} value={plot.id}>
                    {plot.name}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="รอบปลูก">
              <select className={inputClassName()} onChange={(event) => updateFilter('cropCycleId', event.target.value)} value={filters.cropCycleId}>
                <option value="">ทุกรอบปลูก</option>
                {filteredCycleOptions.map((cycle) => (
                  <option key={cycle.id} value={cycle.id}>
                    {cycle.cropName} {cycle.seasonLabel ? `- ${cycle.seasonLabel}` : ''}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="วันที่เริ่ม">
              <input className={inputClassName()} onChange={(event) => updateFilter('startDate', event.target.value)} type="date" value={filters.startDate} />
            </FormField>
            <FormField label="วันที่สิ้นสุด">
              <input className={inputClassName()} onChange={(event) => updateFilter('endDate', event.target.value)} type="date" value={filters.endDate} />
            </FormField>
            <FormField label="ประเภทกิจกรรม">
              <select
                className={inputClassName()}
                onChange={(event) => updateFilter('activityType', event.target.value as FarmRecordsPageFilters['activityType'])}
                value={filters.activityType}
              >
                <option value="">ทุกกิจกรรม</option>
                {farmActivityTypes.map((activity) => (
                  <option key={activity.id} value={activity.id}>
                    {activity.label.th} / {activity.label.en}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="รายรับ/รายจ่าย">
              <select
                className={inputClassName()}
                onChange={(event) => updateFilter('financeDirection', event.target.value as FarmRecordsPageFilters['financeDirection'])}
                value={filters.financeDirection}
              >
                <option value="">ทั้งหมด</option>
                <option value="income">รายรับ / Income</option>
                <option value="expense">รายจ่าย / Expense</option>
              </select>
            </FormField>
            <FormField label="หมวดบัญชี">
              <select
                className={inputClassName()}
                onChange={(event) => updateFilter('financeCategory', event.target.value as FarmRecordsPageFilters['financeCategory'])}
                value={filters.financeCategory}
              >
                <option value="">ทุกหมวด</option>
                {categoryFilterOptions.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label.th} / {category.label.en}
                  </option>
                ))}
              </select>
            </FormField>
            <div className="flex items-end">
              <Button className="w-full" onClick={() => setFilters(createDefaultFarmRecordsFilters())} variant="secondary">
                ล้างตัวกรอง
              </Button>
            </div>
          </div>
        </Card>

        <section className="grid gap-3" id="farm-harvest-yield">
          <SectionTitle badge="ประเมินผลผลิตในเครื่องนี้เท่านั้น" title="ผลผลิตและการเก็บเกี่ยว" />
          <NoticeBox tone="info" icon={Wheat} title="ข้อมูลผลผลิตอยู่ในเครื่องนี้">
            ผลผลิตและต้นทุนต่อกก. คำนวณจากข้อมูลที่บันทึกในเครื่องนี้เท่านั้น ข้อมูลนี้อาจสะท้อนปริมาณผลิตและผลประกอบการ
            ยังไม่มี cloud sync, GPS, AI analysis หรือรายงานบัญชี/ภาษีอย่างเป็นทางการ
          </NoticeBox>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <SummaryCard icon={Wheat} label="ผลผลิตรวม" value={formatOptionalNumber(harvestYieldSummary.totalHarvestKg > 0 ? harvestYieldSummary.totalHarvestKg : undefined, 'kg')} />
            <SummaryCard icon={ClipboardList} label="รายการเก็บเกี่ยว" value={harvestYieldSummary.harvestRecordCount} />
            <SummaryCard icon={Leaf} label="ผลผลิตต่อไร่" value={formatOptionalNumber(harvestYieldSummary.yieldPerRai, 'kg/rai')} />
            <SummaryCard icon={ReceiptText} label="ต้นทุนต่อกก." value={formatOptionalNumber(harvestYieldSummary.costPerKg, 'THB/kg')} />
            <SummaryCard icon={Banknote} label="รายได้ต่อกก." value={formatOptionalNumber(harvestYieldSummary.incomePerKg, 'THB/kg')} />
            <SummaryCard icon={Coins} label="กำไรต่อกก." value={formatOptionalNumber(harvestYieldSummary.profitPerKg, 'THB/kg')} />
          </div>
          <Card className="p-4">
            <div className="grid min-w-0 gap-4">
              <div className="grid gap-2">
                <h3 className="font-extrabold leading-6 text-kaset-ink">สรุปผลผลิตที่บันทึก</h3>
                <p className="text-sm leading-6 text-slate-600">
                  ต้นทุนต่อกิโลกรัมคำนวณจากรายจ่ายที่บันทึกและผลผลิตที่บันทึกในเครื่องนี้เท่านั้น
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="rounded-lg bg-kaset-mist p-3">
                    <p className="text-xs font-bold text-slate-500">ราคาขายเฉลี่ย/กก.</p>
                    <p className="mt-1 text-sm font-extrabold text-kaset-ink">{formatOptionalNumber(harvestYieldSummary.averageSalePricePerKg, 'THB/kg')}</p>
                  </div>
                  <div className="rounded-lg bg-kaset-mist p-3">
                    <p className="text-xs font-bold text-slate-500">จุดคุ้มทุนจริง/กก.</p>
                    <p className="mt-1 text-sm font-extrabold text-kaset-ink">{formatOptionalNumber(harvestYieldSummary.breakEvenPricePerKg, 'THB/kg')}</p>
                  </div>
                  <div className="rounded-lg bg-kaset-mist p-3">
                    <p className="text-xs font-bold text-slate-500">วันที่เก็บเกี่ยวล่าสุด</p>
                    <p className="mt-1 text-sm font-extrabold text-kaset-ink">{harvestYieldSummary.latestHarvestDate ?? 'ยังไม่มีข้อมูลผลผลิต'}</p>
                  </div>
                  <div className="rounded-lg bg-kaset-mist p-3">
                    <p className="text-xs font-bold text-slate-500">กำไรสุทธิที่ใช้คำนวณ</p>
                    <p className="mt-1 text-sm font-extrabold text-kaset-ink">{formatCurrency(harvestYieldSummary.netProfit)}</p>
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <h3 className="font-extrabold leading-6 text-kaset-ink">ข้อควรทราบ</h3>
                {harvestYieldSummary.warnings.map((warning) => (
                  <p className="rounded-lg bg-amber-50 p-3 text-sm font-semibold leading-6 text-amber-900" key={warning}>
                    {warning}
                  </p>
                ))}
              </div>
            </div>
          </Card>
          <div className="grid gap-3">
            <SectionTitle badge={`${viewModel.harvestRecords.length.toLocaleString('th-TH')} รายการ`} title="รายการเก็บเกี่ยว" />
            {viewModel.harvestRecords.length > 0 ? (
              viewModel.harvestRecords.map((record) => (
                <Card className="p-4" key={record.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap gap-2">
                        <Badge tone="green">{record.harvestDate}</Badge>
                        <Badge tone={record.normalizedQuantityKg === undefined ? 'gold' : 'sky'}>{getHarvestUnitLabel(record.quantityUnit)}</Badge>
                      </div>
                      <h3 className="mt-2 font-extrabold leading-6 text-kaset-ink">{record.cropName || getCycleLabel(farmRecords.state.cropCycles, record.cropCycleId) || 'รายการเก็บเกี่ยว'}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {getPlotName(farmRecords.state.farmPlots, record.farmPlotId)} {record.cropCycleId ? `· ${getCycleLabel(farmRecords.state.cropCycles, record.cropCycleId)}` : ''}
                      </p>
                      <p className="mt-2 text-sm font-bold leading-6 text-kaset-deep">
                        {formatNumber(record.quantity)} {record.quantityUnit} {record.normalizedQuantityKg !== undefined ? `· ${formatNumber(record.normalizedQuantityKg)} kg` : '· ยังแปลงเป็น kg ไม่ได้'}
                      </p>
                      {record.grade || record.buyer || record.salePricePerKg !== undefined ? (
                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          {[record.grade ? `เกรด: ${record.grade}` : undefined, record.buyer ? `ผู้ซื้อ: ${record.buyer}` : undefined, record.salePricePerKg !== undefined ? `ราคาขาย: ${formatOptionalNumber(record.salePricePerKg, 'THB/kg')}` : undefined]
                            .filter(Boolean)
                            .join(' · ')}
                        </p>
                      ) : null}
                      {record.note ? <p className="mt-2 text-sm leading-6 text-slate-600">{record.note}</p> : null}
                    </div>
                    <Button onClick={() => handleDeleteHarvestRecord(record.id)} variant="secondary">
                      <Trash2 aria-hidden="true" className="h-5 w-5" />
                      ลบ
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <EmptyState
                actionLabel="เพิ่มผลผลิต"
                detail="บันทึกผลผลิตที่เก็บเกี่ยว เช่น กิโลกรัม ตัน หรือหน่วยอื่น เพื่อคำนวณต้นทุนต่อกิโลกรัมและผลผลิตต่อไร่"
                onAction={() => openForm('harvest')}
                title="ยังไม่มีข้อมูลผลผลิต"
              />
            )}
          </div>
        </section>

        <section className="grid gap-3" id="farm-cost-dashboard">
          <SectionTitle badge="local cost estimate only" title="Farm Cost Dashboard / สรุปต้นทุนและกำไรฟาร์ม" />
          <NoticeBox tone="info" icon={Calculator} title="คำนวณจากข้อมูลในเครื่องนี้เท่านั้น">
            เป็นการประเมินจากข้อมูลที่บันทึกในเครื่องนี้เท่านั้น ยังไม่มีการซิงก์ขึ้นคลาวด์ ไม่มีการส่งข้อมูลให้ AI
            และไม่ใช่คำแนะนำทางบัญชี ภาษี หรือสินเชื่อ ผลลัพธ์จะดีขึ้นเมื่อบันทึกรายรับรายจ่ายครบมากขึ้น
          </NoticeBox>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
            <SummaryCard icon={Banknote} label="รายรับรวม" value={formatCurrency(farmCostDashboard.totalIncome)} />
            <SummaryCard icon={ReceiptText} label="รายจ่ายรวม" value={formatCurrency(farmCostDashboard.totalExpense)} />
            <SummaryCard icon={Coins} label="กำไร/ขาดทุนสุทธิ" value={formatCurrency(farmCostDashboard.netProfit)} />
            <SummaryCard icon={Leaf} label="ต้นทุนต่อไร่" value={formatOptionalCurrency(farmCostDashboard.costPerRai)} />
            <SummaryCard icon={Sprout} label="กำไรต่อไร่" value={formatOptionalCurrency(farmCostDashboard.profitPerRai)} />
            <SummaryCard icon={Wheat} label="ต้นทุนต่อกก." value={formatOptionalNumber(farmCostDashboard.costPerKg, 'THB/kg')} />
            <SummaryCard icon={Leaf} label="ผลผลิตต่อไร่" value={formatOptionalNumber(farmCostDashboard.yieldPerRai, 'kg/rai')} />
            <SummaryCard icon={Coins} label="กำไรต่อกก." value={formatOptionalNumber(farmCostDashboard.profitPerKg, 'THB/kg')} />
            <SummaryCard icon={Calculator} label="จุดคุ้มทุนจริง/กก." value={formatOptionalNumber(farmCostDashboard.breakEvenPricePerKg, 'THB/kg')} />
            <SummaryCard
              icon={WalletCards}
              label="หมวดรายจ่ายสูงสุด"
              value={farmCostDashboard.topExpenseCategory ? getFinanceCategoryLabel(farmCostDashboard.topExpenseCategory.category) : 'ยังไม่มี'}
            />
          </div>
          <Card className="p-4">
            <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
              <div className="grid gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={getProfitStatusTone(farmCostDashboard.profitStatus)}>{farmCostDashboard.profitStatus}</Badge>
                  <Badge tone="neutral">{farmCostDashboard.incomeEntryCount.toLocaleString('th-TH')} income entries</Badge>
                  <Badge tone="neutral">{farmCostDashboard.expenseEntryCount.toLocaleString('th-TH')} expense entries</Badge>
                </div>
                <h3 className="font-extrabold leading-6 text-kaset-ink">{getProfitStatusCopy(farmCostDashboard.profitStatus)}</h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="rounded-lg bg-kaset-mist p-3">
                    <p className="text-xs font-bold text-slate-500">พื้นที่ที่ใช้คำนวณ</p>
                    <p className="mt-1 text-sm font-extrabold text-kaset-ink">{formatOptionalNumber(farmCostDashboard.areaRaiTotal, 'ไร่')}</p>
                  </div>
                  <div className="rounded-lg bg-kaset-mist p-3">
                    <p className="text-xs font-bold text-slate-500">รายรับต่อไร่</p>
                    <p className="mt-1 text-sm font-extrabold text-kaset-ink">{formatOptionalCurrency(farmCostDashboard.incomePerRai)}</p>
                  </div>
                  <div className="rounded-lg bg-kaset-mist p-3">
                    <p className="text-xs font-bold text-slate-500">วันที่บัญชีล่าสุด</p>
                    <p className="mt-1 text-sm font-extrabold text-kaset-ink">{farmCostDashboard.latestFinanceDate ?? 'ยังไม่มี'}</p>
                  </div>
                  <div className="rounded-lg bg-kaset-mist p-3">
                    <p className="text-xs font-bold text-slate-500">กิจกรรมล่าสุด</p>
                    <p className="mt-1 text-sm font-extrabold text-kaset-ink">{farmCostDashboard.latestActivityDate ?? 'ยังไม่มี'}</p>
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <h3 className="font-extrabold leading-6 text-kaset-ink">Local cost insights</h3>
                {farmCostInsights.map((insight) => (
                  <p className="rounded-lg bg-kaset-mist p-3 text-sm font-semibold leading-6 text-slate-700" key={insight}>
                    {insight}
                  </p>
                ))}
              </div>
            </div>
          </Card>
          <div className="grid gap-3 lg:grid-cols-2">
            <Card className="p-4">
              <h3 className="font-extrabold leading-6 text-kaset-ink">Expense by category / รายจ่ายตามหมวด</h3>
              <div className="mt-3">
                <CostCategoryBreakdown emptyLabel="ยังไม่มีรายการรายจ่ายตามตัวกรองนี้" items={farmCostDashboard.expenseByCategory} />
              </div>
            </Card>
            <Card className="p-4">
              <h3 className="font-extrabold leading-6 text-kaset-ink">Income by category / รายรับตามหมวด</h3>
              <div className="mt-3">
                <CostCategoryBreakdown emptyLabel="ยังไม่มีรายการรายรับตามตัวกรองนี้" items={farmCostDashboard.incomeByCategory} />
              </div>
            </Card>
          </div>
          <Card className="p-4">
            <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="grid gap-3">
                <div>
                  <h3 className="font-extrabold leading-6 text-kaset-ink">Break-even Estimate / ประมาณจุดคุ้มทุน</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    เป็นการประเมินจากข้อมูลที่บันทึกในเครื่องนี้เท่านั้น ไม่ใช่คำแนะนำทางบัญชี ภาษี หรือสินเชื่อ
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <FormField label="Expected yield (kg)">
                    <input
                      className={inputClassName()}
                      inputMode="decimal"
                      onChange={(event) => setBreakEvenForm((current) => ({ ...current, expectedYieldKg: event.target.value }))}
                      placeholder="3000"
                      value={breakEvenForm.expectedYieldKg}
                    />
                  </FormField>
                  <FormField label="Expected price / kg">
                    <input
                      className={inputClassName()}
                      inputMode="decimal"
                      onChange={(event) => setBreakEvenForm((current) => ({ ...current, expectedSellingPricePerKg: event.target.value }))}
                      placeholder="8"
                      value={breakEvenForm.expectedSellingPricePerKg}
                    />
                  </FormField>
                  <FormField label="Area override (rai)">
                    <input
                      className={inputClassName()}
                      inputMode="decimal"
                      onChange={(event) => setBreakEvenForm((current) => ({ ...current, areaRaiOverride: event.target.value }))}
                      placeholder={farmCostDashboard.areaRaiTotal ? formatNumber(farmCostDashboard.areaRaiTotal) : 'optional'}
                      value={breakEvenForm.areaRaiOverride}
                    />
                  </FormField>
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-xs font-bold text-slate-500">Break-even price / kg</p>
                  <p className="mt-1 text-sm font-extrabold text-kaset-ink">{formatOptionalNumber(breakEvenEstimate.breakEvenPricePerKg, 'THB/kg')}</p>
                </div>
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-xs font-bold text-slate-500">Estimated revenue</p>
                  <p className="mt-1 text-sm font-extrabold text-kaset-ink">{formatOptionalCurrency(breakEvenEstimate.expectedRevenue)}</p>
                </div>
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-xs font-bold text-slate-500">Estimated profit/loss</p>
                  <p className="mt-1 text-sm font-extrabold text-kaset-ink">{formatOptionalCurrency(breakEvenEstimate.estimatedProfitLoss)}</p>
                </div>
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-xs font-bold text-slate-500">Break-even yield</p>
                  <p className="mt-1 text-sm font-extrabold text-kaset-ink">{formatOptionalNumber(breakEvenEstimate.breakEvenYieldKg, 'kg')}</p>
                </div>
                <div className="rounded-lg bg-kaset-mist p-3 sm:col-span-2">
                  <p className="text-xs font-bold text-slate-500">Total expense used</p>
                  <p className="mt-1 text-sm font-extrabold text-kaset-ink">{formatCurrency(breakEvenEstimate.totalExpense)}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 grid gap-2">
              {breakEvenEstimate.warnings.map((warning) => (
                <p className="rounded-lg bg-amber-50 p-3 text-sm font-semibold leading-6 text-amber-900" key={warning}>
                  {warning}
                </p>
              ))}
            </div>
          </Card>
        </section>

        <section className="grid gap-3" id="farm-records-export">
          <SectionTitle badge="local device export only" title="Export & Data Control / ส่งออกและจัดการข้อมูล" />
          <NoticeBox tone="warning" icon={ShieldCheck} title="ส่งออกจากเครื่องนี้เท่านั้น">
            ข้อมูลส่งออกมาจากเครื่องนี้เท่านั้น ยังไม่มีการซิงก์ขึ้นคลาวด์ ไฟล์ที่ดาวน์โหลดควรเก็บอย่างปลอดภัย เพราะอาจมีข้อมูลต้นทุน รายรับ รายจ่าย และรายละเอียดฟาร์ม รูปภาพจริงยังไม่ถูกรวมในไฟล์ ส่งออกเฉพาะ metadata เท่านั้น
          </NoticeBox>
          <Card className="p-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-xs font-bold text-slate-500">แปลง</p>
                  <p className="mt-1 text-lg font-extrabold text-kaset-ink">{exportPreview.plotCount.toLocaleString('th-TH')}</p>
                </div>
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-xs font-bold text-slate-500">รอบปลูก</p>
                  <p className="mt-1 text-lg font-extrabold text-kaset-ink">{exportPreview.cropCycleCount.toLocaleString('th-TH')}</p>
                </div>
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-xs font-bold text-slate-500">กิจกรรม</p>
                  <p className="mt-1 text-lg font-extrabold text-kaset-ink">{exportPreview.activityRecordCount.toLocaleString('th-TH')}</p>
                </div>
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-xs font-bold text-slate-500">บัญชี</p>
                  <p className="mt-1 text-lg font-extrabold text-kaset-ink">{exportPreview.financeEntryCount.toLocaleString('th-TH')}</p>
                </div>
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-xs font-bold text-slate-500">Harvest</p>
                  <p className="mt-1 text-lg font-extrabold text-kaset-ink">{exportPreview.harvestRecordCount.toLocaleString('th-TH')}</p>
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                <div className="rounded-lg bg-white p-3 ring-1 ring-slate-100">
                  <p className="text-xs font-bold text-slate-500">รายรับรวม</p>
                  <p className="mt-1 break-words text-sm font-extrabold text-kaset-deep">{formatCurrency(exportPreview.totalIncome)}</p>
                </div>
                <div className="rounded-lg bg-white p-3 ring-1 ring-slate-100">
                  <p className="text-xs font-bold text-slate-500">รายจ่ายรวม</p>
                  <p className="mt-1 break-words text-sm font-extrabold text-amber-900">{formatCurrency(exportPreview.totalExpense)}</p>
                </div>
                <div className="rounded-lg bg-white p-3 ring-1 ring-slate-100">
                  <p className="text-xs font-bold text-slate-500">กำไรสุทธิ</p>
                  <p className="mt-1 break-words text-sm font-extrabold text-kaset-deep">{formatCurrency(exportPreview.netProfit)}</p>
                </div>
              </div>
              <p className="text-sm font-bold leading-6 text-slate-600">
                Latest record date: {exportPreview.latestRecordDate ?? 'ยังไม่มี'} · JSON {exportPreview.jsonEstimatedSizeLabel} · CSV {exportPreview.csvEstimatedSizeLabel}
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                <Button className="w-full" onClick={handlePreviewJsonBackup} variant="secondary">
                  <FileJson aria-hidden="true" className="h-5 w-5" />
                  Preview JSON Backup
                </Button>
                <Button className="w-full" onClick={handleDownloadJsonBackup} variant="primary">
                  <Download aria-hidden="true" className="h-5 w-5" />
                  Download JSON Backup
                </Button>
                <Button className="w-full" onClick={handlePreviewFinanceCsv} variant="secondary">
                  <FileSpreadsheet aria-hidden="true" className="h-5 w-5" />
                  Preview Finance CSV
                </Button>
                <Button className="w-full" onClick={handleDownloadFinanceCsv} variant="primary">
                  <Download aria-hidden="true" className="h-5 w-5" />
                  Download Finance CSV
                </Button>
              </div>
              {exportPreviewMode ? (
                <FormField label={exportPreviewMode === 'json' ? 'JSON backup preview' : 'Finance CSV preview'}>
                  <textarea
                    className={`${textAreaClassName()} min-h-56 font-mono text-xs leading-5`}
                    readOnly
                    value={exportPreviewText}
                  />
                </FormField>
              ) : null}
              <div className="grid gap-2">
                {exportPreview.warnings.map((warning) => (
                  <p className="rounded-lg bg-kaset-mist p-3 text-sm font-semibold leading-6 text-slate-700" key={warning}>
                    {warning}
                  </p>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-900">
                <Archive aria-hidden="true" className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-extrabold leading-6 text-kaset-ink">Delete/archive guidance</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  การลบรายการในหน้านี้เป็นการลบข้อมูลในเครื่องนี้เท่านั้น ตอนนี้รองรับการลบทีละกิจกรรม ลบทีละรายการเงิน เก็บแปลงเป็น archived แทน hard delete และปิด/ยกเลิกรอบปลูกแทนการลบ Bulk delete ยังไม่เปิดใช้ เพราะต้องมี export และการยืนยันที่แข็งแรงกว่านี้ก่อน
                </p>
              </div>
            </div>
          </Card>
        </section>

        <section className="grid gap-3" id="farm-records-restore">
          <SectionTitle badge="local restore preview only" title="Restore Backup / กู้คืนข้อมูลจากไฟล์สำรอง" />
          <NoticeBox tone="warning" icon={RotateCcw} title="กู้คืนเฉพาะข้อมูลในเครื่องนี้">
            การกู้คืนจะตรวจไฟล์ก่อนเสมอ และจะ replace local Farm Records ในเครื่องนี้เท่านั้น ยังไม่มีการซิงก์ขึ้นคลาวด์
            ไม่มีการเรียก Supabase ไม่มีการส่งข้อมูลให้ AI และรูปภาพจริงยังไม่ถูกรวมใน backup มีเฉพาะ metadata เท่านั้น
            หากต้องการเก็บข้อมูลปัจจุบันไว้ ให้ export backup ก่อนกู้คืน
          </NoticeBox>
          <Card className="p-4">
            <div className="flex gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-900">
                <ShieldCheck aria-hidden="true" className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-extrabold leading-6 text-kaset-ink">Restore recovery guidance</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  ก่อนกู้คืน ควรดาวน์โหลดข้อมูลปัจจุบันเก็บไว้ก่อน การกู้คืนจะเปลี่ยนข้อมูล Farm Records
                  ในเครื่องนี้เท่านั้น ถ้าไฟล์สำรองเก่ากว่าข้อมูลปัจจุบัน ข้อมูลใหม่ในเครื่องอาจถูกแทนที่
                  และตอนนี้ยังไม่มี cloud backup ให้กู้คืน
                </p>
                {lastPreRestoreSnapshotCreatedAt ? (
                  <p className="mt-2 rounded-lg bg-kaset-mist p-3 text-sm font-semibold leading-6 text-slate-700">
                    Last pre-restore snapshot available: {lastPreRestoreSnapshotCreatedAt}
                  </p>
                ) : null}
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="grid gap-4">
              <div className="flex gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                  <Upload aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-extrabold leading-6 text-kaset-ink">Validate backup before restore</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    เลือกไฟล์ JSON backup หรือวางข้อความ JSON ด้านล่าง ระบบจะแสดง preview ก่อนกู้คืนและจะไม่ restore อัตโนมัติ
                  </p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <FormField label="Backup JSON file">
                  <input accept="application/json,.json" className={inputClassName()} onChange={handleRestoreFileChange} type="file" />
                </FormField>
                <div className="rounded-lg bg-kaset-mist p-3 text-sm font-semibold leading-6 text-slate-700">
                  Required confirmation phrase:
                  <span className="mt-1 block break-words font-mono text-xs font-extrabold text-kaset-ink">{farmRecordsRestoreConfirmationPhrase}</span>
                </div>
              </div>
              <FormField hint="Paste an M86/M87/M88/M89 Farm Records JSON backup. CSV restore is not supported in M89." label="Paste JSON backup">
                <textarea
                  className={`${textAreaClassName()} min-h-40 font-mono text-xs leading-5`}
                  onChange={(event) => handleRestoreTextChange(event.target.value)}
                  placeholder='{"exportVersion":1,"appFeature":"farm_records",...}'
                  value={restoreRawText}
                />
              </FormField>
              <Button className="w-full" onClick={handleDownloadPreRestoreSnapshot} variant="secondary">
                <Download aria-hidden="true" className="h-5 w-5" />
                Download current local backup before restore
              </Button>

              {restoreParseResult && !restoreParseResult.ok ? <FormErrors errors={[restoreParseResult.error]} /> : null}
              {restoreValidation && restoreValidation.errors.length > 0 ? <FormErrors errors={restoreValidation.errors} /> : null}

              {restoreValidation ? (
                <div className="grid gap-2">
                  <div className="flex flex-wrap gap-2">
                    <Badge tone={restoreValidation.isValid ? 'green' : 'rose'}>
                      {restoreValidation.isValid ? 'Backup valid for local preview' : 'Backup needs fixes'}
                    </Badge>
                    <Badge tone="neutral">{restoreValidation.detectedCounts.farmPlotCount.toLocaleString('th-TH')} plots</Badge>
                    <Badge tone="neutral">{restoreValidation.detectedCounts.financeEntryCount.toLocaleString('th-TH')} finance entries</Badge>
                    <Badge tone="neutral">{restoreValidation.detectedCounts.harvestRecordCount.toLocaleString('th-TH')} harvest records</Badge>
                  </div>
                  {restoreValidation.warnings.map((warning) => (
                    <p className="rounded-lg bg-amber-50 p-3 text-sm font-semibold leading-6 text-amber-900" key={warning}>
                      {warning}
                    </p>
                  ))}
                </div>
              ) : null}

              {restoreRiskReview ? (
                <div className="grid gap-3">
                  <div>
                    <h3 className="font-extrabold leading-6 text-kaset-ink">Restore Risk Review</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Review what will change before replacing local Farm Records on this device.
                    </p>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-4">
                    <div className="rounded-lg bg-white p-3 ring-1 ring-slate-100">
                      <p className="text-xs font-bold text-slate-500">Plots</p>
                      <p className="mt-1 text-sm font-extrabold text-kaset-ink">
                        {restoreRiskReview.currentCounts.farmPlotCount.toLocaleString('th-TH')} → {restoreRiskReview.backupCounts.farmPlotCount.toLocaleString('th-TH')}
                      </p>
                      <p className="text-xs font-bold text-kaset-deep">{formatCountDelta(restoreRiskReview.differenceCounts.farmPlotCount)}</p>
                    </div>
                    <div className="rounded-lg bg-white p-3 ring-1 ring-slate-100">
                      <p className="text-xs font-bold text-slate-500">Crop cycles</p>
                      <p className="mt-1 text-sm font-extrabold text-kaset-ink">
                        {restoreRiskReview.currentCounts.cropCycleCount.toLocaleString('th-TH')} → {restoreRiskReview.backupCounts.cropCycleCount.toLocaleString('th-TH')}
                      </p>
                      <p className="text-xs font-bold text-kaset-deep">{formatCountDelta(restoreRiskReview.differenceCounts.cropCycleCount)}</p>
                    </div>
                    <div className="rounded-lg bg-white p-3 ring-1 ring-slate-100">
                      <p className="text-xs font-bold text-slate-500">Activities</p>
                      <p className="mt-1 text-sm font-extrabold text-kaset-ink">
                        {restoreRiskReview.currentCounts.activityRecordCount.toLocaleString('th-TH')} → {restoreRiskReview.backupCounts.activityRecordCount.toLocaleString('th-TH')}
                      </p>
                      <p className="text-xs font-bold text-kaset-deep">{formatCountDelta(restoreRiskReview.differenceCounts.activityRecordCount)}</p>
                    </div>
                    <div className="rounded-lg bg-white p-3 ring-1 ring-slate-100">
                      <p className="text-xs font-bold text-slate-500">Finance</p>
                      <p className="mt-1 text-sm font-extrabold text-kaset-ink">
                        {restoreRiskReview.currentCounts.financeEntryCount.toLocaleString('th-TH')} → {restoreRiskReview.backupCounts.financeEntryCount.toLocaleString('th-TH')}
                      </p>
                      <p className="text-xs font-bold text-kaset-deep">{formatCountDelta(restoreRiskReview.differenceCounts.financeEntryCount)}</p>
                    </div>
                    <div className="rounded-lg bg-white p-3 ring-1 ring-slate-100">
                      <p className="text-xs font-bold text-slate-500">Harvest</p>
                      <p className="mt-1 text-sm font-extrabold text-kaset-ink">
                        {restoreRiskReview.currentCounts.harvestRecordCount.toLocaleString('th-TH')} → {restoreRiskReview.backupCounts.harvestRecordCount.toLocaleString('th-TH')}
                      </p>
                      <p className="text-xs font-bold text-kaset-deep">{formatCountDelta(restoreRiskReview.differenceCounts.harvestRecordCount)}</p>
                    </div>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-4">
                    <div className="rounded-lg bg-rose-50 p-3">
                      <p className="text-xs font-bold text-rose-700">Estimated removed</p>
                      <p className="mt-1 text-sm font-extrabold text-rose-900">
                        {restoreRiskReview.removedCountEstimate.activityRecordCount.toLocaleString('th-TH')} activities · {restoreRiskReview.removedCountEstimate.financeEntryCount.toLocaleString('th-TH')} finance
                      </p>
                    </div>
                    <div className="rounded-lg bg-kaset-mint p-3">
                      <p className="text-xs font-bold text-kaset-deep">Estimated added</p>
                      <p className="mt-1 text-sm font-extrabold text-kaset-ink">
                        {restoreRiskReview.addedCountEstimate.activityRecordCount.toLocaleString('th-TH')} activities · {restoreRiskReview.addedCountEstimate.financeEntryCount.toLocaleString('th-TH')} finance
                      </p>
                    </div>
                    <div className="rounded-lg bg-kaset-mist p-3">
                      <p className="text-xs font-bold text-slate-500">Current net profit</p>
                      <p className="mt-1 break-words text-sm font-extrabold text-kaset-deep">{formatCurrency(restoreRiskReview.currentSummary.netProfit)}</p>
                    </div>
                    <div className="rounded-lg bg-kaset-mist p-3">
                      <p className="text-xs font-bold text-slate-500">Backup net profit</p>
                      <p className="mt-1 break-words text-sm font-extrabold text-kaset-deep">{formatCurrency(restoreRiskReview.backupSummary.netProfit)}</p>
                    </div>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-3">
                    <div className="rounded-lg bg-white p-3 ring-1 ring-slate-100">
                      <p className="text-xs font-bold text-slate-500">Changed net profit estimate</p>
                      <p className="mt-1 break-words text-sm font-extrabold text-kaset-deep">{formatCurrency(restoreRiskReview.changedNetProfitEstimate)}</p>
                    </div>
                    <div className="rounded-lg bg-white p-3 ring-1 ring-slate-100">
                      <p className="text-xs font-bold text-slate-500">Latest current record</p>
                      <p className="mt-1 break-words text-sm font-extrabold text-kaset-deep">{restoreRiskReview.latestCurrentRecordDate ?? 'ยังไม่มี'}</p>
                    </div>
                    <div className="rounded-lg bg-kaset-mist p-3">
                      <p className="text-xs font-bold text-slate-500">Latest backup record</p>
                      <p className="mt-1 break-words text-sm font-extrabold text-kaset-deep">{restoreRiskReview.latestBackupRecordDate ?? 'ยังไม่มี'}</p>
                    </div>
                  </div>
                  <p className="rounded-lg bg-rose-50 p-3 text-sm font-semibold leading-6 text-rose-800">
                    Restore mode: replace_local_farm_records. ข้อมูลสมุดฟาร์มปัจจุบันในเครื่องนี้จะถูกแทนที่ แต่ local storage อื่นของแอปจะไม่ถูกแตะ
                  </p>
                  <div className="grid gap-2">
                    {restoreRiskReview.warnings.map((warning) => (
                      <p className="rounded-lg bg-amber-50 p-3 text-sm font-semibold leading-6 text-amber-900" key={warning}>
                        {warning}
                      </p>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="grid gap-3 rounded-lg border border-kaset-deep/10 bg-white p-3">
                <label className="flex items-start gap-3 text-sm font-bold leading-6 text-kaset-ink">
                  <input
                    checked={restoreConfirmed}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-kaset-deep"
                    onChange={(event) => setRestoreConfirmed(event.target.checked)}
                    type="checkbox"
                  />
                  <span>I understand this will replace local Farm Records on this device. Cloud sync is not active.</span>
                </label>
                <FormField label="Type confirmation phrase">
                  <input
                    className={inputClassName()}
                    onChange={(event) => setRestoreConfirmationPhrase(event.target.value)}
                    placeholder={farmRecordsRestoreConfirmationPhrase}
                    value={restoreConfirmationPhrase}
                  />
                </FormField>
                <Button className="w-full" disabled={!canApplyRestore} onClick={handleApplyRestore} variant="primary">
                  <RotateCcw aria-hidden="true" className="h-5 w-5" />
                  Restore local Farm Records
                </Button>
              </div>
            </div>
          </Card>
        </section>

        <section className="grid gap-3" id="farm-records-sync">
          <SectionTitle badge="future consent gate only" title="Cloud Sync Readiness / การซิงก์ข้อมูลขึ้นคลาวด์" />
          <NoticeBox tone="info" icon={CloudOff} title="Cloud sync is not enabled">
            ตอนนี้ Farm Records อยู่ใน local-only mode เท่านั้น Supabase writes ปิดอยู่ ไม่มี GPS แบบละเอียด และ AI ไม่มีสิทธิ์อ่านสมุดฟาร์ม
            ส่วนนี้เป็น gate/checklist สำหรับอนาคต ไม่ได้ซิงก์หรือเรียก backend
          </NoticeBox>
          <Card className="border-sky-100 bg-sky-50/70 p-4">
            <div className="grid gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="sky">prototype only</Badge>
                <Badge tone="neutral">not legal consent</Badge>
                <Badge tone="neutral">no backend calls</Badge>
              </div>
              <div>
                <h3 className="font-extrabold leading-6 text-kaset-ink">
                  Cloud Sync Consent Prototype / ทดลองหน้าขอความยินยอมซิงก์ข้อมูลขึ้นคลาวด์
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  ตอนนี้ข้อมูลยังอยู่ในเครื่องนี้เท่านั้น การซิงก์ขึ้นคลาวด์ยังไม่เปิดใช้งาน หากเปิดในอนาคต ต้องขอความยินยอมก่อน
                  ข้อมูลรายรับรายจ่ายฟาร์มอาจเป็นข้อมูลสำคัญ ควรเข้าใจให้ชัดก่อนซิงก์
                </p>
              </div>
              <div className="grid gap-3 lg:grid-cols-2">
                <div className="rounded-lg bg-white p-3 ring-1 ring-sky-100">
                  <p className="text-xs font-extrabold uppercase text-sky-800">Step 1</p>
                  <h4 className="mt-1 font-extrabold text-kaset-ink">What sync would mean</h4>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    In the future, Farm Records could be copied from this device to a user-owned cloud account for backup and cross-device access. It is currently not enabled.
                  </p>
                </div>
                <div className="rounded-lg bg-white p-3 ring-1 ring-sky-100">
                  <p className="text-xs font-extrabold uppercase text-sky-800">Step 2</p>
                  <h4 className="mt-1 font-extrabold text-kaset-ink">Data that would be included</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {farmRecordsSyncPrototypeIncludedData.map((item) => (
                      <Badge key={item} tone="green">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg bg-white p-3 ring-1 ring-sky-100">
                  <p className="text-xs font-extrabold uppercase text-sky-800">Step 3</p>
                  <h4 className="mt-1 font-extrabold text-kaset-ink">Data not included by default</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {farmRecordsSyncPrototypeExcludedData.map((item) => (
                      <Badge key={item} tone="neutral">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg bg-white p-3 ring-1 ring-sky-100">
                  <p className="text-xs font-extrabold uppercase text-sky-800">Step 4</p>
                  <h4 className="mt-1 font-extrabold text-kaset-ink">Consent options prototype</h4>
                  <div className="mt-3 grid gap-2">
                    {farmRecordsSyncPrototypeConsentCategories.map((category) => {
                      const toggleKey = category.id;

                      return (
                        <label className="flex gap-3 rounded-lg bg-kaset-mist p-3 text-sm leading-6 text-slate-700" key={category.id}>
                          <input
                            checked={syncConsentPrototypeState[toggleKey]}
                            className="mt-1 h-5 w-5 shrink-0 accent-kaset-leaf"
                            onChange={(event) => handleSyncConsentPrototypeChange(toggleKey, event.target.checked)}
                            type="checkbox"
                          />
                          <span>
                            <span className="block font-extrabold text-kaset-ink">{category.label}</span>
                            <span className="block">{category.detail}</span>
                          </span>
                        </label>
                      );
                    })}
                    <label className="flex gap-3 rounded-lg bg-amber-50 p-3 text-sm leading-6 text-amber-950">
                      <input
                        checked={syncConsentPrototypeState.acknowledgedSensitiveFinanceData}
                        className="mt-1 h-5 w-5 shrink-0 accent-kaset-leaf"
                        onChange={(event) => handleSyncConsentPrototypeChange('acknowledgedSensitiveFinanceData', event.target.checked)}
                        type="checkbox"
                      />
                      <span>I understand farm finance records may contain sensitive income, cost, and profit information.</span>
                    </label>
                    <label className="flex gap-3 rounded-lg bg-amber-50 p-3 text-sm leading-6 text-amber-950">
                      <input
                        checked={syncConsentPrototypeState.acknowledgedLocalOnlyPrototype}
                        className="mt-1 h-5 w-5 shrink-0 accent-kaset-leaf"
                        onChange={(event) => handleSyncConsentPrototypeChange('acknowledgedLocalOnlyPrototype', event.target.checked)}
                        type="checkbox"
                      />
                      <span>I understand this is local prototype state only and not production legal consent.</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="grid gap-3 lg:grid-cols-2">
                <div className="rounded-lg bg-white p-3 ring-1 ring-sky-100">
                  <p className="text-xs font-extrabold uppercase text-sky-800">Step 5</p>
                  <h4 className="mt-1 font-extrabold text-kaset-ink">Prototype warnings</h4>
                  <div className="mt-2 grid gap-2">
                    {syncConsentPrototypeWarnings.map((warning) => (
                      <p className="rounded-lg bg-kaset-mist p-3 text-sm leading-6 text-slate-700" key={warning}>
                        {warning}
                      </p>
                    ))}
                  </div>
                  <p className="mt-3 text-xs font-bold leading-5 text-slate-500">
                    Prototype key: {syncConsentPrototypeReadiness.storageKey}
                  </p>
                </div>
                <div className="rounded-lg bg-white p-3 ring-1 ring-sky-100">
                  <p className="text-xs font-extrabold uppercase text-sky-800">Step 6</p>
                  <h4 className="mt-1 font-extrabold text-kaset-ink">Disabled action</h4>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Cloud sync is not available yet. It requires Supabase RLS, ownership tests, cloud export/delete, and privacy review.
                  </p>
                  <div className="mt-3 grid gap-2">
                    {syncConsentPrototypeReadiness.blockers.map((blocker) => (
                      <p className="rounded-lg bg-rose-50 p-3 text-sm leading-6 text-rose-950" key={blocker}>
                        {blocker}
                      </p>
                    ))}
                  </div>
                  <Button className="mt-3 w-full" disabled variant="secondary">
                    <CloudOff aria-hidden="true" className="h-5 w-5" />
                    Enable Cloud Sync / เปิดซิงก์ขึ้นคลาวด์
                  </Button>
                </div>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-xs font-bold text-slate-500">Mode</p>
                  <p className="mt-1 text-sm font-extrabold text-kaset-ink">{syncReadiness.mode}</p>
                </div>
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-xs font-bold text-slate-500">Cloud sync</p>
                  <p className="mt-1 text-sm font-extrabold text-rose-800">{syncReadiness.cloudSyncEnabled ? 'enabled' : 'not enabled'}</p>
                </div>
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-xs font-bold text-slate-500">Supabase writes</p>
                  <p className="mt-1 text-sm font-extrabold text-rose-800">{syncReadiness.supabaseWritesEnabled ? 'enabled' : 'disabled'}</p>
                </div>
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-xs font-bold text-slate-500">GPS</p>
                  <p className="mt-1 text-sm font-extrabold text-kaset-deep">{syncReadiness.gpsUsed ? 'used' : 'not used'}</p>
                </div>
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-xs font-bold text-slate-500">AI access</p>
                  <p className="mt-1 text-sm font-extrabold text-kaset-deep">{syncReadiness.aiAccessEnabled ? 'enabled' : 'disabled'}</p>
                </div>
                <div className="rounded-lg bg-kaset-mist p-3">
                  <p className="text-xs font-bold text-slate-500">Export/restore</p>
                  <p className="mt-1 text-sm font-extrabold text-kaset-deep">{syncReadiness.exportRestoreAvailableLocally ? 'local tools ready' : 'not ready'}</p>
                </div>
              </div>
              <div className="grid gap-2">
                <div>
                  <h3 className="font-extrabold leading-6 text-kaset-ink">Sync readiness checklist</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    These statuses are informational only. Cloud sync remains disabled and no backend calls are made.
                  </p>
                </div>
                {syncReadiness.readinessChecklist.map((item) => (
                  <div className="rounded-lg bg-white p-3 ring-1 ring-slate-100" key={item.id}>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-extrabold leading-6 text-kaset-ink">{item.label}</p>
                      <Badge tone={getSyncChecklistTone(item.status)}>{getSyncChecklistLabel(item.status)}</Badge>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{item.detail}</p>
                  </div>
                ))}
                <Button className="w-full" disabled variant="secondary">
                  <CloudOff aria-hidden="true" className="h-5 w-5" />
                  Cloud sync remains disabled
                </Button>
              </div>
              <div className="grid gap-2">
                {syncReadiness.requirements.map((requirement) => (
                  <div className="rounded-lg bg-white p-3 ring-1 ring-slate-100" key={requirement.id}>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-extrabold leading-6 text-kaset-ink">{requirement.label}</p>
                      <Badge tone={requirement.status === 'blocked' ? 'rose' : requirement.status === 'ready_local' ? 'green' : 'gold'}>
                        {requirement.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{requirement.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </section>

        <section className="grid gap-3">
          <SectionTitle badge={`${viewModel.recentTimeline.length} ล่าสุด`} title="Recent Farm Timeline" />
          {viewModel.recentTimeline.length > 0 ? (
            viewModel.recentTimeline.map((item) => (
              <Card className="p-4" key={item.id}>
                <div className="flex gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mist text-kaset-deep">
                    <ListChecks aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-2">
                      <Badge tone={item.kind === 'income' ? 'green' : item.kind === 'expense' ? 'gold' : 'sky'}>{getTimelineKindLabel(item.kind)}</Badge>
                      <Badge tone="neutral">{item.date}</Badge>
                    </div>
                    <h3 className="mt-2 break-words font-extrabold leading-6 text-kaset-ink">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {[getPlotName(farmRecords.state.farmPlots, item.farmPlotId), getCycleLabel(farmRecords.state.cropCycles, item.cropCycleId)].filter(Boolean).join(' · ')}
                    </p>
                    <p className="mt-1 text-sm font-bold leading-6 text-kaset-deep">
                      {item.kind === 'activity' && item.activityType ? activityLabels[item.activityType] : item.category ? getFinanceCategoryLabel(item.category) : null}
                      {item.amount !== undefined ? ` · ${formatCurrency(item.amount)}` : null}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <EmptyState
              detail="บันทึกกิจกรรมหรือรายรับรายจ่าย แล้วไทม์ไลน์จะแสดงสิ่งที่เกิดขึ้นล่าสุดในฟาร์ม"
              title="ยังไม่มีไทม์ไลน์ฟาร์ม"
            />
          )}
        </section>

        <section className="grid gap-3">
          <SectionTitle badge={`${viewModel.plots.length} รายการ`} title="แปลงปลูก" />
          {viewModel.plots.length > 0 ? (
            viewModel.plots.map((plot) => {
              const cycles = farmRecords.state.cropCycles.filter((cycle) => cycle.farmPlotId === plot.id);
              const currentCycle = cycles.find((cycle) => cycle.status === 'active');

              return (
                <Card className="p-4" key={plot.id}>
                  <div className="flex gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                      <Leaf aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap gap-2">
                        <Badge tone={plot.isArchived ? 'neutral' : 'green'}>{plot.isArchived ? 'เก็บถาวร / Archived' : 'ใช้งานอยู่ / Active'}</Badge>
                        <Badge tone="sky">{viewModel.activeCycleCountByPlot[plot.id] ?? 0} active cycle</Badge>
                      </div>
                      <h3 className="mt-2 font-extrabold leading-6 text-kaset-ink">{plot.name}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{formatLocation(plot)}</p>
                      <p className="text-sm leading-6 text-slate-600">{formatArea(plot)}</p>
                      <p className="mt-2 text-sm font-bold leading-6 text-kaset-deep">
                        {currentCycle ? `รอบปัจจุบัน: ${currentCycle.cropName}` : 'ยังไม่มีรอบปลูก active'}
                      </p>
                      {!plot.isArchived ? (
                        <button
                          className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-amber-50 px-4 text-sm font-extrabold text-amber-900"
                          onClick={() => handleArchiveFarmPlot(plot.id)}
                          type="button"
                        >
                          <Archive aria-hidden="true" className="h-4 w-4" />
                          เก็บแปลง
                        </button>
                      ) : null}
                    </div>
                  </div>
                </Card>
              );
            })
          ) : (
            <EmptyState
              actionLabel="เพิ่มแปลงปลูก"
              detail={viewModel.hasActiveFilters ? 'ลองล้างตัวกรองหรือเลือกแปลงอื่น' : 'เริ่มจากเพิ่มแปลงปลูกของคุณ'}
              onAction={() => openForm('plot')}
              title={viewModel.hasActiveFilters ? 'ไม่พบแปลงตามตัวกรองนี้' : 'ยังไม่มีแปลงปลูก'}
            />
          )}
        </section>

        <section className="grid gap-3">
          <SectionTitle badge={`${viewModel.cropCycles.length} รายการ`} title="รอบปลูก" />
          {viewModel.cropCycles.length > 0 ? (
            viewModel.cropCycles.map((cycle) => (
              <Card className="p-4" key={cycle.id}>
                <div className="flex gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-emerald-100 text-emerald-800">
                    <Sprout aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-2">
                      <Badge tone={cycle.status === 'active' ? 'green' : cycle.status === 'cancelled' ? 'rose' : 'neutral'}>{statusLabels[cycle.status]}</Badge>
                      <Badge tone="neutral">{getPlotName(farmRecords.state.farmPlots, cycle.farmPlotId)}</Badge>
                    </div>
                    <h3 className="mt-2 font-extrabold leading-6 text-kaset-ink">
                      {cycle.cropName}
                      {cycle.variety ? ` - ${cycle.variety}` : ''}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {[cycle.seasonLabel, `เริ่ม ${cycle.startDate}`, cycle.expectedHarvestDate ? `คาดเก็บเกี่ยว ${cycle.expectedHarvestDate}` : undefined, cycle.actualHarvestDate ? `เก็บเกี่ยวจริง ${cycle.actualHarvestDate}` : undefined]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                    {cycle.status === 'active' || cycle.status === 'planned' ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          className="inline-flex min-h-10 items-center gap-2 rounded-full bg-kaset-mint px-4 text-sm font-extrabold text-kaset-deep"
                          onClick={() => handleCloseCropCycle(cycle.id, 'harvested')}
                          type="button"
                        >
                          <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
                          ปิดเป็น harvested
                        </button>
                        <button
                          className="inline-flex min-h-10 items-center gap-2 rounded-full bg-rose-50 px-4 text-sm font-extrabold text-rose-700"
                          onClick={() => handleCloseCropCycle(cycle.id, 'cancelled')}
                          type="button"
                        >
                          <X aria-hidden="true" className="h-4 w-4" />
                          ยกเลิกรอบปลูก
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <EmptyState
              actionLabel="เพิ่มรอบปลูก"
              detail={viewModel.hasActiveFilters ? 'ลองล้างตัวกรองหรือเลือกช่วงวันที่อื่น' : 'เพิ่มรอบปลูกเพื่อผูกกิจกรรมและต้นทุนเข้ากับฤดูกาลผลิต'}
              onAction={() => openForm('cycle')}
              title={viewModel.hasActiveFilters ? 'ไม่พบรอบปลูกตามตัวกรองนี้' : 'ยังไม่มีรอบปลูก'}
            />
          )}
        </section>

        <section className="grid gap-3">
          <SectionTitle badge={`${viewModel.activityRecords.length} รายการ`} title="กิจกรรมฟาร์ม" />
          {viewModel.activityRecords.length > 0 ? (
            viewModel.activityRecords.map((record) => (
              <Card className="p-4" key={record.id}>
                <div className="flex gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-800">
                    <Activity aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-2">
                      <Badge tone="sky">{activityLabels[record.activityType]}</Badge>
                      <Badge tone="neutral">{record.activityDate}</Badge>
                    </div>
                    <h3 className="mt-2 font-extrabold leading-6 text-kaset-ink">{record.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {getPlotName(farmRecords.state.farmPlots, record.farmPlotId)}
                      {getCycleLabel(farmRecords.state.cropCycles, record.cropCycleId) ? ` · ${getCycleLabel(farmRecords.state.cropCycles, record.cropCycleId)}` : ''}
                    </p>
                    {record.inputName || record.inputQuantity !== undefined ? (
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {[record.inputName, record.inputQuantity === undefined ? undefined : `${record.inputQuantity.toLocaleString('th-TH')} ${record.inputUnit ?? ''}`]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                    ) : null}
                    {record.description ? <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">{record.description}</p> : null}
                    {record.tags?.length ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {record.tags.map((tag) => (
                          <Badge key={tag} tone="neutral">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    ) : null}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        className="inline-flex min-h-10 items-center gap-2 rounded-full bg-kaset-mint px-4 text-sm font-extrabold text-kaset-deep"
                        onClick={() => startEditActivity(record)}
                        type="button"
                      >
                        <Pencil aria-hidden="true" className="h-4 w-4" />
                        แก้ไข
                      </button>
                      <button
                        className="inline-flex min-h-10 items-center gap-2 rounded-full bg-rose-50 px-4 text-sm font-extrabold text-rose-700"
                        onClick={() => handleDeleteActivity(record.id)}
                        type="button"
                      >
                        <Trash2 aria-hidden="true" className="h-4 w-4" />
                        ลบ
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <EmptyState
              actionLabel="เพิ่มกิจกรรม"
              detail={
                viewModel.hasActiveFilters
                  ? 'ไม่พบรายการตามตัวกรองนี้'
                  : 'บันทึกกิจกรรม เช่น ใส่ปุ๋ย พ่นยา รดน้ำ ใช้แรงงาน หรือเก็บเกี่ยว'
              }
              onAction={() => openForm('activity')}
              title={viewModel.hasActiveFilters ? 'ไม่พบกิจกรรมตามตัวกรองนี้' : 'ยังไม่มีกิจกรรมฟาร์ม'}
            />
          )}
        </section>

        <section className="grid gap-3">
          <SectionTitle badge={`${viewModel.financeEntries.length} รายการ`} title="บัญชีฟาร์ม" />
          {viewModel.financeEntries.length > 0 ? (
            viewModel.financeEntries.map((entry) => (
              <Card className="p-4" key={entry.id}>
                <div className="flex gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-900">
                    <WalletCards aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-2">
                      <Badge tone={entry.direction === 'income' ? 'green' : 'gold'}>{entry.direction === 'income' ? 'รายรับ / Income' : 'รายจ่าย / Expense'}</Badge>
                      <Badge tone="neutral">{getFinanceCategoryLabel(entry.category)}</Badge>
                      <Badge tone="neutral">{entry.entryDate}</Badge>
                    </div>
                    <h3 className="mt-2 font-extrabold leading-6 text-kaset-ink">{entry.title}</h3>
                    <p className={entry.direction === 'income' ? 'mt-1 text-lg font-extrabold text-kaset-deep' : 'mt-1 text-lg font-extrabold text-amber-900'}>
                      {formatCurrency(entry.amount)}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {[getPlotName(farmRecords.state.farmPlots, entry.farmPlotId), getCycleLabel(farmRecords.state.cropCycles, entry.cropCycleId)]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                    {entry.buyerOrVendor ? <p className="mt-1 text-sm leading-6 text-slate-600">ผู้ซื้อ/ผู้ขาย: {entry.buyerOrVendor}</p> : null}
                    {entry.note ? <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">{entry.note}</p> : null}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        className="inline-flex min-h-10 items-center gap-2 rounded-full bg-kaset-mint px-4 text-sm font-extrabold text-kaset-deep"
                        onClick={() => startEditFinanceEntry(entry)}
                        type="button"
                      >
                        <Pencil aria-hidden="true" className="h-4 w-4" />
                        แก้ไข
                      </button>
                      <button
                        className="inline-flex min-h-10 items-center gap-2 rounded-full bg-rose-50 px-4 text-sm font-extrabold text-rose-700"
                        onClick={() => handleDeleteFinanceEntry(entry.id)}
                        type="button"
                      >
                        <Trash2 aria-hidden="true" className="h-4 w-4" />
                        ลบ
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <EmptyState
              actionLabel="เพิ่มรายรับ/รายจ่าย"
              detail={
                viewModel.hasActiveFilters
                  ? 'ไม่พบรายการตามตัวกรองนี้'
                  : 'เพิ่มรายรับ/รายจ่ายเพื่อดูต้นทุนและกำไรของรอบปลูก'
              }
              onAction={() => openForm('finance')}
              title={viewModel.hasActiveFilters ? 'ไม่พบรายการบัญชีตามตัวกรองนี้' : 'ยังไม่มีรายการบัญชีฟาร์ม'}
            />
          )}
        </section>

        <section className="grid gap-3">
          <SectionTitle badge="computed from local records" title="สรุปบัญชีฟาร์ม" />
          <Card className="border-kaset-leaf/30 bg-kaset-mint p-4">
            <div className="grid gap-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-white/80 p-3">
                  <p className="text-xs font-bold leading-4 text-slate-600">รายรับ</p>
                  <p className="mt-1 text-sm font-extrabold text-kaset-deep">{formatCurrency(filterSummary.totalIncome)}</p>
                </div>
                <div className="rounded-lg bg-white/80 p-3">
                  <p className="text-xs font-bold leading-4 text-slate-600">รายจ่าย</p>
                  <p className="mt-1 text-sm font-extrabold text-amber-900">{formatCurrency(filterSummary.totalExpense)}</p>
                </div>
                <div className="rounded-lg bg-white/80 p-3">
                  <p className="text-xs font-bold leading-4 text-slate-600">สุทธิ</p>
                  <p className="mt-1 text-sm font-extrabold text-kaset-deep">{formatCurrency(filterSummary.netProfit)}</p>
                </div>
              </div>
              <p className="text-sm font-bold leading-6 text-kaset-ink">
                ต้นทุนต่อไร่: {formatOptionalCurrency(filterSummary.costPerRai)} · รายการบัญชี {filterSummary.entryCount.toLocaleString('th-TH')} · กิจกรรม{' '}
                {filterSummary.activityCount.toLocaleString('th-TH')}
              </p>
            </div>
          </Card>
          <div className="grid gap-3 sm:grid-cols-2">
            <Card className="p-4">
              <h3 className="mb-3 font-extrabold text-kaset-ink">รายจ่ายตามหมวด</h3>
              <CategoryBreakdown emptyLabel="ยังไม่มีรายจ่ายในตัวกรองนี้" items={getBreakdownItems(filterSummary, 'expense')} />
            </Card>
            <Card className="p-4">
              <h3 className="mb-3 font-extrabold text-kaset-ink">รายรับตามหมวด</h3>
              <CategoryBreakdown emptyLabel="ยังไม่มีรายรับในตัวกรองนี้" items={getBreakdownItems(filterSummary, 'income')} />
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
