import { mvpRouteGroups } from '@/services/qa/route-registry';
import type {
  MvpModuleReadiness,
  MvpReadinessAudit,
  MvpReadinessStatus,
  MvpRiskLevel,
  MvpRouteGroupId,
} from '@/services/qa/mvp-readiness.types';

const statusOrder: MvpReadinessStatus[] = [
  'ready_mock',
  'needs_backend',
  'needs_real_api',
  'blocked',
  'documentation_only',
];

const highRiskLevels: MvpRiskLevel[] = ['high', 'critical'];

const routeListFor = (id: MvpRouteGroupId) =>
  mvpRouteGroups.find((group) => group.id === id)?.routes.map((route) => route.route) ?? [];

const moduleReadiness: MvpModuleReadiness[] = [
  {
    id: 'core_app',
    name: 'Core app',
    status: 'ready_mock',
    riskLevel: 'medium',
    summary: 'โครงหลักของแอปพร้อมสำหรับ prototype ภายใน และยังใช้ localStorage/fixtures เป็นหลัก',
    currentStorageMode: 'localStorage + typed fixtures',
    mockBoundaries: ['ไม่มี user account จริง', 'ไม่มี cloud backup', 'การแจ้งเตือนเป็นตัวอย่าง', 'สภาพอากาศเป็น mock/local', 'พื้นที่แปลงเป็นการคำนวณประมาณการ'],
    nextAction: 'ทดสอบกับผู้ใช้จริงกลุ่มเล็กและลด UI ที่เป็น developer/admin ออกจาก production surface',
    routes: routeListFor('core_app'),
  },
  {
    id: 'agriculture_calculators',
    name: 'Agriculture calculators',
    status: 'ready_mock',
    riskLevel: 'medium',
    summary: 'เครื่องคำนวณเกษตร M49 พร้อมเป็น foundation แบบ local-only แต่ยังไม่ใช่คำแนะนำทางวิชาการเกษตร',
    currentStorageMode: 'pure calculation utilities + localStorage history/favorites/last inputs',
    mockBoundaries: ['ไม่มี backend write', 'ไม่มี AI recommendation', 'ไม่มี agronomist guarantee', 'ไม่มี sponsor/affiliate routing'],
    nextAction: 'ทดสอบสูตรกับผู้ใช้จริงและแยกชั้น future recommendation/sponsor integration ให้ไม่ปะปนกับผลคำนวณพื้นฐาน',
    routes: routeListFor('agriculture_calculators'),
  },
  {
    id: 'content_youtube',
    name: 'Content / YouTube',
    status: 'needs_backend',
    riskLevel: 'high',
    summary: 'คอนเทนต์และ YouTube พร้อมด้าน UX/contract แต่ยังไม่เชื่อม CMS หรือ YouTube API จริง',
    currentStorageMode: 'fixtures + Guest Memory saves',
    mockBoundaries: ['วิดีโอยังคงเป็น mock', 'ไม่มี publish workflow จริง', 'ไม่มี YouTube API/import job'],
    nextAction: 'ทำ staging CMS/import approval workflow พร้อม source attribution ก่อนเปิดใช้งานจริง',
    routes: routeListFor('content_youtube'),
  },
  {
    id: 'ai_plant_analysis',
    name: 'AI / Plant analysis',
    status: 'needs_real_api',
    riskLevel: 'critical',
    summary: 'AI flows พร้อมทดลอง UX แต่ยังไม่มี provider จริง, upload จริง, หรือ expert review',
    currentStorageMode: 'local fixtures + local AI credits',
    mockBoundaries: ['ไม่มี AI provider call', 'ไม่มี image upload', 'ผลวิเคราะห์เป็นตัวอย่างเท่านั้น'],
    nextAction: 'สร้าง backend proxy staging พร้อม credit enforcement, safety logging, และ provider-key protection',
    routes: routeListFor('ai_plant_analysis'),
  },
  {
    id: 'prices_crop_watch',
    name: 'Prices / Crop watch',
    status: 'needs_real_api',
    riskLevel: 'high',
    summary: 'ราคาอ้างอิงและ crop watch มี UX foundation แล้ว แต่ยังไม่มีแหล่งราคาจริงหรือ alert job',
    currentStorageMode: 'demo fixtures + crop watch localStorage',
    mockBoundaries: ['ราคาเป็น demo/reference sample', 'ไม่มี OAE/DIT/market API', 'ไม่มี push notification'],
    nextAction: 'ทำ admin review และ source freshness policy ก่อนเชื่อมข้อมูลราคาจริง',
    routes: routeListFor('prices_crop_watch'),
  },
  {
    id: 'community_moderation',
    name: 'Community / Moderation',
    status: 'needs_backend',
    riskLevel: 'high',
    summary: 'ชุมชนมี report/hide local UX และกติกาแล้ว แต่ยังไม่มี report backend หรือ moderator workflow จริง',
    currentStorageMode: 'community fixtures + moderation localStorage',
    mockBoundaries: ['รายงานอยู่ในเครื่อง', 'ไม่มี moderator action จริง', 'ไม่มี abuse/rate limit'],
    nextAction: 'เพิ่ม authenticated report creation, RLS, queue assignment, และ audit log ใน staging',
    routes: routeListFor('community_moderation'),
  },
  {
    id: 'auth_account_sync',
    name: 'Auth / Account / Sync',
    status: 'blocked',
    riskLevel: 'critical',
    summary: 'auth และ sync ยังเป็น mock/local ทั้งหมด ต้องมี staging auth/session ownership ก่อน cloud sync',
    currentStorageMode: 'Guest Memory localStorage + mock sessions',
    mockBoundaries: ['ไม่มี OTP จริง', 'ไม่มี Supabase Auth session', 'ไม่มี Edge Function deployment', 'ไม่มี cloud sync'],
    nextAction: 'เปิด phone OTP staging อย่างควบคุม แล้วทดสอบ Guest Sync Edge Function หลังมี session owner จริง',
    routes: routeListFor('auth_account_sync'),
  },
  {
    id: 'supabase_staging',
    name: 'Supabase / Staging',
    status: 'documentation_only',
    riskLevel: 'high',
    summary: 'readiness, connection dry-run, และ SQL checklist พร้อมเป็นคู่มือ แต่ยังไม่เชื่อม staging จริง',
    currentStorageMode: 'docs/checklists + env placeholders',
    mockBoundaries: ['ไม่มี Supabase connection โดยค่าเริ่มต้น', 'ยังไม่รัน SQL/RLS', 'ไม่มี keys ใน repo'],
    nextAction: 'สร้าง staging project, ใส่ anon key เฉพาะ local/Cloudflare env, แล้วรัน SQL/RLS แบบ manual',
    routes: routeListFor('supabase_staging'),
  },
  {
    id: 'admin_qa',
    name: 'Admin / QA',
    status: 'ready_mock',
    riskLevel: 'medium',
    summary: 'Admin Dashboard และ QA snapshot พร้อมช่วยตรวจ prototype แต่ยังไม่มี admin auth/RBAC จริง',
    currentStorageMode: 'computed fixtures + local service summaries',
    mockBoundaries: ['ไม่มี admin permission จริง', 'ปุ่ม action ไม่เปลี่ยนข้อมูลบน server', 'audit log เป็น preview'],
    nextAction: 'เพิ่ม RBAC, admin audit logs, และ staging-only admin auth ก่อนใช้กับข้อมูลจริง',
    routes: routeListFor('admin_qa'),
  },
];

const createEmptyStatusCounts = (): Record<MvpReadinessStatus, number> =>
  statusOrder.reduce(
    (counts, status) => ({
      ...counts,
      [status]: 0,
    }),
    {} as Record<MvpReadinessStatus, number>,
  );

export function runMvpReadinessAudit(): MvpReadinessAudit {
  const statusCounts = moduleReadiness.reduce((counts, module) => {
    counts[module.status] += 1;
    return counts;
  }, createEmptyStatusCounts());
  const routeCount = mvpRouteGroups.reduce((count, group) => count + group.routes.length, 0);
  const highRiskCount = moduleReadiness.filter((module) => highRiskLevels.includes(module.riskLevel)).length;

  return {
    generatedAt: '2026-05-24T00:00:00+07:00',
    overallStatus: 'production_blocked',
    overallLabel: 'Internal MVP / Prototype ready for staging preparation, not production',
    routeCount,
    routeGroups: mvpRouteGroups,
    modules: moduleReadiness,
    statusCounts,
    highRiskCount,
    storageMode: 'Local fixtures and versioned localStorage only; no backend writes, no real auth, no provider calls.',
    storageReadiness: [
      {
        label: 'Guest Memory',
        status: 'ready_mock',
        detail: 'บันทึก saved items, likes, follows, My Farm และ AI history ใน localStorage เท่านั้น',
      },
      {
        label: 'Agriculture calculators',
        status: 'ready_mock',
        detail: 'ประวัติ รายการโปรด และค่าล่าสุดอยู่ใน localStorage เท่านั้น ไม่มี Supabase write หรือ cloud sync',
      },
      {
        label: 'Farm Records and ledger',
        status: 'ready_mock',
        detail: 'M93 keeps Farm Records local under kasethub.farmRecords.v1, keeps the compact M92.1 Home launcher, adds a dedicated My Farm bottom-nav slot, and groups Profile so internal/Admin/QA links are separated from farmer-facing navigation. Detailed Farm Records metrics stay in My Farm/Farm Records, including local plots, cycles, activity/finance/harvest flows, harvest yield summaries, cost-per-kg analytics, category breakdown, break-even estimates, JSON/CSV export, guarded JSON restore, restore risk review, sync consent prototype visibility, and no GPS, cloud sync, Supabase writes, AI processing, or official tax/accounting claims',
      },
      {
        label: 'Supabase staging',
        status: 'documentation_only',
        detail: 'มี env/checklist/dry-run boundary แต่ยังไม่เชื่อมต่อและยังไม่รัน SQL',
      },
      {
        label: 'Auth sessions',
        status: 'blocked',
        detail: 'ยังไม่มี session ownership จริง จึงยังไม่เปิด cloud sync หรือ user-owned writes',
      },
      {
        label: 'AI / image storage',
        status: 'needs_real_api',
        detail: 'ยังไม่มี AI provider, upload, storage bucket, moderation, หรือ backend queue จริง',
      },
      {
        label: 'Store readiness',
        status: 'blocked',
        detail: 'ยังไม่พร้อมเผยแพร่ production/store เพราะยังไม่มี backend, privacy review, auth, monitoring และ legal review',
      },
    ],
    productionBlockers: [
      'ยังไม่มี Supabase staging connection, SQL/RLS execution, หรือ real auth session',
      'ยังไม่มี backend writes, Edge Function deployment, admin auth/RBAC, หรือ audit log จริง',
      'AI และ plant analysis ยังใช้ fixture ไม่มี provider, upload, expert escalation, หรือ safety monitoring จริง',
      'ราคาอ้างอิงยังเป็น demo/sample ไม่มีแหล่งข้อมูล OAE/DIT/market จริงและไม่มี freshness policy ที่ enforce ด้วยระบบ',
      'สภาพอากาศยังเป็น demo/sample ไม่มีแหล่งข้อมูล TMD/provider จริง ไม่มี geolocation และไม่มี freshness policy ที่ enforce ด้วยระบบ',
      'การคำนวณพื้นที่แปลงยังเป็น local estimate ไม่มี GPS, map API, survey workflow, หรือการรังวัดทางการ',
      'ชุมชนและ moderation ยังเป็น local/mock ไม่มี report pipeline, abuse controls, หรือ moderator review จริง',
      'ยังไม่มี production privacy/security review, monitoring, rate limit, backup, rollback, หรือ incident plan',
    ],
    nextRecommendedMilestones: [
      'M35 Controlled Supabase staging auth adapter: เปิด phone OTP เฉพาะ staging พร้อม session ownership checks',
      'M36 Guest Sync Edge Function staging implementation: deploy endpoint, test idempotency, audit, and rollback',
      'M37 Admin RBAC staging: owner/admin/moderator/editor roles, audit logs, and protected review queues',
      'M38 AI backend proxy staging: provider-key protection, credit enforcement, safety logging, and image upload pipeline',
      'M39 Content, crop price, weather, farm area, and My Farm staging plans: admin review, source attribution, freshness, location privacy, and correction workflow',
    ],
    nextPhaseOptions: [
      {
        id: 'supabase_auth_first',
        label: 'Auth + Supabase staging first',
        description: 'ลดความเสี่ยงเรื่อง ownership และ RLS ก่อน cloud sync หรือ community writes',
        risk: 'medium',
      },
      {
        id: 'guest_sync_first',
        label: 'Guest Sync Edge Function next',
        description: 'ทำได้หลังมี auth staging แล้ว เพื่อพิสูจน์การ merge ข้อมูล guest ไป cloud แบบ idempotent',
        risk: 'high',
      },
      {
        id: 'ai_backend_first',
        label: 'AI backend proxy staging',
        description: 'เหมาะถ้าต้องการทดสอบคุณค่าหลักของ AI แต่ต้องมี safety/cost guardrails ก่อน',
        risk: 'critical',
      },
      {
        id: 'admin_cms_first',
        label: 'Admin + CMS staging',
        description: 'เหมาะกับการควบคุม content, moderation, source review และ audit ก่อนเปิดผู้ใช้จริง',
        risk: 'high',
      },
    ],
    qaChecklist: [
      'ตรวจ route สำคัญทุกกลุ่มบน mobile viewport และดูว่าไม่มีข้อความ production claim',
      'ยืนยันว่าไม่มี .env.local หรือ key จริงถูก commit',
      'ยืนยันว่า feature flags backend/auth/cloud sync ยังคงปิดโดยค่าเริ่มต้น',
      'ตรวจว่า AI, price, moderation, auth, Supabase และ sync surfaces มีป้าย local/mock/demo ชัดเจน',
      'รัน npm run lint และ npm run build ก่อนส่งต่อ next phase',
    ],
  };
}
