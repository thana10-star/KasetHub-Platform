import { mapGuardrailFailureToResponse } from './guardrails/safety-fallbacks';
import { parseProviderTimeoutMs, runProviderWithTimeout } from './guardrails/provider-timeout';
import { validateAIOutput } from './guardrails/output-validator';
import type { FarmerAssistantProviderAdapter } from './providers/ai-provider';
import { selectFarmerAssistantProvider } from './providers/provider-factory';
import type {
  FarmerAssistantProviderEnv,
  FarmerAssistantResponse,
  FarmerAssistantTopic,
  FarmerAssistantUserMode,
} from './providers/provider-types';

export type { FarmerAssistantResponse } from './providers/provider-types';

type FarmerAssistantFixtureState =
  | 'ready_mock'
  | 'not_configured'
  | 'rate_limited'
  | 'blocked_high_risk'
  | 'provider_error'
  | 'timeout'
  | 'validation_error';

type FarmerAssistantRequestBody = {
  question?: unknown;
  crop?: unknown;
  province?: unknown;
  topic?: unknown;
  userMode?: unknown;
  clientRequestId?: unknown;
};

type FarmerAssistantEnv = FarmerAssistantProviderEnv & {
  OPENAI_API_KEY?: string;
  AI_MAX_INPUT_CHARS?: string;
  AI_COOLDOWN_SECONDS?: string;
  AI_PROVIDER_TIMEOUT_MS?: string;
};

type FarmerAssistantFunctionContext = {
  env?: FarmerAssistantEnv;
  providerFetch?: typeof fetch;
  providerOverride?: FarmerAssistantProviderAdapter;
  request: Request;
};

type ValidatedFarmerAssistantRequest = {
  question: string;
  crop?: string;
  province?: string;
  topic: FarmerAssistantTopic;
  userMode: FarmerAssistantUserMode;
  clientRequestId?: string;
};

const DEFAULT_MAX_INPUT_CHARS = 1200;
const DEFAULT_COOLDOWN_SECONDS = 20;
const allowedTopics = new Set<FarmerAssistantTopic>([
  'plant_problem',
  'soil_fertilizer',
  'water',
  'weather',
  'price',
  'livestock',
  'general',
]);
const allowedUserModes = new Set<FarmerAssistantUserMode>(['guest', 'signed_in']);

function cleanOptionalEnv(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function isEnabledEnv(value?: string) {
  return ['true', '1', 'yes', 'on'].includes(cleanOptionalEnv(value)?.toLowerCase() ?? '');
}

function parsePositiveInteger(value: string | undefined, fallback: number, max: number) {
  const parsed = Number(cleanOptionalEnv(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(Math.floor(parsed), max) : fallback;
}

function getMaxInputChars(env?: FarmerAssistantEnv) {
  return parsePositiveInteger(env?.AI_MAX_INPUT_CHARS, DEFAULT_MAX_INPUT_CHARS, 4000);
}

function getCooldownSeconds(env?: FarmerAssistantEnv) {
  return parsePositiveInteger(env?.AI_COOLDOWN_SECONDS, DEFAULT_COOLDOWN_SECONDS, 86_400);
}

function getProviderTimeoutMs(env?: FarmerAssistantEnv) {
  return parseProviderTimeoutMs(env?.AI_PROVIDER_TIMEOUT_MS);
}

function isGeminiProvider(env?: FarmerAssistantEnv) {
  return cleanOptionalEnv(env?.AI_PROVIDER)?.toLowerCase() === 'gemini';
}

function isGeminiLiveActivationRequested(env?: FarmerAssistantEnv) {
  return isGeminiProvider(env) && isEnabledEnv(env?.AI_LIVE_ENABLED) && isEnabledEnv(env?.AI_ALLOW_LIVE_EXECUTION);
}

function hasGeminiApiKey(env?: FarmerAssistantEnv) {
  return Boolean(cleanOptionalEnv(env?.GEMINI_API_KEY));
}

function getProviderFetch(context: FarmerAssistantFunctionContext) {
  if (!isGeminiLiveActivationRequested(context.env)) {
    return undefined;
  }

  return context.providerFetch ?? globalThis.fetch?.bind(globalThis);
}

function sanitizeClientRequestId(value?: string) {
  const safe = value?.trim().replace(/[^a-zA-Z0-9._-]/g, '').slice(0, 80);
  return safe || undefined;
}

function createRequestId(clientRequestId?: string) {
  const safeClientRequestId = sanitizeClientRequestId(clientRequestId);

  if (safeClientRequestId) {
    return `ai-farmer-${safeClientRequestId}`;
  }

  return `ai-farmer-stub-${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 8)}`;
}

function jsonResponse(body: FarmerAssistantResponse, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

function fixtureResponse(state: FarmerAssistantFixtureState, requestId: string, retryAfterSeconds?: number): FarmerAssistantResponse {
  const fixtures: Record<FarmerAssistantFixtureState, FarmerAssistantResponse> = {
    ready_mock: {
      status: 'ready',
      answer:
        'ตัวอย่างคำตอบสำหรับทดสอบเท่านั้น: จากอาการที่เล่า อาจเกิดได้จากหลายสาเหตุ ควรเริ่มจากสังเกตดิน น้ำ ใบ และแมลงก่อนสรุป',
      safetyLevel: 'caution',
      followUpQuestions: ['ปลูกพืชชนิดใด', 'อาการเริ่มเมื่อไร', 'ช่วงนี้ฝนตกหรือให้น้ำมากไหม'],
      disclaimers: [
        'นี่เป็นตัวอย่างสำหรับทดสอบสัญญา ไม่ใช่คำตอบจากผู้ให้บริการ AI จริง',
        'คำตอบจริงควรตรวจสอบกับผู้เชี่ยวชาญหรือหน่วยงานเกษตรในพื้นที่ก่อนใช้จริง',
      ],
      provider: 'mock',
      providerMode: 'dry_run',
    },
    not_configured: {
      status: 'not_configured',
      answer: 'ระบบ AI กำลังเตรียมเปิดใช้งาน ตอนนี้ยังไม่มีการเรียกผู้ให้บริการ AI จริง',
      safetyLevel: 'normal',
      followUpQuestions: [],
      disclaimers: ['ยังไม่มีการเรียกผู้ให้บริการ AI จริงในรุ่นนี้'],
      provider: 'disabled',
      providerMode: 'disabled',
    },
    rate_limited: {
      status: 'rate_limited',
      answer: 'วันนี้ถามได้ครบตามจำนวนที่กำหนดแล้ว ลองใหม่ภายหลัง',
      safetyLevel: 'normal',
      followUpQuestions: [],
      disclaimers: ['ระบบจำกัดจำนวนคำถามเพื่อควบคุมค่าใช้จ่ายและให้บริการได้เสถียร'],
      provider: 'disabled',
      providerMode: 'disabled',
      retryAfterSeconds,
    },
    blocked_high_risk: {
      status: 'blocked',
      answer:
        'คำถามนี้เสี่ยงต่อความปลอดภัย แอพจึงไม่ให้คำแนะนำเรื่องอัตราใช้หรือการผสมสารเคมี ควรอ่านฉลากจริงและปรึกษาเจ้าหน้าที่เกษตรหรือผู้เชี่ยวชาญในพื้นที่',
      safetyLevel: 'high_risk',
      followUpQuestions: ['ต้องการให้ช่วยเตรียมรายการข้อมูลสำหรับคุยกับผู้เชี่ยวชาญไหม'],
      disclaimers: ['ไม่ควรผสมหรือใช้สารเคมีโดยไม่มีฉลากจริงและคำแนะนำจากผู้เชี่ยวชาญ'],
      provider: 'disabled',
      providerMode: 'disabled',
    },
    provider_error: {
      status: 'error',
      answer: 'ยังตอบคำถามนี้ไม่ได้ ลองใหม่อีกครั้ง',
      safetyLevel: 'normal',
      followUpQuestions: [],
      disclaimers: ['ระบบไม่แสดงรายละเอียดข้อผิดพลาดทางเทคนิคให้ผู้ใช้เห็น'],
      provider: 'disabled',
      providerMode: 'disabled',
    },
    timeout: {
      status: 'error',
      answer: 'ระบบใช้เวลานานเกินไป ลองส่งคำถามอีกครั้ง',
      safetyLevel: 'normal',
      followUpQuestions: [],
      disclaimers: ['ยังไม่มีคำตอบจากผู้ให้บริการ AI และไม่ควรหักเครดิตถ้าไม่มีคำตอบ'],
      provider: 'disabled',
      providerMode: 'disabled',
    },
    validation_error: {
      status: 'error',
      answer: 'พิมพ์คำถามให้ครบและสั้นลง แล้วลองใหม่',
      safetyLevel: 'normal',
      followUpQuestions: [],
      disclaimers: ['คำถามต้องไม่ว่างและควรยาวไม่เกิน 1,200 ตัวอักษรใน V1'],
      provider: 'disabled',
      providerMode: 'disabled',
    },
  };

  return {
    ...fixtures[state],
    requestId,
  };
}

export function buildFarmerAssistantFixtureResponse(
  state: FarmerAssistantFixtureState,
  requestId = 'ai-farmer-fixture',
  retryAfterSeconds?: number,
) {
  return fixtureResponse(state, requestId, retryAfterSeconds);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function getOptionalString(body: FarmerAssistantRequestBody, key: keyof FarmerAssistantRequestBody) {
  const value = body[key];
  if (value === undefined || value === null) return { ok: true as const, value: undefined };
  if (typeof value !== 'string') return { ok: false as const };

  const trimmed = value.trim();
  return { ok: true as const, value: trimmed || undefined };
}

function validateRequestBody(
  rawBody: unknown,
  env?: FarmerAssistantEnv,
): { ok: true; value: ValidatedFarmerAssistantRequest } | { ok: false; requestId: string; response: FarmerAssistantResponse } {
  if (!isPlainObject(rawBody)) {
    const requestId = createRequestId();

    return {
      ok: false,
      requestId,
      response: fixtureResponse('validation_error', requestId),
    };
  }

  const body = rawBody as FarmerAssistantRequestBody;
  const clientRequestIdResult = getOptionalString(body, 'clientRequestId');
  const clientRequestId = clientRequestIdResult.ok ? clientRequestIdResult.value : undefined;
  const requestId = createRequestId(clientRequestId);

  if (!clientRequestIdResult.ok) {
    return { ok: false, requestId, response: fixtureResponse('validation_error', requestId) };
  }

  if (typeof body.question !== 'string') {
    return { ok: false, requestId, response: fixtureResponse('validation_error', requestId) };
  }

  const question = body.question.trim();
  const maxInputChars = getMaxInputChars(env);

  if (!question || question.length > maxInputChars) {
    return { ok: false, requestId, response: fixtureResponse('validation_error', requestId) };
  }

  const cropResult = getOptionalString(body, 'crop');
  const provinceResult = getOptionalString(body, 'province');

  if (!cropResult.ok || !provinceResult.ok) {
    return { ok: false, requestId, response: fixtureResponse('validation_error', requestId) };
  }

  const topic = body.topic ?? 'general';
  if (typeof topic !== 'string' || !allowedTopics.has(topic as FarmerAssistantTopic)) {
    return { ok: false, requestId, response: fixtureResponse('validation_error', requestId) };
  }

  const userMode = body.userMode ?? 'guest';
  if (typeof userMode !== 'string' || !allowedUserModes.has(userMode as FarmerAssistantUserMode)) {
    return { ok: false, requestId, response: fixtureResponse('validation_error', requestId) };
  }

  return {
    ok: true,
    value: {
      question,
      crop: cropResult.value,
      province: provinceResult.value,
      topic: topic as FarmerAssistantTopic,
      userMode: userMode as FarmerAssistantUserMode,
      clientRequestId: clientRequestIdResult.value,
    },
  };
}

function isBlockedHighRiskQuestion(question: string) {
  const normalized = question.toLowerCase();
  const asksForChemicalDosage =
    /(กี่ซีซี|กี่ cc|กี่มล|กี่ ml|อัตรา|โดส|dose|dosage).*(ยา|สารเคมี|ยาฆ่า|pesticide|herbicide|fungicide|insecticide)/i.test(normalized) ||
    /(ยา|สารเคมี|ยาฆ่า|pesticide|herbicide|fungicide|insecticide).*(กี่ซีซี|กี่ cc|กี่มล|กี่ ml|อัตรา|โดส|dose|dosage)/i.test(normalized);
  const asksForDangerousMixing = /(ผสม|mix).*(สารเคมี|ยา|ยาฆ่า|กรด|ด่าง|pesticide|chemical)/i.test(normalized);
  const hasEmergencyHealthClaim = /(กินยา|ดื่มยา|สูดดม|เข้าตา|แพ้ยา|หายใจไม่ออก|สัตว์.*ฉุกเฉิน|วัว.*ป่วยหนัก|poison|poisoning|emergency)/i.test(normalized);

  return asksForChemicalDosage || asksForDangerousMixing || hasEmergencyHealthClaim;
}

function isObviousSpam(question: string) {
  return /([^\s])\1{40,}/.test(question) || question.split(/\s+/).filter(Boolean).length > 220;
}

async function parseJsonBody(request: Request) {
  try {
    const text = await request.text();
    return { ok: true as const, value: text ? JSON.parse(text) : undefined };
  } catch {
    return { ok: false as const };
  }
}

export async function handleFarmerAssistantRequest(context: FarmerAssistantFunctionContext) {
  const { request, env } = context;

  if (request.method.toUpperCase() !== 'POST') {
    return jsonResponse(fixtureResponse('validation_error', createRequestId()), 405);
  }

  const parsedBody = await parseJsonBody(request);
  if (!parsedBody.ok) {
    return jsonResponse(fixtureResponse('validation_error', createRequestId()), 400);
  }

  const validation = validateRequestBody(parsedBody.value, env);
  if (!validation.ok) {
    return jsonResponse(validation.response, 400);
  }

  const requestId = createRequestId(validation.value.clientRequestId);

  if (isObviousSpam(validation.value.question)) {
    return jsonResponse(fixtureResponse('rate_limited', requestId, getCooldownSeconds(env)), 429);
  }

  if (isBlockedHighRiskQuestion(validation.value.question)) {
    return jsonResponse(fixtureResponse('blocked_high_risk', requestId));
  }

  if (!context.providerOverride && isGeminiLiveActivationRequested(env) && !hasGeminiApiKey(env)) {
    return jsonResponse(fixtureResponse('not_configured', requestId));
  }

  const providerFetch = getProviderFetch(context);
  const provider =
    context.providerOverride ??
    selectFarmerAssistantProvider(env, {
      allowLiveExecution: isGeminiLiveActivationRequested(env),
      fetcher: providerFetch,
    });
  const providerRequest = {
    question: validation.value.question,
    crop: validation.value.crop,
    province: validation.value.province,
    topic: validation.value.topic,
    userMode: validation.value.userMode,
    requestId,
  };
  const providerResult = await runProviderWithTimeout(() => provider.generateAnswer(providerRequest), {
    timeoutMs: getProviderTimeoutMs(env),
  });

  if (!providerResult.ok) {
    return jsonResponse(
      mapGuardrailFailureToResponse({
        reasonCodes: [providerResult.reasonCode],
        requestId,
        providerMode: provider.providerMode,
      }),
      providerResult.reasonCode === 'provider_timeout' ? 504 : 502,
    );
  }

  const outputValidation = validateAIOutput({
    answer: providerResult.response.answer ?? '',
    question: validation.value.question,
    crop: validation.value.crop,
    province: validation.value.province,
    topic: validation.value.topic,
    inputSafetyLevel: providerResult.response.safetyLevel,
    providerName: provider.providerName,
    providerMode: provider.providerMode,
  });

  if (!outputValidation.allowed) {
    return jsonResponse(
      mapGuardrailFailureToResponse({
        reasonCodes: outputValidation.reasonCodes,
        requestId,
        providerMode: provider.providerMode,
      }),
    );
  }

  return jsonResponse({
    ...providerResult.response,
    answer: outputValidation.sanitizedAnswer ?? providerResult.response.answer,
    safetyLevel: outputValidation.safetyLevel,
  });
}

export function onRequest(context: FarmerAssistantFunctionContext) {
  return handleFarmerAssistantRequest(context);
}
