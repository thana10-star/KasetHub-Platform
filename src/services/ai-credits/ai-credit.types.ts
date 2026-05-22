export type AICreditSource = 'daily_free' | 'rewarded_ad' | 'pro' | 'manual_future';

export type AICreditUsageLog = {
  id: string;
  question: string;
  topic?: string;
  creditSource: AICreditSource;
  usedAt: string;
  answerSummary: string;
  metadata: Record<string, unknown>;
};

export type AICreditUnlockLog = {
  id: string;
  source: 'rewarded_ad_mock' | 'rewarded_ad_future' | 'pro_future' | 'admin_future';
  creditsGranted: number;
  unlockedAt: string;
  status: 'demo_granted' | 'future_pending' | 'failed_mock';
  metadata: Record<string, unknown>;
};

export type AICreditState = {
  version: number;
  dailyFreeLimit: number;
  dailyFreeUsed: number;
  rewardedCredits: number;
  proCredits: number;
  lastResetDate: string;
  usageHistory: AICreditUsageLog[];
  unlockHistory: AICreditUnlockLog[];
  updatedAt: string;
};

export type AICreditSummary = {
  dailyFreeLimit: number;
  dailyFreeUsed: number;
  dailyFreeRemaining: number;
  rewardedCredits: number;
  proCredits: number;
  totalAvailable: number;
  canAsk: boolean;
  lastResetDate: string;
};

export type ConsumeCreditResult = {
  success: boolean;
  source?: AICreditSource;
  sources?: AICreditSource[];
  creditsConsumed?: number;
  state: AICreditState;
  message: string;
};

export type AddUsageLogInput = Omit<AICreditUsageLog, 'id' | 'usedAt'> & {
  id?: string;
  usedAt?: string;
};

export type GrantRewardedCreditInput = {
  credits?: number;
  metadata?: Record<string, unknown>;
};
