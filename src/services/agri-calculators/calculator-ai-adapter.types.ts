import type { PublicRuntimeEnv } from '@/config/env';
import type { CalculatorAIBackendArchitectureReview, CalculatorAIExecutionRequest } from '@/services/agri-calculators/calculator-ai-backend.types';
import type { CalculatorAIExplanationBlockedAction } from '@/services/agri-calculators/calculator-ai-explanation.types';

export type CalculatorAIAdapterMode = 'local_fixture' | 'backend_disabled' | 'backend_test_ready' | 'production_disabled';

export type CalculatorAIAdapterStatus =
  | 'fixture_explained'
  | 'disabled'
  | 'safety_blocked'
  | 'backend_ready_no_endpoint'
  | 'backend_client_response'
  | 'error';

export type CalculatorAIAdapterRequest = CalculatorAIExecutionRequest & {
  adapterRequestId?: string;
};

export type CalculatorAIAdapterError = {
  code:
    | 'backend_disabled'
    | 'production_disabled'
    | 'network_flags_required'
    | 'no_backend_client'
    | 'safety_blocked'
    | 'adapter_exception';
  message: string;
  retryable: boolean;
};

export type CalculatorAIAdapterAuditPreview = {
  requestId: string;
  snapshotId: string;
  lockHash: string;
  policyVersionId: string;
  promptTemplateVersionId: string;
  safetyDecisionStatus: CalculatorAIBackendArchitectureReview['safetyDecision']['status'];
  riskLevel: CalculatorAIBackendArchitectureReview['safetyDecision']['riskLevel'];
  wouldWriteBackendAuditLog: false;
  wouldWriteSupabase: false;
};

export type CalculatorAIAdapterResponse = {
  status: CalculatorAIAdapterStatus;
  adapterMode: CalculatorAIAdapterMode;
  explanationText?: string;
  disabledReason?: string;
  error?: CalculatorAIAdapterError;
  policyVersion: string;
  promptTemplateVersionId: string;
  lockedResultHash: string;
  lockedResultValues: readonly string[];
  safetyDisclaimers: string[];
  blockedActions: CalculatorAIExplanationBlockedAction[];
  auditPreview: CalculatorAIAdapterAuditPreview;
  noRealAICall: true;
  networkCallAttempted: boolean;
  backendCallAllowed: boolean;
  deterministicResultUnchanged: true;
  createdAt: string;
};

export type CalculatorAIAdapterModeStatus = {
  mode: CalculatorAIAdapterMode;
  modeLabel: string;
  backendEnabled: boolean;
  networkEnabled: boolean;
  canUseLocalFixture: boolean;
  canAttemptBackend: boolean;
  canCallNetwork: boolean;
  currentAdapterPath: 'local_fixture' | 'disabled_response' | 'backend_test_ready_no_network' | 'backend_network_ready';
  safetyStatus: 'local_fixture_only' | 'disabled' | 'staging_flags_missing' | 'explicit_backend_test_ready';
  readinessLabel: string;
  supportedRequestTypes: string[];
  noRealAICall: true;
  warnings: string[];
};

export type CalculatorAIAdapterEnv = Pick<
  PublicRuntimeEnv,
  'calculatorAIMode' | 'enableCalculatorAIBackend' | 'enableCalculatorAINetwork'
>;

export type CalculatorAIBackendClient = (
  request: CalculatorAIAdapterRequest,
  review: CalculatorAIBackendArchitectureReview,
) => CalculatorAIAdapterResponse;
