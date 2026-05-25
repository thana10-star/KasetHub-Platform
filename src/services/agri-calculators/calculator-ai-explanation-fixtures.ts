import {
  calculateFertilizerMix,
  calculateSprayMix,
} from '@/services/agri-calculators/agri-calculator-service';
import { buildCalculatorResultSummary } from '@/services/agri-calculators/calculator-result-summary-service';
import type { CalculatorAIExplanationRequest } from '@/services/agri-calculators/calculator-ai-explanation.types';

export function createSprayMixAIExplanationFixture(): CalculatorAIExplanationRequest {
  const input = {
    tankLiters: 20,
    tankSizeOption: 20 as const,
    dosageAmount: 20,
    dosageUnit: 'cc' as const,
    dosageWaterLiters: 20,
  };
  const result = calculateSprayMix(input);
  const summary = buildCalculatorResultSummary('spray_mix', input, result, {
    createdAt: '2026-05-24T08:00:00.000Z',
    id: 'ai-explanation-spray-preview',
  });

  return {
    calculatorType: 'spray_mix',
    summary,
    warnings: result.warnings,
    safetyDisclaimers: result.safetyNotes,
    requestedActions: ['explain_inputs', 'explain_formulas', 'explain_result_meaning'],
    userQuestion: 'ช่วยอธิบายว่าทำไมถัง 20 ลิตรต้องใช้ 20 ซีซี',
  };
}

export function createFertilizerAIExplanationFixture(): CalculatorAIExplanationRequest {
  const input = {
    areaValue: 1,
    areaUnit: 'rai' as const,
    targetNitrogenKgPerRai: 4,
    targetPhosphorusKgPerRai: 0,
    targetPotassiumKgPerRai: 0,
    fertilizerNPercent: 46,
    fertilizerPPercent: 0,
    fertilizerKPercent: 0,
    baseNutrient: 'nitrogen' as const,
  };
  const result = calculateFertilizerMix(input);
  const summary = buildCalculatorResultSummary('fertilizer_mix', input, result, {
    createdAt: '2026-05-24T08:00:00.000Z',
    id: 'ai-explanation-fertilizer-preview',
  });

  return {
    calculatorType: 'fertilizer_mix',
    summary,
    cropLabel: 'ข้าว (ตัวอย่าง)',
    warnings: result.warnings,
    safetyDisclaimers: [result.disclaimer],
    requestedActions: [
      'explain_inputs',
      'explain_formulas',
      'recommend_exact_fertilizer_dose_not_in_calculator',
      'mention_sponsor_product',
    ],
    userQuestion: 'ช่วยอธิบายผลปุ๋ย และห้ามแนะนำสูตรเพิ่มนอกตัวเลขนี้',
  };
}

