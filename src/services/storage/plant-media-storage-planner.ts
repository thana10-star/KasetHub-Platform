import type {
  LocalPlantImageMetadata,
  PlantImageAnalysisStoragePlan,
  PlantMediaAccessPolicy,
  PlantMediaBucketName,
  PlantMediaObject,
} from '@/services/storage/storage.types';

function now() {
  return new Date().toISOString();
}

function createId(prefix: string) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function sanitizePathPart(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

function getExtension(fileName: string, mimeType: string) {
  const fromName = fileName.split('.').pop();

  if (fromName && fromName.length <= 5 && fromName !== fileName) {
    return sanitizePathPart(fromName);
  }

  if (mimeType === 'image/png') {
    return 'png';
  }

  if (mimeType === 'image/webp') {
    return 'webp';
  }

  return 'jpg';
}

function addHours(date: Date, hours: number) {
  const next = new Date(date);
  next.setHours(next.getHours() + hours);
  return next.toISOString();
}

export function createPlantMediaAccessPolicy(): PlantMediaAccessPolicy {
  return {
    visibility: 'private',
    ownerScoped: true,
    signedUrlsRequired: true,
    signedUrlTtlSeconds: 900,
    canPublicRead: false,
    consentRequired: true,
    notes: [
      'ภาพพืชควรอยู่ใน private bucket เท่านั้น',
      'signed URL ควรออกจาก backend หรือ Edge Function หลังตรวจสิทธิ์',
      'ห้ามใช้ public bucket สำหรับภาพฟาร์มหรือภาพผู้ใช้',
    ],
  };
}

export function buildPlantMediaStoragePlan(input: LocalPlantImageMetadata): PlantImageAnalysisStoragePlan {
  const timestamp = new Date();
  const mediaId = createId('plant-media');
  const extension = getExtension(input.fileName, input.mimeType);
  const ownerPart = input.ownerUserId ? `users/${sanitizePathPart(input.ownerUserId)}` : `guests/${sanitizePathPart(input.guestSessionId || 'local-guest')}`;
  const datePart = timestamp.toISOString().slice(0, 10);
  const baseName = `${mediaId}.${extension}`;
  const bucket: PlantMediaBucketName = 'plant-analysis-temp';
  const objectPath = `${ownerPart}/${datePart}/original/${baseName}`;
  const thumbnailPath = `${ownerPart}/${datePart}/thumbs/${mediaId}.webp`;
  const accessPolicy = createPlantMediaAccessPolicy();
  const warnings: string[] = [];

  if (input.sizeBytes > 5 * 1024 * 1024) {
    warnings.push('ไฟล์นี้ใหญ่กว่า 5 MB ควรบีบอัดก่อนอัปโหลดจริง');
  }

  if (!input.mimeType.startsWith('image/')) {
    warnings.push('ชนิดไฟล์ไม่ใช่รูปภาพ backend ต้องปฏิเสธก่อนอัปโหลด');
  }

  if (!input.ownerUserId) {
    warnings.push('ผู้ใช้ guest ต้องมี consent และ guest session ID ก่อนอัปโหลดจริง');
  }

  const previewMediaObject: PlantMediaObject = {
    id: mediaId,
    ownerUserId: input.ownerUserId,
    guestSessionId: input.guestSessionId,
    bucketName: bucket,
    objectPath,
    signedUrlExpiresAt: addHours(timestamp, 1),
    thumbnailPath,
    mimeType: input.mimeType,
    sizeBytes: input.sizeBytes,
    width: input.width,
    height: input.height,
    checksum: input.checksum,
    moderationStatus: 'pending',
    accessPolicy,
    createdAt: now(),
    updatedAt: now(),
    metadata: {
      sourceRoute: input.sourceRoute || '/app/analyze',
      originalFileName: input.fileName,
      plannerOnly: true,
      noUploadInCurrentVersion: true,
    },
  };

  return {
    proposedBucket: bucket,
    proposedObjectPath: objectPath,
    proposedThumbnailPath: thumbnailPath,
    privacyPolicy: accessPolicy,
    signedUrlPolicy: {
      issueOnlyFromBackend: true,
      defaultTtlSeconds: 900,
      maxTtlSeconds: 3600,
      userCanSharePublicly: false,
    },
    moderationRequirement: {
      required: true,
      initialStatus: 'pending',
      checks: ['validate_mime_type', 'validate_size', 'strip_metadata', 'plant_context_check', 'unsafe_or_personal_image_check'],
    },
    deletionPolicy: {
      userDeletionRequired: true,
      tempRetentionHours: 24,
      savedRetention: 'until_user_deletes_or_policy_requires',
      cascadeTargets: ['plant_media', 'plant_analysis_jobs', 'plant_analysis_results', 'farm_records.media_refs'],
    },
    warnings,
    previewMediaObject,
  };
}
