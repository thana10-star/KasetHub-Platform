import type { AppRoute } from '@/types/kaset';

export type MyFarmHubModule =
  | 'plant_analysis'
  | 'farm_records'
  | 'farm_area'
  | 'crop_watch'
  | 'weather'
  | 'calculator'
  | 'saved_content'
  | 'ai_history'
  | 'settings';

export type MyFarmTimelineItemType =
  | 'analysis_result'
  | 'farm_record'
  | 'farm_activity'
  | 'farm_finance'
  | 'farm_harvest'
  | 'farm_plot'
  | 'crop_watch'
  | 'ai_question'
  | 'saved_article'
  | 'saved_video';

export type MyFarmQuickAction = {
  id: string;
  label: string;
  description: string;
  route: AppRoute;
  iconKey: 'scan' | 'area' | 'records' | 'weather' | 'price' | 'ai' | 'calculator';
  tone: 'primary' | 'soft' | 'white' | 'warning';
};

export type MyFarmHubSummary = {
  totalLocalItems: number;
  farmRecordCount: number;
  farmActivityRecordCount: number;
  farmFinanceEntryCount: number;
  farmActiveCropCycleCount: number;
  farmLedgerNetProfit: number;
  farmCostPerRai?: number;
  farmTopExpenseCategory?: string;
  farmTopExpenseCategoryAmount?: number;
  farmTotalHarvestKg?: number;
  farmCostPerKg?: number;
  latestFarmHarvestDate?: string;
  latestFarmActivityDate?: string;
  latestFarmFinanceEntryDate?: string;
  analysisResultCount: number;
  plotCount: number;
  cropWatchCount: number;
  enabledCropWatchCount: number;
  savedArticleCount: number;
  savedVideoCount: number;
  recentAIQuestionCount: number;
  weatherLocationLabel: string;
  weatherConditionLabel: string;
  timelineCount: number;
  localStorageLabels: string[];
};

export type MyFarmTimelineItem = {
  id: string;
  type: MyFarmTimelineItemType;
  title: string;
  subtitle: string;
  dateIso: string;
  dateLabel: string;
  ctaRoute: string;
  ctaLabel: string;
  sourceLabel: string;
};

export type MyFarmInsightCard = {
  id: string;
  module: MyFarmHubModule;
  title: string;
  detail: string;
  valueLabel: string;
  route: AppRoute;
  badgeLabel: string;
  tone: 'green' | 'gold' | 'sky' | 'rose' | 'neutral';
};

export type MyFarmLocalDataWarning = {
  id: string;
  title: string;
  detail: string;
  severity: 'info' | 'warning';
  route?: AppRoute;
};

export type MyFarmNextAction = {
  id: string;
  title: string;
  detail: string;
  route: AppRoute;
  ctaLabel: string;
  priority: 'primary' | 'secondary';
};

export type MyFarmHub = {
  summary: MyFarmHubSummary;
  quickActions: MyFarmQuickAction[];
  timeline: MyFarmTimelineItem[];
  insights: MyFarmInsightCard[];
  localWarnings: MyFarmLocalDataWarning[];
  nextActions: MyFarmNextAction[];
};
