import type { FarmerAssistantProviderAdapter } from './ai-provider';
import type { FarmerAssistantProviderHealth, FarmerAssistantProviderRequest, FarmerAssistantResponse } from './provider-types';

export type DisabledProviderReason = 'provider_not_selected' | 'unknown_provider' | 'live_provider_not_available';

export function createDisabledProvider(reasonCode: DisabledProviderReason = 'provider_not_selected'): FarmerAssistantProviderAdapter {
  return {
    providerName: 'disabled',
    providerMode: 'disabled',
    getHealth(): FarmerAssistantProviderHealth {
      return {
        providerName: 'disabled',
        providerMode: 'disabled',
        status: 'disabled',
        reasonCode,
      };
    },
    async generateAnswer(request: FarmerAssistantProviderRequest): Promise<FarmerAssistantResponse> {
      return {
        status: 'not_configured',
        answer: 'ระบบ AI กำลังเตรียมเปิดใช้งาน ตอนนี้ยังไม่มีการเรียกผู้ให้บริการ AI จริง',
        safetyLevel: 'normal',
        followUpQuestions: [],
        disclaimers: ['ยังไม่มีการเรียกผู้ให้บริการ AI จริงในรุ่นนี้'],
        provider: 'disabled',
        providerMode: 'disabled',
        requestId: request.requestId,
      };
    },
  };
}
