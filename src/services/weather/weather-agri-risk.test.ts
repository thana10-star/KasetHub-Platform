import { describe, expect, test } from 'vitest';
import { getWeatherAdapterResult } from '@/services/weather/weather-adapter';
import {
  getWeatherAgriRiskRuleSummary,
  assessWeatherAgriRisk,
  weatherAgriRiskRules,
} from '@/services/weather/weather-agri-risk-rules';
import { weatherAgriRiskBlockedActions } from '@/services/weather/weather-agri-risk-boundary';
import type { WeatherAgriRiskAssessment, WeatherAgriRiskCategory, WeatherAgriRiskLevel } from '@/services/weather/weather-agri-risk.types';
import type { WeatherForecastDay, WeatherLocationForecast } from '@/services/weather/weather.types';

const riskRank: Record<WeatherAgriRiskLevel, number> = {
  low: 0,
  watch: 1,
  caution: 2,
  high: 3,
};

function buildForecast(
  todayOverrides: Partial<WeatherForecastDay> = {},
  dailyOverrides: Partial<WeatherForecastDay>[] = [],
): WeatherLocationForecast {
  const base = getWeatherAdapterResult('bangkok').forecast;
  const safeDay = {
    rainChancePercent: 10,
    precipitationMm: 0,
    humidityPercent: 60,
    windKph: 6,
    maxTempC: 30,
  };

  return {
    ...base,
    today: {
      ...base.today,
      ...safeDay,
      ...todayOverrides,
    },
    current: {
      ...(base.current ?? {
        temperatureC: base.today.maxTempC,
        humidityPercent: base.today.humidityPercent,
        precipitationMm: base.today.precipitationMm ?? 0,
        windKph: base.today.windKph,
        conditionLabel: base.today.conditionLabel,
        observedAtLabel: base.updatedAtLabel,
      }),
      temperatureC: todayOverrides.maxTempC ?? safeDay.maxTempC,
      humidityPercent: todayOverrides.humidityPercent ?? safeDay.humidityPercent,
      precipitationMm: todayOverrides.precipitationMm ?? safeDay.precipitationMm,
      windKph: todayOverrides.windKph ?? safeDay.windKph,
    },
    daily: base.daily.map((day, index) => ({
      ...day,
      ...safeDay,
      ...(index === 0 ? todayOverrides : {}),
      ...(dailyOverrides[index] ?? {}),
    })),
  };
}

function card(assessment: WeatherAgriRiskAssessment, category: WeatherAgriRiskCategory) {
  const found = assessment.cards.find((riskCard) => riskCard.category === category);
  expect(found).toBeDefined();
  return found!;
}

describe('M78 agriculture weather risk readiness', () => {
  test('risk assessment returns general cards', () => {
    const assessment = assessWeatherAgriRisk({ forecast: buildForecast(), generatedAt: '2026-05-24T09:00:00.000Z' });

    expect(assessment.cards).toHaveLength(6);
    expect(assessment.cards.every((riskCard) => riskCard.planningOnly)).toBe(true);
    expect(assessment.cards.every((riskCard) => riskCard.noPrescription)).toBe(true);
    expect(assessment.planningOnly).toBe(true);
    expect(assessment.expertReviewed).toBe(false);
  });

  test('stale forecast increases caution', () => {
    const fresh = assessWeatherAgriRisk({ forecast: buildForecast() });
    const stale = assessWeatherAgriRisk({
      forecast: buildForecast(),
      cacheStatus: { freshness: 'stale', isStale: true, ageMinutes: 90, staleAfterMinutes: 45 },
    });

    expect(card(fresh, 'spraying_risk').level).toBe('low');
    expect(riskRank[card(stale, 'spraying_risk').level]).toBeGreaterThanOrEqual(riskRank.caution);
    expect(stale.forecastStale).toBe(true);
  });

  test('high wind creates spraying caution', () => {
    const assessment = assessWeatherAgriRisk({ forecast: buildForecast({ windKph: 28, rainChancePercent: 10 }) });

    expect(card(assessment, 'spraying_risk').level).toBe('high');
    expect(card(assessment, 'spraying_risk').signals.map((signal) => signal.id)).toContain('windKph');
  });

  test('rain forecast creates spraying and field-work caution', () => {
    const assessment = assessWeatherAgriRisk({ forecast: buildForecast({ rainChancePercent: 75, precipitationMm: 12 }) });

    expect(card(assessment, 'spraying_risk').level).toBe('high');
    expect(card(assessment, 'field_work_risk').level).toBe('high');
  });

  test('humidity creates disease-pressure watch', () => {
    const assessment = assessWeatherAgriRisk({ forecast: buildForecast({ humidityPercent: 84 }) });

    expect(riskRank[card(assessment, 'disease_pressure').level]).toBeGreaterThanOrEqual(riskRank.watch);
  });

  test('no product recommendation is generated', () => {
    const assessment = assessWeatherAgriRisk({ forecast: buildForecast({ windKph: 28 }) });
    const cardText = JSON.stringify(assessment.cards);

    expect(assessment.noProductRecommendation).toBe(true);
    expect(cardText).not.toMatch(/sponsor|affiliate|product/i);
    expect(assessment.cards.every((riskCard) => riskCard.noPrescription)).toBe(true);
  });

  test('no chemical dose is generated', () => {
    const assessment = assessWeatherAgriRisk({ forecast: buildForecast({ rainChancePercent: 75, precipitationMm: 12 }) });
    const cardText = JSON.stringify(assessment.cards);

    expect(assessment.noChemicalDose).toBe(true);
    expect(cardText).not.toMatch(/cc|ml|dose|rate|ซีซี|มล\.|อัตราสาร|กิโลกรัมต่อไร่/i);
  });

  test('blocked actions include product, label override, and guarantee', () => {
    const blockedIds = weatherAgriRiskBlockedActions.map((action) => action.id);

    expect(blockedIds).toContain('product-recommendation');
    expect(blockedIds).toContain('label-override');
    expect(blockedIds).toContain('guaranteed-outcome');
    expect(weatherAgriRiskBlockedActions.every((action) => action.blocked)).toBe(true);
  });

  test('risk rules are marked planning-only', () => {
    const summary = getWeatherAgriRiskRuleSummary();

    expect(summary.categories).toHaveLength(6);
    expect(weatherAgriRiskRules.every((rule) => rule.planningOnly)).toBe(true);
    expect(weatherAgriRiskRules.every((rule) => rule.expertReviewed === false)).toBe(true);
    expect(weatherAgriRiskRules.every((rule) => rule.thresholdLabel.includes('เบื้องต้น'))).toBe(true);
  });

  test('no GPS or geolocation is required', () => {
    const assessment = assessWeatherAgriRisk({ forecast: buildForecast() });

    expect(assessment.noGps).toBe(true);
    expect(assessment.noPreciseLocation).toBe(true);
  });
});
