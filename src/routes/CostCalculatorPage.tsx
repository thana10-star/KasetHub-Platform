import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { defaultCostEstimateInput, thaiAreaUnitLabels } from '@/services/agri-calculators/agri-calculator-fixtures';
import { calculateCostEstimate, formatAgriCurrency, formatAgriNumber } from '@/services/agri-calculators/agri-calculator-service';
import type { CostEstimateInput, ThaiAreaUnit } from '@/services/agri-calculators/agri-calculator.types';
import { useAgriCalculators } from '@/hooks/useAgriCalculators';
import {
  CalculatorBackLink,
  CalculatorHero,
  CalculatorResetButton,
  CalculatorShareActions,
  CalculatorSubmitButton,
  NumberField,
  RecentCalculations,
  ResultMetric,
  SafetyNotice,
  SelectField,
  WarningList,
} from '@/routes/calculators/CalculatorUi';

const areaUnitOptions: Array<{ value: ThaiAreaUnit; label: string }> = [
  { value: 'rai', label: thaiAreaUnitLabels.rai.label },
  { value: 'ngan', label: thaiAreaUnitLabels.ngan.label },
  { value: 'square_wa', label: thaiAreaUnitLabels.square_wa.label },
  { value: 'square_meter', label: thaiAreaUnitLabels.square_meter.label },
];

export function CostCalculatorPage() {
  const calculators = useAgriCalculators();
  const [input, setInput] = useState<CostEstimateInput>(() => calculators.getLastInput('cost_estimate') ?? defaultCostEstimateInput);
  const result = useMemo(() => calculateCostEstimate(input), [input]);

  const updateInput = (patch: Partial<CostEstimateInput>) => {
    setInput((current) => ({
      ...current,
      ...patch,
    }));
  };

  const resetInput = () => setInput(defaultCostEstimateInput);

  return (
    <div>
      <PageHeader title="คำนวณต้นทุน" subtitle="รวมค่าใช้จ่ายและต้นทุนต่อไร่" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <CalculatorHero
          category="cost_estimate"
          isFavorite={calculators.isFavorite('cost_estimate')}
          onToggleFavorite={() => calculators.toggleFavorite('cost_estimate')}
        />

        <SafetyNotice>ต้นทุนจริงอาจมีค่าเช่าที่ ดอกเบี้ย ค่าเสียโอกาส ค่าขนส่ง และค่าความเสียหายที่หน้านี้ยังไม่ได้คิด</SafetyNotice>

        <form
          className="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (result.isValid) calculators.calculateAndSave('cost_estimate', input);
          }}
        >
          <Card className="p-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-[1fr_132px] gap-3">
                <NumberField label="ขนาดพื้นที่" onChange={(landSizeValue) => updateInput({ landSizeValue })} value={input.landSizeValue} />
                <SelectField<ThaiAreaUnit>
                  label="หน่วย"
                  onChange={(landSizeUnit) => updateInput({ landSizeUnit })}
                  options={areaUnitOptions}
                  value={input.landSizeUnit}
                />
              </div>
              <NumberField label="ค่าปุ๋ย/ยา" onChange={(fertilizerCost) => updateInput({ fertilizerCost })} step={1} suffix="บาท" value={input.fertilizerCost} />
              <NumberField label="ค่าแรง" onChange={(laborCost) => updateInput({ laborCost })} step={1} suffix="บาท" value={input.laborCost} />
              <NumberField label="ค่าน้ำ" onChange={(waterCost) => updateInput({ waterCost })} step={1} suffix="บาท" value={input.waterCost} />
              <NumberField label="ค่าเครื่องจักร" onChange={(machineryCost) => updateInput({ machineryCost })} step={1} suffix="บาท" value={input.machineryCost} />
              <NumberField label="ค่าอื่น ๆ" onChange={(otherCost) => updateInput({ otherCost })} step={1} suffix="บาท" value={input.otherCost} />
              <NumberField
                hint="กรอกเพื่อดูต้นทุนต่อกิโลกรัมแบบคร่าว ๆ"
                label="ผลผลิตที่คาดไว้"
                onChange={(expectedYieldKg) => updateInput({ expectedYieldKg })}
                step={1}
                suffix="กก."
                value={input.expectedYieldKg ?? 0}
              />
              <CalculatorSubmitButton>คำนวณและบันทึกในเครื่อง</CalculatorSubmitButton>
              <CalculatorResetButton onReset={resetInput} />
            </div>
          </Card>
        </form>

        <Card className="p-5">
          <h2 className="text-lg font-extrabold text-kaset-ink">ผลคำนวณ</h2>
          <div className="mt-3 grid gap-3">
            <ResultMetric featured label="ต้นทุนรวม" value={result.totalCostLabel} />
            <ResultMetric label="ต้นทุนต่อไร่" tone="gold" value={result.costPerRaiLabel} />
            <ResultMetric label="จุดคุ้มทุนเบื้องต้น" tone="sky" value={result.costPerKgLabel ?? 'รอข้อมูลผลผลิต'} />
          </div>
          <p className="mt-3 rounded-lg bg-kaset-mist p-3 text-sm font-bold leading-6 text-kaset-deep">{result.breakEvenEstimateLabel}</p>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-extrabold text-kaset-ink">รายการต้นทุน</h2>
          <div className="mt-3 grid gap-2">
            {result.costItems.map((item) => (
              <div className="flex items-center justify-between gap-3 rounded-lg bg-kaset-mist p-3" key={item.id}>
                <span className="text-sm font-bold text-slate-600">{item.label}</span>
                <span className="text-sm font-extrabold text-kaset-ink">{formatAgriCurrency(item.amount)}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            พื้นที่คิดเป็น {formatAgriNumber(result.areaRai, 2)} ไร่ · {result.areaLabels.squareMeters}
          </p>
        </Card>

        <WarningList isValid={result.isValid} warnings={result.warnings} />

        <CalculatorShareActions category="cost_estimate" input={input} result={result} />

        <NoticeBox tone="warning" title="ขอบเขตจุดคุ้มทุน">
          หน้านี้ยังเป็น placeholder สำหรับ break-even เท่านั้น ยังไม่รวมราคาขายจริง ความชื้น เกรดสินค้า หักน้ำหนัก หรือค่าใช้จ่ายหลังเก็บเกี่ยว
        </NoticeBox>

        <RecentCalculations records={calculators.recentCalculations.filter((record) => record.category === 'cost_estimate')} />
        <CalculatorBackLink />
      </div>
    </div>
  );
}
