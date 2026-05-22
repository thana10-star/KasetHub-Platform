export type AIProviderCandidate = 'gemini_flash_lite' | 'gemini_flash' | 'openai_mini' | 'future_vision_model';

export type AIModelTier = 'cheap_text' | 'strong_text' | 'vision' | 'summary';

export type AIProviderDefinition = {
  id: AIProviderCandidate;
  label: string;
  providerFamily: 'google_gemini' | 'openai' | 'future';
  modelTier: AIModelTier;
  purpose: string;
  keyLocation: 'server_only';
  isPlaceholder: true;
};

export const aiProviderDefinitions: Record<AIProviderCandidate, AIProviderDefinition> = {
  gemini_flash_lite: {
    id: 'gemini_flash_lite',
    label: 'Gemini Flash-Lite placeholder',
    providerFamily: 'google_gemini',
    modelTier: 'cheap_text',
    purpose: 'คำถามทั่วไป ราคาต่ำ และคำอธิบายราคาพืชผล',
    keyLocation: 'server_only',
    isPlaceholder: true,
  },
  gemini_flash: {
    id: 'gemini_flash',
    label: 'Gemini Flash placeholder',
    providerFamily: 'google_gemini',
    modelTier: 'strong_text',
    purpose: 'คำถามซับซ้อนหรือมีความเสี่ยง ต้องการเหตุผลละเอียดขึ้น',
    keyLocation: 'server_only',
    isPlaceholder: true,
  },
  openai_mini: {
    id: 'openai_mini',
    label: 'OpenAI mini placeholder',
    providerFamily: 'openai',
    modelTier: 'summary',
    purpose: 'สรุปบทความ วิดีโอ และข้อความยาวในอนาคต',
    keyLocation: 'server_only',
    isPlaceholder: true,
  },
  future_vision_model: {
    id: 'future_vision_model',
    label: 'Future vision model placeholder',
    providerFamily: 'future',
    modelTier: 'vision',
    purpose: 'วิเคราะห์รูปโรคพืชและภาพจากแปลง',
    keyLocation: 'server_only',
    isPlaceholder: true,
  },
};
