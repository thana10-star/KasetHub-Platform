import type { AppRoute } from '@/types/kaset';
import type {
  FullArticleBodyTemplate,
  FullArticleExpertEscalationNote,
  FullArticleImageRequirement,
  FullArticleReviewRequirement,
  FullArticleSectionBlock,
  FullArticleSectionTemplate,
  FullArticleSourcePlaceholder,
  FullArticleSourceType,
} from '@/services/content/offline-agri-full-article.types';

export const fullArticlePilotSlugs = [
  'soil-types-before-planting',
  'npk-label-basics',
  'rice-cost-profit-per-rai',
  'cassava-plant-spacing-per-rai',
  'farm-break-even-price',
] as const;

type FullArticlePilotSlug = (typeof fullArticlePilotSlugs)[number];

type TemplateSeed = {
  pilotSlug: FullArticlePilotSlug;
  sourceArticleSlug: string;
  titleTh: string;
  category: FullArticleBodyTemplate['category'];
  sourceTypes: FullArticleSourceType[];
  safetyNoteTypes: FullArticleBodyTemplate['safetyNoteTypes'];
  expertRiskTypes: FullArticleExpertEscalationNote['riskType'][];
  relatedCalculatorRoutes?: AppRoute[];
  relatedAppRoutes?: AppRoute[];
  freshnessRequired?: boolean;
  freshnessDatePlaceholder?: string;
};

const blockLabels: Record<FullArticleSectionBlock, { headingTh: string; purposeTh: string }> = {
  intro: {
    headingTh: 'บทนำ',
    purposeTh: 'อธิบายว่าบทความนี้ช่วยจัดข้อมูลเบื้องต้น ไม่ใช่คำแนะนำทางการสุดท้าย',
  },
  key_points: {
    headingTh: 'ประเด็นสำคัญ',
    purposeTh: 'สรุปสิ่งที่ผู้อ่านควรรู้ก่อนลงมือจริง',
  },
  practical_steps: {
    headingTh: 'ขั้นตอนที่ทำได้ในแปลง',
    purposeTh: 'เรียงขั้นตอนแบบอ่านง่ายและต้องไม่ใส่สูตรตายตัวที่ยังไม่ได้รีวิว',
  },
  calculation_tool_links: {
    headingTh: 'เครื่องมือคำนวณที่เกี่ยวข้อง',
    purposeTh: 'เชื่อมไปยังเครื่องมือในแอปโดยแยกการคำนวณออกจากคำแนะนำ',
  },
  common_mistakes: {
    headingTh: 'ข้อผิดพลาดที่พบบ่อย',
    purposeTh: 'เตือนจุดที่ควรระวังโดยไม่กล่าวอ้างเกินหลักฐาน',
  },
  safety_warnings: {
    headingTh: 'คำเตือนด้านความปลอดภัย',
    purposeTh: 'ย้ำฉลากจริง ผู้เชี่ยวชาญ และความไม่แน่นอน',
  },
  local_context_notes: {
    headingTh: 'สิ่งที่ต้องดูตามพื้นที่',
    purposeTh: 'เว้นที่ให้ข้อมูลดิน น้ำ ฤดูกาล ราคา และหน่วยงานท้องถิ่นในอนาคต',
  },
  when_to_ask_expert: {
    headingTh: 'เมื่อไรควรถามผู้เชี่ยวชาญ',
    purposeTh: 'ระบุสถานการณ์ที่ต้องส่งต่อผู้เชี่ยวชาญหรือหน่วยงานจริง',
  },
  summary: {
    headingTh: 'สรุป',
    purposeTh: 'ย้ำข้อจำกัดและสิ่งที่ควรตรวจซ้ำก่อนใช้จริง',
  },
  related_app_actions: {
    headingTh: 'ทำต่อใน KasetHub',
    purposeTh: 'แนะนำปุ่มหรือหน้าที่เกี่ยวข้องในแอปโดยไม่บังคับใช้งาน',
  },
};

const requiredBlocks: FullArticleSectionBlock[] = [
  'intro',
  'key_points',
  'practical_steps',
  'calculation_tool_links',
  'common_mistakes',
  'safety_warnings',
  'local_context_notes',
  'when_to_ask_expert',
  'summary',
  'related_app_actions',
];

function sourcePlaceholder(seed: TemplateSeed, sourceType: FullArticleSourceType, index: number): FullArticleSourcePlaceholder {
  const labelByType: Record<FullArticleSourceType, string> = {
    extension_office: 'แหล่งอ้างอิงจากหน่วยงานเกษตรในพื้นที่',
    soil_test: 'ผลตรวจดินหรือข้อมูลแปลงจริง',
    label: 'ฉลากปุ๋ย/สารจริงที่ตรวจสอบแล้ว',
    price_source: 'แหล่งราคาหรือรายรับที่ระบุวันที่',
    official_program: 'ข้อมูลโครงการรัฐหรือสินเชื่อจากหน่วยงานจริง',
    farmer_record: 'บันทึกต้นทุน/ผลผลิตของเกษตรกร',
    expert_review: 'บันทึกรีวิวจากผู้เชี่ยวชาญ',
  };

  return {
    id: `${seed.pilotSlug}-source-${index + 1}`,
    labelTh: labelByType[sourceType],
    required: true,
    status: 'placeholder_empty',
    sourceType,
    noteTh: 'M67 เตรียมช่องอ้างอิงเท่านั้น ยังไม่กรอกแหล่งข้อมูลจริงและยังไม่เผยแพร่เป็นบทความทางการ',
  };
}

function sections(seed: TemplateSeed, sourceIds: string[]): FullArticleSectionTemplate[] {
  return requiredBlocks.map((block, index) => {
    const relatedRoute =
      block === 'calculation_tool_links'
        ? seed.relatedCalculatorRoutes?.[0]
        : block === 'related_app_actions'
          ? seed.relatedAppRoutes?.[0] ?? seed.relatedCalculatorRoutes?.[0]
          : undefined;

    return {
      id: `${seed.pilotSlug}-section-template-${index + 1}`,
      block,
      headingTh: blockLabels[block].headingTh,
      purposeTh: blockLabels[block].purposeTh,
      outlineBulletsTh: [
        'เขียนด้วยภาษาง่าย เหมาะกับมือถือ และไม่ใส่ข้อเท็จจริงทางการที่ยังไม่มีแหล่งตรวจ',
        'คงคำเตือนและข้อจำกัดไว้เสมอ',
        'ระบุจุดที่ต้องตรวจสอบกับข้อมูลจริงก่อนใช้ในแปลง',
      ],
      required: true,
      sourcePlaceholderIds: sourceIds,
      relatedRoute,
    };
  });
}

function reviews(seed: TemplateSeed): FullArticleReviewRequirement[] {
  const requirements: FullArticleReviewRequirement[] = [
    {
      id: `${seed.pilotSlug}-review-editor`,
      labelTh: 'รีวิวภาษาและความชัดเจน',
      required: true,
      status: 'placeholder_ready',
      reviewerRole: 'editor',
      noteTh: 'ต้องมีผู้ตรวจบทความก่อนขยับสถานะออกจาก draft_template',
    },
  ];

  if (seed.category === 'fertilizer' || seed.expertRiskTypes.includes('crop_health')) {
    requirements.push({
      id: `${seed.pilotSlug}-review-agronomist`,
      labelTh: 'รีวิวด้านเกษตร/ปุ๋ย/ความปลอดภัย',
      required: true,
      status: 'placeholder_ready',
      reviewerRole: 'agronomist',
      noteTh: 'ต้องยืนยันว่าไม่มีโดสปุ๋ยหรือคำแนะนำสารที่ยังไม่ได้รีวิว',
    });
  }

  if (seed.category === 'farm_finance' || seed.expertRiskTypes.includes('finance_government')) {
    requirements.push({
      id: `${seed.pilotSlug}-review-finance`,
      labelTh: 'รีวิวข้อมูลต้นทุน/ราคา/การเงิน',
      required: true,
      status: 'placeholder_ready',
      reviewerRole: 'finance_reviewer',
      noteTh: 'ต้องตรวจวันที่ความสดใหม่และไม่ใส่เงื่อนไขสินเชื่อหรือโครงการรัฐเป็นข้อเท็จจริงถาวร',
    });
  }

  requirements.push({
    id: `${seed.pilotSlug}-review-local`,
    labelTh: 'รีวิวบริบทพื้นที่',
    required: true,
    status: 'placeholder_ready',
    reviewerRole: 'local_expert',
    noteTh: 'ควรมีคนที่เข้าใจพื้นที่ช่วยดูว่าข้อความไม่เหมารวมเกินไป',
  });

  return requirements;
}

function expertNotes(seed: TemplateSeed): FullArticleExpertEscalationNote[] {
  return seed.expertRiskTypes.map((riskType, index) => ({
    id: `${seed.pilotSlug}-expert-${index + 1}`,
    riskType,
    required: true,
    noteTh: 'หากเนื้อหานี้แตะความเสี่ยงเฉพาะแปลง ต้องส่งต่อผู้เชี่ยวชาญหรือหน่วยงานจริงก่อนเผยแพร่เต็มรูปแบบ',
  }));
}

function imageRequirements(seed: TemplateSeed): FullArticleImageRequirement[] {
  return [
    {
      id: `${seed.pilotSlug}-cover-image`,
      labelTh: 'ภาพปกบทความ',
      required: true,
      plannedPath: `public/assets/articles/${seed.category}/${seed.pilotSlug}-cover.webp`,
      aspectRatio: '16:9',
      altTextTh: `ภาพประกอบบทความ ${seed.titleTh}`,
      sizeLimitKb: 180,
      status: 'planned_only',
    },
    {
      id: `${seed.pilotSlug}-inline-image`,
      labelTh: 'ภาพประกอบขั้นตอนสำคัญ',
      required: true,
      plannedPath: `public/assets/articles/${seed.category}/${seed.pilotSlug}-inline-1.webp`,
      aspectRatio: '4:3',
      altTextTh: `ภาพตัวอย่างสำหรับ ${seed.titleTh}`,
      sizeLimitKb: 160,
      status: 'planned_only',
    },
  ];
}

function template(seed: TemplateSeed, index: number): FullArticleBodyTemplate {
  const placeholders = seed.sourceTypes.map((sourceType, sourceIndex) => sourcePlaceholder(seed, sourceType, sourceIndex));

  return {
    id: `full-article-template-${String(index + 1).padStart(2, '0')}`,
    pilotSlug: seed.pilotSlug,
    sourceArticleSlug: seed.sourceArticleSlug,
    titleTh: seed.titleTh,
    category: seed.category,
    draftStatus: 'draft_template',
    futureCmsKey: `full_article:${seed.pilotSlug}`,
    outlineToFullBodyMapping: requiredBlocks.map((block) => ({
      outlineHeadingTh: blockLabels[block].headingTh,
      targetBlock: block,
    })),
    sections: sections(seed, placeholders.map((item) => item.id)),
    sourcePlaceholders: placeholders,
    reviewRequirements: reviews(seed),
    expertEscalationNotes: expertNotes(seed),
    imageRequirements: imageRequirements(seed),
    relatedCalculatorRoutes: seed.relatedCalculatorRoutes ?? [],
    relatedAppRoutes: seed.relatedAppRoutes ?? [],
    safetyNoteTypes: ['general', ...seed.safetyNoteTypes.filter((item) => item !== 'general')],
    freshnessRequired: Boolean(seed.freshnessRequired),
    freshnessDatePlaceholder: seed.freshnessDatePlaceholder,
    lastReviewedDatePlaceholder: 'pending_review_date',
    offlineFallbackArticleSlug: seed.sourceArticleSlug,
  };
}

export const offlineAgriFullArticleTemplates: FullArticleBodyTemplate[] = [
  template(
    {
      pilotSlug: 'soil-types-before-planting',
      sourceArticleSlug: 'soil-types-before-planting',
      titleTh: 'รู้จักชนิดดินก่อนเริ่มปลูก',
      category: 'soil',
      sourceTypes: ['soil_test', 'extension_office', 'expert_review'],
      safetyNoteTypes: ['general'],
      expertRiskTypes: ['local_conditions'],
      relatedAppRoutes: ['/app/farm-area'],
    },
    0,
  ),
  template(
    {
      pilotSlug: 'npk-label-basics',
      sourceArticleSlug: 'fertilizer-label-reading-basics',
      titleTh: 'อ่านฉลาก NPK ให้เข้าใจง่าย',
      category: 'fertilizer',
      sourceTypes: ['label', 'soil_test', 'expert_review'],
      safetyNoteTypes: ['general', 'fertilizer_chemical'],
      expertRiskTypes: ['fertilizer_chemical', 'local_conditions'],
      relatedCalculatorRoutes: ['/app/calculators/fertilizer'],
    },
    1,
  ),
  template(
    {
      pilotSlug: 'rice-cost-profit-per-rai',
      sourceArticleSlug: 'farm-cost-recording-basics',
      titleTh: 'วางกรอบต้นทุนและกำไรข้าวต่อไร่',
      category: 'farm_finance',
      sourceTypes: ['farmer_record', 'price_source', 'expert_review'],
      safetyNoteTypes: ['general', 'finance'],
      expertRiskTypes: ['finance_government', 'yield_profit'],
      relatedCalculatorRoutes: ['/app/calculators/cost', '/app/calculators/yield-estimate'],
      relatedAppRoutes: ['/app/prices'],
      freshnessRequired: true,
      freshnessDatePlaceholder: 'pending_finance_price_freshness_date',
    },
    2,
  ),
  template(
    {
      pilotSlug: 'cassava-plant-spacing-per-rai',
      sourceArticleSlug: 'cassava-stem-selection-basics',
      titleTh: 'เตรียมบทความระยะปลูกมันสำปะหลังต่อไร่',
      category: 'cassava',
      sourceTypes: ['extension_office', 'farmer_record', 'expert_review'],
      safetyNoteTypes: ['general'],
      expertRiskTypes: ['crop_health', 'local_conditions'],
      relatedCalculatorRoutes: ['/app/calculators/plant-spacing'],
      relatedAppRoutes: ['/app/farm-area'],
    },
    3,
  ),
  template(
    {
      pilotSlug: 'farm-break-even-price',
      sourceArticleSlug: 'farm-cost-recording-basics',
      titleTh: 'คำนวณราคาคุ้มทุนแบบเบื้องต้น',
      category: 'farm_finance',
      sourceTypes: ['farmer_record', 'price_source', 'official_program', 'expert_review'],
      safetyNoteTypes: ['general', 'finance'],
      expertRiskTypes: ['finance_government', 'yield_profit'],
      relatedCalculatorRoutes: ['/app/calculators/cost'],
      relatedAppRoutes: ['/app/prices'],
      freshnessRequired: true,
      freshnessDatePlaceholder: 'pending_break_even_price_freshness_date',
    },
    4,
  ),
];

export function listOfflineAgriFullArticleTemplates() {
  return offlineAgriFullArticleTemplates;
}

export function findOfflineAgriFullArticleTemplateByPilotSlug(slug: string) {
  return offlineAgriFullArticleTemplates.find((templateItem) => templateItem.pilotSlug === slug);
}

export function findOfflineAgriFullArticleTemplateForArticleSlug(slug: string) {
  return offlineAgriFullArticleTemplates.find(
    (templateItem) => templateItem.pilotSlug === slug || templateItem.sourceArticleSlug === slug || templateItem.offlineFallbackArticleSlug === slug,
  );
}
