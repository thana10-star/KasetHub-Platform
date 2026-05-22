import type { AICreditSummary } from '@/services/ai-credits/ai-credit.types';
import type { AIRequestPlan, AIRequestType } from '@/services/ai/ai-request.types';

export type AIProxyStatus = 'success' | 'rejected' | 'insufficient_credits' | 'safety_blocked' | 'failed';

export type AIMockScenario =
  | 'success'
  | 'insufficient_credits'
  | 'safety_blocked'
  | 'failed_retryable'
  | 'low_confidence'
  | 'no_plant_detected'
  | 'blurry_image'
  | 'safety_warning';

export type AIProxyCreditValidation = {
  requiredCredits: number;
  availableCredits: number;
  enoughCredits: boolean;
  dailyFreeRemaining: number;
  rewardedCredits: number;
  proCredits: number;
  validationSource: 'local_guest_credit_fixture';
  wouldConsumeOnSuccess: boolean;
  message: string;
};

export type AIProxyLogsPreview = {
  endpoint: string;
  providerKeyLocation: 'server_only_not_in_frontend';
  networkCalls: false;
  wouldValidateAuth: boolean;
  wouldValidateCredits: boolean;
  wouldWriteTables: string[];
  notes: string[];
};

export type AIProxyBaseResponse = {
  requestId: string;
  status: AIProxyStatus;
  requestType: AIRequestType;
  creditCost: number;
  creditValidation: AIProxyCreditValidation;
  modelPlan: AIRequestPlan;
  safetyDisclaimers: string[];
  warnings: string[];
  logsPreview: AIProxyLogsPreview;
  retryable: boolean;
  createdAt: string;
};

export type AITextAnswer = {
  title: string;
  answer: string;
  bulletPoints: string[];
  followUpQuestions: string[];
  recommendedActions: string[];
};

export type AITextProxyResponse = AIProxyBaseResponse & {
  answer?: AITextAnswer;
};

export type AIPlantAnalysisUrgency = 'low' | 'watch' | 'urgent';

export type AIPlantImageAnalysisResult = {
  diseaseName: string;
  cropName: string;
  confidence: number;
  confidenceLabel: string;
  symptoms: string[];
  causes: string[];
  treatmentSuggestions: string[];
  urgency: AIPlantAnalysisUrgency;
  followUpQuestions: string[];
  recommendedActions: string[];
  shouldConsultExpert: boolean;
};

export type AIPlantImageProxyResponse = AIProxyBaseResponse & {
  result?: AIPlantImageAnalysisResult;
};

export type AISummaryProxyResponse = AIProxyBaseResponse & {
  answer?: AITextAnswer;
};

export type AskTextQuestionInput = {
  question: string;
  creditSummary: AICreditSummary;
  scenario?: AIMockScenario;
};

export type AnalyzePlantImageInput = {
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  creditSummary: AICreditSummary;
  scenario?: AIMockScenario;
};

export type SummarizeContentInput = {
  title: string;
  description?: string;
  creditSummary: AICreditSummary;
  scenario?: AIMockScenario;
};
