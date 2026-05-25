import { getWeatherAdapterResult } from '@/services/weather/weather-adapter';
import { assessWeatherAgriRisk } from '@/services/weather/weather-agri-risk-rules';
import type { WeatherAgriRiskAssessment } from '@/services/weather/weather-agri-risk.types';
import type { WeatherLocationForecast } from '@/services/weather/weather.types';

function cloneForecast(overrides: Partial<WeatherLocationForecast['today']> = {}): WeatherLocationForecast {
  const base = getWeatherAdapterResult('bangkok').forecast;

  return {
    ...base,
    today: {
      ...base.today,
      ...overrides,
    },
    current: {
      ...(base.current ?? {
        temperatureC: base.today.maxTempC,
        windKph: base.today.windKph,
        conditionLabel: base.today.conditionLabel,
        observedAtLabel: base.updatedAtLabel,
      }),
      temperatureC: overrides.maxTempC ?? base.current?.temperatureC ?? base.today.maxTempC,
      windKph: overrides.windKph ?? base.current?.windKph ?? base.today.windKph,
      humidityPercent: overrides.humidityPercent ?? base.current?.humidityPercent ?? base.today.humidityPercent,
      precipitationMm: overrides.precipitationMm ?? base.current?.precipitationMm ?? base.today.precipitationMm ?? 0,
    },
  };
}

export const weatherAgriRiskFixtureAssessments: WeatherAgriRiskAssessment[] = [
  assessWeatherAgriRisk({
    forecast: cloneForecast({ windKph: 28, rainChancePercent: 35, precipitationMm: 1 }),
    generatedAt: '2026-05-24T09:00:00.000Z',
  }),
  assessWeatherAgriRisk({
    forecast: cloneForecast({ humidityPercent: 86, rainChancePercent: 55, precipitationMm: 3 }),
    generatedAt: '2026-05-24T09:00:00.000Z',
  }),
  assessWeatherAgriRisk({
    forecast: cloneForecast({ maxTempC: 37, rainChancePercent: 15, precipitationMm: 0 }),
    generatedAt: '2026-05-24T09:00:00.000Z',
  }),
];

export function getWeatherAgriRiskFixtureSummary() {
  return {
    assessments: weatherAgriRiskFixtureAssessments,
    exampleCount: weatherAgriRiskFixtureAssessments.length,
    allPlanningOnly: weatherAgriRiskFixtureAssessments.every((assessment) => assessment.planningOnly),
    noProductRecommendations: weatherAgriRiskFixtureAssessments.every((assessment) => assessment.noProductRecommendation),
    noGpsRequired: weatherAgriRiskFixtureAssessments.every((assessment) => assessment.noGps),
  };
}
