import type {
  ImageCompressionCostReductionLevel,
  ImageCompressionError,
  ImageCompressionOptions,
  ImageCompressionOutputFormat,
  ImageCompressionResult,
} from '@/services/image-analysis/image-compression.types';
import { formatFileSize, supportedImageTypes } from '@/services/image-analysis/image-upload-service';

export const defaultImageCompressionOptions: ImageCompressionOptions = {
  maxWidth: 1280,
  maxHeight: 1280,
  quality: 0.78,
  outputFormat: 'image/jpeg',
};

function now() {
  return new Date().toISOString();
}

function clampQuality(quality: number) {
  return Math.min(Math.max(quality, 0.45), 0.92);
}

function getExtension(outputFormat: ImageCompressionOutputFormat) {
  return outputFormat === 'image/webp' ? 'webp' : 'jpg';
}

function createOutputFileName(fileName: string, outputFormat: ImageCompressionOutputFormat) {
  const baseName = fileName.replace(/\.[^.]+$/, '') || 'plant-image';
  return `${baseName}-optimized.${getExtension(outputFormat)}`;
}

function calculateTargetSize(width: number, height: number, maxWidth: number, maxHeight: number) {
  const scale = Math.min(1, maxWidth / width, maxHeight / height);

  return {
    width: Math.max(Math.round(width * scale), 1),
    height: Math.max(Math.round(height * scale), 1),
  };
}

function buildCostReduction(sizeReductionPercent: number): {
  level: ImageCompressionCostReductionLevel;
  label: string;
} {
  if (sizeReductionPercent >= 60) {
    return { level: 'high', label: 'ลดภาระ AI/อัปโหลดได้มาก' };
  }

  if (sizeReductionPercent >= 35) {
    return { level: 'medium', label: 'ช่วยลดค่า AI ได้ดี' };
  }

  if (sizeReductionPercent > 5) {
    return { level: 'low', label: 'ลดขนาดได้เล็กน้อย' };
  }

  return { level: 'none', label: 'ไฟล์นี้ลดขนาดได้ไม่มาก' };
}

function loadImageElement(file: File): Promise<{ image: HTMLImageElement; objectUrl: string }> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => resolve({ image, objectUrl });
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Cannot read image dimensions'));
    };
    image.src = objectUrl;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, outputFormat: ImageCompressionOutputFormat, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas compression failed'));
          return;
        }

        resolve(blob);
      },
      outputFormat,
      clampQuality(quality),
    );
  });
}

export async function compressImageFile(
  file: File,
  options: Partial<ImageCompressionOptions> = {},
): Promise<ImageCompressionResult> {
  const resolvedOptions = {
    ...defaultImageCompressionOptions,
    ...options,
  };

  if (!supportedImageTypes.includes(file.type)) {
    const error: ImageCompressionError = {
      code: 'unsupported_file',
      message: 'รองรับเฉพาะ JPG, PNG หรือ WebP สำหรับการลดขนาดรูปในเครื่อง',
    };
    throw error;
  }

  let loadedImage: { image: HTMLImageElement; objectUrl: string } | undefined;

  try {
    loadedImage = await loadImageElement(file);
  } catch {
    const error: ImageCompressionError = {
      code: 'load_failed',
      message: 'อ่านรูปไม่สำเร็จ กรุณาลองเลือกรูปใหม่',
    };
    throw error;
  }

  try {
    const originalWidth = loadedImage.image.naturalWidth || loadedImage.image.width;
    const originalHeight = loadedImage.image.naturalHeight || loadedImage.image.height;

    if (!originalWidth || !originalHeight) {
      const error: ImageCompressionError = {
        code: 'load_failed',
        message: 'ไม่พบขนาดรูป กรุณาลองเลือกรูปใหม่',
      };
      throw error;
    }

    const targetSize = calculateTargetSize(
      originalWidth,
      originalHeight,
      resolvedOptions.maxWidth,
      resolvedOptions.maxHeight,
    );
    const canvas = document.createElement('canvas');
    canvas.width = targetSize.width;
    canvas.height = targetSize.height;
    const context = canvas.getContext('2d', { alpha: false });

    if (!context) {
      const error: ImageCompressionError = {
        code: 'canvas_failed',
        message: 'อุปกรณ์นี้ยังลดขนาดรูปด้วย canvas ไม่สำเร็จ',
      };
      throw error;
    }

    context.drawImage(loadedImage.image, 0, 0, targetSize.width, targetSize.height);
    const optimizedBlob = await canvasToBlob(
      canvas,
      resolvedOptions.outputFormat,
      resolvedOptions.quality,
    );
    const compressionRatio = optimizedBlob.size / file.size;
    const sizeReductionPercent = Math.max(0, Math.round((1 - compressionRatio) * 100));
    const costReduction = buildCostReduction(sizeReductionPercent);

    return {
      originalFileName: file.name,
      originalFileType: file.type,
      outputFileName: createOutputFileName(file.name, resolvedOptions.outputFormat),
      outputFormat: resolvedOptions.outputFormat,
      originalSizeBytes: file.size,
      optimizedSizeBytes: optimizedBlob.size,
      originalWidth,
      originalHeight,
      optimizedWidth: targetSize.width,
      optimizedHeight: targetSize.height,
      compressionRatio,
      sizeReductionPercent,
      costReductionLevel: costReduction.level,
      costReductionLabel: `${costReduction.label} (${formatFileSize(file.size)} → ${formatFileSize(optimizedBlob.size)})`,
      optimizedBlob,
      createdAt: now(),
    };
  } catch (rawError) {
    if (typeof rawError === 'object' && rawError && 'code' in rawError && 'message' in rawError) {
      throw rawError;
    }

    const error: ImageCompressionError = {
      code: 'compression_failed',
      message: 'ลดขนาดรูปไม่สำเร็จ กรุณาลองรูปอื่นหรือใช้รูปต้นฉบับแบบ local ต่อไป',
    };
    throw error;
  } finally {
    if (loadedImage) {
      URL.revokeObjectURL(loadedImage.objectUrl);
    }
  }
}
