import type {
  FarmerAssistantProviderHealth,
  FarmerAssistantProviderMode,
  FarmerAssistantProviderName,
  FarmerAssistantProviderRequest,
  FarmerAssistantResponse,
} from './provider-types';

export type FarmerAssistantProviderAdapter = {
  providerName: FarmerAssistantProviderName;
  providerMode: FarmerAssistantProviderMode;
  getHealth(): FarmerAssistantProviderHealth;
  generateAnswer(request: FarmerAssistantProviderRequest): Promise<FarmerAssistantResponse>;
};
