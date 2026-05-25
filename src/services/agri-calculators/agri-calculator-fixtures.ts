import type {
  CalculatorCard,
  CalculatorCategory,
  FertilizerMixInput,
  FertilizerProfile,
  PlantSpacingInput,
  SprayMixInput,
  CostEstimateInput,
  YieldEstimateInput,
  MixAmountUnit,
  TankSizeOption,
  ThaiAreaUnit,
} from '@/services/agri-calculators/agri-calculator.types';

export const agriCalculatorStorageKey = 'kasethub.agriCalculators.v1';
export const agriCalculatorChangedEvent = 'kasethub:agri-calculators-changed';

export const calculatorLocalOnlyDisclaimer =
  'ข้อมูลที่บันทึกไว้จะอยู่ในเครื่องนี้ ผลลัพธ์เป็นการคำนวณเบื้องต้นและไม่รับประกันผลในแปลงจริง';

export const agricultureSafetyDisclaimer =
  'ผลลัพธ์เป็นการคำนวณเบื้องต้น ไม่ใช่คำแนะนำจากนักวิชาการเกษตร และไม่รับประกันผลลัพธ์ในแปลงจริง';

export const sprayMixSafetyDisclaimer =
  'คำนวณตามอัตราที่ผู้ใช้กรอกจากฉลากเท่านั้น ควรอ่านฉลากจริงก่อนใช้ และปฏิบัติตามกฎหมาย/คำเตือนของผลิตภัณฑ์';

export const fertilizerFoundationDisclaimer =
  'ใช้ช่วยวางแผนปุ๋ยจากสูตรและอัตราที่ผู้ใช้กรอกเอง รวมถึงการหว่าน/โรยหรือให้ผ่านน้ำหยด ยังไม่ใช่คำแนะนำการใส่ปุ๋ยจริง';

export const thaiAreaUnitLabels: Record<ThaiAreaUnit, { label: string; shortLabel: string }> = {
  rai: { label: 'ไร่', shortLabel: 'ไร่' },
  ngan: { label: 'งาน', shortLabel: 'งาน' },
  square_wa: { label: 'ตารางวา', shortLabel: 'ตร.วา' },
  square_meter: { label: 'ตารางเมตร', shortLabel: 'ตร.ม.' },
};

export const mixAmountUnitLabels: Record<MixAmountUnit, string> = {
  cc: 'ซีซี',
  ml: 'มล.',
  gram: 'กรัม',
};

export const sprayTankSizeOptions: Array<{ value: TankSizeOption; label: string; liters?: number }> = [
  { value: 10, label: 'ถัง 10 ลิตร', liters: 10 },
  { value: 15, label: 'ถัง 15 ลิตร', liters: 15 },
  { value: 20, label: 'ถัง 20 ลิตร', liters: 20 },
  { value: 200, label: 'ถัง 200 ลิตร', liters: 200 },
  { value: 'custom', label: 'กำหนดเอง' },
];

export const fertilizerProfiles: FertilizerProfile[] = [
  {
    id: 'balanced-15-15-15',
    label: '15-15-15 เสมอ',
    nPercent: 15,
    pPercent: 15,
    kPercent: 15,
    note: 'สูตรเสมอตัวอย่าง ใช้เพื่อคำนวณปริมาณจากเปอร์เซ็นต์ธาตุอาหารเท่านั้น',
  },
  {
    id: 'rice-16-20-0',
    label: '16-20-0',
    nPercent: 16,
    pPercent: 20,
    kPercent: 0,
    note: 'สูตรตัวอย่างที่ไม่มีโพแทสเซียม ต้องระวังเมื่อใช้คำนวณ K',
  },
  {
    id: 'urea-46-0-0',
    label: '46-0-0 ยูเรีย',
    nPercent: 46,
    pPercent: 0,
    kPercent: 0,
    note: 'ใช้คิดไนโตรเจนอย่างเดียว ยังไม่ใช่คำแนะนำการใช้จริง',
  },
  {
    id: 'potassium-0-0-60',
    label: '0-0-60',
    nPercent: 0,
    pPercent: 0,
    kPercent: 60,
    note: 'ใช้คิดโพแทสเซียมอย่างเดียว ยังไม่ใช่คำแนะนำการใช้จริง',
  },
];

export const calculatorCards: CalculatorCard[] = [
  {
    id: 'fertilizer_mix',
    label: 'คำนวณปุ๋ย/การให้ปุ๋ย',
    shortLabel: 'ปุ๋ย/น้ำหยด',
    description: 'วางแผนปุ๋ยต่อไร่ หว่าน/โรย หรือให้ผ่านน้ำหยดจากอัตราที่ผู้ใช้กรอกเอง',
    route: '/app/calculators/fertilizer',
    iconKey: 'fertilizer',
    tone: 'green',
    disclaimer: fertilizerFoundationDisclaimer,
  },
  {
    id: 'plant_spacing',
    label: 'คำนวณระยะปลูก',
    shortLabel: 'ระยะปลูก',
    description: 'แปลงหน่วยที่ดินไทยและประมาณจำนวนต้นกล้า',
    route: '/app/calculators/plant-spacing',
    iconKey: 'spacing',
    tone: 'sky',
    disclaimer: agricultureSafetyDisclaimer,
  },
  {
    id: 'yield_estimate',
    label: 'คำนวณผลผลิต',
    shortLabel: 'ผลผลิต',
    description: 'คำนวณกิโลกรัม ตัน และผลผลิตต่อไร่จากตัวอย่าง',
    route: '/app/calculators/yield-estimate',
    iconKey: 'yield',
    tone: 'gold',
    disclaimer: agricultureSafetyDisclaimer,
  },
  {
    id: 'cost_estimate',
    label: 'คำนวณต้นทุน',
    shortLabel: 'ต้นทุน',
    description: 'รวมค่าใช้จ่ายหลักและดูต้นทุนต่อไร่แบบง่าย',
    route: '/app/calculators/cost',
    iconKey: 'cost',
    tone: 'earth',
    disclaimer: agricultureSafetyDisclaimer,
  },
  {
    id: 'spray_mix',
    label: 'คำนวณตามฉลากยา/สาร',
    shortLabel: 'ตามฉลาก',
    description: 'ช่วยคูณปริมาณจากอัตราบนฉลากที่ผู้ใช้กรอกเอง ไม่แนะนำอัตราใช้ยา',
    route: '/app/calculators/spray-mix',
    iconKey: 'spray',
    tone: 'rose',
    disclaimer: sprayMixSafetyDisclaimer,
  },
];

export const defaultSprayMixInput: SprayMixInput = {
  tankLiters: 20,
  tankSizeOption: 20,
  dosageAmount: 20,
  dosageUnit: 'cc',
  dosageWaterLiters: 20,
};

export const defaultPlantSpacingInput: PlantSpacingInput = {
  landSizeValue: 1,
  landSizeUnit: 'rai',
  rowSpacingCm: 100,
  plantSpacingCm: 50,
  seedlingBufferPercent: 5,
  usableAreaPercent: 90,
};

export const defaultFertilizerMixInput: FertilizerMixInput = {
  areaValue: 1,
  areaUnit: 'rai',
  targetNitrogenKgPerRai: 3,
  targetPhosphorusKgPerRai: 3,
  targetPotassiumKgPerRai: 3,
  fertilizerNPercent: 15,
  fertilizerPPercent: 15,
  fertilizerKPercent: 15,
  baseNutrient: 'auto',
};

export const defaultYieldEstimateInput: YieldEstimateInput = {
  landSizeValue: 1,
  landSizeUnit: 'rai',
  sampleCount: 10,
  averageWeightKg: 0.25,
  estimatedTotalUnits: 1000,
};

export const defaultCostEstimateInput: CostEstimateInput = {
  landSizeValue: 1,
  landSizeUnit: 'rai',
  fertilizerCost: 1200,
  laborCost: 1800,
  waterCost: 300,
  machineryCost: 700,
  otherCost: 500,
  expectedYieldKg: 1000,
};

export const defaultInputs = {
  spray_mix: defaultSprayMixInput,
  fertilizer_mix: defaultFertilizerMixInput,
  plant_spacing: defaultPlantSpacingInput,
  yield_estimate: defaultYieldEstimateInput,
  cost_estimate: defaultCostEstimateInput,
} satisfies Record<CalculatorCategory, unknown>;
