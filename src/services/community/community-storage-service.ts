import type { SupabaseClient } from '@supabase/supabase-js';
import type { CommunityActionResult, CommunityImageMetadata } from '@/services/community/community.types';

export const communityStorageGateMessage = 'แนบรูปจะเปิดใช้งานหลังตั้งค่าพื้นที่เก็บรูป';

export const communityImagePolicy = {
  bucketName: 'community-post-images',
  maxImagesPerPost: 1,
  maxSizeBytes: 3 * 1024 * 1024,
  acceptedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'] as const,
  storageEnabled: false,
  gateMessage: communityStorageGateMessage,
};

export type UploadCommunityPostImageOptions = {
  client?: Pick<SupabaseClient, 'storage'> | null;
  userId?: string;
  postId?: string;
  writesEnabled?: boolean;
  fileNamePrefix?: string;
};

function sanitizeImageFileName(fileName: string) {
  const cleaned = fileName.trim().replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-');
  return cleaned || 'community-post-image';
}

export function buildCommunityImagePath(userId: string, postId: string, fileName: string, prefix = Date.now().toString()) {
  return `${userId}/${postId}/${prefix}-${sanitizeImageFileName(fileName)}`;
}

export function validateCommunityImageFile(file: File): CommunityActionResult<File> {
  if (!communityImagePolicy.acceptedMimeTypes.includes(file.type as (typeof communityImagePolicy.acceptedMimeTypes)[number])) {
    return {
      ok: false,
      code: 'storage_not_ready',
      message: 'รองรับเฉพาะ JPG, PNG หรือ WebP สำหรับรูปโพสต์ชุมชน',
    };
  }

  if (file.size > communityImagePolicy.maxSizeBytes) {
    return {
      ok: false,
      code: 'storage_not_ready',
      message: 'รูปโพสต์ชุมชนต้องไม่เกิน 3MB',
    };
  }

  return {
    ok: true,
    data: file,
  };
}

export async function uploadCommunityPostImage(
  file?: File,
  options: UploadCommunityPostImageOptions = {},
): Promise<CommunityActionResult<CommunityImageMetadata>> {
  if (!file) {
    return {
      ok: false,
      code: 'storage_not_ready',
      message: communityStorageGateMessage,
    };
  }

  const validation = validateCommunityImageFile(file);
  if (!validation.ok) {
    return validation;
  }

  if (!options.writesEnabled || !options.client || !options.userId || !options.postId) {
    return {
      ok: false,
      code: 'storage_not_ready',
      message: communityStorageGateMessage,
    };
  }

  const imagePath = buildCommunityImagePath(options.userId, options.postId, file.name, options.fileNamePrefix);
  const { error } = await options.client.storage.from(communityImagePolicy.bucketName).upload(imagePath, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    return {
      ok: false,
      code: 'storage_not_ready',
      message: `อัปโหลดรูปชุมชนไม่สำเร็จ: ${error.message}`,
    };
  }

  return {
    ok: true,
    data: {
      imagePath,
      mimeType: file.type as CommunityImageMetadata['mimeType'],
      sizeBytes: file.size,
    },
  };
}
