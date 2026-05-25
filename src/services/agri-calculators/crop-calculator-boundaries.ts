export type CalculatorSafetyBoundarySection = {
  id: string;
  title: string;
  summary: string;
  bullets: string[];
};

export const calculatorCanDo: CalculatorSafetyBoundarySection = {
  id: 'can-do',
  title: 'เครื่องคำนวณทำอะไรได้',
  summary: 'ช่วยคิดเลขจากข้อมูลที่ผู้ใช้กรอกและตัวอย่างค่าเริ่มต้น',
  bullets: [
    'แปลงหน่วยที่ดินไทย เช่น ไร่ งาน ตารางวา และตารางเมตร',
    'คำนวณปริมาณผสมจากอัตราบนฉลากที่ผู้ใช้กรอกเอง',
    'ประมาณจำนวนต้น ต้นกล้า ผลผลิต และต้นทุนจากสูตรพื้นฐาน',
    'ช่วยเตรียมข้อมูลสำหรับคุยกับเจ้าหน้าที่หรือผู้เชี่ยวชาญ',
  ],
};

export const calculatorCannotDo: CalculatorSafetyBoundarySection = {
  id: 'cannot-do',
  title: 'เครื่องคำนวณยังทำอะไรไม่ได้',
  summary: 'ยังไม่ใช่ระบบคำแนะนำทางเกษตรเต็มรูปแบบ',
  bullets: [
    'ยังไม่แนะนำอัตราปุ๋ยเฉพาะพืช ดิน ฤดู หรืออายุต้น',
    'ยังไม่แนะนำยา สารเคมี สารกำจัดศัตรูพืช หรือผลิตภัณฑ์ใด',
    'ยังไม่อ่านฉลากด้วย OCR และยังไม่มีฐานข้อมูลสารเคมีจริง',
    'ยังไม่รับประกันผลผลิต ต้นทุน กำไร หรือความปลอดภัยในแปลงจริง',
  ],
};

export const fertilizerChemicalBoundary: CalculatorSafetyBoundarySection = {
  id: 'fertilizer-chemical',
  title: 'ขอบเขตปุ๋ยและสารเคมี',
  summary: 'สูตร deterministic ต้องแยกจากคำแนะนำที่มีความเสี่ยงสูง',
  bullets: [
    'ผลปุ๋ยเป็นการคำนวณจาก NPK ที่กรอก ไม่ใช่คำแนะนำใส่ปุ๋ยจริง',
    'การคำนวณยา/สารใช้ตัวเลขจากฉลากจริงที่ผู้ใช้กรอกเท่านั้น',
    'ต้องตรวจฉลาก ดิน น้ำ พันธุ์พืช อายุพืช และกฎหมายก่อนใช้งานจริง',
    'คำถามที่เสี่ยงควรถูกส่งต่อให้ผู้เชี่ยวชาญหรือเจ้าหน้าที่เกษตร',
  ],
};

export const sponsorAffiliateBoundary: CalculatorSafetyBoundarySection = {
  id: 'sponsor-affiliate',
  title: 'ขอบเขตผู้สนับสนุนและ AI',
  summary: 'ห้ามผสมโฆษณาหรือ AI recommendation เข้าไปในผลคำนวณอย่างลับ ๆ',
  bullets: [
    'สูตรคำนวณพื้นฐานต้องไม่เปลี่ยนตามผู้สนับสนุน',
    'สินค้าแบบ paid placement ต้องติดป้ายชัดเจนและแยกจากผลคำนวณ',
    'AI ในอนาคตอธิบายสมมติฐานได้ แต่ต้องไม่เขียนทับผล deterministic',
    'ห้ามส่งประวัติคำนวณให้ sponsor หรือ affiliate โดยไม่มี consent และ audit',
  ],
};

export const calculatorSafetyBoundarySections = [
  calculatorCanDo,
  calculatorCannotDo,
  fertilizerChemicalBoundary,
  sponsorAffiliateBoundary,
];

export const calculatorPlanningOnlyDisclaimer =
  'ตัวอย่างนี้เป็นค่าเริ่มต้นเพื่อช่วยกรอก ไม่ใช่คำแนะนำทางวิชาการสุดท้าย';

export const deterministicCalculatorBoundary =
  'ผลลัพธ์ deterministic ต้องแยกจากคำอธิบาย AI คำแนะนำผู้เชี่ยวชาญ และพื้นที่โฆษณาเสมอ';
