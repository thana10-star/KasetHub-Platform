import type {
  PlantImageAnalysisJob,
  PlantImageAnalysisJobLifecyclePreview,
  PlantImageAnalysisJobPlannerInput,
  PlantImageAnalysisJobStatus,
} from '@/services/image-analysis/image-analysis-job.types';

function now() {
  return new Date().toISOString();
}

function createId(prefix: string) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const lifecycleCopy: Record<
  PlantImageAnalysisJobStatus,
  {
    title: string;
    description: string;
    backendOwned: boolean;
  }
> = {
  pending_upload: {
    title: 'รออัปโหลดแบบส่วนตัว',
    description: 'อนาคต backend จะสร้างตำแหน่งไฟล์และรับรูปหลังผู้ใช้ยินยอม',
    backendOwned: true,
  },
  uploaded: {
    title: 'อัปโหลดแล้ว',
    description: 'ไฟล์อยู่ใน private bucket และยังไม่เปิดเป็นสาธารณะ',
    backendOwned: true,
  },
  moderation_pending: {
    title: 'รอตรวจความเหมาะสม',
    description: 'ตรวจชนิดไฟล์ ขนาด metadata และความเกี่ยวข้องกับพืชก่อนส่งเข้า AI',
    backendOwned: true,
  },
  ready_for_ai: {
    title: 'พร้อมส่งเข้า Vision AI',
    description: 'เครดิตและสิทธิ์ผ่านแล้ว จึงเตรียมเรียกโมเดลภาพ',
    backendOwned: true,
  },
  ai_processing: {
    title: 'กำลังวิเคราะห์ด้วย AI',
    description: 'backend เรียก provider ด้วย key ฝั่ง server เท่านั้น',
    backendOwned: true,
  },
  completed: {
    title: 'วิเคราะห์เสร็จ',
    description: 'บันทึกผล structured result และเชื่อมกับ My Farm เมื่อผู้ใช้เลือกบันทึก',
    backendOwned: true,
  },
  failed: {
    title: 'ล้มเหลว',
    description: 'คืนเครดิตตามนโยบายถ้ายังไม่ได้ผลลัพธ์ และให้ลองใหม่โดยไม่คิดซ้ำ',
    backendOwned: true,
  },
  deletion_requested: {
    title: 'ขอลบรูป',
    description: 'ลบไฟล์ รูปย่อ และลิงก์ที่เกี่ยวข้องตามนโยบาย retention',
    backendOwned: true,
  },
};

export function buildPlantImageAnalysisJobPreview(
  input: PlantImageAnalysisJobPlannerInput,
): PlantImageAnalysisJobLifecyclePreview {
  const job: PlantImageAnalysisJob = {
    id: createId('plant-analysis-job'),
    status: input.userSession.canUpload ? 'pending_upload' : 'failed',
    ownerUserId: input.userSession.ownerUserId,
    guestSessionId: input.userSession.guestSessionId,
    mediaObjectId: input.uploadPlan.previewMediaObject.id,
    mediaObject: input.uploadPlan.previewMediaObject,
    requestPlan: input.aiRequestPlan,
    creditCost: input.creditCost,
    creditReserved: false,
    moderationStatus: input.uploadPlan.moderationRequirement.initialStatus,
    retryCount: 0,
    createdAt: now(),
    updatedAt: now(),
    metadata: {
      plannerOnly: true,
      noNetworkCalls: true,
      userMode: input.userSession.mode,
    },
    ...(input.userSession.canUpload
      ? {}
      : {
          errorCode: 'upload_not_enabled',
          errorMessage: 'ยังไม่เปิดอัปโหลดจริงในเวอร์ชันนี้',
        }),
  };

  const statuses: PlantImageAnalysisJobStatus[] = [
    'pending_upload',
    'uploaded',
    'moderation_pending',
    'ready_for_ai',
    'ai_processing',
    'completed',
    'failed',
    'deletion_requested',
  ];

  return {
    job,
    lifecycle: statuses.map((status) => ({
      status,
      ...lifecycleCopy[status],
    })),
    requiredBackendSteps: [
      'ยืนยันตัวตนหรือ guest session',
      'ขอ consent สำหรับประมวลผลรูปภาพ',
      'ตรวจเครดิตและ reserve เครดิตแบบ backend-owned',
      'อัปโหลดเข้า private Supabase Storage bucket',
      'สร้าง thumbnail และ strip metadata ที่ไม่จำเป็น',
      'ตรวจ moderation และ plant context',
      'เรียก vision model ผ่าน backend proxy เท่านั้น',
      'บันทึกผลใน plant_analysis_results',
      'เชื่อมกับ farm_records หรือ saved_items เมื่อผู้ใช้บันทึก',
    ],
    failureRollbackNotes: [
      'ถ้า upload ล้มเหลว ต้องไม่มี job ค้างที่คิดเครดิตแล้ว',
      'ถ้า moderation ไม่ผ่าน ต้องไม่ส่งภาพเข้า AI provider',
      'ถ้า AI provider ล้มเหลว ต้องไม่คิดเครดิตซ้ำสำหรับ retry ของ backend',
      'ถ้าผู้ใช้ขอลบ ต้องลบ original, thumbnail, signed URL references และ media link ที่เกี่ยวข้อง',
    ],
    storagePlan: input.uploadPlan,
  };
}
