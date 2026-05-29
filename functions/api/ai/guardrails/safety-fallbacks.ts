import type { AIOutputValidationReasonCode } from './output-validator';
import type { ProviderGuardrailFailureReason } from './provider-timeout';
import type { FarmerAssistantProviderMode, FarmerAssistantResponse } from '../providers/provider-types';

export type SafetyFallbackReasonCode = AIOutputValidationReasonCode | ProviderGuardrailFailureReason | 'live_execution_blocked';

export type SafetyFallbackInput = {
  reasonCodes: SafetyFallbackReasonCode[];
  requestId: string;
  providerMode?: FarmerAssistantProviderMode;
};

function hasAnyReason(reasonCodes: SafetyFallbackReasonCode[], candidates: SafetyFallbackReasonCode[]) {
  return candidates.some((candidate) => reasonCodes.includes(candidate));
}

export function mapGuardrailFailureToResponse(input: SafetyFallbackInput): FarmerAssistantResponse {
  const { reasonCodes, requestId } = input;

  if (hasAnyReason(reasonCodes, ['secret_like_output', 'raw_provider_error', 'model_id_output', 'provider_malformed_response'])) {
    return {
      status: 'error',
      answer: 'ยังตอบคำถามนี้ไม่ได้อย่างปลอดภัย ลองถามใหม่โดยเล่าปัญหาเกษตรให้สั้นและชัดขึ้น',
      safetyLevel: 'normal',
      followUpQuestions: [],
      disclaimers: ['ระบบไม่แสดงรายละเอียดภายในหรือข้อมูลที่ไม่ควรเผยแพร่ให้ผู้ใช้เห็น'],
      provider: 'disabled',
      providerMode: 'disabled',
      requestId,
    };
  }

  if (hasAnyReason(reasonCodes, ['dangerous_chemical_mixing', 'confident_chemical_dosage', 'human_medical_emergency_advice'])) {
    return {
      status: 'blocked',
      answer:
        'คำตอบที่ได้มีความเสี่ยงด้านความปลอดภัย จึงขอไม่ให้คำแนะนำเรื่องการผสมสารเคมี อัตราใช้ยา หรือเหตุฉุกเฉิน ควรตรวจฉลากจริงและถามเจ้าหน้าที่เกษตร ผู้เชี่ยวชาญ หรือหน่วยงานที่เกี่ยวข้องในพื้นที่',
      safetyLevel: 'high_risk',
      followUpQuestions: ['ต้องการให้ช่วยเตรียมรายการข้อมูลที่ควรถามผู้เชี่ยวชาญไหม'],
      disclaimers: ['ห้ามใช้หรือผสมสารเคมีจากคำแนะนำที่ไม่ผ่านฉลากจริงและผู้เชี่ยวชาญตรวจสอบ'],
      provider: 'disabled',
      providerMode: 'disabled',
      requestId,
    };
  }

  if (hasAnyReason(reasonCodes, ['fake_live_data_claim', 'fake_citation_claim', 'guaranteed_outcome'])) {
    return {
      status: 'ready',
      answer:
        'ตอนนี้ระบบยังไม่มีข้อมูลสดหรือแหล่งอ้างอิงจริงประกอบคำตอบ จึงให้ได้เฉพาะแนวทางทั่วไปเท่านั้น ควรตรวจข้อมูลราคาหรืออากาศจากหน้าที่เกี่ยวข้องในแอป หรือสอบถามหน่วยงานในพื้นที่ก่อนตัดสินใจ',
      safetyLevel: 'caution',
      followUpQuestions: ['ต้องการให้ช่วยแยกสิ่งที่ควรตรวจเช็กก่อนตัดสินใจไหม'],
      disclaimers: ['คำตอบนี้ไม่ใช่ข้อมูลสด ไม่ใช่ราคาตลาดจริง และไม่ใช่การรับประกันผลลัพธ์'],
      provider: 'mock',
      providerMode: input.providerMode ?? 'dry_run',
      requestId,
    };
  }

  if (hasAnyReason(reasonCodes, ['mostly_non_thai', 'empty_answer'])) {
    return {
      status: 'error',
      answer: 'ยังตอบเป็นภาษาไทยได้ไม่ชัดพอ ลองถามใหม่อีกครั้งด้วยคำถามสั้น ๆ',
      safetyLevel: 'caution',
      followUpQuestions: [],
      disclaimers: ['ระบบจะตอบเป็นภาษาไทยที่อ่านง่ายสำหรับเกษตรกร'],
      provider: 'disabled',
      providerMode: 'disabled',
      requestId,
    };
  }

  if (hasAnyReason(reasonCodes, ['provider_timeout'])) {
    return {
      status: 'error',
      answer: 'ระบบใช้เวลานานเกินไป ลองส่งคำถามใหม่อีกครั้ง',
      safetyLevel: 'normal',
      followUpQuestions: [],
      disclaimers: ['ยังไม่มีคำตอบที่ปลอดภัยกลับมา จึงไม่ควรใช้เป็นคำแนะนำ'],
      provider: 'disabled',
      providerMode: 'disabled',
      requestId,
    };
  }

  return {
    status: 'error',
    answer: 'ยังตอบคำถามนี้ไม่ได้อย่างปลอดภัย ลองใหม่อีกครั้ง',
    safetyLevel: 'normal',
    followUpQuestions: [],
    disclaimers: ['ระบบไม่แสดงรายละเอียดข้อผิดพลาดภายในให้ผู้ใช้เห็น'],
    provider: 'disabled',
    providerMode: 'disabled',
    requestId,
  };
}
