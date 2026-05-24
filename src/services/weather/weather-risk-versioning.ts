import type { WeatherAgriRiskCategory } from '@/services/weather/weather-agri-risk.types';
import type { WeatherRiskRuleVersion } from '@/services/weather/weather-risk-expert-review.types';
import { weatherRiskRuleVersionFixtures } from '@/services/weather/weather-risk-review-fixtures';

export function getWeatherRiskRuleVersions(): WeatherRiskRuleVersion[] {
  return weatherRiskRuleVersionFixtures;
}

export function getWeatherRiskRuleVersionByCategory(category: WeatherAgriRiskCategory): WeatherRiskRuleVersion | undefined {
  return weatherRiskRuleVersionFixtures.find((version) => version.category === category);
}

export function getWeatherRiskRuleVersioningSummary() {
  return {
    versions: weatherRiskRuleVersionFixtures,
    categories: weatherRiskRuleVersionFixtures.map((version) => version.category),
    allPlanningOnly: weatherRiskRuleVersionFixtures.every((version) => version.status === 'planning_only'),
    allPrescriptiveBlocked: weatherRiskRuleVersionFixtures.every((version) => version.prescriptiveAllowed === false),
    allRuleVersionsUnlocked: weatherRiskRuleVersionFixtures.every((version) => version.ruleLocked === false),
  };
}
