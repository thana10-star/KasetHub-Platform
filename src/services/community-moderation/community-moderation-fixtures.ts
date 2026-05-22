import type {
  CommunityReportReason,
  CommunityRule,
  CommunitySafetyNotice,
  ModerationAction,
  ModerationStatus,
  ModeratorQueueItem,
} from '@/services/community-moderation/community-moderation.types';

export const communityReportReasonLabels: Record<CommunityReportReason, string> = {
  spam: 'สแปมหรือโฆษณาซ้ำ',
  rude_or_harassment: 'ถ้อยคำไม่สุภาพหรือคุกคาม',
  dangerous_advice: 'คำแนะนำที่อาจเป็นอันตราย',
  chemical_or_pesticide_risk: 'เสี่ยงเรื่องสารเคมี/สารกำจัดศัตรูพืช',
  scam_or_fake_sale: 'หลอกขายหรือประกาศขายปลอม',
  off_topic: 'ไม่เกี่ยวกับหัวข้อเกษตร',
  personal_data: 'เปิดเผยข้อมูลส่วนบุคคล',
  other: 'เหตุผลอื่น',
};

export const moderationStatusLabels: Record<ModerationStatus, string> = {
  pending_review: 'รอตรวจสอบ',
  reviewed: 'ตรวจแล้ว',
  action_taken: 'ดำเนินการแล้ว',
  dismissed: 'ไม่พบปัญหา',
};

export const moderationActionLabels: Record<ModerationAction, string> = {
  none: 'ยังไม่ดำเนินการ',
  hide_content: 'ซ่อนเนื้อหา',
  show_warning: 'แสดงคำเตือน',
  remove_content: 'ลบเนื้อหาในอนาคต',
  escalate_to_expert: 'ส่งต่อผู้เชี่ยวชาญ',
  future_admin_review: 'รอผู้ดูแลจริงในอนาคต',
};

export const communityRules: CommunityRule[] = [
  {
    id: 'respectful-discussion',
    title: 'คุยกันด้วยความเคารพ',
    summary: 'ถาม ตอบ และเห็นต่างได้โดยไม่โจมตีตัวบุคคล',
    detail: 'หลีกเลี่ยงคำหยาบ การล้อเลียน การข่มขู่ หรือการกล่าวหาที่ไม่มีหลักฐาน เพื่อให้เกษตรกรทุกวัยกล้าถามและแบ่งปันประสบการณ์',
    priority: 1,
    tone: 'green',
  },
  {
    id: 'no-scam-fake-sale',
    title: 'ไม่หลอกขายหรือประกาศขายปลอม',
    summary: 'ห้ามชวนโอนเงิน ขายของปลอม หรือใช้ราคาที่ทำให้เข้าใจผิด',
    detail: 'โพสต์ซื้อขายในอนาคตต้องมีข้อมูลผู้ขาย แหล่งสินค้า เงื่อนไขราคา และหลักฐานที่ตรวจสอบได้ก่อนเปิดใช้จริง',
    priority: 2,
    tone: 'rose',
  },
  {
    id: 'no-dangerous-chemical-advice',
    title: 'ไม่แนะนำสารเคมีแบบเสี่ยงอันตราย',
    summary: 'คำแนะนำเรื่องสารเคมี/โรคพืชควรตรวจสอบกับผู้เชี่ยวชาญ',
    detail: 'ห้ามแนะนำปริมาณเกินฉลาก ผสมสารแบบไม่ปลอดภัย หรือบอกให้ใช้สารต้องห้าม ควรอ้างอิงฉลาก เจ้าหน้าที่เกษตร หรือผู้เชี่ยวชาญในพื้นที่',
    priority: 3,
    tone: 'gold',
  },
  {
    id: 'no-personal-data',
    title: 'ไม่โพสต์ข้อมูลส่วนตัว',
    summary: 'ไม่ลงเบอร์โทร ที่อยู่ เลขบัญชี หรือข้อมูลคนอื่นโดยไม่ได้รับอนุญาต',
    detail: 'ข้อมูลติดต่อควรถูกจัดการผ่านระบบที่ปลอดภัยในอนาคต ไม่ควรเผยแพร่ในโพสต์สาธารณะ',
    priority: 4,
    tone: 'sky',
  },
  {
    id: 'responsible-photos',
    title: 'ใช้รูปภาพอย่างรับผิดชอบ',
    summary: 'ลงรูปแปลง พืช หรือสินค้าโดยไม่เปิดเผยหน้าคนอื่นหรือข้อมูลส่วนตัว',
    detail: 'รูปภาพควรเกี่ยวข้องกับคำถามหรือคำตอบ และควรหลีกเลี่ยงภาพที่อาจทำให้ผู้อื่นเสียหาย',
    priority: 5,
    tone: 'neutral',
  },
  {
    id: 'source-guidance',
    title: 'บอกแหล่งที่มาเมื่อเป็นคำแนะนำสำคัญ',
    summary: 'ถ้าอ้างราคาหรือวิธีรักษาโรคพืช ให้บอกที่มาและวันที่ถ้ามี',
    detail: 'ข้อมูลราคาเป็นราคาอ้างอิงเท่านั้น ส่วนคำแนะนำโรคพืชหรือสารเคมีควรมีคำเตือนให้ตรวจสอบก่อนใช้จริง',
    priority: 6,
    tone: 'green',
  },
];

export const communitySafetyNotices: CommunitySafetyNotice[] = [
  {
    id: 'local-only-report',
    title: 'รายงานนี้ยังเป็นข้อมูลในเครื่องเท่านั้น',
    body: 'ยังไม่มีผู้ดูแลระบบจริงในเวอร์ชันนี้ รายงานและการซ่อนโพสต์ใช้สำหรับต้นแบบ UX เท่านั้น',
    tone: 'warning',
  },
  {
    id: 'agriculture-advice-risk',
    title: 'ตรวจสอบคำแนะนำสำคัญก่อนใช้จริง',
    body: 'คำแนะนำเรื่องสารเคมี/โรคพืชควรตรวจสอบกับผู้เชี่ยวชาญ เจ้าหน้าที่เกษตร หรือฉลากผลิตภัณฑ์ทุกครั้ง',
    tone: 'danger',
  },
];

export const mockModeratorQueueItems: ModeratorQueueItem[] = [
  {
    id: 'queue-demo-001',
    postId: 'post-001',
    title: 'ตรวจคำแนะนำโรคพืชหลังฝนตก',
    excerpt: 'โพสต์ตัวอย่างเกี่ยวกับใบข้าวมีจุดสีน้ำตาล ควรมีคำเตือนให้ตรวจสอบโรคพืชก่อนใช้สาร',
    reason: 'chemical_or_pesticide_risk',
    status: 'pending_review',
    recommendedAction: 'show_warning',
    createdAt: 'ตัวอย่าง 22 พ.ค. 2569',
    source: 'fixture',
    notes: 'คิวตัวอย่างเท่านั้น ยังไม่มีผู้ดูแลจริง',
  },
  {
    id: 'queue-demo-002',
    postId: 'post-002',
    title: 'ตรวจโพสต์แบ่งปันตารางน้ำทุเรียน',
    excerpt: 'โพสต์ตัวอย่างเป็นความรู้จากประสบการณ์ ควรติดป้ายว่าเป็นตัวอย่างโพสต์',
    reason: 'other',
    status: 'reviewed',
    recommendedAction: 'none',
    createdAt: 'ตัวอย่าง 21 พ.ค. 2569',
    source: 'fixture',
    notes: 'ไม่มีการดำเนินการจริง',
  },
  {
    id: 'queue-demo-003',
    postId: 'post-003',
    title: 'ตรวจการอ้างผลปุ๋ยหมักในผักสลัด',
    excerpt: 'ควรระวังการตีความเป็นผลรับรอง ควรบอกว่าเป็นประสบการณ์และขึ้นกับพื้นที่',
    reason: 'dangerous_advice',
    status: 'dismissed',
    recommendedAction: 'future_admin_review',
    createdAt: 'ตัวอย่าง 20 พ.ค. 2569',
    source: 'fixture',
    notes: 'ใช้ฝึกหน้าคิวผู้ดูแลในอนาคต',
  },
];
