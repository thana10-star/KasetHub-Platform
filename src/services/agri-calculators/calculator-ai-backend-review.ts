import type {
  CalculatorAIAbuseScenario,
  CalculatorAIAuditLogPlan,
  CalculatorAIBackendArchitectureReview,
  CalculatorAIEscalationRule,
  CalculatorAIExecutionRequest,
  CalculatorAIExecutionSnapshot,
  CalculatorAIPolicyVersion,
  CalculatorAIRateLimitPlan,
  CalculatorAISafetyDecision,
} from '@/services/agri-calculators/calculator-ai-backend.types';
import type {
  CalculatorAIExplanationBlockedAction,
  CalculatorAIExplanationRisk,
} from '@/services/agri-calculators/calculator-ai-explanation.types';
import {
  calculatorAIAllowedActions,
  calculatorAIBlockedActions,
  calculatorAIExplanationBoundary,
  isCalculatorAIBlockedAction,
} from '@/services/agri-calculators/calculator-ai-explanation-policy';
import { isCropCalculatorKey } from '@/services/agri-calculators/crop-calculator-profiles';

export const calculatorAIBackendPipelineSteps = [
  'Calculator',
  'Snapshot Lock',
  'Backend Policy Check',
  'Prompt Builder',
  'AI Explanation',
  'Safety Filter',
  'Final Display',
];

export const calculatorAIRateLimitPlan: CalculatorAIRateLimitPlan = {
  dailyExplanationLimit: 5,
  rewardedAdUnlockLimit: 3,
  repeatedRequestWindowMinutes: 10,
  repeatedRequestMaxCount: 3,
  maxPromptPayloadChars: 4200,
  maxUserQuestionChars: 800,
  maxResultRecapLines: 12,
  oversizedPayloadAction: 'reject_before_ai',
  invalidCropProfileAction: 'reject_or_clear_crop_context',
  spamPreventionRules: [
    'นับคำขออธิบายผลต่อวันต่อ user/session',
    'รวมคำขอซ้ำของ summary เดียวกันในช่วงเวลาสั้น',
    'ตัดคำถามที่ยาวเกินก่อนสร้าง prompt',
    'ไม่ให้อธิบายผลต่อเนื่องแบบ spam โดยไม่มีการเปลี่ยน input',
  ],
  rewardAdBoundary: 'rewarded ads ในอนาคตปลดล็อกความสะดวกเท่านั้น ไม่ปิดกั้นผลคำนวณพื้นฐานหรือคำเตือนความปลอดภัย',
};

export const calculatorAIEscalationRules: CalculatorAIEscalationRule[] = [
  {
    id: 'spray_or_fertilizer_high_risk',
    trigger: 'calculatorType เป็น spray_mix หรือ fertilizer_mix',
    action: 'ใส่ safety filter เข้ม และบังคับอ่านฉลาก/ผลดิน/ผู้เชี่ยวชาญ',
    requiredHumanReview: true,
    severity: 'high',
  },
  {
    id: 'blocked_action_requested',
    trigger: 'ผู้ใช้ขอให้ AI ทำสิ่งที่ policy บล็อก',
    action: 'reject ก่อนเรียก AI และบันทึก safety event ในอนาคต',
    requiredHumanReview: false,
    severity: 'high',
  },
  {
    id: 'invalid_or_oversized_payload',
    trigger: 'snapshot ไม่มีผลลัพธ์ที่ล็อกไว้ หรือ payload ยาวเกินเพดาน',
    action: 'reject ก่อนสร้าง prompt',
    requiredHumanReview: false,
    severity: 'medium',
  },
  {
    id: 'sponsor_or_product_attempt',
    trigger: 'มีคำขอแทรก sponsor, affiliate, product, pesticide, chemical',
    action: 'reject และแยก sponsor ออกจาก AI explanation ทั้งหมด',
    requiredHumanReview: true,
    severity: 'high',
  },
];

export const calculatorAIAbuseScenarios: CalculatorAIAbuseScenario[] = [
  {
    id: 'spam_same_summary',
    label: 'ขออธิบายผลเดิมซ้ำจำนวนมาก',
    detection: 'summary id เดิมเกิน repeatedRequestMaxCount ใน repeatedRequestWindowMinutes',
    action: 'rate_limit',
    severity: 'medium',
    userCopy: 'พักการอธิบายผลนี้ชั่วคราว ลองตรวจข้อมูลหรือคัดลอกสรุปแทน',
  },
  {
    id: 'oversized_prompt_payload',
    label: 'payload ยาวเกินจำเป็น',
    detection: 'input/result/warning/userQuestion รวมกันเกิน maxPromptPayloadChars',
    action: 'reject',
    severity: 'medium',
    userCopy: 'ข้อความยาวเกินไป กรุณาย่อคำถามหรือใช้ผลคำนวณหลักแทน',
  },
  {
    id: 'hidden_sponsor_attempt',
    label: 'พยายามแทรกสินค้า sponsor',
    detection: 'พบคำหรือ action ที่เกี่ยวกับ sponsor, affiliate, product placement',
    action: 'reject',
    severity: 'high',
    userCopy: 'AI อธิบายผลคำนวณได้ แต่ไม่แทรกสินค้า sponsor หรือคำแนะนำแฝง',
  },
  {
    id: 'unsafe_chemical_request',
    label: 'ขอคำแนะนำสารเคมีหรือยาเฉพาะสินค้า',
    detection: 'พบคำขอ pesticide, herbicide, chemical product, override label',
    action: 'escalate',
    severity: 'high',
    userCopy: 'เรื่องสารเคมีต้องตรวจฉลากจริงและผู้เชี่ยวชาญก่อนใช้งาน',
  },
];

export const calculatorAIAuditLogPlan: CalculatorAIAuditLogPlan = {
  requiredFields: [
    'request_id',
    'user_id_or_session_hash',
    'calculator_category',
    'snapshot_id',
    'snapshot_lock_hash',
    'policy_version_id',
    'prompt_template_version_id',
    'safety_decision',
    'risk_level',
    'blocked_action_ids',
    'created_at',
  ],
  redactedFields: ['raw_user_question', 'input_payload', 'result_payload'],
  forbiddenFields: ['provider_api_key', 'service_role_key', 'hidden_sponsor_payload', 'full_precise_location'],
  retentionDays: 180,
  safetyEventTriggers: ['blocked_action_requested', 'sponsor_or_product_attempt', 'invalid_or_oversized_payload'],
  futureTables: [
    'calculator_ai_audit_logs',
    'calculator_ai_policy_versions',
    'calculator_ai_rate_limits',
    'calculator_ai_explanations',
    'calculator_ai_safety_events',
  ],
  noBackendWriteInM56: true,
};

export const calculatorAIPolicyVersions: CalculatorAIPolicyVersion[] = [
  {
    id: 'calc-ai-policy-v2026-05-m56',
    promptTemplateVersionId: 'calc-ai-prompt-th-v2026-05-m56',
    status: 'review_ready',
    locale: 'th-TH',
    effectiveFrom: '2026-05-24T00:00:00.000Z',
    description: 'M56 backend architecture review policy: explanation-only, no formula mutation, no hidden sponsor.',
    allowedActionIds: calculatorAIAllowedActions.map((action) => action.id),
    blockedActionIds: calculatorAIBlockedActions.map((action) => action.id),
    escalationTriggerIds: calculatorAIEscalationRules.map((rule) => rule.id),
    bannedResponseCategories: [
      'hidden_sponsor_or_affiliate',
      'chemical_product_recommendation',
      'fertilizer_dose_not_in_snapshot',
      'guaranteed_yield_or_profit',
      'label_override',
      'uncertainty_removal',
    ],
    sponsorSeparationRules: [
      'ไม่ใส่ sponsor ใน prompt',
      'ไม่ให้ AI เลือกสินค้าแทนสูตร deterministic',
      'paid placement ต้องอยู่คนละ surface และมี label ชัดเจน',
    ],
    auditRequirementIds: calculatorAIAuditLogPlan.requiredFields,
  },
  {
    id: 'calc-ai-policy-v2026-05-m56-strict',
    promptTemplateVersionId: 'calc-ai-prompt-th-v2026-05-m56-strict',
    status: 'draft',
    locale: 'th-TH',
    effectiveFrom: '2026-05-24T00:00:00.000Z',
    description: 'Strict draft for high-risk fertilizer/spray explanations requiring human escalation before live use.',
    allowedActionIds: ['explain_inputs', 'explain_formulas', 'explain_safety_disclaimer'],
    blockedActionIds: calculatorAIBlockedActions.map((action) => action.id),
    escalationTriggerIds: ['spray_or_fertilizer_high_risk', 'sponsor_or_product_attempt'],
    bannedResponseCategories: [
      'hidden_sponsor_or_affiliate',
      'chemical_product_recommendation',
      'fertilizer_dose_not_in_snapshot',
      'label_override',
    ],
    sponsorSeparationRules: ['ไม่มี sponsor ในคำอธิบาย', 'ไม่มี product placement ใน safety copy'],
    auditRequirementIds: calculatorAIAuditLogPlan.requiredFields,
  },
];

const bannedRequestPatterns: Array<{ category: string; pattern: RegExp }> = [
  { category: 'hidden_sponsor_or_affiliate', pattern: /sponsor|affiliate|โฆษณา|สปอนเซอร์|ผู้สนับสนุน|สินค้าแนะนำ/i },
  { category: 'chemical_product_recommendation', pattern: /pesticide|herbicide|chemical product|ยี่ห้อ|สารเคมี|ยาฆ่า|ฮอร์โมน/i },
  { category: 'fertilizer_dose_not_in_snapshot', pattern: /เพิ่มสูตร|แนะนำสูตรปุ๋ย|dose|อัตราปุ๋ย/i },
  { category: 'guaranteed_yield_or_profit', pattern: /รับประกัน|กำไรแน่นอน|ผลผลิตแน่นอน|guarantee/i },
  { category: 'label_override', pattern: /ไม่ต้องอ่านฉลาก|ข้ามฉลาก|override label/i },
];

function stableHash(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) | 0;
  }
  return `calc-lock-${Math.abs(hash).toString(36)}`;
}

function freezeLines(lines: readonly string[]) {
  return Object.freeze([...lines]);
}

function payloadSize(request: CalculatorAIExecutionRequest) {
  return [
    request.summary.id,
    request.summary.summaryTitle,
    request.summary.inputRecap.join('\n'),
    request.summary.resultRecap.join('\n'),
    request.summary.warningRecap.join('\n'),
    request.summary.safetyDisclaimer,
    request.userQuestion ?? '',
    request.cropLabel ?? '',
    request.cropKey ?? '',
  ].join('\n').length;
}

function selectPolicyVersion(policyVersionId?: string, promptTemplateVersionId?: string) {
  const byPolicy = calculatorAIPolicyVersions.find((version) => version.id === policyVersionId);
  if (byPolicy) return byPolicy;

  const byPrompt = calculatorAIPolicyVersions.find((version) => version.promptTemplateVersionId === promptTemplateVersionId);
  return byPrompt ?? calculatorAIPolicyVersions[0];
}

export function buildCalculatorAIExecutionSnapshot(request: CalculatorAIExecutionRequest): CalculatorAIExecutionSnapshot {
  const lockedAt = request.requestedAt;
  const resultValues = freezeLines(request.summary.resultRecap);
  const inputRecap = freezeLines(request.summary.inputRecap);
  const warningRecap = freezeLines(request.summary.warningRecap);
  const allowedEchoValues = freezeLines(resultValues);
  const lockHash = stableHash(
    [
      request.summary.id,
      request.calculatorType,
      ...request.summary.resultRecap,
      request.summary.safetyDisclaimer,
      lockedAt,
    ].join('|'),
  );

  return Object.freeze({
    snapshotId: `calc-ai-snapshot:${request.summary.id}:${lockHash}`,
    sourceSummaryId: request.summary.id,
    calculatorType: request.calculatorType,
    calculatorLabel: request.summary.calculatorLabel,
    calculatorRoute: request.summary.calculatorRoute,
    cropKey: request.cropKey,
    cropLabel: request.cropLabel,
    inputRecap,
    resultValues,
    warningRecap,
    safetyDisclaimer: request.summary.safetyDisclaimer,
    lockedAt,
    lockHash,
    immutable: true,
    aiReceivesExplanationOnlySnapshot: true,
    aiCanRecomputeFormulas: false,
    aiCanMutateOutputs: false,
    aiMustEchoLockedResultValuesOnly: true,
    allowedEchoValues,
  });
}

export function findCalculatorAIBackendRequestIssues(request: CalculatorAIExecutionRequest): string[] {
  const issues: string[] = [];

  if (!request.summary.id.trim()) issues.push('missing_summary_id');
  if (request.summary.category !== request.calculatorType) issues.push('calculator_type_mismatch');
  if (request.summary.resultRecap.length === 0) issues.push('missing_locked_result_values');
  if (request.summary.resultRecap.length > calculatorAIRateLimitPlan.maxResultRecapLines) issues.push('too_many_result_lines');
  if ((request.userQuestion ?? '').length > calculatorAIRateLimitPlan.maxUserQuestionChars) issues.push('user_question_too_long');
  if (payloadSize(request) > calculatorAIRateLimitPlan.maxPromptPayloadChars) issues.push('prompt_payload_too_large');
  if (request.cropKey && !isCropCalculatorKey(request.cropKey)) issues.push('invalid_crop_profile');
  if (!request.localOnlyPreview) issues.push('m56_requires_local_only_preview');

  return issues;
}

function findBlockedRequestedActions(request: CalculatorAIExecutionRequest): CalculatorAIExplanationBlockedAction[] {
  return (request.requestedActions ?? []).filter((action): action is CalculatorAIExplanationBlockedAction =>
    isCalculatorAIBlockedAction(action),
  );
}

function findBannedCategoryMatches(request: CalculatorAIExecutionRequest) {
  const requestText = [request.userQuestion ?? '', ...(request.requestedActions ?? [])].join(' ');
  return Array.from(
    new Set(bannedRequestPatterns.filter((entry) => entry.pattern.test(requestText)).map((entry) => entry.category)),
  );
}

function classifyBackendRisk(
  request: CalculatorAIExecutionRequest,
  invalidRequestReasons: string[],
  blockedActionIds: CalculatorAIExplanationBlockedAction[],
  bannedCategoryMatches: string[],
): CalculatorAIExplanationRisk {
  if (blockedActionIds.length > 0 || bannedCategoryMatches.length > 0) return 'high';
  if (calculatorAIExplanationBoundary.highRiskCalculatorCategories.includes(request.calculatorType)) return 'high';
  if (invalidRequestReasons.length > 0) return 'medium';
  if (request.summary.warningRecap.length > 0) return 'medium';
  return 'low';
}

function findEscalationRuleIds(
  request: CalculatorAIExecutionRequest,
  invalidRequestReasons: string[],
  blockedActionIds: CalculatorAIExplanationBlockedAction[],
  bannedCategoryMatches: string[],
) {
  const ruleIds: string[] = [];

  if (calculatorAIExplanationBoundary.highRiskCalculatorCategories.includes(request.calculatorType)) {
    ruleIds.push('spray_or_fertilizer_high_risk');
  }
  if (blockedActionIds.length > 0) ruleIds.push('blocked_action_requested');
  if (invalidRequestReasons.length > 0) ruleIds.push('invalid_or_oversized_payload');
  if (
    bannedCategoryMatches.includes('hidden_sponsor_or_affiliate') ||
    bannedCategoryMatches.includes('chemical_product_recommendation')
  ) {
    ruleIds.push('sponsor_or_product_attempt');
  }

  return Array.from(new Set(ruleIds));
}

function buildSafetyDecision(request: CalculatorAIExecutionRequest): CalculatorAISafetyDecision {
  const invalidRequestReasons = findCalculatorAIBackendRequestIssues(request);
  const blockedActionIds = findBlockedRequestedActions(request);
  const bannedCategoryMatches = findBannedCategoryMatches(request);
  const escalationRuleIds = findEscalationRuleIds(request, invalidRequestReasons, blockedActionIds, bannedCategoryMatches);
  const riskLevel = classifyBackendRisk(request, invalidRequestReasons, blockedActionIds, bannedCategoryMatches);
  const reasons = [
    ...(invalidRequestReasons.length > 0 ? ['request ไม่พร้อมส่ง backend prompt'] : []),
    ...(blockedActionIds.length > 0 ? ['มี blocked action ที่ต้อง reject ก่อนเรียก AI'] : []),
    ...(bannedCategoryMatches.length > 0 ? ['พบ banned response category ในคำขอ'] : []),
    ...(calculatorAIExplanationBoundary.highRiskCalculatorCategories.includes(request.calculatorType)
      ? ['เครื่องคำนวณนี้เกี่ยวข้องกับปุ๋ย/สารเคมี ต้องยกระดับความระวัง']
      : []),
    'deterministic snapshot ต้องล็อกก่อน prompt builder',
  ];

  const status =
    invalidRequestReasons.length > 0 || blockedActionIds.length > 0 || bannedCategoryMatches.length > 0
      ? 'rejected_before_ai'
      : escalationRuleIds.length > 0
        ? 'requires_human_escalation'
        : 'ready_for_backend_policy_check';

  return {
    status,
    riskLevel,
    reasons,
    blockedActionIds,
    escalationRuleIds,
    bannedCategoryMatches,
    invalidRequestReasons,
    deterministicSnapshotRequired: true,
    noRealAICall: true,
  };
}

export function buildCalculatorAIBackendArchitectureReview(
  request: CalculatorAIExecutionRequest,
): CalculatorAIBackendArchitectureReview {
  const snapshot = buildCalculatorAIExecutionSnapshot(request);
  const policyVersion = selectPolicyVersion(request.policyVersionId, request.promptTemplateVersionId);

  return {
    requestId: `calc-ai-backend-review:${request.summary.id}:${request.requestedAt}`,
    snapshot,
    policyVersion,
    safetyDecision: buildSafetyDecision(request),
    rateLimitPlan: calculatorAIRateLimitPlan,
    auditLogPlan: calculatorAIAuditLogPlan,
    escalationRules: calculatorAIEscalationRules,
    abuseScenarios: calculatorAIAbuseScenarios,
    pipelineSteps: calculatorAIBackendPipelineSteps,
    futureBackendStages: [
      'backend-owned prompt execution',
      'policy version lookup',
      'snapshot lock hash verification',
      'provider call behind backend secret boundary',
      'post-generation safety filter',
      'audit log write after consent and schema review',
    ],
    noRealAICall: true,
    backendWritesEnabled: false,
    supabaseWritesEnabled: false,
  };
}

export function createCalculatorAIExecutionRequestFixture(
  request: Omit<CalculatorAIExecutionRequest, 'requestedAt' | 'sourceRoute' | 'sourceSurface' | 'localOnlyPreview'>,
): CalculatorAIExecutionRequest {
  return {
    ...request,
    requestedAt: '2026-05-24T09:00:00.000Z',
    sourceRoute: '/app/calculators/ai-explanation-preview',
    sourceSurface: 'qa_preview',
    localOnlyPreview: true,
  };
}

