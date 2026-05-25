import type { AppRoute } from '@/types/kaset';
import type { CalculatorCategory } from '@/services/agri-calculators/agri-calculator.types';

export type CalculatorExportTemplateVersion = 'short_line' | 'long_detail';

export type CalculatorExportTemplate = {
  id: string;
  category: CalculatorCategory;
  calculatorTitle: string;
  calculatorRoute: AppRoute;
  cropLabel?: string;
  inputRecap: string[];
  resultRecap: string[];
  warningRecap: string[];
  disclaimer: string;
  generatedAt: string;
  generatedAtLabel: string;
  sourceLabel: string;
  shortLineText: string;
  longDetailText: string;
  shortLineWasTruncated: boolean;
  longDetailWasTruncated: boolean;
};

export type CalculatorExportTemplateOptions = {
  cropLabel?: string;
  generatedAt?: string;
  lineFriendlyMaxChars?: number;
  longDetailMaxChars?: number;
};

export type CalculatorTextClampResult = {
  text: string;
  wasTruncated: boolean;
  originalLength: number;
  maxChars: number;
};

export type CalculatorClipboardLike = {
  writeText: (text: string) => Promise<void> | void;
};

export type CalculatorNativeShareLike = {
  share?: (data: ShareData) => Promise<void>;
  canShare?: (data: ShareData) => boolean;
};

export type CalculatorShareFallbackStatus =
  | 'ready'
  | 'copied'
  | 'copied_fallback'
  | 'shared'
  | 'cancelled'
  | 'empty'
  | 'unsupported'
  | 'failed';

export type CalculatorShareFallbackResult = {
  status: CalculatorShareFallbackStatus;
  message: string;
  helperMessage?: string;
  text: string;
  wasTruncated: boolean;
};

