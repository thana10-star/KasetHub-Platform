import type {
  SupabaseStagingChecklistItem,
  SupabaseStagingProjectChecklist,
} from '@/services/supabase/supabase-staging-project-checklist.types';

const projectCreationChecklist: SupabaseStagingChecklistItem[] = [
  {
    id: 'create-staging-project',
    category: 'project_creation',
    title: 'สร้าง Supabase project สำหรับ staging เท่านั้น',
    detail: 'ใช้ชื่อ kasethub-staging หรือชื่อที่เห็นแล้วรู้ทันทีว่าไม่ใช่ production',
    evidence: 'Supabase Dashboard project name',
  },
  {
    id: 'choose-region',
    category: 'project_creation',
    title: 'เลือก region ใกล้ประเทศไทย',
    detail: 'เลือก Singapore หรือ region ใกล้ไทยถ้ามี เพื่อเตรียม latency ที่เหมาะกับผู้ใช้ไทย',
    evidence: 'Project settings region',
  },
  {
    id: 'save-url-anon-locally',
    category: 'project_creation',
    title: 'เก็บ Project URL และ anon key ไว้ในเครื่องเท่านั้น',
    detail: 'ใส่ค่าใน .env.local ภายหลัง ห้าม commit และห้ามใส่ service-role key ใน frontend',
    evidence: '.env.local local-only',
  },
  {
    id: 'find-dashboard-areas',
    category: 'project_creation',
    title: 'จดตำแหน่งเมนูสำคัญใน Dashboard',
    detail: 'SQL Editor, Authentication settings, Storage settings, และ Edge Functions ใช้สำหรับ milestone ถัดไป',
    evidence: 'Dashboard navigation screenshots',
  },
];

const sqlExecutionChecklist: SupabaseStagingChecklistItem[] = [
  {
    id: 'confirm-staging-before-sql',
    category: 'sql_execution',
    title: 'ยืนยันว่าอยู่บน staging ก่อนรัน SQL',
    detail: 'หยุดทันทีถ้า project ไม่ได้ชื่อ staging หรือมีข้อมูล production',
    evidence: 'Project name screenshot',
  },
  {
    id: 'run-schema-first',
    category: 'sql_execution',
    title: 'รัน schema SQL ก่อน',
    detail: 'คัดลอกไฟล์ supabase/migrations/0001_kasethub_core_schema.sql ทั้งไฟล์ไปที่ SQL Editor',
    evidence: 'SQL Editor success output',
  },
  {
    id: 'run-rls-second',
    category: 'sql_execution',
    title: 'รัน RLS policy SQL เป็นลำดับที่สอง',
    detail: 'คัดลอกไฟล์ supabase/policies/0001_kasethub_rls_policies.sql ทั้งไฟล์หลัง schema สำเร็จแล้ว',
    evidence: 'RLS SQL success output',
  },
  {
    id: 'stop-on-error',
    category: 'sql_execution',
    title: 'หยุดถ้าเจอ SQL error',
    detail: 'อย่ารันซ้ำแบบเดาสุ่ม ให้บันทึก error, screenshot, และตรวจ rollback/cleanup plan ก่อน',
    evidence: 'Error screenshot or copied message',
  },
  {
    id: 'no-public-write-policy',
    category: 'sql_execution',
    title: 'ตรวจว่าไม่มี public write policy',
    detail: 'anon/public read อนุญาตเฉพาะข้อมูลที่ตั้งใจให้ public เท่านั้น ห้ามเพิ่ม insert/update/delete แบบ public',
    evidence: 'Policy list review',
  },
];

const postSqlVerificationChecklist: SupabaseStagingChecklistItem[] = [
  {
    id: 'verify-table-list',
    category: 'post_sql_verification',
    title: 'ตรวจ table list',
    detail: 'ตารางหลักจาก SQL draft ต้องปรากฏใน Table Editor และไม่มีตาราง production ที่ไม่เกี่ยวข้อง',
    evidence: 'Table Editor screenshot',
  },
  {
    id: 'verify-rls-enabled',
    category: 'post_sql_verification',
    title: 'ตรวจ RLS enabled',
    detail: 'ตาราง user-owned และ sensitive tables ต้องเปิด RLS ก่อนทดสอบ auth หรือ sync',
    evidence: 'RLS status screenshot',
  },
  {
    id: 'verify-indexes-triggers',
    category: 'post_sql_verification',
    title: 'ตรวจ indexes และ triggers',
    detail: 'ตรวจ constraints, indexes, updated_at triggers, และ foreign keys ตาม manual verification pack',
    evidence: 'Database inspection screenshots',
  },
  {
    id: 'safe-select-only',
    category: 'post_sql_verification',
    title: 'ทดสอบได้เฉพาะ safe SELECT ถ้าจำเป็น',
    detail: 'ยังไม่ทดสอบ auth, cloud sync, uploads, Edge Functions, AI, insert/update/delete หรือ app writes',
    evidence: 'Read-only SQL result',
  },
];

const blockers: SupabaseStagingChecklistItem[] = [
  {
    id: 'production-project',
    category: 'safety_blocker',
    title: 'ห้ามใช้ production project',
    detail: 'M40 อนุญาตเฉพาะ staging project ใหม่เท่านั้น',
  },
  {
    id: 'service-role-frontend',
    category: 'safety_blocker',
    title: 'ห้ามใส่ service-role key ใน frontend',
    detail: 'ใช้เฉพาะ anon key ใน .env.local และเก็บ service-role ไว้ใน backend/Edge Function secret store ในอนาคต',
  },
  {
    id: 'sql-error',
    category: 'safety_blocker',
    title: 'หยุดเมื่อ SQL error',
    detail: 'บันทึก error และแก้แผน rollback ก่อนทำต่อ ห้ามรัน migration ซ้ำแบบไม่เข้าใจสาเหตุ',
  },
  {
    id: 'auth-sync-too-early',
    category: 'safety_blocker',
    title: 'ยังไม่เปิด auth หรือ cloud sync',
    detail: 'หลัง SQL/RLS ผ่านแล้วจึงวางแผนทดสอบ phone auth และ Guest Sync staging ต่อ',
  },
];

export function buildSupabaseStagingProjectChecklist(): SupabaseStagingProjectChecklist {
  return {
    milestone: 'M40',
    recommendedProjectName: 'kasethub-staging',
    regionGuidance: 'เลือก Singapore หรือ region ใกล้ประเทศไทยถ้ามี',
    schemaSqlPath: 'supabase/migrations/0001_kasethub_core_schema.sql',
    rlsSqlPath: 'supabase/policies/0001_kasethub_rls_policies.sql',
    projectCreationChecklist,
    sqlExecutionChecklist,
    postSqlVerificationChecklist,
    blockers,
    notices: [
      'ขั้นตอนนี้ยังเป็นคู่มือ ยังไม่ได้เชื่อมต่อจริง',
      'รัน SQL เฉพาะ staging เท่านั้น',
      'ห้ามใส่ service-role key ใน frontend',
      'ยังไม่เปิด auth, cloud sync, uploads, Edge Functions, AI, หรือ backend writes',
    ],
    docLinks: [
      { label: 'M40 project creation guide', path: 'docs/M40_SUPABASE_PROJECT_CREATION_GUIDE.md' },
      { label: 'M40 SQL run prep checklist', path: 'docs/M40_SQL_RUN_PREP_CHECKLIST.md' },
      { label: 'M40 post-SQL verification guide', path: 'docs/M40_POST_SQL_VERIFICATION_GUIDE.md' },
      { label: 'SQL execution guide', path: 'docs/SUPABASE_SQL_STAGING_EXECUTION_GUIDE.md' },
      { label: 'Manual verification pack', path: 'docs/SUPABASE_MANUAL_VERIFICATION_PACK.md' },
    ],
  };
}

