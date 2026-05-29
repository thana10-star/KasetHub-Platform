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
export type FarmerAssistantResponseProvider = 'gemini' | 'openai' | 'disabled' | 'mock';
export type FarmerAssistantProviderName = 'gemini' | 'openai' | 'disabled' | 'mock';
export type FarmerAssistantProviderMode = 'disabled' | 'dry_run' | 'live';
export type FarmerAssistantDebugProviderMode = FarmerAssistantProviderMode | 'live_blocked';
export type FarmerAssistantProviderHealthStatus = 'disabled' | 'dry_run_ready' | 'live_ready' | 'live_unavailable';
export type FarmerAssistantDebugStage =
  | 'validation'
  | 'input_safety_block'
  | 'rate_limit'
  | 'provider_select'
  | 'provider_call'
  | 'provider_timeout'
  | 'provider_error'
  | 'parser'
  | 'output_validator'
  | 'fallback_mapper'
  | 'success';
export type FarmerAssistantDebugLiveGate = 'disabled' | 'dry_run' | 'live_blocked' | 'live';

export type FarmerAssistantDebugInfo = {
  stage: FarmerAssistantDebugStage;
  reasonCodes: string[];
  providerMode?: FarmerAssistantDebugProviderMode;
  model?: string;
  liveGate?: FarmerAssistantDebugLiveGate;
  safeSummary?: string;
};

export type FarmerAssistantProviderRequest = {
  question: string;
  crop?: string;
  province?: string;
  topic: FarmerAssistantTopic;
  userMode: FarmerAssistantUserMode;
  requestId: string;
};

export type FarmerAssistantResponse = {
  status: FarmerAssistantStatus;
  answer?: string;
  safetyLevel?: FarmerAssistantSafetyLevel;
  followUpQuestions?: string[];
  disclaimers?: string[];
  provider?: FarmerAssistantResponseProvider;
  providerMode?: FarmerAssistantProviderMode;
  requestId?: string;
  retryAfterSeconds?: number;
  debug?: FarmerAssistantDebugInfo;
  internalDebug?: FarmerAssistantDebugInfo;
};

export type FarmerAssistantProviderHealth = {
  providerName: FarmerAssistantProviderName;
  providerMode: FarmerAssistantProviderMode;
  status: FarmerAssistantProviderHealthStatus;
  reasonCode: string;
};

export type FarmerAssistantProviderEnv = {
  AI_PROVIDER?: string;
  AI_LIVE_ENABLED?: string;
  AI_ALLOW_LIVE_EXECUTION?: string;
  GEMINI_API_KEY?: string;
  AI_MODEL?: string;
  AI_MAX_OUTPUT_TOKENS?: string;
  AI_DEBUG_RESPONSE?: string;
};
