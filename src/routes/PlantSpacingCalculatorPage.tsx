import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { defaultPlantSpacingInput, thaiAreaUnitLabels } from '@/services/agri-calculators/agri-calculator-fixtures';
import { calculatePlantSpacing, formatAgriNumber } from '@/services/agri-calculators/agri-calculator-service';
import type { PlantSpacingInput, ThaiAreaUnit } from '@/services/agri-calculators/agri-calculator.types';
import { useAgriCalculators } from '@/hooks/useAgriCalculators';
import {
  CalculatorBackLink,
  CalculatorHero,
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

export function PlantSpacingCalculatorPage() {
  const calculators = useAgriCalculators();
  const [input, setInput] = useState<PlantSpacingInput>(() => calculators.getLastInput('plant_spacing') ?? defaultPlantSpacingInput);
  const result = useMemo(() => calculatePlantSpacing(input), [input]);

  const updateInput = (patch: Partial<PlantSpacingInput>) => {
    setInput((current) => ({
      ...current,
      ...patch,
    }));
  };

  return (
    <div>
      <PageHeader title="คำนวณระยะปลูก" subtitle="ประมาณจำนวนต้นและต้นกล้า" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <CalculatorHero
          category="plant_spacing"
          isFavorite={calculators.isFavorite('plant_spacing')}
          onToggleFavorite={() => calculators.toggleFavorite('plant_spacing')}
        />

        <SafetyNotice>ตัวเลขเป็นการประมาณจากพื้นที่และระยะปลูกจริง ต้องเผื่อคันนา ทางเดิน ระบบน้ำ และความงอกของเมล็ดด้วย</SafetyNotice>

        <form
          className="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            calculators.calculateAndSave('plant_spacing', input);
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
              <NumberField
                label="ระยะห่างระหว่างแถว"
                onChange={(rowSpacingCm) => updateInput({ rowSpacingCm })}
                step={1}
                suffix="ซม."
                value={input.rowSpacingCm}
              />
              <NumberField
                label="ระยะห่างระหว่างต้น"
                onChange={(plantSpacingCm) => updateInput({ plantSpacingCm })}
                step={1}
                suffix="ซม."
                value={input.plantSpacingCm}
              />
              <NumberField
                hint="หักทางเดิน คันนา คลองน้ำ หรือพื้นที่ที่ปลูกไม่ได้"
                label="พื้นที่ใช้ปลูกจริง"
                onChange={(usableAreaPercent) => updateInput({ usableAreaPercent })}
                step={1}
                suffix="%"
                value={input.usableAreaPercent}
              />
              <NumberField
                hint="เผื่อต้นกล้าเสียหายหรือปลูกซ่อม"
                label="เผื่อต้นกล้าเพิ่ม"
                onChange={(seedlingBufferPercent) => updateInput({ seedlingBufferPercent })}
                step={1}
                suffix="%"
                value={input.seedlingBufferPercent}
              />
              <CalculatorSubmitButton>คำนวณและบันทึกในเครื่อง</CalculatorSubmitButton>
            </div>
          </Card>
        </form>

        <Card className="p-4">
          <h2 className="text-lg font-extrabold text-kaset-ink">ผลคำนวณ</h2>
          <div className="mt-3 grid gap-3">
            <ResultMetric label="จำนวนต้นประมาณ" value={`${formatAgriNumber(result.estimatedPlantCount, 0)} ต้น`} />
            <ResultMetric label="ต้นกล้าที่ควรเตรียม" tone="gold" value={`${formatAgriNumber(result.estimatedSeedlingCount, 0)} ต้น`} />
            <ResultMetric label="จำนวนต้นต่อไร่" tone="sky" value={`${formatAgriNumber(result.plantsPerRai, 0)} ต้น/ไร่`} />
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-extrabold text-kaset-ink">แปลงหน่วยพื้นที่</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <ResultMetric label="ไร่" value={result.areaLabels.rai} />
            <ResultMetric label="งาน" tone="sky" value={result.areaLabels.ngan} />
            <ResultMetric label="ตารางวา" tone="gold" value={result.areaLabels.squareWa} />
            <ResultMetric label="ตารางเมตร" tone="rose" value={result.areaLabels.squareMeters} />
          </div>
        </Card>

        <WarningList warnings={result.warnings} />

        <NoticeBox tone="info" title="สูตรที่ใช้">
          พื้นที่ต่อต้น = ระยะแถว x ระยะต้น จากนั้นหารพื้นที่ใช้ปลูกจริง ผลลัพธ์เป็นเลขประมาณสำหรับช่วยวางแผนเท่านั้น
        </NoticeBox>

        <RecentCalculations records={calculators.recentCalculations.filter((record) => record.category === 'plant_spacing')} />
        <CalculatorBackLink />
      </div>
    </div>
  );
}
