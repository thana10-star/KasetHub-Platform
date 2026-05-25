import { publicEnv } from '@/config/env';
import {
  buildCalculatorAIBackendArchitectureReview,
  calculatorAIPolicyVersions,
} from '@/services/agri-calculators/calculator-ai-backend-review';
import type {
  CalculatorAIAdapterEnv,
  CalculatorAIAdapterMode,
  CalculatorAIAdapterModeStatus,
  CalculatorAIAdapterRequest,
  CalculatorAIAdapterResponse,
  CalculatorAIBackendClient,
} from '@/services/agri-calculators/calculator-ai-adapter.types';
import type { CalculatorAIExplanationBlockedAction } from '@/services/agri-calculators/calculator-ai-explanation.types';
import {
  buildLocalCalculatorAIExplanation,
  getLocalCalculatorAIDisclaimers,
} from '@/services/agri-calculators/calculator-ai-local-fixtures';

const supportedRequestTypes = ['calculator_result_explanation'];

type ExplainCalculatorResultOptions = {
  env?: Partial<CalculatorAIAdapterEnv>;
  backendClient?: CalculatorAIBackendClient;
  createdAt?: string;
};

function nowIso(options?: ExplainCalculatorResultOptions) {
  return options?.createdAt ?? new Date().toISOString();
}

function normalizeCalculatorAIAdapterMode(value?: string): CalculatorAIAdapterMode {
  if (value === 'backend_disabled' || value === 'backend_test_ready' || value === 'production_disabled') {
    return value;
  }

  return 'local_fixture';
}

function readAdapterEnv(overrides?: Partial<CalculatorAIAdapterEnv>): CalculatorAIAdapterEnv {
  return {
    calculatorAIMode: overrides?.calculatorAIMode ?? publicEnv.calculatorAIMode,
    enableCalculatorAIBackend: overrides?.enableCalculatorAIBackend ?? publicEnv.enableCalculatorAIBackend,
    enableCalculatorAINetwork: overrides?.enableCalculatorAINetwork ?? publicEnv.enableCalculatorAINetwork,
  };
}

export function getCalculatorAIAdapterMode(env?: Partial<CalculatorAIAdapterEnv>) {
  return normalizeCalculatorAIAdapterMode(readAdapterEnv(env).calculatorAIMode);
}

function getModeLabel(mode: CalculatorAIAdapterMode) {
  const labels: Record<CalculatorAIAdapterMode, string> = {
    local_fixture: 'Local fixture',
    backend_disabled: 'Backend disabled',
    backend_test_ready: 'Backend test ready',
    production_disabled: 'Production disabled',
  };

  return labels[mode];
}

function getCurrentAdapterPath(
  mode: CalculatorAIAdapterMode,
  backendEnabled: boolean,
  networkEnabled: boolean,
): CalculatorAIAdapterModeStatus['currentAdapterPath'] {
  if (mode === 'local_fixture') return 'local_fixture';
  if (mode !== 'backend_test_ready') return 'disabled_response';
  if (backendEnabled && networkEnabled) return 'backend_network_ready';
  return 'backend_test_ready_no_network';
}

export function getCalculatorAIAdapterStatus(env?: Partial<CalculatorAIAdapterEnv>): CalculatorAIAdapterModeStatus {
  const resolvedEnv = readAdapterEnv(env);
  const mode = normalizeCalculatorAIAdapterMode(resolvedEnv.calculatorAIMode);
  const backendEnabled = resolvedEnv.enableCalculatorAIBackend;
  const networkEnabled = resolvedEnv.enableCalculatorAINetwork;
  const currentAdapterPath = getCurrentAdapterPath(mode, backendEnabled, networkEnabled);
  const canAttemptBackend = mode === 'backend_test_ready' && backendEnabled;
  const canCallNetwork = mode === 'backend_test_ready' && backendEnabled && networkEnabled;
  const safetyStatus: CalculatorAIAdapterModeStatus['safetyStatus'] =
    mode === 'local_fixture'
      ? 'local_fixture_only'
      : mode === 'production_disabled' || mode === 'backend_disabled'
        ? 'disabled'
        : canCallNetwork
          ? 'explicit_backend_test_ready'
          : 'staging_flags_missing';

  const readinessLabel: Record<CalculatorAIAdapterModeStatus['safetyStatus'], string> = {
    local_fixture_only: 'ใช้คำอธิบาย fixture ในเครื่อง ยังไม่เรียก AI จริง',
    disabled: 'adapter ปิดอยู่และจะตอบ disabled response',
    staging_flags_missing: 'backend_test_ready แต่ยังไม่เปิด backend/network flags ครบ',
    explicit_backend_test_ready: 'พร้อมทดสอบ contract แบบ explicit flags แต่ยังไม่มี endpoint จริงใน M57',
  };

  return {
    mode,
    modeLabel: getModeLabel(mode),
    backendEnabled,
    networkEnabled,
    canUseLocalFixture: mode === 'local_fixture',
    canAttemptBackend,
    canCallNetwork,
    currentAdapterPath,
    safetyStatus,
    readinessLabel: readinessLabel[safetyStatus],
    supportedRequestTypes,
    noRealAICall: true,
    warnings: [
      'M57 ไม่มี fetch และไม่มี provider key ใน frontend',
      'local_fixture อธิบายจาก locked snapshot เท่านั้น',
      'backend_test_ready ต้องเปิดทั้ง VITE_ENABLE_CALCULATOR_AI_BACKEND และ VITE_ENABLE_CALCULATOR_AI_NETWORK ก่อนใช้ test client',
      'production_disabled ปิดเสมอจนกว่าจะมี milestone เปิดใช้งานจริง',
    ],
  };
}

function buildAuditPreview(review: ReturnType<typeof buildCalculatorAIBackendArchitectureReview>) {
  return {
    requestId: review.requestId,
    snapshotId: review.snapshot.snapshotId,
    lockHash: review.snapshot.lockHash,
    policyVersionId: review.policyVersion.id,
    promptTemplateVersionId: review.policyVersion.promptTemplateVersionId,
    safetyDecisionStatus: review.safetyDecision.status,
    riskLevel: review.safetyDecision.riskLevel,
    wouldWriteBackendAuditLog: false as const,
    wouldWriteSupabase: false as const,
  };
}

function inferBlockedActions(review: ReturnType<typeof buildCalculatorAIBackendArchitectureReview>) {
  const blocked = new Set<CalculatorAIExplanationBlockedAction>(review.safetyDecision.blockedActionIds);

  review.safetyDecision.bannedCategoryMatches.forEach((category) => {
    if (category === 'hidden_sponsor_or_affiliate') blocked.add('mention_sponsor_product');
    if (category === 'chemical_product_recommendation') blocked.add('recommend_chemical_products');
    if (category === 'fertilizer_dose_not_in_snapshot') blocked.add('recommend_exact_fertilizer_dose_not_in_calculator');
    if (category === 'guaranteed_yield_or_profit') blocked.add('claim_guaranteed_yield_or_profit');
    if (category === 'label_override') blocked.add('override_label_instructions');
  });

  return Array.from(blocked);
}

function uniqueNonEmpty(values: Array<string | undefined>) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value?.trim()))));
}

function inferBackendBlockedReasons(review: ReturnType<typeof buildCalculatorAIBackendArchitectureReview>) {
  return uniqueNonEmpty([
    ...review.safetyDecision.reasons,
    ...review.safetyDecision.invalidRequestReasons,
    ...review.safetyDecision.bannedCategoryMatches,
    ...review.safetyDecision.blockedActionIds,
  ]);
}

function baseResponse(
  request: CalculatorAIAdapterRequest,
  mode: CalculatorAIAdapterMode,
  options?: ExplainCalculatorResultOptions,
) {
  const review = buildCalculatorAIBackendArchitectureReview(request);
  const responseBase = {
    adapterMode: mode,
    policyVersion: review.policyVersion.id,
    promptTemplateVersionId: review.policyVersion.promptTemplateVersionId,
    lockedResultHash: review.snapshot.lockHash,
    lockedResultValues: review.snapshot.resultValues,
    safetyDisclaimers: getLocalCalculatorAIDisclaimers(review),
    blockedActions: inferBlockedActions(review),
    backendBlockedReasons: inferBackendBlockedReasons(review),
    auditPreview: buildAuditPreview(review),
    noRealAICall: true as const,
    networkCallAttempted: false,
    backendCallAllowed: false,
    deterministicResultUnchanged: true as const,
    createdAt: nowIso(options),
  };

  return { review, responseBase };
}

function safetyBlockedResponse(
  request: CalculatorAIAdapterRequest,
  mode: CalculatorAIAdapterMode,
  reason: string,
  code: 'safety_blocked' | 'locked_hash_mismatch' | 'policy_version_mismatch',
  options?: ExplainCalculatorResultOptions,
): CalculatorAIAdapterResponse {
  const { responseBase } = baseResponse(request, mode, options);

  return {
    ...responseBase,
    status: 'safety_blocked',
    disabledReason: reason,
    backendBlockedReasons: uniqueNonEmpty([...responseBase.backendBlockedReasons, reason, code]),
    error: {
      code,
      message: reason,
      retryable: false,
    },
  };
}

function disabledResponse(
  request: CalculatorAIAdapterRequest,
  mode: CalculatorAIAdapterMode,
  reason: string,
  code: NonNullable<CalculatorAIAdapterResponse['error']>['code'],
  retryable: boolean,
  options?: ExplainCalculatorResultOptions,
): CalculatorAIAdapterResponse {
  const { responseBase } = baseResponse(request, mode, options);

  return {
    ...responseBase,
    status: 'disabled',
    disabledReason: reason,
    error: {
      code,
      message: reason,
      retryable,
    },
  };
}

export function explainCalculatorResult(
  request: CalculatorAIAdapterRequest,
  options?: ExplainCalculatorResultOptions,
): CalculatorAIAdapterResponse {
  const mode = getCalculatorAIAdapterMode(options?.env);
  const adapterStatus = getCalculatorAIAdapterStatus(options?.env);
  const { review, responseBase } = baseResponse(request, mode, options);

  if (request.expectedLockedResultHash && request.expectedLockedResultHash !== review.snapshot.lockHash) {
    return safetyBlockedResponse(
      request,
      mode,
      'locked result hash ไม่ตรงกับ snapshot ล่าสุด จึงบล็อกก่อนเรียก AI',
      'locked_hash_mismatch',
      options,
    );
  }

  if (request.expectedPolicyVersionId && request.expectedPolicyVersionId !== review.policyVersion.id) {
    return safetyBlockedResponse(
      request,
      mode,
      'policy version ไม่ตรงกับ request ที่คาดไว้ จึงบล็อกก่อนสร้าง prompt',
      'policy_version_mismatch',
      options,
    );
  }

  if (review.safetyDecision.status === 'rejected_before_ai') {
    return safetyBlockedResponse(
      request,
      mode,
      'คำขอนี้ถูกบล็อกก่อนเรียก AI เพราะไม่ผ่านนโยบาย snapshot/prompt safety',
      'safety_blocked',
      options,
    );
  }

  if (mode === 'local_fixture') {
    return {
      ...responseBase,
      status: 'fixture_explained',
      explanationText: buildLocalCalculatorAIExplanation(review),
    };
  }

  if (mode === 'backend_disabled') {
    return disabledResponse(
      request,
      mode,
      'calculator AI backend ถูกปิดอยู่ในโหมด backend_disabled',
      'backend_disabled',
      true,
      options,
    );
  }

  if (mode === 'production_disabled') {
    return disabledResponse(
      request,
      mode,
      'production calculator AI ถูกปิดไว้จนกว่าจะมี milestone เปิดใช้งานจริง',
      'production_disabled',
      false,
      options,
    );
  }

  if (!adapterStatus.backendEnabled || !adapterStatus.networkEnabled) {
    return disabledResponse(
      request,
      mode,
      'backend_test_ready ต้องเปิด VITE_ENABLE_CALCULATOR_AI_BACKEND=true และ VITE_ENABLE_CALCULATOR_AI_NETWORK=true จึงจะอนุญาต test client',
      'network_flags_required',
      true,
      options,
    );
  }

  if (!options?.backendClient) {
    return {
      ...responseBase,
      status: 'backend_ready_no_endpoint',
      disabledReason: 'เปิด staging flags ครบแล้ว แต่ M57 ยังไม่มี endpoint หรือ backend client จริง',
      error: {
        code: 'no_backend_client',
        message: 'เปิด staging flags ครบแล้ว แต่ M57 ยังไม่มี endpoint หรือ backend client จริง',
        retryable: true,
      },
      backendCallAllowed: true,
    };
  }

  try {
    return {
      ...options.backendClient(request, review),
      adapterMode: mode,
      lockedResultHash: review.snapshot.lockHash,
      lockedResultValues: review.snapshot.resultValues,
      policyVersion: review.policyVersion.id,
      promptTemplateVersionId: review.policyVersion.promptTemplateVersionId,
      safetyDisclaimers: getLocalCalculatorAIDisclaimers(review),
      blockedActions: inferBlockedActions(review),
      backendBlockedReasons: inferBackendBlockedReasons(review),
      auditPreview: buildAuditPreview(review),
      noRealAICall: true,
      networkCallAttempted: true,
      backendCallAllowed: true,
      deterministicResultUnchanged: true,
      createdAt: nowIso(options),
    };
  } catch {
    return {
      ...responseBase,
      status: 'error',
      disabledReason: 'เกิดข้อผิดพลาดใน backend test client ที่ inject เข้ามา',
      error: {
        code: 'adapter_exception',
        message: 'เกิดข้อผิดพลาดใน backend test client ที่ inject เข้ามา',
        retryable: true,
      },
    };
  }
}

export const calculatorAIAdapterPolicyVersionIds = calculatorAIPolicyVersions.map((version) => version.id);
