import type {
  OfflineAgriArticleCategory,
  OfflineAgriArticleCategoryMeta,
  OfflineAgriArticleDifficulty,
  OfflineAgriArticleSafetyNote,
} from '@/services/content/offline-agri-article.types';

export const offlineAgriArticleCategories: OfflineAgriArticleCategoryMeta[] = [
  {
    key: 'soil',
    labelTh: 'ดิน',
    descriptionTh: 'พื้นฐานการดูดินและเตรียมแปลงแบบอ่านง่าย',
    imageTone: 'soil',
  },
  {
    key: 'water',
    labelTh: 'น้ำ',
    descriptionTh: 'การระบายน้ำ ให้น้ำ และเฝ้าระวังน้ำในแปลง',
    imageTone: 'water',
  },
  {
    key: 'fertilizer',
    labelTh: 'ปุ๋ย',
    descriptionTh: 'การอ่านฉลากและวางแผนปุ๋ยเบื้องต้น ไม่ใช่คำแนะนำโดสจริง',
    imageTone: 'soil',
  },
  {
    key: 'rice',
    labelTh: 'ข้าว',
    descriptionTh: 'พื้นฐานการเตรียมนาและติดตามอาการในนาข้าว',
    imageTone: 'rice',
  },
  {
    key: 'sugarcane',
    labelTh: 'อ้อย',
    descriptionTh: 'หัวข้อเริ่มต้นสำหรับวางแผนปลูกและดูแลอ้อย',
    imageTone: 'field',
  },
  {
    key: 'cassava',
    labelTh: 'มันสำปะหลัง',
    descriptionTh: 'หัวข้อเริ่มต้นสำหรับท่อนพันธุ์ ต้นทุน และการเก็บเกี่ยว',
    imageTone: 'field',
  },
  {
    key: 'farm_finance',
    labelTh: 'บัญชีเกษตรและการเงิน',
    descriptionTh: 'การจดต้นทุนและตรวจสอบเงื่อนไขการเงินอย่างระมัดระวัง',
    imageTone: 'market',
  },
];

export const offlineAgriArticleDifficultyLabels: Record<OfflineAgriArticleDifficulty, string> = {
  basic: 'พื้นฐาน',
  intermediate: 'ปานกลาง',
  advanced: 'เชิงลึก',
};

export const offlineAgriArticleBaseSafetyNotes: Record<OfflineAgriArticleSafetyNote['type'], OfflineAgriArticleSafetyNote> = {
  general: {
    id: 'safety-general',
    type: 'general',
    textTh: 'ข้อมูลนี้เป็นความรู้เบื้องต้น ควรตรวจสอบกับหน่วยงานเกษตร/ผู้เชี่ยวชาญในพื้นที่',
  },
  finance: {
    id: 'safety-finance',
    type: 'finance',
    textTh: 'เงื่อนไขสินเชื่อ/โครงการรัฐเปลี่ยนได้ ควรตรวจสอบกับหน่วยงานจริง',
  },
  fertilizer_chemical: {
    id: 'safety-fertilizer-chemical',
    type: 'fertilizer_chemical',
    textTh: 'อ่านฉลากจริงก่อนใช้เสมอ',
  },
};

export function getOfflineAgriArticleCategoryMeta(category: OfflineAgriArticleCategory) {
  return offlineAgriArticleCategories.find((item) => item.key === category) ?? offlineAgriArticleCategories[0];
}

