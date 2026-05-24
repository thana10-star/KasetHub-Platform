export type AITextMode =
  | 'local_fixture'
  | 'staging_proxy_disabled'
  | 'staging_proxy_ready'
  | 'production_disabled';

export type AITextProxyMode = 'staging_proxy';

export type AITextRequestType =
  | 'calculator_explanation'
  | 'weather_caution_explanation'
  | 'educational_explanation';

export type AITextResponseStatus =
  | 'fixture_response'
  | 'disabled'
  | 'blocked'
  | 'proxy_not_configured'
  | 'proxy_disabled';

export type AITextBlockedActionId =
  | 'exact_pesticide_recommendation'
  | 'exact_fertilizer_dose'
  | 'guaranteed_yield_profit'
  | 'legal_financial_certainty'
  | 'sponsor_product_injection'
  | 'autonomous_diagnosis'
  | 'unsafe_medical_chemical_advice'
  | 'unsupported_request_type';

export type AITextLockedOutputSnapshot = {
  kind: 'calculator_result' | 'weather_caution' | 'educational_context';
  lockedHash?: string;
  valueLines: string[];
};

export type AITextRequest = {
  id: string;
  requestType: AITextRequestType;
  prompt: string;
  contextSummary: string;
  requestedActions: string[];
  lockedOutputSnapshot?: AITextLockedOutputSnapshot;
  sourceRoute?: string;
  createdAt?: string;
};

export type AITextBlockedAction = {
  id: AITextBlockedActionId;
  label: string;
  reason: string;
  blocked: true;
};

export type AITextSafetyBoundary = {
  allowedRequestTypes: AITextRequestType[];
  blockedActions: AITextBlockedAction[];
  noUnrestrictedChat: true;
  noExactPrescription: true;
  noSponsorProduct: true;
  noDiagnosis: true;
  noGuaranteedOutcome: true;
  immutableCalculatorOutput: true;
};

export type AITextAuditPreview = {
  requestId: string;
  policyVersion: string;
  wouldWriteAuditLog: false;
  noSupabaseWrite: true;
  noCloudSyncWrite: true;
  releaseGateRequired: true;
  events: string[];
};

export type AITextRateLimitPreview = {
  scope: 'staging_user_or_device';
  dailyLimit: number;
  remainingPreview: number;
  cooldownSeconds: number;
  rateLimitRequired: true;
  wouldWriteRateLimit: false;
};

export type AITextFailureMode = {
  id: string;
  label: string;
  reason: string;
  safeFallback: string;
};

export type AITextModeStatus = {
  mode: AITextMode;
  proxyMode: AITextProxyMode;
  realAIEnabled: boolean;
  networkEnabled: boolean;
  canAttemptProxy: boolean;
  canCallNetwork: boolean;
  controlledDisabled: boolean;
  sourceLabel: 'local fixture' | 'staging proxy boundary';
  statusLabel: string;
  disabledReason?: string;
  noProviderKeyInFrontend: true;
  noServiceRoleKeyInFrontend: true;
  noDirectProviderCall: true;
};

export type AITextResponse = {
  id: string;
  requestId: string;
  requestType: AITextRequestType;
  status: AITextResponseStatus;
  mode: AITextMode;
  text?: string;
  disabledReason?: string;
  blockedReasons: AITextBlockedAction[];
  auditPreview: AITextAuditPreview;
  rateLimitPreview: AITextRateLimitPreview;
  safetyBoundary: AITextSafetyBoundary;
  lockedOutputSnapshot?: AITextLockedOutputSnapshot;
  noProviderKeyInFrontend: true;
  noServiceRoleKeyInFrontend: true;
  noDirectProviderCall: true;
  networkAttempted: boolean;
  immutableOutputPreserved: true;
};

export type AITextProxyStatus = AITextModeStatus & {
  allowedRequestTypes: AITextRequestType[];
  blockedActions: AITextBlockedAction[];
  auditPreview: AITextAuditPreview;
  rateLimitPreview: AITextRateLimitPreview;
  failureModes: AITextFailureMode[];
  fallbackToFixture: boolean;
};

export type AITextProxyEnv = {
  enableRealAIText?: boolean;
  aiTextMode?: string;
  aiTextProxyMode?: string;
  enableAITextNetwork?: boolean;
  aiTextProxyEndpoint?: string;
  aiTextEndpointUrl?: string;
  enableAITextEndpointDryRun?: boolean;
  enableAITextEndpointNetwork?: boolean;
};
