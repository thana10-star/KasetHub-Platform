import type {
  ImageValidationResult,
  PlantAnalysisImage,
  PlantAnalysisResult,
  PlantAnalysisSession,
  PlantAnalysisWarning,
} from '@/services/image-analysis/image-analysis.types';
import { getAICreditCost } from '@/services/ai/ai-credit-cost-policy';

export const supportedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
export const recommendedImageFileSizeBytes = 5 * 1024 * 1024;
export const maxImageFileSizeBytes = 12 * 1024 * 1024;

function now() {
  return new Date().toISOString();
}

function createId(prefix: string) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(Math.round(bytes / 1024), 1)} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function validateImageFile(file: File): ImageValidationResult {
  const warnings: PlantAnalysisWarning[] = [];

  if (!supportedImageTypes.includes(file.type)) {
    warnings.push({
      code: 'unsupported_file',
      title: 'ไฟล์นี้ยังไม่รองรับ',
      message: 'รองรับเฉพาะ JPG, PNG หรือ WebP สำหรับตัวอย่างนี้',
      severity: 'error',
    });
  }

  if (file.size > maxImageFileSizeBytes) {
    warnings.push({
      code: 'file_too_large',
      title: 'ไฟล์ใหญ่เกินไป',
      message: `ขนาดสูงสุด ${formatFileSize(maxImageFileSizeBytes)} กรุณาลองเลือกรูปที่เล็กลง`,
      severity: 'error',
    });
  } else if (file.size > recommendedImageFileSizeBytes) {
    warnings.push({
      code: 'file_very_large',
      title: 'รูปใหญ่มาก ควรลดขนาดก่อนวิเคราะห์',
      message: `รูปเกิน ${formatFileSize(recommendedImageFileSizeBytes)} ระบบ M31 จะลองลดขนาดในเครื่องก่อนวิเคราะห์ตัวอย่าง`,
      severity: 'warning',
    });
  }

  return {
    valid: warnings.every((warning) => warning.severity !== 'error'),
    warnings,
  };
}

export function createLocalPlantAnalysisImage(file: File): PlantAnalysisImage {
  return {
    id: createId('plant-image'),
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    previewUrl: URL.createObjectURL(file),
    selectedAt: now(),
    moderationStatus: 'not_started',
    deletionRequested: false,
  };
}

export function createPlantAnalysisSession(image?: PlantAnalysisImage): PlantAnalysisSession {
  const timestamp = now();

  return {
    id: createId('plant-session'),
    status: image ? 'preview' : 'idle',
    images: image ? [image] : [],
    warnings: [],
    createdAt: timestamp,
    updatedAt: timestamp,
    moderationStatus: 'not_started',
    deletionRequested: false,
  };
}

export function createMockAnalysisWarnings(image: PlantAnalysisImage): PlantAnalysisWarning[] {
  const name = image.fileName.toLowerCase();
  const warnings: PlantAnalysisWarning[] = [];

  if (name.includes('blur') || name.includes('เบลอ')) {
    warnings.push({
      code: 'image_blurry',
      title: 'ภาพไม่ชัดพอ',
      message: 'ลองถ่ายใกล้ใบพืชมากขึ้น และให้แสงพอดี',
      severity: 'warning',
    });
  }

  if (name.includes('soil') || name.includes('empty') || name.includes('no-plant')) {
    warnings.push({
      code: 'no_plant_detected',
      title: 'ยังไม่พบข้อมูลที่มั่นใจเพียงพอ',
      message: 'ลองถ่ายให้เห็นใบ ลำต้น แมลง หรือรอยโรคชัดขึ้น',
      severity: 'warning',
    });
  }

  if (image.fileSize < 80 * 1024) {
    warnings.push({
      code: 'low_confidence',
      title: 'ความมั่นใจอาจต่ำ',
      message: 'ไฟล์มีขนาดเล็ก ภาพจริงอาจมีรายละเอียดไม่พอสำหรับวิเคราะห์',
      severity: 'info',
    });
  }

  warnings.push({
    code: 'local_only',
    title: 'ข้อมูลอยู่ในเครื่องนี้',
    message: 'M10 ยังไม่อัปโหลดรูปไป backend หรือ cloud storage',
    severity: 'info',
  });

  return warnings;
}

export function createMockPlantAnalysisResult(image: PlantAnalysisImage): PlantAnalysisResult {
  const warnings = createMockAnalysisWarnings(image);
  const hasLowConfidenceWarning = warnings.some((warning) => warning.code === 'low_confidence' || warning.code === 'image_blurry');
  const confidenceScore = hasLowConfidenceWarning ? 63 : 82;

  return {
    id: createId('plant-result'),
    cropName: 'ข้าว',
    diseaseName: 'โรคใบจุดสีน้ำตาล (เชื้อรา)',
    confidence: {
      score: confidenceScore,
      level: confidenceScore >= 75 ? 'สูง' : 'ปานกลาง',
      label: `ความมั่นใจตัวอย่าง ${confidenceScore}%`,
    },
    symptoms: [
      'จุดสีน้ำตาลรูปรีบนใบและมีขอบเข้ม',
      'มักพบชัดหลังฝนตกหรือความชื้นสูง',
      'ใบล่างเริ่มเหลืองหรือแห้งเป็นบางส่วน',
    ],
    causes: [
      'เชื้อราเจริญได้ดีในสภาพอับชื้น',
      'แปลงมีการระบายอากาศไม่ดี',
      'ปุ๋ยไนโตรเจนมากเกินไปอาจทำให้อ่อนแอต่อโรค',
    ],
    treatmentSuggestions: [
      'ลดความชื้นในแปลงและเพิ่มการระบายอากาศ',
      'เก็บใบที่เป็นโรครุนแรงออกจากแปลงอย่างระมัดระวัง',
      'ตรวจยืนยันกับผู้เชี่ยวชาญก่อนใช้สารป้องกันกำจัดโรคพืช',
    ],
    warnings,
    safetyNotice: {
      title: 'ผลวิเคราะห์เป็นข้อมูลเบื้องต้น',
      message: 'ควรตรวจสอบกับผู้เชี่ยวชาญหรือหน่วยงานเกษตรในพื้นที่ก่อนใช้งานจริง',
      severity: 'warning',
    },
    severe: true,
    estimatedCreditCost: getAICreditCost('plant_image_analysis'),
    analyzedAt: now(),
  };
}
