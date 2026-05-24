import {
  createFertilizerAIExplanationFixture,
  createSprayMixAIExplanationFixture,
} from '@/services/agri-calculators/calculator-ai-explanation-fixtures';
import {
  explainCalculatorResult,
  getCalculatorAIAdapterStatus,
} from '@/services/agri-calculators/calculator-ai-adapter';
import type {
  CalculatorAIAdapterEnv,
  CalculatorAIAdapterError,
  CalculatorAIAdapterRequest,
  CalculatorAIAdapterResponse,
  CalculatorAIAdapterStatus,
} from '@/services/agri-calculators/calculator-ai-adapter.types';
import { createCalculatorAIExecutionRequestFixture } from '@/services/agri-calculators/calculator-ai-backend-review';

export type CalculatorAIAdapterQAFixtureStatus = 'pass' | 'warn' | 'fail';

export type CalculatorAIAdapterQAFixture = {
  id: string;
  title: string;
  description: string;
  env: CalculatorAIAdapterEnv;
  request: CalculatorAIAdapterRequest;
  expectedStatus: CalculatorAIAdapterStatus;
  expectedErrorCode?: CalculatorAIAdapterError['code'];
  expectedBackendCallAllowed: boolean;
  expectedNetworkCallAttempted: boolean;
  expectedLockedHashPreserved: true;
};

export type CalculatorAIAdapterQARun = {
  id: string;
  title: string;
  description: string;
  qaStatus: CalculatorAIAdapterQAFixtureStatus;
  responseStatus: CalculatorAIAdapterStatus;
  expectedStatus: CalculatorAIAdapterStatus;
  mode: string;
  adapterPath: string;
  backendEnabled: boolean;
  networkEnabled: boolean;
  backendCallAllowed: boolean;
  networkCallAttempted: boolean;
  noRealAICall: boolean;
  lockedHashPreserved: boolean;
  lockedResultHash: string;
  errorCode?: CalculatorAIAdapterError['code'];
  backendBlockedReasons: string[];
  disabledReason?: string;
};

const localEnv: CalculatorAIAdapterEnv = {
  calculatorAIMode: 'local_fixture',
  enableCalculatorAIBackend: false,
  enableCalculatorAINetwork: false,
};

const backendDisabledEnv: CalculatorAIAdapterEnv = {
  calculatorAIMode: 'backend_disabled',
  enableCalculatorAIBackend: false,
  enableCalculatorAINetwork: false,
};

const backendNetworkDisabledEnv: CalculatorAIAdapterEnv = {
  calculatorAIMode: 'backend_test_ready',
  enableCalculatorAIBackend: true,
  enableCalculatorAINetwork: false,
};

const backendTestReadyEnv: CalculatorAIAdapterEnv = {
  calculatorAIMode: 'backend_test_ready',
  enableCalculatorAIBackend: true,
  enableCalculatorAINetwork: true,
};

function createBaseRequest(overrides: Partial<CalculatorAIAdapterRequest> = {}): CalculatorAIAdapterRequest {
  const source = createSprayMixAIExplanationFixture();

  return {
    ...createCalculatorAIExecutionRequestFixture({
      summary: source.summary,
      calculatorType: 'spray_mix',
      requestedActions: ['explain_inputs', 'explain_formulas'],
      userQuestion: 'อธิบายผลคำนวณนี้แบบง่าย โดยไม่เปลี่ยนตัวเลข',
    }),
    ...overrides,
  };
}

function createFertilizerRequest(overrides: Partial<CalculatorAIAdapterRequest> = {}): CalculatorAIAdapterRequest {
  const source = createFertilizerAIExplanationFixture();

  return {
    ...createCalculatorAIExecutionRequestFixture({
      summary: source.summary,
      calculatorType: 'fertilizer_mix',
      cropKey: 'rice',
      cropLabel: 'ข้าว',
      requestedActions: ['explain_inputs', 'explain_formulas'],
      userQuestion: 'อธิบายผลปุ๋ยโดยไม่เพิ่มสูตรใหม่',
    }),
    ...overrides,
  };
}

export const calculatorAIAdapterQAFixtures: CalculatorAIAdapterQAFixture[] = [
  {
    id: 'local_fixture_success',
    title: 'local fixture success',
    description: 'ค่าเริ่มต้นตอบ fixture ในเครื่องจาก locked snapshot',
    env: localEnv,
    request: createBaseRequest(),
    expectedStatus: 'fixture_explained',
    expectedBackendCallAllowed: false,
    expectedNetworkCallAttempted: false,
    expectedLockedHashPreserved: true,
  },
  {
    id: 'backend_disabled',
    title: 'backend disabled',
    description: 'โหมด backend_disabled ต้องตอบ disabled และไม่เรียก backend client',
    env: backendDisabledEnv,
    request: createBaseRequest(),
    expectedStatus: 'disabled',
    expectedErrorCode: 'backend_disabled',
    expectedBackendCallAllowed: false,
    expectedNetworkCallAttempted: false,
    expectedLockedHashPreserved: true,
  },
  {
    id: 'backend_network_disabled',
    title: 'backend network disabled',
    description: 'backend_test_ready แต่ network flag ปิด ต้อง fallback เป็น disabled',
    env: backendNetworkDisabledEnv,
    request: createBaseRequest(),
    expectedStatus: 'disabled',
    expectedErrorCode: 'network_flags_required',
    expectedBackendCallAllowed: false,
    expectedNetworkCallAttempted: false,
    expectedLockedHashPreserved: true,
  },
  {
    id: 'backend_test_ready_but_blocked',
    title: 'backend test ready but blocked',
    description: 'เปิด flags ครบแต่ยังไม่มี endpoint/client จริง จึงไม่ออก network',
    env: backendTestReadyEnv,
    request: createBaseRequest(),
    expectedStatus: 'backend_ready_no_endpoint',
    expectedErrorCode: 'no_backend_client',
    expectedBackendCallAllowed: true,
    expectedNetworkCallAttempted: false,
    expectedLockedHashPreserved: true,
  },
  {
    id: 'invalid_request',
    title: 'invalid request',
    description: 'ไม่มี locked result values ต้องบล็อกก่อนสร้าง prompt',
    env: localEnv,
    request: createBaseRequest({
      summary: {
        ...createSprayMixAIExplanationFixture().summary,
        resultRecap: [],
      },
    }),
    expectedStatus: 'safety_blocked',
    expectedErrorCode: 'safety_blocked',
    expectedBackendCallAllowed: false,
    expectedNetworkCallAttempted: false,
    expectedLockedHashPreserved: true,
  },
  {
    id: 'oversized_request',
    title: 'oversized request',
    description: 'คำถามยาวเกินเพดาน ต้อง reject ก่อน AI',
    env: localEnv,
    request: createBaseRequest({
      userQuestion: 'x'.repeat(1000),
    }),
    expectedStatus: 'safety_blocked',
    expectedErrorCode: 'safety_blocked',
    expectedBackendCallAllowed: false,
    expectedNetworkCallAttempted: false,
    expectedLockedHashPreserved: true,
  },
  {
    id: 'sponsor_insertion_blocked',
    title: 'sponsor insertion blocked',
    description: 'คำขอแทรกสินค้า sponsor/product ต้องถูกบล็อก',
    env: localEnv,
    request: createBaseRequest({
      requestedActions: ['mention_sponsor_product'],
      userQuestion: 'ช่วยแทรกสินค้า sponsor และสินค้าแนะนำในคำอธิบาย',
    }),
    expectedStatus: 'safety_blocked',
    expectedErrorCode: 'safety_blocked',
    expectedBackendCallAllowed: false,
    expectedNetworkCallAttempted: false,
    expectedLockedHashPreserved: true,
  },
  {
    id: 'deterministic_mismatch_blocked',
    title: 'deterministic mismatch blocked',
    description: 'expected locked hash ไม่ตรง ต้องบล็อกก่อน AI',
    env: localEnv,
    request: createBaseRequest({
      expectedLockedResultHash: 'calc-lock-wrong-m58',
    }),
    expectedStatus: 'safety_blocked',
    expectedErrorCode: 'locked_hash_mismatch',
    expectedBackendCallAllowed: false,
    expectedNetworkCallAttempted: false,
    expectedLockedHashPreserved: true,
  },
  {
    id: 'policy_version_mismatch',
    title: 'policy version mismatch',
    description: 'policy id ที่คาดไว้ไม่ตรงกับ policy ที่เลือก ต้องบล็อก',
    env: localEnv,
    request: createBaseRequest({
      expectedPolicyVersionId: 'calc-ai-policy-v2026-05-m56-strict',
    }),
    expectedStatus: 'safety_blocked',
    expectedErrorCode: 'policy_version_mismatch',
    expectedBackendCallAllowed: false,
    expectedNetworkCallAttempted: false,
    expectedLockedHashPreserved: true,
  },
  {
    id: 'invalid_crop_profile',
    title: 'invalid crop profile',
    description: 'crop key ไม่อยู่ใน fixture ต้อง reject หรือ clear context ก่อน AI',
    env: localEnv,
    request: createFertilizerRequest({
      cropKey: 'unknown_crop_for_m58',
    }),
    expectedStatus: 'safety_blocked',
    expectedErrorCode: 'safety_blocked',
    expectedBackendCallAllowed: false,
    expectedNetworkCallAttempted: false,
    expectedLockedHashPreserved: true,
  },
];

function classifyRun(fixture: CalculatorAIAdapterQAFixture, response: CalculatorAIAdapterResponse): CalculatorAIAdapterQAFixtureStatus {
  const matches =
    response.status === fixture.expectedStatus &&
    response.networkCallAttempted === fixture.expectedNetworkCallAttempted &&
    response.backendCallAllowed === fixture.expectedBackendCallAllowed &&
    response.noRealAICall === true &&
    (!fixture.expectedErrorCode || response.error?.code === fixture.expectedErrorCode) &&
    response.lockedResultValues.length === fixture.request.summary.resultRecap.length &&
    response.auditPreview.lockHash === response.lockedResultHash;

  if (!matches) return 'fail';
  return response.status === 'backend_ready_no_endpoint' ? 'warn' : 'pass';
}

export function runCalculatorAIAdapterQAFixture(fixture: CalculatorAIAdapterQAFixture): CalculatorAIAdapterQARun {
  const response = explainCalculatorResult(fixture.request, {
    env: fixture.env,
    createdAt: '2026-05-24T10:00:00.000Z',
  });
  const status = getCalculatorAIAdapterStatus(fixture.env);
  const lockedHashPreserved =
    response.auditPreview.lockHash === response.lockedResultHash &&
    response.lockedResultValues.length === fixture.request.summary.resultRecap.length;

  return {
    id: fixture.id,
    title: fixture.title,
    description: fixture.description,
    qaStatus: classifyRun(fixture, response),
    responseStatus: response.status,
    expectedStatus: fixture.expectedStatus,
    mode: status.mode,
    adapterPath: status.currentAdapterPath,
    backendEnabled: status.backendEnabled,
    networkEnabled: status.networkEnabled,
    backendCallAllowed: response.backendCallAllowed,
    networkCallAttempted: response.networkCallAttempted,
    noRealAICall: response.noRealAICall,
    lockedHashPreserved,
    lockedResultHash: response.lockedResultHash,
    errorCode: response.error?.code,
    backendBlockedReasons: response.backendBlockedReasons,
    disabledReason: response.disabledReason,
  };
}

export function runCalculatorAIAdapterQASuite() {
  const runs = calculatorAIAdapterQAFixtures.map(runCalculatorAIAdapterQAFixture);

  return {
    runs,
    totalCount: runs.length,
    passCount: runs.filter((run) => run.qaStatus === 'pass').length,
    warnCount: runs.filter((run) => run.qaStatus === 'warn').length,
    failCount: runs.filter((run) => run.qaStatus === 'fail').length,
    noNetworkGuarantee: runs.every((run) => !run.networkCallAttempted),
    lockedHashPreservedCount: runs.filter((run) => run.lockedHashPreserved).length,
  };
}
