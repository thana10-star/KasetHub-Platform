export type ImageCompressionOutputFormat = 'image/jpeg' | 'image/webp';

export type ImageCompressionStatus = 'idle' | 'compressing' | 'complete' | 'failed';

export type ImageCompressionOptions = {
  maxWidth: number;
  maxHeight: number;
  quality: number;
  outputFormat: ImageCompressionOutputFormat;
};

export type ImageCompressionCostReductionLevel = 'high' | 'medium' | 'low' | 'none';

export type ImageCompressionResult = {
  originalFileName: string;
  originalFileType: string;
  outputFileName: string;
  outputFormat: ImageCompressionOutputFormat;
  originalSizeBytes: number;
  optimizedSizeBytes: number;
  originalWidth: number;
  originalHeight: number;
  optimizedWidth: number;
  optimizedHeight: number;
  compressionRatio: number;
  sizeReductionPercent: number;
  costReductionLevel: ImageCompressionCostReductionLevel;
  costReductionLabel: string;
  optimizedBlob: Blob;
  createdAt: string;
};

export type ImageCompressionError = {
  code: 'unsupported_file' | 'load_failed' | 'canvas_failed' | 'compression_failed';
  message: string;
};

export type ImageCompressionState = {
  status: ImageCompressionStatus;
  result?: ImageCompressionResult & {
    previewUrl: string;
  };
  error?: ImageCompressionError;
};
