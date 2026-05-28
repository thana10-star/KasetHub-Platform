import { publicEnv } from '@/config/env';

export type FarmerAssistantTopic =
  | 'plant_problem'
  | 'soil_fertilizer'
  | 'water'
  | 'weather'
  | 'price'
  | 'livestock'
  | 'general';

export type FarmerAssistantUserMode = 'guest' | 'signed_in';
export type FarmerAssistantStatus = 'ready' | 'not_configured' | 'rate_limited' | 'blocked' | 'error';
export type FarmerAssistantSafetyLevel = 'normal' | 'caution' | 'high_risk';
export type FarmerAssistantProvider = 'openai' | 'disabled' | 'mock';

export type FarmerAssistantRequest = {
  question: string;
  crop?: string;
  province?: string;
  topic?: FarmerAssistantTopic;
  userMode?: FarmerAssistantUserMode;
  clientRequestId?: string;
};

export type FarmerAssistantResponse = {
  status: FarmerAssistantStatus;
  answer?: string;
  safetyLevel?: FarmerAssistantSafetyLevel;
  followUpQuestions?: string[];
  disclaimers?: string[];
  provider?: FarmerAssistantProvider;
  requestId?: string;
  retryAfterSeconds?: number;
};

type AskFarmerAssistantOptions = {
  endpoint?: string;
  fetcher?: typeof fetch;
};

const endpoint = '/api/ai/farmer-assistant';
const statuses = new Set<FarmerAssistantStatus>(['ready', 'not_configured', 'rate_limited', 'blocked', 'error']);
const safetyLevels = new Set<FarmerAssistantSafetyLevel>(['normal', 'caution', 'high_risk']);
const providers = new Set<FarmerAssistantProvider>(['openai', 'disabled', 'mock']);

function optionalString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function optionalStringList(value: unknown) {
  return Array.isArray(value) ? value.map(optionalString).filter((item): item is string => Boolean(item)) : undefined;
}

function optionalPositiveInteger(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? Math.floor(value) : undefined;
}

function createRequestId(clientRequestId?: string) {
  const safeClientRequestId = clientRequestId?.trim().replace(/[^a-zA-Z0-9._-]/g, '').slice(0, 80);

  if (safeClientRequestId) {
    return `ai-farmer-client-${safeClientRequestId}`;
  }

  return `ai-farmer-client-${Date.now().toString(36)}`;
}

function createClientErrorResponse(clientRequestId?: string): FarmerAssistantResponse {
  return {
    status: 'error',
    answer: 'ยังเชื่อมต่อผู้ช่วย AI ไม่ได้ ลองใหม่อีกครั้ง',
    safetyLevel: 'normal',
    followUpQuestions: [],
    disclaimers: ['ระบบยังไม่แสดงรายละเอียดข้อผิดพลาดทางเทคนิคให้ผู้ใช้เห็น'],
    provider: 'disabled',
    requestId: createRequestId(clientRequestId),
  };
}

async function parseJsonResponse(response: Response) {
  try {
    const text = await response.text();
    return { ok: true as const, value: text ? JSON.parse(text) : undefined };
  } catch {
    return { ok: false as const };
  }
}

function normalizeBackendResponse(value: unknown, clientRequestId?: string): FarmerAssistantResponse | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  const payload = value as Record<string, unknown>;
  const status = payload.status;

  if (typeof status !== 'string' || !statuses.has(status as FarmerAssistantStatus)) {
    return null;
  }

  const safetyLevel = payload.safetyLevel;
  const provider = payload.provider;

  return {
    status: status as FarmerAssistantStatus,
    answer: optionalString(payload.answer),
    safetyLevel:
      typeof safetyLevel === 'string' && safetyLevels.has(safetyLevel as FarmerAssistantSafetyLevel)
        ? (safetyLevel as FarmerAssistantSafetyLevel)
        : undefined,
    followUpQuestions: optionalStringList(payload.followUpQuestions),
    disclaimers: optionalStringList(payload.disclaimers),
    provider: typeof provider === 'string' && providers.has(provider as FarmerAssistantProvider) ? (provider as FarmerAssistantProvider) : undefined,
    requestId: optionalString(payload.requestId) ?? createRequestId(clientRequestId),
    retryAfterSeconds: optionalPositiveInteger(payload.retryAfterSeconds),
  };
}

export function isAIBackendContractEnabled(env: Pick<typeof publicEnv, 'aiBackendContractEnabled'> = publicEnv) {
  return env.aiBackendContractEnabled;
}

export async function askFarmerAssistantViaBackend(
  request: FarmerAssistantRequest,
  options: AskFarmerAssistantOptions = {},
): Promise<FarmerAssistantResponse> {
  const fetcher = options.fetcher ?? globalThis.fetch?.bind(globalThis);

  if (!fetcher) {
    return createClientErrorResponse(request.clientRequestId);
  }

  try {
    const response = await fetcher(options.endpoint ?? endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    const parsed = await parseJsonResponse(response);

    if (!parsed.ok) {
      return createClientErrorResponse(request.clientRequestId);
    }

    const normalized = normalizeBackendResponse(parsed.value, request.clientRequestId);
    return normalized ?? createClientErrorResponse(request.clientRequestId);
  } catch {
    return createClientErrorResponse(request.clientRequestId);
  }
}
