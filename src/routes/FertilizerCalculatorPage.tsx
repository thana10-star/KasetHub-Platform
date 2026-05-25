import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { NoticeBox } from '@/components/ui/NoticeBox';
import {
  defaultFertilizerMixInput,
  fertilizerProfiles,
  thaiAreaUnitLabels,
} from '@/services/agri-calculators/agri-calculator-fixtures';
import { calculateFertilizerMix, formatAgriNumber } from '@/services/agri-calculators/agri-calculator-service';
import { getCropCalculatorProfile } from '@/services/agri-calculators/crop-calculator-profiles';
import type {
  FertilizerBaseNutrient,
  FertilizerMixInput,
  FertilizerProfile,
  NutrientKey,
  ThaiAreaUnit,
} from '@/services/agri-calculators/agri-calculator.types';
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

const baseNutrientOptions: Array<{ value: FertilizerBaseNutrient; label: string }> = [
  { value: 'auto', label: 'เลือกให้อัตโนมัติ' },
  { value: 'nitrogen', label: 'คำนวณจาก N' },
  { value: 'phosphorus', label: 'คำนวณจาก P' },
  { value: 'potassium', label: 'คำนวณจาก K' },
];

const nutrientLabels: Record<NutrientKey, string> = {
  nitrogen: 'N',
  phosphorus: 'P',
  potassium: 'K',
};

type CropStageOption = 'start' | 'growth' | 'flowering' | 'yielding';
type FertilizerApplicationMethod = 'broadcast' | 'drip' | 'water_mix';

const cropStageOptions: Array<{ value: CropStageOption; label: string }> = [
  { value: 'start', label: 'เริ่มปลูก/ตั้งตัว' },
  { value: 'growth', label: 'ระยะเจริญเติบโต' },
  { value: 'flowering', label: 'ก่อนออกดอก/สะสมอาหาร' },
  { value: 'yielding', label: 'ระยะให้ผลผลิต' },
];

const fertilizerMethodOptions: Array<{ value: FertilizerApplicationMethod; label: string }> = [
  { value: 'broadcast', label: 'หว่าน/โรย' },
  { value: 'drip', label: 'ผ่านน้ำหยด' },
  { value: 'water_mix', label: 'ผสมน้ำรด' },
];

function applyProfile(profile: FertilizerProfile): Partial<FertilizerMixInput> {
  return {
    fertilizerNPercent: profile.nPercent,
    fertilizerPPercent: profile.pPercent,
    fertilizerKPercent: profile.kPercent,
  };
}

export function FertilizerCalculatorPage() {
  const calculators = useAgriCalculators();
  const [input, setInput] = useState<FertilizerMixInput>(() => calculators.getLastInput('fertilizer_mix') ?? defaultFertilizerMixInput);
  const [profileId, setProfileId] = useState(fertilizerProfiles[0].id);
  const [selectedCropKey, setSelectedCropKey] = useState<CropCalculatorKey>('maize');
  const [cropStage, setCropStage] = useState<CropStageOption>('growth');
  const [fertilizerMethod, setFertilizerMethod] = useState<FertilizerApplicationMethod>('broadcast');
  const result = useMemo(() => calculateFertilizerMix(input), [input]);
  const selectedProfile = fertilizerProfiles.find((profile) => profile.id === profileId) ?? fertilizerProfiles[0];
  const selectedCropProfile = getCropCalculatorProfile(selectedCropKey);
  const selectedCropStageLabel = cropStageOptions.find((option) => option.value === cropStage)?.label ?? cropStageOptions[0].label;
  const selectedFertilizerMethodLabel =
    fertilizerMethodOptions.find((option) => option.value === fertilizerMethod)?.label ?? fertilizerMethodOptions[0].label;

  const updateInput = (patch: Partial<FertilizerMixInput>) => {
    setInput((current) => ({
      ...current,
      ...patch,
    }));
  };

  const resetInput = () => {
    setProfileId(fertilizerProfiles[0].id);
    setCropStage('growth');
    setFertilizerMethod('broadcast');
    setInput(defaultFertilizerMixInput);
  };

  const applyCropExample = () => {
    const areaExample = selectedCropProfile.commonUnitExamples[0];

    updateInput({
      areaValue: areaExample.areaValue,
      areaUnit: areaExample.areaUnit,
      baseNutrient: 'auto',
    });
  };

  return (
    <div>
      <PageHeader title="คำนวณปุ๋ย/การให้ปุ๋ย" subtitle="วางแผนปุ๋ยต่อไร่ หว่าน/โรย หรือผ่านน้ำหยด" showBack />
      <div className="grid gap-5 px-5 pb-6">
        <CalculatorHero
          category="fertilizer_mix"
          isFavorite={calculators.isFavorite('fertilizer_mix')}
          onToggleFavorite={() => calculators.toggleFavorite('fertilizer_mix')}
        />

        <SafetyNotice>ผลลัพธ์เป็นค่าประมาณจากข้อมูลที่กรอกเอง ยังไม่ใช่อัตราแนะนำตามพืช ควรตรวจดิน อายุพืช สภาพพื้นที่ และคำแนะนำเจ้าหน้าที่ก่อนใช้งานจริง</SafetyNotice>

        <CropProfilePicker selectedCropKey={selectedCropKey} onChange={setSelectedCropKey} onUseExample={applyCropExample}>
          <div className="grid gap-2">
            <div className="rounded-lg bg-white p-3 ring-1 ring-kaset-deep/10">
              <p className="text-sm font-extrabold text-kaset-ink">ใช้ช่วยวางแผนจากค่าที่คุณกรอก</p>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
                ใช้ตัวอย่างพื้นที่ของ {selectedCropProfile.thaiDisplayName} เท่านั้น ไม่เปลี่ยนเป้าหมาย NPK และไม่แนะนำอัตราปุ๋ยเฉพาะพืช
              </p>
            </div>
            {selectedCropProfile.safetyDisclaimerNotes.map((note) => (
              <p className="rounded-lg bg-amber-50 p-3 text-xs font-bold leading-5 text-amber-950" key={note}>
                {note}
              </p>
            ))}
          </div>
        </CropProfilePicker>

        <form
          className="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (result.isValid) calculators.calculateAndSave('fertilizer_mix', input);
          }}
        >
          <Card className="p-4">
            <div className="grid gap-4">
              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_132px]">
                <NumberField label="ขนาดพื้นที่" onChange={(areaValue) => updateInput({ areaValue })} value={input.areaValue} />
                <SelectField<ThaiAreaUnit>
                  label="หน่วย"
                  onChange={(areaUnit) => updateInput({ areaUnit })}
                  options={areaUnitOptions}
                  value={input.areaUnit}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <SelectField<CropStageOption>
                  label="อายุพืช / ระยะพืช"
                  onChange={setCropStage}
                  options={cropStageOptions}
                  value={cropStage}
                />
                <SelectField<FertilizerApplicationMethod>
                  label="วิธีให้ปุ๋ย"
                  onChange={setFertilizerMethod}
                  options={fertilizerMethodOptions}
                  value={fertilizerMethod}
                />
              </div>
              <SelectField<string>
                label="สูตรปุ๋ยตัวอย่าง"
                onChange={(nextProfileId) => {
                  const profile = fertilizerProfiles.find((item) => item.id === nextProfileId) ?? fertilizerProfiles[0];
                  setProfileId(nextProfileId);
                  updateInput(applyProfile(profile));
                }}
                options={fertilizerProfiles.map((profile) => ({ value: profile.id, label: profile.label }))}
                value={profileId}
              />
              <p className="rounded-lg bg-kaset-mist p-3 text-sm leading-6 text-slate-600">{selectedProfile.note}</p>
              <div className="grid gap-3 sm:grid-cols-3" data-testid="fertilizer-npk-grid">
                <NumberField label="N" onChange={(fertilizerNPercent) => updateInput({ fertilizerNPercent })} step={1} suffix="%" value={input.fertilizerNPercent} />
                <NumberField label="P" onChange={(fertilizerPPercent) => updateInput({ fertilizerPPercent })} step={1} suffix="%" value={input.fertilizerPPercent} />
                <NumberField label="K" onChange={(fertilizerKPercent) => updateInput({ fertilizerKPercent })} step={1} suffix="%" value={input.fertilizerKPercent} />
              </div>
              <div className="grid gap-3">
                <h2 className="font-extrabold text-kaset-ink">เป้าหมายธาตุอาหารต่อไร่</h2>
                <NumberField label="N ต่อไร่" onChange={(targetNitrogenKgPerRai) => updateInput({ targetNitrogenKgPerRai })} suffix="กก./ไร่" value={input.targetNitrogenKgPerRai} />
                <NumberField label="P ต่อไร่" onChange={(targetPhosphorusKgPerRai) => updateInput({ targetPhosphorusKgPerRai })} suffix="กก./ไร่" value={input.targetPhosphorusKgPerRai} />
                <NumberField label="K ต่อไร่" onChange={(targetPotassiumKgPerRai) => updateInput({ targetPotassiumKgPerRai })} suffix="กก./ไร่" value={input.targetPotassiumKgPerRai} />
              </div>
              <SelectField<FertilizerBaseNutrient>
                label="ใช้ธาตุใดเป็นฐานคำนวณ"
                onChange={(baseNutrient) => updateInput({ baseNutrient })}
                options={baseNutrientOptions}
                value={input.baseNutrient}
              />
              <CalculatorSubmitButton>คำนวณและบันทึกในเครื่อง</CalculatorSubmitButton>
              <CalculatorResetButton onReset={resetInput} />
            </div>
          </Card>
        </form>

        <Card className="p-5">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-extrabold text-kaset-ink">ผลคำนวณ</h2>
            <Badge tone="gold">เบื้องต้น</Badge>
          </div>
          <div className="mt-3 grid gap-3">
            <ResultMetric featured label="ปริมาณปุ๋ยประมาณ" value={result.estimatedFertilizerLabel} />
            <ResultMetric label="เทียบกระสอบ 50 กก." tone="gold" value={result.estimatedBags50KgLabel} />
            <ResultMetric
              label="ฐานคำนวณ"
              tone="sky"
              value={result.limitingNutrient === 'auto' ? 'ยังเลือกไม่ได้' : nutrientLabels[result.limitingNutrient]}
            />
          </div>
        </Card>

        <Card className="p-4" data-testid="fertigation-planning-context">
          <h2 className="text-lg font-extrabold text-kaset-ink">แผนการให้ปุ๋ย</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-kaset-mist p-3">
              <p className="text-xs font-bold leading-5 text-slate-600">ระยะพืชที่เลือก</p>
              <p className="mt-1 font-extrabold text-kaset-ink">{selectedCropStageLabel}</p>
            </div>
            <div className="rounded-lg bg-kaset-mist p-3">
              <p className="text-xs font-bold leading-5 text-slate-600">วิธีให้ปุ๋ยที่เลือก</p>
              <p className="mt-1 font-extrabold text-kaset-ink">{selectedFertilizerMethodLabel}</p>
            </div>
          </div>
          <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm font-bold leading-6 text-amber-950">
            ตัวเลขยังคำนวณจากเป้าหมายต่อไร่ที่คุณกรอกเอง ถ้าให้ผ่านน้ำหยด ให้ตรวจความเข้ากันได้ของปุ๋ย ความเข้มข้น และระบบกรองก่อนใช้งานจริง
          </p>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-extrabold text-kaset-ink">ธาตุอาหารรวมโดยประมาณ</h2>
          <div className="mt-3 grid gap-3">
            {(['nitrogen', 'phosphorus', 'potassium'] as NutrientKey[]).map((nutrient) => (
              <div className="rounded-lg bg-kaset-mist p-3" key={nutrient}>
                <p className="font-extrabold text-kaset-ink">{nutrientLabels[nutrient]}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  เป้าหมาย {formatAgriNumber(result.targetTotalKg[nutrient], 2)} กก. · คำนวณได้ {formatAgriNumber(result.suppliedTotalKg[nutrient], 2)} กก.
                </p>
              </div>
            ))}
          </div>
        </Card>

        <WarningList isValid={result.isValid} warnings={result.warnings} />

        <CalculatorShareActions category="fertilizer_mix" input={input} result={result} />

        <NoticeBox tone="warning" title="ขอบเขตของหน้านี้">
          หน้านี้ไม่แนะนำอัตราปุ๋ยเฉพาะแปลงตามชนิดดิน อายุพืช หรือฤดูกาล และไม่เลือกสินค้าแทนผู้ใช้
        </NoticeBox>

        <RecentCalculations records={calculators.recentCalculations.filter((record) => record.category === 'fertilizer_mix')} />
        <CalculatorBackLink />
      </div>
    </div>
  );
}
