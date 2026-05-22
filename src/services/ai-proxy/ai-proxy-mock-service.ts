import { getAICreditCost } from '@/services/ai/ai-credit-cost-policy';
import { buildAIRequestPlan } from '@/services/ai/ai-request-planner';
import type { AIRequestPlan, AIRequestType } from '@/services/ai/ai-request.types';
import {
  defaultSafetyDisclaimers,
  plantImageFixtures,
  textAnswerFixtures,
} from '@/services/ai-proxy/ai-proxy-fixtures';
import type {
  AIMockScenario,
  AIPlantImageProxyResponse,
  AIProxyCreditValidation,
  AIProxyLogsPreview,
  AIProxyStatus,
  AISummaryProxyResponse,
  AITextAnswer,
  AITextProxyResponse,
  AnalyzePlantImageInput,
  AskTextQuestionInput,
  SummarizeContentInput,
} from '@/services/ai-proxy/ai-proxy.types';
import type { AICreditSummary } from '@/services/ai-credits/ai-credit.types';

function now() {
  return new Date().toISOString();
}

function createRequestId(prefix: string) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createCreditValidation(
  summary: AICreditSummary,
  requiredCredits: number,
  scenario: AIMockScenario,
): AIProxyCreditValidation {
  const forcedInsufficient = scenario === 'insufficient_credits';
  const availableCredits = forcedInsufficient ? Math.min(summary.totalAvailable, Math.max(requiredCredits - 1, 0)) : summary.totalAvailable;
  const enoughCredits = !forcedInsufficient && availableCredits >= requiredCredits;

  return {
    requiredCredits,
    availableCredits,
    enoughCredits,
    dailyFreeRemaining: summary.dailyFreeRemaining,
    rewardedCredits: summary.rewardedCredits,
    proCredits: summary.proCredits,
    validationSource: 'local_guest_credit_fixture',
    wouldConsumeOnSuccess: enoughCredits,
    message: enoughCredits
      ? `มีเครดิตเพียงพอสำหรับคำขอนี้ (${requiredCredits} เครดิต)`
      : `เครดิตไม่พอ ต้องใช้ ${requiredCredits} เครดิต แต่มี ${availableCredits} เครดิต`,
  };
}

function createLogsPreview(plan: AIRequestPlan, wouldWriteTables: string[]): AIProxyLogsPreview {
  return {
    endpoint: plan.estimatedBackendEndpoint,
    providerKeyLocation: 'server_only_not_in_frontend',
    networkCalls: false,
    wouldValidateAuth: true,
    wouldValidateCredits: true,
    wouldWriteTables,
    notes: [
      'M11 เป็น fixture เท่านั้น ไม่มี network request',
      'provider key ต้องอยู่ฝั่ง backend หรือ edge function เท่านั้น',
      'เครดิตถูกตรวจแบบ dry-run จาก local guest credit state',
    ],
  };
}

function mergeDisclaimers(plan: AIRequestPlan, extra: string[] = []) {
  return Array.from(new Set([...defaultSafetyDisclaimers, ...plan.disclaimers, ...extra]));
}

function getStatusFromScenario(scenario: AIMockScenario, validation: AIProxyCreditValidation): AIProxyStatus {
  if (!validation.enoughCredits || scenario === 'insufficient_credits') {
    return 'insufficient_credits';
  }

  if (scenario === 'safety_blocked') {
    return 'safety_blocked';
  }

  if (scenario === 'failed_retryable') {
    return 'failed';
  }

  if (scenario === 'no_plant_detected') {
    return 'rejected';
  }

  return 'success';
}

function createWarnings(plan: AIRequestPlan, scenario: AIMockScenario) {
  const warnings = [...plan.warnings];

  if (scenario === 'safety_warning') {
    warnings.push('คำตอบนี้เกี่ยวข้องกับความปลอดภัย ต้องตรวจสอบกับผู้เชี่ยวชาญก่อนใช้งานจริง');
  }

  if (scenario === 'failed_retryable') {
    warnings.push('จำลอง backend ขัดข้องชั่วคราว สามารถลองใหม่ได้');
  }

  if (scenario === 'low_confidence') {
    warnings.push('ความมั่นใจต่ำ ควรเพิ่มข้อมูลหรือรูปภาพประกอบ');
  }

  if (scenario === 'blurry_image') {
    warnings.push('ภาพไม่ชัดพอ ลองถ่ายใกล้ใบพืชมากขึ้น');
  }

  if (scenario === 'no_plant_detected') {
    warnings.push('ยังไม่พบใบพืชหรือแมลงที่ชัดเจนในภาพ');
  }

  return warnings;
}

function getTextFixture(plan: AIRequestPlan, scenario: AIMockScenario): AITextAnswer {
  if (scenario === 'safety_warning') {
    return textAnswerFixtures.safetyWarning;
  }

  if (plan.requestType === 'risky_or_complex_question' || plan.safetyLevel === 'high') {
    return textAnswerFixtures.risky;
  }

  return textAnswerFixtures.normal;
}

function inferPlantScenario(input: AnalyzePlantImageInput): AIMockScenario {
  if (input.scenario && input.scenario !== 'success') {
    return input.scenario;
  }

  const fileName = (input.fileName ?? '').toLowerCase();

  if (fileName.includes('blur') || fileName.includes('เบลอ')) {
    return 'blurry_image';
  }

  if (fileName.includes('no-plant') || fileName.includes('empty') || fileName.includes('soil')) {
    return 'no_plant_detected';
  }

  if (fileName.includes('low') || fileName.includes('unclear')) {
    return 'low_confidence';
  }

  if (fileName.includes('safe') || fileName.includes('chemical')) {
    return 'safety_warning';
  }

  return input.scenario ?? 'success';
}

function createTextResponse(
  requestType: AIRequestType | undefined,
  planPrompt: string,
  creditSummary: AICreditSummary,
  scenario: AIMockScenario,
  answerTitle: string,
  wouldWriteTables: string[],
): AITextProxyResponse {
  const plan = buildAIRequestPlan({ prompt: planPrompt, requestType, sourceRoute: '/app/ai' });
  const validation = createCreditValidation(creditSummary, getAICreditCost(plan.requestType), scenario);
  const status = getStatusFromScenario(scenario, validation);
  const baseAnswer = getTextFixture(plan, scenario);
  const answer: AITextAnswer | undefined =
    status === 'success'
      ? {
          ...baseAnswer,
          title: answerTitle || baseAnswer.title,
        }
      : undefined;

  return {
    requestId: createRequestId('ai-text'),
    status,
    requestType: plan.requestType,
    creditCost: plan.creditCost,
    creditValidation: validation,
    modelPlan: plan,
    answer,
    safetyDisclaimers: mergeDisclaimers(plan),
    warnings: createWarnings(plan, scenario),
    logsPreview: createLogsPreview(plan, wouldWriteTables),
    retryable: status === 'failed',
    createdAt: now(),
  };
}

export function askTextQuestion(input: AskTextQuestionInput): AITextProxyResponse {
  const scenario = input.scenario ?? 'success';

  return createTextResponse(
    undefined,
    input.question,
    input.creditSummary,
    scenario,
    'คำตอบตัวอย่างจาก AI เกษตร',
    ['ai_question_logs', 'ai_credit_transactions'],
  );
}

export function analyzePlantImage(input: AnalyzePlantImageInput): AIPlantImageProxyResponse {
  const scenario = inferPlantScenario(input);
  const plan = buildAIRequestPlan({
    prompt: input.fileName ?? 'plant-image',
    requestType: 'plant_image_analysis',
    sourceRoute: '/app/analyze',
    metadata: {
      fileName: input.fileName,
      fileSize: input.fileSize,
      fileType: input.fileType,
    },
  });
  const validation = createCreditValidation(input.creditSummary, plan.creditCost, scenario);
  const status = getStatusFromScenario(scenario, validation);
  const fixtureKey =
    scenario === 'low_confidence'
      ? 'lowConfidence'
      : scenario === 'no_plant_detected'
        ? 'noPlant'
        : scenario === 'blurry_image'
          ? 'blurry'
          : scenario === 'safety_warning'
            ? 'safetyWarning'
            : 'normal';
  const result =
    status === 'success' || status === 'rejected'
      ? {
          ...plantImageFixtures[fixtureKey],
        }
      : undefined;

  return {
    requestId: createRequestId('ai-image'),
    status,
    requestType: plan.requestType,
    creditCost: plan.creditCost,
    creditValidation: validation,
    modelPlan: plan,
    result,
    safetyDisclaimers: mergeDisclaimers(plan, ['รูปภาพใน M11 ใช้ preview ภายในเครื่องเท่านั้น ยังไม่มีการอัปโหลดหรือบันทึกไฟล์ภาพจริง']),
    warnings: createWarnings(plan, scenario),
    logsPreview: createLogsPreview(plan, ['ai_question_logs', 'ai_credit_transactions', 'farm_records']),
    retryable: status === 'failed' || scenario === 'blurry_image',
    createdAt: now(),
  };
}

export function summarizeArticle(input: SummarizeContentInput): AISummaryProxyResponse {
  return createTextResponse(
    'article_summary',
    `${input.title} ${input.description ?? ''}`,
    input.creditSummary,
    input.scenario ?? 'success',
    'สรุปบทความตัวอย่าง',
    ['ai_question_logs', 'ai_credit_transactions', 'articles'],
  );
}

export function summarizeVideo(input: SummarizeContentInput): AISummaryProxyResponse {
  return createTextResponse(
    'video_summary',
    `${input.title} ${input.description ?? ''}`,
    input.creditSummary,
    input.scenario ?? 'success',
    'สรุปวิดีโอตัวอย่าง',
    ['ai_question_logs', 'ai_credit_transactions', 'videos'],
  );
}
