import type {
  ImagePreflightIssue,
  ImagePreflightReadinessLevel,
  ImagePreflightResult,
  PlantPhotoChecklistItem,
} from '@/services/image-analysis/image-preflight.types';
import {
  formatFileSize,
  maxImageFileSizeBytes,
  recommendedImageFileSizeBytes,
  supportedImageTypes,
} from '@/services/image-analysis/image-upload-service';

const minimumRecommendedSidePx = 640;
const veryLargeDimensionPx = 3000;

const plantPhotoChecklist: PlantPhotoChecklistItem[] = [
  {
    id: 'clear_leaf',
    label: 'เห็นใบ ลำต้น หรือรอยโรคชัด',
    tip: 'ถ่ายให้ส่วนที่มีอาการอยู่กลางภาพและไม่ไกลเกินไป',
    status: 'not_checked',
  },
  {
    id: 'natural_light',
    label: 'มีแสงพอ ไม่มืดหรือย้อนแสง',
    tip: 'ใช้แสงธรรมชาติหรือยืนในที่สว่างก่อนถ่าย',
    status: 'not_checked',
  },
  {
    id: 'steady_camera',
    label: 'กล้องนิ่ง ภาพไม่สั่น',
    tip: 'แตะโฟกัสบนใบพืชแล้วถือกล้องนิ่ง 1-2 วินาที',
    status: 'not_checked',
  },
  {
    id: 'no_personal_data',
    label: 'ไม่มีคน ใบหน้า ป้ายบ้าน หรือเอกสารติดในภาพ',
    tip: 'ครอปภาพให้เห็นเฉพาะพืชหรือแปลงเท่าที่จำเป็น',
    status: 'not_checked',
  },
];

function now() {
  return new Date().toISOString();
}

function loadImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      const width = image.naturalWidth || image.width;
      const height = image.naturalHeight || image.height;
      URL.revokeObjectURL(objectUrl);
      resolve({ width, height });
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Cannot read image dimensions'));
    };
    image.src = objectUrl;
  });
}

function getReadiness(score: number, hasError: boolean): {
  readinessLevel: ImagePreflightReadinessLevel;
  readinessLabel: string;
} {
  if (hasError) {
    return {
      readinessLevel: 'blocked',
      readinessLabel: 'ยังไม่พร้อม ต้องเลือกรูปใหม่',
    };
  }

  if (score >= 82) {
    return {
      readinessLevel: 'ready',
      readinessLabel: 'พร้อมสำหรับวิเคราะห์ตัวอย่าง',
    };
  }

  if (score >= 62) {
    return {
      readinessLevel: 'usable_with_warnings',
      readinessLabel: 'พอใช้ได้ แต่ควรดูคำเตือนก่อน',
    };
  }

  return {
    readinessLevel: 'retake_recommended',
    readinessLabel: 'แนะนำให้ถ่ายใหม่ก่อนวิเคราะห์',
  };
}

function scoreIssues(issues: ImagePreflightIssue[]) {
  const penalty = issues.reduce((total, issue) => {
    if (issue.severity === 'error') {
      return total + 45;
    }

    if (issue.severity === 'warning') {
      return total + 18;
    }

    if (issue.severity === 'info') {
      return total + 4;
    }

    return total;
  }, 0);

  return Math.max(0, Math.min(100, 100 - penalty));
}

export async function runImagePreflight(file: File): Promise<ImagePreflightResult> {
  const issues: ImagePreflightIssue[] = [];
  let dimensions: { width: number; height: number } | undefined;

  if (supportedImageTypes.includes(file.type)) {
    issues.push({
      code: 'supported_file',
      severity: 'pass',
      title: 'ชนิดไฟล์รองรับ',
      message: 'รองรับ JPG, PNG และ WebP สำหรับการตรวจในเครื่อง',
    });
  } else {
    issues.push({
      code: 'unsupported_file',
      severity: 'error',
      title: 'ไฟล์นี้ยังไม่รองรับ',
      message: 'กรุณาใช้ JPG, PNG หรือ WebP ก่อนวิเคราะห์',
    });
  }

  if (file.size > maxImageFileSizeBytes) {
    issues.push({
      code: 'file_too_large',
      severity: 'error',
      title: 'ไฟล์ใหญ่เกินไป',
      message: `ขนาดสูงสุดสำหรับ prototype คือ ${formatFileSize(maxImageFileSizeBytes)}`,
    });
  } else if (file.size > recommendedImageFileSizeBytes) {
    issues.push({
      code: 'file_very_large',
      severity: 'warning',
      title: 'รูปใหญ่มาก ควรลดขนาดก่อน',
      message: `รูปเกิน ${formatFileSize(recommendedImageFileSizeBytes)} การลดขนาดจะช่วยประหยัดค่า AI ในอนาคต`,
    });
  } else {
    issues.push({
      code: 'file_size_ok',
      severity: 'pass',
      title: 'ขนาดไฟล์เหมาะสม',
      message: `ขนาดไฟล์ ${formatFileSize(file.size)} อยู่ในช่วงที่เหมาะกับ prototype`,
    });
  }

  if (supportedImageTypes.includes(file.type)) {
    try {
      dimensions = await loadImageDimensions(file);

      if (dimensions.width < minimumRecommendedSidePx || dimensions.height < minimumRecommendedSidePx) {
        issues.push({
          code: 'too_small',
          severity: 'warning',
          title: 'รูปอาจเล็กเกินไป',
          message: `แนะนำให้กว้างและสูงอย่างน้อย ${minimumRecommendedSidePx}px เพื่อเห็นรายละเอียดโรคพืช`,
        });
      } else {
        issues.push({
          code: 'dimensions_ok',
          severity: 'pass',
          title: 'ขนาดภาพพอสำหรับตรวจตัวอย่าง',
          message: `ขนาดภาพ ${dimensions.width}×${dimensions.height}px`,
        });
      }

      if (dimensions.width > veryLargeDimensionPx || dimensions.height > veryLargeDimensionPx) {
        issues.push({
          code: 'very_large_dimensions',
          severity: 'info',
          title: 'ความละเอียดสูง เหมาะกับการย่อ',
          message: 'ระบบจะย่อด้านยาวลงก่อนวิเคราะห์เพื่อลดขนาดไฟล์และค่า AI ในอนาคต',
        });
      }
    } catch {
      issues.push({
        code: 'dimension_read_failed',
        severity: 'warning',
        title: 'อ่านขนาดภาพไม่ได้',
        message: 'ยังใช้ไฟล์นี้ต่อได้ถ้าเป็นรูปพืชชัดเจน แต่ควรลองเลือกรูปใหม่หากพรีวิวไม่แสดง',
      });
    }
  }

  issues.push({
    code: 'possible_blurry_placeholder',
    severity: 'info',
    title: 'ตรวจภาพเบลอแบบง่ายเท่านั้น',
    message: 'เวอร์ชันนี้ยังไม่มี AI ตรวจความเบลอจริง หากภาพสั่นหรือไม่โฟกัสควรถ่ายใหม่',
  });
  issues.push({
    code: 'local_only',
    severity: 'info',
    title: 'รูปยังไม่ถูกส่งออกจากเครื่องในเวอร์ชันนี้',
    message: 'การตรวจคุณภาพและลดขนาดทำในเบราว์เซอร์เท่านั้น ไม่มีการอัปโหลด',
  });

  const readinessScore = scoreIssues(issues);
  const hasError = issues.some((issue) => issue.severity === 'error');
  const readiness = getReadiness(readinessScore, hasError);

  return {
    fileName: file.name,
    fileType: file.type || 'unknown',
    fileSizeBytes: file.size,
    width: dimensions?.width,
    height: dimensions?.height,
    readinessScore,
    readinessLevel: readiness.readinessLevel,
    readinessLabel: readiness.readinessLabel,
    canAnalyzeMock: !hasError,
    issues,
    checklist: plantPhotoChecklist,
    privacyNotice: 'รูปยังไม่ถูกส่งออกจากเครื่องในเวอร์ชันนี้ และไม่ควรบันทึกไฟล์ดิบ/base64 ใน Guest Memory',
    createdAt: now(),
  };
}
