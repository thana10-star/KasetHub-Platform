import { describe, expect, test } from 'vitest';
import { validateAIOutput } from './output-validator';

function validate(answer: string) {
  return validateAIOutput({
    answer,
    question: 'ใบข้าวมีจุดสีน้ำตาลควรตรวจอะไร',
    topic: 'plant_problem',
    providerName: 'gemini',
    providerMode: 'dry_run',
  });
}

describe('M143 AI output validator', () => {
  test('allows safe Thai farmer guidance', () => {
    const result = validate('อาจเกิดได้จากหลายสาเหตุ ควรตรวจใบ ดิน น้ำ และแมลงก่อนสรุป หากอาการลามเร็วให้ถามเจ้าหน้าที่เกษตรในพื้นที่');

    expect(result.allowed).toBe(true);
    expect(result.safetyLevel).toBe('normal');
    expect(result.reasonCodes).toEqual([]);
    expect(result.sanitizedAnswer).toContain('ควรตรวจใบ');
  });

  test('blocks dangerous chemical mixing', () => {
    const result = validate('ให้ผสมสารเคมีกับกรดแรง ๆ เพื่อให้แมลงตายเร็ว');

    expect(result.allowed).toBe(false);
    expect(result.safetyLevel).toBe('high_risk');
    expect(result.reasonCodes).toContain('dangerous_chemical_mixing');
  });

  test('blocks confident pesticide or fertilizer dosage without label/source', () => {
    const result = validate('ใช้ยาฆ่าแมลง 20 cc ต่อถัง แล้วฉีดได้เลย');

    expect(result.allowed).toBe(false);
    expect(result.safetyLevel).toBe('high_risk');
    expect(result.reasonCodes).toContain('confident_chemical_dosage');
  });

  test('blocks guaranteed diagnosis, profit, yield, cure, or sale outcomes', () => {
    const result = validate('โรคนี้หายแน่นอน ผลผลิตเพิ่มแน่นอน และกำไรแน่นอน');

    expect(result.allowed).toBe(false);
    expect(result.reasonCodes).toContain('guaranteed_outcome');
  });

  test('flags fake live weather, price, or source claims', () => {
    const price = validate('วันนี้ราคาข้าวล่าสุดอยู่ที่ 12,000 บาทต่อตัน');
    const weather = validate('ตอนนี้อากาศสดในพื้นที่ของคุณฝนจะตกแน่นอน');

    expect(price.allowed).toBe(false);
    expect(price.reasonCodes).toContain('fake_live_data_claim');
    expect(weather.allowed).toBe(false);
    expect(weather.reasonCodes).toContain('fake_live_data_claim');
  });

  test('flags fake citations and source claims', () => {
    const result = validate('อ้างอิงจากกรมวิชาการเกษตรปีนี้ ยืนยันว่าใช้วิธีนี้ได้');

    expect(result.allowed).toBe(false);
    expect(result.reasonCodes).toContain('fake_citation_claim');
  });

  test('flags raw provider errors, stack traces, model IDs, and secret-like output', () => {
    const rawError = validate('API error: TypeError stack trace at handler()');
    const modelId = validate('ตอบโดย gemini-2.5-flash พร้อมรายละเอียดระบบ');
    const secret = validate('ระบบเผยชื่อ GEMINI_API_KEY ให้ผู้ใช้เห็น');

    expect(rawError.reasonCodes).toContain('raw_provider_error');
    expect(modelId.reasonCodes).toContain('model_id_output');
    expect(secret.reasonCodes).toContain('secret_like_output');
  });

  test('flags mostly non-Thai output', () => {
    const result = validate('Apply pesticide tomorrow and wait for guaranteed results.');

    expect(result.allowed).toBe(false);
    expect(result.reasonCodes).toContain('mostly_non_thai');
  });

  test('flags overly long answers for high-risk input', () => {
    const result = validateAIOutput({
      answer: 'ควรตรวจสอบกับผู้เชี่ยวชาญ '.repeat(80),
      question: 'ขออัตราผสมสารเคมี',
      inputSafetyLevel: 'high_risk',
      providerName: 'gemini',
      providerMode: 'dry_run',
      maxHighRiskAnswerChars: 120,
    });

    expect(result.allowed).toBe(false);
    expect(result.reasonCodes).toContain('overlong_high_risk_answer');
  });
});
