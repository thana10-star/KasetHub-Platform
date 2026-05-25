import type { CalculatorAIEndpointPlan } from '@/services/agri-calculators/calculator-ai-endpoint-plan.types';

export function buildCalculatorAIEndpointPlan(): CalculatorAIEndpointPlan {
  return {
    id: 'calculator-ai-endpoint-plan-m58',
    readiness: 'blocked_until_backend_exists',
    readinessLabel: 'ยังไม่พร้อมเปิด network เพราะยังไม่มี backend endpoint จริง',
    noRealNetworkInM58: true,
    backendEndpointExists: false,
    frontendProviderKeysAllowed: false,
    endpointFlow: [
      'Calculator result',
      'Snapshot lock hash',
      'Adapter contract gate',
      'Backend route or Edge Function',
      'Request validation',
      'Policy version check',
      'Prompt builder',
      'AI provider call inside backend only',
      'Safety filter',
      'Audit log',
      'Final explanation display',
    ],
    requiredBackendChecks: [
      {
        id: 'backend_owned_execution',
        label: 'backend-only prompt execution',
        detail: 'prompt builder และ provider key ต้องอยู่ใน backend route หรือ Edge Function เท่านั้น',
        status: 'required',
      },
      {
        id: 'no_frontend_provider_keys',
        label: 'no frontend provider keys',
        detail: 'frontend ห้ามถือ provider key, service-role key, sponsor payload หรือ endpoint secret',
        status: 'required',
      },
      {
        id: 'request_validation',
        label: 'request validation',
        detail: 'ตรวจ calculator type, summary id, result recap, crop key, payload size และ source route ก่อน prompt',
        status: 'required',
      },
      {
        id: 'lock_hash_verification',
        label: 'lock-hash verification',
        detail: 'backend ต้องตรวจว่า locked hash ตรงกับ snapshot ก่อนส่งให้ prompt builder',
        status: 'required',
      },
      {
        id: 'policy_version_validation',
        label: 'policy version validation',
        detail: 'policy version และ prompt template version ต้องมีอยู่จริง อยู่ในสถานะอนุมัติ และตรงกับ calculator risk',
        status: 'required',
      },
      {
        id: 'timeout_handling',
        label: 'timeout handling',
        detail: 'provider timeout ต้อง fallback เป็นข้อความปลอดภัย ไม่เปลี่ยนผลคำนวณ และไม่ retry จนเกิด spam',
        status: 'planned',
      },
    ],
    requiredSafetyChecks: [
      {
        id: 'audit_log_requirement',
        label: 'audit log requirement',
        detail: 'บันทึก request id, snapshot id, lock hash, policy version, safety decision และ blocked action ids หลัง review RLS',
        status: 'required',
      },
      {
        id: 'rate_limits',
        label: 'rate limits',
        detail: 'จำกัดคำขอรายวันและคำขอซ้ำจาก summary เดิมก่อนเรียก provider',
        status: 'required',
      },
      {
        id: 'abuse_prevention',
        label: 'abuse prevention',
        detail: 'reject payload ใหญ่ผิดปกติ, spam, invalid crop profile, sponsor insertion, chemical product request',
        status: 'required',
      },
      {
        id: 'sponsor_separation',
        label: 'sponsor separation',
        detail: 'ห้าม sponsor/affiliate อยู่ใน prompt หรือผลอธิบาย เว้นแต่มี surface แยกและ label ชัดเจนในอนาคต',
        status: 'required',
      },
      {
        id: 'no_formula_mutation',
        label: 'no formula mutation',
        detail: 'AI ต้อง echo locked values เท่านั้น ห้ามคำนวณสูตรใหม่หรือแก้ตัวเลข deterministic',
        status: 'required',
      },
      {
        id: 'no_hidden_recommendation',
        label: 'no hidden recommendation injection',
        detail: 'ห้ามแทรกคำแนะนำสินค้า สารเคมี ปุ๋ยนอกสูตร หรือผลผลิต/กำไรที่รับประกัน',
        status: 'required',
      },
    ],
    blockedProductionConditions: [
      'ยังไม่มี backend endpoint หรือ Edge Function',
      'ยังไม่มี server-side policy table และ prompt template registry',
      'ยังไม่มี lock-hash verification ฝั่ง backend',
      'ยังไม่มี rate limit และ abuse prevention ฝั่ง backend',
      'ยังไม่มี audit log/RLS review สำหรับข้อมูล calculator AI',
      'ยังไม่มี provider-side safety filter integration',
      'ยังไม่มี test ที่พิสูจน์ว่า AI response ไม่เปลี่ยน deterministic result',
      'ยังไม่มี sponsor separation review สำหรับ AI explanation surface',
    ],
    requiredEnvFlags: [
      {
        key: 'VITE_CALCULATOR_AI_MODE',
        requiredValue: 'backend_test_ready',
        currentDefault: 'local_fixture',
        note: 'เปิดได้เฉพาะ staging หลังมี backend endpoint และ checklist ผ่าน',
      },
      {
        key: 'VITE_ENABLE_CALCULATOR_AI_BACKEND',
        requiredValue: 'true',
        currentDefault: 'false',
        note: 'ต้องเปิดพร้อม endpoint ที่ backend-owned เท่านั้น',
      },
      {
        key: 'VITE_ENABLE_CALCULATOR_AI_NETWORK',
        requiredValue: 'true',
        currentDefault: 'false',
        note: 'ห้ามเปิดจนกว่าจะมี rate limit, timeout, audit และ safety filter',
      },
    ],
    recommendedRolloutOrder: [
      'M58: QA fixtures and endpoint checklist only',
      'M59: calculator-ai-explain Edge Function contract draft behind disabled network',
      'M60: staging-only endpoint dry run with no provider call',
      'M61: policy table and audit-log RLS review',
      'M62: provider integration in backend-only staging with strict safety filter',
      'M63: limited farmer UX pilot after deterministic regression tests pass',
    ],
  };
}
