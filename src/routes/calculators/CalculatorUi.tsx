import { Calculator, ChevronRight, Copy, History, RotateCcw, Share2, ShieldCheck, Sprout, Star } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { StatusPill } from '@/components/ui/StatusPill';
import { cx } from '@/components/ui/classNames';
import { calculatorCards } from '@/services/agri-calculators/agri-calculator-fixtures';
import { createCalculatorShareSummary } from '@/services/agri-calculators/agri-calculator-service';
import { calculatorPlanningOnlyDisclaimer } from '@/services/agri-calculators/crop-calculator-boundaries';
import {
  cropCalculatorProfileOptions,
  getCropCalculatorProfile,
} from '@/services/agri-calculators/crop-calculator-profiles';
import type {
  AgriCalculatorInputByCategory,
  AgriCalculatorResultByCategory,
  CalculatorCategory,
  CalculatorHistoryRecord,
} from '@/services/agri-calculators/agri-calculator.types';
import type { CropCalculatorKey } from '@/services/agri-calculators/crop-calculator-profile.types';
import { shareContent } from '@/services/share/share-service';
import { calculatorIconMap } from '@/routes/calculators/calculator-icons';

type NumberFieldProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  step?: number;
  min?: number;
  hint?: string;
};

export function NumberField({ hint, label, min = 0, onChange, step = 0.01, suffix, value }: NumberFieldProps) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-extrabold text-kaset-ink">{label}</span>
      <span className="flex min-h-[56px] items-center rounded-lg bg-white ring-1 ring-kaset-deep/12 focus-within:ring-2 focus-within:ring-kaset-leaf">
        <input
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-xl font-extrabold text-kaset-ink outline-none"
          inputMode="decimal"
          min={min}
          onChange={(event) => onChange(Number(event.target.value))}
          step={step}
          type="number"
          value={Number.isFinite(value) ? value : 0}
        />
        {suffix ? <span className="shrink-0 px-4 text-sm font-bold text-slate-500">{suffix}</span> : null}
      </span>
      {hint ? <span className="text-xs font-semibold leading-5 text-slate-500">{hint}</span> : null}
    </label>
  );
}

type SelectFieldProps<T extends string | number> = {
  label: string;
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
};

export function SelectField<T extends string | number>({ label, onChange, options, value }: SelectFieldProps<T>) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-extrabold text-kaset-ink">{label}</span>
      <select
        className="kh-form-control w-full border-0 bg-white px-4 font-extrabold text-kaset-ink ring-1 ring-kaset-deep/12 focus:outline-none focus:ring-2 focus:ring-kaset-leaf"
        onChange={(event) => {
          const selected = options.find((option) => String(option.value) === event.target.value);
          if (selected) onChange(selected.value);
        }}
        value={String(value)}
      >
        {options.map((option) => (
          <option key={String(option.value)} value={String(option.value)}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ResultMetric({
  featured = false,
  label,
  tone = 'green',
  value,
}: {
  featured?: boolean;
  label: string;
  tone?: 'green' | 'gold' | 'sky' | 'rose';
  value: string;
}) {
  const toneClass = {
    green: 'bg-kaset-mint text-kaset-deep',
    gold: 'bg-amber-50 text-amber-900',
    sky: 'bg-sky-50 text-sky-900',
    rose: 'bg-rose-50 text-rose-900',
  };

  return (
    <div className={cx('rounded-lg', featured ? 'p-4' : 'p-3', toneClass[tone])}>
      <p className="text-xs font-bold leading-5 opacity-80">{label}</p>
      <p className={cx('mt-1 font-extrabold', featured ? 'text-2xl leading-8' : 'text-xl leading-7')}>{value}</p>
    </div>
  );
}

export function CalculatorHero({
  category,
  children,
  isFavorite,
  onToggleFavorite,
}: {
  category: CalculatorCategory;
  children?: ReactNode;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  const card = calculatorCards.find((item) => item.id === category) ?? calculatorCards[0];
  const Icon = calculatorIconMap[card.iconKey];

  return (
    <Card className="overflow-hidden bg-kaset-deep text-white">
      <div className="relative p-5">
        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
        <div className="relative flex gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-kaset-deep">
            <Icon aria-hidden="true" className="h-7 w-7" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-white/15 text-white" tone="green">
                Local calculator
              </Badge>
              <button
                aria-label={isFavorite ? 'เอาออกจากรายการโปรด' : 'เพิ่มเป็นรายการโปรด'}
                className="inline-flex min-h-9 items-center gap-1 rounded-full bg-white/15 px-3 text-xs font-extrabold text-white ring-1 ring-white/20"
                onClick={onToggleFavorite}
                type="button"
              >
                <Star aria-hidden="true" className={cx('h-4 w-4', isFavorite && 'fill-white')} />
                {isFavorite ? 'โปรด' : 'บันทึก'}
              </button>
            </div>
            <h2 className="mt-3 text-2xl font-extrabold leading-8">{card.label}</h2>
            <p className="mt-2 text-sm leading-6 text-emerald-50/90">{card.description}</p>
            {children}
          </div>
        </div>
      </div>
    </Card>
  );
}

export function CropProfilePicker({
  actionLabel = 'ใช้ตัวอย่างของพืชนี้',
  children,
  onChange,
  onUseExample,
  selectedCropKey,
}: {
  actionLabel?: string;
  children?: ReactNode;
  onChange: (cropKey: CropCalculatorKey) => void;
  onUseExample: () => void;
  selectedCropKey: CropCalculatorKey;
}) {
  const profile = getCropCalculatorProfile(selectedCropKey);

  return (
    <Card className="p-4">
      <div className="flex gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
          <Sprout aria-hidden="true" className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-extrabold text-kaset-ink">ตัวอย่างตามพืช</h2>
            <Badge tone="gold">planning only</Badge>
          </div>
          <p className="mt-1 text-sm leading-6 text-slate-600">{calculatorPlanningOnlyDisclaimer}</p>
        </div>
      </div>
      <div className="mt-4 grid gap-4">
        <SelectField<CropCalculatorKey>
          label="เลือกพืช"
          onChange={onChange}
          options={cropCalculatorProfileOptions}
          value={selectedCropKey}
        />
        <div className="rounded-lg bg-kaset-mist p-3">
          <p className="font-extrabold text-kaset-ink">{profile.thaiDisplayName}</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">{profile.fertilizerPlanningNote}</p>
        </div>
        {children}
        <Button className="min-h-[52px] w-full" onClick={onUseExample} variant="soft">
          <Sprout aria-hidden="true" className="h-5 w-5" />
          {actionLabel}
        </Button>
      </div>
    </Card>
  );
}

export function SafetyNotice({ children }: { children?: ReactNode }) {
  return (
    <NoticeBox tone="warning" title="คำเตือนสำคัญ" icon={ShieldCheck}>
      {children ?? 'ผลลัพธ์เป็นการคำนวณเบื้องต้น ไม่ใช่คำแนะนำจากนักวิชาการเกษตร และไม่รับประกันผลในแปลงจริง'}
    </NoticeBox>
  );
}

export function WarningList({ isValid = true, warnings }: { isValid?: boolean; warnings: string[] }) {
  if (!isValid) {
    return (
      <NoticeBox tone="danger" title="ยังคำนวณไม่ได้">
        <ul className="grid gap-2">
          {(warnings.length > 0 ? warnings : ['กรอกข้อมูลให้ครบและตรวจตัวเลขก่อนกดคำนวณอีกครั้ง']).map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      </NoticeBox>
    );
  }

  if (warnings.length === 0) {
    return (
      <NoticeBox tone="success" title="ตรวจตัวเลขแล้ว">
        ยังไม่พบคำเตือนจากสูตรคำนวณ แต่ควรตรวจข้อมูลจริงก่อนนำไปใช้ในแปลง
      </NoticeBox>
    );
  }

  return (
    <NoticeBox tone="warning" title="ควรตรวจอีกครั้ง">
      <ul className="grid gap-2">
        {warnings.map((warning) => (
          <li key={warning}>{warning}</li>
        ))}
      </ul>
    </NoticeBox>
  );
}

export function CalculatorSubmitButton({ children }: { children: ReactNode }) {
  return (
    <Button className="min-h-[56px] w-full text-base" type="submit">
      <Calculator aria-hidden="true" className="h-5 w-5" />
      {children}
    </Button>
  );
}

export function CalculatorResetButton({ onReset }: { onReset: () => void }) {
  return (
    <Button className="min-h-[52px] w-full" onClick={onReset} variant="secondary">
      <RotateCcw aria-hidden="true" className="h-5 w-5" />
      คำนวณใหม่
    </Button>
  );
}

export function CalculatorShareActions<C extends CalculatorCategory>({
  category,
  input,
  result,
}: {
  category: C;
  input: AgriCalculatorInputByCategory[C];
  result: AgriCalculatorResultByCategory[C];
}) {
  const [message, setMessage] = useState('');
  const card = calculatorCards.find((item) => item.id === category);
  const summary = createCalculatorShareSummary(category, input, result);

  if (!result.isValid) {
    return (
      <NoticeBox tone="neutral" title="ยังไม่เปิดแชร์สรุป">
        ตรวจข้อมูลให้ครบและไม่มีข้อผิดพลาดก่อน ระบบจึงจะให้คัดลอกหรือแชร์สรุปผลคำนวณ
      </NoticeBox>
    );
  }

  const copySummary = async () => {
    try {
      if (!navigator.clipboard?.writeText) {
        setMessage('อุปกรณ์นี้ยังไม่รองรับการคัดลอกอัตโนมัติ');
        return;
      }

      await navigator.clipboard.writeText(summary);
      setMessage('คัดลอกสรุปผลแล้ว');
    } catch {
      setMessage('คัดลอกไม่สำเร็จ ลองเลือกข้อความจากสรุปแทน');
    }
  };

  const shareSummary = async () => {
    const shareResult = await shareContent({
      title: 'สรุปผลคำนวณเบื้องต้น',
      description: summary,
      url: card?.route ?? '/app/calculators',
      source: 'native',
    });

    setMessage(shareResult.message);
  };

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-extrabold text-kaset-ink">สรุปสำหรับแชร์</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">local-only ไม่มีไฟล์ PDF และไม่บันทึกขึ้นระบบ</p>
        </div>
      </div>
      <div className="mt-3 rounded-lg bg-kaset-mist p-3 text-sm font-bold leading-6 text-kaset-deep">
        สรุปผลคำนวณเบื้องต้น · ควรตรวจสอบฉลาก/ผู้เชี่ยวชาญก่อนใช้งานจริง
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button className="min-h-[52px] px-3 text-sm" onClick={copySummary} variant="secondary">
          <Copy aria-hidden="true" className="h-5 w-5" />
          คัดลอก
        </Button>
        <Button className="min-h-[52px] px-3 text-sm" onClick={shareSummary} variant="soft">
          <Share2 aria-hidden="true" className="h-5 w-5" />
          แชร์สรุป
        </Button>
      </div>
      {message ? <p className="mt-3 text-sm font-bold leading-6 text-kaset-deep">{message}</p> : null}
    </Card>
  );
}

export function CalculatorBackLink() {
  return (
    <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-extrabold text-kaset-deep ring-1 ring-kaset-deep/10" to="/app/calculators">
      เครื่องคำนวณทั้งหมด
      <ChevronRight aria-hidden="true" className="h-4 w-4" />
    </Link>
  );
}

export function RecentCalculations({ records }: { records: CalculatorHistoryRecord[] }) {
  const visibleRecords = records.slice(0, 5);

  return (
    <section className="grid gap-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-extrabold text-kaset-ink">ประวัติล่าสุด</h2>
        <StatusPill tone="info">ในเครื่องนี้</StatusPill>
      </div>
      {visibleRecords.length > 0 ? (
        visibleRecords.map((record) => {
          const card = calculatorCards.find((item) => item.id === record.category) ?? calculatorCards[0];
          const Icon = calculatorIconMap[card.iconKey];

          return (
            <Card className="p-4" key={record.id}>
              <div className="flex gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-kaset-mint text-kaset-deep">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap gap-2">
                    <Badge tone="neutral">{record.title}</Badge>
                    <span className="text-xs font-bold leading-5 text-slate-500">{record.createdAtLabel}</span>
                  </div>
                  <p className="mt-2 text-lg font-extrabold leading-7 text-kaset-ink">{record.resultLabel}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{record.summary}</p>
                  <Link className="mt-2 inline-flex text-sm font-extrabold text-kaset-deep" to={card.route}>
                    เปิดอีกครั้ง
                  </Link>
                </div>
              </div>
            </Card>
          );
        })
      ) : (
        <Card className="p-4 text-center">
          <History aria-hidden="true" className="mx-auto h-6 w-6 text-kaset-deep" />
          <p className="mt-2 text-sm font-bold leading-6 text-slate-600">ยังไม่มีประวัติการคำนวณในเครื่องนี้</p>
        </Card>
      )}
    </section>
  );
}
