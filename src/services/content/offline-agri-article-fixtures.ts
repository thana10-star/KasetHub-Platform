import type { OfflineAgriArticle, OfflineAgriArticleCategory } from '@/services/content/offline-agri-article.types';
import { offlineAgriArticleBaseSafetyNotes } from '@/services/content/offline-agri-article-taxonomy';
import { createPlannedArticleCoverAsset } from '@/services/content/offline-agri-article-image-plan';

type ArticleSeed = {
  slug: string;
  category: OfflineAgriArticleCategory;
  titleTh: string;
  shortSummaryTh: string;
  difficulty?: OfflineAgriArticle['difficulty'];
  bodyReadiness?: OfflineAgriArticle['bodyReadiness'];
  minutes?: number;
  tagsTh: string[];
  relatedCalculatorRoute?: OfflineAgriArticle['relatedCalculatorRoute'];
  relatedAppRoute?: OfflineAgriArticle['relatedAppRoute'];
  safetyTypes?: Array<OfflineAgriArticle['safetyNotes'][number]['type']>;
  sections: Array<{
    headingTh: string;
    starterSnippetTh: string;
    outlineBulletsTh: string[];
  }>;
  seasonalCmsRecommended?: boolean;
};

function article(seed: ArticleSeed, index: number): OfflineAgriArticle {
  const safetyTypes = new Set<OfflineAgriArticle['safetyNotes'][number]['type']>(['general', ...(seed.safetyTypes ?? [])]);
  return {
    id: `offline-agri-${String(index + 1).padStart(3, '0')}`,
    slug: seed.slug,
    category: seed.category,
    titleTh: seed.titleTh,
    shortSummaryTh: seed.shortSummaryTh,
    difficulty: seed.difficulty ?? 'basic',
    estimatedReadingMinutes: seed.minutes ?? 3,
    offlineAvailable: true,
    bodyReadiness: seed.bodyReadiness ?? 'outline_only',
    sourceStatus: 'internal_draft',
    coverImage: createPlannedArticleCoverAsset(seed.category, seed.slug),
    sections: seed.sections.map((section, sectionIndex) => ({
      id: `${seed.slug}-section-${sectionIndex + 1}`,
      ...section,
    })),
    safetyNotes: Array.from(safetyTypes).map((type) => offlineAgriArticleBaseSafetyNotes[type]),
    relatedCalculatorRoute: seed.relatedCalculatorRoute,
    relatedAppRoute: seed.relatedAppRoute,
    cmsCompatibility: {
      futureCmsKey: `offline_core:${seed.slug}`,
      schemaVersion: 'offline-agri-article-v1',
      canBeOverriddenByCms: true,
      offlineFallbackShouldRemain: true,
      seasonalCmsRecommended: Boolean(seed.seasonalCmsRecommended),
      notes: [
        'Bundled outline can stay available offline.',
        'Future Supabase CMS may provide reviewed full article body.',
        'Seasonal or policy-sensitive details should come from CMS.',
      ],
    },
    tagsTh: seed.tagsTh,
    updatedAt: '2026-05-24',
  };
}

const articleSeeds: ArticleSeed[] = [
  {
    slug: 'soil-types-before-planting',
    category: 'soil',
    titleTh: 'รู้จักชนิดดินก่อนเริ่มปลูก',
    shortSummaryTh: 'เช็กลักษณะดินเบื้องต้นเพื่อวางแผนปลูกและปรับปรุงแปลงอย่างระมัดระวัง',
    bodyReadiness: 'starter_content',
    tagsTh: ['ดิน', 'เตรียมแปลง', 'พื้นฐาน'],
    relatedAppRoute: '/app/farm-area',
    sections: [
      {
        headingTh: 'สังเกตดินด้วยตาและมือ',
        starterSnippetTh: 'เริ่มจากดูสี ความร่วน ความแน่น และการจับตัวของดิน โดยยังไม่สรุปแทนผลตรวจดินจริง',
        outlineBulletsTh: ['ดูสีและเศษอินทรียวัตถุ', 'ลองบีบดินเมื่อมีความชื้นพอดี', 'จดจุดที่น้ำขังหรือดินแน่น'],
      },
      {
        headingTh: 'จดสิ่งที่ควรถามผู้เชี่ยวชาญ',
        starterSnippetTh: 'ถ้าดินมีปัญหาซ้ำ ควรเตรียมข้อมูลพื้นที่ พืชที่ปลูก และรูปถ่ายเพื่อถามหน่วยงานเกษตรในพื้นที่',
        outlineBulletsTh: ['พืชที่เคยปลูก', 'ปัญหาที่พบซ้ำ', 'ช่วงเวลาที่พบปัญหา'],
      },
    ],
  },
  {
    slug: 'soil-ph-simple-field-check',
    category: 'soil',
    titleTh: 'เช็กความเป็นกรดด่างของดินแบบเบื้องต้น',
    shortSummaryTh: 'วางแผนตรวจ pH ดินอย่างปลอดภัย โดยไม่ตีความแทนผลวิเคราะห์จากห้องปฏิบัติการ',
    tagsTh: ['ดิน', 'pH', 'ตรวจดิน'],
    sections: [
      {
        headingTh: 'ทำไมต้องรู้ pH',
        starterSnippetTh: 'ค่า pH เป็นข้อมูลหนึ่งที่ช่วยคุยกับผู้เชี่ยวชาญเรื่องการปรับปรุงดิน แต่ไม่ควรใช้เดี่ยว ๆ เพื่อตัดสินใจใส่วัสดุปรับดิน',
        outlineBulletsTh: ['เก็บตัวอย่างหลายจุด', 'จดตำแหน่งและพืชที่ปลูก', 'เปรียบเทียบกับคำแนะนำในพื้นที่'],
      },
      {
        headingTh: 'เตรียมตัวอย่างให้เรียบร้อย',
        starterSnippetTh: 'แยกตัวอย่างดินเป็นถุงสะอาด ติดป้ายแปลง และหลีกเลี่ยงการปนเปื้อนจากปุ๋ยหรือสารอื่น',
        outlineBulletsTh: ['ใช้ภาชนะสะอาด', 'ไม่ปนดินต่างแปลง', 'ส่งตรวจเมื่อจำเป็น'],
      },
    ],
  },
  {
    slug: 'water-drainage-before-rain',
    category: 'water',
    titleTh: 'เตรียมทางน้ำก่อนฝนหนัก',
    shortSummaryTh: 'เช็กทางระบายน้ำในแปลงเพื่อลดความเสียหายจากน้ำขังแบบพื้นฐาน',
    bodyReadiness: 'starter_content',
    tagsTh: ['น้ำ', 'ฝน', 'ระบายน้ำ'],
    relatedAppRoute: '/app/weather',
    sections: [
      {
        headingTh: 'เดินดูทางน้ำ',
        starterSnippetTh: 'ก่อนฝนยาว ควรดูร่องน้ำ คันแปลง และจุดที่น้ำเคยขัง เพื่อวางแผนแก้จุดเสี่ยงก่อนเกิดปัญหา',
        outlineBulletsTh: ['เปิดทางน้ำที่อุดตัน', 'จดจุดน้ำขังซ้ำ', 'ดูทางน้ำออกจากแปลง'],
      },
      {
        headingTh: 'บันทึกหลังฝน',
        starterSnippetTh: 'หลังฝนหยุด ให้จดเวลาที่น้ำลดและจุดที่พืชเสียหาย เพื่อใช้ปรับแปลงรอบต่อไป',
        outlineBulletsTh: ['ถ่ายภาพจุดเสี่ยง', 'จดระดับน้ำคร่าว ๆ', 'คุยกับผู้เชี่ยวชาญหากน้ำขังนาน'],
      },
    ],
  },
  {
    slug: 'irrigation-schedule-basics',
    category: 'water',
    titleTh: 'วางแผนให้น้ำแบบเข้าใจง่าย',
    shortSummaryTh: 'เริ่มจัดตารางให้น้ำจากสภาพดิน พืช และสภาพอากาศ โดยไม่ใช้สูตรตายตัว',
    tagsTh: ['น้ำ', 'ให้น้ำ', 'จัดการแปลง'],
    relatedAppRoute: '/app/weather',
    sections: [
      {
        headingTh: 'ดูดินก่อนดูนาฬิกา',
        starterSnippetTh: 'ตารางให้น้ำควรเริ่มจากความชื้นดินและอาการพืช ไม่ใช่รดตามเวลาเดียวทุกแปลงเสมอไป',
        outlineBulletsTh: ['สังเกตหน้าดิน', 'ดูใบช่วงแดดจัด', 'จดวันที่ให้น้ำ'],
      },
      {
        headingTh: 'เผื่อฝนและแหล่งน้ำ',
        starterSnippetTh: 'ถ้ามีฝนหรือแหล่งน้ำจำกัด ควรวางแผนล่วงหน้าและเลี่ยงการให้น้ำเกินจนรากเสียหาย',
        outlineBulletsTh: ['ดูพยากรณ์อากาศ', 'จัดลำดับแปลงสำคัญ', 'บันทึกปริมาณคร่าว ๆ'],
      },
    ],
  },
  {
    slug: 'fertilizer-label-reading-basics',
    category: 'fertilizer',
    titleTh: 'อ่านฉลากปุ๋ยก่อนใช้',
    shortSummaryTh: 'ทำความเข้าใจตัวเลขและคำเตือนบนฉลากปุ๋ยในระดับเริ่มต้น',
    bodyReadiness: 'starter_content',
    tagsTh: ['ปุ๋ย', 'ฉลาก', 'NPK'],
    relatedCalculatorRoute: '/app/calculators/fertilizer',
    safetyTypes: ['fertilizer_chemical'],
    sections: [
      {
        headingTh: 'ตัวเลข N-P-K คือข้อมูลตั้งต้น',
        starterSnippetTh: 'ตัวเลขบนฉลากช่วยให้รู้สัดส่วนธาตุอาหาร แต่ยังไม่ใช่คำแนะนำปริมาณใช้สำหรับทุกแปลง',
        outlineBulletsTh: ['อ่านสูตรบนถุง', 'ดูหน่วยและคำเตือน', 'เทียบกับผลตรวจดินเมื่อมี'],
      },
      {
        headingTh: 'อย่าข้ามคำเตือน',
        starterSnippetTh: 'ควรอ่านฉลากจริงทุกครั้ง โดยเฉพาะวิธีเก็บรักษา วิธีใช้ และข้อควรระวัง',
        outlineBulletsTh: ['ดูวันผลิต/สภาพถุง', 'เก็บให้พ้นเด็กและสัตว์', 'ถามร้านหรือเจ้าหน้าที่เมื่อไม่แน่ใจ'],
      },
    ],
  },
  {
    slug: 'npk-basic-planning',
    category: 'fertilizer',
    titleTh: 'วางแผน NPK เบื้องต้นโดยไม่เดาเกินจำเป็น',
    shortSummaryTh: 'ใช้เครื่องคำนวณช่วยจัดระเบียบตัวเลข แต่ยังไม่แทนคำแนะนำทางวิชาการ',
    tagsTh: ['ปุ๋ย', 'NPK', 'คำนวณ'],
    relatedCalculatorRoute: '/app/calculators/fertilizer',
    safetyTypes: ['fertilizer_chemical'],
    sections: [
      {
        headingTh: 'แยกการคำนวณกับคำแนะนำ',
        starterSnippetTh: 'เครื่องคำนวณช่วยดูตัวเลขจากเป้าหมายที่ผู้ใช้กรอก ไม่ได้บอกว่าพืชชนิดใดควรใส่เท่าไร',
        outlineBulletsTh: ['กรอกพื้นที่ให้ถูกหน่วย', 'ดูเปอร์เซ็นต์ธาตุอาหาร', 'ตรวจสอบกับผู้เชี่ยวชาญ'],
      },
      {
        headingTh: 'บันทึกผลไว้เทียบภายหลัง',
        starterSnippetTh: 'จดวันที่ พื้นที่ และตัวเลขที่ใช้ เพื่อกลับมาตรวจสอบกับผลผลิตหรือคำแนะนำในพื้นที่',
        outlineBulletsTh: ['บันทึกพื้นที่', 'บันทึกสูตรปุ๋ย', 'บันทึกเหตุผลที่เลือกใช้'],
      },
    ],
  },
  {
    slug: 'rice-seedling-field-prep',
    category: 'rice',
    titleTh: 'เตรียมนาและต้นกล้าข้าวแบบพื้นฐาน',
    shortSummaryTh: 'จัดรายการสิ่งที่ควรตรวจเมื่อต้องเตรียมนาและย้ายต้นกล้า',
    tagsTh: ['ข้าว', 'เตรียมนา', 'ต้นกล้า'],
    relatedCalculatorRoute: '/app/calculators/plant-spacing',
    sections: [
      {
        headingTh: 'ดูแปลงก่อนลงมือ',
        starterSnippetTh: 'ควรดูระดับพื้นที่ ทางน้ำ และสภาพดินก่อนเริ่มเตรียมนา เพื่อจดจุดที่ต้องปรับ',
        outlineBulletsTh: ['ดูจุดน้ำลึก/น้ำตื้น', 'จดจุดดินแน่น', 'วางแผนแรงงาน'],
      },
      {
        headingTh: 'ต้นกล้าและระยะปลูก',
        starterSnippetTh: 'ระยะปลูกควรปรับตามระบบปลูกและคำแนะนำในพื้นที่ เครื่องคำนวณช่วยประเมินจำนวนต้นเท่านั้น',
        outlineBulletsTh: ['เช็กจำนวนต้นคร่าว ๆ', 'เผื่อต้นเสียหาย', 'สอบถามคำแนะนำท้องถิ่น'],
      },
    ],
  },
  {
    slug: 'rice-pest-monitoring-basics',
    category: 'rice',
    titleTh: 'เฝ้าระวังอาการผิดปกติในนาข้าว',
    shortSummaryTh: 'เริ่มบันทึกอาการ ใบ และจุดเกิดปัญหาเพื่อใช้ถามผู้เชี่ยวชาญ',
    tagsTh: ['ข้าว', 'โรคพืช', 'เฝ้าระวัง'],
    relatedAppRoute: '/app/analyze',
    safetyTypes: ['fertilizer_chemical'],
    sections: [
      {
        headingTh: 'บันทึกให้ครบก่อนสรุป',
        starterSnippetTh: 'อาการในนาข้าวอาจเกิดจากหลายสาเหตุ ควรถ่ายรูปหลายมุมและจดช่วงเวลาที่พบ',
        outlineBulletsTh: ['ถ่ายใบใกล้และไกล', 'จดอายุพืช', 'จดสภาพน้ำและปุ๋ยที่ใช้'],
      },
      {
        headingTh: 'หลีกเลี่ยงการใช้สารจากการเดา',
        starterSnippetTh: 'ถ้าต้องใช้สารใด ๆ ควรยืนยันกับฉลากจริงและผู้เชี่ยวชาญในพื้นที่ก่อน',
        outlineBulletsTh: ['ไม่ผสมสารเองโดยไม่รู้ฉลาก', 'ดูอุปกรณ์ป้องกัน', 'เก็บหลักฐานก่อนถาม'],
      },
    ],
  },
  {
    slug: 'sugarcane-planting-spacing-basics',
    category: 'sugarcane',
    titleTh: 'วางแผนแถวปลูกอ้อยแบบเบื้องต้น',
    shortSummaryTh: 'ใช้ตัวอย่างระยะปลูกเพื่อช่วยจัดแถว แต่ยังไม่ใช่สูตรสุดท้ายสำหรับทุกพื้นที่',
    tagsTh: ['อ้อย', 'ระยะปลูก', 'วางแผนแปลง'],
    relatedCalculatorRoute: '/app/calculators/plant-spacing',
    sections: [
      {
        headingTh: 'เริ่มจากขนาดแปลง',
        starterSnippetTh: 'ควรวัดพื้นที่และทางเข้าออกก่อนวางแถว เพื่อให้เครื่องจักรหรือแรงงานทำงานได้สะดวก',
        outlineBulletsTh: ['วัดพื้นที่คร่าว ๆ', 'ดูทางรถหรือทางเดิน', 'เผื่อพื้นที่หัวแปลง'],
      },
      {
        headingTh: 'ใช้ตัวอย่างอย่างระมัดระวัง',
        starterSnippetTh: 'ตัวอย่างระยะปลูกเป็นค่าช่วยกรอก ไม่ใช่คำแนะนำทางวิชาการสุดท้าย',
        outlineBulletsTh: ['เทียบกับพื้นที่จริง', 'ถามโรงงานหรือเจ้าหน้าที่พื้นที่', 'บันทึกเหตุผลที่เลือก'],
      },
    ],
  },
  {
    slug: 'sugarcane-ratoon-care-outline',
    category: 'sugarcane',
    titleTh: 'โครงร่างการดูแลอ้อยตอ',
    shortSummaryTh: 'ลิสต์สิ่งที่ควรสังเกตหลังตัดอ้อย โดยไม่ลงคำแนะนำปุ๋ยหรือสารเฉพาะ',
    tagsTh: ['อ้อย', 'อ้อยตอ', 'บันทึกแปลง'],
    sections: [
      {
        headingTh: 'ดูความสม่ำเสมอของการแตกตอ',
        starterSnippetTh: 'หลังตัดควรสังเกตจุดที่แตกตอดีและจุดที่หาย เพื่อใช้ตัดสินใจร่วมกับผู้เชี่ยวชาญ',
        outlineBulletsTh: ['จดจุดแหว่ง', 'ดูความชื้น', 'ถ่ายภาพซ้ำเป็นช่วง'],
      },
      {
        headingTh: 'แยกข้อมูลจากคำแนะนำ',
        starterSnippetTh: 'บทความนี้ช่วยจัดข้อมูล ไม่แนะนำโดสปุ๋ยหรือสารใด ๆ สำหรับอ้อยตอ',
        outlineBulletsTh: ['จดประวัติแปลง', 'จดต้นทุนซ่อมแซม', 'รอคำแนะนำที่ผ่านการตรวจ'],
      },
    ],
  },
  {
    slug: 'cassava-stem-selection-basics',
    category: 'cassava',
    titleTh: 'เลือกท่อนพันธุ์มันสำปะหลังแบบเริ่มต้น',
    shortSummaryTh: 'รายการตรวจท่อนพันธุ์และการบันทึกแหล่งที่มาแบบไม่ลงรายละเอียดทางวิชาการเกินจริง',
    tagsTh: ['มันสำปะหลัง', 'ท่อนพันธุ์', 'ปลูกพืช'],
    sections: [
      {
        headingTh: 'จดแหล่งที่มา',
        starterSnippetTh: 'ควรจดว่าท่อนพันธุ์มาจากที่ใด วันใด และมีลักษณะโดยรวมอย่างไร เพื่อใช้ติดตามผลภายหลัง',
        outlineBulletsTh: ['แหล่งท่อนพันธุ์', 'วันที่รับมา', 'สภาพทั่วไป'],
      },
      {
        headingTh: 'สังเกตก่อนปลูก',
        starterSnippetTh: 'ถ้าพบท่อนพันธุ์เสียหายหรือผิดปกติ ควรแยกไว้และขอคำแนะนำจากผู้รู้ในพื้นที่',
        outlineBulletsTh: ['ดูรอยช้ำหรือแห้งผิดปกติ', 'แยกกองตามแหล่ง', 'บันทึกจำนวนคร่าว ๆ'],
      },
    ],
  },
  {
    slug: 'cassava-harvest-cost-outline',
    category: 'cassava',
    titleTh: 'จดต้นทุนช่วงเก็บเกี่ยวมันสำปะหลัง',
    shortSummaryTh: 'จัดหมวดต้นทุนแรงงาน ขนส่ง และค่าใช้จ่ายอื่นก่อนสรุปกำไรขาดทุน',
    tagsTh: ['มันสำปะหลัง', 'ต้นทุน', 'เก็บเกี่ยว'],
    relatedCalculatorRoute: '/app/calculators/cost',
    sections: [
      {
        headingTh: 'แยกต้นทุนให้ชัด',
        starterSnippetTh: 'ต้นทุนเก็บเกี่ยวควรแยกแรงงาน เครื่องจักร ขนส่ง และค่าใช้จ่ายย่อย เพื่อเทียบกับรายรับได้ง่ายขึ้น',
        outlineBulletsTh: ['แรงงาน', 'เครื่องจักร', 'ขนส่ง', 'ค่าใช้จ่ายอื่น'],
      },
      {
        headingTh: 'อย่าสรุปจากราคาวันเดียว',
        starterSnippetTh: 'ราคาซื้อขายเปลี่ยนได้ ควรใช้ข้อมูลจริงจากจุดรับซื้อและเอกสารของตนเอง',
        outlineBulletsTh: ['เก็บใบชั่ง', 'จดวันที่ขาย', 'เทียบต้นทุนต่อไร่'],
      },
    ],
  },
  {
    slug: 'farm-cost-recording-basics',
    category: 'farm_finance',
    titleTh: 'เริ่มจดต้นทุนเกษตรแบบง่าย',
    shortSummaryTh: 'เริ่มทำบัญชีแปลงด้วยหมวดต้นทุนหลักโดยยังไม่ต้องใช้ระบบซับซ้อน',
    bodyReadiness: 'starter_content',
    tagsTh: ['บัญชีเกษตร', 'ต้นทุน', 'การเงิน'],
    relatedCalculatorRoute: '/app/calculators/cost',
    safetyTypes: ['finance'],
    sections: [
      {
        headingTh: 'จดให้ทันวันที่จ่าย',
        starterSnippetTh: 'การจดต้นทุนทันทีช่วยลดการลืม โดยเริ่มจากหมวดง่าย ๆ เช่น ปุ๋ย แรงงาน น้ำ เครื่องจักร และอื่น ๆ',
        outlineBulletsTh: ['วันที่จ่าย', 'หมวดค่าใช้จ่าย', 'จำนวนเงิน', 'หมายเหตุ'],
      },
      {
        headingTh: 'ดูต้นทุนต่อไร่',
        starterSnippetTh: 'เมื่อรู้พื้นที่ปลูก สามารถคำนวณต้นทุนต่อไร่เพื่อเทียบรอบการผลิต แต่ยังไม่ใช่คำแนะนำการลงทุน',
        outlineBulletsTh: ['พื้นที่ทั้งหมด', 'ต้นทุนรวม', 'ต้นทุนต่อไร่'],
      },
    ],
  },
  {
    slug: 'farm-loan-project-checklist',
    category: 'farm_finance',
    titleTh: 'เช็กข้อมูลก่อนดูสินเชื่อหรือโครงการรัฐ',
    shortSummaryTh: 'เตรียมคำถามและเอกสารที่ควรตรวจ โดยไม่ระบุอัตราหรือเงื่อนไขที่อาจเปลี่ยนได้',
    tagsTh: ['สินเชื่อ', 'โครงการรัฐ', 'การเงิน'],
    safetyTypes: ['finance'],
    seasonalCmsRecommended: true,
    sections: [
      {
        headingTh: 'อย่าเชื่อเงื่อนไขจากข้อความเก่า',
        starterSnippetTh: 'อัตรา ดอกเบี้ย คุณสมบัติ และช่วงเวลารับสมัครเปลี่ยนได้ ควรตรวจสอบกับหน่วยงานจริงเสมอ',
        outlineBulletsTh: ['หน่วยงานเจ้าของโครงการ', 'วันที่ประกาศล่าสุด', 'เงื่อนไขผู้สมัคร'],
      },
      {
        headingTh: 'เตรียมคำถามก่อนสมัคร',
        starterSnippetTh: 'ควรถามเรื่องยอดที่ต้องชำระ ระยะเวลา หลักฐาน และผลกระทบหากผิดนัด ก่อนตัดสินใจ',
        outlineBulletsTh: ['ยอดชำระรวม', 'ระยะเวลาผ่อน', 'เอกสารที่ต้องใช้', 'ช่องทางติดต่อจริง'],
      },
    ],
  },
];

export const offlineAgriArticles: OfflineAgriArticle[] = articleSeeds.map(article);

export const offlineAgriArticleExpectedSlugs = articleSeeds.map((item) => item.slug);
