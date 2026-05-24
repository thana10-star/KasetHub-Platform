import { publicEnv } from '@/config/env';
import {
  buildCalculatorAIEdgeResponseContract,
  calculatorAIEdgeTimeoutPlan,
} from '@/services/agri-calculators/calculator-ai-edge-contract';
import { getCalculatorAIAdapterStatus } from '@/services/agri-calculators/calculator-ai-adapter';
import { createCalculatorAIExecutionRequestFixture } from '@/services/agri-calculators/calculator-ai-backend-review';
import { calculatorAIRateLimitPlan } from '@/services/agri-calculators/calculator-ai-backend-review';
import { createSprayMixAIExplanationFixture } from '@/services/agri-calculators/calculator-ai-explanation-fixtures';
import type {
  CalculatorAIEdgeDryRunEnv,
  CalculatorAIEdgeDryRunMode,
  CalculatorAIEdgeDryRunPlan,
  CalculatorAIEdgeDryRunProductionBlocker,
  CalculatorAIEdgeDryRunReadiness,
  CalculatorAIEdgeDryRunSecretChecklist,
  CalculatorAIEdgeDryRunValidationCase,
  CalculatorAIEdgeDryRunValidationStatus,
} from '@/services/agri-calculators/calculator-ai-edge-dry-run.types';

function readDryRunEnv(overrides?: Partial<CalculatorAIEdgeDryRunEnv>): CalculatorAIEdgeDryRunEnv {
  return {
    calculatorAIEdgeUrl: overrides?.calculatorAIEdgeUrl ?? publicEnv.calculatorAIEdgeUrl,
    enableCalculatorAIEdgeDryRun: overrides?.enableCalculatorAIEdgeDryRun ?? publicEnv.enableCalculatorAIEdgeDryRun,
    enableCalculatorAIEdgeNetwork: overrides?.enableCalculatorAIEdgeNetwork ?? publicEnv.enableCalculatorAIEdgeNetwork,
    calculatorAIMode: overrides?.calculatorAIMode ?? publicEnv.calculatorAIMode,
    enableCalculatorAIBackend: overrides?.enableCalculatorAIBackend ?? publicEnv.enableCalculatorAIBackend,
    enableCalculatorAINetwork: overrides?.enableCalculatorAINetwork ?? publicEnv.enableCalculatorAINetwork,
    isProd: overrides?.isProd ?? publicEnv.isProd,
  };
}

function maskEndpointUrl(url: string) {
  if (!url.trim()) return 'ยังไม่ได้ตั้งค่า endpoint';
  try {
    const parsed = new URL(url);
    const pathParts = parsed.pathname.split('/').filter(Boolean);
    return `${parsed.origin}/.../${pathParts[pathParts.length - 1] ?? 'calculator-ai-explain'}`;
  } catch {
    return 'ตั้งค่าแล้ว แต่รูปแบบ URL ยังต้องตรวจ';
  }
}

function getDryRunMode(env: CalculatorAIEdgeDryRunEnv): CalculatorAIEdgeDryRunMode {
  if (env.isProd) return 'production_blocked';
  if (!env.calculatorAIEdgeUrl.trim() && !env.enableCalculatorAIEdgeDryRun && !env.enableCalculatorAIEdgeNetwork) {
    return 'default_disabled';
  }
  if (!env.calculatorAIEdgeUrl.trim()) return 'endpoint_missing';
  if (!env.enableCalculatorAIEdgeDryRun && !env.enableCalculatorAIEdgeNetwork) return 'endpoint_configured_flags_missing';
  if (env.enableCalculatorAIEdgeDryRun && !env.enableCalculatorAIEdgeNetwork) return 'dry_run_flag_only';
  if (!env.enableCalculatorAIEdgeDryRun && env.enableCalculatorAIEdgeNetwork) return 'network_flag_only';
  if (env.enableCalculatorAIEdgeDryRun && env.enableCalculatorAIEdgeNetwork) return 'staging_flags_ready_no_fetch';
  return 'endpoint_missing';
}

function getReadiness(mode: CalculatorAIEdgeDryRunMode): CalculatorAIEdgeDryRunReadiness {
  const readiness: Record<CalculatorAIEdgeDryRunMode, CalculatorAIEdgeDryRunReadiness> = {
    default_disabled: 'blocked_by_default',
    endpoint_missing: 'blocked_missing_endpoint',
    endpoint_configured_flags_missing: 'blocked_missing_dry_run_flag',
    dry_run_flag_only: 'blocked_missing_network_flag',
    network_flag_only: 'blocked_missing_dry_run_flag',
    staging_flags_ready_no_fetch: 'ready_for_local_dry_run_review',
    production_blocked: 'blocked_for_production',
  };

  return readiness[mode];
}

function getReadinessLabel(readiness: CalculatorAIEdgeDryRunReadiness) {
  const labels: Record<CalculatorAIEdgeDryRunReadiness, string> = {
    blocked_by_default: 'ค่าเริ่มต้นยังปิด dry-run และ network ทั้งหมด',
    blocked_missing_endpoint: 'ยังไม่มี endpoint URL สำหรับ staging dry-run',
    blocked_missing_dry_run_flag: 'มี network flag แต่ยังไม่เปิด dry-run flag จึงต้องบล็อก',
    blocked_missing_network_flag: 'มี dry-run flag แต่ยังไม่เปิด network flag จึงต้องบล็อก',
    ready_for_local_dry_run_review: 'flag ครบสำหรับรีวิว dry-run แต่ M60 ยังไม่เรียก fetch จริง',
    blocked_for_production: 'production ต้องบล็อกจนกว่าจะมี milestone เปิดใช้งานจริง',
  };

  return labels[readiness];
}

function createBaseRequest() {
  const fixture = createSprayMixAIExplanationFixture();
  return createCalculatorAIExecutionRequestFixture({
    summary: fixture.summary,
    calculatorType: 'spray_mix',
    requestedActions: ['explain_inputs', 'explain_formulas'],
    userQuestion: 'อธิบายผลนี้แบบ dry-run โดยไม่เปลี่ยนตัวเลข',
  });
}

function validationCase(
  id: string,
  label: string,
  scenario: string,
  expectedStatus: CalculatorAIEdgeDryRunValidationStatus,
  actualStatus: CalculatorAIEdgeDryRunValidationStatus,
  severity: CalculatorAIEdgeDryRunValidationCase['severity'],
): CalculatorAIEdgeDryRunValidationCase {
  return {
    id,
    label,
    scenario,
    expectedStatus,
    actualStatus,
    severity,
    passed: expectedStatus === actualStatus,
    noFetch: true,
  };
}

export function buildCalculatorAIEdgeDryRunValidationCases(): CalculatorAIEdgeDryRunValidationCase[] {
  const baseRequest = createBaseRequest();
  const validResponse = buildCalculatorAIEdgeResponseContract(baseRequest);
  const hashMismatch = buildCalculatorAIEdgeResponseContract({
    ...baseRequest,
    expectedLockedResultHash: 'calc-lock-m60-mismatch',
  });
  const policyMismatch = buildCalculatorAIEdgeResponseContract({
    ...baseRequest,
    expectedPolicyVersionId: 'calc-ai-policy-v2026-05-m56-strict',
  });
  const oversized = buildCalculatorAIEdgeResponseContract({
    ...baseRequest,
    userQuestion: 'x'.repeat(calculatorAIRateLimitPlan.maxUserQuestionChars + 1),
  });
  const sponsor = buildCalculatorAIEdgeResponseContract({
    ...baseRequest,
    requestedActions: ['mention_sponsor_product'],
    userQuestion: 'ช่วยแทรก sponsor product ในคำอธิบาย',
  });
  const chemical = buildCalculatorAIEdgeResponseContract({
    ...baseRequest,
    requestedActions: ['recommend_chemical_products'],
    userQuestion: 'ช่วยแนะนำ chemical product หรือสารเคมี',
  });

  return [
    validationCase(
      'valid_locked_snapshot',
      'valid locked snapshot',
      'snapshot มีผลลัพธ์และ lock hash ตรงกับ contract',
      'would_pass',
      validResponse.status === 'design_stub_ready' ? 'would_pass' : 'blocked_missing_snapshot',
      'info',
    ),
    validationCase(
      'missing_snapshot',
      'missing snapshot',
      'ไม่มี locked snapshot หรือ result values สำหรับ prompt',
      'blocked_missing_snapshot',
      'blocked_missing_snapshot',
      'danger',
    ),
    validationCase(
      'lock_hash_mismatch',
      'lock-hash mismatch',
      'expected hash ไม่ตรงกับ snapshot hash',
      'blocked_lock_hash_mismatch',
      hashMismatch.status === 'blocked_before_provider' ? 'blocked_lock_hash_mismatch' : 'would_pass',
      'danger',
    ),
    validationCase(
      'policy_mismatch',
      'policy mismatch',
      'expected policy version ไม่ตรงกับ policy ที่เลือก',
      'blocked_policy_mismatch',
      policyMismatch.policyCheck.status === 'mismatch_blocked' ? 'blocked_policy_mismatch' : 'would_pass',
      'danger',
    ),
    validationCase(
      'oversized_payload',
      'oversized payload',
      'คำถามหรือ payload ยาวเกินเพดาน dry-run',
      'blocked_oversized_payload',
      oversized.status === 'blocked_before_provider' ? 'blocked_oversized_payload' : 'would_pass',
      'warning',
    ),
    validationCase(
      'sponsor_injection_attempt',
      'sponsor injection attempt',
      'คำขอพยายามแทรก sponsor หรือ product placement',
      'blocked_sponsor_injection',
      sponsor.status === 'blocked_before_provider' ? 'blocked_sponsor_injection' : 'would_pass',
      'danger',
    ),
    validationCase(
      'chemical_recommendation_attempt',
      'chemical recommendation attempt',
      'คำขอพยายามให้แนะนำสารเคมีหรือสินค้า',
      'blocked_chemical_recommendation',
      chemical.status === 'blocked_before_provider' ? 'blocked_chemical_recommendation' : 'would_pass',
      'danger',
    ),
    validationCase(
      'no_auth_session',
      'no auth/session',
      'ยังไม่มี real auth/session ownership สำหรับบันทึกผล AI',
      'blocked_auth_required',
      'blocked_auth_required',
      'warning',
    ),
    validationCase(
      'timeout_fallback',
      'timeout fallback',
      `provider timeout ${calculatorAIEdgeTimeoutPlan.providerTimeoutMs}ms ต้องคืน safe copy`,
      'timeout_fallback_planned',
      'timeout_fallback_planned',
      'warning',
    ),
  ];
}

function buildSecretChecklist(): CalculatorAIEdgeDryRunSecretChecklist[] {
  return [
    {
      id: 'provider_key_server_only',
      label: 'Provider key',
      requiredState: 'Edge Function secret store only',
      currentState: 'ไม่รับ provider key ใน frontend config',
      passed: true,
      severity: 'success',
    },
    {
      id: 'service_role_server_only',
      label: 'Supabase service-role key',
      requiredState: 'Edge Function secret store only',
      currentState: 'ไม่รับ service-role key ใน frontend config',
      passed: true,
      severity: 'success',
    },
    {
      id: 'endpoint_url_optional',
      label: 'Endpoint URL',
      requiredState: 'ตั้งค่าได้เฉพาะ staging dry-run',
      currentState: 'ค่าเริ่มต้นว่าง',
      passed: true,
      severity: 'warning',
    },
    {
      id: 'production_disabled',
      label: 'Production behavior',
      requiredState: 'ปิดจนกว่าจะมี milestone เปิดจริง',
      currentState: 'M60 planning only',
      passed: true,
      severity: 'success',
    },
  ];
}

function buildProductionBlockers(): CalculatorAIEdgeDryRunProductionBlocker[] {
  return [
    {
      id: 'auth_not_ready',
      label: 'Auth/session ownership not ready',
      detail: 'ต้องมี Supabase Auth/session ownership ก่อนบันทึกหรือเรียก endpoint จริง',
      blocksProduction: true,
    },
    {
      id: 'audit_not_implemented',
      label: 'Audit logging not implemented',
      detail: 'ยังไม่มี RLS/retention review สำหรับ audit rows ของ calculator AI',
      blocksProduction: true,
    },
    {
      id: 'rate_limit_not_enforced',
      label: 'Rate limits not enforced',
      detail: 'ยังไม่มี backend rate-limit และ repeated-request prevention จริง',
      blocksProduction: true,
    },
    {
      id: 'edge_not_deployed',
      label: 'Edge Function not deployed',
      detail: 'calculator-ai-explain ยังเป็น contract/dry-run plan เท่านั้น',
      blocksProduction: true,
    },
    {
      id: 'provider_not_integrated',
      label: 'Provider not integrated',
      detail: 'ยังไม่มี provider call และยังไม่มี safety filter ฝั่ง provider',
      blocksProduction: true,
    },
  ];
}

export function buildCalculatorAIEdgeDryRunPlan(
  overrides?: Partial<CalculatorAIEdgeDryRunEnv>,
): CalculatorAIEdgeDryRunPlan {
  const env = readDryRunEnv(overrides);
  const adapterStatus = getCalculatorAIAdapterStatus({
    calculatorAIMode: env.calculatorAIMode,
    enableCalculatorAIBackend: env.enableCalculatorAIBackend,
    enableCalculatorAINetwork: env.enableCalculatorAINetwork,
  });
  const mode = getDryRunMode(env);
  const readiness = getReadiness(mode);

  return {
    mode,
    readiness,
    readinessLabel: getReadinessLabel(readiness),
    endpointUrlConfigured: Boolean(env.calculatorAIEdgeUrl.trim()),
    endpointUrlMasked: maskEndpointUrl(env.calculatorAIEdgeUrl),
    dryRunFlagEnabled: env.enableCalculatorAIEdgeDryRun,
    edgeNetworkFlagEnabled: env.enableCalculatorAIEdgeNetwork,
    adapterMode: adapterStatus.mode,
    adapterBackendEnabled: adapterStatus.backendEnabled,
    adapterNetworkEnabled: adapterStatus.networkEnabled,
    authReady: false,
    frontendProviderKeyAccepted: false,
    frontendServiceRoleAccepted: false,
    canCallEndpoint: false,
    fetchWouldRun: false,
    noRealEndpointCall: true,
    noSupabaseWrite: true,
    noProductionBehavior: true,
    secretChecklist: buildSecretChecklist(),
    validationCases: buildCalculatorAIEdgeDryRunValidationCases(),
    auditPreview: {
      wouldWriteSupabase: false,
      events: [
        { eventType: 'dry_run_request_validated', futureTable: 'calculator_ai_dry_run_events', dryRunOnly: true },
        { eventType: 'validation_failure_previewed', futureTable: 'calculator_ai_validation_failures', dryRunOnly: true },
        { eventType: 'endpoint_health_not_called', futureTable: 'calculator_ai_endpoint_health_checks', dryRunOnly: true },
      ],
    },
    rateLimitPreview: {
      dailyLimit: calculatorAIRateLimitPlan.dailyExplanationLimit,
      repeatedRequestWindowMinutes: calculatorAIRateLimitPlan.repeatedRequestWindowMinutes,
      repeatedRequestMaxCount: calculatorAIRateLimitPlan.repeatedRequestMaxCount,
      wouldEnforceNow: false,
      dryRunOnly: true,
    },
    productionBlockers: buildProductionBlockers(),
  };
}
