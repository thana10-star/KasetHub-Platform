import { publicEnv } from '@/config/env';
import type { AIRequestType } from '@/services/ai/ai-request.types';
import {
  analyzePlantImage as analyzePlantImageFixture,
  askTextQuestion as askTextQuestionFixture,
  summarizeArticle as summarizeArticleFixture,
  summarizeVideo as summarizeVideoFixture,
} from '@/services/ai-proxy/ai-proxy-mock-service';
import {
  analyzePlantImageViaBackendTest,
  askTextQuestionViaBackendTest,
  getAIProxyBackendTestStatus,
  summarizeArticleViaBackendTest,
  summarizeVideoViaBackendTest,
} from '@/services/ai-proxy/ai-proxy-backend-test-client';
import type {
  AIProxyAdapter,
  AIProxyAdapterStatus,
  AIProxyMode,
} from '@/services/ai-proxy/ai-proxy-adapter.types';
import type {
  AIPlantImageProxyResponse,
  AISummaryProxyResponse,
  AITextProxyResponse,
} from '@/services/ai-proxy/ai-proxy.types';

const proxyStatusStorageKey = 'kasethub.aiProxy.lastFixtureStatus.v1';
const supportedRequestTypes: AIRequestType[] = [
  'normal_text_question',
  'risky_or_complex_question',
  'plant_image_analysis',
  'video_summary',
  'article_summary',
  'price_explanation',
];

function normalizeMode(value: string): AIProxyMode {
  if (value === 'backend_test_disabled' || value === 'backend_test_ready' || value === 'production_disabled') {
    return value;
  }

  return 'local_fixture';
}

export function getAIProxyMode(): AIProxyMode {
  return normalizeMode(publicEnv.aiProxyMode);
}

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

function readLastFixtureStatus(): AIProxyAdapterStatus['lastLocalFixtureStatus'] {
  if (!canUseStorage()) {
    return undefined;
  }

  try {
    const raw = window.localStorage.getItem(proxyStatusStorageKey);
    return raw ? (JSON.parse(raw) as AIProxyAdapterStatus['lastLocalFixtureStatus']) : undefined;
  } catch {
    return undefined;
  }
}

function recordLastFixtureStatus(response: AITextProxyResponse | AIPlantImageProxyResponse | AISummaryProxyResponse, mode: AIProxyMode) {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(
      proxyStatusStorageKey,
      JSON.stringify({
        requestId: response.requestId,
        status: response.status,
        requestType: response.requestType,
        mode,
        createdAt: response.createdAt,
      }),
    );
  } catch {
    // The status indicator is helpful but not critical.
  }
}

function getModeLabel(mode: AIProxyMode) {
  const labels: Record<AIProxyMode, string> = {
    local_fixture: 'Local fixture',
    backend_test_disabled: 'Backend test disabled',
    backend_test_ready: 'Backend test ready',
    production_disabled: 'Production disabled',
  };

  return labels[mode];
}

export function getAIProxyAdapterStatus(): AIProxyAdapterStatus {
  const mode = getAIProxyMode();
  const backendTestStatus = getAIProxyBackendTestStatus(mode);
  const environmentReadiness: AIProxyAdapterStatus['environmentReadiness'] =
    mode === 'local_fixture'
      ? 'local_fixture_active'
      : mode === 'production_disabled'
        ? 'production_disabled'
        : backendTestStatus.canUseLocalHandler
          ? 'backend_test_ready_local_handler'
          : mode === 'backend_test_ready'
            ? 'backend_test_ready_no_fetch'
            : 'backend_disabled';

  const readinessLabel: Record<AIProxyAdapterStatus['environmentReadiness'], string> = {
    local_fixture_active: 'ใช้ local fixture อยู่',
    backend_disabled: 'backend proxy ยังปิดอยู่',
    backend_test_ready_no_fetch: 'backend_test_ready แต่ยังไม่เปิด local handler ครบทุก flag',
    backend_test_ready_local_handler: 'ใช้ local backend handler จำลองแบบ in-process',
    production_disabled: 'ปิด production proxy',
  };

  return {
    mode,
    modeLabel: getModeLabel(mode),
    backendProxyEnabled: backendTestStatus.backendProxyEnabled,
    localBackendHandlerEnabled: backendTestStatus.localHandlerEnabled,
    canUseLocalFixture: mode === 'local_fixture',
    canAttemptBackend: mode === 'backend_test_ready' && backendTestStatus.backendProxyEnabled,
    canUseLocalBackendHandler: backendTestStatus.canUseLocalHandler,
    providerKeysAvailableInFrontend: false,
    networkCallsEnabled: false,
    currentAdapterPath: backendTestStatus.currentAdapterPath,
    environmentReadiness,
    readinessLabel: readinessLabel[environmentReadiness],
    supportedRequestTypes,
    lastLocalFixtureStatus: readLastFixtureStatus(),
    warnings: [
      'M14 ไม่มี network request จริง',
      'provider keys ต้องไม่อยู่ใน frontend',
      'local backend handler เป็น in-process test path เท่านั้น',
    ],
  };
}

export const aiProxyAdapter: AIProxyAdapter = {
  askTextQuestion(input) {
    const mode = getAIProxyMode();

    if (mode === 'local_fixture') {
      const response = askTextQuestionFixture(input);
      recordLastFixtureStatus(response, mode);
      return response;
    }

    return askTextQuestionViaBackendTest(input, mode);
  },

  analyzePlantImage(input) {
    const mode = getAIProxyMode();

    if (mode === 'local_fixture') {
      const response = analyzePlantImageFixture(input);
      recordLastFixtureStatus(response, mode);
      return response;
    }

    return analyzePlantImageViaBackendTest(input, mode);
  },

  summarizeArticle(input) {
    const mode = getAIProxyMode();

    if (mode === 'local_fixture') {
      const response = summarizeArticleFixture(input);
      recordLastFixtureStatus(response, mode);
      return response;
    }

    return summarizeArticleViaBackendTest(input, mode);
  },

  summarizeVideo(input) {
    const mode = getAIProxyMode();

    if (mode === 'local_fixture') {
      const response = summarizeVideoFixture(input);
      recordLastFixtureStatus(response, mode);
      return response;
    }

    return summarizeVideoViaBackendTest(input, mode);
  },

  getStatus: getAIProxyAdapterStatus,
};

export const askTextQuestion = aiProxyAdapter.askTextQuestion;
export const analyzePlantImage = aiProxyAdapter.analyzePlantImage;
export const summarizeArticle = aiProxyAdapter.summarizeArticle;
export const summarizeVideo = aiProxyAdapter.summarizeVideo;
