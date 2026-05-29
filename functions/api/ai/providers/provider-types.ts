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
export type FarmerAssistantProviderHealthStatus = 'disabled' | 'dry_run_ready' | 'live_ready' | 'live_unavailable';

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
  GEMINI_API_KEY?: string;
  AI_MODEL?: string;
  AI_MAX_OUTPUT_TOKENS?: string;
};
