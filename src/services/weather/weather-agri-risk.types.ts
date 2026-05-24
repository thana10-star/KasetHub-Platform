import type { WeatherCacheStatus } from '@/services/weather/weather-cache.types';
import type { WeatherLocationForecast } from '@/services/weather/weather.types';

export type WeatherAgriRiskCategory =
  | 'spraying_risk'
  | 'irrigation_timing'
  | 'disease_pressure'
  | 'heat_stress'
  | 'field_work_risk'
  | 'harvest_drying_risk';

export type WeatherAgriRiskLevel = 'low' | 'watch' | 'caution' | 'high';

export type WeatherAgriRiskSignal = {
  id: string;
  label: string;
  value: number | boolean | string;
  unit?: string;
  source: 'current' | 'today' | 'daily' | 'cache';
  planningOnly: true;
};

export type WeatherAgriRiskRule = {
  id: string;
  category: WeatherAgriRiskCategory;
  title: string;
  level: WeatherAgriRiskLevel;
  thresholdLabel: string;
  signalIds: string[];
  note: string;
  planningOnly: true;
  expertReviewed: false;
};

export type WeatherAgriRiskCard = {
  id: string;
  category: WeatherAgriRiskCategory;
  title: string;
  level: WeatherAgriRiskLevel;
  summary: string;
  signals: WeatherAgriRiskSignal[];
  boundaryNote: string;
  suggestedChecks: string[];
  planningOnly: true;
  noPrescription: true;
};

export type WeatherAgriRiskDisclaimer = {
  id: string;
  text: string;
  required: true;
};

export type WeatherAgriRiskBlockedAction = {
  id: string;
  label: string;
  reason: string;
  blocked: true;
};

export type WeatherAgriRiskAssessmentInput = {
  forecast: WeatherLocationForecast;
  cacheStatus?: Pick<WeatherCacheStatus, 'isStale' | 'freshness' | 'ageMinutes' | 'staleAfterMinutes'>;
  generatedAt?: string;
};

export type WeatherAgriRiskAssessment = {
  id: string;
  locationLabel: string;
  sourceLabel: string;
  generatedAt: string;
  forecastStale: boolean;
  overallLevel: WeatherAgriRiskLevel;
  cards: WeatherAgriRiskCard[];
  disclaimers: WeatherAgriRiskDisclaimer[];
  blockedActions: WeatherAgriRiskBlockedAction[];
  noGps: true;
  noPreciseLocation: true;
  noProductRecommendation: true;
  noChemicalDose: true;
  noGuaranteedOutcome: true;
  planningOnly: true;
  expertReviewed: false;
};
