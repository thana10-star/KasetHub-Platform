import type { FarmerAssistantProviderAdapter } from './ai-provider';
import type { FarmerAssistantProviderHealth, FarmerAssistantProviderRequest, FarmerAssistantResponse } from './provider-types';

export type GeminiDryRunProviderOptions = {
  liveFlagEnabled?: boolean;
};

export function createGeminiDryRunProvider(options: GeminiDryRunProviderOptions = {}): FarmerAssistantProviderAdapter {
  const reasonCode = options.liveFlagEnabled ? 'gemini_live_flag_ignored_in_m142' : 'gemini_dry_run_only';

  return {
    providerName: 'gemini',
    providerMode: 'dry_run',
    getHealth(): FarmerAssistantProviderHealth {
      return {
        providerName: 'gemini',
        providerMode: 'dry_run',
        status: 'dry_run_ready',
        reasonCode,
      };
    },
    async generateAnswer(request: FarmerAssistantProviderRequest): Promise<FarmerAssistantResponse> {
      const cropQuestion = request.crop ? `พืชที่ถามคือ ${request.crop}` : 'ยังไม่ได้ระบุชนิดพืช';
      const provinceQuestion = request.province ? `พื้นที่คือ ${request.province}` : 'ยังไม่ได้ระบุจังหวัด';

      return {
        status: 'ready',
        answer: 'นี่เป็นคำตอบทดสอบจากระบบ AI เกษตรรุ่นทดลอง ขณะนี้ยังไม่ได้เปิดใช้งาน Gemini จริง',
        safetyLevel: 'caution',
        followUpQuestions: [
          cropQuestion,
          provinceQuestion,
          'ช่วยเล่าอาการ ระยะเวลาที่เริ่มเห็น และสิ่งที่ลองทำไปแล้ว',
        ],
        disclaimers: [
          'คำตอบนี้เป็น dry-run สำหรับทดสอบการเชื่อมต่อเท่านั้น ไม่ใช่คำตอบจาก Gemini จริง',
          'ยังไม่ควรใช้เป็นคำแนะนำสุดท้าย โดยเฉพาะเรื่องสารเคมี โรคพืช ราคา หรือสภาพอากาศ',
        ],
        provider: 'mock',
        providerMode: 'dry_run',
        requestId: request.requestId,
      };
    },
  };
}
