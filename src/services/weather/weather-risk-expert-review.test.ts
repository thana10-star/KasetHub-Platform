import { describe, expect, test } from 'vitest';
import { weatherAgriRiskCategoryLabels } from '@/services/weather/weather-agri-risk-boundary';
import { weatherAgriRiskRules } from '@/services/weather/weather-agri-risk-rules';
import { buildWeatherRiskExpertApprovalGate, getWeatherRiskExpertReviewSummary } from '@/services/weather/weather-risk-expert-review';
import { weatherRiskRequiredReviewerRoles, weatherRiskRuleVersionFixtures } from '@/services/weather/weather-risk-review-fixtures';
import { getWeatherRiskRuleVersioningSummary } from '@/services/weather/weather-risk-versioning';

describe('M79 weather risk expert-review readiness', () => {
  test('every risk category has rule version metadata', () => {
    const expectedCategories = Object.keys(weatherAgriRiskCategoryLabels).sort();
    const versionCategories = weatherRiskRuleVersionFixtures.map((version) => version.category).sort();

    expect(versionCategories).toEqual(expectedCategories);
    expect(weatherRiskRuleVersionFixtures).toHaveLength(weatherAgriRiskRules.length);
  });

  test('all reviewer signoffs are pending', () => {
    const signoffs = weatherRiskRuleVersionFixtures.flatMap((version) => version.reviewerSignoffs);

    expect(signoffs).toHaveLength(weatherRiskRuleVersionFixtures.length * weatherRiskRequiredReviewerRoles.length);
    expect(signoffs.every((signoff) => signoff.status === 'pending')).toBe(true);
  });

  test('prescriptiveAllowed is false', () => {
    const summary = getWeatherRiskExpertReviewSummary();

    expect(summary.allPrescriptiveBlocked).toBe(true);
    expect(weatherRiskRuleVersionFixtures.every((version) => version.prescriptiveAllowed === false)).toBe(true);
  });

  test('source placeholders are required', () => {
    const sources = weatherRiskRuleVersionFixtures.flatMap((version) => version.sourceMetadata);

    expect(sources.length).toBeGreaterThan(0);
    expect(sources.every((source) => source.required)).toBe(true);
    expect(sources.every((source) => source.filled === false)).toBe(true);
  });

  test('false positive examples exist', () => {
    expect(weatherRiskRuleVersionFixtures.every((version) => version.falsePositiveExamples.length > 0)).toBe(true);
    expect(weatherRiskRuleVersionFixtures.every((version) => version.falsePositiveExamples.every((example) => example.reviewed === false))).toBe(true);
  });

  test('false negative examples exist', () => {
    expect(weatherRiskRuleVersionFixtures.every((version) => version.falseNegativeExamples.length > 0)).toBe(true);
    expect(weatherRiskRuleVersionFixtures.every((version) => version.falseNegativeExamples.every((example) => example.reviewed === false))).toBe(true);
  });

  test('safety reviewer is required', () => {
    const version = weatherRiskRuleVersionFixtures[0];
    const gate = buildWeatherRiskExpertApprovalGate(version);

    expect(version.reviewerSignoffs.some((signoff) => signoff.role === 'safety_reviewer' && signoff.required)).toBe(true);
    expect(gate.safetyReviewerApproved).toBe(false);
    expect(gate.blockers.map((blocker) => blocker.id)).toContain('safety-reviewer-required');
  });

  test('planning-only rules can show caution but not prescriptions', () => {
    const gates = weatherRiskRuleVersionFixtures.map((version) => buildWeatherRiskExpertApprovalGate(version));

    expect(gates.every((gate) => gate.canShowGeneralCaution)).toBe(true);
    expect(gates.every((gate) => gate.prescriptiveAllowed === false)).toBe(true);
  });

  test('no product or sponsor recommendation is allowed', () => {
    const summary = getWeatherRiskExpertReviewSummary();
    const versionText = JSON.stringify(weatherRiskRuleVersionFixtures.map((version) => ({
      ruleId: version.ruleId,
      prescriptiveAllowed: version.prescriptiveAllowed,
      noProductRecommendation: version.noProductRecommendation,
    })));

    expect(summary.noProductRecommendation).toBe(true);
    expect(versionText).not.toMatch(/sponsor|affiliate/i);
  });

  test('no chemical or fertilizer dose is allowed', () => {
    const summary = getWeatherRiskExpertReviewSummary();
    const blockerText = JSON.stringify(summary.gates.flatMap((gate) => gate.blockers));

    expect(summary.noChemicalDose).toBe(true);
    expect(blockerText).not.toMatch(/ซีซี|มล\.|กิโลกรัมต่อไร่|fertilizer dose/i);
  });

  test('GPS is not required', () => {
    const summary = getWeatherRiskRuleVersioningSummary();
    const reviewSummary = getWeatherRiskExpertReviewSummary();

    expect(summary.allPlanningOnly).toBe(true);
    expect(reviewSummary.noGpsRequired).toBe(true);
    expect(weatherRiskRuleVersionFixtures.every((version) => version.noGpsRequired)).toBe(true);
  });
});
