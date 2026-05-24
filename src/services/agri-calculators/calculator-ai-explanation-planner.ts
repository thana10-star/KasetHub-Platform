import type {
  CalculatorAIExplanationAllowedAction,
  CalculatorAIExplanationBlockedAction,
  CalculatorAIExplanationPlan,
  CalculatorAIExplanationRequest,
  CalculatorAIExplanationRisk,
} from '@/services/agri-calculators/calculator-ai-explanation.types';
import {
  calculatorAIAllowedActions,
  calculatorAIBlockedActions,
  calculatorAIExplanationBoundary,
  getCalculatorAIAllowedActionLabel,
  getCalculatorAIBlockedActionLabel,
  isCalculatorAIAllowedAction,
  isCalculatorAIBlockedAction,
} from '@/services/agri-calculators/calculator-ai-explanation-policy';

function createRequestId(request: CalculatorAIExplanationRequest) {
  return `calculator-ai-preview:${request.calculatorType}:${request.summary.id}`;
}

function uniqueLines(lines: string[]) {
  return Array.from(new Set(lines.map((line) => line.trim()).filter(Boolean)));
}

function classifyRisk(request: CalculatorAIExplanationRequest, blockedRequestedActions: CalculatorAIExplanationBlockedAction[]): CalculatorAIExplanationRisk {
  if (blockedRequestedActions.length > 0) return 'high';
  if (calculatorAIExplanationBoundary.highRiskCalculatorCategories.includes(request.calculatorType)) return 'high';
  if ((request.warnings ?? request.summary.warningRecap).length > 0) return 'medium';
  if (request.calculatorType === 'yield_estimate' || request.calculatorType === 'cost_estimate') return 'medium';
  return 'low';
}

function createAllowedSections(request: CalculatorAIExplanationRequest) {
  return calculatorAIAllowedActions.map((action) => {
    const bullets: string[] = [];

    if (action.id === 'explain_inputs') {
      bullets.push(...request.summary.inputRecap.slice(0, 4));
    } else if (action.id === 'explain_formulas') {
      bullets.push('อธิบายสูตรจาก calculator service เท่านั้น');
      bullets.push('ห้ามเพิ่มสูตร crop recommendation ที่ไม่ได้อยู่ในผลลัพธ์');
    } else if (action.id === 'explain_result_meaning') {
      bullets.push(...request.summary.resultRecap.slice(0, 4));
    } else if (action.id === 'suggest_what_to_double_check') {
      bullets.push('ตรวจหน่วย พื้นที่ น้ำหนัก ราคา หรือฉลากจริงก่อนใช้');
      bullets.push(...(request.warnings ?? request.summary.warningRecap).slice(0, 3));
    } else if (action.id === 'suggest_asking_expert') {
      bullets.push('ถ้าเกี่ยวกับสารเคมี ปุ๋ย หรือความปลอดภัย ควรถามเจ้าหน้าที่หรือนักวิชาการเกษตร');
    } else if (action.id === 'explain_safety_disclaimer') {
      bullets.push(request.summary.safetyDisclaimer);
    }

    return {
      id: action.id,
      title: action.label,
      bullets: uniqueLines(bullets.length > 0 ? bullets : [action.description]),
    };
  });
}

function createBlockedSections(blockedRequestedActions: CalculatorAIExplanationBlockedAction[]) {
  const requested = new Set(blockedRequestedActions);

  return calculatorAIBlockedActions.map((action) => ({
    id: action.id,
    title: action.label,
    reason: requested.has(action.id)
      ? `คำขอนี้ถูกบล็อกโดย policy: ${action.description}`
      : action.description,
  }));
}

function createPromptScaffoldPreview(
  request: CalculatorAIExplanationRequest,
  blockedRequestedActions: CalculatorAIExplanationBlockedAction[],
  safetyDisclaimers: string[],
) {
  const cropLine = request.cropLabel ? `พืช/บริบท: ${request.cropLabel}` : 'พืช/บริบท: ไม่ระบุ';
  const blockedLine =
    blockedRequestedActions.length > 0
      ? blockedRequestedActions.map(getCalculatorAIBlockedActionLabel).join(', ')
      : 'ไม่มี blocked action ที่ผู้ใช้ร้องขอ';

  return [
    'SYSTEM: คุณเป็นผู้ช่วยอธิบายผลคำนวณของ KasetHub แบบปลอดภัย',
    'ห้ามเรียก API จริงใน preview นี้',
    'ห้ามเปลี่ยนผลคำนวณ ห้ามเพิ่มคำแนะนำสินค้า ห้ามรับประกันผล',
    `เครื่องคำนวณ: ${request.summary.calculatorLabel}`,
    cropLine,
    'ผลคำนวณที่ต้องคงเดิม:',
    ...request.summary.resultRecap.map((line) => `- ${line}`),
    'อธิบายได้เฉพาะ:',
    ...calculatorAIAllowedActions.map((action) => `- ${action.label}`),
    `สิ่งที่ถูกบล็อก: ${blockedLine}`,
    'คำเตือนที่ต้องพูด:',
    ...safetyDisclaimers.map((line) => `- ${line}`),
  ].join('\n');
}

export function buildCalculatorAIExplanationPlan(request: CalculatorAIExplanationRequest): CalculatorAIExplanationPlan {
  const requestedActions = request.requestedActions ?? [];
  const allowedRequestedActions = requestedActions.filter((action): action is CalculatorAIExplanationAllowedAction =>
    isCalculatorAIAllowedAction(action),
  );
  const blockedRequestedActions = requestedActions.filter((action): action is CalculatorAIExplanationBlockedAction =>
    isCalculatorAIBlockedAction(action),
  );
  const safetyDisclaimers = uniqueLines([
    ...calculatorAIExplanationBoundary.defaultSafetyDisclaimers,
    request.summary.safetyDisclaimer,
    ...(request.safetyDisclaimers ?? []),
    ...(request.calculatorType === 'spray_mix' ? ['ควรอ่านฉลากจริงก่อนใช้ และ AI ห้าม override ฉลาก'] : []),
    ...(request.calculatorType === 'fertilizer_mix' ? ['ควรตรวจผลดิน/ผู้เชี่ยวชาญก่อนใช้ปุ๋ยจริง และ AI ห้ามเพิ่ม dose นอกสูตร'] : []),
  ]);
  const riskLevel = classifyRisk(request, blockedRequestedActions);

  return {
    requestId: createRequestId(request),
    calculatorType: request.calculatorType,
    calculatorLabel: request.summary.calculatorLabel,
    cropLabel: request.cropLabel,
    explanationMode: 'local_policy_preview',
    riskLevel,
    allowedSections: createAllowedSections(request),
    blockedSections: createBlockedSections(blockedRequestedActions),
    allowedRequestedActions,
    blockedRequestedActions,
    promptScaffoldPreview: createPromptScaffoldPreview(request, blockedRequestedActions, safetyDisclaimers),
    safetyDisclaimers,
    resultValueSnapshot: [...request.summary.resultRecap],
    formulaIntegrity: {
      deterministicResultUnchanged: true,
      noFormulaMutation: true,
      noHiddenRecommendation: true,
    },
    noRealAICall: true,
  };
}

export function summarizeCalculatorAIExplanationPolicy() {
  return {
    allowedCount: calculatorAIAllowedActions.length,
    blockedCount: calculatorAIBlockedActions.length,
    allowedLabels: calculatorAIAllowedActions.map((action) => getCalculatorAIAllowedActionLabel(action.id)),
    blockedLabels: calculatorAIBlockedActions.map((action) => getCalculatorAIBlockedActionLabel(action.id)),
    noRealAICall: true as const,
  };
}

