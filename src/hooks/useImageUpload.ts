import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createLocalPlantAnalysisImage,
  createMockPlantAnalysisResult,
  createPlantAnalysisSession,
  validateImageFile,
} from '@/services/image-analysis/image-upload-service';
import type {
  ImageUploadState,
  PlantAnalysisImage,
  PlantAnalysisSession,
  PlantAnalysisWarning,
} from '@/services/image-analysis/image-analysis.types';

export function useImageUpload() {
  const [session, setSession] = useState<PlantAnalysisSession>(() => createPlantAnalysisSession());
  const analysisTimerRef = useRef<number | undefined>();

  const revokeImages = useCallback((images: PlantAnalysisImage[]) => {
    images.forEach((image) => URL.revokeObjectURL(image.previewUrl));
  }, []);

  useEffect(() => {
    return () => {
      if (analysisTimerRef.current) {
        window.clearTimeout(analysisTimerRef.current);
      }
      revokeImages(session.images);
    };
  }, [revokeImages, session.images]);

  const setStatus = useCallback((status: ImageUploadState, warnings: PlantAnalysisWarning[] = []) => {
    setSession((current) => ({
      ...current,
      status,
      warnings,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const selectFile = useCallback(
    (file: File | undefined) => {
      if (!file) {
        return;
      }

      setStatus('selecting');
      const validation = validateImageFile(file);

      if (!validation.valid) {
        setSession((current) => ({
          ...current,
          status: 'failed',
          warnings: validation.warnings,
          updatedAt: new Date().toISOString(),
        }));
        return;
      }

      const image = createLocalPlantAnalysisImage(file);

      setSession((current) => {
        revokeImages(current.images);
        return {
          ...createPlantAnalysisSession(image),
          warnings: validation.warnings,
        };
      });
    },
    [revokeImages, setStatus],
  );

  const removeImage = useCallback(() => {
    setSession((current) => {
      revokeImages(current.images);
      return createPlantAnalysisSession();
    });
  }, [revokeImages]);

  const startAnalysis = useCallback(() => {
    setSession((current) => {
      const image = current.images[0];

      if (!image) {
        return {
          ...current,
          status: 'failed',
          warnings: [
            {
              code: 'no_plant_detected',
              title: 'ยังไม่มีรูปภาพ',
              message: 'กรุณาเลือกรูปใบพืชหรือแมลงก่อนเริ่มวิเคราะห์',
              severity: 'error',
            },
          ],
          updatedAt: new Date().toISOString(),
        };
      }

      return {
        ...current,
        status: 'analyzing',
        updatedAt: new Date().toISOString(),
      };
    });

    if (analysisTimerRef.current) {
      window.clearTimeout(analysisTimerRef.current);
    }

    analysisTimerRef.current = window.setTimeout(() => {
      setSession((current) => {
        const image = current.images[0];

        if (!image) {
          return current;
        }

        const result = createMockPlantAnalysisResult(image);

        return {
          ...current,
          status: 'complete',
          result,
          warnings: result.warnings,
          moderationStatus: 'approved_mock',
          updatedAt: new Date().toISOString(),
        };
      });
    }, 950);
  }, []);

  return {
    session,
    status: session.status,
    selectedImage: session.images[0],
    result: session.result,
    warnings: session.warnings,
    selectFile,
    removeImage,
    retry: startAnalysis,
    startAnalysis,
  };
}
