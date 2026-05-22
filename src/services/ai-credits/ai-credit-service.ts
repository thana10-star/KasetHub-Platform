import type {
  AddUsageLogInput,
  AICreditState,
  AICreditSummary,
  AICreditUnlockLog,
  ConsumeCreditResult,
  GrantRewardedCreditInput,
} from '@/services/ai-credits/ai-credit.types';

const aiCreditStorageKey = 'kasethub.aiCredits.v1';
const aiCreditChangedEvent = 'kasethub:ai-credits-changed';
const currentVersion = 1;
const defaultDailyFreeLimit = 3;

function now() {
  return new Date().toISOString();
}

function getBangkokDateString(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    day: '2-digit',
    month: '2-digit',
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
  }).format(date);
}

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

function createId(prefix: string) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createDefaultState(): AICreditState {
  const timestamp = now();

  return {
    version: currentVersion,
    dailyFreeLimit: defaultDailyFreeLimit,
    dailyFreeUsed: 0,
    rewardedCredits: 0,
    proCredits: 0,
    lastResetDate: getBangkokDateString(),
    usageHistory: [],
    unlockHistory: [],
    updatedAt: timestamp,
  };
}

function safeParseJson<T>(rawValue: string | null): T | undefined {
  if (!rawValue) {
    return undefined;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return undefined;
  }
}

export function migrateAICreditState(input: unknown): AICreditState {
  const fallback = createDefaultState();

  if (!input || typeof input !== 'object') {
    return fallback;
  }

  const partial = input as Partial<AICreditState>;

  return {
    version: currentVersion,
    dailyFreeLimit: Number.isFinite(partial.dailyFreeLimit) ? Number(partial.dailyFreeLimit) : fallback.dailyFreeLimit,
    dailyFreeUsed: Number.isFinite(partial.dailyFreeUsed) ? Number(partial.dailyFreeUsed) : 0,
    rewardedCredits: Number.isFinite(partial.rewardedCredits) ? Number(partial.rewardedCredits) : 0,
    proCredits: Number.isFinite(partial.proCredits) ? Number(partial.proCredits) : 0,
    lastResetDate: partial.lastResetDate || fallback.lastResetDate,
    usageHistory: Array.isArray(partial.usageHistory) ? partial.usageHistory : [],
    unlockHistory: Array.isArray(partial.unlockHistory) ? partial.unlockHistory : [],
    updatedAt: partial.updatedAt || fallback.updatedAt,
  };
}

function notifyCreditsChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(aiCreditChangedEvent));
  }
}

function persistState(state: AICreditState) {
  const nextState = {
    ...state,
    updatedAt: now(),
  };

  if (!canUseStorage()) {
    return nextState;
  }

  try {
    window.localStorage.setItem(aiCreditStorageKey, JSON.stringify(nextState));
    notifyCreditsChanged();
    return nextState;
  } catch {
    return state;
  }
}

function getStoredState() {
  if (!canUseStorage()) {
    return createDefaultState();
  }

  return migrateAICreditState(safeParseJson<AICreditState>(window.localStorage.getItem(aiCreditStorageKey)));
}

export function resetDailyIfNeeded(state: AICreditState = getStoredState()) {
  const today = getBangkokDateString();

  if (state.lastResetDate === today) {
    return state;
  }

  return persistState({
    ...state,
    dailyFreeUsed: 0,
    lastResetDate: today,
  });
}

export function getState() {
  return resetDailyIfNeeded(getStoredState());
}

export function getCreditSummary(state: AICreditState = getState()): AICreditSummary {
  const normalizedState = resetDailyIfNeeded(state);
  const dailyFreeRemaining = Math.max(normalizedState.dailyFreeLimit - normalizedState.dailyFreeUsed, 0);
  const totalAvailable = dailyFreeRemaining + normalizedState.rewardedCredits + normalizedState.proCredits;

  return {
    dailyFreeLimit: normalizedState.dailyFreeLimit,
    dailyFreeUsed: normalizedState.dailyFreeUsed,
    dailyFreeRemaining,
    rewardedCredits: normalizedState.rewardedCredits,
    proCredits: normalizedState.proCredits,
    totalAvailable,
    canAsk: totalAvailable > 0,
    lastResetDate: normalizedState.lastResetDate,
  };
}

export function canAskAI() {
  return getCreditSummary().canAsk;
}

export function consumeCredits(amount = 1): ConsumeCreditResult {
  const creditsToConsume = Math.max(Math.floor(amount), 1);
  const state = getState();
  const summary = getCreditSummary(state);

  if (summary.totalAvailable < creditsToConsume) {
    return {
      success: false,
      state,
      creditsConsumed: 0,
      message: `เครดิตถาม AI ไม่พอ ต้องใช้ ${creditsToConsume} เครดิต`,
    };
  }

  const sources: NonNullable<ConsumeCreditResult['source']>[] = [];
  let latestState = state;

  for (let index = 0; index < creditsToConsume; index += 1) {
    const result = consumeCredit();

    latestState = result.state;

    if (!result.success || !result.source) {
      return {
        success: false,
        state: latestState,
        sources,
        creditsConsumed: sources.length,
        message: 'เครดิตถาม AI ไม่พอสำหรับคำขอนี้',
      };
    }

    sources.push(result.source);
  }

  return {
    success: true,
    source: sources[0],
    sources,
    creditsConsumed: creditsToConsume,
    state: latestState,
    message: `ใช้เครดิต AI ${creditsToConsume} เครดิตแล้ว`,
  };
}

export function consumeCredit(): ConsumeCreditResult {
  const state = getState();
  const summary = getCreditSummary(state);

  if (!summary.canAsk) {
    return {
      success: false,
      state,
      message: 'เครดิตถาม AI หมดแล้ว',
    };
  }

  if (summary.dailyFreeRemaining > 0) {
    const nextState = persistState({
      ...state,
      dailyFreeUsed: state.dailyFreeUsed + 1,
    });

    return {
      success: true,
      source: 'daily_free',
      state: nextState,
      message: 'ใช้คำถามฟรีวันนี้ 1 ครั้ง',
    };
  }

  if (state.rewardedCredits > 0) {
    const nextState = persistState({
      ...state,
      rewardedCredits: state.rewardedCredits - 1,
    });

    return {
      success: true,
      source: 'rewarded_ad',
      state: nextState,
      message: 'ใช้เครดิตจากโฆษณาจำลอง 1 ครั้ง',
    };
  }

  const nextState = persistState({
    ...state,
    proCredits: Math.max(state.proCredits - 1, 0),
  });

  return {
    success: true,
    source: 'pro',
    state: nextState,
    message: 'ใช้เครดิต Pro 1 ครั้ง',
  };
}

export function grantRewardedCredit(input: GrantRewardedCreditInput = {}) {
  const state = getState();
  const creditsGranted = input.credits ?? 1;
  const unlockLog: AICreditUnlockLog = {
    id: createId('ai-unlock'),
    source: 'rewarded_ad_mock',
    creditsGranted,
    unlockedAt: now(),
    status: 'demo_granted',
    metadata: {
      demoOnly: true,
      ...(input.metadata ?? {}),
    },
  };

  return persistState({
    ...state,
    rewardedCredits: state.rewardedCredits + creditsGranted,
    unlockHistory: [unlockLog, ...state.unlockHistory].slice(0, 30),
  });
}

export function addUsageLog(input: AddUsageLogInput) {
  const state = getState();
  const usageLog = {
    ...input,
    id: input.id || createId('ai-usage'),
    usedAt: input.usedAt || now(),
  };

  return persistState({
    ...state,
    usageHistory: [usageLog, ...state.usageHistory].slice(0, 50),
  });
}

export function subscribeAICredits(listener: () => void) {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const storageListener = (event: StorageEvent) => {
    if (event.key === aiCreditStorageKey) {
      listener();
    }
  };

  window.addEventListener(aiCreditChangedEvent, listener);
  window.addEventListener('storage', storageListener);

  return () => {
    window.removeEventListener(aiCreditChangedEvent, listener);
    window.removeEventListener('storage', storageListener);
  };
}
