import type {
  CropCycleStatus,
  FarmActivityType,
  FarmExpenseCategory,
  FarmFinanceCategory,
  FarmFinanceDirection,
  FarmHarvestQuantityUnit,
  FarmIncomeCategory,
} from '@/services/farm-records/farm-records.types';

export type FarmConfigLabel = {
  en: string;
  th: string;
};

export type FarmActivityTypeConfig = {
  id: FarmActivityType;
  label: FarmConfigLabel;
};

export type FarmFinanceCategoryConfig = {
  id: FarmFinanceCategory;
  direction: FarmFinanceDirection;
  label: FarmConfigLabel;
};

export type FarmUnitConfig = {
  id: string;
  label: FarmConfigLabel;
  category: 'input' | 'labor' | 'yield' | 'money' | 'area' | 'other';
};

export type FarmHarvestQuantityUnitConfig = {
  id: FarmHarvestQuantityUnit;
  label: FarmConfigLabel;
  normalizesToKg: boolean;
};

export type CropCycleStatusConfig = {
  id: CropCycleStatus;
  label: FarmConfigLabel;
};

export const farmActivityTypes: FarmActivityTypeConfig[] = [
  { id: 'planting', label: { en: 'Planting', th: 'ปลูก' } },
  { id: 'fertilizing', label: { en: 'Fertilizing', th: 'ใส่ปุ๋ย' } },
  { id: 'spraying', label: { en: 'Spraying', th: 'พ่นสาร' } },
  { id: 'watering', label: { en: 'Watering', th: 'ให้น้ำ' } },
  { id: 'harvesting', label: { en: 'Harvesting', th: 'เก็บเกี่ยว' } },
  { id: 'labor', label: { en: 'Labor', th: 'แรงงาน' } },
  { id: 'machinery', label: { en: 'Machinery', th: 'เครื่องจักร' } },
  { id: 'pest_disease', label: { en: 'Pest or disease', th: 'ศัตรูพืช/โรคพืช' } },
  { id: 'weather_note', label: { en: 'Weather note', th: 'บันทึกอากาศ' } },
  { id: 'soil_care', label: { en: 'Soil care', th: 'ดูแลดิน' } },
  { id: 'other', label: { en: 'Other', th: 'อื่น ๆ' } },
];

export const cropCycleStatuses: CropCycleStatusConfig[] = [
  { id: 'planned', label: { en: 'Planned', th: 'วางแผน' } },
  { id: 'active', label: { en: 'Active', th: 'กำลังปลูก' } },
  { id: 'harvested', label: { en: 'Harvested', th: 'เก็บเกี่ยวแล้ว' } },
  { id: 'cancelled', label: { en: 'Cancelled', th: 'ยกเลิก' } },
];

export const farmExpenseCategories: FarmFinanceCategoryConfig[] = [
  { id: 'seed', direction: 'expense', label: { en: 'Seed', th: 'เมล็ดพันธุ์' } },
  { id: 'fertilizer', direction: 'expense', label: { en: 'Fertilizer', th: 'ปุ๋ย' } },
  { id: 'pesticide', direction: 'expense', label: { en: 'Pesticide', th: 'สารกำจัดแมลง' } },
  { id: 'herbicide', direction: 'expense', label: { en: 'Herbicide', th: 'สารกำจัดวัชพืช' } },
  { id: 'labor', direction: 'expense', label: { en: 'Labor', th: 'ค่าแรง' } },
  { id: 'machinery', direction: 'expense', label: { en: 'Machinery', th: 'เครื่องจักร' } },
  { id: 'fuel', direction: 'expense', label: { en: 'Fuel', th: 'น้ำมัน' } },
  { id: 'water', direction: 'expense', label: { en: 'Water', th: 'ค่าน้ำ' } },
  { id: 'electricity', direction: 'expense', label: { en: 'Electricity', th: 'ค่าไฟ' } },
  { id: 'rent', direction: 'expense', label: { en: 'Rent', th: 'ค่าเช่า' } },
  { id: 'transport', direction: 'expense', label: { en: 'Transport', th: 'ขนส่ง' } },
  { id: 'packaging', direction: 'expense', label: { en: 'Packaging', th: 'บรรจุภัณฑ์' } },
  { id: 'maintenance', direction: 'expense', label: { en: 'Maintenance', th: 'ซ่อมบำรุง' } },
  { id: 'loan_interest', direction: 'expense', label: { en: 'Loan interest', th: 'ดอกเบี้ยเงินกู้' } },
  { id: 'other_expense', direction: 'expense', label: { en: 'Other expense', th: 'ค่าใช้จ่ายอื่น' } },
];

export const farmIncomeCategories: FarmFinanceCategoryConfig[] = [
  { id: 'crop_sale', direction: 'income', label: { en: 'Crop sale', th: 'ขายผลผลิต' } },
  { id: 'byproduct_sale', direction: 'income', label: { en: 'Byproduct sale', th: 'ขายผลพลอยได้' } },
  { id: 'subsidy', direction: 'income', label: { en: 'Subsidy', th: 'เงินสนับสนุน' } },
  { id: 'service_income', direction: 'income', label: { en: 'Service income', th: 'รายได้บริการ' } },
  { id: 'other_income', direction: 'income', label: { en: 'Other income', th: 'รายได้อื่น' } },
];

export const farmFinanceCategories = [...farmExpenseCategories, ...farmIncomeCategories];

export const farmFinanceCategoryLabels = farmFinanceCategories.reduce(
  (labels, category) => ({
    ...labels,
    [category.id]: category.label,
  }),
  {} as Record<FarmFinanceCategory, FarmConfigLabel>,
);

export const allowedFarmRecordUnits: FarmUnitConfig[] = [
  { id: 'kg', label: { en: 'Kilogram', th: 'กิโลกรัม' }, category: 'input' },
  { id: 'g', label: { en: 'Gram', th: 'กรัม' }, category: 'input' },
  { id: 'liter', label: { en: 'Liter', th: 'ลิตร' }, category: 'input' },
  { id: 'ml', label: { en: 'Milliliter', th: 'มิลลิลิตร' }, category: 'input' },
  { id: 'bag', label: { en: 'Bag', th: 'กระสอบ' }, category: 'input' },
  { id: 'sack', label: { en: 'Sack', th: 'ถุง' }, category: 'input' },
  { id: 'tree', label: { en: 'Tree', th: 'ต้น' }, category: 'yield' },
  { id: 'plot', label: { en: 'Plot', th: 'แปลง' }, category: 'area' },
  { id: 'rai', label: { en: 'Rai', th: 'ไร่' }, category: 'area' },
  { id: 'hour', label: { en: 'Hour', th: 'ชั่วโมง' }, category: 'labor' },
  { id: 'day', label: { en: 'Day', th: 'วัน' }, category: 'labor' },
  { id: 'person', label: { en: 'Person', th: 'คน' }, category: 'labor' },
  { id: 'kg_yield', label: { en: 'Yield kg', th: 'กก. ผลผลิต' }, category: 'yield' },
  { id: 'ton', label: { en: 'Ton', th: 'ตัน' }, category: 'yield' },
  { id: 'thb', label: { en: 'Thai baht', th: 'บาท' }, category: 'money' },
  { id: 'other', label: { en: 'Other', th: 'อื่น ๆ' }, category: 'other' },
];

export const farmHarvestQuantityUnits: FarmHarvestQuantityUnitConfig[] = [
  { id: 'kg', label: { en: 'Kilogram', th: 'Kilogram' }, normalizesToKg: true },
  { id: 'ton', label: { en: 'Ton', th: 'Ton' }, normalizesToKg: true },
  { id: 'sack', label: { en: 'Sack', th: 'Sack' }, normalizesToKg: false },
  { id: 'basket', label: { en: 'Basket', th: 'Basket' }, normalizesToKg: false },
  { id: 'other', label: { en: 'Other', th: 'Other' }, normalizesToKg: false },
];

export const farmActivityTypeIds = farmActivityTypes.map((item) => item.id);
export const cropCycleStatusIds = cropCycleStatuses.map((item) => item.id);
export const farmExpenseCategoryIds = farmExpenseCategories.map((item) => item.id as FarmExpenseCategory);
export const farmIncomeCategoryIds = farmIncomeCategories.map((item) => item.id as FarmIncomeCategory);
export const farmFinanceCategoryIds = farmFinanceCategories.map((item) => item.id);
export const farmHarvestQuantityUnitIds = farmHarvestQuantityUnits.map((item) => item.id);
