import type {
  AdminAuditLogPreview,
  AdminModuleId,
  AdminRole,
  AdminRiskItem,
  AdminTask,
} from '@/services/admin/admin.types';

export const adminRoleLabels: Record<AdminRole, string> = {
  owner: 'เจ้าของระบบ',
  admin: 'ผู้ดูแลระบบ',
  editor: 'บรรณาธิการ',
  moderator: 'ผู้ดูแลชุมชน',
  expert_reviewer: 'ผู้เชี่ยวชาญตรวจทาน',
  support: 'ทีมช่วยเหลือผู้ใช้',
};

export const adminModuleLabels: Record<AdminModuleId, string> = {
  content: 'คอนเทนต์',
  youtube_import: 'นำเข้า YouTube',
  community: 'ชุมชน',
  moderation: 'Moderation',
  crop_prices: 'ราคาพืชผล',
  crop_watch: 'พืชที่ติดตาม',
  farm_records: 'Farm Records',
  ai_safety: 'AI Safety',
  plant_analysis: 'วิเคราะห์โรคพืช',
  guest_sync: 'Guest Sync',
  auth: 'Auth',
  system_health: 'System Health',
};

export const adminDashboardBoundaries = [
  'หน้านี้เป็นตัวอย่างระบบผู้ดูแล ยังไม่มีสิทธิ์จริง',
  'ยังไม่เชื่อมต่อ backend',
  'การกดปุ่มในหน้านี้ไม่เปลี่ยนข้อมูลจริงบน server',
  'ไม่มี Supabase write, service-role key, admin auth, YouTube API, AI provider หรือ network call',
];

export const adminRolePermissionNotes: Array<{ role: AdminRole; permissions: string[] }> = [
  {
    role: 'owner',
    permissions: ['ตั้งค่าสิทธิ์', 'ดู audit logs', 'อนุมัตินโยบายระบบ', 'จัดการแหล่งข้อมูลสำคัญ'],
  },
  {
    role: 'admin',
    permissions: ['จัดการผู้ใช้', 'ดูระบบสุขภาพ', 'มอบหมายคิวตรวจ', 'แก้ไขสถานะงาน'],
  },
  {
    role: 'editor',
    permissions: ['ตรวจบทความ', 'เผยแพร่คอนเทนต์', 'อนุมัตินำเข้าวิดีโอ', 'จัดหมวดหมู่เนื้อหา'],
  },
  {
    role: 'moderator',
    permissions: ['ตรวจรายงานชุมชน', 'ซ่อน/ปลดซ่อนเนื้อหา', 'ส่งต่อรายงานเสี่ยง', 'บันทึกเหตุผล moderation'],
  },
  {
    role: 'expert_reviewer',
    permissions: ['ตรวจคำแนะนำโรคพืช', 'ตรวจสารเคมี/ปุ๋ย', 'ตรวจราคาอ้างอิง', 'ให้ความเห็นเชิงผู้เชี่ยวชาญ'],
  },
  {
    role: 'support',
    permissions: ['ช่วยผู้ใช้เรื่องบัญชี', 'ดูสถานะ guest sync', 'ช่วยกู้ข้อมูลตามนโยบาย', 'เปิดเคสให้ admin'],
  },
];

export const adminFixtureTasks: AdminTask[] = [
  {
    id: 'admin-task-content-review',
    moduleId: 'content',
    title: 'ตรวจบทความที่มาจากวิดีโอ',
    description: 'บทความจาก YouTube ต้องมี source, safety note และ editor review ก่อนเผยแพร่จริง',
    status: 'mock_only',
    priority: 'medium',
    ownerRole: 'editor',
  },
  {
    id: 'admin-task-community-reports',
    moduleId: 'moderation',
    title: 'จัดคิวรายงานชุมชน',
    description: 'รายงานสารเคมี/โรคพืชควรถูกส่งต่อ expert reviewer ก่อนแสดงเป็นคำแนะนำ',
    status: 'todo',
    priority: 'high',
    ownerRole: 'moderator',
  },
  {
    id: 'admin-task-price-review',
    moduleId: 'crop_prices',
    title: 'วางขั้นตอนตรวจราคาอ้างอิง',
    description: 'แหล่ง OAE, DIT, ตลาดไท และ community report ต้องมี freshness และ attribution policy',
    status: 'in_review',
    priority: 'high',
    ownerRole: 'expert_reviewer',
  },
  {
    id: 'admin-task-system-rbac',
    moduleId: 'system_health',
    title: 'ออกแบบ RBAC และ audit logs',
    description: 'ก่อนมี admin จริง ต้องกำหนด role, permission, RLS และ server-side audit trail',
    status: 'blocked',
    priority: 'high',
    ownerRole: 'owner',
  },
];

export const adminFixtureRisks: AdminRiskItem[] = [
  {
    id: 'admin-risk-no-admin-auth',
    moduleId: 'auth',
    title: 'ยังไม่มี admin auth จริง',
    description: 'ทุกหน้าผู้ดูแลเป็น preview เท่านั้น ไม่มีสิทธิ์จริงและไม่ควรเปิดเป็น production admin',
    severity: 'high',
    recommendedAction: 'เพิ่ม backend-owned RBAC และ route guard ก่อนเชื่อมข้อมูลจริง',
  },
  {
    id: 'admin-risk-ai-safety',
    moduleId: 'ai_safety',
    title: 'คำแนะนำเสี่ยงต้องไม่ถูก auto-publish',
    description: 'คำถามโรคพืช สารเคมี ปุ๋ย และราคาอ้างอิงต้องมี safety policy และ review queue',
    severity: 'high',
    recommendedAction: 'สร้าง expert_review_requests และ ai_safety_review_logs ใน backend',
  },
  {
    id: 'admin-risk-community',
    moduleId: 'moderation',
    title: 'รายงานชุมชนยังอยู่ในเครื่อง',
    description: 'M23 report/hide เป็น local-only จึงไม่ใช่การจัดการชุมชนจริง',
    severity: 'medium',
    recommendedAction: 'เพิ่ม community_reports, moderation_queue และ moderation_actions พร้อม RLS',
  },
];

export const adminFixtureAuditLogs: AdminAuditLogPreview[] = [
  {
    id: 'audit-preview-001',
    actorLabel: 'ระบบตัวอย่าง',
    role: 'admin',
    moduleId: 'system_health',
    actionLabel: 'เปิดดู Admin Dashboard',
    targetLabel: '/app/admin',
    status: 'preview_only',
    createdAtLabel: 'ตัวอย่าง 23 พ.ค. 2569',
  },
  {
    id: 'audit-preview-002',
    actorLabel: 'บรรณาธิการตัวอย่าง',
    role: 'editor',
    moduleId: 'youtube_import',
    actionLabel: 'ตรวจแผนนำเข้า YouTube',
    targetLabel: '@ruengkaset',
    status: 'preview_only',
    createdAtLabel: 'ตัวอย่าง 23 พ.ค. 2569',
  },
  {
    id: 'audit-preview-003',
    actorLabel: 'ผู้ดูแลชุมชนตัวอย่าง',
    role: 'moderator',
    moduleId: 'moderation',
    actionLabel: 'ดูคิวรายงานชุมชน',
    targetLabel: 'mock moderator queue',
    status: 'blocked',
    createdAtLabel: 'ยังไม่ใช่ action จริง',
  },
];
