import type { AIRequestType } from '@/services/ai/ai-request.types';
import type {
  AIPlantImageProxyResponse,
  AISummaryProxyResponse,
  AITextProxyResponse,
  AnalyzePlantImageInput,
  AskTextQuestionInput,
  SummarizeContentInput,
} from '@/services/ai-proxy/ai-proxy.types';

export type AIProxyMode = 'local_fixture' | 'backend_test_disabled' | 'backend_test_ready' | 'production_disabled';

export type AIProxyAdapterStatus = {
  mode: AIProxyMode;
  modeLabel: string;
  backendProxyEnabled: boolean;
  localBackendHandlerEnabled: boolean;
  canUseLocalFixture: boolean;
  canAttemptBackend: boolean;
  canUseLocalBackendHandler: boolean;
  providerKeysAvailableInFrontend: false;
  networkCallsEnabled: false;
  currentAdapterPath: 'local_fixture' | 'local_backend_handler' | 'disabled_response';
  environmentReadiness:
    | 'local_fixture_active'
    | 'backend_disabled'
    | 'backend_test_ready_no_fetch'
    | 'backend_test_ready_local_handler'
    | 'production_disabled';
  readinessLabel: string;
  supportedRequestTypes: AIRequestType[];
  lastLocalFixtureStatus?: {
    requestId: string;
    status: AITextProxyResponse['status'];
    requestType: AIRequestType;
    mode: AIProxyMode;
    createdAt: string;
  };
  warnings: string[];
};

export type AIProxyAdapter = {
  askTextQuestion(input: AskTextQuestionInput): AITextProxyResponse;
  analyzePlantImage(input: AnalyzePlantImageInput): AIPlantImageProxyResponse;
  summarizeArticle(input: SummarizeContentInput): AISummaryProxyResponse;
  summarizeVideo(input: SummarizeContentInput): AISummaryProxyResponse;
  getStatus(): AIProxyAdapterStatus;
};
