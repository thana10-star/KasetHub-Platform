import type {
  OfflineAgriPilotArticleDraft,
  PilotArticleDraftWorkflowSummary,
} from '@/services/content/offline-agri-pilot-article-drafts.types';
import { getFullArticleReadinessByPilotSlug } from '@/services/content/offline-agri-full-article-readiness';

const soilSafetyDisclaimers = [
  'ข้อมูลนี้เป็นความรู้เบื้องต้น ยังไม่ใช่บทความฉบับตรวจทานสุดท้าย',
  'ควรตรวจสอบกับหน่วยงานเกษตร/ผู้เชี่ยวชาญในพื้นที่',
  'ถ้าดินมีปัญหารุนแรง ควรใช้ผลตรวจดินหรือคำแนะนำจากผู้เชี่ยวชาญก่อนตัดสินใจปรับปรุงแปลง',
];

export const offlineAgriPilotArticleDrafts: OfflineAgriPilotArticleDraft[] = [
  {
    id: 'pilot-draft-soil-types-before-planting-m68',
    slug: 'soil-types-before-planting',
    titleTh: 'ดิน 6 ชนิด รู้จักก่อนปลูก',
    reasonTh: 'หัวข้อความรู้พื้นฐาน ความเสี่ยงต่ำ และเหมาะกับการอ่านแบบออฟไลน์ก่อนวางแผนปลูก',
    status: 'reviewed_draft_candidate',
    summaryTh:
      'ร่างบทความนี้ช่วยให้เกษตรกรเริ่มสังเกตดินจากสี เนื้อดิน การจับตัว และพฤติกรรมน้ำแบบง่าย ๆ โดยยังไม่สรุปแทนผลตรวจดินจริง',
    relatedRoutes: ['/app/farm-area', '/app/articles/full-content-readiness'],
    isFinalOfficialArticle: false,
    fullPublishAllowed: false,
    noNetworkRequired: true,
    comparisonRows: [
      {
        soilTypeTh: 'ดินร่วน',
        easyObservationTh: 'จับแล้วนุ่ม ร่วนซุย ไม่แน่นเป็นก้อนแข็งเกินไป',
        waterBehaviorTh: 'รับน้ำและระบายน้ำได้ค่อนข้างสมดุล',
        broadUseCaseTh: 'มักเป็นดินที่เริ่มวางแผนปลูกพืชได้ง่ายกว่าดินที่แน่นหรือแห้งจัด',
        cautiousImprovementIdeaTh: 'รักษาอินทรียวัตถุ คลุมดิน และสังเกตความชื้นตามฤดูกาล',
      },
      {
        soilTypeTh: 'ดินทราย',
        easyObservationTh: 'เม็ดดินหยาบ จับแล้วแตกง่าย ไม่ค่อยเกาะตัว',
        waterBehaviorTh: 'น้ำซึมผ่านเร็ว ดินแห้งไว',
        broadUseCaseTh: 'อาจเหมาะกับพืชบางชนิดที่ไม่ชอบน้ำขัง แต่ต้องดูน้ำและธาตุอาหารอย่างระมัดระวัง',
        cautiousImprovementIdeaTh: 'เพิ่มอินทรียวัตถุและวางแผนให้น้ำแบบไม่ปล่อยให้แห้งนาน',
      },
      {
        soilTypeTh: 'ดินเหนียว',
        easyObservationTh: 'จับแล้วเหนียว ปั้นเป็นก้อนได้ง่าย เมื่อแห้งอาจแข็ง',
        waterBehaviorTh: 'อุ้มน้ำมาก ระบายน้ำช้ากว่าดินร่วนหรือดินทราย',
        broadUseCaseTh: 'อาจใช้ได้กับพืชที่ทนน้ำมากกว่า แต่ต้องระวังรากขาดอากาศและน้ำขัง',
        cautiousImprovementIdeaTh: 'ทำทางระบายน้ำ ยกแปลง หรือเพิ่มวัสดุอินทรีย์ตามคำแนะนำในพื้นที่',
      },
      {
        soilTypeTh: 'ดินลูกรัง',
        easyObservationTh: 'มีกรวดหรือเม็ดแข็ง สีแดง น้ำตาล หรือเหลืองปน',
        waterBehaviorTh: 'บางพื้นที่น้ำไหลผ่านเร็ว บางพื้นที่แน่นจนรากเดินยาก',
        broadUseCaseTh: 'ต้องดูความลึกของหน้าดินและแหล่งน้ำก่อนเลือกพืช',
        cautiousImprovementIdeaTh: 'เริ่มจากเก็บข้อมูลแปลงจริงและถามหน่วยงานท้องถิ่นก่อนลงทุนมาก',
      },
      {
        soilTypeTh: 'ดินเปรี้ยว',
        easyObservationTh: 'บางพื้นที่พบกลิ่น สี หรือคราบผิดปกติ และพืชโตช้าซ้ำ ๆ',
        waterBehaviorTh: 'ปัญหามักเกี่ยวกับสภาพเคมีของดิน ไม่ควรเดาจากการมองอย่างเดียว',
        broadUseCaseTh: 'ควรยืนยันด้วยการตรวจดินก่อนเลือกวิธีปรับปรุง',
        cautiousImprovementIdeaTh: 'อย่าใส่วัสดุปรับดินจากการเดา ควรถามผู้เชี่ยวชาญหรือหน่วยงานจริง',
      },
      {
        soilTypeTh: 'ดินเค็ม',
        easyObservationTh: 'อาจเห็นคราบขาวหรือพืชบางชนิดแสดงอาการผิดปกติ แต่ต้องตรวจยืนยัน',
        waterBehaviorTh: 'น้ำและเกลือในดินเกี่ยวข้องกัน ควรดูแหล่งน้ำและการระบายน้ำร่วมด้วย',
        broadUseCaseTh: 'ควรเลือกแนวทางตามพื้นที่จริง ไม่เหมารวมว่าพืชทุกชนิดปลูกได้เหมือนกัน',
        cautiousImprovementIdeaTh: 'ขอคำแนะนำจากผู้เชี่ยวชาญก่อนปรับปรุง เพราะแก้ผิดอาจเสียต้นทุน',
      },
    ],
    sections: [
      {
        id: 'soil-types-intro',
        kind: 'intro',
        headingTh: 'ทำไมต้องรู้จักดินก่อนปลูก',
        bodyTh: [
          'ดินเป็นจุดเริ่มต้นของการวางแผนแปลง เพราะดินแต่ละแบบเก็บน้ำ ระบายน้ำ และจับตัวไม่เหมือนกัน',
          'บทความฉบับร่างนี้ช่วยให้เริ่มสังเกตดินด้วยภาษาง่าย ๆ ก่อนนำข้อมูลไปคุยกับผู้เชี่ยวชาญหรือหน่วยงานเกษตรในพื้นที่',
        ],
      },
      {
        id: 'soil-types-comparison-table',
        kind: 'comparison_table',
        headingTh: 'ตารางเปรียบเทียบดิน 6 ชนิด',
        bodyTh: [
          'ตารางนี้เป็นภาพรวมเพื่อช่วยสังเกต ไม่ใช่ผลวิเคราะห์ดินและไม่ใช่คำแนะนำปลูกพืชแบบตายตัว',
        ],
      },
      {
        id: 'soil-types-touch-water',
        kind: 'observe_by_touch_water',
        headingTh: 'สังเกตด้วยมือและพฤติกรรมน้ำ',
        bodyTh: [
          'หยิบดินที่มีความชื้นพอดีมาลองบีบเบา ๆ ดูว่าดินแตกง่าย เป็นก้อน เหนียว หรือร่วน',
          'ลองรดน้ำเล็กน้อยในจุดสังเกต แล้วดูว่าน้ำซึมเร็ว ขังนาน หรือไหลออกจากผิวดินเร็วเกินไป',
        ],
        bulletsTh: [
          'จดวันที่และจุดที่สังเกต',
          'สังเกตหลายจุด ไม่ตัดสินจากจุดเดียว',
          'ถ่ายรูปเก็บไว้เพื่อถามผู้เชี่ยวชาญภายหลัง',
        ],
      },
      {
        id: 'soil-types-broad-use-cases',
        kind: 'broad_use_cases',
        headingTh: 'ตัวอย่างการใช้ข้อมูลแบบกว้าง ๆ',
        bodyTh: [
          'ดินร่วนอาจช่วยให้เริ่มวางแผนปลูกง่ายขึ้น แต่ยังต้องดูน้ำ แสง และประวัติแปลง',
          'ดินทราย ดินเหนียว ดินลูกรัง ดินเปรี้ยว และดินเค็ม มักต้องดูข้อจำกัดเฉพาะพื้นที่มากขึ้นก่อนเลือกพืช',
        ],
      },
      {
        id: 'soil-types-improvement',
        kind: 'basic_improvement_ideas',
        headingTh: 'แนวคิดปรับปรุงเบื้องต้น',
        bodyTh: [
          'แนวคิดที่ปลอดภัยกว่าคือเริ่มจากปรับการจัดการน้ำ เพิ่มอินทรียวัตถุ และลดการรบกวนหน้าดินเมื่อไม่จำเป็น',
          'สำหรับดินที่สงสัยว่าเปรี้ยว เค็ม หรือมีปัญหาซ้ำ ควรตรวจดินก่อนใช้วัสดุปรับปรุงหรือปุ๋ยใด ๆ',
        ],
      },
      {
        id: 'soil-types-mistakes',
        kind: 'mistakes_to_avoid',
        headingTh: 'ข้อผิดพลาดที่ควรเลี่ยง',
        bodyTh: [
          'อย่าตัดสินชนิดดินจากสีเพียงอย่างเดียว เพราะความชื้น อินทรียวัตถุ และประวัติแปลงมีผลต่อสิ่งที่เห็น',
          'อย่าใส่ปุ๋ยหรือวัสดุปรับดินตามคำบอกต่อโดยไม่ดูฉลาก ผลตรวจ หรือคำแนะนำในพื้นที่',
        ],
        bulletsTh: [
          'ไม่สรุปจากจุดเดียว',
          'ไม่เดาปัญหาเคมีของดินจากภาพถ่ายอย่างเดียว',
          'ไม่ลงทุนปรับแปลงใหญ่ก่อนทดลองหรือขอคำแนะนำ',
        ],
      },
      {
        id: 'soil-types-ask-expert',
        kind: 'ask_expert',
        headingTh: 'เมื่อไรควรถามหน่วยงานเกษตรหรือผู้เชี่ยวชาญ',
        bodyTh: [
          'ควรถามเมื่อพืชโตช้าซ้ำ ๆ ใบผิดปกติ น้ำขังนาน ดินแห้งเร็วผิดปกติ หรือสงสัยว่าดินเปรี้ยว/ดินเค็ม',
          'เตรียมรูปถ่าย บันทึกพื้นที่ พืชที่เคยปลูก และตัวอย่างดินหรือผลตรวจดินถ้ามี เพื่อให้คำแนะนำแม่นขึ้น',
        ],
      },
      {
        id: 'soil-types-related-tools',
        kind: 'related_tools',
        headingTh: 'เครื่องมือใน KasetHub ที่เกี่ยวข้อง',
        bodyTh: [
          'ใช้หน้าวัดพื้นที่แปลงเพื่อจัดข้อมูลขนาดแปลงก่อนคุยเรื่องการปรับปรุงดินหรือวางแผนปลูก',
        ],
        bulletsTh: ['เปิดเครื่องมือวัดพื้นที่แปลง', 'บันทึกจุดสังเกตของแปลงไว้ในเครื่อง'],
        relatedRoute: '/app/farm-area',
      },
      {
        id: 'soil-types-summary',
        kind: 'summary',
        headingTh: 'สรุป',
        bodyTh: [
          'การรู้จักดินช่วยให้ถามคำถามได้ดีขึ้นและลดการเดา แต่ยังต้องตรวจสอบกับข้อมูลจริงในพื้นที่',
          'บทความนี้เป็น draft candidate เพื่อรีวิวต่อ ไม่ใช่คำแนะนำทางการสุดท้าย',
        ],
      },
    ],
    review: {
      editorialStatus: 'reviewed_draft_candidate',
      reviewerPlaceholder: 'KasetHub editorial reviewer pending',
      lastReviewedPlaceholder: 'pending_final_human_review_date',
      sourcePlaceholders: [
        {
          id: 'soil-draft-source-local-observation',
          labelTh: 'บันทึกการสังเกตดินในพื้นที่จริง',
          status: 'placeholder_only',
          required: true,
          noteTh: 'ต้องเติมตัวอย่างการสังเกตที่ผ่านการตรวจทานก่อนเผยแพร่เป็นฉบับสุดท้าย',
        },
        {
          id: 'soil-draft-source-soil-test',
          labelTh: 'ผลตรวจดิน/ห้องปฏิบัติการเพื่อยืนยันกรณีเสี่ยง',
          status: 'placeholder_only',
          required: true,
          noteTh: 'ใช้เป็นหลักฐานเมื่อกล่าวถึงดินเปรี้ยว ดินเค็ม หรือปัญหาเคมีของดิน',
        },
        {
          id: 'soil-draft-source-local-office',
          labelTh: 'รีวิวจากหน่วยงานเกษตรหรือผู้เชี่ยวชาญในพื้นที่',
          status: 'placeholder_only',
          required: true,
          noteTh: 'ต้องยืนยันว่าภาษาไม่เหมารวมและไม่กลายเป็นคำแนะนำเฉพาะแปลง',
        },
      ],
      imageRequirements: [
        {
          id: 'soil-draft-cover-image',
          labelTh: 'ภาพปกเปรียบเทียบพื้นผิวดินแบบปลอดภัย',
          plannedPath: 'public/assets/articles/soil/soil-types-before-planting-cover.webp',
          aspectRatio: '16:9',
          altTextTh: 'ภาพตัวอย่างดินหลายชนิดสำหรับสังเกตก่อนปลูก',
          status: 'planned_only',
          required: true,
        },
        {
          id: 'soil-draft-touch-test-image',
          labelTh: 'ภาพสาธิตการจับดินด้วยมือ',
          plannedPath: 'public/assets/articles/soil/soil-types-before-planting-touch-test.webp',
          aspectRatio: '4:3',
          altTextTh: 'มือกำลังสังเกตเนื้อดินอย่างง่าย',
          status: 'planned_only',
          required: true,
        },
      ],
      safetyDisclaimersTh: soilSafetyDisclaimers,
      publishBlockers: [
        'final_human_review_missing',
        'source_placeholders_not_filled',
        'last_reviewed_date_required',
        'image_assets_not_reviewed',
        'publish_gate_must_remain_blocked_in_m68',
      ],
      reviewChecklistTh: [
        'ภาษาอ่านง่ายและไม่กล่าวอ้างเป็นคำแนะนำเฉพาะแปลง',
        'ไม่มีสูตรปุ๋ยหรือสารเคมีที่ยังไม่ได้ตรวจทาน',
        'คำเตือนพื้นฐานยังอยู่ครบ',
        'ตารางเปรียบเทียบใช้คำว่าแนวสังเกต ไม่ใช่ข้อสรุปทางการ',
        'มีช่องทางให้ถามหน่วยงานเกษตรหรือผู้เชี่ยวชาญ',
      ],
    },
  },
  {
    id: 'pilot-draft-soil-ph-reading-yourself-m69',
    slug: 'soil-ph-reading-yourself',
    offlineFallbackArticleSlug: 'soil-types-before-planting',
    titleTh: 'อ่านค่า pH ดิน ด้วยตัวเอง',
    reasonTh: 'หัวข้อความรู้พื้นฐานความเสี่ยงต่ำสำหรับเตรียมร่างในอนาคต โดยยังไม่ให้คำแนะนำปรับดินหรือใส่วัสดุเฉพาะ',
    status: 'draft_template',
    summaryTh:
      'ร่างแม่แบบนี้เตรียมโครงสำหรับอธิบายการอ่านค่า pH ดินแบบพื้นฐานในอนาคต แต่ยังไม่ใช่บทความเต็มและยังไม่สรุปวิธีปรับดินจากค่า pH',
    relatedRoutes: ['/app/articles/offline', '/app/articles/full-content-readiness'],
    isFinalOfficialArticle: false,
    fullPublishAllowed: false,
    noNetworkRequired: true,
    comparisonRows: [],
    sections: [
      {
        id: 'soil-ph-intro-template',
        kind: 'intro',
        headingTh: 'ทำไมค่า pH ดินจึงควรรู้ก่อนปรับปรุงแปลง',
        bodyTh: [
          'ส่วนนี้ยังเป็นแม่แบบร่าง ต้องรอแหล่งอ้างอิงและผู้เชี่ยวชาญตรวจทานก่อนเขียนเป็นบทความเต็ม',
        ],
      },
      {
        id: 'soil-ph-ask-expert-template',
        kind: 'ask_expert',
        headingTh: 'เมื่อไรควรถามผู้เชี่ยวชาญ',
        bodyTh: [
          'ถ้าผล pH ทำให้ต้องตัดสินใจลงทุนหรือปรับดินจริง ต้องใช้ผลตรวจและคำแนะนำในพื้นที่ ไม่ใช่อ่านจากบทความอย่างเดียว',
        ],
      },
      {
        id: 'soil-ph-summary-template',
        kind: 'summary',
        headingTh: 'สรุปสถานะร่าง',
        bodyTh: [
          'M69 เพิ่มเฉพาะ draft template สำหรับ QA workflow ยังไม่ใช่บทความทางการและยังไม่เผยแพร่เป็นเนื้อหาเต็ม',
        ],
      },
    ],
    review: {
      editorialStatus: 'draft_template',
      reviewerPlaceholder: 'KasetHub editorial reviewer pending',
      lastReviewedPlaceholder: 'pending_future_review_date',
      sourcePlaceholders: [
        {
          id: 'soil-ph-source-test-method',
          labelTh: 'แหล่งอ้างอิงวิธีอ่านค่า pH ดิน',
          status: 'placeholder_only',
          required: true,
          noteTh: 'ต้องเติมแหล่งอ้างอิงที่ตรวจทานแล้วก่อนเขียนบทความเต็ม',
        },
        {
          id: 'soil-ph-source-local-office',
          labelTh: 'รีวิวจากหน่วยงานเกษตรหรือผู้เชี่ยวชาญในพื้นที่',
          status: 'placeholder_only',
          required: true,
          noteTh: 'ต้องยืนยันว่าภาษาไม่กลายเป็นคำแนะนำปรับดินเฉพาะแปลง',
        },
      ],
      imageRequirements: [
        {
          id: 'soil-ph-cover-image',
          labelTh: 'ภาพปกชุดทดสอบ pH ดินแบบไม่ระบุยี่ห้อ',
          plannedPath: 'public/assets/articles/soil/soil-ph-reading-yourself-cover.webp',
          aspectRatio: '16:9',
          altTextTh: 'ภาพตัวอย่างการอ่านค่า pH ดินแบบพื้นฐาน',
          status: 'planned_only',
          required: true,
        },
      ],
      safetyDisclaimersTh: soilSafetyDisclaimers,
      publishBlockers: [
        'second_pilot_is_draft_template_only',
        'source_placeholders_not_filled',
        'final_human_review_missing',
        'image_assets_not_reviewed',
      ],
      reviewChecklistTh: [
        'ยังไม่เขียนคำแนะนำปรับดินจากค่า pH',
        'ต้องมีแหล่งอ้างอิงและผู้เชี่ยวชาญตรวจทานก่อนเป็นบทความเต็ม',
        'ต้องไม่มีสินค้า ยี่ห้อ หรือ sponsor แทรกในเนื้อหา',
      ],
    },
  },
];

export function getOfflineAgriPilotArticleDrafts() {
  return offlineAgriPilotArticleDrafts;
}

export function findOfflineAgriPilotArticleDraftBySlug(slug: string) {
  return offlineAgriPilotArticleDrafts.find((draft) => draft.slug === slug);
}

export function runPilotArticleDraftWorkflowReview(): PilotArticleDraftWorkflowSummary {
  return {
    pilotCount: offlineAgriPilotArticleDrafts.length,
    finalPublishAllowedCount: offlineAgriPilotArticleDrafts.filter((draft) => draft.fullPublishAllowed).length,
    blockedCount: offlineAgriPilotArticleDrafts.filter((draft) => !draft.fullPublishAllowed).length,
    drafts: offlineAgriPilotArticleDrafts,
    noNetworkRequired: true,
  };
}

export function getPilotArticleDraftPublishGate(slug: string) {
  const draft = findOfflineAgriPilotArticleDraftBySlug(slug);
  const m67Gate = getFullArticleReadinessByPilotSlug(slug);

  if (!draft) {
    return undefined;
  }

  return {
    slug,
    titleTh: draft.titleTh,
    fullPublishAllowed: false,
    blockers: Array.from(new Set([...draft.review.publishBlockers, ...(m67Gate?.blockers ?? [])])),
    safetyDisclaimersTh: draft.review.safetyDisclaimersTh,
    m67GateStatus: m67Gate?.status ?? 'blocked',
  };
}
