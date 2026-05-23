import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  ImageCompressionOptions,
  ImageCompressionState,
} from '@/services/image-analysis/image-compression.types';
import { compressImageFile } from '@/services/image-analysis/image-compression-service';

export function useImageCompression() {
  const [state, setState] = useState<ImageCompressionState>({ status: 'idle' });
  const currentPreviewUrlRef = useRef<string | undefined>();
  const requestIdRef = useRef(0);

  const revokeCurrentPreview = useCallback(() => {
    if (currentPreviewUrlRef.current) {
      URL.revokeObjectURL(currentPreviewUrlRef.current);
      currentPreviewUrlRef.current = undefined;
    }
  }, []);

  useEffect(() => revokeCurrentPreview, [revokeCurrentPreview]);

  const reset = useCallback(() => {
    requestIdRef.current += 1;
    revokeCurrentPreview();
    setState({ status: 'idle' });
  }, [revokeCurrentPreview]);

  const compress = useCallback(
    async (file: File, options?: Partial<ImageCompressionOptions>) => {
      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      revokeCurrentPreview();
      setState({ status: 'compressing' });

      try {
        const result = await compressImageFile(file, options);

        if (requestIdRef.current !== requestId) {
          return;
        }

        const previewUrl = URL.createObjectURL(result.optimizedBlob);
        currentPreviewUrlRef.current = previewUrl;
        setState({
          status: 'complete',
          result: {
            ...result,
            previewUrl,
          },
        });
      } catch (rawError) {
        if (requestIdRef.current !== requestId) {
          return;
        }

        const error =
          typeof rawError === 'object' && rawError && 'code' in rawError && 'message' in rawError
            ? (rawError as ImageCompressionState['error'])
            : {
                code: 'compression_failed' as const,
                message: 'ลดขนาดรูปไม่สำเร็จ',
              };

        setState({ status: 'failed', error });
      }
    },
    [revokeCurrentPreview],
  );

  return {
    ...state,
    compress,
    reset,
  };
}
