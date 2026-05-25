import { describe, expect, test } from 'vitest';
import { getWeatherRiskDiffPreviewSummary } from '@/services/weather/weather-risk-diff-preview';
import { getWeatherRiskReleaseAuditSummary } from '@/services/weather/weather-risk-release-audit';
import { getWeatherRiskReviewerHistorySummary } from '@/services/weather/weather-risk-review-history';

describe('M80 weather risk governance and audit readiness', () => {
  test('release audit fixtures exist', () => {
    const summary = getWeatherRiskReleaseAuditSummary();

    expect(summary.auditEventCount).toBeGreaterThan(0);
    expect(summary.events.some((event) => event.eventType === 'release_attempt_blocked')).toBe(true);
    expect(summary.events.every((event) => event.noSupabaseWrite)).toBe(true);
  });

  test('reviewer history exists', () => {
    const summary = getWeatherRiskReviewerHistorySummary();

    expect(summary.historyCount).toBeGreaterThan(0);
    expect(summary.hasReviewerAssigned).toBe(true);
    expect(summary.hasReviewerChanged).toBe(true);
    expect(summary.hasReleaseBlocked).toBe(true);
  });

  test('diff preview is generated', () => {
    const summary = getWeatherRiskDiffPreviewSummary();

    expect(summary.previewCount).toBeGreaterThan(0);
    expect(summary.includesThresholdChanges).toBe(true);
    expect(summary.includesDisclaimerChanges).toBe(true);
    expect(summary.allUnreviewed).toBe(true);
  });

  test('stale review warning appears', () => {
    const audit = getWeatherRiskReleaseAuditSummary();
    const history = getWeatherRiskReviewerHistorySummary();

    expect(audit.staleReviewWarnings.length).toBeGreaterThan(0);
    expect(history.staleReviewWarnings.length).toBeGreaterThan(0);
  });

  test('release remains blocked', () => {
    const summary = getWeatherRiskReleaseAuditSummary();

    expect(summary.releaseBlocked).toBe(true);
    expect(summary.gates.every((gate) => gate.finalPrescriptiveAllowed === false)).toBe(true);
    expect(summary.gates.every((gate) => gate.releaseApproved === false)).toBe(true);
  });

  test('automation cannot bypass human gate', () => {
    const summary = getWeatherRiskReleaseAuditSummary();

    expect(summary.automationBypassBlocked).toBe(true);
    expect(summary.cmsBypassBlocked).toBe(true);
    expect(summary.gates.every((gate) => gate.humanApprovalRequired)).toBe(true);
  });

  test('no product or sponsor recommendation is allowed', () => {
    const summary = getWeatherRiskReleaseAuditSummary();
    const gateText = JSON.stringify(
      summary.gates.map((gate) => ({
        noProductRecommendation: gate.noProductRecommendation,
        finalPrescriptiveAllowed: gate.finalPrescriptiveAllowed,
      })),
    );

    expect(summary.noProductRecommendation).toBe(true);
    expect(gateText).not.toMatch(/sponsor|affiliate/i);
  });

  test('no chemical or fertilizer dose is allowed', () => {
    const summary = getWeatherRiskReleaseAuditSummary();

    expect(summary.noChemicalDose).toBe(true);
    expect(summary.gates.every((gate) => gate.noChemicalDose)).toBe(true);
  });

  test('planning-only badge exists', () => {
    const summary = getWeatherRiskReleaseAuditSummary();
    const diff = getWeatherRiskDiffPreviewSummary();

    expect(summary.planningOnlyBadge).toBe('planning-only');
    expect(diff.allPlanningOnly).toBe(true);
  });

  test('GPS is not required', () => {
    const summary = getWeatherRiskReleaseAuditSummary();

    expect(summary.noGpsRequired).toBe(true);
    expect(summary.gates.every((gate) => gate.noGpsRequired)).toBe(true);
  });
});
