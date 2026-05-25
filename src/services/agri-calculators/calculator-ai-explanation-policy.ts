import type {
  CalculatorAIExplanationAllowedAction,
  CalculatorAIExplanationBlockedAction,
  CalculatorAIExplanationBoundary,
} from '@/services/agri-calculators/calculator-ai-explanation.types';

export const calculatorAIAllowedActions: CalculatorAIExplanationBoundary['allowedActions'] = [
  {
    id: 'explain_inputs',
    label: 'อธิบายข้อมูลที่กรอก',
    description: 'อธิบายว่าแต่ละช่อง input ใช้ในสูตรอย่างไรโดยไม่เปลี่ยนค่า',
  },
  {
    id: 'explain_formulas',
    label: 'อธิบายสูตร',
    description: 'อธิบายสูตร deterministic ที่คำนวณไว้แล้วแบบภาษาง่าย',
  },
  {
    id: 'explain_result_meaning',
    label: 'อธิบายความหมายผลลัพธ์',
    description: 'ช่วยอ่านผลคำนวณ เช่น ปริมาณ ต้นทุนต่อไร่ หรือผลผลิตต่อไร่',
  },
  {
    id: 'suggest_what_to_double_check',
    label: 'แนะนำจุดที่ควรตรวจซ้ำ',
    description: 'บอกข้อมูลที่ควรตรวจจากฉลาก ดิน พื้นที่จริง ราคา หรือผลผลิตจริง',
  },
  {
    id: 'suggest_asking_expert',
    label: 'แนะนำให้ถามผู้เชี่ยวชาญ',
    description: 'ชี้จุดที่ควรถามนักวิชาการเกษตร เจ้าหน้าที่ หรือผู้เชี่ยวชาญ',
  },
  {
    id: 'explain_safety_disclaimer',
    label: 'อธิบายคำเตือน',
    description: 'อธิบายว่าทำไมผลลัพธ์เป็นเพียงการคำนวณเบื้องต้น',
  },
];

export const calculatorAIBlockedActions: CalculatorAIExplanationBoundary['blockedActions'] = [
  {
    id: 'change_deterministic_result',
    label: 'เปลี่ยนผลคำนวณ',
    description: 'AI ห้ามแก้ผลลัพธ์ สูตร หรือค่าที่คำนวณจาก service deterministic',
  },
  {
    id: 'recommend_chemical_products',
    label: 'แนะนำสินค้าเคมี',
    description: 'AI ห้ามแนะนำชื่อยา สารเคมี ฮอร์โมน หรือผลิตภัณฑ์กำจัดศัตรูพืช',
  },
  {
    id: 'recommend_exact_fertilizer_dose_not_in_calculator',
    label: 'แนะนำอัตราปุ๋ยนอกสูตร',
    description: 'AI ห้ามเติม dose ปุ๋ยเฉพาะพืช/ดิน/ฤดูที่ไม่ได้อยู่ในผลคำนวณ',
  },
  {
    id: 'mention_sponsor_product',
    label: 'พูดถึงสินค้า sponsor',
    description: 'AI ห้ามแทรก sponsor, affiliate, ร้านค้า หรือสินค้าแฝงในคำอธิบาย',
  },
  {
    id: 'claim_guaranteed_yield_or_profit',
    label: 'รับประกันผลผลิตหรือกำไร',
    description: 'AI ห้ามบอกว่าผลผลิต กำไร หรือความสำเร็จในแปลงจะเกิดแน่นอน',
  },
  {
    id: 'override_label_instructions',
    label: 'ขัดคำสั่งฉลากจริง',
    description: 'AI ห้ามบอกให้ใช้ต่างจากฉลากจริงหรือข้อกฎหมาย',
  },
  {
    id: 'hide_uncertainty',
    label: 'ซ่อนความไม่แน่นอน',
    description: 'AI ต้องบอกข้อจำกัด สมมติฐาน และสิ่งที่ควรตรวจซ้ำ',
  },
];

export const calculatorAIExplanationBoundary: CalculatorAIExplanationBoundary = {
  allowedActions: calculatorAIAllowedActions,
  blockedActions: calculatorAIBlockedActions,
  defaultSafetyDisclaimers: [
    'ยังไม่เรียก AI จริงใน milestone นี้',
    'AI ในอนาคตอธิบายผลได้ แต่ห้ามเปลี่ยนสูตรหรือผลคำนวณ',
    'ผลลัพธ์เป็นการคำนวณเบื้องต้น ไม่ใช่คำแนะนำทางวิชาการสุดท้าย',
    'ควรตรวจสอบฉลากจริง ผลตรวจดิน พื้นที่จริง ราคา และผู้เชี่ยวชาญก่อนใช้งานจริง',
    'ห้ามแทรก sponsor หรือสินค้าแฝงในคำอธิบาย',
  ],
  highRiskCalculatorCategories: ['spray_mix', 'fertilizer_mix'],
};

export function isCalculatorAIAllowedAction(value: string): value is CalculatorAIExplanationAllowedAction {
  return calculatorAIAllowedActions.some((action) => action.id === value);
}

export function isCalculatorAIBlockedAction(value: string): value is CalculatorAIExplanationBlockedAction {
  return calculatorAIBlockedActions.some((action) => action.id === value);
}

export function getCalculatorAIBlockedActionLabel(actionId: CalculatorAIExplanationBlockedAction) {
  return calculatorAIBlockedActions.find((action) => action.id === actionId)?.label ?? actionId;
}

export function getCalculatorAIAllowedActionLabel(actionId: CalculatorAIExplanationAllowedAction) {
  return calculatorAIAllowedActions.find((action) => action.id === actionId)?.label ?? actionId;
}

