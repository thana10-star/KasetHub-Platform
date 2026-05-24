import type { CalculatorAIBackendArchitectureReview } from '@/services/agri-calculators/calculator-ai-backend.types';

const fixtureDisclaimer =
  'คำอธิบายนี้เป็นตัวอย่างจากข้อมูลที่ล็อกไว้เท่านั้น ไม่ใช่คำแนะนำทางวิชาการ ไม่แทนฉลากจริง ผู้เชี่ยวชาญ หรือผลตรวจดิน';

function formatLines(title: string, lines: readonly string[]) {
  if (lines.length === 0) {
    return [`${title}: ไม่มีข้อมูลที่ล็อกไว้`];
  }

  return [`${title}:`, ...lines.map((line) => `- ${line}`)];
}

export function buildLocalCalculatorAIExplanation(review: CalculatorAIBackendArchitectureReview) {
  const { snapshot } = review;
  const calculatorLine = snapshot.cropLabel
    ? `เครื่องคำนวณ: ${snapshot.calculatorLabel} (${snapshot.cropLabel})`
    : `เครื่องคำนวณ: ${snapshot.calculatorLabel}`;

  return [
    'สรุปคำอธิบายเบื้องต้นจาก KasetHub',
    calculatorLine,
    `รหัสล็อกผล: ${snapshot.lockHash}`,
    '',
    ...formatLines('ข้อมูลที่กรอก', snapshot.inputRecap),
    '',
    ...formatLines('ผลคำนวณที่ล็อกไว้', snapshot.resultValues),
    '',
    'ความหมายของผล:',
    '- ข้อความนี้อธิบายเฉพาะผลคำนวณที่แสดงอยู่แล้ว',
    '- ไม่คำนวณสูตรใหม่ ไม่เปลี่ยนตัวเลข และไม่เพิ่มคำแนะนำสินค้า',
    '- ถ้ามีคำเตือน ให้ตรวจฉลากจริง ผลตรวจดิน หรือผู้เชี่ยวชาญก่อนใช้งานจริง',
    '',
    ...formatLines('คำเตือนจากเครื่องคำนวณ', snapshot.warningRecap),
    '',
    `ข้อจำกัด: ${fixtureDisclaimer}`,
  ].join('\n');
}

export function getLocalCalculatorAIDisclaimers(review: CalculatorAIBackendArchitectureReview) {
  return Array.from(
    new Set([
      review.snapshot.safetyDisclaimer,
      fixtureDisclaimer,
      'ยังไม่เรียก AI จริง และยังไม่ส่งข้อมูลออกจากเครื่องในโหมด local_fixture',
      'AI ในอนาคตต้องอธิบายจาก locked snapshot เท่านั้น',
    ]),
  );
}
