import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import {
  defaultSprayMixInput,
  mixAmountUnitLabels,
  sprayTankSizeOptions,
} from '@/services/agri-calculators/agri-calculator-fixtures';
import { calculateSprayMix, formatAgriNumber } from '@/services/agri-calculators/agri-calculator-service';
import type { MixAmountUnit, SprayMixInput, TankSizeOption } from '@/services/agri-calculators/agri-calculator.types';
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

const amountUnitOptions: Array<{ value: MixAmountUnit; label: string }> = [
  { value: 'cc', label: 'ซีซี (cc)' },
  { value: 'ml', label: 'มิลลิลิตร (ml)' },
  { value: 'gram', label: 'กรัม' },
];

export function SprayMixCalculatorPage() {
  const calculators = useAgriCalculators();
  const [input, setInput] = useState<SprayMixInput>(() => calculators.getLastInput('spray_mix') ?? defaultSprayMixInput);
  const result = useMemo(() => calculateSprayMix(input), [input]);

  const updateInput = (patch: Partial<SprayMixInput>) => {
    setInput((current) => ({
      ...current,
      ...patch,
    }));
  };

  const handleTankSizeChange = (tankSizeOption: TankSizeOption) => {
    updateInput({
      tankSizeOption,
      tankLiters: tankSizeOption === 'custom' ? input.tankLiters : tankSizeOption,
    });
  };

  const resetInput = () => setInput(defaultSprayMixInput);

  return (
    <div>
      <PageHeader title="คำนวณผสมยา" subtitle="คำนวณตามอัตราบนฉลาก" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <CalculatorHero
          category="spray_mix"
          isFavorite={calculators.isFavorite('spray_mix')}
          onToggleFavorite={() => calculators.toggleFavorite('spray_mix')}
        />

        <SafetyNotice>คำนวณจากอัตราที่กรอกเองเท่านั้น ควรอ่านฉลากจริงก่อนใช้ และไม่ควรเพิ่มความเข้มข้นเอง</SafetyNotice>

        <form
          className="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (result.isValid) calculators.calculateAndSave('spray_mix', input);
          }}
        >
          <Card className="p-4">
            <div className="grid gap-4">
              <SelectField<TankSizeOption>
                label="ขนาดถัง"
                onChange={handleTankSizeChange}
                options={sprayTankSizeOptions.map((option) => ({ value: option.value, label: option.label }))}
                value={input.tankSizeOption}
              />
              <NumberField
                hint="เลือกกำหนดเองเมื่อต้องการกรอกถังขนาดอื่น"
                label="น้ำในถัง"
                onChange={(tankLiters) => updateInput({ tankLiters, tankSizeOption: 'custom' })}
                step={1}
                suffix="ลิตร"
                value={input.tankLiters}
              />
              <NumberField
                label="ปริมาณยา/สารตามฉลาก"
                onChange={(dosageAmount) => updateInput({ dosageAmount })}
                suffix={mixAmountUnitLabels[input.dosageUnit]}
                value={input.dosageAmount}
              />
              <SelectField<MixAmountUnit>
                label="หน่วยยา/สาร"
                onChange={(dosageUnit) => updateInput({ dosageUnit })}
                options={amountUnitOptions}
                value={input.dosageUnit}
              />
              <NumberField
                hint="เช่น ฉลากเขียน 20 ซีซี ต่อน้ำ 20 ลิตร"
                label="น้ำอ้างอิงบนฉลาก"
                onChange={(dosageWaterLiters) => updateInput({ dosageWaterLiters })}
                step={1}
                suffix="ลิตร"
                value={input.dosageWaterLiters}
              />
              <CalculatorSubmitButton>คำนวณและบันทึกในเครื่อง</CalculatorSubmitButton>
              <CalculatorResetButton onReset={resetInput} />
            </div>
          </Card>
        </form>

        <Card className="p-5">
          <h2 className="text-lg font-extrabold text-kaset-ink">ผลคำนวณ</h2>
          <div className="mt-3 grid gap-3">
            <ResultMetric featured label="ต้องใช้ยา/สาร" tone="rose" value={result.requiredAmountLabel} />
            <ResultMetric label="ความเข้มข้นต่อ 1 ลิตร" tone={result.isConcentrationHigh ? 'rose' : 'green'} value={result.concentrationLabel} />
            <ResultMetric label="ขนาดถังที่ใช้คิด" tone="sky" value={`${formatAgriNumber(result.tankLiters, 0)} ลิตร`} />
          </div>
        </Card>

        <WarningList isValid={result.isValid} warnings={result.warnings} />

        <CalculatorShareActions category="spray_mix" input={input} result={result} />

        <NoticeBox tone="info" title="บันทึกแบบ local-only">
          เมื่อกดคำนวณ ระบบจะเก็บประวัติและค่าล่าสุดไว้ใน localStorage ของเครื่องนี้เท่านั้น ไม่มีการส่งข้อมูลไป Supabase หรือบริการภายนอก
        </NoticeBox>

        <RecentCalculations records={calculators.recentCalculations.filter((record) => record.category === 'spray_mix')} />
        <CalculatorBackLink />
      </div>
    </div>
  );
}
