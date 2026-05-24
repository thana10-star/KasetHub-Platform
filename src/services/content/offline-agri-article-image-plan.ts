import type {
  OfflineAgriArticleCategory,
  OfflineAgriArticleImageAsset,
} from '@/services/content/offline-agri-article.types';

export type OfflineAgriArticleCategoryImagePlan = {
  category: OfflineAgriArticleCategory;
  coverImageThemeTh: string;
  suggestedCoverPath: string;
  altTextTh: string;
  futurePromptNote: string;
  coverAspectRatio: '16:9' | '4:3';
  inlineAspectRatio: '4:3';
  offlineSizeWarning: string;
};

export const offlineAgriArticleImagePlans: Record<OfflineAgriArticleCategory, OfflineAgriArticleCategoryImagePlan> = {
  soil: {
    category: 'soil',
    coverImageThemeTh: 'ตัวอย่างดินหลายชนิดในมือและแปลงปลูก',
    suggestedCoverPath: 'public/assets/articles/soil/soil-types-cover.webp',
    altTextTh: 'ตัวอย่างดินในแปลงก่อนปลูก',
    futurePromptNote: 'ภาพถ่ายจริงหรือภาพ generated แบบสมจริงของเกษตรกรถือดินในแปลงไทย แสงธรรมชาติ ไม่มีข้อความในภาพ',
    coverAspectRatio: '16:9',
    inlineAspectRatio: '4:3',
    offlineSizeWarning: 'ใช้ webp บีบอัด ไม่ควรเกินขนาดจำเป็นสำหรับ mobile',
  },
  water: {
    category: 'water',
    coverImageThemeTh: 'ร่องน้ำและระบบให้น้ำในแปลง',
    suggestedCoverPath: 'public/assets/articles/water/water-management-cover.webp',
    altTextTh: 'ร่องน้ำในแปลงเกษตร',
    futurePromptNote: 'ภาพแปลงเกษตรไทยที่เห็นร่องน้ำและการระบายน้ำชัดเจน ไม่มีแบรนด์สินค้า',
    coverAspectRatio: '16:9',
    inlineAspectRatio: '4:3',
    offlineSizeWarning: 'หลีกเลี่ยงภาพใหญ่เกินไป เพราะต้องอ่านได้แบบ offline',
  },
  fertilizer: {
    category: 'fertilizer',
    coverImageThemeTh: 'ถุงปุ๋ยทั่วไปและสมุดจดแผนใส่ปุ๋ย',
    suggestedCoverPath: 'public/assets/articles/fertilizer/fertilizer-label-cover.webp',
    altTextTh: 'ถุงปุ๋ยและสมุดจดข้อมูลก่อนใช้งาน',
    futurePromptNote: 'ภาพถ่ายเชิงให้ความรู้ ไม่มีชื่อแบรนด์ ไม่มีคำแนะนำโดสเฉพาะ',
    coverAspectRatio: '16:9',
    inlineAspectRatio: '4:3',
    offlineSizeWarning: 'ไม่ใช้ภาพฉลากสินค้าจริงที่อ่านชื่อแบรนด์ได้',
  },
  rice: {
    category: 'rice',
    coverImageThemeTh: 'นาข้าวและต้นกล้าข้าว',
    suggestedCoverPath: 'public/assets/articles/rice/rice-field-cover.webp',
    altTextTh: 'ต้นกล้าข้าวในนา',
    futurePromptNote: 'ภาพนาข้าวไทยช่วงต้นฤดู เห็นแปลงชัดเจน ไม่ใส่ข้อความ',
    coverAspectRatio: '16:9',
    inlineAspectRatio: '4:3',
    offlineSizeWarning: 'ควรมี 1 cover และ inline เฉพาะบทความสำคัญ',
  },
  sugarcane: {
    category: 'sugarcane',
    coverImageThemeTh: 'แถวปลูกอ้อยในแปลง',
    suggestedCoverPath: 'public/assets/articles/sugarcane/sugarcane-row-cover.webp',
    altTextTh: 'แถวอ้อยในแปลง',
    futurePromptNote: 'ภาพแถวปลูกอ้อยมุมกว้าง เห็นระยะปลูกโดยประมาณ ไม่มีข้อความ',
    coverAspectRatio: '16:9',
    inlineAspectRatio: '4:3',
    offlineSizeWarning: 'บีบอัด webp และหลีกเลี่ยงไฟล์หนัก',
  },
  cassava: {
    category: 'cassava',
    coverImageThemeTh: 'ต้นมันสำปะหลังและท่อนพันธุ์',
    suggestedCoverPath: 'public/assets/articles/cassava/cassava-stem-cover.webp',
    altTextTh: 'ท่อนพันธุ์มันสำปะหลังในแปลง',
    futurePromptNote: 'ภาพท่อนพันธุ์มันสำปะหลังและแปลงปลูกไทย ไม่มีชื่อแบรนด์',
    coverAspectRatio: '16:9',
    inlineAspectRatio: '4:3',
    offlineSizeWarning: 'ไม่ฝัง base64 ในโค้ดหรือ local payload',
  },
  farm_finance: {
    category: 'farm_finance',
    coverImageThemeTh: 'สมุดจดต้นทุนเกษตรและเครื่องคิดเลข',
    suggestedCoverPath: 'public/assets/articles/farm-finance/farm-cost-notebook-cover.webp',
    altTextTh: 'สมุดจดต้นทุนและเครื่องคิดเลข',
    futurePromptNote: 'ภาพสมุดจดต้นทุนเกษตรแบบเรียบง่าย ไม่แสดงเอกสารส่วนตัวหรือโลโก้ธนาคาร',
    coverAspectRatio: '16:9',
    inlineAspectRatio: '4:3',
    offlineSizeWarning: 'ภาพการเงินต้องไม่เผยข้อมูลส่วนตัวหรือเลขบัญชี',
  },
};

export function createPlannedArticleCoverAsset(
  category: OfflineAgriArticleCategory,
  slug: string,
  altTextTh?: string,
): OfflineAgriArticleImageAsset {
  const plan = offlineAgriArticleImagePlans[category];
  const folder = category === 'farm_finance' ? 'farm-finance' : category;

  return {
    id: `${slug}-cover`,
    usage: 'cover',
    plannedPath: `public/assets/articles/${folder}/${slug}-cover.webp`,
    altTextTh: altTextTh ?? plan.altTextTh,
    futurePromptNote: plan.futurePromptNote,
    aspectRatio: plan.coverAspectRatio,
    status: 'planned_asset',
    offlineSizeWarning: plan.offlineSizeWarning,
  };
}

