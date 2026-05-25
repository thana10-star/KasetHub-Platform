import type {
  SupabaseSetupProgressPatch,
  SupabaseSetupProgressState,
  SupabaseSetupProgressStep,
  SupabaseSetupProgressStepId,
  SupabaseSetupProgressSummary,
} from '@/services/supabase/supabase-setup-progress.types';

export const SUPABASE_SETUP_PROGRESS_STORAGE_KEY = 'kasethub.supabaseSetupProgress.v1';

export const supabaseSetupProgressSteps: SupabaseSetupProgressStep[] = [
  {
    id: 'projectCreated',
    label: 'สร้าง Supabase project แล้ว',
    detail: 'ใช้ project ใหม่สำหรับ staging เช่น kasethub-staging และเลือก region ใกล้ไทย/Singapore ถ้ามี',
    blocker: 'ยังต้องสร้าง Supabase staging project ก่อน',
  },
  {
    id: 'envAdded',
    label: 'เพิ่ม .env.local ในเครื่องแล้ว',
    detail: 'ใส่เฉพาะ Project URL และ anon/public key พร้อมปิด auth/cloud sync',
    blocker: 'ยังต้องเพิ่มค่า .env.local เฉพาะในเครื่องและ restart Vite',
  },
  {
    id: 'schemaSqlRun',
    label: 'รัน schema SQL แล้ว',
    detail: 'รัน supabase/migrations/0001_kasethub_core_schema.sql ใน SQL Editor ก่อนเสมอ',
    blocker: 'ยังต้องรัน schema SQL ก่อน RLS SQL',
  },
  {
    id: 'rlsSqlRun',
    label: 'รัน RLS SQL แล้ว',
    detail: 'รัน supabase/policies/0001_kasethub_rls_policies.sql หลัง schema สำเร็จเท่านั้น',
    blocker: 'ยังต้องรัน RLS SQL หลัง schema สำเร็จ',
  },
  {
    id: 'tablesVerified',
    label: 'ตรวจ tables / indexes / triggers แล้ว',
    detail: 'ตรวจ Table Editor, indexes, triggers, foreign keys และ updated_at behavior แบบ manual',
    blocker: 'ยังต้องตรวจ tables, indexes และ triggers ใน Supabase Dashboard',
  },
  {
    id: 'stagingVerified',
    label: 'ยืนยัน staging safety แล้ว',
    detail: 'ตรวจว่า RLS เปิดอยู่ ไม่มี public write policy และยังไม่เปิด auth/cloud sync/uploads/AI proxy',
    blocker: 'ยังต้องยืนยันว่า staging ปลอดภัยและยังไม่มี public write policy',
  },
];

export function createDefaultSupabaseSetupProgress(): SupabaseSetupProgressState {
  return {
    projectCreated: false,
    envAdded: false,
    schemaSqlRun: false,
    rlsSqlRun: false,
    tablesVerified: false,
    stagingVerified: false,
    updatedAt: null,
  };
}

function canUseLocalStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

function normalizeProgress(value: unknown): SupabaseSetupProgressState {
  const defaultState = createDefaultSupabaseSetupProgress();

  if (!value || typeof value !== 'object') {
    return defaultState;
  }

  const candidate = value as Partial<SupabaseSetupProgressState>;

  return {
    projectCreated: Boolean(candidate.projectCreated),
    envAdded: Boolean(candidate.envAdded),
    schemaSqlRun: Boolean(candidate.schemaSqlRun),
    rlsSqlRun: Boolean(candidate.rlsSqlRun),
    tablesVerified: Boolean(candidate.tablesVerified),
    stagingVerified: Boolean(candidate.stagingVerified),
    updatedAt: typeof candidate.updatedAt === 'string' ? candidate.updatedAt : null,
  };
}

export function readSupabaseSetupProgress(): SupabaseSetupProgressState {
  if (!canUseLocalStorage()) {
    return createDefaultSupabaseSetupProgress();
  }

  try {
    const storedValue = window.localStorage.getItem(SUPABASE_SETUP_PROGRESS_STORAGE_KEY);
    return normalizeProgress(storedValue ? JSON.parse(storedValue) : null);
  } catch {
    return createDefaultSupabaseSetupProgress();
  }
}

function writeSupabaseSetupProgress(state: SupabaseSetupProgressState): SupabaseSetupProgressState {
  if (!canUseLocalStorage()) {
    return state;
  }

  window.localStorage.setItem(SUPABASE_SETUP_PROGRESS_STORAGE_KEY, JSON.stringify(state));
  return state;
}

export function updateSupabaseSetupProgress(patch: SupabaseSetupProgressPatch): SupabaseSetupProgressState {
  const nextState: SupabaseSetupProgressState = {
    ...readSupabaseSetupProgress(),
    ...patch,
    updatedAt: new Date().toISOString(),
  };

  return writeSupabaseSetupProgress(nextState);
}

export function setSupabaseSetupProgressStep(
  stepId: SupabaseSetupProgressStepId,
  completed: boolean,
): SupabaseSetupProgressState {
  return updateSupabaseSetupProgress({ [stepId]: completed });
}

export function resetSupabaseSetupProgress(): SupabaseSetupProgressState {
  const defaultState = createDefaultSupabaseSetupProgress();

  if (canUseLocalStorage()) {
    window.localStorage.removeItem(SUPABASE_SETUP_PROGRESS_STORAGE_KEY);
  }

  return defaultState;
}

export function summarizeSupabaseSetupProgress(
  state: SupabaseSetupProgressState = readSupabaseSetupProgress(),
): SupabaseSetupProgressSummary {
  const completedStepIds = supabaseSetupProgressSteps
    .filter((step) => state[step.id])
    .map((step) => step.id);
  const completedCount = completedStepIds.length;
  const totalCount = supabaseSetupProgressSteps.length;
  const nextStep = supabaseSetupProgressSteps.find((step) => !state[step.id]) ?? null;
  const blockers = supabaseSetupProgressSteps.filter((step) => !state[step.id]).map((step) => step.blocker);

  return {
    state,
    steps: supabaseSetupProgressSteps,
    completedCount,
    totalCount,
    completionPercent: Math.round((completedCount / totalCount) * 100),
    completedStepIds,
    nextStep,
    blockers,
    nextSafeStep: nextStep
      ? nextStep.detail
      : 'หยุดที่ staging verification และอย่าเปิด auth/cloud sync จนกว่าจะมี milestone ถัดไป',
    safetyNotes: [
      'ห้ามใช้ service-role key ใน frontend',
      'ใช้ staging เท่านั้น',
      'ยังไม่เปิด auth',
      'ยังไม่เปิด cloud sync',
      'หยุดก่อนเปิด auth/cloud sync',
      'หยุดก่อนเปิด uploads หรือ AI proxy',
    ],
  };
}
