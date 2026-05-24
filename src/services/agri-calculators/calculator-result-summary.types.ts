import type { SharePayload } from '@/services/share/share-service';
import type { AppRoute } from '@/types/kaset';
import type { CalculatorCategory } from '@/services/agri-calculators/agri-calculator.types';

export type CalculatorResultShareChannel = 'native' | 'line' | 'facebook';

export type CalculatorResultShareMetadata = Record<CalculatorResultShareChannel, SharePayload>;

export type CalculatorResultSummary = {
  id: string;
  category: CalculatorCategory;
  calculatorLabel: string;
  calculatorShortLabel: string;
  summaryTitle: string;
  inputRecap: string[];
  resultRecap: string[];
  warningRecap: string[];
  safetyDisclaimer: string;
  calculatorRoute: AppRoute;
  shareText: string;
  shareMetadata: CalculatorResultShareMetadata;
  createdAt: string;
  createdAtLabel: string;
  localOnlyNote: string;
};

export type CalculatorSavedResultsState = {
  version: 1;
  savedResults: CalculatorResultSummary[];
  updatedAt: string;
};

