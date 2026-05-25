import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { defaultYieldEstimateInput, thaiAreaUnitLabels } from '@/services/agri-calculators/agri-calculator-fixtures';
import { calculateYieldEstimate, formatAgriNumber } from '@/services/agri-calculators/agri-calculator-service';
import type { ThaiAreaUnit, YieldEstimateInput } from '@/services/agri-calculators/agri-calculator.types';
import { getCropCalculatorProfile } from '@/services/agri-calculators/crop-calculator-profiles';
import type { CropCalculatorKey } from '@/services/agri-calculators/crop-calculator-profile.types';
import { useAgriCalculators } from '@/hooks/useAgriCalculators';
import {
  CalculatorBackLink,
  CalculatorHero,
  CalculatorResetButton,
  CalculatorShareActions,
  CalculatorSubmitButton,
  CropProfilePicker,
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

export function YieldEstimateCalculatorPage() {
  const calculators = useAgriCalculators();
  const [input, setInput] = useState<YieldEstimateInput>(() => calculators.getLastInput('yield_estimate') ?? defaultYieldEstimateInput);
  const [selectedCropKey, setSelectedCropKey] = useState<CropCalculatorKey>('rice');
  const result = useMemo(() => calculateYieldEstimate(input), [input]);
  const selectedCropProfile = getCropCalculatorProfile(selectedCropKey);

  const updateInput = (patch: Partial<YieldEstimateInput>) => {
    setInput((current) => ({
      ...current,
      ...patch,
    }));
  };

  const resetInput = () => setInput(defaultYieldEstimateInput);

  const applyCropExample = () => {
    const yieldExample = selectedCropProfile.yieldEstimateInputExamples[0];

    updateInput({
      landSizeValue: yieldExample.landSizeValue,
      landSizeUnit: yieldExample.landSizeUnit,
      sampleCount: yieldExample.sampleCount,
      averageWeightKg: yieldExample.averageWeightKg,
      estimatedTotalUnits: yieldExample.estimatedTotalUnits,
    });
  };

  return (
    <div>
      <PageHeader title="คำนวณผลผลิต" subtitle="ประมาณกิโลกรัม ตัน และต่อไร่" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <CalculatorHero
          category="yield_estimate"
          isFavorite={calculators.isFavorite('yield_estimate')}
          onToggleFavorite={() => calculators.toggleFavorite('yield_estimate')}
        />

        <SafetyNotice>ผลผลิตจริงขึ้นกับพันธุ์พืช สภาพอากาศ โรค แมลง น้ำ และการจัดการแปลง ตัวเลขนี้ใช้ช่วยวางแผนเท่านั้น</SafetyNotice>

        <CropProfilePicker selectedCropKey={selectedCropKey} onChange={setSelectedCropKey} onUseExample={applyCropExample}>
          <div className="grid gap-2">
            {selectedCropProfile.yieldEstimateInputExamples.map((example) => (
              <div className="rounded-lg bg-white p-3 ring-1 ring-kaset-deep/10" key={example.id}>
                <p className="text-sm font-extrabold text-kaset-ink">{example.label}</p>
                <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
                  {formatAgriNumber(example.sampleCount, 0)} ตัวอย่าง · เฉลี่ย {formatAgriNumber(example.averageWeightKg, 2)} กก. · {example.note}
                </p>
              </div>
            ))}
          </div>
        </CropProfilePicker>

        <form
          className="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (result.isValid) calculators.calculateAndSave('yield_estimate', input);
          }}
        >
          <Card className="p-4">
            <div className="grid gap-4">
              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_132px]">
                <NumberField label="ขนาดพื้นที่" onChange={(landSizeValue) => updateInput({ landSizeValue })} value={input.landSizeValue} />
                <SelectField<ThaiAreaUnit>
                  label="หน่วย"
                  onChange={(landSizeUnit) => updateInput({ landSizeUnit })}
                  options={areaUnitOptions}
                  value={input.landSizeUnit}
                />
              </div>
              <NumberField
                hint="จำนวนผล/กอ/ต้น/หน่วยที่นำมาชั่งตัวอย่าง"
                label="จำนวนตัวอย่าง"
                onChange={(sampleCount) => updateInput({ sampleCount })}
                step={1}
                suffix="หน่วย"
                value={input.sampleCount}
              />
              <NumberField
                hint="น้ำหนักเฉลี่ยต่อหนึ่งหน่วยตัวอย่าง"
                label="น้ำหนักเฉลี่ย"
                onChange={(averageWeightKg) => updateInput({ averageWeightKg })}
                suffix="กก."
                value={input.averageWeightKg}
              />
              <NumberField
                hint="จำนวนหน่วยผลผลิตทั้งหมดที่คาดว่าจะเก็บเกี่ยว"
                label="จำนวนรวมที่คาดไว้"
                onChange={(estimatedTotalUnits) => updateInput({ estimatedTotalUnits })}
                step={1}
                suffix="หน่วย"
                value={input.estimatedTotalUnits}
              />
              <CalculatorSubmitButton>คำนวณและบันทึกในเครื่อง</CalculatorSubmitButton>
              <CalculatorResetButton onReset={resetInput} />
            </div>
          </Card>
        </form>

        <Card className="p-5">
          <h2 className="text-lg font-extrabold text-kaset-ink">ผลคำนวณ</h2>
          <div className="mt-3 grid gap-3">
            <ResultMetric label="น้ำหนักตัวอย่างรวม" tone="sky" value={`${formatAgriNumber(result.sampleTotalKg, 2)} กก.`} />
            <ResultMetric featured label="ผลผลิตรวมประมาณ" value={`${formatAgriNumber(result.estimatedTotalKg, 2)} กก.`} />
            <ResultMetric label="เทียบเป็นตัน" tone="gold" value={`${formatAgriNumber(result.estimatedTotalTon, 3)} ตัน`} />
            <ResultMetric label="ผลผลิตต่อไร่" tone="rose" value={`${formatAgriNumber(result.yieldPerRaiKg, 2)} กก./ไร่`} />
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-extrabold text-kaset-ink">พื้นที่ที่ใช้คิด</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <ResultMetric label="ไร่" value={result.areaLabels.rai} />
            <ResultMetric label="ตารางเมตร" tone="sky" value={result.areaLabels.squareMeters} />
          </div>
        </Card>

        <WarningList isValid={result.isValid} warnings={result.warnings} />

        <CalculatorShareActions category="yield_estimate" input={input} result={result} />

        <NoticeBox tone="info" title="หมายเหตุการสุ่มตัวอย่าง">
          ควรชั่งตัวอย่างจากหลายจุดในแปลงและจดช่วงเวลาเก็บเกี่ยวจริง เพื่อให้ตัวเลขใกล้เคียงกว่าเดิม
        </NoticeBox>

        <RecentCalculations records={calculators.recentCalculations.filter((record) => record.category === 'yield_estimate')} />
        <CalculatorBackLink />
      </div>
    </div>
  );
}
